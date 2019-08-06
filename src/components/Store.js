import React from 'react';
import io from 'socket.io-client';

const baseUrl = (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://simple-chat.herokuapp.com');

export const CTX = React.createContext();

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

function chatReducer(state, action) {
  const { topic, from, msg } = action.payload;
  switch (action.type) {
    case 'UPDATE_CHATS':
      return {
        ...state,
        [topic]: [
          ...state[topic], { from: from, msg: msg }
        ]
      }
    default:
      return state;
  }
}

let socket;

function sendChatAction(message) {
  socket.emit('simple-chat', message);
}

export default function Store(props) {

  const [chats, chatDispatch] = React.useReducer(chatReducer, initialState);

  if (!socket) {
    socket = io(baseUrl);
    socket.on('simple-chat', (msg) => {
      const action = { type: 'UPDATE_CHATS', payload: msg }
      chatDispatch(action);
    })
  }


  return (
    <CTX.Provider value={{ chats, sendChatAction }}>
      {props.children}
    </ CTX.Provider>
  )
}
