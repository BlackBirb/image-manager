import { styled } from '@mui/material/styles'
import { Search } from 'src/components/Search'
import { TitleBar } from 'src/components/TitleBar'

import { ClipboardListener } from './ClipboardListener'
import { ImagePreview } from './ImagePreview'
import { Stack } from '@mui/material'
import { UserPreferences } from 'src/components/UserPreferences'

const GridLayout = styled('div', {
  name: 'GridLayout',
})(() => ({
  display: 'grid',
  height: '100%',
  width: '100%',
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto 1fr',
  gridColumnGap: '0px',
  gridRowGap: '0px',
}))

const Main = styled('section', {
  name: 'Main',
})(({ theme }) => ({
  height: '100%',
  width: '100%',
  padding: theme.spacing(4)
}))

export const Root = () => {
  return (
    <GridLayout>
      <div id="header">
        <TitleBar />
      </div>
      <Main id="main">
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Search />
          <UserPreferences />
        </Stack>
        <div>b</div>
        <ClipboardListener />
        <ImagePreview />
      </Main>
    </GridLayout>
  )
}
