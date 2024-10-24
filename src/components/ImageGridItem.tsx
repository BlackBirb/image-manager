import { styled } from '@mui/material'
import { useMemo } from 'react'
import { getImageDir } from 'src/utils/utils'

const ImageContainer = styled('div', {
  name: 'ImageContainer',
})(() => ({
  width: 200,
  height: 300,
  '&>div': {
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

  const imagePath = useMemo(() => {
    return getImageDir(id, ext, !!thumbnail)
  }, [id, ext, thumbnail])
  return (
    <ImageContainer>
      <div
        style={{
          backgroundImage: `url(${imagePath})`,
        }}
      />
    </ImageContainer>
  )
}
