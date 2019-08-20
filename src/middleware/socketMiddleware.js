import io from 'socket.io-client';

import { NEW_MESSAGE, ADD_MESSAGE, NEW_PRIVATE_MESSAGE, ADD_PRIVATE_MESSAGE, SIGN_IN } from '../actions/types';

export const socketMiddleware = (baseUrl) => {
  return storeAPI => {
    let socket = io(baseUrl);

    // Setup default listener
    let listener = setupSocketListener('default', socket, storeAPI);

    // Check actions and emit from socket if needed
    return next => action => {
      if (action.type === NEW_MESSAGE) {
        socket.emit('simple-chat-new-message', action.payload);
        return;
      }
      else if (action.type === SIGN_IN) {
        socket.emit('simple-chat-userId', action.payload.userId);
        listener.off();
        listener = setupSocketListener(action.payload.userId, socket, storeAPI);
      }
      else if (action.type === NEW_PRIVATE_MESSAGE) {
        socket.emit('simple-chat-new-private-message', action.payload);
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
        type: ADD_MESSAGE,
        payload: action.payload
      });
    }
    else if (action.type === "private-message") {
      storeAPI.dispatch({
        type: ADD_PRIVATE_MESSAGE,
        payload: action.payload
      })
    }
  });
}