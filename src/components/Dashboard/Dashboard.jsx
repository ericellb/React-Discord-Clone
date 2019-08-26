import React, { useEffect } from 'react';
import { loadUserData, updateActiveState, updateActiveUserList } from '../../actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Div100vh from 'react-div-100vh';

import createHashHistory from '../../history';
import Sidebar from '../Sidebar/Sidebar';
import SendMessage from '../SendMessage/SendMessage';
import Header from '../Header/Header';
import Messages from '../Messages/Messages';
import ActiveUserList from '../ActiveUserList/ActiveUserList';

export default function Dashboard() {

  // Get State from Redux Store
  const user = useSelector(state => state.user);
  const { activeServer } = useSelector(state => state.chat);
  const dispatch = useDispatch();

  // Listens for changes on isSignedIn
  // Gets initial user data upon change
  useEffect(() => {
    if (!user.isSignedIn) {
      createHashHistory.push('/');
    }
    else {
      dispatch(loadUserData(user.userId));
      updateActiveStatus();
    }

  }, [dispatch, user.isSignedIn, user.userId])

  // Ping server every 5 minutes to update our active status
  // Also fetches new list of active users in activeServer
  const updateActiveStatus = () => {
    dispatch(updateActiveState);
    dispatch(updateActiveUserList(activeServer));
    setTimeout(updateActiveStatus, 5 * 60000);
  }


  return (
    <Div100vh>
      <div className="grid-container">

        <div className="sidebar-grid">
          <Sidebar />
        </div>

        <div className="messages-grid">
          <Header />
          <Messages />
        </div>

        <div className="user-list-grid">
          <ActiveUserList />
        </div>

        <div className="send-messages-grid">
          <SendMessage />
        </div>

      </div >
    </Div100vh>
  )
}
