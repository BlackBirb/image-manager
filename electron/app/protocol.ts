import url from 'node:url'

import { protocol, net } from 'electron'

import { resolveImageFile } from './imageService'

export const createProtocolHandlers = () => {
  protocol.handle('dragon', async (request) => {
    const reqUrl = new URL(request.url)
    const thumbnail = reqUrl.pathname === '/thumbnail'
    const [imageHash, ext] = reqUrl.hostname.split('.')

    try {
      const fileUrl = url.pathToFileURL(resolveImageFile(imageHash, ext, thumbnail)).href
      return await net.fetch(fileUrl)
    } catch (err: unknown) {
      const errBody = new Blob([(err as Error).message])
      return new Response(errBody, {
        status: 404,
        headers: {
          cacheControl: 'max-age=0',
          contentLength: errBody.size.toString(),
          contentType: 'text/plain',
        },
      })
    }
  })
}
