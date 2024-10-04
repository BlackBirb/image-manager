import { IconButton, Stack } from '@mui/material'
import {
  Minimize as MinimizeIcon,
  CollectionsBookmark as CollectionsBookmarkIcon,
  Close as CloseIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material'
import { useElectronApi, useWindowMaximize } from 'src/hooks/useElectronApi'

export const TitleBar = () => {
  const electronApi = useElectronApi()

  const [isMaximized, toggleMaximize] = useWindowMaximize()

  const minimize = () => {
    electronApi.minimize()
  }
  const maximize = async () => {
    toggleMaximize()
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
        {isMaximized ? <CollectionsBookmarkIcon /> : <BookmarkIcon />}
      </IconButton>
      <IconButton size="small" onClick={close} className="window-dragoff">
        <CloseIcon />
      </IconButton>
    </Stack>
  )
}
