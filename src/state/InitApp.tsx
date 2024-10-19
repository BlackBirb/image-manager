import { useLiveQuery } from 'dexie-react-hooks'
import { setImageStorePath } from 'electron/preload/ipcRenderer'
import { PropsWithChildren, useEffect, useMemo } from 'react'
import { InitForm } from 'src/components/FormComponents/InitForm'
import { getUserPreferences } from 'src/db/useDb'

export const InitApp = (props: PropsWithChildren<Record<never, unknown>>) => {
  const { children } = props

  const user = useLiveQuery(getUserPreferences)

  const isDBInit = useMemo(() => {
    return user?.name === 'user'
  }, [user])

  useEffect(() => {
    const setImagePromise = async (path: string) => {
      console.log(path)
      const pathSaved = await setImageStorePath(path)
      console.log('pathSaved: ', pathSaved)
    }
    console.log('isDBInit: ', isDBInit)
    if (isDBInit && user?.folderPath) {
      console.log('user?.folderPath: ', user?.folderPath)
      setImagePromise(user?.folderPath)
    }
  }, [user, isDBInit])

  console.info('[DB] isDBInit: ', isDBInit)

  if (!isDBInit) return <InitForm />

  return children
}
