import { useMemo } from 'react'
import { Content } from 'src/db/db'
import { getImageDir } from 'src/utils/utils'

export const useGetContentPath = (imageData?: Content | null, isThumbnail?: boolean) => {
  return useMemo(() => {
    if (!imageData?.id) return ''
    return getImageDir(imageData.id, imageData.ext, !!isThumbnail)
  }, [imageData, isThumbnail])
}
