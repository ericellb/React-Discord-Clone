import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

import { Chip, Icon } from '@material-ui/core';

export default function Messages(props) {

  // Get store
  const { activeServer, activeTopic } = useSelector(state => state.chat);

  const chatStore = useSelector(state => state.chat);

  let messageContainer;

  useEffect(() => {
    // Keep scroll on bottom
    messageContainer.scrollIntoView()
  })

  return (
    <div className="messages-container">
      {chatStore.servers[activeServer][activeTopic].map((message, i) => (
        <div className="message" key={i}>
          <Chip avatar={<Icon>person</Icon>} label={message.from + ' ' + message.msg} />
        </div>
      ))}
      <div ref={(element) => messageContainer = element}></div>
    </div>
  )
}
