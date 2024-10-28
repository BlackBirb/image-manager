import { PropsWithChildren } from 'react'
import { SelectionStateContextProvider } from 'src/state/selectionState.context'

import { ClipboardStateContextProvider } from './clipboardState.context'
import { ErrorStateContextProvider } from './errorState.context'
import { SearchStateContextProvider } from './searchState.context'

export const State = (props: PropsWithChildren<Record<never, unknown>>) => {
  const { children } = props
  return (
    <ErrorStateContextProvider>
      <SearchStateContextProvider>
        <SelectionStateContextProvider>
          <ClipboardStateContextProvider>{children}</ClipboardStateContextProvider>
        </SelectionStateContextProvider>
      </SearchStateContextProvider>
    </ErrorStateContextProvider>
  )
}
