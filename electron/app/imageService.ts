import path from 'node:path'
import { stat, mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { getMimeExtension } from './utils'

export const fetchURLMime = async (url: string) => {
  const response = await fetch(url, { method: 'HEAD' })
  return response.headers.get('content-type')
}

export const fetchImage = async (url: string) => {
  const response = await fetch(url)
  const mime = response.headers.get('content-type')
  if (!mime || !mime.startsWith('image/')) {
    // TODO: (maybe) better error handling
    throw 'Failed to fetch: Invalid mime type'
  }

  const data = await response.arrayBuffer()

  // TODO: Needs dir
  return saveImage(data, mime, process.env.APP_ROOT)
}

// dir can be later changed to some global "current setting"?
// Should we check if file exists first? or does frontend with DB deal with that
// tho how if it's called from fetchImage...
// But if hash is the same we can overwrite it without worries, it's identical image right?
export const saveImage = async (data: ArrayBuffer, mime: string, dir: string) => {
  const hash = getImageHash(data)
  const imagePath = getIamgePath(hash, mime, dir)

  // ensure directory is there
  const dirPath = imagePath
    .split(/[\\\/]/)
    .slice(0, -1)
    .join('/')

  try {
    const stats = await stat(dirPath)
    if (!stats.isDirectory()) throw `Somehow the hash directory is a file for: ${imagePath}`
  } catch (err: any) {
    if (err.code && err.code === 'ENOENT') {
      await mkdir(dirPath, {
        recursive: true,
      })
    } else {
      throw err
    }
  }

  writeFile(imagePath, Buffer.from(data))

  return hash
}

export const getImageHash = (data: ArrayBuffer): string => {
  const hash = createHash('md5')

  hash.update(Buffer.from(data))

  return hash.digest('hex')
}

export const getIamgePath = (imageHash: string, mime: string, dir: string) =>
  path.join(dir, imageHash.slice(0, 2), imageHash.slice(2) + '.' + getMimeExtension(mime))
