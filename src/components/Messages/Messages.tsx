import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Fade,
  Popover,
  CircularProgress
} from '@material-ui/core';
import moment from 'moment';
import DomPurify from 'dompurify';
//import Code from 'react-code-prettify';
import UserInfo from '../UserInfo/UserInfo';
import { StoreState } from '../../reducers';

interface MessageList {
  from: string;
  to?: string;
  msg: string;
  date: Date;
}

declare var PR: any;

export default function Messages() {
  // Get States from Redux Store
  const chatStore = useSelector((state: StoreState) => state.chat);
  const { activeServer, activeChannel, activeView, activePMUser } = chatStore;

  // Local states
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(12);
  const [loadMessages, setLoadMessages] = useState(false);
  const [userName, setUserName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  // ref to message container (for keeping scroll to bottom of chat)
  let messageContainerBottomRef = document.getElementById('messagesContainerBottom');
  let messageContainerRef = document.getElementById('messagesContainer');

  // Get message list from channel or from specific user
  let messages: MessageList[] = [];
  let messagesLength = 0;
  if (activeView === 'servers') {
    messages = chatStore.servers[activeServer]['channels'][activeChannel];
    messagesLength = messages.length;
  } else {
    messages = chatStore.privateMessages[activePMUser];
    // If no messages need to make empty array
    if (messages === undefined) {
      messages = [];
    }
    messagesLength = messages.length;
  }

  // Scroll to bottom of container if were not loading new messages
  useEffect(() => {
    if (messageContainerBottomRef && messageContainerRef) {
      if (loadMessages) {
        messageContainerRef.scroll(0, 60);
      } else {
        messageContainerBottomRef.scrollIntoView({ block: 'end', behavior: 'smooth' });
      }
    }
  }, [loadMessages, messages, messageContainerRef, messageContainerBottomRef]);

  // Checks is message is a code block
  const isTextCodeBlock = (message: string) => {
    if (message.startsWith('```') && message.endsWith('```')) return true;
    else return false;
  };

  // Handles to load more messages when scroll at top
  const handleScrollTop = (e: any) => {
    const element = e.target;
    if (element.scrollTop > 60) {
      setLoadMessages(false);
    }
    if (element.scrollTop === 0) {
      if (messagesLength > messageIndex) {
        setTimeout(() => {
          setLoadMessages(true);
          if (messageIndex + 12 > messagesLength) {
            setMessageIndex(messagesLength);
          } else {
            setMessageIndex(messageIndex + 12);
          }
        }, 400);
      }
    }
  };

  // Formats the code block
  const formatCode = (message: string) => {
    return message.split('```')[1];
  };

  // Handles clicks for setting anchor to User Info (To private message)
  const handleUserClick = (e: any, userName: string) => {
    setUserName(userName);
    setUserInfoVisible(true);
    setAnchorEl(e.currentTarget);
  };

  // Closes popup of User Info
  const handlePopoverClose = () => {
    setUserInfoVisible(false);
    setAnchorEl(null);
  };

  // Load pretty print on every render change
  useEffect(() => {
    PR.prettyPrint();
  });

  return (
    <React.Fragment>
      {messages.length === 0 && (
        <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              textAlign: 'center',
              padding: '1em',
              fontFamily: 'roboto'
            }}
          >
            <CircularProgress />{' '}
            <div style={{ marginTop: '1em', flexBasis: '100%', color: 'white' }}>
              {' '}
              The server just woke up! Hold on for 5 seconds, while he munches a quick byte!{' '}
            </div>
          </div>
        </div>
      )}
      <div
        id="messagesContainer"
        className="messages-container"
        onScroll={e => handleScrollTop(e)}
        ref={element => (messageContainerRef = element)}
      >
        {messagesLength >= messageIndex ? (
          <div className="progress-container">
            <CircularProgress color="primary" />
          </div>
        ) : null}
        <List>
          {messages !== null
            ? messages.slice(messagesLength - messageIndex, messagesLength).map((message, i) => {
                // Filter for null messages (dummy message on backend should fix...)
                return (
                  <Fade in={true} timeout={500}>
                    <ListItem className="message" key={i}>
                      <ListItemAvatar className="message-user-icon">
                        <Avatar>
                          <img
                            onClick={e => handleUserClick(e, message.from)}
                            src={process.env.PUBLIC_URL + '/user.png'}
                            alt="user icon"
                            height="48"
                          />
                        </Avatar>
                      </ListItemAvatar>
                      {isTextCodeBlock(message.msg) ? (
                        <ListItemText
                          primary={
                            <div className="message-user" onClick={e => handleUserClick(e, message.from)}>
                              {message.from.toLowerCase()}
                              <div className="message-date">{` - ${moment(message.date).format('LLL')}`}</div>
                            </div>
                          }
                          secondary={
                            <pre className="prettyprint">
                              <div dangerouslySetInnerHTML={{ __html: DomPurify.sanitize(formatCode((message.msg)) }}></div>
                            </pre>
                          }
                          className="message-text"
                        />
                      ) : (
                        <ListItemText
                          primary={
                            <div className="message-user" onClick={e => handleUserClick(e, message.from)}>
                              {message.from.toLowerCase()}
                              <div className="message-date">{` - ${moment(message.date).format('LLL')}`}</div>
                            </div>
                          }
                          secondary={message.msg}
                          className="message-text"
                        />
                      )}
                    </ListItem>
                  </Fade>
                );
              })
            : null}
        </List>
        <div ref={element => (messageContainerBottomRef = element)} id="messagesContainerBottom"></div>
        <Popover
          id="user-info"
          open={userInfoVisible}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <UserInfo userName={userName} setUserInfoVisible={setUserInfoVisible} />
        </Popover>
      </div>
    </React.Fragment>
  );
}
