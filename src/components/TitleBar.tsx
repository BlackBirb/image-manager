import {
  Minimize as MinimizeIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Close as CloseIcon,
  FilterNone as FilterNoneIcon,
} from '@mui/icons-material'
import { IconButton, Stack } from '@mui/material'
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
        {isMaximized ? <FilterNoneIcon fontSize="small" /> : <CheckBoxOutlineBlankIcon fontSize="small" />}
      </IconButton>
      <IconButton size="small" onClick={close} className="window-dragoff">
        <CloseIcon />
      </IconButton>
    </Stack>
  )
}
