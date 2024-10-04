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
    electronApi.toggleMaximize()
  }
  const close = () => {
    electronApi.close()
  }
  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-end" p={0.5} className="window-dragon">
      <IconButton size="small" onClick={minimize} className="window-dragoff">
        <MinimizeIcon />
      </IconButton>
      <IconButton size="small" onClick={maximize} className="window-dragoff">
        <CollectionsBookmarkIcon />
      </IconButton>
      <IconButton size="small" onClick={close} className="window-dragoff">
        <CloseIcon />
      </IconButton>
    </Stack>
  )
}
