import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Fade, Popover, CircularProgress } from '@material-ui/core';
import Code from 'react-code-prettify';
import UserInfo from '../UserInfo/UserInfo';

export default function Messages() {

  // Get State from Redux Store
  const chatStore = useSelector(state => state.chat);
  const { activeServer, activeChannel } = chatStore;

  // Local state for user popover
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(12);
  const [loadMessages, setLoadMessages] = useState(false);
  const [userName, setUserName] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null);

  // ref to message container
  let messageContainerBottomRef;
  let messageContainerRef;

  useEffect(() => {
    // Keep scroll on bottom
    if (!loadMessages)
      messageContainerBottomRef.scrollIntoView({ block: 'end', behavior: 'smooth' })
    else {
      messageContainerRef.scroll(0, 56);
    }
  })

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

  const messagesLength = chatStore.servers[activeServer][activeChannel].length;
  console.log(chatStore.servers[activeServer][activeChannel].slice(0, messagesLength - messageIndex));

  return (
    <div className="messages-container" onScroll={(e) => handleScrollTop(e)} ref={(element) => messageContainerRef = element}>
      {messagesLength !== messageIndex ?
        <div className="progress-container">
          <CircularProgress color="primary" />
        </div>
        : null}
      <List>
        {chatStore.servers[activeServer][activeChannel].slice(messagesLength - messageIndex, messagesLength).map((message, i) => {
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
        <UserInfo userName={userName} />
      </Popover>
    </div>
  )
}
