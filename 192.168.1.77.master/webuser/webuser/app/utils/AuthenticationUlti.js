import React from 'react'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { genOTP } from '../utils/OTPUlti'
import { TIMEOUTOTP } from 'app/Helpers'
import RestfulUtils from 'app/utils/RestfulUtils'

var myVarTime;
function startTime(timecount) {
    clearTimeout(myVarTime);
    var innerHTML = document.getElementById('timecount').innerHTML
    innerHTML = innerHTML.replace("(", "").replace(")", "");
    timecount = timecount ? timecount : innerHTML.trim()
    var time = (timecount - 1) <= 0 ? "" : (timecount - 1).toString()
    document.getElementById('timecount').innerHTML = time == "" ? time : ' (' + time + ')';
    if (parseInt(time) > 0) myVarTime = setTimeout(startTime, 1000); // tăng thời gian phù hợp: 1000 - độ trễ ~ 990
}
class AuthenticationUlti extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            OTP: '',
            disable: false,
            username: null,
            isDisableGenOTP: false
        }
    }
    onGenOTP() {
        let that = this
        this.state.disable = true
        this.setState(this.state)
        // var handle = setInterval(function () {
        //     clearInterval(handle);
        that.state.disable = false
        let { USERID } = that.props.auth.user
        let { APPMODE, OBJNAME, username } = that.props
        genOTP({
            APPMODE: APPMODE,
            p_objname: OBJNAME,
            p_keyval: OBJNAME + (username ? username : USERID),
            p_username: username ? username : USERID,
            p_account: username ? username : USERID,
            p_strdata: ""
        }, that.props.strings.GenOTPSuccess)
        that.setState(that.state)
        //}, 2000)
    }
    async onClick(type) {
        let { APPMODE, OBJNAME, username } = this.props
        if (OBJNAME == 'LOGIN') {
            await RestfulUtils.post('/system/isExistSessionTimeOutOTP', {})
                .then(async (resdata) => {
                    //console.log('resdata.isExist',resdata.isExist)
                    if (!resdata.timeoutOTP) {
                        await RestfulUtils.post('/system/SetTimeOutOTP', {})
                            .then(async (resdata) => {
                                if (resdata.EC == 0) {
                                    console.log('set success')
                                    await this.onGenOTP()
                                    await this.setTimeCountOTP(TIMEOUTOTP)
                                }

                            })
                    } else {
                        window.location.reload();
                    }

                })
        } else {
            await this.onGenOTP()
            await this.setTimeCountOTP(TIMEOUTOTP)
        }
        // 
    }
    onChange(key, event) {
        this.props.onChange(key, event)
    }
    onFocus(e) {
        e.target.placeholder = ""
    }
    onBlur(e) {
        e.target.placeholder = this.props.strings.InputOTP
    }
    componentDidMount() {
        let that = this
        if (this.props.isAuto)
            this.onGenOTP()
        else {
            if (that.props.OBJNAME == 'LOGIN') {
                RestfulUtils.post('/system/isExistSessionTimeOutOTP', {})
                    .then(async (resdata) => {
                        //console.log('resdata.isExist',resdata.isExist)
                        if (resdata.timeoutOTP) {
                            that.setTimeCountOTP(resdata.timeoutOTP)
                        }
                        that.setState(that.state)
                    })
            }
        }
    }
    onClick2 = async () => {
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
    async setTimeCountOTP(timeoutOTP) {
        let that = this
        var timecount = timeoutOTP == TIMEOUTOTP ? TIMEOUTOTP : (TIMEOUTOTP - parseInt(timeoutOTP))
        if (timecount > 0) {
            await startTime(timecount);
            that.state.isDisableGenOTP = true
            var handle = setInterval(function () {
                clearInterval(handle)
                // clearTimeout(myVarTime);
                that.clearTimeOutOTP()
                that.state.isDisableGenOTP = false
                that.setState(that.state)
            }, timecount * 1000)
            that.setState(that.state)
        } else {
            clearTimeout(myVarTime);
            that.state.isDisableGenOTP = false
        }
    }
    clearTimeOutOTP = async () => {
        RestfulUtils.post('/system/clearTimeOutOTP', {})
            .then(async (resdata) => {
                if (resdata.EC == 0) {
                    console.log('clear success')
                }
            })
    }
    logOut(e) {
        e.preventDefault();
        window.location.replace("/auth/logout");
      }
    render() {
        let { isDisableGenOTP } = this.state
        var { authtype, isVertical, isShow, isAuto, strings, OBJNAME } = this.props
        var cssWidth = isAuto || isVertical ? '100%' : '110px'
        return (
            isShow ?
                <div className="col-md-12" style={{ paddingTop: "11px" }}>
                    <div className="col-md-12 row">
                        <div className="col-md-3">
                            <h5><b>{this.props.strings.user}</b></h5>
                        </div>
                        <div className="col-md-4">
                        <input type="text" className="form_user" disabled value={this.props.USERID} />
                            {/* <input type="text" style={{ display: 'none' }} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)} onChange={this.onChange.bind(this, 'p_otpvalue')} className="form-control otpInput" placeholder={strings.InputOTP} />  */}
                        </div>
                        {/* <div className="col-md-2 pull-right" >
                        <a className="" onClick={this.logOut.bind(this)} href="#"><i className="fas fa-sign-out-alt"></i> {this.props.strings.logout}</a>
                        </div> */}
                    </div>
                    <div className="col-md-12 row">
                        <div className="col-md-3">
                            <h5><b>{this.props.strings.OTP}</b></h5>
                        </div>
                        <div className="col-md-6">
                        <input className="form-control" type="text"  onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)}
                         placeholder={this.props.strings.InputOTP} id="txtotpvalue" 
                         //value={this.state.datagroup["p_otpvalue"]} 
                         onChange={this.onChange.bind(this, "p_otpvalue")} />

                        {/* <input className="form_otp" type="text" onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)} 
                        onChange={this.onChange.bind(this, 'p_otpvalue')} placeholder={strings.InputOTP} /> */}
                        </div>                    
                    </div>

                    <div>
                </div>

                    <div className="col-md-12 row">
                        <div className="col-md-4">
                        <input type="button" className="btn btn-primary pull-left" style={{ marginLeft: 0, marginRight: 0 }} disabled={isDisableGenOTP} value={this.props.strings.GenOTP} id="timecount" onClick={this.onClick.bind(this)} />
                        </div>
                        <div className="col-md-4">
                        <input type="button" className="btn btn-primary pull-left" style={{ marginLeft: 0, marginRight: 0 }}  value={this.props.strings.Submit} id="timecount" onClick={this.onClick2.bind(this)} />
                        </div>

                            {/* <button className="genOTP" value={strings.GenOTP} onClick={this.onClick.bind(this)} disabled={isDisableGenOTP}>{strings.GenOTP} <span id="timecount" ></span></button> */}
                        </div>                       
                </div>
                : null
        )
    }
}
const stateToProps = state => ({
    authtype: 'OTP',
    auth: state.auth
});

const decorators = flow([
    connect(stateToProps),
    translate('AuthenticationUlti')
]);

module.exports = decorators(AuthenticationUlti);