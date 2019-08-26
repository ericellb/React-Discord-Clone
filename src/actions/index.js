import { SEND_SOCKET_MESSAGE, RECEIVE_SOCKET_MESSAGE, ADD_CHANNEL, ADD_SERVER, CHANGE_SERVER, CHANGE_CHANNEL, CHANGE_VIEW, SIGN_IN, SIGN_OUT, GET_INITIAL_DATA, CHANGE_PM_USER, SEND_SOCKET_PRIVATE_MESSAGE, RECEIVE_SOCKET_PRIVATE_MESSAGE, UPDATE_ACTIVE_USERS } from './types';
import axios from '../components/Api/api'


// Action to send a message (Handled by socket middleware)
export const sendMessage = (message) => ({
  type: SEND_SOCKET_MESSAGE,
  payload: message
});

// Action to add message to a channel (Handled by socket middleware)
export const receiveMessage = (message) => ({
  type: RECEIVE_SOCKET_MESSAGE,
  payload: message
});

// Action to send new private message (Handled by socket middleware)
export const sendPrivateMessage = (message) => ({
  type: SEND_SOCKET_PRIVATE_MESSAGE,
  payload: message
})

// Action to send new private message (Handled by socket middleware)
export const receivePrivateMessage = (message) => ({
  type: RECEIVE_SOCKET_PRIVATE_MESSAGE,
  payload: message
})

// Action to add Channel to a Server
export const addChannel = (data) => ({
  type: ADD_CHANNEL,
  payload: data
})

// Action to add Server to server list
export const addServer = (data) => ({
  type: ADD_SERVER,
  payload: data
})

// Get active user list in given server
export const getActiveUsers = (server) => async dispatch => {
  const response = await axios.get(`/server/activeusers?serverId=${server}`);
  dispatch({ type: UPDATE_ACTIVE_USERS, payload: response.data });
}

// Action to change the current Active Server
export const changeServer = (server) => dispatch => {
  dispatch(getActiveUsers(server.split('-')[1]));
  dispatch({ type: CHANGE_SERVER, payload: server })
};

// Action to change the current Active Channel
export const changeChannel = (server) => ({
  type: CHANGE_CHANNEL,
  payload: server
});

// Action to change the current active view
export const changeView = (view) => ({
  type: CHANGE_VIEW,
  payload: view
})

// Action to change active user we have private message open with
export const changePMUser = (user) => ({
  type: CHANGE_PM_USER,
  payload: user
})

// Loads user Data. Gets all Servers + Channel History
export const loadUserData = (userId) => async dispatch => {
  let url = `/user/data?userId=${userId}`;
  const res = await axios.get(url);
  // get active user list for first server
  dispatch(getActiveUsers(Object.keys(res.data.servers)[0].split('-')[1]));
  dispatch({ type: GET_INITIAL_DATA, payload: res.data });
};

// On sign in
export const signIn = (user) => ({
  type: SIGN_IN,
  payload: user
})

// On sign out 
export const signOut = (user) => ({
  type: SIGN_OUT,
  payload: user
})