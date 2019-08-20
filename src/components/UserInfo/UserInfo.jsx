import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, makeStyles, TextField } from '@material-ui/core';
import { NEW_PRIVATE_MESSAGE } from '../../actions/types';

const useStyle = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: 250,
    background: '#2f3136'
  },
  cardHeader: {
    background: '#202225',
    width: '100%'
  },
  image: {
    marginTop: '1em',
    marginBottom: '8px'
  },
  cardInput: {
    padding: '1em'
  },
  input: {
    height: '38px'
  }
}));

export default function UserInfo(props) {

  // Get state from redux store
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const { userName } = props;
  const classes = useStyle();
  const [messageText, setMessageText] = useState('');

  // Handles keypress and calls the callback method
  const handleKeyPress = (e, callbackMethod) => {
    if (e.key === "Enter") {
      callbackMethod();
    }
  }

  // Calls API to send a Private message
  const sendPrivateMessage = (messageText, userName) => {
    const msg = { "from": user.userName, "text": messageText, "to": userName };
    dispatch({ type: NEW_PRIVATE_MESSAGE, payload: msg })
  }

  return (
    <Card className={classes.card}>
      <div className={classes.cardHeader}>
        <img src={process.env.PUBLIC_URL + "/user.png"} alt="user-icon" className={classes.image} />
        <Typography variant='body1' gutterBottom>{userName}</Typography>
      </div>
      <div className={classes.cardInput}>
        <TextField
          id="user-private-message"
          label={`Private message`}
          placeholder={`Message @ ${userName}`}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, () => sendPrivateMessage(messageText, userName))}
          variant="outlined"
          InputProps={{
            className: classes.input
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
      </div>
    </Card>
  )
}
