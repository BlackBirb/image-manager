import { useContext, useLayoutEffect } from 'react'
import { useElectronApi } from 'src/hooks/useElectronApi'
import { ClipboardStateContext } from 'src/state/clipboardState.context'

export const ClipboardListener = () => {
  const {
    api: { setPastedImage },
  } = useContext(ClipboardStateContext)

  const electronApi = useElectronApi()

  useLayoutEffect(() => {
    const onPaste = async (event: ClipboardEvent) => {
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
        return
      }

      const textData = event.clipboardData?.getData('text')
      if (textData) {
        try {
          const url = new URL(textData)
          // we can fetch only headers to make sure it's an image mime type
          const mime = await electronApi.getURLMime(url.href)
          if (!mime.startsWith('image/')) throw 'Invalid resource mime type'

          setPastedImage(url)
          console.log('pastedURL:', url.href)
          return
        } catch {
          // invalid URL
        }
      }
      console.log('No files or iamge URL found on clipboard')
    }
    window.addEventListener('paste', onPaste)
    return () => {
      window.removeEventListener('paste', onPaste)
    }
  }, [])

  return null
}
