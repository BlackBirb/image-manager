import { useCallback, useContext } from 'react'
import { AddEditContentContainer } from 'src/components/FormComponents/AddEditContentContainer'
import { ClipboardStateContext } from 'src/state/clipboardState.context'

export const AddContentContainer = () => {
  const {
    data: { imagePreviewUrl },
    api: { setPastedImage },
  } = useContext(ClipboardStateContext)

  const onCloseForm = useCallback(() => {
    setPastedImage(null)
  }, [setPastedImage])

  if (!imagePreviewUrl) return

  return <AddEditContentContainer imageUrl={imagePreviewUrl} onCloseForm={onCloseForm} />
}
