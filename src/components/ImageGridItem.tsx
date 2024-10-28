import { Settings as SettingsIcon } from '@mui/icons-material'
import { Box, IconButton, styled } from '@mui/material'
import { useCallback, useContext, useMemo } from 'react'
import { SelectionStateContext } from 'src/state/selectionState.context'
import { getImageDir } from 'src/utils/utils'

const ImageContainer = styled('div', {
  name: 'ImageContainer',
})(() => ({
  position: 'relative',
  width: 200,
  height: 300,
  cursor: 'pointer',
  '&>div:first-of-type': {
    width: '100%',
    height: '100%',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
}))

const EditButtonWrapper = styled('div', {
  name: 'EditButtonWrapper',
})(() => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '80px',
  height: '80px',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'start',
  justifyContent: 'flex-end',
  '&:hover': {
    opacity: 1,
  },
}))

const ViewFullScreen = styled('div', {
  name: 'ViewFullScreen',
})(() => ({
  position: 'absolute',
  inset: 0,
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  backgroundColor: 'rgba(0,0,0,0.2)',
  '&:hover': {
    opacity: 1,
  },
}))

type ImageGridItemProps = {
  id: string
  ext: string
  thumbnail?: boolean
}

export const ImageGridItem = (props: ImageGridItemProps) => {
  const { id, ext, thumbnail } = props

  const {
    api: { setSelectedImageId },
  } = useContext(SelectionStateContext)

  const imagePath = useMemo(() => {
    return getImageDir(id, ext, !!thumbnail)
  }, [id, ext, thumbnail])

  const handleOnImageClick = useCallback(() => {
    setSelectedImageId(id)
  }, [id, setSelectedImageId])

  return (
    <ImageContainer onClick={handleOnImageClick}>
      <div
        style={{
          backgroundImage: `url(${imagePath})`,
        }}
      />
      <EditButtonWrapper>
        <Box p={0.5}>
          <IconButton>
            <SettingsIcon />
          </IconButton>
        </Box>
      </EditButtonWrapper>
      <ViewFullScreen></ViewFullScreen>
    </ImageContainer>
  )
}
