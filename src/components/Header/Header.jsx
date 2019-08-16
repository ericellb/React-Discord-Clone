import React, { useState } from 'react'
import { useSelector } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { SwipeableDrawer } from '@material-ui/core';

import Sidebar from '../Sidebar/Sidebar';

export default function Header(props) {

  // Get State from Redux Store
  const chatStore = useSelector(state => state.chat);
  const servers = Object.keys(chatStore.servers);
  const channels = Object.keys(chatStore.servers[chatStore.activeServer]);
  const { activeChannel } = chatStore;

  // Local state
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <AppBar position="static">
      <Toolbar className="navbar">
        <IconButton edge="start" color="inherit" aria-label="menu" className="menu-burger-button" onClick={() => setDrawerVisible(true)}>
          <MenuIcon />
        </IconButton>
        <SwipeableDrawer
          anchor="left"
          open={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          onOpen={() => null}>
          <Sidebar channels={channels} servers={servers} setDrawerVisible={setDrawerVisible} />
        </SwipeableDrawer>
        <i className="channel-hashtag">#</i>
        <Typography variant="h6"> {activeChannel.split('-')[0].toLowerCase()} </Typography>
      </Toolbar>
    </AppBar>
  )
}
