import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Paper, Button, Card, CardContent, Typography, CardActionArea, CardMedia, Slide, TextField } from '@material-ui/core';
import { GroupAdd, AddToQueue } from '@material-ui/icons';
import axios from 'axios';

import { getInitialData } from '../../actions';

export default function CreateJoinModal(props) {

  // Get user from Redux Store
  const { userId } = useSelector(state => state.user);

  // Get data from props
  const { handleModalClose } = props;

  // Dispatch
  const dispatch = useDispatch();

  // Base URL for http requests
  const baseUrl = (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://simple-chat-apix.herokuapp.com/');

  // Local state
  const [mainVisible, setMainVisible] = useState(true);
  const [mainDirection, setMainDirection] = useState('left')
  const [createVisible, setCreateVisible] = useState(false);
  const [createDirection, setCreateDirection] = useState('left')
  const [joinVisible, setJoinVisible] = useState(false)
  const [joinDirection, setJoinDirection] = useState('left')
  const [serverName, setServerName] = useState('')
  const [serverId, setServerId] = useState('')


  // Handles showing the Join server Fields
  const showJoinServer = () => {
    setMainDirection('right');
    setCreateDirection('left');
    setJoinVisible(true);
    setMainVisible(false);
  }

  // Handles showing the Create Server Field
  const showCreateServer = () => {
    setMainDirection('right');
    setJoinDirection('left');
    setCreateVisible(true);
    setMainVisible(false);
  }

  const renderMain = () => {
    return (
      <Slide direction={mainDirection} in={mainVisible} mountOnEnter unmountOnExit>
        <div className="modal-main">
          <div className="modal-title modal-flex">
            <Typography variant="h5" color="primary" align="center">Another server? Wow you're popular!</Typography>
          </div>
          <div className="modal-create-server modal-flex">
            <Card>
              <CardActionArea onClick={() => showCreateServer()}>
                <CardContent>
                  <Typography variant="h5" color="primary" gutterBottom>Create</Typography>
                  <Typography variant="body1" paragraph>Create a server and invite all your buddies.</Typography>
                  <CardMedia>
                    <AddToQueue className="modal-card-icon" />
                  </CardMedia>
                  <Button variant="contained" color="primary">Join a server</Button>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
          <div className="modal-join-server modal-flex">
            <Card>
              <CardActionArea onClick={() => showJoinServer()}>
                <CardContent>
                  <Typography variant="h5" color="secondary" gutterBottom>Join</Typography>
                  <Typography variant="body1" paragraph>Join a friends server and pwn some noobs!</Typography>
                  <CardMedia>
                    <GroupAdd className="modal-card-icon" />
                  </CardMedia>
                  <Button variant="contained" color="secondary">Join a server</Button>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        </div>
      </Slide >
    )
  }

  const renderServerCreate = () => {
    return (
      <Slide direction={createDirection} in={createVisible} mountOnEnter unmountOnExit timeout={500}>
        <div className="modal-create">
          <div className="modal-title modal-flex">
            <Typography variant="h5" color="primary" align="center">Create a Server!</Typography>
          </div>
          <div className="modal-create-content">
            <Typography variant="body1" paragraph> Enter a Server Name to create a server and get access to unlimited chat channels! </Typography>
            <TextField
              id="create-server-field"
              label="Server Name"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              margin="dense"
              variant="outlined"
            />
            <Button style={{ marginLeft: '1em' }} variant="contained" color="primary" onClick={() => createServer(serverName, userId)}>Create Server</Button>
          </div>
        </div>
      </Slide >
    )
  }

  const renderServerJoin = () => {
    return (
      <Slide direction={joinDirection} in={joinVisible} mountOnEnter unmountOnExit timeout={500}>
        <div className="modal-create">
          <div className="modal-title modal-flex">
            <Typography variant="h5" color="primary" align="center">Join a Server!</Typography>
          </div>
          <div className="modal-create-content">
            <Typography variant="body1" paragraph> Enter a the Server Id provided by your friend and start chatting right now!  </Typography>
            <TextField
              id="join-server-field"
              label="Server Name"
              value={serverId}
              onChange={(e) => setServerId(e.target.value)}
              margin="dense"
              variant="outlined"
            />
            <Button style={{ marginLeft: '1em' }} variant="contained" color="primary">Join Server</Button>
          </div>
        </div>
      </Slide >
    )
  }


  // Method to handle creation of servers
  // Will reload the inital data (Gets new servers)
  const createServer = async (serverName, userId) => {
    const response = await axios.post(`${baseUrl}/servers?userId=${userId}&serverName=${serverName}`);
    if (response) {
      dispatch(getInitialData(userId));
      handleModalClose(response.data);
    }
  }

  return (
    <Paper className="modal-container">
      {renderMain()}
      {renderServerCreate()}
      {renderServerJoin()}
    </Paper >
  )
}
