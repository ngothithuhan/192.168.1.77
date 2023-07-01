import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import CanBoXacNhanOTP from 'app/components/VSD/CanBoXacNhanOTP/components/CanBoXacNhanOTP'
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import PopupWarningOpenAcc from '../PopupWarningOpenAcc'
import { showModalWarningInfoOpenAcc } from 'actionDatLenh';
import { emitter } from 'app/utils/emitter';
import { EVENT } from 'app/Helpers.js'
class ModalOTPConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on(EVENT.TIME_UP_CLOSE_OTP, async (data) => {
            await this.props.closeModalOTPConfirm();
        })
    }

    close() {
        console.log('off otp')
        this.props.closeModalOTPConfirm();
    }
    showModalWarningInfoOpenAcc() {
        var { dispatch } = this.props;
        dispatch(showModalWarningInfoOpenAcc());
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.access && nextProps.access && this.props.access !== nextProps.access) {
            this.setState({ ...this.state, access: nextProps.access })
        }
    }
    componentDidMount() {
        if (this.props.access) {
            this.setState({
                ...this.state,
                access: this.props.access
            })
        }
    }
    render() {
        return (
            <div>
                {/* <PopupWarningOpenAcc
                    dataFinish={this.props.dataOTP}
                    closeModalOTPConfirm={this.props.closeModalOTPConfirm}
                /> */}
                <Modal show={this.props.showModalOTPConfirm}
                    backdrop={'static'} //clickout sẽ ko đóng modal
                    keyboard={false}
                    bsSize="sm" backdropClassName="secondModal"
                    onHide={this.close.bind(this)} >
                    <Modal.Header>
                        {/* Xác nhận OTP */}
                        <Modal.Title>
                            <div className="title-content col-md-6">
                                {this.props.strings.title}
                                <button type="button" className="close" onClick={this.close.bind(this)}>
                                    <span aria-hidden="true">×</span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                        <div className="col-md-12">
                        </div>
                        <div className="panel-body ">
                            <div className="col-md-12 module">
                                <CanBoXacNhanOTP
                                    submitlater={this.close.bind(this)}
                                    showModalWarningInfoOpenAcc={() => this.showModalWarningInfoOpenAcc()}
                                    ISQLTK={true}
                                    OBJNAME={this.props.OBJNAME}
                                    access={this.state.access}
                                    confirmSuccess={this.props.confirmSuccess}
                                    isMini={true} dataOTP={this.props.dataOTP}
                                    openAccountSuccess={this.props.openAccountSuccess}
                                />
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>

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
    translate('ModalOTPConfirm')
]);
module.exports = decorators(ModalOTPConfirm);

