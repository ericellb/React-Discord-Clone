import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import { socketMiddleware } from './middleware/socketMiddleware';

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk, socketMiddleware(process.env.REACT_APP_API_URL)))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
