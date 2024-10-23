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
    if (errors.length === 0) return null
    return (
      <Stack
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
      >
        🔥{errors.map((err) => err.message).join('🔥')}🔥
        <Button onClick={handleButtonClick}>Clear</Button>
      </Stack>
    )
  }, [errors, handleButtonClick])

  // make it ✨pretty✨ please
  return (
    <>
      {renderedError}
      {children}
    </>
  )
}
