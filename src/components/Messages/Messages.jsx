import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Fade } from '@material-ui/core';
import Code from 'react-code-prettify';

export default function Messages() {

  // Get State from Redux Store
  const chatStore = useSelector(state => state.chat);
  const { activeServer, activeChannel } = chatStore;

  // ref to message container
  let messageContainer;

  useEffect(() => {
    // Keep scroll on bottom
    messageContainer.scrollIntoView()
  })

  const isTextCodeBlock = (message) => {
    if (message.startsWith("```") && message.endsWith("```"))
      return true;
    else return false;
  }

  const formatCode = (message) => {
    return message.split('```')[1];
  }

  return (
    <div className="messages-container">
      <List>
        {chatStore.servers[activeServer][activeChannel].map((message, i) => {
          // Filter for null messages (dummy message on backend should fix...)
          if (message.msg !== null)
            return (
              <Fade in={true} timeout={500}>
                <ListItem className="message" key={i}>
                  <ListItemAvatar>
                    <Avatar>
                      <img src={process.env.PUBLIC_URL + "/user.png"} alt="user icon" height="48" />
                    </Avatar>
                  </ListItemAvatar>
                  {isTextCodeBlock(message.msg)
                    ? <ListItemText primary={message.from} secondary={<Code codeString={formatCode(message.msg)} />} className="message-text" />
                    : <ListItemText primary={message.from} secondary={message.msg} className="message-text" />
                  }
                </ListItem>
              </Fade>

            )
          else return null;
        })}
      </List>
      <div ref={(element) => messageContainer = element}></div>
    </div>
  )
}
