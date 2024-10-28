import { Backdrop, Collapse, List, ListItemButton, ListItemText, Paper, styled } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useContext, useMemo, useState } from 'react'
import { getImageWithId } from 'src/db/useDB'
import { SelectionStateContext } from 'src/state/selectionState.context'
import { getImageDir } from 'src/utils/utils'

type MousePositionType = {
  x: number
  y: number
}

const ImageContainer = styled('div', {
  name: 'ImageContainer',
})(() => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const FullImagePreview = () => {
  const {
    data: { selectedImageId },
    api: { setSelectedImageId },
  } = useContext(SelectionStateContext)

  const [mousePosition, setMousePosition] = useState<MousePositionType | null>(null)

  const imageData = useLiveQuery(() => getImageWithId(selectedImageId), [selectedImageId])

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

  if (!selectedImageId) return

  return (
    <ImageContainer>
      <Backdrop open onClick={handleCloseImage} />
      <img
        src={imagePath}
        height="95%"
        onClick={handleLeftClick}
        onContextMenu={handleRightClick}
        style={{
          zIndex: 1,
        }}
      />

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
    </ImageContainer>
  )
}
