import React from 'react';
import { connect } from 'react-redux';
import DropdownFactory from '../../../utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';
//import NumberFormat from 'react-number-format';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { showNotifi } from 'app/action/actionNotification.js';
import moment from 'moment';
import { COUNTRY_234, ACTIONS_ACC } from '../../../Helpers';
import './EditAccountStep2.scss'

import {
    listCommonField, listExtraFieldOtherNational,
    allField, dataBundleCreateStep2,
    dataBundleEditStep2,
} from './UtilityStep2'
import _ from 'lodash';


class EditAccountStep2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            generalInformationAuth: {
                HAS_OLD_DATA: false,

                ADDRESS: "", // địa chỉ hiện tại
                ALTPHONE: "",//Empty
                AUTHCERT: "",//E
                AUTHSCAN: "",//E
                AUTH_ALL: false,//E
                AUTH_CASH: false,//
                AUTH_INFOR: false,//E
                AUTH_ORDER: false,
                AUTH_SEND: true,//E
                AUTOID: "",//create accoutn
                BANKACC: "",//E
                BANKBRANCH: "",//E
                BANKNAME: "",//E
                BIRTHDATE: "",
                COUNTRY_NOW: '',
                CUSTID: "",//E
                FULLNAME: "",
                EFDATE: "",//E
                EMAIL: "",
                EXDATE: "",//E
                FAX: "",//E
                IDCODE_NO: "",
                IDCODE_DATE: "",
                IDCODE_ADDRESS: "",
                IDSCAN: "",//E
                IDSCAN2: "",//E
                MOBILE: "",
                OTHERCOUNTRY: "",//E
                POSITION: "",
                PERMANENT_ADDRESS: "",//địa chỉ THƯỜNG TRÚ
                RELATIONSHIP: "",//E
                SEX: "",


                NATIONALITY: COUNTRY_234,//NEW
                VISA_ID: "",//N
                VISA_DATE: "",//N
                VISA_ADDRESS: "",//N
                TEMPORARY_ADDRESS: "", //New địa chỉ đăng kí tạm trú VN
                PERMANENT_COUNTRY: "",///New Quốc gia thường trú
            }
        }
    }


    onSetDefaultInitValue = () => {
        let { action } = this.props;
        if (action == ACTIONS_ACC.EDIT || action == ACTIONS_ACC.VIEW) {
            let data = this.props.allDataEdit.dataStep2;
            let cloneGeneralInformationAuth = { ...this.state.generalInformationAuth };
            if (data) {
                for (let i = 0; i < allField.length; i++) {
                    if (data[allField[i].key]) {
                        cloneGeneralInformationAuth[allField[i].name] = data[allField[i].key]
                    }
                }
                this.setState({ generalInformationAuth: cloneGeneralInformationAuth })
            }
        }
    }

    handleOnChangeInput = (id, event, dataCustomize, isSelect) => {
        let cloneGeneralInformationAuth = { ...this.state.generalInformationAuth }
        if (event && event.target) {
            cloneGeneralInformationAuth[id] = event.target.value;
        }
        if (dataCustomize) {
            //check theo value -> date input / dropdown factory
            cloneGeneralInformationAuth[id] = dataCustomize.value;
        }

        if (isSelect) {

            cloneGeneralInformationAuth[id] = event;
        }
        this.setState({
            generalInformationAuth: cloneGeneralInformationAuth
        })
    }

    handleOnchangeCheckbox = (id, e) => {
        let cloneGeneralInformationAuth = { ...this.state.generalInformationAuth }
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        cloneGeneralInformationAuth[id] = value
        this.setState({
            generalInformationAuth: cloneGeneralInformationAuth
        })
    }

    onSetDefaultValue = (type, value) => {
        let { isCreateAccount, action } = this.props;
        let generalInformationAuthCopy = { ...this.state.generalInformationAuth };
        if (!generalInformationAuthCopy[type]) {
            generalInformationAuthCopy[type] = value;
            this.setState({
                generalInformationAuth: generalInformationAuthCopy
            })
        }
    }

    async checkValid() {
        let mssgerr = ''
        let reqField = ''
        let isCheckEmpty = false
        let userData = this.state.generalInformationAuth
        let regexEmail = (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
        let listFieldWithType = [...listCommonField];
        let allFieldOpenAccount = []
        //Create
        //lọc bỏ 'AUTOID', 'CUSTID' khi tạo tài khoản
        //console.log('this.props.action', this.props.action)
        if (this.props.action === ACTIONS_ACC.CREATE && this.props.allDataEdit.dataStep2) {
            listFieldWithType = listFieldWithType.filter((item) => {
                return item.name !== "AUTOID" && item.name !== "CUSTID"
            })
            //field not req
            listFieldWithType = listFieldWithType.filter((item) => {
                return item.name !== "SEX" &&
                    item.name !== 'PERMANENT_ADDRESS' &&
                    item.name !== 'PERMANENT_COUNTRY' &&
                    item.name !== "POSITION"
            })
            //remove address and country_now when nationality != VN 
            allFieldOpenAccount =
                this.state.generalInformationAuth.NATIONALITY === COUNTRY_234 ?
                    [...listFieldWithType] :
                    [...listFieldWithType, ...listExtraFieldOtherNational].filter((item) => {
                        return item.name !== "ADDRESS" &&
                            item.name !== 'COUNTRY_NOW'
                    })
            //console.log('ha_create', allFieldOpenAccount)
        } else {
            console.log('this.props.allDataEdit', this.props.allDataEdit)
            //EDIT
            allFieldOpenAccount =
                this.state.generalInformationAuth.NATIONALITY === COUNTRY_234 ?
                    [...listCommonField] : [...listCommonField, ...listExtraFieldOtherNational]
            //not req
            allFieldOpenAccount = allFieldOpenAccount.filter((item) => {
                return item.name !== "SEX" &&
                    item.name !== 'PERMANENT_ADDRESS' &&
                    item.name !== 'PERMANENT_COUNTRY' &&
                    item.name !== "POSITION"
            })
            allFieldOpenAccount = allFieldOpenAccount.filter((item) => {
                return item.name !== "AUTOID" && item.name !== "CUSTID"
            })
            //console.log('ha_edit', allFieldOpenAccount)
        }
        //check field empty
        if (!isCheckEmpty) {
            //console.log('userData', userData)
            let lengthField = allFieldOpenAccount.length
            for (let i = 0; i < lengthField; i++) {
                if (userData[allFieldOpenAccount[i].name] === '' || userData[allFieldOpenAccount[i].name] === undefined || userData[allFieldOpenAccount[i].name] === 'N' || userData[allFieldOpenAccount[i].name] === false) {
                    mssgerr = this.props.strings[`required${allFieldOpenAccount[i].name}`]
                    //
                    console.log('empty', allFieldOpenAccount[i].name)
                    reqField = allFieldOpenAccount[i].id
                    break
                }
            }
            isCheckEmpty = true
        }
        //check format
        if (isCheckEmpty && mssgerr === '') {
            let lengthField = allFieldOpenAccount.length
            for (let i = 0; i < lengthField; i++) {
                if (allFieldOpenAccount[i].name === "EMAIL") {
                    //console.log('format', allFieldOpenAccount[i].name)
                    mssgerr = regexEmail.test(userData[allFieldOpenAccount[i].name])
                        ? '' : this.props.strings.wrongemail
                    reqField = allFieldOpenAccount[i].id
                    if (mssgerr) {
                        break
                    }
                }
                if (allFieldOpenAccount[i].name === "IDCODE_NO") {
                    mssgerr = (/^[a-zA-Z0-9]*$/gm).test(userData[allFieldOpenAccount[i].name])
                        ? '' : this.props.strings.F_IDCODE
                    reqField = allFieldOpenAccount[i].id
                    if (mssgerr) {
                        break
                    }
                }
                if (this.state.generalInformationAuth.NATIONALITY !== COUNTRY_234 && allFieldOpenAccount[i].name === "VISA_ID") {
                    mssgerr = (/^[a-zA-Z0-9]*$/gm).test(userData[allFieldOpenAccount[i].name])
                        ? '' : this.props.strings.F_IDVISA
                    reqField = allFieldOpenAccount[i].id
                    if (mssgerr) {
                        break
                    }
                }
                if (allFieldOpenAccount[i].name === "MOBILE") {
                    mssgerr = (/^[a-zA-Z0-9]*$/gm).test(userData[allFieldOpenAccount[i].name])
                        ? '' : this.props.strings.F_Phone
                    reqField = allFieldOpenAccount[i].id
                    if (mssgerr) {
                        break
                    }
                }
            }
        }

        if (mssgerr !== '') {
            let { dispatch } = this.props;
            let datanotify = {
                type: "",
                header: "",
                content: ""
            }
            datanotify.type = "error";
            datanotify.content = mssgerr;
            if (reqField) {
                window.$(`#${reqField}`).focus();
            }
            dispatch(showNotifi(datanotify));
        }
        return mssgerr
    }

    componentWillMount() {
        //Ủy quyền bằng "Y" thì hiện bước 2 ko thì next
        let { allDataEdit, setStep } = this.props;
        if (allDataEdit && allDataEdit.dataStep1) {
            //console.log('ha_IS_AUTHORIZED', allDataEdit.dataStep1.IS_AUTHORIZED)
            if (allDataEdit.dataStep1 &&
                (allDataEdit.dataStep1.IS_AUTHORIZED === "Y"
                    || allDataEdit.dataStep1.ISAUTH === "Y")) {
                let dataStep2 = allDataEdit.dataStep2;
                if (dataStep2 && dataStep2.HAS_OLD_DATA === true) {
                    this.setState({
                        generalInformationAuth: dataStep2
                    })
                } else {
                    this.onSetDefaultInitValue()
                }
            } else {
                this.props.setParentStateFromChild('dataStep2', allDataEdit.dataStep2)
                setStep(3)
            }
        }
    }

    onSubmitStep2 = async () => {
        let { dispatch, action } = this.props;
        if (action === ACTIONS_ACC.VIEW) {
            this.props.setStep(3)
        } else {
            var datanotify = {
                type: "",
                header: "",
                content: ""
            }
            let mssgerr = await this.checkValid();
            if (mssgerr == '') {
                let { generalInformationAuth } = this.state;
                let resultPreCheckStep2 = '';
                resultPreCheckStep2 = action === ACTIONS_ACC.CREATE ?
                    await dataBundleCreateStep2(generalInformationAuth)
                    : await dataBundleEditStep2(this.state.generalInformationAuth)

                if (resultPreCheckStep2 && resultPreCheckStep2.status == "pass") {
                    let generalInformationAuthCopy = { ...this.state.generalInformationAuth };
                    generalInformationAuthCopy.HAS_OLD_DATA = true;
                    await this.setState({
                        generalInformationAuth: generalInformationAuthCopy
                    })
                    this.props.setParentStateFromChild('dataStep2', generalInformationAuthCopy)
                    this.props.setStep(3)

                } else {
                    datanotify.type = "error";
                    datanotify.content = resultPreCheckStep2.error;
                    if (resultPreCheckStep2.errorField) {
                        window.$(`#${resultPreCheckStep2.errorField}`).focus();
                    }
                    dispatch(showNotifi(datanotify));
                }
            }
        }

        // console.log('ha_check_state_step2', this.state.generalInformationAuth)
        // console.log('ha_allState_in_step2', this.props.allDataEdit)
    }

    validBirthdate(current) {
        const currentDate = moment().subtract(1, 'day');
        return current < currentDate;
    }
    render() {
        let { action } = this.props
        let isDisableWhenView = action === ACTIONS_ACC.VIEW
        let isCheckedCheckBox = this.state.generalInformationAuth.AUTH_ORDER === 'Y' ? true : false || this.state.generalInformationAuth.AUTH_ORDER === true
        return (
            <React.Fragment>
                <div className="edit-account-step-2">
                    <div className="row">
                        <div className=" col-md-12 mt-10">
                            <div className="col-md-3 form-group">
                                <label>{this.props.strings.fullname} <span style={{ 'color': 'red' }}> *</span></label>
                                <input value={this.state.generalInformationAuth.FULLNAME}
                                    id="txtAuthFullname"
                                    className="form-control"
                                    type="text"
                                    disabled={isDisableWhenView}
                                    placeholder={this.props.strings.fullname}
                                    onChange={(e) => this.handleOnChangeInput("FULLNAME", e)} />
                            </div>
                            <div className="col-md-3 form-group">
                                <label>{this.props.strings.sex}</label>
                                <DropdownFactory
                                    disabled={isDisableWhenView}
                                    onSetDefaultValue={this.onSetDefaultValue}
                                    value={this.state.generalInformationAuth.SEX}
                                    onChange={(type, value) => this.handleOnChangeInput('SEX', type, value)}
                                    ID="drdAuthSex" value="SEX" CDTYPE="CF" CDNAME="SEX"
                                    CDVAL={this.state.generalInformationAuth.SEX} />
                            </div>
                            <div className="col-md-3 form-group fixWidthDatePickerForOthersNew">
                                <label>{this.props.strings.birthdate} <span style={{ 'color': 'red' }}> *</span></label>
                                <DateInput valid={this.validBirthdate}
                                    disabled={isDisableWhenView}
                                    value={this.state.generalInformationAuth.BIRTHDATE}
                                    id="BIRTHDATE"
                                    onChange={(type, value) => this.handleOnChangeInput('BIRTHDATE', type, value)}
                                    value={this.state.generalInformationAuth.BIRTHDATE}
                                    type="BIRTHDATE" />
                            </div>
                            <div className="col-md-3 form-group">
                                <label>{this.props.strings.nationality} <span style={{ 'color': 'red' }}> *</span></label>
                                <DropdownFactory
                                    disabled={isDisableWhenView}
                                    onSetDefaultValue={this.onSetDefaultValue}
                                    ID="drdNationality"
                                    value={this.state.generalInformationAuth.NATIONALITY}
                                    onChange={(type, value) => this.handleOnChangeInput('NATIONALITY', type, value)}
                                    value="NATIONALITY" CDTYPE="CF" CDNAME="COUNTRY"
                                    CDVAL={this.state.generalInformationAuth.NATIONALITY} />
                            </div>

                        </div>

                        {this.state.generalInformationAuth.NATIONALITY !== COUNTRY_234 &&
                            <div className="col-md-12">
                                <div className="col-md-3 form-group">
                                    <label>{this.props.strings.visaID} <span style={{ 'color': 'red' }}> *</span></label>
                                    <input value={this.state.generalInformationAuth.VISA_ID}
                                        id="txtVisaCode"
                                        disabled={isDisableWhenView}
                                        className="form-control"
                                        type="text"
                                        placeholder="Visa"
                                        onChange={(e) => this.handleOnChangeInput("VISA_ID", e)} />
                                </div>
                                <div className="col-md-3 form-group fixWidthDatePickerForOthersNew">
                                    <label>{this.props.strings.visaDate} <span style={{ 'color': 'red' }}> *</span></label>
                                    <DateInput valid={this.validBirthdate}
                                        id="txtVisaDate"
                                        disabled={isDisableWhenView}
                                        onChange={(type, value) => this.handleOnChangeInput('VISA_DATE', type, value)}
                                        value={this.state.generalInformationAuth.VISA_DATE}
                                        type="VISA_DATE" />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label>{this.props.strings.visaAddress} <span style={{ 'color': 'red' }}> *</span></label>
                                    <input value={this.state.generalInformationAuth.VISA_ADDRESS}
                                        id="txtVisaAddress"
                                        disabled={isDisableWhenView}
                                        className="form-control"
                                        type="text"
                                        placeholder="Visa"
                                        onChange={(e) => this.handleOnChangeInput("VISA_ADDRESS", e)} />
                                </div>

                            </div>
                        }
                        <div className="col-md-12">
                            <div className="col-md-3 form-group">
                                <label>{this.props.strings.idcode} <span style={{ 'color': 'red' }}> *</span></label>
                                <input value={this.state.generalInformationAuth.IDCODE_NO}
                                    onChange={(e) => this.handleOnChangeInput("IDCODE_NO", e)}
                                    id="txtAuthIDCode"
                                    disabled={isDisableWhenView}
                                    className="form-control"
                                    type="text"
                                    placeholder={this.props.strings.idcode} />
                            </div>
                            <div className="col-md-3 form-group">
                                <label>{this.props.strings.idplace} <span style={{ 'color': 'red' }}> *</span></label>
                                <input value={this.state.generalInformationAuth.IDCODE_ADDRESS}
                                    onChange={(e) => this.handleOnChangeInput("IDCODE_ADDRESS", e)}
                                    id="txtAuthIDPlace"
                                    className="form-control"
                                    disabled={isDisableWhenView}
                                    type="text"
                                    placeholder={this.props.strings.idplace} />

                            </div>
                            <div className="col-md-3 form-group fixWidthDatePickerForOthersNew">
                                <label>{this.props.strings.iddate} <span style={{ 'color': 'red' }}> *</span></label>
                                <DateInput value={this.state.generalInformationAuth.IDCODE_DATE}
                                    id="IDDATE"
                                    disabled={isDisableWhenView}
                                    onChange={(type, value) => this.handleOnChangeInput('IDCODE_DATE', type, value)}
                                    value={this.state.generalInformationAuth.IDCODE_DATE}
                                    type="IDCODE_DATE" />
                            </div>

                            <div className="col-md-3 form-group">
                                <label>{this.props.strings.position}</label>
                                <input value={this.state.generalInformationAuth.POSITION}
                                    id="txtAuthPosition"
                                    disabled={isDisableWhenView}
                                    className="form-control"
                                    type="text"
                                    placeholder={this.props.strings.position}
                                    onChange={(e) => this.handleOnChangeInput("POSITION", e)} />

                            </div>
                        </div>
                        {this.state.generalInformationAuth.NATIONALITY == COUNTRY_234 &&
                            <div className="col-md-12">
                                <div className="col-md-9 form-group">
                                    <label>{this.props.strings.addressNow} <span style={{ 'color': 'red' }}> *</span></label>
                                    <input value={this.state.generalInformationAuth.ADDRESS}
                                        id="txtAddress"
                                        disabled={isDisableWhenView}
                                        className="form-control"
                                        type="text"
                                        placeholder={this.props.strings.addressNow}
                                        onChange={(e) => this.handleOnChangeInput("ADDRESS", e)} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label>{this.props.strings.countryNow} <span style={{ 'color': 'red' }}> *</span></label>
                                    <DropdownFactory ID="drdAuthCountryNow"
                                        disabled={isDisableWhenView}
                                        onSetDefaultValue={this.onSetDefaultValue}
                                        value={this.state.generalInformationAuth.COUNTRY_NOW}
                                        onChange={(type, value) => this.handleOnChangeInput('COUNTRY_NOW', type, value)}
                                        value="COUNTRY_NOW" CDTYPE="CF" CDNAME="COUNTRY"
                                        CDVAL={this.state.generalInformationAuth.COUNTRY_NOW} />
                                </div>
                            </div>
                        }

                        {/* {this.state.generalInformationAuth.COUNTRY_NOW !== COUNTRY_234 && */}
                        {this.state.generalInformationAuth.NATIONALITY !== COUNTRY_234 &&
                            <div className="col-md-12">
                                <div className="col-md-9 form-group">
                                    <label>{this.props.strings.temporaryAddress}<span style={{ 'color': 'red' }}> *</span></label>
                                    <input
                                        value={this.state.generalInformationAuth.TEMPORARY_ADDRESS}
                                        id="txtTemporaryAddress"
                                        disabled={isDisableWhenView}
                                        className="form-control"
                                        type="text"
                                        placeholder={this.props.strings.temporaryAddress}
                                        onChange={(e) => this.handleOnChangeInput("TEMPORARY_ADDRESS", e)} />
                                </div>
                            </div>
                        }
                        <div className="col-md-12">
                            <div className="col-md-9 form-group">
                                <label>{this.props.strings.regaddress}</label>
                                <input value={this.state.generalInformationAuth.PERMANENT_ADDRESS}
                                    onChange={(e) => this.handleOnChangeInput("PERMANENT_ADDRESS", e)}
                                    id="txtAuthRegaddress"
                                    disabled={isDisableWhenView}
                                    className="form-control" type="text"
                                    placeholder={this.props.strings.regaddress} />
                            </div>
                            <div className="col-md-3 form-group">
                                <label>{this.props.strings.country}</label>
                                <DropdownFactory ID="drdAuthCountry"
                                    onSetDefaultValue={this.onSetDefaultValue}
                                    disabled={isDisableWhenView}
                                    value={this.state.generalInformationAuth.PERMANENT_COUNTRY}
                                    onChange={(type, value) => this.handleOnChangeInput('PERMANENT_COUNTRY', type, value)}
                                    value="PERMANENT_COUNTRY" CDTYPE="CF" CDNAME="COUNTRY"
                                    CDVAL={this.state.generalInformationAuth.PERMANENT_COUNTRY} />
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="col-md-3 form-group">
                                <label>{this.props.strings.phone}<span style={{ 'color': 'red' }}> *</span></label>
                                <input value={this.state.generalInformationAuth.MOBILE}
                                    onChange={(e) => this.handleOnChangeInput("MOBILE", e)}
                                    id="txtAuthMobile"
                                    disabled={isDisableWhenView}
                                    className="form-control"
                                    type="text"
                                    placeholder={this.props.strings.phone} />
                            </div>


                            <div className="col-md-3 form-group">
                                <label>{this.props.strings.email} <span style={{ 'color': 'red' }}> *</span></label>
                                <input value={this.state.generalInformationAuth.EMAIL}
                                    onChange={(e) => this.handleOnChangeInput("EMAIL", e)}
                                    id="txtAuthEmail"
                                    className="form-control"
                                    disabled={isDisableWhenView}
                                    type="text"
                                    placeholder={this.props.strings.email} />
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="col-md-12">
                                <h5 className="">{this.props.strings.authrange} <span style={{ 'color': 'red' }}> *</span></h5>
                                <input
                                    style={{ marginLeft: 0, marginRight: "5px" }}
                                    disabled={isDisableWhenView}
                                    value={this.state.generalInformationAuth.AUTH_ORDER}
                                    id="txtAUTH_ORDER"
                                    checked={isCheckedCheckBox}
                                    onChange={(e) => this.handleOnchangeCheckbox('AUTH_ORDER', e)}
                                    type="checkbox" />
                                <label htmlFor="txtAUTH_ORDER">{this.props.strings.transactionorder}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-register">
                    <button
                        className="btn-return"
                        onClick={() => this.props.setStep(1)}
                    >
                        {this.props.strings.btnReturn}
                    </button>
                    <button className="btn-continue"
                        onClick={() => this.onSubmitStep2()}
                    >
                        {this.props.strings.buttonContinuous}
                    </button>
                </div>
            </React.Fragment>
        )
    }
}
const stateToProps = state => ({
    auth: state.auth,
});

const decorators = flow([
    connect(stateToProps),
    translate('EditAccountStep2')
]);

module.exports = decorators(EditAccountStep2);
