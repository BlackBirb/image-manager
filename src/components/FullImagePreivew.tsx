import { Settings as SettingsIcon } from '@mui/icons-material'
import { Backdrop, Stack, styled, Box, IconButton } from '@mui/material'
import React, { useCallback, useContext, useEffect } from 'react'
import { RightClickMenu } from 'src/components/RightClickMenu'
import { useImageData } from 'src/hooks/useImageData'
import { useKeyboard } from 'src/hooks/useKeyboard'
import { useMousePositionClick } from 'src/hooks/useMousePositionClick'
import { ClipboardStateContext } from 'src/state/clipboardState.context'
import { SelectionStateContext } from 'src/state/selectionState.context'

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
  zIndex: 3,
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

const FullImagePreviewContainer = styled('div', {
  name: 'FullImagePreview',
})(() => ({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 4,
}))

export const FullImagePreview = () => {
  const {
    data: { selectedImageId },
    api: { setSelectedImageId, setContentIdToEdit },
  } = useContext(SelectionStateContext)
  const {
    data: { imagePreviewUrl },
  } = useContext(ClipboardStateContext)

  const [sourceUrl, imagePath] = useImageData(selectedImageId)
  const { mousePosition, handleRightClick, handleOnCloseMenu } = useMousePositionClick()

  const handleOnCloseContent = useCallback(() => {
    setSelectedImageId('')
    handleOnCloseMenu()
  }, [setSelectedImageId, handleOnCloseMenu])

  const handleOnContentEdit = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      setContentIdToEdit(selectedImageId)
      handleOnCloseContent()
    },
    [selectedImageId, setContentIdToEdit, handleOnCloseContent],
  )

  useKeyboard({
    key: 'Escape',
    onKeyPressed: handleOnCloseContent,
  })

  useEffect(() => {
    if (imagePreviewUrl) {
      handleOnCloseContent()
    }
  }, [imagePreviewUrl, handleOnCloseContent])

  if (!selectedImageId) return

  // Add on esc key listener in order to get out of the full image preview if image is too big and
  // we can't click outside it
  return (
    <FullImagePreviewContainer>
      <Backdrop open onClick={handleOnCloseContent} />
      <Stack width="100%" height="100%" p={4} direction="row" alignItems="center" justifyContent="center">
        <Stack direction="row" height="100%" position="relative">
          <img
            src={imagePath}
            onClick={handleOnCloseMenu}
            onContextMenu={handleRightClick}
            style={{
              zIndex: 1,
              maxWidth: '100%',
              maxHeight: '100%',
              height: 'auto',
            }}
          />
          <EditButtonWrapper>
            <Box p={0.5} zIndex={2}>
              <IconButton onClick={handleOnContentEdit}>
                <SettingsIcon />
              </IconButton>
            </Box>
            <EditButtonHoverEffect className="EditButtonHoverEffect" />
          </EditButtonWrapper>
        </Stack>
      </Stack>

      <RightClickMenu
        mousePosition={mousePosition}
        sourceUrl={sourceUrl}
        imageId={selectedImageId}
        onCloseMenu={handleOnCloseMenu}
        disabled={Boolean(sourceUrl === '')}
      />
    </FullImagePreviewContainer>
  )
}
