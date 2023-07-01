import React from 'react';
import NumberFormat from 'react-number-format';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { closeModalConfirm } from 'actionDatLenh';
import { SRTYPE_NR, SRTYPE_NS,SRTYPE_SW, COLORSW, COLORNR, COLORNS } from '../../../../Helpers';


class PopupConfirmOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tempOTP: false,
            title: ''
        };
    }
    onChange(type, event) {
        if (this.props.onChange)
        { 
            // check neu nhap otp thi moi hien popup viewinfo
            if(event) {
                this.setState({
                    tempOTP : true
                })
            }
            this.props.onChange(type, event)
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ title: nextProps.titleConfirm })
    }

    close = (e) => {
        var { dispatch } = this.props;
        dispatch(closeModalConfirm());
        this.props.onChange('OTP', { value: '' })
    }

    async submit() {
        if(this.props.checkShowViewInfo && this.state.tempOTP){
            await this.props.checkShowViewInfo();
        }
        this.props.handleSubmit();
    }

    render() {
        let isDel = this.props.data.action == 'D';
        let ishowOTP = (this.props.OBJNAME !== 'PLACEORDEREX' && this.props.OBJNAME !== 'PLACEORDERSIPEX') && this.props.ISOTP_CONFIRM == 'Y'
        let data = !isDel ? this.props.data : { ...this.props.data.CancelData, SRTYPE: this.props.data.CancelData.EXECTYPE, AMOUNT: { value: this.props.data.CancelData.ORDERVALUE }, QTTY: { value: this.props.data.CancelData.ORDERVALUE } };
        let strSRTYPE =  (data.SRTYPE == SRTYPE_SW)?this.props.strings.SRTYPE_SW :(data.SRTYPE == SRTYPE_NR ? this.props.strings.SRTYPE_NR : this.props.strings.SRTYPE_NS);
        // let isOnline = isDel? this.props.data.CancelData ? this.props.data.CancelData.ISONLINE : this.props.data.AccountInfo.ISONLINE;
        let OBJNAME = this.props.OBJNAME? this.props.OBJNAME :''
        let isOnline ='';
        if (isDel){
            isOnline = this.props.data.CancelData ? this.props.data.CancelData.ISONLINE : ""
        }
        else{
            isOnline = this.props.data.AccountInfo ? this.props.data.AccountInfo.ISONLINE : ""
        }
        let strColorSRTYPE = (isDel ? data.SWSYMBOL : (data.CODEIDHOANDOI ? data.CODEIDHOANDOI.label : null)) ? COLORSW : data.SRTYPE == SRTYPE_NR ? COLORNR : COLORNS;
        return (
            <div className="popup-form">
                <Modal show={this.props.showModal} onHide={this.close}>
                    <Modal.Header>
                        <Modal.Title><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                        <div>
                            <div className="col-xs-9">
                                <div className="col-md-12">
                                    <div className="col-md-12 row"><div className="col-md-12" style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>{this.props.strings.cap1} {this.props.TRDATE}</div></div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-6"><h5><b>{this.props.strings.fullname}</b></h5></div>
                                        <div className="col-md-6"><h5>{this.props.FULLNAME}</h5></div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-6"><h5><b>{this.props.strings.custodycd}</b></h5></div>
                                        <div className="col-md-6"><h5>{isDel ? data.CUSTODYCD : (data.CUSTODYCD ? data.CUSTODYCD.value : '')}</h5></div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-6"><h5><b>{this.props.strings.symbol}</b></h5></div>
                                        <div className="col-md-6"><h5>{isDel ? data.SYMBOL : (data.CODEID ? data.CODEID.label : '')}</h5></div>
                                    </div>
                                    {(isDel ? data.SWSYMBOL : (data.CODEIDHOANDOI ? data.CODEIDHOANDOI.label : null)) && <div className="col-md-12 row">
                                        <div className="col-md-6"><h5><b>{this.props.strings.swsymbol}</b></h5></div>
                                        <div className="col-md-6"><h5>{isDel ? data.SWSYMBOL : (data.CODEIDHOANDOI ? data.CODEIDHOANDOI.label : '')}</h5></div>
                                    </div>} 
                                    {/* ------case them 4 truong hop -------*/}
                                    {(data.SRTYPE == SRTYPE_NS || data.SRTYPE == 'AS' || data.SRTYPE == 'CS') && <div className="col-md-12 row">
                                        <div className="col-md-6"><h5><b>{this.props.isSIP ?this.props.strings.amountmin:this.props.strings.amount}</b></h5></div>
                                        <div className="col-md-6"><h5><NumberFormat value={parseFloat(data.AMOUNT ? data.AMOUNT.value : '')} displayType={'text'} thousandSeparator={true} /></h5></div>
                                    </div>}
                                    {/* {(data.SRTYPE == SRTYPE_NR || data.SRTYPE == SRTYPE_SW) && <div className="col-md-12 row">
                                        <div className="col-md-5"><h5><b>{this.props.strings.qtty}</b></h5></div>
                                        <div className="col-md-7"><h5><NumberFormat value={parseFloat(data.QTTY ? data.QTTY.value : '')} displayType={'text'} thousandSeparator={true}  /></h5></div>
                                    </div>} */}
                                    {(data.SRTYPE == SRTYPE_NR || data.SRTYPE == 'AR' || data.SRTYPE == 'CR') && <div className="col-md-12 row">
                                        <div className="col-md-6"><h5><b>{this.props.strings.qtty}</b></h5></div>
                                        <div className="col-md-6"><h5><NumberFormat value={parseFloat(data.QTTY ? data.QTTY.value : '')} displayType={'text'} thousandSeparator={true} /></h5></div>
                                    </div>}
                                      
                                    {((ishowOTP ) || OBJNAME =='OTPCONFIRMOD') && <div className="col-md-12 row">
                                        <div className="col-md-6"><h5><b>OTP</b></h5></div>
                                        <div className="col-md-6"><input style={{ width: 95 }} id="txtConfirmOTP" className="form-control" type="text" placeholder={this.props.strings.inputOTP} onChange={this.onChange.bind(this, "OTP")} /></div>
                                    </div>}
                                    <div className="col-md-12 row">
                                        <div className="col-md-12" style={{ color: '#Ed1c24' }}><span style={{ textDecoration: 'underline' }}>{this.props.strings.note}</span> {this.props.strings.notedesc}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-3">
                                <div style={{ fontWeight: 'bold', marginTop: '47px', fontSize: '30px', color: strColorSRTYPE, textTransform: 'uppercase', textAlign: 'center', verticalAlign: 'middle' ,marginLeft: '-118px'}}>{strSRTYPE}</div>
                            </div>
                            {  (ishowOTP || OBJNAME =='OTPCONFIRMOD') &&
                            < div className="col-md-12" style={{ textAlign: 'center' }}>
                                <input id="btnaccept" onClick={this.submit.bind(this)} type="button" className="btn btn-primary" style={{ marginRight: 10, width: 120 }} value={this.props.strings.accept} />
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
    showModal: state.datLenh.showModalConfirm,
    tradingdate: state.systemdate.tradingdate,
    language: state.language.language,
});
const decorators = flow([
    connect(stateToProps),
    translate('PopupConfirmOrder')
]);
module.exports = decorators(PopupConfirmOrder);

