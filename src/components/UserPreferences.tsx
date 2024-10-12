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
import { useCallback, useState } from 'react'

export const UserPreferences = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

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
    // setAge(event.target.value as string);
  }
  const handleOnChangePagination = (event: SelectChangeEvent) => {
    // setAge(event.target.value as string);
  }
  const handleOnDesignChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    // setAge(event.target.value as string);
  }
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
              <Select labelId="default-image-explicitylity" value="nsfw" onChange={handleOnDefaultImageExplicitility}>
                <MenuItem value="nsfw">NSFW</MenuItem>
                <MenuItem value="sfw">SFW</MenuItem>
                <MenuItem value="questionable">Questionable</MenuItem>
              </Select>
            </FormControl>
            <Typography>Grid type ?, Masory or normal grid</Typography>
            <Typography>Grid spacing ? </Typography>
            <FormControl fullWidth>
              <InputLabel id="pagination">Pagination</InputLabel>
              <Select labelId="pagination" value="50" onChange={handleOnChangePagination}>
                <MenuItem value="20">20</MenuItem>
                <MenuItem value="50">50</MenuItem>
                <MenuItem value="100">100</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Folder Path" disabled>
              The chosen path where the images are stored in the beginning of the app.
            </TextField>
            <FormControlLabel
              control={<Switch onChange={handleOnDesignChange} value={false} />}
              label="Exiting design"
            />
          </Stack>
        </Paper>
      </Popover>
    </Box>
  )
}
