import React from 'react';
import { connect } from 'react-redux';
import translate from 'app/utils/i18n/Translate.js';
import flow from 'lodash.flow';
import { bindActionCreators } from 'redux'

import { setConfirmLogin } from 'app/action/authActions.js';
import { Modal } from 'react-bootstrap'
import AuthenticationUlti from 'app/utils/AuthenticationUlti'
import { checkOTP } from 'app/utils/OTPUlti';
import RestfulUtils from 'app/utils/RestfulUtils'

class ConfirmLogin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        APPMODE: "CB",
        p_objname: "LOGIN",
        p_keyval: "LOGIN" + this.props.auth.user.USERID,
        p_otpvalue: "",
        p_strdata: "",
        AuthType: "OTP"
      },
      isExistSession: false
    }
  }
  onChangeInput = (key, event) => {
    if (event.target) {
      this.state.data[key] = event.target.value
    } else {
      this.state.data[key] = event.value;
    }
    this.setState({ data: this.state.data });
  }
  onClick = async () => {
    let isvalidotp = await checkOTP(this.state.data)
    if (isvalidotp.successOTP) {
      await this.props.setConfirmLogin();
      await this.props.history.push('/Home');
    }
    else
      if (isvalidotp.count == 3) {
        let that = this
        setTimeout(
          function () {
            that.logOut()
          }
            .bind(this),
          3000
        );
      }
  }
  // logOut(e) {
  //   if (e)
  //     e.preventDefault();
  //   localStorage.removeItem('jwToken');
  //   window.location.replace('/auth/logout')
  // }
  onContinue = () => {
    RestfulUtils.post('/auth/checkSession', {})
      .then(async (resdataroot) => {
        this.setState({ ...this.state, isExistSession: false })
      })

  }
  componentWillMount() {
    document.title = this.props.strings.title
    let that = this
    RestfulUtils.post('/auth/isExistSession', { username: that.props.auth.user.USERID })
      .then(async (resdata) => {
        //console.log('resdata.isExist',resdata.isExist)
        that.state.isExistSession = resdata.isExist
        that.setState(that.state)
      })

    if (this.props.isConfirmLogin)
      this.props.history.push('/Home');
    else {
      RestfulUtils.post('/auth/loginFlex', {})
        .then(async (resdata) => {
          if (resdata.EC == 0) {
            if (resdata.DT.isconfirmlogin == 'Y') {
              await that.props.setConfirmLogin()
              that.props.history.push('/Home');
              // RestfulUtils.post('/auth/checkSession', {})
              //     .then(async (resdataroot) => {
              //         that.props.history.push('/Home');
              //     })

            }
          }
        })

    }

  }
  logOut(e) {
    e.preventDefault();
    window.location.replace("/auth/logout");
  }
  render() {
    let { isExistSession } = this.state
    let { strings } = this.props
    return (
      <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

        <div className="add-info-account">


          <div className="title-content" >{isExistSession ? 'WARNING' : 'OTP'}</div>
          {/* <h2><span>{isExistSession ? 'WARNING' : 'OTP'}</span></h2> */}
          {/* {!isExistSession &&
            <div>
                <input type="text" className="form_user" disabled value={this.props.auth.user.USERID} />
                <span className='user-icon'></span>
                </div>
            } */}
          {!isExistSession && <AuthenticationUlti isAuto={false} USERID={this.props.auth.user.USERID} isShow={true} OBJNAME="LOGIN" APPMODE="CB" onChange={this.onChangeInput} isVertical={true} />}

          {/* {!isExistSession &&
            <div>
                <input style={{ fontSize: 18, fontWeight: 'bold' }} type="submit" className="" onClick={this.onClick} value="Submit" />
                </div>
            } */}

          {/* {isExistSession &&
          <div>
                {strings.waringLogin}
                <input type="submit" className="" onClick={this.onContinue} value="Continue" />
                </div>
          } */}
        </div>
      </div>
    )
  }
}

const stateToProps = state => ({
  auth: state.auth,
  isConfirmLogin: state.auth.isConfirmLogin
});

const dispatchToProps = dispatch => ({
  setConfirmLogin: bindActionCreators(setConfirmLogin, dispatch),
})

const decorators = flow([
  connect(stateToProps, dispatchToProps),
  translate('ConfirmLogin')
]);

module.exports = decorators(ConfirmLogin);