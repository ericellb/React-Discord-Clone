import { SEND_MESSAGE, UPDATE_CHAT, CHANGE_SERVER, CHANGE_TOPIC } from './types';

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