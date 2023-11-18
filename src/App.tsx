import { ThemeProvider } from 'styled-components' // Import Theme Provider
import { defaultTheme } from './styles/themes/default' // Default Theme Created
import { GlobalStyle } from './styles/global'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { CyclesContextProvider } from './contexts/CyclesContext'

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={defaultTheme}>
        <CyclesContextProvider>
          <Router />
        </CyclesContextProvider>
      <GlobalStyle></GlobalStyle>
    </ThemeProvider>
    </BrowserRouter >
  )
}
