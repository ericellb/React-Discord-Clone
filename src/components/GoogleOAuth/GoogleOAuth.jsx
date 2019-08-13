import React, { useEffect, useRef } from 'react'
import { Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import { signIn, signOut } from '../../actions';

export default function GoogleOAuth() {

  // Get store state
  const user = useSelector(state => state.user);

  // Dispatch
  const dispatch = useDispatch();

  // When app loads, grab users initial data
  // Includes all channels, history and settings
  let auth = useRef();
  useEffect(() => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId: '607332079220-hhs6rhoaq44p29150j4thfdgoj7c5k59.apps.googleusercontent.com',
        scope: 'email'
      }).then(() => {
        auth.current = window.gapi.auth2.getAuthInstance();
        onAuthChange(auth.current.isSignedIn.get());
        // Listen for changes
        auth.current.isSignedIn.listen(() => {
          onAuthChange(auth.current.isSignedIn.get());
        });
      });
    });
  }, [])


  function onLoginButtonClick(action) {
    if (action === "login")
      auth.current.signIn();
    else auth.current.signOut();
  }

  function onAuthChange(isSignedIn) {
    if (isSignedIn) {
      const { Eea, ig, U3 } = auth.current.currentUser.get().getBasicProfile();
      dispatch(signIn({ "userId": Eea, "userName": ig, "userEmail": U3 }));
    }
    else
      dispatch(signOut(auth.current.currentUser.get().getId()));
  }

  return (
    <div>
      {user.isSignedIn ? <Button onClick={() => onLoginButtonClick('logout')}>Sign Out</Button> : <Button onClick={() => onLoginButtonClick('login')}>Sign In</Button>}
    </div>
  )
}
