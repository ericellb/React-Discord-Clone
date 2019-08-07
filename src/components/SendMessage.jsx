import React from 'react'

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


import { useDispatch } from 'react-redux';
import { sendMessage } from '../actions';

export default function SendMessage(props) {

  const dispatch = useDispatch();

  const { chatMessage, changeChatMessage, activeTopic, user } = props;

  function handleSubmit(message) {
    dispatch(sendMessage(message));
    changeChatMessage('');
  }

  function handleKeyPress(e) {
    if (e.key === "Enter")
      handleSubmit({ topic: activeTopic, from: user, msg: chatMessage });
  }

  return (
    <React.Fragment>
      <div className="send-message-border" />
      <div class="send-message-container">
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
