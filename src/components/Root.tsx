import { Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ImageGallery } from 'src/components/ImageGallery'
import { Search } from 'src/components/SearchComponents/Search'
import { TitleBar } from 'src/components/TitleBar'
import { UserPreferences } from 'src/components/UserPreferences'

import { ClipboardListener } from './ClipboardListener'
import { ImagePreview } from './ImagePreview'

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
})(() => ({
  height: '100%',
  width: '100%',
}))

export const Root = () => {
  return (
    <GridLayout>
      <div id="header">
        <TitleBar />
      </div>
      <Main id="main">
        <Stack height="100%">
          <Stack direction="row" justifyContent="space-between" pl={4} pr={2}>
            <Search />
            <UserPreferences />
          </Stack>
          <Stack flexGrow={1} p={4}>
            <ImageGallery />
          </Stack>
        </Stack>
        <ClipboardListener />
        <ImagePreview />
      </Main>
    </GridLayout>
  )
}
