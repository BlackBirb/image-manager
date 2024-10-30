import { Settings as SettingsIcon } from '@mui/icons-material'
import { Box, IconButton, styled } from '@mui/material'

const EditButtonWrapper = styled('div', {
  name: 'EditButtonWrapper',
})(() => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '80px',
  height: '80px',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'start',
  justifyContent: 'flex-end',
  '&:hover': {
    opacity: 1,
  },
}))

type HoverEffectType = {
  withoutHoverEffect?: boolean
}

const HoverEffect = styled('div', {
  name: 'HoverEffect',
  shouldForwardProp: (prop) => prop !== 'withoutHoverEffect',
})<HoverEffectType>(({ withoutHoverEffect }) => ({
  position: 'absolute',
  inset: 0,
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  backgroundColor: withoutHoverEffect ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.2)',
  zIndex: 3,
  '&:hover': {
    opacity: 1,
  },
}))

type ContentHoverEffectProps = {
  withoutHoverEffect?: boolean
  onEditContent: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const ContentHoverEffect = (props: ContentHoverEffectProps) => {
  const { withoutHoverEffect, onEditContent } = props
  return (
    <HoverEffect withoutHoverEffect={withoutHoverEffect}>
      <EditButtonWrapper>
        <Box p={0.5}>
          <IconButton onClick={onEditContent}>
            <SettingsIcon />
          </IconButton>
        </Box>
      </EditButtonWrapper>
    </HoverEffect>
  )
}
