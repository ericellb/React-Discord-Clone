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
      <Header activeTopic={activeTopic} />
      <div className="grid-container">
        <Topics topics={topics} changeActiveTopic={changeActiveTopic} />
        <Messages activeTopic={activeTopic} />
        <SendMessage chatMessage={chatMessage} changeChatMessage={changeChatMessage} user={user} activeTopic={activeTopic} />
      </div >
    </div>
  )
}
