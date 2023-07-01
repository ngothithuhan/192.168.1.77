import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from 'app/utils/RestfulUtils';

import TableViewTranshistHistory from './components/TableViewTranshistHistory'


import './ModalViewTranshistHistory.scss'


class ModalViewTranshistHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div className='view-trans-history'>
                <Modal
                    show={this.props.showModalViewTranHistory}
                    className='modal-view-history'
                >
                    <Modal.Header >
                        <Modal.Title >
                            <div className="title-content col-md-6">
                                {/* {this.getTitleModal()} */}Lịch sử giao dịch
                                <button type="button" className="close" onClick={() => this.props.closeModalViewTranHistory()}>
                                    <span aria-hidden="true">×</span><span className="sr-only">Close</span>
                                </button>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                        <div className="modal-view-transhist-history-body">
                            {/* table */}
                            <TableViewTranshistHistory />
                        </div>

                    </Modal.Body>

                </Modal>
            </div >
        )
    }
}

const stateToProps = state => ({
    notification: state.notification,
    language: state.language.language,
    auth: state.auth
});

const decorators = flow([
    connect(stateToProps),
    translate('ModalViewTranshistHistory')
]);

module.exports = decorators(ModalViewTranshistHistory);