import React, { useState } from 'react'
import { useSelector } from 'react-redux';

import TextField from '@material-ui/core/TextField';


import { useDispatch } from 'react-redux';
import { sendMessage } from '../actions';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

export default function SendMessage(props) {

  // Get store state
  const { activeServer, activeTopic } = useSelector(state => state.chat);
  const { userName } = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Local state
  const [chatMessage, changeChatMessage] = useState('');

  function handleSubmit(message) {
    dispatch(sendMessage(message));
    changeChatMessage("");
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey)
      handleSubmit({ server: activeServer, topic: activeTopic, from: userName, msg: chatMessage });
  }

  function handleOnChange(e) {
    // Catches enters (dont render to screen)
    // Shift enter still works
    if (e.target.value !== "\n")
      changeChatMessage(e.target.value)
  }

  return (
    <React.Fragment>
      <div className="send-message-border" />
      <div className="send-message-container">
        <TextareaAutosize
          aria-label="empty textarea"
          placeholder={`Message  #${activeTopic}`}
          className="message-text-area"
          value={chatMessage}
          onChange={(e) => handleOnChange(e)}
          onKeyPress={(e) => handleKeyPress(e)}
        />
      </div>
    </React.Fragment>
  )
}
