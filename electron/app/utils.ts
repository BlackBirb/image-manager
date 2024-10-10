/* eslint-disable @typescript-eslint/no-explicit-any */
import { mkdir, stat } from 'fs/promises'
import * as mimedb from 'mime-db'
import crypto from 'node:crypto'

export const debouncePromise = (fn: () => Promise<any>) => {
  let runningPromise = Promise.resolve()
  let cancelPrev = () => {}
  return () => {
    cancelPrev()
    let currRunning = true
    runningPromise.then(() => {
      if (!currRunning) return
      runningPromise = fn()
    })
    cancelPrev = () => (currRunning = true)
  }
}

export const debounce = (fn: () => any, delay = 200) => {
  let timeoutId: NodeJS.Timeout | undefined
  const debounced = (...args: unknown[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args as []), delay)
  }
  debounced.cancel = () => clearTimeout(timeoutId)
  return debounced
}

export const getMimeExtension = (mimeType: string) =>
  mimedb[mimeType].extensions ? mimedb[mimeType].extensions[0] : 'png' // have fun whatever reads this xd

export const ensureDirectory = async (path: string) => {
  try {
    const stats = await stat(path)
    if (!stats.isDirectory()) throw `Somehow the hash directory is a file for: ${path}`
  } catch (err: any) {
    if (err.code && err.code === 'ENOENT') {
      await mkdir(path, {
        recursive: true,
      })
    } else {
      throw err
    }
  }
}

export const getRandomString = () => crypto.randomBytes(32).toString('base64url')
