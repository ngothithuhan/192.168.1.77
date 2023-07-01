import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import CanBoXacNhanOTP from 'app/components/VSD/CanBoXacNhanOTP/components/CanBoXacNhanOTP'
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import PopupWarningOpenAcc3 from '../PopupWarningOpenAcc3'
import { showModalWarningInfoOpenAcc } from 'actionDatLenh';
class ModalOTPConfirm2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openupdate: false,
            successs: false
        };
    }
    close() {
        this.props.closeModalOTPConfirm();
    }
    showModalWarningInfoOpenAcc() {
        var { dispatch } = this.props;
        this.setState({ openupdate: true })
        dispatch(showModalWarningInfoOpenAcc());
    }
    showModalUpdate() {
        console.log('jump to showModalUpdate')
        this.setState({ openupdate: true })
    }
    componentWillReceiveProps(nextProps) {
        //console.log('componentWillReceiveProps',nextProps)
        this.setState({ ...this.state, access: nextProps.access, successs: nextProps.successs })
    }
    render() {
        console.log('confirm 2 render::::', this.state)
        return (
            <React.Fragment>
                <Modal show={this.props.showModalOTPConfirm} bsSize="sm" centered backdropClassName="secondModal" onHide={this.close.bind(this)}>
                    <Modal.Header>
                        <Modal.Title><div className="title-content col-md-6">{this.props.strings.title}<button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                        <CanBoXacNhanOTP
                            submitlater={this.close.bind(this)}
                            showModalWarningInfoOpenAcc={this.showModalWarningInfoOpenAcc.bind(this)}
                            showModalWarningInfoOpenAccUpdate={this.showModalUpdate.bind(this)}
                            ISQLTK={true}
                            OBJNAME={this.props.OBJNAME}
                            access={this.state.access}
                            confirmSuccess={this.props.confirmSuccess}
                            isMini={true}
                            dataOTP={this.props.dataOTP}
                        />
                    </Modal.Body>
                </Modal>
                <PopupWarningOpenAcc3
                    dataFinish={this.props.dataOTP}
                    closeModalOTPConfirm={this.props.closeModalOTPConfirm}
                    openmodal={this.state.successs} />
            </React.Fragment>
        );
    }
}
const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth,
    showModal: state.datLenh.showModalWarningInfoOpenAcc
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalOTPConfirm2')
]);
module.exports = decorators(ModalOTPConfirm2);

