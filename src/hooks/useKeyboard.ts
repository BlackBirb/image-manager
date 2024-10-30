import { useEffect } from 'react'

type UseKeyboardProps = {
  key: string
  onKeyPressed: () => void
}

export function useKeyboard(props: UseKeyboardProps) {
  const { key, onKeyPressed } = props

  useEffect(() => {
    function keyDownHandler(e: globalThis.KeyboardEvent) {
      if (e.key === key) {
        e.preventDefault()
        onKeyPressed()
      }
    }

    document.addEventListener('keydown', keyDownHandler)

    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [])
}
