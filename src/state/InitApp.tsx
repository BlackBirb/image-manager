import { useLiveQuery } from 'dexie-react-hooks'
import { PropsWithChildren, useContext, useEffect, useMemo } from 'react'
import { InitForm } from 'src/components/FormComponents/InitForm'
import { getAllImages, getUserPreferences } from 'src/db/useDb'
import { useElectronApi } from 'src/hooks/useElectronApi'
import { ErrorStateContext } from 'src/state/errorState.context'

export const InitApp = (props: PropsWithChildren<Record<never, unknown>>) => {
  const { children } = props

  const {
    api: { throwError },
  } = useContext(ErrorStateContext)

  const { setImageStorePath } = useElectronApi()

  const user = useLiveQuery(getUserPreferences, [])
  const content = useLiveQuery(getAllImages)
  console.log('content: ', content)

  useEffect(() => {
    console.log('user: ', user)
  }, [user])

  const isDBInit = useMemo(() => {
    return user?.name === 'user'
  }, [user])

  useEffect(() => {
    const setImagePromise = async (path: string) => {
      const pathSaved = await setImageStorePath(path)
      if (!pathSaved) {
        throwError('Failed to set image path on load!')
      }
    }
    if (isDBInit && user?.folderPath) {
      setImagePromise(user?.folderPath)
    }
  }, [user, isDBInit])

  useEffect(() => {
    console.info('[DB] isDBInit: ', isDBInit)
  }, [isDBInit])

  if (!isDBInit) return <InitForm />

  return children
}
