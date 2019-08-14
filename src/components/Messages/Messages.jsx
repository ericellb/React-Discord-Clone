import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core';

export default function Messages() {

  // Get State from Redux Store
  const chatStore = useSelector(state => state.chat);
  const { activeServer, activeTopic } = chatStore;

  // ref to message container
  let messageContainer;

  useEffect(() => {
    // Keep scroll on bottom
    messageContainer.scrollIntoView()
  })

  return (
    <div className="messages-container">
      <List>
        {chatStore.servers[activeServer][activeTopic].map((message, i) => {
          // Filter for null messages (dummy message on backend should fix...)
          if (message.msg !== null)
            return (
              <ListItem className="message" key={i}>
                <ListItemAvatar>
                  <Avatar>
                    <img src={process.env.PUBLIC_URL + "/user.png"} alt="user icon" height="48" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={message.from} secondary={message.msg} className="message-text" />
              </ListItem>
            )
          else return null;
        })}
      </List>
      <div ref={(element) => messageContainer = element}></div>
    </div>
  )
}
