import React from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { toast } from "react-toastify";
import './ModalWarningBankAcc.scss';

class ModalWarningBankAcc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        let { isShowModalWarning, onCloseModalWarning } = this.props;
        return (
            <div className="modal-warning-bank-acc">
                <Modal show={isShowModalWarning} className="modal-warning-bank-acc-container">
                    <div className="modal-warning-bank-acc-tittle">
                        <div className="mwba-title">
                            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                            <span>{this.props.strings.title}</span>
                        </div>
                        <div className="mwba-close">
                            <i class="fa fa-times" aria-hidden="true" onClick={onCloseModalWarning}></i>
                        </div>
                    </div>
                    <div className="modal-warning-bank-acc-body">
                        <p>
                            {this.props.strings.content}
                        </p>
                        <div className="all-buttons">
                            <button className="mwba-btn-disagree" onClick={onCloseModalWarning}>{this.props.strings.disagree}</button>
                            <button className="mwba-btn-agree" onClick={onCloseModalWarning}>{this.props.strings.agree}</button>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalWarningBankAcc')
]);
module.exports = decorators(ModalWarningBankAcc);

