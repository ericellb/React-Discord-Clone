import React from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import PersonIcon from '@material-ui/icons/Person';
import GroupWork from '@material-ui/icons/GroupWork';
import { List, ListItem, ListItemAvatar, Avatar, Tooltip, IconButton, Typography, ListItemText, ListItemSecondaryAction } from '@material-ui/core';


import { changeServer, changeTopic } from '../actions';
import GoogleOAuth from './GoogleOAuth';

export default function Topics(props) {


  // Get chats from store
  const chatStore = useSelector(state => state.chat);
  const servers = Object.keys(chatStore.servers);
  const topics = Object.keys(chatStore.servers[chatStore.activeServer]);
  const { activeServer } = chatStore;

  // Get user from store
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Get props from parent
  const { changeDrawerVisible } = props;

  return (
    <div className="sidebar-container">
      <div className="servers-container">
        <List>
          {servers.map(server => (
            <Tooltip title={server} key={server} placement="right" className="server-tooltip">
              <IconButton className="server-icon" onClick={() => dispatch(changeServer(server, server.server_id))}>
                <GroupWork />
              </IconButton>
            </Tooltip>
          ))}
        </List>
      </div>
      <div className="topics-container">
        <List className="topic-list">
          <ListItem className="title-container">{activeServer.split('-')[0]}</ListItem>
          {topics.map(topic => (
            <ListItem onClick={(e) => { dispatch(changeTopic(topic)); if (typeof changeDrawerVisible !== "undefined") changeDrawerVisible(false) }} key={topic} button>
              <i className="topic-hashtag">#</i>
              <Typography variant="body1">{topic.split('-')[0].toLowerCase()}</Typography>
            </ListItem>
          ))}
        </List>
        <div className="user-options">
          <ListItem className="user-info">
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.userName} />
            <ListItemSecondaryAction>
              <GoogleOAuth />
            </ListItemSecondaryAction>
          </ListItem>
        </div>
      </div>
    </div >
  )
}
