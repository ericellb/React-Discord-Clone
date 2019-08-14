import React from 'react'
import Servers from './Servers';
import Topics from './Topics'

export default function Sidebar(props) {

  // Get props from parent
  const { setDrawerVisible } = props;

  return (
    <div className="sidebar-container">
      <Servers setDrawerVisible={setDrawerVisible} />
      <Topics setDrawerVisible={setDrawerVisible} />
    </div >
  )
}
