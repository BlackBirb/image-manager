import path from 'node:path'
import { writeFile, readFile } from 'node:fs/promises'
import { debounce, debouncePromise } from './utils'

type DepImpl<T> = (target: T, prop: string | symbol, val: T[] | null) => void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PersistentStore = Dict<any>

interface Dict<T> {
  [key: string]: T | undefined
}

const watchObj = (obj: PersistentStore, dep: DepImpl<PersistentStore>): ProxyHandler<PersistentStore> => {
  for (const key in obj) {
    if (typeof obj[key] === 'object') obj[key] = watchObj(obj[key], dep)
  }
  return new Proxy(obj, {
    set(target, prop, val, receiver) {
      if (typeof val === 'object') val = watchObj(val, dep)
      dep(target, prop, val)
      return Reflect.set(target, prop, val, receiver)
    },
    deleteProperty(target, prop) {
      dep(target, prop, null)
      return Reflect.deleteProperty(target, prop)
    },
  })
}

let instance: PersistentStore | null = null
export const getPersistentStore = async (): Promise<PersistentStore> => {
  if (instance) return instance

  const filePath = path.join(process.env.STORAGE_PATH, 'persistent.json')

  let _store: PersistentStore = {}

  try {
    const base = await readFile(filePath)
    _store = JSON.parse(base.toString('utf-8'))
  } catch (err: unknown) {
    // Welp we failed to load, I guess you shouldn't have used JSON
    console.error(err)
    _store = {}
  }

  instance = watchObj(
    _store,
    debounce(
      debouncePromise(() =>
        writeFile(filePath, JSON.stringify(_store), {
          encoding: 'utf-8',
        }),
      ),
      50,
    ),
  )

  return instance
}
