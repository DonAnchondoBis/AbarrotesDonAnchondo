'use client'
import themeConfig from '~/app/UI/Theme/createTheme'
import { ThemeProvider, CssBaseline } from '@mui/material'

const ThemeRegistry = ({ children }) => (
  <ThemeProvider theme={themeConfig}>
    <CssBaseline />
    {children}
  </ThemeProvider>
)

export default ThemeRegistry