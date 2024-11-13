import { useLiveQuery } from 'dexie-react-hooks'
import { getContentWithId } from 'src/db/useDB'
import { useGetContentPath } from 'src/hooks/useGetContentPath'

export const useImageData = (selectedImageId: string, isThumbnail?: boolean) => {
  const imageData = useLiveQuery(() => getContentWithId(selectedImageId), [selectedImageId])
  const imagePath = useGetContentPath(imageData, isThumbnail)

  const sourceUrl = imageData?.sourceUrl

  return [sourceUrl, imagePath]
}
