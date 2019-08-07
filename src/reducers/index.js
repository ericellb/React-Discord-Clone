import { chatReducer } from './chatReducer';
import { combineReducers } from 'redux';

export default combineReducers({
  chat: chatReducer
});