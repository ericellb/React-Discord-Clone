import React, { useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Popover } from '@material-ui/core';
import { useSelector } from 'react-redux';
import UserInfo from '../UserInfo/UserInfo';
import { StoreState } from '../../reducers';

export default function ActiveUserList() {
  // Get user list from redux store
  const { activeUserList } = useSelector((state: StoreState) => state.chat);

  // Local state
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  // Handles clicks for setting anchor to User Info (To private message)
  const handleUserClick = (e: any, userName: string) => {
    setUserName(userName);
    setUserInfoVisible(true);
    setAnchorEl(e.currentTarget);
  };

  // Closes popup of User Info
  const handlePopoverClose = () => {
    setUserInfoVisible(false);
    setAnchorEl(null);
  };
  return (
    <div className="user-list-container">
      <List className="users-list">
        <ListItem className="users-list-title"> Active Users </ListItem>
        {activeUserList.map(user => {
          return (
            <ListItem button className="user-list-item" onClick={e => handleUserClick(e, user.user_name)}>
              <ListItemAvatar className="message-user-icon">
                <Avatar>
                  <img src={process.env.PUBLIC_URL + '/user.png'} alt="user icon" height="48" />
                  <div className="user-list-online"></div>
                </Avatar>
              </ListItemAvatar>
              <ListItemText>{user.user_name}</ListItemText>
            </ListItem>
          );
        })}
      </List>

      <Popover
        id="user-info"
        open={userInfoVisible}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <UserInfo userName={userName} setUserInfoVisible={setUserInfoVisible} />
      </Popover>
    </div>
  );
}
