import { RECEIVE_SOCKET_MESSAGE, RECEIVE_SOCKET_PRIVATE_MESSAGE, ADD_CHANNEL, CHANGE_SERVER, CHANGE_CHANNEL, GET_INITIAL_DATA, ADD_SERVER, CHANGE_VIEW, CHANGE_PM_USER, UPDATE_ACTIVE_USERS } from '../actions/types';

const initialState = {
  servers: {
    "Default-FANfDprXmt": {
      "channels": {
        "general-0m5vBsRnfd": [
        ],
        "gaming-p9DnvvrfWo": [
        ],
        "programming-aRoD4umYpb": [
        ],
        "cooking-v88UngJkiD": [
        ],
        "misc-uSje5DwUH0": [
        ],
        "/b/-Ry06VYrX3x": [
        ]
      }
    }
  },
  privateMessages: {
  },
  activeServer: 'Default-FANfDprXmt',
  activeChannel: 'general-0m5vBsRnfd',
  activeUserList: [],
  activeView: 'servers',
  activePMUser: 'none'
}

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_SOCKET_MESSAGE:
      let { server, channel, from, msg } = action.payload;
      return {
        ...state,
        servers: {
          ...state.servers,
          [server]: {
            ...state.servers[server],
            "channels": {
              ...state.servers[server].channels,
              [channel]: [
                ...state.servers[server]["channels"][channel], { from: from, msg: msg }
              ]
            }
          }
        }
      }
    case RECEIVE_SOCKET_PRIVATE_MESSAGE:
      if (state.privateMessages[action.payload.user]) {
        return {
          ...state,
          privateMessages: {
            ...state.privateMessages,
            [action.payload.user]: [
              ...state.privateMessages[action.payload.user], { from: action.payload.from, to: action.payload.to, msg: action.payload.msg }
            ]
          }
        }
      }
      else return {
        ...state,
        privateMessages: {
          ...state.privateMessages,
          [action.payload.user]: [
            { from: action.payload.from, to: action.payload.to, msg: action.payload.msg }
          ]
        }
      }
    case ADD_CHANNEL:
      return {
        ...state,
        servers: {
          ...state.servers,
          [action.payload.server]: {
            ...state.servers[action.payload.server],
            "channels": {
              ...state.servers[action.payload.server].channels,
              [action.payload.channel]: [

              ]
            }
          }
        }
      }
    case ADD_SERVER:
      return {
        ...state,
        servers: {
          ...state.servers,
          [action.payload.server]: {
            "channels": {
              [action.payload.channel]: [
              ]
            }
          }
        }
      }
    case GET_INITIAL_DATA:
      return { ...state, servers: action.payload.servers, privateMessages: action.payload.privateMessages, activeServer: "Default-FANfDprXmt", activeChannel: "gaming-p9DnvvrfWo" };
    case CHANGE_SERVER:
      return { ...state, activeServer: action.payload, activeChannel: Object.keys(state.servers[action.payload]["channels"])[0] }
    case CHANGE_CHANNEL:
      return { ...state, activeChannel: action.payload }
    case CHANGE_VIEW:
      return { ...state, activeView: action.payload, activePMUser: Object.keys(state.privateMessages)[0] }
    case CHANGE_PM_USER:
      return { ...state, activePMUser: action.payload }
    case UPDATE_ACTIVE_USERS:
      return { ...state, activeUserList: action.payload }
    default:
      return { ...state };
  }
}
