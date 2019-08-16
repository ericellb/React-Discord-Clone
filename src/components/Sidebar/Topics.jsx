import React, { useState, useEffect } from 'react'

import { Person, MoreVert, Settings } from '@material-ui/icons';
import { List, ListItem, ListItemAvatar, Avatar, Tooltip, IconButton, Typography, ListItemText, Menu, MenuItem, Slide } from '@material-ui/core';
import { changeTopic } from '../../actions';

import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

const baseUrl = (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://simple-chat-apix.herokuapp.com');

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
  const [serverAnchorEl, setServerAnchorEl] = useState(null);
  const [channelAchorEl, setChannelAchorEl] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false);
  const [topicSettingsVisible, setTopicSettingsVisible] = useState(false);

  // Check if admin of active server
  // Will render admin options for server
  useEffect(() => {
    async function getAdmin() {
      let serverId = activeServer.split('-')[1];
      const response = await axios.get(`${baseUrl}/server/admin?serverId=${serverId}&userId=${user.userId}`);
      setIsAdmin(response.data);
    }
    getAdmin();
  }, [activeServer])


  // Handle topic change, and closes drawer if on mobile view
  const handleTopicChange = (topic) => {
    dispatch(changeTopic(topic));
    if (typeof setDrawerVisible !== "undefined")
      setDrawerVisible(false)
  }

  // Handles to show modal, and its type
  const handleModalShow = (modalType) => {
    setModalType(modalType);
    setModalVisible(true);
  }

  // Handles showing of Settings Menu
  const handleSettingsClick = (event, type) => {
    if (type === 'server')
      setServerAnchorEl(event.currentTarget);
    else if (type === 'channel')
      setChannelAchorEl(event.currentTarget);
  }

  // Handles closing settings menu
  const handleClose = () => {
    setServerAnchorEl(null);
    setChannelAchorEl(null)
  }

  return (
    <div className="topics-container">
      <List className="topic-list">
        <ListItem className="title-container">
          {activeServer.split('-')[0]}
          {isAdmin ?
            <React.Fragment>
              <Tooltip title="Server Settings" key="server-settings" placement="right" className="tooltip">
                <IconButton onClick={(e) => handleSettingsClick(e, 'server')}> <MoreVert /> </IconButton>
              </Tooltip>


            </React.Fragment>
            : null}
        </ListItem>
        {topics.map((topic, i) => (
          <Slide direction="right" in={true} timeout={200 * (i + 1)} key={topic + activeServer}>
            <ListItem onClick={(e) => handleTopicChange(topic)} button className="topic-item">
              <Typography variant="body1"><i className="topic-hashtag">#</i>{topic.split('-')[0].toLowerCase()}</Typography>
              {isAdmin ?
                <Tooltip title="Server Settings" key="server-settings" placement="right" className="tooltip">
                  <IconButton onClick={(e) => handleSettingsClick(e, 'channel')}> <Settings className="topic-settings" /> </IconButton>
                </Tooltip>
                : null}
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
        </ListItem>
      </div>

      <Menu id="server-settings-menu" anchorEl={serverAnchorEl} open={Boolean(serverAnchorEl)} onClick={handleClose} onClose={handleClose}>
        <MenuItem> Server Id - {activeServer.split('-')[1]} </MenuItem>
        <MenuItem onClick={() => handleModalShow('server-rename')}> Change Server Name </MenuItem>
        <MenuItem onClick={() => handleModalShow('channel-create')}> Add Channel </MenuItem>
      </Menu>

      <Menu id="channel-settings-menu" anchorEl={channelAchorEl} open={Boolean(channelAchorEl)} onClick={handleClose} onClose={handleClose}>
        <MenuItem onClick={() => handleModalShow('channel-rename')}> Change Channel Name </MenuItem>
        <MenuItem onClick={() => handleModalShow('channel-delete')}> Delete Channel </MenuItem>
      </Menu>

    </div>
  )
}
