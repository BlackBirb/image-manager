import { PropsWithChildren } from 'react'
import { SearchStateContextProvider } from './searchState.context'
import { ClipboardStateContextProvider } from './clipboardState.context'

export const State = (props: PropsWithChildren<Record<any, unknown>>) => {
  const { children } = props
  return (
    <SearchStateContextProvider>
      <ClipboardStateContextProvider>{children}</ClipboardStateContextProvider>
    </SearchStateContextProvider>
  )
}
