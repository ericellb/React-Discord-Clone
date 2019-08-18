import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Paper, Button, Card, CardContent, Typography, CardActionArea, CardMedia, Slide, TextField, Grid } from '@material-ui/core';
import { GroupAdd, Person } from '@material-ui/icons';
import axios from '../Api/api';

import createHashHistory from '../../history';
import { signIn } from '../../actions';

export default function Auth() {

  // Dispatch 
  const dispatch = useDispatch();

  // Local state to control Modal Windows + Data fields
  const [mainVisible, setMainVisible] = useState(true);
  const [mainDirection, setMainDirection] = useState('left');
  const [createVisible, setCreateVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState(false);
  const [userNameErrorMsg, setUserNameErrorMsg] = useState(false);
  const [userPass, setUserPass] = useState('');
  const [userPassError, setUserPassError] = useState(false);
  const [userPassErrorMsg, setUserPassErrorMsg] = useState(false)

  // Handles showing the Join Server window
  const showCreateAccount = () => {
    setMainDirection('right');
    setCreateVisible(true);
    setMainVisible(false);
  }

  // Handles showing the Create Server window
  const showLoginAccount = () => {
    setMainDirection('right');
    setLoginVisible(true);
    setMainVisible(false);
  }

  // Handles keypress and calls the callback method
  const handleKeyPress = (e, callbackMethod) => {
    if (e.key === "Enter") {
      callbackMethod();
    }
  }


  // Validates input and calls callback function
  const handleOnSubmit = (userName, userPass, callBack) => {
    let error = false;
    if (userName === '') {
      setUserNameError(true);
      setUserNameErrorMsg('Name cannot be empty');
      error = true;
    }
    else setUserNameError(false);
    if (userPass.length < 6) {
      setUserPassError(true);
      setUserPassErrorMsg('Passwords must be 6 characters');
      error = true;
    }
    else setUserPassError(false);

    if (!error) {
      callBack();
    }
  }

  // Handles creation of account and calls sign in action
  const createAccount = async (userName, userPass) => {
    try {
      const response = await axios.post(`/user/create?userName=${userName}&userPass=${userPass}`);
      localStorage.setItem('user', JSON.stringify(response.data));
      dispatch(signIn(response.data));
      createHashHistory.push('/dashboard');
    }
    catch (err) {
      const errorData = err.response.data;
      if (errorData) {
        setUserNameError(true);
        setUserNameErrorMsg(errorData);
      }
    }
  }

  // Handles login of account and calls sign in action
  const loginAccount = async (userName, userPass) => {
    try {
      const response = await axios.get(`/user/login?userName=${userName}&userPass=${userPass}`);
      localStorage.setItem('user', JSON.stringify(response.data));
      dispatch(signIn(response.data));
      createHashHistory.push('/dashboard');
    }
    catch (err) {
      const errorData = err.response.data;
      if (errorData) {
        setUserNameError(true);
        setUserNameErrorMsg(errorData);
        setUserPassError(true);
        setUserPassErrorMsg(errorData)
      }
    }
  }

  // Renders main screen to create or login
  const renderMain = () => {
    return (
      <Slide direction={mainDirection} in={mainVisible} timeout={350} mountOnEnter unmountOnExit>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item sm={12} xs={12}>
            <Typography variant="h5" color="primary" align="center">Create an account, or sign in!</Typography>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Card className="grid-card">
              <CardActionArea onClick={() => showCreateAccount()}>
                <CardContent>
                  <Typography variant="h5" color="primary" gutterBottom>Create</Typography>
                  <Typography variant="body1" paragraph>Create a new account.</Typography>
                  <CardMedia>
                    <GroupAdd className="modal-card-icon" />
                  </CardMedia>
                  <Button variant="contained" color="primary">Create</Button>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Card className="grid-card">
              <CardActionArea onClick={() => showLoginAccount()}>
                <CardContent>
                  <Typography variant="h5" color="secondary" gutterBottom>Login</Typography>
                  <Typography variant="body1" paragraph>Sign in to an existing account.</Typography>
                  <CardMedia>
                    <Person className="modal-card-icon" />
                  </CardMedia>
                  <Button variant="contained" color="secondary">Login </Button>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Slide>
    )
  }

  // Renders create account form
  const renderCreateAccount = () => {
    return (
      <Slide direction="left" in={createVisible} timeout={350} mountOnEnter unmountOnExit >
        <Grid container spacing={1} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" color="primary" align="center">Create Account</Typography>
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <TextField
              id="username"
              label="Username"
              values={userName}
              error={userNameError}
              helperText={userNameErrorMsg}
              onChange={(e) => setUserName(e.target.value)}
              margin="dense"
              autoComplete="off"
              variant="outlined"
              onKeyPress={(e) => handleKeyPress(e, () => handleOnSubmit(userName, userPass, () => createAccount(userName, userPass)))}
            />
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <TextField
              id="password"
              label="Password"
              type="password"
              values={userPass}
              error={userPassError}
              helperText={userPassErrorMsg}
              onChange={(e) => setUserPass(e.target.value)}
              margin="dense"
              autoComplete="off"
              variant="outlined"
              onKeyPress={(e) => handleKeyPress(e, () => handleOnSubmit(userName, userPass, () => createAccount(userName, userPass)))}
            />
          </Grid>
          <Grid item xs={12} className="grid-button">
            <Button variant="contained" color="primary" onClick={() => handleOnSubmit(userName, userPass, () => createAccount(userName, userPass))}>Create</Button>
          </Grid>
        </Grid>
      </Slide >
    )
  }

  const renderLoginAccount = () => {
    return (
      <Slide direction="left" in={loginVisible} timeout={350} mountOnEnter unmountOnExit>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" color="primary" align="center">Login Account</Typography>
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <TextField
              id="username"
              label="Username"
              values={userName}
              error={userNameError}
              helperText={userNameErrorMsg}
              onChange={(e) => setUserName(e.target.value)}
              margin="dense"
              autoComplete="off"
              variant="outlined"
              onKeyPress={(e) => handleKeyPress(e, () => handleOnSubmit(userName, userPass, () => loginAccount(userName, userPass)))}
            />
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <TextField
              id="password"
              label="Password"
              type="password"
              values={userPass}
              error={userPassError}
              helperText={userPassErrorMsg}
              onChange={(e) => setUserPass(e.target.value)}
              margin="dense"
              autoComplete="off"
              variant="outlined"
              onKeyPress={(e) => handleKeyPress(e, () => handleOnSubmit(userName, userPass, () => loginAccount(userName, userPass)))}
            />
          </Grid>
          <Grid item xs={12} className="grid-button">
            <Button className="modal-login-button" variant="contained" color="primary" onClick={() => handleOnSubmit(userName, userPass, () => loginAccount(userName, userPass))}>Login</Button>
          </Grid>
        </Grid>
      </Slide >
    )
  }

  return (
    <div className="auth-wrapper">
      <Paper className="container-prompt">
        {renderMain()}
        {renderCreateAccount()}
        {renderLoginAccount()}
      </Paper >
    </div >
  )
}
