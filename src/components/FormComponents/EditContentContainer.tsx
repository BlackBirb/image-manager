import { useContext } from 'react'
import { AddEditContentContainer } from 'src/components/AddEditContentContainer'
import { ClipboardStateContext } from 'src/state/clipboardState.context'

export const EditContentContainer = () => {
  const {
    data: { imagePreviewUrl },
    api: { setPastedImage },
  } = useContext(ClipboardStateContext)

  if (!imagePreviewUrl) return

  return <AddEditContentContainer imageUrl={imagePreviewUrl} clearImageUrl={() => setPastedImage(null)} />
}
