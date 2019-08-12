import { UPDATE_CHAT, CHANGE_SERVER, CHANGE_TOPIC, GET_INITIAL_DATA } from '../actions/types';

const initialState = {
  servers: {
    "programming haven": {
      general: [
      ],
      react: [
      ],
      vue: [
      ],
      php: [
      ],
      node: [
      ]
    },
    "game land": {
      HOTS: [
      ],
      Overwatch: [
      ],
      Diablo: [
      ],
      PoE: [
      ],
      CSGO: [
      ]
    },
  },
  activeServer: '',
  activeTopic: '',
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
      return { ...state, activeServer: action.payload, activeTopic: Object.keys(state.servers[action.payload])[0] }
    case CHANGE_TOPIC:
      return { ...state, activeTopic: action.payload }
    default:
      return { ...state, activeServer: Object.keys(state.servers)[0], activeTopic: Object.keys(state.servers[Object.keys(state.servers)[0]])[0] };
  }
}
