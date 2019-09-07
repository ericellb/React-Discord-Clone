import io from 'socket.io-client';

import { ACTION, SocketActions } from '../actions/types';
import { Dispatch } from 'react';
import { AnyAction, MiddlewareAPI } from 'redux';

export const socketMiddleware = (baseUrl: string) => {
  return (storeAPI: MiddlewareAPI) => {
    let socket = io(baseUrl);
    // eslint-disable-next-line
    let listener: SocketIOClient.Emitter;

    // Check actions and emit from socket if needed
    return (next: Dispatch<AnyAction>) => (action: SocketActions) => {
      // Send message over socket
      if (action.type === ACTION.SEND_SOCKET_MESSAGE) {
        socket.emit('simple-chat-message', action.payload);
        return;
      }

      // Send private message over socket
      if (action.type === ACTION.SEND_SOCKET_PRIVATE_MESSAGE) {
        socket.emit('simple-chat-private-message', action.payload);
        return;
      }

      // Pull sign in action and login to send socket server our userId (identify individual socket connectins)
      if (action.type === ACTION.SIGN_IN) {
        socket.emit('simple-chat-sign-in', action.payload);
        listener = setupSocketListener(socket, storeAPI);
      }

      // Pull server list off initial data load
      // Use to "join" our server "rooms"
      if (action.type === ACTION.GET_INITIAL_DATA) {
        // Get list of server Ids (used for "room" names on socket server)
        let servers = Object.keys(action.payload.servers);
        let serverIds: string[] = [];
        servers.forEach((server, i) => {
          serverIds[i] = server.split('-')[1];
        });

        // Subscribe to each server (Creates a room on socket io)
        serverIds.forEach(serverId => {
          socket.emit('subscribe', serverId);
        });
      }

      // If user creates a server we need to join that room
      if (action.type === ACTION.ADD_SERVER) {
        let serverId = action.payload.server.split('-')[1];
        socket.emit('subscribe', serverId);
      }

      // Updates our active state on server
      if (action.type === ACTION.UPDATE_ACTIVE_STATE) {
        socket.emit('update-active');
      }

      if (action.type === ACTION.SEND_SOCKET_JOIN_VOICE) {
        socket.emit('user-join-voice', action.payload);
      }

      if (action.type === ACTION.SEND_SOCKET_LEAVE_VOICE) {
        socket.emit('user-leave-voice', action.payload);
      }

      if (action.type === ACTION.SEND_SOCKET_RTC_SIGNAL) {
        socket.emit('voice-signal', action.payload);
      }

      return next(action);
    };
  };
};

// Listens on socket with our userId
// Listens to socket server for specific events for messages / private messages
// TODO listen for listen for types of Server + payload of message
function setupSocketListener(socket: SocketIOClient.Socket, storeAPI: MiddlewareAPI): SocketIOClient.Emitter {
  return socket.on('update', (action: any) => {
    // Check for action type
    if (action.type === 'message') {
      storeAPI.dispatch({
        type: ACTION.RECEIVE_SOCKET_MESSAGE,
        payload: action.payload
      });
    } else if (action.type === 'private-message') {
      storeAPI.dispatch({
        type: ACTION.RECEIVE_SOCKET_PRIVATE_MESSAGE,
        payload: action.payload
      });
    } else if (action.type === 'user-join-voice') {
      storeAPI.dispatch({
        type: ACTION.RECEIVE_SOCKET_JOIN_VOICE,
        payload: action.payload
      });
    } else if (action.type === 'user-leave-voice') {
      storeAPI.dispatch({
        type: ACTION.RECEIVE_SOCKET_LEAVE_VOICE,
        payload: action.payload
      });
    } else if (action.type === 'voice-signal') {
      storeAPI.dispatch({
        type: ACTION.RECEIVE_SOCKET_RTC_SIGNAL,
        payload: action.payload
      });
    }
  });
}
