import React from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import './CreateAccountStep4_2.scss'
import _ from 'lodash';
import {
    mapStateToEditApi, mapStateToAddApi
} from 'app/components/OpenAccount/Step3/Step3Utils.js';
import { convertDataStep3 } from 'app/components/OpenAccount/EditAccount/UtilityStep3';
import {
    FieldCreateAccount
} from 'app/components/OpenAccount/EditAccount/UtilityStep2';
import { EVENT, WAIT_OTP_FAIL } from 'app/Helpers.js'
import { emitter } from 'app/utils/emitter';
import { ACTIONS_ACC } from '../../../Helpers';
import { setUserKeyOTP } from 'actionAddAccount';
import ModalOTPAccount from 'app/components/OpenAccount/Modal/ModalOTPAccount.js';

import SimpleCountDown from 'app/utils/CountDown/SimpleCountDown.js'


class CreateAccountStep4_2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputCaptcha: "",
            imgCaptcha: '',
            isOpenModalOTP: false,
            dataOTP: {},
            isOpenAccountSuccess: false,
            dataNewAccount: {},
            isDisableCaptcha: false
        }

        this.listenToEmitter();
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

    closeModalOTP = () => {
        this.setState({
            isOpenModalOTP: false,
            dataOTP: {},
            inputCaptcha: ''
        }, () => this.getCaptcha())
    }

    processDataAPI = () => {
        let { allData, action } = this.props;
        let GeneralInfoMain = {}, GeneralInfoAuth = {}, GeneralInfoFatca = {};
        GeneralInfoMain = mapStateToAddApi(allData.dataStep3);
        GeneralInfoAuth = FieldCreateAccount;
        GeneralInfoFatca = convertDataStep3();
        GeneralInfoFatca['access'] = action;
        return { GeneralInfoMain, GeneralInfoAuth, GeneralInfoFatca }
    }

    confirmCaptchaOpenAccount = async () => {

        let { inputCaptcha } = this.state;
        let datanotify = {
            type: "",
            header: "",
            content: ""
        }

        if (!inputCaptcha) {
            datanotify.type = "error";
            datanotify.content = this.props.strings.requireCaptcha
            this.props.dispatch(showNotifi(datanotify));
            window.$(`#txtFinishCaptcha`).focus();
            return;
        } else {
            //validate captcha
            let resCaptcha = await RestfulUtils.posttrans('/account/validateCaptCha', {
                captcha: inputCaptcha,
                OBJNAME: 'MANAGERACCT'
            });
            if (resCaptcha && resCaptcha.EC === 0) {
                //genOTP
                let { allData, action } = this.props;
                let dataStep3 = allData.dataStep3;
                let res = await RestfulUtils.posttrans('/otp/getUpsertAccOTP', {
                    OBJECT: 'OPENCF',
                    IDCODE: dataStep3.IDCODE_NO,
                    CUSTODYCD: action === ACTIONS_ACC.CREATE ? dataStep3.PHONE_CONTACT : '124452111', //custodycd
                });
                if (res && res.EC === 0) {
                    let keyOTP = res.DT.p_keyotp; //lưu lại key để phân biệt được ai là người đang gửi OTP
                    //count captcha
                    // this.setState((prevState) => ({ countCaptcha: prevState.countCaptcha + 1 }))
                    //save to redux
                    this.props.dispatch(setUserKeyOTP(keyOTP))
                    this.showModalOTPConfirm({
                        IDCODE: dataStep3.IDCODE_NO,
                        FULLNAME: dataStep3.FULLNAME,
                        ACTION: action
                    });
                } else {
                    datanotify.type = "error";
                    datanotify.content = `[${res.EC} - ${res.EM}]`
                    this.props.dispatch(showNotifi(datanotify));
                }
            }

            else {
                datanotify.type = "error";
                datanotify.content = resCaptcha.EM;
                this.props.dispatch(showNotifi(datanotify));
                window.$(`#txtFinishCaptcha`).focus();
                await this.getCaptcha();
                return;
            }
        }
    }

    showModalOTPConfirm = (data) => {
        this.setState({
            ...this.state,
            isOpenModalOTP: true,
            dataOTP: data
        })
    }

    handlePrevBtn = () => {
        this.props.setStep(4.1)
    }

    async componentDidMount() {
        await this.getCaptcha()
    }

    getCaptcha = async () => {
        RestfulUtils.post('/account/getcaptcha', null)
            .then(async (res) => {
                await this.setState({ ...this.state, imgCaptcha: res })
            })
    }

    openAccountSuccess = async () => {
        await this.props.setParentStateFromChild('dataStep4', this.state)
        this.setState({
            ...this.state,
            isOpenModalOTP: false,
            isOpenAccountSuccess: true
        }, async () => {
            await this.props.setStep(4);
        })
    }

    //Xác thực OTP thành công, lưu user vào cfmast
    activeOTP = async (data) => {
        let { allData, action } = this.props;
        let dataStep3 = allData.dataStep3;
        return RestfulUtils.posttrans('/account/activeopt', {
            OTPCODE: data.OTPCODE,
            newCUSTODYCD: data.p_custodycd,
            FULLNAME: dataStep3.FULLNAME,
            IDCODE: dataStep3.IDCODE_NO,
            OTPTYPE: 'CREATECF', // EDITCF
            LANG: this.props.language,
            OBJNAME: 'OTPCONFIRMCF',
            KEYOTP: this.props.keyOTPRedux
        })
    }

    getInviterEmail = () => {
        let email = '';
        let { allData } = this.props;
        let dataStep1 = allData.dataStep1;
        if (dataStep1.IS_INVITER === 'Y') {
            email = dataStep1.INVITER_EMAIL;
        }
        return email;
    }

    openNewAccountEKYC = async (OTPCODE) => {

        let datanotify = {
            type: "",
            header: "",
            content: ""
        }

        //  call api mở tài khoản
        let res = await RestfulUtils.posttrans('/account/finishgeneralinfo', {
            GeneralInfoMain: this.processDataAPI().GeneralInfoMain,
            GeneralInfoAuth: this.processDataAPI().GeneralInfoAuth,
            GeneralInfoFatca: this.processDataAPI().GeneralInfoFatca,
            language: this.props.language,
            access: this.props.action,
            OBJNAME: 'MANAGERACCT',
            captcha: this.state.inputCaptcha,
            PRESENTER_EMAIL: this.getInviterEmail()
        })

        if (res && res.EC === 0) {
            datanotify.type = "success";
            datanotify.content = this.props.strings.addSuccess;

            let resOTP = await this.activeOTP({ ...res.DT, OTPCODE })
            if (resOTP && resOTP.EC === 0) {
                this.setState({
                    ...this.state,
                    dataNewAccount: res.DT
                }, async () => {
                    await this.openAccountSuccess();
                })
            } else {
                datanotify.type = "error";
                datanotify.content = resOTP.EM;
                this.props.dispatch(showNotifi(datanotify));
            }

        } else {
            if (res.EC == -7777)
                res.EM = this.props.strings.isSameOld
            if (res.EC == -200015)
                res.EM = this.props.strings.errDuplicate
            if (res.EC == -7776)
                res.EM = this.props.strings.invalidCaptcha
            datanotify.type = "error";
            datanotify.content = res.EM;
            this.props.dispatch(showNotifi(datanotify));
        }
    }

    render() {
        let { allData } = this.props
        let { isDisableCaptcha } = this.state
        return (
            <React.Fragment>
                <div className="create-account-4-2">
                    <div className="title-create-account-4-2">{this.props.strings.titleConfirmCreateStep4}</div>
                    <div className="content-create-account-4-2">
                        <div className="confirmNote">{this.props.strings.confirmNote}</div>
                        <div className="">{this.props.strings.lableSentPhone}
                            <span className="note">{allData.dataStep3.PHONE_CONTACT}</span>
                            {this.props.strings.andEmail} <span className="note">{allData.dataStep3.EMAIL}</span>
                        </div>
                        <div className="image-captcha">
                            <div
                                dangerouslySetInnerHTML={{ __html: this.state.imgCaptcha }} />
                            {!isDisableCaptcha &&
                                <i class="fas fa-sync-alt" onClick={this.getCaptcha} title="refresh captcha"></i>}
                        </div>
                        <div className="block-captcha">
                            <div className="col-md-4">
                                <input id="txtFinishCaptcha"
                                    disabled={isDisableCaptcha}
                                    className="form-control" type="text"
                                    value={this.state.inputCaptcha}
                                    onChange={(e) => this.setState({ inputCaptcha: e.target.value })} />
                            </div>
                            <div className="col-md-4" >
                                <input id="btnFinishSentOTP" type="button"
                                    disabled={isDisableCaptcha}
                                    onClick={() => this.confirmCaptchaOpenAccount()}
                                    className="btn btn-warning" style={{ marginLeft: 0, marginRight: 5 }}
                                    value={this.props.strings.sentOTP} />
                            </div>
                            {isDisableCaptcha &&
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
                </div>
                <div className="footer-register">
                    <button className="btn-return"
                        onClick={() => this.handlePrevBtn()}>
                        {this.props.strings.buttonReturn}</button>
                </div>

                <ModalOTPAccount
                    isOpenModalOTPAccount={this.state.isOpenModalOTP}
                    onCloseModalOTPAccount={this.closeModalOTP}
                    dataOTP={this.state.dataOTP}
                    action={this.props.action}
                    openNewAccount={this.openNewAccountEKYC}
                    isEKYC={true}
                    checkDisableCaptcha={this.checkDisableCaptcha}
                //countOTP={this.state.countOTP}
                //setCountOTP={this.setCountOTP}
                />

            </React.Fragment>


        )
    }
}

const stateToProps = state => ({
    newcaptcha: state.newcaptcha,
    auth: state.auth,
    language: state.language.language,
    keyOTPRedux: state.addAccount.keyOTP
});


const decorators = flow([
    connect(stateToProps),
    translate('CreateAccountStep4')
]);

module.exports = decorators(CreateAccountStep4_2);