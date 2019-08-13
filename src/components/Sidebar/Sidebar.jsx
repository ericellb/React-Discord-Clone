import React from 'react'
import Servers from './Servers';
import Topics from './Topics'

export default function Sidebar(props) {

  // Get props from parent
  const { changeDrawerVisible } = props;

  return (
    <div className="sidebar-container">
      <Servers />
      <Topics changeDrawerVisible={changeDrawerVisible} />
    </div >
  )
}
