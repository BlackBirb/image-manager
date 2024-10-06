import { mkdir, stat } from 'fs/promises'

const createStorageFolder = async () => {
  try {
    await stat(process.env.STORAGE_PATH)
    return true
  } catch (err: unknown) {
    // I hate TS
    if (err instanceof Error && err.code === 'ENOENT') {
      await mkdir(process.env.STORAGE_PATH, {
        recursive: true,
      })
      return false
    }

    // We just panic at this point, something is really wrong
    throw err
  }
}

export const initialSetup = async () => {
  const storage = await createStorageFolder()
  if (storage) return true
}
