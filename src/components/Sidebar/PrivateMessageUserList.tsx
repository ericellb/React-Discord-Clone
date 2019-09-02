import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Slide, Button, Typography } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { signOut, changePMUser } from '../../actions';
import { StoreState } from '../../reducers';

export default function PrivateMessageUserList() {
  // Get from Redux store
  const { privateMessages } = useSelector((state: StoreState) => state.chat);
  const user = useSelector((state: StoreState) => state.user);
  const userList = Object.keys(privateMessages);
  const dispatch = useDispatch();

  // Signs the user out
  const handleSignOut = () => {
    localStorage.clear();
    dispatch(signOut());
  };

  return (
    <div className="channels-container">
      <List className="channel-list">
        <ListItem className="title-container">Home</ListItem>
        {userList.map((userItem, i) => (
          <Slide direction="right" in={true} timeout={200 * (i + 1)} key={i}>
            <ListItem button className="user-item" onClick={() => dispatch(changePMUser(userItem))}>
              <Avatar>
                {' '}
                <img className="user" src={process.env.PUBLIC_URL + '/user.png'} alt="user icon" height="48" />{' '}
              </Avatar>
              <Typography variant="body1" className="user-list-name">
                {userItem}
              </Typography>
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
          <Button onClick={handleSignOut}>Sign out</Button>
        </ListItem>
      </div>
    </div>
  );
}
