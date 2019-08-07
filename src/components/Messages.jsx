import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

import { Chip, Icon, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

export default function Messages(props) {

  // Get store
  const { activeServer, activeTopic } = useSelector(state => state.chat);

  const chatStore = useSelector(state => state.chat);

  let messageContainer;

  useEffect(() => {
    // Keep scroll on bottom
    messageContainer.scrollIntoView()
  })

  return (
    <div className="messages-container">
      <List>
        {chatStore.servers[activeServer][activeTopic].map((message, i) => (
          <ListItem className="message" key={i}>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={message.from} secondary={message.msg} className="message-text" />
          </ListItem>
        ))}
      </List>
      <div ref={(element) => messageContainer = element}></div>
    </div>
  )
}
