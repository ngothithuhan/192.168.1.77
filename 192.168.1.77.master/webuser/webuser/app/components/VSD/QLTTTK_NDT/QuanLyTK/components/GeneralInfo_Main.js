import React from "react";
import { connect } from "react-redux";
import DropdownFactory from "../../../../../utils/DropdownFactory";
import DateInput from "app/utils/input/DateInput";
import Select from "react-select";
import flow from "lodash.flow";
import translate from "app/utils/i18n/Translate.js";
import { showNotifi } from "app/action/actionNotification.js";
import moment from "moment";
import _ from "lodash";
import { IMGMAXW, IMGMAXH, CUSTYPE_TC, IDTYPE_009, COUNTRY_234, ACTYPE_TT, GRINVESTOR_NN, GRINVESTOR_TN } from "../../../../../Helpers";
import RestfulUtils from "app/utils/RestfulUtils";
import { toast } from "react-toastify";
import GeneralInfo_Text_Contract from './GeneralInfo_Text_Contract';
class GeneralInfo_Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover1: "",
      hover2: "",
      isExistAcc: false,
      optionsDataMG: [],
      showLabelLoaiDKSH: false,
      titlebuttonopenExport: this.props.strings["createxportopenExport"],
      titlebuttoneditExport: this.props.strings["createxporteditExport"],
      titlebuttononlineExport: this.props.strings["createxportonlineExport"],
      disablebuttonopenExport: false,
      disablebuttoneditExport: false,
      disablebuttononlineExport: false,
      checkFields: [
        { name: "FULLNAME", id: "txtFullname" },
        { name: "SEX", id: "drdSex" },
        { name: "COUNTRY", id: "drdCountry" },
        { name: "OTHERCOUNTRY", id: "drdOTHERCountry" },
        //{ name: "TAXNUMBER", id: "txtTAXNUMBER" }, //bỏ check theo issue FUNDMB CapitalEXT-32
        // { name: "GRINVESTOR", id: "drdGrinvestor" },
        { name: "CUSTTYPE", id: "drdCusttype" },
        { name: "BIRTHDATE", id: "txtBirthdate" },
        // { name: "JOB", id: "drdJOB" }, //bỏ check theo design mới
        // { name: "WORKADDRESS", id: "txtWORKADDRESS" }, /bỏ check theo design mới
        { name: "TAXNUMBER", id: "txtTAXNUMBER" },
        { name: "IDTYPE", id: "drdIdtype" },
        { name: "TRADINGCODE", id: "" },
        { name: "PASSPORT", id: "txtPASSPORT" },
        { name: "PASSPORTDATE", id: "txtPASSPORTDATE" },
        { name: "PASSPORTPLACE", id: "drdPASSPORTPLACE" },
        { name: "TAXPLACE", id: "drdTAXPLACE" },
        { name: "IDCODE", id: "txtIdcode" },
        { name: "IDDATE", id: "txtIddate" },
        // { name: "IDEXPDATED", id: "txtExpiredate" },
        { name: "IDPLACE", id: "txtIdplace" },
        //{ name: "TAXNO", id: "txtTaxno" },
        { name: "EMAIL", id: "txtEmail" },
        { name: "MOBILE", id: "txtMobile" },
        { name: "BANKACC", id: "txtBankaccno" },
        { name: "CITYBANK", id: "txtBranchname" },
        { name: "BANKCODE", id: "drdBank" },
        // { name: "ACCTYPE", id: "drdAcctype" },
        { name: "CAREBY", id: "drdCareby" },
        // { name: "INVESTTYPE", id: "drdInvesttype" },
        { name: "ACCTGRP", id: "drdAcctgrp" },
        { name: "SALEID", id: "drdsaleid" },
        // { name: "SIGN_IMG", id: "btnSignImg" },
        // { name: "OWNLICENSE_IMG", id: "btnOwnLicenseImg" },
        // { name: "OWNLICENSE2_IMG", id: "btnOwnLicense2Img" },
        // { name: "OWNLICENSE3_IMG", id: "btnOwnLicense3Img" },
        // { name: "OWNLICENSE4_IMG", id: "btnOwnLicense4Img" },
        //{ name: "RCV_EMAIL", id: "cbIsemail" },
        { name: "ISAGREE", id: "cbIsagree" },
        { name: "LRNAME", id: "txtLRNAME" },
        { name: "LRDOB", id: "txtLRDOB" },
        { name: "LRID", id: "txtLRID" },
        { name: "LRIDDATE", id: "txtLRIDDATE" },
        { name: "LRIDPLACE", id: "txtLRIDPLACE" },
        { name: "LRPRIPHONE", id: "txtLRPRIPHONE" },
        { name: "LREMAIL", id: "txtLREMAIL" },
        { name: "INVESTTIME", id: "drdINVESTTIME" },
        { name: "RUIRO", id: "drdRUIRO" },
        { name: "EXPERIENCE", id: "drdEXPERIENCE" },
        { name: "ADDRESS", id: "txtADDRESS" },
        // { name: "PHOTHONXOM" ,id :"txtPHOTHONXOM"},
        // { name: "PHUONGXA" ,id :"txtPHUONGXA"},
        // { name: "THANHPHO" ,id :"txtTHANHPHO"},
        { name: "CAPITALNAME", id: "txtCAPITALNAME" },
        { name: "CAPITALPOSITION", id: "txtCAPITALPOSITION" },
        { name: "CAPITALIDCODE", id: "txtCAPITALIDCODE" },
        { name: "CAPITALIDDATE", id: "txtCAPITALIDDATE" },
        { name: "CAPITALIDPLACE", id: "txtCAPITALIDPLACE" },
        { name: "CAPITALTEL", id: "txtCAPITALTEL" },
        { name: "CAPITALEMAIL", id: "txtCAPITALEMAIL" },
        { name: "ONLINENAME", id: "txtONLINENAME" },
        { name: "ONLINEPHONE", id: "txtONLINEPHONE" },
        { name: "ONLINEEMAIL", id: "txtONLINEEMAIL" },
      ],
      currentcountry: "234",
      listDrop: {
        JOB: [],
        RUIRO: [],
        INVESTTIME: [],
        EXPERIENCE: [],
      },
      generalInformation: {
        CUSTID: "",
        CUSTODYCD: "",
        FULLNAME: "",
        ACCTYPE: "TT",
        CUSTTYPE: "CN",
        GRINVESTOR: "TN",
        SEX: "",
        BIRTHDATE: "",
        IDTYPE: "",
        IDCODE: "",
        IDDATE: "",
        IDPLACE: "",
        TAXNO: "",
        COUNTRY: "234",
        OTHERCOUNTRY: "",
        PHONE: "",
        MOBILE: "",
        EMAIL: "",
        DBCODE: "",
        BANKACC: "",
        BANKCODE: "",
        CITYBANK: "",
        BANKACNAME: "",
        FAX: "",
        INCOMEYEAR: "",
        ISAUTH: 'N',
        TRADINGCODE: "",
        PASSPORT: "",
        PASSPORTDATE: "",
        PASSPORTPLACE: "",
        TAXPLACE: "",
        CAREBY: "",
        INVESTTYPE: "TT",
        IDEXPDATED: "",
        ISONLINE: 'N',
        ISCONTACT: 'N',
        SALEID: "",
        ISFATCA: 'N',
        // SIGN_IMG: "",
        // OWNLICENSE_IMG: "",
        // OWNLICENSE2_IMG: "",
        // OWNLICENSE3_IMG: "",
        // OWNLICENSE4_IMG: "",
        ISAGREE: 'N',
        ISPEP: "N",
        // MGDCK :"Y",
        FAMILYNAME1: "",
        FAMILYNAME2: "",
        NAME1: "",
        NAME2: "",
        // ISOTP: ""
        ISREPRESENTATIVE: "N",
        LRNAME: "",
        LRSEX: "",
        LRDOB: "",
        LRCOUNTRY: "234",
        LRPOSITION: "",
        LRDECISIONNO: "",
        LRID: "",
        LRIDDATE: "",
        LRIDPLACE: "",
        LRADDRESS: "",
        LRCONTACT: "",
        LRPRIPHONE: "",
        LRALTPHONE: "",
        LRFAX: "",
        LREMAIL: "",
        SONHA: "",
        PHOTHONXOM: "",
        PHUONGXA: "",
        THANHPHO: "",
        INVESTTIME: "",
        RUIRO: "",
        EXPERIENCE: "",
        ISAGREESHARE: true,
        // ------batch2----------
        TAXNUMBER: "",
        SONHAREG: "",
        PHOTHONXOMREG: "",
        PHUONGXAREG: "",
        THANHPHOREG: "",
        JOB: "",
        POSITIONCN: "",
        WORKADDRESS: "",
        VISANO: "",
        LIDONHAPCANH: "",
        CAPITALNAME: "",
        CAPITALPOSITION: "",
        CAPITALIDCODE: "",
        CAPITALIDDATE: "",
        CAPITALIDPLACE: "",
        CAPITALTEL: "",
        CAPITALEMAIL: "",
        ONLINENAME: "",
        ONLINEPHONE: "",
        ONLINEEMAIL: "",
        REGADDRESS: "",
        ADDRESS: ""
      },
      CUSTODYCD: "",
      LANGUAGE: "",
      //các thông tin set giá trị mặc định trong trường hợp edit
      //được set vào generalInformation ở willreceiveNextprops
      oldInforBeforeChange: {
      }
    };
  }
  // Haki.:Turning.: Gom thành func dùng chung
  handleMouse(name, value, event) {
    this.state[name] = value
    this.setState({
      ...this.state
    })
  }
  // Haki.:Turning.: ...
  checkValid(name, id) {
    let value = this.state.generalInformation[name];
    let mssgerr = "";
    const { user } = this.props.auth;
    let logic1 = true;
    let logicTKNH = true;
    let logicSDT = true;
    let logicCMND = true;
    let logicONLINEEMAIL = true;
    let logicCAPITALEMAIL = true;
    let ISCN = this.state.generalInformation.CUSTTYPE == "CN";
    let logic = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(this.state.generalInformation.EMAIL);
    let ISCUSTOMER1 = user;
    // let ISLOGIN = ISCUSTOMER1 != '' && ISCUSTOMER1 != undefined;
    let ISLOGIN = !_.isEmpty(ISCUSTOMER1);
    if (this.state.generalInformation["CUSTTYPE"] == 'TC') {
      logic1 = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(this.state.generalInformation.LREMAIL);
      logicTKNH = (/^[a-zA-Z0-9]*$/gm).test(this.state.generalInformation.BANKACC);
      logicSDT = (/^[a-zA-Z0-9]*$/gm).test(this.state.generalInformation.MOBILE);
      logicCMND = (/^[a-zA-Z0-9]*$/gm).test(this.state.generalInformation.IDCODE);
      logicCAPITALEMAIL = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(this.state.generalInformation.CAPITALEMAIL);
      logicONLINEEMAIL = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(this.state.generalInformation.ONLINEEMAIL);
    }
    else if (this.state.generalInformation["CUSTTYPE"] == 'CN') {
      logicTKNH = (/^[a-zA-Z0-9]*$/gm).test(this.state.generalInformation.BANKACC);
      logicSDT = (/^[a-zA-Z0-9]*$/gm).test(this.state.generalInformation.MOBILE);
      logicCMND = (/^[a-zA-Z0-9]*$/gm).test(this.state.generalInformation.IDCODE);
    }
    else {
      logic1 = logic1;
      logicTKNH = logicTKNH;
      logicSDT = logicSDT;
      logicCMND = logicCMND;
      logicONLINEEMAIL = logicONLINEEMAIL;
      logicCAPITALEMAIL = logicCAPITALEMAIL;
    }
    let ISCUSTOMER = user ? user.ISCUSTOMER ? user.ISCUSTOMER == "Y" ? true : false : false : false;
    switch (name) {
      case "FULLNAME":
        if (!value) mssgerr = this.props.strings.requiredFullname;
        break;
      case "SEX":
        if (ISCN && !value) mssgerr = this.props.strings.requiredSex;
        break;
      case "COUNTRY":
        if (value == "") mssgerr = this.props.strings.requiredCountry;
        break;
      case "JOB":
        if (this.state.generalInformation["CUSTTYPE"] == 'CN' && this.state.generalInformation["COUNTRY"] == '234' && value == "") mssgerr = this.props.strings.requiredJOB;
        break;
      case "WORKADDRESS":
        if (this.state.generalInformation["CUSTTYPE"] == 'CN' && this.state.generalInformation["COUNTRY"] == '234' && value == "") mssgerr = this.props.strings.requiredWorkAddress;
        break;
      case "TAXNUMBER":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && value == "") mssgerr = this.props.strings.requiredTAXNUMBER;
        break;
      // case "OTHERCOUNTRY":
      //   if (value == "") mssgerr = this.props.strings.requiredCountry;
      //   break;
      // case "GRINVESTOR":
      //   if (value == "") mssgerr = this.props.strings.requiredGrinvestor;
      //   break;
      case "CUSTTYPE":
        if (value == "") mssgerr = this.props.strings.requiredCustype;
        break;
      // case "TAXNO":
      //   if (
      //     this.state.generalInformation["CUSTTYPE"] == CUSTYPE_TC &&
      //     value == ""
      //   )
      //     mssgerr = this.props.strings.requiredTaxno;
      //   break;
      case "BIRTHDATE":
        if (this.state.generalInformation["CUSTTYPE"] == 'CN' && value == "") mssgerr = this.props.strings.requiredBirthdate;
        break;
      case "IDTYPE":
        if (value == "") mssgerr = this.props.strings.requiredIdtype;
        break;
      case "PASSPORT":
        if (
          ISCN && this.state.generalInformation.COUNTRY != COUNTRY_234 && value == ""
        )
          mssgerr = this.props.strings.requiredTradingcode;
        break;
      case "PASSPORTDATE":
        if (
          ISCN && this.state.generalInformation.COUNTRY != COUNTRY_234 && value == ""
        )
          mssgerr = this.props.strings.requiredPASSPORTDATE;
        break;
      case "PASSPORTPLACE":
        if (
          ISCN && this.state.generalInformation.COUNTRY != COUNTRY_234 && value == ""
        )
          mssgerr = this.props.strings.requiredPASSPORTPLACE;
        break;
      case "LRPRIPHONE":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && value == "") mssgerr = this.props.strings.requiredPRIPHONE;
        break;
      case "IDCODE":
        if (value == "") { mssgerr = this.props.strings.requiredIdcode; }
        else if (this.state.generalInformation["CUSTTYPE"] == 'CN' && !logicCMND) {
          mssgerr = this.props.strings.invalidspace;
        }
        break;
      case "IDDATE":
        if (value == "") mssgerr = this.props.strings.requiredIddate;
        if (
          moment(value, "DD/MM/YYYY") <=
          moment(this.state.generalInformation.BIRTHDATE, "DD/MM/YYYY")
        )
          mssgerr = this.props.strings.invalidIddate;
        break;
      case "IDPLACE":
        if (value == "") mssgerr = this.props.strings.requiredIdplace;
        break;
      case "IDEXPDATED":
        if (value == "") mssgerr = this.props.strings.requiredexpiredate;
        break;
      case "SALEID":
        if (ISLOGIN && value == "") mssgerr = this.props.strings.requiredSALEID;
        break;
      // case "SONHA":
      // if (value == "") mssgerr = this.props.strings.requiredSONHA;
      // break;
      // case "PHOTHONXOM":
      // if (value == "") mssgerr = this.props.strings.requiredPHOTHONXOM;
      // break;
      // case "PHUONGXA":
      // if (value == "") mssgerr = this.props.strings.requiredPHUONGXA;
      // break;
      // case "THANHPHO":
      // if (value == "") mssgerr = this.props.strings.requiredTHANHPHO;
      // break;
      case "ADDRESS":
        if (value == "") mssgerr = this.props.strings.requiredAddress;
        break;
      case "EMAIL":
        if (value == " ") {
          mssgerr = this.props.strings.invalidEmail;
        }
        else if (!logic) {
          mssgerr = this.props.strings.wrongemail;
        }
        break;
      // case "REGADDRESS":
      //   if (ISCN && value == "") mssgerr = this.props.strings.requiredRegaddress
      //   else if (!ISCN && value == "") mssgerr = this.props.strings.requiredRegaddressTC;
      //   break;
      // case "ADDRESS":
      //    if (value == "") mssgerr = this.props.strings.requiredAddress;
      // break;
      case "MOBILE":
        if (value == "" && this.state.generalInformation.ISONLINE == 'Y') { mssgerr = this.props.strings.requiredMobile; }
        else if (!logicSDT) {
          mssgerr = this.props.strings.invalidspace;
        }
        break;
      case "BANKACC":
        if (value == "") { mssgerr = this.props.strings.requiredBankAcc; }
        else if (!logicTKNH) {
          mssgerr = this.props.strings.invalidspace;
        }
        break;
      case "CITYBANK":
        if (value == "") mssgerr = this.props.strings.requiredCitybank;
        break;
      case "BANKCODE":
        if (value == "") mssgerr = this.props.strings.requiredBankCode;
        break;
      case "ACCTYPE":
        if (value == "") mssgerr = this.props.strings.requiredActype;
        break;
      case "CAREBY":
        if (user && value == "" && !ISCUSTOMER && ISLOGIN)
          mssgerr = this.props.strings.requiredCareby;
        break;
      // case "SALEID":
      //   if (user && value == "" && !ISCUSTOMER)
      //     mssgerr = this.props.strings.requiredSaleid;
      //   break;
      // case "SIGN_IMG":
      //   if (value == "") mssgerr = this.props.strings.requiredSignImg;
      //   break; 
      case "INVESTTYPE":
        if (value == "") mssgerr = this.props.strings.requiredInvesttype;
        break;
      case "INVESTTIME":
        if (value == "") mssgerr = this.props.strings.requiredINVESTTIME;
        break;
      case "RUIRO":
        if (value == "") mssgerr = this.props.strings.requiredRUIRO;
        break;
      case "EXPERIENCE":
        if (value == "") mssgerr = this.props.strings.requiredEXPERIENCE;
        break;
      case "ACCTGRP":
        if (value == "") mssgerr = this.props.strings.requiredAcctgrp;
        break;
      case "LRNAME":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && value == "") mssgerr = this.props.strings.requiredLRNAME;
        break;
      case "LRDOB":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && value == "") mssgerr = this.props.strings.requiredLRDOB;
        break;
      case "LRID":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && value == "") mssgerr = this.props.strings.requiredLRID;
        break;
      case "LRIDDATE":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && value == "") mssgerr = this.props.strings.requiredLRIDDATE;
        break;
      case "LRIDPLACE":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && value == "") mssgerr = this.props.strings.requiredLRIDPLACE;
        break;
      case "LREMAIL":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && value == "") {
          mssgerr = this.props.strings.invalidLREmail;
        }
        else if (this.state.generalInformation["CUSTTYPE"] == 'TC' && !logic1) {
          mssgerr = this.props.strings.LRwrongemail;
        }
        break;
      case "CAPITALNAME":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && this.state.generalInformation["CAPITALNAME"] == "") {
          mssgerr = this.props.strings.requiredCAPITALNAME;
        }
        break;
      case "CAPITALPOSITION":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && this.state.generalInformation["CAPITALPOSITION"] == "") {
          mssgerr = this.props.strings.requiredCAPITALPOSITION;
        }
        break;
      case "CAPITALIDCODE":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && this.state.generalInformation["CAPITALIDCODE"] == "") {
          mssgerr = this.props.strings.requiredCAPITALIDCODE;
        }
        break;
      case "CAPITALIDDATE":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && this.state.generalInformation["CAPITALIDDATE"] == "") {
          mssgerr = this.props.strings.requiredCAPITALIDDATE;
        }
        break;
      case "CAPITALIDPLACE":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && this.state.generalInformation["CAPITALIDPLACE"] == "") {
          mssgerr = this.props.strings.requiredCAPITALIDPLACE;
        }
        break;
      case "CAPITALTEL":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && this.state.generalInformation["CAPITALTEL"] == "") {
          mssgerr = this.props.strings.requiredCAPITALTEL;
        }
        break;
      case "CAPITALEMAIL":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && this.state.generalInformation["CAPITALEMAIL"] == "") {
          mssgerr = this.props.strings.requiredCAPITALEMAIL;
        }
        else if (this.state.generalInformation["CUSTTYPE"] == 'TC' && !logicCAPITALEMAIL) {
          mssgerr = this.props.strings.CAPwrongemail;
        }
        break;
        // case "OWNLICENSE_IMG":
        //   if (value == "") mssgerr = this.props.strings.requiredOwnLicenseImg;
        //   break;
        // case "OWNLICENSE2_IMG":
        //   if (value == "") mssgerr = this.props.strings.requiredOwnLicense2Img;
        //   break;
        // case "OWNLICENSE3_IMG":
        //   if (
        //     value == "" &&
        //     this.state.generalInformation["COUNTRY"] !== COUNTRY_234 
        //     && this.state.generalInformation["OTHERCOUNTRY"] !== COUNTRY_234 
        //   )
        //     mssgerr = this.props.strings.requiredOwnLicense3Img;
        //   break;
        // case "OWNLICENSE4_IMG":
        //   if (
        //     value == "" &&
        //     this.state.generalInformation["COUNTRY"] !== COUNTRY_234
        //     && this.state.generalInformation["OTHERCOUNTRY"] !== COUNTRY_234 
        //   )
        //     mssgerr = this.props.strings.requiredOwnLicense4Img;
        //   break;
        // case "RCV_EMAIL":
        //   if (
        //     value == false &&
        //     this.state.generalInformation["RCV_SMS"] == false &&
        //     this.state.generalInformation["RCV_MAIL"] == false
        //   )
        //     mssgerr = this.props.strings.requiredReportMethod;
        //   else if (
        //     value == true &&
        //     this.state.generalInformation["EMAIL"] == ""
        //   ) {
        //     mssgerr = this.props.strings.requiredEmail;
        //     id = "txtEmail";
        //   }
        //   break;
        // case "CAPITALEMAIL":        
        //  if (this.state.generalInformation["CUSTTYPE"] == 'TC' && value !== '' && !logicCAPITALEMAIL) {
        //   mssgerr = this.props.strings.CAPwrongemail;
        // }
        break;
      case "ONLINENAME":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && value == "") mssgerr = this.props.strings.requiredONLINENAME;
        break;
      case "ONLINEEMAIL":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && value == "") {
          mssgerr = this.props.strings.requiredONLINEEMAIL;
        }
        else if (this.state.generalInformation["CUSTTYPE"] == 'TC' && !logicONLINEEMAIL) {
          mssgerr = this.props.strings.OLwrongemail;
        }
        break;
      case "ONLINEPHONE":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && value == "") mssgerr = this.props.strings.requiredONLINEPHONE;
        break;
      case "ISAGREE":
        if (value == 'N' || !value) mssgerr = this.props.strings.requiredAgree;
      default:
        break;
    }
    if (mssgerr !== "") {
      var { dispatch } = this.props;
      var datanotify = {
        type: "",
        header: "",
        content: ""
      };
      datanotify.type = "error";
      datanotify.content = mssgerr;
      dispatch(showNotifi(datanotify));
      window.$(`#${id}`).focus();
    }
    return mssgerr;
  }
  async onSetDefaultValue(type, value) {
    if (!this.state.generalInformation[type]) {
      if (type == "BANKCODE") {
        let that = this;
        await RestfulUtils.post("/account/getbankbranch", {
          mbid: value,
          language: this.props.language
        }).then(res => {
          that.setState({
            ...that.state,
            optionsDataCN: res.result
          });
        });
        this.state.generalInformation[type] = value;
      }
      if (type == "COUNTRY") {
        //let that = this
        await RestfulUtils.post("/account/getidtype", {
          action: this.props.access,
          custtype: this.state.generalInformation.CUSTTYPE,
          grinvestor: this.state.generalInformation.GRINVESTOR,
          country: this.state.generalInformation.COUNTRY,
          language: this.props.language
        }).then(res => {
          if (res) {
            this.setState({
              ...this.state,
              optionsIdType: res.result,
              generalInformation: {
                ...this.state.generalInformation,
                //IDTYPE: res.result[0].value
              }
            });
          }
        });
        this.state.generalInformation[type] = value;
      } else {
        this.state.generalInformation[type] = value;
      }
    }
  }
  async getOptionsMaMoGioi(input) {
    return { options: this.state.optionsDataMG }
  }
  async getOptionsAsync(input) {
    return { options: this.state.listDrop[input] }
  }
  async onSubmit() {
    let { user } = this.props.auth;
    let { oldInforBeforeChange, generalInformation } = this.state;
    generalInformation.DBCODE = !user ? '' : user.DBCODE ? user.DBCODE : '';
    let isConfirm = ((oldInforBeforeChange.IDCODE == generalInformation.IDCODE)
      && (oldInforBeforeChange.IDDATE == generalInformation.IDDATE)
      && (oldInforBeforeChange.IDEXPDATED == generalInformation.IDEXPDATED)
      && (oldInforBeforeChange.IDPLACE == generalInformation.IDPLACE)
      && (oldInforBeforeChange.TRADINGCODE == generalInformation.TRADINGCODE)
      && (oldInforBeforeChange.PASSPORT == generalInformation.PASSPORT)
      && (oldInforBeforeChange.PASSPORTPLACE == generalInformation.PASSPORTPLACE)
      && (oldInforBeforeChange.PASSPORTDATE == generalInformation.PASSPORTDATE)
      && (oldInforBeforeChange.TAXPLACE == generalInformation.TAXPLACE)
      && (oldInforBeforeChange.TAXNO == generalInformation.TAXNO)
      && (oldInforBeforeChange.EMAIL == generalInformation.EMAIL)
      && (oldInforBeforeChange.MOBILE == generalInformation.MOBILE)
      && (oldInforBeforeChange.BANKACC == generalInformation.BANKACC)
      && (oldInforBeforeChange.BANKCODE == generalInformation.BANKCODE)
      && (oldInforBeforeChange.BANKCODE == generalInformation.BANKCODE)
      && (oldInforBeforeChange.CITYBANK == generalInformation.CITYBANK)
      // && (oldInforBeforeChange.SIGN_IMG == generalInformation.SIGN_IMG) 
      // && (oldInforBeforeChange.OWNLICENSE_IMG == generalInformation.OWNLICENSE_IMG) 
      // && (oldInforBeforeChange.OWNLICENSE2_IMG == generalInformation.OWNLICENSE2_IMG)
    ) ? false : true;
    var mssgerr = "";
    for (let index = 0; index < this.state.checkFields.length; index++) {
      const element = this.state.checkFields[index];
      mssgerr = this.checkValid(element.name, element.id);
      if (mssgerr !== "") break;
    }
    //generalInformation.DBCODE = user.DBCODE;

    let isValidBankAcc = this.props.checkValidBankAccount(generalInformation);
    if (mssgerr == "" && isValidBankAcc === true) {
      await this.props.isConfirm(isConfirm);
      await this.props.onSubmit(generalInformation);
    }
  }


  // Haki.:Turning.: 1. Cần chuyển sang switch case. 2. Ở các case gán this.state.VAR.PROPERTY = Value và Cần gom việc this.setState ở cuối cùng. = Hạn chế việc gọi this.setState ở từng case
  async onChange(type, event) {
    if (event.target) {
      if (event.target.type == "checkbox") {
        if (event.target.checked == false) {
          this.state.generalInformation[type] = 'N';
          if (type == 'ISAGREESHARE') {
            this.state.generalInformation[type] = false;
          }
        }
        else {
          this.state.generalInformation[type] = 'Y';
          if (type == 'ISAGREESHARE') {
            this.state.generalInformation[type] = true;
          }
        }
        this.setState({ generalInformation: this.state.generalInformation })
      } else {
        this.state.generalInformation[type] = event.target.value;
      }
    } else {
      if (type == "BANKCODE") {
        let that = this;
        RestfulUtils.post("/account/getbankbranch", {
          mbid: event.value,
          language: this.props.language
        }).then(res => {
          that.setState({
            ...that.state,
            optionsDataCN: res.result
          });
        });
      }
      // if(type=='IDTYPE'){
      //   this.checkOldAcc(event.value,this.state.generalInformation.IDCODE);
      // }
      if (type == "IDDATE") {
        var arrResultDate = event.value.split("/");
        var newyear = parseInt(arrResultDate[2]) + 15;
        this.state.generalInformation.IDEXPDATED =
          arrResultDate[0] + "/" + arrResultDate[1] + "/" + newyear;
      } else if (type == "IDCODE" && this.props.access == "add") {
        this.checkOldAcc(
          this.state.generalInformation.IDTYPE,
          event.target.value
        );
      } else if (type == "GRINVESTOR") {
        //this.getOptionsIdType(this.state.generalInformation.CUSTTYPE, event.value)
      }
      else if (type == "COUNTRY") {
        if (event.value == COUNTRY_234) {
          this.state.generalInformation["GRINVESTOR"] = GRINVESTOR_TN;
          window.$("#drdIdtype").prop("disabled", false);
          this.state.generalInformation[type] = event.value;
        } else {
          this.state.generalInformation["GRINVESTOR"] = GRINVESTOR_NN;
          //this.state.generalInformation["IDTYPE"]=IDTYPE_009;
          window.$("#drdIdtype").prop("disabled", true);
          this.state.generalInformation[type] = event.value;
          this.state.currentcountry = event.value;
          this.state.showLabelLoaiDKSH = true;
        }
        //lay ds idtype
        await RestfulUtils.post("/account/getidtype", {
          action: this.props.access,
          custtype: this.state.generalInformation.CUSTTYPE,
          grinvestor: this.state.generalInformation.GRINVESTOR,
          country: this.state.generalInformation.COUNTRY,
          language: this.props.language
        }).then(res => {
          if (res) {
            this.setState({
              ...this.state,
              optionsIdType: res.result,
              generalInformation: {
                ...this.state.generalInformation,
                IDTYPE: res.result[0].value
              }
            });
          }
        });
      }
      else if (type == "CUSTTYPE") {
        let a = '';
        if (this.state.generalInformation.COUNTRY == '234') {
          a = 'TN';
        }
        else {
          a = 'NN';
        }
        let b = this.state.currentcountry;
        await RestfulUtils.post("/account/getidtype", {
          action: this.props.access,
          custtype: event.value,
          grinvestor: a,
          country: this.state.currentcountry,
          language: this.props.language
        }).then(res => {
          // gan mac dinh lay kq dau tien
          if (res) {
            // tuy chinh theo truong hop them se luon mac dinh lay kq dau tien
            if (this.props.access == "add") {
              if (event.value == 'CN') {
                this.setState({ ...this.state, generalInformation: { ...this.state.generalInformation, ISAUTH: 'N', ISPEP: 'N', ISREPRESENTATIVE: 'N', COUNTRY: b } });
              }
              else {
                this.setState({ ...this.state, generalInformation: { ...this.state.generalInformation, ISAUTH: 'N', ISPEP: 'N', ISREPRESENTATIVE: 'Y', COUNTRY: b } });
              }
              this.setState({
                ...this.state,
                optionsIdType: res.result,
                generalInformation: {
                  ...this.state.generalInformation,
                  IDTYPE: res.result[0].value
                }
              });
            } else {
              if (this.state.generalInformation.COUNTRY == COUNTRY_234) {
                if (event.value == "CN") {
                  this.setState({
                    ...this.state,
                    optionsIdType: res.result,
                    generalInformation: {
                      ...this.state.generalInformation,
                      IDTYPE: res.result[0].value
                    }
                  });
                } else {
                  this.setState({
                    ...this.state,
                    optionsIdType: res.result,
                    generalInformation: {
                      ...this.state.generalInformation,
                      IDTYPE: res.result[4].value
                    }
                  });
                }
              } else {
                this.setState({
                  ...this.state,
                  optionsIdType: res.result,
                  generalInformation: {
                    ...this.state.generalInformation,
                    IDTYPE: res.result[5].value
                  }
                });
              }
            }
          }
        });
      }
      this.state.generalInformation[type] = event.value;
    }
    this.setState({
      generalInformation: this.state.generalInformation
    });
  }
  async getOptionsCN(input) {
    return await { options: this.state.optionsDataCN };
  }
  async getOptionsIdType(custtype, grinvestor) {
    return await { options: this.state.optionsIdType };
  }
  async getOptionsSaleid() {
    return await { options: this.state.optionsSaleid };
  }
  async onChangeCN(e) {
    if (e && e.value) {
      this.state.generalInformation["CITYBANK"] = e.value;
      this.setState(this.state);
    } else {
      this.state.generalInformation["CITYBANK"] = "";
      this.setState(this.state);
    }
  }
  // Haki.:Turning.: Gom func dùng chung. Hàm này hiện tại code còn đang không dùng :))
  _handleSIGNIMGChange = (type, e) => {
    // _handleSIGNIMGChange => type = SIGN_IMG
    // _handleOWNLICENSEIMGChange => type = OWNLICENSE_IMG
    // _handleOWNLICENSE2IMGChange => type = OWNLICENSE2_IMG
    // _handleOWNLICENSE3IMGChange => type = OWNLICENSE3_IMG
    // _handleOWNLICENSE4IMGChange => type = OWNLICENSE4_IMG
    e.preventDefault();
    let that = this;
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      var tempImg = new Image();
      tempImg.src = reader.result;
      tempImg.onload = function () {
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
        var canvas = document.createElement("canvas");
        canvas.width = tempW;
        canvas.height = tempH;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0, tempW, tempH);
        var dataURL = canvas.toDataURL("image/png");
        that.state.generalInformation[type] = dataURL;
        that.setState(that.state);
      };
    };
    reader.readAsDataURL(file);
  };

  getCfmastInfo(CUSTODYCD, OBJNAME) {
    let tmp = {}
    RestfulUtils.post('/account/getcfmastinfo', { language: this.props.language, custodycd: CUSTODYCD, OBJNAME: OBJNAME })
      .then((res) => {
        if (res.EC == 0) {
          tmp = res.DT.dataMain
          this.setState({ oldInforBeforeChange: tmp })
        }
      })
  }
  async componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps:', nextProps)
    let self = this
    let CUSTODYCD = nextProps.CfmastInfo ? nextProps.CfmastInfo.DT.dataMain.CUSTODYCD ? nextProps.CfmastInfo.DT.dataMain.CUSTODYCD : "" : ""
    let LANGUAGE = this.props.language ? this.props.language : "vie"
    console.log('window.location:::', window.location)
    self.getOptionsJOB();
    self.getOptionsRUIRO();
    self.getOptionsEXPERIENCE();
    self.getOptionsINVESTTIME();
    if (nextProps.CfmastInfo) {
      this.getCfmastInfo(nextProps.CfmastInfo.DT.dataMain.CUSTODYCD, nextProps.OBJNAME);
    }
    let optionsDataMG = [];
    if (nextProps.access !== "add") {
      if (CUSTODYCD && this.state.CUSTODYCD != CUSTODYCD || LANGUAGE != this.state.LANGUAGE) {
        this.setState({ CUSTODYCD: CUSTODYCD, LANGUAGE: LANGUAGE })
        let a = {};
        let oldInfor = nextProps.CfmastInfo.DT.dataMain;
        let custid = oldInfor.CUSTID;
        await RestfulUtils.post("/account/getcfmastbycustid", {
          custid: custid,
          //OBJNAME: this.props.OBJNAME,
          language: this.props.language
        }).then(res => {
          a = { ...res.DT[0] };
        });
        oldInfor = { ...a };
        if (oldInfor) {
          await RestfulUtils.post('/user/getListSaleidByTLID', { language: this.props.language })
            .then((res) => {
              optionsDataMG = res.result
              let i = 0;
              for (i = 0; i < optionsDataMG.length; i++) {
                if (oldInfor.SALEID == optionsDataMG[i].value) {
                  oldInfor.SALEID = optionsDataMG[i];
                }
              }
            })
          if (this.props.isLoadChiNhanh) {
            await RestfulUtils.post("/account/getbankbranch", {
              mbid: oldInfor.BANKCODE,
              language: this.props.language
            }).then(res => {
              self.setState({
                ...self.state,
                optionsDataCN: res.result
              });
            });
          }
          await RestfulUtils.post("/account/getidtype", {
            action: this.props.access,
            custtype: oldInfor.CUSTTYPE,
            grinvestor: this.state.generalInformation.GRINVESTOR,
            country: oldInfor.COUNTRY,
            language: this.props.language
          }).then(res => {
            self.setState({
              ...self.state,
              optionsIdType: res.result,
              generalInformation: {
                ...self.state.generalInformation,
                IDTYPE: res.result[0].value
              }
            });
          });
          if (nextProps.access == "view" || nextProps.access == "update") {
            oldInfor.ISAGREE = 'Y';
            window.$("#cbIsagree").prop("checked", true);
            await RestfulUtils.post("/account/getbankbranch", {
              mbid: oldInfor.BANKCODE,
              language: this.props.language
            }).then(res => {
              self.setState({
                ...self.state,
                optionsDataCN: res.result
              });
            });
          } else {
            oldInfor.ISAGREE = 'N';
            window.$("#cbIsagree").prop("checked", false);
          }
          // if (oldInfor.ISAUTH) window.$("#cbIsauth").prop("checked", true);
          if (oldInfor.ISONLINE == 'Y' || oldInfor.ISONLINE == true) {
            oldInfor.ISONLINE = 'Y';
            window.$("#cbISONL").prop("checked", true);
          } else {
            oldInfor.ISONLINE = 'N';
            window.$("#cbISONL").prop("checked", false);
          }
          if (oldInfor.ISAGREESHARE == 'Y' || oldInfor.ISAGREESHARE == true) {
            oldInfor.ISAGREESHARE = true;
            window.$("#cbISAGREESHARE").prop("checked", true);
          } else {
            oldInfor.ISAGREESHARE = false;
            window.$("#cbISAGREESHARE").prop("checked", false);
          }
          if (oldInfor.ISAUTH == 'Y' || oldInfor.ISAUTH == true) {
            oldInfor.ISAUTH = 'Y';
            window.$("#cbIsauth").prop("checked", true);
          } else {
            oldInfor.ISAUTH = 'N';
            window.$("#cbIsauth").prop("checked", false);
          }
          if (oldInfor.ISFATCA == 'Y' || oldInfor.ISFATCA == true) {
            oldInfor.ISFATCA = 'Y';
            window.$("#cbISFATCA").prop("checked", true);
          } else {
            oldInfor.ISFATCA = 'N';
            window.$("#cbISFATCA").prop("checked", false);
          }
          if (oldInfor.ISCONTACT == 'Y' || oldInfor.ISCONTACT == true) {
            oldInfor.ISCONTACT = 'Y';
            window.$("#cbIsHaveInfoContact").prop("checked", true);
          } else {
            oldInfor.ISCONTACT = 'N';
            window.$("#cbIsHaveInfoContact").prop("checked", false);
          }
          // if (oldInfor.RCV_EMAIL) window.$("#cbIsemail").prop("checked", true);
          // if (oldInfor.RCV_SMS) window.$("#cbIssms").prop("checked", true);
          // if (oldInfor.RCV_MAIL) window.$("#cbIsmanual").prop("checked", true);
          this.setState({
            ...this.state,
            generalInformation: { ...oldInfor },
          });
        }
      }
      else {
        if (CUSTODYCD == "") {
          this.setState({
            CUSTODYCD: "",
          });
        }
      }
    }
    // ADD QLTK
    else {
      console.log('this.props.CUSTTYPE:::', this.props.CUSTTYPE)
      let language = '';
      if (window.location.pathname && window.location.pathname == '/createaccount' && window.location.search) {
        language = window.location.search.substring(10)
      }
      else {
        language = this.props.language
      }
      if (LANGUAGE != this.state.LANGUAGE) {
        this.setState({ LANGUAGE: LANGUAGE })
        await RestfulUtils.post("/account/getidtype", {
          action: this.props.access,
          custtype: this.props.CUSTTYPE ? this.props.CUSTTYPE : this.state.generalInformation.CUSTTYPE,
          grinvestor: this.state.generalInformation.GRINVESTOR,
          country: this.state.generalInformation.COUNTRY,
          language: language
        }).then(res => {
          if (res) {
            self.setState({
              ...self.state,
              optionsIdType: res.result,
            });
          }
        });
        //load lai chi nhanh
        if (this.props.isLoadChiNhanh) {
          await RestfulUtils.post("/account/getbankbranch", {
            mbid: this.state.generalInformation.BANKCODE,
            language: language
          }).then(res => {
            self.setState({
              ...self.state,
              optionsDataCN: res.result
            });
          });
        }
        //lay ds saleid
        RestfulUtils.post('/user/getListSaleidByTLID', { language: language })
          .then((res) => {
            self.setState({
              ...self.state, optionsDataMG: res.result
            })
          })
      }
    }
  }
  async componentWillMount() {
    console.log('componentWillMount.:===========Haki===============', this.props.language)
    let self = this
    //gan lai thong tin cu 
    let oldInfor = this.props.GeneralInfoMain ? this.props.GeneralInfoMain : this.props.CfmastInfo ? this.props.CfmastInfo.DT.dataMain : null;
    // oldInfor.BANKCODE = this.props.BANKCODE;
    // oldInfor.ISAGREESHARE = this.props.ISAGREESHARE;
    let CUSTODYCD = oldInfor ? oldInfor.CUSTODYCD ? oldInfor.CUSTODYCD : "" : ""
    // console.log('componentWillMount.:Begin=oldInfor.ISONLINE.:', oldInfor,this.state.CUSTODYCD, CUSTODYCD )
    if (oldInfor) {
      //console.log('old infor will mount:',oldInfor)
      if (oldInfor.ISAGREE !== 'Y') oldInfor.ISAGREE = 'N';
      // console.log('componentWillMount.:oldInfor.ISONLINE1.:', oldInfor.ISONLINE, oldInfor.ISONLINE !== 'Y' || oldInfor.ISONLINE !== true)
      if (oldInfor.ISONLINE !== 'Y') oldInfor.ISONLINE = 'N';
      if (oldInfor.ISAUTH !== 'Y') oldInfor.ISAUTH = 'N';
      if (oldInfor.ISFATCA !== 'Y') oldInfor.ISFATCA = 'N';
      if (oldInfor.ISAGREESHARE !== 'Y') oldInfor.ISAGREESHARE = false;
      oldInfor.BANKCODE = this.props.BANKCODE;
      oldInfor.CUSTTYPE = this.props.CUSTTYPE;
      oldInfor.ISAGREESHARE = this.props.ISAGREESHARE;
      await RestfulUtils.post("/account/getidtype", {
        action: this.props.access,
        custtype: oldInfor.CUSTTYPE,
        grinvestor: this.state.generalInformation.GRINVESTOR,
        country: oldInfor.COUNTRY,
        language: this.props.language
      }).then(res => {
        if (res) {
          self.setState({
            ...self.state,
            optionsIdType: res.result,
          });
        }
      });
      //load lai chi nhanh
      if (this.props.isLoadChiNhanh) {
        await RestfulUtils.post("/account/getbankbranch", {
          mbid: oldInfor.BANKCODE,
          language: this.props.language
        }).then(res => {
          self.setState({
            ...self.state,
            optionsDataCN: res.result
          });
        });
      }
      //lay ds idtype
      this.setState({ ...this.state, generalInformation: oldInfor });
    }
  }
  componentDidMount() {
    const { user } = this.props.auth;
    let { generalInformation } = this.state;
    let self = this
    self.getOptionsJOB();
    self.getOptionsRUIRO();
    self.getOptionsEXPERIENCE();
    self.getOptionsINVESTTIME();
    if (this.props.access == "add") {
      let ISCUSTOMER = user ? user.ISCUSTOMER ? user.ISCUSTOMER == "Y" ? true : false : false : false;
      // set mac dinh neu la cus thi mac dinh ISONL chon true
      window.$("#cbISONL").prop("checked", ISCUSTOMER ? true : false);
      if (ISCUSTOMER) {
        this.state.generalInformation.ISONLINE = 'Y'
        this.setState({ generalInformation: this.state.generalInformation })
      } else {
        this.state.generalInformation.ISONLINE = 'N'
        this.setState({ generalInformation: this.state.generalInformation })
      }
    }
    else {
    }
    let language = '';
    if (window.location.pathname && window.location.pathname == '/createaccount' && window.location.search) {
      language = window.location.search.substring(10)
    }
    else {
      language = this.props.language
    }
    RestfulUtils.post("/account/getidtype", {
      action: this.props.access,
      custtype: this.props.CUSTTYPE ? this.props.CUSTTYPE : this.state.generalInformation.CUSTTYPE,
      grinvestor: this.state.generalInformation.GRINVESTOR,
      country: this.state.generalInformation.COUNTRY,
      language: language
    }).then(res => {
      if (res) {
        self.setState({
          ...self.state,
          optionsIdType: res.result,
        });
      }
    });
    //lay ds saleid
    RestfulUtils.post('/user/getListSaleidByTLID', { language: this.props.language })
      .then((res) => {
        self.setState({
          ...self.state, optionsDataMG: res.result
        })
      })
    if (this.props.OBJNAME !== "CREATEACCOUNT") { // tranh loi khi goi o create acc
      RestfulUtils.post("/account/getctv", {
        action: this.props.access,
        language: this.props.language,
        OBJNAME: this.props.OBJNAME
      }).then(res => {
        if (res) {
          if (res.result) {
            if (res.result.length > 0) {
              self.setState({
                ...self.state,
                optionsSaleid: res.result,
                generalInformation: {
                  ...self.state.generalInformation,
                  //SALEID: res.result[0]
                }
              });
            }
          }
        }
      });
    }
    //them popover cho 1 so input
    window.$(function () {
      var options = { trigger: "hover focus" };
      $('[data-toggle="popover"]').popover(options);
    });
    window.$("#txtFullname").focus();
    let oldInfor = this.props.GeneralInfoMain ? this.props.GeneralInfoMain : this.props.CfmastInfo ? this.props.CfmastInfo.DT.dataMain : null;
    if (oldInfor) {
      if (oldInfor.ISAGREE == 'Y') window.$("#cbIsagree").prop("checked", true);
      if (oldInfor.ISCONTACT == 'Y')
        window.$("#cbIsHaveInfoContact").prop("checked", true);
      if (oldInfor.ISAUTH == 'Y' || oldInfor.ISAUTH == true) window.$("#cbIsauth").prop("checked", true);
      if (oldInfor.ISONLINE == 'Y' || oldInfor.ISONLINE == true) window.$("#cbISONL").prop("checked", true);
      if (oldInfor.ISAGREESHARE == 'Y' || oldInfor.ISAGREESHARE == true) window.$("#cbISAGREESHARE").prop("checked", true);
      if (oldInfor.ISFATCA == 'Y' || oldInfor.ISFATCA == true) window.$("#cbISFATCA").prop("checked", true);
      oldInfor.BANKCODE = this.props.BANKCODE;
      oldInfor.CUSTTYPE = this.props.CUSTTYPE;
      // if (oldInfor.RCV_EMAIL) window.$("#cbIsemail").prop("checked", true);
      // if (oldInfor.RCV_SMS) window.$("#cbIssms").prop("checked", true);
      // if (oldInfor.RCV_MAIL) window.$("#cbIsmanual").prop("checked", true);
    }
    let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == "Y" ? true : false : false : false;
    if (isCustom) {
      this.state.generalInformation["ACCTYPE"] = ACTYPE_TT;
      $("#drdAcctype").prop("disabled", true);
    } else $("#drdAcctype").prop("disabled", false);
    generalInformation.BANKCODE = this.props.BANKCODE;
    self.setState({ generalInformation: generalInformation })
  }
  validBirthdate(current) {
    const currentDate = moment().subtract(1, "day");
    return current < currentDate;
  }
  getOptionsCareby(input) {
    //lay ds careby
    return RestfulUtils.post("/account/getcareby4tlid", {
      language: this.props.language
    }).then(res => {
      return { options: res };
    });
  }
  getOptionsRUIRO() {
    let language = '';
    if (window.location.pathname && window.location.pathname == '/createaccount' && window.location.search) {
      language = window.location.search.substring(10)
    }
    else {
      language = this.props.language
    }
    //lay ds careby
    let self = this;
    RestfulUtils.post("/account/getruiro", {
      language: language
    }).then((res) => {
      self.state.listDrop.RUIRO = res
      self.setState({
        listDrop: self.state.listDrop
      })
    })
  }
  getOptionsJOB() {
    let language = '';
    if (window.location.pathname && window.location.pathname == '/createaccount' && window.location.search) {
      language = window.location.search.substring(10)
    }
    else {
      language = this.props.language
    }
    //lay ds careby
    let self = this;
    RestfulUtils.post("/account/getjob", {
      language: language
    }).then((res) => {
      self.state.listDrop.JOB = res
      self.setState({
        listDrop: self.state.listDrop
      })
    })
  }
  getOptionsINVESTTIME() {
    let language = '';
    if (window.location.pathname && window.location.pathname == '/createaccount' && window.location.search) {
      language = window.location.search.substring(10)
    }
    else {
      language = this.props.language
    }
    //lay ds careby
    let self = this;
    RestfulUtils.post("/account/getinvesttime", {
      language: language
    }).then((res) => {
      self.state.listDrop.INVESTTIME = res
      self.setState({
        listDrop: self.state.listDrop
      })
    })
  }
  getOptionsEXPERIENCE() {
    let language = '';
    if (window.location.pathname && window.location.pathname == '/createaccount' && window.location.search) {
      language = window.location.search.substring(10)
    }
    else {
      language = this.props.language
    }
    //lay ds careby
    let self = this;
    RestfulUtils.post("/account/getexperience", {
      language: language
    }).then((res) => {
      self.state.listDrop.EXPERIENCE = res
      self.setState({
        listDrop: self.state.listDrop
      })
    })
  }
  // Haki.:Turning.: Các func onChange có thể dùng chung và case ra với 1 số trường hợp đặc biệt
  onChangeByType(type, e) {
    if (e && e.value) {
      if (type == 'IDTYPE') {
        this.checkOldAcc(e.value, this.state.generalInformation.IDCODE);
      }
      this.state.generalInformation[type] = e.value;
      this.setState(this.state);
    } else {
      this.state.generalInformation[type] = "";
      this.setState(this.state);
    }
  }
  checkOldAcc = (idtype, idcode) => {
    let that = this;
    RestfulUtils.post("/account/checkoldaccount", {
      idtype: idtype,
      idcode: idcode
    }).then(res => {
      if (res.DT.fn_check_oldaccount == 1) {
        that.setState({
          isExistAcc: true
        });
      } else {
        that.setState({
          isExistAcc: false
        });
      }
    });
  };
  export(action) {
    let that = this;
    var body = {};
    var param = "";
    let obj = {};
    let rptid = "RP0015";
    if (action == "openExport") {
      obj.custodycd = this.state.generalInformation["CUSTODYCD"];
    } else if (action == "editExport") {
      rptid = "RP0016";
      //obj.frdate=moment(this.props.tradingdate).subtract(30,'d').format('DD/MM/YYYY')
      obj.frdate = moment(this.props.tradingdate, "DD/MM/YYYY")
        .subtract(30, "days")
        .format("DD/MM/YYYY");
      obj.todate = this.props.tradingdate;
      obj.custodycd = this.state.generalInformation["CUSTODYCD"];
      if (this.props.ACCTGRP == "N") {
        rptid = "RP0017";
        obj.owner = "owner";
      }
    } else {
      rptid = "RP0025";
      obj.custodycd = this.state.generalInformation["CUSTODYCD"];
    }
    for (var key in obj) {
      param += "'" + obj[key] + "',";
    }
    if (param.length > 0) {
      param = param.substring(0, param.length - 1);
    }
    var win = window.open("", "printwindow");
    win.document.write(
      '<html><head><title>Loading</title><link rel="stylesheet" type="text/css" href="/styles/demo.css"></head><body>'
    );
    win.document.write("<div >" + this.props.strings.loading + "</div>");
    win.document.write("</body></html>");
    //  body.p_rptparam ='('+ this.genRPTPARAM(outParams)+')';
    body.p_rptparam = param;
    body.p_rptid = rptid;
    body.p_exptype = "PDF";
    body.p_reflogid = obj.custodycd;
    this.state["titlebutton" + action] = that.props.strings.waitexport;
    this.state["disablebutton" + action] = true;
    this.setState(that.state);
    RestfulUtils.post("/report/createReportRequest_manageracct", body).then(
      res => {
        if (res.EC == 0) {
          let data = {
            p_brid: "ALL",
            p_language: this.props.lang,
            p_autoid: res.DT.p_refrptlogs,
            p_custodycd: obj.custodycd,
            p_rptid: rptid
          };
          var time = 0;
          var handle = setInterval(function () {
            RestfulUtils.post("/fund/get_rptfile_bycustodycd", data).then(
              resData => {
                time += 5000;
                if (resData.DT.data.length > 0) {
                  that.state["titlebutton" + action] =
                    that.props.strings["createxport" + action];
                  that.state["disablebutton" + action] = false;
                  that.setState(that.state);
                  clearInterval(handle);
                  let autoid = res.DT.p_refrptlogs;
                  let link = resData.DT.data[0].REFRPTFILE;
                  let linkdown =
                    "/report/downloadReport?AUTOID=" +
                    autoid +
                    "&extension=.PDF&TYPE=M" +
                    "&RPTID=" +
                    rptid +
                    "&REFRPTFILE=" +
                    link;
                  win.location.href = linkdown;
                  var handle1 = setInterval(function () {
                    win.close();
                    clearInterval(handle1);
                  }, 1000);
                }
                if (time == 60000) {
                  clearInterval(handle);
                  win.close();
                  toast.error(that.props.strings.failexport, {
                    position: toast.POSITION.BOTTOM_RIGHT
                  });
                  that.state["titlebutton" + action] =
                    that.props.strings["createxport" + action];
                  that.state["disablebutton" + action] = false;
                  that.setState(that.state);
                }
              }
            );
          }, 5000);
        } else {
          toast.error(res.EM, { position: toast.POSITION.BOTTOM_RIGHT });
          this.state["titlebutton" + action] =
            that.props.strings["createxport" + action];
          this.state["disablebutton" + action] = false;
          this.setState(that.state);
        }
      }
    );
  }
  getRenderTooltip = () => {
    const tooltipStyle1 = { display: this.state.hover1 ? 'block' : 'none' }
    const tooltipStyle2 = { display: this.state.hover2 ? 'block' : 'none' }
    const tooltipStyle3 = { display: this.state.hover3 ? 'block' : 'none' }
    let renderTooltip1 = '', renderTooltip2 = '', renderTooltip3 = '';
    renderTooltip1 = this.props.strings.tooltip1;
    //dấu hiệu Mỹ
    renderTooltip2 =
      <React.Fragment>
        <div style={{ paddingLeft: '10px', marginBottom: '10px', fontWeight: 600 }}>
          {this.props.strings.tooltip20}
        </div>
        <ul>
          <li>- {this.props.strings.tooltip21}</li>
          <li>- {this.props.strings.tooltip22}</li>
          <li>- {this.props.strings.tooltip23}</li>
          <li>- {this.props.strings.tooltip24}</li>
          <li>- {this.props.strings.tooltip25}</li>
          <li>- {this.props.strings.tooltip26}</li>
          <li>- {this.props.strings.tooltip27}</li>
        </ul>
      </React.Fragment>
    //có ảnh hưởng chính trị
    renderTooltip3 =
      <div style={tooltipStyle3}>
        {this.props.strings.tooltip30}<br />
        {this.props.strings.tooltip31} <br />
        {this.props.strings.tooltip32}<br />
      </div>
    return { tooltipStyle1, tooltipStyle2, tooltipStyle3, renderTooltip1, renderTooltip2, renderTooltip3 }
  }
  render() {
    let isRenderUyQuyen = true;
    let isRenderCareby = true
    const { user } = this.props.auth;
    let { tooltipStyle1, tooltipStyle2, tooltipStyle3, renderTooltip1, renderTooltip2, renderTooltip3 } = this.getRenderTooltip();
    let ISCUSTOMER = user;
    // let ISLOGIN = ISCUSTOMER != '' && ISCUSTOMER != undefined;
    let ISLOGIN = !_.isEmpty(user);
    let ISCN = this.state.generalInformation.CUSTTYPE == "CN";
    ISCUSTOMER = user ? user.ISCUSTOMER ? user.ISCUSTOMER == "Y" ? true : false : false : false;
    let isUPDATE = this.props.access == "update";
    let isVIEW = this.props.access == "view";
    ISCUSTOMER = user ? user.ISCUSTOMER ? user.ISCUSTOMER == "Y" ? true : false : false : false;
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;
    let { ISONLINE } = this.state.generalInformation;
    let isDisableWhenView = this.props.access == "view";
    let isDisableWhenUpdate = this.props.access == "update";
    let displayExport = this.props.access == "add" ? "none" : "block";
    return (
      <div disabled={ISCUSTOMER ? true : false}>
        <div className={this.props.access !== "view" ? "" : "disable"}>
          <div className="row background-white mb-10">
            <div className="col-md-12 container">
              <h5 className="">
                <b>Thông tin khách hàng</b>
              </h5>
            </div>
            {/* Row 1 */}
            <div className="col-md-12 ">
              <div className="form-group col-md-3">
                <label htmlFor="custype">{this.props.strings.custtype} <span style={{ 'color': 'red' }}> *</span></label>
                <DropdownFactory
                  disabled={isDisableWhenView || isDisableWhenUpdate}
                  onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                  onChange={this.onChange.bind(this)}
                  ID="drdCusttype"
                  value="CUSTTYPE"
                  CDTYPE="CF"
                  CDNAME="CUSTTYPE"
                  CDVAL={this.state.generalInformation.CUSTTYPE}
                />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="fullname">{this.props.strings.fullname} <span style={{ 'color': 'red' }}> *</span></label>
                <input
                  maxLength="500"
                  disabled={isDisableWhenView}
                  value={this.state.generalInformation.FULLNAME}
                  onChange={this.onChange.bind(this, "FULLNAME")}
                  id="txtFullname"
                  className="form-control"
                  type="text"
                  placeholder={this.props.strings.fullname}
                  data-toggle="popover"
                  data-trigger="hover"
                  data-placement="top"
                  data-content={this.props.strings.namePopover}
                  data-original-title={this.props.strings.popoverTitle}
                  data-container="body" //popover showing on top of all elements
                />
              </div>
              {ISCN &&
                <React.Fragment>
                  <div className="form-group col-md-3">
                    <label htmlFor="sex">{this.props.strings.sex} <span style={{ 'color': 'red' }}> *</span></label>
                    <DropdownFactory
                      disabled={isDisableWhenView}
                      onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                      onChange={this.onChange.bind(this)}
                      ID="drdSex"
                      value="SEX"
                      CDTYPE="CF"
                      CDNAME="SEX"
                      CDVAL={this.state.generalInformation.SEX}
                    />
                  </div>
                  <div className="form-group col-md-3 fixWidthDatePickerForOthersNew">
                    <label htmlFor="birthdate">{this.props.strings.birthdate} <span style={{ 'color': 'red' }}> *</span></label>
                    <DateInput
                      disabled={isDisableWhenView}
                      valid={this.validBirthdate}
                      id="txtBirthdate"
                      onChange={this.onChange.bind(this)}
                      value={this.state.generalInformation.BIRTHDATE}
                      type="BIRTHDATE"
                    />
                  </div>
                </React.Fragment>
              }
              {!ISCN &&
                <React.Fragment>
                  <div className="form-group col-md-3 ">
                    <label htmlFor="drdCountry"
                      title={renderTooltip1}
                    >{this.props.strings.country} <span style={{ 'color': 'red' }}> *</span>
                    </label>
                    <DropdownFactory
                      disabled={isUPDATE || isDisableWhenView}
                      onChange={this.onChange.bind(this)}
                      ID="drdCountry"
                      value="COUNTRY"
                      CDTYPE="CF"
                      CDNAME="COUNTRY"
                      CDVAL={this.state.generalInformation.COUNTRY}
                    />
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="othercountry">{this.props.strings.othercountry}</label>
                    <input
                      maxLength="500"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.OTHERCOUNTRY}
                      onChange={this.onChange.bind(this, "OTHERCOUNTRY")}
                      id="txtOthercountry"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.othercountry}
                    />
                  </div>
                </React.Fragment>
              }
            </div>
            {/* Row 2 */}
            <div className="col-md-12 ">
              {ISCN &&
                <React.Fragment>
                  <div className="form-group col-md-3 ">
                    <label htmlFor="country"
                      onMouseOver={this.handleMouse.bind(this, 'hover1', true)} onMouseOut={this.handleMouse.bind(this, 'hover1', false)}
                    >
                      {this.props.strings.country} <span style={{ 'color': 'red' }}> *</span>
                    </label>
                    <DropdownFactory
                      disabled={isUPDATE || isDisableWhenView}
                      onChange={this.onChange.bind(this)}
                      ID="drdCountry"
                      value="COUNTRY"
                      CDTYPE="CF"
                      CDNAME="COUNTRY"
                      CDVAL={this.state.generalInformation.COUNTRY}
                    />
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="othercountry">{this.props.strings.othercountry}</label>
                    <input
                      maxLength="500"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.OTHERCOUNTRY}
                      onChange={this.onChange.bind(this, "OTHERCOUNTRY")}
                      id="txtOthercountry"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.othercountry}
                    />
                  </div>
                  {this.state.generalInformation.COUNTRY === COUNTRY_234 &&
                    <div className="form-group col-md-3">
                      <label htmlFor="JOB">{this.props.strings.JOB}</label>
                      <Select.Async
                        name="form-field-name"
                        placeholder={this.props.strings.JOB}
                        loadOptions={this.getOptionsAsync.bind(this, 'JOB')}
                        options={this.state.listDrop.JOB}
                        value={this.state.generalInformation.JOB}
                        onChange={this.onChangeByType.bind(this, 'JOB')}
                        id="drdJOB"
                        cache={false}
                      />
                    </div>}
                  {this.state.generalInformation.COUNTRY === COUNTRY_234 &&
                    <div className="form-group col-md-3">
                      <label htmlFor="othercountry">Lĩnh vực kinh doanh chính</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder='Lĩnh vực kinh doanh (hardcode)'
                      />
                    </div>
                  }
                </React.Fragment>
              }
              {!ISCN &&
                <React.Fragment>
                  <div className="form-group col-md-3">
                    <label>{this.props.strings.TAXNUMBER} <span style={{ 'color': 'red' }}> *</span></label>
                    <input
                      maxLength="50"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.TAXNUMBER}
                      onChange={this.onChange.bind(this, "TAXNUMBER")}
                      id="txtTAXNUMBER"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.TAXNUMBER}
                    />
                  </div>
                  <div className="form-group col-md-3">
                    <label>{this.props.strings.TAXPLACE}</label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.TAXPLACE}
                      onChange={this.onChange.bind(this, "TAXPLACE")}
                      id="txtTAXPLACE"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.TAXPLACE}
                    />
                  </div>
                </React.Fragment>}
            </div>
            {ISCN && <div className="col-md-12" style={tooltipStyle1}>
              <div className="container">{renderTooltip1}</div>
            </div>
            }
            {/* Row 3 */}
            <div className="col-md-12 ">
              {ISCN && this.state.generalInformation.COUNTRY === COUNTRY_234 &&
                <React.Fragment>
                  <div className="form-group col-md-3 ">
                    <label htmlFor="POSITIONCN">{this.props.strings.POSITIONCN} </label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.POSITIONCN}
                      onChange={this.onChange.bind(this, "POSITIONCN")}
                      id="txtPOSITIONCN"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.POSITIONCN}
                    />
                  </div>
                  <div className="form-group col-md-9">
                    <label htmlFor='WORKADDRESS'>{this.props.strings.WORKADDRESS} </label>
                    <input
                      maxLength="500"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.WORKADDRESS}
                      onChange={this.onChange.bind(this, "WORKADDRESS")}
                      id="txtWORKADDRESS"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.WORKADDRESS}
                    />
                  </div>
                </React.Fragment>
              }
            </div>
            {/* Row 4.1 */}
            {/* hộ chiếu or giấy phép kinh doanh */}
            <div className="col-md-12 ">
              {this.state.generalInformation.COUNTRY !== COUNTRY_234 &&
                <React.Fragment>
                  <div className="form-group col-md-3 ">
                    <label htmlFor="PASSPORT">
                      {ISCN && this.state.generalInformation.COUNTRY !== COUNTRY_234 ?
                        this.props.strings.PASSPORT
                        : this.props.strings.PASSPORT1}
                      <span style={{ 'color': 'red' }}> *</span>
                    </label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.PASSPORT}
                      onChange={this.onChange.bind(this, "PASSPORT")}
                      id="txtPASSPORT"
                      className="form-control"
                      type="text"
                      placeholder={ISCN && this.state.generalInformation.COUNTRY !== COUNTRY_234 ? this.props.strings.PASSPORT : this.props.strings.PASSPORT1}
                    />
                  </div>
                  <div className="form-group col-md-3 fixWidthDatePickerForOthersNew">
                    <label htmlFor="txtPASSPORTDATE">{ISCN && this.state.generalInformation.COUNTRY !== COUNTRY_234 ?
                      this.props.strings.PASSPORTDATE : this.props.strings.PASSPORTDATE1}
                      <span style={{ 'color': 'red' }}> *</span>
                    </label>
                    <DateInput
                      disabled={isDisableWhenView}
                      valid={this.validBirthdate}
                      id="txtPASSPORTDATE"
                      onChange={this.onChange.bind(this)}
                      value={this.state.generalInformation.PASSPORTDATE}
                      type="PASSPORTDATE"
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="txtPASSPORTPLACE">{ISCN && this.state.generalInformation.COUNTRY !== COUNTRY_234
                      ? this.props.strings.PASSPORTPLACE : this.props.strings.PASSPORTPLACE1}
                      <span style={{ 'color': 'red' }}> *</span>
                    </label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.PASSPORTPLACE}
                      onChange={this.onChange.bind(this, "PASSPORTPLACE")}
                      id="txtPASSPORTPLACE"
                      className="form-control"
                      type="text"
                      placeholder={ISCN && this.state.generalInformation.COUNTRY !== COUNTRY_234 ? this.props.strings.PASSPORTPLACE : this.props.strings.PASSPORTPLACE1}
                    />
                  </div>
                </React.Fragment>
              }
            </div>
            {/* Row 4.2 */}
            <div className="col-md-12 ">
              <div className="form-group col-md-3">
                <label htmlFor="drdIdtype">{this.props.strings.idtype} <span style={{ 'color': 'red' }}> *</span></label>
                <Select.Async
                  name="form-field-name"
                  disabled={isDisableWhenView || isUPDATE}
                  placeholder={this.props.strings.idtype}
                  options={this.state.optionsIdType}
                  loadOptions={this.getOptionsIdType.bind(this)}
                  value={this.state.generalInformation.IDTYPE}
                  onChange={this.onChangeByType.bind(this, 'IDTYPE')}
                  id="drdIdtype"
                  cache={false}
                />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="txtIdcode">{this.props.strings.idcode} <span style={{ 'color': 'red' }}> *</span></label>
                <input
                  maxLength="50"
                  disabled={isDisableWhenView}
                  value={this.state.generalInformation.IDCODE}
                  id="txtIdcode"
                  className="form-control"
                  type="text"
                  placeholder={this.props.strings.idcode}
                  onChange={this.onChange.bind(this, "IDCODE")}
                  prefix={""}
                />
              </div>
              <div className="form-group col-md-3 fixWidthDatePickerForOthersNew">
                <label htmlFor="txtIddate">{this.props.strings.iddate} <span style={{ 'color': 'red' }}> *</span></label>
                <DateInput
                  disabled={isDisableWhenView}
                  id="txtIddate"
                  onChange={this.onChange.bind(this)}
                  value={this.state.generalInformation.IDDATE}
                  type="IDDATE"
                />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="txtIdplace">{this.props.strings.idplace} <span style={{ 'color': 'red' }}> *</span></label>
                <input
                  disabled={isDisableWhenView}
                  value={this.state.generalInformation.IDPLACE}
                  onChange={this.onChange.bind(this, "IDPLACE")}
                  id="txtIdplace"
                  className="form-control"
                  type="text"
                  placeholder={this.props.strings.idplace}
                />
              </div>
            </div>
            {/* Row 5 */}
            <div className="col-md-12 ">
              {ISCN &&
                <React.Fragment>
                  <div className="form-group col-md-3">
                    <label>{this.props.strings.TAXNUMBER}</label>
                    <input
                      maxLength="50"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.TAXNUMBER}
                      onChange={this.onChange.bind(this, "TAXNUMBER")}
                      id="txtTAXNUMBER"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.TAXNUMBER}
                    />
                  </div>
                  <div className="form-group col-md-3">
                    <label>{this.props.strings.TAXPLACE}</label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.TAXPLACE}
                      onChange={this.onChange.bind(this, "TAXPLACE")}
                      id="txtTAXPLACE"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.TAXPLACE}
                    />
                  </div>
                  {/* cá nhân nước ngoài */}
                  {this.state.generalInformation.COUNTRY !== COUNTRY_234 &&
                    <div className="form-group col-md-3">
                      <label htmlFor="txtVISANO">{this.props.strings.VISANO}</label>
                      <input
                        maxLength="50"
                        disabled={isDisableWhenView}
                        value={this.state.generalInformation.VISANO}
                        onChange={this.onChange.bind(this, "VISANO")}
                        id="txtVISANO"
                        className="form-control"
                        type="text"
                        placeholder={this.props.strings.VISANO}
                      />
                    </div>}
                  {this.state.generalInformation.COUNTRY !== COUNTRY_234 &&
                    <div className="form-group col-md-3">
                      <label htmlFor="txtLIDONHAPCANH">{this.props.strings.LIDONHAPCANH}</label>
                      <input
                        disabled={isDisableWhenView}
                        value={this.state.generalInformation.LIDONHAPCANH}
                        onChange={this.onChange.bind(this, "LIDONHAPCANH")}
                        id="txtLIDONHAPCANH"
                        className="form-control"
                        type="text"
                        placeholder={this.props.strings.LIDONHAPCANH}
                      />
                    </div>
                  }
                </React.Fragment>
              }
              {/* Địa chỉ trụ sở chính */}
              {!ISCN &&
                <React.Fragment>
                  <div className="col-md-9 form-group">
                    <label>{this.props.strings.regaddress1} <span style={{ 'color': 'red' }}> *</span></label>
                    <input
                      maxLength="500"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.ADDRESS}
                      onChange={this.onChange.bind(this, "ADDRESS")}
                      id="txtADDRESS"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.address}
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>Quốc gia (ĐC trụ sở chính) <span style={{ 'color': 'red' }}> *</span></label>
                    {/* cần thay đổi value để set đúng state, hiện đang clone theo dropdown quốc gia tại row 2 */}
                    <DropdownFactory
                      disabled={isUPDATE || isDisableWhenView}
                      onChange={this.onChange.bind(this)}
                      ID="drdCountry"
                      value="COUNTRY"
                      CDTYPE="CF"
                      CDNAME="COUNTRY"
                      CDVAL={this.state.generalInformation.COUNTRY}
                    />
                  </div>
                </React.Fragment>}
            </div>
            <div className="col-md-12 ">
              <div className="col-md-3" />
              <div className="col-md-3">
                {this.state.isExistAcc && (
                  <div id="WarningExistAcc">
                    <h5 className="highlight">
                      <span className="glyphicon glyphicon-warning-sign"> </span>{" "}
                      {this.props.strings.WarningExistAcc}
                    </h5>
                  </div>
                )}
              </div>
              {isVIEW && (
                <div>
                  <div className="col-md-3">
                    <h5 className="highlight">
                      <b>{this.props.strings.expiredate}</b>
                    </h5>
                  </div>
                  <div className="col-md-3 fixWidthDatePickerForOthersNew">
                    <DateInput
                      disabled={isDisableWhenView}
                      id="txtExpiredate"
                      onChange={this.onChange.bind(this)}
                      value={this.state.generalInformation.IDEXPDATED}
                      type="IDEXPDATED"
                    />
                  </div>{" "}
                </div>
              )}
            </div>
            {/* Row 6 */}
            <div className="col-md-12 ">
              {/* cá nhân trong nước */}
              {ISCN && this.state.generalInformation.COUNTRY === COUNTRY_234 &&
                <React.Fragment>
                  <div className="col-md-9 form-group">
                    <label>{this.props.strings.address} <span style={{ 'color': 'red' }}> *</span></label>
                    <input
                      maxLength="500"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.ADDRESS}
                      onChange={this.onChange.bind(this, "ADDRESS")}
                      id="txtADDRESS"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.address}
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>Quốc gia (địa chỉ hiện tại)  <span style={{ 'color': 'red' }}> *</span></label>
                    {/* cần thay đổi value để set đúng state, hiện đang clone theo dropdown quốc gia tại row 2 */}
                    <DropdownFactory
                      disabled={isUPDATE || isDisableWhenView}
                      onChange={this.onChange.bind(this)}
                      ID="drdCountry"
                      value="COUNTRY"
                      CDTYPE="CF"
                      CDNAME="COUNTRY"
                      CDVAL={this.state.generalInformation.COUNTRY}
                    />
                  </div>
                </React.Fragment>
              }
            </div>
            {/* Row 7 */}
            <div className="col-md-12 ">
              {ISCN && this.state.generalInformation.COUNTRY !== COUNTRY_234 &&
                <React.Fragment>
                  <div className="col-md-9 form-group">
                    <label>Địa chỉ đăng ký tạm trú tại Việt Nam  <span style={{ 'color': 'red' }}> *</span></label>
                    <input
                      maxLength="500"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.REGADDRESS}
                      onChange={this.onChange.bind(this, "REGADDRESS")}
                      id="txtregAddress"
                      className="form-control"
                      type="text"
                      placeholder={'Địa chỉ đăng ký tạm trú tại Việt Nam'}
                    />
                  </div>
                </React.Fragment>
              }
              {!ISCN && this.state.generalInformation.COUNTRY !== COUNTRY_234 &&
                <React.Fragment>
                  <div className="col-md-9 form-group">
                    <label>Địa chỉ đăng ký tạm trú tại VN <span style={{ 'color': 'red' }}> *</span></label>
                    <input
                      className="form-control"
                      type="text" />
                  </div>
                </React.Fragment>}
            </div>
            {/* Row 8 */}
            <div className="col-md-12 ">
              {ISCN &&
                <React.Fragment>
                  <div className="col-md-9 form-group">
                    <label>Địa chỉ đăng ký thường trú/ trụ sở</label>
                    <input
                      maxLength="500"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.ADDRESS}
                      onChange={this.onChange.bind(this, "ADDRESS")}
                      id="txtADDRESS"
                      className="form-control"
                      type="text"
                      placeholder='Địa chỉ đăng ký thường trú/ trụ sở'
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>Quốc gia (địa chỉ ĐKTT/trụ sở)</label>
                    {/* cần thay đổi value để set đúng state, hiện đang clone theo dropdown quốc gia tại row 2 */}
                    <DropdownFactory
                      disabled={isUPDATE || isDisableWhenView}
                      onChange={this.onChange.bind(this)}
                      ID="drdCountry"
                      value="COUNTRY"
                      CDTYPE="CF"
                      CDNAME="COUNTRY"
                      CDVAL={this.state.generalInformation.COUNTRY}
                    />
                  </div>
                </React.Fragment>
              }
              {!ISCN &&
                <React.Fragment>
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.email} <span style={{ 'color': 'red' }}> *</span></label>
                    <input
                      maxLength="500"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.EMAIL}
                      onChange={this.onChange.bind(this, "EMAIL")}
                      id="txtEmail"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.email}
                      data-toggle="popover"
                      data-trigger="hover"
                      data-placement="top"
                      data-content={this.props.strings.emailPopover}
                      data-original-title={this.props.strings.popoverTitle}
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>Điện thoại liên hệ <span style={{ 'color': 'red' }}> *</span></label>
                    <input
                      maxLength="50"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.MOBILE}
                      onChange={this.onChange.bind(this, "MOBILE")}
                      id="txtMobile"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.mobile}
                      data-toggle="popover"
                      data-trigger="hover"
                      data-placement="top"
                      data-content={this.props.strings.mobilePopover}
                      data-original-title={this.props.strings.popoverTitle}
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.fax}</label>
                    <input
                      maxLength="50"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.FAX}
                      onChange={this.onChange.bind(this, "FAX")}
                      id="txtFax"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.fax}
                    />
                  </div>
                </React.Fragment>}
            </div>
            {/* Row 9 */}
            <div className="col-md-12 ">
              {ISCN ?
                <React.Fragment>
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.email}  <span style={{ 'color': 'red' }}> *</span></label>
                    <input
                      maxLength="500"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.EMAIL}
                      onChange={this.onChange.bind(this, "EMAIL")}
                      id="txtEmail"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.email}
                      data-toggle="popover"
                      data-trigger="hover"
                      data-placement="top"
                      data-content={this.props.strings.emailPopover}
                      data-original-title={this.props.strings.popoverTitle}
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.fax}</label>
                    <input
                      maxLength="50"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.FAX}
                      onChange={this.onChange.bind(this, "FAX")}
                      id="txtFax"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.fax}
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.mobile}  <span style={{ 'color': 'red' }}> *</span></label>
                    <input
                      maxLength="50"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.MOBILE}
                      onChange={this.onChange.bind(this, "MOBILE")}
                      id="txtMobile"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.mobile}
                      data-toggle="popover"
                      data-trigger="hover"
                      data-placement="top"
                      data-content={this.props.strings.mobilePopover}
                      data-original-title={this.props.strings.popoverTitle}
                    />
                  </div>
                  {/* ẩn điện thoại cố định theo phân tích */}
                  {/* <div className="col-md-3 form-group">
                    <label>{this.props.strings.phone}</label>
                    <input
                      maxLength="50"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.PHONE}
                      onChange={this.onChange.bind(this, "PHONE")}
                      id="txtPhone"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.phone}
                    />
                  </div> */}
                </React.Fragment>
                :
                <React.Fragment>
                </React.Fragment>
              }
            </div>
            <div className="col-md-12 container">
              <h5 className="">
                <b>Ngân hàng</b>
              </h5>
            </div>
            <div className="col-md-12">
              <div className="col-md-3 form-group">
                <label>{this.props.strings.bankaccno}  <span style={{ 'color': 'red' }}> *</span></label>
                <input
                  maxLength="20"
                  disabled={isDisableWhenView}
                  value={this.state.generalInformation.BANKACC}
                  onChange={this.onChange.bind(this, "BANKACC")}
                  id="txtBankaccno"
                  className="form-control"
                  type="text"
                  placeholder={this.props.strings.bankaccno}
                />
              </div>
              <div className="col-md-3 form-group">
                <label>{this.props.strings.bankname}  <span style={{ 'color': 'red' }}> *</span></label>
                <DropdownFactory
                  disabled={isDisableWhenView}
                  onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                  onChange={this.onChange.bind(this)}
                  ID="drdBank"
                  value="BANKCODE"
                  CDTYPE="GW"
                  CDNAME="BANK"
                  CDVAL={this.state.generalInformation.BANKCODE}
                />
              </div>
              <div className="col-md-3 form-group">
                <label>{this.props.strings.branchname}  <span style={{ 'color': 'red' }}> *</span></label>
                <input
                  disabled={isDisableWhenView}
                  value={this.state.generalInformation.CITYBANK}
                  onChange={this.onChange.bind(this, "CITYBANK")}
                  id="txtBranchname"
                  className="form-control"
                  type="text"
                  placeholder={this.props.strings.branchname}
                />
              </div>
            </div>
            {/* Nhóm chăm sóc tài khoản / Nhân viên chăm sóc tài khoản */}
            {/* <div className="col-md-12">
              {ISLOGIN && isRenderCareby &&
                <div className="col-md-3 form-group">
                  <label>{this.props.strings.careby}  <span style={{ 'color': 'red' }}> *</span></label>
                  <Select.Async
                    name="form-field-name"
                    disabled={isDisableWhenView || isUPDATE}
                    placeholder={this.props.strings.careby}
                    loadOptions={this.getOptionsCareby.bind(this)}
                    value={this.state.generalInformation.CAREBY}
                    onChange={this.onChangeByType.bind(this, 'CAREBY')}
                    id="drdCareby"
                    cache={false}
                  />
                </div>
              }
              {ISLOGIN &&
                <div className="col-md-3 form-group">
                  <label>{this.props.strings.MGCSTK}  <span style={{ 'color': 'red' }}> *</span></label>
                  <Select.Async className="form-field-name"
                    disabled={isDisableWhenView || isDisableWhenUpdate}
                    name="form-field-name"
                    placeholder={this.props.strings.MGCSTK}
                    loadOptions={this.getOptionsMaMoGioi.bind(this)}
                    options={this.state.optionsDataMG}
                    cache={false}
                    value={this.state.generalInformation.SALEID}
                    onChange={this.onChangeByType.bind(this, 'SALEID')}
                    id="drdsaleid"
                  />
                </div>
              }
            </div> */}
            <div style={{ textAlign: 'left' }} className="col-md-12">
              <div className="col-md-12 ">
                <b className="cb-fix" style={{ float: "left" }}>
                  <input
                    style={{ margin: 0 }}
                    checked={this.state.ISONLINE}
                    id="cbISONL"
                    onChange={this.onChange.bind(this, "ISONLINE")}
                    type="checkbox"
                  />
                </b>
                <h5>
                  <b className="highlight" >{this.props.strings.useonline}</b>
                </h5>
              </div>
              <div className="col-md-3 form-group">
                <label>Hình thức xác thực</label>
                {/* đang harcode, cần load động theo allcode */}
                <input type="text" className="form-control" value="OTP" />
              </div>
            </div>
            <div className="col-md-12">
              {isRenderUyQuyen &&
                <div className="col-md-3 form-group">
                  <label>{this.props.strings.isauth}  <span style={{ 'color': 'red' }}> *</span></label>
                  <DropdownFactory
                    disabled={isDisableWhenView}
                    onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                    onChange={this.onChange.bind(this)}
                    ID="drdISAUTH"
                    value="ISAUTH"
                    CDTYPE="SY"
                    CDNAME="YESNO"
                    CDVAL={this.state.generalInformation.ISAUTH}
                  />
                </div>
              }
            </div>
          </div>
          {/* Thông tin nhu cầu đầu tư------------------------------------------------------------------------------------------- */}
          <div className="row background-white mb-10">
            <div className="col-md-12 container">
              <h5 className="">
                <b>{this.props.strings.NHUCAUDAUTU} </b>
              </h5>
            </div>
            <div className="col-md-12">
              <div className="col-md-3 form-group">
                <label>{this.props.strings.INVESTTIME} <span style={{ 'color': 'red' }}> *</span></label>
                <Select.Async
                  name="form-field-name"
                  placeholder={this.props.strings.INVESTTIME}
                  loadOptions={this.getOptionsAsync.bind(this, 'INVESTTIME')}
                  options={this.state.listDrop.INVESTTIME}
                  value={this.state.generalInformation.INVESTTIME}
                  onChange={this.onChangeByType.bind(this, 'INVESTTIME')}
                  id="drdINVESTTIME"
                  cache={false}
                />
              </div>
              <div className="col-md-3 form-group">
                <label>{this.props.strings.RUIRO} <span style={{ 'color': 'red' }}> *</span></label>
                <Select.Async
                  name="form-field-name"
                  //disabled={isDisableWhenView || isUPDATE}
                  placeholder={this.props.strings.RUIRO}
                  loadOptions={this.getOptionsAsync.bind(this, 'RUIRO')}
                  options={this.state.listDrop.RUIRO}
                  value={this.state.generalInformation.RUIRO}
                  onChange={this.onChangeByType.bind(this, 'RUIRO')}
                  id="drdRUIRO"
                  cache={false}
                />
              </div>
              <div className="col-md-3 form-group">
                <label>{this.props.strings.EXPERIENCE} <span style={{ 'color': 'red' }}> *</span></label>
                <Select.Async
                  name="form-field-name"
                  //disabled={isDisableWhenView || isUPDATE}
                  placeholder={this.props.strings.EXPERIENCE}
                  loadOptions={this.getOptionsAsync.bind(this, 'EXPERIENCE')}
                  options={this.state.listDrop.EXPERIENCE}
                  value={this.state.generalInformation.EXPERIENCE}
                  onChange={this.onChangeByType.bind(this, 'EXPERIENCE')}
                  id="drdEXPERIENCE"
                  cache={false}
                />
              </div>
            </div>
          </div>
          {/* THÔNG TIN NGƯỜI ĐẠI DIỆN PHÁP LUẬT----------------------Legal Representative----------------------------- */}
          {this.state.generalInformation.CUSTTYPE == 'TC' && (
            <div className="row background-white mb-10">
              <div className="col-md-12 container">
                <h5 className="">
                  <b>{this.props.strings.ISREPRESENTATIVE}</b>
                </h5>
              </div>
              <div>
                <div className="col-md-12">
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.LRNAME} <span style={{ 'color': 'red' }}> *</span></label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.LRNAME}
                      onChange={this.onChange.bind(this, "LRNAME")}
                      id="txtLRNAME"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.LRNAME}
                    />
                  </div>
                  <div className="col-md-3">
                    <label>{this.props.strings.LRSEX} </label>
                    <DropdownFactory
                      disabled={isDisableWhenView}
                      onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                      onChange={this.onChange.bind(this)}
                      ID="drdLRSEX"
                      value="LRSEX"
                      CDTYPE="CF"
                      CDNAME="SEX"
                      CDVAL={this.state.generalInformation.LRSEX}
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.LRDOB} <span style={{ 'color': 'red' }}> *</span></label>
                    <DateInput
                      disabled={isDisableWhenView}
                      valid={this.validBirthdate}
                      id="txtLRDOB"
                      onChange={this.onChange.bind(this)}
                      value={this.state.generalInformation.LRDOB}
                      type="LRDOB"
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.LRCOUNTRY} <span style={{ 'color': 'red' }}> *</span></label>
                    <DropdownFactory
                      disabled={isDisableWhenView}
                      //onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                      onChange={this.onChange.bind(this)}
                      ID="drdLRCOUNTRY"
                      value="LRCOUNTRY"
                      CDTYPE="CF"
                      CDNAME="COUNTRY"
                      CDVAL={this.state.generalInformation.LRCOUNTRY}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.LRPOSITION} <span style={{ 'color': 'red' }}> *</span></label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.LRPOSITION}
                      onChange={this.onChange.bind(this, "LRPOSITION")}
                      id="txtLRPOSITION"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.LRPOSITION}
                    />
                  </div>
                  {/* <div className="col-md-3 form-group">
                    <label>{this.props.strings.LRDECISIONNO}</label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.LRDECISIONNO}
                      onChange={this.onChange.bind(this, "LRDECISIONNO")}
                      id="txtLRDECISIONNO"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.LRDECISIONNO}
                    />
                  </div> */}
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.LRID} <span style={{ 'color': 'red' }}> *</span></label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.LRID}
                      onChange={this.onChange.bind(this, "LRID")}
                      id="txtLRID"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.LRID}
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.LRIDDATE} <span style={{ 'color': 'red' }}> *</span></label>
                    <DateInput
                      disabled={isDisableWhenView}
                      id="txtLRIDDATE"
                      onChange={this.onChange.bind(this)}
                      value={this.state.generalInformation.LRIDDATE}
                      type="LRIDDATE"
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.LRIDPLACE} <span style={{ 'color': 'red' }}> *</span></label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.LRIDPLACE}
                      onChange={this.onChange.bind(this, "LRIDPLACE")}
                      id="txtLRIDPLACE"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.LRIDPLACE}
                    />
                  </div>
                </div>
                {/* <div className="col-md-12">
                  <div className="col-md-3 container">
                    <h5 className="">
                      <b>{this.props.strings.LRADDRESS}</b>
                    </h5>
                  </div>
                  <div className="col-md-9 ">
                    <input
                      maxLength="500"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.LRADDRESS}
                      onChange={this.onChange.bind(this, "LRADDRESS")}
                      id="txtLRADDRESS"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.LRADDRESS}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="col-md-3 container">
                    <h5 className="">
                      <b>{this.props.strings.LRCONTACT}</b>
                    </h5>
                  </div>
                  <div className="col-md-9">
                    <input
                      maxLength="500"
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.LRCONTACT}
                      onChange={this.onChange.bind(this, "LRCONTACT")}
                      id="txtLRCONTACT"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.LRCONTACT}
                    />
                  </div>
                </div> */}
                <div className="col-md-12">
                  <div className="col-md-3 form-group">
                    <label>Điện thoại liên hệ <span style={{ 'color': 'red' }}> *</span></label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.LRPRIPHONE}
                      onChange={this.onChange.bind(this, "LRPRIPHONE")}
                      id="txtLRPRIPHONE"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.LRPRIPHONE}
                    />
                  </div>
                  {this.state.generalInformation.LRCOUNTRY !== COUNTRY_234 &&
                    <React.Fragment>
                      <div className="col-md-3 form-group">
                        <label>Số thị thực nhập cảnh</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="col-md-3 form-group">
                        <label>Ngày cấp</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="col-md-3 form-group">
                        <label>Nơi cấp</label>
                        <input type="text" className="form-control" />
                      </div>
                    </React.Fragment>
                  }
                  {/* <div className="col-md-3 container">
                    <h5 className="">
                      <b>{this.props.strings.LRALTPHONE}</b>
                    </h5>
                  </div>
                  <div className="col-md-3">
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.LRALTPHONE}
                      onChange={this.onChange.bind(this, "LRALTPHONE")}
                      id="txtLRALTPHONE"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.LRALTPHONE}
                    />
                  </div> */}
                </div>
                {/* <div className="col-md-12">
                  <div className="col-md-3 container">
                    <h5 className="">
                      <b>{this.props.strings.LRFAX}</b>
                    </h5>
                  </div>
                  <div className="col-md-3 ">
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.LRFAX}
                      onChange={this.onChange.bind(this, "LRFAX")}
                      id="txtLRFAX"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.LRFAX}
                    />
                  </div>
                  <div className="col-md-3">
                    <h5 className="highlight">
                      <b>{this.props.strings.LREMAIL}</b>
                    </h5>
                  </div>
                  <div className="col-md-3">
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.LREMAIL}
                      onChange={this.onChange.bind(this, "LREMAIL")}
                      id="txtLREMAIL"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.LREMAIL}
                    />
                  </div>
                </div> */}
              </div>
            </div>)}
          {/* ------------------------------ĐẠI DIỆN VỐN----------------------- */}
          {this.state.generalInformation.CUSTTYPE == 'TC' && (
            <div className="row background-white mb-10">
              <div className="col-md-12 container">
                <h5 className="">
                  <b>{this.props.strings.CAPITALAGENT}</b>
                </h5>
              </div>
              <div>
                <div className="col-md-12">
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.CAPITALNAME}</label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.CAPITALNAME}
                      onChange={this.onChange.bind(this, "CAPITALNAME")}
                      id="txtCAPITALNAME"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.CAPITALNAME}
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.CAPITALPOSITION}</label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.CAPITALPOSITION}
                      onChange={this.onChange.bind(this, "CAPITALPOSITION")}
                      id="txtCAPITALPOSITION"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.CAPITALPOSITION}
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.CAPITALIDCODE}</label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.CAPITALIDCODE}
                      onChange={this.onChange.bind(this, "CAPITALIDCODE")}
                      id="txtCAPITALIDCODE"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.CAPITALIDCODE}
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.CAPITALIDDATE}</label>
                    <DateInput
                      disabled={isDisableWhenView}
                      id="txtCAPITALIDDATE"
                      onChange={this.onChange.bind(this)}
                      value={this.state.generalInformation.CAPITALIDDATE}
                      type="CAPITALIDDATE"
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.CAPITALIDPLACE}</label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.CAPITALIDPLACE}
                      onChange={this.onChange.bind(this, "CAPITALIDPLACE")}
                      id="txtCAPITALIDPLACE"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.CAPITALIDPLACE}
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.CAPITALTEL}</label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.CAPITALTEL}
                      onChange={this.onChange.bind(this, "CAPITALTEL")}
                      id="txtCAPITALTEL"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.CAPITALTEL}
                    />
                  </div>
                  <div className="col-md-3 form-group">
                    <label>{this.props.strings.CAPITALEMAIL}</label>
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.CAPITALEMAIL}
                      onChange={this.onChange.bind(this, "CAPITALEMAIL")}
                      id="txtCAPITALEMAIL"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.CAPITALEMAIL}
                    />
                  </div>
                </div>
              </div>
            </div>)}
          {/* Người có ảnh hưởng chính trị */}
          {/* -----------------------------------------PEP----------------------------- */}
          <div className="row background-white mb-10">
            <div className="col-md-12 container">
              <h5 className="" onMouseOver={this.handleMouse.bind(this, 'hover3', true)} onMouseOut={this.handleMouse.bind(this, 'hover3', false)}>
                <b>{this.props.strings.ISPEP}</b>
              </h5>
            </div>
            <div className="col-md-12" style={tooltipStyle3}>
              {renderTooltip3}
            </div>
            <div className="col-md-12">
              <div className="col-md-2 form-group">
                <input type="radio" value={'Y'}
                  checked={this.state.generalInformation.ISPEP == 'Y' ? true : false}
                  id={'ISPEP' + 'Y'}
                  name='ISPEP'
                  onChange={this.onChange.bind(this, "ISPEP")}
                />
                <label htmlFor={'ISPEP' + 'Y'} className="cursor" >Có</label>
              </div>
              <div className="col-md-2 form-group">
                <input type="radio" value={'N'}
                  checked={this.state.generalInformation.ISPEP == 'N' ? true : false}
                  id={'ISPEP' + 'N'}
                  name='ISPEP'
                  onChange={this.onChange.bind(this, "ISPEP")}
                />
                <label htmlFor={'ISPEP' + 'N'} className="cursor" >Không</label>
              </div>
            </div>
            {this.state.generalInformation.ISPEP == 'Y' && (<div>
              <div className="col-md-12">
                <div className="col-md-3 form-group">
                  <label>{this.props.strings.FAMILYNAME1}</label>
                  <input
                    disabled={isDisableWhenView}
                    value={this.state.generalInformation.FAMILYNAME1}
                    onChange={this.onChange.bind(this, "FAMILYNAME1")}
                    id="txtFAMILYNAME1"
                    className="form-control"
                    type="text"
                    placeholder={this.props.strings.FAMILYNAME1}
                  />
                </div>
                <div className="col-md-3 form-group">
                  <label>{this.props.strings.NAME1}</label>
                  <input
                    disabled={isDisableWhenView}
                    value={this.state.generalInformation.NAME1}
                    onChange={this.onChange.bind(this, "NAME1")}
                    id="txtNAME1"
                    className="form-control"
                    type="text"
                    placeholder={this.props.strings.NAME1}
                  />
                </div>
                <div className="col-md-3 form-group">
                  <label>{this.props.strings.FAMILYNAME2}</label>
                  <input
                    disabled={isDisableWhenView}
                    value={this.state.generalInformation.FAMILYNAME2}
                    onChange={this.onChange.bind(this, "FAMILYNAME2")}
                    id="txtFAMILYNAME2"
                    className="form-control"
                    type="text"
                    placeholder={this.props.strings.FAMILYNAME2}
                  />
                </div>
                <div className="col-md-3 form-group">
                  <label>{this.props.strings.NAME2}</label>
                  <input
                    disabled={isDisableWhenView}
                    value={this.state.generalInformation.NAME2}
                    onChange={this.onChange.bind(this, "NAME2")}
                    id="txtNAME2"
                    className="form-control"
                    type="text"
                    placeholder={this.props.strings.NAME2}
                  />
                </div>
              </div>
            </div>)}
          </div>
          {/* Người có dấu hiệu Mỹ */}
          <div className="row background-white">
            <div className="col-md-12 container">
              <h5 className="" onMouseOver={this.handleMouse.bind(this, 'hover2', true)} onMouseOut={this.handleMouse.bind(this, 'hover2', false)}>
                <b>{this.props.strings.isFatca} <span style={{ 'color': 'red' }}> *</span></b>
              </h5>
            </div>
            <div className="col-md-12">
              <div className="col-md-2 form-group">
                <input type="radio" value={'Y'}
                  checked={this.state.generalInformation.ISFATCA == 'Y' ? true : false}
                  id={'ISFATCA' + 'Y'}
                  name='ISFATCA'
                  onChange={this.onChange.bind(this, "ISFATCA")}
                />
                <label htmlFor={'ISFATCA' + 'Y'} className="cursor" >Có</label>
              </div>
              <div className="col-md-2 form-group">
                <input type="radio" value={'N'}
                  checked={this.state.generalInformation.ISFATCA == 'N' ? true : false}
                  id={'ISFATCA' + 'N'}
                  name='ISFATCA'
                  onChange={this.onChange.bind(this, "ISFATCA")}
                />
                <label htmlFor={'ISFATCA' + 'N'} className="cursor" >Không</label>
              </div>
            </div>
            <div className="col-md-12" style={tooltipStyle2}>
              <div style={tooltipStyle2}>
                {renderTooltip2}
              </div>
            </div>
          </div>
          {/* <div className="col-md-12" >
              <div className="col-md-3 ">
                <h5 className="highlight" onMouseOver={this.handleMouse.bind(this, 'hover3', true)} onMouseOut={this.handleMouse.bind(this, 'hover3', false)}>
                  <b>{this.props.strings.isFatca}</b>
                </h5>
              </div>
              <div className="col-md-3">
                <DropdownFactory
                  disabled={isDisableWhenView}
                  //onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                  onChange={this.onChange.bind(this)}
                  ID="drdISFATCA"
                  value="ISFATCA"
                  CDTYPE="SY"
                  CDNAME="YESNO"
                  CDVAL={this.state.generalInformation.ISFATCA}
                />
              </div>
              <div className="col-md-12" style={tooltipStyle3}>
                <div style={tooltipStyle3}>
                  {renderTooltip}
                </div>
              </div>
            </div>
           */}
          {/* ------------------------------ĐẠI DIỆN ONLINE----------------------- */}
          {this.state.generalInformation.CUSTTYPE == 'TC' &&
            <React.Fragment>
              {/* <div className="row background-white mb-10">
              <div className="col-md-12">
                <h5 className="">
                  <b>{this.props.strings.ONLINEAGENT}</b>
                </h5>
              </div>
              <div>
                <div className="col-md-12">
                  <div className="col-md-3">
                    <h5 className="highlight">
                      <b>{this.props.strings.ONLINENAME}</b>
                    </h5>
                  </div>
                  <div className="col-md-9 ">
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.ONLINENAME}
                      onChange={this.onChange.bind(this, "ONLINENAME")}
                      id="txtONLINENAME"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.ONLINENAME}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="col-md-3">
                    <h5 className="highlight">
                      <b>{this.props.strings.ONLINEPHONE}</b>
                    </h5>
                  </div>
                  <div className="col-md-9 ">
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.ONLINEPHONE}
                      onChange={this.onChange.bind(this, "ONLINEPHONE")}
                      id="txtONLINEPHONE"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.ONLINEPHONE}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="col-md-3">
                    <h5 className="highlight">
                      <b>{this.props.strings.ONLINEEMAIL}</b>
                    </h5>
                  </div>
                  <div className="col-md-9 ">
                    <input
                      disabled={isDisableWhenView}
                      value={this.state.generalInformation.ONLINEEMAIL}
                      onChange={this.onChange.bind(this, "ONLINEEMAIL")}
                      id="txtONLINEEMAIL"
                      className="form-control"
                      type="text"
                      placeholder={this.props.strings.ONLINEEMAIL}
                    />
                  </div>
                </div>
              </div>
            </div> */}
            </React.Fragment>
          }
          <div className="row background-white mb-10">
            {isVIEW && (
              <div className="col-md-12">
                <div className="col-md-3">
                  <h5 className="highlight">
                    <b>{this.props.strings.investtype}</b>
                  </h5>
                </div>
                <div className="col-md-3">
                  <DropdownFactory
                    disabled={isDisableWhenView}
                    onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                    onChange={this.onChange.bind(this)}
                    ID="drdInvesttype"
                    value="INVESTTYPE"
                    CDTYPE="CF"
                    CDNAME="INVESTTYPE"
                    CDVAL={this.state.generalInformation.INVESTTYPE}
                  />
                </div>
                <div className="col-md-3">
                  {/* <h5 className="highlight"><b>{this.props.strings.acctgrp}</b></h5> */}
                </div>
                <div className="col-md-3">
                  {/* <DropdownFactory onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} ID="drdAcctgrp" value="ACCTGRP" CDTYPE="CF" CDNAME="ACCTGRP" CDVAL={this.state.generalInformation.ACCTGRP} /> */}
                </div>
              </div>
            )}
            <div className="col-md-12">
              <div className="col-md-12">
                <GeneralInfo_Text_Contract
                  language={this.props.lang}
                />
              </div>
            </div>
            {/* <div style={{ textAlign: 'left' }} className="col-md-12">
              <div className="col-md-12 ">
                <b className="cb-fix" style={{ float: "left" }}>
                  <input
                    style={{ margin: 0 }}
                    checked={this.state.generalInformation.ISAGREESHARE}
                    id="cbISAGREESHARE"
                    onChange={this.onChange.bind(this, "ISAGREESHARE")}
                    type="checkbox"
                  />
                </b>
                <h5>
                  <b className="highlight" >{this.props.strings.ISAGREESHARE}</b>
                </h5>
              </div>
            </div> */}
            <div style={{ textAlign: 'left' }} className="col-md-12">
              <div className="col-md-12 ">
                <b className="cb-fix" style={{ float: "left" }}>
                  <input
                    id="cbIsagree"
                    style={{ margin: 0 }}
                    onChange={this.onChange.bind(this, "ISAGREE")}
                    type="checkbox"
                  />
                </b>
                <h5>
                  <b className="highlight" >{this.props.strings.commitment}</b>
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="pull-left" style={{ display: displayExport }}>
            <button
              onClick={this.export.bind(this, "openExport")}
              disabled={this.state.disablebuttonopenExport}
              id="btnSubmitExport"
              type="button"
              className="btn btn-primary"
            >
              {this.props.strings.createxportopenExport}
            </button>
            <button
              onClick={this.export.bind(this, "onlineExport")}
              disabled={this.state.disablebuttononlineExport}
              id="btnSubmitExport2"
              type="button"
              className="btn btn-primary"
              style={{ marginLeft: 10, display: ISONLINE == 'Y' ? "" : "none" }}
            >
              {this.props.strings.createxportonlineExport}
            </button>
          </div>
          <div className="btn-next-prev " >
            <input
              id="btnSubmit"
              type="button"
              onClick={this.onSubmit.bind(this)}
              className="btn btn-next no-absolute"
              style={{ marginRight: 15 }}
              value={this.props.strings.next}
            />
          </div>
        </div>
      </div >
    );
  }
}
const stateToProps = state => ({
  language: state.language.language,
  auth: state.auth,
  tradingdate: state.systemdate.tradingdate
});
const decorators = flow([connect(stateToProps), translate("GeneralInfo_Main")]);
module.exports = decorators(GeneralInfo_Main);
