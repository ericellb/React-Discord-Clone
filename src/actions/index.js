import { SEND_MESSAGE, UPDATE_CHAT, CHANGE_SERVER, CHANGE_TOPIC, SIGN_IN, SIGN_OUT, GET_INITIAL_DATA } from './types';
import axios from 'axios';

const baseUrl = (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://simple-chat-apix.herokuapp.com/');

export const sendMessage = (message) => ({
  type: SEND_MESSAGE,
  payload: message
});

export const updateChat = (message) => ({
  type: UPDATE_CHAT,
  payload: message
});

export const changeServer = (server, serverId) => ({
  type: CHANGE_SERVER,
  payload: { server, serverId }
});

export const changeTopic = (server) => ({
  type: CHANGE_TOPIC,
  payload: server
});

// Loads initial data for specific userId
// Loads all servers / channels / history
export const getInitialData = (userId) => async dispatch => {
  let url = `${baseUrl}/user?userId=${userId}`;
  const res = await axios.get(url);
  dispatch({ type: GET_INITIAL_DATA, payload: res.data });
};


// On sign in, post to backend to create user if non existant
export const signIn = (user) => async dispatch => {
  let url = `${baseUrl}/user?userId=${user.userId}&userName=${user.userName}`;
  const res = axios.post(url);
  // If server responds true, user exists on backend
  if (res) {
    dispatch({ type: SIGN_IN, payload: user });
  }
}

export const signOut = (user) => ({
  type: SIGN_OUT,
  payload: user
})