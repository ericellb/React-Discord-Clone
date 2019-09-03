import React, { useEffect } from 'react';
import { loadUserData, updateActiveState, updateActiveUserList } from '../../actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import createHashHistory from '../../history';
import Sidebar from '../Sidebar/Sidebar';
import SendMessage from '../SendMessage/SendMessage';
import Header from '../Header/Header';
import Messages from '../Messages/Messages';
import ActiveUserList from '../ActiveUserList/ActiveUserList';
import { StoreState } from '../../reducers';

export default function Dashboard() {
  // Get State from Redux Store
  const user = useSelector((state: StoreState) => state.user);
  const { activeServer } = useSelector((state: StoreState) => state.chat);
  const dispatch = useDispatch();

  // Ping server every 5 minutes to update our active status
  // Also fetches new list of active users in activeServer
  const updateActiveStatus = () => {
    dispatch(updateActiveState());
    dispatch(updateActiveUserList(activeServer.split('-')[1]));
    setTimeout(updateActiveStatus, 5 * 60000);
  };

  // Listens for changes on isSignedIn
  // Gets initial user data upon change
  useEffect(() => {
    if (!user.isSignedIn) {
      createHashHistory.push('/');
    } else {
      dispatch(loadUserData(user.userId));
      updateActiveStatus();
    } // eslint-disable-next-line
  }, [dispatch, user.isSignedIn, user.userId]);

  // Watches viewport height (fix for mobile address bar size)
  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

  return (
    <div className="dashboard">
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
      </div>
    </div>
  );
}
