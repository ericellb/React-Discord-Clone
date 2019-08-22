import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';


import { useDispatch } from 'react-redux';
import { newMessage, newPrivateMessage } from '../../actions';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart';

import SmileyFace from '@material-ui/icons/SentimentVerySatisfied';

export default function SendMessage(props) {

  // Get State from Redux Store
  const { activeServer, activeChannel, activeView, activePMUser } = useSelector(state => state.chat);
  const { userName } = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Local state
  const [chatMessage, setChatMessage] = useState('');
  const [emojiMenuVisible, setEmojiMenuVisible] = useState(false);
  const [placeholderTitle, setPlaceholderTitle] = useState(null)


  // Check active view to determine where we send our messages
  useEffect(() => {
    if (activeView === "servers") {
      setPlaceholderTitle(activeChannel.split('-')[0]);

    }
    else if (activeView === "home") {
      setPlaceholderTitle(activePMUser);

    }
  }, [activeView, activeChannel, activePMUser])

  // Handles submission of messages
  // Dispatches event and sets TextField value to empty
  function handleSubmit(message) {
    if (message.msg.trim() !== "") {
      // Send message to server, or user
      if (activeView === "servers")
        dispatch(newMessage(message));
      else if (activeView === "home") {
        console.log(message);
        dispatch(newPrivateMessage(message));
      }
      setChatMessage("");
    }
  }

  // Handles enter event to submit message
  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      if (activeView === "servers")
        handleSubmit({ server: activeServer, channel: activeChannel, from: userName, msg: chatMessage });
      else if (activeView === "home")
        handleSubmit({ from: userName, to: activePMUser, msg: chatMessage });
    }
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
          placeholder={`Message  #${placeholderTitle}`}
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
