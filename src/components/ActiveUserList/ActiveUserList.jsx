import React from 'react'
import { List, ListItem } from '@material-ui/core';

export default function ActiveUserList() {

  return (
    <div className="users-container">
      <List className="channel-list">
        <ListItem className="title-container"> Active Users </ListItem>
        <ListItem>Another user</ListItem>
      </List>
    </div>
  )
}
