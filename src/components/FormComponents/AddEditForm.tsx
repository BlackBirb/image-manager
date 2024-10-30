import { yupResolver } from '@hookform/resolvers/yup'
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { FormSearchTag } from 'src/components/FormComponents/FormSearchTag'
import { ContentExplicityType, ContentType, db, Tag, TagName } from 'src/db/db'
import { saveImage } from 'src/hooks/useElectronApi'
import { ClipboardStateContext } from 'src/state/clipboardState.context'
import { ErrorStateContext } from 'src/state/errorState.context'
import * as yup from 'yup'

type FormAdditionalImageUrlType = {
  additionalImageUrl: string
}

type FormTagsType = {
  tag: TagName
}

const validationSchema = yup
  .object({
    contentType: yup.string<ContentExplicityType>().required(),
    // Typescript didn't actually notice it was setting Tag[] into a string[]..
    tags: yup
      .array(
        yup.object({
          tag: yup.string<TagName>().required(),
        }),
      )
      .required(),
    sourceUrl: yup.string(),
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

export type AddEditFormType = {
  contentType: ContentExplicityType
  tags: FormTagsType[]
  sourceUrl: string
  additionalImageUrls: FormAdditionalImageUrlType[]
  type: ContentType
}

const defaultNewFormData: AddEditFormType = {
  contentType: 'nsfw', // TODO fetch user preferences
  tags: [],
  sourceUrl: '',
  additionalImageUrls: [],
  type: 'image',
}

type AddEditFormProps = {
  editingId?: string
  defaultValues?: AddEditFormType
  handleCloseForm?: () => void
}

// TODO: make it work for edit.
export const AddEditForm = (props: AddEditFormProps) => {
  const { editingId, defaultValues, handleCloseForm } = props
  console.log('AddEditForm editingId: ', editingId)

  // Maybe move these contexts outside.
  const {
    data: { pastedImage },
    api: { setPastedImage },
  } = useContext(ClipboardStateContext)
  const {
    api: { throwError },
  } = useContext(ErrorStateContext)

  // Maybe move this handle outside the AddEdit form.
  const [imageHandle, setImageHandle] = useState<ReturnType<typeof saveImage> | null>(null)

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddEditFormType>({
    defaultValues: defaultValues || defaultNewFormData,
    resolver: yupResolver(validationSchema),
  })

  const watchType = watch('type')
  const watchTags = watch('tags')
  const watchAll = watch()
  console.log('watchAll: ', watchAll)
  console.log('errors: ', errors)

  const additionalImageUrlsFieldArray = useFieldArray({
    name: 'additionalImageUrls',
    control,
  })

  const tagFieldArray = useFieldArray({
    name: 'tags',
    control,
  })

  const onAddNew = useCallback(
    async (data: AddEditFormType) => {
      console.log('onSubmit onAddNew data: ', data)
      // Call the DB, save/update the data
      if (!pastedImage) {
        console.error('No image data to save!')
        return
      }
      if (!imageHandle) {
        console.error('Missing image handle!')
        return
      }
      const [commitImage, _] = imageHandle

      const info = await commitImage()
      console.info('[Clipboard] commit Image', info)
      if (info === false) {
        throwError('Failed to save image file!')
        return
      }
      const dateTime = Date.now()

      const tagsAsStringArray: TagName[] = data.tags
        .map((t) => t.tag)
        // Filter duplicate values just in case the append function missed.
        .filter((t, index, array) => array.indexOf(t) === index)

      // add non-existing tags
      const tagsToAddToDB: TagName[] = []
      const existingTags = await db.tags.where('name').anyOf(tagsAsStringArray).toArray()

      for (const t of tagsAsStringArray) {
        const foundTag = existingTags.find((exT) => exT.name === t)
        if (!foundTag) {
          tagsToAddToDB.push(t)
        }
      }

      db.tags.bulkAdd(
        tagsToAddToDB.map<Tag>((t) => {
          return {
            name: t,
            createdAt: dateTime,
            updatedAt: dateTime,
          }
        }),
      )

      db.content.add({
        id: info.hash,
        additionalUrls: data.additionalImageUrls.map((u) => u.additionalImageUrl),
        tags: tagsAsStringArray,
        sourceUrl: data.sourceUrl,
        type: data.type,
        contentType: data.contentType,
        ext: info.ext,
        createdAt: dateTime,
        updatedAt: dateTime,
      })
      setPastedImage(null)
    },
    [imageHandle, pastedImage, setPastedImage, throwError],
  )

  const onEdit = useCallback(
    async (data: AddEditFormType) => {
      console.log('onSubmit onEdit data: ', data)

      const dateTime = Date.now()

      // From here -----
      const tagsAsStringArray: TagName[] = data.tags
        .map((t) => t.tag)
        // Filter duplicate values just in case the append function missed.
        .filter((t, index, array) => array.indexOf(t) === index)

      // add non-existing tags
      const tagsToAddToDB: TagName[] = []
      const existingTags = await db.tags.where('name').anyOf(tagsAsStringArray).toArray()

      for (const t of tagsAsStringArray) {
        const foundTag = existingTags.find((exT) => exT.name === t)
        if (!foundTag) {
          tagsToAddToDB.push(t)
        }
      }

      db.tags.bulkAdd(
        tagsToAddToDB.map<Tag>((t) => {
          return {
            name: t,
            createdAt: dateTime,
            updatedAt: dateTime,
          }
        }),
      )
      // ----- is copy pasta from above. maybe make it a function

      db.content.update(editingId, {
        additionalUrls: data.additionalImageUrls.map((u) => u.additionalImageUrl),
        tags: tagsAsStringArray,
        sourceUrl: data.sourceUrl,
        type: data.type,
        contentType: data.contentType,
        updatedAt: dateTime,
      })

      if (handleCloseForm) {
        handleCloseForm()
      }
    },
    [editingId],
  )

  const onSubmit: SubmitHandler<AddEditFormType> = async (data) => {
    if (editingId) {
      onEdit(data)
    } else {
      onAddNew(data)
    }
  }

  const handleAddNewTag = useCallback(
    (newTag: TagName) => {
      const tagExists = watchTags.find((t) => t.tag === newTag)
      if (tagExists) return
      tagFieldArray.append({
        tag: newTag,
      })
    },
    [watchTags],
  )

  useEffect(() => {
    if (pastedImage !== null) {
      console.info('Prefetching image: ', pastedImage)
      setImageHandle(saveImage(pastedImage))
    }

    if (pastedImage instanceof URL) setValue('sourceUrl', pastedImage.href)
  }, [pastedImage])

  return (
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
                name={`additionalImageUrls.${index}.additionalImageUrl`}
                control={control}
                render={({ field }) => {
                  return (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <TextField {...field} label={`Additional url ${index + 1}`} size="small" />
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
            <Button
              onClick={() =>
                additionalImageUrlsFieldArray.append({
                  additionalImageUrl: '',
                })
              }
              startIcon={<AddIcon />}
            >
              Add new additional url
            </Button>
          </Box>
          <Typography>Mime type: {watchType}</Typography>
        </Stack>
        <FormSearchTag onAddTag={handleAddNewTag} />
        <Stack direction="row" spacing={1}>
          {tagFieldArray.fields.map((item, index) => {
            return <Chip key={item.id} label={item.tag} onDelete={() => tagFieldArray.remove(index)} />
          })}
        </Stack>
      </Stack>
      <Button onClick={handleSubmit(onSubmit)}>Save</Button>
    </Stack>
  )
}
