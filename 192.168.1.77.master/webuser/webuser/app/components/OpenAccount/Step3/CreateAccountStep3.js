import React, { Component, Fragment, PureComponent } from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import HideShowDataInput from './HideShowDataInput';
import { showNotifi } from 'app/action/actionNotification.js';
import {
    getAllRequireData, checkValidateInputMainInfor,
    arrMapApiToState, getIdType, mapStateToEditApi, mapStateToAddApi,
    getAllRequireDataEKYC, getCountryList

} from './Step3Utils';
import './CreateAccountStep3.scss';
import GeneralInfo from './Section/GeneralInfo';
import AuthInfo from './Section/AuthInfo';
import BankInfo from './Section/BankInfo';
import BrokerInfo from './Section/BrokerInfo';
import CapitalInfo from './Section/CapitalInfo';
import ConnectInfo from './Section/ConnectInfo';
import InvestInfo from './Section/InvestInfo';
import LawInfo from './Section/LawInfo';
import FatCaInfo from './Section/FatCaInfo';
import ContractInfo from './Section/ContractInfo';
import _ from 'lodash';
import { ACTIONS_ACC, GRINVESTOR_TN } from '../../../Helpers';

class CreateAccountStep3 extends Component {
    constructor(props) {
        super(props);
        this.state = {

            //data lưu các tham số đầu vào apis
            allDataStep3: {

                HAS_OLD_DATA: false, // dùng để check component này đã có data cũ hay chưa


                //mở tài khoản
                FULLNAME: '',
                BIRTHDATE: '',
                SEX: '',
                NATIONALITY: '',
                IDTYPE: '',

                IDCODE_NO: '', //số đăng ký sở hữu, với cá nhân là cmnd, với tổ chức là trading code
                IDCODE_DATE: '',
                IDCODE_ADDRESS: '',

                ADDRESS: '',
                COUNTRY_ADDRESS: '',

                REGADDRESS: '',
                COUNTRY_REGADDRESS: '',

                EMAIL: '',
                PHONE_CONTACT: '',
                SIGNATURE: '',

                BANK_NO: '',
                BANK_NAME: '',
                BANK_BRANCH: '',

                IS_AGREE: 'N', //đồng ý với điều khoản hay ko
                IS_AUTHORIZED: '', //ủy quyền hay ko
                IS_FATCA: '', //dấu hiệu mỹ
                IS_ONLINE: 'N', //đồng ý sử dụng các dịch vụ online

                PASSPORT: '',
                PASSPORTDATE: '',
                PASSPORTPLACE: '',


                ISSUED_NO: '', //đăng ký sở hữu
                ISSUED_DATE: '',
                ISSUED_ADDRESS: '',

                BUSSINESS_NO: '', //đăng ký kinh doanh
                BUSSINESS_DATE: '',
                BUSSINESS_ADDRESS: '',

                TAX_NUMBER: '',

                LAW_FULLNAME: '',
                LAW_BIRTHDAY: '',
                LAW_NATIONALITY: '',
                LAW_POSITION: '',
                LAW_IDCODE_NO: '',
                LAW_IDCODE_DATE: '',
                LAW_IDCODE_ADDRESS: '',

                LAW_PHONE_CONTACT: '',
                LAW_EMAIL: '',


                //sửa tài khoản
                CUSTTYPE: '', //loại tài khoản, cá nhân hay tổ chức

                OTHER_NATIONALITY: '',
                JOB: '',
                BUSINESS_AREAS: '',
                POSITION: '',
                WORK_ADDRESS: '',
                TAX_COUNTRY: '',
                FAX: '',
                CAREBY_GROUP: '',
                CAREBY_PERSON: '',
                INVEST_TIME: '',
                RISK: '',
                EXPERIENCE: '',
                REASON_ENTRY: '', //lý do nhập cảnh
                VISA_NO: '',

                LAW_GENDER: '',
                LAW_VISA_NO: '',
                LAW_VISA_DATE: '',
                LAW_VISA_ADDRESS: '',

                CAPITAL_NAME: '',
                CAPITAL_POSITION: '',
                CAPITAL_ID_NO: '',
                CAPITAL_ID_DATE: '',
                CAPITAL_ID_ADDRESS: '',
                CAPITAL_PHONE: '',
                CAPITAL_EMAIL: '',

                action: 'add',

            },

            //data lưu các options select
            allDataSelect: {
                optionsIdType: {}, //loại giấy tờ
                optionsJobType: {}, // list jobs
                optionCareByType: {}, //lit môi giới
                optionSaleType: {}, // list nhân viên chăm sóc
                optionRiskType: {}, //list rủi ro
                optionInvestTimeType: {}, // list thời gian đầu tư
                optionExperienceType: {}, //list kinh nghiệm đầu tư

                imagePreviewUrl: '',
            }

        }

    }

    //set data input khi từ bước trước quay lại bước này
    setDraftDataUser = () => {
        let { allDataEdit } = this.props;
        if (allDataEdit && !_.isEmpty(allDataEdit)) {
            let dataStep1 = allDataEdit.dataStep1;
            let dataStep1Select = allDataEdit.dataStep1Select;
            if (dataStep1 && !_.isEmpty(dataStep1) && dataStep1Select && !_.isEmpty(dataStep1Select)) {
                this.setState({
                    allDataStep3: dataStep1,
                    allDataSelect: dataStep1Select
                })
            }
        }
    }


    async componentDidMount() {
        let { allDataEdit, isLoggedOut, dataEditStep1, language, allData, GRINVESTOR } = this.props;

        //trường hợp tạo, sửa bên web nghiệp vụ (admin) hoặc sửa thông tin nhà đầu tư
        //gán old data khi nhấn nút back
        if (allDataEdit && !_.isEmpty(allDataEdit) && isLoggedOut === false) {
            let dataStep1 = allDataEdit.dataStep1;
            if (dataStep1 && dataStep1.HAS_OLD_DATA === true) {
                this.setDraftDataUser();
                return;
            }
        }


        //gán old data trong trường hợp mở tài khoản nhà đầu tư EKYC
        if (isLoggedOut === true && allData && allData.dataStep3 && !_.isEmpty(allData.dataStep3)) {
            let dataStep3 = allData.dataStep3;
            let dataStep3Select = allData.dataStep3Select;
            if (dataStep3 && dataStep3.HAS_OLD_DATA === true) {
                this.setState({
                    allDataStep3: dataStep3,
                    allDataSelect: dataStep3Select
                })
            }
            return;
        }


        //tooltip
        window.$(function () {
            $('[data-toggle="popover"]').popover({ trigger: "hover" })
        })
        window.$("#loadingscreen").show();

        //load các dropdowns và selects
        if (isLoggedOut === false) {
            let allDataSelectCopy = { ...this.state.allDataSelect }
            let allRequireData = await getAllRequireData({ language });
            let countryList = await getCountryList({
                GRINVESTOR: GRINVESTOR,
                language: language,
                IS_FILTER: true
            })

            let { jobList, careByList, saleList, riskList, investTimeList, experienceList } = allRequireData;
            allDataSelectCopy.optionsJobType = jobList;
            allDataSelectCopy.optionCareByType = careByList;
            allDataSelectCopy.optionSaleType = saleList;
            allDataSelectCopy.optionRiskType = riskList;
            allDataSelectCopy.optionInvestTimeType = investTimeList;
            allDataSelectCopy.optionExperienceType = experienceList;
            allDataSelectCopy.optionsCountryType = countryList;

            await this.setState({
                allDataSelect: allDataSelectCopy,
            })
        }

        //set các giá trị mặc định với role là admin/nhà đầu tư
        if (isLoggedOut === false && dataEditStep1) {
            this.setDefaultDataEdit(this.props.dataEditStep1);
        }


        //set các giá trị mặc định trong trường hợp mở tài khoản NĐT
        if (isLoggedOut === true) {
            await this.setDefaultIdTypeCreateAccEKYC();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    shouldComponentUpdate(nextProps, nextState) {
        let { allDataStep3, allDataSelect } = this.state;

        return !_.isEqual(allDataStep3, nextState.allDataStep3)
            || !_.isEqual(allDataSelect, nextState.allDataSelect)
    }


    setDefaultIdTypeCreateAccEKYC = async () => {
        let allDataStep3Copy = { ...this.state.allDataStep3 }
        let { language, GRINVESTOR, CUSTTYPE } = this.props;
        allDataStep3Copy['NATIONALITY'] = GRINVESTOR === GRINVESTOR_TN ? '234' : '2';// gán giá trị mặc định
        allDataStep3Copy['CUSTTYPE'] = CUSTTYPE;
        allDataStep3Copy['GRINVESTOR'] = GRINVESTOR;


        let idType = await getIdType(allDataStep3Copy, language);
        let countryList = await getCountryList({
            GRINVESTOR: GRINVESTOR,
            language: language,
            IS_FILTER: true
        })

        let allDataSelectCopy = { ...this.state.allDataSelect }
        allDataSelectCopy.optionsIdType = idType;
        allDataSelectCopy.optionsCountryType = countryList;

        this.setState({
            allDataStep3: allDataStep3Copy,
            allDataSelect: allDataSelectCopy
        })

        window.$("#loadingscreen").hide();

    }

    setDefaultDataEdit = async (dataEdit) => {
        let { action } = this.props;
        let allDataStep3Copy = { ...this.state.allDataStep3 }

        if (action !== ACTIONS_ACC.CREATE) {
            //chỉ gán giá trị trong trường hợp sửa/view tài khoản
            arrMapApiToState.map(item => {
                if (item.value && item.key) {
                    allDataStep3Copy[item.value] = dataEdit[item.key] ? dataEdit[item.key] : null;

                    if (dataEdit[item.key] === true) {
                        allDataStep3Copy[item.value] = 'Y';
                    }
                    if (dataEdit[item.key] === false) {
                        allDataStep3Copy[item.value] = 'N';
                    }
                }
            })
            allDataStep3Copy['IS_AGREE'] = 'Y';
        } else {
            //trường hợp tạo tài khoản, cần gán thêm fields để get api id type
            allDataStep3Copy['NATIONALITY'] = this.props.GRINVESTOR === GRINVESTOR_TN ? '234' : '2';// gán giá trị mặc định
            allDataStep3Copy['CUSTTYPE'] = this.props.CUSTTYPE;
            allDataStep3Copy['GRINVESTOR'] = this.props.GRINVESTOR;
        }
        let that = this;
        this.setState({
            allDataStep3: allDataStep3Copy
        }, async () => {
            //get loại giấy tờ
            let idType = await getIdType(that.state.allDataStep3, that.props.language);
            let allDataSelectCopy = { ...that.state.allDataSelect }
            allDataSelectCopy.optionsIdType = idType;
            await that.setState({
                allDataSelect: allDataSelectCopy
            }, () => {
                window.$("#loadingscreen").hide();
            })
        })
    }

    handleOnChangeInput = async (id, event, dataCustomize, isSelect) => {
        let valueInput = '';
        let allDataStep3Copy = { ...this.state.allDataStep3 }
        let allDataSelectCopy = { ...this.state.allDataSelect }


        if (event && event.target) {
            valueInput = event.target.value;
        }

        //onchange của date, dropdown factory
        if (dataCustomize) {
            //check theo value -> date input / dropdown factory
            valueInput = dataCustomize.value;
            //khi thay đổi quốc tịch, cần get lại loại đăng ký sở hữu
            if (id === 'NATIONALITY') {
                allDataStep3Copy['NATIONALITY'] = dataCustomize.value;
                let idType = await getIdType(allDataStep3Copy, this.props.dataEditStep1, this.props.language);
                allDataSelectCopy.optionsIdType = idType;
            }
        }

        //onchage của select library
        if (isSelect) {
            valueInput = event.value;
        }

        //instead of mutating state directly, create a copy of state 
        //bad code: this.state.allDataStep3[id] = valueInput;
        //=> make unexpected re-rendering component

        allDataStep3Copy[id] = valueInput;

        this.setState({
            allDataStep3: allDataStep3Copy,
            allDataSelect: allDataSelectCopy
        });
    }

    handleOnchangeCheckbox = (event, id) => {
        let allDataStep3Copy = { ...this.state.allDataStep3 }
        let value = event.target.checked ? 'Y' : 'N';
        allDataStep3Copy[id] = value;
        this.setState({
            allDataStep3: allDataStep3Copy
        })
    }

    handleOnChangeUploadFile = (id, event) => {
        event.preventDefault();
        let reader = new FileReader();
        let file = event.target.files[0];
        //todo
        let previewImgURL = URL.createObjectURL(file);
        let allDataStep3Copy = { ...this.state.allDataStep3 }
        allDataStep3Copy['SIGNATURE'] = previewImgURL;

        this.setState({
            allDataStep3: allDataStep3Copy
        })
    }

    //set giá trị default cho dropdown factory
    onSetDefaultValue = (type, value) => {
        let { isLoggedOut, action } = this.props;
        let allDataStep3Copy = { ...this.state.allDataStep3 };
        if (!allDataStep3Copy[type]) {
            allDataStep3Copy[type] = value;
            if (value === 'Y' && action === ACTIONS_ACC.CREATE) {
                //khi tạo tài khoản, gán các dropdown có giá trị là N
                allDataStep3Copy[type] = 'N';
            }
            this.setState({
                ...this.state,
                allDataStep3: allDataStep3Copy
            })
        }
    }


    handleClickNextBtn = async () => {
        let { isLoggedOut, language, userType, action, dispatch } = this.props;
        let allDataStep3Copy = { ...this.state.allDataStep3 };
        let isAuth = this.state.allDataStep3.IS_AUTHORIZED === "Y" ? true : false || this.state.allDataStep3.IS_AUTHORIZED === true
        let checkObj = checkValidateInputMainInfor(this.state.allDataStep3, isLoggedOut, userType, isAuth);
        console.log('>>> checkObj validate ', checkObj)
        let datanotify = {
            type: "",
            header: "",
            content: ""
        }

        if (checkObj.isValid === false && action !== ACTIONS_ACC.VIEW) {
            datanotify.type = "error";
            datanotify.content = checkObj.idCheckFormat ? this.props.strings[`R_${checkObj.idCheckFormat}`] : this.props.strings[`R_${checkObj.idElement}`];
            dispatch(showNotifi(datanotify));
            window.$(`#${checkObj.idElement}`).focus();
            return;
        }

        allDataStep3Copy.HAS_OLD_DATA = true;
        await this.setState({
            allDataStep3: allDataStep3Copy
        })

        //view thông tin, auto next
        if (action === ACTIONS_ACC.VIEW) {
            await this.props.setParentStateFromChild('dataStep1', this.state.allDataStep3, 'dataStep1Select', this.state.allDataSelect)
            await this.props.setStepEdit(2);
            return;
        }

        //sửa tài khoản hoặc mở = web nghiệp vụ
        let convertedData = action === ACTIONS_ACC.CREATE ?
            mapStateToAddApi(this.state.allDataStep3, userType) :
            mapStateToEditApi(this.state.allDataStep3, userType);

        convertedData.language = language;
        convertedData.access = action;
        if (action === ACTIONS_ACC.EDIT) {
            convertedData.CUSTODYCD = this.props.dataEditStep1.CUSTODYCD ? this.props.dataEditStep1.CUSTODYCD : '';
            convertedData.CUSTID = this.props.dataEditStep1.CUSTID ? this.props.dataEditStep1.CUSTID : '';
        }

        let res = await RestfulUtils.post('/account/checkgeneralinfomain',
            convertedData
        );
        if (res && res.EC === 0) {
            //mở tài khoản nhà đầu tư ekyc
            if (isLoggedOut === true) {
                await this.props.setParentStateFromChild('dataStep3', this.state.allDataStep3, 'dataStep3Select', this.state.allDataSelect)
                await this.props.setStep(4.1);
            }

            //nghiệp vụ tạo/sửa và admin mở tài khoản
            if (isLoggedOut === false) {
                await this.props.setParentStateFromChild('dataStep1', this.state.allDataStep3, 'dataStep1Select', this.state.allDataSelect)
                await this.props.setStepEdit(2);
            }

        } else {
            datanotify.type = "error";
            datanotify.content = `[${res.EC}] ${res.EM}`;
            if (res.DT.p_err_field) {

                if (res.DT.p_err_field === 'TAXNUMBER') {
                    window.$(`#TAX_NUMBER`).focus();
                } else if (res.DT.p_err_field === 'IDCODE') {
                    window.$(`#IDCODE_NO`).focus();
                } else if (res.DT.p_err_field === 'IDDATE') {
                    window.$(`#IDCODE_DATE`).focus();
                } else {
                    window.$(`#${res.DT.p_err_field}`).focus();
                }
            }
            dispatch(showNotifi(datanotify));
        }

    }

    handleClickPrevBtn = () => {
        let { isLoggedOut, allData } = this.props;
        if (isLoggedOut === true) {
            if (allData.dataStep1.IS_PERSONAL === 'Y' &&
                allData.dataStep1.IS_CITIZEN === 'Y'
                && allData.dataStep1.IS_EKYC === 'Y') {
                this.props.setStep(2.1)
            } else {
                this.props.setStep(1)
            }
        } else {
            //do something
        }
    }

    render() {
        let { userType, isLoggedOut, action } = this.props;
        let { allDataStep3, allDataSelect } = this.state;
        let isDisableWhenView = action === ACTIONS_ACC.VIEW ? true : false;
        let isUpdate = action === ACTIONS_ACC.EDIT ? true : false;
        let isClone = action === ACTIONS_ACC.CLONE ? true : false;
        return (
            <div className="create-account-step3">
                <div className="create-account-step3-content">
                    <div className="row">
                        {/* Khối 1: Thông tin cá nhân, tổ chức */}
                        <div className="section1">
                            <GeneralInfo
                                handleOnChangeInput={this.handleOnChangeInput}
                                allDataStep3={allDataStep3}
                                allDataSelect={allDataSelect}
                                handleOnChangeUploadFile={this.handleOnChangeUploadFile}
                                onSetDefaultValue={this.onSetDefaultValue}
                                userType={userType}
                                isLoggedOut={isLoggedOut}
                                isDisableWhenUpdate={!isLoggedOut}
                                isDisableWhenView={isDisableWhenView}
                                isUpdate={isUpdate}
                                isClone={isClone}
                            />
                        </div>
                        {/* Khối 2: Thông tin liên hệ */}
                        <div className="section2">
                            <ConnectInfo
                                handleOnChangeInput={this.handleOnChangeInput}
                                allDataStep3={allDataStep3}
                                allDataSelect={allDataSelect}
                                handleOnChangeUploadFile={this.handleOnChangeUploadFile}
                                onSetDefaultValue={this.onSetDefaultValue}
                                userType={userType}
                                isLoggedOut={isLoggedOut}
                                isDisableWhenView={isDisableWhenView}
                                isUpdate={isUpdate}
                            />

                        </div>

                        {/* Khối 3: Thông tin ngân hàng */}
                        <div className="section3">
                            <BankInfo
                                handleOnChangeInput={this.handleOnChangeInput}
                                allDataStep3={allDataStep3}
                                allDataSelect={allDataSelect}
                                handleOnChangeUploadFile={this.handleOnChangeUploadFile}
                                onSetDefaultValue={this.onSetDefaultValue}
                                userType={userType}
                                isLoggedOut={isLoggedOut}
                                isDisableWhenView={isDisableWhenView}
                                isUpdate={isUpdate}
                            />
                        </div>

                        {/* Khối 4: Thông tin ủy quyền */}
                        <div className="section4">
                            <AuthInfo
                                handleOnChangeInput={this.handleOnChangeInput}
                                allDataStep3={allDataStep3}
                                allDataSelect={allDataSelect}
                                handleOnChangeUploadFile={this.handleOnChangeUploadFile}
                                onSetDefaultValue={this.onSetDefaultValue}
                                userType={userType}
                                isLoggedOut={isLoggedOut}
                                isDisableWhenView={isDisableWhenView}
                                isUpdate={isUpdate}
                            />
                        </div>

                        {/* Khối 5: Thông tin người đại diện pháp luật */}
                        <div className="section5">
                            <LawInfo
                                handleOnChangeInput={this.handleOnChangeInput}
                                allDataStep3={allDataStep3}
                                allDataSelect={allDataSelect}
                                handleOnChangeUploadFile={this.handleOnChangeUploadFile}
                                onSetDefaultValue={this.onSetDefaultValue}
                                userType={userType}
                                isLoggedOut={isLoggedOut}
                                isDisableWhenView={isDisableWhenView}
                                isUpdate={isUpdate}
                            />
                        </div>

                        {/* Khối 6: Thông tin môi giới */}
                        <div className="section6">
                            <BrokerInfo
                                handleOnChangeInput={this.handleOnChangeInput}
                                allDataStep3={allDataStep3}
                                allDataSelect={allDataSelect}
                                handleOnChangeUploadFile={this.handleOnChangeUploadFile}
                                onSetDefaultValue={this.onSetDefaultValue}
                                userType={userType}
                                isLoggedOut={isLoggedOut}
                                isDisableWhenView={isDisableWhenView}
                                isUpdate={isUpdate}
                            />
                        </div>

                        {/* Khối 7: Dấu hiệu Mỹ */}
                        <div className="section7">
                            <FatCaInfo
                                handleOnChangeInput={this.handleOnChangeInput}
                                allDataStep3={allDataStep3}
                                allDataSelect={allDataSelect}
                                handleOnChangeUploadFile={this.handleOnChangeUploadFile}
                                onSetDefaultValue={this.onSetDefaultValue}
                                userType={userType}
                                isLoggedOut={isLoggedOut}
                                isDisableWhenView={isDisableWhenView}
                                isUpdate={isUpdate}
                            />
                        </div>

                        {/* Khối 8: Thông tin về nhu cầu đầu tư */}
                        <div className="section8">
                            <InvestInfo
                                handleOnChangeInput={this.handleOnChangeInput}
                                allDataStep3={allDataStep3}
                                allDataSelect={allDataSelect}
                                handleOnChangeUploadFile={this.handleOnChangeUploadFile}
                                onSetDefaultValue={this.onSetDefaultValue}
                                userType={userType}
                                isLoggedOut={isLoggedOut}
                                isDisableWhenView={isDisableWhenView}
                                isUpdate={isUpdate}
                            />
                        </div>

                        {/* Khối 9: Thông tin người đại diện vốn */}
                        <div className="section9">
                            <CapitalInfo
                                handleOnChangeInput={this.handleOnChangeInput}
                                allDataStep3={allDataStep3}
                                allDataSelect={allDataSelect}
                                handleOnChangeUploadFile={this.handleOnChangeUploadFile}
                                onSetDefaultValue={this.onSetDefaultValue}
                                userType={userType}
                                isLoggedOut={isLoggedOut}
                                isDisableWhenView={isDisableWhenView}
                                isUpdate={isUpdate}
                            />
                        </div>

                        {/* Khối 10: Điều khoản và điều kiện */}
                        <div className="section10">
                            <div className="col-md-12 col-xs-12">
                                <ContractInfo
                                    handleOnChangeInput={this.handleOnChangeInput}
                                    allDataStep3={allDataStep3}
                                    allDataSelect={allDataSelect}
                                    handleOnChangeUploadFile={this.handleOnChangeUploadFile}
                                    onSetDefaultValue={this.onSetDefaultValue}
                                    userType={userType}
                                    isLoggedOut={isLoggedOut}
                                    isDisableWhenView={isDisableWhenView}
                                    isUpdate={isUpdate}
                                />
                            </div>
                        </div>
                        {!isLoggedOut &&
                            <div className="add-space col-md-12 col-xs-12"> </div>}
                        {
                            // create by ekyc
                            isLoggedOut &&
                            <HideShowDataInput inputName={'IS_ONLINE'}{...this.props}
                                allDataStep3={this.state.allDataStep3}>
                                <div className="custom-group-checkbox">
                                    <input
                                        type="checkbox"
                                        className=""
                                        id="IS_ONLINE"
                                        checked={this.state.allDataStep3.IS_ONLINE === 'Y' ? true : false}
                                        onChange={(event) => this.handleOnchangeCheckbox(event, 'IS_ONLINE')}
                                        disabled={isDisableWhenView}
                                    />
                                    <label className="text-agree" htmlFor="IS_ONLINE">{this.props.strings.IS_ONLINE}</label>
                                </div>
                            </HideShowDataInput>
                        }
                        {(this.state.allDataStep3.IS_AUTHORIZED === 'N') &&
                            <HideShowDataInput inputName={'IS_ONLINE'}{...this.props}
                                allDataStep3={this.state.allDataStep3}>
                                <div className="custom-group-checkbox">
                                    <input
                                        type="checkbox"
                                        className=""
                                        id="IS_ONLINE"
                                        checked={this.state.allDataStep3.IS_ONLINE === 'Y' ? true : false}
                                        onChange={(event) => this.handleOnchangeCheckbox(event, 'IS_ONLINE')}
                                        disabled={isDisableWhenView}
                                    />
                                    <label className="text-agree" htmlFor="IS_ONLINE">{this.props.strings.IS_ONLINE}</label>
                                </div>
                            </HideShowDataInput>
                        }

                        {/* Đồng ý mở tài khoản */}
                        <div className="col-md-12 col-xs-12 over-css">
                            <HideShowDataInput inputName={'IS_AGREE'}{...this.props}
                                allDataStep3={this.state.allDataStep3}>
                                <div className="custom-group-checkbox">
                                    <input
                                        type="checkbox"
                                        className=""
                                        id="IS_AGREE"
                                        checked={this.state.allDataStep3.IS_AGREE === 'Y' ? true : false}
                                        onChange={(event) => this.handleOnchangeCheckbox(event, 'IS_AGREE')}
                                        disabled={isDisableWhenView}
                                    />
                                    <label className="text-agree" htmlFor="IS_AGREE">{this.props.strings.IS_AGREE}</label>
                                </div>
                            </HideShowDataInput>
                        </div>
                        <div className="col-md-12 col-xs-12"></div>
                    </div>
                </div>

                <div className="footer-register">
                    <button
                        className={isLoggedOut ? "btn-return" : "btn-return btn-hidden"}
                        onClick={() => this.handleClickPrevBtn()}>
                        {this.props.strings.BUTTON_PREV}
                    </button>
                    <button className="btn-continue"
                        onClick={() => this.handleClickNextBtn()}>
                        {this.props.strings.BUTTON_NEXT}
                    </button>
                </div>


            </div >
        )
    }

}

const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth
});

const decorators = flow([
    connect(stateToProps),
    translate('CreateAccount')
]);

module.exports = decorators(CreateAccountStep3);
