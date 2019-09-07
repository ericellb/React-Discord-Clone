import { ACTION, ChatActionTypes } from '../actions/types';

export interface ChatStore {
  servers: {
    [serverName: string]: {
      channels: {
        [channelName: string]: { from: string; msg: string; date: Date }[];
      };
    };
  };
  privateMessages: {
    [userPM: string]: { from: string; to: string; msg: string; date: Date }[];
  };
  activeServer: string;
  activeChannel: string;
  activeUserList: { user_name: string }[];
  activeView: string;
  activePMUser: string;
  voiceClients: { userId: string; userName: string }[];
  voiceJoinUserId: string;
  voiceLeaveUserId: string;
  rtcSignalData: { userId: string; ice?: any; sdp?: any };
}

const initialState = {
  servers: {
    'Default-FANfDprXmt': {
      channels: {
        'general-0m5vBsRnfd': []
      }
    }
  },
  privateMessages: {},
  activeServer: 'Default-FANfDprXmt',
  activeChannel: 'general-0m5vBsRnfd',
  activeUserList: [],
  activeView: 'servers',
  activePMUser: 'none',
  voiceClients: [{ userId: '', userName: '' }],
  voiceJoinUserId: '',
  voiceLeaveUserId: '',
  rtcSignalData: { userId: '' }
};

export const chatReducer = (state: ChatStore = initialState, action: ChatActionTypes): ChatStore => {
  switch (action.type) {
    case ACTION.RECEIVE_SOCKET_MESSAGE:
      let { server, channel, from, msg, date } = action.payload;
      return {
        ...state,
        servers: {
          ...state.servers,
          [server]: {
            ...state.servers[server],
            channels: {
              ...state.servers[server].channels,
              [channel]: [...state.servers[server]['channels'][channel], { from: from, msg: msg, date: date }]
            }
          }
        }
      };
    case ACTION.RECEIVE_SOCKET_PRIVATE_MESSAGE:
      if (state.privateMessages[action.payload.user]) {
        return {
          ...state,
          privateMessages: {
            ...state.privateMessages,
            [action.payload.user]: [
              ...state.privateMessages[action.payload.user],
              { from: action.payload.from, to: action.payload.to, msg: action.payload.msg, date: action.payload.date }
            ]
          }
        };
      } else
        return {
          ...state,
          privateMessages: {
            ...state.privateMessages,
            [action.payload.user]: [
              { from: action.payload.from, to: action.payload.to, msg: action.payload.msg, date: action.payload.date }
            ]
          }
        };
    case ACTION.RECEIVE_SOCKET_JOIN_VOICE:
      return {
        ...state,
        voiceClients: action.payload.clients,
        voiceJoinUserId: action.payload.userId,
        voiceLeaveUserId: ''
      };
    case ACTION.RECEIVE_SOCKET_RTC_SIGNAL:
      return { ...state, rtcSignalData: action.payload };
    case ACTION.RECEIVE_SOCKET_LEAVE_VOICE:
      return { ...state, voiceLeaveUserId: action.payload.userId, voiceClients: action.payload.clients };
    case ACTION.CLEAR_VOICE_CONNECTION:
      return { ...state, voiceClients: [], voiceLeaveUserId: '', voiceJoinUserId: '' };
    case ACTION.ADD_CHANNEL:
      return {
        ...state,
        servers: {
          ...state.servers,
          [action.payload.server]: {
            ...state.servers[action.payload.server],
            channels: {
              ...state.servers[action.payload.server].channels,
              [action.payload.channel]: []
            }
          }
        }
      };
    case ACTION.ADD_SERVER:
      return {
        ...state,
        servers: {
          ...state.servers,
          [action.payload.server]: {
            channels: {
              [action.payload.channel]: []
            }
          }
        }
      };
    case ACTION.GET_INITIAL_DATA:
      return {
        ...state,
        servers: action.payload.servers,
        privateMessages: action.payload.privateMessages,
        activeServer: Object.keys(action.payload.servers)[0],
        activeChannel: Object.keys(state.servers[Object.keys(action.payload.servers)[0]].channels)[0]
      };
    case ACTION.CHANGE_SERVER:
      return {
        ...state,
        activeServer: action.payload,
        activeChannel: Object.keys(state.servers[action.payload].channels)[0]
      };
    case ACTION.CHANGE_CHANNEL:
      return { ...state, activeChannel: action.payload };
    case ACTION.CHANGE_VIEW:
      return { ...state, activeView: action.payload, activePMUser: Object.keys(state.privateMessages)[0] };
    case ACTION.CHANGE_PM_USER:
      return { ...state, activePMUser: action.payload };
    case ACTION.UPDATE_ACTIVE_USERS:
      return { ...state, activeUserList: action.payload };
    default:
      return { ...state };
  }
};
