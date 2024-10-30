import { useContext } from 'react'
import { AddEditContentContainer } from 'src/components/FormComponents/AddEditContentContainer'
import { ClipboardStateContext } from 'src/state/clipboardState.context'

export const AddContentContainer = () => {
  const {
    data: { imagePreviewUrl },
    api: { setPastedImage },
  } = useContext(ClipboardStateContext)

  if (!imagePreviewUrl) return

  return <AddEditContentContainer imageUrl={imagePreviewUrl} onCloseForm={() => setPastedImage(null)} />
}
