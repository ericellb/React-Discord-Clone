import React from 'react'
import { useSelector } from 'react-redux';

import Topics from './Topics';
import Messages from './Messages';
import SendMessage from './SendMessage.jsx';
import Header from './Header';

const user = 'eric' + Math.ceil(Math.random() * 100);

export default function Dashboard() {

  const chatStore = useSelector(state => state.chat);
  const topics = Object.keys(chatStore);

  // Local state
  const [chatMessage, changeChatMessage] = React.useState('');
  const [activeTopic, changeActiveTopic] = React.useState(topics[0]);

  return (
    <div>

      <Header topics={topics} activeTopic={activeTopic} />

      <div className="grid-container">

        <div className="topics-grid">
          <Topics topics={topics} changeActiveTopic={changeActiveTopic} />
        </div>

        <div className="messages-grid">
          <Messages activeTopic={activeTopic} />
        </div>

        <div className="send-messages-grid">
          <SendMessage chatMessage={chatMessage} changeChatMessage={changeChatMessage} user={user} activeTopic={activeTopic} />
        </div>

      </div >

    </div>
  )
}
