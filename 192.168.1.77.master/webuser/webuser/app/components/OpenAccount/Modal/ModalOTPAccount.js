import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { emitter } from 'app/utils/emitter';
import { EVENT, COUNT_OTP_FAIL } from 'app/Helpers.js';
import './ModalOTPAccount.scss';
import DropdownFactory from 'app/utils/DropdownFactory.js';
import CountDown from 'app/utils/CountDown/CountDown.js';
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { ACTIONS_ACC } from '../../../Helpers';

class ModalOTPAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            OTPCODE: '',
            //countOTP: 1, //đếm số lần submit otp
        };
        this.listenToEmitter();
    }

    listenToEmitter() {
        // emitter.on(EVENT.TIME_UP_CLOSE_OTP, async (data) => {
        //     await this.props.closeModalOTPConfirm();
        // })
    }


    componentDidMount() {
        if (this.props.access) {
            this.setState({
                ...this.state,
                access: this.props.access
            })
        }
    }
    getInforAccount = () => {

    }

    onChange(event, type) {
        let copyState = { ...this.state };
        copyState[type] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    onTimesUp = () => {
        emitter.emit(EVENT.TIME_UP_CLOSE_OTP, '');
    }

    onSubmitOTP = async () => {
        let { OTPCODE } = this.state;
        let datanotify = {
            type: "",
            header: "",
            content: ""
        }
        if (!OTPCODE) {
            datanotify.type = "error";
            datanotify.content = 'Vui lòng nhập OTP'
            this.props.dispatch(showNotifi(datanotify));
            window.$(`#txtOtpcode`).focus();
        }

        //validate OTP
        let { keyOTPRedux } = this.props; //lấy từ redux, lưu vào redux tại bước verify captcha
        let res = await RestfulUtils.post('/otp/checkUpsertAccOTP', {
            KEYOTP: keyOTPRedux,
            OTPVAL: OTPCODE
        });
        if (res && +res.EC === 0 && res.DT && +res.DT.p_code_check === 0 && +res.DT.p_code_check === 0) {
            //open EKYC
            if (this.props.action === ACTIONS_ACC.CREATE && this.props.isEKYC === true) {
                this.props.openNewAccount(OTPCODE);
            } else {
                this.props.upsertAccount(false, OTPCODE);
            }
        } else {
            //this.props.setCountOTP()
            console.log('run exx', res)
            datanotify.type = "error";
            if (res.EC === -101333) {
                datanotify.content = `[${res.EC}] - ${res.EM}`;
            } else {
                if (res.DT.p_err_param === 'SUCCESS' || res.DT.p_code_check === "-100094") {
                    datanotify.content = `${res.DT.p_err_param}`;
                }
                else {
                    if (res.EC === -100235) {
                        datanotify.content = `${res.EM}`;
                        this.props.onCloseModalOTPAccount()
                        this.props.checkDisableCaptcha(true)
                    } else {
                        datanotify.content = `[${res.EC}] - ${res.EM}`;
                    }

                }
            }
            this.props.dispatch(showNotifi(datanotify));
            window.$(`#txtOtpcode`).focus();
        }
    }

    render() {
        let { isOpenModalOTPAccount, onCloseModalOTPAccount, dataOTP } = this.props
        return (
            <Modal
                show={isOpenModalOTPAccount}
                backdrop={'static'} //clickout sẽ ko đóng modal
                keyboard={false}
                bsSize="sm"
                onHide={onCloseModalOTPAccount}
                className="modal-otp-account"
            >
                <Modal.Header>
                    <Modal.Title>
                        <div className="title-content col-md-6">
                            {this.props.strings.title}
                            <button type="button" className="close" onClick={onCloseModalOTPAccount}>
                                <span aria-hidden="true">×</span>
                                <span className="sr-only">Close</span>
                            </button>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <div className="row">
                        <div className="col-md-12 form-group add-pb-10">
                            <label>Số ĐKSH</label>
                            <input className="form-control" disabled type="text" value={dataOTP && dataOTP.IDCODE ? dataOTP.IDCODE : ''} />
                        </div>

                        <div className="col-md-12 form-group add-pb-10">
                            <label>Họ tên</label>
                            <input className="form-control" disabled type="text" value={dataOTP && dataOTP.FULLNAME ? dataOTP.FULLNAME : ''} />
                        </div>

                        <div className="col-md-12 form-group add-pb-10">
                            <label>Loại GD</label>
                            <DropdownFactory
                                disabled={true}
                                // onSetDefaultValue={this.onSetDefaultValue}
                                ID="CFOTPTYPE"
                                value="CFOTPTYPE"
                                CDTYPE="CF"
                                CDNAME="CFOTPTYPE"
                                CDVAL={this.props.action === ACTIONS_ACC.CREATE ? 'OPENCF' : 'EDITCF'}

                            />
                        </div>

                        {/* Mã OTP */}
                        <div className="col-md-12 form-group add-pb-10">
                            <label>Mã OTP</label>
                            <div className="timer-container">
                                <input
                                    maxLength='10'
                                    onChange={(event) => this.onChange(event, "OTPCODE")}
                                    className="form-control" type="text"
                                    placeholder={this.props.strings.otpcode}
                                    id="txtOtpcode"
                                />
                                <CountDown
                                    duration={true}
                                    onTimesUp={this.onTimesUp}
                                />
                            </div>
                        </div>

                        <div className="col-md-12">
                            <button
                                onClick={() => this.onSubmitOTP()}
                                type="button"
                                className="btn-submit-otp"
                            >
                                XÁC NHẬN
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth,
    keyOTPRedux: state.addAccount.keyOTP
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalOTPConfirm')
]);
module.exports = decorators(ModalOTPAccount);

