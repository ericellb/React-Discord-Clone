import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

import { Chip, Icon } from '@material-ui/core';

export default function Messages(props) {

  const { activeTopic } = props;

  const chatStore = useSelector(state => state.chat);
  console.log(activeTopic);

  let messageContainer;

  useEffect(() => {
    // Keep scroll on bottom
    messageContainer.scrollIntoView();
  })

  return (
    <div className="messages-container">
      {chatStore[activeTopic].map((message, i) => (
        <div className="message" key={i}>
          <Chip avatar={<Icon>person</Icon>} label={message.from + ' ' + message.msg} />
        </div>
      ))}
      <div ref={(element) => messageContainer = element}></div>
    </div>
  )
}
