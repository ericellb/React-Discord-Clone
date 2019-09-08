import React, { useState, KeyboardEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Paper,
  Button,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CardMedia,
  Slide,
  TextField,
  Grid
} from '@material-ui/core';
import { GroupAdd, AddToQueue } from '@material-ui/icons';
import axios from '../Api/api';

import { addChannel, addServer } from '../../actions';
import { StoreState } from '../../reducers';

interface ActionsModalProps {
  handleSnackMessage: (response: string, pass: boolean) => void;
  modalType: string;
}

export default function ActionsModal(props: ActionsModalProps) {
  // Get State from Redux Store
  const { userId } = useSelector((state: StoreState) => state.user);
  const { activeServer, activeChannel } = useSelector((state: StoreState) => state.chat);

  const dispatch = useDispatch();

  // Get data from props
  const { handleSnackMessage, modalType } = props;

  // Local state to control Modal Windows + Data fields
  const [mainVisible, setMainVisible] = useState(true);
  const [mainDirection, setMainDirection]: any = useState('left');
  const [createVisible, setCreateVisible] = useState(false);
  const [createDirection, setCreateDirection]: any = useState('left');
  const [joinVisible, setJoinVisible] = useState(false);
  const [joinDirection, setJoinDirection]: any = useState('left');
  const [serverName, setServerName] = useState('');
  const [serverId, setServerId] = useState('');
  const [channelName, setChannelName] = useState('');

  // Handles showing the Join Server window
  const showhandleJoinServer = () => {
    setMainDirection('right');
    setCreateDirection('left');
    setJoinVisible(true);
    setMainVisible(false);
  };

  // Handles showing the Create Server window
  const showhandleCreateServer = () => {
    setMainDirection('right');
    setJoinDirection('left');
    setCreateVisible(true);
    setMainVisible(false);
  };

  // Method to handle creation of servers
  const handleCreateServer = async (serverName: string, userId: string) => {
    try {
      const response = await axios.post(`/server/create?serverName=${serverName}&userId=${userId}`);
      dispatch(addServer(response.data));
      const message = `Server ${response.data.server.split('-')[0]} with ID ${
        response.data.server.split('-')[1]
      } created`;
      handleSnackMessage(message, false);
    } catch (err) {
      handleSnackMessage(err.response.data, false);
    }
  };

  // Method to handle joining of servers
  const handleJoinServer = async (serverId: string, userId: string) => {
    try {
      const response = await axios.post(`/server/join?serverId=${serverId}&userId=${userId}`);
      handleSnackMessage(response.data, true);
    } catch (err) {
      handleSnackMessage(err.response.data, false);
    }
  };

  // Method to handle renaming of servers
  const handleRenameServer = async (serverName: string, serverId: string) => {
    try {
      const response = await axios.post(
        `/server/rename?serverName=${serverName}&serverId=${serverId}&userId=${userId}`
      );
      handleSnackMessage(response.data, true);
    } catch (err) {
      handleSnackMessage(err.response.data, false);
    }
  };

  // Method to handle deleting servers
  const handleDeleteServer = async (serverId: string, userId: string) => {
    try {
      const response = await axios.delete(`/server/delete?serverId=${serverId}&userId=${userId}`);
      handleSnackMessage(response.data, true);
    } catch (err) {
      handleSnackMessage(err.response.data, false);
    }
  };

  // Method to handle creation of channels
  const handleCreateChannel = async (channelName: string, server: string) => {
    try {
      const response = await axios.post(`/channel/create?channelName=${channelName}&server=${server}&userId=${userId}`);
      dispatch(addChannel(response.data));
      const message = `Server ${response.data.channel.split('-')[0]} with ID ${response.data.channel.split(
        '-'[1]
      )} created`;
      handleSnackMessage(message, false);
    } catch (err) {
      handleSnackMessage(err.response.data, false);
    }
  };

  // Method to handle renaming of channels
  const handleRenameChannel = async (channelName: string, channelId: string) => {
    try {
      const response = await axios.post(
        `/channel/rename?channelName=${channelName}&channelId=${channelId}&serverId=${
          activeServer.split('-')[1]
        }&userId=${userId}`
      );
      handleSnackMessage(response.data, true);
    } catch (err) {
      handleSnackMessage(err.response.data, false);
    }
  };

  // Method to handle deleting of channels
  const handleDeleteChannel = async (channelName: string, channelId: string) => {
    try {
      const response = await axios.delete(
        `/channel/delete?channelId=${channelId}&serverId=${activeServer.split('-')[1]}&userId=${userId}`
      );
      handleSnackMessage(response.data, true);
    } catch (err) {
      handleSnackMessage(err.response.data, false);
    }
  };

  // Handles keypress and calls the callback method
  const handleKeyPress = (e: KeyboardEvent, callbackMethod: Function) => {
    if (e.key === 'Enter') {
      callbackMethod();
    }
  };

  // Renders the Main Modal Window with options to Create / Join server
  const renderMainServer = () => {
    return (
      <Slide direction={mainDirection} in={mainVisible} timeout={500} mountOnEnter unmountOnExit>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" color="primary" align="center">
              Another server? Wow you're popular!
            </Typography>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Card className="grid-card">
              <CardActionArea onClick={() => showhandleCreateServer()}>
                <CardContent>
                  <Typography variant="h5" color="primary" gutterBottom>
                    Create
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Create a server and invite all your buddies.
                  </Typography>
                  <CardMedia>
                    <AddToQueue className="modal-card-icon" />
                  </CardMedia>
                  <Button variant="contained" color="primary" className="modal-button">
                    Create a server
                  </Button>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Card className="grid-card">
              <CardActionArea onClick={() => showhandleJoinServer()}>
                <CardContent>
                  <Typography variant="h5" color="secondary" gutterBottom>
                    Join
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Join a friends server and pwn some noobs!
                  </Typography>
                  <CardMedia>
                    <GroupAdd className="modal-card-icon" />
                  </CardMedia>
                  <Button variant="contained" color="secondary" className="modal-button">
                    Join a server
                  </Button>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Slide>
    );
  };

  // Renders the Server Create Modal Window
  const renderServerCreate = () => {
    return (
      <Slide direction={createDirection} in={createVisible} mountOnEnter unmountOnExit timeout={500}>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" color="primary" align="center">
              Create a Server!
            </Typography>
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <Typography variant="body1" paragraph>
              {' '}
              Enter a Server Name to create a server and get access to unlimited chat channels!{' '}
            </Typography>
            <TextField
              id="create-server-field"
              label="Server Name"
              value={serverName}
              onChange={e => setServerName(e.target.value)}
              onKeyPress={e => handleKeyPress(e, () => handleCreateServer(serverName, userId))}
              margin="dense"
              variant="outlined"
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12} className="grid-button">
            <Button
              className="modal-button"
              variant="contained"
              color="primary"
              onClick={() => handleCreateServer(serverName, userId)}
            >
              Create Server
            </Button>
          </Grid>
        </Grid>
      </Slide>
    );
  };

  // Renders a modal with an input
  const renderServerRename = () => {
    return (
      <Slide direction="left" in={true} mountOnEnter unmountOnExit timeout={500}>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" color="primary" align="center">
              Rename Server
            </Typography>
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <Typography variant="body1" paragraph>
              {' '}
              Enter a new Server Name for Server - {activeServer.split('-')[0]}{' '}
            </Typography>
            <TextField
              id="create-channel-field"
              label="Channel Name"
              value={serverName}
              onChange={e => setServerName(e.target.value)}
              onKeyPress={e => handleKeyPress(e, () => handleRenameServer(serverName, activeServer.split('-')[1]))}
              margin="dense"
              variant="outlined"
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12} className="grid-button">
            <Button
              className="modal-button"
              variant="contained"
              color="primary"
              onClick={() => handleRenameServer(serverName, activeServer.split('-')[1])}
            >
              Rename Server
            </Button>
          </Grid>
        </Grid>
      </Slide>
    );
  };

  // Renders a modal to delete a server
  const renderServerDelete = () => {
    return (
      <Slide direction="left" in={true} mountOnEnter unmountOnExit timeout={500}>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" color="primary" align="center">
              Delete Server
            </Typography>
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <Typography variant="body1" paragraph>
              {' '}
              Are you sure you want to delete - {activeServer.split('-')[0]}{' '}
            </Typography>
          </Grid>
          <Grid item xs={12} className="grid-button">
            <Button
              className="modal-button"
              variant="contained"
              color="primary"
              style={{ backgroundColor: 'green', marginRight: '8px' }}
              onClick={() => handleDeleteServer(activeServer.split('-')[1], userId)}
            >
              Yes
            </Button>
            <Button
              className="modal-button"
              variant="contained"
              color="primary"
              style={{ backgroundColor: 'red', marginLeft: '8px' }}
              onClick={() => handleSnackMessage('Not deleting channel', false)}
            >
              No
            </Button>
          </Grid>
        </Grid>
      </Slide>
    );
  };

  // Renders the Server Join Modal Window
  const renderServerJoin = () => {
    return (
      <Slide direction={joinDirection} in={joinVisible} mountOnEnter unmountOnExit timeout={500}>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" color="primary" align="center">
              Join a Server!
            </Typography>
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <Typography variant="body1" paragraph>
              {' '}
              Enter a the Server Id provided by your friend and start chatting right now!{' '}
            </Typography>
            <TextField
              id="join-server-field"
              label="Server Id"
              value={serverId}
              onChange={e => setServerId(e.target.value)}
              onKeyPress={e => handleKeyPress(e, () => handleJoinServer(serverId, userId))}
              margin="dense"
              variant="outlined"
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12} className="grid-button">
            <Button
              className="modal-button"
              variant="contained"
              color="primary"
              onClick={() => handleJoinServer(serverId, userId)}
            >
              Join Server
            </Button>
          </Grid>
        </Grid>
      </Slide>
    );
  };

  // Renders the Channel Create Modal Window
  const renderChannelCreate = () => {
    return (
      <Slide direction="left" in={true} mountOnEnter unmountOnExit timeout={500}>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" color="primary" align="center">
              Create a Channel!
            </Typography>
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <Typography variant="body1" paragraph>
              {' '}
              Enter a Channel Name for your new channel and start chatting right now!{' '}
            </Typography>
            <TextField
              id="create-channel-field"
              label="Channel Name"
              value={channelName}
              onChange={e => setChannelName(e.target.value)}
              onKeyPress={e => handleKeyPress(e, () => handleCreateChannel(channelName, activeServer))}
              margin="dense"
              variant="outlined"
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12} className="grid-button">
            <Button
              className="modal-button"
              variant="contained"
              color="primary"
              onClick={() => handleCreateChannel(channelName, activeServer)}
            >
              Create Channel
            </Button>
          </Grid>
        </Grid>
      </Slide>
    );
  };

  // Renders a modal to rename a channel
  const renderChannelRename = () => {
    return (
      <Slide direction="left" in={true} mountOnEnter unmountOnExit timeout={500}>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" color="primary" align="center">
              Rename Chanel
            </Typography>
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <Typography variant="body1" paragraph>
              {' '}
              Enter a new Channel Name for Channel - {activeChannel.split('-')[0]}{' '}
            </Typography>
            <TextField
              id="create-channel-field"
              label="Channel Name"
              value={channelName}
              onChange={e => setChannelName(e.target.value)}
              onKeyPress={e => handleKeyPress(e, () => handleRenameChannel(channelName, activeChannel.split('-')[1]))}
              margin="dense"
              variant="outlined"
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12} className="grid-button">
            <Button
              className="modal-button"
              variant="contained"
              color="primary"
              onClick={() => handleRenameChannel(channelName, activeChannel.split('-')[1])}
            >
              Rename Channel
            </Button>
          </Grid>
        </Grid>
      </Slide>
    );
  };

  // Renders a modal to delete a channel
  const renderChannelDelete = () => {
    return (
      <Slide direction="left" in={true} mountOnEnter unmountOnExit timeout={500}>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" color="primary" align="center">
              Delete Channel
            </Typography>
          </Grid>
          <Grid item xs={12} className="grid-textfield">
            <Typography variant="body1" paragraph>
              {' '}
              Are you sure you want to delete - {activeChannel.split('-')[0]}{' '}
            </Typography>
          </Grid>
          <Grid item xs={12} className="grid-button">
            <Button
              className="modal-button"
              variant="contained"
              color="primary"
              style={{ backgroundColor: 'green', marginRight: '8px' }}
              onClick={() => handleDeleteChannel(channelName, activeChannel.split('-')[1])}
            >
              Yes
            </Button>
            <Button
              className="modal-button"
              variant="contained"
              color="primary"
              style={{ backgroundColor: 'red', marginLeft: '8px' }}
              onClick={() => handleSnackMessage('Not deleting channel', false)}
            >
              No
            </Button>
          </Grid>
        </Grid>
      </Slide>
    );
  };

  if (modalType === 'server-create-join')
    return (
      <Paper className="container-prompt">
        {renderMainServer()}
        {renderServerCreate()}
        {renderServerJoin()}
      </Paper>
    );
  else if (modalType === 'channel-create') {
    return <Paper className="container-prompt">{renderChannelCreate()}</Paper>;
  } else if (modalType === 'server-rename') {
    return <Paper className="container-prompt">{renderServerRename()}</Paper>;
  } else if (modalType === 'channel-rename') {
    return <Paper className="container-prompt">{renderChannelRename()}</Paper>;
  } else if (modalType === 'channel-delete') {
    return <Paper className="container-prompt">{renderChannelDelete()}</Paper>;
  } else if (modalType === 'server-delete') {
    return <Paper className="container-prompt">{renderServerDelete()}</Paper>;
  } else return null;
}
