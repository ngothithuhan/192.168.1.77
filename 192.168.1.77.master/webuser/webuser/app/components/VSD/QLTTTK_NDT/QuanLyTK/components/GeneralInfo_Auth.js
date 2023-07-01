import React from 'react';
import { connect } from 'react-redux';
import DropdownFactory from '../../../../../utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';
import FileInput from 'app/utils/input/FileInput';
//import NumberFormat from 'react-number-format';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { showNotifi } from 'app/action/actionNotification.js';
import moment from 'moment';
import { IMGMAXW, IMGMAXH, COUNTRY_234 } from '../../../../../Helpers';

class GeneralInfo_Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkFields: [
                { name: "CUSTNAME", id: "txtAuthFullname" },
                { name: "POSITION", id: "txtAuthPosition" },
                //{ name: "SEX", id: "drdAuthSex" },
                { name: "BIRTHDATE", id: "txtAuthBirthdate" },
                { name: "COUNTRY", id: "txtAuthCountry" },
                { name: "AUTHCERT", id: "txtAuthCert" },

                //tạm off check bank theo phân tích mới
                // { name: "BANKACC", id: "txtBANKACC" },
                // { name: "BANKNAME", id: "drdBANKNAME" },
                // { name: "BANKBRANCH", id: "txtBANKBRANCH" },


                //{ name: "ADDRESS", id: "txtAuthAddress" },
                { name: "IDCODE", id: "txtAuthIDCode" },
                { name: "IDPLACE", id: "txtAuthIDPlace" },
                { name: "IDDATE", id: "txtAuthIDDate" },
                { name: "MOBILE", id: "txtAuthMobile" },
                { name: "EMAIL", id: "txtAuthEmail" },
                //{ name: "IDSCAN", id: "btnIDSCANImg" },
                //{ name: "IDSCAN2", id: "btnidback" },
                //{ name: "COUNTRY", id: "drdAuthCountry" },
                //{ name: "EFDATE", id: "txtAuthEfdate" },
                //{ name: "EXDATE", id: "txtAuthExdate" },
                { name: "AUTH_ALL", id: "cbIsAuthAll" },
                { name: "AUTH_SEND", id: "cbIsAuthSend" },
                //{ name: "AUTH_SEND", id: "cbIsAuthAll" },

            ],
            generalInformationAuth: {

                AUTOID: "",
                CUSTID: "",
                CUSTNAME: "",
                IDCODE: "",
                IDDATE: "",
                IDPLACE: "",
                EFDATE: "",
                EXDATE: "",
                ADDRESS: "",
                POSITION: "",
                SEX: "",
                BIRTHDATE: "",
                RELATIONSHIP: "",
                REGADDRESS: "",
                COUNTRY: "",
                EMAIL: "",
                MOBILE: "",
                AUTH_ALL: false,
                AUTH_ORDER: false,
                AUTH_CASH: false,
                AUTH_INFOR: false,
                AUTH_SEND: false,
                IDSCAN: "",
                IDSCAN2: "",
                AUTHSCAN: "",
                FAX: "",
                OTHERCOUNTRY: "",
                AUTHCERT: "",
                ALTPHONE: "",
                BANKACC: "",
                BANKNAME: "",
                BANKBRANCH: "",


            }


        }
    }
    checkValid(name, id) {
        const { user } = this.props.auth;
        let ISCN = this.props.GeneralInfoMain.CUSTTYPE == 'CN' ? true : false;
        let ISCUSTOMER = user;
        let ISLOGIN = ISCUSTOMER != '' && ISCUSTOMER != undefined;

        let value = this.state.generalInformationAuth[name];
        let logic = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i).test(this.state.generalInformationAuth.EMAIL);

        let mssgerr = '';
        switch (name) {
            case "CUSTNAME":
                if (value == '')
                    mssgerr = this.props.strings.requiredCustname;
                break;
            case "POSITION":
                if (!ISCN && value == '')
                    mssgerr = this.props.strings.requiredPosition;
                break;
            // case "SEX":
            //     if (value == '')
            //         mssgerr = this.props.strings.requiredSex;
            //     break;
            case "BIRTHDATE":
                if (value == '')
                    mssgerr = this.props.strings.requiredBirthdate;
                break;
            // case "RELATIONSHIP":
            //     if (value == '')
            //         mssgerr = this.props.strings.requiredRelationship;
            //     break;
            // case "REGADDRESS":
            //     if (value == '')
            //         mssgerr = this.props.strings.requiredRegaddress;
            //     break;

            case "IDCODE":
                if (value == '')
                    mssgerr = this.props.strings.requiredIdcode;
                break;
            case "IDPLACE":
                if (value == '')
                    mssgerr = this.props.strings.requiredIdplace;
                break;
            case "IDDATE":
                if (value == '')
                    mssgerr = this.props.strings.requiredIddate;
                // if (moment(value, "DD/MM/YYYY") <= moment(this.state.generalInformation.BIRTHDATE, "DD/MM/YYYY"))
                //     mssgerr = this.props.strings.invalidIddate;
                break;
            case "COUNTRY":
                if (value == '')
                    mssgerr = this.props.strings.requiredCountry;
                break;
            // case "EFDATE":
            //     if (value == '')
            //         mssgerr = this.props.strings.requiredEffdate;
            //     break;
            // case "EXDATE":
            //     if (value == '')
            //         mssgerr = this.props.strings.requiredExdate;
            //     break;
            // case "IDSCAN":
            //     if (value == '')
            //         mssgerr = this.props.strings.requiredIdscan;
            //     break;
            // case "IDSCAN2":
            //     if (value == '')
            //         mssgerr = this.props.strings.requiredIdBack;
            //     break;
            case "AUTHCERT":
                if (!ISCN && value == '')
                    mssgerr = this.props.strings.requiredAuthCert;
                break;
            case "BANKACC":
                if (value == '')
                    mssgerr = this.props.strings.requiredBANKACC;
                break;
            case "BANKNAME":
                if (value == '')
                    mssgerr = this.props.strings.requiredBANKNAME;
                break;
            case "BANKBRANCH":
                if (value == '')
                    mssgerr = this.props.strings.requiredBANKBRANCH;
                break;
            case "MOBILE":
                if (value == '')
                    mssgerr = this.props.strings.requiredMobile;
                break;
            case "EMAIL":
                if (value == "") {
                    mssgerr = this.props.strings.invalidEmail;
                }
                else if (!logic) {
                    mssgerr = this.props.strings.wrongemail;
                }
            case "AUTH_SEND":
                if (ISCN && !value)
                    mssgerr = this.props.strings.requiredAuth;
                break;
            case "AUTH_ALL":
                if (!ISCN && (!value && !this.state.generalInformationAuth.AUTH_CASH && !this.state.generalInformationAuth.AUTH_INFOR && !this.state.generalInformationAuth.AUTH_ORDER))
                    mssgerr = this.props.strings.requiredAuth;
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
    _handleIDSCANIMGChange = (e) => {
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

                var canvas = document.createElement('canvas');
                canvas.width = tempW;
                canvas.height = tempH;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0, tempW, tempH);
                var dataURL = canvas.toDataURL("image/png");
                that.state.generalInformationAuth.IDSCAN = dataURL
                that.setState(that.state)
            }

        }
        reader.readAsDataURL(file)
    }

    _handleidback = (e) => {
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

                var canvas = document.createElement('canvas');
                canvas.width = tempW;
                canvas.height = tempH;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0, tempW, tempH);
                var dataURL = canvas.toDataURL("image/png");
                that.state.generalInformationAuth.IDSCAN2 = dataURL
                that.setState(that.state)
            }

        }
        reader.readAsDataURL(file)
    }
    _handleidcontract = (e) => {
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

                var canvas = document.createElement('canvas');
                canvas.width = tempW;
                canvas.height = tempH;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0, tempW, tempH);
                var dataURL = canvas.toDataURL("image/png");
                that.state.generalInformationAuth.AUTHSCAN = dataURL
                that.setState(that.state)
            }

        }
        reader.readAsDataURL(file)
    }
    onSubmit = () => {
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '') {

                break;
            }

        }
        if (mssgerr == '')
            this.props.onSubmit(this.state.generalInformationAuth, false)
    }
    setCheckAll(isCheck) {
        let check = '';
        if (isCheck == true || isCheck == 'Y') {
            check = true
        }
        else {
            check = false
        }
        this.state.generalInformationAuth['AUTH_CASH'] = check;
        this.state.generalInformationAuth['AUTH_INFOR'] = check;
        this.state.generalInformationAuth['AUTH_ORDER'] = check;
        //window.$('#cbIsAuthCash').prop("checked",isCheck)
        //window.$('#cbIsAuthOrder').prop("checked",isCheck)
        //window.$('#cbIsAuthInfor').prop("checked",isCheck)
    }
    onChange(type, event) {

        if (event.target) {
            if (event.target.type == "checkbox") {
                this.state.generalInformationAuth[type] = event.target.checked;
                switch (type) {
                    case 'AUTH_SEND':
                        if (event.target.checked) {
                            this.state.generalInformationAuth['AUTH_SEND'] = true;
                        }
                        else {
                            this.state.generalInformationAuth['AUTH_SEND'] = false;
                        }
                        break;
                    case 'AUTH_ALL':
                        this.setCheckAll(event.target.checked)
                        break;
                    case 'AUTH_INFOR':
                        if (this.state.generalInformationAuth['AUTH_CASH'] == true && this.state.generalInformationAuth['AUTH_ORDER'] == true && event.target.checked)
                            this.state.generalInformationAuth['AUTH_ALL'] = true;
                        else
                            this.state.generalInformationAuth['AUTH_ALL'] = false;
                        break;
                    case 'AUTH_CASH':
                        if (this.state.generalInformationAuth['AUTH_INFOR'] == true && this.state.generalInformationAuth['AUTH_ORDER'] == true && event.target.checked)
                            this.state.generalInformationAuth['AUTH_ALL'] = true;
                        else
                            this.state.generalInformationAuth['AUTH_ALL'] = false;
                        break;
                    case 'AUTH_ORDER':
                        if (this.state.generalInformationAuth['AUTH_CASH'] == true && this.state.generalInformationAuth['AUTH_INFOR'] == true && event.target.checked)
                            this.state.generalInformationAuth['AUTH_ALL'] = true;
                        else
                            this.state.generalInformationAuth['AUTH_ALL'] = false;
                        break;
                    default:
                        break;
                }
                if (type == 'AUTH_ALL')
                    this.setCheckAll(event.target.checked)
                else
                    if (this.state.generalInformationAuth['AUTH_INFOR'] && this.state.generalInformationAuth['AUTH_CASH'] && this.state.generalInformationAuth['AUTH_ORDER'])
                        this.state.generalInformationAuth['AUTH_ALL'] = true;
            }
            else
                this.state.generalInformationAuth[type] = event.target.value;
        }
        else {
            this.state.generalInformationAuth[type] = event.value;
        }
        this.setState({ generalInformationAuth: this.state.generalInformationAuth })

    }
    componentWillMount() {
        //gan lai thong tin cu
        let oldInfor = this.props.GeneralInfoAuth ?
            this.props.GeneralInfoAuth : (this.props.CfmastInfo ? this.props.CfmastInfo.DT.dataAuth : null)
        if (oldInfor) {

            if (oldInfor.AUTH_ALL == 'Y' || oldInfor.AUTH_ALL == true) {
                oldInfor.AUTH_ALL = true;
                //window.$("#cbIsAuthAll").prop("checked", true);
            } else {
                oldInfor.AUTH_ALL = false;
                //window.$("#cbIsAuthAll").prop("checked", false);
            }
            if (oldInfor.AUTH_ORDER == 'Y' || oldInfor.AUTH_ORDER == true) {
                oldInfor.AUTH_ORDER = true;
                //window.$("#cbIsAuthOrder").prop("checked", true);
            } else {
                oldInfor.AUTH_ORDER = false;
                window.$("#cbIsAuthOrder").prop("checked", false);
            }
            if (oldInfor.AUTH_CASH == 'Y' || oldInfor.AUTH_CASH == true) {
                oldInfor.AUTH_CASH = true;
                //window.$("#cbIsAuthCash").prop("checked", true);
            } else {
                oldInfor.AUTH_CASH = false;
                //window.$("#cbIsAuthCash").prop("checked", false);
            }
            if (oldInfor.AUTH_INFOR == 'Y' || oldInfor.AUTH_INFOR == true) {
                oldInfor.AUTH_INFOR = true;
                //window.$("#cbIsAuthInfor").prop("checked", true);
            } else {
                oldInfor.AUTH_INFOR = false;
                //window.$("#cbIsAuthInfor").prop("checked", false);
            }
            if (oldInfor.AUTH_SEND == 'Y' || oldInfor.AUTH_SEND == true) {
                oldInfor.AUTH_SEND = true;
                //window.$("#cbIsAuthSend").prop("checked", true);
            } else {
                oldInfor.AUTH_SEND = false;
                //window.$("#cbIsAuthSend").prop("checked", false);
            }
            this.setState({ ...this.state, generalInformationAuth: oldInfor })
        }

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.access !== "add") {

            if (nextProps.CfmastInfo) {
                let oldInfor = nextProps.CfmastInfo.DT.dataAuth;
                if (oldInfor) {
                    this.setState({ ...this.state, generalInformationAuth: oldInfor })
                }
            }
        }
    }

    componentDidMount() {
        //kiem tra neu ko uy quyen tu buoc 1 thi bo wa
        if (this.props.GeneralInfoMain && (this.props.GeneralInfoMain.ISAUTH == 'N' || this.props.GeneralInfoMain.ISAUTH == false)) {
            var isForwardStep = (this.props.currentStep - this.props.previousStep) > 0;
            if (isForwardStep) this.props.onSubmit(this.state.generalInformationAuth, true)
            else this.previousPage();
        }
        let oldInfor = this.props.GeneralInfoAuth ? this.props.GeneralInfoAuth
            : (this.props.CfmastInfo ? this.props.CfmastInfo.DT.dataAuth : null)
        if (oldInfor) {
        }
    }
    onSetDefaultValue = (type, value) => {
        if (!this.state.generalInformationAuth[type]) {
            this.state.generalInformationAuth[type] = value;
            this.setState({
                ...this.state
            })
        }

    }
    previousPage = () => {
        this.props.previousPage(this.state.generalInformationAuth);
    }
    validBirthdate(current) {
        const currentDate = moment().subtract(1, 'day');
        return current < currentDate;
    }
    render() {
        let ISCN = this.props.GeneralInfoMain.CUSTTYPE == 'CN' ? true : false;

        let { IDSCAN, IDSCAN2, AUTHSCAN } = this.state.generalInformationAuth;
        let $IDSCANIMGPreview = null;
        const { user } = this.props.auth;

        let ISCUSTOMER = user;
        let ISLOGIN = ISCUSTOMER != '' && ISCUSTOMER != undefined;
        //let ISCN = this.state.generalInformation.CUSTTYPE == "CN";
        ISCUSTOMER = user ? user.ISCUSTOMER ? user.ISCUSTOMER == "Y" ? true : false : false : false;
        if (IDSCAN) {
            $IDSCANIMGPreview = (<img style={{
                width: " 250px",
                height: "200px",
                padding: " 10px"
            }} src={IDSCAN} />);
        } else {
            $IDSCANIMGPreview = (<div className="previewText"></div>);
        }

        let $IDBACKIMGPreview = null;
        if (IDSCAN2) {
            $IDBACKIMGPreview = (<img style={{
                width: " 250px",
                height: "200px",
                padding: " 10px"
            }} src={IDSCAN2} />);
        } else {
            $IDBACKIMGPreview = (<div className="previewText"></div>);
        }
        let $IDCONTRACTIMGPreview = null;
        if (AUTHSCAN) {
            $IDCONTRACTIMGPreview = (<img style={{
                width: " 250px",
                height: "200px",
                padding: " 10px"
            }} src={AUTHSCAN} />);
        } else {
            $IDCONTRACTIMGPreview = (<div className="previewText"></div>);
        }
        return (
            <div>
                <div className={this.props.access !== "view" ? "row background-white mb-10" : "row background-white mb-10 disable"}>
                    <div className=" col-md-12 mt-10">
                        <div className="col-md-3 form-group">
                            <label>{this.props.strings.fullname} <span style={{ 'color': 'red' }}> *</span></label>
                            <input value={this.state.generalInformationAuth.CUSTNAME} id="txtAuthFullname" className="form-control" type="text" placeholder={this.props.strings.fullname} onChange={this.onChange.bind(this, "CUSTNAME")} />
                        </div>
                        <div className="col-md-3 form-group">
                            <label>{this.props.strings.sex}</label>
                            <DropdownFactory onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} ID="drdAuthSex" value="SEX" CDTYPE="CF" CDNAME="SEX" CDVAL={this.state.generalInformationAuth.SEX} />
                        </div>
                        <div className="col-md-3 form-group fixWidthDatePickerForOthersNew">
                            <label>{this.props.strings.birthdate} <span style={{ 'color': 'red' }}> *</span></label>
                            <DateInput valid={this.validBirthdate} value={this.state.generalInformationAuth.BIRTHDATE} id="txtAuthBirthdate" onChange={this.onChange.bind(this)} value={this.state.generalInformationAuth.BIRTHDATE} type="BIRTHDATE" />
                        </div>
                        <div className="col-md-3 form-group">
                            <label>{this.props.strings.nationality} <span style={{ 'color': 'red' }}> *</span></label>
                            <DropdownFactory ID="drdAuthCountry" onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} value="COUNTRY" CDTYPE="CF" CDNAME="COUNTRY" CDVAL={this.state.generalInformationAuth.COUNTRY} />
                        </div>

                    </div>

                    {/* hiển thị khi quốc gia !== việt nam */}
                    {this.state.generalInformationAuth.COUNTRY != COUNTRY_234 &&
                        <div className="col-md-12">
                            <div className="col-md-3 form-group">
                                <label>Số thị thực nhập cảnh</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="col-md-3 form-group fixWidthDatePickerForOthersNew">
                                <label>Ngày cấp</label>
                                <DateInput valid={this.validBirthdate} value={this.state.generalInformationAuth.BIRTHDATE} id="txtAuthBirthdate" onChange={this.onChange.bind(this)} value={this.state.generalInformationAuth.BIRTHDATE} type="BIRTHDATE" />
                            </div>
                            <div className="col-md-3 form-group">
                                <label>Nơi cấp</label>
                                <input type="text" className="form-control" />
                            </div>

                        </div>
                    }
                    {/* quốc tịch khác */}
                    {/* <div className="col-md-12">
                        <div className="col-md-3">
                            <h5><b>{this.props.strings.othernationality}</b></h5>
                        </div>
                        <div className="col-md-3">
                            <input value={this.state.generalInformationAuth.OTHERCOUNTRY} id="txtOtherCountry" className="form-control" type="text" placeholder={this.props.strings.othernationality} onChange={this.onChange.bind(this, "OTHERCOUNTRY")} />
                        </div>
                    </div> */}

                    <div className="col-md-12">
                        <div className="col-md-3 form-group">
                            <label>{this.props.strings.idcode} <span style={{ 'color': 'red' }}> *</span></label>
                            <input value={this.state.generalInformationAuth.IDCODE} onChange={this.onChange.bind(this, "IDCODE")} id="txtAuthIDCode" className="form-control" type="text" placeholder={this.props.strings.idcode} />
                        </div>
                        <div className="col-md-3 form-group">
                            <label>{this.props.strings.idplace} <span style={{ 'color': 'red' }}> *</span></label>
                            <input value={this.state.generalInformationAuth.IDPLACE} onChange={this.onChange.bind(this, "IDPLACE")} id="txtAuthIDPlace" className="form-control" type="text" placeholder={this.props.strings.idplace} />

                        </div>
                        <div className="col-md-3 form-group fixWidthDatePickerForOthersNew">
                            <label>{this.props.strings.iddate} <span style={{ 'color': 'red' }}> *</span></label>
                            <DateInput value={this.state.generalInformationAuth.IDDATE} id="txtAuthIDDate" onChange={this.onChange.bind(this)} value={this.state.generalInformationAuth.IDDATE} type="IDDATE" />

                        </div>
                    </div>

                    <div className="col-md-12">
                        {/* chức vụ */}
                        <div className="col-md-3 form-group">
                            <label>{this.props.strings.position}</label>
                            <input value={this.state.generalInformationAuth.POSITION} id="txtAuthPosition" className="form-control" type="text" placeholder={this.props.strings.position} onChange={this.onChange.bind(this, "POSITION")} />

                        </div>
                        {/* giấy ủy quyền */}
                        {!ISCN &&
                            <div className="col-md-3 form-group">
                                <label>{this.props.strings.authcert} <span style={{ 'color': 'red' }}> *</span></label>
                                <input value={this.state.generalInformationAuth.AUTHCERT} onChange={this.onChange.bind(this, "AUTHCERT")} id="txtAuthCert" className="form-control" type="text" placeholder={this.props.strings.authcert} />
                            </div>
                        }
                    </div>

                    <div className="col-md-12">
                        <div className="col-md-9 form-group">
                            <label>{this.props.strings.regaddress}</label>
                            <input value={this.state.generalInformationAuth.REGADDRESS} onChange={this.onChange.bind(this, "REGADDRESS")} id="txtAuthRegaddress" className="form-control" type="text" placeholder={this.props.strings.regaddress} />
                        </div>
                        <div className="col-md-3 form-group">
                            <label>Quốc gia</label>
                            <DropdownFactory ID="drdAuthCountry" onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} value="COUNTRY" CDTYPE="CF" CDNAME="COUNTRY" CDVAL={this.state.generalInformationAuth.COUNTRY} />
                        </div>
                    </div>

                    {this.state.generalInformationAuth.COUNTRY != COUNTRY_234 &&
                        <div className="col-md-12">
                            <div className="col-md-9 form-group">
                                <label>Địa chỉ đăng ký tạm trú tại Việt Nam <span style={{ 'color': 'red' }}> *</span></label>
                                <input type="text" className="form-control" />
                            </div>
                        </div>
                    }

                    <div className="col-md-12">
                        <div className="col-md-9 form-group">
                            <label>Địa chỉ hiện tại <span style={{ 'color': 'red' }}> *</span></label>
                            <input type="text" className="form-control" />
                        </div>
                        <div className="col-md-3 form-group">
                            <label>Quốc gia (địa chỉ hiện tại) <span style={{ 'color': 'red' }}> *</span></label>
                            <DropdownFactory ID="drdAuthCountry" onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} value="COUNTRY" CDTYPE="CF" CDNAME="COUNTRY" CDVAL={this.state.generalInformationAuth.COUNTRY} />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="col-md-3 form-group">
                            <label>Điện thoại liên hệ <span style={{ 'color': 'red' }}> *</span></label>
                            <input value={this.state.generalInformationAuth.MOBILE} onChange={this.onChange.bind(this, "MOBILE")} id="txtAuthMobile" className="form-control" type="text" placeholder={this.props.strings.phone} />
                        </div>

                        {/* <div className="col-md-3 form-group">
                            <label>{this.props.strings.ALTPHONE}</label>
                            <input
                                value={this.state.generalInformationAuth.ALTPHONE}
                                onChange={this.onChange.bind(this, "ALTPHONE")}
                                id="txtALTPHONE"
                                className="form-control"
                                type="text"
                                placeholder={this.props.strings.ALTPHONE}
                            />
                        </div> */}
                        <div className="col-md-3 form-group">
                            <label>{this.props.strings.email} <span style={{ 'color': 'red' }}> *</span></label>
                            <input value={this.state.generalInformationAuth.EMAIL} onChange={this.onChange.bind(this, "EMAIL")} id="txtAuthEmail" className="form-control" type="text" placeholder={this.props.strings.email} />
                        </div>
                    </div>
                    <div className="col-md-12">
                        {!ISCN ?
                            <div>
                                <div className="col-md-3 form-group">
                                    <label>{this.props.strings.Fax}</label>
                                    <input
                                        value={this.state.generalInformationAuth.FAX}
                                        onChange={this.onChange.bind(this, "FAX")}
                                        id="txtFAX"
                                        className="form-control"
                                        type="text"
                                        placeholder={this.props.strings.Fax}
                                    />
                                </div>
                            </div>
                            : null}
                    </div>

                    <div className="col-md-12">
                        <div className="col-md-12">
                            <h5 className="highlight"><b>{this.props.strings.authrange}</b></h5>
                        </div>
                        {ISCN &&
                            <div className="col-md-3">
                                <h5><input style={{ margin: 0 }} id="cbIsAuthSend" checked={this.state.generalInformationAuth.AUTH_SEND} onChange={this.onChange.bind(this, "AUTH_SEND")} type="checkbox" /> {this.props.strings.transactionorder}</h5>
                            </div>
                        }
                        {!ISCN &&
                            <div>
                                <div className="col-md-3">
                                    <h5><input style={{ margin: 0 }} id="cbIsAuthAll" checked={this.state.generalInformationAuth.AUTH_ALL} onChange={this.onChange.bind(this, "AUTH_ALL")} type="checkbox" /> {this.props.strings.all}</h5>
                                </div>
                                <div className="col-md-3">
                                    <h5><input style={{ margin: 0 }} id="cbIsAuthOrder" checked={this.state.generalInformationAuth.AUTH_ORDER} onChange={this.onChange.bind(this, "AUTH_ORDER")} type="checkbox" /> {this.props.strings.transactionorder}</h5>
                                </div>
                            </div>}
                    </div>


                    {!ISCN &&
                        <div className="col-md-12">
                            <div className="col-md-3">

                            </div>
                            <div className="col-md-3">
                                <h5><input style={{ margin: 0 }} id="cbIsAuthCash" checked={this.state.generalInformationAuth.AUTH_CASH} onChange={this.onChange.bind(this, "AUTH_CASH")} type="checkbox" /> {this.props.strings.transfer}</h5>
                            </div>
                            <div className="col-md-3">
                                <h5><input style={{ margin: 0 }} id="cbIsAuthInfor" checked={this.state.generalInformationAuth.AUTH_INFOR} onChange={this.onChange.bind(this, "AUTH_INFOR")} type="checkbox" /> {this.props.strings.adjustinformation}</h5>
                            </div>
                        </div>}

                </div>
                <div className="col-md-12">
                    <div className="btn-next-prev">
                        <input id="btnAuthPrev" type="button" onClick={this.previousPage} className="btn btn-prev" style={{ marginLeft: 0, marginRight: 5 }} value={this.props.strings.back} />
                        <input id="btnAuthSubmit" type="button" onClick={this.onSubmit} className="btn btn-next" style={{ marginRight: 15 }} value={this.props.strings.next} />
                    </div>
                </div>
            </div>
        )
    }
}
const stateToProps = state => ({

    auth: state.auth,

});


const decorators = flow([
    connect(stateToProps),
    translate('GeneralInfo_Auth')
]);

module.exports = decorators(GeneralInfo_Auth);
