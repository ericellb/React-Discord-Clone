import { UPDATE_CHAT, CHANGE_SERVER, CHANGE_TOPIC, GET_INITIAL_DATA } from '../actions/types';

const initialState = {
  servers: {
    "programming haven": {
      general: [
        { channel_id: '1' }
      ],
      react: [
        { channel_id: '2' }
      ]
    },
    "game land": {
      HOTS: [
        { channel_id: '3' }
      ],
      Overwatch: [
        { channel_id: '4' }
      ]
    },
  },
  activeServer: '',
  activeServerId: '',
  activeTopic: '',
  activeTopicId: ''
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
      console.log(action.payload);
      return { ...state, activeServer: action.payload.server, activeServerId: state.servers[action.payload.server].server_id[0], activeTopic: Object.keys(state.servers[action.payload.server])[1], activeTopicId: state.servers[action.payload.server][Object.keys(state.servers[action.payload.server])[1]][0].channel_id }
    case CHANGE_TOPIC:
      return { ...state, activeTopic: action.payload, activeTopicId: state.servers[state.activeServer][action.payload][0].channel_id }
    default:
      return { ...state, activeServer: Object.keys(state.servers)[0], activeServerId: parseInt(state.servers[Object.keys(state.servers)[0]].server_id), activeTopic: Object.keys(state.servers[Object.keys(state.servers)[0]])[1], activeTopicId: state.servers[Object.keys(state.servers)[0]][Object.keys(state.servers[Object.keys(state.servers)[0]])[1]][0].channel_id };
  }
}
