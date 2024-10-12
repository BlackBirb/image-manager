import { useLiveQuery } from 'dexie-react-hooks'
import { PropsWithChildren } from 'react'
import { InitForm } from 'src/components/FormComponents/InitForm'
import { db } from 'src/db/db'

export const InitApp = (props: PropsWithChildren<Record<never, unknown>>) => {
  const { children } = props

  const isDBInit = useLiveQuery(async () => {
    const user = await db.user.get(1)
    console.log('user: ', user)
    return user?.name === 'user'
  })

  console.log('isDBInit: ', isDBInit)

  if (!isDBInit) return <InitForm />

  return children
}
