import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Paper, Button, Card, CardContent, Typography, CardActionArea, CardMedia, Slide, TextField } from '@material-ui/core';
import { GroupAdd, AddToQueue } from '@material-ui/icons';
import axios from 'axios';

import createHashHistory from '../../history';
import { signIn } from '../../actions';

export default function Auth() {

  // Base URL for http requests
  const baseUrl = (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://simple-chat-apix.herokuapp.com');

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
      const response = await axios.post(`${baseUrl}/user/create?userName=${userName}&userPass=${userPass}`);
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
      const response = await axios.get(`${baseUrl}/user/login?userName=${userName}&userPass=${userPass}`);
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
      <Slide direction={mainDirection} in={mainVisible} timeout={500} mountOnEnter unmountOnExit>
        <div className="modal-main">
          <div className="modal-title modal-flex">
            <Typography variant="h5" color="primary" align="center">Sign in, or create an account!</Typography>
          </div>
          <div className="modal-create-server modal-flex">
            <Card className="modal-card">
              <CardActionArea onClick={() => showCreateAccount()} className="modal-card">
                <CardContent>
                  <Typography variant="h5" color="primary" gutterBottom>Register</Typography>
                  <Typography variant="body1" paragraph>Create a new account and start chatting!</Typography>
                  <CardMedia>
                    <AddToQueue className="modal-card-icon" />
                  </CardMedia>
                  <Button variant="contained" color="primary">Create</Button>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
          <div className="modal-join-server modal-flex">
            <Card className="modal-card">
              <CardActionArea onClick={() => showLoginAccount()} className="modal-card">
                <CardContent>
                  <Typography variant="h5" color="secondary" gutterBottom>Login</Typography>
                  <Typography variant="body1" paragraph>Sign in to an existing account.</Typography>
                  <CardMedia>
                    <GroupAdd className="modal-card-icon" />
                  </CardMedia>
                  <Button variant="contained" color="secondary">Sign In </Button>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        </div>
      </Slide>
    )
  }

  // Renders create account form
  const renderCreateAccount = () => {
    return (
      <Slide direction="left" in={createVisible} timeout={500} mountOnEnter unmountOnExit>
        <div className="modal-create">
          <div className="modal-title modal-flex">
            <Typography variant="h5" color="primary" align="center">Create Account</Typography>
          </div>
          <div className="modal-create-content">
            <Typography variant="body1" paragraph> Enter a Username and Password for your account </Typography>
            <form className="login-form">
              <TextField
                id="username"
                label="Username"
                values={userName}
                error={userNameError}
                helperText={userNameErrorMsg}
                onChange={(e) => setUserName(e.target.value)}
                margin="normal"
                autoComplete="off"
                onKeyPress={(e) => handleKeyPress(e, () => handleOnSubmit(userName, userPass, () => createAccount(userName, userPass)))}
              />
              <TextField
                id="password"
                label="Password"
                values={userPass}
                error={userPassError}
                helperText={userPassErrorMsg}
                onChange={(e) => setUserPass(e.target.value)}
                margin="normal"
                autoComplete="off"
                onKeyPress={(e) => handleKeyPress(e, () => handleOnSubmit(userName, userPass, () => createAccount(userName, userPass)))}
              />
              <Button className="modal-login-button" variant="contained" color="primary" onClick={() => handleOnSubmit(userName, userPass, () => createAccount(userName, userPass))}>Create</Button>
            </form>
          </div>
        </div>
      </Slide>
    )
  }

  const renderLoginAccount = () => {
    return (
      <Slide direction="left" in={loginVisible} timeout={500} mountOnEnter unmountOnExit>
        <div className="modal-create">
          <div className="modal-title modal-flex">
            <Typography variant="h5" color="primary" align="center">Login Account</Typography>
          </div>
          <div className="modal-create-content">
            <Typography variant="body1" paragraph> Enter your username and password </Typography>
            <form className="login-form">
              <TextField
                id="username"
                label="Username"
                values={userName}
                error={userNameError}
                helperText={userNameErrorMsg}
                onChange={(e) => setUserName(e.target.value)}
                margin="normal"
                autoComplete="off"
                onKeyPress={(e) => handleKeyPress(e, () => handleOnSubmit(userName, userPass, () => loginAccount(userName, userPass)))}
              />
              <TextField
                id="password"
                label="Password"
                values={userPass}
                error={userPassError}
                helperText={userPassErrorMsg}
                onChange={(e) => setUserPass(e.target.value)}
                margin="normal"
                autoComplete="off"
                onKeyPress={(e) => handleKeyPress(e, () => handleOnSubmit(userName, userPass, () => loginAccount(userName, userPass)))}
              />
              <Button className="modal-login-button" variant="contained" color="primary" onClick={() => handleOnSubmit(userName, userPass, () => loginAccount(userName, userPass))}>Login</Button>
            </form>
          </div>
        </div>
      </Slide >
    )
  }

  return (
    <div className="auth-wrapper">
      <Paper className="container-login">
        {renderMain()}
        {renderCreateAccount()}
        {renderLoginAccount()}
      </Paper >
    </div >
  )
}
