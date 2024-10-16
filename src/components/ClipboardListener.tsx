import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'
import { useCallback, useContext, useLayoutEffect, useState } from 'react'
import { saveImage, useElectronApi } from 'src/hooks/useElectronApi'
import { ClipboardStateContext } from 'src/state/clipboardState.context'

export const ClipboardListener = () => {
  const {
    api: { setPastedImage },
  } = useContext(ClipboardStateContext)

  const electronApi = useElectronApi()

  const [invalidPasteMessage, setInvalidPasteMessage] = useState('')
  const [openDialog, setOpenDialog] = useState(false)

  const handleOkClick = useCallback(() => {
    setOpenDialog(false)
  }, [])

  const handleOpenDialog = useCallback((newMessage: string) => {
    setInvalidPasteMessage(newMessage)
    setOpenDialog(true)
  }, [])

  useLayoutEffect(() => {
    const onPaste = async (event: ClipboardEvent) => {
      event.stopPropagation()
      if (event.clipboardData?.files.length) {
        for (let i = 0; i <= event.clipboardData.files.length; i++) {
          if (event.clipboardData.files[i].type.startsWith('image/')) {
            const pastedImage = event.clipboardData.files[i]
            setPastedImage(pastedImage)

            // TODO: Yeah this is not place for it
            const [commitImage] = saveImage(pastedImage)
            const info = await commitImage()
            console.info('[Clipboard] commit Image', info)
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
          if (!mime) throw 'Failed to fetch mime type'
          if (mime.startsWith('image/')) throw 'Invalid resource mime type'

          setPastedImage(url)
          console.info('[Clipboard] pastedURL:', url.href)

          const [commitImage] = saveImage(url)
          const info = await commitImage()
          console.info('[Clipboard] commit Image', info)

          return
        } catch {
          // General error handler will catch this
          // handleOpenDialog('Invalid url image!')
        }
      }
      handleOpenDialog('No file or image URL found!')
      console.warn('No files or image URL found on clipboard')
    }
    window.addEventListener('paste', onPaste)
    return () => {
      window.removeEventListener('paste', onPaste)
    }
  }, [handleOpenDialog, setPastedImage])

  return (
    <Dialog open={openDialog}>
      <DialogTitle>{invalidPasteMessage}</DialogTitle>
      <DialogActions>
        <Button onClick={handleOkClick}>OK</Button>
      </DialogActions>
    </Dialog>
  )
}
