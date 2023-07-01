// import { SET_CURRENT_USER } from '../actions/types';
import isEmpty from 'lodash.isempty';
import { actions } from 'react-table';

var data = {
  isAuthenticated: false,
  user: {},
  isConfirmLogin: false,
  accounts: []
};


var auth = (state = data, action) => {
  //console.log('dmmsádadadad');
  //console.log(!isEmpty(action.user));
  switch (action.type) {

    case "SET_CURRENT_USER":
      // console.log('set user ',action)
      return {
        ...state,
        isAuthenticated: !isEmpty(action.user),
        user: action.user,
        isConfirmLogin: false
      };
    case "CONFIRM_LOGIN":
      return { ...state, isConfirmLogin: true }

    case "SET_CURRENT_USER_ACCOUNTS":
      return {
        ...state,
        accounts: action.accounts
      }
    default:
      return state;
  }
}
module.exports = auth;
