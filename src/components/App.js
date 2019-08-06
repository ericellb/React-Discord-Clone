import React from 'react';
import './App.css';
import Dashboard from './Dashboard';

import Store from './Store';

function App() {
  return (
    <Store>
      <Dashboard></Dashboard>
    </Store>
  );
}

export default App;
