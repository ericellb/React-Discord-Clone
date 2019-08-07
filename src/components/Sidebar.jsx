import React from 'react'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import { useDispatch } from 'react-redux';
import { changeServer, changeTopic } from '../actions';

export default function Topics(props) {

  const { topics, servers } = props;

  const dispatch = useDispatch();

  return (
    <div className="sidebar-container">
      <div className="servers-container">
        <List>
          {servers.map(server => (
            <ListItem onClick={() => dispatch(changeServer(server))} key={server} button># {server}</ListItem>
          ))}
        </List>
      </div>
      <div className="topics-container">
        <List>
          {topics.map(topic => (
            <ListItem onClick={(e) => dispatch(changeTopic(topic))} key={topic} button># {topic}</ListItem>
          ))}
        </List>
      </div>
    </div>
  )
}
