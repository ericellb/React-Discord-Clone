import React, { useEffect } from 'react'

import { Chip, Icon } from '@material-ui/core';

export default function Messages(props) {

  let messageContainer;

  const { chats, activeTopic } = props;
  useEffect(() => {
    // Keep scroll on bottom
    messageContainer.scrollIntoView();
  })

  return (
    <div className="messages-flex-container">
      <div className="messages-container">
        {chats[activeTopic].map((message, i) => (
          <div className="message" key={i}>
            <Chip avatar={<Icon>person</Icon>} label={message.from + ' ' + message.msg} />
          </div>
        ))}
        <div ref={(element) => messageContainer = element}></div>
      </div>
    </div>
  )
}
