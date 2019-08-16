import { ADD_MESSAGE, CHANGE_SERVER, CHANGE_CHANNEL, GET_INITIAL_DATA } from '../actions/types';

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
  switch (action.type) {
    case ADD_MESSAGE:
      const { server, channel, from, msg } = action.payload;
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
    case GET_INITIAL_DATA:
      return { ...state, servers: action.payload };
    case CHANGE_SERVER:
      return { ...state, activeServer: action.payload.server, activeChannel: Object.keys(state.servers[action.payload.server])[0] }
    case CHANGE_CHANNEL:
      return { ...state, activeChannel: action.payload }
    default:
      return { ...state };
  }
}
