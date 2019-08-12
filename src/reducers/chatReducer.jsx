import { UPDATE_CHAT, CHANGE_SERVER, CHANGE_TOPIC, GET_INITIAL_DATA } from '../actions/types';

const initialState = {
  servers: {
    "programming haven": {
      general: [
      ]
    },
    "game land": {
      HOTS: [
      ]
    },
  },
  activeServer: 'programming haven',
  activeTopic: 'general',
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
      return { ...state, servers: action.payload, activeServer: Object.keys(action.payload)[0], activeTopic: Object.keys(action.payload[Object.keys(action.payload)[0]])[0] };
    case CHANGE_SERVER:
      return { ...state, activeServer: action.payload.server, activeTopic: Object.keys(state.servers[action.payload.server])[0] }
    case CHANGE_TOPIC:
      return { ...state, activeTopic: action.payload }
    default:
      return { ...state };
  }
}
