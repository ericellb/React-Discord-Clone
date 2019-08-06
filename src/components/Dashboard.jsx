import React from 'react'

import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

import { CTX } from './Store';
import Topics from './Topics';
import Messages from './Messages';
import SendMessage from './SendMessage.jsx';
import Header from './Header';

export default function Dashboard() {

  // Context store
  const { chats, sendChatAction } = React.useContext(CTX);

  // Get topics out
  const topics = Object.keys(chats);

  // Local state
  const [chatMessage, changeChatMessage] = React.useState('');
  const [activeTopic, changeActiveTopic] = React.useState(topics[0]);

  const user = 'eric' + Math.ceil(Math.random() * 100);

  return (
    <React.Fragment>
      <Header activeTopic={activeTopic} />
      <Container>
        <Paper className="app-container">
          <Topics topics={topics} changeActiveTopic={changeActiveTopic} />
          <Messages chats={chats} activeTopic={activeTopic} />
          <SendMessage chatMessage={chatMessage} changeChatMessage={changeChatMessage} user={user} activeTopic={activeTopic} sendChatAction={sendChatAction} />
        </Paper >
      </Container>
    </React.Fragment>
  )
}
