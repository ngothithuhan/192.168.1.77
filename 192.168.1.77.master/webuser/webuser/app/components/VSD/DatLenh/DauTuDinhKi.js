import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import {
  showModalCMND, showModalSipDetail, showModalThongTinUyQuyen,
  closeModalThongTinUyQuyen, showModalChiTiet, showModalConfirm,
  closeModalConfirm, showModalViewInfo, saveDataAccountPlaceOrder
}
  from 'actionDatLenh';
import { showNotifi } from 'app/action/actionNotification.js';
import DropdownFactory from '../../../utils/DropdownFactory'
import { toast } from 'react-toastify'
import PopupViewInfo from './components/PopupViewInfo'
import PopupConfirmOrder from './components/PopupConfirmOrder'
import RulesModal from './components/RulesModal'
import ModalDialog from 'app/utils/Dialog/ModalDialog'
import ModalDialogCheckOrder from 'app/utils/Dialog/ModalDialogCheckOrder'
import ModalCreateUploadOriginalOrder from './components/ModalCreateUploadOriginalOrder'
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
import {
  SRTYPE_SW, SRTYPE_NS, SRTYPE_NR, SRTYPE_AR, SRTYPE_CR, COLORGRAY, METHODS_FIX, METHODS_FLEX,
  COLORNS_NEW, COLORNR_NEW, COLORSW_NEW, IMGMAXW, IMGMAXH, MAXSIZE_PDF
} from '../../../Helpers';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import ModalSipDetail from './components/ModalSipDetail';
import ModalTimKiemFullname from 'app/utils/Dialog/ModalTimKiemFullname.js'
import NumberFormat from 'react-number-format';
import SipSellList from './components/SipSellList'
import './DauTuDinhKi.scss';
import { withRouter } from 'react-router-dom';
import ModalWarningSipPeriod from './components/ModalWarningSipPeriod';
const Compress = require('compress.js');
const publicIp = require("react-public-ip");

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
      dataInfoFund: {}, //data khi thay đổi thông tin quỹ, lấy theo luồng component ThongTinQuyDTDK
      isOpenWarningSipModal: false, //modal warning khi chưa đủ kỳ hạn SIP
      currentActiveTableTab: 'TAB_COMPARE', // check TAB để hiển thị table :COMPARE & SIPSELL

      checkFields: [
        { name: "CUSTODYCD", id: "drdCUSTODYCD", isObj: true },
        { name: "SRTYPE", id: "drdSRTYPE", isObj: false },
        // { name: "CODEID", id: "drdCODEID", isObj: true },
        // { name: "PRODUCTID", id: "drdPRODUCTID", isObj: true },
        { name: "TRADINGCYCLE", id: "drdTRADINGCYCLE", isObj: true },
        { name: "CODEIDHOANDOI", id: "drdCODEIDHOANDOI", isObj: true },
        { name: "SALETYPE", id: "drdSALETYPE", isObj: true },
        { name: "SALEID", id: "drdSALEID", isObj: true },
        { name: "AMOUNT", id: "txtAMOUNT", isObj: true },
        { name: "QTTY", id: "txtQTTY", isObj: true },
        { name: "SIGN_IMG", id: "btnOrderImg", isObj: false }
      ],
      CONTENT: '',
      ISEDIT: false,
      showModalDetail: false,
      showModalDetailCheckOrder: false,
      // AccountDetail: [],
      // ListSALETYPE: [],
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
      SALENAME: '',
      listSaleType: [],
      rulesOpen: false, // Popup điều khoản mua bán
      canRegis: true,
      SIGN_IMG: null,
      SIGN_IMG_DESC: "",
      showModalCreateUploadOriginalOrder: false,
      err_msg_upload: {},
      urlPreviewPDF: "",
      isSellAll: false,
      OrderSaleInfo: {},
      methods: '',
      ipv4: '',
    }
  }

  setCurrentActiveTableTab = (tab) => {
    this.setState({
      ...this.state,
      currentActiveTableTab: tab
    })
  }

  async componentDidMount() {
    const ipv4 = await publicIp.v4();
    this.setState({
      ...this.state,
      ipv4
    })

    let element = document.getElementById('main_body');
    const { user } = this.props.auth
    let isCustom = user && user.ISCUSTOMER && user.ISCUSTOMER === 'Y' ? true : false;
    if (element && isCustom === true) {
      element.classList.add('dau-tu-dinh-ki-customize-body');
    }
  }

  componentWillUnmount() {
    let element = document.getElementById('main_body');
    if (element) {
      element.classList.remove('dau-tu-dinh-ki-customize-body');
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

  getOrderSellInfo() {
    //console.log('getOrderSellInfo:::dautudinhky:::', this.state.SRTYPE)
    let obj = {
      p_custodycd: this.state.CUSTODYCD ? this.state.CUSTODYCD.value : '',
      p_codeid: this.state.CODEID ? this.state.CODEID.value : '',
      p_qtty: this.state.QTTY ? this.state.QTTY.value : 0,
      p_srtype: this.state.SRTYPE,
      p_issip: 'Y',
      language: this.props.language,
      OBJNAME: this.props.datapage.OBJNAME,
    };
    RestfulUtils.post('/order/getOrderSellInfo', obj).then(resData => {
      if (resData.EC == 0) {
        if (resData.DT && resData.DT.length > 0) {
          let OrderSaleInfo = {
            minterm: resData.DT[0].MINTERM,
            checkmiss: resData.DT[0].CHECKMISS,
            feerate: resData.DT[0].FEERATE,
            cycletype: resData.DT[0].CYCLETYPE,
          }
          this.setState({
            OrderSaleInfo
          })

          if (OrderSaleInfo.checkmiss === '1') {
            this.setState({
              ...this.state,
              rulesOpen: false,
              isOpenWarningSipModal: true
            })
          }
          else {
            this.handleConfirm();
          }
        }
      }
    })
  }

  getOptions(input) {
    return RestfulUtils.post('/account/search_all', { key: input, detail: "DETAIL" })
      .then((res) => {
        const { user } = this.props.auth
        let isCustom = user && user.ISCUSTOMER == 'Y';
        var data = [];
        if (isCustom) {
          var defaultCustodyCd = this.props.auth.user.USERID;
          // data = [{ label: defaultCustodyCd, value: defaultCustodyCd }];
          data = res;
          this.getInforAccount(defaultCustodyCd);
          this.getOptionsSaleidByCodeid(defaultCustodyCd);
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


          this.setState({ ...this.state, CUSTODYCD: cusData })
          this.getInforAccount(cusData.value);
          this.getOptionsSaleidByCodeid(cusData.value);
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
          if ((res[i].label != 'MBGF') && (res[i].label != 'MBBOND')) {
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
  // getOptionsPRODUCTByCodeid(codeid) {
  //   let data = {
  //     p_language: this.props.language,
  //     OBJNAME: this.props.datapage.OBJNAME,
  //     p_sptype: 'S',
  //     p_codeid: codeid
  //   }
  //   return RestfulUtils.post('/fund/getlistproduct', data)
  //     .then((res) => {
  //       this.setState({
  //         PRODUCTID: '',
  //         listProducts: res.DT.data
  //       })
  //     })
  // }
  async getOptionsTradingcycle(custodycd, codeid, isEdit) {
    let data = {
      p_language: this.props.language,
      OBJNAME: this.props.datapage.OBJNAME,
      p_custodycd: custodycd ? custodycd : '',
      p_codeid: codeid ? codeid : '',
    }
    return RestfulUtils.post('/fund/getListTradingCycle', data)
      .then((res) => {
        let methods = res.DT.data && res.DT.data.length > 0 ? res.DT.data[0].METHODS : '';
        let dataOptions = res.DT.data.map((item) => {
          return {
            value: item.CYCLEIDVSD,
            label: item.CONTENT,
            minamt: item.MINAMT,
          }
        });
        this.setState({
          TRADINGCYCLE: isEdit ? this.state.TRADINGCYCLE : '',
          listTRADINGCYCLE: dataOptions,
          methods
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
  getOptionsSYMBOLHOANDOI(e) {
    let self = this;
    if (e.value) {
      RestfulUtils.post('/allcode/get_swsymbol', { CODEID: e.value, SYMBOL: e.label })
        .then(res => {
          self.setState({ optionSYMBOLHOANDOI: res })
        })
    }
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
      this.getInforAccount(e.value);
      this.getOptionsSaleidByCodeid(e.value);
      let listSYMBOL = await this.getListOptionSymbol(this.state.SRTYPE, e);
      if (listSYMBOL.length > 0)
        this.setState({ listSYMBOL })
      else
        this.setState({ listSYMBOL: [], data: [], datahoandoi: [], CODEIDHOANDOI: '' })

      if (this.state.CODEID && this.state.CODEID.value) {
        this.getDataSymbol(e.value, this.state.CODEID.value);
        this.getOptionsTradingcycle(e.value, this.state.CODEID.value);
      }

      //lưu data redux
      this.props.saveDataAccountPlaceOrder(e)
    }
    else {
      await this.setState({ ...this.state, AccountInfo: {} });
      //lưu data redux
      this.props.saveDataAccountPlaceOrder({})
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
  async getDataSymbol(CUSTODYCD, CODEID) {
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
      await RestfulUtils.post('/balance/getfundbalance', obj)
        .then(resData => {
          if (resData.EC === 0) {
            if (this.state.isSellAll) {
              var qtty = resData.DT.data && resData.DT.data.length > 0 && resData.DT.data[0].NOBLOCKAVLTRADESIP ? parseFloat(resData.DT.data[0].NOBLOCKAVLTRADESIP) : 0;
            } else {
              qtty = 0;
            }
            this.setState({
              ...this.state,
              sellAvlBalance: resData.DT.data && resData.DT.data.length > 0 ? resData.DT.data[0].NOBLOCKAVLTRADESIP : 0,
              QTTY: { value: qtty, validate: null, tooltip: "Không được để trống !!", formattedValue: qtty }
            })
          }
        })
    }
  }
  async getTradingdateByCodeID(CODEID) {
    await RestfulUtils.post('/order/gettradingdate_bycodeid', { CODEID: CODEID })
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
    console.log('Ha-onChangeSymbol', e);
    if (e && e.value) {
      // this.getOptionsPRODUCTByCodeid(e.value);
      if (this.state.SRTYPE === SRTYPE_SW) this.getOptionsSYMBOLHOANDOI(e);
      if (this.state.CUSTODYCD) {
        if (this.state.CUSTODYCD.value) {
          this.getDataSymbol(this.state.CUSTODYCD.value, e.value)
        }
      }
      // this.getSessionInfo(codeID);
      this.getTradingdateByCodeID(e.value)
      this.getSoDu(this.state.CUSTODYCD.value, e.value)
      this.getOptionsTradingcycle(this.state.CUSTODYCD.value, e.value);
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

  // onChangePRODUCT(e) {
  //   console.log('Ha-ppppp', e)
  //   if (e && e.value) {
  //     let codeID = e.CODEID;

  //     if (this.state.CUSTODYCD) {
  //       if (this.state.CUSTODYCD.value) {
  //         this.getDataSymbol(this.state.CUSTODYCD.value, codeID)
  //       }
  //     }
  //     this.setState({
  //       PRODUCTID: e,
  //       AMOUNT: { value: e.METHODS === METHODS_FLEX ? e.MINAMT : 0 },
  //     }, () => {
  //       console.log('MinhMinh', this.state.PRODUCTID)
  //     })
  //   }
  //   else
  //     this.setState({
  //       PRODUCTID: '',
  //       TRADINGCYCLE: '',
  //       listTRADINGCYCLE: [],
  //     })
  // }


  onChangeTradingCycle(e) {
    this.setState({
      TRADINGCYCLE: e && e.value ? e : '',
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
    const { user } = this.props.auth
    let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
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
        if (value == '' && this.state["SALETYPE"] && this.state["SALETYPE"].value == '003')
          mssgerr = this.props.strings.requiredsaleid;
        break;
      case "AMOUNT":
        if (this.state.methods === METHODS_FIX) {
          if ((value.toString() == '' && this.state.SRTYPE == SRTYPE_NS)) { mssgerr = this.props.strings.emtyamount; }
          else if (value <= 0 && this.state.SRTYPE == SRTYPE_NS) { mssgerr = this.props.strings.invalidamout; }
          else if (this.state.action == 'U' && (parseFloat(value) == parseFloat(this.state.OLDAMOUNT.value)) && (this.state.SRTYPE == SRTYPE_NS)) { mssgerr = this.props.strings.invalidupdateamout; }
        }
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

  handleConfirm(row, SIGN_IMG_del, SIGN_IMG_DESC_del) {
    // if (event)
    //   event.preventDefault();
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
        this.props.dispatch(showNotifi({ type: "error", header: "", content: this.props.strings.requiredSignImg }));
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
      let v_objname = this.props.datapage ? this.props.datapage.OBJNAME : '';
      let SALEID = state.SALETYPE && state.SALETYPE.value == '003' ? state.SALEID : '';
      var Obj = this.state.action !== "D" ? {
        ACTION: this.state.action,
        CUSTODYCD: state.CUSTODYCD.value,
        SRTYPE: state.SRTYPE,
        CODEID: state.CODEID ? state.CODEID.value : '',
        SPCODE: '',
        TRADINGCYCLE: state.TRADINGCYCLE ? state.TRADINGCYCLE.value : '',
        AMOUNT: state.AMOUNT ? state.AMOUNT.value : '',
        SEDTLID: state.SEDTLID,
        QTTY: state.QTTY ? state.QTTY.value : '',
        FEEID: '',
        SWID: this.refs.FEEIDHOANDOI ? this.refs.FEEIDHOANDOI.value : '',
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
        SPCODE: this.state.CancelData ? this.state.CancelData.SPCODE : '',
        TRADINGCYCLE: this.state.CancelData ? this.state.CancelData.CYCLE : '',
        AMOUNT: 0,
        SEDTLID: this.state.CancelData ? this.state.CancelData.SEDTLID : '',
        QTTY: 0,
        FEEID: this.state.CancelData ? this.state.CancelData.FEEID : '',
        SWID: this.state.CancelData ? this.state.CancelData.SWID : '',
        SWCODEID: this.state.CancelData ? this.state.CancelData.SWCODEID : '',
        SALETYPE: state.SALETYPE ? state.SALETYPE.value : '',
        SALEID: SALEID ? SALEID.value : '',
        ORGORDERID: this.state.CancelData ? this.state.CancelData.ORDERID : '',
        OBJNAME: v_objname,
        SIGN_IMG: SIGN_IMG_del,
        SIGN_IMG_DESC: SIGN_IMG_DESC_del,
        ipv4: this.state.ipv4
      };
      var that = this;
      if (Obj.SRTYPE == SRTYPE_NR || Obj.SRTYPE == SRTYPE_AR || Obj.SRTYPE == SRTYPE_CR || Obj.SRTYPE == SRTYPE_SW) {
        RestfulUtils.posttrans('/order/preadd', { ...Obj, language: this.props.language }).then((resData) => {
          if (resData.EC == 0) {
            that.setState({ ...that.state, ORDERID: resData.DT.p_orderid, ORGORDERID: Obj.ORGORDERID, titleConfirm: title })
            that.props.dispatch(showModalConfirm());
          }
          else {
            datanotify.type = "error";
            datanotify.content = resData.EM
            that.props.dispatch(showNotifi(datanotify));
          }
        });
      }
      else {
        RestfulUtils.posttrans('/order/preplacesip', { ...Obj, language: this.props.language }).then((resData) => {
          if (resData.EC == 0) {
            that.setState({ ...that.state, ORDERID: resData.DT.p_orderid, ORGORDERID: Obj.ORGORDERID, titleConfirm: title })
            that.props.dispatch(showModalConfirm());
          }
          else {
            datanotify.type = "error";
            datanotify.content = resData.EM
            that.props.dispatch(showNotifi(datanotify));
          }
        });
      }
    }
  }
  async handleSubmit(event) {
    let that = this;
    var err = 0;
    await RestfulUtils.post('/order/getfacctnobysymbol', { symbol: this.state.my_symbol, custodycd: this.state.CUSTODYCD.value, srtype: 'SP', language: this.props.language }).then((resData) => {
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
      SPCODE: '',
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
    // this.props.closeModalConfirm();
    if (event)
      event.preventDefault();
    var datanotify = {
      type: "",
      header: "",
      content: ""
    }
    if (Obj.SRTYPE == SRTYPE_NR || Obj.SRTYPE == SRTYPE_AR || Obj.SRTYPE == SRTYPE_CR || Obj.SRTYPE == SRTYPE_SW) {
      if (that.state.action == 'C')
        RestfulUtils.posttrans('/order/add', { ...Obj, language: that.props.language }).then((resData) => {
          if (resData.EC == 0) {
            //close modal OTP/PIN
            that.props.dispatch(closeModalConfirm());

            datanotify.type = "success";
            datanotify.content = that.props.strings.placeSipSellSuccess;
            that.props.dispatch(showNotifi(datanotify));
            that.refresh()
          }
          else {
            datanotify.type = "error";
            datanotify.content = resData.EM;
            that.props.dispatch(showNotifi(datanotify));
          }
        });
      else if (that.state.action == 'U')
        RestfulUtils.posttrans('/order/update', { ...Obj, language: that.props.language }).then((resData) => {
          if (resData.EC == 0) {
            //close modal OTP/PIN
            that.props.dispatch(closeModalConfirm());

            datanotify.type = "success";
            datanotify.content = that.props.strings.updateSipSellSuccess;
            that.props.dispatch(showNotifi(datanotify));
            that.refresh()
          }
          else {
            datanotify.type = "error";
            datanotify.content = resData.EM;
            that.props.dispatch(showNotifi(datanotify));
          }
        });
      else
        RestfulUtils.posttrans('/order/cancel', { ...Obj, language: that.props.language }).then((resData) => {
          if (resData.EC == 0) {
            //close modal OTP/PIN
            that.props.dispatch(closeModalConfirm());

            datanotify.type = "success";
            datanotify.content = that.props.strings.cancelSipSuccess;
            that.props.dispatch(showNotifi(datanotify));
            that.refreshDel()
          }
          else {
            datanotify.type = "error";
            datanotify.content = resData.EM;
            that.props.dispatch(showNotifi(datanotify));
          }
        });
    }
    else
      RestfulUtils.posttrans('/order/placesip', { ...Obj, language: that.props.language, ACTION: that.state.action }).then((resData) => {
        var { dispatch } = that.props;
        if (resData.EC == 0) {

          //close modal OTP/PIN
          that.props.dispatch(closeModalConfirm());

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
          that.props.dispatch(showNotifi(datanotify));
          if (Obj.SRTYPE == 'NS' && that.state.action == 'C' && this.state.ishowViewInfo) dispatch(showModalViewInfo());
          that.refresh()
        }
        else {
          datanotify.type = "error";
          datanotify.content = resData.EM;
          that.props.dispatch(showNotifi(datanotify));
        }
      });
  }
  // getEdittingProductID(row) {
  //   let data = {
  //     p_language: this.props.language,
  //     OBJNAME: this.props.datapage.OBJNAME,
  //     p_sptype: 'S',
  //     p_codeid: row.CODEID
  //   }
  //   RestfulUtils.post('/fund/getlistproduct', data)
  //     .then((res) => {
  //       res.DT.data.forEach(item => {
  //         if (item.SPCODE === row.SPCODE) {
  //           this.setState({ PRODUCTID: item })
  //         }
  //       })
  //     })
  // }
  async eventDelete(row, isSell, SIGN_IMG, SIGN_IMG_DESC) {//show confirm huy lenh, isSell neu so lenh ban la true
    if (row) {
      this.getInforAccount(row.CUSTODYCD)
      this.getTradingdateByCodeID(row.CODEID)
      await this.setState({ ...this.state, CancelData: { ...row, ORDERVALUE: isSell ? row.ORDERVALUE : row.AMT, ORDERID: isSell ? row.ORDERID : row.SPID }, action: 'D', ISOTP_CONFIRM: row.ISOTP_CONFIRM })
      this.handleConfirm(row, SIGN_IMG, SIGN_IMG_DESC)
    }

  }
  async eventEdit(row, isSell) {
    var self = this
    window.$('#txtAMOUNT').focus();

    this.setState({
      ...this.state,
      SRTYPE: row.SRTYPE == SRTYPE_SW ? row.SRTYPE : row.EXECTYPE,
      CUSTODYCD: { value: row.CUSTODYCD, label: row.CUSTODYCD },
      CODEID: { value: row.CODEID, label: row.SYMBOL },
      CODEIDHOANDOI: { value: row.SWCODEID, label: row.SWSYMBOL },
    })


    await this.getInforAccount(row.CUSTODYCD)
    await this.getTradingdateByCodeID(row.CODEID)
    this.getOptionsTradingcycle(row.CUSTODYCD, row.CODEID, true);
    // this.getEdittingProductID(row);
    await this.getDataSymbol(row.CUSTODYCD, row.CODEID)

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
        ORGORDERID: isSell ? row.ORDERID : row.SPID,
        AMOUNT: { value: parseFloat(row.AMT) },
        OLDAMOUNT: { value: parseFloat(row.AMT) },
        QTTY: { value: parseFloat(row.ORDERQTTY) },
        OLDQTTY: { value: parseFloat(row.ORDERQTTY) },
        err_msg: { color: '', text: '' },
        ISOTP_CONFIRM: row.ISOTP_CONFIRM,
        TRADINGCYCLE: { value: row.CYCLE, label: row.CONTENT }
        //PRODUCTID: { label: row.FEEID, value: row.SPCODE, DESC_METHODS: row.METHODS_DESC, SPCODE: row.SPCODE},
      }
    )
  }

  onChangeDropdown(type, event) {
    this.state[type] = event.value
    if (type === "SRTYPE") {
      if (this.state.CUSTODYCD && this.state.CODEID) {
        if (this.state.CUSTODYCD.value && this.state.CODEID.value)
          this.getDataSymbol(this.state.CUSTODYCD.value, this.state.CODEID.value)
        if (event.value === SRTYPE_SW) this.getOptionsSYMBOLHOANDOI(this.state.CODEID);
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


    const { action, checkFields, SRTYPE } = this.state
    let mssgerr = '';
    if (action !== 'D') {
      for (let index = 0; index < checkFields.length; index++) {
        const element = checkFields[index];
        mssgerr = this.checkValid(element.name, element.id, element.isObj);
        if (mssgerr !== '')
          break;
      }
    }

    if (mssgerr !== '') {
      return;
    }

    //chỉ hiện modal rules khi đặt lệnh mua
    if (mssgerr === '' && SRTYPE === SRTYPE_NS) {
      this.setState({
        rulesOpen: true
      })
    } else if (mssgerr === '' && SRTYPE !== SRTYPE_NS) {
      //check modal đã tham gia đủ kì hạn sip hay chưa
      //to do: cần gọi api
      this.getOrderSellInfo();
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

    if (!value) {
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
    let ISINTERNALORDER = false;
    if (AccountDetail && CUSTODYCD && CODEID) {

      AccountDetail.map(function (item) {
        if (item && item.detail && item.detail.LISTCODEIDINTERNAL) {
          if (item.detail && item.detail.CUSTODYCD == CUSTODYCD && item.detail.LISTCODEIDINTERNAL == CODEID) {
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
        // ListSALETYPE: [],
        SALETYPE: '',
        SALEID: '',
        CACHESALEACCTNO: '',
        dataInfoFund: {},
        isSellAll: false,
        SIGN_IMG: null,
        SIGN_IMG_DESC: "",
        err_msg_upload: {},
        urlPreviewPDF: "",
        TRADINGCYCLE: '',
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
        dataInfoFund: {},
        isSellAll: false,
        SIGN_IMG: null,
        SIGN_IMG_DESC: "",
        err_msg_upload: {},
        urlPreviewPDF: "",
        TRADINGCYCLE: '',
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
        self.setState({ ...self.state, AccountInfo: resData.DT });
      } else {
        self.setState({ ...self.state, AccountInfo: {} });
      }
    });
    let { AccountInfo } = this.state;
    if (AccountInfo) {
      let custid = AccountInfo.CUSTID
      RestfulUtils.post('/account/sync_cfauth', { CUSTID: custid, LANG: this.props.language, OBJNAME: this.props.datapage.OBJNAME }).then((resData) => {
      });
    }
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

  changeOrderTypeNew = (event) => {
    //lệnh định kỳ
    if (event.target && event.target.value === "ORDERTYPE_NEW_1") {
      this.props.history.push("/PLACEORDER")
    }
  }

  onClickPlaceOrderTab = () => {
    this.props.history.push("/PLACEORDER")
  }

  onCloseModalWarningSipPeriod = () => {
    this.setState({
      ...this.state,
      isOpenWarningSipModal: false
    })
  }

  onConfirmModalWarningSipPeriod = () => {
    this.setState({
      ...this.state,
      isOpenWarningSipModal: false
    }, () => {
      this.handleConfirm();
    })
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
    let urlPreviewPDF = '';

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
    let { dataInfoFund, isOpenWarningSipModal, SRTYPE, rulesOpen, canRegis, currentActiveTableTab, isSellAll, methods } = this.state;
    const { user } = this.props.auth
    let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : false : false;
    let ISCUSTODYCD = this.state.CUSTODYCD ? this.state.CUSTODYCD.value ? true : false : false
    let isGroupUser = user ? (user.ISGROUPUSER ? true : false) : false;
    // let disableCustodycdBox = this.state.ISEDIT || (isCustom && !isGroupUser);
    let disableCustodycdBox = this.state.ISEDIT;

    let isCodeid = this.state.CODEID != '' ? true : false;

    var renderAMOUNTSLBan = null;
    var renderFileAnhCMT = null;

    let noteSRTPEns = null;
    let titleNewPlaceOrder = null;

    if (this.state.image.validate === "warning") {
      renderFileAnhCMT = <span className="glyphicon glyphicon-remove pull-right"></span>;
    } else {
      renderFileAnhCMT = <span className="glyphicon glyphicon-ok pull-right"></span>;
    }
    var isShowOtpConfirm = 'Y';
    if (isCustom) { isShowOtpConfirm = this.state.ISOTP_CONFIRM }
    else { isShowOtpConfirm = 'N' }

    if (SRTYPE === "NS") {//mua
      titleNewPlaceOrder = this.props.strings.placeorderSellSip;
      renderAMOUNTSLBan =
        <React.Fragment>
          {this.state.methods === METHODS_FIX && (
            <div className="col-md-12">
              <label>{this.props.strings.buyvalue}</label>
              <NumberInput
                className="form-control"
                value={this.state.AMOUNT ? this.state.AMOUNT.value : 0}
                onValueChange={this.onValueChange.bind(this, 'AMOUNT')}
                thousandSeparator={true}
                decimalScale={0} prefix={''} id="lblAMOUNT" />
            </div>
          )}
        </React.Fragment>
      noteSRTPEns =
        <div className="col-md-12">
          <div className="noteSRTPEns">
            <div >
              {this.props.strings.thongbao1}
            </div>
            <div >
              {this.props.strings.thongbao2}
            </div>
          </div>
        </div>
        ;

    } else if (SRTYPE === "NR") {//ban
      titleNewPlaceOrder = this.props.strings.placeorderBuySip;
      renderAMOUNTSLBan =
        <React.Fragment>
          <div className="col-md-12 form-group">
            <label>{this.props.strings.sipbalance}</label>
            <NumberInput
              className="form-control"
              displayType='text'
              id="txtSellAvlBalance"
              value={this.state.sellAvlBalance}
              thousandSeparator={true}
              decimalScale={2} prefix={''}
            />
          </div>
          <div className="col-md-12 form-group div-sell-qtty">
            <label>{this.props.strings.sellvaluesell}</label>
            <NumberInput className="form-control"
              value={this.state.QTTY.value}
              onValueChange={this.onValueChange.bind(this, 'QTTY')}
              thousandSeparator={true} decimalScale={2} prefix={''}
              id="txtQTTY"
              disabled={isSellAll}
            />
            <div className="div-sell-all-btn">
              <button type="button" id="btrefesh" onClick={this.toggleSellAll.bind(this)}>
                {isSellAll && <i className="fas fa-check" aria-hidden="true"></i>}
                {this.props.strings.sellAll}
              </button>
            </div>
          </div>
        </React.Fragment>
    }
    else {//hoan doi
      titleNewPlaceOrder = this.props.strings.placeorderSwapSip;
      renderAMOUNTSLBan =
        <React.Fragment>
          <div className="col-md-12 form-group">
            <label>{this.props.strings.sipbalance}</label>
            <NumberInput
              displayType='text'
              className="form-control"
              id="txtSellAvlBalance"
              value={this.state.sellAvlBalance}
              thousandSeparator={true} decimalScale={2} prefix={''}
            />
          </div>
          <div className="col-md-12 form-group div-sell-qtty">
            <label>{this.props.strings.sellvalue}</label>
            <NumberInput className="form-control"
              value={this.state.QTTY.value}
              onValueChange={this.onValueChange.bind(this, 'QTTY')}
              thousandSeparator={true} decimalScale={2}
              prefix={''} id="txtQTTY"
              disabled={isSellAll}
            />
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
        <div><ThongTinQuyDTDK CODEID={this.state.CODEID} onChange={this.handleChange.bind(this)} type="mua" /><ThongTinQuyDTDK CODEID={this.state.CODEIDHOANDOI} onChange={this.handleChange.bind(this)} type="ban" /></div>
        :
        <ThongTinQuyDTDK CODEID={this.state.CODEID} onChange={this.handleChange.bind(this)} type={SRTYPE == "NR" ? "ban" : "mua"} />;

    let strSRTYPE = this.state.SRTYPE == "NR" ? this.props.strings.stringsell : this.state.SRTYPE == "NS" ? this.props.strings.stringbuy : this.props.strings.stringswap;
    let strColorSRTYPE =
      this.state.SRTYPE == SRTYPE_NR ? COLORNS_NEW
        : this.state.SRTYPE == SRTYPE_NS ? COLORNS_NEW
          : COLORNS_NEW;
    let ISSALETYPE = this.state.SALETYPE && this.state.SALETYPE.value == '003' ? false : true;

    return (
      <React.Fragment>
        <div className="custom-new-dau-tu-dinh-ki">
          <div className="custom-new-dau-tu-dinh-ki-left row">
            <div className="title-new-place-order">
              <div className="width-90 no-padding-right">
                <label>{titleNewPlaceOrder}</label>
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

            {/* Số hiệu tài khoản giao dịch */}
            {isCustom &&
              <div className="col-md-12 form-group">
                <label>{this.props.strings.custodycd}</label>
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
            }

            {!isCustom &&
              <div className="col-md-12 form-group">
                <div className="custom-combo-dat-lenh">
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
                  <button style={{ paddingLeft: "0px", margin: "0 0 0 5px", minHeight: "34px" }} type="button" onClick={this.handleClickSearch.bind(this)}
                    className="pull-left btn custom-btndanger" id="btupdate22"><i class="fa fa-search" aria-hidden="true"></i></button>
                </div>
              </div>
            }


            <div className="col-md-12 form-group">
              <label>{this.props.strings.placeorderTypeNew}</label>
              <select
                className="form-control"
                onChange={(e) => this.changeOrderTypeNew(e)}
                disabled={this.state.ISEDIT}
              >
                <option value="ORDERTYPE_NEW_2">Định kỳ</option>
                <option value="ORDERTYPE_NEW_1">Lệnh thường</option>
              </select>
            </div>

            {/* Loại lệnh */}
            <div className="col-md-12 form-group">
              <label>{this.props.strings.ordertypeNew}</label>
              <DropdownFactory
                CDVAL={this.state.SRTYPE}
                value="SRTYPE" CDTYPE="SA"
                CDNAME="FOSRTYPESIP"
                onChange={this.onChangeDropdown.bind(this)}
                disabled={this.state.ISEDIT}
                ID="drdSRTYPE" />
            </div>

            {/* Mã CCQ */}
            <div className="col-md-12 form-group">
              <label>{this.props.strings.vfmcode}</label>
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

            {/* Mã sản phẩm */}
            {/* <div className="col-md-12 form-group">
              <label>{this.props.strings.sipProduct}</label>
              <Select
                name="form-field-name"
                disabled={this.state.ISEDIT}
                placeholder={this.props.strings.inputsipProduct}
                options={this.state.listProducts}
                value={this.state.PRODUCTID}
                onChange={this.onChangePRODUCT.bind(this)}
                id="drdPRODUCTID"
              />
            </div> */}

            {/* Loại sản phẩm */}
            {/* <div className="col-md-12 form-group">
              <label>{this.props.strings.sipProductType}</label>
              <input disabled={true}
                className="form-control"
                type="text"
                value={this.state.PRODUCTID && this.state.PRODUCTID.DESC_METHODS} />
            </div> */}

            {
              SRTYPE === "SW" &&
              <div className="col-md-12 form-group">
                <label>{this.props.strings.vfmcodesw}</label>
                <Select
                  name="form-field-name"
                  disabled={this.state.ISEDIT}
                  placeholder={this.props.strings.inputCCQ}
                  value={this.state.CODEIDHOANDOI}
                  options={this.state.optionSYMBOLHOANDOI}
                  onChange={this.onChangeSYMBOLHOANDOI.bind(this)}
                  id="drdCODEIDHOANDOI"
                  cache={false}
                />
              </div>

            }

            {/* Chu kỳ giao dịch: hiển thị với lệnh mua */}
            {SRTYPE === "NS" && (
              <div className="col-md-12 form-group">
                <label>{this.props.strings.tradingcycle}</label>
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
            )}


            {renderAMOUNTSLBan}


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


            <div className="col-md-12 form-group">
              <label>{this.props.strings.transactiondate}</label>
              <input className="form-control"
                value={dataInfoFund && dataInfoFund.DAY ? dataInfoFund.DAY : ''}
                disabled
              />
            </div>

            {/* {SRTYPE === "NS" &&
              noteSRTPEns
            } */}

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
                <input style={{ backgroundColor: strColorSRTYPE }}
                  type="button"
                  onClick={this.onClickBuyBtn}
                  className="new-btnBuySell"
                  defaultValue={strSRTYPE}
                  id="btnBuyorSell" />
                :
                <input style={{ backgroundColor: strColorSRTYPE }}
                  type="button"
                  // onClick={this.checkConfirm.bind(this, "edit")}
                  onClick={this.handleUpdate.bind(this, "edit")}
                  className="new-btnBuySell"
                  defaultValue={this.props.strings.btnUpdate}
                  id="btupdate" />}
            </div>


            <ModalTimKiemFullname onSelectRow={this.selectCustodycd.bind(this)} showModal={this.state.showModalSearch} closeModalTimKiem={this.closeModalSearch.bind(this)} />
            <ModalDialog confirmPopup={this.confirmPopup.bind(this)} ACTION={this.state.ACTION} data={this.state.datarow} showModalDetail={this.state.showModalDetail} closeModalDetail={this.closeModalDetail.bind(this)} />
            <ModalDialogCheckOrder confirmPopupCheckOrder={this.confirmPopupCheckOrder.bind(this)} ACTION={this.state.ACTION} data={this.state.datarow} showModalDetail={this.state.showModalDetailCheckOrder} closeModalDetail={this.closeModalDetailCheckOrder.bind(this)} />

            <CMND CUSTID={this.state.AccountInfo.CUSTID} />

            <ModalSipDetail
              title={this.props.strings.titleDetail}
              SIPID={this.state.SIPID}
              OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''}
            />

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
              isSIP={true}
              TRDATE={this.state.TRDATE}
              OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''}
              data={this.state.dataViewInfo}
            />

            {/* modal confirm OTP/PIN đối với SIP*/}
            <PopupConfirmOrder
              methods={methods}
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
              showModal={this.props.showModalConfirmOTPorPIN} //redux
              refresh={this.refresh.bind(this)}
              isCustom={isCustom}
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
              isOpen={rulesOpen}
              isAllow={value => this.isAllow(value)}
              onClose={this.onCloseRulesModal}
              canRegis={canRegis}
            />

            <ModalWarningSipPeriod
              isShowModal={isOpenWarningSipModal}
              onCloseModal={this.onCloseModalWarningSipPeriod}
              onConfirmModal={this.onConfirmModalWarningSipPeriod}
              OrderSaleInfo={this.state.OrderSaleInfo}
            />
          </div>
          <div className="custom-new-dau-tu-dinh-ki-right">

            <div style={{ marginTop: '0px' }} className="col-xs-12 pdl-0 pdr-0 tab-datlenh">
              <ul className="nav nav-tabs">
                <li><a data-toggle="tab" href="#" onClick={() => this.onClickPlaceOrderTab()}> <b>{this.props.strings.orderbookNew}</b></a></li>
                <li className="active"><a data-toggle="tab" href="#tab1"><b>{this.props.strings.orderbookDKNew}</b></a></li>
              </ul>
              <div style={{ marginTop: "-20px" }} className="tab-content">
                <div id="tab1" className="tab-pane fade in active">
                  <div className="add-spaces" style={{ marginTop: '20px' }}>
                  </div>
                  <div className="dtdk-all-tables">
                    <span className={currentActiveTableTab === 'TAB_COMPARE' ? 'tab-child tab-active' : 'tab-child'}
                      onClick={() => this.setCurrentActiveTableTab('TAB_COMPARE')}
                    >
                      {this.props.strings.orderbookDKNew}
                    </span>
                    <span className={currentActiveTableTab === 'TAB_SIPSELL' ? 'tab-child tab-active' : 'tab-child'}
                      onClick={() => this.setCurrentActiveTableTab('TAB_SIPSELL')}
                    >
                      {this.props.strings.sellorderlist}
                    </span>
                  </div>
                  {/* Table sổ lệnh định kì */}
                  {currentActiveTableTab === 'TAB_COMPARE' &&
                    <TableCompareOrder
                      OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''}
                      eventDelete={this.eventDelete.bind(this)}
                      eventEdit={this.eventEdit.bind(this)}
                      viewSipDetail={this.viewSipDetail}
                      auth={this.props.auth}
                      custodycd={this.state.CUSTODYCD}
                      titleTable={this.props.strings.orderbookDKNew}
                    />
                  }

                  {/* Table sổ lệnh bán */}
                  {currentActiveTableTab === 'TAB_SIPSELL' &&
                    <SipSellList
                      OBJNAME={this.props.datapage ? this.props.datapage.OBJNAME : ''}
                      datapage={this.props.datapage}
                      auth={this.props.auth}
                      custodycd={this.state.CUSTODYCD}
                      eventDelete={this.eventDelete.bind(this)}
                      eventEdit={this.eventEdit.bind(this)}
                      titleTable={this.props.strings.sellorderlist}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>


      </React.Fragment>
    )
  }
}
const stateToProps = state => ({
  language: state.language.language,
  auth: state.auth,
  showModalConfirmOTPorPIN: state.datLenh.showModalConfirm,
  dataPlaceOrder: state.datLenh.dataPlaceOrder,

});
const dispatchToProps = dispatch => ({
  showModalThongTinUyQuyen: bindActionCreators(showModalThongTinUyQuyen, dispatch),
  showModalChiTiet: bindActionCreators(showModalChiTiet, dispatch),
  showNotifi: bindActionCreators(showNotifi, dispatch),
  showModalConfirm: bindActionCreators(showModalConfirm, dispatch),
  closeModalConfirm: bindActionCreators(closeModalConfirm, dispatch),
  showModalSipDetail: bindActionCreators(showModalSipDetail, dispatch),
  saveDataAccountPlaceOrder: bindActionCreators(saveDataAccountPlaceOrder, dispatch),
})
const decorators = flow([
  connect(stateToProps, dispatchToProps),
  translate('DauTuDinhKi')
]);
module.exports = withRouter(decorators(DauTuDinhKi));