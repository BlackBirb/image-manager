import { useContext, useLayoutEffect } from 'react'
import { ClipboardStateContext } from 'src/state/clipboardState.context'

export const ClipboardListener = () => {
  const {
    api: { setPastedImage },
  } = useContext(ClipboardStateContext)
  useLayoutEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      event.stopPropagation()
      if (event.clipboardData?.files.length) {
        for (let i = 0; i <= event.clipboardData.files.length; i++) {
          if (event.clipboardData.files[i].type.startsWith('image/')) {
            const pastedImage = event.clipboardData.files[i]
            setPastedImage(pastedImage)
            console.log('pastedImage: ', pastedImage)
            break
          }
        }
      } else {
        console.log('No files found on clipboard')
      }
    }
    window.addEventListener('paste', onPaste)
    return () => {
      window.removeEventListener('paste', onPaste)
    }
  }, [])

  return null
}
