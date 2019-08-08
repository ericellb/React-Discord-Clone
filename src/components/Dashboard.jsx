import React from 'react'
import { useSelector } from 'react-redux';

import Sidebar from './Sidebar';
import Messages from './Messages';
import SendMessage from './SendMessage.jsx';

export default function Dashboard() {

  // Get store state
  const chatStore = useSelector(state => state.chat);

  // Get servers and topics out of store
  const servers = Object.keys(chatStore.servers);
  const topics = Object.keys(chatStore.servers[chatStore.activeServer]);


  return (
    <div>

      <div className="grid-container">

        <div className="sidebar-grid">
          <Sidebar topics={topics} servers={servers} />
        </div>

        <div className="messages-grid">
          <Messages topics={topics} servers={servers} />
        </div>

        <div className="send-messages-grid">
          <SendMessage />
        </div>

      </div >

    </div>
  )
}
