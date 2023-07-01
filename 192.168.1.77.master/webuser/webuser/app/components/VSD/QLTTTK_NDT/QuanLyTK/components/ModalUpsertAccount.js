import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux';

import EditAccount from 'app/components/OpenAccount/EditAccount/EditAccount';
import { ACTIONS_ACC, USER_TYPE_OBJ, CUSTYPE_CN, CUSTYPE_TC, GRINVESTOR_TN, GRINVESTOR_NN, EVENT } from 'app/Helpers'
import './ModalUpsertAccount.scss';
import { emitter } from 'app/utils/emitter';
import SelectTypeUser from './SelectTypeUser'

class ModalUpsertAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access: 'add',
            CUSTID: '',
            USER_TYPE: '',
            CUSTTYPE: '',
            GRINVESTOR: '',
            isShowCustype: true,
            dataTypeUser: {
                IS_PERSONAL: 'Y',
                IS_CITIZEN: 'Y'
            }
        };
        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on('EVENT.CLOSE_MODAL_DETAIL_ACC', () => {
            this.setState({
                ...this.state,
                isShowCustype: true
            })
        })
    }
    close = () => {
        this.setState({
            ...this.state,
            isShowCustype: false
        }, () => {
            this.props.closeModalDetail();
        })
    }

    handleChangeIsShowCusType = (IS_PERSONAL, IS_CITIZEN) => {
        let GRINVESTOR = '', CUSTTYPE = '';
        CUSTTYPE = IS_PERSONAL === 'Y' ? CUSTYPE_CN : CUSTYPE_TC;
        GRINVESTOR = IS_CITIZEN === 'Y' ? GRINVESTOR_TN : GRINVESTOR_NN;

        this.setState({
            isShowCustype: false,
            GRINVESTOR: GRINVESTOR,
            CUSTTYPE: CUSTTYPE,
        })
    }

    setTypeUser = (typeUser) => {
        this.setState({
            USER_TYPE: typeUser
        })
    }

    setDataTypeUser = (dataTypeUser) => {
        this.setState({
            dataTypeUser: dataTypeUser
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataFromParent && prevProps.dataFromParent !== this.props.dataFromParent) {
            if (this.props.access === ACTIONS_ACC.EDIT) {
                let { dataFromParent } = this.props;
                if (dataFromParent && dataFromParent.GRINVESTOR) {
                    this.setState({
                        GRINVESTOR: dataFromParent.GRINVESTOR
                    })
                }
            }
        }
    }

    backToChooseCustype = () => {
        this.setState({
            ...this.state,
            isShowCustype: true
        })
    }

    getTitleModal = () => {
        let title = '';
        let { language, access } = this.props;

        if (access === ACTIONS_ACC.CREATE) {
            title = language === 'vie' ? 'MỞ TÀI KHOẢN NHÀ ĐẦU TƯ' : 'CREATE CUSTOMER ACCOUNT';
        }
        if (access === ACTIONS_ACC.EDIT) {
            title = language === 'vie' ? 'SỬA TÀI KHOẢN NHÀ ĐẦU TƯ' : 'EDIT CUSTOMER ACCOUNT';
        }

        if (access === ACTIONS_ACC.VIEW) {
            title = language === 'vie' ? 'XEM THÔNG TIN TÀI KHOẢN NHÀ ĐẦU TƯ' : 'VIEW CUSTOMER ACCOUNT';
        }

        if (access === ACTIONS_ACC.CLONE) {
            title = language === 'vie' ? ' Mở TK theo thông tin tài khoản đang có trong hệ thống'
                : 'Open an account according to the current account information in the system';
        }

        return title;
    }
    render() {
        let { isShowCustype } = this.state;
        let { access } = this.props;
        return (
            <Modal
                show={this.props.showModalDetail}
                className={(isShowCustype && access === ACTIONS_ACC.CREATE) ? "modal-show-account-detail modal-size-sm" : "modal-show-account-detail"}
            >
                <Modal.Header >
                    <Modal.Title >
                        <div className="title-content col-md-6">
                            {this.getTitleModal()}
                            <button type="button" className="close" onClick={() => this.close()}>
                                <span aria-hidden="true">×</span><span className="sr-only">Close</span>
                            </button>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="modal-show-account-detail-body">
                        {(isShowCustype && access === ACTIONS_ACC.CREATE) ?
                            <SelectTypeUser
                                setTypeUser={this.setTypeUser}
                                handleChangeIsShowCusType={this.handleChangeIsShowCusType}
                                dataTypeUser={this.state.dataTypeUser}
                                setDataTypeUser={this.setDataTypeUser}
                            />
                            :
                            <React.Fragment>
                                {access === ACTIONS_ACC.CREATE &&
                                    <div className="back-to-choose-cus">
                                        <span onClick={() => this.backToChooseCustype()}>
                                            <i className="fa fa-arrow-left" aria-hidden="true"></i>
                                            Quay trở lại
                                        </span>
                                    </div>
                                }
                                <EditAccount
                                    dataFromParent={this.props.dataFromParent}
                                    //  onClickShowHideEditInfor={this.onClickShowHideEditInfor}
                                    action={this.props.access}
                                    access={this.props.access}
                                    USER_TYPE={this.state.USER_TYPE}
                                    GRINVESTOR={this.state.GRINVESTOR}
                                    CUSTTYPE={this.state.CUSTTYPE}
                                    closeModalDetail={this.close}
                                />
                            </React.Fragment>

                        }
                    </div>

                </Modal.Body>

            </Modal>
        );
    }
}
module.exports = connect(function (state) {
    return { auth: state.auth }
})(ModalUpsertAccount);