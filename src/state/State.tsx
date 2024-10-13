import { PropsWithChildren } from 'react'

import { ClipboardStateContextProvider } from './clipboardState.context'
import { ErrorStateContextProvider } from './errorState.context'
import { SearchStateContextProvider } from './searchState.context'

export const State = (props: PropsWithChildren<Record<never, unknown>>) => {
  const { children } = props
  return (
    <ErrorStateContextProvider>
      <SearchStateContextProvider>
        <ClipboardStateContextProvider>{children}</ClipboardStateContextProvider>
      </SearchStateContextProvider>
    </ErrorStateContextProvider>
  )
}
