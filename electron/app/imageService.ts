import { createHash } from 'node:crypto'
import { stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { nativeImage } from 'electron'

import { ensureDirectory, getMimeExtension, getRandomString } from './utils'

export const fetchURLMime = async (url: string) => {
  const response = await fetch(url, { method: 'HEAD' })
  return response.headers.get('content-type')
}

type PrefetchedImage = {
  data: ArrayBuffer
  mime: string
  url: string | null
}

export type ImageSize = 'thumb' | 'full'

export type TmpImgHandle = string

export type SavedImageInfo = {
  hash: string
  ext: string
}

const tmpImages = new Map<string, Promise<PrefetchedImage>>()

// After all, why shouldn't I make a global string
let outputPath: string | null = null

export const setOutputPath = async (newPath: string) => {
  if (!path.isAbsolute(newPath)) throw 'Output path must be absolute'
  try {
    const stats = await stat(newPath)
    if (!stats.isDirectory()) throw `Output path must be a directory`

    outputPath = newPath
  } catch {
    throw 'Output path does not exists'
  }
}
const getOutputPath = () => {
  if (outputPath === null) throw 'Output path is not set.'
  return outputPath
}

export const prefetchImage = async (url: string): Promise<TmpImgHandle> => {
  const response = await fetch(url)
  const mime = response.headers.get('content-type')
  if (!mime || !mime.startsWith('image/')) {
    // TODO: (maybe) better error handling
    throw 'Failed to fetch: Invalid mime type'
  }

  const handle: TmpImgHandle = getRandomString()

  tmpImages.set(
    handle,
    response.arrayBuffer().then((data) => ({ url, mime, data }) as PrefetchedImage),
  )

  return handle
}

export const cacheImage = (file: ArrayBuffer, mimeType: string): TmpImgHandle => {
  if (!mimeType.startsWith('image/')) {
    throw 'Failed to fetch: Invalid mime type'
  }

  const handle: TmpImgHandle = getRandomString()

  tmpImages.set(
    handle,
    new Promise((resolve) =>
      resolve({
        data: file,
        mime: mimeType,
        url: null,
      } as PrefetchedImage),
    ),
  )

  return handle
}

export const savePrefetchedImage = async (handle: TmpImgHandle): Promise<SavedImageInfo> => {
  if (!tmpImages.has(handle)) throw 'Image not prefetched'

  const prefetchedImage = await tmpImages.get(handle)
  if (!prefetchedImage) throw 'This never happens but TS is silly'

  const { data, mime } = prefetchedImage
  const dir = getOutputPath()

  const hash = getImageHash(data)
  const dirPath = getImageDir(dir, hash)

  await ensureDirectory(dirPath)

  const imgBuffer = Buffer.from(data)
  writeFile(getImagePath(dir, hash, mime, false), imgBuffer)

  const thumbnailBuffer = await generateThumbnail(imgBuffer)
  writeFile(getImagePath(dir, hash, 'image/png', true), thumbnailBuffer)

  return { hash, ext: getMimeExtension(mime) }
}

export const discardPrefetchedImage = (handle: TmpImgHandle) => {
  if (!tmpImages.has(handle)) throw 'Image not prefetched'

  // should drop it from memory? There's no other references.
  tmpImages.delete(handle)
}

export const getImageHash = (data: ArrayBuffer): string => {
  const hash = createHash('md5')

  hash.update(Buffer.from(data))

  return hash.digest('hex')
}

export const getImageDir = (dir: string, imageHash: string) => path.join(dir, imageHash.slice(0, 2), imageHash.slice(2))

export const getImagePath = (dir: string, imageHash: string, mime: string, thumbnail?: boolean) => {
  return path.join(
    getImageDir(dir, imageHash),
    `${imageHash}${thumbnail ? '_thumbnail' : ''}.${getMimeExtension(mime)}`,
  )
}

export const getFullImagePath = (imageInfo: SavedImageInfo, isThumbnail?: boolean) => {
  if (!outputPath) {
    throw 'Output path does not exists'!
  }
  const fullImagePath = path.join(
    getImageDir(outputPath, imageInfo.hash),
    `${imageInfo.hash}${isThumbnail ? '_thumbnail' : ''}.${imageInfo.ext}`,
  )
  return fullImagePath
}

const generateThumbnail = (data: Buffer) =>
  nativeImage
    .createFromBuffer(data)
    .resize({
      // TODO: What size of thumbnail?
      width: 480,
    })
    .toPNG()
