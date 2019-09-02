import { ACTION, UserActionTypes } from '../actions/types';

export interface UserStore {
  isSignedIn: boolean;
  isAdmin: boolean;
  userId: string;
  userName: string;
}

const initialState = {
  isSignedIn: false,
  isAdmin: false,
  userId: '',
  userName: ''
};

export const userReducer = (state: UserStore = initialState, action: UserActionTypes): UserStore => {
  switch (action.type) {
    case ACTION.SIGN_IN:
      return { ...state, isSignedIn: true, userId: action.payload.userId, userName: action.payload.userName };
    case ACTION.SIGN_OUT:
      return { ...state, isSignedIn: false, userId: '', userName: '', isAdmin: false };
    default:
      return state;
  }
};
