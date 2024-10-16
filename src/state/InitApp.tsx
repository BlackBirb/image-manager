import { useLiveQuery } from 'dexie-react-hooks'
import { PropsWithChildren } from 'react'
import { InitForm } from 'src/components/FormComponents/InitForm'
import { db } from 'src/db/db'
import { getUserPreferences } from 'src/db/useDb'

export const InitApp = (props: PropsWithChildren<Record<never, unknown>>) => {
  const { children } = props

  const isDBInit = useLiveQuery(async () => {
    const user = await getUserPreferences()
    console.info('[DB] user: ', user)
    return user?.name === 'user'
  })

  console.info('[DB] isDBInit: ', isDBInit)

  if (!isDBInit) return <InitForm />

  return children
}
