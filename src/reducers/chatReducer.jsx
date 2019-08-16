import { ADD_MESSAGE, CHANGE_SERVER, CHANGE_CHANNEL, GET_INITIAL_DATA, ADD_CHANNEL } from '../actions/types';

const initialState = {
  servers: {
    "Default-FANfDprXmt": {
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
  },
  activeServer: 'Default-FANfDprXmt',
  activeChannel: 'general-0m5vBsRnfd',
}

export const chatReducer = (state = initialState, action) => {
  console.log(action.payload);
  switch (action.type) {
    case ADD_MESSAGE:
      let { server, channel, from, msg } = action.payload;
      return {
        ...state,
        servers: {
          ...state.servers,
          [server]: {
            ...state.servers[server],
            [channel]: [
              ...state.servers[server][channel], { from: from, msg: msg }
            ]
          }
        }
      }
    case ADD_CHANNEL:
      return {
        ...state,
        servers: {
          ...state.servers,
          [action.payload.server]: {
            ...state.servers[action.payload.server],
            [action.payload.channel]: [

            ]
          }
        }
      }
    case GET_INITIAL_DATA:
      return { ...state, servers: action.payload };
    case CHANGE_SERVER:
      return { ...state, activeServer: action.payload, activeChannel: Object.keys(state.servers[action.payload])[0] }
    case CHANGE_CHANNEL:
      return { ...state, activeChannel: action.payload }
    default:
      return { ...state };
  }
}
