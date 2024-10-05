import { styled } from '@mui/material/styles'
import { TitleBar } from 'src/components/TitleBar'
import { Search } from 'src/components/Search'
import { ClipboardListener } from './ClipboardListener'
import { ImagePreview } from './ImagePreview'

const GridLayout = styled('div', {
  name: 'GridLayout',
})(() => ({
  display: 'grid',
  height: '100%',
  width: '100%',
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto 64px 1fr',
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
        <Search />
        <ClipboardListener />
        <ImagePreview />
      </Main>
      <div>b</div>
    </GridLayout>
  )
}
