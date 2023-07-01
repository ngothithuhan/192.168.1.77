import axios from 'axios';
import setAuthorizationToken from 'app/utils/setAuthorizationToken';
// import jwtDecode from 'jwt-decode';
var SET_CURRENT_USER = "SET_CURRENT_USER";
var CONFIRM_LOGIN = "CONFIRM_LOGIN";
var SET_CURRENT_USER_ACCOUNTS = "SET_CURRENT_USER_ACCOUNTS"; //actions set tất cả số lưu ký của 1 tài khoản

export function setCurrentUser(user) {
  //  console.log(user);
  return {
    type: SET_CURRENT_USER,
    user
  };

}
export function logoutUser() {
  console.log('logoutUser');
  return dispatch => {
    localStorage.removeItem('jwToken');
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
  }
}
export function setConfirmLogin() {
  return {
    type: CONFIRM_LOGIN
  }
}
// export function login(data) {
//   return dispatch => {
//     return RestfulUtils.post('/auth/index', data).then(res => {
//       const token = res.data.token;
//       localStorage.setItem('jwtToken', token);
//       setAuthorizationToken(token);
//       dispatch(setCurrentUser(jwtDecode(token)));
//     });
//   }
// }

export function setAllAccounts(accounts) {
  return {
    type: SET_CURRENT_USER_ACCOUNTS,
    accounts
  }
}