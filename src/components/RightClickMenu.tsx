import { Collapse, List, ListItemButton, ListItemText, Paper } from '@mui/material'
import { useCallback } from 'react'

export type MousePositionType = {
  x: number
  y: number
}

type RightClickMenuProps = {
  mousePosition: MousePositionType | null
  sourceUrl?: string
  onCloseMenu: () => void
  disabled?: boolean
}

export const RightClickMenu = (props: RightClickMenuProps) => {
  const { mousePosition, sourceUrl, onCloseMenu, disabled } = props

  const handleOnCopyImage = useCallback(
    (event: React.MouseEvent<HTMLDivElement> | undefined) => {
      if (event) {
        event.stopPropagation()
      }
      // TODO: copy image
      // navigator.clipboard.write()
      onCloseMenu()
    },
    [onCloseMenu],
  )

  const handleOnCopySourceUrl = useCallback(
    (event: React.MouseEvent<HTMLDivElement> | undefined) => {
      if (event) {
        event.stopPropagation()
      }
      if (!sourceUrl) return
      navigator.clipboard.writeText(sourceUrl)
      onCloseMenu()
    },
    [onCloseMenu, sourceUrl],
  )

  return (
    <Paper
      style={{
        display: mousePosition ? 'block' : 'none',
        position: 'fixed',
        top: mousePosition ? mousePosition?.y + 6 : 0,
        left: mousePosition?.x,
        zIndex: 11,
      }}
    >
      <Collapse in={Boolean(mousePosition)}>
        <List>
          <ListItemButton onClick={handleOnCopyImage}>
            <ListItemText primary="Copy image" />
          </ListItemButton>
          <ListItemButton onClick={handleOnCopySourceUrl} disabled={disabled}>
            <ListItemText primary="Copy source url" />
          </ListItemButton>
        </List>
      </Collapse>
    </Paper>
  )
}
