import React from 'react';
import DropdownFactory from 'app/utils/DropdownFactory'
import DateInput from 'app/utils/input/DateInput'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import Select from 'react-select';
import NumberFormat from 'react-number-format';
import RestfulUtils from 'app/utils/RestfulUtils'
import { showNotifi } from 'app/action/actionNotification.js';

class NhanCKCCQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: {
        general: true,
        authorize: true,
        fatca: false
      },
      showModalDetail: false,
      titleModal: '',
      AccountInfo: {},
      access: "add",
      STH1: { value: 0, validate: null, tooltip: "Không được để trống !!" },
      STH: { value: 0, validate: null, tooltip: "Không được để trống !!" },
      STH3: { value: 0, validate: null, tooltip: "Không được để trống !!" },
      datachange: {},
      CODEID: { value: '', label: '' },
      CUSTODYCD: { value: '', label: '' },
      datagroup: {
        p_busdate: this.props.tradingdate,
        p_custodycd: '',
        p_fullname: '',
        p_codeid: '',
        p_rcvtype: '',
        p_qtty: '',
        p_sqtty:'',
        p_price: '',
        p_desc: '',
        p_language: this.props.lang,
        pv_objname: this.props.datapage.OBJNAME,
      },
      checkFields: [
        { name: "p_busdate", id: "txtDate" },
        { name: "p_custodycd", id: "cbCUSTODYCD" },
        { name: "p_codeid", id: "cbCODEID" },
        { name: "p_qtty", id: "txtAmount" },
        { name: "p_sqtty", id: "txtAmountSip" },
        { name: "p_price", id: "txtPrice" },
      ],
    };
  }


  onValueChange(type, data) {
    if (type == 'p_price') {
      if (data.value == '') this.state.datagroup[type] = 0
      else this.state.datagroup[type] = data.value
    } else this.state.datagroup[type] = data.value
    this.setState(this.state)
  }
  onChange(type, event) {
    let data = {};
    if (event.target) {

      this.state.datagroup[type] = event.target.value;
    }
    else {
      this.state.datagroup[type] = event.value;
    }
    this.setState({ datagroup: this.state.datagroup })
  }
  getOptionsSYMBOL(input) {
    return RestfulUtils.post('/allcode/search_all_funds', { key: input })
      .then((res) => {

        return { options: res }
      })
  }
  onChangeSYMBOL(e) {

    var that = this
    if (e && e.value) {
      this.state.datagroup["p_codeid"] = e.value
      this.getNAV(e.value)
    }

    else this.state.datagroup["p_codeid"] = ''
    this.setState({
      CODEID: e,
      datagroup: this.state.datagroup
    })
  }
  async onChangeCUSTODYCD(e) {

    var self = this;
    if (e) {

      this.getInforAccount(e.label);
    }
    else {
      this.state.datagroup["p_custodycd"] = ''
      this.setState({ AccountInfo: {}, datagroup: this.state.datagroup });
    }
    this.setState({ CUSTODYCD: e });
  }
  getInforAccount(CUSTODYCD) {
    let self = this
    RestfulUtils.post('/account/get_generalinfor', { CUSTODYCD: CUSTODYCD, OBJNAME: this.props.datapage.OBJNAME  }).then((resData) => {

      if (resData.EC == 0) {
        this.state.datagroup["p_custodycd"] = resData.DT.CUSTODYCD
        this.state.datagroup["p_fullname"] = resData.DT.FULLNAME
        self.setState({ AccountInfo: resData.DT, datagroup: this.state.datagroup });
      } else {
        self.setState({ AccountInfo: {} });
      }
    });
  }
  onSetDefaultValue = (type, value) => {
    if (!this.state.datagroup[type])
      this.state.datagroup[type] = value
  }
  onChangeDRD(type, event) {
    let data = {};
    if (event.target) {

      this.state.datagroup[type] = event.target.value;
    }
    else {
      this.state.datagroup[type] = event.value;
    }
    this.setState({ datagroup: this.state.datagroup })
  }
  getOptions(input) {
    return RestfulUtils.post('/account/search_all', { key: input })
      .then((res) => {

        return { options: res }
      })
  }
  submitGroup = () => {
    let that = this
    var mssgerr = '';
    for (let index = 0; index < this.state.checkFields.length; index++) {
      const element = this.state.checkFields[index];
      mssgerr = this.checkValid(element.name, element.id);
      if (mssgerr !== '')
        break;
    }
    if (mssgerr == '') {
      var api = '/fund/sereceive_req';


      var { dispatch } = this.props;
      var datanotify = {
        type: "",
        header: "",
        content: ""

      }
     // console.log(this.state.datagroup)
     RestfulUtils.posttrans(api, this.state.datagroup)
        .then(async (res) => {

          if (res.EC == 0) {
            datanotify.type = "success";
            datanotify.content = this.props.strings.success;

            await setTimeout(dispatch(showNotifi(datanotify)), 3000);
            window.location.href = '/TRANSACTIONS'
          } else {
            datanotify.type = "error";
            datanotify.content = res.EM;
            dispatch(showNotifi(datanotify));
          }

        })
    }

  }
  checkValid(name, id) {
    let value = this.state.datagroup[name];

    let mssgerr = '';
    switch (name) {

      case "p_busdate":
        if (value == '') {
          mssgerr = this.props.strings.requiredbusdate;
        }
        break;
      case "p_custodycd":
        if (value == '') {
          mssgerr = this.props.strings.requiredcustodycd;
        }
        break;
      case "p_codeid":
        if (value == '') {
          mssgerr = this.props.strings.requiredcodeid;
        }
        break;
      case "p_qtty":
        if (value == '') {
          mssgerr = this.props.strings.requiredqtty;
        } else {
        //  if (value <= 0) mssgerr = this.props.strings.requiredcondtion1;
        }
        break;
      case "p_sqtty":
        if (value == '') {
          mssgerr = this.props.strings.requiredqttysip;
        } else {
         // if (value <= 0) mssgerr = this.props.strings.requiredcondtion1sip;
        }
        break;
      case "p_price":
        if (value == '') {
          mssgerr = this.props.strings.requiredprice;
        }
        else {
          if (value < 0) mssgerr = this.props.strings.requiredcondtion;
        }
        break;

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
 async getNAV(codeid) {

    let that = this;
    let data = {
      p_codeid: codeid,
    }
  await  RestfulUtils.post('/fund/getnav', { data }).then((resData) => {

             
      // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
      if (resData.EC == 0) {
        //  console.log(resData)
          that.state.datagroup["p_price"] = resData.DT.p_enav
          that.setState({
            datagroup: that.state.datagroup
            //pages: resData.DT.numOfPages,
          });
        
      }
    });
  }
  render() {

    return (
      <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

        <div className="add-info-account">

          <div className="title-content">{this.props.strings.title}</div>

          <div className="col-md-12" style={{ paddingTop: "11px" }}>

            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5 className="highlight"><b>{this.props.strings.date}</b></h5>
              </div>
              <div className="col-md-3 fixWidthDatePickerForOthers">
                <DateInput onChange={this.onValueChange.bind(this)} value={this.state.datagroup.p_busdate} type="p_busdate" id="txtDate" />
              </div>
            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5 className="highlight"><b>{this.props.strings.custodycd}</b></h5>
              </div>
              <div className="col-md-3 customSelect">

                <Select.Async
                  name="form-field-name"

                  placeholder={this.props.strings.custodycd}
                  loadOptions={this.getOptions.bind(this)}
                  value={this.state.CUSTODYCD}
                  onChange={this.onChangeCUSTODYCD.bind(this)}
                  id="cbCUSTODYCD"
                />
              </div>
            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5><b>{this.props.strings.fullname}</b></h5>
              </div>
              <div className="col-md-9">
                <label className="form-control" id="lblFullname">{this.state.AccountInfo.FULLNAME}</label>
              </div>
            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5 className="highlight"><b>{this.props.strings.vfmcode}</b></h5>
              </div>
              <div className="col-md-3 customSelect">
                <Select.Async
                  name="form-field-name"
                  placeholder={this.props.strings.vfmcode}
                  loadOptions={this.getOptionsSYMBOL.bind(this)}
                  value={this.state.CODEID}
                  onChange={this.onChangeSYMBOL.bind(this)}
                  id="cbCODEID"
                />
              </div>
            </div>

            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5><b>{this.props.strings.transfertype}</b></h5>
              </div>
              <div className="col-md-9 ">
                <DropdownFactory CDVAL={this.state.datagroup.p_rcvtype} onSetDefaultValue={this.onSetDefaultValue} value="p_rcvtype" CDTYPE="SE" CDNAME="RCVTYPE" onChange={this.onChangeDRD.bind(this)} ID="drdTransactiontype" />

              </div>
            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5 className="highlight"><b>{this.props.strings.amount}</b></h5>
              </div>
              <div className="col-md-3">
                <NumberFormat maxLength={21} className="form-control" id="txtAmount" onValueChange={this.onValueChange.bind(this, 'p_qtty')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.amount} value={this.state.datagroup["p_qtty"]} decimalScale={2} />

              </div>
            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5 className="highlight"><b>{this.props.strings.amountsip}</b></h5>
              </div>
              <div className="col-md-3">
                <NumberFormat maxLength={21} className="form-control" id="txtAmountSip" onValueChange={this.onValueChange.bind(this, 'p_sqtty')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.amountsip} value={this.state.datagroup["p_sqtty"]} decimalScale={2} />

              </div>
            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5 className="highlight"><b>{this.props.strings.price}</b></h5>
              </div>
              <div className="col-md-3">
                <NumberFormat maxLength={21} className="form-control" id="txtPrice" onValueChange={this.onValueChange.bind(this, 'p_price')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.price} value={this.state.datagroup["p_price"] } decimalScale={2} allowNegative={false} />
              </div>
            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5><b>{this.props.strings.desc}</b></h5>
              </div>
              <div className="col-md-9">
                <input maxLength={1000} className="form-control" id="txtDesc" type="text" placeholder={this.props.strings.desc} value={this.state.datagroup["p_desc"]} onChange={this.onChange.bind(this, "p_desc")} />
              </div>
            </div>
            <div className="col-md-12 row">
              <div className="pull-right">
                <input type="button" className="btn btn-primary" onClick={this.submitGroup.bind(this)} style={{ marginLeft: 0, marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
              </div>
            </div>
          </div>




        </div>
      </div>


    )
  }
}
NhanCKCCQ.defaultProps = {

  strings: {
    title: 'Phong tỏa tài khoản'

  },


};
const stateToProps = state => ({
  lang: state.language.language,
  tradingdate: state.systemdate.tradingdate

});


const decorators = flow([
  connect(stateToProps),
  translate('NhanCKCCQ')
]);

module.exports = decorators(NhanCKCCQ);
