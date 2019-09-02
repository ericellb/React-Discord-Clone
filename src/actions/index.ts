import axios from '../components/Api/api';
import { ACTION } from './types';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

export interface SendChannelMessage {
  type: 'channelMessage';
  server: string;
  channel: string;
  from: string;
  msg: string;
}

export interface SendPrivateMessage {
  type: 'privateMessage';
  from: string;
  to: string;
  msg: string;
}

export interface ReceiveChannelMessage {
  server: string;
  channel: string;
  from: string;
  msg: string;
}

export interface ReceivePrivateMessage {
  user: string;
  from: string;
  to: string;
  msg: string;
}

// Action to send a message (Handled by socket middleware)
export const sendMessage = (message: SendChannelMessage) => ({
  type: ACTION.SEND_SOCKET_MESSAGE,
  payload: message
});

// Action to add message to a channel (Handled by socket middleware)
export const receiveMessage = (message: ReceiveChannelMessage) => ({
  type: ACTION.RECEIVE_SOCKET_MESSAGE,
  payload: message
});

// Action to send new private message (Handled by socket middleware)
export const sendPrivateMessage = (message: SendPrivateMessage) => ({
  type: ACTION.SEND_SOCKET_PRIVATE_MESSAGE,
  payload: message
});

// Action to send new private message (Handled by socket middleware)
export const receivePrivateMessage = (message: ReceivePrivateMessage) => ({
  type: ACTION.RECEIVE_SOCKET_PRIVATE_MESSAGE,
  payload: message
});

// Action to add Channel to a Server
export const addChannel = (channel: string) => ({
  type: ACTION.ADD_CHANNEL,
  payload: channel
});

// Action to add Server to server list
export const addServer = (server: string) => ({
  type: ACTION.ADD_SERVER,
  payload: server
});

// Get active user list in given server
export const updateActiveUserList = (serverId: string) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  const response = await axios.get(`/server/activeusers?serverId=${serverId}`);
  dispatch({ type: ACTION.UPDATE_ACTIVE_USERS, payload: response.data });
};

// Action creator to update active state (socket middleware)
export const updateActiveState = () => ({
  type: ACTION.UPDATE_ACTIVE_STATE,
  payload: null
});

// Action to change the current Active Server
export const changeServer = (server: string) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  dispatch(updateActiveUserList(server.split('-')[1]));
  dispatch({ type: ACTION.CHANGE_SERVER, payload: server });
};

// Action to change the current Active Channel
export const changeChannel = (channel: string) => ({
  type: ACTION.CHANGE_CHANNEL,
  payload: channel
});

// Action to change the current active view
export const changeView = (view: string) => ({
  type: ACTION.CHANGE_VIEW,
  payload: view
});

// Action to change active user we have private message open with
export const changePMUser = (user: string) => ({
  type: ACTION.CHANGE_PM_USER,
  payload: user
});

// Loads user Data. Gets all Servers + Channel History
export const loadUserData = (userId: string) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  let url = `/user/data?userId=${userId}`;
  const res = await axios.get(url);
  // get active user list for first server
  dispatch(updateActiveUserList(Object.keys(res.data.servers)[0].split('-')[1]));
  dispatch({ type: ACTION.GET_INITIAL_DATA, payload: res.data });
};

// On sign in
export const signIn = (user: string) => ({
  type: ACTION.SIGN_IN,
  payload: user
});

// On sign out
export const signOut = (user: string) => ({
  type: ACTION.SIGN_OUT,
  payload: user
});
