import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { showModalCMND, showModalSipDetail, showModalThongTinUyQuyen, closeModalThongTinUyQuyen, showModalChiTiet, showModalConfirm, closeModalConfirm, showModalViewInfo } from 'actionDatLenh';
import { showNotifi } from 'app/action/actionNotification.js';
import DropdownFactory from '../../../utils/DropdownFactory'
import { toast } from 'react-toastify'
import PopupViewInfo from './components/PopupViewInfo'
import PopupConfirmOrder from './components/PopupConfirmOrder'
import RulesModal from './components/RulesModal'
import ModalDialog from 'app/utils/Dialog/ModalDialog'
import ModalDialogCheckOrder from 'app/utils/Dialog/ModalDialogCheckOrder'
import Select from 'react-select'
import 'react-select/dist/react-select.css';
import RestfulUtils from '../../../utils/RestfulUtils'
import TableCompareOrder from './components/TableCompareOrder.js';
import ThongTinQuyDTDK from './components/ThongTinQuyDTDK.js'
import UyQuyen from 'UyQuyen'
import ChiTiet from 'ChiTiet'
import SoDuHienCo from './components/SoDuHienCo.js'
import CMND from './components/CMND'
import NumberInput from 'app/utils/input/NumberInput'
import { SRTYPE_SW, SRTYPE_NS, SRTYPE_NR, SRTYPE_AR, SRTYPE_CR, COLORGRAY, METHODS_FIX, METHODS_FLEX } from '../../../Helpers';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import ModalSipDetail from './components/ModalSipDetail';
import ModalTimKiemFullname from 'app/utils/Dialog/ModalTimKiemFullname.js'
import NumberFormat from 'react-number-format';
import SipSellList from './components/SipSellList'
function setDefaultSALETYPE(value) {
  $("#drdSALETYPE").val(value);
}
class DauTuDinhKi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModalSearch: false,
      ishowViewInfo: false,
      my_symbol: '',
      dataViewInfo: {},
      dataGet: {},
      checkFields: [
        { name: "CUSTODYCD", id: "drdCUSTODYCD", isObj: true },
        { name: "SRTYPE", id: "drdSRTYPE", isObj: false },
        // { name: "CODEID", id: "drdCODEID", isObj: true },
        { name: "PRODUCTID", id: "drdPRODUCTID", isObj: true },
        { name: "TRADINGCYCLE", id: "drdTRADINGCYCLE", isObj: true },
        { name: "CODEIDHOANDOI", id: "drdCODEIDHOANDOI", isObj: true },
        { name: "SALETYPE", id: "drdSALETYPE", isObj: true },
        { name: "SALEID", id: "drdSALEID", isObj: true },
        { name: "AMOUNT", id: "txtAMOUNT", isObj: true },
        { name: "QTTY", id: "txtQTTY", isObj: true }
      ],
      ISEDIT: false,
      showModalDetail: false,
      showModalDetailCheckOrder: false,
      AccountDetail: [],
      ListSALETYPE: [],
      TLID: '',
      image: { value: null, validate: "success" },
      SRTYPE: SRTYPE_NS,
      SALETYPE: '',
      SALEID: '',
      CACHESALEACCTNO: '',
      haveError: false,
      CUSTODYCD: '',
      CODEID: '',
      PRODUCTID: '',
      listProducts: [],
      TRADINGCYCLE: '',
      listTRADINGCYCLE: [],
      TRADINGID: '',
      listTRADINGID: [],
      AMT: '',
      CODEIDHOANDOI: '',
      WID: '',
      data: [],
      datahoandoi: [],
      ORDERID: '',
      ORGORDERID: '',
      acclist: [],
      FEEID: '000001',
      SYMBOL: { value: null, validate: null, tooltip: "Không được để trống !!" },
      SYMBOLHoanDoi: { value: null, validate: null, tooltip: "Không được để trống !!" },
      SanPham: { value: null, validate: "success", tooltip: "Không được để trống !!" },
      QTTY: { value: 0, validate: null, tooltip: "Không được để trống !!" },
      AMOUNT: { value: 0, validate: null },
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
      listSaleid: [],
      rulesOpen: false, // Popup điều khoản mua bán
      canRegis: true
    }
  }

  getOptions(input) {
    return RestfulUtils.post('/account/search_all', { key: input, detail: "DETAIL" })
      .then((res) => {
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
          this.getInforAccount(data[0].label);
        }
        this.setState({ AccountDetail: res })
        return { options: data };
      })
  }
  getOptionsSYMBOL(input) {
    return RestfulUtils.post('/allcode/search_all_funds', { key: input })
      .then((res) => {
        let i =0;
        let data = []
        for (i = 0; i< res.length; i ++){
          if ((res[i].label != 'MBGF') && (res[i].label != 'MBBOND')){
            data.push(res[i]);
          }
        }
        return { options: data }
      })
  }
  // getOptionsPRODUCT(input) {
  //   let data = {
  //     p_language: this.props.language,
  //     OBJNAME: this.props.datapage.OBJNAME,
  //     p_sptype: 'S',
  //   }
  //   return RestfulUtils.post('/fund/getlistproduct', data)
  //     .then((res) => {
  //       return { options: res.DT.data };
  //     })
  // }
  getOptionsPRODUCTByCodeid(codeid) {
    let data = {
      p_language: this.props.language,
      OBJNAME: this.props.datapage.OBJNAME,
      p_sptype: 'S',
      p_codeid: codeid
    }
    return RestfulUtils.post('/fund/getlistproduct', data)
      .then((res) => {
        this.setState({
          PRODUCTID: '',
          listProducts: res.DT.data
        })
      })
  }
  getOptionsTradingcycle(spcode) {
    let data = {
      p_language: this.props.language,
      OBJNAME: this.props.datapage.OBJNAME,
      p_spcode: spcode ? spcode : 'nodata',
    }
    return RestfulUtils.post('/fund/getListTradingCycle', data)
      .then((res) => {
        let dataOptions = res.DT.data.map((item) => {
          return {
            value: item.CYCLEIDVSD,
            label: item.CONTENT,
          }
        });
        this.setState({
          TRADINGCYCLE: '',
          listTRADINGCYCLE: dataOptions
        })
      })
  }
  getOptionsSALEID(input) {
    let CACHESALEACCTNO = this.state.CACHESALEACCTNO
    return RestfulUtils.post('/allcode/search_all_salemember', { key: input })
      .then((res) => {
        let data = []
        res.map(function (item) {
          if (item.value != CACHESALEACCTNO) {
            data.push(item)
          }
          return null
        })
        return { options: data }
      })
  }
  getOptionsSYMBOLHOANDOI(input) {
    let self = this;
	let data = [];
    if (CODEID.value) {
      RestfulUtils.post('/Allcode/get_swsymbol', { CODEID: CODEID.value, SYMBOL: CODEID.label })
        .then(res => {
			let i =0;
			for (i = 0; i< res.length; i ++){
			if ((res[i].label != 'MBGF') && (res[i].label != 'MBBOND')){
            data.push(res[i]);
          }
        }
        
          self.setState({ optionSYMBOLHOANDOI: data })
        })
    }
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
  async onChange(e) {
    var self = this;
    if (e) {
      this.getInforAccount(e.label);
      this.getOptionsSaleidByCodeid(this.state.CODEID.value);
      let listSYMBOL = await this.getListOptionSymbol(this.state.SRTYPE, e);
      if (listSYMBOL.length > 0)
        this.setState({ listSYMBOL })
      else
        this.setState({ listSYMBOL: [], data: [], datahoandoi: [], CODEIDHOANDOI: '' })
      if (this.state.CODEID)
        if (this.state.CODEID.value)
          this.getDataSymbol(e.label, this.state.CODEID.value)
    }
    else {
      await this.setState({ ...this.state, AccountInfo: {} });
    }
    this.setState({ ...this.state, CUSTODYCD: e });
    this.getSoDu(e.value, this.state.CODEID.value)
  }
  getListOptionSymbol(SRTYPE, CUSTODYCD) {
    if (CUSTODYCD && CUSTODYCD.label && CUSTODYCD.CUSTID) {
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
  closeModalDetailCheckOrder() {
    this.setState({ showModalDetailCheckOrder: false })
  }
  checkConfirm(ACTION, data, event) {
    this.setState({ showModalDetail: true, ACTION: ACTION, datarow: data })
  }
  checkConfirmCheckOrder(ACTION, data, event) {
    this.setState({ showModalDetailCheckOrder: true, ACTION: ACTION, datarow: data })
  }
  set_data_feettypes(CODEID) {
    RestfulUtils.post('/allcode/getlist_feetypes', { CODEID: CODEID })
      .then((res) => {
        this.setState({
          data: res.data
        })

      })
  }
  set_data_feettypeshoandoi(CODEID) {
    RestfulUtils.post('/allcode/getlist_feetypes', { CODEID: CODEID })
      .then((res) => {
        this.setState({
          datahoandoi: res.data
        })
      })
  }
  // getSessionInfo(CODEID) {
  //   let self = this
  //   RestfulUtils.post('/order/getSessionInfo', { CODEID: CODEID, TYPE: 'CLSORD' }).then((resData) => {
  //     if (resData.EC == 0) {
  //       if (resData.DT[0].SIPAMT != null) {
  //         self.setState({
  //           AMOUNT: { value: resData.DT[0].SIPAMT }
  //         })
  //       } else {
  //         self.setState({
  //           AMOUNT: { value: 0 }
  //         })
  //       }
  //     }
  //   })
  // }
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
                this.setState({ ...this.state, sellAvlBalance: resData.DT.data[0].NOBLOCKAVLTRADESIP })
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
  onChangeSYMBOL(e) {
    if (e && e.value) {
      this.getOptionsPRODUCTByCodeid(e.value);
      this.getOptionsSaleidByCodeid(e.value);
      if (this.state.CUSTODYCD) {
        if (this.state.CUSTODYCD.value) {
          this.getDataSymbol(this.state.CUSTODYCD.value, e.value)
        }
      }
      // this.getSessionInfo(codeID);
      this.getTradingdateByCodeID(e.value)
      this.getSoDu(this.state.CUSTODYCD.value, e.value)
      this.setState({
        CODEID: e,
        my_symbol: e.value,
        TRADINGID: { value: '', label: '' },
        TRADINGCYCLE: '',
        listTRADINGCYCLE: [],
      })
    }
    else
      this.setState({
        CODEID: '',
        my_symbol: '',
        PRODUCTID: '',
        listProducts: [],
        TRADINGCYCLE: '',
        listTRADINGCYCLE: [],
      })
  }
  onChangePRODUCT(e) {
    if (e && e.value) {
      let codeID = e.CODEID;
      this.getOptionsTradingcycle(e.SPCODE);
      if (this.state.CUSTODYCD) {
        if (this.state.CUSTODYCD.value) {
          this.getDataSymbol(this.state.CUSTODYCD.value, codeID)
        }
      }
      this.setState({
        PRODUCTID: e,
        AMOUNT: { value: e.METHODS === METHODS_FLEX ? e.MINAMT : 0 },
      })
    }
    else
      this.setState({
        PRODUCTID: '',
        TRADINGCYCLE: '',
        listTRADINGCYCLE: [],
      })
  }
  onChangeTradingCycle(e) {
    this.setState({
      TRADINGCYCLE: e && e.value ? e : '',
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
  getListTRADINGID(CODEID) {
    let self = this;
    RestfulUtils.post('/fund/get_tradingid', {
      CODEID: CODEID, language: this.props.language, OBJNAME: this.props.datapage.OBJNAME
    })
      .then(res => {
        self.setState({ listTRADINGID: res.DT })
      })
  }
  getSoDu(CUSTODYCD, CODEID) {
    let self = this;
    RestfulUtils.post('/fund/get_sodu_datlenh', {
      CUSTODYCD: CUSTODYCD, CODEID: CODEID, SRTYPE: 'SP', language: this.props.language, OBJNAME: this.props.datapage.OBJNAME
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
  async getSYMBOLHOANDOI(input) {

    return { options: this.state.optionSYMBOLHOANDOI };
  }
  onChangeSYMBOLHOANDOI(e) {
    var that = this;
    let { SRTYPE, CUSTODYCD } = this.state;
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
      case "PRODUCTID":
        if (value == '')
          mssgerr = this.props.strings.requiredproductid;
        break;
      case "TRADINGCYCLE":
        if (this.state.SRTYPE === SRTYPE_NS && value == '')
          mssgerr = this.props.strings.requiredtradingcycle;
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
      var datanotify = {
        type: "",
        header: "",
        content: ""
      }
      datanotify.type = "error";
      datanotify.content = mssgerr;
      this.props.showNotifi(datanotify);
      window.$(`#${id}`).focus();
    }
    return mssgerr;
  }

  handleConfirm(event) {
    if (event)
      event.preventDefault();
    var mssgerr = '';
    let title = '';
    switch (this.state.action) {
      case "C":
        title = this.props.strings.confirmTitle; // XÁC NHẬN LỆNH ĐỊNH KỲ SIP
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
      let v_objname = this.props.datapage ? this.props.datapage.OBJNAME : '';
      let SALEID = state.SALETYPE == '003' ? state.SALEID ? state.SALEID.value : '' : state.SALETYPE
      var Obj = this.state.action !== "D" ? {
        ACTION: this.state.action,
        CUSTODYCD: state.CUSTODYCD.value,
        SRTYPE: state.SRTYPE,
        CODEID: state.CODEID ? state.CODEID.value : '',
        SPCODE: state.PRODUCTID ? state.PRODUCTID.SPCODE : '',
        TRADINGCYCLE: state.TRADINGCYCLE ? state.TRADINGCYCLE.value : '',
        AMOUNT: state.AMOUNT ? state.AMOUNT.value : '',
        SEDTLID: state.SEDTLID,
        QTTY: state.QTTY ? state.QTTY.value : '',
        FEEID: this.refs.FEEID ? this.refs.FEEID.value : '',
        SWID: this.refs.FEEIDHOANDOI ? this.refs.FEEIDHOANDOI.value : '',
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
          SPCODE: this.state.CancelData ? this.state.CancelData.SPCODE : '',
          TRADINGCYCLE: this.state.CancelData ? this.state.CancelData.CYCLE : '',
          AMOUNT: 0,
          SEDTLID: this.state.CancelData ? this.state.CancelData.SEDTLID : '',
          QTTY: 0,
          FEEID: this.state.CancelData ? this.state.CancelData.FEEID : '',
          SWID: this.state.CancelData ? this.state.CancelData.SWID : '',
          SWCODEID: this.state.CancelData ? this.state.CancelData.SWCODEID : '',
          SALETYPE: state.SALETYPE ? state.SALETYPE : '',
          SALEID: SALEID ? SALEID : '',
          ORGORDERID: this.state.CancelData ? this.state.CancelData.ORDERID : '',
          OBJNAME: v_objname
        };
      var that = this;
      if (Obj.SRTYPE == SRTYPE_NR || Obj.SRTYPE == SRTYPE_AR || Obj.SRTYPE == SRTYPE_CR)
        RestfulUtils.posttrans('/order/preadd', { ...Obj, language: this.props.language }).then((resData) => {
          if (resData.EC == 0) {
            that.setState({ ...that.state, ORDERID: resData.DT.p_orderid, ORGORDERID: Obj.ORGORDERID, titleConfirm: title })
            that.props.showModalConfirm();
          }
          else {
            datanotify.type = "error";
            datanotify.content = resData.EM
            that.props.showNotifi(datanotify);
          }
        });

      else
        RestfulUtils.posttrans('/order/preplacesip', { ...Obj, language: this.props.language }).then((resData) => {
          if (resData.EC == 0) {
            that.setState({ ...that.state, ORDERID: resData.DT.p_orderid, ORGORDERID: Obj.ORGORDERID, titleConfirm: title })
            that.props.showModalConfirm();
          }
          else {
            datanotify.type = "error";
            datanotify.content = resData.EM
            that.props.showNotifi(datanotify);
          }
        });

    }
  }
  async handleSubmit(event) {
    var that = this;
    var err = 0;
    await RestfulUtils.post('/order/getfacctnobysymbol', { symbol: this.state.my_symbol, custodycd: this.state.AccountInfo.CUSTODYCD, srtype: 'SP', language: this.props.language }).then((resData) => {
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
    let v_objname = this.props.datapage ? this.props.datapage.OBJNAME : '';
    var Obj = this.state.action !== 'D' ? {
      TRADINGID: state.TRADINGID.value,
      CUSTODYCD: state.CUSTODYCD.value,
      SRTYPE: state.SRTYPE,
      CODEID: state.CODEID ? state.CODEID.value : '',
      SPCODE: state.PRODUCTID ? state.PRODUCTID.SPCODE : '',
      TRADINGCYCLE: state.TRADINGCYCLE ? state.TRADINGCYCLE.value : '',
      AMOUNT: state.AMOUNT ? state.AMOUNT.value : '',
      SEDTLID: state.SEDTLID,
      QTTY: state.QTTY ? state.QTTY.value : '',
      FEEID: this.refs.FEEID ? this.refs.FEEID.value : '',
      SWID: this.refs.FEEIDHOANDOI ? this.refs.FEEIDHOANDOI.value : '',
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
        SPCODE: this.state.CancelData ? this.state.CancelData.SPCODE : '',
        TRADINGCYCLE: this.state.CancelData ? this.state.CancelData.CYCLE : '',
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
    var { dispatch } = this.props;
    this.props.closeModalConfirm();
    if (event)
      event.preventDefault();
    var datanotify = {
      type: "",
      header: "",
      content: ""
    }
    if (Obj.SRTYPE == SRTYPE_NR || Obj.SRTYPE == SRTYPE_AR || Obj.SRTYPE == SRTYPE_CR) {
      if (that.state.action == 'C')
        RestfulUtils.posttrans('/order/add', { ...Obj, language: that.props.language }).then((resData) => {
          if (resData.EC == 0) {
            datanotify.type = "success";
            datanotify.content = that.props.strings.placeSipSellSuccess;
            that.props.showNotifi(datanotify);
            that.refresh()
          }
          else {
            datanotify.type = "error";
            datanotify.content = resData.EM;
            that.props.showNotifi(datanotify);
          }
        });
      else if (that.state.action == 'U')
        RestfulUtils.posttrans('/order/update', { ...Obj, language: that.props.language }).then((resData) => {
          if (resData.EC == 0) {
            datanotify.type = "success";
            datanotify.content = that.props.strings.updateSipSellSuccess;
            that.props.showNotifi(datanotify);
            that.refresh()
          }
          else {
            datanotify.type = "error";
            datanotify.content = resData.EM;
            that.props.showNotifi(datanotify);
          }
        });
      else
        RestfulUtils.posttrans('/order/cancel', { ...Obj, language: that.props.language }).then((resData) => {
          if (resData.EC == 0) {
            datanotify.type = "success";
            datanotify.content = that.props.strings.cancelSipSuccess;
            that.props.showNotifi(datanotify);
            that.refreshDel()
          }
          else {
            datanotify.type = "error";
            datanotify.content = resData.EM;
            that.props.showNotifi(datanotify);
          }
        });
    }
    else
      RestfulUtils.posttrans('/order/placesip', { ...Obj, language: that.props.language, ACTION: that.state.action }).then((resData) => {
        var { dispatch } = that.props;
        if (resData.EC == 0) {
          let strcontent = that.props.strings.placeSipSuccess
          switch (that.state.action) {
            case 'U':
              strcontent = that.props.strings.updateSipSuccess
              break;
            case 'D':
              strcontent = that.props.strings.cancelSipSuccess
            default:
              break;
          }
          datanotify.type = "success";
          datanotify.content = strcontent;
          that.props.showNotifi(datanotify);
          if (Obj.SRTYPE == 'NS' && that.state.action == 'C' && this.state.ishowViewInfo) dispatch(showModalViewInfo());
          that.refresh()
        }
        else {
          datanotify.type = "error";
          datanotify.content = resData.EM;
          that.props.showNotifi(datanotify);
        }
      });
  }
  async eventDelete(row, isSell) {//show confirm huy lenh, isSell neu so lenh ban la true
    if (row) {
      this.getInforAccount(row.CUSTODYCD)
      this.getTradingdateByCodeID(row.CODEID)
      await this.setState({ ...this.state, CancelData: { ...row, ORDERVALUE: isSell ? row.ORDERVALUE : row.AMT, ORDERID: isSell ? row.ORDERID : row.SPID }, action: 'D', ISOTP_CONFIRM: row.ISOTP_CONFIRM })
      this.handleConfirm()
    }

  }
  async eventEdit(row, isSell) {
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
        WID: row.WID,
        FEEID: row.FEEID,
        action: 'U',
        ORGORDERID: isSell ? row.ORDERID : row.SPID,
        AMOUNT: { value: parseFloat(row.AMT) },
        OLDAMOUNT: { value: parseFloat(row.AMT) },
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
      if (this.state.CUSTODYCD && this.state.CODEID)
        if (this.state.CUSTODYCD.value && this.state.CODEID.value)
          this.getDataSymbol(this.state.CUSTODYCD.value, this.state.CODEID.value)
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
    this.props.showModalThongTinUyQuyen()
  }
  ModalChiTiet() {
    if (this.state.CODEID && this.state.CODEID.value != '') {
      this.props.showModalChiTiet();
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

  // Đóng/Mở phần điều khoản
  onClickBuyBtn = () => {
    // this.handleConfirm()
    const { action, checkFields } = this.state
    let mssgerr = '';
    if ( action !== 'D') {
      for (let index = 0; index < checkFields.length; index++) {
        const element = checkFields[index];
        mssgerr = this.checkValid(element.name, element.id, element.isObj);
        if (mssgerr !== '')
          break;
      }
    }
    if (mssgerr === '' ) {
      this.setState({
        rulesOpen: true
      })
    }
  }

  // isAllow
  isAllow = (value) => {
    let { rulesOpen } = this.state
    if (rulesOpen && value) {
      this.handleAdd()
      this.setState({
        rulesOpen: false,
        canRegis: true
      })
    }

    if ( !value ) {
      this.setState({
        canRegis: false
      })
    }
  }

  onCloseRulesModal = () => {
    this.setState({
      rulesOpen: false
    })
  }

  async handleAdd() {
    await this.setState({ ...this.state, action: 'C', ISOTP_CONFIRM: 'Y' })
    let CUSTODYCD = this.state.CUSTODYCD.value
    let CODEID = this.state.CODEID.value
    let AccountDetail = this.state.AccountDetail
    let ISINTERNALORDER = false
    if (AccountDetail && CUSTODYCD && CODEID) {
      AccountDetail.map(function (item) {
        if (item.detail && item.detail.CUSTODYCD == CUSTODYCD && item.detail.LISTCODEIDINTERNAL == CODEID) {
          ISINTERNALORDER = true
          return null
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
  refreshDel() {
    this.setState({
      CancelData: {},
      AccountInfo: {}
    })
  }
  refresh() {
    const { user } = this.props.auth
    let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : false : false;
    if (!isCustom) {
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
        TRDATE: '',
        // AccountDetail: [],
        ListSALETYPE: [],
        SALETYPE: '',
        SALEID: '',
        CACHESALEACCTNO: '',
      })
    }
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
        //AccountInfo: {},
        OTP: '',
        TRDATE: '',
        // AccountDetail: [],
        //ListSALETYPE: [],
        SALETYPE: '0000000',
        SALEID: '',
        CACHESALEACCTNO: '',
      })
  }

  onValueChange(type, data) {
    this.state[type].value = data.value.replace(/^0+/, '')
    this.state[type].formattedValue = data.formattedValue
    this.setState(this.state)
  }
  async getInforAccount(CUSTODYCD) {
    let self = this
    await RestfulUtils.post('/account/get_generalinfor', { CUSTODYCD: CUSTODYCD, OBJNAME: this.props.datapage.OBJNAME }).then((resData) => {
      if (resData.EC == 0) {
        self.setState({ AccountInfo: resData.DT });
        let ListSALETYPE = []
        let CACHESALEACCTNO = ''
        let SALETYPE = ''
        let SALETID = { value: '', label: '' }
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
      let custid = AccountInfo.CUSTID
      RestfulUtils.post('/account/sync_cfauth', { CUSTID: custid, LANG: this.props.language, OBJNAME: this.props.datapage.OBJNAME }).then((resData) => {
      });
    }
  }
  // onChangeDropdownSALETYPE(type, event) {
  //   this.state[type] = event.value
  //   if (event.value != '003') this.state.SALEID = ''
  //   this.setState(this.state)
  // }
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
  viewSipDetail = (SIPID) => {
    this.setState({ ...this.state, SIPID: SIPID })
    this.props.showModalSipDetail()
  }
  formatNumber(nStr, decSeperate, groupSeperate) {
    nStr += '';
    let x = nStr.split(decSeperate);
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + groupSeperate + '$2');
    }
    return x1 + x2;
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
  closeModalSearch() {
    this.setState({ showModalSearch: false })
  }
  handleClickSearch() {
    this.setState({ showModalSearch: true })
  }
  selectCustodycd(data) {
    //this.setState({CUSTODYCD :data.CUSTODYCD})
    this.onChange({ label: data.CUSTODYCD, value: data.CUSTODYCD })
    // this.setState({ isFirstLoad: 'N' })
    // this.getInforAccount(data.CUSTODYCD);
    // this.setState({ ...this.state, CUSTODYCD: { label: data.CUSTODYCD, value: data.CUSTODYCD } });
    // this.getSoDu(data.CUSTODYCD, this.state.CODEID.value)
  }
  render() {
    const { user } = this.props.auth
    let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : false : false;
    let ISCUSTODYCD = this.state.CUSTODYCD ? this.state.CUSTODYCD.value ? true : false : false
    let isGroupUser = user ? (user.ISGROUPUSER ? true : false) : false;
    let disableCustodycdBox = this.state.ISEDIT || (isCustom && !isGroupUser);
    let isCodeid = this.state.CODEID != '' ? true : false;
    var that = this;
    var { SRTYPE, rulesOpen, canRegis } = this.state;
    var renderAMOUNTSLBan = null;
    var renderFileAnhCMT = null;
    if (this.state.image.validate === "warning") {
      renderFileAnhCMT = <span className="glyphicon glyphicon-remove pull-right"></span>;
    } else {
      renderFileAnhCMT = <span className="glyphicon glyphicon-ok pull-right"></span>;
    }
    var isShowOtpConfirm = 'Y';
    if (isCustom) { isShowOtpConfirm = this.state.ISOTP_CONFIRM }
    else { isShowOtpConfirm = 'N' }

    if (SRTYPE === "NS") {//mua
      renderAMOUNTSLBan =
        <span>
          <div className="col-xs-12">
            {this.state.PRODUCTID && this.state.PRODUCTID['METHODS'] === METHODS_FIX && (
              <div className="col-xs-12">
                <h5 className="col-xs-5"><b>{this.props.strings.buyvalue}</b></h5>
                <div className="col-xs-7">
                  <NumberInput className="form-control" value={this.state.AMOUNT ? this.state.AMOUNT.value : 0} onValueChange={this.onValueChange.bind(this, 'AMOUNT')} thousandSeparator={true} decimalScale={0} prefix={''} id="lblAMOUNT" />
                </div>
              </div>
            )}
            <h5 className="col-xs-12" style= {{paddingLeft:"15px",paddingRight:"15px"}}><i>{this.props.strings.thongbao1}</i></h5>
          </div>
          <div className="col-xs-12">
            <h5 className="col-xs-12" style= {{paddingLeft:"15px",paddingRight:"15px"}}><i>{this.props.strings.thongbao2}</i></h5>
            {/* <div className="col-xs-7">
              <NumberFormat value={parseInt(this.state.AMT ? this.state.AMT > 0 ? this.state.AMT : 0 :0)} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={''} />
            </div> */}
          </div>
        </span>
    } else if (SRTYPE === "NR") {//ban
      renderAMOUNTSLBan =
        <span>
          <div className="col-xs-12">
            <h5 className="col-xs-5"><b>{this.props.strings.sipbalance}</b></h5>
            <div className="col-xs-7"><h5><NumberInput displayType='text' id="txtSellAvlBalance" value={this.state.sellAvlBalance} thousandSeparator={true} decimalScale={2} prefix={''} /></h5></div>
          </div>
          <div className="col-xs-12">
            <h5 className="col-xs-5"><b>{this.props.strings.sellvaluesell}</b></h5>
            <div className="col-xs-7">
              <NumberInput className="form-control" value={this.state.QTTY.value} onValueChange={this.onValueChange.bind(this, 'QTTY')} thousandSeparator={true} decimalScale={2} prefix={''} id="txtQTTY" />
            </div>
          </div>
        </span>
    }
    else {//hoan doi
      renderAMOUNTSLBan =
        <span>
          <div className="col-xs-12">
            <h5 className="col-xs-5"><b>{this.props.strings.sipbalance}</b></h5>
            <div className="col-xs-7"><h5><NumberInput displayType='text' id="txtSellAvlBalance" value={this.state.sellAvlBalance} thousandSeparator={true} decimalScale={2} prefix={''} /></h5></div>
          </div>
          <div className="col-xs-12">
            <h5 className="col-xs-5"><b>{this.props.strings.sellvalue}</b></h5>
            <div className="col-xs-7">
              <NumberInput className="form-control" value={this.state.QTTY.value} onValueChange={this.onValueChange.bind(this, 'QTTY')} thousandSeparator={true} decimalScale={2} prefix={''} id="txtQTTY" />
            </div>
          </div>
        </span>
    }

    var renderThongTinQuy =
      SRTYPE === "SW" ?
        <div><ThongTinQuyDTDK CODEID={this.state.CODEID} onChange={this.handleChange.bind(this)} type="mua" /><ThongTinQuyDTDK CODEID={this.state.CODEIDHOANDOI} onChange={this.handleChange.bind(this)} type="ban" /></div>
        :
        <ThongTinQuyDTDK CODEID={this.state.CODEID} onChange={this.handleChange.bind(this)} type={SRTYPE == "NR" ? "ban" : "mua"} />;
    let strSRTYPE = this.state.SRTYPE == "NR" ? this.props.strings.stringsell : this.state.SRTYPE == "NS" ? this.props.strings.stringbuy : this.props.strings.stringswap;
    let strColorSRTYPE = this.state.SRTYPE == "NR" ? COLORGRAY : this.state.SRTYPE == "NS" ? COLORGRAY : COLORGRAY;
    let ISSALETYPE = this.state.SALETYPE == '003' ? false : true
    let ListSALETYPE = this.state.ListSALETYPE
    return (
      <div className="container panel panel-default margintopNewUI" style={{ padding: "10px" }}>
      <ModalTimKiemFullname onSelectRow={this.selectCustodycd.bind(this)} showModal={this.state.showModalSearch} closeModalTimKiem={this.closeModalSearch.bind(this)} />
        <ModalDialog confirmPopup={this.confirmPopup.bind(this)} ACTION={this.state.ACTION} data={this.state.datarow} showModalDetail={this.state.showModalDetail} closeModalDetail={this.closeModalDetail.bind(this)} />
        <ModalDialogCheckOrder confirmPopupCheckOrder={this.confirmPopupCheckOrder.bind(this)} ACTION={this.state.ACTION} data={this.state.datarow} showModalDetail={this.state.showModalDetailCheckOrder} closeModalDetail={this.closeModalDetailCheckOrder.bind(this)} />
        <div className="title-content">{this.props.strings.investtitle}</div>
        <form method="POST" action="#">
          <div className="inner datlenh">
            <div className="col-xs-6 pdl-0 pdt-10">
              <div className="inner45 col-md-12" style={{ border: "1px solid #ddd", borderRadius: "3px", marginLeft: "0px", paddingBottom: "27px", marginTop: "0px" }}>
                {/* Số hiệu tài khoản giao dịch */}
                <div className="col-xs-12">
                  <h5 className="col-xs-5"><b>{this.props.strings.custodycd}</b></h5>
                  <div className="col-xs-7 customSelect2" >
                  {!isCustom ?
                      <div className="col-xs-8" style={{ padding: "0 0 0 0" }}>
                        <Select.Async
                          name="form-field-name"
                          disabled={disableCustodycdBox}
                          placeholder={this.props.strings.custodycd}
                          loadOptions={this.getOptions.bind(this)}
                          value={this.state.CUSTODYCD}
                          onChange={this.onChange.bind(this)}
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
                          onChange={this.onChange.bind(this)}
                          id="drdCUSTODYCD"
                          ref="refCUSTODYCD"
                        />
                      </div>}
                  
                  {!isCustom &&<div className="col-xs-4" style  = {{}}>
                      <input style={{paddingLeft:"0px", margin: "0 0 0 0", minHeight:"34px" }} type="button" onClick={this.handleClickSearch.bind(this)}
                        className="pull-left btn btndangeralt" defaultValue={this.props.strings.searchfullname} id="btupdate22" />
                    </div>}
                  </div>
                </div>
                {/* Loại lệnh */}
                <div className="col-xs-12">
                  <h5 className="col-xs-5"><b>{this.props.strings.ordertype}</b></h5>
                  <div className="col-xs-7">
                    <DropdownFactory CDVAL={this.state.SRTYPE} value="SRTYPE" CDTYPE="SA" CDNAME="FOSRTYPESIP2" onChange={this.onChangeDropdown.bind(this)} disabled={this.state.ISEDIT} ID="drdSRTYPE" />
                  </div>
                </div>
                {/* Mã CCQ */}
                <div className="col-xs-12">
                  <h5 className="col-xs-5"><b>{this.props.strings.vfmcode}</b></h5>
                  <div className="col-xs-7 customSelect2">
                    <Select.Async
                      name="form-field-name"
                      disabled={this.state.ISEDIT}
                      placeholder={this.props.strings.inputCCQ}
                      loadOptions={this.getOptionsSYMBOL.bind(this)}
                      value={this.state.CODEID}
                      onChange={this.onChangeSYMBOL.bind(this)}
                      id="drdCODEID"
                    />
                  </div>
                </div>
                {/* Mã sản phẩm */}
                <div className="col-xs-12">
                  <h5 className="col-xs-5"><b>{this.props.strings.sipProduct}</b></h5>
                  <div className="col-xs-7 customSelect2">
                    <Select
                      name="form-field-name"
                      disabled={this.state.ISEDIT}
                      placeholder={this.props.strings.inputsipProduct}
                      options={this.state.listProducts}
                      value={this.state.PRODUCTID}
                      onChange={this.onChangePRODUCT.bind(this)}
                      id="drdPRODUCTID"
                    />
                  </div>
                </div>
                {/* Loại sản phẩm */}
                <div className="col-xs-12">
                  <h5 className="col-xs-5"><b>{this.props.strings.sipProductType}</b></h5>
                  <div className="col-xs-7">
                    <input disabled={true} className="form-control" type="text" value={this.state.PRODUCTID && this.state.PRODUCTID.DESC_METHODS} />
                  </div>
                </div>
                {/* Chu kỳ giao dịch: hiển thị với lệnh mua */}
                {SRTYPE === "NS" && (
                  <div className="col-xs-12">
                    <h5 className="col-xs-5"><b>{this.props.strings.tradingcycle}</b></h5>
                    <div className="col-xs-7 customSelect2">
                      <Select
                        name="form-field-name"
                        disabled={this.state.ISEDIT}
                        placeholder={this.props.strings.inputtradingcycle}
                        options={this.state.listTRADINGCYCLE}
                        value={this.state.TRADINGCYCLE}
                        onChange={this.onChangeTradingCycle.bind(this)}
                        id="drdTRADINGCYCLE"
                      />
                    </div>
                  </div>
                )} 
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
                {/* Mã CTV */}
                {ISSALETYPE ? null : this.state.ISEDIT ? <div className="col-xs-12">
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
                {/* Sản phẩm */}
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
                  SRTYPE === "SW" ? <div>
                    <div className="col-xs-12">
                      <h5 className="col-xs-5"><b>{this.props.strings.vfmcodesw}</b></h5>
                      <div className="col-xs-7 customSelect2">
                        <Select.Async
                          name="form-field-name"
                          disabled={this.state.ISEDIT}
                          placeholder={this.props.strings.inputCCQ}
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
                    <input style={{ textTransform: 'uppercase', width: '120px' }} type="reset" onClick={this.refresh.bind(this)} className="col-xs-offset-1 col-xs-3 btn btn-default inner45-btn" defaultValue={this.props.strings.btnrefresh} id="btrefesh" />
                  </div>
                  <div className="col-xs-4" style={{ float: "right" }}>
                    {!this.state.ISEDIT ? <input style={{ border: 'none', float: 'left', fontWeight: 'bold', width: '120px', textTransform: 'uppercase', marginLeft: '0px', backgroundColor: strColorSRTYPE }} type="button" 
                    // onClick={this.handleAdd.bind(this)}
                      onClick={this.onClickBuyBtn}
                    className="col-xs-3 btn btn-primary inner45-btn" defaultValue={strSRTYPE} id="btnBuyorSell" /> :
                      <input style={{ textTransform: 'uppercase', width: '120px', fontWeight: 'bold' }} type="button" onClick={this.checkConfirm.bind(this, "edit")} className="col-xs-3 btn btn-primary inner45-btn" defaultValue={this.props.strings.btnUpdate} id="btupdate" />}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xs-6 pdr-0 pdt-10">
              <div className="inner55 col-md-12" style={{ border: "1px solid #ddd", borderRadius: "3px", marginBottom: "20px", marginTop: "0px", paddingBottom: "2px" }}>
                <div className="inner55-default col-md-12">
                  <div className="col-xs-12">
                    <div className="col-xs-8" style={{ padding: '0px', marginTop: '5px', marginBottom: '10px' }}>
                      <div className="col-xs-12" style={{ padding: '0px', marginTop: "0px" }}>
                        <h5 className="col-xs-4" style={{ padding: '0px' }}>{this.props.strings.fullname}</h5>
                        <div className="col-xs-7 col-xs-offset-1" style={{ padding: '0px' }} >
                          <input id="DTDKFullName" value={this.state.AccountInfo.FULLNAME ? this.state.AccountInfo.FULLNAME : ''} className="form-control" disabled />
                        </div>
                      </div>
                      <div className="col-xs-12" style={{ padding: '0px', marginTop: '5px' }}>
                        <h5 className="col-xs-4" style={{ padding: '0px' }}>{this.props.strings.idcode}</h5>
                        <div className="col-xs-7 col-xs-offset-1" style={{ padding: '0px' }}>
                          <input id="DTDKIDCode" value={this.state.AccountInfo.IDCODE ? this.state.AccountInfo.IDCODE : ''} className="form-control" disabled />
                        </div>
                      </div>
                      <div className="col-xs-12" style={{ padding: '0px', marginTop: '5px' }}>
                        <h5 className="col-xs-4" style={{ padding: '0px' }}>{this.props.strings.iddate}</h5>
                        <div className="col-xs-7 col-xs-offset-1" style={{ padding: '0px' }}>
                          <input id="DTDKIDDate" value={this.state.AccountInfo.IDDATE ? this.state.AccountInfo.IDDATE : ''} className="form-control" disabled />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-4" style={{ padding: "3px", marginTop: '-29px' }}>
                      <input id="btnDTDKAuthInfo" type="button" style={{ width: "100%", marginTop: '31px', marginBottom: '6px' }} className="btn btn-primary" onClick={this.ThongTinUyQuyen.bind(this)} defaultValue={this.props.strings.authinfo} />
                      <label id="btnDTDKIdcode" style={{ width: "100%", paddingTop: "10px", paddingBottom: "10px", textAlign: 'center' }} onClick={this.showCMND.bind(this)} className="btn btn-primary">{this.props.strings.idscan}
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
        <CMND CUSTID={this.state.AccountInfo.CUSTID} />

        <ModalSipDetail 
          title={this.props.strings.titleDetail} 
          SIPID={this.state.SIPID} 
          OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} 
        />

        <PopupViewInfo 
          isSIP={true} 
          TRDATE={this.state.TRDATE} 
          OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} 
          data={this.state.dataViewInfo} 
        />

        <PopupConfirmOrder
          isSIP={true} 
          checkShowViewInfo={this.checkShowViewInfo.bind(this)} 
          TRDATE={this.state.TRDATE} 
          ISOTP_CONFIRM={isShowOtpConfirm} 
          OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} 
          onChange={this.onChangeOTP.bind(this)} 
          FULLNAME={this.state.AccountInfo ? this.state.AccountInfo.FULLNAME : ''} 
          title={this.state.titleConfirm} 
          data={this.state} 
          handleSubmit={this.handleSubmit.bind(this)} 
        />

        <UyQuyen 
          OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} 
          CUSTODYCD={this.state.AccountInfo.CUSTODYCD} 
        />

        <ChiTiet 
          OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} 
          CODEID={this.state.CODEID ? this.state.CODEID.value : ''} 
          CUSTODYCD={this.state.CUSTODYCD ? this.state.CUSTODYCD.value : ''} 
          onClickConfirm={this.onClickDetailSell.bind(this)} 
        />

        <RulesModal
          isOpen = {rulesOpen}
          isAllow = {value => this.isAllow(value)}
          onClose = {this.onCloseRulesModal}
          canRegis={canRegis}
        />

        <div style={{ marginTop: '0px' }} className="col-xs-12 pdl-0 pdr-0 tab-datlenh">
          <ul className="nav nav-tabs">
            <li className="active"><a data-toggle="tab" href="#tab1"><b>{this.props.strings.orderbook}</b></a></li>
            <li><a data-toggle="tab" href="#tab2" id="DTDKtab2"> <b>{this.props.strings.sellorderlist}</b></a></li>
            <li><a data-toggle="tab" href="#tab3"> <b>{this.props.strings.symbollist}</b></a></li>
          </ul>
          <div style={{ marginTop: "-20px" }} className="tab-content">
            <div id="tab1" className="tab-pane fade in active">
              <TableCompareOrder OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} eventDelete={this.eventDelete.bind(this)} eventEdit={this.eventEdit.bind(this)} viewSipDetail={this.viewSipDetail} auth={this.props.auth} custodycd={this.state.CUSTODYCD} />
            </div>
            <div id="tab2" className="SipSellListClass tab-pane fade">
              {/* <TableHDSIP /> */}
              <SipSellList OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''} datapage={this.props.datapage} auth={this.props.auth} custodycd={this.state.CUSTODYCD} eventDelete={this.eventDelete.bind(this)} eventEdit={this.eventEdit.bind(this)} />
            </div>
            <div id="tab3" className="SoDuHienCoClass tab-pane fade">
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
});
const dispatchToProps = dispatch => ({
  showModalThongTinUyQuyen: bindActionCreators(showModalThongTinUyQuyen, dispatch),
  showModalChiTiet: bindActionCreators(showModalChiTiet, dispatch),
  showNotifi: bindActionCreators(showNotifi, dispatch),
  showModalConfirm: bindActionCreators(showModalConfirm, dispatch),
  closeModalConfirm: bindActionCreators(closeModalConfirm, dispatch),
  showModalSipDetail: bindActionCreators(showModalSipDetail, dispatch)
})
const decorators = flow([
  connect(stateToProps, dispatchToProps),
  translate('DauTuDinhKi')
]);
module.exports = decorators(DauTuDinhKi);