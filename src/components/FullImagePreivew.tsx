import { Settings as SettingsIcon } from '@mui/icons-material'
import {
  Backdrop,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  styled,
  Box,
  IconButton,
} from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useContext, useMemo, useState } from 'react'
import { getContentWithId } from 'src/db/useDB'
import { SelectionStateContext } from 'src/state/selectionState.context'
import { getImageDir } from 'src/utils/utils'

const EditButtonWrapper = styled('div', {
  name: 'EditButtonWrapper',
})(() => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '150px',
  height: '150px',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'start',
  justifyContent: 'flex-end',
  zIndex: 11,
  '&:hover': {
    opacity: 1,
    '&>div': {
      opacity: 1,
    },
    '&>.EditButtonHoverEffect': {
      width: '160px',
      height: '150px',
    },
  },
}))

const EditButtonHoverEffect = styled('div', {
  name: 'EditButtonHoverEffect',
})(() => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '0px',
  height: '0px',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out, width 0.2s ease-in-out, height 0.2s ease-in-out',
  backgroundColor: 'rgba(0,0,0,0.2)',
  borderBottomLeftRadius: '100%',
  clipPath: 'border-box',
}))

type MousePositionType = {
  x: number
  y: number
}

const FullImagePreviewContainer = styled('div', {
  name: 'FullImagePreview',
})(() => ({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
}))

export const FullImagePreview = () => {
  const {
    data: { selectedImageId },
    api: { setSelectedImageId, setContentIdToEdit },
  } = useContext(SelectionStateContext)

  const [mousePosition, setMousePosition] = useState<MousePositionType | null>(null)

  const imageData = useLiveQuery(() => getContentWithId(selectedImageId), [selectedImageId])

  const imagePath = useMemo(() => {
    if (!imageData?.id) return ''
    return getImageDir(imageData.id, imageData.ext, false)
  }, [imageData])

  const handleOnCloseMenu = useCallback(() => [setMousePosition(null)], [])

  const handleOnCopyImage = useCallback(() => {
    // TODO: copy image
    handleOnCloseMenu()
  }, [handleOnCloseMenu])

  const handleOnCopySourceUrl = useCallback(() => {
    // TODO: copy image url from imageData
    console.log('imageData: ', imageData)
    handleOnCloseMenu()
  }, [handleOnCloseMenu, imageData])

  const handleCloseImage = useCallback(() => {
    setSelectedImageId('')
    setMousePosition(null)
  }, [setSelectedImageId])

  const handleLeftClick = useCallback(() => {
    handleOnCloseMenu()
  }, [handleOnCloseMenu])

  const handleRightClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      if (event.nativeEvent.button === 0) {
        handleOnCloseMenu()
      }
      if (event.nativeEvent.button === 2) {
        setMousePosition({
          x: event.clientX + 2,
          y: event.clientY - 6,
        })
      }
    },
    [handleOnCloseMenu],
  )

  const handleOnContentEdit = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      setContentIdToEdit(selectedImageId)
      handleCloseImage()
    },
    [selectedImageId, setContentIdToEdit, handleCloseImage],
  )

  if (!selectedImageId) return

  // Add on esc key listener in order to get out of the full image preview if image is too big and
  // we can't click outside it
  return (
    <FullImagePreviewContainer>
      <Backdrop open onClick={handleCloseImage} />
      <Stack width="100%" height="100%" p={4} direction="row" alignItems="center" justifyContent="center">
        <Stack direction="row" height="100%" position="relative">
          <img
            src={imagePath}
            onClick={handleLeftClick}
            onContextMenu={handleRightClick}
            style={{
              zIndex: 1,
              maxWidth: '100%',
              maxHeight: '100%',
              height: 'auto',
            }}
          />
          <EditButtonWrapper>
            <Box p={0.5} zIndex={11}>
              <IconButton onClick={handleOnContentEdit}>
                <SettingsIcon />
              </IconButton>
            </Box>
            <EditButtonHoverEffect className="EditButtonHoverEffect" />
          </EditButtonWrapper>
        </Stack>
      </Stack>

      <Paper
        style={{
          display: mousePosition ? 'block' : 'none',
          position: 'absolute',
          top: mousePosition ? mousePosition?.y + 6 : 0,
          left: mousePosition?.x,
          zIndex: 1,
        }}
      >
        <Collapse in={Boolean(mousePosition)}>
          <List>
            <ListItemButton onClick={handleOnCopyImage}>
              <ListItemText primary="Copy image" />
            </ListItemButton>
            <ListItemButton onClick={handleOnCopySourceUrl}>
              <ListItemText primary="Copy source url" />
            </ListItemButton>
          </List>
        </Collapse>
      </Paper>
    </FullImagePreviewContainer>
  )
}
