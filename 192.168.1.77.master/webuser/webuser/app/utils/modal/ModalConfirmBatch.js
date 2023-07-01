import React from 'react';
import flow from 'lodash.flow';
import { connect } from 'react-redux'
import translate from 'app/utils/i18n/Translate.js';
import { Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

class ModalConfirmBatch extends React.Component {
    access() {
        console.log('đồng ý');

        this.props.access();
    }
    close() {
        this.props.onHide();
    }
    render() {
        
        return (
            <Modal
                show={this.props.show} onHide={this.close.bind(this)} bsSize="small" aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg"><div style={{ fontSize: "15px", fontWeight: "700", color: "#765e5e", marginLeft:"35%" }} className="title-order">Thông báo</div></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-12">{this.props.strings.question}</div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close.bind(this)}>{this.props.strings.no} </Button>
                    <Button bsStyle="primary" onClick={this.access.bind(this)}>{this.props.strings.yes}</Button>
                </Modal.Footer>
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
    translate('ModalConfirmBatch')
]);

module.exports = decorators(ModalConfirmBatch);
