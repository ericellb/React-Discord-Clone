import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { GroupWork, AddCircleOutline } from '@material-ui/icons';
import { List, Tooltip, IconButton } from '@material-ui/core';
import { changeServer } from '../../actions';


export default function Servers(props) {

  // Get State from Redux Store
  const chatStore = useSelector(state => state.chat);
  const servers = Object.keys(chatStore.servers);
  const dispatch = useDispatch();

  // Get props from parent
  const { setModalVisible, setModalType } = props;

  // Handles server change, and closes drawer if on mobile view
  const handleServerChange = (server) => {
    dispatch(changeServer(server));
  }

  // Handles to show modal, and its type
  const handleModalShow = () => {
    setModalType('server-create-join');
    setModalVisible(true);
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
          <IconButton className="server-icon" onClick={() => handleModalShow()}>
            <AddCircleOutline />
          </IconButton>
        </Tooltip>
      </List>
    </div>
  )
}
