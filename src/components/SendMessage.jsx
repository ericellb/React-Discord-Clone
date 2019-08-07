import React from 'react'

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


import { useDispatch } from 'react-redux';
import { sendMessage } from '../actions';

export default function SendMessage(props) {

  const dispatch = useDispatch();

  const { chatMessage, changeChatMessage, activeTopic, user } = props;
  return (
    <div background className="send-message-flex-container">
      <div class="send-message-container">
        <TextField
          color="blue"
          id="filled-name"
          className="message-box"
          label="Type a message..."
          value={chatMessage}
          onChange={(e) => changeChatMessage(e.target.value)}
        />
        <Button color="primary" variant="contained" className="message-button" onClick={() => { dispatch(sendMessage({ topic: activeTopic, from: user, msg: chatMessage })); changeChatMessage(''); }}>Send</Button>
      </div>
    </div >
  )
}
