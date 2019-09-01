import React from 'react';
import { useDispatch } from 'react-redux';
import { HashRouter, Route } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import './App.css';
import Dashboard from '../Dashboard/Dashboard';
import Auth from '../Auth/Auth';
import { signIn } from '../../actions';
import createHashHistory from '../../history';

function App() {
  // Dispatch
  const dispatch = useDispatch();

  // Check local storage if have login info
  // Dispatch sign in action with our userId and redirect to dashboard
  const checkLocalStorageAuth = () => {
    let user = JSON.parse(localStorage.getItem('user')!);
    if (user) {
      dispatch(signIn(user));
      createHashHistory.push('/dashboard');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        {checkLocalStorageAuth()}
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/" exact component={Auth} />
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;

const theme = createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '14px',
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
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600
  }
});
