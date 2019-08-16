import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles';

import './App.css';
import Dashboard from '../Dashboard/Dashboard';
import Auth from '../Auth/Auth';

function App() {

  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Route path="/" exact component={Auth} />
        <Route path="/dashboard" exact component={Dashboard} />
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;



const theme = createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "16px",
        backgroundColor: 'black'
      }
    },
    MuiSnackbarContent: {
      root: {
        backgroundColor: '#202225',
        color: 'white'
      }
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: '#36393E',
        position: 'absolute'
      }
    }
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#7289da'
    },
    secondary: {
      main: '#3ca374'
    }
  },
  typography: {
    "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    "fontSize": 14,
    "fontWeightLight": 400,
    "fontWeightRegular": 500,
    "fontWeightMedium": 600
  }

});