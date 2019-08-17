import React, { useState } from 'react'
import { Card, CardHeader, Typography, CardMedia, CardContent, makeStyles, TextField } from '@material-ui/core';

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

  const { userName } = props;
  const classes = useStyle();
  const [message, setMessage] = useState('');

  // Handles keypress and calls the callback method
  const handleKeyPress = (e, callbackMethod) => {
    if (e.key === "Enter") {
      callbackMethod();
    }
  }

  // Calls API to send a Private message
  const sendPrivateMessage = (message) => {

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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, () => sendPrivateMessage(message))}
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
