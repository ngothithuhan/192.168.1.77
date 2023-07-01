import React from 'react';
import NumberFormat from 'react-number-format';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { closeModalConfirm } from 'actionDatLenh';
import {
    SRTYPE_NR, SRTYPE_NS, SRTYPE_SW, COLORSW, COLORNR, COLORNS, COUNTDOWN_PLACEORDER,
    EVENT,
    METHODS_FLEX,
} from '../../../../Helpers';
import { emitter } from 'app/utils/emitter';
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import CountDown from 'app/utils/CountDown/CountDown';
class PopupConfirmOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tempOTP: false,
            title: '',
            count: COUNTDOWN_PLACEORDER, //tính theo giây
            isFirstTime: true, //chạy đúng 1 lần
            p_penaltysipfee: '',
            p_amt: '',
            p_tax: '',
        };
    }
    onChange(type, event) {
        if (this.props.onChange) {
            // check neu nhap otp thi moi hien popup viewinfo
            if (event) {
                this.setState({
                    tempOTP: true
                })
            }
            this.props.onChange(type, event)
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ title: nextProps.titleConfirm })
    }

    close = (e) => {
        var { dispatch, isCustom } = this.props;
        dispatch(closeModalConfirm());
        this.props.refresh();
        if (isCustom) {
            this.props.onChange('OTP', { value: '' });
            this.cancelOrder();
        }
    }

    async submit() {
        if (this.props.checkShowViewInfo && this.state.tempOTP) {
            await this.props.checkShowViewInfo();
        }
        this.props.handleSubmit();
    }

    componentDidMount() {
        this.getTitlePopup();
    }

    componentDidUpdate(prevProps, prevState) {
        let { count, isFirstTime } = this.state;
        if (this.props.showModal !== prevProps.showModal && this.props.showModal === true) {
            this.getOrderSellInfo();
        }
        if (count !== prevState.count && count === 0 && isFirstTime) {


        }
    }

    getTitlePopup = () => {
        let { data, isSIP } = this.props;
        let action = data.action;

        //action !== delete
        if (action !== 'D') {
            // let modalContent = document.getElementsByClassName('cancel-modal-body');
            // if (modalContent.length > 0) {
            //     modalContent.classList.remove('cancel-modal-body')
            // }
            if (data.SRTYPE == SRTYPE_NS && !isSIP) {
                return <span className="popc-title">{this.props.strings.titleNS}</span>;
            }
            if (data.SRTYPE == SRTYPE_NR && !isSIP) {
                return <span className="popc-title">{this.props.strings.titleNR}</span>;
            }
            if (data.SRTYPE == SRTYPE_SW && !isSIP) {
                return <span className="popc-title">{this.props.strings.titleSW}</span>;
            }
            if (data.SRTYPE == SRTYPE_NS && isSIP) {
                return <span className="popc-title">{this.props.strings.titleNSSIP}</span>;
            }
            if (data.SRTYPE == SRTYPE_NR && isSIP) {
                return <span className="popc-title">{this.props.strings.titleNRSIP}</span>;
            }
            if (data.SRTYPE == SRTYPE_SW && isSIP) {
                return <span className="popc-title">{this.props.strings.titleSWSIP}</span>;
            }
        }
        if (action === 'D') {
            // let modalContent = document.getElementById('custom-modal-body');
            // if (modalContent) {
            //     modalContent.classList.add('cancel-modal-body')
            // }
            return <span className="popc-title">Hủy lệnh</span>
        }

        return <span>Default title</span>

    }

    getOrderSellInfo() {
        //console.log('getOrderSellInfo:::popup:::', this.props.data.SRTYPE)
        let obj = {
            p_custodycd: this.props.data.CUSTODYCD ? this.props.data.CUSTODYCD.value : '',
            p_codeid: this.props.data.CODEID ? this.props.data.CODEID.value : '',
            p_qtty: this.props.data.QTTY ? this.props.data.QTTY.value : 0,
            p_issip: this.props.isSIP ? 'Y' : 'N',
            p_srtype: this.props.data.SRTYPE,
            OBJNAME: this.props.OBJNAME,
            language: this.props.language
        };
        RestfulUtils.post('/order/getOrderSellInfo', obj).then(resData => {
            if (resData.EC == 0) {
                if (resData.DT && resData.DT.length > 0) {
                    this.setState({
                        p_penaltysipfee: resData.DT[0].PENALTYFEE,
                        p_amt: resData.DT[0].AMT,
                        p_tax: resData.DT[0].TAX,
                    })
                }
            }
        })
    }

    //hủy lệnh khi hết OTP
    cancelOrder() {
        let dataFromParent = this.props.data;
        console.log(">>>> placeorder fire event emitter 000, dataFromParent ", dataFromParent)

        if (dataFromParent && dataFromParent.ORDERID) {
            console.log(">>>> placeorder fire event emitter 111 orderid: ", dataFromParent.ORDERID)

            let event = this.props.isSIP ? EVENT.CANCEL_ORDER_IF_TIMEOUT_SIP : EVENT.CANCEL_ORDER_IF_TIMEOUT_NORMAL;
            //off logic auto hủy lệnh khi đóng popup otp/otp hết hiệu lực
            // emitter.emit(event, dataFromParent);
        }
    }
    onTimesUp = () => {
        this.close(); //close popup
        let datanotify = {
            type: "",
            header: "",
            content: ""
        }
        datanotify.type = "error";
        datanotify.content = 'Mã OTP đã hết hiệu lực';
        this.props.dispatch(showNotifi(datanotify));
        this.cancelOrder()
    }

    render() {
        let { methods } = this.props;
        let isDel = this.props.data.action == 'D';
        let ishowOTP = (this.props.OBJNAME !== 'PLACEORDEREX' && this.props.OBJNAME !== 'PLACEORDERSIPEX') && this.props.ISOTP_CONFIRM == 'Y'
        let data = !isDel ? this.props.data : { ...this.props.data.CancelData, SRTYPE: this.props.data.CancelData.EXECTYPE, AMOUNT: { value: this.props.data.CancelData.ORDERVALUE }, QTTY: { value: this.props.data.CancelData.ORDERVALUE } };
        let strSRTYPE = (data.SRTYPE == SRTYPE_SW) ? this.props.strings.SRTYPE_SW : (data.SRTYPE == SRTYPE_NR ? this.props.strings.SRTYPE_NR : this.props.strings.SRTYPE_NS);
        // let isOnline = isDel? this.props.data.CancelData ? this.props.data.CancelData.ISONLINE : this.props.data.AccountInfo.ISONLINE;
        let OBJNAME = this.props.OBJNAME ? this.props.OBJNAME : ''
        let isOnline = '';
        if (isDel) {
            isOnline = this.props.data.CancelData ? this.props.data.CancelData.ISONLINE : ""
        }
        else {
            isOnline = this.props.data.AccountInfo ? this.props.data.AccountInfo.ISONLINE : ""
        }
        let strColorSRTYPE = (isDel ? data.SWSYMBOL : (data.CODEIDHOANDOI ? data.CODEIDHOANDOI.label : null)) ? COLORSW : data.SRTYPE == SRTYPE_NR ? COLORNR : COLORNS;
        let { count } = this.state;
        let { isSIP } = this.props;

        let classNameBody = isDel ? 'modal-body cancel-modal-body' : 'modal-body'

        //trong trường hợp emit hủy lệnh ko lấy đc data row, cần gán lại symbol để hiển thị
        if (isDel && data.CODEID && !data.CODEID.label && !data.SYMBOL && data.CODEID_OBJECT && data.CODEID_OBJECT.label) {
            data.SYMBOL = data.CODEID_OBJECT.label;
        }

        return (
            <div className="popup-form">
                <Modal
                    show={this.props.showModal}
                    onHide={this.close}
                    backdrop={'static'} //clickout sẽ ko đóng modal
                    keyboard={false} //clickout sẽ ko đóng modal
                    className="place-order-popup-confirm">
                    <Modal.Header>
                        <Modal.Title>
                            <div className="new-title-content col-md-6">
                                {this.getTitlePopup()}
                                <button type="button" className="close" onClick={this.close}>
                                    <span aria-hidden="true">×</span><span className="sr-only">Close</span>
                                </button>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body id="custom-modal-body" className={classNameBody} style={{ overflow: "auto", height: "100%" }}>
                        <div className="row custom-row">
                            <div className="col-md-12 cap1">
                                <span>{this.props.strings.cap1}</span> <span className="text-orange">{this.props.TRDATE}</span>
                            </div>
                            <hr />
                            <div className="col-md-6 po-pt-10 ">
                                <div className="text-bold">{this.props.strings.fullname}</div>
                                <div className="title-custom-small">{this.props.FULLNAME}</div>
                            </div>
                            <div className="col-md-6 po-pt-10">
                                <div className="text-bold">{this.props.strings.custodycd}</div>
                                <div className="title-custom-small"> {isDel ? data.CUSTODYCD : (data.CUSTODYCD ? data.CUSTODYCD.value : '')}</div>
                            </div>

                            <div className="col-md-6 po-pt-10 po-pb-10">
                                <div className="text-bold">{this.props.strings.symbol}</div>
                                <div className="title-custom-small">
                                    {isDel ? data.SYMBOL : (data.CODEID ? data.CODEID.label : '')}
                                </div>
                            </div>

                            {/* ------case them 4 truong hop -------*/}

                            {/* {(data.SRTYPE == SRTYPE_NR || data.SRTYPE == SRTYPE_SW) && <div className="col-md-12 row">
                                        <div className="col-md-5"><h5><b>{this.props.strings.qtty}</b></h5></div>
                                        <div className="col-md-7"><h5><NumberFormat value={parseFloat(data.QTTY ? data.QTTY.value : '')} displayType={'text'} thousandSeparator={true}  /></h5></div>
                                    </div>} */}
                            {
                                (data.SRTYPE == SRTYPE_NR || data.SRTYPE == 'AR' || data.SRTYPE == 'CR') &&
                                <div className="col-md-6 po-pt-10 po-pb-10">
                                    <div className="text-bold">{this.props.strings.qtty}</div>
                                    <div className="title-custom-small">
                                        <NumberFormat value={parseFloat(data.QTTY ? data.QTTY.value : '')} displayType={'text'} thousandSeparator={true} />
                                    </div>
                                </div>
                            }
                            {
                                (data.SRTYPE == SRTYPE_NS || data.SRTYPE == 'AS' || data.SRTYPE == 'CS') &&
                                <div className="col-md-6 po-pt-10 po-pb-10">
                                    <div className="text-bold">
                                        {/* {(this.props.isSIP && methods !== METHODS_FLEX) ? this.props.strings.amount : this.props.strings.amountmin}*/}
                                        {isSIP === true ? (methods !== METHODS_FLEX ? this.props.strings.amount : this.props.strings.amountmin) : ''}
                                        {isSIP === false ? this.props.strings.amount : ''}
                                    </div>
                                    <div className="title-custom-small">
                                        {methods === METHODS_FLEX && (
                                            <NumberFormat value={parseFloat(data.TRADINGCYCLE ? data.TRADINGCYCLE.minamt : '')} displayType={'text'} thousandSeparator={true} />
                                        )}
                                        {methods !== METHODS_FLEX && (
                                            <NumberFormat value={parseFloat(data.AMOUNT ? data.AMOUNT.value : '')} displayType={'text'} thousandSeparator={true} />
                                        )}
                                    </div>
                                </div>
                            }
                            {
                                (isDel ? data.SWSYMBOL : (data.CODEIDHOANDOI ? data.CODEIDHOANDOI.label : null)) &&
                                <div className="col-md-6 po-pt-10 po-pb-10">
                                    <div className="text-bold">{this.props.strings.swsymbol}</div>
                                    <div className="title-custom-small">{isDel ? data.SWSYMBOL : (data.CODEIDHOANDOI ? data.CODEIDHOANDOI.label : '')}</div>
                                </div>
                            }


                            {/* hiện thêm thông tin với lệnh bán và lệnh chuyển đổi */}
                            {(data.SRTYPE == SRTYPE_NR || data.SRTYPE == SRTYPE_SW) &&
                                <React.Fragment>
                                    <div className="col-md-6 po-pt-10 po-pb-10">
                                        <div className="text-bold">Phí bán dự kiến</div>
                                        <div className="title-custom-small">
                                            <NumberFormat value={parseFloat(this.state.p_amt)} displayType={'text'} thousandSeparator={true} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 po-pt-10 po-pb-10">
                                        <div className="text-bold">{this.props.strings.penaltysipfee}</div>
                                        <div className="title-custom-small">
                                            <NumberFormat value={parseFloat(this.state.p_penaltysipfee)} displayType={'text'} thousandSeparator={true} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 po-pt-10 po-pb-10" style={{ float: 'none' }}>
                                        <div className="text-bold">Thuế GD dự kiến</div>
                                        <div className="title-custom-small">
                                            <NumberFormat value={parseFloat(this.state.p_tax)} displayType={'text'} thousandSeparator={true} />
                                        </div>
                                    </div>
                                </React.Fragment>
                            }

                            <hr />


                            {
                                ((ishowOTP) || OBJNAME == 'OTPCONFIRMOD') &&
                                <div className="col-md-12  po-pt-10 ">

                                    <div className="text-center style-text-OTP">Nhập mã OTP</div>
                                    <div className="po-pt-10 timer-container">
                                        <input style={{ width: '100%' }} id="txtConfirmOTP"
                                            className="form-control" type="text" placeholder={this.props.strings.inputOTP}
                                            onChange={this.onChange.bind(this, "OTP")} />
                                        {/* <i class="fa fa-clock-o" aria-hidden="true"><span>{this.formatTimeToMinute(count)}</span></i> */}

                                        <CountDown
                                            duration={true}
                                            onTimesUp={this.onTimesUp}
                                        />
                                    </div>
                                </div>
                            }

                            <div className="col-md-12 po-pt-10">
                                <div style={{ color: '#Ed1c24' }}>
                                    <span style={{ textDecoration: 'underline' }}>
                                        {this.props.strings.note}
                                    </span> {this.props.strings.notedesc}
                                </div>
                            </div>

                            {/* mua, bán, chuyển đổi ... */}
                            {/* <div className="col-xs-3">
                                <div style={{ fontWeight: 'bold', marginTop: '47px', fontSize: '30px', color: strColorSRTYPE, textTransform: 'uppercase', textAlign: 'center', verticalAlign: 'middle', marginLeft: '-118px' }}>
                                    {strSRTYPE}
                                </div>
                            </div> */}
                            {(ishowOTP || OBJNAME == 'OTPCONFIRMOD') &&
                                < div className="col-md-12 po-pt-10" style={{ textAlign: 'center' }}>
                                    <input id="btnaccept"
                                        onClick={this.submit.bind(this)} type="button"
                                        className="btn-accept-otp"
                                        value={this.props.strings.accept} />
                                    {this.props.ISCANCEL && <input id="btncancel" onClick={this.props.handleCancel} type="button" className="btn btn-danger" style={{ marginLeft: 15, width: 120 }} value={this.props.strings.cancel} />}
                                </div>}
                        </div>
                    </Modal.Body>

                </Modal>
            </div>
        )
    }
}

const stateToProps = state => ({
    tradingdate: state.systemdate.tradingdate,
    language: state.language.language,
});
const decorators = flow([
    connect(stateToProps),
    translate('PopupConfirmOrder')
]);
module.exports = decorators(PopupConfirmOrder);

