import { chatReducer } from './chatReducer';
import { userReducer } from './userReducer';
import { combineReducers } from 'redux';

export interface StoreState {
  chat: {
    servers: {
      [serverName: string]: {
        channels: {
          [channelName: string]: { from: string; to: string; msg: string }[];
        };
      };
    };
    privateMessages: {
      [userPM: string]: { from: string; to: string; msg: string; user: string }[];
    };
    activeServer: string;
    activeChannel: string;
    activeUserList: string[];
    activeView: string;
    activePMUser: string;
  };
  user: {
    isSignedIn: boolean;
    isAdmin: boolean;
    userId: string;
    userName: string;
  };
}

export default combineReducers<StoreState>({
  chat: chatReducer,
  user: userReducer
});
