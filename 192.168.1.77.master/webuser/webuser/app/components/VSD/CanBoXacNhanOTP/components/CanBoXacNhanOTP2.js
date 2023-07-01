import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux';
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from '../../../../utils/RestfulUtils'
import DropdownFactory from 'app/utils/DropdownFactory';
class CanBoXacNhanOTP2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: { 
        OTPCODE: "",
        newCUSTODYCD: "",
        CUSTODYCD: "",
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
      ]
    }
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


  async submit() {
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
              console.log('1');
              datanotify.type = "success";
              datanotify.content = this.props.strings.updatesuccess;
              dispatch(showNotifi(datanotify));
            } else {
              console.log('2');
              datanotify.type = "success";
              datanotify.content = this.props.strings.activesuccess;
              dispatch(showNotifi(datanotify));

              // mo popup thong bao
              if (this.props.showModalWarningInfoOpenAcc) this.props.showModalWarningInfoOpenAcc()

            }
            if (this.props.confirmSuccess && this.state.previousURL != "") {
              console.log('3');
              window.setTimeout(function () {
                window.location = this.state.previousURL;
              }, 4000);
            }
            if (this.props.confirmSuccess) {
              console.log('4');
              this.props.confirmSuccess();

            }
          } else {
            console.log('5');
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
          this.state.data.CUSTODYCD = resData[0].CUSTODYCD;
          this.setState(this.state)
          this.props.getCUSTODYCD(this.state.data);
        }

    });
  }
  componentWillReceiveProps(nextProps) {


    var isMini = nextProps.isMini;
    var dataOTP = nextProps.dataOTP;
    if (nextProps.previousURL) {
      this.state.previousURL = nextProps.previousURL
      //console.log("previousURL:======", nextProps.previousURL)
    }
    if (isMini) {
      this.state.data.CUSTODYCD = dataOTP.p_custodycd;
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
      this.state.data.CUSTODYCD = dataOTP.p_custodycd;
      this.state.data.newCUSTODYCD = dataOTP.p_custodycd;
      this.state.data.FULLNAME = dataOTP.fullname;
      this.state.data.IDCODE = dataOTP.idcode
      this.setState(this.state)
    }
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
  render() {
    console.log('thí.state.data:',this.state.data)
    let isMini = false;
    let hideBtnSubmitLater = this.props.OBJNAME != 'OTPCONFIRMCF' && this.props.OBJNAME != "CUSTOMERACTIVEOTP"
    if (this.props.isMini)
      isMini = this.props.isMini;
    return (
      <div>
        <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className={!isMini ? "container panel panel-success margintopNewUI" : ""}>
          <div className="add-info-account">

            {!isMini && <div className="title-content" >{this.props.strings.title}</div>}

            <div className="col-md-12" style={{ paddingTop: "11px" }}>


            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5 className="highlight"><b>{this.props.strings.idcode}</b></h5>
              </div>
              <div className="col-md-9">
                {isMini && <label className="form-control" type="text" id="txtIDCODE">{this.props.dataOTP.idcode}</label>}
                {!isMini && <input onChange={this.onChange.bind(this, "IDCODE")} value={this.state.data.IDCODE} disabled={isMini} className="form-control" type="text" placeholder={this.props.strings.idcode} id="txtIDCODE" />}

              </div>
            </div>
            {/* {(this.props.OBJNAME != 'CREATEACCOUNT' && this.props.OBJNAME != 'CUSTOMERACTIVEOTP') &&  */}
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5 className=""><b>{this.props.strings.custodycd}</b></h5>
              </div>
              <div className="col-md-9">
              <label className="form-control" type="text" id="txtCustodycd">{isMini ? this.props.dataOTP.p_custodycd : this.state.data.CUSTODYCD}</label>
                {/* <label className="form-control"  value={isMini ? this.props.dataOTP.p_custodycd : this.state.data.CUSTODYCD} disabled={isMini} className="form-control" type="text" placeholder={this.props.strings.custodycd} id="txtCustodycd" /> */}
              </div>
            </div>
            {/* } */}
            
            <div className="col-md-12 row">

              <div className="col-md-3">
                <h5 className=""><b>{this.props.strings.fullname}</b></h5>
              </div>
              <div className="col-md-9">
                <label className="form-control" type="text" id="txtFullname">{isMini ? this.props.dataOTP.fullname : this.state.data.FULLNAME}</label>
              </div>
            </div>

            <div className="col-md-12 row">

              <div className="col-md-3">
                <h5 className=""><b>{this.props.strings.type}</b></h5>
              </div>
              <div className="col-md-9">
                {!this.props.access && <DropdownFactory onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} ID="drdOTPTYPE" value="SEX" CDTYPE="CF" CDNAME="CFOTPTYPE" CDVAL={this.state.data.OTPTYPE} />}
                {this.props.access && <DropdownFactory disabled onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} ID="drdOTPTYPE" value="SEX" CDTYPE="CF" CDNAME="CFOTPTYPE" CDVAL={this.state.data.OTPTYPE} />}
              </div>
            </div>
            <div className="col-md-12 row">

              <div className="col-md-3">
                <h5 className="highlight"><b>{this.props.strings.otpcode}</b></h5>
              </div>
              <div className="col-md-9">
                <input maxLength='10' onChange={this.onChange.bind(this, "OTPCODE")} className="form-control" type="text" placeholder={this.props.strings.otpcode} id="txtOtpcode" />
              </div>
            </div>

            <div className="col-md-12 row">
              <div className="pull-right">
                <input onClick={this.submit.bind(this)} type="button" className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.confirmbtn} id="btnSubmit" />
                {hideBtnSubmitLater && <input onClick={this.submitlater.bind(this)} type="button" className="btn btn-info" style={{ marginRight: 15 }} value={this.props.strings.confirmlater} id="btnSubmit" />}
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

const stateToProps = state => ({
  lang: state.language.language,
  showModal: state.datLenh.showModalWarningInfoOpenAcc
});


const decorators = flow([
  connect(stateToProps),
  translate('CanBoXacNhanOTP2')
]);

module.exports = decorators(CanBoXacNhanOTP2);
