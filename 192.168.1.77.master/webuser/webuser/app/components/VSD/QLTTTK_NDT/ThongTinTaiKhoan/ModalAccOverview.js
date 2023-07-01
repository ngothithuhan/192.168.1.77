import React from 'react'
import { Modal, Button } from 'react-bootstrap';
import './ModalAccOverview.scss'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux';
class ModalAccOverview extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { isShowModal, handleHideModal } = this.props
        return (
            <div >
                <Modal
                    className='modal-acc-overview-lg'
                    {...this.props}
                    backdrop={false}
                    keyboard={false}
                    show={isShowModal}
                    onHide={() => handleHideModal()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title className="contained-modal-title-lg">
                            {this.props.strings.titleModal}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.children}
                    </Modal.Body>
                    {/* <Modal.Footer>
                        <Button onClick={() => handleHideModal()}>Close</Button>
                    </Modal.Footer> */}
                </Modal>
            </div >
        )
    }
}

const stateToProps = state => ({
    auth: state.auth,
    language: state.language.language,
});

const decorators = flow([
    connect(stateToProps),
    translate('AccOverview')
]);

module.exports = decorators(ModalAccOverview);
