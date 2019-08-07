import io from 'socket.io-client';

import { SEND_MESSAGE, UPDATE_CHAT } from '../actions/types';

export const socketMiddleware = (baseUrl) => {
  return storeAPI => {
    let socket = io(baseUrl);

    socket.on("simple-chat", (message) => {
      storeAPI.dispatch({
        type: UPDATE_CHAT,
        payload: message
      });
    });

    return next => action => {
      if (action.type === SEND_MESSAGE) {
        socket.emit('simple-chat', action.payload);
        return;
      }

      return next(action);
    }
  }
}