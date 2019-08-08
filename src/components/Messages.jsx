import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

import { List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import Header from './Header';

export default function Messages(props) {

  // Get store state
  const chatStore = useSelector(state => state.chat);
  const { activeServer, activeTopic } = chatStore;

  // Get props 
  const { topics, servers } = props;

  // ref
  let messageContainer;

  useEffect(() => {
    // Keep scroll on bottom
    messageContainer.scrollIntoView()
  })

  return (
    <React.Fragment>
      <Header topics={topics} servers={servers}></Header>
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
    </React.Fragment>
  )
}
