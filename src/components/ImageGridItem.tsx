import { styled } from '@mui/material'
import { useCallback, useContext } from 'react'
import { ContentHoverEffect } from 'src/components/ContentHoverEffect'
import { RightClickMenu } from 'src/components/RightClickMenu'
import { useImageData } from 'src/hooks/useImageData'
import { useMousePositionClick } from 'src/hooks/useMousePositionClick'
import { SelectionStateContext } from 'src/state/selectionState.context'

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

type ImageGridItemProps = {
  id: string
}

export const ImageGridItem = (props: ImageGridItemProps) => {
  const { id } = props

  const {
    api: { setContentIdToEdit },
  } = useContext(SelectionStateContext)

  const {
    api: { setSelectedImageId },
  } = useContext(SelectionStateContext)

  const [sourceUrl, imagePath] = useImageData(id, true)
  const { mousePosition, handleRightClick, handleOnCloseMenu } = useMousePositionClick()

  const handleOnContentEdit = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      setContentIdToEdit(id)
    },
    [id, setContentIdToEdit],
  )

  const handleOnContentClick = useCallback(() => {
    setSelectedImageId(id)
  }, [id, setSelectedImageId])

  return (
    <ImageContainer onClick={handleOnContentClick} onMouseLeave={handleOnCloseMenu}>
      <div
        style={{
          backgroundImage: `url(${imagePath})`,
        }}
      />
      <ContentHoverEffect onEditContent={handleOnContentEdit} onRightClick={handleRightClick} />
      <RightClickMenu
        mousePosition={mousePosition}
        sourceUrl={sourceUrl}
        imageId={id}
        onCloseMenu={handleOnCloseMenu}
        disabled={Boolean(sourceUrl === '')}
      />
    </ImageContainer>
  )
}
