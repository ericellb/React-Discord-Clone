import io from 'socket.io-client';

import { SEND_MESSAGE, UPDATE_CHAT, SIGN_IN } from '../actions/types';

export const socketMiddleware = (baseUrl) => {
  return storeAPI => {
    let socket = io(baseUrl);

    // Setup default listener
    let listener = setupSocketListener('default', socket, storeAPI);

    // Emit when SEND_MESSAGE action
    return next => action => {
      if (action.type === SEND_MESSAGE) {
        socket.emit('simple-chat-message', action.payload);
        return;
      }
      else if (action.type === SIGN_IN) {
        socket.emit('simple-chat-userId', action.payload.userId);
        listener.off();
        listener = setupSocketListener(action.payload.userId, socket, storeAPI);
      }

      return next(action);
    }
  }
}

function setupSocketListener(userId, socket, storeAPI) {
  return socket.on(userId, (message) => {
    console.log(userId);
    storeAPI.dispatch({
      type: UPDATE_CHAT,
      payload: message
    });
  });
}