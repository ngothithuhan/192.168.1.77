import React from 'react';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableLenhChuaNhapOTP from './components/TableLenhChuaNhapOTP'
//import ModalDetail from './components/ModalDetail'
import { showModalConfirm, closeModalConfirm, showModalViewInfo } from 'actionDatLenh';
import PopupConfirmOrder from 'app/components/VSD/DatLenh/components/PopupConfirmOrder'
import PopupViewInfo from 'app/components/VSD/DatLenh/components/PopupViewInfo'
import RestfulUtils from '../../../utils/RestfulUtils'
import { showNotifi } from 'app/action/actionNotification.js';

class QLDSLenhChuaNhapOTP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkFields: [
        { name: "OTP", id: "txtConfirmOTP" },
      ],
      dataViewInfo: {
        dataGet: {},
        AMOUNT: '',
        AccountInfo: { CUSTODYCD: '', FULLNAME: '' }
      },
      dataOTP: {
        action: 'C',
        SRTYPE: '',
        SRTYPE_DESC: '',
        SRTYPE_DESC_EN: '',
        CUSTODYCD: { value: '' },
        CODEID: { value: '', label: '' },
        CODEIDHOANDOI: { label: '' },
        AMOUNT: { value: '' },
        QTTY: { value: '' },
        FULLNAME: ''
      },
      data: {},
    };
  }
  onChange(type, event) {
    if (event.target) {
      if (event.target.type == "checkbox")
        this.state.data[type] = event.target.checked;
      else {

        this.state.data[type] = event.target.value;
      }
    }
    else {

      this.state.data[type] = event.value;
    }

    this.setState({ data: this.state.data })

  }

  showModalDetail(access, data, ID) {
    var { dispatch } = this.props;
    this.setState({
      data: data,

      dataOTP: {
        action: 'C',
        SRTYPE: data.EXECTYPE,
        SRTYPE_DESC: data.EXECTYPE_DESC,
        SRTYPE_DESC_EN: data.EXECTYPE_DESC_EN,
        CUSTODYCD: { value: data.CUSTODYCD },
        CODEID: { label: data.SYMBOL },
        CODEIDHOANDOI: { label: data.SWSYMBOL },
        AMOUNT: { value: data.ORDERAMT },
        QTTY: { value: data.ORDERQTTY },
        FULLNAME: data.FULLNAME
      }
    })

    RestfulUtils.post('/order/gettradingdate_bycodeid', { CODEID: data.CODEID })
      .then(resData => {
        if (resData.EC == 0)
          this.setState({ TRDATE: resData.DT.p_tradingdate })
      })
    dispatch(showModalConfirm());
  }
  checkValid(name, id) {
    let value = this.state.data[name];

    let mssgerr = '';
    switch (name) {
      case "OTP":
        if (value == '' || !value)
          mssgerr = this.props.strings.requiredOTP;
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
  async handleSubmit() {
    let { dispatch } = this.props;
    var datanotify = {
      type: "",
      header: "",
      content: ""

    }
    var mssgerr = '';
    for (let index = 0; index < this.state.checkFields.length; index++) {
      const element = this.state.checkFields[index];
      mssgerr = this.checkValid(element.name, element.id);
      if (mssgerr !== '')
        break;
    }

    if (mssgerr == '')
      // delete de tranh bi loi phan quyen
      delete this.state.data.TLID;
      await RestfulUtils.post('/order/confirmorder', { ...this.state.data, language: this.props.language, OBJNAME: this.props.datapage ? this.props.datapage.OBJNAME : '', OTP: this.state.data.OTP, ACTION: 'ADD' })
        .then((res) => {
          if (res.EC == 0) {

            this.state.data.OTP = '';
            this.setState(this.state)
            datanotify.type = "success";
            datanotify.content = this.props.strings.confirmotpsuccess;
            dispatch(showNotifi(datanotify));
            RestfulUtils.post('/order/getfacctnobysymbol', { symbol: this.state.data.CODEID, custodycd: this.state.data.CUSTODYCD, srtype: this.state.data.SRTYPE, language: this.props.language }).then(async (resData) => {
              if (resData.EC == 0) {
                await this.setState({
                  ...this.state,
                  dataViewInfo: {
                    dataGet: resData.DT[0],
                    AMOUNT: this.state.data.ORDERAMT,
                    AccountInfo: { CUSTODYCD: this.state.data.CUSTODYCD, FULLNAME: this.state.data.FULLNAME }
                  }
                })
                dispatch(closeModalConfirm());
                if (this.state.data.EXECTYPE == 'NS') dispatch(showModalViewInfo());
              }
            });
            //console.log('data', this.state.dataViewInfo)

          } else {
            datanotify.type = "error";
            datanotify.content = res.EM;
            dispatch(showNotifi(datanotify));
          }
        })
  }
  handleCancel() {
    let { dispatch } = this.props;
    var datanotify = {
      type: "success",
      header: "",
      content: ""
    }


    this.state.data.OTP = '';
    this.setState(this.state)
    delete this.state.data.TLID;
    RestfulUtils.post('/order/confirmorder', { ...this.state.data, language: this.props.language, OBJNAME: this.props.datapage ? this.props.datapage.OBJNAME : '', OTP: this.state.data.OTP, ACTION: 'DELETE' })
      .then((res) => {
        if (res.EC == 0) {
          dispatch(closeModalConfirm());
          datanotify.type = "success";
          datanotify.content = this.props.strings.cancelsuccess;
          dispatch(showNotifi(datanotify));
        } else {
          datanotify.type = "error";
          datanotify.content = res.EM;
          dispatch(showNotifi(datanotify));
        }
      })
  }
  componentWillMount() {

  }

  render() {

    let { datapage } = this.props
    return (
      <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

        <div className="title-content">{this.props.strings.title}</div>
        <div className="panel-body" >
          <TableLenhChuaNhapOTP datapage={datapage}
            showModalDetail={this.showModalDetail.bind(this)} />
        </div>
        <PopupConfirmOrder isSIP={this.state.data.SRTYPE=='SP' ? true : false} OBJNAME ='OTPCONFIRMOD' TRDATE={this.state.TRDATE} ISCANCEL={true} ISOTP_CONFIRM='Y' FULLNAME={this.state.dataOTP.FULLNAME} title={this.props.strings.modaledit} data={this.state.dataOTP} handleSubmit={this.handleSubmit.bind(this)} handleCancel={this.handleCancel.bind(this)} onChange={this.onChange.bind(this)} />
        <PopupViewInfo data={this.state.dataViewInfo} isSIP={this.state.data.SRTYPE=='SP' ? true : false}  />

      </div>
    )
  }
}
const stateToProps = state => ({
  veryfiCaptcha: state.veryfiCaptcha,
  notification: state.notification,
  language: state.language.language
});


const decorators = flow([
  connect(stateToProps),
  translate('QLDSLenhChuaNhapOTP')
]);

module.exports = decorators(QLDSLenhChuaNhapOTP);
