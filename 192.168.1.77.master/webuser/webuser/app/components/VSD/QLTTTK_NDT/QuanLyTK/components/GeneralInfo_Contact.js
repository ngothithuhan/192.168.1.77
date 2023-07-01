import React from 'react';
import { connect } from 'react-redux';
import DropdownFactory from '../../../../../utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import moment from 'moment';
class GeneralInfo_Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkFields: [
        { name: "IDDATE", id: "txtContactIDdate" },
      ],
      generalInformation: {
        AUTOID: "",
        CUSTID: "",
        FULLNAME: "",
        IDCODE: "",
        IDDATE: "",
        IDPLACE: "",
        ADDRESS: "",
        POSITION: "",
        SEX: "",
        BIRTHDATE: "",
        RELATIONSHIP: "",
        REGADDRESS: "",
        COUNTRY: "",
        EMAIL: "",
        MOBILE: "",
      }
    }
  }
  // checkValid(name, id) {
  //   let value = this.state.generalInformation[name];
  //   let mssgerr = '';
  //   switch (name) {
  //     case "IDDATE":
  //       if (value == '')
  //         mssgerr = this.props.strings.requiredIddate;
  //       if(moment(value,"DD/MM/YYYY")<=moment(this.state.generalInformation.BIRTHDATE,"DD/MM/YYYY"))
  //         mssgerr = this.props.strings.invalidIddate;
  //       break;
  //     default:
  //       break;
  //   }
  // }
  componentDidMount() {
    //kiem tra neu ko uy quyen tu buoc 1 thi bo wa


    if (!this.props.GeneralInfoMain.ISCONTACT) {
      var isForwardStep = (this.props.currentStep - this.props.previousStep) > 0;
      if (isForwardStep) this.props.onSubmit(this.state.generalInformation, true);
      else this.previousPage();
    }
    let oldInfor = this.props.GeneralInfoAuth ? this.props.GeneralInfoAuth : (this.props.CfmastInfo ? this.props.CfmastInfo.DT.dataAuth : null)
    if (oldInfor) {
      // if (oldInfor.AUTH_ALL)
      //     window.$("#cbIsAuthAll").prop("checked", true)
      // if (oldInfor.AUTH_ORDER)
      //     window.$("#cbIsAuthOrder").prop("checked", true)
      // if (oldInfor.AUTH_CASH)
      //     window.$("#cbIsAuthCash").prop("checked", true)
      // if (oldInfor.AUTH_INFOR)
      //     window.$("#cbIsAuthInfor").prop("checked", true)

    }
  }
  onSetDefaultValue = (type, value) => {
    if (!this.state.generalInformation[type])
      this.state.generalInformation[type] = value
  }
  onSubmit = () => {
    // var mssgerr = '';
    // for (let index = 0; index < this.state.checkFields.length; index++) {
    //   const element = this.state.checkFields[index];
    //   mssgerr = this.checkValid(element.name, element.id);
    //   if (mssgerr !== '')
    //     break;
    // }
    // if (mssgerr == '')
    this.props.onSubmit(this.state.generalInformation, false)
  }
  onChange(type, event) {
    if (event.target) {
      if (event.target.type == "checkbox")
        this.state.generalInformation[type] = event.target.checked;
      else
        this.state.generalInformation[type] = event.target.value;
    }
    else {
      this.state.generalInformation[type] = event.value;
    }
    this.setState({ generalInformation: this.state.generalInformation })

  }
  previousPage = () => {
    this.props.previousPage(this.state.generalInformation);
  }
  componentWillMount() {
    //gan lai thong tin cu
    let oldInfor = this.props.GeneralInfoContact ? this.props.GeneralInfoContact : (this.props.CfmastInfo ? this.props.CfmastInfo.DT.dataContact : null)
    if (oldInfor)
      this.setState({ ...this.state, generalInformation: oldInfor })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.access !== "add") {
      if (nextProps.CfmastInfo) {
        let oldInfor = nextProps.CfmastInfo.DT.dataContact;
        if (oldInfor) {
          this.setState({ ...this.state, generalInformation: oldInfor })
        }
      }
    }
  }
  validBirthdate(current) {
    const currentDate = moment().subtract(1, 'day');
    return current < currentDate;
  }
  render() {

    return (
      <div>
        <div className={this.props.access !== "view" ? "col-md-12" : "col-md-12 disable"} style={{ paddingTop: "11px" }}>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5><b>{this.props.strings.fullname}</b></h5>
            </div>
            <div className="col-md-9">
              <input maxLength='200' value={this.state.generalInformation.FULLNAME} onChange={this.onChange.bind(this, "FULLNAME")} id="txtContactFullname" className="form-control" type="text" placeholder={this.props.strings.fullname} />
            </div>
          </div>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5><b>{this.props.strings.position}</b></h5>
            </div>
            <div className="col-md-3">

              <input maxLength='250' value={this.state.generalInformation.POSITION} onChange={this.onChange.bind(this, "POSITION")} id="txtContactPosition" className="form-control" type="text" placeholder={this.props.strings.position} />
            </div>
            <div className="col-md-3">
              <h5><b>{this.props.strings.sex}</b></h5>
            </div>
            <div className="col-md-3">
              <DropdownFactory onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} ID="drdContactSex" value="SEX" CDTYPE="CF" CDNAME="SEX" CDVAL={this.state.generalInformation.SEX} />
            </div>
          </div>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5><b>{this.props.strings.country}</b></h5>
            </div>
            <div className="col-md-3">
              <DropdownFactory onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} ID="drdContactCountry" value="COUNTRY" CDTYPE="CF" CDNAME="COUNTRY" CDVAL={this.state.generalInformation.COUNTRY} />
            </div>
            <div className="col-md-3">
              <h5><b>{this.props.strings.relationship}</b></h5>
            </div>
            <div className="col-md-3">
              <input maxLength='250' value={this.state.generalInformation.RELATIONSHIP} onChange={this.onChange.bind(this, "RELATIONSHIP")} id="txtContactRelationship" className="form-control" type="text" placeholder={this.props.strings.relationship} />
            </div>

          </div>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5><b>{this.props.strings.birthdate}</b></h5>
            </div>
            <div className="col-md-3 fixWidthDatePickerForOthers">
              <DateInput valid={this.validBirthdate} value={this.state.generalInformation.BIRTHDATE} onChange={this.onChange.bind(this)} value={this.state.generalInformation.BIRTHDATE} type="BIRTHDATE" id="txtContactBirthdate" />
            </div>
            <div className="col-md-3">
              <h5><b>{this.props.strings.idcode}</b></h5>
            </div>
            <div className="col-md-3">
              <input maxLength='20' value={this.state.generalInformation.IDCODE} onChange={this.onChange.bind(this, "IDCODE")} id="txtContactIdcode" className="form-control" type="text" placeholder={this.props.strings.idcode} />
            </div>

          </div>

          <div className="col-md-12 row">

            <div className="col-md-3">
              <h5><b>{this.props.strings.iddate}</b></h5>
            </div>
            <div className="col-md-3 fixWidthDatePickerForOthers">
              <DateInput value={this.state.generalInformation.IDDATE} onChange={this.onChange.bind(this)} value={this.state.generalInformation.IDDATE} type="IDDATE" id="txtContactIDdate" />
            </div>
            <div className="col-md-3">
              <h5><b>{this.props.strings.idplace}</b></h5>
            </div>
            <div className="col-md-3">
              <input value={this.state.generalInformation.IDPLACE} onChange={this.onChange.bind(this, "IDPLACE")} id="txtContactIdplace" className="form-control" type="text" placeholder={this.props.strings.idplace} />
            </div>
          </div>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5><b>{this.props.strings.address}</b></h5>
            </div>
            <div className="col-md-9">
              <input maxLength='500' value={this.state.generalInformation.ADDRESS} onChange={this.onChange.bind(this, "ADDRESS")} id="txtContactAddress" className="form-control" type="text" placeholder={this.props.strings.address} />
            </div>
          </div>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5><b>{this.props.strings.regaddress}</b></h5>
            </div>
            <div className="col-md-9">
              <input maxLength='500' value={this.state.generalInformation.REGADDRESS} onChange={this.onChange.bind(this, "REGADDRESS")} id="txtContactRegAddress" className="form-control" type="text" placeholder={this.props.strings.regaddress} />
            </div>
          </div>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5><b>{this.props.strings.email}</b></h5>
            </div>
            <div className="col-md-3">
              <input maxLength='250' value={this.state.generalInformation.EMAIL} onChange={this.onChange.bind(this, "EMAIL")} id="txtContactEmail" className="form-control" type="text" placeholder={this.props.strings.email} />
            </div>
            <div className="col-md-3">
              <h5><b>{this.props.strings.phone}</b></h5>
            </div>
            <div className="col-md-3">
              {/* <NumberFormat value={this.state.generalInformation.MOBILE} className="form-control" placeholder={this.props.strings.phone} onValueChange={this.onChange.bind(this, 'MOBILE')} thousandSeparator={false} prefix={''} id="txtContactMobile" /> */}
              <input maxLength='100' value={this.state.generalInformation.MOBILE} onChange={this.onChange.bind(this, "MOBILE")} id="txtContactMobile" className="form-control" type="text" placeholder={this.props.strings.phone} />
            </div>
          </div>
        </div>
        <div className="col-md-12 row">
          <div className="pull-right">
            <input id="btnContactPrev" type="button" onClick={this.previousPage} className="btn btn-primary" style={{ marginLeft: 0, marginRight: 5 }} value={this.props.strings.back} />
            <input id="btnContactNext" type="button" onClick={this.onSubmit} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.next} />
          </div>
        </div>
      </div>
    )
  }
}
const stateToProps = state => ({

});


const decorators = flow([
  connect(stateToProps),
  translate('GeneralInfo_Contact')
]);

module.exports = decorators(GeneralInfo_Contact);
