// File that contains only @type
import 'styled-components';
import { defaultTheme } from '../styles/themes/default';

type ThemeType = typeof defaultTheme; // guarda as propriedades dentro do tema

// Criar tipagem para o module style-components
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {} // DefaultTheme (from styled-components)
}
