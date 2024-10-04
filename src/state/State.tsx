import { PropsWithChildren } from 'react'
import { SearchStateContextProvider } from './searchState.context'

export const State = (props: PropsWithChildren<Record<any, unknown>>) => {
  const { children } = props
  return <SearchStateContextProvider>{children}</SearchStateContextProvider>
}
