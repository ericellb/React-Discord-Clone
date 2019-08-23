import React, { useState, useEffect } from 'react'

import { Person, MoreVert, Settings } from '@material-ui/icons';
import { List, ListItem, ListItemAvatar, Avatar, Tooltip, IconButton, Typography, ListItemText, Menu, MenuItem, Slide, Button } from '@material-ui/core';
import { changeChannel, signOut } from '../../actions';

import { useSelector, useDispatch } from 'react-redux';
import axios from '../Api/api';


export default function ChannelList(props) {

  // Get State from Redux Store
  const chatStore = useSelector(state => state.chat);
  const channels = Object.keys(chatStore.servers[chatStore.activeServer]["channels"]);
  const { activeServer } = chatStore;
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  // Get props from parent
  const { setDrawerVisible, setModalVisible, setModalType, handleSnackMessage } = props;

  // Local state
  const [serverAnchorEl, setServerAnchorEl] = useState(null);
  const [channelAchorEl, setChannelAchorEl] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false);

  // When user or active server changes, check if we are admin
  useEffect(() => {
    // Gets the status if we are admin of current server (allows us to change server settings)
    async function getAdmin() {
      let serverId = activeServer.split('-')[1];
      const response = await axios.get(`/server/admin?serverId=${serverId}&userId=${user.userId}`);
      setIsAdmin(response.data);
    }

    getAdmin();
  }, [activeServer, user])


  // Handle channel change, and closes drawer if on mobile view
  const handleChannelChange = (channel) => {
    dispatch(changeChannel(channel));
    if (typeof setDrawerVisible !== "undefined")
      setDrawerVisible(false)
  }

  // Checks if only 1 channel, if so does not call callback to delete channel
  const handleChannelDelete = (callBack) => {
    if (channels.length === 1) {
      handleSnackMessage("Please delete the server if only 1 channel");
    }
    else {
      callBack();
    }
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

  // Signs the user out
  const handleSignout = () => {
    localStorage.clear("user");
    dispatch(signOut(user.userId));
  }

  // Handles saving serverId to clipboard
  const handleSaveClipboard = (text) => {
    navigator.clipboard.writeText(text);
    handleSnackMessage(`Server ID ${text} saved to clipboard`, false);
  }

  return (
    <div className="channels-container">
      <List className="channel-list">
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
        {channels.map((channel, i) => (
          <Slide direction="right" in={true} timeout={200 * (i + 1)} key={channel + activeServer}>
            <ListItem onClick={(e) => handleChannelChange(channel)} button className="channel-item">
              <Typography variant="body1"><i className="channel-hashtag">#</i>{channel.split('-')[0].toLowerCase()}</Typography>
              {isAdmin ?
                <Tooltip title="Server Settings" key="server-settings" placement="right" className="tooltip">
                  <IconButton onClick={(e) => handleSettingsClick(e, 'channel')}> <Settings className="channel-settings" /> </IconButton>
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
          <Button onClick={handleSignout}>Sign out</Button>
        </ListItem>
      </div>

      <Menu id="server-settings-menu" anchorEl={serverAnchorEl} open={Boolean(serverAnchorEl)} onClick={handleClose} onClose={handleClose}>
        <MenuItem onClick={() => handleSaveClipboard(activeServer.split('-')[1])}> Server Id - {activeServer.split('-')[1]} </MenuItem>
        <MenuItem onClick={() => handleModalShow('server-rename')}> Change Server Name </MenuItem>
        <MenuItem onClick={() => handleModalShow('server-delete')}> Delete Server </MenuItem>
        <MenuItem onClick={() => handleModalShow('channel-create')}> Add Channel </MenuItem>
      </Menu>

      <Menu id="channel-settings-menu" anchorEl={channelAchorEl} open={Boolean(channelAchorEl)} onClick={handleClose} onClose={handleClose}>
        <MenuItem onClick={() => handleModalShow('channel-rename')}> Change Channel Name </MenuItem>
        <MenuItem onClick={() => handleChannelDelete(() => handleModalShow('channel-delete'))}> Delete Channel </MenuItem>
      </Menu>

    </div>
  )
}
