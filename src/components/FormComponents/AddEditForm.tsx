import { yupResolver } from '@hookform/resolvers/yup'
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material'
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { TagsInput } from 'src/components/FormComponents/TagsInput'
import { ContentExplicityType, ContentType, db, Tag } from 'src/db/db'
import { saveImage } from 'src/hooks/useElectronApi'
import { ClipboardStateContext } from 'src/state/clipboardState.context'
import { v4 as uuid } from 'uuid'
import * as yup from 'yup'

type FormAdditionalImageUrlType = {
  additionalImageUrl: string
}

type FormTagsType = {
  tag: string
}

const validationSchema = yup
  .object({
    id: yup.string().required(),
    contentType: yup.string<ContentExplicityType>().required(),
    // Typescript didn't actually notice it was setting Tag[] into a string[]..
    tags: yup
      .array(
        yup.object({
          tag: yup.string().required(),
        }),
      )
      .required(),
    sourceUrl: yup.string().required(),
    additionalImageUrls: yup
      .array(
        yup.object({
          additionalImageUrl: yup.string().required(),
        }),
      )
      .required(),
    type: yup.string<ContentType>().required(),
  })
  .required()

type AddEditFormType = {
  id: string
  contentType: ContentExplicityType
  tags: FormTagsType[]
  sourceUrl: string
  additionalImageUrls: FormAdditionalImageUrlType[]
  type: ContentType
}

const defaultNewFormData: AddEditFormType = {
  id: uuid(),
  contentType: 'nsfw', // TODO fetch user preferences
  tags: [],
  sourceUrl: '',
  additionalImageUrls: [],
  type: 'image',
}

export const AddEditForm = () => {
  const {
    data: { pastedImage },
    api: { setPastedImage },
  } = useContext(ClipboardStateContext)

  const { control, handleSubmit, setValue, watch } = useForm<AddEditFormType>({
    defaultValues: defaultNewFormData,
    resolver: yupResolver(validationSchema),
  })

  const watchType = watch('type')

  const additionalImageUrlsFieldArray = useFieldArray<AddEditFormType>({
    name: 'additionalImageUrls',
    control,
  })

  const onSubmit = async () => {
    // Call the DB, save/update the data
    if (!pastedImage) {
      console.error('No image data to save!')
      return
    }
    const [commitImage] = saveImage(pastedImage)
    const info = await commitImage()
    console.info('[Clipboard] commit Image', info)

    // add non-existing tags
    const newTags: { [key: string]: Tag } = Object.fromEntries(formData.tags.map((tag) => [tag.name, tag]))
    const existingTags = await db.tags.where('name').anyOf(Object.keys(newTags)).toArray()

    for (const tag of existingTags) {
      delete newTags[tag.name]
    }

    db.tags.bulkAdd(Object.values(newTags))

    // db.content.add({
    //   additionalUrls:
    // })

    setPastedImage(null)
  }

  useEffect(() => {
    if (pastedImage instanceof URL) setValue('sourceUrl', pastedImage.href)
  }, [pastedImage])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} height="100%" justifyContent="space-between">
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Controller
              name="contentType"
              control={control}
              render={({ field }) => {
                return (
                  <FormControl fullWidth>
                    <InputLabel id="default-image-explicity">Default Image Explicity</InputLabel>
                    <Select labelId="default-image-explicity" {...field}>
                      <MenuItem value="nsfw">NSFW</MenuItem>
                      <MenuItem value="sfw">SFW</MenuItem>
                      <MenuItem value="questionable">Questionable</MenuItem>
                    </Select>
                  </FormControl>
                )
              }}
            />
          </Stack>
          <Controller
            name="sourceUrl"
            control={control}
            render={({ field }) => {
              return <TextField {...field} label="Source URL" size="small" />
            }}
          />
          <Stack spacing={2}>
            <Typography>Additional urls</Typography>
            {additionalImageUrlsFieldArray.fields.map((item, index) => {
              return (
                <Controller
                  key={item.id}
                  name="contentType"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <TextField {...field} label={`Additional url ${index}`} size="small" />
                        <Box>
                          <IconButton onClick={() => additionalImageUrlsFieldArray.remove(index)}>
                            <CloseIcon />
                          </IconButton>
                        </Box>
                      </Stack>
                    )
                  }}
                />
              )
            })}
            <Box>
              <Button onClick={() => additionalImageUrlsFieldArray.append('')} startIcon={<AddIcon />}>
                Add new additional url
              </Button>
            </Box>
            <Typography>Mime type: {watchType}</Typography>
          </Stack>
          {/* TODO: make the tags and add/delete functions */}
          <TagsInput tags={formData.tags} addTag={() => {}} deleteTag={() => {}} />
        </Stack>
        <Button type="submit">Save</Button>
      </Stack>
    </form>
  )
}
