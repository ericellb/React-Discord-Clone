import io from 'socket.io-client';

import { SEND_SOCKET_MESSAGE, RECEIVE_SOCKET_MESSAGE, SEND_SOCKET_PRIVATE_MESSAGE, SIGN_IN, RECEIVE_SOCKET_PRIVATE_MESSAGE, GET_INITIAL_DATA, ADD_SERVER, UPDATE_ACTIVE_STATE } from '../actions/types';

export const socketMiddleware = (baseUrl) => {
  return storeAPI => {
    let socket = io(baseUrl);
    let listener = null;

    // Check actions and emit from socket if needed
    return next => action => {

      // Send message over socket
      if (action.type === SEND_SOCKET_MESSAGE) {
        socket.emit('simple-chat-message', action.payload);
        return;
      }

      // Send private message over socket
      if (action.type === SEND_SOCKET_PRIVATE_MESSAGE) {
        socket.emit('simple-chat-private-message', action.payload);
        return;
      }

      // Pull sign in action and login to send socket server our userId (identify individual socket connectins)
      if (action.type === SIGN_IN) {
        socket.emit('simple-chat-sign-in', action.payload.userId);
        listener = setupSocketListener(socket, storeAPI);
      }

      // Pull server list off initial data load
      // Use to "join" our server "rooms"
      if (action.type === GET_INITIAL_DATA) {
        // Get list of server Ids (used for "room" names on socket server)
        let servers = Object.keys(action.payload.servers);
        let serverIds = [];
        servers.forEach((server, i) => {
          serverIds[i] = servers[i].split('-')[1];
        })

        // Subscribe to each server (Creates a room on socket io)
        serverIds.forEach((serverId) => {
          socket.emit('subscribe', serverId);
        })
      }

      // If user creates a server we need to join that room
      if (action.type === ADD_SERVER) {
        let serverId = action.payload.server.split('-')[1];
        socket.emit('subscribe', serverId);
      }

      // Updates our active state on server
      if (action.type === UPDATE_ACTIVE_STATE) {
        socket.emit('ping');
      }

      return next(action);
    }
  }
}

// Listens on socket with our userId
// Listens to socket server for specific events for messages / private messages
// TODO listen for listen for types of Server + payload of message
function setupSocketListener(socket, storeAPI) {
  return socket.on('update', (action) => {
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