import { ThemeProvider } from 'styled-components'; // Import Theme Provider
import { defaultTheme } from './styles/themes/default'; // Default Theme Created

import { Button } from "./components/Button";

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Button variant="primary"/>
      <Button variant="secondary"/>
      <Button variant="success"/>
      <Button variant="danger"/>
      <Button/>
    </ThemeProvider>
  )
}
