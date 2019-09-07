import axios from '../components/Api/api';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import {
  ACTION,
  UpdateActiveStateAction,
  ChangeServerAction,
  ChangeChannelAction,
  ChangeViewAction,
  ChangePmUserAction,
  LoadUserDataAction,
  LoadInitialData,
  SignInAction,
  SignInData,
  SignOutAction,
  SendJoinVoiceData,
  SendJoinVoiceAction,
  ReceiveJoinVoiceData,
  ReceiveJoinVoiceAction,
  SendRtcSignalData,
  ReceiveRtcSignalData,
  ReceiveRtcSignalAction,
  SendRtcSignalAction,
  SendLeaveVoiceAction,
  ReceiveLeaveVoiceAction,
  SendLeaveVoiceData,
  ReceiveLeaveVoiceData,
  ClearVoiceConnectionAction
} from './types';
import {
  SendMessageData,
  ReceiveMessageData,
  SendPrivateMessageData,
  ReceivePrivateMessageData,
  AddChannelData,
  AddServerData
} from './types';
import {
  SendMessageAction,
  ReceiveMessageAction,
  SendPrivateMessageAction,
  ReceivePrivateMessageAction,
  AddChannelAction,
  AddServerAction
} from './types';

// Action to send a message (Handled by socket middleware)
export const sendMessage = (message: SendMessageData): SendMessageAction => ({
  type: ACTION.SEND_SOCKET_MESSAGE,
  payload: message
});

// Action to add message to a channel (Handled by socket middleware)
export const receiveMessage = (message: ReceiveMessageData): ReceiveMessageAction => ({
  type: ACTION.RECEIVE_SOCKET_MESSAGE,
  payload: message
});

// Action to send new private message (Handled by socket middleware)
export const sendPrivateMessage = (message: SendPrivateMessageData): SendPrivateMessageAction => ({
  type: ACTION.SEND_SOCKET_PRIVATE_MESSAGE,
  payload: message
});

// Action to send new private message (Handled by socket middleware)
export const receivePrivateMessage = (message: ReceivePrivateMessageData): ReceivePrivateMessageAction => ({
  type: ACTION.RECEIVE_SOCKET_PRIVATE_MESSAGE,
  payload: message
});

// Action to send a join voice channel message (Handles by socket middleware)
export const sendJoinVoice = (data: SendJoinVoiceData): SendJoinVoiceAction => ({
  type: ACTION.SEND_SOCKET_JOIN_VOICE,
  payload: data
});

// Action to receive join voice channel message (Handles by socket middlware)
export const receiveJoinVoice = (data: ReceiveJoinVoiceData): ReceiveJoinVoiceAction => ({
  type: ACTION.RECEIVE_SOCKET_JOIN_VOICE,
  payload: data
});

export const sendRtcSignal = (data: SendRtcSignalData): SendRtcSignalAction => ({
  type: ACTION.SEND_SOCKET_RTC_SIGNAL,
  payload: data
});

export const sendLeaveVoice = (data: SendLeaveVoiceData): SendLeaveVoiceAction => ({
  type: ACTION.SEND_SOCKET_LEAVE_VOICE,
  payload: data
});

export const receiveLeaveVoice = (data: ReceiveLeaveVoiceData): ReceiveLeaveVoiceAction => ({
  type: ACTION.RECEIVE_SOCKET_LEAVE_VOICE,
  payload: data
});

export const clearVoiceConnection = (): ClearVoiceConnectionAction => ({
  type: ACTION.CLEAR_VOICE_CONNECTION,
  payload: null
});

export const receiveRtcSignal = (data: ReceiveRtcSignalData): ReceiveRtcSignalAction => ({
  type: ACTION.RECEIVE_SOCKET_RTC_SIGNAL,
  payload: data
});

// Action to add Channel to a Server
export const addChannel = (channel: AddChannelData): AddChannelAction => ({
  type: ACTION.ADD_CHANNEL,
  payload: channel
});

// Action to add Server to server list
export const addServer = (server: AddServerData): AddServerAction => ({
  type: ACTION.ADD_SERVER,
  payload: server
});

// Get active user list in given server
export const updateActiveUserList = (serverId: string) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  const response = await axios.get(`/server/activeusers?serverId=${serverId}`);
  dispatch({ type: ACTION.UPDATE_ACTIVE_USERS, payload: response.data });
};

// Action creator to update active state (socket middleware)
export const updateActiveState = (): UpdateActiveStateAction => ({
  type: ACTION.UPDATE_ACTIVE_STATE,
  payload: null
});

// Action to change the current Active Server
export const changeServer = (server: string) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  dispatch(updateActiveUserList(server.split('-')[1]));
  dispatch<ChangeServerAction>({ type: ACTION.CHANGE_SERVER, payload: server });
};

// Action to change the current Active Channel
export const changeChannel = (channel: string): ChangeChannelAction => ({
  type: ACTION.CHANGE_CHANNEL,
  payload: channel
});

// Action to change the current active view
export const changeView = (view: string): ChangeViewAction => ({
  type: ACTION.CHANGE_VIEW,
  payload: view
});

// Action to change active user we have private message open with
export const changePMUser = (user: string): ChangePmUserAction => ({
  type: ACTION.CHANGE_PM_USER,
  payload: user
});

// Loads user Data. Gets all Servers + Channel History
export const loadUserData = (userId: string) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  let url = `/user/data?userId=${userId}`;
  const res = await axios.get<LoadInitialData>(url);
  // get active user list for first server
  dispatch(updateActiveUserList(Object.keys(res.data.servers)[0].split('-')[1]));
  dispatch<LoadUserDataAction>({ type: ACTION.GET_INITIAL_DATA, payload: res.data });
};

// On sign in
export const signIn = (user: SignInData): SignInAction => ({
  type: ACTION.SIGN_IN,
  payload: user
});

// On sign out
export const signOut = (): SignOutAction => ({
  type: ACTION.SIGN_OUT,
  payload: null
});
