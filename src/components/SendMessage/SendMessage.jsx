import React, { useState } from 'react'
import { useSelector } from 'react-redux';


import { useDispatch } from 'react-redux';
import { sendMessage } from '../../actions';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart';

import SmileyFace from '@material-ui/icons/SentimentVerySatisfied';

export default function SendMessage(props) {

  // Get store state
  const { activeServer, activeTopic } = useSelector(state => state.chat);
  const { userName } = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Local state
  const [chatMessage, changeChatMessage] = useState('');
  const [emojiMenuVisible, changeEmojiMenuVisible] = useState(false);

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

  function handleEmojiClick(e) {
    changeChatMessage(chatMessage + e.native);
    changeEmojiMenuVisible(false);
  }

  window.onclick = ((e) => {
    if (String(e.target.className).includes("send-message-emoji-menu"))
      changeEmojiMenuVisible(false);
  })

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
        <SmileyFace className="send-message-emoji-button" onClick={() => changeEmojiMenuVisible(!emojiMenuVisible)} />
      </div>
      <div className={(emojiMenuVisible ? "send-message-emoji-menu show" : "send-message-emoji-menu hide")}>
        <div className="emoji-wrapper"><Picker set="emojione" onSelect={(e) => handleEmojiClick(e)} /></div>
      </div>
    </React.Fragment>
  )
}
