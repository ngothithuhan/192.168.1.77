import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux';
import TableAccounts from "./TableAccounts";
import ModalAccOverview from './ModalAccOverview'
import AccountDetail from './AccountDetail'
import _ from 'lodash'
import './AccOverview.scss';
import ModalUpsertAccount from 'app/components/VSD/QLTTTK_NDT/QuanLyTK/components/ModalUpsertAccount.js';
import { ACTIONS_ACC } from '../../../../Helpers';

class AccOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowModal: false,
            dataFromRow: {},
            valueSearch: '',
            keySearchAcc: '',
            showModalDetail: false,
            shouldEnablesearch: false,
        };
    }

    handleOnChangeSearch = (event) => {
        this.setState({
            // valueSearch: event.target.value
            keySearchAcc: event.target.value,
            shouldEnablesearch: false,
        })
    }

    handleShowModal = (CUSTID, row) => {
        if (!_.isEmpty(CUSTID) && !_.isEmpty(row)) {
            this.setState({ dataFromRow: row.original, isShowModal: true });
        }
    }

    handleClickSearch = () => {
        this.setState({
            ...this.state,
            shouldEnablesearch: true,
        })
    }

    handleHideModal = () => {
        this.setState({ isShowModal: false });
    }

    handleClickAddNew = () => {
        this.setState({
            showModalDetail: true
        })
    }

    closeModalDetail = () => {
        this.setState({
            ...this.state,
            showModalDetail: false
        })
    }
    render() {
        let { keySearchAcc, shouldEnablesearch } = this.state;
        return (
            <div className="ad-acc-overview-container">
                <div className="ad-acc-overview-header">
                    <div className="title-acc-overview">
                        {this.props.strings.titleMain}
                    </div>
                    <div className="row combo-input">
                        <div className="col-md-4">
                            <input className="ad-acc-search"
                                type="text"
                                value={this.state.keySearchAcc}
                                placeholder="Search here"
                                onChange={(event) => this.handleOnChangeSearch(event)}
                            />
                        </div>
                        <div className="col-md-4">
                            <button className="btn-acc-search"
                                onClick={() => this.handleClickSearch()}
                            >
                                {this.props.strings.btnSearch}
                            </button>
                        </div>
                        <div className="col-md-4">
                            <button className="btn-acc-search" style={{ float: "right" }}
                                onClick={() => this.handleClickAddNew()}
                            >
                                {this.props.strings.btnAdd}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="ad-acc-overview-body">
                    <TableAccounts
                        handleShowModal={this.handleShowModal}
                        handleHideModal={this.handleHideModal}
                        keySearchAcc={keySearchAcc}
                        shouldEnablesearch={shouldEnablesearch}
                    />
                </div>
                <ModalAccOverview
                    handleShowModal={this.handleShowModal}
                    handleHideModal={this.handleHideModal}
                    isShowModal={this.state.isShowModal}
                >
                    <AccountDetail
                        dataFromRow={this.state.dataFromRow}
                    />
                </ModalAccOverview>

                {this.state.showModalDetail &&
                    <ModalUpsertAccount
                        access={ACTIONS_ACC.CREATE}
                        // CUSTID_VIEW={this.state.CUSTID_VIEW}
                        // CUSTODYCD_VIEW={this.state.CUSTODYCD}
                        // title={this.state.titleModPal}
                        showModalDetail={this.state.showModalDetail}
                        closeModalDetail={this.closeModalDetail}
                        // showModalOTPConfirm={this.showModalOTPConfirm.bind(this)}
                        language={this.props.language}
                        OBJNAME={'MANAGERACCT'}
                        // ACCTGRP={this.state.ACCTGRP}
                        dataFromParent={''} //data row edit
                    />
                }
            </div>
        )
    }
}

const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    auth: state.auth,
    language: state.language.language,

});


const decorators = flow([
    connect(stateToProps),
    translate('AccOverview')
]);

module.exports = decorators(AccOverview);
