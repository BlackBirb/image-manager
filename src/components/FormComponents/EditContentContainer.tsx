import { useCallback, useContext, useMemo } from 'react'
import { AddEditContentContainer } from 'src/components/FormComponents/AddEditContentContainer'
import { AddEditFormType } from 'src/components/FormComponents/AddEditForm'
import { useGetContentPath } from 'src/hooks/useGetContentPath'
import { SelectionStateContext } from 'src/state/selectionState.context'

export const EditContentContainer = () => {
  const {
    data: { contentIdToEdit, contentDataToEdit },
    api: { setContentIdToEdit },
  } = useContext(SelectionStateContext)
  const imagePath = useGetContentPath(contentDataToEdit)

  const defaultValues: AddEditFormType | null = useMemo(() => {
    if (!contentDataToEdit) return null
    return {
      contentType: contentDataToEdit?.contentType,
      tags: contentDataToEdit?.tags.map((t) => ({
        tag: t,
      })),
      sourceUrl: contentDataToEdit?.sourceUrl,
      additionalImageUrls: contentDataToEdit?.additionalUrls.map((url) => ({
        additionalImageUrl: url,
      })),
      type: contentDataToEdit?.type,
    }
  }, [contentDataToEdit])

  const onCloseForm = useCallback(() => {
    setContentIdToEdit('')
  }, [setContentIdToEdit])

  if (!contentDataToEdit || !defaultValues) return

  return (
    <AddEditContentContainer
      imageUrl={imagePath}
      onCloseForm={onCloseForm}
      editingId={contentIdToEdit}
      defaultValues={defaultValues}
    />
  )
}
