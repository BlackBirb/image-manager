import path from 'node:path'
import { writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { ensureDirectory, getMimeExtension } from './utils'

export const fetchURLMime = async (url: string) => {
  const response = await fetch(url, { method: 'HEAD' })
  return response.headers.get('content-type')
}

type PrefetchedImage = {
  data: ArrayBuffer
  mime: string
  url: string
}

export type ImageSize = 'thumb' | 'full'

export type TmpImgHandle = string

export type SavedImageInfo = {
  hash: string
  ext: string
}

const tmpImages = new Map<string, Promise<PrefetchedImage>>()

export const prefetchImage = async (url: string): Promise<TmpImgHandle> => {
  const response = await fetch(url)
  const mime = response.headers.get('content-type')
  if (!mime || !mime.startsWith('image/')) {
    // TODO: (maybe) better error handling
    throw 'Failed to fetch: Invalid mime type'
  }

  tmpImages.set(
    'randomHash',
    response.arrayBuffer().then((data) => ({ url, mime, data }) as PrefetchedImage),
  )

  return 'randomHash'
}

// dir can be later changed to some global "current setting"?
export const savePrefetchedImage = async (handle: TmpImgHandle, dir: string): Promise<SavedImageInfo> => {
  if (!tmpImages.has(handle)) throw 'Image not prefetched'

  const prefetchedImage = await tmpImages.get(handle)
  if (!prefetchedImage) throw 'This never happens but TS is silly'

  const { data, mime } = prefetchedImage

  const hash = getImageHash(data)
  const dirPath = getImageDir(dir, hash)
  const imagePath = getIamgePath(dir, hash, mime, 'full')

  await ensureDirectory(dirPath)

  writeFile(imagePath, Buffer.from(data))

  // TODO: create a thumbnail

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

export const getIamgePath = (dir: string, imageHash: string, mime: string, size: ImageSize) =>
  path.join(getImageDir(dir, imageHash), size + '.' + getMimeExtension(mime))
