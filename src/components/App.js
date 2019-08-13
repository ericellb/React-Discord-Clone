import React, { useEffect } from 'react';
import './App.css';
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles';
import { getInitialData } from '../actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import Sidebar from './Sidebar/Sidebar';
import Messages from './Messages';
import SendMessage from './SendMessage.jsx';

function App() {

  // Get user store
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Listens for changes on isSignedIn
  // Gets initial user data upon change
  useEffect(() => {
    if (user.isSignedIn)
      dispatch(getInitialData(user.userId));
  }, [dispatch, user])


  return (
    <ThemeProvider theme={theme}>
      <div className="grid-container">

        <div className="sidebar-grid">
          <Sidebar />
        </div>

        <div className="messages-grid">
          <Messages />
        </div>

        <div className="send-messages-grid">
          <SendMessage />
        </div>

      </div >
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
    }
  },
  typography: {
    "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    "fontSize": 14,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
  }

});