import React from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import PersonIcon from '@material-ui/icons/Person';
import GroupWork from '@material-ui/icons/GroupWork';
import { List, ListItem, ListItemAvatar, Avatar, Tooltip, IconButton, Typography, ListItemText, ListItemSecondaryAction } from '@material-ui/core';


import { changeServer, changeTopic } from '../actions';
import GoogleOAuth from './GoogleOAuth';

export default function Topics(props) {

  // Get store state
  const { activeServer } = useSelector(state => state.chat);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Get props from parent
  const { topics, servers, changeDrawerVisible } = props;

  return (
    <div className="sidebar-container">
      <div className="servers-container">
        <List>
          {servers.map(server => (
            <Tooltip title={server} key={server} placement="right" className="server-tooltip">
              <IconButton className="server-icon" onClick={() => dispatch(changeServer(server))}>
                <GroupWork />
              </IconButton>
            </Tooltip>
          ))}
        </List>
      </div>
      <div className="topics-container">
        <List className="topic-list">
          <ListItem className="title-container">{activeServer}</ListItem>
          {topics.map(topic => (
            <ListItem onClick={(e) => { dispatch(changeTopic(topic)); if (typeof changeDrawerVisible !== "undefined") changeDrawerVisible(false) }} key={topic} button>
              <i className="topic-hashtag">#</i>
              <Typography variant="body1">{topic.toLowerCase()}</Typography>
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
