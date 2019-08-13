import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { GroupWork, AddCircleOutline } from '@material-ui/icons';
import { List, Tooltip, IconButton, } from '@material-ui/core';
import { changeServer } from '../../actions';

export default function Servers() {

  // Get chats from store
  const chatStore = useSelector(state => state.chat);
  const servers = Object.keys(chatStore.servers);
  const dispatch = useDispatch();

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
          <IconButton className="server-icon" >
            <AddCircleOutline />
          </IconButton>
        </Tooltip>
      </List>
    </div>
  )
}
