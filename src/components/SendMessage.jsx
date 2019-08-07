import React from 'react'
import { useSelector } from 'react-redux';

import TextField from '@material-ui/core/TextField';


import { useDispatch } from 'react-redux';
import { sendMessage } from '../actions';

export default function SendMessage(props) {

  // Get store
  const { activeServer, activeTopic } = useSelector(state => state.chat);

  const dispatch = useDispatch();

  const { chatMessage, changeChatMessage, user } = props;

  function handleSubmit(message) {
    dispatch(sendMessage(message));
    changeChatMessage('');
  }

  function handleKeyPress(e) {
    if (e.key === "Enter")
      handleSubmit({ server: activeServer, topic: activeTopic, from: user, msg: chatMessage });
  }

  return (
    <React.Fragment>
      <div className="send-message-border" />
      <div className="send-message-container">
        <TextField
          autoComplete="off"
          color="blue"
          id="filled-name"
          className="message-input"
          label={`Message # ${activeTopic}`}
          value={chatMessage}
          onChange={(e) => changeChatMessage(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e)}
        />
      </div>
    </React.Fragment>
  )
}
