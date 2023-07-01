import React from 'react';
import flow from 'lodash.flow';
import { connect } from 'react-redux'
import translate from 'app/utils/i18n/Translate.js';
import { Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import './ModalConfirmChangePass.scss'
class ModalConfirmChangePass extends React.Component {

    render() {
        let { access, onHide } = this.props;
        return (
            <Modal show={this.props.show} onHide={onHide} bsSize="md" className="modal-confirm-change-pass">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div className="modal-cf-change-pass-title">
                            {this.props.strings.requiredchangepass1}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row modal-cf-change-pass-body">
                        <div className="col-md-12 line-1">
                            {this.props.strings.requiredchangepass2}
                        </div>
                        <div className="col-md-12 line-2 text-left">
                            {this.props.strings.requiredchangepass3}
                        </div>
                        <div className="col-md-12 line-3 text-left">
                            {this.props.strings.requiredchangepass4}
                        </div>
                        <div className="col-md-12 line-4">
                            <button onClick={access} type="button">{this.props.strings.yes}</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
};

const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language,
    tradingdate: state.systemdate.tradingdate
});


const decorators = flow([
    connect(stateToProps),
    translate('ModalConfirmChangePass')
]);

module.exports = decorators(ModalConfirmChangePass);
