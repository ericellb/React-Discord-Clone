import { SEND_MESSAGE, UPDATE_CHAT, CHANGE_SERVER, CHANGE_TOPIC, SIGN_IN, SIGN_OUT } from './types';

export const sendMessage = (message) => ({
  type: SEND_MESSAGE,
  payload: message
});

export const updateChat = (message) => ({
  type: UPDATE_CHAT,
  payload: message
});

export const changeServer = (server) => ({
  type: CHANGE_SERVER,
  payload: server
});

export const changeTopic = (server) => ({
  type: CHANGE_TOPIC,
  payload: server
});

export const signIn = (user) => ({
  type: SIGN_IN,
  payload: user
})

export const signOut = (user) => ({
  type: SIGN_IN,
  payload: user
})