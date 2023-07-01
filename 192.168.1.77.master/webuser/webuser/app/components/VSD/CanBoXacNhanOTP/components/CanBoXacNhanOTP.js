import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux';
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from '../../../../utils/RestfulUtils'
import DropdownFactory from 'app/utils/DropdownFactory';
import './CanBoXacNhanOTP.scss';
import {
  ACTIONS_ACC,
  COUNTDOWN_OTP_ACCOUNT, EVENT
} from '../../../../Helpers';
import { emitter } from 'app/utils/emitter';

import CountDown from 'app/utils/CountDown/CountDown.js';
class CanBoXacNhanOTP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        OTPCODE: "",
        newCUSTODYCD: "",
        FULLNAME: "",
        IDCODE: "",
        OTPTYPE: '',
        LANG: this.props.lang
      },
      previousURL: "",
      checkFields: [
        //{ name: "CUSTODYCD", id: "txtCustodycd" },
        { name: "IDCODE", id: "txtidcode" },
        { name: "OTPCODE", id: "txtOtpcode" }
      ],

      count: COUNTDOWN_OTP_ACCOUNT, //tính theo giây
      isFirstTime: true, //run only once
    }
  }
  emitEventReturnTableAccount() {
    emitter.emit(EVENT.RETURN_TABLE_ACC, '');
  }

  checkValid(name, id) {
    let value = this.state.data[name];
    let mssgerr = '';
    switch (name) {
      case "IDCODE":
        if (value == '')
          mssgerr = this.props.strings.requiredCustodycode;
        break;
      // case "OTPCODE":
      //   if (value == '')
      //     mssgerr = this.props.strings.requiredOTPcode;
      //   break;

      default:
        break;
    }
    if (mssgerr !== '') {
      var { dispatch } = this.props;
      var datanotify = {
        type: "",
        header: "",
        content: ""

      }
      datanotify.type = "error";
      datanotify.content = mssgerr;
      dispatch(showNotifi(datanotify));
      window.$(`#${id}`).focus();
    }
    return mssgerr;
  }

  submit() {
    var mssgerr = '';
    for (let index = 0; index < this.state.checkFields.length; index++) {
      const element = this.state.checkFields[index];
      mssgerr = this.checkValid(element.name, element.id);
      if (mssgerr !== '')
        break;
    }

    if (mssgerr == '') {
      var { dispatch } = this.props;
      var datanotify = {
        type: "",
        header: "",
        content: ""

      }
      //console.log('==========data', this.state.data)
      //console.log('==========dataOTP', this.state.dataOTP)
      RestfulUtils.post('/account/activeopt', { ...this.state.data, OBJNAME: this.props.OBJNAME })
        .then((res) => {
          if (res.EC == 0) {
            if ((this.props.ISQLTK && this.props.access == 'edit') || (this.props.ISQLTK && this.props.access == 'update')) {
              this.emitEventReturnTableAccount();
              datanotify.type = "success";
              datanotify.content = this.props.strings.updatesuccess;
              dispatch(showNotifi(datanotify));
            } else {
              datanotify.type = "success";
              datanotify.content = this.props.strings.activesuccess;
              dispatch(showNotifi(datanotify));
              // mo popup thong bao
              if (this.props.showModalWarningInfoOpenAcc && this.props.access != "update") {
                this.props.showModalWarningInfoOpenAcc()
              }
              if (this.props.showModalWarningInfoOpenAccUpdate && this.props.access == "update") {
                this.props.showModalWarningInfoOpenAccUpdate()
              }
            }
            if (this.props.confirmSuccess && this.state.previousURL != "") {
              window.setTimeout(function () {
                window.location = this.state.previousURL;
              }, 4000);
            }
            if (this.props.confirmSuccess) {
              this.props.confirmSuccess();
            }


            //luồng xử lý mở tài khoản
            if (this.props.openAccountSuccess && this.props.access === ACTIONS_ACC.CREATE) {
              this.props.openAccountSuccess();
            }
          } else {

            datanotify.type = "error";
            datanotify.content = res.EM;
            dispatch(showNotifi(datanotify));
          }

        })
    }

  }

  onChange(type, event) {

    if (event.target) {
      if (event.target.type == "checkbox")
        this.state.data[type] = event.target.checked;
      else {
        if (type == "IDCODE")
          this.getInforAccount(event.target.value)
        this.state.data[type] = event.target.value;
      }
    }
    else {

      this.state.data[type] = event.value;
    }

    this.setState({ data: this.state.data })

  }
  getInforAccount(IDCODE) {
    // sua theo yeu cau moi truyen idcode thay vì cusdodycd
    RestfulUtils.post('/account/get_account_openotp', { CUSTODYCD: IDCODE, LANG: this.props.lang, OBJNAME: this.props.OBJNAME }).then((resData) => {
      if (resData)
        //console.log('==========resData', resData)
        if (resData.length > 0) {
          this.state.data.FULLNAME = resData[0].FULLNAME;
          this.state.data.IDCODE = resData[0].IDCODE;
          this.state.data.newCUSTODYCD = resData[0].CUSTODYCD;
          this.setState(this.state)
        }

    });
  }

  componentWillReceiveProps(nextProps) {
    var isMini = nextProps.isMini;
    var dataOTP = nextProps.dataOTP;
    if (this.props.previousURL !== nextProps.previousURL) {
      this.state.previousURL = nextProps.previousURL
      //console.log("previousURL:======", nextProps.previousURL)
    }
    if (this.props.isMini !== isMini) {
      this.state.data.newCUSTODYCD = dataOTP.p_custodycd;
      this.state.data.FULLNAME = dataOTP.fullname;
      this.state.data.IDCODE = dataOTP.idcode


      this.setState(this.state)
    }
  }

  componentWillMount() {
    if (this.props.previousURL) {
      this.state.previousURL = this.props.previousURL
      //console.log("previousURL:======", this.props.previousURL)
    }
    if (this.props.access) {
      if (this.props.access == 'edit' || this.props.access == 'update')
        this.setState({ ...this.state, data: { ...this.state.data, OTPTYPE: 'EDITCF' } })
      else
        this.setState({ ...this.state, data: { ...this.state.data, OTPTYPE: 'OPENCF' } })
    }
  }

  componentDidMount() {
    var { isMini, dataOTP } = this.props;
    if (this.props.previousURL) {
      this.state.previousURL = this.props.previousURL

      //console.log("previousURL:======", this.props.previousURL)
    }
    if (isMini) {
      this.state.data.newCUSTODYCD = dataOTP.p_custodycd;
      this.state.data.FULLNAME = dataOTP.fullname;
      this.state.data.IDCODE = dataOTP.idcode
      this.setState(this.state)
    }


    this.createTimer();

  }

  componentDidUpdate(prevProps, prevState) {
    let { count, isFirstTime } = this.state;

    if (count !== prevState.count && count === 0 && isFirstTime) {
      this.setState({
        ...this.state,
        isFirstTime: false
      })
      clearInterval(this.countDown);
    }
  }

  createTimer = () => {
    if (this.countDown) {
      this.setState({
        ...this.state,
        count: COUNTDOWN_PLACEORDER
      })
      clearInterval(this.countDown);
    }

    this.countDown = setInterval(async () => {
      let { count } = this.state;
      await this.setState({
        ...this.state,
        count: count - 1
      })
    }, 1000)
  }

  formatTimeToMinute(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
  }

  onSetDefaultValue = (type, value) => {
    if (!this.state[type])
      this.state[type] = value
  }
  submitlater() {
    if (this.props.submitlater) {
      this.props.submitlater();
    }
  }

  onTimesUp = () => {
    //do sth
    emitter.emit(EVENT.TIME_UP_CLOSE_OTP, '');
  }
  render() {
    let isMini = false;
    let hideBtnSubmitLater = this.props.OBJNAME != 'OTPCONFIRMCF' && this.props.OBJNAME != "CUSTOMERACTIVEOTP"
    if (this.props.isMini)
      isMini = this.props.isMini;

    let { count } = this.state;

    return (
      <React.Fragment>
        <div className={!isMini ? "container panel panel-success margintopNewUI" : ""}>
          <div className="canbo-xacnhan-otp-container">
            {/* 	title: "Xác nhận OTP mở TK ", */}
            {!isMini && <div className="title-content" >{this.props.strings.title}</div>}
            {/* {(this.props.OBJNAME != 'CREATEACCOUNT' && this.props.OBJNAME != 'CUSTOMERACTIVEOTP') && <div className="col-md-12 row"> */}

            {/* Số TKGD */}
            <div className="row">
              <div className="col-md-12 form-group">
                <label>{this.props.strings.custodycd}</label>
                <input onChange={this.onChange.bind(this, "CUSTODYCD")} value={isMini ? this.props.dataOTP.p_custodycd : this.state.data.newCUSTODYCD} disabled={isMini} className="form-control" type="text" placeholder={this.props.strings.custodycd} id="txtCustodycd" />
              </div>
            </div>

            {/* Số ĐKSH */}
            <div className="row">
              <div className="col-md-12 form-group">
                <label>{this.props.strings.idcode}</label>
                {isMini && <label className="form-control" disabled type="text" id="txtIDCODE">{this.props.dataOTP.idcode}</label>}
                {!isMini && <input onChange={this.onChange.bind(this, "IDCODE")} value={this.state.data.IDCODE} disabled={isMini} className="form-control" type="text" placeholder={this.props.strings.idcode} id="txtIDCODE" />}
              </div>
            </div>

            {/* Họ tên */}
            <div className="row">
              <div className="col-md-12 form-group">
                <label>{this.props.strings.fullname}</label>
                <label className="form-control" disabled type="text" id="txtFullname">{isMini ? this.props.dataOTP.fullname : this.state.data.FULLNAME}</label>
              </div>
            </div>

            {/* Loại giao dịch */}
            <div className="row">
              <div className="col-md-12 form-group">
                <label>{this.props.strings.type}</label>
                {!this.props.access && <DropdownFactory onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} ID="drdOTPTYPE" value="SEX" CDTYPE="CF" CDNAME="CFOTPTYPE" CDVAL={this.state.data.OTPTYPE} />}
                {this.props.access && <DropdownFactory disabled onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} ID="drdOTPTYPE" value="SEX" CDTYPE="CF" CDNAME="CFOTPTYPE" CDVAL={this.state.data.OTPTYPE} />}
              </div>
            </div>

            {/* Mã OTP */}
            <div className="row">
              <div className="col-md-12 form-group">
                <label>{this.props.strings.otpcode}</label>
                <div className="timer-container">
                  <input maxLength='10' onChange={this.onChange.bind(this, "OTPCODE")}
                    className="form-control" type="text"
                    placeholder={this.props.strings.otpcode} id="txtOtpcode"
                  />
                  {/* <i className="fa fa-clock-o" aria-hidden="true"><span>{this.formatTimeToMinute(count)}</span></i> */}

                  <CountDown
                    duration={true}
                    onTimesUp={() => this.onTimesUp()}
                  />
                </div>
              </div>
            </div>

            <div className="row" style={{ marginTop: '10px' }}>
              <div className="col-md-12">
                <input onClick={this.submit.bind(this)}
                  type="button"
                  value={this.props.strings.confirmbtn}
                  id="btnSubmit"
                  className="btn-submit-otp"
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>

    )
  }
}

const stateToProps = state => ({
  lang: state.language.language,
  showModal: state.datLenh.showModalWarningInfoOpenAcc
});


const decorators = flow([
  connect(stateToProps),
  translate('CanBoXacNhanOTP')
]);

module.exports = decorators(CanBoXacNhanOTP);
