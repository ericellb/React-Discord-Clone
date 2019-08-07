import React from 'react'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

export default function Topics(props) {
  const { topics, changeActiveTopic } = props;
  return (
    <div className="topics-container">
      <List>
        {topics.map(topic => (
          <ListItem onClick={(e) => changeActiveTopic(topic)} key={topic} button># {topic}</ListItem>
        ))}
      </List>
    </div>
  )
}
