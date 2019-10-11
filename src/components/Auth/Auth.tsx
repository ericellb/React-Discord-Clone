import React, { useState, KeyboardEvent } from 'react';
import { useDispatch } from 'react-redux';
import {
  Paper,
  Button,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CardMedia,
  Slide,
  TextField,
  Grid,
  IconButton,
  Checkbox
} from '@material-ui/core';
import { GroupAdd, Person, ArrowBack } from '@material-ui/icons';
import axios from '../Api/api';

import createHashHistory from '../../history';
import { signIn } from '../../actions';

export default function Auth() {
  // Dispatch
  const dispatch = useDispatch();

  // Local state to control Modal Windows + Data fields
  const [mainVisible, setMainVisible] = useState(true);
  const [mainDirection, setMainDirection]: any = useState('left');
  const [createVisible, setCreateVisible] = useState(false);
  const [createDirection, setCreateDirection]: any = useState('left');
  const [loginVisible, setLoginVisible] = useState(false);
  const [loginDirection, setLoginDirection]: any = useState('left');
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState(false);
  const [userNameErrorMsg, setUserNameErrorMsg] = useState('');
  const [userPass, setUserPass] = useState('');
  const [userPassError, setUserPassError] = useState(false);
  const [userPassErrorMsg, setUserPassErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [serverIdle, setServerIdle] = useState(false);

  // Shows the main modal (sets transition directions and views to visible / non visible)
  const showMain = () => {
    setMainDirection('left');
    setMainVisible(true);
    setCreateVisible(false);
    setCreateDirection('right');
    setLoginVisible(false);
    setLoginDirection('right');
  };

  // Handles showing the Join Server window
  const showCreateAccount = () => {
    setCreateDirection('left');
    setMainDirection('right');
    setCreateVisible(true);
    setMainVisible(false);
  };

  // Handles showing the Create Server window
  const showLoginAccount = () => {
    setLoginDirection('left');
    setMainDirection('right');
    setLoginVisible(true);
    setMainVisible(false);
  };

  // Handles and checks keypress and calls the callback method
  const handleKeyPress = (e: KeyboardEvent, callBack: Function) => {
    if (e.key === 'Enter') {
      callBack();
    }
  };

  // Validates input and calls callback function
  const handleOnSubmit = (userName: string, userPass: string, callBack: Function) => {
    let error = false;
    if (userName === '') {
      setUserNameError(true);
      setUserNameErrorMsg('Name cannot be empty');
      error = true;
    } else setUserNameError(false);
    if (userPass.length < 6) {
      setUserPassError(true);
      setUserPassErrorMsg('Passwords must be 6 characters');
      error = true;
    } else setUserPassError(false);

    if (!error) {
      callBack();
    }
  };

  // Handles creation of account and calls sign in action
  const handleCreateAccount = async (userName: string, userPass: string) => {
    try {
      // encode username and userpass - it may have # $ & + ,  / : ; = ? @ [ ]
      userName = encodeURIComponent(userName);
      userPass = encodeURIComponent(userPass);
      setTimeout(() => {
        setServerIdle(true);
      }, 2000);
      const response = await axios.post(`/user/create?userName=${userName}&userPass=${userPass}`);
      setServerIdle(false);
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      dispatch(signIn(response.data));
      createHashHistory.push('/dashboard');
    } catch (err) {
      const errorData = err.response.data;
      if (errorData) {
        setUserNameError(true);
        setUserNameErrorMsg(errorData);
      }
    }
  };

  // Handles login of account and calls sign in action
  const handleLoginAccount = async (userName: string, userPass: string) => {
    // encode username and userpass - it may have # $ & + ,  / : ; = ? @ [ ]
    userName = encodeURIComponent(userName);
    userPass = encodeURIComponent(userPass);

    try {
      setTimeout(() => {
        setServerIdle(true);
      }, 2000);
      const response = await axios.get(`/user/login?userName=${userName}&userPass=${userPass}`);
      setServerIdle(false);
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      dispatch(signIn(response.data));
      createHashHistory.push('/dashboard');
    } catch (err) {
      const errorData = err.response.data;
      if (errorData) {
        setUserNameError(true);
        setUserNameErrorMsg(errorData);
        setUserPassError(true);
        setUserPassErrorMsg(errorData);
      }
    }
  };

  // Renders options to Create or Login to account
  const renderMain = () => {
    return (
      <Slide direction={mainDirection} in={mainVisible} timeout={350} mountOnEnter unmountOnExit>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item sm={12} xs={12}>
            <Typography variant="h5" color="primary" align="center">
              Create an account, or sign in!
            </Typography>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Card className="grid-card">
              <CardActionArea onClick={() => showCreateAccount()}>
                <CardContent>
                  <Typography variant="h5" color="primary" gutterBottom>
                    Create
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Create a new account.
                  </Typography>
                  <CardMedia>
                    <GroupAdd className="modal-card-icon" />
                  </CardMedia>
                  <Button variant="contained" color="primary">
                    Create
                  </Button>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Card className="grid-card">
              <CardActionArea onClick={() => showLoginAccount()}>
                <CardContent>
                  <Typography variant="h5" color="secondary" gutterBottom>
                    Login
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Sign in to an existing account.
                  </Typography>
                  <CardMedia>
                    <Person className="modal-card-icon" />
                  </CardMedia>
                  <Button variant="contained" color="secondary">
                    Login{' '}
                  </Button>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Slide>
    );
  };

  // Renders the form to create an account
  const renderCreateAccount = () => {
    return (
      <Slide direction={createDirection} in={createVisible} timeout={350} mountOnEnter unmountOnExit>
        <Grid container spacing={1} justify="center" alignItems="center">
          <Grid item xs={12}>
            <IconButton onClick={showMain}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" color="primary" align="center">
              Create Account
            </Typography>
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <TextField
              id="username"
              label="Username"
              value={userName}
              error={userNameError}
              helperText={userNameErrorMsg}
              onChange={e => setUserName(e.target.value)}
              margin="dense"
              autoComplete="off"
              variant="outlined"
              onKeyPress={e =>
                handleKeyPress(e, () =>
                  handleOnSubmit(userName, userPass, () => handleCreateAccount(userName, userPass))
                )
              }
            />
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <TextField
              id="password"
              label="Password"
              type="password"
              value={userPass}
              error={userPassError}
              helperText={userPassErrorMsg}
              onChange={e => setUserPass(e.target.value)}
              margin="dense"
              autoComplete="off"
              variant="outlined"
              onKeyPress={e =>
                handleKeyPress(e, () =>
                  handleOnSubmit(userName, userPass, () => handleCreateAccount(userName, userPass))
                )
              }
            />
          </Grid>
          <Grid item xs={12} className="grid-button">
            <div>
              Remember Me <Checkbox value={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOnSubmit(userName, userPass, () => handleCreateAccount(userName, userPass))}
            >
              Create
            </Button>
          </Grid>
          {serverIdle && (
            <div style={{ marginTop: '1em', fontSize: '18px', textAlign: 'center', fontFamily: 'roboto' }}>
              The server just woke up! Hold on for 5 seconds, while he munches a quick byte!
            </div>
          )}
        </Grid>
      </Slide>
    );
  };

  // Renders the form to login to account
  const renderLoginAccount = () => {
    return (
      <Slide direction={loginDirection} in={loginVisible} timeout={350} mountOnEnter unmountOnExit>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item xs={12}>
            <IconButton onClick={showMain}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" color="primary" align="center">
              Login Account
            </Typography>
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <TextField
              id="username"
              label="Username"
              value={userName}
              error={userNameError}
              helperText={userNameErrorMsg}
              onChange={e => setUserName(e.target.value)}
              margin="dense"
              autoComplete="off"
              variant="outlined"
              onKeyPress={e =>
                handleKeyPress(e, () =>
                  handleOnSubmit(userName, userPass, () => handleLoginAccount(userName, userPass))
                )
              }
            />
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <TextField
              id="password"
              label="Password"
              type="password"
              value={userPass}
              error={userPassError}
              helperText={userPassErrorMsg}
              onChange={e => setUserPass(e.target.value)}
              margin="dense"
              autoComplete="off"
              variant="outlined"
              onKeyPress={e =>
                handleKeyPress(e, () =>
                  handleOnSubmit(userName, userPass, () => handleLoginAccount(userName, userPass))
                )
              }
            />
          </Grid>
          <Grid item xs={12} className="grid-button">
            <div>
              Remember Me <Checkbox value={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
            </div>
            <Button
              className="modal-login-button"
              variant="contained"
              color="primary"
              onClick={() => handleOnSubmit(userName, userPass, () => handleLoginAccount(userName, userPass))}
            >
              Login
            </Button>
          </Grid>
          {serverIdle && (
            <div style={{ marginTop: '1em', fontSize: '18px', textAlign: 'center', fontFamily: 'roboto' }}>
              The server just woke up! Hold on for 5 seconds, while he munches a quick byte!
            </div>
          )}
        </Grid>
      </Slide>
    );
  };

  return (
    <div className="auth-wrapper">
      <Paper className="container-prompt">
        {renderMain()}
        {renderCreateAccount()}
        {renderLoginAccount()}
      </Paper>
    </div>
  );
}
