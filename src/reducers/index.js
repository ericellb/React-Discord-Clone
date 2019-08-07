import { chatReducer } from './chatReducer';
import { serverReducer } from './serverReducer';
import { combineReducers } from 'redux';

export default combineReducers({
  chat: chatReducer,
  location: serverReducer
});