import { Button, Stack } from '@mui/material'
import { useContext, PropsWithChildren, useCallback } from 'react'
import { ErrorStateContext } from 'src/state/errorState.context'

// Or should this be in components?
export const ErrorHandler = (props: PropsWithChildren<Record<never, unknown>>) => {
  const { children } = props
  const {
    data: { errors },
    api: { clearErrors },
  } = useContext(ErrorStateContext)

  const handleButtonClick = useCallback(() => {
    clearErrors()
  }, [clearErrors])

  if (errors.length < 1) return children

  // make it ✨pretty✨ please
  return (
    <Stack>
      <Stack>
        🔥{errors.map((err) => err.message).join('🔥')}🔥
        <Button onClick={handleButtonClick}>Clear</Button>
      </Stack>
      <Stack>{children}</Stack>
    </Stack>
  )
}
