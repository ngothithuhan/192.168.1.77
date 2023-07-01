import React, { Component, Fragment } from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import WizardComponent from "../Wizard/WizardComponent";
import '../CreateAccount.scss';
import { ACTIONS_ACC, USER_TYPE_OBJ, CUSTYPE_CN, CUSTYPE_TC, GRINVESTOR_TN, GRINVESTOR_NN } from 'app/Helpers'

import EditAccountStep1 from './EditAccountStep1';
import EditAccountStep2 from './EditAccountStep2';
import EditAccountStep3 from './EditAccountStep3';
import EditAccountStep4 from './EditAccountStep4';
import _ from 'lodash';


class EditAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 1,
            allDataEdit: {
                dataStep1: {},
                dataStep2: {},
                dataStep3: {},
                dataStep4: {},
                isLoading: true,
                USER_TYPE: ''
            },
        }
    }

    processDataMain = (dataMain) => {
        let type = '';
        if (dataMain && !_.isEmpty(dataMain)) {
            if (dataMain.CUSTTYPE && dataMain.CUSTTYPE === CUSTYPE_CN) {
                if (dataMain.GRINVESTOR && dataMain.GRINVESTOR === GRINVESTOR_TN) {
                    type = USER_TYPE_OBJ.CNTN;
                } else if (dataMain.GRINVESTOR && dataMain.GRINVESTOR === GRINVESTOR_NN) {
                    type = USER_TYPE_OBJ.CNNN;
                }
            } else if (dataMain.CUSTTYPE && dataMain.CUSTTYPE === CUSTYPE_TC) {
                if (dataMain.GRINVESTOR && dataMain.GRINVESTOR === GRINVESTOR_TN) {
                    type = USER_TYPE_OBJ.TCTN;
                } else if (dataMain.GRINVESTOR && dataMain.GRINVESTOR === GRINVESTOR_NN) {
                    type = USER_TYPE_OBJ.TCNN;
                }
            }
            dataMain = Object.assign(dataMain, { 'USER_TYPE': type });
            return dataMain;
        }
        return [];
    }

    //lấy thông tin cả 3 step, tuy nhiên, step 1 bị ghi đè bởi getcfmastbycustid
    getCfmastinfo = (inputs) => {
        return new Promise(async (resolve, reject) => {
            let res = await RestfulUtils.post("/account/getcfmastinfo", {
                OBJNAME: "MANAGERACCT",
                custodycd: inputs.custodycd ? inputs.custodycd : "988C000127",
                language: inputs.language ? inputs.language : "vie"
            })
            let dataAuth = res.EC === 0 ? res.DT.dataAuth : []
            let dataFatca = res.EC === 0 ? res.DT.dataFatca : []
            let dataMain = res.EC === 0 ? this.processDataMain(res.DT.dataMain) : []
            resolve({ dataAuth, dataFatca, dataMain })
        })
    }

    //lấy thông tin step 1
    getcfmastbycustid = (inputs) => {
        // return {}
        //api đang lỗi
        return new Promise(async (resolve, reject) => {
            let res = await RestfulUtils.post("/account/getcfmastbycustid", inputs);
            let result = res.EC === 0 ? res.DT[0] : [];
            resolve(result)
        })
    }

    async componentDidMount() {
        let { dataFromParent, action } = this.props;
        let allDataEditCopy = { ...this.state.allDataEdit };
        allDataEditCopy.isLoading = false;

        // trường hợp sửa tài khoản, gán thông tin sửa vào state || or view infor
        if (action === ACTIONS_ACC.EDIT || action === ACTIONS_ACC.VIEW || action === ACTIONS_ACC.CLONE) {
            if (dataFromParent && !_.isEmpty(dataFromParent)) {
                await this.getCfmastinfo({
                    custodycd: dataFromParent.CUSTODYCD ? dataFromParent.CUSTODYCD : '',
                    language: this.props.language ? this.props.language : 'vie',
                }).then(async (result) => {
                    let inputs = {
                        custid: dataFromParent.CUSTID ? dataFromParent.CUSTID : '',
                        language: this.props.language ? this.props.language : 'vie',
                    }

                    let newDataMain = await this.getcfmastbycustid(inputs);
                    allDataEditCopy.dataStep1 = !_.isEmpty(newDataMain) ? newDataMain : result.dataMain;
                    allDataEditCopy.dataStep2 = result.dataAuth ? result.dataAuth : {};
                    allDataEditCopy.dataStep3 = result.dataFatca ? result.dataFatca : {};
                    allDataEditCopy.USER_TYPE = result.dataMain ? this.processDataMain(result.dataMain).USER_TYPE : '';
                });
            }
        }

        this.setState({
            allDataEdit: allDataEditCopy
        })
    }


    setStep = (step) => {
        this.setState({
            currentStep: step
        })
    }

    onLegendClick = (stepClicked) => {
        // if (ENABLE_CLICK_TITLE_STEP) {
        // this.setState({ currentStep: stepClicked });
        // // }
    }

    setParentStateFromChild = async (name, data, otherName, otherData) => {
        let allDataEditCopy = { ...this.state.allDataEdit };
        allDataEditCopy[name] = data;
        if (otherName && otherData) {
            allDataEditCopy[otherName] = otherData;
        }
        this.setState({
            allDataEdit: allDataEditCopy
        });
    }

    clearAllParentData = () => {
        this.setState({
            currentStep: 1,
            allDataEdit: {
                dataStep1: {},
                dataStep2: {},
                dataStep3: {},
                dataStep4: {},
                isLoading: true,
                USER_TYPE: ''
            }
        })
    }

    render() {
        let { currentStep, allDataEdit } = this.state;
        let userType = allDataEdit.USER_TYPE ? allDataEdit.USER_TYPE : this.props.USER_TYPE;
        let { action } = this.props;
        let { user } = this.props.auth;
        let isAdmin = (user && user.ISCUSTOMER && user.ISCUSTOMER === 'Y') ? false : true;

        return (
            <React.Fragment>
                {allDataEdit.isLoading === true ? <span> Loading data ...</span>
                    :
                    <div className={isAdmin ? 'account-register-container admin' : "account-register-container"}>
                        <div className="flow-create-acc edit-account" >
                            <WizardComponent
                                className="stepname"
                                step={currentStep}
                                multiStep={true}
                                clickable={true}
                                onClick={this.onLegendClick}
                                isOpenAccount={false}
                            />
                        </div>
                        <div className="content-register edit-account">
                            {currentStep === 1 &&
                                <EditAccountStep1
                                    setStep={this.setStep}
                                    dataStep1={this.state.allDataEdit.dataStep1}
                                    userType={userType}
                                    setParentStateFromChild={this.setParentStateFromChild}
                                    allDataEdit={this.state.allDataEdit}
                                    GRINVESTOR={this.props.GRINVESTOR}
                                    CUSTTYPE={this.props.CUSTTYPE}
                                    action={this.props.action}

                                />
                            }
                            {currentStep === 2 &&
                                <EditAccountStep2
                                    setStep={this.setStep}
                                    allDataEdit={this.state.allDataEdit}
                                    userType={userType}
                                    action={action}
                                    setParentStateFromChild={this.setParentStateFromChild}
                                    dataStep1={this.state.allDataEdit.dataStep1}
                                />
                            }
                            {currentStep === 3 &&
                                <EditAccountStep3
                                    setStep={this.setStep}
                                    allDataEdit={this.state.allDataEdit}
                                    action={action}
                                    userType={userType}
                                    setParentStateFromChild={this.setParentStateFromChild}
                                    dataStep1={this.state.allDataEdit.dataStep1}
                                />
                            }
                            {currentStep === 4 &&
                                < EditAccountStep4
                                    setStep={this.setStep}
                                    allDataEdit={this.state.allDataEdit}
                                    onClickShowHideEditInfor={this.props.onClickShowHideEditInfor}
                                    action={action}
                                    userType={userType}
                                    setParentStateFromChild={this.setParentStateFromChild}
                                    dataStep1={this.state.allDataEdit.dataStep1}
                                    closeModalDetail={this.props.closeModalDetail}
                                    clearAllParentData={this.clearAllParentData}
                                />
                            }
                        </div>
                    </div >
                }
            </React.Fragment>
        )
    }

}

const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth
});

const decorators = flow([
    connect(stateToProps),
    translate('CreateAccount')
]);

module.exports = decorators(EditAccount);
