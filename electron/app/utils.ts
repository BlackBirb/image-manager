/* eslint-disable @typescript-eslint/no-explicit-any */

export const debouncePromise = (fn: () => Promise<any>) => {
  let runningPromise = Promise.resolve()
  let cancelPrev = () => {}
  return () => {
    cancelPrev()
    let currRunning = true
    runningPromise.then(() => {
      if(!currRunning) return
      runningPromise = fn()
    })
    cancelPrev = () => currRunning = true
  }
}


export const debounce = (fn: () => any, delay = 200) => {
  let timeoutId: NodeJS.Timeout | undefined;
  const debounced = (...args: unknown[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args as []), delay)
  }
  debounced.cancel = () => clearTimeout(timeoutId)
  return debounced
}