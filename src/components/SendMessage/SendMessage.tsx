import React, { useState, useEffect, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import SmileyFace from '@material-ui/icons/SentimentVerySatisfied';
import { StoreState } from '../../reducers';
import { sendMessage, sendPrivateMessage } from '../../actions';
import { SendMessageData, SendPrivateMessageData } from '../../actions/types';

export default function SendMessage() {
  // Get State from Redux Store
  const { activeServer, activeChannel, activeView, activePMUser } = useSelector((state: StoreState) => state.chat);
  const { userName } = useSelector((state: StoreState) => state.user);
  const dispatch = useDispatch();

  // Local state
  const [chatMessage, setChatMessage] = useState('');
  const [emojiMenuVisible, setEmojiMenuVisible] = useState(false);
  const [placeholderTitle, setPlaceholderTitle] = useState('');

  // Check active view to determine where we send our messages
  useEffect(() => {
    if (activeView === 'servers') {
      setPlaceholderTitle(activeChannel.split('-')[0]);
    } else if (activeView === 'home') {
      setPlaceholderTitle(activePMUser);
    }
  }, [activeView, activeChannel, activePMUser]);

  // Checks is message is valid (not just spaces)
  function isValidMessage(msg: string) {
    let validMessage = true;
    // Check if empty stirng
    if (msg.trim() === '') validMessage = false;
    return validMessage;
  }

  // Will format out multiple line breaks to 2 max
  function formatMessage(msg: string) {
    return msg.replace(/(\r\n|\r|\n){3,}/g, '$1\n\n');
  }

  // Handles submission of messages
  // Dispatches event and sets TextField value to empty
  function handleSubmit(message: SendMessageData | SendPrivateMessageData) {
    if (isValidMessage(message.msg)) {
      message.msg = formatMessage(message.msg);
      // Send message to server, or user
      if (activeView === 'servers' && message.type === 'channelMessage') {
        dispatch(sendMessage(message));
      } else if (activeView === 'home' && message.type === 'privateMessage') {
        dispatch(sendPrivateMessage(message));
      }
      setChatMessage('');
    } else {
      // throw some error
    }
  }

  // Handles enter event to submit message
  function handleKeyPress(e: any) {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (activeView === 'servers')
        handleSubmit({
          server: activeServer,
          channel: activeChannel,
          from: userName,
          msg: chatMessage,
          type: 'channelMessage'
        });
      else if (activeView === 'home')
        handleSubmit({ from: userName, to: activePMUser, msg: chatMessage, type: 'privateMessage' });
    }
  }

  // Handles changes in message box (catches enter to not send new lines. (Must send SHIFT+ENTER))
  function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.value !== '\n') setChatMessage(e.target.value);
  }

  // When click emoji, close the menu
  function handleEmojiClick(e: any) {
    setChatMessage(chatMessage + e.native);
    setEmojiMenuVisible(false);
  }

  // Closes emoji menu when clicked outside the div
  window.onclick = (e: any) => {
    if (String(e.target.className).includes('send-message-emoji-menu')) setEmojiMenuVisible(false);
  };

  return (
    <React.Fragment>
      <div className="send-message-border" />
      <div className="send-message-container">
        <TextareaAutosize
          aria-label="empty textarea"
          placeholder={`Message  #${placeholderTitle}`}
          className="message-text-area"
          value={chatMessage}
          onChange={e => handleOnChange(e)}
          onKeyPress={e => handleKeyPress(e)}
        />
        <SmileyFace className="send-message-emoji-button" onClick={() => setEmojiMenuVisible(!emojiMenuVisible)} />
      </div>
      <div className={emojiMenuVisible ? 'send-message-emoji-menu show' : 'send-message-emoji-menu hide'}>
        <div className="emoji-wrapper">
          <Picker set="emojione" onSelect={e => handleEmojiClick(e)} />
        </div>
      </div>
    </React.Fragment>
  );
}
