import React from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import './ModalWarningSipPeriod.scss';

class ModalWarningSipPeriod extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            p_minterm: '',
            p_checkmiss: '',
            p_feerate: '',
        };
    }

    componentDidMount() {
        
    }
    
    render() {
        let { isShowModal, onCloseModal, onConfirmModal, OrderSaleInfo } = this.props;

        return (
            <div className="popup-form">
                <Modal show={isShowModal} className="modal-warning-sip-period-container" >
                    <div className="modal-waring-sip-title">
                        <div className="mws-text">
                            <i className="fa fa-exclamation-triangle" aria-hidden="true" ></i>
                            <span>Cảnh báo</span>
                        </div>
                        <div className="mws-close">
                            <i className="fa fa-times" aria-hidden="true" onClick={onCloseModal}></i>
                        </div>
                    </div>
                    <div className="modal-warning-sip-body">
                        <p> Quý khách chưa tham gia đủ {OrderSaleInfo.minterm} kỳ SIP {OrderSaleInfo.cycletype}.
                        Vì vậy khi thực hiện lệnh bán này, Quý khách sẽ chịu thêm Giá Dịch Vụ chấm dứt SIP
                        (bằng {OrderSaleInfo.feerate}% của giá trị Chứng Chỉ Quỹ bán/chuyển đổi)
                        ngoài giá dịch vụ mua lại/ giá dịch vụ chuyển đổi thông thường.
                        </p>
                    </div>
                    <div className="modal-warning-sip-footer">
                        <button type="button" className="btn-sip-not-accept" onClick={onCloseModal}>Không đồng ý</button>
                        <button type="button" className="btn-sip-accept" onClick={onConfirmModal}>Đồng ý</button>
                    </div>
                </Modal>
            </div>
        )
    }
}

const stateToProps = state => ({
    language: state.language.language,
    showModal: state.datLenh.showModalViewInfo,
    tradingdate: state.systemdate.tradingdate
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalWarningSipPeriod')
]);
module.exports = decorators(ModalWarningSipPeriod);

