import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';

import Sidebar from './Sidebar';
import Messages from './Messages';
import SendMessage from './SendMessage.jsx';
import Header from './Header';

export default function Dashboard() {

  const chatStore = useSelector(state => state.chat);

  // Local state
  const [chatMessage, changeChatMessage] = useState('');

  // Get servers and topics out of store
  const servers = Object.keys(chatStore.servers);
  const topics = Object.keys(chatStore.servers[chatStore.activeServer]);

  return (
    <div>

      <Header topics={topics} servers={servers} />

      <div className="grid-container">

        <div className="sidebar-grid">
          <Sidebar topics={topics} servers={servers} />
        </div>

        <div className="messages-grid">
          <Messages topics={topics} />
        </div>

        <div className="send-messages-grid">
          <SendMessage chatMessage={chatMessage} changeChatMessage={changeChatMessage} />
        </div>

      </div >

    </div>
  )
}
