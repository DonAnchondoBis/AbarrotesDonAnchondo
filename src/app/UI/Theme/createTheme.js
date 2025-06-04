// import '@fontsource-variable/fira-code'
// import '@fontsource/ubuntu'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import colors from './colors'

const theme = createTheme({
  typography: {
    // fontFamily: 'Ubuntu',
    h1: {
      fontWeight: 'bold',
      // fontFamily: 'Fira Code Variable',
    },
    h2: {
      fontWeight: 'bold',
      // fontFamily: 'Fira Code Variable',
    },
    h3: {
      fontWeight: 'bold',
      // fontFamily: 'Fira Code Variable',
    },
    h4: {
      // fontFamily: 'Fira Code Variable',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.825rem',
    },
  },
  palette: {
    ...colors
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          paddingBlock: '2rem',
          paddingInline: '1rem',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontSize: '16px',
        },
        body: {
          backgroundColor: '#FEF7E5',
        },
      },
    },
  },
})

export default responsiveFontSizes(theme)