import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import PersonIcon from '@material-ui/icons/Person';
import GroupWork from '@material-ui/icons/GroupWork';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Tooltip, IconButton, Typography, TextField } from '@material-ui/core';


import { changeServer, changeTopic, signIn, signOut } from '../actions';

export default function Topics(props) {

  // Get store
  const user = useSelector(state => state.user);

  const [userName, changeUserName] = useState(user.userName);

  const { topics, servers } = props;

  const dispatch = useDispatch();

  function handleKeyPress(e) {
    console.log('fired');
    if (e.key === "Enter")
      dispatch({ type: 'SIGN_IN', payload: { userId: '1', userName: userName } });
  }

  return (
    <div className="sidebar-container">
      <div className="servers-container">
        <List>
          {servers.map(server => (
            <Tooltip title={server} key={server} placement="right" className="server-tooltip">
              <IconButton className="server-icon">
                <GroupWork onClick={() => dispatch(changeServer(server))} />
              </IconButton>
            </Tooltip>
          ))}
        </List>
      </div>
      <div className="topics-container">
        <List className="topic">
          {topics.map(topic => (
            <ListItem onClick={(e) => dispatch(changeTopic(topic))} key={topic} button>
              <i style={{ verticalAlign: 'text-bottom', fontWeight: 'bold' }} className="topic-hashtag">#</i>
              <Typography variant="body1">{topic}</Typography>
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
            <TextField
              id="user-name"
              value={userName}
              onChange={(e) => changeUserName(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e)}
            />
          </ListItem>
        </div>
      </div>
    </div>
  )
}
