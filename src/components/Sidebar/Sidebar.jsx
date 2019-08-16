import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '@material-ui/core';

import Servers from './Servers';
import Channels from './Channels'
import CreateJoinModal from '../Modal/CreateJoinModal';
import SnackBarContent from '../SnackBar/SnackBarContent';
import { loadUserData } from '../../actions';

export default function Sidebar(props) {

  // Get from Redux Store
  const user = useSelector(state => state.user);

  // Dispatch
  const dispatch = useDispatch();

  // Get props from parent
  const { setDrawerVisible } = props;

  // Local state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [snackContent, setSnackContent] = useState('');
  const [snackVisible, setSnackVisible] = useState(false);

  // Handles Success of Modal Server Create / Join
  // Closes Modal and show Snackbar with Create / Join Messsage
  const handleModalSuccess = (response, pass) => {
    if (response !== null) {
      setModalVisible(false);
      setSnackVisible(true);
      setSnackContent(response);
      if (pass)
        dispatch(loadUserData(user.userId));
    }
  }

  return (
    <div className="sidebar-container">
      <Servers setModalVisible={setModalVisible} setModalType={setModalType} />
      <Channels setDrawerVisible={setDrawerVisible} setModalVisible={setModalVisible} setModalType={setModalType} />
      <Modal
        open={modalVisible}
        aria-labelledby="server create modal"
        aria-describedby="create a server"
        className="modal-wrapper"
        onClose={() => setModalVisible(false)}>
        <CreateJoinModal handleModalSuccess={handleModalSuccess} modalType={modalType} />
      </Modal>
      <SnackBarContent visible={snackVisible} setVisible={setSnackVisible} content={snackContent} />
    </div >
  )
}
