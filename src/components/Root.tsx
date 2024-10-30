import { Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { AddContentContainer } from 'src/components/FormComponents/AddContentContainer'
import { EditContentContainer } from 'src/components/FormComponents/EditContentContainer'
import { FullImagePreview } from 'src/components/FullImagePreivew'
import { ImageGallery } from 'src/components/ImageGallery'
import { Search } from 'src/components/SearchComponents/Search'
import { TitleBar } from 'src/components/TitleBar'
import { UserPreferences } from 'src/components/UserPreferences'

import { ClipboardListener } from './ClipboardListener'
import { AddEditImageContainer } from './FormComponents/AddEditContentContainer'

const GridLayout = styled('div', {
  name: 'GridLayout',
})(() => ({
  display: 'grid',
  height: '100%',
  width: '100%',
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto 1fr',
  gridColumnGap: '0px',
  gridRowGap: '8px',
}))

const Main = styled('section', {
  name: 'Main',
})(() => ({
  display: 'grid',
  height: '100%',
  width: '100%',
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto 1fr',
  gridColumnGap: '0px',
  gridRowGap: '8px',
}))

export const Root = () => {
  return (
    <GridLayout id="GridLayout">
      <div id="header">
        <TitleBar />
      </div>
      <Main id="main">
        <Stack>
          <Stack direction="row" justifyContent="space-between" pl={4} pr={2}>
            <Search />
            <UserPreferences />
          </Stack>
        </Stack>
        <Stack height="100%">
          <ImageGallery />
        </Stack>
      </Main>
      <FullImagePreview />
      <AddContentContainer />
      <EditContentContainer />
      <ClipboardListener />
    </GridLayout>
  )
}
