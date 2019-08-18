import { NEW_MESSAGE, ADD_MESSAGE, ADD_CHANNEL, ADD_SERVER, CHANGE_SERVER, CHANGE_CHANNEL, SIGN_IN, SIGN_OUT, GET_INITIAL_DATA } from './types';
import axios from '../components/Api/api'


// Action that socket middleware listens for
// Emits via socket new message event
export const newMessage = (message) => ({
  type: NEW_MESSAGE,
  payload: message
});


// Action to add message to a channel
export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message
});

// Action to add channel to a server
export const addChannel = (data) => ({
  type: ADD_CHANNEL,
  payload: data
})

// Action to add server to server list
export const addServer = (data) => ({
  type: ADD_SERVER,
  payload: data
})

// Action to change the current Active Server
export const changeServer = (server) => ({
  type: CHANGE_SERVER,
  payload: server
});

// Action to change the current Active Channel
export const changeChannel = (server) => ({
  type: CHANGE_CHANNEL,
  payload: server
});

// Loads user Data. Gets all Servers + Channel History
export const loadUserData = (userId) => async dispatch => {
  let url = `/user/data?userId=${userId}`;
  const res = await axios.get(url);
  dispatch({ type: GET_INITIAL_DATA, payload: res.data });
};


// On sign in, post to backend to create user if non existant
export const signIn = (user) => ({
  type: SIGN_IN,
  payload: user
})

export const signOut = (user) => ({
  type: SIGN_OUT,
  payload: user
})