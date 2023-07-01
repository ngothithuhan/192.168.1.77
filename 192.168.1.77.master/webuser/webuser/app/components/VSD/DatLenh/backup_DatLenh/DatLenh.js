import React from 'react';
import { connect } from 'react-redux';
import { showModalCMND, showModalThongTinUyQuyen, closeModalThongTinUyQuyen, showModalChiTiet, showModalConfirm, closeModalConfirm, showModalViewInfo } from 'actionDatLenh';
import { showNotifi } from 'app/action/actionNotification.js';
import DropdownFactory from '../../../utils/DropdownFactory'
import { toast } from 'react-toastify'
import PopupViewInfo from './components/PopupViewInfo'
import PopupConfirmOrder from './components/PopupConfirmOrder'
import Select from 'react-select'
import 'react-select/dist/react-select.css';
import RestfulUtils from 'app/utils/RestfulUtils';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import NumberFormat from 'react-number-format';
import ModalDialog from 'app/utils/Dialog/ModalDialog'
import ModalDialogCheckOrder from 'app/utils/Dialog/ModalDialogCheckOrder'
import NumberInput from 'app/utils/input/NumberInput'
import { SRTYPE_SW, SRTYPE_NS, SRTYPE_NR, COLORGRAY } from '../../../Helpers';
import CMND from './components/CMND'
import ThongTinQuy from 'ThongTinQuy'
import UyQuyen from 'UyQuyen'
import ChiTiet from 'ChiTiet'
import SoDuHienCo from './components/SoDuHienCo.js'
import SoLenh from './components/SoLenh.js'
import ModalTimKiemFullname from 'app/utils/Dialog/ModalTimKiemFullname.js';

import 'app/utils/customize/CustomizeReactTable.scss';

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
      ishowViewInfo: false,
      my_symbol: '',
      my_time: '', // laays thoi gian cho viewpopup
      dataViewInfo: {},
      dataGet: {},
      checkFields: [
        { name: "CUSTODYCD", id: "drdCUSTODYCD", isObj: true },
        { name: "SRTYPE", id: "drdSRTYPE", isObj: false },
        { name: "CODEID", id: "drdCODEID", isObj: true },
        { name: "CODEIDHOANDOI", id: "drdCODEIDHOANDOI", isObj: true },
        { name: "SALETYPE", id: "drdSALETYPE", isObj: true },
        { name: "SALEID", id: "drdSALEID", isObj: true },
        { name: "AMOUNT", id: "txtAMOUNT", isObj: true },
        { name: "QTTY", id: "txtQTTY", isObj: true }
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
      EDIT_SALETYPE: '',
      SALENAME: '',
      isFirstLoad: '',
      listSaleid: []
    }
  }
  componentDidMount() {
    this.setState({ isFirstLoad: 'Y' })
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
          var defaultCustodyCd = this.props.auth.user.USERID;
          data = [{ label: defaultCustodyCd, value: defaultCustodyCd }];
          this.getInforAccount(defaultCustodyCd);
        } else {
          data = res;
        }
        if (data && data.length > 0) {
          this.setState({ ...this.state, CUSTODYCD: data[0] })
          //this.getInforAccount(data[0].label);
          if (input != data[0].value && input != '') {
            this.setState({ isFirstLoad: 'N' })
          }
          //console.log("=======this.custodycd 1:",data[0].value)
          //console.log('------------------isFirstLoad:',this.state.isFirstLoad)
          if (this.state.isFirstLoad == 'Y') {
            this.getInforAccount(data[0].value);
          }
          //
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
          self.setState({ AMT: res.DT[0].AMOUNT })
        }
        else {
          self.setState({ AMT: 0 })
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
      console.log("========custodcd:", e)
      this.setState({ isFirstLoad: 'N' })
      this.getInforAccount(e.value);
      this.setState({ ...this.state, CUSTODYCD: e });
      this.getSoDu(e.value, this.state.CODEID.value)
    }
    else {
      await this.setState({ ...this.state, AccountInfo: {} });
      this.setState({ ...this.state, CUSTODYCD: { label: '', value: '' } });
      this.getSoDu('', '')
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

  getDataSymbol(CUSTODYCD, CODEID) {
    let v_objname = this.props.datapage ? this.props.datapage.OBJNAME : '';
    var obj = {
      CUSTODYCD: CUSTODYCD,
      CODEID: CODEID,
      language: this.props.language,
      OBJNAME: v_objname
    }
    let { SRTYPE } = this.state;
    this.setState({ ...this.state, sellAvlBalance: '0' })
    if (obj.CUSTODYCD && obj.CODEID && (SRTYPE === SRTYPE_NR || SRTYPE === SRTYPE_SW)) {
      RestfulUtils.post('/balance/getfundbalance', obj)
        .then(resData => {
          if (resData.EC === 0) {
            if (resData.DT.data)
              if (resData.DT.data[0]) {
                this.setState({ ...this.state, sellAvlBalance: resData.DT.data[0].NOBLOCKAVLQTTY })
              }
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
      this.getOptionsSaleidByCodeid(e.value);
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
  getOptionsSaleidByCodeid(codeid) {
    let data = {
      p_language: this.props.language,
      OBJNAME: this.props.datapage.OBJNAME,
      p_codeid: codeid,
      p_custodycd: this.state.CUSTODYCD.value
    }
    return RestfulUtils.post('/fund/getlistsaleid', data)
      .then((res) => {
        this.setState({
          SALETYPE: '',
          listSaleid: res.DT.data
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
  onChangeSALETYPE(event) {
    if (event && event.target.value) {
      this.setState({
        SALETYPE: event.target.value,
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
        if (value == '' && this.state["SALETYPE"] == '003')
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
  handleConfirm(event) {
    if (event)
      event.preventDefault();
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
    if (this.state.action !== "D")
      for (let index = 0; index < this.state.checkFields.length; index++) {
        const element = this.state.checkFields[index];
        mssgerr = this.checkValid(element.name, element.id, element.isObj);
        if (mssgerr !== '')
          break;
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
      let SALEID = state.SALETYPE == '003' ? state.SALEID ? state.SALEID.value : '' : state.SALETYPE
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
        SALETYPE: state.SALETYPE ? state.SALETYPE : '',
        SALEID: SALEID ? SALEID : '',
        ORGORDERID: this.state.ORGORDERID,
        OBJNAME: v_objname
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
        OBJNAME: v_objname
      };
      var that = this;
      RestfulUtils.posttrans('/order/preadd', { ...Obj, language: this.props.language }).then((resData) => {
        if (resData.EC == 0) {
          that.setState({ ...that.state, ORDERID: resData.DT.p_orderid, ORGORDERID: Obj.ORGORDERID, titleConfirm: title })
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
    await RestfulUtils.post('/order/getfacctnobysymbol', { symbol: this.state.my_symbol, custodycd: this.state.AccountInfo.CUSTODYCD, srtype: 'NN', language: this.props.language }).then((resData) => {
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
    dispatch(closeModalConfirm());
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
          datanotify.type = "success";
          datanotify.content = that.props.strings.placeOrderSuccess;
          dispatch(showNotifi(datanotify));
          if (this.state.SRTYPE == 'NS' && this.state.ishowViewInfo) dispatch(showModalViewInfo());
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
  async eventDelete(row) {//show confirm huy lenh
    var { dispatch } = this.props;
    //console.log('row to delete:', row)
    if (row) {
      this.getInforAccount(row.CUSTODYCD)
      this.getTradingdateByCodeID(row.CODEID)
      await this.setState({ CancelData: row, action: 'D', ISOTP_CONFIRM: row.ISOTP_CONFIRM, ORGORDERID: row.ORDERID })
      this.handleConfirm()
    }

  }
  async eventEdit(row) {//show confirm sua lenh
    var self = this
    window.$('#txtAMOUNT').focus();
    this.getInforAccount(row.CUSTODYCD)
    this.getTradingdateByCodeID(row.CODEID)
    await self.setState(
      {
        ISEDIT: true,
        SRTYPE: row.SRTYPE == SRTYPE_SW ? row.SRTYPE : row.EXECTYPE,
        CUSTODYCD: { value: row.CUSTODYCD, label: row.CUSTODYCD },
        CODEID: { value: row.CODEID, label: row.SYMBOL },
        CODEIDHOANDOI: { value: row.SWCODEID, label: row.SWSYMBOL },
        EDIT_SALETYPE: row.SALEACCTNO ? row.SALEACCTNO : '',
        EDIT_SALENAME: row.SALENAME ? row.SALENAME : '',
        SALEID: row.SALEID ? row.SALEID : '',
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
    this.getDataSymbol(row.CUSTODYCD, row.CODEID)
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
  // onChangeDropdownSALETYPE(type, event) {
  //   this.state[type] = event.value
  //   if (event.value != '003') this.state.SALEID = ''
  //   this.setState(this.state)
  // }

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
    let ISINTERNALORDER = false
    if (AccountDetail && CUSTODYCD && CODEID) {
      AccountDetail.map(function (item) {
        var PV_LISTCODEIDINTERNAL = item.detail.LISTCODEIDINTERNAL ? item.detail.LISTCODEIDINTERNAL.split(',') : {};
        for (var i = 0; i < PV_LISTCODEIDINTERNAL.length; i++) {
          if (item.detail && item.detail.CUSTODYCD == CUSTODYCD && PV_LISTCODEIDINTERNAL[i] == CODEID && ISINTERNALORDER == false) {
            ISINTERNALORDER = true
            return null
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
        //ListSALETYPE: [],
        SALETYPE: '000000',
        SALEID: '',
        CACHESALEACCTNO: '',
        AMT: 0,
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
        self.setState({ AccountInfo: resData.DT });
        let ListSALETYPE = []
        let CACHESALEACCTNO = ''
        let SALETYPE = ''
        if (!self.state.ISEDIT) {
          RestfulUtils.post('/account/search_all', { key: CUSTODYCD, detail: "DETAIL" })
            .then((res) => {
              if (res && res.length > 0) {
                if (res[0].detail.SALEDEFAULT && res[0].detail.SALENAMEDEFAULT) {
                  ListSALETYPE.push({
                    value: res[0].detail.SALEDEFAULT, label: res[0].detail.SALENAMEDEFAULT
                  })
                  SALETYPE = res[0].detail.SALEDEFAULT
                  setDefaultSALETYPE(res[0].detail.SALEDEFAULT)
                }
                if (res[0].detail.SALEACCTNO && res[0].detail.SALENAME) {
                  ListSALETYPE.push({
                    value: res[0].detail.SALEACCTNO, label: res[0].detail.SALENAME
                  })
                  CACHESALEACCTNO = res[0].detail.SALEACCTNO
                  if (SALETYPE == '') SALETYPE = res[0].detail.SALEDEFAULT
                  if (ListSALETYPE && ListSALETYPE.length == 0) setDefaultSALETYPE(res[0].detail.SALEACCTNO)
                }
                ListSALETYPE.push({
                  value: '003', label: self.props.strings.otherlbl
                })
                if (SALETYPE == '') SALETYPE = '003'
                if (ListSALETYPE && ListSALETYPE.length == 0) setDefaultSALETYPE('003')
              }
              self.setState({ ListSALETYPE, CACHESALEACCTNO, SALETYPE })
            })
        }
        else {
          RestfulUtils.post('/account/search_all', { key: CUSTODYCD, detail: "DETAIL" })
            .then((res) => {
              let EDIT_SALETYPE = self.state.EDIT_SALETYPE
              if (res && res.length > 0) {
                if (res[0].detail.SALEDEFAULT && res[0].detail.SALENAMEDEFAULT && res[0].detail.SALEDEFAULT == EDIT_SALETYPE) {
                  ListSALETYPE.push({
                    value: res[0].detail.SALEDEFAULT, label: res[0].detail.SALENAMEDEFAULT
                  })
                  SALETYPE = res[0].detail.SALEDEFAULT
                  setDefaultSALETYPE(res[0].detail.SALEDEFAULT)
                }
                if (res[0].detail.SALEACCTNO && res[0].detail.SALENAME && res[0].detail.SALEACCTNO == EDIT_SALETYPE) {
                  ListSALETYPE.push({
                    value: res[0].detail.SALEACCTNO, label: res[0].detail.SALENAME
                  })
                  CACHESALEACCTNO = res[0].detail.SALEACCTNO
                  if (SALETYPE == '') SALETYPE = res[0].detail.SALEDEFAULT
                  if (ListSALETYPE && ListSALETYPE.length == 0) setDefaultSALETYPE(res[0].detail.SALEACCTNO)
                }
                ListSALETYPE.push({
                  value: '003', label: self.props.strings.otherlbl
                })
                if (SALETYPE == '') SALETYPE = '003'
                if (ListSALETYPE && ListSALETYPE.length == 0) {
                  setDefaultSALETYPE('003')
                  self.state.SALEID.value = EDIT_SALETYPE
                }
              }
              self.setState({ ListSALETYPE, CACHESALEACCTNO, SALETYPE, SALETID: self.state.SALEID })
            })

        }
      } else {
        self.setState({ AccountInfo: {}, ListSALETYPE: [], CACHESALEACCTNO: '', SALETYPE: '', SALETID: { value: '', label: '' } });
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
    this.setState({ ishowViewInfo: true })
  }
  renderListOptionSALETYPE() {
    let ListSALETYPE = this.state.ListSALETYPE
    return ListSALETYPE.map(function (item) {
      return <option value={item.value}>{item.label}</option>
    })
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
    this.setState({ ...this.state, CUSTODYCD: { label: data.CUSTODYCD, value: data.CUSTODYCD } });
    this.getSoDu(data.CUSTODYCD, this.state.CODEID.value)
  }
  render() {
    //changeclassmargin();
    //console.log('this.state::::', this.state)
    const { user } = this.props.auth
    let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
    let isGroupUser = user ? (user.ISGROUPUSER ? true : false) : false;
    let disableCustodycdBox = this.state.ISEDIT || isCustom;
    let ISCUSTODYCD = this.state.CUSTODYCD ? this.state.CUSTODYCD.value ? true : false : false
    let isCodeid = this.state.CODEID != '' ? true : false;
    var that = this;
    var { SRTYPE } = this.state;
    var { SALETYPE } = this.state;
    var { SALEID } = this.state;
    var renderAMOUNTSLBan = null;
    var renderFileAnhCMT = null;
    var isShowOtpConfirm = 'Y';
    if (isCustom) { isShowOtpConfirm = this.state.ISOTP_CONFIRM }
    else { isShowOtpConfirm = 'N' }
    if (this.state.image.validate === "warning") {
      renderFileAnhCMT = <span className="glyphicon glyphicon-remove pull-right"></span>;
    } else {
      renderFileAnhCMT = <span className="glyphicon glyphicon-ok pull-right"></span>;
    }
    if (SRTYPE === SRTYPE_NS) {//mua
      renderAMOUNTSLBan =
        <span>
          <div className="col-xs-12">
            <h5 className="col-xs-5"><b>{this.props.strings.buyvalue}</b></h5>
            <div className="col-xs-7">
              <NumberInput className="form-control" value={this.state.AMOUNT.value} onValueChange={this.onValueChange.bind(this, 'AMOUNT')} thousandSeparator={true} prefix={''} decimalScale={0} id="txtAMOUNT" />
            </div>
          </div>
          <div className="col-xs-12">
            <h5 className="col-xs-5"><b>{this.props.strings.sodu}</b></h5>
            <div className="col-xs-7">
              <h5 ><NumberFormat value={parseInt(this.state.AMT ? this.state.AMT > 0 ? this.state.AMT : 0 : 0)} displayType={'text'} thousandSeparator={true} decimalScale={2} /></h5>
            </div>
          </div>
        </span>
    } else if (SRTYPE === SRTYPE_NR) {//ban
      renderAMOUNTSLBan =
        <span>
          <div className="col-xs-12">
            <h5 className="col-xs-5"><b>{this.props.strings.transactionbalance}</b></h5>
            <div className="col-xs-7"><h5>
              <NumberInput displayType='text' decimalScale={2} id="txtSellAvlBalance" value={this.state.sellAvlBalance} thousandSeparator={true} prefix={''} /></h5></div>
          </div>
          <div className="col-xs-12">
            <h5 className="col-xs-5"><b>{this.props.strings.sellvaluesell}</b></h5>
            <div className="col-xs-7">
              <NumberInput decimalScale={2} className="form-control" value={this.state.QTTY.value} onValueChange={this.onValueChange.bind(this, 'QTTY')} thousandSeparator={true} prefix={''} id="txtQTTY" />
            </div>
          </div>
        </span>
    }
    else {//hoan doi 
      renderAMOUNTSLBan =
        <span>
          <div className="col-xs-12">
            <h5 className="col-xs-5"><b>{this.props.strings.swbalance}</b></h5>
            <div className="col-xs-7"><NumberInput displayType='text' id="txtSellAvlBalance" value={this.state.sellAvlBalance} thousandSeparator={true} decimalScale={2} prefix={''} /></div>
          </div>
          <div className="col-xs-12">
            <h5 className="col-xs-5"><b>{this.props.strings.sellvalue}</b></h5>
            <div className="col-xs-7">
              <NumberInput className="form-control" decimalScale={2} value={this.state.QTTY.value} onValueChange={this.onValueChange.bind(this, 'QTTY')} thousandSeparator={true} prefix={''} id="txtQTTY" />
            </div>
          </div>
        </span>
    }

    var renderThongTinQuy =
      SRTYPE === SRTYPE_SW ?
        <div><ThongTinQuy CODEID={this.state.CODEID} onChange={this.handleChange.bind(this)} type="mua" /><ThongTinQuy CODEID={this.state.CODEIDHOANDOI} onChange={this.handleChange.bind(this)} type="ban" /></div>
        :
        <ThongTinQuy CODEID={this.state.CODEID} onChange={this.handleChange.bind(this)} type={SRTYPE == SRTYPE_NR ? "ban" : "mua"} />;
    let strSRTYPE = this.state.SRTYPE == SRTYPE_NR ? this.props.strings.selltitle : this.state.SRTYPE == SRTYPE_NS ? this.props.strings.buytitle : this.props.strings.swtitle;
    let strColorSRTYPE = this.state.SRTYPE == SRTYPE_NR ? COLORGRAY : this.state.SRTYPE == SRTYPE_NS ? COLORGRAY : COLORGRAY;
    let ISSALETYPE = this.state.SALETYPE.value == '003' ? false : true
    let ListSALETYPE = this.state.ListSALETYPE

    return (

      <div className="container panel panel-default margintopNewUI" style={{ padding: "10px" }}>
        <ModalTimKiemFullname onSelectRow={this.selectCustodycd.bind(this)} showModal={this.state.showModalSearch} closeModalTimKiem={this.closeModalSearch.bind(this)} />
        <ModalDialog confirmPopup={this.confirmPopup.bind(this)} ACTION={this.state.ACTION} data={this.state.datarow} showModalDetail={this.state.showModalDetail} closeModalDetail={this.closeModalDetail.bind(this)} />
        <ModalDialogCheckOrder confirmPopupCheckOrder={this.confirmPopupCheckOrder.bind(this)} ACTION={this.state.ACTION} data={this.state.datarow} showModalDetail={this.state.showModalDetailCheckOrder} closeModalDetail={this.closeModalDetailCheckOrder.bind(this)} />
        <div className="title-content">{this.props.strings.ordertitle}-{strSRTYPE}</div>
        <form method="POST" action="#">
          <div className="inner datlenh">
            <div className="col-xs-6 pdl-0 pdt-10">
              <div className="inner45 col-md-12" style={{ border: "1px solid #ddd", borderRadius: "3px", marginLeft: "0px", paddingBottom: "27px", marginTop: "0px" }}>
                <div className="col-xs-12">
                  <h5 className="col-xs-5"><b>{this.props.strings.custodycd}</b></h5>
                  <div className="col-xs-7 customSelect2">
                    {!isCustom ?
                      <div className="col-xs-8" style={{ padding: "0 0 0 0" }}>
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
                      : <div className="col-xs-12" >
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
                      </div>}
                    {!isCustom && <div className="col-xs-4" style={{}}>
                      <input style={{ margin: "0 0 0 0", minHeight: "34px" }} type="button" onClick={this.handleClickSearch.bind(this)}
                        className="pull-left btn btndangeralt" defaultValue={this.props.strings.searchfullname} id="btupdate22" />
                    </div>}
                  </div>
                </div>
                {/* <div className="col-xs-12">
                  <div className="col-xs-5">

                  </div>
                  <div className="col-xs-7">
                    
                  </div>
                </div> */}
                <div className="col-xs-12">
                  <h5 className="col-xs-5"><b>{this.props.strings.ordertype}</b></h5>
                  <div className="col-xs-7">
                    <DropdownFactory CDVAL={this.state.SRTYPE} value="SRTYPE" CDTYPE="SA" CDNAME="FOSRTYPE" onChange={this.onChangeDropdown.bind(this)} disabled={this.state.ISEDIT} ID="drdSRTYPE" />
                  </div>
                </div>
                <div className="col-xs-12">
                  <h5 className="col-xs-5"><b>{this.props.strings.vfmcode}</b></h5>
                  <div className="col-xs-7 customSelect2">
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
                </div>
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
                <div className="col-xs-12">
                  <h5 className="col-xs-5"><b>{this.props.strings.saletype}</b></h5>
                  <div className="col-xs-7 customSelect2">
                    <Select
                      name="form-field-name"
                      disabled={this.state.ISEDIT || !ISCUSTODYCD}
                      options={this.state.listSaleid}
                      value={this.state.SALETYPE}
                      onChange={this.onChangeSaleidByCustodycd.bind(this)}
                      id="drdSALETYPE"
                    />
                  </div>
                </div>
                {ISSALETYPE ? null : this.state.ISEDIT ?
                  <div className="col-xs-12">
                    <h5 className="col-xs-5"><b>{this.props.strings.saleid}</b></h5>
                    <div className="col-xs-7 customSelect2">
                      <input disabled={true} className="form-control" type="text" value={this.state.EDIT_SALENAME} />
                    </div>
                  </div> :
                  <div className="col-xs-12">
                    <h5 className="col-xs-5"><b>{this.props.strings.saleid}</b></h5>
                    <div className="col-xs-7 customSelect2">
                      <Select.Async
                        name="form-field-name"
                        placeholder={this.props.strings.saleid}
                        loadOptions={this.getOptionsSALEID.bind(this)}
                        value={this.state.SALEID}
                        onChange={this.onChangeSALEID.bind(this)}
                        id="drdSALEID"
                      />
                    </div>
                  </div>
                }

                <div className="col-xs-12" style={{ display: 'none' }}>
                  <h5 className="col-xs-5"><b>Sản phẩm</b></h5>
                  <div className="col-xs-7 ">

                    <select disabled={this.state.ISEDIT} ref="FEEID" className="form-control">
                      {
                        this.renderListOption(this.state.data)
                      }
                    </select>

                  </div>
                </div>
                {
                  SRTYPE === SRTYPE_SW ? <div>
                    <div className="col-xs-12">
                      <h5 className="col-xs-5"><b>{this.props.strings.vfmcodesw}</b></h5>
                      <div className="col-xs-7 customSelect2">
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
                    </div>
                    <div className="col-xs-12" style={{ display: 'none' }}>
                      <h5 className="col-xs-5"><b>Sản phẩm hoán đổi</b></h5>
                      <div className="col-xs-7 ">

                        <select disabled={this.state.ISEDIT} ref="FEEIDHOANDOI" className="form-control">

                          {
                            this.renderListOptionhoandoi(this.state.datahoandoi)
                          }

                        </select>

                      </div>
                    </div>
                  </div> : null
                }
                {renderAMOUNTSLBan}
                <div className="col-xs-12 mgt-0 pdt-0" style={{ height: "32px" }}>
                  <div className="col-xs-3" style={{ float: "right" }}>
                    <input style={{ textTransform: 'uppercase', width: '120px' }} type="reset" onClick={this.refresh.bind(this)} className="col-xs-offset-1 col-xs-3 btn btn-default inner45-btn" defaultValue={this.props.strings.refreshtitle} id="btrefesh" />
                  </div>
                  <div className="col-xs-4" style={{ float: "right" }}>
                    {!this.state.ISEDIT ?
                      <input style={{ border: 'none', float: 'left', fontWeight: 'bold', width: '120px', textTransform: 'uppercase', marginLeft: '0px', backgroundColor: strColorSRTYPE }} type="button" onClick={this.handleAdd.bind(this)} className="col-xs-3 btn btn-primary inner45-btn" defaultValue={strSRTYPE} id="btnBuyorSell" /> :
                      <input style={{ textTransform: 'uppercase', width: '120px', fontWeight: 'bold' }} type="button"
                        onClick={this.checkConfirm.bind(this, "edit")}
                        className="col-xs-3 btn btn-primary inner45-btn" defaultValue={this.props.strings.btnUpdate} id="btupdate" />}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xs-6 pdr-0 pdt-10">
              <div className="inner55 col-md-12" style={{ border: "1px solid #ddd", borderRadius: "3px", marginBottom: "20px", marginTop: "0px", paddingBottom: "2px" }}>
                <div style={{ marginTop: "-2px", marginBottom: "-4px" }} className="inner55-default col-md-12">
                  <div className="col-xs-12">
                    <div className="col-xs-8" style={{ padding: '0px', marginTop: '2px', marginBottom: '2px' }}>
                      <div style={{ marginTop: "-17px" }} className="col-xs-12">
                        <label className="col-xs-11 inner55-title" style={{ fontWeight: "bold", paddingLeft: '0px' }}>{this.props.strings.info}</label>
                      </div>
                      <div className="col-xs-12" style={{ padding: '0px', marginTop: "0px" }}>
                        <h5 className="col-xs-4" style={{ padding: '0px' }}>{this.props.strings.fullname}</h5>
                        <div className="col-xs-7 col-xs-offset-1" style={{ padding: '0px' }} >
                          <input disabled value={this.state.AccountInfo.FULLNAME ? this.state.AccountInfo.FULLNAME : ''} className="form-control" disabled id="txtfullname" />
                        </div>
                      </div>
                      <div className="col-xs-12" style={{ padding: '0px', marginTop: '5px' }}>
                        <h5 className="col-xs-4" style={{ padding: '0px' }}>{this.props.strings.idcode}</h5>
                        <div className="col-xs-7 col-xs-offset-1" style={{ padding: '0px' }}>
                          <input disabled value={this.state.AccountInfo.IDCODE ? this.state.AccountInfo.IDCODE : ''} className="form-control" disabled id="txtidcode" />
                        </div>
                      </div>
                      <div className="col-xs-12" style={{ padding: '0px', marginTop: '5px', marginBottom: "-12px" }}>
                        <h5 className="col-xs-4" style={{ padding: '0px' }}>{this.props.strings.iddate}</h5>
                        <div className="col-xs-7 col-xs-offset-1" style={{ padding: '0px' }}>
                          <input disabled value={this.state.AccountInfo.IDDATE ? this.state.AccountInfo.IDDATE : ''} className="form-control" disabled id="txtiddate" />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-4" style={{ padding: "3px", marginTop: '-29px' }}>
                      <input type="button" style={{ width: "100%", marginTop: '31px', marginBottom: '6px' }} className="btn btn-primary" onClick={this.ThongTinUyQuyen.bind(this)} defaultValue={this.props.strings.authinfo} id="btauthinfo" />
                      <label id="btidscan" style={{ width: "100%", paddingTop: "10px", paddingBottom: "10px", textAlign: 'center' }} onClick={this.showCMND.bind(this)} className="btn btn-primary">{this.props.strings.idscan}
                        {renderFileAnhCMT}
                      </label>
                    </div>
                  </div>
                </div>
                {renderThongTinQuy}
              </div>
            </div>
          </div>
        </form>
        <CMND OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} CUSTODYCD={this.state.AccountInfo.CUSTODYCD} />
        <PopupViewInfo isSIP={false} TRDATE={this.state.TRDATE} OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} data={this.state.dataViewInfo} />
        <PopupConfirmOrder isSIP={false} checkShowViewInfo={this.checkShowViewInfo.bind(this)} TRDATE={this.state.TRDATE} ISOTP_CONFIRM={isShowOtpConfirm} OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} onChange={this.onChangeOTP.bind(this)} FULLNAME={this.state.AccountInfo ? this.state.AccountInfo.FULLNAME : ''} title={this.state.titleConfirm} data={this.state} handleSubmit={this.handleSubmit.bind(this)} />
        <UyQuyen CUSTODYCD={this.state.AccountInfo.CUSTODYCD} OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} />
        <ChiTiet OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} CODEID={this.state.CODEID ? this.state.CODEID.value : ''} CUSTODYCD={this.state.CUSTODYCD ? this.state.CUSTODYCD.value : ''} onClickConfirm={this.onClickDetailSell.bind(this)} />
        <div style={{ marginTop: '0px' }} className="col-xs-12 pdl-0 pdr-0 tab-datlenh">
          <ul className="nav nav-tabs">
            <li style={{ marginBottom: '-4px' }} className="active"><a data-toggle="tab" href="#tab1" id="#tab1"><b>{this.props.strings.orderbook}</b></a></li>
            <li><a data-toggle="tab" href="#tab2" id="#tab2"> <b>{this.props.strings.vfmcategory}</b></a></li>
          </ul>
          <div style={{ marginTop: "-20px" }} className="tab-content">
            <div id="tab1" className="tab-pane fade in active">
              <SoLenh eventDelete={this.eventDelete.bind(this)} eventEdit={this.eventEdit.bind(this)} datapage={this.props.datapage} auth={this.props.auth} custodycd={this.state.CUSTODYCD} />
            </div>
            <div id="tab2" className="tab-pane fade">
              <SoDuHienCo OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} />
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
  tradingdate: state.systemdate.tradingdate
});
const decorators = flow([
  connect(stateToProps),
  translate('DatLenh')
]);
module.exports = decorators(DatLenh);
