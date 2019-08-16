import React, { useState } from 'react'
import { useSelector } from 'react-redux';


import { useDispatch } from 'react-redux';
import { addMessage, newMessage } from '../../actions';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart';

import SmileyFace from '@material-ui/icons/SentimentVerySatisfied';

export default function SendMessage(props) {

  // Get State from Redux Store
  const { activeServer, activeChannel } = useSelector(state => state.chat);
  const { userName } = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Local state
  const [chatMessage, setChatMessage] = useState('');
  const [emojiMenuVisible, setEmojiMenuVisible] = useState(false);

  // Handles submission of messages
  // Dispatches event and sets TextField value to empty
  function handleSubmit(message) {
    dispatch(newMessage(message));
    setChatMessage("");
  }

  // Handles enter event to submit message
  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey)
      handleSubmit({ server: activeServer, channel: activeChannel, from: userName, msg: chatMessage });
  }

  // Handles changes in message box (catches enter to not send new lines. (Must send SHIFT+ENTER))
  function handleOnChange(e) {
    if (e.target.value !== "\n")
      setChatMessage(e.target.value)
  }


  // When click emoji, close the menu
  function handleEmojiClick(e) {
    setChatMessage(chatMessage + e.native);
    setEmojiMenuVisible(false);
  }

  // Closes emoji menu when clicked outside the div
  window.onclick = ((e) => {
    if (String(e.target.className).includes("send-message-emoji-menu"))
      setEmojiMenuVisible(false);
  })

  return (
    <React.Fragment>
      <div className="send-message-border" />
      <div className="send-message-container">
        <TextareaAutosize
          aria-label="empty textarea"
          placeholder={`Message  #${activeChannel.split('-')[0]}`}
          className="message-text-area"
          value={chatMessage}
          onChange={(e) => handleOnChange(e)}
          onKeyPress={(e) => handleKeyPress(e)}
        />
        <SmileyFace className="send-message-emoji-button" onClick={() => setEmojiMenuVisible(!emojiMenuVisible)} />
      </div>
      <div className={(emojiMenuVisible ? "send-message-emoji-menu show" : "send-message-emoji-menu hide")}>
        <div className="emoji-wrapper"><Picker set="emojione" onSelect={(e) => handleEmojiClick(e)} /></div>
      </div>
    </React.Fragment>
  )
}
