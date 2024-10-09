import path from 'node:path'
import { writeFile } from 'node:fs/promises'
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

  return saveImage(data, mime, process.env.APP_ROOT)
}

// dir can be later changed to some global "current setting"?
export const saveImage = async (data: ArrayBuffer, mime: string, dir: string) => {
  const hash = getImageHash(data)
  writeFile(getIamgePath(hash, mime, dir), Buffer.from(data))
}

export const getImageHash = (data: ArrayBuffer): string => {
  const hash = createHash('md5')

  hash.update(Buffer.from(data))

  return hash.digest('hex')
}

export const getIamgePath = (imageHash: string, mime: string, dir: string) =>
  path.join(dir, imageHash.slice(0, 2) + imageHash.slice(2) + '.' + getMimeExtension(mime))
