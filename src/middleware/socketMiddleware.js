import io from 'socket.io-client';

import { SEND_SOCKET_MESSAGE, RECEIVE_SOCKET_MESSAGE, SEND_SOCKET_PRIVATE_MESSAGE, SIGN_IN, RECEIVE_SOCKET_PRIVATE_MESSAGE } from '../actions/types';

export const socketMiddleware = (baseUrl) => {
  return storeAPI => {
    let socket = io(baseUrl);

    // Setup default listener
    let listener = setupSocketListener('default', socket, storeAPI);

    // Check actions and emit from socket if needed
    return next => action => {
      if (action.type === SEND_SOCKET_MESSAGE) {
        socket.emit('simple-chat-message', action.payload);
        return;
      }
      else if (action.type === SIGN_IN) {
        socket.emit('simple-chat-sign-in', action.payload.userId);
        listener.off();
        listener = setupSocketListener(action.payload.userId, socket, storeAPI);
      }
      else if (action.type === SEND_SOCKET_PRIVATE_MESSAGE) {
        socket.emit('simple-chat-private-message', action.payload);
        return;
      }

      return next(action);
    }
  }
}

// Listens on socket with our userId
// Listens to socket server
// Action types of (Message, Channel)
function setupSocketListener(userId, socket, storeAPI) {
  return socket.on(userId, (action) => {
    // Check for action type
    if (action.type === "message") {
      storeAPI.dispatch({
        type: RECEIVE_SOCKET_MESSAGE,
        payload: action.payload
      });
    }
    else if (action.type === "private-message") {
      storeAPI.dispatch({
        type: RECEIVE_SOCKET_PRIVATE_MESSAGE,
        payload: action.payload
      })
    }
  });
}