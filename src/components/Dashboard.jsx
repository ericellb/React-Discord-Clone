import React, { useEffect } from 'react'

import Sidebar from './Sidebar';
import Messages from './Messages';
import SendMessage from './SendMessage.jsx';

import { getInitialData } from '../actions';
import { useDispatch } from 'react-redux';

export default function Dashboard() {

  // Dispatch
  const dispatch = useDispatch();

  // When app loads, grab users initial data
  // Includes all channels, history and settings
  useEffect(() => {
    dispatch(getInitialData());
  }, [dispatch])


  return (
    <div className="grid-container">
      <div className="sidebar-grid">
        <Sidebar />
      </div>

      <div className="messages-grid">
        <Messages />
      </div>

      <div className="send-messages-grid">
        <SendMessage />
      </div>
    </div >
  )
}
