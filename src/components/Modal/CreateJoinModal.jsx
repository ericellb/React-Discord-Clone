import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Paper, Button, Card, CardContent, Typography, CardActionArea, CardMedia, Slide, TextField } from '@material-ui/core';
import { GroupAdd, AddToQueue } from '@material-ui/icons';
import axios from 'axios';

export default function CreateJoinModal(props) {

  // Get State from Redux Store
  const { userId } = useSelector(state => state.user);
  const { activeServer } = useSelector(state => state.chat);

  // Get data from props
  const { handleModalSuccess, modalType } = props;

  // Base URL for http requests
  const baseUrl = (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://simple-chat-apix.herokuapp.com');

  // Local state to control Modal Windows + Data fields
  const [mainVisible, setMainVisible] = useState(true);
  const [mainDirection, setMainDirection] = useState('left');
  const [createVisible, setCreateVisible] = useState(false);
  const [createDirection, setCreateDirection] = useState('left');
  const [joinVisible, setJoinVisible] = useState(false);
  const [joinDirection, setJoinDirection] = useState('left');
  const [serverName, setServerName] = useState('');
  const [serverId, setServerId] = useState('');
  const [channelName, setChannelName] = useState('');


  // Handles showing the Join Server window
  const showJoinServer = () => {
    setMainDirection('right');
    setCreateDirection('left');
    setJoinVisible(true);
    setMainVisible(false);
  }

  // Handles showing the Create Server window
  const showCreateServer = () => {
    setMainDirection('right');
    setJoinDirection('left');
    setCreateVisible(true);
    setMainVisible(false);
  }

  // Method to handle creation of servers
  const createServer = async (serverName, userId) => {
    try {
      const response = await axios.post(`${baseUrl}/server/create?serverName=${serverName}&userId=${userId}`);
      handleModalSuccess(response.data);
    }
    catch (err) {
      handleModalSuccess(err.response.data);
    }
  }

  // Method to handle joining of servers
  const joinServer = async (serverId, userId) => {
    try {
      const response = await axios.post(`${baseUrl}/server/join?serverId=${serverId}&userId=${userId}`);
      handleModalSuccess(response.data);
    }
    catch (err) {
      handleModalSuccess(err.response.data);
    }
  }

  // Method to handle creation of channels
  const createChannel = async (channelName, serverId) => {
    try {
      const response = await axios.post(`${baseUrl}/channel/create?channelName=${channelName}&serverId=${serverId}&userId=${userId}`);
      handleModalSuccess(response.data);
    }
    catch (err) {
      handleModalSuccess(err.response.data);
    }
  }

  // Method to handle renaming of servers
  const renameServer = async (serverName, serverId) => {
    try {
      const response = await axios.post(`${baseUrl}/server/rename?serverName=${serverName}&serverId=${serverId}&userId=${userId}`);
      handleModalSuccess(response.data);
    }
    catch (err) {
      handleModalSuccess(err.response.data);
    }
  }

  // Handles keypress and calls the callback method
  const handleKeyPress = (e, callbackMethod) => {
    if (e.key === "Enter") {
      callbackMethod();
    }
  }

  // Renders the Main Modal Window with options to Create / Join server
  const renderMainServer = () => {
    return (
      <Slide direction={mainDirection} in={mainVisible} timeout={500} mountOnEnter unmountOnExit>
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
                  <Button variant="contained" color="primary" className="modal-button">Join a server</Button>
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
                  <Button variant="contained" color="secondary" className="modal-button">Join a server</Button>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        </div>
      </Slide >
    )
  }

  // Renders the Server Create Modal Window
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
              onKeyPress={(e) => handleKeyPress(e, () => createServer(serverName, userId))}
              margin="dense"
              variant="outlined"
            />
            <Button className="modal-button" variant="contained" color="primary" onClick={() => createServer(serverName, userId)}>Create Server</Button>
          </div>
        </div>
      </Slide >
    )
  }

  // Renders the Server Join Modal Window
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
              label="Server Id"
              value={serverId}
              onChange={(e) => setServerId(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, () => joinServer(serverId, userId))}
              margin="dense"
              variant="outlined"
            />
            <Button className="modal-button" variant="contained" color="primary" onClick={() => joinServer(serverId, userId)}>Join Server</Button>
          </div>
        </div>
      </Slide >
    )
  }

  // Renders the Channel Create Modal Window
  const renderChannelCreate = () => {
    return (
      <Slide direction='left' in={true} mountOnEnter unmountOnExit timeout={500}>
        <div className="modal-create">
          <div className="modal-title modal-flex">
            <Typography variant="h5" color="primary" align="center">Create a Channel!</Typography>
          </div>
          <div className="modal-create-content">
            <Typography variant="body1" paragraph> Enter a Channel Name for your new channel and start chatting right now!  </Typography>
            <TextField
              id="create-channel-field"
              label="Channel Name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, () => createChannel(channelName, activeServer.split('-')[1]))}
              margin="dense"
              variant="outlined"
            />
            <Button className="modal-button" variant="contained" color="primary" onClick={() => createChannel(channelName, activeServer.split('-')[1])}>Create Channel</Button>
          </div>
        </div>
      </Slide >
    )
  }


  // Renders a modal with an input
  const renderServerRename = () => {
    return (
      <Slide direction='left' in={true} mountOnEnter unmountOnExit timeout={500}>
        <div className="modal-create">
          <div className="modal-title modal-flex">
            <Typography variant="h5" color="primary" align="center">Rename Server</Typography>
          </div>
          <div className="modal-create-content">
            <Typography variant="body1" paragraph> Enter a new Server Name for Server - {activeServer.split('-')[0]} </Typography>
            <TextField
              id="create-channel-field"
              label="Channel Name"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, () => renameServer(serverName, activeServer.split('-')[1]))}
              margin="dense"
              variant="outlined"
            />
            <Button className="modal-button" variant="contained" color="primary" onClick={() => renameServer(serverName, activeServer.split('-')[1])}>Rename Server</Button>
          </div>
        </div>
      </Slide >
    )
  }





  if (modalType === 'server-create-join')
    return (
      <Paper className="modal-container">
        {renderMainServer()}
        {renderServerCreate()}
        {renderServerJoin()}
      </Paper >
    )
  else if (modalType === 'channel-create') {
    return (
      <Paper className="modal-container">
        {renderChannelCreate()}
      </Paper >
    )
  }
  else if (modalType === 'server-rename') {
    return (
      <Paper className="modal-container">
        {renderServerRename()}
      </Paper>
    )
  }
}
