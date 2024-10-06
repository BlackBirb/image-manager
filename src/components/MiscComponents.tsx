import { List, ListItem, ListItemProps, ListProps, Paper, PaperProps } from '@mui/material'
import { styled } from '@mui/material/styles'

export const SearchList = styled(List, {
  name: 'SearchList',
})<ListProps>(() => ({
  width: '100%',
  zIndex: 2,
  padding: 0,
}))

export const SearchListItem = styled(ListItem, {
  name: 'SearchListItem',
})<ListItemProps>(({ theme }) => ({
  '&.MuiListItem-root': {
    padding: 0,
    '&>.MuiButtonBase-root': {
      padding: theme.spacing(0.5),
    },
  },
}))

export const SearchListPaper = styled(Paper, {
  name: 'SearchListPaper',
})<PaperProps>(() => ({
  maxHeight: '300px',
}))
