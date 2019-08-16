import { UPDATE_CHAT, CHANGE_SERVER, CHANGE_TOPIC, GET_INITIAL_DATA } from '../actions/types';

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
  activeTopic: 'general-0m5vBsRnfd',
}

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CHAT:
      const { server, topic, from, msg } = action.payload;
      return {
        ...state,
        servers: {
          ...state.servers,
          [server]: {
            ...state.servers[server],
            [topic]: [
              ...state.servers[server][topic], { from: from, msg: msg }
            ]
          }
        }
      }
    case GET_INITIAL_DATA:
      return { ...state, servers: action.payload };
    case CHANGE_SERVER:
      return { ...state, activeServer: action.payload.server, activeTopic: Object.keys(state.servers[action.payload.server])[0] }
    case CHANGE_TOPIC:
      return { ...state, activeTopic: action.payload }
    default:
      return { ...state };
  }
}
