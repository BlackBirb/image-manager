import { IconButton, Stack } from '@mui/material'
import {
  Minimize as MinimizeIcon,
  CollectionsBookmark as CollectionsBookmarkIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { useElectronApi } from 'src/hooks/useElectronApi'
export const TitleBar = () => {
  const electronApi = useElectronApi()

  const minimize = () => {
    electronApi.minimize()
  }
  const maximize = () => {
    electronApi.maximize()
  }
  const close = () => {
    electronApi.close()
  }
  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-end" p={0.5}>
      <IconButton size="small" onClick={minimize}>
        <MinimizeIcon />
      </IconButton>
      <IconButton size="small" onClick={maximize}>
        <CollectionsBookmarkIcon />
      </IconButton>
      <IconButton size="small" onClick={close}>
        <CloseIcon />
      </IconButton>
    </Stack>
  )
}
