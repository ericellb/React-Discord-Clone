import React, { useState } from 'react'

import { Person, MoreVert } from '@material-ui/icons';
import { List, ListItem, ListItemAvatar, Avatar, Tooltip, IconButton, Typography, ListItemText, ListItemSecondaryAction, Menu, MenuItem, Slide } from '@material-ui/core';
import { changeTopic } from '../../actions';

import GoogleOAuth from '../GoogleOAuth/GoogleOAuth';

import { useSelector, useDispatch } from 'react-redux';

export default function Topics(props) {

  // Get State from Redux Store
  const chatStore = useSelector(state => state.chat);
  const topics = Object.keys(chatStore.servers[chatStore.activeServer]);
  const { activeServer } = chatStore;
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  // Get props from parent
  const { setDrawerVisible, setModalVisible, setModalType } = props;

  // Local state
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle topic change, and closes drawer if on mobile view
  const handleTopicChange = (topic) => {
    dispatch(changeTopic(topic));
    if (typeof setDrawerVisible !== "undefined")
      setDrawerVisible(false)
  }

  // Handles to show modal, and its type
  const handleModalShow = () => {
    setModalType('channel');
    setModalVisible(true);
  }

  // Handles showing of Settings Menu
  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  // Handles closing settings menu
  const handleClose = () => {
    setAnchorEl(null);
  }

  return (
    <div className="topics-container">

      <List className="topic-list">
        <ListItem className="title-container">
          {activeServer.split('-')[0]}
          {user.isSignedIn ?
            <Tooltip title="Server Settings" key="server-settings" placement="right" className="tooltip">
              <IconButton onClick={(e) => handleSettingsClick(e)}> <MoreVert /> </IconButton>
            </Tooltip>
            : null
          }
          <Menu
            id="settings-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClick={handleClose}
            onClose={handleClose}
          >
            <MenuItem> Server Id - {activeServer.split('-')[1]} </MenuItem>
            <MenuItem onClick={() => handleModalShow()}> Add Channel </MenuItem>
          </Menu>
        </ListItem>
        {topics.map((topic, i) => (
          <Slide direction="right" in={true} timeout={150 * (i + 1)} key={topic + activeServer}>
            <ListItem onClick={(e) => handleTopicChange(topic)} button>
              <i className="topic-hashtag">#</i>
              <Typography variant="body1">{topic.split('-')[0].toLowerCase()}</Typography>
            </ListItem>
          </Slide>
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
