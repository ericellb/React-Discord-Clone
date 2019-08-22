import React from 'react'
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Slide, Button, Typography } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { signOut, changePMUser } from '../../actions';

export default function PrivateMessageUserList() {

  // Get from Redux store
  const { privateMessages } = useSelector(state => state.chat);
  const user = useSelector(state => state.user);
  const userList = Object.keys(privateMessages);
  const dispatch = useDispatch();

  // Signs the user out
  const handleSignout = () => {
    localStorage.clear("user");
    dispatch(signOut(user.userId));
  }

  return (
    <div className="channels-container">
      <List className="channel-list">
        <ListItem className="title-container">
          Home
        </ListItem>
        {userList.map((user, i) => (
          <Slide direction="right" in={true} timeout={200 * (i + 1)} key={i}>
            <ListItem button className="user-item" onClick={() => dispatch(changePMUser(user))}>
              <Avatar> <img className="user" src={process.env.PUBLIC_URL + "/user.png"} alt="user icon" height="48" /> </Avatar>
              <Typography variant="body1" className="user-list-name">{user}</Typography>
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
    </div>
  )
}
