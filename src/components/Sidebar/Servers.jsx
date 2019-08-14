import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { GroupWork, AddCircleOutline } from '@material-ui/icons';
import { List, Tooltip, IconButton, Modal, } from '@material-ui/core';
import { changeServer } from '../../actions';

import CreateJoinModal from '../Modal/CreateJoinModal';
import SnackBarContent from '../SnackBar/SnackBarContent';

export default function Servers() {

  // Get chats from store
  const chatStore = useSelector(state => state.chat);
  const servers = Object.keys(chatStore.servers);
  const dispatch = useDispatch();

  // Local state
  const [modalVisible, setModalVisible] = useState(false);
  const [snackContent, setSnackContent] = useState('');
  const [snackVisible, setSnackVisible] = useState(false);


  // Handles closure and shows snackbar with response
  const handleModalClose = (response) => {
    console.log(response);
    if (response !== null) {
      setModalVisible(false);
      setSnackVisible(true);
      setSnackContent(response);
    }
  }

  return (
    <div className="servers-container">
      <List>
        {servers.map(server => (
          <Tooltip title={server.split('-')[0]} key={server} placement="right" className="tooltip">
            <IconButton className="server-icon" onClick={() => dispatch(changeServer(server, server.server_id))}>
              <GroupWork />
            </IconButton>
          </Tooltip>
        ))}
        <Tooltip title='Create Server' key='create-server' placement="right" className="tooltip">
          <IconButton className="server-icon" onClick={() => setModalVisible(true)}>
            <AddCircleOutline />
          </IconButton>
        </Tooltip>
      </List>
      <Modal
        open={modalVisible}
        aria-labelledby="server create modal"
        aria-describedby="create a server"
        className="modal-wrapper">
        <CreateJoinModal handleModalClose={handleModalClose} />
      </Modal>
      <SnackBarContent visible={snackVisible} setVisible={setSnackVisible} content={snackContent} />
    </div>
  )
}
