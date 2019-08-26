import React from 'react'
import { List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core';
import { useSelector } from 'react-redux';

export default function ActiveUserList() {

  // Get user list from redux store
  const { activeUserList } = useSelector(state => state.chat);

  return (
    <div className="user-list-container">
      <List className="users-list">
        <ListItem className="users-list-title"> Active Users </ListItem>

        {activeUserList.map((user) => {
          return (
            <ListItem button className="user-list-item">
              <ListItemAvatar className="message-user-icon">
                <Avatar>
                  <img src={process.env.PUBLIC_URL + "/user.png"} alt="user icon" height="48" />
                  <div className='user-list-online'></div>
                </Avatar>
              </ListItemAvatar>
              <ListItemText>{user.user_name}</ListItemText>
            </ListItem>
          )
        })}


      </List>
    </div>
  )
}
