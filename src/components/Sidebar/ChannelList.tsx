import React, { useState, useEffect } from 'react';
import { Person, MoreVert, Settings } from '@material-ui/icons';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Tooltip,
  IconButton,
  Typography,
  ListItemText,
  Menu,
  MenuItem,
  Slide,
  Button
} from '@material-ui/core';
import {
  changeChannel,
  signOut,
  sendJoinVoice,
  sendRtcSignal,
  sendLeaveVoice,
  clearVoiceConnection
} from '../../actions';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../Api/api';
import { StoreState } from '../../reducers';
import { connect } from 'http2';

interface ChannelListProps {
  setDrawerVisible?: (drawerVisible: boolean) => void;
  setModalVisible: (modalVisible: boolean) => void;
  setModalType: (modalType: string) => void;
  handleSnackMessage: (response: string, pass: boolean) => void;
}

// Audio stream vars
let localStream: any;
let prevActiveChannel: string;
let connections: any;
let peerConnectionConfig = {
  iceServers: [{ urls: 'stun:stun.services.mozilla.com' }, { urls: 'stun:stun.l.google.com:19302' }]
};

export default function ChannelList(props: ChannelListProps) {
  // Get State from Redux Store
  const chatStore = useSelector((state: StoreState) => state.chat);
  const channels = Object.keys(chatStore.servers[chatStore.activeServer]['channels']);
  const { activeServer, activeChannel, voiceClients, voiceJoinUserId, rtcSignalData, voiceLeaveUserId } = chatStore;
  const dispatch = useDispatch();
  const user = useSelector((state: StoreState) => state.user);

  // Get props from parent
  const { setDrawerVisible, setModalVisible, setModalType, handleSnackMessage } = props;

  // Local state
  const [serverAnchorEl, setServerAnchorEl] = useState(null);
  const [channelAnchorEl, setChannelAnchorEl] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // When user or active server changes, check if we are admin
  useEffect(() => {
    // Gets the status if we are admin of current server (allows us to change server settings)
    async function getAdmin() {
      let serverId = activeServer.split('-')[1];
      const response = await axios.get(`/server/admin?serverId=${serverId}&userId=${user.userId}`);
      setIsAdmin(response.data);
    }

    getAdmin();
  }, [activeServer, user]);

  // Handle channel change, and closes drawer if on mobile view
  const handleChannelChange = (channel: string) => {
    dispatch(changeChannel(channel));
    if (typeof setDrawerVisible !== 'undefined') setDrawerVisible(false);
  };

  // Checks if only 1 channel, if so does not call callback to delete channel
  const handleChannelDelete = (callBack: Function) => {
    if (channels.length === 1) {
      handleSnackMessage('Please delete the server if only 1 channel', false);
    } else {
      callBack();
    }
  };

  // Handles to show modal, and its type
  const handleModalShow = (modalType: string) => {
    setModalType(modalType);
    setModalVisible(true);
  };

  // Handles showing of Settings Menu
  const handleSettingsClick = (e: any, type: string) => {
    if (type === 'server') setServerAnchorEl(e.currentTarget);
    else if (type === 'channel') setChannelAnchorEl(e.currentTarget);
  };

  // Handles closing settings menu
  const handleClose = () => {
    setServerAnchorEl(null);
    setChannelAnchorEl(null);
  };

  // Signs the user out
  const handleSignOut = () => {
    localStorage.clear();
    dispatch(signOut());
  };

  // Handles saving serverId to clipboard
  const handleSaveClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    handleSnackMessage(`Server ID ${text} saved to clipboard`, false);
  };

  // // Listens for changes on user signed in, asks browser for microphone access
  useEffect(() => {
    if (navigator.mediaDevices.getUserMedia && user.isSignedIn) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        localStream = stream;
      });
    }
  }, [user.isSignedIn]);

  // Listens for changes on active channel, and joins voice if channel is a voice channel
  useEffect(() => {
    if (activeChannel.split('-')[0] === 'voice') {
      let data = { userId: user.userId, userName: user.userName, channelId: activeChannel.split('-')[1] };
      attachVoiceChannel();
      dispatch(sendJoinVoice(data));
      prevActiveChannel = activeChannel;
    } else {
      let data;
      if (prevActiveChannel)
        data = { userId: user.userId, userName: user.userName, channelId: prevActiveChannel.split('-')[1] };
      else data = { userId: user.userId, userName: user.userName, channelId: activeChannel.split('-')[1] };
      dispatch(sendLeaveVoice(data));
      dispatch(clearVoiceConnection());
      disconnectPreviousVoice();
    }
    prevActiveChannel = activeChannel;
  }, [activeChannel]);

  // Listens for changes on new voice clients
  useEffect(() => {
    if (voiceJoinUserId && voiceClients && localStream) {
      onUserJoin(voiceJoinUserId, voiceClients);
    }
  }, [voiceJoinUserId, voiceClients]);

  // Listens for changes on our signaling data
  useEffect(() => {
    if (voiceJoinUserId !== '') {
      const userId = rtcSignalData.userId;
      const message = rtcSignalData;
      gotMessageFromServer(userId, message);
    }
  }, [rtcSignalData, voiceJoinUserId]);

  // Listens for changes on users leaving voice channel
  useEffect(() => {
    if (voiceLeaveUserId !== '') {
      onUserLeave(voiceLeaveUserId);
    }
  }, [voiceLeaveUserId]);

  // When user accepts, add their stream to page
  const attachVoiceChannel = () => {
    let audios = document.createElement('div');
    audios.id = 'audiosContainer';

    let div = document.createElement('div');
    let imageSrc = process.env.PUBLIC_URL + '/user.png';
    div.innerHTML = `
    <div class="user-voice-item">
      <div class="user-voice-avatar">
        <img src=${imageSrc} alt="user icon" height="38" />
      </div>
      <div class="user-voice-name">
        ${user.userName}
      </div>
    </div>
    `;

    let audio = document.createElement('audio');
    // Set data properties of new audio element
    audio.srcObject = localStream;
    audio.autoplay = true;
    audio.controls = false;
    audio.muted = true;

    // Put element into the page
    div.appendChild(audio);
    audios.appendChild(div);
    let audiosParent = document.getElementById(activeChannel.split('-')[0]);
    if (audiosParent) {
      if (audiosParent.parentNode) {
        audiosParent.parentNode.insertBefore(audios, audiosParent.nextSibling);
      }
    }
  };

  // On user join add to connections array and bind event handlers + create offers
  const onUserJoin = (newUserId: string, clients: { userName: string; userId: string }[]) => {
    // Iterate over client list
    clients.forEach(user => {
      // If new client isnt in our list
      if (!connections[user.userId]) {
        // Add this new users Peer connection to our connections array ( use stun servers )
        connections[user.userId] = new RTCPeerConnection(peerConnectionConfig);

        // Wait for peer to generate ice candidate
        connections[user.userId].onicecandidate = (event: any) => {
          if (event.candidate !== null) {
            dispatch(sendRtcSignal({ userId: user.userId, ice: event.candidate }));
          }
        };

        // Event handler for peer adding their stream
        connections[user.userId].onaddstream = (event: any) => {
          gotRemoteStream(event, user.userId, user.userName);
        };

        // Adds our local video stream to Peer
        connections[user.userId].addStream(localStream);
      }
    });

    // Create offer to new client joining if it is not ourselves
    // Dont create offer to ourselves on first join
    if (newUserId !== user.userId) {
      connections[newUserId].createOffer().then((description: RTCSessionDescription) => {
        connections[newUserId]
          .setLocalDescription(description)
          .then(() => {
            dispatch(sendRtcSignal({ userId: newUserId, sdp: connections[newUserId].localDescription }));
          })
          .catch((e: any) => console.log(e));
      });
    }
  };

  // On user leave close peer connection and remove their audio element
  const onUserLeave = (userId: string) => {
    // Close RTC peer connection
    connections[userId].close();
    connections[userId] = null;
    // Remove the audio element from page
    let audio = document.querySelector('[data-socket="' + userId + '"]') as HTMLElement;
    let parentDiv = audio.parentElement as HTMLElement;
    let parentContainer = parentDiv.parentElement as HTMLElement;
    parentContainer.removeChild(parentDiv);
  };

  // New message from server, configure RTC sdp session objects
  const gotMessageFromServer = (fromId: string, signal: any) => {
    //Make sure it's not coming from yourself
    if (fromId !== user.userId) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === 'offer') {
              connections[fromId]
                .createAnswer()
                .then((description: any) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      dispatch(sendRtcSignal({ userId: fromId, sdp: connections[fromId].localDescription }));
                    })
                    .catch((e: any) => console.log(e));
                })
                .catch((e: any) => console.log(e));
            }
          })
          .catch((e: any) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch((e: any) => console.log(e));
      }
    }
  };

  // If we get a new remote stream, add it to page
  const gotRemoteStream = (event: any, userSocketId: string, userSocketName: string) => {
    // Create our wrapper div
    let div = document.createElement('div');
    let imageSrc = process.env.PUBLIC_URL + '/user.png';
    div.innerHTML = `
    <div class="user-voice-item">
      <div class="user-voice-avatar">
        <img src=${imageSrc} alt="user icon" height="38" />
      </div>
      <div class="user-voice-name">
        ${user.userName}
      </div>
    </div>
    `;

    // Set data properties of new audio element
    let audio = document.createElement('audio');
    audio.setAttribute('data-socket', userSocketId);
    audio.srcObject = event.stream;
    audio.autoplay = true;

    // Get our audios container
    let audios = document.getElementById('audiosContainer') as HTMLElement;

    // Put element into the page
    div.appendChild(audio);
    audios.appendChild(div);
  };

  // Disconnects our voice session on change channel
  const disconnectPreviousVoice = () => {
    let audios = document.getElementById('audiosContainer');
    if (audios) {
      audios.outerHTML = '';
    }
    // Close all rtc peer connections and empty array
    if (connections) {
      connections.forEach((connection: string) => {
        connections[connection].close();
      });
    }
    connections = [];
  };

  return (
    <div className="channels-container">
      <List className="channel-list">
        <ListItem className="title-container">
          {activeServer.split('-')[0]}
          {isAdmin ? (
            <React.Fragment>
              <Tooltip title="Server Settings" key="server-settings" placement="right" className="tooltip">
                <IconButton onClick={e => handleSettingsClick(e, 'server')}>
                  {' '}
                  <MoreVert />{' '}
                </IconButton>
              </Tooltip>
            </React.Fragment>
          ) : null}
        </ListItem>
        {channels.map((channel, i) => (
          <Slide direction="right" in={true} timeout={200 * (i + 1)} key={channel + activeServer}>
            <ListItem
              onClick={e => handleChannelChange(channel)}
              button
              className="channel-item"
              id={`${channel.split('-')[0]}`}
            >
              <Typography variant="body1">
                <i className="channel-hashtag">#</i>
                {channel.split('-')[0].toLowerCase()}
              </Typography>
              {isAdmin ? (
                <Tooltip title="Server Settings" key="server-settings" placement="right" className="tooltip">
                  <IconButton onClick={e => handleSettingsClick(e, 'channel')}>
                    {' '}
                    <Settings className="channel-settings" />{' '}
                  </IconButton>
                </Tooltip>
              ) : null}
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

      <Menu
        id="server-settings-menu"
        anchorEl={serverAnchorEl}
        open={Boolean(serverAnchorEl)}
        onClick={handleClose}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleSaveClipboard(activeServer.split('-')[1])}>
          {' '}
          Server Id - {activeServer.split('-')[1]}{' '}
        </MenuItem>
        <MenuItem onClick={() => handleModalShow('server-rename')}> Change Server Name </MenuItem>
        <MenuItem onClick={() => handleModalShow('server-delete')}> Delete Server </MenuItem>
        <MenuItem onClick={() => handleModalShow('channel-create')}> Add Channel </MenuItem>
      </Menu>

      <Menu
        id="channel-settings-menu"
        anchorEl={channelAnchorEl}
        open={Boolean(channelAnchorEl)}
        onClick={handleClose}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleModalShow('channel-rename')}> Change Channel Name </MenuItem>
        <MenuItem onClick={() => handleChannelDelete(() => handleModalShow('channel-delete'))}>
          {' '}
          Delete Channel{' '}
        </MenuItem>
      </Menu>
    </div>
  );
}
