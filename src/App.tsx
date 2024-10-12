import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Root } from 'src/components/Root'
import { State } from 'src/state/State'
import './main.css'
import { InitApp } from 'src/state/InitApp'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <State>
        <InitApp>
          <Root />
        </InitApp>
      </State>
    </ThemeProvider>
  )
}

export default App
