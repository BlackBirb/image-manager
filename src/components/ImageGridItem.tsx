import { styled } from '@mui/material'

const ImageContainer = styled('div', {
  name: 'ImageContainer',
})(() => ({
  width: '100%',
  height: '100%',
  maxWidth: 100,
  maxHeight: 300,
}))

type ImageGridItemProps = {
  id: string
  imagePath: string
}

export const ImageGridItem = (props: ImageGridItemProps) => {
  const { id, imagePath } = props
  console.log('ImageGridItem props: ', props)
  // Need to call electron to give us the blob of the imagePath
  return (
    <ImageContainer>
      <img src={imagePath} alt="id" />
    </ImageContainer>
  )
}
