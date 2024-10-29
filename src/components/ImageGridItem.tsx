import { styled } from '@mui/material'
import { useCallback, useContext, useMemo } from 'react'
import { ContentHoverEffect } from 'src/components/ContentHoverEffect'
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

type ImageGridItemProps = {
  id: string
  ext: string
  thumbnail?: boolean
}

export const ImageGridItem = (props: ImageGridItemProps) => {
  const { id, ext, thumbnail } = props

  const {
    api: { setContentIdToEdit },
  } = useContext(SelectionStateContext)

  const {
    api: { setSelectedImageId },
  } = useContext(SelectionStateContext)

  const imagePath = useMemo(() => {
    return getImageDir(id, ext, !!thumbnail)
  }, [id, ext, thumbnail])

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
    <ImageContainer onClick={handleOnContentClick}>
      <div
        style={{
          backgroundImage: `url(${imagePath})`,
        }}
      />

      <ContentHoverEffect onEditContent={handleOnContentEdit} />
    </ImageContainer>
  )
}
