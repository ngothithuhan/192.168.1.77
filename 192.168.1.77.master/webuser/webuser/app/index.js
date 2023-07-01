import React from 'react';
import ReactDOM from 'react-dom';
// var PrivateRoute = require('PrivateRoute');
// import axios from 'axios';
// import setAuthorizationToken from 'app/utils/setAuthorizationToken.js';
// import {loadMenu,resetMenu} from 'actionMenu';
// import {showNotifi} from 'actionNotification';
// import {login,logout}  from 'app/action/actionAuthenticate.js';



//var store = require('store');

import App from './components/App.js';

//
// import {setCurrentUser} from 'app/action/authActions.js';
//import jwt from 'jsonwebtoken';
//import jwtDecode from 'jwt-decode';

var log = require('app/utils/LoggerFactory.js').LoggerFactory({
  prefix: true, module: 'index.:'
});
// axios.get('userflex/getInfo')
// .then((res)=>{
//     console.log('đăng nhập qua flex thành công');
//       store.dispatch(login(res.data.email));
//
//       axios.get('/session/getMenu')
//       .then(res => {
//         console.log(res.data);
//           store.dispatch(loadMenu(res.data));
//       })
//       .catch(err => console.log(err));
//      // that.context.router.history.push('/homepage');
//
//     console.log(res.data);
// })
// .catch(function(err){
//    console.log('loi cmmdadm');
//    console.log(err.response);
//    //dispatch(showNotifi(err.response.));
// });
//console.log('thực hiện đầu tiên');
if(localStorage.jwToken){
   log('jwToken already existed!');
  //  setAuthorizationToken(localStorage.jwToken);
    
  } else {
    log('jwToken not found!!');
    
  }

ReactDOM.render(
    <App />
      
    ,
  document.getElementById('layout')
);
