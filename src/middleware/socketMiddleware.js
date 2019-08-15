import io from 'socket.io-client';

import { SEND_MESSAGE, UPDATE_CHAT, GET_INITIAL_DATA } from '../actions/types';

export const socketMiddleware = (baseUrl) => {
  return storeAPI => {
    let socket = io(baseUrl);
    let servers = [];

    // Emit when SEND_MESSAGE action
    return next => action => {
      if (action.type === SEND_MESSAGE) {
        let server = action.payload.server.split('-')[0];
        socket.emit(server, action.payload);
        return;
      }
      else if (action.type === GET_INITIAL_DATA) {
        let servers = (Object.keys(action.payload));
        setSocketListener(socket, storeAPI, servers);
      }

      return next(action);
    }
  }
}

function setSocketListener(socket, storeAPI, servers) {
  // Create listener for each server
  servers.forEach((server) => {
    // Dispatch chat to reducers when we receive data
    server = server.split('-')[0];
    console.log(server);
    socket.on(server, (message) => {
      storeAPI.dispatch({
        type: UPDATE_CHAT,
        payload: message
      });
    });
  })
}