import React, { useEffect } from 'react'

import { getInitialData } from '../actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import Sidebar from './Sidebar';
import Messages from './Messages';
import SendMessage from './SendMessage.jsx';

export default function Dashboard() {

  // Get user store
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Listens for changes on isSignedIn
  // Gets initial user data upon change
  useEffect(() => {
    if (user.isSignedIn)
      dispatch(getInitialData());
  }, [dispatch, user.isSignedIn])


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
