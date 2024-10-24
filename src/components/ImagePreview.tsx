import { Backdrop, Button, Dialog, DialogActions, DialogTitle, Paper as MuiPaper, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useCallback, useContext, useState } from 'react'
import { ClipboardStateContext } from 'src/state/clipboardState.context'

import { AddEditForm } from './FormComponents/AddEditForm'

const Main = styled('div', {
  name: 'Main',
})(() => ({
  position: 'absolute',
  inset: 0,
}))

const ImageView = styled('img', {
  name: 'ImageView',
})(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
}))

const Paper = styled(MuiPaper, {
  name: 'Paper',
})(({ theme }) => ({
  height: '100%',
  maxHeight: '80%',
  width: '100%',
  maxWidth: '80%',
  backgroundColor: 'rgba(0,0,0,0.8)',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
}))

export const ImagePreview = () => {
  const {
    data: { imagePreviewUrl },
    api: { setPastedImage },
  } = useContext(ClipboardStateContext)

  const [alert, setAlert] = useState(false)

  const handleBackdropClose = useCallback(() => {
    setAlert(true)
  }, [])
  const handleCloseDialog = useCallback((event: any) => {
    event.stopPropagation()
    setAlert(false)
  }, [])
  const handleAgree = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    handleCloseDialog(event)
    setPastedImage(null)
  }, [])

  if (!imagePreviewUrl) return null

  return (
    <>
      <Backdrop id="image-preview-back-drop" open onClick={handleBackdropClose} />
      <Main onClick={handleBackdropClose}>
        <Stack alignItems="center" justifyContent="center" width="100%" height="100%">
          <Paper
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <Stack spacing={2} width="100%" height="100%">
              <Stack alignItems="center" justifyContent="center" width="100%" height="100%" maxHeight="200px">
                <ImageView src={imagePreviewUrl} />
              </Stack>
              <AddEditForm />
            </Stack>
          </Paper>
        </Stack>
        <Dialog open={alert} onClose={handleCloseDialog}>
          <DialogTitle>Are you sure you want to exit ?</DialogTitle>
          <DialogActions>
            <Button onClick={handleAgree}>Yes</Button>
            <Button onClick={handleCloseDialog}>No</Button>
          </DialogActions>
        </Dialog>
      </Main>
    </>
  )
}
