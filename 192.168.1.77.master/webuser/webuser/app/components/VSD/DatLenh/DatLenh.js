import React from 'react';
import { connect } from 'react-redux';
import {
  showModalCMND, showModalThongTinUyQuyen,
  closeModalThongTinUyQuyen, showModalChiTiet,
  showModalConfirm, closeModalConfirm, showModalViewInfo,
  saveDataAccountPlaceOrder
} from 'actionDatLenh';
import { showNotifi } from 'app/action/actionNotification.js';
import DropdownFactory from '../../../utils/DropdownFactory'
import { toast } from 'react-toastify'
import PopupViewInfo from './components/PopupViewInfo'
import PopupConfirmOrder from './components/PopupConfirmOrder'
import ModalCreateUploadOriginalOrder from './components/ModalCreateUploadOriginalOrder'
import Select from 'react-select'
import 'react-select/dist/react-select.css';
import RestfulUtils from 'app/utils/RestfulUtils';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import NumberFormat from 'react-number-format';
import ModalDialog from 'app/utils/Dialog/ModalDialog'
import ModalDialogCheckOrder from 'app/utils/Dialog/ModalDialogCheckOrder'
import NumberInput from 'app/utils/input/NumberInput'
import { SRTYPE_SW, SRTYPE_NS, SRTYPE_NR, COLORGRAY, COLORNS_NEW, COLORNR_NEW, COLORSW_NEW, IMGMAXW, IMGMAXH, MAXSIZE_PDF } from '../../../Helpers';
import CMND from './components/CMND'
import ThongTinQuy from 'ThongTinQuy'
import UyQuyen from 'UyQuyen'
import ChiTiet from 'ChiTiet'
import SoDuHienCo from './components/SoDuHienCo.js'
import SoLenh from './components/SoLenh.js'
import ModalTimKiemFullname from 'app/utils/Dialog/ModalTimKiemFullname.js';
import { withRouter } from 'react-router-dom';

import 'app/utils/customize/CustomizeReactTable.scss';
import './DatLenh.scss';
import _ from 'lodash';
const Compress = require('compress.js');
const publicIp = require("react-public-ip");

function setDefaultSALETYPE(value) {
  $("#drdSALETYPE").val(value);
}
function changeclassmargin() {
  if (document.getElementsByClassName("margintopNewUI")) {
    var element = document.getElementsByClassName("container panel panel-default margintopNewUI")
    alert(element.length)
    element[0].classList.remove("margintopNewUI");
    element[0].classList.add("margintopNewUI2");
  }
}
class DatLenh extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowViewInfo: false,
      my_symbol: '',
      my_time: '', // laays thoi gian cho viewpopup
      dataViewInfo: {},
      dataGet: {},

      dataInfoFund: {}, //data khi thay đổi thông tin quỹ, lấy theo luồng component ThongTinQuy
      checkFields: [
        { name: "CUSTODYCD", id: "drdCUSTODYCD", isObj: true },
        { name: "SRTYPE", id: "drdSRTYPE", isObj: false },
        { name: "CODEID", id: "drdCODEID", isObj: true },
        { name: "CODEIDHOANDOI", id: "drdCODEIDHOANDOI", isObj: true },
        { name: "SALETYPE", id: "drdSALETYPE", isObj: true },
        { name: "SALEID", id: "drdSALEID", isObj: true },
        { name: "AMOUNT", id: "txtAMOUNT", isObj: true },
        { name: "QTTY", id: "txtQTTY", isObj: true },
        { name: "SIGN_IMG", id: "btnOrderImg", isObj: false }
      ],
      ISEDIT: false,
      showModalDetail: false,
      showModalDetailCheckOrder: false,
      showModalSearch: false,
      AccountDetail: [],
      ListSALETYPE: [],
      ACTION: 'add',
      datarow: [],
      TLID: '',
      AMT: '',
      image: { value: null, validate: "success" },
      SRTYPE: SRTYPE_NS,
      SALETYPE: '',
      SALEID: '',
      CACHESALEACCTNO: '',
      haveError: false,
      CUSTODYCD: '',
      CODEID: '',
      TRADINGID: '',
      CODEIDHOANDOI: '',
      WID: '',
      data: [],
      datahoandoi: [],
      ORDERID: '',
      ORGORDERID: '',
      acclist: [],
      listTRADINGID: [],
      FEEID: '000001',
      SYMBOL: { value: null, validate: null, tooltip: "Không được để trống !!" },
      SYMBOLHoanDoi: { value: null, validate: null, tooltip: "Không được để trống !!" },
      SanPham: { value: null, validate: "success", tooltip: "Không được để trống !!" },
      QTTY: { value: 0, validate: null, tooltip: "Không được để trống !!" },
      AMOUNT: { value: 0, validate: null, tooltip: "Không được để trống !!" },
      SEDTLID: '',
      AccountInfo: {},
      CancelData: {},
      TenKH: '',
      SoDKSH: '',
      NgayCap: '',
      TenQuyMua: { value: null, validate: null, tooltip: "Không được để trống !!" },
      ThoiGianDongSoLenhMua: { value: null, validate: null, tooltip: "Không được để trống !!" },
      NAVPhienTruocMua: { value: null, validate: null, tooltip: "Không được để trống !!" },
      TenQuyBan: { value: null, validate: null, tooltip: "Không được để trống !!" },
      ThoiGianDongSoLenhBan: { value: null, validate: null, tooltip: "Không được để trống !!" },
      NAVPhienTruocBan: { value: null, validate: null, tooltip: "Không được để trống !!" },
      action: 'C',
      err_msg: { color: "", text: "" },
      sellAvlBalance: '',
      OTP: '',
      ISOTP_CONFIRM: 'Y',
      SALENAME: '',
      isFirstLoad: '',
      listSaleType: [],
      SIGN_IMG: null,
      SIGN_IMG_DESC: "",
      showModalCreateUploadOriginalOrder: false,
      err_msg_upload: {},
      urlPreviewPDF: "",
      isSellAll: false,
      ipv4: ''
    }
  }
  async componentDidMount() {
    const ipv4 = await publicIp.v4();

    this.setState({ isFirstLoad: 'Y', ipv4 });
    let element = document.getElementById('main_body');
    const { user } = this.props.auth
    let isCustom = user && user.ISCUSTOMER && user.ISCUSTOMER === 'Y' ? true : false;
    if (element && isCustom === true) {
      element.classList.add('place-order-customize-body');
    }
  }

  componentWillUnmount() {
    let element = document.getElementById('main_body');
    if (element) {
      element.classList.remove('place-order-customize-body');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //lấy thông tin quỹ
    if (prevState.CODEID !== this.state.CODEID) {
      this.getSessionInfoNew(this.state.CODEID.value);
    }
  }


  getSessionInfoNew(CODEID) {
    RestfulUtils.post('/order/getSessionInfo', { CODEID: CODEID, TYPE: 'CLSORD' }).then(resData => {
      if (resData.EC == 0) {
        this.setState({
          dataInfoFund: resData.DT && resData.DT[0] ? resData.DT[0] : {}
        })
      }
    })

  }


  getOptions(input) {
    //search_all_show_fullname
    //search_all

    return RestfulUtils.post('/account/search_all', { key: input, detail: "DETAIL" })
      .then((res) => {
        //console.log("======this.custodycd 0:",this.state.CUSTODYCD)
        const { user } = this.props.auth
        let isCustom = user && user.ISCUSTOMER == 'Y';
        var data = [];
        if (isCustom) {
          var defaultCustodyCd = this.props.auth.user.UID;
          // data = [{ label: defaultCustodyCd, value: defaultCustodyCd }];
          data = res;
          this.getOptionsSaleidByCodeid(defaultCustodyCd);
          this.getInforAccount(defaultCustodyCd);
        } else {
          data = res;
        }


        if (data && data.length > 0) {
          let cusData = {};
          if (this.props.dataPlaceOrder && !_.isEmpty(this.props.dataPlaceOrder.account)) {
            cusData = this.props.dataPlaceOrder.account
          } else {
            cusData = data[0];
          }

          //biến cusData lưu theo redux (tài khoản gần nhất mà người dùng chọn)
          this.setState({ ...this.state, CUSTODYCD: cusData }, () => {
            this.getOptionsSaleidByCodeid(cusData.value);
          })


          if (input != data[0].value && input != '') {
            this.setState({ isFirstLoad: 'N' })
          }
          if (this.state.isFirstLoad == 'Y') {
            this.getInforAccount(cusData.value);
          }
        }
        this.setState({ AccountDetail: res })
        return { options: data };
      })
  }

  getOptionsSYMBOL(input) {
    return RestfulUtils.post('/allcode/search_all_funds', { key: input })
      .then((res) => {
        let i = 0;
        let data = []
        for (i = 0; i < res.length; i++) {
          if (res[i].label != 'MBGF') {
            data.push(res[i]);
          }
        }
        return { options: data }
      })
  }

  getOptionsSALEID(input) {
    let CACHESALEACCTNO = this.state.CACHESALEACCTNO
    //console.log("getOptionsSALEID======>>>>", input)
    return RestfulUtils.post('/allcode/search_all_salemember', { key: input })
      .then((res) => {
        //console.log("getOptionsSALEID=1====", res)
        let data = []
        res.map(function (item) {
          //console.log("getOptionsSALEID=2====", item, CACHESALEACCTNO)
          if (item.value != CACHESALEACCTNO) {
            data.push(item)
          }
          return null
        })
        //console.log("getOptionsSALEID=N====", data)
        return { options: data }
      })
  }
  getListTRADINGID(CODEID) {
    let self = this;
    RestfulUtils.post('/fund/get_tradingid', {
      CODEID: CODEID, language: this.props.language, OBJNAME: this.props.datapage.OBJNAME
    })
      .then(res => {
        self.setState({ listTRADINGID: res.DT })
      })
  }
  getOptionsSYMBOLHOANDOI(CODEID) {
    let self = this;
    let data = [];
    self.setState({ optionSYMBOLHOANDOI: [] })
    if (CODEID.value) {
      RestfulUtils.post('/allcode/get_swsymbol', { CODEID: CODEID.value, SYMBOL: CODEID.label })
        .then(res => {
          let i = 0;

          for (i = 0; i < res.length; i++) {
            if (res[i].label != 'MBGF') {
              data.push(res[i]);
            }
          }

          self.setState({ optionSYMBOLHOANDOI: data })
        })
    }
  }
  getSoDu(CUSTODYCD, CODEID) {
    let self = this;
    RestfulUtils.post('/fund/get_sodu_datlenh', {
      CUSTODYCD: CUSTODYCD, CODEID: CODEID, SRTYPE: 'NN', language: this.props.language, OBJNAME: this.props.datapage.OBJNAME
    })
      .then(res => {
        if (res.EC == 0 && res.DT.length > 0) {
          self.setState({ ...self.state, AMT: res.DT[0].AMOUNT })
        }
        else {
          self.setState({ ...self.state, AMT: 0 })
        }
      })
  }
  onChangeOTP(type, event) {
    if (event.target) {
      if (event.target.type == "checkbox")
        this.state[type] = event.target.checked;
      else {
        this.state[type] = event.target.value;
      }
    }
    else {
      this.state[type] = event.value;
    }
    this.setState(this.state)
  }

  handleChange(state, e, type) {
    if (type === "date") {
      if (e == null) {
        this.setState({ ...this.state, ["" + state]: { ...this.state["" + state], value: e, validate: "warning", tooltip: 'hãy chọn thời gian' } });
      } else {
        this.setState({ ...this.state, ["" + state]: { ...this.state["" + state], value: e, validate: "success", tooltip: '' } });
      }
    } else {
      if (state == "AMOUNT" || state == "QTTY")
        this.state[state].value = parseInt(e.target.value).toLocaleString()
      else
        this.state[state].value = e.target.value;

      if (e.target.value == null) {
        this.state[state].validate = "warning",
          this.state[state].tooltip = "Trường này không được để trống";
      }
      else {
        this.state[state].validate = "success",
          this.state[state].tooltip = "";
      }
      this.setState({ state: this.state })
    }
  }

  async onChangeCUSTODYCD(e) {
    var self = this;
    if (e) {
      //lưu data redux
      this.props.dispatch(saveDataAccountPlaceOrder(e))
      this.setState({ ...this.state, isFirstLoad: 'N', CUSTODYCD: e }, () => {
        this.getInforAccount(e.value);
        this.getSoDu(e.value, this.state.CODEID.value)
        this.getDataSymbol(e.value, this.state.CODEID.value)
        this.getOptionsSaleidByCodeid(e.value);
      });
    }
    else {
      this.props.dispatch(saveDataAccountPlaceOrder({}))
      this.setState({ ...this.state, CUSTODYCD: { label: '', value: '' }, AccountInfo: {} }, () => {
        this.getSoDu('', '')
        this.getDataSymbol('', '')
      });
    }

  }
  getListOptionSymbol(SRTYPE, CUSTODYCD) {
    if (CUSTODYCD && CUSTODYCD.value && CUSTODYCD.CUSTID) {
      if (SRTYPE == SRTYPE_NR || SRTYPE == SRTYPE_SW) {
        {
          return RestfulUtils.post('/balance/getFund', { CUSTODYCD: CUSTODYCD.value })
            .then((res) => { return res })
        }
      }
      else {
        {
          return RestfulUtils.post('/account/getRegistedFunds', { CUSTID: CUSTODYCD.CUSTID, DISPLAY: "SYMBOL" })
            .then((res) => { return res })
        }
      }
    }
    else {
      {
        return new Promise((resolve, reject) => {
          resolve([])
        })
      }
    }
  }
  set_data_feettypes(CODEID) {
    RestfulUtils.post('/allcode/getlist_feetypes', { CODEID: CODEID })
      .then((res) => {
        this.setState({
          data: res.data
        })

      })
  }

  async getDataSymbol(CUSTODYCD, CODEID) {
    let v_objname = this.props.datapage ? this.props.datapage.OBJNAME : '';
    var obj = {
      CUSTODYCD: CUSTODYCD,
      CODEID: CODEID,
      language: this.props.language,
      OBJNAME: v_objname
    }
    let { SRTYPE } = this.state;
    this.setState({ ...this.state, sellAvlBalance: '0' });
    let that = this;
    if (obj.CUSTODYCD && obj.CODEID && (SRTYPE === SRTYPE_NR || SRTYPE === SRTYPE_SW)) {
      await RestfulUtils.post('/balance/getfundbalance', obj)
        .then(resData => {
          if (resData.EC === 0) {
            if (that.state.isSellAll) {
              var qtty = resData.DT.data && resData.DT.data.length > 0 && resData.DT.data[0].NOBLOCKAVLQTTY ? parseFloat(resData.DT.data[0].NOBLOCKAVLQTTY) : 0;
            } else {
              qtty = 0;
            }
            that.setState({
              ...that.state,
              sellAvlBalance: resData.DT.data && resData.DT.data.length > 0 ? resData.DT.data[0].NOBLOCKAVLQTTY : 0,
              QTTY: { value: qtty, validate: null, tooltip: "Không được để trống !!", formattedValue: qtty }
            })
          }
        })
    }
  }
  getTradingdateByCodeID(CODEID) {
    RestfulUtils.post('/order/gettradingdate_bycodeid', { CODEID: CODEID })
      .then(resData => {
        if (resData.EC == 0)
          this.setState({ ...this.state, TRDATE: resData.DT.p_tradingdate })
      })
  }
  onChangeSYMBOL(e) {
    if (e && e.value) {
      if (this.state.SRTYPE == SRTYPE_SW) {
        this.setState({
          CODEIDHOANDOI: { value: '', label: '' }
        })
        this.getOptionsSYMBOLHOANDOI(e);
      }
      if (this.state.CUSTODYCD) {
        if (this.state.CUSTODYCD.value) {

          this.getDataSymbol(this.state.CUSTODYCD.value, e.value)
          this.getSoDu(this.state.CUSTODYCD.value, e.value)
        }
      }
      this.getTradingdateByCodeID(e.value)
      this.setState({
        CODEID: e,
        my_symbol: e.value,
        TRADINGID: { value: '', label: '' }
      })
    }
    else
      this.setState({
        CODEID: '',
        my_symbol: ''
      })
  }
  getOptionsSaleidByCodeid(custodycd) {
    let data = {
      OBJNAME: this.props.datapage.OBJNAME,
      p_custodycd: custodycd
    }
    return RestfulUtils.post('/fund/getlistsaleid', data)
      .then((res) => {
        this.setState({
          SALETYPE: '',
          listSaleType: res.DT.data
        })
      })
  }
  onChangeSALEID(e) {
    if (e && e.value) {
      this.setState({
        SALEID: e,
      })
    }
    else
      this.setState({
        SALEID: '',
      })
  }
  onChangeSaleidByCustodycd(e) {
    if (e && e.value) {
      this.setState({
        SALETYPE: e,
      })
    }
    else
      this.setState({
        SALETYPE: '',
      })
  }
  onChangeTRADINGID(e) {
    var that = this;
    if (e && e.value) {
      this.state.TRADINGID = e;
      RestfulUtils.post('/fund/get_tradingid', {
        CODEID: this.state.CODEID, language: this.props.language, OBJNAME: this.props.datapage.OBJNAME
      })
        .then(res => {
          this.state.listTRADINGID = res.DT
        })
      that.setState({
        ...this.state,
        TRADINGID: e
      })
    }
    else {
      this.state.TRADINGID = { value: '', label: '' };
      RestfulUtils.post('/fund/get_tradingid', {
        CODEID: this.state.CODEID, language: this.props.language, OBJNAME: this.props.datapage.OBJNAME
      })
        .then(res => {
          this.state.listTRADINGID = res.DT
        })
      that.setState({
        ...this.state,
        TRADINGID: { value: '', label: '' }
      })
    }
  }
  async getSYMBOLHOANDOI(input) {
    return { options: this.state.optionSYMBOLHOANDOI };
  }
  async getOptionsTRADINGID(input) {
    return { options: this.state.listTRADINGID };
  }

  onChangeSYMBOLHOANDOI(e) {
    if (e && e.value) {
      //this.set_data_feettypes(e.value, SRTYPE, CUSTODYCD.value);
      //this.getOptionsSYMBOLHOANDOI(e);
    } else {
      e = '';
    }
    this.setState({ ...this.state, CODEIDHOANDOI: e });
  }
  onClickDetailSell(SEDTLID, sumAmount) {
    this.setState({ QTTY: { value: sumAmount }, SEDTLID: SEDTLID });
  }
  checkValid(name, id, isObj) {
    const { user } = this.props.auth
    let isCustom = user && user.ISCUSTOMER == 'Y';
    let obj = this.state[name];
    let value = isObj ? (obj ? obj.value : '') : obj;
    let mssgerr = '';
    switch (name) {
      case "CUSTODYCD":
        if (value == '')
          mssgerr = this.props.strings.requiredcustodycd;
        break;
      case "SRTYPE":
        if (value == '')
          mssgerr = this.props.strings.requiredsrtype;
        break;
      case "CODEID":
        if (value == '')
          mssgerr = this.props.strings.requiredcodeid;
        break;
      case "CODEIDHOANDOI":
        if (value == '' && this.state["SRTYPE"] == SRTYPE_SW)
          mssgerr = this.props.strings.requiredcodeid;
        break;
      case "SALETYPE":
        if (value == '')
          mssgerr = this.props.strings.requiredsaletype;
        break;
      case "SALEID":
        if (value == '' && this.state["SALETYPE"] && this.state["SALETYPE"].value == '003')
          mssgerr = this.props.strings.requiredsaleid;
        break;
      case "AMOUNT":
        if ((value.toString() == '' && this.state.SRTYPE == SRTYPE_NS)) { mssgerr = this.props.strings.emtyamount; }
        else if (value <= 0 && this.state.SRTYPE == SRTYPE_NS) { mssgerr = this.props.strings.invalidamout; }
        else if (this.state.action == 'U' && (parseFloat(value) == parseFloat(this.state.OLDAMOUNT.value)) && (this.state.SRTYPE == SRTYPE_NS)) { mssgerr = this.props.strings.invalidupdateamout; }
        break;
      case "QTTY":
        if ((value.toString() == '' && this.state.SRTYPE == SRTYPE_NR) || (value.toString() == '' && this.state.SRTYPE == SRTYPE_SW))
          mssgerr = this.props.strings.emtyqtty;
        else if (value <= 0 && this.state.SRTYPE == SRTYPE_NR || value <= 0 && this.state.SRTYPE == SRTYPE_SW)
          mssgerr = this.props.strings.invalidqtty;
        else if (this.state.action == 'U' && (parseFloat(value) == parseFloat(this.state.OLDQTTY.value)) && (this.state.SRTYPE == SRTYPE_NR || this.state.SRTYPE == SRTYPE_SW))
          mssgerr = this.props.strings.invalidupdateqtty;
        break;
      case "SIGN_IMG":
        if (!isCustom && (!value || value == ''))
          mssgerr = this.props.strings.requiredSignImg;
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
  handleConfirm(row, SIGN_IMG_del, SIGN_IMG_DESC_del) {
    // if (event) event.preventDefault();
    var { dispatch } = this.props;
    var mssgerr = '';
    let title = '';
    switch (this.state.action) {
      case "C":
        title = this.props.strings.confirmTitle;
        break;
      case "U":
        title = this.props.strings.amendTitle;
        break;
      case "D":
        title = this.props.strings.cancelTitle;
        break;
      default:
        break;
    }
    if (this.state.action !== "D") {
      for (let index = 0; index < this.state.checkFields.length; index++) {
        const element = this.state.checkFields[index];
        mssgerr = this.checkValid(element.name, element.id, element.isObj);
        if (mssgerr !== '')
          break;
      }
    }

    if (this.state.action == "D") {
      const { user } = this.props.auth;
      let isCustom = user && user.ISCUSTOMER == 'Y';
      if (!isCustom && !SIGN_IMG_del && row.STATUS != '1' && row.STATUS != 'N') {
        dispatch(showNotifi({ type: "error", header: "", content: this.props.strings.requiredSignImg }));
        return;
      }
    }

    if (mssgerr == '') {
      var datanotify = {
        type: "",
        header: "",
        content: ""
      }
      var state = this.state;
      console.log('this.state on submit:::', this.state)
      let v_objname = this.props.datapage ? this.props.datapage.OBJNAME : '';
      let SALEID = state.SALETYPE && state.SALETYPE.value == '003' ? state.SALEID : '';
      var Obj = this.state.action !== "D" ? {
        ACTION: this.state.action,
        CUSTODYCD: state.CUSTODYCD.value,
        SRTYPE: state.SRTYPE,
        CODEID: state.CODEID ? state.CODEID.value : '',
        AMOUNT: state.AMOUNT ? state.AMOUNT.value : '',
        SEDTLID: state.SEDTLID,
        QTTY: state.QTTY ? state.QTTY.value : '',
        FEEID: this.state.FEEID ? this.state.FEEID : '',
        SWID: this.state.FEEIDHOANDOI ? this.state.FEEIDHOANDOI : '',
        SWCODEID: this.state.CODEIDHOANDOI ? this.state.CODEIDHOANDOI.value : '',
        SALETYPE: state.SALETYPE ? state.SALETYPE.value : '',
        SALEID: SALEID ? SALEID.value : '',
        ORGORDERID: this.state.ORGORDERID,
        OBJNAME: v_objname,
        SIGN_IMG: this.state.SIGN_IMG,
        SIGN_IMG_DESC: this.state.SIGN_IMG_DESC,
        ipv4: this.state.ipv4,
      } : {
        ACTION: this.state.action,
        CUSTODYCD: this.state.CancelData ? this.state.CancelData.CUSTODYCD : '',
        SRTYPE: this.state.CancelData ? this.state.CancelData.EXECTYPE : '',
        CODEID: this.state.CancelData ? this.state.CancelData.CODEID : '',
        AMOUNT: 0,
        SEDTLID: this.state.CancelData ? this.state.CancelData.SEDTLID : '',
        QTTY: 0,
        FEEID: this.state.CancelData ? this.state.CancelData.FEEID : '',
        SWID: this.state.CancelData ? this.state.CancelData.SWID : '',
        SWCODEID: this.state.CancelData ? this.state.CancelData.SWCODEID : '',
        ORGORDERID: this.state.CancelData ? this.state.CancelData.ORDERID : '',
        OBJNAME: v_objname,
        SIGN_IMG: SIGN_IMG_del,
        SIGN_IMG_DESC: SIGN_IMG_DESC_del,
        ipv4: this.state.ipv4,
      };
      var that = this;
      RestfulUtils.posttrans('/order/preadd', { ...Obj, language: this.props.language }).then((resData) => {
        if (resData.EC == 0) {
          that.setState({ ...that.state, ORDERID: resData.DT.p_orderid, ORGORDERID: Obj.ORGORDERID, titleConfirm: title })
          //show PopupConfirmOrder OTP/PIN
          dispatch(showModalConfirm());
        }
        else {
          datanotify.type = "error";
          datanotify.content = resData.EM
          dispatch(showNotifi(datanotify));
        }
      });
    }
  }

  async handleSubmit(event) {
    var that = this;
    let v_objname = this.props.datapage ? this.props.datapage.OBJNAME : '';
    await RestfulUtils.post('/order/getfacctnobysymbol', { symbol: this.state.my_symbol, custodycd: this.state.CUSTODYCD.value, srtype: 'NN', language: this.props.language }).then((resData) => {
      if (resData.EC == 0) {
        this.setState({
          dataGet: resData.DT[0]
        })
      }
    });
    var state = this.state;
    this.state.dataViewInfo = {
      dataGet: state.dataGet,
      AMOUNT: state.AMOUNT ? state.AMOUNT.value : '',
      AccountInfo: state.AccountInfo,
    }
    var { dispatch } = this.props;

    if (event)
      event.preventDefault();
    var Obj = this.state.action !== 'D' ? {
      TRADINGID: state.TRADINGID.value,
      CUSTODYCD: state.CUSTODYCD.value,
      SRTYPE: state.SRTYPE,
      CODEID: state.CODEID ? state.CODEID.value : '',
      AMOUNT: state.AMOUNT ? state.AMOUNT.value : '',
      SEDTLID: state.SEDTLID,
      QTTY: state.QTTY ? state.QTTY.value : '',
      FEEID: this.state.FEEID ? this.state.FEEID : '',
      SWID: this.state.FEEIDHOANDOI ? this.state.FEEIDHOANDOI : '',
      SWCODEID: this.state.CODEIDHOANDOI ? this.state.CODEIDHOANDOI.value : '',
      ORDERID: this.state.ORDERID,
      ORGORDERID: this.state.ORGORDERID,
      OBJNAME: v_objname,
      OTP: this.state.OTP
    } : {
      TRADINGID: state.TRADINGID.value,
      CUSTODYCD: this.state.CancelData ? this.state.CancelData.CUSTODYCD : '',
      SRTYPE: this.state.CancelData ? this.state.CancelData.EXECTYPE : '',
      CODEID: this.state.CancelData ? this.state.CancelData.CODEID : '',
      AMOUNT: 0,
      SEDTLID: this.state.CancelData ? this.state.CancelData.SEDTLID : '',
      QTTY: 0,
      FEEID: this.state.CancelData ? this.state.CancelData.FEEID : '',
      SWID: this.state.CancelData ? this.state.CancelData.SWID : '',
      SWCODEID: this.state.CancelData ? this.state.CancelData.SWCODEID : '',
      ORDERID: this.state.ORDERID,
      ORGORDERID: this.state.ORGORDERID,
      OBJNAME: v_objname,
      OTP: this.state.OTP
    };
    var datanotify = {
      type: "",
      header: "",
      content: ""
    }

    if (this.state.action == 'C')
      RestfulUtils.posttrans('/order/add', { ...Obj, language: this.props.language }).then((resData) => {
        if (resData.EC == 0) {
          //close modal OTP/PIN
          dispatch(closeModalConfirm());

          datanotify.type = "success";
          datanotify.content = that.props.strings.placeOrderSuccess;
          dispatch(showNotifi(datanotify));
          if (this.state.SRTYPE == 'NS' && this.state.isShowViewInfo)
            dispatch(showModalViewInfo());
          that.refresh()
        }
        else {
          datanotify.type = "error";
          datanotify.content = resData.EM;
          dispatch(showNotifi(datanotify));
        }
      });
    else if (this.state.action == 'U')
      RestfulUtils.posttrans('/order/update', Obj).then((resData) => {
        if (resData.EC == 0) {
          //close modal OTP/PIN
          dispatch(closeModalConfirm());

          datanotify.type = "success";
          datanotify.content = that.props.strings.editOrderSuccess;
          dispatch(showNotifi(datanotify));
          that.refresh()
        }
        else {
          datanotify.type = "error";
          datanotify.content = resData.EM;
          dispatch(showNotifi(datanotify));
        }
      });
    else
      RestfulUtils.posttrans('/order/cancel', Obj).then((resData) => {
        if (resData.EC == 0) {
          //close modal OTP/PIN
          dispatch(closeModalConfirm());

          datanotify.type = "success";
          datanotify.content = that.props.strings.cancelOrderSuccess;
          dispatch(showNotifi(datanotify));
          that.refreshDel()
        }
        else {
          datanotify.type = "error";
          datanotify.content = resData.EM;
          dispatch(showNotifi(datanotify));
        }
      });

  }
  async eventDelete(row, SIGN_IMG, SIGN_IMG_DESC) {//show confirm huy lenh
    var { dispatch } = this.props;
    if (row) {
      this.getInforAccount(row.CUSTODYCD)
      this.getTradingdateByCodeID(row.CODEID)
      await this.setState({ CancelData: row, action: 'D', ISOTP_CONFIRM: row.ISOTP_CONFIRM, ORGORDERID: row.ORDERID })
      this.handleConfirm(row, SIGN_IMG, SIGN_IMG_DESC)
    }

  }
  async eventEdit(row) {//show confirm sua lenh
    var self = this
    window.$('#txtAMOUNT').focus();

    await this.setState({
      ...this.state,
      SRTYPE: row.SRTYPE == SRTYPE_SW ? row.SRTYPE : row.EXECTYPE,
      CUSTODYCD: { value: row.CUSTODYCD, label: row.CUSTODYCD },
      CODEID: { value: row.CODEID, label: row.SYMBOL },
    })

    await this.getInforAccount(row.CUSTODYCD)
    await this.getTradingdateByCodeID(row.CODEID)
    await this.getDataSymbol(row.CUSTODYCD, row.CODEID)

    //cần get lại số dư đối với lệnh mua
    if (this.state.SRTYPE === SRTYPE_NS) {
      await this.getSoDu(row.CUSTODYCD, row.CODEID);
    }

    await self.setState(
      {
        ...this.state,
        ISEDIT: true,
        SRTYPE: row.SRTYPE == SRTYPE_SW ? row.SRTYPE : row.EXECTYPE,
        CUSTODYCD: { value: row.CUSTODYCD, label: row.CUSTODYCD },
        CODEID: { value: row.CODEID, label: row.SYMBOL },
        CODEIDHOANDOI: { value: row.SWCODEID, label: row.SWSYMBOL },
        EDIT_SALENAME: row.SALENAME ? row.SALENAME : '',
        SALEID: { value: row.SALEID, label: row.SALENAME },
        SALETYPE: { value: row.SALETYPE, label: row.SALETYPE },
        WID: row.WID,
        FEEID: row.FEEID,
        action: 'U',
        ORGORDERID: row.ORDERID,
        AMOUNT: { value: parseFloat(row.ORDERAMT) },
        OLDAMOUNT: { value: parseFloat(row.ORDERAMT) },
        QTTY: { value: parseFloat(row.ORDERQTTY) },
        OLDQTTY: { value: parseFloat(row.ORDERQTTY) },
        err_msg: { color: '', text: '' },
        ISOTP_CONFIRM: row.ISOTP_CONFIRM
      }
    )
  }
  onChangeDropdown(type, event) {
    this.state[type] = event.value
    if (type === "SRTYPE") {
      if (this.state.CUSTODYCD && this.state.CODEID) {
        if (this.state.CUSTODYCD.value && this.state.CODEID.value)
          this.getDataSymbol(this.state.CUSTODYCD.value, this.state.CODEID.value)
        if (this.state.SRTYPE === SRTYPE_SW) {
          this.getOptionsSYMBOLHOANDOI(this.state.CODEID);
        }
      }
    }

    this.setState(this.state)
  }

  handleFileUpload(event) {
    var that = this;
    var typeImage = ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/x-png', 'image/png', 'image/svg+xml'];
    if (event.target.files && event.target.files[0]) {
      typeImage.forEach(function (item) {
        if (item === event.target.files[0].type) {
          let reader = new FileReader();
          reader.onload = (e) => {
            that.state.image.value = e.target.result;
            that.state.image.validate = "success";
            that.setState(that.state);
          }
          reader.readAsDataURL(event.target.files[0]);
        }
      })
    }
  }
  showCMND() {
    var { dispatch } = this.props;
    dispatch(showModalCMND());
  }
  ThongTinUyQuyen() {
    var { dispatch } = this.props;
    dispatch(showModalThongTinUyQuyen());
  }
  ModalChiTiet() {
    if (this.state.CODEID && this.state.CODEID.value != '') {
      var { dispatch } = this.props;
      dispatch(showModalChiTiet());
    } else {
      toast.error("Bạn chưa nhập mã chứng chỉ quỹ", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }
  changeSRTYPE(e) {
    var SRTYPE = e.target.value;
    this.state.SRTYPE = SRTYPE;
    this.setState(this.state);
  }
  deleError(e) {
  }
  renderListOption() {
    var that = this;
    return (
      this.state.data.map((option, index) => {
        return (
          that.state.FEEID == option.value ? <option selected value={option.value} key={index}>{option.label}</option>
            : <option value={option.value} key={index}>{option.label}</option>
        )
      })
    )
  }
  renderListOptionhoandoi() {
    var that = this;
    return (
      this.state.datahoandoi.map((option, index) => {
        return (
          that.state.FEEIDHOANDOI == option.value ? <option selected value={option.value} key={index}>{option.label}</option>
            : <option value={option.value} key={index}>{option.label}</option>
        )
      })
    )
  }
  async handleAdd() {
    await this.setState({ ...this.state, action: 'C', ISOTP_CONFIRM: 'Y' })
    let CUSTODYCD = this.state.CUSTODYCD.value
    let CODEID = this.state.CODEID.value
    let AccountDetail = this.state.AccountDetail
    let ISINTERNALORDER = false;

    if (AccountDetail && CUSTODYCD && CODEID) {
      AccountDetail.map(function (item) {
        if (item && item.detail && item.detail.LISTCODEIDINTERNAL) {
          let PV_LISTCODEIDINTERNAL = item.detail.LISTCODEIDINTERNAL ? item.detail.LISTCODEIDINTERNAL.split(',') : {};
          for (let i = 0; i < PV_LISTCODEIDINTERNAL.length; i++) {
            if (item.detail && item.detail.CUSTODYCD == CUSTODYCD && PV_LISTCODEIDINTERNAL[i] == CODEID && ISINTERNALORDER == false) {
              ISINTERNALORDER = true
              return null
            }
          }
        }
      })
    }

    if (ISINTERNALORDER == true) {
      this.checkConfirmCheckOrder('add', null, null)
    }
    else {
      this.handleConfirm()
    }
  }
  async handleUpdate() {
    await this.setState({ ...this.state, action: 'U' })
    this.handleConfirm()
  }
  confirmPopup(ISConfirm, ACTION) {
    if (ISConfirm == true) {
      this.handleUpdate()
    }
    else {
      this.setState({ showModalConfirm: false, ACTION: ACTION })
    }
  }
  confirmPopupCheckOrder(ISConfirm, ACTION) {
    if (ISConfirm == true) {
      this.handleConfirm()
    }
    else {
      this.setState({ showModalDetailCheckOrder: false, ACTION: ACTION })
    }
  }
  closeModalDetail() {
    this.setState({ showModalDetail: false })
  }
  closeModalSearch() {
    this.setState({ showModalSearch: false })
  }
  closeModalDetailCheckOrder() {
    this.setState({ showModalDetailCheckOrder: false })
  }
  checkConfirm(ACTION, data, event) {
    this.setState({ showModalDetail: true, ACTION: ACTION, datarow: data })
  }
  checkConfirmCheckOrder(ACTION, data, event) {
    this.setState({ showModalDetailCheckOrder: true, ACTION: ACTION, datarow: data })
  }
  refreshDel() {
    this.setState({
      CancelData: {},
      AccountInfo: {}
    })
  }
  refresh() {
    const { user } = this.props.auth
    let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
    if (!isCustom)
      this.setState({
        SRTYPE: SRTYPE_NS,
        CUSTODYCD: '',
        CODEID: '',
        WID: '',
        FEEID: '',
        action: 'C',
        data: [],
        ORDERID: '',
        ORGORDERID: '',
        QTTY: { value: 0, validate: null, tooltip: "Không được để trống !!", formattedValue: 0 },
        OLDQTTY: { value: 0 },
        AMOUNT: { value: 0, validate: null, tooltip: "Không được để trống !!", formattedValue: 0 },
        OLDAMOUNT: { value: 0 },
        ISEDIT: false,
        err_msg: { color: '', text: '' },
        ISOTP_CONFIRM: 'Y',
        sellAvlBalance: '0',
        AccountInfo: {},
        OTP: '',
        // AccountDetail: [],
        //ListSALETYPE: [],
        SALETYPE: '',
        SALEID: '',
        CACHESALEACCTNO: '',
        AMT: 0,
        dataInfoFund: {},
        isSellAll: false,
        SIGN_IMG: null,
        SIGN_IMG_DESC: "",
        err_msg_upload: {},
        urlPreviewPDF: "",
      })
    else
      this.setState({
        SRTYPE: SRTYPE_NS,
        CODEID: '',
        WID: '',
        FEEID: '',
        action: 'C',
        data: [],
        ORDERID: '',
        ORGORDERID: '',
        QTTY: { value: 0, validate: null, tooltip: "Không được để trống !!", formattedValue: 0 },
        OLDQTTY: { value: 0 },
        AMOUNT: { value: 0, validate: null, tooltip: "Không được để trống !!", formattedValue: 0 },
        OLDAMOUNT: { value: 0 },
        ISEDIT: false,
        err_msg: { color: '', text: '' },
        ISOTP_CONFIRM: 'Y',
        sellAvlBalance: '0',
        OTP: '',
        // AccountDetail: [],
        SALETYPE: '000000',
        SALEID: '',
        CACHESALEACCTNO: '',
        AMT: 0,
        dataInfoFund: {},
        isSellAll: false,
        SIGN_IMG: null,
        SIGN_IMG_DESC: "",
        err_msg_upload: {},
        urlPreviewPDF: "",
      })
  }
  onValueChange(type, data) {
    this.state[type].value = data.value.replace(/^0+/, '')
    this.state[type].formattedValue = data.formattedValue
    this.setState(this.state)
  }

  async getInforAccount(CUSTODYCD) {
    let self = this
    let v_objname = this.props.datapage ? this.props.datapage.OBJNAME : '';
    await RestfulUtils.post('/account/get_generalinfor', { CUSTODYCD: CUSTODYCD, OBJNAME: v_objname }).then((resData) => {
      if (resData.EC == 0) {
        self.setState({ ...self.state, AccountInfo: resData.DT });
      } else {
        self.setState({ ...self.state, AccountInfo: {} });
      }
    });
    let { AccountInfo } = this.state;
    if (AccountInfo) {
      let custid = AccountInfo.CUSTODYCD
      RestfulUtils.post('/account/sync_cfauth', { CUSTID: custid, LANG: this.props.language, OBJNAME: v_objname }).then((resData) => {
      });
    }
  }
  checkShowViewInfo() {
    this.setState({ isShowViewInfo: true })
  }
  handleClickSearch() {
    console.log('haki=================== :')
    this.setState({ showModalSearch: true })
  }
  selectCustodycd(data) {
    console.log('data selected :::', data)
    //this.setState({CUSTODYCD :data.CUSTODYCD})
    this.setState({ isFirstLoad: 'N' })
    this.getInforAccount(data.CUSTODYCD);
    this.getOptionsSaleidByCodeid(data.CUSTODYCD);
    this.setState({ ...this.state, CUSTODYCD: { label: data.CUSTODYCD, value: data.CUSTODYCD } });
    this.getSoDu(data.CUSTODYCD, this.state.CODEID.value)
    this.getDataSymbol(data.CUSTODYCD, this.state.CODEID.value)
  }


  changeOrderTypeNew = (event) => {
    //lệnh định kỳ
    if (event.target && event.target.value === "ORDERTYPE_NEW_2") {
      this.props.history.push("/PLACEORDERSIP")
    }
  }

  onClickTabSoLenhDinhKi = () => {
    this.props.history.push("/PLACEORDERSIP")
  }

  openModalCreateUploadOriginalOrder = () => {
    this.setState({ showModalCreateUploadOriginalOrder: true })
  }
  closeModalCreateUploadOriginalOrder = () => {
    this.setState({ showModalCreateUploadOriginalOrder: false })
  }
  _handleSIGNIMGDESCChange = e => {
    this.setState({ SIGN_IMG_DESC: e.target.value })
  }
  _handleSIGNIMGChange = e => {
    e.preventDefault();
    let that = this;
    let reader = new FileReader();
    const compress = new Compress();
    const files = [...e.target.files];
    let file = e.target.files[0];
   

    let isPDF = file.type === 'application/pdf' ? true : false;
    if (isPDF === true) {
      if (file.size > MAXSIZE_PDF) {
        let error = {
          color: 'red',
          contentText: this.props.strings.errorSizePDF
        }
        this.setState({ err_msg_upload: error, urlPreviewPDF: '', SIGN_IMG: null })
        return;
      } else {
        urlPreviewPDF = URL.createObjectURL(file)
      }
    }
    if (file.type !== 'image/jpeg'
      && file.type !== 'image/png'
      && file.type !== 'application/pdf') {
      console.log('this.props.strings.errorFileType:', this.props.strings.errorFileType)
      let error = {
        color: 'red',
        contentText: this.props.strings.errorFileType
      }
      this.setState({ err_msg_upload: error, urlPreviewPDF: '', SIGN_IMG: null })
    }
    else {
      let error = { color: 'red', contentText: '' }
      this.setState({ err_msg_upload: error, urlPreviewPDF: '', SIGN_IMG: null })

      //luồng xử lý preview ảnh 
      if (isPDF === false) {
        reader.onloadend = () => {
          compress.compress(files, {
            size: 0.2, // the max size in MB, defaults to 2MB
            quality: 0.75, // the quality of the image, max is 1,
            maxWidth: 1920, // the max width of the output image, defaults to 1920px
            maxHeight: 1920, // the max height of the output image, defaults to 1920px
            resize: true, // defaults to true, set false if you do not want to resize the image width and height
          }).then((results) => {
            const img1 = results[0]
            const base64str = img1.data
            const imgPrefix = img1.prefix
            const dataBase64 = imgPrefix + base64str
            var tempImg = new Image();
            var MAX_WIDTH = IMGMAXW;
            var MAX_HEIGHT = IMGMAXH;
            var tempW = tempImg.width;
            var tempH = tempImg.height;
            if (tempW > tempH) {
              if (tempW > MAX_WIDTH) {
                tempH *= MAX_WIDTH / tempW;
                tempW = MAX_WIDTH;
              }
            } else {
              if (tempH > MAX_HEIGHT) {
                tempW *= MAX_HEIGHT / tempH;
                tempH = MAX_HEIGHT;
              }
            }
            tempImg.src = dataBase64
            tempImg.onload = function () {
              var canvas = document.createElement("canvas");
              canvas.width = tempW;
              canvas.height = tempH;
              var ctx = canvas.getContext("2d");
              ctx.drawImage(this, 0, 0, tempW, tempH);
              that.state.SIGN_IMG = dataBase64;
              that.setState(that.state);
            };
          })
        };
        reader.readAsDataURL(file);
      } else {
        //luồng xử lý file preview pdf
        that.setState({
          urlPreviewPDF: urlPreviewPDF,
        })
        reader.readAsDataURL(file);
        reader.onload = function () {
          that.setState({
            ...that.state,
            SIGN_IMG: reader.result
          })
        };
        reader.onerror = function (error) {
          error = {
            color: 'red',
            contentText: 'Đã có lỗi xảy ra, vui lòng thử lại sau'
          }
          that.setState({
            ...that.state,
            urlPreviewPDF: '',
            SIGN_IMG: null,
            err_msg_upload: error
          })
        };
      }
    }
  };

  toggleSellAll = () => {
    this.setState({
      isSellAll: !this.state.isSellAll
    }, () => {
      if (this.state.isSellAll) {
        let qtty = this.state.sellAvlBalance ? parseFloat(this.state.sellAvlBalance) : 0;
        this.setState({
          QTTY: { value: qtty, validate: null, tooltip: "Không được để trống !!", formattedValue: qtty }
        })
      } else {
        this.setState({
          QTTY: { value: 0, validate: null, tooltip: "Không được để trống !!", formattedValue: 0 }
        })
      }
    })
  }

  render() {
    //changeclassmargin();
    //console.log('this.state::::', this.state)
    let { dataInfoFund, SRTYPE, SALETYPE, SALEID, isSellAll } = this.state;
    const { user } = this.props.auth
    let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
    let isGroupUser = user ? (user.ISGROUPUSER ? true : false) : false;
    let disableCustodycdBox = this.state.ISEDIT;
    let ISCUSTODYCD = this.state.CUSTODYCD ? this.state.CUSTODYCD.value ? true : false : false;
    let isCodeid = this.state.CODEID != '' ? true : false;
    var that = this;
    var renderAMOUNTSLBan = null;
    let titleNewPlaceOrder = null;
    var renderFileAnhCMT = null;
    var isShowOtpConfirm = 'Y';
    if (isCustom) { isShowOtpConfirm = this.state.ISOTP_CONFIRM }
    else { isShowOtpConfirm = 'N' }
    if (this.state.image.validate === "warning") {
      renderFileAnhCMT = <span className="glyphicon glyphicon-remove pull-right"></span>;
    } else {
      renderFileAnhCMT = <span className="glyphicon glyphicon-ok pull-right"></span>;
    }

    //renderAMOUNTSLBan theo mua/bán/hoán đổi
    if (SRTYPE === SRTYPE_NS) {//mua
      titleNewPlaceOrder = this.props.strings.placeorderSell;
      renderAMOUNTSLBan =
        <React.Fragment>
          <div className="col-md-12 form-group">
            <label>{this.props.strings.buyvalue}</label>
            <NumberInput className="form-control" value={this.state.AMOUNT.value} onValueChange={this.onValueChange.bind(this, 'AMOUNT')} thousandSeparator={true} prefix={''} decimalScale={0} id="txtAMOUNT" />
          </div>
          <div className="col-md-12 form-group">
            <label>{this.props.strings.sodu}</label>
            <div className="form-control inputEdit">
              <NumberFormat value={parseInt(this.state.AMT ? this.state.AMT > 0 ? this.state.AMT : 0 : 0)} displayType={'text'} thousandSeparator={true} decimalScale={2} />
            </div>
          </div>
        </React.Fragment>
    } else if (SRTYPE === SRTYPE_NR) {//ban
      titleNewPlaceOrder = this.props.strings.placeorderBuy; // Đặt lệnh bán thường
      renderAMOUNTSLBan =
        <React.Fragment>
          <div className="col-md-12 form-group">
            <label>{this.props.strings.transactionbalance}</label>{/* Số dư có thể giao dịch */}
            <div className="form-control inputEdit">
              <NumberInput displayType='text' decimalScale={2} id="txtSellAvlBalance" value={this.state.sellAvlBalance} thousandSeparator={true} prefix={''} />
            </div>
          </div>

          <div className="col-md-12 form-group div-sell-qtty">
            <label>{this.props.strings.sellvaluesell}</label>{/* Số lượng bán */}
            <NumberInput disabled={isSellAll} decimalScale={2} className="form-control" value={this.state.QTTY.value} onValueChange={this.onValueChange.bind(this, 'QTTY')} thousandSeparator={true} prefix={''} id="txtQTTY" />
            <div className="div-sell-all-btn">
              <button type="button" id="btrefesh" onClick={this.toggleSellAll.bind(this)}>
                {isSellAll && <i className="fas fa-check" aria-hidden="true"></i>}
                {this.props.strings.sellAll}
              </button>
            </div>
          </div>
        </React.Fragment>
    }
    else {// Chuyển đổi
      titleNewPlaceOrder = this.props.strings.placeorderSwap;
      renderAMOUNTSLBan =
        <React.Fragment>
          <div className="col-md-12">
            <label>{this.props.strings.swbalance}</label>
            <div className="form-control inputEdit">
              <NumberInput displayType='text' id="txtSellAvlBalance" value={this.state.sellAvlBalance} thousandSeparator={true} decimalScale={2} prefix={''} />
            </div>
          </div>
          <div className="col-md-12 form-group div-sell-qtty">
            <label>{this.props.strings.sellvalue}</label>
            <NumberInput disabled={isSellAll} className="form-control" decimalScale={2} value={this.state.QTTY.value} onValueChange={this.onValueChange.bind(this, 'QTTY')} thousandSeparator={true} prefix={''} id="txtQTTY" />
            <div className="div-sell-all-btn">
              <button type="button" id="btrefesh" onClick={this.toggleSellAll.bind(this)}>
                {isSellAll && <i className="fas fa-check" aria-hidden="true"></i>}
                {this.props.strings.switchAll}
              </button>
            </div>
          </div>
        </React.Fragment>
    }

    var renderThongTinQuy =
      SRTYPE === SRTYPE_SW ?
        <div><ThongTinQuy CODEID={this.state.CODEID} onChange={this.handleChange.bind(this)} type="mua" /><ThongTinQuy CODEID={this.state.CODEIDHOANDOI} onChange={this.handleChange.bind(this)} type="ban" /></div>
        :
        <ThongTinQuy CODEID={this.state.CODEID} onChange={this.handleChange.bind(this)} type={SRTYPE == SRTYPE_NR ? "ban" : "mua"} />;
    let strSRTYPE = this.state.SRTYPE == SRTYPE_NR ? this.props.strings.selltitle : this.state.SRTYPE == SRTYPE_NS ? this.props.strings.buytitle : this.props.strings.swtitle;
    let ISSALETYPE = this.state.SALETYPE && this.state.SALETYPE.value == '003' ? false : true
    let strColorSRTYPE =
      this.state.SRTYPE == SRTYPE_NR ? COLORNS_NEW
        : this.state.SRTYPE == SRTYPE_NS ? COLORNS_NEW
          : COLORNS_NEW;


    return (
      <div>
        <div className="custom-new-place-order">
          <div className="custom-new-place-order-left row">
            {/* Header */}
            <div className="title-new-place-order">
              <div className="width-90 no-padding-right">
                <label>{titleNewPlaceOrder} </label>
              </div>
              <div className="width-10 no-padding">
                <button type="button" id="btrefesh"
                  onClick={this.refresh.bind(this)}
                >
                  <i className="fa fa-undo" aria-hidden="true"></i>
                </button>
              </div>
            </div>

            {/* PlaceOrder Form Begin */}

            {/* Số hiệu TKGD */}
            {isCustom &&
              <div className="col-md-12 form-group">
                <label>{this.props.strings.custodycd}</label>
                <Select.Async
                  name="form-field-name"
                  disabled={disableCustodycdBox}
                  placeholder={this.props.strings.custodycd}
                  loadOptions={this.getOptions.bind(this)}
                  value={this.state.CUSTODYCD}
                  onChange={this.onChangeCUSTODYCD.bind(this)}
                  id="drdCUSTODYCD"
                  ref="refCUSTODYCD"
                />
              </div>
            }

            {!isCustom &&
              <div className="col-md-12 form-group">
                <label>{this.props.strings.custodycd}</label>
                <div className="custom-combo-dat-lenh">
                  <Select.Async
                    width="100%"
                    name="form-field-name"
                    disabled={disableCustodycdBox}
                    placeholder={this.props.strings.custodycd}
                    loadOptions={this.getOptions.bind(this)}
                    value={this.state.CUSTODYCD}
                    onChange={this.onChangeCUSTODYCD.bind(this)}
                    id="drdCUSTODYCD"
                    ref="refCUSTODYCD"
                  />
                  <button style={{ margin: "0 0 0 5px", minHeight: "34px" }} type="button" onClick={this.handleClickSearch.bind(this)}
                    className="pull-left btn custom-btndanger" id="btupdate22" ><i class="fa fa-search" aria-hidden="true"></i></button>
                </div>

              </div>
            }

            {/* Loại lệnh */}
            <div className="col-md-12 form-group">
              <label>{this.props.strings.ordertype}</label>
              <select
                className="form-control"
                onChange={(e) => this.changeOrderTypeNew(e)}
                disabled={this.state.ISEDIT}
              >
                <option value="ORDERTYPE_NEW_1">Lệnh thường</option>
                <option value="ORDERTYPE_NEW_2">Định kỳ</option>
              </select>
            </div>

            {/* Đặt lênh */}
            <div className="col-md-12 form-group">
              <label>{this.props.strings.ordertypenew}</label>
              <DropdownFactory
                CDVAL={this.state.SRTYPE}
                value="SRTYPE"
                CDTYPE="SA"
                CDNAME="FOSRTYPE"
                onChange={this.onChangeDropdown.bind(this)}
                disabled={this.state.ISEDIT}
                ID="drdSRTYPE" />
            </div>

            {/* Mã CCQ */}
            <div className="col-md-12 form-group">
              <label> {this.props.strings.vfmcode}</label>
              <Select.Async
                name="form-field-name"
                disabled={this.state.ISEDIT}
                placeholder={this.props.strings.inputccq}
                loadOptions={this.getOptionsSYMBOL.bind(this)}
                value={this.state.CODEID}
                onChange={this.onChangeSYMBOL.bind(this)}
                id="drdCODEID"
              />
            </div>

            {/* Mã CCQ chuyển đổi - hiển thị với loại Chuyển đổi */}
            {
              SRTYPE === SRTYPE_SW &&
              <div className="col-md-12">
                <label>{this.props.strings.vfmcodesw}</label>
                <Select.Async
                  name="form-field-name"
                  disabled={this.state.ISEDIT}
                  placeholder={this.props.strings.inputccq}
                  loadOptions={this.getSYMBOLHOANDOI.bind(this)}
                  value={this.state.CODEIDHOANDOI}
                  options={this.state.optionSYMBOLHOANDOI}
                  onChange={this.onChangeSYMBOLHOANDOI.bind(this)}
                  id="drdCODEIDHOANDOI"
                  cache={false}
                />
              </div>
            }

            {/* renderAMOUNTSLBan theo mua/bán/chuyển đổi */}
            {renderAMOUNTSLBan}

            {/* Gán môi giới */}
            {/* <div className="col-xs-12">
                  <h5 className="col-xs-5"><b>{this.props.strings.saletype}</b></h5>
                  <div className="col-xs-7">
                    <select disabled={this.state.ISEDIT || !ISCUSTODYCD} id="drdSALETYPE" className="form-control" onChange={this.onChangeSALETYPE.bind(this)}>
                      {
                        this.renderListOptionSALETYPE()
                      }
                    </select>
                    
                  </div>
                </div> */}

            {/* CTV chăm sóc */}
            {!this.state.ISEDIT && (
              <div className="col-md-12 form-group">
                <label>{this.props.strings.saletype}</label>
                <Select
                  name="form-field-name"
                  disabled={this.state.ISEDIT || !ISCUSTODYCD}
                  options={this.state.listSaleType}
                  value={this.state.SALETYPE}
                  onChange={this.onChangeSaleidByCustodycd.bind(this)}
                  id="drdSALETYPE"
                />
              </div>
            )}

            {/* Mã CTV */}
            {this.state.ISEDIT && (
              <div className="col-md-12 form-group">
                <label>{this.props.strings.saleid}</label>
                <input disabled={true} className="form-control" type="text" value={this.state.EDIT_SALENAME} />
              </div>
            )}

            {!ISSALETYPE && !this.state.ISEDIT && (
              <div className="col-md-12 form-group">
                <label>{this.props.strings.saleid}</label>
                <Select.Async
                  name="form-field-name"
                  placeholder={this.props.strings.saleid}
                  loadOptions={this.getOptionsSALEID.bind(this)}
                  value={this.state.SALEID}
                  onChange={this.onChangeSALEID.bind(this)}
                  id="drdSALEID"
                />
              </div>
            )}

            {/* Ngày giao dịch */}
            <div className="col-md-12 form-group">
              <label>{this.props.strings.transactiondate}</label>
              <input className="form-control"
                value={dataInfoFund && dataInfoFund.DAY ? dataInfoFund.DAY : ''}
                disabled
              />
            </div>

            {!isCustom && (
              <div className="col-md-12 form-group text-right div-add-order-image">
                <input
                  className="form-control"
                  id="btnOrderImg"
                  type="button"
                  defaultValue={this.props.strings.uploadOrderImg}
                  onClick={this.openModalCreateUploadOriginalOrder.bind(this)}
                />
                {this.state.SIGN_IMG && (
                  <div className="icon-added-order-image"><i class="fas fa-check"></i></div>
                )}
              </div>
            )}

            <div className="col-md-12">
              {!this.state.ISEDIT ?
                <input style={{
                  backgroundColor: strColorSRTYPE
                }}
                  type="button" onClick={this.handleAdd.bind(this)}
                  className="new-btnBuySell"
                  defaultValue={strSRTYPE} id="btnBuyorSell" />
                :
                <input type="button"
                  style={{ backgroundColor: strColorSRTYPE }}
                  // onClick={this.checkConfirm.bind(this, "edit")}
                  onClick={this.handleUpdate.bind(this, "edit")}
                  className="new-btnBuySell" defaultValue={this.props.strings.btnUpdate} id="btupdate" />
              }
            </div>

            <CMND OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} CUSTODYCD={this.state.AccountInfo.CUSTODYCD} />

            {/* Modal hiển thị ảnh/file Upload phiếu lệnh gốc */}
            <ModalCreateUploadOriginalOrder
              showModal={this.state.showModalCreateUploadOriginalOrder}
              closeModal={this.closeModalCreateUploadOriginalOrder.bind(this)}
              SIGN_IMG={this.state.SIGN_IMG}
              SIGN_IMG_DESC={this.state.SIGN_IMG_DESC}
              urlPreviewPDF={this.state.urlPreviewPDF}
              err_msg_upload={this.state.err_msg_upload}
              handleSIGNIMGChange={this._handleSIGNIMGChange}
              onDescChange={this._handleSIGNIMGDESCChange}
            />

            {/* modal hiện thông tin, sau khi chọn lệnh mua và nhập OTP/PIN thành công */}
            <PopupViewInfo
              isSIP={false}
              TRDATE={this.state.TRDATE}
              OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''}
              data={this.state.dataViewInfo}
            />

            {/* modal confirm OTP/PIN đối với lệnh thường */}
            <PopupConfirmOrder
              isSIP={false}
              checkShowViewInfo={this.checkShowViewInfo.bind(this)}
              TRDATE={this.state.TRDATE}
              ISOTP_CONFIRM={isShowOtpConfirm}
              OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''}
              onChange={this.onChangeOTP.bind(this)}
              FULLNAME={this.state.AccountInfo ? this.state.AccountInfo.FULLNAME : ''}
              title={this.state.titleConfirm}
              data={this.state}
              handleSubmit={this.handleSubmit.bind(this)}
              showModal={this.props.showModal} //redux
              refresh={this.refresh.bind(this)}
              isCustom={isCustom}
            />
            <ModalTimKiemFullname onSelectRow={this.selectCustodycd.bind(this)} showModal={this.state.showModalSearch} closeModalTimKiem={this.closeModalSearch.bind(this)} />

            <ModalDialog
              confirmPopup={this.confirmPopup.bind(this)}
              ACTION={this.state.ACTION}
              data={this.state.datarow}
              showModalDetail={this.state.showModalDetail}
              closeModalDetail={this.closeModalDetail.bind(this)}
            />

            <ModalDialogCheckOrder
              confirmPopupCheckOrder={this.confirmPopupCheckOrder.bind(this)}
              ACTION={this.state.ACTION} data={this.state.datarow}
              showModalDetail={this.state.showModalDetailCheckOrder}
              closeModalDetail={this.closeModalDetailCheckOrder.bind(this)}
            />
            <UyQuyen CUSTODYCD={this.state.AccountInfo.CUSTODYCD} OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} />
            <ChiTiet OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} CODEID={this.state.CODEID ? this.state.CODEID.value : ''} CUSTODYCD={this.state.CUSTODYCD ? this.state.CUSTODYCD.value : ''} onClickConfirm={this.onClickDetailSell.bind(this)} />

          </div>
          <div className="custom-new-place-order-right">
            <div style={{ marginTop: '0px' }} className="col-xs-12 pdl-0 pdr-0 tab-datlenh">
              <ul className="nav nav-tabs">
                <li style={{ marginBottom: '-4px' }} className="active">
                  <a data-toggle="tab" href="#tab1" id="#tab1">
                    <b>{this.props.strings.orderbookNew}</b>
                  </a>
                </li>
                <li>
                  <a href="#" data-toggle="tab" id="#tab2" onClick={() => this.onClickTabSoLenhDinhKi()}>
                    <b>{this.props.strings.orderbookDKNew}</b>
                  </a>
                </li>
              </ul>
              <div style={{ marginTop: "-20px" }} className="tab-content">
                <div id="tab1" className="tab-pane fade in active">
                  <SoLenh
                    eventDelete={this.eventDelete.bind(this)}
                    eventEdit={this.eventEdit.bind(this)}
                    datapage={this.props.datapage}
                    auth={this.props.auth}
                    custodycd={this.state.CUSTODYCD} />
                </div>
                {/* <div id="tab2" className="tab-pane fade">
                  <SoDuHienCo OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} />
                </div> */}
              </div>
            </div>

          </div>
        </div>



      </div>
    )
  }
}

const stateToProps = state => ({
  language: state.language.language,
  auth: state.auth,
  tradingdate: state.systemdate.tradingdate,
  showModal: state.datLenh.showModalConfirm,
  dataPlaceOrder: state.datLenh.dataPlaceOrder,
});
const decorators = flow([
  connect(stateToProps),
  translate('DatLenh')
]);
module.exports = withRouter(decorators(DatLenh));
