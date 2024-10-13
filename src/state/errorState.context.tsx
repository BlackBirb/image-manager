import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import { explodingObject } from 'src/utils/explodingObject'
import { removeItemFromArray } from 'src/utils/utils'

type UIErrorSeverity = 'warning' | 'error'

type UIError = {
  message: string
  severity: UIErrorSeverity
}

// realistically there won't be more than one error at once
// but just being able to handle more in case something async happens at the same time is nice
type ErrorStateContextType = {
  data: {
    errors: UIError[]
  }
  api: {
    throwError: (message: string) => void
    clearErrors: (error?: UIError) => void
  }
}

export const ErrorStateContext = createContext<ErrorStateContextType>(
  explodingObject<ErrorStateContextType>('ErrorStateContext data not provided!'),
)

export const ErrorStateContextProvider = (props: PropsWithChildren<Record<any, unknown>>) => {
  const { children } = props
  const [errors, setErrors] = useState<UIError[]>([])

  // should it be useCallback or useMemo?
  const throwError = useCallback((message: string, severity: UIErrorSeverity = 'error') => {
    setErrors((oldErrors) => [...oldErrors, { message, severity }])
  }, [])

  const clearErrors = useCallback((error?: UIError) => {
    if (!error) {
      setErrors([])
      return
    }

    // this actually works since objects are mutable and all
    // well idk how react does it but it should work
    // worse case either remove the ability to clear specific errors
    // or add an id to every error :3c
    setErrors((oldErrors) => oldErrors.filter((e) => e !== error))
  }, [])

  // i don't like window.api here but adding it to useElectron API is just useless wrapper
  useEffect(() =>
    window.api.onNodeError((err) => {
      throwError(err)
    }),
  )

  const contextData = useMemo(
    () => ({
      data: {
        errors,
      },
      api: {
        throwError,
        clearErrors,
      },
    }),
    [errors, throwError, clearErrors],
  )

  return <ErrorStateContext.Provider value={contextData}>{children}</ErrorStateContext.Provider>
}
