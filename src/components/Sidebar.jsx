import React from 'react'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import GroupWork from '@material-ui/icons/GroupWork';

import { useDispatch } from 'react-redux';
import { changeServer, changeTopic } from '../actions';
import { Tooltip, IconButton, Typography } from '@material-ui/core';

export default function Topics(props) {

  const { topics, servers } = props;

  const dispatch = useDispatch();

  return (
    <div className="sidebar-container">
      <div className="servers-container">
        <List>
          {servers.map(server => (
            <Tooltip title={server} key={server} placement="right" className="server-tooltip">
              <IconButton className="server-icon">
                <GroupWork onClick={() => dispatch(changeServer(server))} />
              </IconButton>
            </Tooltip>
          ))}
        </List>
      </div>
      <div className="topics-container">
        <List className="topic">
          {topics.map(topic => (
            <ListItem onClick={(e) => dispatch(changeTopic(topic))} key={topic} button>
              <i style={{ verticalAlign: 'text-bottom', fontWeight: 'bold' }} class="topic-hashtag">#</i>
              <Typography variant="body1">{topic}</Typography>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  )
}
