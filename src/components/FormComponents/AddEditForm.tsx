import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material'
import { Box, Button, IconButton, Stack, Switch, TextField, Typography } from '@mui/material'
import cloneDeep from 'lodash/cloneDeep'
import { useCallback, useContext, useState } from 'react'
import { TagsInput } from 'src/components/FormComponents/TagsInput'
import { ClipboardStateContext } from 'src/state/clipboardState.context'
import { v4 as uuid } from 'uuid'

type AdditionalImageUrlType = {
  id: string
  additionalImageUrl: string
}

type AddEditFormType = {
  id: string
  sfw: boolean
  tags: string[]
  sourceUrl: string
  additionalImageUrls: AdditionalImageUrlType[]
  type: 'image' | 'video' | 'gif' // Should come from mimetype ?
}

const defaultNewFormData: AddEditFormType = {
  id: uuid(),
  sfw: true,
  tags: [],
  sourceUrl: '',
  additionalImageUrls: [],
  type: 'image',
}

export const AddEditForm = () => {
  const {
    api: { setPastedImage },
  } = useContext(ClipboardStateContext)
  const [formData, setFormData] = useState<AddEditFormType>(defaultNewFormData)

  const handleSetTags = useCallback((newTags: string[]) => {
    setFormData((oldFormData) => {
      const newFormData = cloneDeep(oldFormData) as AddEditFormType
      newFormData.tags = newTags
      return newFormData
    })
  }, [])

  const handleSFWChange = useCallback((_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFormData((oldFormData) => {
      const newFormData = cloneDeep(oldFormData) as AddEditFormType
      newFormData.sfw = checked
      return newFormData
    })
  }, [])

  const handleOnSourceUrlChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((oldFormData) => {
      const newFormData = cloneDeep(oldFormData) as AddEditFormType
      newFormData.sourceUrl = event.target.value
      return newFormData
    })
  }, [])

  const onAddAdditionalUrl = useCallback(() => {
    setFormData((oldFormData) => {
      const newFormData = cloneDeep(oldFormData) as AddEditFormType
      newFormData.additionalImageUrls.push({
        id: uuid(),
        additionalImageUrl: '',
      })
      return newFormData
    })
  }, [])

  const onRemoveAdditionalUrl = useCallback((id: string) => {
    setFormData((oldFormData) => {
      const newFormData = cloneDeep(oldFormData) as AddEditFormType
      newFormData.additionalImageUrls = newFormData.additionalImageUrls.filter((item) => item.id !== id)
      return newFormData
    })
  }, [])

  const onAdditionalUrlChange = useCallback((newValue: string, id: string) => {
    setFormData((oldFormData) => {
      const newFormData = cloneDeep(oldFormData) as AddEditFormType
      newFormData.additionalImageUrls = newFormData.additionalImageUrls.map((item) => {
        if (item.id === id) {
          return {
            id,
            additionalImageUrl: newValue,
          }
        }
        return item
      })
      return newFormData
    })
  }, [])

  const handleOnSave = () => {
    // Call the DB, save/update the data
    setPastedImage(null)
  }

  return (
    <Stack spacing={2} height="100%" justifyContent="space-between">
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography>SFW</Typography>
          <Switch value={formData.sfw} onChange={handleSFWChange} />
          <Typography>NSFW</Typography>
        </Stack>
        <TextField label="Source URL" value={formData.sourceUrl} onChange={handleOnSourceUrlChange} size="small" />
        <Stack spacing={2}>
          <Typography>Additional urls</Typography>
          {formData.additionalImageUrls.map((item, index) => {
            const { additionalImageUrl, id } = item
            return (
              <Stack key={id} direction="row" alignItems="center" spacing={2}>
                <TextField
                  label={`Additional url ${index}`}
                  value={additionalImageUrl}
                  onChange={(event) => {
                    onAdditionalUrlChange(event.target.value, id)
                  }}
                  size="small"
                />
                <Box>
                  <IconButton onClick={() => onRemoveAdditionalUrl(id)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Stack>
            )
          })}
          <Box>
            <Button onClick={onAddAdditionalUrl} startIcon={<AddIcon />}>
              Add new additional url
            </Button>
          </Box>
          <Typography>Mime type: {formData.type}</Typography>
        </Stack>
        <TagsInput tags={formData.tags} setTags={handleSetTags} />
      </Stack>
      <Button onClick={handleOnSave}>Save</Button>
    </Stack>
  )
}
