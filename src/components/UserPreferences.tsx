import { Settings as SettingsIcon } from '@mui/icons-material'
import {
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Popover,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useState } from 'react'
import { DeleteDBModal } from 'src/components/DeleteDBModal'
import { ContentExplicityType, db } from 'src/db/db'
import { getUserPreferences } from 'src/db/useDb'

export const UserPreferences = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const preferences = useLiveQuery(getUserPreferences)

  const onToggleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl((prev) => {
      if (prev) return null
      return event.currentTarget
    })
  }, [])
  const handleOnMenuClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleOnDefaultImageExplicitility = (event: SelectChangeEvent) => {
    const val = event.target.value as ContentExplicityType
    db.user.update(preferences?.id, {
      defaultContentType: val,
    })
  }
  const handleOnChangePagination = (event: SelectChangeEvent) => {
    try {
      const valueAsNumber: number = parseInt(event.target.value)
      db.user.update(preferences?.id, {
        pagination: valueAsNumber,
      })
    } catch (err) {
      console.error('err: ', err)
    }
  }
  const handleOnDesignChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    // TODO: I might make it look completely different. (Probably not as lazy)
  }

  if (!preferences) return "Something's very wrong"

  return (
    <Box>
      <IconButton onClick={onToggleOpen}>
        <SettingsIcon />
      </IconButton>
      <Popover
        id="user-preferences-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={handleOnMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Paper sx={(theme) => ({ padding: theme.spacing(2), minWidth: 300 })}>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="default-image-explicitylity">Default Image Explicitility</InputLabel>
              <Select
                labelId="default-image-explicitylity"
                value={preferences.defaultContentType}
                onChange={handleOnDefaultImageExplicitility}
              >
                <MenuItem value="nsfw">NSFW</MenuItem>
                <MenuItem value="sfw">SFW</MenuItem>
                <MenuItem value="questionable">Questionable</MenuItem>
              </Select>
            </FormControl>
            <Typography>Grid type ?, Masory or normal grid</Typography>
            <Typography>Grid spacing ? </Typography>
            <FormControl fullWidth>
              <InputLabel id="pagination">Pagination</InputLabel>
              <Select
                labelId="pagination"
                value={preferences.pagination.toString()}
                onChange={handleOnChangePagination}
              >
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="20">20</MenuItem>
                <MenuItem value="50">50</MenuItem>
                <MenuItem value="100">100</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Folder Path" value={preferences.folderPath} disabled>
              The chosen path where the images are stored in the beginning of the app.
            </TextField>
            <FormControlLabel
              control={<Switch onChange={handleOnDesignChange} value={false} />}
              label="Exiting design"
            />
            <DeleteDBModal />
          </Stack>
        </Paper>
      </Popover>
    </Box>
  )
}
