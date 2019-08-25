import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Fade, Popover, CircularProgress } from '@material-ui/core';
import moment from 'moment';
import Code from 'react-code-prettify';
import UserInfo from '../UserInfo/UserInfo';

export default function Messages() {

  // Get States from Redux Store
  const chatStore = useSelector(state => state.chat);
  const { activeServer, activeChannel, activeView, activePMUser } = chatStore;

  // Local states
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(12);
  const [loadMessages, setLoadMessages] = useState(false);
  const [userName, setUserName] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null);

  // ref to message container (for keeping scroll to bottom of chat)
  let messageContainerBottomRef;
  let messageContainerRef;

  // Get message list from channel or from specific user
  let messages = null;
  let messagesLength = null;
  if (activeView === "servers") {
    messages = chatStore.servers[activeServer]["channels"][activeChannel];
    messagesLength = messages.length;
  }
  else {
    messages = chatStore.privateMessages[activePMUser];
    // If no messages need to make empty array
    if (messages === undefined) {
      messages = [];
    }
    messagesLength = messages.length;
  }

  // Scroll to bottom of container if were not loading new messages
  useEffect(() => {
    if (!loadMessages)
      messageContainerBottomRef.scrollIntoView({ block: 'end', behavior: 'smooth' })
    else {
      setLoadMessages(false);
      messageContainerRef.scroll(0, 56);
    }
  }, [messageContainerBottomRef, messageContainerRef, loadMessages, messages]);

  // Checks is message is a code block
  const isTextCodeBlock = (message) => {
    if (message.startsWith("```") && message.endsWith("```"))
      return true;
    else return false;
  }

  // Handles to load more messages when scroll at top
  const handleScrollTop = (e) => {
    const element = e.target;
    if (element.scrollTop > 100) {
      setLoadMessages(false);
    }
    if (element.scrollTop === 0) {
      if (messagesLength > messageIndex) {
        setTimeout(() => {
          setLoadMessages(true);
          if (messageIndex + 12 > messagesLength) {
            setMessageIndex(messagesLength);
          }
          else {
            setMessageIndex(messageIndex + 12);
          }
        }, 400)
      }
    }
  }

  // Formats the code block
  const formatCode = (message) => {
    return message.split('```')[1];
  }

  // Handles clicks for setting anchor to User Info (To private message)
  const handleUserClick = (e, userName) => {
    setUserName(userName);
    setUserInfoVisible(true);
    setAnchorEl(e.currentTarget);
  }

  // Closes popup of User Info
  const handlePopoverClose = () => {
    setUserInfoVisible(false);
    setAnchorEl(null);
  }

  return (
    <div className="messages-container" onScroll={(e) => handleScrollTop(e)} ref={(element) => messageContainerRef = element}>
      {messagesLength >= messageIndex ?
        <div className="progress-container">
          <CircularProgress color="primary" />
        </div>
        : null}
      <List>
        {messages !== null ? messages.slice(messagesLength - messageIndex, messagesLength).map((message, i) => {
          // Filter for null messages (dummy message on backend should fix...)
          return (
            <Fade in={true} timeout={500}>
              <ListItem className="message" key={i}>
                <ListItemAvatar className="message-user-icon">
                  <Avatar>
                    <img onClick={(e) => handleUserClick(e, message.from)} src={process.env.PUBLIC_URL + "/user.png"} alt="user icon" height="48" />
                  </Avatar>
                </ListItemAvatar>
                {isTextCodeBlock(message.msg)
                  ? <ListItemText primary={<div className="message-user" onClick={(e) => handleUserClick(e, message.from)}>{message.from.toLowerCase()}<div className="message-date">{` - ${moment(message.date).format('LLL')}`}</div></div>} secondary={<Code codeString={formatCode(message.msg)} />} className="message-text" />
                  : <ListItemText primary={<div className="message-user" onClick={(e) => handleUserClick(e, message.from)}>{message.from.toLowerCase()}<div className="message-date">{` - ${moment(message.date).format('LLL')}`}</div></div>} secondary={message.msg} className="message-text" />
                }
              </ListItem>
            </Fade>
          )
        }) : null}
      </List>
      <div ref={(element) => messageContainerBottomRef = element}></div>
      <Popover
        id="user-info"
        open={userInfoVisible}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <UserInfo userName={userName} setUserInfoVisible={setUserInfoVisible} />
      </Popover>
    </div>
  )
}
