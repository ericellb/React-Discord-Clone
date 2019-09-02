import { chatReducer, ChatStore } from './chatReducer';
import { userReducer, UserStore } from './userReducer';
import { combineReducers } from 'redux';

export interface StoreState {
  chat: ChatStore;
  user: UserStore;
}

export default combineReducers<StoreState>({
  chat: chatReducer,
  user: userReducer
});
