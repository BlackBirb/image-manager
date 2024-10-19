import { Button, Stack } from '@mui/material'
import { useContext, PropsWithChildren, useCallback, useMemo } from 'react'
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

  const renderedError = useMemo(() => {
    return (
      <Stack>
        🔥{errors.map((err) => err.message).join('🔥')}🔥
        <Button onClick={handleButtonClick}>Clear</Button>
      </Stack>
    )
  }, [errors, handleButtonClick])

  // make it ✨pretty✨ please
  return (
    <Stack>
      {renderedError}
      <Stack>{children}</Stack>
    </Stack>
  )
}
