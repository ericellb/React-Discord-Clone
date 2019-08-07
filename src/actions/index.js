import { SEND_MESSAGE, UPDATE_CHAT } from './types';

export const sendMessage = (message) => ({
  type: SEND_MESSAGE,
  payload: message
});

export const updateChat = (message) => ({
  type: UPDATE_CHAT,
  payload: message
});