import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { GroupWork, AddCircleOutline } from '@material-ui/icons';
import { List, Tooltip, IconButton, Modal, } from '@material-ui/core';
import { changeServer } from '../../actions';

import CreateJoinModal from '../Modal/CreateJoinModal';
import SnackBarContent from '../SnackBar/SnackBarContent';

import { loadUserData } from '../../actions';

export default function Servers(props) {

  // Get State from Redux Store
  const chatStore = useSelector(state => state.chat);
  const servers = Object.keys(chatStore.servers);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Local state
  const [modalVisible, setModalVisible] = useState(false);
  const [snackContent, setSnackContent] = useState('');
  const [snackVisible, setSnackVisible] = useState(false);

  // Get props from parent
  const { setDrawerVisible } = props;

  // Handles Success of Modal Server Create / Join
  // Closes Modal and show Snackbar with Create / Join Messsage
  const handleModalSuccess = (response) => {
    console.log(response);
    if (response !== null) {
      setModalVisible(false);
      setSnackVisible(true);
      setSnackContent(response);
      dispatch(loadUserData(user.userId));
    }
  }

  // Handles server change, and closes drawer if on mobile view
  const handleServerChange = (server) => {
    dispatch(changeServer(server));
    if (typeof setDrawerVisible !== "undefined")
      setDrawerVisible(false)
  }

  return (
    <div className="servers-container">
      <List>
        {servers.map(server => (
          <Tooltip title={server.split('-')[0]} key={server} placement="right" className="tooltip">
            <IconButton className="server-icon" onClick={() => handleServerChange(server)}>
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
        className="modal-wrapper"
        onClose={() => setModalVisible(false)}>
        <CreateJoinModal handleModalSuccess={handleModalSuccess} />
      </Modal>
      <SnackBarContent visible={snackVisible} setVisible={setSnackVisible} content={snackContent} />
    </div>
  )
}
