import React from "react";
import { connect } from "react-redux";
import DropdownFactory from "../../../../../utils/DropdownFactory";
import DateInput from "app/utils/input/DateInput";
import FileInput from "app/utils/input/FileInput";
//import NumberFormat from 'react-number-format';
import Select from "react-select";
import flow from "lodash.flow";
import translate from "app/utils/i18n/Translate.js";
//import {checkValidDate} from 'app/Helpers.js';
//import { log } from 'util';
import { showNotifi } from "app/action/actionNotification.js";
import moment from "moment";
import {
  IMGMAXW,
  IMGMAXH,
  CUSTYPE_TC,
  IDTYPE_009,
  COUNTRY_234,
  ACTYPE_TT,
  GRINVESTOR_NN,
  GRINVESTOR_TN
} from "../../../../../Helpers";
import RestfulUtils from "app/utils/RestfulUtils";
import { toast } from "react-toastify";

class GeneralInfo_Main extends React.Component {
  constructor(props) {
    super(props);
    //const dataTam = props.dataTam; // works, but no destructuring
    this.state = {
      hover1 :"",
        hover2 :"",
      // isDisableWhenLoading: false,
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
        { name: "JOB", id: "drdJOB" },
        { name: "WORKADDRESS", id: "txtWORKADDRESS" },
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
        
        { name: "EMAIL", id: "txtEmail"},
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
        { name: "INVESTTIME" ,id :"drdINVESTTIME"},
        { name: "RUIRO" ,id :"drdRUIRO"},
        { name: "EXPERIENCE" ,id :"drdEXPERIENCE"},
        { name: "ADDRESS" ,id :"txtADDRESS"},
        // { name: "PHOTHONXOM" ,id :"txtPHOTHONXOM"},
        // { name: "PHUONGXA" ,id :"txtPHUONGXA"},
        // { name: "THANHPHO" ,id :"txtTHANHPHO"},
        { name: "CAPITALNAME" ,id :"txtCAPITALNAME"},
        { name: "CAPITALPOSITION" ,id :"txtCAPITALPOSITION"},
        { name: "CAPITALIDCODE" ,id :"txtCAPITALIDCODE"},
        { name: "CAPITALIDDATE" ,id :"txtCAPITALIDDATE"},
        { name: "CAPITALIDPLACE" ,id :"txtCAPITALIDPLACE"},
        { name: "CAPITALTEL" ,id :"txtCAPITALTEL"},
        { name: "CAPITALEMAIL" ,id :"txtCAPITALEMAIL"},

        { name: "ONLINENAME" ,id :"txtONLINENAME"},
        { name: "ONLINEPHONE" ,id :"txtONLINEPHONE"},
        { name: "ONLINEEMAIL" ,id :"txtONLINEEMAIL"},
      ],
      currentcountry : "234",
      listDrop:{
        JOB :[],
        RUIRO:[],
        INVESTTIME :[],
        EXPERIENCE:[],
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
        DBCODE:"",
        BANKACC: "",
        BANKCODE: "",
        CITYBANK: "",
        BANKACNAME: "",
        FAX: "",
        INCOMEYEAR: "",
        ISAUTH: 'N',        
        TRADINGCODE: "",
        PASSPORT :"",
        PASSPORTDATE:"",
        PASSPORTPLACE:"",
        TAXPLACE :"",
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
        ISPEP  : "N",
        // MGDCK :"Y",
        FAMILYNAME1 :"",        
        FAMILYNAME2 :"",
        NAME1 :"",
        NAME2 :"",
        // ISOTP: ""
        ISREPRESENTATIVE :"N",
        LRNAME :"",
        LRSEX : "",
        LRDOB :"",
        LRCOUNTRY :"234",
        LRPOSITION :"",
        LRDECISIONNO :"",
        LRID :"",
        LRIDDATE :"",
        LRIDPLACE :"",
        LRADDRESS :"",
        LRCONTACT :"",
        LRPRIPHONE :"",
        LRALTPHONE :"",
        LRFAX :"",
        LREMAIL :"",
        SONHA: "",
        PHOTHONXOM: "",
        PHUONGXA: "",
        THANHPHO: "",
        INVESTTIME:"",
        RUIRO:"",
        EXPERIENCE:"",
        ISAGREESHARE:true,
        // ------batch2----------
        TAXNUMBER:"",
        SONHAREG:"",
        PHOTHONXOMREG :"",
        PHUONGXAREG :"",
        THANHPHOREG:"",
        JOB:"",
        POSITIONCN:"",
        WORKADDRESS:"",
        VISANO:"",
        LIDONHAPCANH:"",
        CAPITALNAME:"",
        CAPITALPOSITION:"",
        CAPITALIDCODE:"",
        CAPITALIDDATE:"",
        CAPITALIDPLACE:"",
        CAPITALTEL:"",
        CAPITALEMAIL:"",
        ONLINENAME:"",
        ONLINEPHONE:"",
        ONLINEEMAIL:"",
        REGADDRESS:"",
        ADDRESS:""

      },
      CUSTODYCD:"",
      LANGUAGE:"",
      oldInforBeforeChange: {
      }
    };
  }
  handleMouseIn1() {
    this.setState({ hover1: true })
  }

  handleMouseOut1() {
    this.setState({ hover1: false })
  }
  handleMouseIn2() {
    this.setState({ hover2: true })
  }

  handleMouseOut2() {
    this.setState({ hover2: false })
  }
  checkValid(name, id) {
    let value = this.state.generalInformation[name];
    let mssgerr = "";
    const { user } = this.props.auth;
    let logic1 = true;
    let logicTKNH=true;
    let logicSDT=true;
    let logicCMND=true;
    let logicONLINEEMAIL= true;
    let logicCAPITALEMAIL= true;
    let ISCN = this.state.generalInformation.CUSTTYPE == "CN";
    let logic = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(this.state.generalInformation.EMAIL);
    
    let ISCUSTOMER1 = user;
    let ISLOGIN = ISCUSTOMER1 != '' && ISCUSTOMER1 != undefined;

    if (this.state.generalInformation["CUSTTYPE"] == 'TC'){
      logic1 = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(this.state.generalInformation.LREMAIL);
      logicTKNH =(/^[a-zA-Z0-9]*$/gm).test(this.state.generalInformation.BANKACC);
      logicSDT=(/^[a-zA-Z0-9]*$/gm).test(this.state.generalInformation.MOBILE);
      logicCMND=(/^[a-zA-Z0-9]*$/gm).test(this.state.generalInformation.IDCODE);
      logicCAPITALEMAIL = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(this.state.generalInformation.CAPITALEMAIL);
      
      logicONLINEEMAIL=(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(this.state.generalInformation.ONLINEEMAIL);
     
    }
    else if(this.state.generalInformation["CUSTTYPE"]== 'CN'){
      logicTKNH =(/^[a-zA-Z0-9]*$/gm).test(this.state.generalInformation.BANKACC);
      logicSDT=(/^[a-zA-Z0-9]*$/gm).test(this.state.generalInformation.MOBILE);
      logicCMND=(/^[a-zA-Z0-9]*$/gm).test(this.state.generalInformation.IDCODE);

    }
    else {
      logic1 = logic1;
      logicTKNH = logicTKNH;
      logicSDT=logicSDT;
      logicCMND=logicCMND;
      logicONLINEEMAIL= logicONLINEEMAIL;
      logicCAPITALEMAIL = logicCAPITALEMAIL;
    
    }
    let  ISCUSTOMER= user?user.ISCUSTOMER ? user.ISCUSTOMER == "Y"? true: false:false:false;
    switch (name) {
      case "FULLNAME":
        if (value == "") mssgerr = this.props.strings.requiredFullname;
        break;
      case "SEX":
        if (ISCN && value == "") mssgerr = this.props.strings.requiredSex;
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
          ISCN && this.state.generalInformation.COUNTRY != COUNTRY_234  && value == ""
        )
          mssgerr = this.props.strings.requiredTradingcode;
        break;
        case "PASSPORTDATE":
        if (
          ISCN && this.state.generalInformation.COUNTRY != COUNTRY_234  && value == ""
        )
          mssgerr = this.props.strings.requiredPASSPORTDATE;
        break;
        case "PASSPORTPLACE":
        if (
          ISCN && this.state.generalInformation.COUNTRY != COUNTRY_234  && value == ""
        )
          mssgerr = this.props.strings.requiredPASSPORTPLACE;
        break;
      case "LRPRIPHONE":
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' &&  value == "") mssgerr = this.props.strings.requiredPRIPHONE;
        break;
      case "IDCODE":
        if (value == "") {mssgerr = this.props.strings.requiredIdcode;}
        else if(this.state.generalInformation["CUSTTYPE"] == 'CN' && !logicCMND){
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
        if (value == " "  ) {
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
        if (value == "" && this.state.generalInformation.ISONLINE == 'Y')
         { mssgerr = this.props.strings.requiredMobile;}
         else if(!logicSDT){
           mssgerr = this.props.strings.invalidspace;
         }
        break;
      case "BANKACC":
        if (value == "") {mssgerr = this.props.strings.requiredBankAcc;}
        else if (!logicTKNH){
          mssgerr=this.props.strings.invalidspace;
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
        if (user && value == "" && !ISCUSTOMER) 
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

          if (this.state.generalInformation["CUSTTYPE"] == 'TC' &&  value == ""  ) {
            mssgerr = this.props.strings.invalidLREmail;
          }
          else if (this.state.generalInformation["CUSTTYPE"] == 'TC' && !logic1) {
            mssgerr = this.props.strings.LRwrongemail;
          }
            break;
        case "CAPITALNAME":
            if (this.state.generalInformation["CUSTTYPE"] == 'TC' && this.state.generalInformation["CAPITALNAME"]== "")
             { 
               mssgerr = this.props.strings.requiredCAPITALNAME;
              }
            break;
            case "CAPITALPOSITION":
            if (this.state.generalInformation["CUSTTYPE"] == 'TC' && this.state.generalInformation["CAPITALPOSITION"]== "")
             { 
               mssgerr = this.props.strings.requiredCAPITALPOSITION;
              }
            break;
            case "CAPITALIDCODE":
            if (this.state.generalInformation["CUSTTYPE"] == 'TC' && this.state.generalInformation["CAPITALIDCODE"]== "")
             { 
               mssgerr = this.props.strings.requiredCAPITALIDCODE;
              }
            break;
            case "CAPITALIDDATE":
            if (this.state.generalInformation["CUSTTYPE"] == 'TC' && this.state.generalInformation["CAPITALIDDATE"]== "")
             { 
               mssgerr = this.props.strings.requiredCAPITALIDDATE;
              }
            break;

            case "CAPITALIDPLACE":
            if (this.state.generalInformation["CUSTTYPE"] == 'TC' && this.state.generalInformation["CAPITALIDPLACE"]== "")
             { 
               mssgerr = this.props.strings.requiredCAPITALIDPLACE;
              }
            break;
            case "CAPITALTEL":
            if (this.state.generalInformation["CUSTTYPE"] == 'TC' && this.state.generalInformation["CAPITALTEL"]== "")
             { 
               mssgerr = this.props.strings.requiredCAPITALTEL;
              }
            break;
            case "CAPITALEMAIL":
            if (this.state.generalInformation["CUSTTYPE"] == 'TC' && this.state.generalInformation["CAPITALEMAIL"]== "")
             { 
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
        if (this.state.generalInformation["CUSTTYPE"] == 'TC' && value == ""){ 
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
        if (value =='N' || !value ) mssgerr = this.props.strings.requiredAgree;
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
          country : this.state.generalInformation.COUNTRY,
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
    let {user} = this.props.auth;
    let {oldInforBeforeChange , generalInformation} = this.state;
    generalInformation.DBCODE = !user ? '': user.DBCODE ? user.DBCODE :'';
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
    ) ? false :true;
   var mssgerr = "";
    for (let index = 0; index < this.state.checkFields.length; index++) {
      const element = this.state.checkFields[index];
      mssgerr = this.checkValid(element.name, element.id);
      if (mssgerr !== "") break;
    }
    //generalInformation.DBCODE = user.DBCODE;
    if (mssgerr == "") {
     
      await this.props.isConfirm(isConfirm);
      await this.props.onSubmit(generalInformation);
    }
  }
  async onChange(type, event) {
    if (event.target) {
      if (event.target.type == "checkbox") {
        
        if(event.target.checked == false){
          this.state.generalInformation[type] = 'N';
          if (type == 'ISAGREESHARE'){
            this.state.generalInformation[type] = false;
          }
          
        }
        else{
          this.state.generalInformation[type] = 'Y';
          if (type == 'ISAGREESHARE'){
            this.state.generalInformation[type] = true;
          }
        }        
        this.setState({generalInformation:this.state.generalInformation})
        
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
          country : this.state.generalInformation.COUNTRY,
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

        if(this.state.generalInformation.COUNTRY == '234')
        {
          a= 'TN';
        }
        else {
          a = 'NN';
        }
        let b = this.state.currentcountry;
        await RestfulUtils.post("/account/getidtype", {
          action: this.props.access,
          custtype: event.value,
          grinvestor: a,
          country : this.state.currentcountry,
          language: this.props.language
        }).then(res => {
          // gan mac dinh lay kq dau tien
          if (res) {
            // tuy chinh theo truong hop them se luon mac dinh lay kq dau tien
            if (this.props.access == "add") {
              if (event.value == 'CN'){
                this.setState({...this.state,generalInformation: {...this.state.generalInformation,ISAUTH : 'N',ISPEP : 'N',ISREPRESENTATIVE :'N', COUNTRY :b}});
              
              }
              else {
                this.setState({...this.state,generalInformation: {...this.state.generalInformation,ISAUTH : 'N',ISPEP : 'N',ISREPRESENTATIVE :'Y',COUNTRY :b}});

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
  _handleSIGNIMGChange = e => {
    e.preventDefault();
    let that = this;
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      var tempImg = new Image();
      tempImg.src = reader.result;
      tempImg.onload = function() {
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
        that.state.generalInformation.SIGN_IMG = dataURL;
        that.setState(that.state);
      };
    };

    reader.readAsDataURL(file);
  };
  _handleOWNLICENSEIMGChange = e => {
    e.preventDefault();

    let that = this;
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      var tempImg = new Image();
      tempImg.src = reader.result;
      tempImg.onload = function() {
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
        that.state.generalInformation.OWNLICENSE_IMG = dataURL;
        that.setState(that.state);
      };
    };

    reader.readAsDataURL(file);
  };
  _handleOWNLICENSE2IMGChange = e => {
    e.preventDefault();

    let that = this;
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      var tempImg = new Image();
      tempImg.src = reader.result;
      tempImg.onload = function() {
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
        that.state.generalInformation.OWNLICENSE2_IMG = dataURL;
        that.setState(that.state);
      };
    };

    reader.readAsDataURL(file);
  };
  _handleOWNLICENSE3IMGChange = e => {
    e.preventDefault();

    let that = this;
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      var tempImg = new Image();
      tempImg.src = reader.result;
      tempImg.onload = function() {
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
        that.state.generalInformation.OWNLICENSE3_IMG = dataURL;
        that.setState(that.state);
      };
    };

    reader.readAsDataURL(file);
  };
  _handleOWNLICENSE4IMGChange = e => {
    e.preventDefault();

    let that = this;
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      var tempImg = new Image();
      tempImg.src = reader.result;
      tempImg.onload = function() {
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
        that.state.generalInformation.OWNLICENSE4_IMG = dataURL;
        that.setState(that.state);
      };
    };

    reader.readAsDataURL(file);
  };
  getCfmastInfo (CUSTODYCD,OBJNAME) {
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
    let self= this
    let CUSTODYCD = nextProps.CfmastInfo?nextProps.CfmastInfo.DT.dataMain.CUSTODYCD?nextProps.CfmastInfo.DT.dataMain.CUSTODYCD:"":""
    let LANGUAGE = this.props.language?this.props.language:"vie"
    console.log('window.location:::',window.location)
    self.getOptionsJOB();
    self.getOptionsRUIRO();
    self.getOptionsEXPERIENCE();
    self.getOptionsINVESTTIME();
    if(nextProps.CfmastInfo){
      this.getCfmastInfo(nextProps.CfmastInfo.DT.dataMain.CUSTODYCD , nextProps.OBJNAME);
    }
    let optionsDataMG= [];
    if (nextProps.access !== "add") {
      if (CUSTODYCD && this.state.CUSTODYCD!= CUSTODYCD || LANGUAGE!= this.state.LANGUAGE) {
        this.setState({CUSTODYCD: CUSTODYCD, LANGUAGE: LANGUAGE })
        let a ={};
        let oldInfor = nextProps.CfmastInfo.DT.dataMain;
        let custid = oldInfor.CUSTID;
        await RestfulUtils.post("/account/getcfmastbycustid", {
          custid: custid,
          //OBJNAME: this.props.OBJNAME,
          language: this.props.language
        }).then(res => {
          a = {...res.DT[0]};
        });
        oldInfor = {...a};
        if (oldInfor) {
         await RestfulUtils.post('/user/getListSaleidByTLID', { language: this.props.language })
        .then((res) => {
             optionsDataMG = res.result
             let i = 0;
             for (i = 0; i< optionsDataMG.length; i ++){
               if (oldInfor.SALEID == optionsDataMG[i].value){
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
            country : oldInfor.COUNTRY,
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
          if (oldInfor.ISCONTACT =='Y' || oldInfor.ISCONTACT == true) {
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
            generalInformation: {...oldInfor},
            
          });
        }
      }
      else{
        if (CUSTODYCD == ""){
            
            
            this.setState({
              CUSTODYCD: "",
              
            });
        }
        
      }
    }
    // ADD QLTK
    else{
      console.log('this.props.CUSTTYPE:::', this.props.CUSTTYPE)
      let language = '';
    if (window.location.pathname && window.location.pathname == '/createaccount' && window.location.search){
      language = window.location.search.substring(10)
    }
    else {
      language = this.props.language
    }
      if (LANGUAGE!= this.state.LANGUAGE) {
        this.setState({LANGUAGE: LANGUAGE })
        await RestfulUtils.post("/account/getidtype", {
          action: this.props.access,
          custtype: this.props.CUSTTYPE?this.props.CUSTTYPE : this.state.generalInformation.CUSTTYPE,
          grinvestor: this.state.generalInformation.GRINVESTOR,
          country : this.state.generalInformation.COUNTRY,
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
                ...self.state,  optionsDataMG: res.result
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
    let CUSTODYCD = oldInfor?oldInfor.CUSTODYCD?oldInfor.CUSTODYCD:"":""
    // console.log('componentWillMount.:Begin=oldInfor.ISONLINE.:', oldInfor,this.state.CUSTODYCD, CUSTODYCD )
      if (oldInfor) {
      //console.log('old infor will mount:',oldInfor)
      if (oldInfor.ISAGREE !== 'Y') oldInfor.ISAGREE = 'N';
      // console.log('componentWillMount.:oldInfor.ISONLINE1.:', oldInfor.ISONLINE, oldInfor.ISONLINE !== 'Y' || oldInfor.ISONLINE !== true)
      if (oldInfor.ISONLINE !== 'Y') oldInfor.ISONLINE = 'N';
      if (oldInfor.ISAUTH !== 'Y' ) oldInfor.ISAUTH = 'N';
      if (oldInfor.ISFATCA !== 'Y' ) oldInfor.ISFATCA = 'N';
      if (oldInfor.ISAGREESHARE !== 'Y' ) oldInfor.ISAGREESHARE = false;
      oldInfor.BANKCODE = this.props.BANKCODE;
      oldInfor.CUSTTYPE = this.props.CUSTTYPE;
      oldInfor.ISAGREESHARE = this.props.ISAGREESHARE;
      await RestfulUtils.post("/account/getidtype", {
        action: this.props.access,
        custtype: oldInfor.CUSTTYPE,
        grinvestor: this.state.generalInformation.GRINVESTOR,
        country : oldInfor.COUNTRY,
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
    console.log('didmount')
    const { user } = this.props.auth;
    let {generalInformation} = this.state
    let self = this
    self.getOptionsJOB();
    self.getOptionsRUIRO();
    self.getOptionsEXPERIENCE();
    self.getOptionsINVESTTIME();
    //console.log('listdrop :', listDrop)
    if (this.props.access == "add"){
    let  ISCUSTOMER= user?user.ISCUSTOMER ? user.ISCUSTOMER == "Y"? true: false:false:false;
    // set mac dinh neu la cus thi mac dinh ISONL chon true
      window.$("#cbISONL").prop("checked", ISCUSTOMER ? true : false);
      if(ISCUSTOMER) {
        this.state.generalInformation.ISONLINE = 'Y'
        this.setState({generalInformation: this.state.generalInformation})
      } else {
        this.state.generalInformation.ISONLINE = 'N'
        this.setState({generalInformation: this.state.generalInformation})
      }
    }
    else{
    }
    let language = '';
    if (window.location.pathname && window.location.pathname == '/createaccount' && window.location.search){
      language = window.location.search.substring(10)
    }
    else {
      language = this.props.language
    }
    RestfulUtils.post("/account/getidtype", {
      action: this.props.access,
      custtype: this.props.CUSTTYPE?this.props.CUSTTYPE : this.state.generalInformation.CUSTTYPE,
      grinvestor: this.state.generalInformation.GRINVESTOR,
      country : this.state.generalInformation.COUNTRY,
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
                ...self.state,  optionsDataMG: res.result
            })

        })
    if(this.props.OBJNAME !== "CREATEACCOUNT") { // tranh loi khi goi o create acc
      RestfulUtils.post("/account/getctv", {
        action: this.props.access,
        language: this.props.language,
        OBJNAME: this.props.OBJNAME
      }).then(res => {
        if (res) {
          if(res.result){
            if(res.result.length > 0) {
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
    window.$(function() {
      var options = { trigger: "hover focus" };
      $('[data-toggle="popover"]').popover(options);
    });
    window.$("#txtFullname").focus();
    let oldInfor = this.props.GeneralInfoMain ? this.props.GeneralInfoMain : this.props.CfmastInfo ? this.props.CfmastInfo.DT.dataMain : null;
    if (oldInfor) {
      if (oldInfor.ISAGREE == 'Y') window.$("#cbIsagree").prop("checked", true);
      if (oldInfor.ISCONTACT =='Y')
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

    let  isCustom= user?user.ISCUSTOMER ? user.ISCUSTOMER == "Y"? true: false:false:false;
    if (isCustom) {
      this.state.generalInformation["ACCTYPE"] = ACTYPE_TT;
      $("#drdAcctype").prop("disabled", true);
    } else $("#drdAcctype").prop("disabled", false);
    generalInformation.BANKCODE = this.props.BANKCODE;
    self.setState({ generalInformation: generalInformation})

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
    if (window.location.pathname && window.location.pathname == '/createaccount' && window.location.search){
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
          listDrop : self.state.listDrop
      })

  })
}
getOptionsJOB() {
  let language = '';
  if (window.location.pathname && window.location.pathname == '/createaccount' && window.location.search){
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
        listDrop : self.state.listDrop
    })

})
}
  getOptionsINVESTTIME() {
    let language = '';
    if (window.location.pathname && window.location.pathname == '/createaccount' && window.location.search){
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
          listDrop : self.state.listDrop
      })

  })
}
  getOptionsEXPERIENCE() {
    let language = '';
    if (window.location.pathname && window.location.pathname == '/createaccount' && window.location.search){
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
          listDrop : self.state.listDrop
      })

  })
}

  onChangeIdType(e) {
    if (e && e.value) {
      this.checkOldAcc(e.value, this.state.generalInformation.IDCODE);
      this.state.generalInformation["IDTYPE"] = e.value;
      this.setState(this.state);
    } else {
      this.state.generalInformation["IDTYPE"] = "";
      this.setState(this.state);
    }
  }
  onChangeCareby(e) {
    if (e && e.value) {
      this.state.generalInformation["CAREBY"] = e.value;
      this.setState(this.state);
    } else {
      this.state.generalInformation["CAREBY"] = "";
      this.setState(this.state);
    }
  }
  onChangeJOB(e) {
    if (e && e.value) {
      this.state.generalInformation["JOB"] = e.value;
      this.setState(this.state);
    } else {
      this.state.generalInformation["JOB"] = "";
      this.setState(this.state);
    }
  }
  onChangeRUIRO(e) {
    if (e && e.value) {
      this.state.generalInformation["RUIRO"] = e.value;
      this.setState(this.state);
    } else {
      this.state.generalInformation["RUIRO"] = "";
      this.setState(this.state);
    }
  }
  onChangeEXPERIENCE(e) {
    if (e && e.value) {
      this.state.generalInformation["EXPERIENCE"] = e.value;
      this.setState(this.state);
    } else {
      this.state.generalInformation["EXPERIENCE"] = "";
      this.setState(this.state);
    }
  }
  onChangeINVESTTIME(e) {
    if (e && e.value) {
      this.state.generalInformation["INVESTTIME"] = e.value;
      this.setState(this.state);
    } else {
      this.state.generalInformation["INVESTTIME"] = "";
      this.setState(this.state);
    }
  }
  onChangeMaMoGioi(e) {
    if (e && e.value) {
      this.state.generalInformation["SALEID"] = e.value;
      this.setState(this.state);
    } else {
      this.state.generalInformation["SALEID"] = "";
      this.setState(this.state);
    }
  }
  onChangeSaleid(e) {
    if (e && e.value) {
      this.state.generalInformation["SALEID"] = e.value;
      this.setState(this.state);
    } else {
      this.state.generalInformation["SALEID"] = "";
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
          var handle = setInterval(function() {
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
                  var handle1 = setInterval(function() {
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
  handleMouseIn1() {
    this.setState({ hover1: true })
  }
  
  handleMouseOut1() {
    this.setState({ hover1: false })
  }
  handleMouseIn2() {
    this.setState({ hover2: true })
  }
  
  handleMouseOut2() {
    this.setState({ hover2: false })
  }
  handleMouseIn3() {
    this.setState({ hover3: true })
  }
  
  handleMouseOut3() {
    this.setState({ hover3: false })
  }
  render() {
    let self = this;
    let isRenderUyQuyen  = true;
    let isRenderCareby  = true
    const { user } = this.props.auth;
    
    let ISCUSTOMER = user;
    let ISLOGIN = ISCUSTOMER != '' && ISCUSTOMER != undefined;
    let ISCN = this.state.generalInformation.CUSTTYPE == "CN";
    ISCUSTOMER= user ? user.ISCUSTOMER ? user.ISCUSTOMER == "Y"? true: false:false:false;
    let isUPDATE = this.props.access == "update";
    let isVIEW = this.props.access == "view";
    ISCUSTOMER= user ? user.ISCUSTOMER ? user.ISCUSTOMER == "Y"? true: false:false:false;
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;
    let {ISONLINE}= this.state.generalInformation;
    let ISVIE = this.props.language == 'vie' ? true : false
        const tooltipStyle1 = {
            display: this.state.hover1 ? 'block' : 'none',
            color : 'red'
          }
        const tooltipStyle2 = {
            display: this.state.hover2 ? 'block' : 'none',
            color : 'red'
          }
          const tooltipStyle3 = {
            display: this.state.hover3 ? 'block' : 'none',
            color : 'red'
          }
    // let {
    //   SIGN_IMG,
    //   OWNLICENSE_IMG,
    //   OWNLICENSE2_IMG,
    //   OWNLICENSE3_IMG,
    //   OWNLICENSE4_IMG,
    // } = this.state.generalInformation;
    // let $SIGNIMGPreview = null;
    // if (SIGN_IMG) {
    //   $SIGNIMGPreview = (
    //     <img
    //       style={{
    //         width: " 250px",
    //         height: "200px",
    //         padding: " 10px"
    //       }}
    //       src={SIGN_IMG}
    //     />
    //   );
    // } else {
    //   $SIGNIMGPreview = <div className="previewText" />;
    // }
    // let $OWNLICENSEIMGPreview = null;
    // if (OWNLICENSE_IMG) {
    //   $OWNLICENSEIMGPreview = (
    //     <img
    //       style={{
    //         width: " 250px",
    //         height: "200px",
    //         padding: " 10px"
    //       }}
    //       src={OWNLICENSE_IMG}
    //     />
    //   );
    // } else {
    //   $OWNLICENSEIMGPreview = <div className="previewText" />;
    // }
    // let $OWNLICENSE2IMGPreview = null;
    // if (OWNLICENSE2_IMG) {
    //   $OWNLICENSE2IMGPreview = (
    //     <img
    //       style={{
    //         width: " 250px",
    //         height: "200px",
    //         padding: " 10px"
    //       }}
    //       src={OWNLICENSE2_IMG}
    //     />
    //   );
    // } else {
    //   $OWNLICENSE2IMGPreview = <div className="previewText" />;
    // }
    // let $OWNLICENSE3IMGPreview = null;
    // if (OWNLICENSE3_IMG) {
    //   $OWNLICENSE3IMGPreview = (
    //     <img
    //       style={{
    //         width: " 250px",
    //         height: "200px",
    //         padding: " 10px"
    //       }}
    //       src={OWNLICENSE3_IMG}
    //     />
    //   );
    // } else {
    //   $OWNLICENSE3IMGPreview = <div className="previewText" />;
    // }
    // let $OWNLICENSE4IMGPreview = null;
    // if (OWNLICENSE4_IMG) {
    //   $OWNLICENSE4IMGPreview = (
    //     <img
    //       style={{
    //         width: " 250px",
    //         height: "200px",
    //         padding: " 10px"
    //       }}
    //       src={OWNLICENSE4_IMG}
    //     />
    //   );
    // } else {
    //   $OWNLICENSE4IMGPreview = <div className="previewText" />;
    // }
    let isDisableWhenView = this.props.access == "view";
    let isDisableWhenUpdate = this.props.access == "update";
    let displayExport = this.props.access == "add" ? "none" : "block";
    var renderTooltip = null;
    if (this.props.language == 'vie') {
      renderTooltip = <ul style={{paddingLeft: "0px" }}>Nhà đầu tư có dấu hiệu Mỹ là Nhà đầu tư có một trong các dấu hiệu sau:
<li>Công dân Mỹ, người có thẻ xanh của Mỹ, hoặc Người đóng thuế Mỹ</li>
<li>Nơi sinh tại Mỹ</li>
<li>Địa chỉ cư trú ở Mỹ hoặc địa chỉ hòm thư tại Mỹ</li>
<li>Số điện thoại hiện tại ở Mỹ</li>
<li>Lệnh thanh toán thường trực từ một tài khoản nước ngoài đến một tài khoản được duy trì ở Mỹ</li>
<li>Giấy ủy quyền hay thẩm quyền ký được cấp cho người có địa chỉ ở Mỹ</li>
<li>Địa chỉ “ gửi nhờ” hoặc “giữ thư” là địa chỉ duy nhất của chủ tài khoản ở Mỹ</li>
</ul>
}else if (this.props.language == 'en') {
  renderTooltip = <ul style={{paddingLeft: "0px" }}>Investors with US Signs are investors who have one of the following signs:
<li>Investors are US citizen or resident</li>
<li>Investors are born in the US</li>
<li>Investors have a current US mailing or residence address</li>
<li>Investors have a current US phone number</li>
<li>Investors have standing instructions to transfer funds to an account maintained in the US or directions regularly received from a US address</li>
<li>Investors have an effective power of attorney or signatory authority granted over your account to a person with a US address</li>
<li>Investor have any address on file which is “in care of” or “hold mail” in the US</li>
</ul>
}
var renderTooltip2 = null;
    if (this.props.language == 'vie') {
      renderTooltip2 = <div  style={tooltipStyle2}>
      Vui lòng chọn “Có” trong các trường hợp sau đây: <br />
      a. Quý khách là người giữ chức vụ cấp cao trong các cơ quan, tổ chức hữu quan của nước ngoài; hoặc <br />
      b. Quý khách là cha, mẹ, vợ, chồng, con, anh ruột, chị ruột, em ruột của người quy định tại điểm a nêu trên.<br />
      </div>
}else if (this.props.language == 'en') {
  renderTooltip2 = <div  style={tooltipStyle2}>
  Please choose "Yes" in the folowing cases <br />
  a. You are a high officer from the local government or from other related foreign organizations. <br />
  b. You are connected by blood, marriage to the person described in section a.<br />
  </div>
}
    return (
      <div disabled = {ISCUSTOMER ? true : false}>
        <div
          className={
            this.props.access !== "view" ? "col-md-12" : "col-md-12 disable"
          }
          style={{ paddingTop: "11px" }}
        >
        <div className="col-md-12 row module">
        <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.custtype}</b>
              </h5>
            </div>
            <div className="col-md-3">
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
          </div>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.fullname}</b>
              </h5>
            </div>
            <div className="col-md-9">
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

              />
            </div>
          </div>
          {ISCN && <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.sex}</b>
              </h5>
            </div>
            <div className="col-md-3">
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
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.birthdate}</b>
              </h5>
            </div>
            <div className="col-md-3 fixWidthDatePickerForOthers">
              <DateInput
                disabled={isDisableWhenView}
                valid={this.validBirthdate}
                id="txtBirthdate"
                onChange={this.onChange.bind(this)}
                value={this.state.generalInformation.BIRTHDATE}
                type="BIRTHDATE"
              />
            </div>
            </div>}

          {/* <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.custclass}</b>
              </h5>
            </div>
            <div className="col-md-3">
              <DropdownFactory
                disabled={true}
                onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                onChange={this.onChange.bind(this)}
                ID="drdGrinvestor"
                value="GRINVESTOR"
                CDTYPE="CF"
                CDNAME="GRINVESTOR"
                CDVAL={this.state.generalInformation.GRINVESTOR}
              />
            </div>
            
          </div> */}
          <div className="col-md-12 row">
          <div className="col-md-3" onMouseOver={this.handleMouseIn1.bind(this)} onMouseOut={this.handleMouseOut1.bind(this)}>
              <h5 className="highlight">
                <b>{this.props.strings.country}</b>
              </h5>
            </div>
            <div className="col-md-3">
              <DropdownFactory
                disabled={isUPDATE || isDisableWhenView}
                //onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                onChange={this.onChange.bind(this)}
                ID="drdCountry"
                value="COUNTRY"
                CDTYPE="CF"
                CDNAME="COUNTRY"
                CDVAL={this.state.generalInformation.COUNTRY}
              />
            </div>
            <div className="col-md-3">
              <h5 className="">
                <b>{this.props.strings.othercountry}</b>
              </h5>
            </div>
            <div className="col-md-3">
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
            </div>
            {ISVIE ? <div className="col-md-12" style={tooltipStyle1}>
            <div  style={tooltipStyle1}>Nếu KH có dấu hiệu Mỹ, vui lòng liên hệ MB Capital hoặc Đại lý phân phối gần nhất của MB Capital để được hỗ trợ bổ sung thông tin Đạo luật tuân thủ FATCA
            </div>
            </div> :
            <div className="col-md-12" style={tooltipStyle1}>
            <div   style={tooltipStyle1}>If you are US.Person, please contact MB Capital or Distributors of MB Capital for assistance regarding FATCA</div>
            </div>}
{/* ------------------------------Thông tin nghề nghiệp - visa---------------------------- */}
            {ISCN && this.state.generalInformation.COUNTRY === COUNTRY_234 &&
            <div>
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5 className="highlight">
                  <b>{this.props.strings.JOB}</b>
                </h5>
              </div>
              <div className="col-md-3">
                {/* <input
                  maxLength="500"
                  disabled={isDisableWhenView}
                  value={this.state.generalInformation.JOB}
                  onChange={this.onChange.bind(this, "JOB")}
                  id="txtJOB"
                  className="form-control"
                  type="text"
                  placeholder={this.props.strings.JOB}
                /> */}

                <Select.Async
                    name="form-field-name"
                    //disabled={isDisableWhenView || isUPDATE}
                    placeholder={this.props.strings.JOB}
                    loadOptions={this.getOptionsAsync.bind(this,'JOB')}
                    options={this.state.listDrop.JOB}
                    value={this.state.generalInformation.JOB}
                    onChange={this.onChangeJOB.bind(this)}
                    id="drdJOB"
                    cache={false}
                  />
                
              </div> 
              <div className="col-md-3">
                <h5 className="">
                  <b>{this.props.strings.POSITIONCN}</b>
                </h5>
              </div>
              <div className="col-md-3">
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
            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5 className={this.state.generalInformation["CUSTTYPE"] == 'CN' && this.state.generalInformation["COUNTRY"] == '234' ? "highlight": "" }>
                  <b>{this.props.strings.WORKADDRESS}</b>
                </h5>
              </div>
              <div className="col-md-9">
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
              
            </div>
            </div>}
            
           
{/* ---------------------------------Ho chieu----------------------------------- */}

      <div className="col-md-12 row">
      <div className="col-md-3">
              <h5 className={this.state.generalInformation.CUSTTYPE == "CN" ? "":"highlight"}>
                <b>{this.props.strings.TAXNUMBER}</b>
              </h5>
            </div>
            <div className="col-md-3">
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
            <div className="col-md-3">
              <h5 className="">
                <b>{this.props.strings.TAXPLACE}</b>
              </h5>
            </div>
            <div className="col-md-3">
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
            
            
            </div>
            {this.state.generalInformation.COUNTRY !== COUNTRY_234 &&(<div>
          <div className="col-md-12 row">
          <div className="col-md-3">
              <h5 className="highlight">
                <b>{ISCN && this.state.generalInformation.COUNTRY !== COUNTRY_234 ? this.props.strings.PASSPORT :this.props.strings.PASSPORT1}</b>
              </h5>
            </div>
            <div className="col-md-3">
            <input
                disabled={isDisableWhenView}
                value={this.state.generalInformation.PASSPORT}
                onChange={this.onChange.bind(this, "PASSPORT")}
                id="txtPASSPORT"
                className="form-control"
                type="text"
                placeholder={ISCN && this.state.generalInformation.COUNTRY !== COUNTRY_234 ? this.props.strings.PASSPORT :this.props.strings.PASSPORT1}
              />
            </div>
            <div className="col-md-3">
            <h5 className="highlight">
                <b>{ISCN && this.state.generalInformation.COUNTRY !== COUNTRY_234 ? this.props.strings.PASSPORTDATE :this.props.strings.PASSPORTDATE1}</b>
              </h5>
              {/* <h5 className="">
                <b>{this.props.strings.PASSPORTDATE}</b>
              </h5> */}
            </div>
            <div className="col-md-3 fixWidthDatePickerForOthers">
              <DateInput
                disabled={isDisableWhenView}
                valid={this.validBirthdate}
                id="txtPASSPORTDATE"
                onChange={this.onChange.bind(this)}
                value={this.state.generalInformation.PASSPORTDATE}
                type="PASSPORTDATE"
              />
            </div>
          
            
            </div>
    </div>)}
    {this.state.generalInformation.COUNTRY !== COUNTRY_234 &&(
            <div className="col-md-12 row">
              <div className="col-md-3">
              <h5 className="highlight">
                <b>{ISCN && this.state.generalInformation.COUNTRY !== COUNTRY_234 ? this.props.strings.PASSPORTPLACE :this.props.strings.PASSPORTPLACE1}</b>
              </h5>
              {/* <h5 className="">
                <b>{this.props.strings.PASSPORTPLACE}</b>
              </h5> */}
            </div>
            <div className="col-md-3">
            <input
                disabled={isDisableWhenView}
                value={this.state.generalInformation.PASSPORTPLACE}
                onChange={this.onChange.bind(this, "PASSPORTPLACE")}
                id="txtPASSPORTPLACE"
                className="form-control"
                type="text"
                placeholder={ISCN && this.state.generalInformation.COUNTRY !== COUNTRY_234 ? this.props.strings.PASSPORTPLACE :this.props.strings.PASSPORTPLACE1}
              />
            </div>
          
            </div>)}
{/* --------------------------------------------------------------------------------------------------- */}

            <div className="col-md-12 row">  
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.idtype}</b>
              </h5>
            </div>
            <div className="col-md-3">
              <Select.Async
                name="form-field-name"
                disabled={isDisableWhenView || isUPDATE}
                placeholder={this.props.strings.idtype}
                options={this.state.optionsIdType}
                loadOptions={this.getOptionsIdType.bind(this)}
                value={this.state.generalInformation.IDTYPE}
                onChange={this.onChangeIdType.bind(this)}
                id="drdIdtype"
                cache={false}
              />
              {/* <DropdownFactory disabled={isDisableWhenView} onSetDefaultValue={this.onSetDefaultValue.bind(this)} onChange={this.onChange.bind(this)} ID="drdIdtype" value="IDTYPE" CDTYPE="CF" CDNAME="IDTYPE" CDVAL={this.state.generalInformation.IDTYPE} /> */}
            </div>
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.idcode}</b>
              </h5>
            </div>
            <div className="col-md-3">
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
                // data-toggle="popover"
                // data-trigger="hover"
                // data-placement="top"
                // data-content={this.props.strings.idcodePopover}
                // data-original-title={this.props.strings.popoverTitle}
              />
            </div>
          </div>

          <div className="col-md-12 row">
            
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.iddate}</b>
              </h5>
            </div>
            <div className="col-md-3 fixWidthDatePickerForOthers">
              <DateInput
                disabled={isDisableWhenView}
                id="txtIddate"
                onChange={this.onChange.bind(this)}
                value={this.state.generalInformation.IDDATE}
                type="IDDATE"
              />
            </div>
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.idplace}</b>
              </h5>
            </div>
            <div className="col-md-3">
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
          <div className="col-md-12 row">
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
                <div className="col-md-3 fixWidthDatePickerForOthers">
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
         
          {/* {this.state.generalInformation["COUNTRY"] !== COUNTRY_234 && (
            <div className="col-md-12 row">
              <div className="col-md-3" />
              <div className="col-md-3">
                <h5 className="highlight">
                  <i>
                    <i className="fas fa-exclamation-circle" />{" "}
                    {this.props.strings.noteTradingcode}
                  </i>{" "}
                </h5>
              </div>
              <div className="col-md-3">
                <h5 className="highlight">
                  <b>{this.props.strings.tradingcode}</b>
                </h5>
              </div>
              <div className="col-md-3">
                <input
                  maxLength="50"
                  disabled={isDisableWhenView}
                  value={this.state.generalInformation.TRADINGCODE}
                  id="txtTradingcode"
                  className="form-control"
                  type="text"
                  placeholder={this.props.strings.tradingcode}
                  onChange={this.onChange.bind(this, "TRADINGCODE")}
                />
              </div>
            </div>
          )} */}
          {ISCN && this.state.generalInformation.COUNTRY !== COUNTRY_234 &&
            <div>
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5 className="">
                  <b>{this.props.strings.VISANO}</b>
                </h5>
              </div>
              <div className="col-md-3">
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
              </div> 
              <div className="col-md-3">
                <h5 className="">
                  <b>{this.props.strings.LIDONHAPCANH}</b>
                </h5>
              </div>
              <div className="col-md-3">
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
            </div>
            
            </div>}
          
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{ISCN ? this.props.strings.contactaddress:this.props.strings.regaddress1}</b>
              </h5>
            </div>
            <div className="col-md-9">
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
            {/* <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.PHOTHONXOM}</b>
              </h5>
            </div>
            <div className="col-md-3">
              <input
                maxLength="500"
                disabled={isDisableWhenView}
                value={this.state.generalInformation.PHOTHONXOM}
                onChange={this.onChange.bind(this, "PHOTHONXOM")}
                id="txtPHOTHONXOM"
                className="form-control"
                type="text"
                placeholder={this.props.strings.PHOTHONXOM}
              />
            </div> */}
          </div>

          {/* <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.PHUONGXA}</b>
              </h5>
            </div>
            <div className="col-md-3">
              <input
                maxLength="500"
                disabled={isDisableWhenView}
                value={this.state.generalInformation.PHUONGXA}
                onChange={this.onChange.bind(this, "PHUONGXA")}
                id="txtPHUONGXA"
                className="form-control"
                type="text"
                placeholder={this.props.strings.PHUONGXA}
              />
            </div>
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.THANHPHO}</b>
              </h5>
            </div>
            <div className="col-md-3">
              <input
                maxLength="500"
                disabled={isDisableWhenView}
                value={this.state.generalInformation.THANHPHO}
                onChange={this.onChange.bind(this, "THANHPHO")}
                id="txtTHANHPHO"
                className="form-control"
                type="text"
                placeholder={this.props.strings.THANHPHO}
              />
            </div>
          </div> */}
          {/* {ISCN ? <div>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="">
                <b>{this.props.strings.regaddress}</b>
              </h5>
            </div>
            </div>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.SONHAREG}</b>
              </h5>
            </div>
            <div className="col-md-3">
              <input
                maxLength="500"
                disabled={isDisableWhenView}
                value={this.state.generalInformation.SONHAREG}
                onChange={this.onChange.bind(this, "SONHAREG")}
                id="txtSONHAREG"
                className="form-control"
                type="text"
                placeholder={this.props.strings.SONHAREG}
              />
            </div>
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.PHOTHONXOMREG}</b>
              </h5>
            </div>
            <div className="col-md-3">
              <input
                maxLength="500"
                disabled={isDisableWhenView}
                value={this.state.generalInformation.PHOTHONXOMREG}
                onChange={this.onChange.bind(this, "PHOTHONXOMREG")}
                id="txtPHOTHONXOMREG"
                className="form-control"
                type="text"
                placeholder={this.props.strings.PHOTHONXOMREG}
              />
            </div>
          </div>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.PHUONGXAREG}</b>
              </h5>
            </div>
            <div className="col-md-3">
              <input
                maxLength="500"
                disabled={isDisableWhenView}
                value={this.state.generalInformation.PHUONGXAREG}
                onChange={this.onChange.bind(this, "PHUONGXAREG")}
                id="txtPHUONGXAREG"
                className="form-control"
                type="text"
                placeholder={this.props.strings.PHUONGXAREG}
              />
            </div>
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.THANHPHOREG}</b>
              </h5>
            </div>
            <div className="col-md-3">
              <input
                maxLength="500"
                disabled={isDisableWhenView}
                value={this.state.generalInformation.THANHPHOREG}
                onChange={this.onChange.bind(this, "THANHPHOREG")}
                id="txtTHANHPHOREG"
                className="form-control"
                type="text"
                placeholder={this.props.strings.THANHPHOREG}
              />
            </div>
          </div>
          </div>:null} */}
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="">
                <b>{this.props.strings.regaddress}</b>
              </h5>
            </div>
            <div className="col-md-9">
              <input
                maxLength="500"
                disabled={isDisableWhenView}
                value={this.state.generalInformation.REGADDRESS}
                onChange={this.onChange.bind(this, "REGADDRESS")}
                id="txtregAddress"
                className="form-control"
                type="text"
                placeholder={this.props.strings.regaddress}
              />
            </div>
          </div> 
          <div className="col-md-12 row">
          {!ISCN ?
          <div>
            <div className="col-md-3">
              <h5 className="">
                <b>{this.props.strings.fax}</b>
              </h5>
            </div>
            <div className="col-md-9">
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
            </div>:null}
          </div>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight" >
                <b>{this.props.strings.email}</b>
              </h5>
            </div>
            <div className="col-md-9">
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
          </div>
          <div className="col-md-12 row">
            <div className="col-md-3">              
                <h5 className="highlight">
                  <b>{this.props.strings.mobile}</b>
                </h5>
            </div>
            <div className="col-md-3">
              {/* <NumberFormat value={this.state.generalInformation.MOBILE} id="txtMobile" className="form-control" placeholder={this.props.strings.mobile} onChange={this.onChange.bind(this, 'MOBILE')}  prefix={''} data-toggle="popover" data-trigger="hover" data-placement="top" data-content={this.props.strings.mobilePopover} data-original-title={this.props.strings.popoverTitle} /> */}
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
            <div className="col-md-3">
              <h5>
                <b>{this.props.strings.phone}</b>
              </h5>
            </div>
            <div className="col-md-3">
              {/* <NumberFormat value={this.state.generalInformation.PHONE} id="txtPhone" className="form-control" placeholder={this.props.strings.phone} onValueChange={this.onChange.bind(this, 'PHONE')} prefix={''} /> */}
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
            </div>
          </div>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.bankaccno}</b>
              </h5>
            </div>
            <div className="col-md-3">
              {/* <NumberFormat value={this.state.generalInformation.BANKACC} id="txtBankaccno" className="form-control" placeholder={this.props.strings.bankaccno} onValueChange={this.onChange.bind(this, 'BANKACC')} prefix={''} data-toggle="popover" data-trigger="hover" data-placement="top" data-content={this.props.strings.backAccountPopover} data-original-title={this.props.strings.popoverTitle} /> */}
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
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.bankname}</b>
              </h5>
            </div>
            <div className="col-md-3">
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
          </div>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight"><b>{this.props.strings.branchname}</b></h5>
            </div>
            <div className="col-md-3">
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
            {/* <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.acctype}</b>
              </h5>
            </div>
            <div className="col-md-3">
              <DropdownFactory
                disabled={isUPDATE || isDisableWhenView}
                onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                onChange={this.onChange.bind(this)}
                ID="drdAcctype"
                value="ACCTYPE"
                CDTYPE="CF"
                CDNAME="ACCTYPE"
                CDVAL={this.state.generalInformation.ACCTYPE}
              />
            </div> */}
              <div>
              {ISLOGIN && isRenderCareby && (<div>
                <div className="col-md-3">
                  <h5 className="highlight">
                    <b>{this.props.strings.careby}</b>
                  </h5>
                </div>
                <div className="col-md-3">
                  <Select.Async
                    name="form-field-name"
                    disabled={isDisableWhenView || isUPDATE}
                    placeholder={this.props.strings.careby}
                    loadOptions={this.getOptionsCareby.bind(this)}
                    value={this.state.generalInformation.CAREBY}
                    onChange={this.onChangeCareby.bind(this)}
                    id="drdCareby"
                    cache={false}
                  />
                </div> </div> )}
                {isRenderUyQuyen? <div>
                <div className="col-md-3">
                  <h5 className='highlight'><b>{this.props.strings.isauth}</b></h5>
                </div>
                <div className="col-md-3">
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
                </div>:<div>
                </div>}
              </div>
           
          </div>

{ISLOGIN && (<div className="col-md-12 row">
            
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.MGCSTK}</b>
              </h5>
            </div>
            <div className="col-md-3">

          <Select.Async className="form-field-name"
                                            disabled={isDisableWhenView || isDisableWhenUpdate}
                                            name="form-field-name"
                                            placeholder={this.props.strings.MGCSTK}
                                            loadOptions={this.getOptionsMaMoGioi.bind(this)}
                                            options={this.state.optionsDataMG}
                                            cache={false}
                                            value={this.state.generalInformation.SALEID}
                                            onChange={this.onChangeMaMoGioi.bind(this)}
                                            id="drdsaleid"
                                        />
                                        </div>
                                        </div>)}
        </div>
        {/* ------------------------------------------------------------------------------------------- */}
        <div className="col-md-12 row module">
          <div className="col-md-12">
              <h5 className="">
                <b>{this.props.strings.NHUCAUDAUTU}</b>
              </h5>
            </div>
          
          
          <div className="col-md-12 row">
            
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.INVESTTIME}</b>
              </h5>
            </div>
            <div className="col-md-3 ">
            <Select.Async
                    name="form-field-name"
                    //disabled={isDisableWhenView || isUPDATE}
                    placeholder={this.props.strings.INVESTTIME}
                    loadOptions={this.getOptionsAsync.bind(this,'INVESTTIME')}
                    options={this.state.listDrop.INVESTTIME}
                    value={this.state.generalInformation.INVESTTIME}
                    onChange={this.onChangeINVESTTIME.bind(this)}
                    id="drdINVESTTIME"
                    cache={false}
                  />
            {/* <DropdownFactory
                disabled={isDisableWhenView}
                //onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                onChange={this.onChange.bind(this)}
                ID="drdINVESTTIME"
                value="INVESTTIME"
                CDTYPE="CF"
                CDNAME="INVESTTIME"
                CDVAL={this.state.generalInformation.INVESTTIME}
              /> */}
            </div>
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.RUIRO}</b>
              </h5>
            </div>
            <div className="col-md-3">
            <Select.Async
                    name="form-field-name"
                    //disabled={isDisableWhenView || isUPDATE}
                    placeholder={this.props.strings.RUIRO}
                    loadOptions={this.getOptionsAsync.bind(this,'RUIRO')}
                    options={this.state.listDrop.RUIRO}
                    value={this.state.generalInformation.RUIRO}
                    onChange={this.onChangeRUIRO.bind(this)}
                    id="drdRUIRO"
                    cache={false}
                  />
            </div>
          </div>
          <div className="col-md-12 row">
            
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.EXPERIENCE}</b>
              </h5>
            </div>
            <div className="col-md-3 ">
            <Select.Async
                    name="form-field-name"
                    //disabled={isDisableWhenView || isUPDATE}
                    placeholder={this.props.strings.EXPERIENCE}
                    loadOptions={this.getOptionsAsync.bind(this,'EXPERIENCE')}
                    options={this.state.listDrop.EXPERIENCE}
                    value={this.state.generalInformation.EXPERIENCE}
                    onChange={this.onChangeEXPERIENCE.bind(this)}
                    id="drdEXPERIENCE"
                    cache={false}
                  />
            </div>
            
          </div>
          
          </div>  
                                        
          
{/* -----------------------------------------Legal Representative----------------------------- */}
          {this.state.generalInformation.CUSTTYPE == 'TC' && (
          <div className="col-md-12 row module">
          <div className="col-md-12">
              <h5 className="">
                <b>{this.props.strings.ISREPRESENTATIVE}</b>
              </h5>
            </div>
          {/* <div className="col-md-12 row">
            
            <div className="col-md-3">
              <h5 className="">
                <b>{this.props.strings.ISREPRESENTATIVE}</b>
              </h5>
            </div>
            <div className="col-md-3">
            <DropdownFactory
                      disabled={isDisableWhenView}
                      //onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                      onChange={this.onChange.bind(this)}
                      ID="drdISREPRESENTATIVE"
                      value="ISREPRESENTATIVE"
                      CDTYPE="SY"
                      CDNAME="YESNO"
                      CDVAL={this.state.generalInformation.ISREPRESENTATIVE}
                    />
            </div>
            
          </div> */}
          <div>
          <div className="col-md-12 row">
            
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.LRNAME}</b>
              </h5>
            </div>
            <div className="col-md-3 ">
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
              <h5 className="">
                <b>{this.props.strings.LRSEX}</b>
              </h5>
            </div>
            <div className="col-md-3">
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
          </div>
          <div className="col-md-12 row">
            
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.LRDOB}</b>
              </h5>
            </div>
            <div className="col-md-3 ">
            <DateInput
                disabled={isDisableWhenView}
                valid={this.validBirthdate}
                id="txtLRDOB"
                onChange={this.onChange.bind(this)}
                value={this.state.generalInformation.LRDOB}
                type="LRDOB"
              />
            </div>
            <div className="col-md-3">
              <h5 className="">
                <b>{this.props.strings.LRCOUNTRY}</b>
              </h5>
            </div>
            <div className="col-md-3">
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
          <div className="col-md-12 row">
            
            <div className="col-md-3">
              <h5 className="">
                <b>{this.props.strings.LRPOSITION}</b>
              </h5>
            </div>
            <div className="col-md-3 ">
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
            <div className="col-md-3">
              <h5 className="">
                <b>{this.props.strings.LRDECISIONNO}</b>
              </h5>
            </div>
            <div className="col-md-3">
            <input
                
                disabled={isDisableWhenView}
                value={this.state.generalInformation.LRDECISIONNO}
                onChange={this.onChange.bind(this, "LRDECISIONNO")}
                id="txtLRDECISIONNO"
                className="form-control"
                type="text"
                placeholder={this.props.strings.LRDECISIONNO}
              />
            </div>
          </div>
          <div className="col-md-12 row">
            
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.LRID}</b>
              </h5>
            </div>
            <div className="col-md-3 ">
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


            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.LRIDDATE}</b>
              </h5>
            </div>
            <div className="col-md-3">
            <DateInput
                disabled={isDisableWhenView}
                id="txtLRIDDATE"
                onChange={this.onChange.bind(this)}
                value={this.state.generalInformation.LRIDDATE}
                type="LRIDDATE"
              />
            </div>
          </div>
          <div className="col-md-12 row">
          <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.LRIDPLACE}</b>
              </h5>
            </div>
            <div className="col-md-3 ">
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
          <div className="col-md-12 row">
            <div className="col-md-3">
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
          <div className="col-md-12 row">
          <div className="col-md-3">
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
            </div>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.LRPRIPHONE}</b>
              </h5>
            </div>
            <div className="col-md-3 ">
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
            <div className="col-md-3">
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
            </div>
          </div>
          <div className="col-md-12 row">
          
            <div className="col-md-3">
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
            </div>
            
          </div>
          </div>)}
          {/* ------------------------------ĐẠI DIỆN VỐN----------------------- */}
          {this.state.generalInformation.CUSTTYPE == 'TC' && (
          <div className="col-md-12 row module">
          <div className="col-md-12">
              <h5 className="">
                <b>{this.props.strings.CAPITALAGENT}</b>
              </h5>
            </div>
          
          <div>
          <div className="col-md-12 row">
            
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.CAPITALNAME}</b>
              </h5>
            </div>
            <div className="col-md-9 ">
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
            
          </div>
          <div className="col-md-12 row">
            
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.CAPITALPOSITION}</b>
              </h5>
            </div>
            <div className="col-md-3 ">
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
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.CAPITALIDCODE}</b>
              </h5>
            </div>
            <div className="col-md-3">
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
          </div>
          <div className="col-md-12 row">
            
          <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.CAPITALIDDATE}</b>
              </h5>
            </div>
            <div className="col-md-3">
            <DateInput
                disabled={isDisableWhenView}
                id="txtCAPITALIDDATE"
                onChange={this.onChange.bind(this)}
                value={this.state.generalInformation.CAPITALIDDATE}
                type="CAPITALIDDATE"
              />
            </div>


            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.CAPITALIDPLACE}</b>
              </h5>
            </div>
            <div className="col-md-3 ">
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
          </div>



          <div className="col-md-12 row">
            
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.CAPITALTEL}</b>
              </h5>
            </div>
            <div className="col-md-3 ">
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
            </div>



          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.CAPITALEMAIL}</b>
              </h5>
            </div>
            <div className="col-md-9 ">
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
          {/* ------------------------------ĐẠI DIỆN ONLINE----------------------- */}
          {this.state.generalInformation.CUSTTYPE == 'TC' && (
          <div className="col-md-12 row module">
          <div className="col-md-12">
              <h5 className="">
                <b>{this.props.strings.ONLINEAGENT}</b>
              </h5>
            </div>
          
          <div>
          <div className="col-md-12 row">
            
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
          <div className="col-md-12 row">
            
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
          



          <div className="col-md-12 row">
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
          </div>)}
{/* -----------------------------------------PEP----------------------------- */}
          <div className = "col-md-12 row module">
          <div className="col-md-12 row">
            
            <div className="col-md-3">
              <h5 className="" onMouseOver={this.handleMouseIn2.bind(this)} onMouseOut={this.handleMouseOut2.bind(this)}>
                <b>{this.props.strings.ISPEP}</b>
              </h5>
            </div>
            <div className="col-md-3">
            <DropdownFactory
                      disabled={isDisableWhenView}
                      //onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                      onChange={this.onChange.bind(this)}
                      ID="drdISPEP"
                      value="ISPEP"
                      CDTYPE="SY"
                      CDNAME="YESNO"
                      CDVAL={this.state.generalInformation.ISPEP}
                    />
            </div>
            <div className="col-md-12" style={tooltipStyle2}>
                            {renderTooltip2}
                            </div>
          </div>
          
          {this.state.generalInformation.ISPEP == 'Y' && (<div>
          <div className="col-md-12 row">
            
            <div className="col-md-3">
              <h5 className="">
                <b>{this.props.strings.FAMILYNAME1}</b>
              </h5>
            </div>
            <div className="col-md-3 fixWidthDatePickerForOthers">
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
            <div className="col-md-3">
              <h5 className="">
                <b>{this.props.strings.NAME1}</b>
              </h5>
            </div>
            <div className="col-md-3">
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
          </div>
          <div className="col-md-12 row">
            
            <div className="col-md-3">
              <h5 className="">
                <b>{this.props.strings.FAMILYNAME2}</b>
              </h5>
            </div>
            <div className="col-md-3 fixWidthDatePickerForOthers">
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
            <div className="col-md-3">
              <h5 className="">
                <b>{this.props.strings.NAME2}</b>
              </h5>
            </div>
            <div className="col-md-3">
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
          {/* -------------------------------------------------------------------------- */}
          <div className="col-md-12 row module">
            {isVIEW && (
              <div className="col-md-12 row">
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
            {ISCN ? <div className="col-md-12 row">
          
          <div className="col-md-3 " >
            <h5 className="highlight" onMouseOver={this.handleMouseIn3.bind(this)} onMouseOut={this.handleMouseOut3.bind(this)}>
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
                            <div  style={tooltipStyle3}>
                            {renderTooltip}
                            </div>
                            </div>
        </div> :
        <div className="col-md-12 row" >
          <div className="col-md-3 ">
            <h5 className="highlight" onMouseOver={this.handleMouseIn3.bind(this)} onMouseOut={this.handleMouseOut3.bind(this)}>
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
                            <div  style={tooltipStyle3}>
                            {renderTooltip}
                            </div>
                            </div>
        </div>}
        
        <div className="col-md-12 row">
            <div className="col-md-12 row">
              {this.props.language == "vie" && (
                <textarea
                  readOnly="readOnly"
                  rows={5}
                  value="
                  Nhà đầu tư đề nghị và Công ty Cổ phần Quản lý Quỹ đầu tư MB (“MB CAPITAL”) chấp thuận mở tài khoản giao dịch chứng chỉ quỹ mở và cung cấp Dịch Vụ Giao Dịch Trực Tuyến với các cam kết và điều khoản, điều kiện như sau:&#13;&#10;

                  I. CAM KẾT CỦA NHÀ ĐẦU TƯ KHI MỞ TÀI KHOẢN GIAO DỊCH CHỨNG CHỈ QUỸ&#13;&#10;
                  1. Đã tìm hiểu rõ Bản cáo bạch và Điều lệ quỹ/ các quỹ đầu tư do MB CAPITAL mà Nhà đầu tư dự kiến đầu tư, cũng như các rủi ro của việc đầu tư vào Quỹ.&#13;&#10;
                  2. Hiểu rằng đây là sản phẩm đầu tư, có thể có những rủi ro tiềm tàng khi đầu tư vào Quỹ. Giá trị tài sản ròng/đơn vị quỹ có thể tăng hoặc giảm và lợi nhuận kỳ vọng cũng như các kết quả đạt được trong quá khứ của Quỹ không đảm bảo cho kết quả đạt được trong tương lai. Nhà đầu tư hoàn toàn chịu trách nhiệm liên quan đến việc đầu tư vào chứng chỉ quỹ.&#13;&#10;
                  3. Mọi thông tin cá nhân cung cấp cho Đại lý phân phối hoặc MB CAPITAL là chính xác và sẽ thông báo bằng văn bản cho Đại lý phân phối hoặc MB CAPITAL mọi thay đổi và cập nhật (nếu có).&#13;&#10;
                  4. Hiểu rằng MB CAPITAL có toàn quyền thay đổi các mẫu phiếu lệnh mà không cần thông báo trước.&#13;&#10;
                  &#13;&#10;
                  II. ĐIỀU KHOẢN VÀ ĐIỀU KIỆN CỦA DỊCH VỤ GIAO DỊCH TRỰC TUYẾN&#13;&#10;
                  ĐIỀU 1.	GIẢI THÍCH TỪ NGỮ&#13;&#10;
                    Trong phạm vi Điều khoản và điều kiện này, các từ ngữ dưới đây được hiểu như sau:&#13;&#10;
                  1.1.	MB CAPITAL: là Công ty Cổ phần Quản lý Quỹ đầu tư MB.&#13;&#10;
                  1.2.	Nhà đầu tư: là cá nhân, tổ chức đăng ký sử dụng Dịch Vụ Giao Dịch Trực Tuyến và được MB CAPITAL chấp thuận.&#13;&#10;
                  1.3.	Dịch Vụ Giao Dịch Trực Tuyến (“Dịch vụ”): là dịch vụ do MB CAPITAL cung cấp thông qua mạng internet, cho phép Nhà đầu tư thực hiện gửi các lệnh/chỉ thị giao dịch, thanh toán bao gồm nhưng không giới hạn: truy vấn thông tin số dư tài khoản, truy vấn lịch sử giao dịch, thực hiện mua bán chứng chỉ quỹ, các giao dịch, tiện ích khác được MB CAPITAL cung cấp thông qua việc truy cập vào Website MB CAPITAL.&#13;&#10;
                  1.4.	OTP (One Time Password): Mật khẩu sử dụng một lần, được sinh ra từ phương thức xác thực theo quy định của MB Capital sử dụng cho việc xác thực các lệnh/chỉ thị giao dịch/thanh toán thông qua Dịch Vụ Giao Dịch Trực Tuyến.&#13;&#10;
                  1.5.	Website MB CAPITAL: là trang thông tin điện tử tại địa chỉ: https://mbcapital.com.vn, https://online.mbcapital.com.vn hoặc các địa chỉ khác theo quy định của MB CAPITAL.&#13;&#10;
                  &#13;&#10;
                  ĐIỀU 2.	NỘI DUNG DỊCH VỤ GIAO DỊCH TRỰC TUYẾN &#13;&#10;
                  2.1.	Phương thức sử dụng Dịch Vụ Giao Dịch Trực Tuyến &#13;&#10;
                  2.1.1.	Nhà đầu tư truy cập Dịch Vụ Giao Dịch Trực Tuyến để đăng ký, sử dụng các sản phẩm, dịch vụ của MB CAPITAL, các tiện ích khác do MB CAPITAL cung cấp từng thời kỳ thông qua việc khởi tạo và gửi cho MB CAPITAL các lệnh/chỉ thị giao dịch/thanh toán, lệnh truy vấn thông tin …&#13;&#10;
                  2.1.2.	Nhà đầu tư phải tuân thủ, thực hiện đúng theo hướng dẫn sử dụng của các Dịch Vụ Giao Dịch Trực Tuyến do MB CAPITAL ban hành và đăng tải trên Website MB CAPITAL hoặc các hướng dẫn trên giao diện sử dụng của Dịch Vụ Giao Dịch Trực Tuyến . Trường hợp có sự thay đổi về hướng dẫn sử dụng dịch vụ sẽ được MB CAPITAL đăng tải tại Website MB CAPITAL.&#13;&#10;
                  2.1.3.	Việc sử dụng các sản phẩm, dịch vụ, tiện ích thông qua Dịch Vụ Giao Dịch Trực Tuyến phải tuân thủ theo các quy định nghiệp vụ, hướng dẫn, điều kiện điều khoản của MB CAPITAL đối với sản phẩm, dịch vụ, tiện ích đó.&#13;&#10;
                  2.2.	Nguyên tắc sử dụng Dịch Vụ Giao Dịch Trực Tuyến &#13;&#10;
                  2.2.1.	Nhà đầu tư chấp nhận rằng bất cứ hành động nào: đăng nhập/truy cập vào Website MB CAPITAL bằng chính tên đăng nhập với đúng mật khẩu của Nhà đầu tư hoặc hoặc sử dụng các phương thức khác theo quy định của Dịch Vụ Giao Dịch Trực Tuyến với đúng mật khẩu và/hoặc kết hợp phương pháp xác thực khác do MB CAPITAL cung cấp cho Nhà đầu tư, để thực hiện tạo và gửi các lệnh/chỉ thị giao dịch cho MB CAPITAL thì các lệnh/chỉ thị này được xem là do chính Nhà đầu tư thực hiện và Nhà đầu tư chịu trách nhiệm về tính chính xác, trung thực, hợp pháp của các lệnh/chỉ thị giao dịch này.&#13;&#10;
                  2.2.2.	Các giao dịch đã được xử lý, thực hiện thành công theo các lệnh/chỉ thị do Nhà đầu tư tạo lập và gửi cho MB CAPITAL thông qua các Dịch Vụ Giao Dịch Trực Tuyến là có giá trị và không hủy ngang, Nhà đầu tư chịu trách nhiệm đối với các giao dịch đã được xử lý, thực hiện.&#13;&#10;
                  2.2.3.	Dữ liệu, thông tin ghi nhận trên hệ thống của MB CAPITAL dưới bất kỳ hình thức nào về việc nhận và xử lý các lệnh/chỉ thị giao dịch của Nhà đầu tư cũng như nội dung các lệnh/chỉ thị này là bằng chứng có giá trị pháp lý rằng Nhà đầu tư đã sử dụng Dịch Vụ Giao Dịch Trực Tuyến và Nhà đầu tư chịu trách nhiệm về các lệnh/chỉ thị giao dịch này.&#13;&#10;
                  2.3.	Thời điểm, thời hạn sử dụng Dịch vụ&#13;&#10;
                  Nhà đầu tư được sử dụng Dịch Vụ Giao Dịch Trực Tuyến sau khi hoàn thành thủ tục đăng ký và hệ thống của MB CAPITAL kích hoạt thành công dịch vụ cho đến khi thuộc một trong các trường hợp chấm dứt sử dụng theo quy định tại Điều 11 Điều khoản và điều kiện này.&#13;&#10;
                  &#13;&#10;
                  ĐIỀU 3.	PHÍ DỊCH VỤ VÀ PHƯƠNG THỨC THU PHÍ &#13;&#10;
                  3.1.	Phí dịch vụ&#13;&#10;
                  Phí dịch vụ là các khoản phí Nhà đầu tư phải trả khi sử dụng các Dịch Vụ Giao Dịch Trực Tuyến . Biểu phí sử dụng Dịch Vụ Giao Dịch Trực Tuyến do MB CAPITAL quy định, có thể thay đổi theo từng thời kỳ phù hợp quy định của pháp luật và có giá trị hiệu lực với Nhà đầu tư.&#13;&#10;
                  3.2.	Phương thức thu phí&#13;&#10;
                  3.2.1.	MB CAPITAL tự động trích từ số tiền mua/ bán chứng chỉ quỹ của Nhà đầu tư đối với các dịch vụ có thu phí theo định kỳ hoặc theo giao dịch phát sinh căn cứ theo biểu phí có hiệu lực tại thời điểm phát sinh. &#13;&#10;
                  &#13;&#10;
                  ĐIỀU 4.	KHỞI TẠO, GỬI, NHẬN, THỰC HIỆN LỆNH/CHỈ THỊ GIAO DỊCH&#13;&#10;
                  4.1.	Khởi tạo, gửi lệnh/chỉ thị giao dịch&#13;&#10;
                  4.1.1.	Lệnh/chỉ thị giao dịch, thanh toán qua Dịch Vụ Giao Dịch Trực Tuyến được coi là hợp pháp, hợp lệ khi đáp ứng các điều kiện sau: &#13;&#10;
                  4.1.1.1.	Nhà đầu tư thực hiện theo đúng hướng dẫn của MB CAPITAL.&#13;&#10;
                  4.1.1.2.	Lệnh/chỉ thị giao dịch được tạo lập, gửi từ đúng tài khoản truy cập Dịch vụ đã được Nhà đầu tư đăng ký sử dụng với MB CAPITAL và/hoặc do MB CAPITAL cung cấp.&#13;&#10;
                  4.1.1.3.	Đối với lệnh/chỉ thị giao dịch/thanh toán phải đầy đủ nội dung theo quy định của MB CAPITAL.&#13;&#10;
                  4.1.1.4.	Được xác thực/định danh theo phương thức do MB CAPITAL quy định đối với Dịch Vụ Giao Dịch Trực Tuyến đó; &#13;&#10;
                  4.1.1.5.	Các điều kiện khác theo quy định của MB CAPITAL (nếu có).&#13;&#10;
                  MB CAPITAL được quyền từ chối thực hiện lệnh/chỉ thị giao dịch, thanh toán không hợp pháp, hợp lệ.&#13;&#10;
                  4.1.2.	Nhà đầu tư có thể khởi tạo và gửi lệnh/chỉ thị giao dịch, thanh toán qua Dịch Vụ Giao Dịch Trực Tuyến vào bất cứ thời gian nào trong ngày. &#13;&#10;
                  4.1.3.	Lệnh/chỉ thị giao dịch của Nhà đầu tư qua Dịch Vụ Giao Dịch Trực Tuyến được coi là đã gửi khi lệnh/chỉ thị giao dịch được nhập thành công vào hệ thống thông tin của MB CAPITAL và nằm ngoài sự kiểm soát của Nhà đầu tư.&#13;&#10;
                  4.2.	Nhận lệnh/chỉ thị giao dịch&#13;&#10;
                  MB CAPITAL được coi là đã nhận được lệnh/chỉ thị giao dịch của Nhà đầu tư thông qua Dịch Vụ Giao Dịch Trực Tuyến khi lệnh/chỉ thị giao dịch đã được ghi nhận vào hệ thống quản lý giao dịch điện tử của MB CAPITAL đúng cách và có thể truy cập được.&#13;&#10;
                  4.3.	Hủy lệnh/chỉ thị giao dịch&#13;&#10;
                  Trường hợp Nhà đầu tư muốn hủy lệnh/chỉ thị giao dịch đã gửi cho MB CAPITAL thông qua Dịch Vụ Giao Dịch Trực Tuyến , MB CAPITAL được xem xét (nhưng không bắt buộc) thực hiện việc hủy lệnh/chỉ thị của Nhà đầu tư nếu MB CAPITAL chưa xử lý/thực hiện giao dịch trên hệ thống theo lệnh/chỉ thị của Nhà đầu tư và việc hủy lệnh/chỉ thị giao dịch không ảnh hưởng đến lợi ích của MB CAPITAL cũng như quyền, lợi ích của bất kỳ bên thứ ba nào khác.&#13;&#10;
                  &#13;&#10;
                  ĐIỀU 5.	QUYỀN VÀ TRÁCH NHIỆM CỦA NHÀ ĐẦU TƯ&#13;&#10;
                  5.1.	Quyền của Nhà đầu tư&#13;&#10;
                  5.1.1.	Sử dụng các sản phẩm, dịch vụ, tiện ích của MB CAPITAL thông qua Dịch Vụ Giao Dịch Trực Tuyến trong phạm vi đã đăng ký với MB CAPITAL.&#13;&#10;
                  5.1.2.	Thay đổi thông tin Nhà đầu tư đã đăng ký, yêu cầu cấp lại mật khẩu,  thay đổi phương thức định danh Nhà đầu tư…&#13;&#10;
                  5.1.3.	Có quyền ngừng sử dụng Dịch Vụ Giao Dịch Trực Tuyến sau khi thông báo bằng văn bản cho trụ sở của MB CAPITAL nơi Nhà đầu tư đăng ký sử dụng dịch vụ, bao gồm cả trường hợp Nhà đầu tư không đồng ý với các nội dung sửa đổi, bổ sung của Phí dịch vụ và Điều khoản và điều kiện do MB CAPITAL ban hành.&#13;&#10;
                  5.1.4.	Có quyền kích hoạt và sử dụng các Dịch Vụ Giao Dịch Trực Tuyến gia tăng khác thông qua các phương thức đăng ký và kích hoạt do MB CAPITAL cung cấp trong từng thời kỳ.&#13;&#10;
                  5.1.5.	Gửi yêu cầu hỗ trợ, tra soát, khiếu nại trong quá trình sử dụng Dịch Vụ Giao Dịch Trực Tuyến cho MB CAPITAL thông qua các hình thức: Đến Trụ sở MB CAPITAL hoặc gọi điện thoại đến Tổng đài hỗ trợ dịch vụ Nhà đầu tư MB CAPITAL theo số 02437262808, hoặc hình thức khác theo quy đinh của MB CAPITAL.&#13;&#10;
                  5.2.	Trách nhiệm của Nhà đầu tư&#13;&#10;
                  5.2.1.	Cung cấp đầy đủ, chính xác các thông tin cần thiết khi đăng ký và/hoặc phát sinh trong quá trình sử dụng dịch vụ theo yêu cầu của MB CAPITAL.&#13;&#10;
                  5.2.2.	Tuân thủ các quy định pháp luật và quy định của MB CAPITAL liên quan đến việc đăng ký và sử dụng Dịch Vụ Giao Dịch Trực Tuyến .&#13;&#10;
                  5.2.3.	Cập nhật, theo dõi các thông tin, thông báo, quy định, hướng dẫn về sử dụng Dịch vụ của MB CAPITAL theo các phương thức như: (i) cập nhật trên Website MB CAPITAL; (ii) tài liệu hướng dẫn tại Trụ sở MB CAPITAL; (iii) thông báo, hướng dẫn của MB CAPITAL qua email, tin nhắn sms; (iv) các phương thức khác theo quy định của MB CAPITAL trong từng thời kỳ.&#13;&#10;
                  5.2.4.	Đồng ý sử dụng các thông tin, mẫu chữ ký đã đăng ký theo Điều khoản và điều kiện này để sử dụng các dịch vụ điện tử gia tăng khác do MB CAPITAL cung cấp trong từng thời kỳ.&#13;&#10;
                  5.2.5.	Quản lý, bảo mật tên truy cập Dịch Vụ Giao Dịch Trực Tuyến và mật khẩu, các thiết bị xác thực/định danh Nhà đầu tư, bảo đảm các lệnh/chỉ thị giao dịch được gửi từ đúng người có thẩm quyền của Nhà đầu tư đã đăng ký. &#13;&#10;
                  5.2.6.	Chịu trách nhiệm với các lệnh/chỉ thị giao dịch được lập bởi tên truy cập, mật khẩu và/hoặc các yếu tố xác thực/định danh của Nhà đầu tư qua Dịch Vụ Giao Dịch Trực Tuyến .&#13;&#10;
                  5.2.7.	Đồng ý sử dụng các dữ liệu liên quan đến việc sử dụng dịch vụ được xuất ra từ hệ thống của MB CAPITAL hoặc bên thứ ba phối hợp cung cấp dịch vụ để làm cơ sở giải quyết tranh chấp giữa Nhà đầu tư và các bên liên quan.&#13;&#10;
                  5.2.8.	Kiểm tra tính hợp lý, hợp lệ và chịu trách nhiệm về các thông tin của bên thụ hưởng trước khi thực hiện lệnh/chỉ thị giao dịch.&#13;&#10;
                  5.2.9.	Chịu trách nhiệm với các thiệt hại xảy ra/phát sinh do: (i) Nhà đầu tư để lộ hoặc bị người khác sử dụng tên truy cập, mật khẩu, thiết bị bảo mật, chữ ký điện tử, chứng thư điện tử vì bất cứ lý do gì; (ii) việc không hủy bỏ, chậm thực hiện, xử lý các lệnh/chỉ thị giao dịch qua Dịch Vụ Giao Dịch Trực Tuyến của Nhà đầu tư khi các lệnh/chỉ thị này đã được MB CAPITAL xử lý/thực hiện; (iii) tranh chấp (nếu có) giữa Nhà đầu tư và đơn vị thụ hưởng theo lệnh/chỉ thị giao dịch của Nhà đầu tư qua Dịch Vụ Giao Dịch Trực Tuyến .&#13;&#10;
                  5.2.10.	Thông báo, hoàn trả lại cho MB CAPITAL: (i) các khoản tiền do sai sót, nhầm lẫn được MB CAPITAL chuyển thừa/chuyển nhầm vào tài khoản của Nhà đầu tư (bao gồm cả các lỗi tác nghiệp, sự cố hệ thống MB CAPITAL); (ii) các khoản tiền Nhà đầu tư nhận được từ MB CAPITAL qua các giao dịch bị nhầm lẫn, lỗi kỹ thuật mà Nhà đầu tư không chứng minh được quyền sở hữu hợp pháp. &#13;&#10;
                  5.2.11.	Bảo đảm có đủ số dư trên tài khoản đăng ký sử dụng Dịch Vụ Giao Dịch Trực Tuyến khi thực hiện lệnh bán chứng chỉ quỹ và thanh toán các khoản phí theo quy định của MB CAPITAL.&#13;&#10;
                  5.2.12.	Thông báo kịp thời cho MB CAPITAL khi phát hiện thấy sai sót, nhầm lẫn trên tài khoản đăng ký sử dụng Dịch Vụ Giao Dịch Trực Tuyến hoặc có lệnh/chỉ thị giao dịch thanh toán bất hợp pháp trên tài khoản đăng ký sử dụng dịch vụ.&#13;&#10;
                  &#13;&#10;
                  ĐIỀU 6.	QUYỀN VÀ TRÁCH NHIỆM CỦA MB CAPITAL&#13;&#10;
                  6.1.	Quyền của MB CAPITAL&#13;&#10;
                  6.1.1.	Từ chối xử lý, thực hiện các lệnh/chỉ thị giao dịch, thanh toán không hợp lệ, hợp pháp theo quy định của MB CAPITAL, quy định pháp luật.&#13;&#10;
                  6.1.2.	Trong trường hợp cần thiết, MB CAPITAL được quyền yêu cầu Nhà đầu tư cung cấp các văn bản, tài liệu cần thiết để MB CAPITAL có đủ cơ sở thực hiện xử lý, thực hiện lệnh/chỉ thị giao dịch của Nhà đầu tư gửi cho MB CAPITAL qua Dịch Vụ Giao Dịch Trực Tuyến .&#13;&#10;
                  6.1.3.	Khóa quyền truy cập Dịch Vụ Giao Dịch Trực Tuyến nếu Nhà đầu tư đăng nhập Dịch vụ không thành công quá số lần theo quy định của MB CAPITAL từng thời kỳ.&#13;&#10;
                  6.1.4.	Cung cấp thông tin liên quan đến Nhà đầu tư, tài khoản đăng ký sử dụng Dịch Vụ Giao Dịch Trực Tuyến và các giao dịch phát sinh cho bên thứ ba trong trường các hợp: (i) được sự đồng ý của Nhà đầu tư; (ii) theo yêu cầu của cơ quan Nhà nước có thẩm quyền, theo quy định pháp luật; (iii) cung cấp cho bên thứ ba hợp tác với MB CAPITAL để cung cấp Dịch Vụ Giao Dịch Trực Tuyến hoặc để hỗ trợ tra soát, giải quyết các khiếu nại, tranh chấp (nếu có) giữa MB CAPITAL và Nhà đầu tư liên quan đến việc thực hiện Điều khoản và điều kiện này.&#13;&#10;
                  6.2.	Trách nhiệm của MB CAPITAL&#13;&#10;
                  6.2.1.	Thực hiện các lệnh/chỉ thị giao dịch được gửi qua Dịch Vụ Giao Dịch Trực Tuyến của Nhà đầu tư theo quy định tại Điều khoản và điều kiện này, thỏa thuận giữa các bên.&#13;&#10;
                  6.2.2.	Xử lý, giải quyết và trả lời các khiếu nại, tra soát giao dịch, yêu cầu hỗ trợ của Nhà đầu tư.&#13;&#10;
                  6.2.3.	Bảo mật các thông tin liên quan đến Nhà đầu tư, tài khoản, thông tin giao dịch của Nhà đầu tư theo quy định pháp luật.&#13;&#10;
                  6.2.4.	Tuân thủ các quy định tại Điều khoản và điều kiện này và quy định pháp luật.&#13;&#10;
                  &#13;&#10;
                  ĐIỀU 7.	BẢO MẬT, BẢO ĐẢM AN TOÀN SỬ DỤNG DỊCH VỤ&#13;&#10;
                  Để bảo đảm an toàn trong việc sử dụng các Dịch Vụ Giao Dịch Trực Tuyến , Nhà đầu tư có trách nhiệm:&#13;&#10;
                  7.1.	Bảo mật tên truy cập, mật khẩu Dịch Vụ Giao Dịch Trực Tuyến và điện thoại/thiết bị di động sử dụng để nhận OTP, các thiết bị bảo mật khác do MB CAPITAL cung cấp để xác thực giao dịch và thực hiện các biện pháp cần thiết ở mức độ cao nhất nhằm phòng chống việc sử dụng trái phép mật khẩu dịch vụ, thiết bị sinh OTP.&#13;&#10;
                  7.2.	Thông báo cho MB CAPITAL để khóa dịch vụ khi phát hiện hoặc nghi ngờ bị lộ mật khẩu dịch vụ hoặc có truy cập trái phép Dịch Vụ Giao Dịch Trực Tuyến hoặc thiết bị sinh OTP bị mất cắp, thất lạc và thực hiện theo hướng dẫn của MB CAPITAL để cài đặt lại thiết bị sinh OTP/Cấp lại thiết bị bảo mật khác (nếu có).&#13;&#10;
                  7.3.	Thông báo cho MB CAPITAL sau để khóa dịch vụ khi thuê bao di động bị khóa hai chiều hoặc có sự chuyển đổi chủ sở hữu/chuyển đổi sử dụng sim điện thoại hoặc bị mất sim điện thoại đăng ký dịch vụ. MB CAPITAL không chịu bất kỳ trách nhiệm nào về những thiệt hại do hậu quả của việc Nhà đầu tư không thông báo về những sự việc nói trên.&#13;&#10;
                  &#13;&#10;
                  ĐIỀU 8.	RỦI RO VÀ XỬ LÝ RỦI RO&#13;&#10;
                    Nhà đầu tư nhận thức được các rủi ro trong việc sử dụng Dịch Vụ Giao Dịch Trực Tuyến và đồng ý tự chịu trách nhiệm về các rủi ro nếu có phát sinh trong các trường hợp sau:&#13;&#10;
                  8.1.	Các trường hợp bất khả kháng theo quy định của pháp luật, bao gồm nhưng không giới hạn bởi: lũ lụt, hỏa hoạn, bãi công, đình công, thiên tai, địch họa, chiến tranh, thay đổi quy định pháp luật, quyết định của cơ quan Nhà nước có thẩm quyền…&#13;&#10;
                  8.2.	Các sự cố/sự kiện phát sinh nằm ngoài phạm vi kiểm soát, phòng ngừa và dự kiến của MB CAPITAL dẫn đến việc không thể nhận, xử lý hoặc thực hiện các giao dịch trực tuyến của Nhà đầu tư như: &#13;&#10;
                  8.2.1.	Hệ thống xử lý, hệ thống truyền tin gặp sự cố, bị thâm nhập trái phép, hoặc vì bất kỳ lí do nào khác nằm ngoài phạm vi kiểm soát của MB CAPITAL.&#13;&#10;
                  8.2.2.	Hệ thống thông tin, máy tính của MB CAPITAL gặp sự cố do bị tấn công, nhiễm virus hoặc bị ảnh hưởng của những sự cố ngoài ý muốn khác.&#13;&#10;
                  8.3.	Các sự cố/sự kiện phát sinh do lỗi từ phía Nhà đầu tư:&#13;&#10;
                  8.3.1.	Hệ thống máy tính của Nhà đầu tư bị hỏng, bị virus, bị tấn công dẫn đến việc làm lộ hoặc bị đánh cắp các thông tin Nhà đầu tư (Thông tin tài khoản truy cập, mật khẩu, thông tin khác …) hoặc tài khoản truy cập Dịch Vụ Giao Dịch Trực Tuyến của Nhà đầu tư bị sử dụng một cách trái phép bởi một bên thứ ba.&#13;&#10;
                  8.3.2.	Số điện thoại/sim điện thoại/máy điện thoại của Nhà đầu tư bị sử dụng một cách trái phép bởi bên thứ ba; Mật khẩu giao dịch/Mã giao dịch/Thông tin của Nhà đầu tư bị bên thứ ba sử dụng dẫn đến thiệt hại cho Nhà đầu tư.&#13;&#10;
                  8.4.	Các sự cố phát sinh từ bên thứ ba cung ứng dịch vụ hạ tầng (điện, đường truyền Internet, trung gian thanh toán, các dịch vụ khác):&#13;&#10;
                  8.4.1.	Các sự cố do mất nguồn điện, sự cố do truyền thông.&#13;&#10;
                  8.4.2.	Những sự cố liên quan đến đường truyền Internet do nhà cung cấp dịch vụ gây ra như: đứt đường truyền, dung lượng đường truyền bị hạn chế hoặc những sự cố tương tự có thể ảnh hưởng đến việc thực hiện các giao dịch trực tuyến của Nhà đầu tư.&#13;&#10;
                  8.4.3.	Hệ thống của bên thứ ba có liên quan đến việc xử lý, thực hiện các lệnh/chỉ thị thanh toán của Nhà đầu tư bị xảy ra sự cố.&#13;&#10;
                  &#13;&#10;
                  ĐIỀU 9.	CUNG CẤP DỊCH VỤ GIAO DỊCH TRỰC TUYẾN &#13;&#10;
                  9.1.	MB CAPITAL có quyền khóa/chấm dứt/tạm dừng cung cấp các Dịch Vụ Giao Dịch Trực Tuyến trong trường hợp sau: &#13;&#10;
                  9.1.1.	Nhà đầu tư không tuân thủ các Điều khoản và điều kiện này, quy định của MB CAPITAL và/hoặc của pháp luật về việc sử dụng Dịch Vụ Giao Dịch Trực Tuyến.&#13;&#10;
                  9.1.2.	Theo quyết định, yêu cầu của Cơ quan Nhà nước có thẩm quyền hoặc quy định pháp luật. &#13;&#10;
                  9.1.3.	Các trường hợp liên quan đến giả mạo, rủi ro hoặc có gian lận hoặc khi lợi ích của MB CAPITAL/Nhà đầu tư/bên thứ ba có thể bị vi phạm.&#13;&#10;
                  9.1.4.	Giao dịch có liên quan đến yếu tố tội phạm, rửa tiền, vi phạm pháp luật hoặc để thực hiện quy định về phòng chống rửa tiền theo quy định của MB CAPITAL và pháp luật.&#13;&#10;
                  9.1.5.	Khi có các sự cố do nguyên nhân bất khả kháng, vượt quá phạm vi kiểm soát của MB CAPITAL.&#13;&#10;
                  9.1.6.	MB CAPITAL tạm dừng Dịch Vụ Giao Dịch Trực Tuyến để bảo trì, bảo dưỡng hệ thống và thông báo cho Nhà đầu tư.&#13;&#10;
                  9.2.	Nhà đầu tư có quyền yêu cầu khóa/chấm dứt sử dụng Dịch Vụ Giao Dịch Trực Tuyến bằng cách gửi văn bản thông báo cho MB CAPITAL theo quy định tại Điều khoản và điều kiện này hoặc hình thức khác theo quy định của MB CAPITAL từng thời kỳ.&#13;&#10;
                  &#13;&#10;
                  ĐIỀU 10.	CUNG CẤP, TRAO ĐỔI THÔNG TIN&#13;&#10;
                  10.1.	Nhà đầu tư có trách nhiệm cung cấp chính xác cho MB CAPITAL các thông tin liên quan đến địa chỉ, thông tin liên lạc, số giấy tờ tùy thân, mẫu chữ ký … Trong trường hợp thay đổi các thông tin này (bao gồm cả trường hợp Nhà đầu tư sử dụng các dịch vụ khác tại MB CAPITAL) Nhà đầu tư có trách nhiệm thông báo cho MB CAPITAL. MB CAPITAL không chịu bất kỳ trách nhiệm nào về những thiệt hại do hậu quả của việc Nhà đầu tư không cung cấp thông tin chính xác và/hoặc không thông báo cho MB CAPITAL về sự thay đổi các thông tin nói trên.&#13;&#10;
                  10.2.	Trong trường hợp Nhà đầu tư thay đổi số điện thoại đã đăng ký Dịch Vụ Giao Dịch Trực Tuyến nhưng không thông báo bằng văn bản cho MB CAPITAL và MB CAPITAL chứng minh được đã gửi tin nhắn thông báo phát sinh giao dịch/thực hiện giao dịch cho số điện thoại đã đăng ký, Nhà đầu tư hoàn toàn chịu trách nhiệm thanh toán các khoản phát sinh của những giao dịch này.&#13;&#10;
                  10.3.	Bất kỳ yêu cầu nào của Nhà đầu tư cho MB CAPITAL liên quan đến Dịch Vụ Giao Dịch Trực Tuyến phải được thực hiện bằng văn bản hoặc phương thức khác do hai bên thỏa thuận.&#13;&#10;
                  10.4.	Mọi thông báo, trao đổi thông tin của MB CAPITAL gửi cho Nhà đầu tư theo địa chỉ đã đăng ký với MB CAPITAL bằng một trong các phương thức: Fax, thư điện tử, tin nhắn, gửi qua bưu điện/chuyển phát, gửi trực tiếp, thông báo tại trụ sở của MB CAPITAL hoặc thông báo tại Website MB CAPITAL.&#13;&#10;
                  10.5.	Tài liệu, thông báo, trao đổi thông tin do MB CAPITAL lập và gửi tới Nhà đầu tư được coi là đã nhận được khi:&#13;&#10;
                  10.5.1.	Vào thời điểm nhận nếu chuyển trực tiếp và có giấy biên nhận.&#13;&#10;
                  10.5.2.	Vào ngày làm việc liền ngay sau ngày văn bản được gửi bằng bưu điện/chuyển phát tới địa chỉ Nhà đầu tư đã đăng ký.&#13;&#10;
                  10.5.3.	Sau khi văn bản được gửi bằng Fax tới số Fax được quy định tại Hợp đồng này và máy Fax đã thông báo gửi thành công, không có lỗi.&#13;&#10;
                  10.5.4.	Sau khi thư điện tử được gửi thành công (hệ thống thư điện tử không nhận được thông báo lỗi về việc gửi, nhận thư).&#13;&#10;
                  10.5.5.	Vào thời điểm hoàn tất việc niêm yết thông tin tại trụ sở của MB CAPITAL hoặc thời điểm MB CAPITAL hoàn tất việc đăng tải thông tin trên website của MB CAPITAL.&#13;&#10;
                  10.5.6.	Tin nhắn đã được thực hiện thành công bởi nhà cung cấp dịch vụ viễn thông.&#13;&#10;
                  &#13;&#10;
                  ĐIỀU 11.	CHẤM DỨT SỬ DỤNG DỊCH VỤ&#13;&#10;
                  11.1.	Các trường hợp chấm dứt Dịch Vụ Giao Dịch Trực Tuyến :&#13;&#10;
                  11.1.1.	Các bên thỏa thuận chấm dứt Dịch Vụ Giao Dịch Trực Tuyến .&#13;&#10;
                  11.1.2.	Nhà đầu tư yêu cầu chấm dứt sử dụng Dịch vụ bằng văn bản thông báo gửi tới MB CAPITAL trước 05 ngày làm việc và hoàn thành các nghĩa vụ với MB CAPITAL.&#13;&#10;
                  11.1.3.	MB CAPITAL chấm dứt cung cấp dịch vụ trong các trường hợp:&#13;&#10;
                  11.1.3.1.	Nhà đầu tư bị chết, mất tích, mất/hạn chế năng lực hành vi dân sự hoặc không thuộc đối tượng sử dụng Dịch Vụ Giao Dịch Trực Tuyến theo quy định tại Điều khoản và điều kiện này, quy định pháp luật.&#13;&#10;
                  11.1.3.2.	Việc cung cấp dịch vụ, theo đánh giá của MB CAPITAL hoặc theo quyết định của Cơ quan Nhà nước có thẩm quyền, dẫn đến việc MB CAPITAL vi phạm các quy định pháp luật hoặc MB CAPITAL không còn khả năng cung cấp các dịch vụ này.&#13;&#10;
                  11.1.3.3.	Các trường hợp MB CAPITAL chấm dứt cung cấp dịch vụ theo quy định tại Khoản 9.1 Điều 9 Điều khoản và điều kiện này.&#13;&#10;
                  11.1.3.4.	MB CAPITAL chấm dứt cung cấp dịch vụ và gửi thông báo tới Nhà đầu tư trước 05 ngày làm việc.&#13;&#10;
                  11.1.4.	Các trường hợp chấm dứt khác theo quy định pháp luật.&#13;&#10;
                  11.2.	Nghĩa vụ của các bên khi chấm dứt Dịch Vụ Giao Dịch Trực Tuyến :&#13;&#10;
                  11.2.1.	Hoàn tất các nghĩa vụ thanh toán (nếu có) giữa hai bên liên quan đến việc sử dụng dịch vụ.&#13;&#10;
                  11.2.2.	Giải quyết các tra soát, khiếu nại có liên quan đến việc thực hiện dịch vụ của hai bên.&#13;&#10;
                  &#13;&#10;
                  ĐIỀU 12.	ĐIỀU KHOẢN THI HÀNH&#13;&#10;
                  12.1.	Luật áp dụng và giải quyết tranh chấp&#13;&#10;
                  12.1.1.	Điều khoản và điều kiện này được điều chỉnh bởi pháp luật Việt Nam.&#13;&#10;
                  12.1.2.	Trong quá trình thực hiện nếu phát sinh tranh chấp, hai bên sẽ chủ động giải quyết trên cơ sở thương lượng, hòa giải. Trường hợp không giải quyết được, tranh chấp sẽ được đưa ra Tòa án nơi MB CAPITAL có trụ sở để giải quyết, trừ trường hợp pháp luật có quy định khác.&#13;&#10;
                  12.2.	Sửa đổi, bổ sung Điều khoản và điều kiện Dịch Vụ Giao Dịch Trực Tuyến &#13;&#10;
                  12.2.1.	Việc sửa đổi, bổ sung Điều khoản và điều kiện này được MB CAPITAL thông báo cho Nhà đầu tư thông qua một trong các hình thức: Công bố trên Website MB CAPITAL, thông báo niêm yết tại trụ sở của MB CAPITAL, email hoặc SMS theo địa chỉ đăng ký của Nhà đầu tư. &#13;&#10;
                  12.2.2.	Trường hợp Nhà đầu tư không đồng ý với các nội dung sửa đổi, bổ sung đó, Nhà đầu tư có thể ngừng sử dụng dịch vụ bằng việc gửi yêu cầu chấm dứt sử dụng dịch vụ bằng văn bản cho MB CAPITAL. &#13;&#10;
                  12.2.3.	Việc Nhà đầu tư tiếp tục sử dụng dịch vụ sau thời hạn thông báo và việc sửa đổi, bổ sung Điểu khoản và điều kiện này có hiệu lực được coi là Nhà đầu tư đã chấp nhận các nội dung sửa đổi, bổ sung đó.&#13;&#10;
                  12.3.	Các điều khoản khác&#13;&#10;
                  12.3.1.	Các phụ lục và/hoặc các văn bản, thông báo sửa đổi, bổ sung, thay thế, các thỏa thuận khác giữa các bên (nếu có) là một phần không tách rời của Điều khoản và điều kiện này.&#13;&#10;
                  12.3.2.	Các vấn đề chưa được quy định tại Điều khoản và điều kiện này sẽ được thực hiện theo quy định của pháp luật, hướng dẫn của cơ quan Nhà nước có thẩm quyền và/hoặc các cam kết/thỏa thuận có hiệu lực khác giữa các bên.&#13;&#10;
                  12.3.3.	Nhà đầu tư đã đọc, hiểu, nhất trí và cam kết thực hiện đúng các quy định tại Điều khoản và điều kiện này.&#13;&#10;
                  12.3.4.	 Điều khoản và điều kiện này có hiệu lực kể từ ngày Nhà đầu tư thực hiện đăng ký sử dụng Dịch Vụ Giao Dịch Trực Tuyến của MB CAPITAL nếu các bên không có thỏa thuận khác./.&#13;&#10;
                  &#13;&#10;            
                  
"
                  className="form-control"
                  style={{ height: "300px", width: "100%", resize: "none" }}
                />
              )}
              {this.props.language == "en" && (
                <textarea
                  readOnly="readOnly"
                  rows={5}
                  value="The Investor hereby requests and MB Capital Management Joint Stock Company(“MB CAPITAL”) agrees to provide the Online Trading Service with the following terms and conditions:&#13;&#10;
                  I. THE INVESTOR'S COMMITMENTS WHEN OPEN TRADDING ACCOUNT &#13;&#10;
                  1. I thoroughly scrutinized the Prospectus and the Fund Charter of Fund/Funds of which I register account managed by MB Capital, as all risks associated to investment in the Fund.&#13;&#10;
                  2. I understand that fund certificate is an investment product, and there may be potential risks when I invest in the Fund. The net asset value per fund unit may increase or decrease, and both the expected profit and the past results of the Fund do not guarantee the future results. I am fully responsible for my decision on investing in fund certificates&#13;&#10;
                  3. I  guarantee that all information provided here and attached documents are correct, and I shall notify MB Capital any change and update (if any).&#13;&#10;
                  4. I  understand that MB Capital preserves the right to alter these order forms without any prior notification.&#13;&#10;
                  &#13;&#10;
                  II. TERMS AND CONDITIONS OF ONLINE TRADING SERVICES&#13;&#10;
                  ARTICLE 1. DEFINITIONS &#13;&#10;
                  To the extent of this agreement, the terms below have the following meaning:&#13;&#10;
                  1.1. MB Capital: refers to MB Capital Management Joint Stock Company.&#13;&#10;
                  1.2. Investor: refers to the individual, institutional investor who registers for Online Trading Service and approved by MB Capital.&#13;&#10;
                  1.3. Online Trading Service (“Service”): refers to the service provided by MB Capital via Internet, allowing the investor to send orders/ instructions including but not limited to account balance inquiry, trading history inquiry, fund certificates subscription/ redemption, other transactions, facilities via MB Capital website.&#13;&#10;
                  1.4. OTP: refers to the one-time-password, generated from the authentication method following MB Capital regulation for authentication of transaction orders/instructions via Online Trading Service.&#13;&#10;
                  1.5. MB Capital website: is https://mbcapital.com.vn, https://online.mbcapital.com.vn, or other websites stipulated by MB Capital.&#13;&#10;
                  &#13;&#10;
                  ARTICLE 2. SCOPE OF THE AGREEMENT &#13;&#10;
                  2.1. Method of using Online Trading Service&#13;&#10;
                  2.1.1. The Investor logs in Online Trading Service to register, use products, services and other facilities provided by MB Capital from time to time through the method of creating, sending to MB Capital transaction orders/ instructions, information inquiry… &#13;&#10;
                  2.1.2. The Investor must comply and follow the instructions on how to use Online Trading Service issued by MB Capital and posted on MB Capital website or instructions on the user interface of the website. In case there is a change in the instruction, MB Capital will publish it on MB Capital Website.&#13;&#10;
                  2.1.3. The use of products, services, and facilities available through Online Trading Service must comply with MB Capital's regulations, guidelines, and conditions for such products, services, and facilities.&#13;&#10;
                  2.2. Principles when using Online Trading Service&#13;&#10;
                  2.2.1. The Investor acknowledges that if any logging actions in MB Capital website use the Investor’s user name, password and/or other authentication methods by MB Capital to create and send transaction orders/ instructions, such orders/ instructions are deemed to be performed by the Investor. The Investor shall take full responsibilities for these transaction orders/ instructions.&#13;&#10;
                  2.2.2. The transactions which have been successfully processed, executed according to the orders/instructions created by the Investor and sent to MB Capital through Online Transaction Service are valuable and irrevocable. The Investor is responsible for transactions that have been processed or executed.&#13;&#10;
                  2.2.3. Data, information recorded on MB Capital's system in any form including receiving and processing trading orders/instructions of the Investor as well as the content of these orders/instructions is legal evidence of the Investor using Online Trading Service, and he is responsible for these transaction orders/instructions.&#13;&#10;
                  2.3. Term of the service&#13;&#10;
                  The Investor can start using Online Trading Service after completing the registration procedures and MB Capital successfully activates the account until the service is terminated in one of the cases prescribed in Article 10.&#13;&#10;
                  &#13;&#10;
                  ARTICLE 3. SERVICE CHARGES AND PAYMENT MENTHOD&#13;&#10;
                  3.1. Service charges&#13;&#10;
                  Service charges are fees that the Investor using Online Trading Service shall pay. The fee schedule for Online Trading Service regulated by MB Capital will be updated by the time in compliance with the law and take effect for the Investor.&#13;&#10;
                  3.2. Payment method&#13;&#10;
                  MB Capital automatically deducts from the Investor’s redemption amount for services which have a periodical fee or for arising transactions based on the fee schedule in effect at that time. &#13;&#10;
                  &#13;&#10;
                  ARTICLE 4. CREATING, SENDING, RECEIVING, EXECUTING TRANSACTION ORDERS/ INSTRUCTIONS &#13;&#10;
                  4.1. Creating, sending transaction orders/ instructions&#13;&#10;
                  4.1.1. Transaction orders/instructions created via Online Trading Service are legal and valid if the following conditions are fulfilled:&#13;&#10;
                  4.1.1.1. The Investor strictly follows instructions issued by MB Capital.&#13;&#10;
                  4.1.1.2. Transaction orders/instructions are created, sent from the Investor’s authorized account which was registered with MB Capital and/or provided by MB Capital.&#13;&#10;
                  4.1.1.3. Transaction orders/instructions must be completed in compliance with MB Capital regulations.&#13;&#10;
                  4.1.1.4. Authenticated/ identified by the method specified by MB Capital for such Online Transaction Service;&#13;&#10;
                  4.1.1.5. Other conditions specified by MB Capital (if any).&#13;&#10;
                  MB Capital has the right to refuse to execute any illegal or invalid orders/ instructions.&#13;&#10;
                  4.1.2. The Investor can create and send transaction orders/ instruction via Online Trading Service at any time.&#13;&#10;
                  4.1.3. The Investor’s orders/instructions through Online Trading Service are deemed to be sent when the orders/instructions are successfully entered into MB Capital system and out of the Investor’s control.&#13;&#10;
                  4.2. Receiving transaction orders/ instructions&#13;&#10;
                  MB Capital is deemed to receive the Investor’s orders/instruction through Online Trading Service when the orders/instructions were recorded in MB Capital's electronic transaction management system correctly and accessibly.&#13;&#10;
                  4.3. Canceling transaction orders/ instructions&#13;&#10;
                  In case the Investor wants to cancel transaction orders/instructions sent to MB Capital through Online Trading Service, MB Capital has the right to consider (but not required) to cancel the Investor’s orders/ instructions if such orders/instructions have not been processed/executed and the cancellation does not conflict with the interest of MB Capital as well as any other third parties.&#13;&#10;
                  &#13;&#10;
                  ARTICLE 5. RIGHTS AND RESPONSIBILITIES OF THE INVESTOR&#13;&#10;
                  5.1. Rights of the Investor&#13;&#10;
                  5.1.1. Use the products, services, facilities of MB Capital via Online Trading Service within the scope of this agreement.&#13;&#10;
                  5.1.2. Change registered information, require to reissue password, change the Investor identification method.&#13;&#10;
                  5.1.3. Terminate Online Trading Service by sending a written notice to MB Capital, even when the Investor does not agree with the amendment and supplement to this Agreement by MB Capital.&#13;&#10;
                  5.1.4. Activate and use other added online trading services through any registration and activation methods provided by MB Capital at the time.&#13;&#10;
                  5.1.5. Send supporting requirement, inquiry, claim to MB Capital through the following method: hand delivery, phone call MB Capital Customer Support at 02437262808 (Ext: 17|32), or other methods specified by MB Capital.&#13;&#10;
                  5.2. Responsibilities of the Investor&#13;&#10;
                  5.2.1. Provide full and accurate information required at the registration and/or any time when required by MB Capital.&#13;&#10;
                  5.2.2. Comply with MB Capital's regulations regarding registration and usage of Online Trading Services.&#13;&#10;
                  5.2.3. Update and follow information, announcements, regulations and instructions on using Online Trading Services in the following ways: (i) announcement on MB Capital Website; (ii) instruction materials at MB Capital office; (iii) notification, instructions of MB Capital via email, SMS; (iv) other methods prescribed by MB Capital from time to time.&#13;&#10;
                  5.2.4. Agree to use the information, signature samples registered under this Agreement for other online services provided by MB Capital from time to time.&#13;&#10;
                  5.2.5. Manage and secure the username and password of the Online Trading Service and the authentication device, ensure that the orders/instructions are sent by the Investor or his attorney.&#13;&#10;
                  5.2.6. Take responsibility for trading orders/instructions sent with the valid username, password, and/or authentication method of the Investor through Online Trading Service.&#13;&#10;
                  5.2.7. Accept that the data exported from MB Capital's system or a third party regarding the Investor’s transaction will be used as a basis for dispute resolving between the Investor and related parties.&#13;&#10;
                  5.2.8. Verify the validity and responsibility of the beneficiary's information before confirming the orders/instructions.&#13;&#10;
                  5.2.9. Take responsibility for damages occurring/arising due to: (i) exploited Investor’s username, password, authentication device under any circumstance; (ii) failure to cancel the processed orders/instructions via the Investor Online Trading Service; (iii) disputes (if any) between the Investor and the beneficiary regarding the orders/instructions.&#13;&#10;
                  5.2.10. Notify and return to MB Capital: (i) The amount of money transferred by MB Capital to the Investor's account due to operational errors, system problems; (ii) The amount of money transferred by MB Capital to the Investor’s account through erroneous transactions, technical failures and the Investor can not prove to the ownership.&#13;&#10;
                  5.2.11. Verify sufficient balance on the Online Trading Service account when selling the fund certificates and paying fees according to MB Capital's regulations.&#13;&#10;
                  5.2.12. Promptly notify MB Capital if there are any errors when using the Online Transaction Service or invalid payments.&#13;&#10;
                  &#13;&#10;
                  ARTICLE 6. RIGHTS AND RESPONSIBILITIES OF MB CAPITAL &#13;&#10;
                  6.1. Rights of MB Capital&#13;&#10;
                  6.1.1. Refuse to process or execute the invalid/illegal trading order, directive, payment according to the provisions of MB Capital and the law.&#13;&#10;
                  6.1.2. Request the Investor to provide necessary documents for MB Capital to sufficiently execute the order placed on Online Trading Service.&#13;&#10;
                  6.1.3. Lock access to MB Capital Online if the Investor fails to log in over allowed times according to the provisions of MB Capital under each period.&#13;&#10;
                  6.1.4. Provide information relating to the Investor, account, transaction history to third parties in the following case: (i) Under the consent of the Investor; (ii) At the request of the competent State agency, as prescribed by law; (iii) The third parties is a partner of MB Capital in providing online trading services or to assist in the investigation, settlement of complaints and disputes (if any) between MB Capital and the Investor relating to the implementation of this agreement.&#13;&#10;
                  6.2. Responsibilities of MB Capital&#13;&#10;
                  6.2.1. Execute trading order, directive submitted through Online Trading Service as specified in this agreement.&#13;&#10;
                  6.2.2. Handle and respond to complaints and requests of the Investor.&#13;&#10;
                  6.2.3. Keep in confidence the information relating to the Investor, account, transaction history in accordance with the law.&#13;&#10;
                  6.2.4. Comply with the provisions of this agreement and the law.&#13;&#10;
                  &#13;&#10;
                  ARTICLE 7. SERVICE SECURITY&#13;&#10;
                  To ensure security when using Online Trading Service, the Investor must:&#13;&#10;
                  7.1. Keep in confidence the username, password, and telephone/mobile device used to receive OTP, other security devices provided by MB Capital to authenticate orders and cautiously prevent the unauthorized use of password and OTP device.&#13;&#10;
                  7.2. Notify MB Capital to lock access to Online Trading Service after detecting or suspecting exposed password, unauthorized access or stolen/lost OTP devices, and follow the instructions of MB Capital to reset/replace the OTP device (if any).&#13;&#10;
                  7.3. Notify MB Capital to lock access to Online Trading Service when the mobile number of the Investor is two-way locked, sold, or lost. MB Capital is not liable for any damages caused by the Investor not notifying any of the events mentioned above.&#13;&#10;
                  &#13;&#10;
                  ARTICLE 8. RISK AND RISK HANDLING &#13;&#10;
                  The Investor is aware of the risks when using Online Trading Service and agrees to be solely responsible for risks (if any) arising in the following cases:&#13;&#10;
                  8.1. Force majeure cases according to the law, including but not limited to: flood, fire, strike, strike, disaster, enemy, change of law, the decision of the competent state agency…&#13;&#10;
                  8.2. Events which arise out of the control, prevention, and expectation of MB Capital lead to the refusal of processing or executing of online transactions of the Investor such as: &#13;&#10;
                  8.2.1. The processing system, the communication system either crashes, is illegally bypassed, or due to any reasons beyond the control of MB Capital.&#13;&#10;
                  8.2.2. The computer system of MB Capital crashes due to an attack, virus infection, or other unexpected problems.&#13;&#10;
                  8.3. Events arise due to the Investor's fault:&#13;&#10;
                  8.3.1. Investor’s personal computer is exploited lead to exposure of Investor information (account information, password, other information) or access to Online Trading Service is illegally used by a third party.&#13;&#10;
                  8.3.2. Phone number/SIM card/Mobile phone of the Investor is illegally used by the third-party; The transaction OTP/information of the Investor is used by the third-party, which causes damage to the Investor.&#13;&#10;
                  8.4. Issues arising from third-party service providers (electricity, Internet, payment services or other services):&#13;&#10;
                  8.4.1. Issues caused by a power cut, media problems.&#13;&#10;
                  8.4.2. Internet line-related issues caused by service providers such as faulty transmission lines, limited transmission capacity, or similar incidents that may interfere with the Investor' online transactions.&#13;&#10;
                  8.4.3. The interbank payment system or the third-party system, which is related to the processing, executing of the Investor’s order becomes out of order.&#13;&#10;
                  &#13;&#10;
                  ARTICLE 9. INFORMATION PROVIDING&#13;&#10;
                  9.1. MB Capital assumes no responsibility for damages resulting from the failure of the Investor either to provide his information (including but not limited to: address, contact information, ID, Signature form) or to notify MB Capital of the change of any information above.&#13;&#10;
                  9.2. In case the Investor changes the registered phone number for Online Trading Service and does not send a written notice to MB, and MB Capital can prove that the OTP has been sent to the Investor’s registered phone number, the Investor is solely responsible for any liabilities arising from these transactions.&#13;&#10;
                  9.3. Any request of the Investor relating to Online Trading Service must be made in written form or otherwise agreed by the two parties.&#13;&#10;
                  9.4. All information and notification from MB Capital must be sent to the Investor’s registered address by one of the following methods: Fax, email, message, post/guaranteed delivery, hand delivery, announcement at MB Capital office or on MB Capital Website.&#13;&#10;
                  9.5. Any documents or notification from MB Capital sent to the Investor shall be deemed received:&#13;&#10;
                  9.5.1. On the date of the receipt in case of hand delivery.&#13;&#10;
                  9.5.2. On the working day immediately after the day the document is sent in case of post/guaranteed delivery.&#13;&#10;
                  9.5.3. After the document has been sent by fax to the number specified in this agreement and the fax machine has shown a successful notification without any error.&#13;&#10;
                  9.5.4. After the email has been sent successfully (the e-mail system does not show any error messages about sending or receiving mail).&#13;&#10;
                  9.5.5. At the time of completing the listing of the announcement at MB Capital's office or at the time of posting the announcement on MB Capital's website.&#13;&#10;
                  9.5.6. At the time that the message is successfully implemented by the phone service provider.&#13;&#10;
                  &#13;&#10;
                  ARTICLE 10. SERVICE TERMINATION &#13;&#10;
                  10.1. Online Trading Service can be terminated in one of the following cases:&#13;&#10;
                  10.1.1. Both parties agree to terminate the service.&#13;&#10;
                  10.1.2. The Investor requests to terminate the service by written notice sent to MB Capital at least 05 days prior and has completed all his obligations towards MB Capital.&#13;&#10;
                  10.1.3. MB Capital stops providing the service in the following cases:&#13;&#10;
                  10.1.3.1. The Investor dies, goes missing, loses the capacity for civil acts, or is no longer the subject to use Online Trading Service according to this Agreement and the law.&#13;&#10;
                  10.1.3.2. Providing the service, as assessed by MB Capital or competent State authority, causes MB Capital to violate the law or to be no longer capable of providing the service.&#13;&#10;
                  10.1.3.3. MB Capital requests to terminate the service by written notice sent to the Investor at least 05 days prior.&#13;&#10;
                  10.1.4. Other termination cases according to the law.&#13;&#10;
                  10.2. Obligations of the parties when terminating Online Trading Service:&#13;&#10;
                  10.2.1. Complete the payment obligations (if any) between the two parties regarding the use of the service.&#13;&#10;
                  10.2.2. Resolving inquiries and complaints of both parties related to the service.&#13;&#10;
                  &#13;&#10;
                  ARTICLE 11. IMPLEMENTATION PROVISION &#13;&#10;
                  11.1. Applicable law and dispute resolution &#13;&#10;
                  11.1.1. This agreement is governed in accordance with the law of the Socialist Republic of Vietnam.&#13;&#10;
                  11.1.2. All disputes arising during the performance hereof shall be settled by mutual negotiation and conciliation between the two parties. Where such negotiation and conciliation fail, the dispute will be brought to the Court where MB Capital has its headquarters for settlement, unless otherwise provided by law.&#13;&#10;
                  11.2. Amendment, supplement to the agreement.&#13;&#10;
                  11.2.1. The amendment and supplement to this Agreement are notified by MB Capital to the Investor through one of the following forms: announcement on MB Capital Website, announcement at MB Capital's office, email or SMS to Investor registered contacts.&#13;&#10;
                  11.2.2. In case the Investor does not agree with such amendment or supplement, the Investor may stop using the service by sending a written request to MB Capital.&#13;&#10;
                  11.2.3. The fact that the Investor continues to use the service after the amendment and supplementation of this agreement has been announced shall be considered as the Investor has accepted such amendment and supplement.&#13;&#10;
                  11.3. Other provisions.&#13;&#10;
                  11.3.1. Appendices and/or documents, amendments, supplements, replacements, other agreements between the parties (if any) are an integral part of this agreement.&#13;&#10;
                  11.3.2. Issues not specified in this agreement shall be implemented in accordance with the law, guidelines of competent State agencies and/or other effective agreements between the parties.&#13;&#10;
                  11.3.3. The Investor have read, understood, agreed, and committed to comply with the provisions of this agreement.&#13;&#10;
                  11.3.4. This agreement takes effect from the signing date unless otherwise agreed by the parties.&#13;&#10;
                
"
                  className="form-control"
                  style={{ height: "300px", width: "100%", resize: "none" }}
                />
              )}
            </div>
          </div>
          {/* <div style={{textAlign: 'left'}} className="col-md-12 row">
            
              <div className="col-md-3">
                <h5 className="highlight">
                  <b>{this.props.strings.commitment}</b>
                </h5>
              </div>
              <div className="col-md-3">
                <h5>
                  <input
                    id="cbIsagree"
                    style={{ margin: 0 }}
                    onChange={this.onChange.bind(this, "ISAGREE")}
                    type="checkbox"
                  />
                </h5>
              </div>
              <div className="col-md-3 ">
              <h5 className="highlight">
                <b>{this.props.strings.useonline}</b>
              </h5>
            </div>
            <div className="col-md-3">
              <h5>
                <input
                  style={{ margin: 0 }}
                  checked={this.state.ISONLINE}
                  id="cbISONL"
                  onChange={this.onChange.bind(this, "ISONLINE")}
                  type="checkbox"
                />
              </h5>
            </div>
          </div> */}
          <div style={{textAlign: 'left'}} className="col-md-12 row">
            <div className="col-md-12 ">
              <b className="cb-fix" style={{float: "left"}}>
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
            </div>

            <div style={{textAlign: 'left'}} className="col-md-12 row">
            <div className="col-md-12 ">
              <b className="cb-fix" style={{float: "left"}}>
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
            </div>

            <div style={{textAlign: 'left'}} className="col-md-12 row">
            <div className="col-md-12 ">
              <b className="cb-fix" style={{float: "left"}}>
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


            {/* <div style={{textAlign: 'left'}} className="col-md-12 row">
              <div className="col-md-12 ">
              <b className="cb-fix" style={{float: "left"}}>
                <input
                  style={{ margin: 0 }}
                  checked={this.state.generalInformation.ISAGREESHARE}
                  id="cbISAGREESHARE"
                  onChange={this.onChange.bind(this, "ISAGREESHARE")}
                  type="checkbox"
                />
              </b>
              <h5 className="h5-display">
                <b className="highlight">{this.props.strings.ISAGREESHARE}</b>
              </h5>
            </div>
            </div>
            <div style={{textAlign: 'left'}} className="col-md-12 row">
              <div className="col-md-12 ">
              <b className="cb-fix" style={{float: "left"}}>
                <input
                  
                  
                  id="cbIsagree"
                    style={{ margin: 0 }}
                    onChange={this.onChange.bind(this, "ISAGREE")}
                    type="checkbox"
                />
              </b>
              <h5 className="h5-display">
                <b className="highlight">{this.props.strings.commitment}</b>
              </h5>
            </div>
            </div> */}
            {/* <div style={{textAlign: 'left'}} className="col-md-12 row">
              <div className="col-md-12">
                <div style={{float: "right", marginRight:"15px!important"}}>
                <b className="cb-fix" style={{float: "left"}}>
                  <input
                    id="cbIsagree"
                    style={{ margin: 0 }}
                    onChange={this.onChange.bind(this, "ISAGREE")}
                    type="checkbox"
                  />{" "}
                </b>
                <h5>
                  
                  <b className="highlight" title={this.props.strings.desc}>{this.props.strings.commitment}</b>
                </h5>
                </div>
              </div>
              </div> */}
          </div>
          
          {/* <div className="col-md-12 row">
            
              <div className="col-md-3">
                <h5 className="highlight">
                  <b>{this.props.strings.signscan}</b>
                </h5>
              </div>
           
            <div className="col-md-3">
            <div className="previewComponent">
                <FileInput
                  className="btn btn-primary"
                  id="btnSignImg"
                  onChange={this._handleSIGNIMGChange}
                />

                <div className="imgPreview">{$SIGNIMGPreview}</div>
              </div>
            </div>
          </div>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.idscanfront}</b>
              </h5>
            </div>
            <div className="col-md-3">
            <div className="previewComponent">
                <FileInput
                  className="btn btn-primary"
                  id="btnOwnLicenseImg"
                  onChange={this._handleOWNLICENSEIMGChange}
                />

                <div className="imgPreview">{$OWNLICENSEIMGPreview}</div>
              </div>
            </div>
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.idscanback}</b>
              </h5>
            </div>
            <div className="col-md-3">
            <div className="previewComponent">
                <FileInput
                  className="btn btn-primary"
                  id="btnOwnLicense2Img"
                  onChange={this._handleOWNLICENSE2IMGChange}
                />

                <div className="imgPreview">{$OWNLICENSE2IMGPreview}</div>
              </div>
            </div>
          </div>
          {this.state.generalInformation["COUNTRY"] !== COUNTRY_234 && (
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5 className="highlight">
                  <b>{this.props.strings.tradingcodescan}</b>
                </h5>
              </div>
              <div className="col-md-3">
              <div className="previewComponent">
                  <FileInput
                    className="btn btn-primary"
                    id="btnOwnLicense3Img"
                    onChange={this._handleOWNLICENSE3IMGChange}
                  />

                  <div className="imgPreview">{$OWNLICENSE3IMGPreview}</div>
                </div>
              </div>
              <div className="col-md-3">
                <h5 className="highlight">
                  <b>{this.props.strings.tknhscan}</b>
                </h5>
              </div>
              <div className="col-md-3">
              <div className="previewComponent">
                  <FileInput
                    className="btn btn-primary"
                    id="btnOwnLicense4Img"
                    onChange={this._handleOWNLICENSE4IMGChange}
                  />

                  <div className="imgPreview">{$OWNLICENSE4IMGPreview}</div>
                </div>
              </div>
            </div>
          )} */}
          
          {/* <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight">
                <b>{this.props.strings.receiverptype}</b>
              </h5>
            </div>
            <div className="col-md-3">
              <h5>
                <input
                  style={{ margin: 0 }}
                  id="cbIsemail"
                  onChange={this.onChange.bind(this, "RCV_EMAIL")}
                  type="checkbox"
                />{" "}
                {this.props.strings.email}
              </h5>
            </div>
            <div className="col-md-3">
              <h5>
                <input
                  style={{ margin: 0 }}
                  id="cbIssms"
                  onChange={this.onChange.bind(this, "RCV_SMS")}
                  type="checkbox"
                />{" "}
                {this.props.strings.sms}
              </h5>
            </div>
            <div className="col-md-3">
              <h5>
                <input
                  style={{ margin: 0 }}
                  id="cbIsmanual"
                  onChange={this.onChange.bind(this, "RCV_MAIL")}
                  type="checkbox"
                />{" "}
                {this.props.strings.letter}
              </h5>
            </div>
          </div> */}
          
        </div>
        <div className="col-md-12 row">
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
              style={{ marginLeft: 10, display: ISONLINE ==  'Y' ? "" : "none" }}
            >
              {this.props.strings.createxportonlineExport}
            </button>
            {/* <button
              onClick={this.export.bind(this, "editExport")}
              disabled={this.state.disablebuttoneditExport}
              id="btnSubmitExport1"
              type="button"
              className="btn btn-info"
              style={{ marginLeft: 10 }}
            >
              {this.props.strings.createxporteditExport}
            </button> */}
          </div>
          {/* {!ISCUSTOMER ? */}
          <div className="pull-right" >
            <input
              id="btnSubmit"
              type="button"
              onClick={this.onSubmit.bind(this)}
              className="btn btn-primary"
              style={{ marginRight: 15 }}
              value={this.props.strings.next}
            />
          </div>
          {/* :null} */}
        </div>
      </div>
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
