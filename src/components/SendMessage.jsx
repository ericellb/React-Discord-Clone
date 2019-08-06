import React from 'react'

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function SendMessage(props) {
  const { chatMessage, changeChatMessage, activeTopic, user, sendChatAction } = props;
  return (
    <div className="send-message-container">
      <TextField
        id="filled-name"
        className="message-box"
        label="Type a message..."
        value={chatMessage}
        onChange={(e) => changeChatMessage(e.target.value)}
      />
      <Button color="primary" variant="contained" className="message-button" onClick={() => { sendChatAction({ topic: activeTopic, from: user, msg: chatMessage }); changeChatMessage(''); }}>Send</Button>
    </div>
  )
}
