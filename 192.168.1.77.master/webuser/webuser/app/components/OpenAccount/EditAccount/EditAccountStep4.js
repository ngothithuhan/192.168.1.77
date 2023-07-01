import React from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { ACTIONS_ACC, EVENT, COUNT_OTP_FAIL, WAIT_OTP_FAIL } from 'app/Helpers'
import {
    mapStateToEditApi, mapStateToAddApi
} from 'app/components/OpenAccount/Step3/Step3Utils.js';
import { convertDataStep3 } from './UtilityStep3';
import {
    convertDataCreatStep2,
    convertDataEditStep2,
    FieldEditAccount,
    FieldCreateAccount
} from './UtilityStep2'
import './EditAccountStep4.scss'
import _ from 'lodash';
import { setUserKeyOTP } from 'actionAddAccount';
import ModalOTPAccount from 'app/components/OpenAccount/Modal/ModalOTPAccount.js';
import { emitter } from 'app/utils/emitter';
import SimpleCountDown from 'app/utils/CountDown/SimpleCountDown.js'

class EditAccountStep4 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgCaptcha: '',
            inputCaptcha: '',
            dataOTP: '',
            isOpenModalOTP: false,
            isDisableCaptcha: false
        }
        this.listenToEmitter()
    }
    listenToEmitter() {
        // emitter.on(EVENT.CLOSE_POPUP_WARNING_ACC, async (data) => {
        //     await this.props.setStep(4);
        // })
        emitter.on(EVENT.TIME_UP_CLOSE_OTP, async (data) => {
            await this.setState({
                isOpenModalOTP: false,
                dataOTP: {},
                inputCaptcha: ''
            }, () => this.getCaptcha())
        })
    }

    processDataAPI = () => {
        let { allDataEdit, action } = this.props;
        let GeneralInfoMain = {}, GeneralInfoAuth = {}, GeneralInfoFatca = {};
        GeneralInfoMain = action === ACTIONS_ACC.CREATE ?
            mapStateToAddApi(allDataEdit.dataStep1) :
            mapStateToEditApi(allDataEdit.dataStep1);

        if (action === ACTIONS_ACC.CREATE) {
            GeneralInfoAuth = allDataEdit.dataStep1.IS_AUTHORIZED === "Y" ?
                convertDataCreatStep2(allDataEdit.dataStep2) : FieldCreateAccount;
        }
        if (action === ACTIONS_ACC.EDIT) {
            GeneralInfoAuth = allDataEdit.dataStep1.IS_AUTHORIZED === "Y" ?
                convertDataEditStep2(allDataEdit.dataStep2) : FieldEditAccount;
        }

        GeneralInfoFatca = convertDataStep3(allDataEdit.dataStep3);

        return { GeneralInfoMain, GeneralInfoAuth, GeneralInfoFatca }

    }

    //Xác thực OTP thành công, lưu user vào cfmast
    activeOTP = async (data) => {
        let { allDataEdit, action } = this.props;
        let dataStep1 = allDataEdit.dataStep1;
        return RestfulUtils.posttrans('/account/activeopt', {
            OTPCODE: data.OTPCODE,
            newCUSTODYCD: data.p_custodycd,
            FULLNAME: dataStep1.FULLNAME,
            IDCODE: dataStep1.IDCODE_NO,
            OTPTYPE: action === ACTIONS_ACC.CREATE ? 'CREATECF' : 'EDITCF',
            LANG: this.props.language,
            OBJNAME: 'OTPCONFIRMCF',
            KEYOTP: this.props.keyOTPRedux
        })
    }


    upsertAccount = async (isAdmin, OTPCODE) => {
        let datanotify = {
            type: "",
            header: "",
            content: ""
        }
        let { dispatch, closeModalDetail, action, clearAllParentData } = this.props;
        let that = this;

        if (action === ACTIONS_ACC.VIEW) {
            return;
        }

        RestfulUtils.posttrans('/account/finishgeneralinfo', {
            GeneralInfoMain: this.processDataAPI().GeneralInfoMain,
            GeneralInfoAuth: this.processDataAPI().GeneralInfoAuth,
            GeneralInfoFatca: this.processDataAPI().GeneralInfoFatca,
            language: this.props.language,
            access: this.props.action,
            OBJNAME: 'MANAGERACCT',
            captcha: this.state.inputCaptcha
        })
            .then(async (res) => {
                if (res.EC == 0) {
                    if (isAdmin === true) {
                        closeModalDetail();
                        clearAllParentData();
                        datanotify.type = "success";
                        datanotify.content = action == ACTIONS_ACC.CREATE ? that.props.strings.addSuccess : that.props.strings.editSuccess;
                        dispatch(showNotifi(datanotify));
                    } else {
                        let resOTP = await this.activeOTP({ ...res.DT, OTPCODE })
                        if (resOTP && resOTP.EC === 0) {
                            datanotify.type = "success";
                            datanotify.content = that.props.strings.editSuccess;
                            dispatch(showNotifi(datanotify));
                            emitter.emit(EVENT.RETURN_TABLE_ACC, '');
                        } else {
                            datanotify.type = "error";
                            datanotify.content = resOTP.EM;
                            this.props.dispatch(showNotifi(datanotify));
                        }
                    }

                } else {

                    if (res.EC == -7777) {
                        res.EM = that.props.strings.isSameOld
                    }
                    else if (res.EC == -200015) {
                        res.EM = that.props.strings.errDuplicate
                    }
                    else {
                        res.EM = `[${res.EC}] - ${res.EM}`
                    }

                    datanotify.type = "error";
                    datanotify.content = res.EM;
                    dispatch(showNotifi(datanotify));
                }
            })
    }

    handleReturn = () => {
        if (this.props.allDataEdit.dataStep1) {
            let isAUTHORIZED = this.props.allDataEdit.dataStep1.IS_AUTHORIZED === "Y"
            let isFATCA = this.props.allDataEdit.dataStep1.IS_FATCA === "Y"
            if (isAUTHORIZED && isFATCA) {
                this.props.setStep(3)
            } else if (!isAUTHORIZED && isFATCA) {
                this.props.setStep(3)
            } else if (isAUTHORIZED && !isFATCA) {
                this.props.setStep(2)
            } else {
                this.props.setStep(1)
            }
        }
    }



    submitDataFinish = async () => {
        let mssgerr = '';
        let { dispatch, action } = this.props;
        if (action === ACTIONS_ACC.VIEW) return;


        let datanotify = {
            type: "",
            header: "",
            content: ""
        }

        if (!this.state.inputCaptcha) {
            mssgerr = "Vui lòng nhập captcha!";
            datanotify.type = "error";
            datanotify.content = mssgerr;
            dispatch(showNotifi(datanotify));
            window.$("txtFinishCaptcha").focus();
        } else {
            //validate captcha
            let resCaptcha = await RestfulUtils.posttrans('/account/validateCaptCha', {
                captcha: this.state.inputCaptcha,
                OBJNAME: 'MANAGERACCT'
            });

            if (resCaptcha && resCaptcha.EC === 0) {
                //genOTP
                let { allDataEdit, action } = this.props;
                let dataStep1 = allDataEdit.dataStep1;
                let res = await RestfulUtils.posttrans('/otp/getUpsertAccOTP', {
                    OBJECT: 'EDITCF',
                    IDCODE: dataStep1.IDCODE_NO ? dataStep1.IDCODE_NO : '',
                    CUSTODYCD: dataStep1.CUSTODYCD ? dataStep1.CUSTODYCD : '', //custodycd
                });
                if (res && res.EC === 0) {
                    let keyOTP = res.DT.p_keyotp; //lưu lại key để phân biệt được ai là người đang gửi OTP
                    //save to redux
                    this.props.dispatch(setUserKeyOTP(keyOTP))
                    this.showModalOTPConfirm({
                        IDCODE: dataStep1.IDCODE_NO,
                        FULLNAME: dataStep1.FULLNAME,
                        ACTION: action
                    });
                } else {
                    datanotify.type = "error";
                    datanotify.content = `[${res.EC} - ${res.EM}]`
                    this.props.dispatch(showNotifi(datanotify));
                }

            } else {
                //invalid captcha
                datanotify.type = "error";
                datanotify.content = resCaptcha.EM;
                this.props.dispatch(showNotifi(datanotify));
                window.$(`#txtFinishCaptcha`).focus();
                await this.getCaptcha();
                return;
            }
        }

    }

    getCaptcha = async () => {
        RestfulUtils.post('/account/getcaptcha', null)
            .then(async (res) => {
                await this.setState({ ...this.state, imgCaptcha: res })
            })
    }

    showModalOTPConfirm = (data) => {
        this.setState({ ...this.state, isOpenModalOTP: true, dataOTP: data })
    }


    async componentDidMount() {
        await this.getCaptcha();
    }

    backToPrevStep = () => {
        let { allDataEdit } = this.props;
        let dataStep1 = allDataEdit && allDataEdit.dataStep1 ? allDataEdit.dataStep1 : {};
        if (dataStep1 && !_.isEmpty(dataStep1)) {
            if (dataStep1.IS_FATCA === true || dataStep1.IS_FATCA === "Y") {
                this.props.setStep(3);
                return;
            }
            else if (dataStep1.IS_AUTHORIZED === true || dataStep1.IS_AUTHORIZED === "Y") {
                this.props.setStep(2);
                return;
            } else {
                this.props.setStep(1);
            }
        }

    }

    closeModalOTP = () => {
        this.setState({
            ...this.state,
            isOpenModalOTP: false,
            inputCaptcha: ''
        }, () => this.getCaptcha())
    }

    checkDisableCaptcha = (value) => {
        this.setState({ isDisableCaptcha: value })
    }

    onTimesUp = () => {
        this.setState(
            {
                countOTP: 0,
                dataOTP: {},
                inputCaptcha: '',
                isDisableCaptcha: false
            },
            () => this.getCaptcha())
    }


    render() {
        let { user } = this.props.auth;
        let isAdmin = (user && user.ISCUSTOMER && user.ISCUSTOMER === 'Y') ? false : true;
        let { PHONE, EMAIL } = this.props.dataStep1;
        let { isDisableCaptcha } = this.state;

        if (this.props.action === ACTIONS_ACC.VIEW) isDisableCaptcha = true;
        return (
            <div className="edit-account-step-4">
                {!isAdmin ?
                    <React.Fragment>
                        <div className="row background-white padding-20">
                            <div className="title-edit-account-step-4">{this.props.strings.finish}</div>
                            <div className="confirm-note">{this.props.strings.confirmNote1}</div>

                            <div className="confirm-note">{this.props.strings.confirmNote2}</div>

                            <div className="lableSentPhone">{this.props.strings.lableSentPhone} <span className="key-note">{PHONE}</span>  {this.props.strings.andEmail} <span className="key-note">{EMAIL}</span> </div>

                            <div className="col-md-12 text-center pb-20">
                                <div className="image-captcha">
                                    <div
                                        dangerouslySetInnerHTML={{ __html: this.state.imgCaptcha }} />
                                    {!isDisableCaptcha &&
                                        <i class="fas fa-sync-alt icon-refresh icon-refresh" onClick={this.getCaptcha} title="refresh captcha"></i>}
                                </div>
                            </div>

                            <div className="block-captcha">
                                <div className="col-md-8">
                                    <input id="txtFinishCaptcha"
                                        className="form-control"
                                        disabled={isDisableCaptcha}
                                        type="text"
                                        value={this.state.inputCaptcha}
                                        onChange={(e) => this.setState({ inputCaptcha: e.target.value })} />
                                </div>
                                <div className="col-md-4" >
                                    <input
                                        type="button" onClick={() => this.submitDataFinish()}
                                        className="button-sent-OTP"
                                        disabled={isDisableCaptcha}
                                        style={{ marginLeft: 0, marginRight: 5 }}
                                        value={this.props.strings.sentOTP} />
                                </div>
                                {
                                    isDisableCaptcha && this.props.action !== ACTIONS_ACC.VIEW &&
                                    <div className="col-md-12 wait-countdown">
                                        Quý khách có thể nhập captcha sau <span>
                                            <SimpleCountDown
                                                isSecond={true}
                                                duration={WAIT_OTP_FAIL}
                                                onTimesUp={this.onTimesUp}
                                            /></span> giây.

                                    </div>
                                }
                            </div>

                        </div>
                        <div className="col-md-12 text-center mt-10">
                            <div className="footer-register">
                                <button className="btn-return"
                                    onClick={() => this.handleReturn()}>{this.props.strings.btnReturn}</button>
                            </div>
                        </div>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <div className="admin-step-4-finish">
                            <div className="admin-title">
                                {this.props.strings.finish}
                            </div>
                            <div className="admin-button">
                                <button className="ad-btn-back" onClick={() => this.backToPrevStep()}>{this.props.strings.btnReturn}</button>
                                <button className="ad-btn-finish" disabled={this.props.action === ACTIONS_ACC.VIEW} onClick={() => this.upsertAccount(true)}>{this.props.strings.finish}</button>
                            </div>

                        </div>
                    </React.Fragment>
                }
                <ModalOTPAccount
                    isOpenModalOTPAccount={this.state.isOpenModalOTP}
                    onCloseModalOTPAccount={this.closeModalOTP}
                    dataOTP={this.state.dataOTP}
                    action={this.props.action}
                    upsertAccount={this.upsertAccount}
                    isEKYC={false}
                    checkDisableCaptcha={this.checkDisableCaptcha}
                //countOTP={this.state.countOTP}
                //setCountOTP={this.setCountOTP}
                />
            </div>
        )
    }
}

const stateToProps = state => ({
    language: state.language.language,
    newcaptcha: state.newcaptcha,
    auth: state.auth,
    keyOTPRedux: state.addAccount.keyOTP
});


const decorators = flow([
    connect(stateToProps),
    translate('EditAccountStep4')
]);

module.exports = decorators(EditAccountStep4);