import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
// import Captcha from 'Captcha';
// import Notification from 'Notification';
// import { loadMenu, resetMenu } from 'actionMenu';
// import { showNotifi } from 'actionNotification';
import flow from 'lodash.flow';
import { changeLanguage } from 'app/action/actionLanguage.js';
// import { login, logout } from 'app/action/actionAuthenticate.js';
// import setAuthorizationToken from 'app/utils/setAuthorizationToken.js';
import { setCurrentUser, setConfirmLogin } from 'app/action/authActions.js';
// import jwt from 'jsonwebtoken';
// import jwtDecode from 'jwt-decode';
import translate from 'app/utils/i18n/Translate.js';
// import TableBootstrap from 'app/utils/TableBootstrap.js';
// import ReactTableBootstrap from 'app/utils/ReactTableBootstrap.js';
import PropTypes from 'prop-types';
// import MutiLanguage from './MutiLanguage.js';

var log = require('app/utils/LoggerFactory.js').LoggerFactory({
  prefix: true, module: 'Login.:'
});
function callSubmit() {
  if (iscsrf) {
    console.log("callSubmit.action:auth/flex.:iscsrf=", iscsrf)
    axios.get(urlcsrf).then(csrfv => {
      console.log("callSubmit.action:auth/flex.:csrfv=", csrfv)
      if (csrfv && csrfv.data && csrfv.data._csrf != undefined) {
        document.forms["myForm"].elements["_csrf"].value = csrfv.data._csrf;
        document.forms["myForm"].submit();
      }
    });
  } else
    document.forms["myForm"].submit();
}
class Login extends React.Component {
  async componentDidMount() {

    log('Begin Login componentDidMount');
    var { dispatch } = this.props;
    var that = this;
    // if (!localStorage.jwToken) {
    log('Not found jwToken==>Get from loginFlex');
    await axios.get('auth/loginFlex')
      .then((res) => {
        if (!res.data.err) {
          localStorage.setItem('jwToken', res.data.token);
          let data = res.data.user;
          dispatch(setCurrentUser(data));
          const { user } = that.props.auth
          console.log('user after login :', user)
          let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
          let isfirstlogin = user ? user.ISFIRSTLOGIN ? user.ISFIRSTLOGIN == 'Y' : true : true;
          let ischangepass = user ? user.NEEDCHANGEPASS ? user.NEEDCHANGEPASS == 'Y' : true : true;
          //let isconfirmlogin = res.data.isconfirmlogin;
          let isconfirmlogin = 'Y';
          //05/01/2021 : set isconfirmlogin = Y de user login vao luon khong qua OTP do chua implement duoc
          console.log('isconfirmlogin :', isconfirmlogin)
          if (!isCustom)
            that.props.history.push('/TRANSACTIONS');
          else {
            // if (!isfirstlogin && !ischangepass && isconfirmlogin == 'Y') {
            if (!isfirstlogin && isconfirmlogin == 'Y') {
              //dispatch(setConfirmLogin())
              // that.props.history.push('/HOME');
              // đối với nhà đầu tư, hiển thị tab nhà đầu tư
              // đối với môi giới, chưa có trường phân biệt
              that.props.history.push('/OVERVIEWPROPERTY');
            }
            else {
              if (!isfirstlogin && !ischangepass && isconfirmlogin == 'N') {
                console.log('Login.ConfirmLogin', isconfirmlogin)
                that.props.history.push('/CONFIRMLOGIN');
              }
              else {
                that.props.history.push('/CHANGEPASSWORD');
              }

            }

          }

        }
        else {
          callSubmit()
        }

        //   axios.post('/session/getMenu',{email:data.username})
        //     .then(res => {
        //       dispatch(loadMenu(res.data));


        //       that.props.history.push('/duyetgiaodich');

        //     })
        //     .catch(function (err) { console.log(err) })
      })

      .catch(function (err) {
        log('loi', err);
        // dispatch(showNotifi(err.response.data.err));
      });

    // else {

    // }

  }


  selectChangeHandler(event, key) {
    var { dispatch } = this.props;


    dispatch(changeLanguage(event.target.value));
  }
  render() {
    //console.log('why 2 timeeeee????????????')
    return (
      <div className="container" >

        <div className="col-md-12">
          <form name="myForm" action="auth/flex" method="post">
            <input type="hidden" name="_csrf" value="<%= _csrf %>" />
          </form>
        </div>
      </div>

    )
  }
}


Login.propTypes = {

  strings: PropTypes.object
};
Login.contextTypes = {
  router: PropTypes.object.isRequired
};

Login.defaultProps = {

  strings: {
    choselanguage: 'Chose language',
    login: 'Login',
    remember: 'Remember Me',
    forgotPass: 'Forgot password?',
    dataLanguage: {
      english: 'English',
      vietnam: 'Vietnamese',
      french: 'French',
      china: 'China',
      russia: 'Russia'


    }
  },


};
const stateToProps = state => ({
  veryfiCaptcha: state.veryfiCaptcha,
  notification: state.notification,
  auth: state.auth
});


const decorators = flow([
  connect(stateToProps),
  translate('Login')
]);

module.exports = decorators(Login);