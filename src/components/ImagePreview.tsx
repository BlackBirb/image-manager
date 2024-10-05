import { Backdrop, Button, Dialog, DialogActions, DialogTitle, Paper as MuiPaper, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useCallback, useContext, useMemo, useState } from 'react'
import { ClipboardStateContext } from 'src/state/clipboardState.context'
import { SearchInput } from './SearchInput'

const Main = styled('div', {
  name: 'Main',
})(() => ({
  position: 'absolute',
  inset: 0,
}))

const Paper = styled(MuiPaper, {
  name: 'Paper',
})(({ theme }) => ({
  height: '100%',
  maxHeight: '80%',
  width: '100%',
  maxWidth: '80%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
}))

export const ImagePreview = () => {
  const {
    data: { pastedImage },
    api: { setPastedImage },
  } = useContext(ClipboardStateContext)

  const [searchTags, setSearchTags] = useState('')

  const [alert, setAlert] = useState(false)

  const imagePreview = useMemo(() => {
    if (!pastedImage) return
    let imageBlob = null
    try {
      imageBlob = URL.createObjectURL(pastedImage)
    } catch {
      console.error('Failed to create preview of the pasted file!')
    }
    return imageBlob
  }, [pastedImage])

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

  if (!pastedImage) return null
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
              <SearchInput value={searchTags} onChange={setSearchTags} placeholder="Search tags" />
              <Stack direction="row" spacing={2} width="100%" height="100%">
                <Stack spacing={1} minWidth={150}>
                  tags
                </Stack>
                <Stack alignItems="center" justifyContent="center" width="100%" height="100%">
                  {imagePreview && <img src={imagePreview} width="100%" />}
                </Stack>
              </Stack>
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
