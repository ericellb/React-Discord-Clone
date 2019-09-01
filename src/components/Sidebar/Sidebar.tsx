import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '@material-ui/core';

import SnackBarContent from '../SnackBar/SnackBarContent';
import PrivateMessageUserList from './PrivateMessageUserList';
import ChannelList from './ChannelList';
import ServerList from './ServerList';
import ActionsModal from '../ActionsModal/ActionsModal';
import { loadUserData } from '../../actions';
import { StoreState } from '../../reducers';

interface SidebarProps {
  setDrawerVisible?: (drawerVisible: boolean) => void;
}

export default function Sidebar(props: SidebarProps) {
  // Get from Redux Store
  const user = useSelector((state: StoreState) => state.user);
  const { activeView } = useSelector((state: StoreState) => state.chat);

  // Dispatch
  const dispatch = useDispatch();

  // Get props from parent (Used when Sidebar is rendered by header on mobile)
  const { setDrawerVisible } = props;

  // Local state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [snackContent, setSnackContent] = useState('');
  const [snackVisible, setSnackVisible] = useState(false);

  // Handles Success of Modal Server Create / Join
  // Closes Modal and show Snackbar with Create / Join Messsage
  const handleSnackMessage = (response: string, pass: boolean) => {
    if (response !== null) {
      setModalVisible(false);
      setSnackVisible(true);
      setSnackContent(response);
      if (pass) dispatch(loadUserData(user.userId));
    }
  };

  return (
    <div className="sidebar-container">
      <ServerList setModalVisible={setModalVisible} setModalType={setModalType} />
      {activeView === 'servers' ? (
        <ChannelList
          setDrawerVisible={setDrawerVisible}
          setModalVisible={setModalVisible}
          setModalType={setModalType}
          handleSnackMessage={handleSnackMessage}
        />
      ) : (
        <PrivateMessageUserList />
      )}
      <Modal
        open={modalVisible}
        aria-labelledby="server create modal"
        aria-describedby="create a server"
        className="modal-wrapper"
        onClose={() => setModalVisible(false)}
      >
        <ActionsModal handleSnackMessage={handleSnackMessage} modalType={modalType} />
      </Modal>
      <SnackBarContent visible={snackVisible} setVisible={setSnackVisible} content={snackContent} />
    </div>
  );
}
