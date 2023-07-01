import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import axios from 'axios';
import { Route, hashHistory } from 'react-router-dom';
import { loadMenu, resetMenu } from 'actionMenu';
import { logout } from 'app/action/actionAuthenticate.js';
import PropTypes from 'prop-types';
import { logoutUser } from 'app/action/authActions';
import setAuthorizationToken from 'app/utils/setAuthorizationToken.js';
import { setCurrentUser } from 'app/action/authActions.js';
import RestfulUtils from "app/utils/RestfulUtils";
var log = require('app/utils/LoggerFactory.js').LoggerFactory({
  prefix: true, module: 'Logout...:'
});
const moment = require('moment');
class Logout extends React.Component {
  getDate() {
    // var now = new Date();
    // return now.format("dd/MM/yyyy").toString();
    // return new Date().toLocaleDateString();
    return moment().format('DD/MM/YYYY');
  }
  componentDidMount() {
   
    var that = this;
    var { dispatch, history } = this.props;
  
    RestfulUtils.post('/session/logOut')
      .then(res => {
        log('logOut res=' + res);
        if (res.data.errCode == 0) {
          log('logOut ok');
          dispatch(logout());
          localStorage.removeItem('jwToken');
      
          dispatch(resetMenu());
              this.context.router.history.push('/login');
        }

      })
      .catch(err => log('logOut Error', err));
  }
  render() {
   
    return (
      <div>
      

      </div>
    )
  }
}
Logout.contextTypes = {
  router: PropTypes.object.isRequired
}
// LoginSuccess.propTypes ={
//    logoutUser: PropTypes.func.isRequired
//
// }
module.exports = connect(function (state) {
  return {
  

  };
})(Logout);

/*
  axios
  session
*/
