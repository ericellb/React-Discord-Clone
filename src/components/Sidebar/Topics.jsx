import React from 'react'

import { Person, Add } from '@material-ui/icons';
import { List, ListItem, ListItemAvatar, Avatar, Tooltip, IconButton, Typography, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { changeTopic } from '../../actions';

import GoogleOAuth from '../GoogleOAuth/GoogleOAuth';

import { useSelector, useDispatch } from 'react-redux';

export default function Topics(props) {

  // Get props from parent
  const { changeDrawerVisible } = props;

  // Get State from Redux Store
  const chatStore = useSelector(state => state.chat);
  const topics = Object.keys(chatStore.servers[chatStore.activeServer]);
  const { activeServer } = chatStore;
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  return (
    <div className="topics-container">

      <List className="topic-list">
        <ListItem className="title-container">
          {activeServer.split('-')[0]}
          <Tooltip title="Add channel" key="add-channel" placement="right" className="tooltip">
            <IconButton className="topic-icon" >
              <Add />
            </IconButton>
          </Tooltip>
        </ListItem>
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
              <Person />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.userName} />
          <ListItemSecondaryAction>
            <GoogleOAuth />
          </ListItemSecondaryAction>
        </ListItem>
      </div>

    </div>
  )
}
