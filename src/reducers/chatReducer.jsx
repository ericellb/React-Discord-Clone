const initialState = {
  general: [
  ],
  react: [
  ],
  sports: [
  ],
  business: [
  ],
  politics: [
  ],
}

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_CHAT':
      return {
        ...state,
        [action.payload.topic]: [
          ...state[action.payload.topic], { from: action.payload.from, msg: action.payload.msg }
        ]
      }
    default:
      return state;
  }
}
