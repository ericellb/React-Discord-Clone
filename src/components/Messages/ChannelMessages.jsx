import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Fade, Popover, CircularProgress } from '@material-ui/core';
import Code from 'react-code-prettify';
import UserInfo from '../UserInfo/UserInfo';

export default function ChannelMessages() {

  // Get State from Redux Store
  const chatStore = useSelector(state => state.chat);
  const { activeServer, activeChannel, activeView, activePMUser } = chatStore;

  // Get message list from channel or from specific user
  let messages = null;
  let messagesLength = null;
  if (activeView === "servers") {
    messages = chatStore.servers[activeServer]["channels"][activeChannel];
    messagesLength = messages.length;
  }
  else {
    messages = chatStore.privateMessages[activePMUser];
    // Some hacky stuff because API always responds with null message if none in channel
    if (messages === undefined) {
      messages = [];
      messages.push({ from: null, to: null, msg: null });
    }
    messagesLength = messages.length;
  }

  // Local state for user popover
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(12);
  const [loadMessages, setLoadMessages] = useState(false);
  const [userName, setUserName] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null);

  // ref to message container
  let messageContainerBottomRef;
  let messageContainerRef;

  // Scroll bottom of page 
  useEffect(() => {
    // Keep scroll on bottom
    if (!loadMessages)
      messageContainerBottomRef.scrollIntoView({ block: 'end', behavior: 'smooth' })
    else {
      messageContainerRef.scroll(0, 56);
    }
  })

  // On mount scroll to bottom
  useEffect(() => {
    messageContainerBottomRef.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [messageContainerBottomRef]);

  // Checks is message is a code block
  const isTextCodeBlock = (message) => {
    if (message.startsWith("```") && message.endsWith("```"))
      return true;
    else return false;
  }

  // Formats the code block
  const formatCode = (message) => {
    return message.split('```')[1];
  }

  // Handles clicks for setting anchor
  const handleUserClick = (e, userName) => {
    setUserName(userName);
    setUserInfoVisible(true);
    setAnchorEl(e.currentTarget);
  }

  // Closes popup
  const handlePopoverClose = () => {
    setUserInfoVisible(false);
    setAnchorEl(null);
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

  return (
    <div className="messages-container" onScroll={(e) => handleScrollTop(e)} ref={(element) => messageContainerRef = element}>
      {messagesLength >= messageIndex ?
        <div className="progress-container">
          <CircularProgress color="primary" />
        </div>
        : null}
      <List>
        {messages.slice(messagesLength - messageIndex, messagesLength).map((message, i) => {
          // Filter for null messages (dummy message on backend should fix...)
          if (message.msg !== null)
            return (
              <Fade in={true} timeout={500}>
                <ListItem className="message" key={i}>
                  <ListItemAvatar>
                    <Avatar>
                      <img className="user" onClick={(e) => handleUserClick(e, message.from)} src={process.env.PUBLIC_URL + "/user.png"} alt="user icon" height="48" />
                    </Avatar>
                  </ListItemAvatar>
                  {isTextCodeBlock(message.msg)
                    ? <ListItemText primary={<div className="user" onClick={(e) => handleUserClick(e, message.from)}>{message.from}</div>} secondary={<Code codeString={formatCode(message.msg)} />} className="message-text" />
                    : <ListItemText primary={<div className="user" onClick={(e) => handleUserClick(e, message.from)}>{message.from}</div>} secondary={message.msg} className="message-text" />
                  }
                </ListItem>
              </Fade>
            )
          else return null;
        })}
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
