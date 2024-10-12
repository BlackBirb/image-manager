import { yupResolver } from '@hookform/resolvers/yup'
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { PropsWithChildren, useCallback } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ContentMaterialType, db } from 'src/db/db'
import * as yup from 'yup'

const validationSchema = yup
  .object({
    folderPath: yup.string().required(),
    defaultContentType: yup.string<ContentMaterialType>().required(),
    pagination: yup.number().required(),
  })
  .required()

type FormDataType = {
  folderPath: string
  defaultContentType: ContentMaterialType
  pagination: number
}

export const InitForm = () => {
  const { control, handleSubmit, setValue } = useForm<FormDataType>({
    defaultValues: {
      folderPath: '',
      defaultContentType: 'nsfw',
      pagination: 50,
    },
    resolver: yupResolver(validationSchema),
  })

  const handleChooseAPath = useCallback(() => {
    // electron open OS path choose thingy.
    setValue('folderPath', 'Some path')
  }, [])

  const onSubmit: SubmitHandler<FormDataType> = (data) => {
    console.info(data)
  }

  return (
    <Stack width="100%" height="100%" alignItems="center" justifyContent="center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2}>
            <Controller
              name="folderPath"
              control={control}
              render={({ field }) => {
                return <TextField {...field} label="Folder Path" disabled />
              }}
            />
            <Button onClick={handleChooseAPath}>Choose a path</Button>
          </Stack>
          <Controller
            name="defaultContentType"
            control={control}
            render={({ field }) => {
              return (
                <FormControl fullWidth>
                  <InputLabel id="default-image-explicitylity">Default Image Explicitility</InputLabel>
                  <Select labelId="default-image-explicitylity" {...field}>
                    <MenuItem value="nsfw">NSFW</MenuItem>
                    <MenuItem value="sfw">SFW</MenuItem>
                    <MenuItem value="questionable">Questionable</MenuItem>
                  </Select>
                </FormControl>
              )
            }}
          />
          <Controller
            name="pagination"
            control={control}
            render={({ field }) => {
              return (
                <FormControl fullWidth>
                  <InputLabel id="pagination">Pagination</InputLabel>
                  <Select labelId="pagination" {...field}>
                    <MenuItem value="20">20</MenuItem>
                    <MenuItem value="50">50</MenuItem>
                    <MenuItem value="100">100</MenuItem>
                  </Select>
                </FormControl>
              )
            }}
          />
        </Stack>
      </form>
    </Stack>
  )
}
