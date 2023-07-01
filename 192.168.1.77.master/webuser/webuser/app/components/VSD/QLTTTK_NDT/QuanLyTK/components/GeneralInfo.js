import React from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import GeneralInfo_Main from './GeneralInfo_Main1';
import GeneralInfo_Auth from './GeneralInfo_Auth1';
import GeneralInfo_Contact from './GeneralInfo_Contact';
import GeneralInfo_FatCa from './GeneralInfo_FatCa1';
import GeneralInfo_Finish from './GeneralInfo_Finish1';
import Stepper from 'react-stepper-horizontal';
import RestfulUtils from 'app/utils/RestfulUtils'
import { showNotifi } from 'app/action/actionNotification.js';
import ModalWarningBankAcc from './ModalWarningBankAcc';

// import EditAccountStep2 from '../../../../../components/OpenAccount/EditAccount/EditAccountStep2'

class GeneralInfo extends React.Component {
    constructor() {
        super();
        this.state = {
            imgCaptcha: '',
            isLoadChiNhanh: false,
            oldInforCFMAST: {},
            steps: [{
                title: '',
                onClick: (e) => {
                    e.preventDefault()
                }
            }, {
                title: '',
                onClick: (e) => {
                    e.preventDefault()
                }
            }, //{
            //title: '',
            //onClick: (e) => {
            //    e.preventDefault()
            //}
            //}, 
            {
                title: '',
                onClick: (e) => {
                    e.preventDefault()
                }
            },
            {
                title: '',
                onClick: (e) => {
                    e.preventDefault()

                }
            }
            ],
            currentStep: 0, // bước hiện tại khi mở tài khoản
            previousStep: 0, // bước trước đó khi mở tài khoản
            isConfirm: false,
            isShowModalWarningBankAcc: false, //modal check trùng số tài khoản ngân hàng
        };
        this.onClickNext = this.onClickNext.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
    }

    onClickNext() {
        this.state.previousStep = this.state.currentStep;
        this.state.currentStep++;
        this.setState(this.state);
        if (this.props.getStep) { this.props.getStep(this.state.currentStep) }
    }

    onClickPrev() {
        this.state.previousStep = this.state.currentStep;
        this.state.currentStep--;
        this.state.isLoadChiNhanh = true;
        this.setState(this.state);
        if (this.props.getStep) { this.props.getStep(this.state.currentStep) }
    }

    async CheckGeneralInforMain() {
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }
        const { user } = this.props.auth;
        let ISCUSTOMER = user ? user.ISCUSTOMER ? user.ISCUSTOMER == "Y" ? true : false : false : false;
        // if (!user || ISCUSTOMER){
        //     this.state.GeneralInfoMain.SALEID = '0000021'
        //     this.state.GeneralInfoMain.CAREBY = '9999'
        // }
        this.state.GeneralInfoMain.language = this.props.language;
        this.state.GeneralInfoMain.access = this.props.access;

        let GeneralInfoMain = this.state.GeneralInfoMain;
        if (GeneralInfoMain.SALEID != '' && GeneralInfoMain.SALEID != undefined) {
            if (GeneralInfoMain.SALEID.value != '' && GeneralInfoMain.SALEID.value != undefined) {
                GeneralInfoMain.SALEID = GeneralInfoMain.SALEID.value
            }
            else {
                GeneralInfoMain.SALEID = GeneralInfoMain.SALEID
            }
        }
        else {
            GeneralInfoMain.SALEID = ''
        }
        if (GeneralInfoMain.BANKCODE != '' && GeneralInfoMain.BANKCODE != undefined) {
            if (GeneralInfoMain.BANKCODE.value != '' && GeneralInfoMain.BANKCODE.value != undefined) {
                GeneralInfoMain.BANKCODE = GeneralInfoMain.BANKCODE.value
            }
            else {
                GeneralInfoMain.BANKCODE = GeneralInfoMain.BANKCODE
            }
        }
        else {
            GeneralInfoMain.BANKCODE = ''
        }
        if (GeneralInfoMain.ISAGREESHARE != '' && GeneralInfoMain.ISAGREESHARE != undefined) {
            if (GeneralInfoMain.ISAGREESHARE.value != '' && GeneralInfoMain.ISAGREESHARE.value != undefined) {
                GeneralInfoMain.ISAGREESHARE = GeneralInfoMain.ISAGREESHARE.value
            }
            else {
                GeneralInfoMain.ISAGREESHARE = GeneralInfoMain.ISAGREESHARE
            }
        }
        else {
            GeneralInfoMain.ISAGREESHARE = ''
        }


        await RestfulUtils.posttrans('/account/checkgeneralinfomain', GeneralInfoMain)
            .then((res) => {
                if (res.EC == 0) {
                    this.onClickNext();
                } else {
                    datanotify.type = "error";
                    datanotify.content = res.EM;
                    dispatch(showNotifi(datanotify));
                }
            })
    }

    finishGeneralInfo = (isOTP, captcha) => {
        const { user } = this.props.auth;
        let ISCUSTOMER = user ? user.ISCUSTOMER ? user.ISCUSTOMER == "Y" ? true : false : false : false;
        // if (!user || ISCUSTOMER){
        //     this.state.GeneralInfoMain.SALEID = '0000021'
        //     this.state.GeneralInfoMain.CAREBY = '9999'
        // }
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""
        }
        let v_objname = this.props.OBJNAME;
        if (this.state.GeneralInfoMain.ISAUTH === 'Y') {
            this.state.GeneralInfoMain.ISAUTH = 'Y'
        }
        if (this.state.GeneralInfoMain.ISAUTH === 'N') {
            this.state.GeneralInfoMain.ISAUTH = 'N'
        }

        if (this.state.GeneralInfoMain.ISAUTH == 'Y') {
            this.setState({

            })
        }
        let GeneralInfoMain = this.state.GeneralInfoMain;
        if (GeneralInfoMain.SALEID != '' && GeneralInfoMain.SALEID != undefined) {
            if (GeneralInfoMain.SALEID.value != '' && GeneralInfoMain.SALEID.value != undefined) {
                GeneralInfoMain.SALEID = GeneralInfoMain.SALEID.value
            }
            else {
                GeneralInfoMain.SALEID = GeneralInfoMain.SALEID
            }
        }
        else {
            GeneralInfoMain.SALEID = ''
        }
        if (GeneralInfoMain.BANKCODE != '' && GeneralInfoMain.BANKCODE != undefined) {
            if (GeneralInfoMain.BANKCODE.value != '' && GeneralInfoMain.BANKCODE.value != undefined) {
                GeneralInfoMain.BANKCODE = GeneralInfoMain.BANKCODE.value
            }
            else {
                GeneralInfoMain.BANKCODE = GeneralInfoMain.BANKCODE
            }
        }
        else {
            GeneralInfoMain.BANKCODE = ''
        }
        if (GeneralInfoMain.ISAGREESHARE != '' && GeneralInfoMain.ISAGREESHARE != undefined) {
            if (GeneralInfoMain.ISAGREESHARE.value != '' && GeneralInfoMain.ISAGREESHARE.value != undefined) {
                GeneralInfoMain.ISAGREESHARE = GeneralInfoMain.ISAGREESHARE.value
            }
            else {
                GeneralInfoMain.ISAGREESHARE = GeneralInfoMain.ISAGREESHARE
            }
        }
        else {
            GeneralInfoMain.ISAGREESHARE = ''
        }
        RestfulUtils.posttrans('/account/finishgeneralinfo', { GeneralInfoMain: GeneralInfoMain, GeneralInfoAuth: this.state.GeneralInfoAuth, GeneralInfoContact: this.state.GeneralInfoContact, GeneralInfoFatca: this.state.GeneralInfoFatca, language: this.props.language, access: this.props.access, OBJNAME: v_objname, captcha: captcha })
            .then((res) => {
                if (res.EC == 0) {
                    if (isOTP) {
                        res.DT.fullname = this.state.GeneralInfoMain.FULLNAME;
                        res.DT.idcode = this.state.GeneralInfoMain.IDCODE;
                        this.props.showModalOTPConfirm(res.DT);
                    }
                    else {
                        if (this.props.closeModalDetail)
                            this.props.closeModalDetail();
                        datanotify.type = "success";
                        datanotify.content = this.props.access == "add" ? this.props.strings.addSuccess : this.props.strings.editSuccess;
                        dispatch(showNotifi(datanotify));
                    }

                } else {
                    if (res.EC == -7777)
                        res.EM = this.props.strings.isSameOld
                    if (res.EC == -200015)
                        res.EM = this.props.strings.errDuplicate
                    if (res.EC == -7776)
                        res.EM = this.props.strings.invalidCaptcha
                    datanotify.type = "error";
                    datanotify.content = res.EM;
                    dispatch(showNotifi(datanotify));
                }
                this.getCaptcha()
            })
    }

    onSubmitGeneralInfoMain = async (data) => {
        await this.setState({ ...this.state, GeneralInfoMain: { ...data } })
        await this.CheckGeneralInforMain();
    }

    isConfirm = async (data) => {
        await this.setState({ isConfirm: data })
    }

    async CheckGeneralInforAuth(isSkip) {
        if (!isSkip) {
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""
            }
            this.state.GeneralInfoAuth.language = this.props.language;
            this.state.GeneralInfoAuth.access = this.props.access;
            await RestfulUtils.posttrans('/account/checkgeneralinfoauth', this.state.GeneralInfoAuth)
                .then((res) => {
                    if (res.EC == 0) {
                        this.onClickNext();
                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                    }
                })
        }
        else {
            this.onClickNext();
        }
    }

    onPrevGeneralInfoAuth = (data) => {
        this.state.GeneralInfoAuth = { ...data };
        this.onClickPrev();
    }

    onSubmitGeneralInfoAuth = async (data, isSkip) => {
        await this.setState({ ...this.state, GeneralInfoAuth: data })
        await this.CheckGeneralInforAuth(isSkip);

    }

    async CheckGeneralInforContact(isSkip) {
        if (!isSkip) {
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            this.state.GeneralInfoContact.language = this.props.language;
            this.state.GeneralInfoContact.access = this.props.access;
            await RestfulUtils.posttrans('/account/checkgeneralinfocontact', this.state.GeneralInfoContact)
                .then((res) => {
                    if (res.EC == 0) {
                        this.onClickNext();
                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                    }
                })
        }
        else {
            this.onClickNext();
        }
    }

    onPrevGeneralInfoContact = (data) => {
        this.state.GeneralInfoContact = { ...data };
        this.onClickPrev();
    }

    onSubmitGeneralInfoContact = async (data, isSkip) => {
        await this.setState({ ...this.state, GeneralInfoContact: data })
        await this.CheckGeneralInforContact(isSkip);
    }

    async CheckGeneralInforFatca(isSkip) {
        if (!isSkip) {
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""
            }
            this.state.GeneralInfoFatca.language = this.props.language;
            this.state.GeneralInfoFatca.access = this.props.access;
            await RestfulUtils.posttrans('/account/checkgeneralinfofatca', this.state.GeneralInfoFatca)
                .then((res) => {
                    if (res.EC == 0) {
                        this.onClickNext();
                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                    }

                })
        }
        else {
            this.onClickNext();
        }
    }

    onPrevGeneralInfoFatca = (data) => {
        this.setState({ GeneralInfoMain: { ...data } })
        this.onClickPrev();
    }

    onPrevGeneralInfoMain = (data) => {
        this.setState({ GeneralInfoMain: data })
    }

    onSubmitGeneralInfoFatca = async (data, isSkip) => {
        await this.setState({ GeneralInfoFatca: data })
        await this.CheckGeneralInforFatca(isSkip);
    }

    getCaptcha = () => {
        RestfulUtils.post('/account/getcaptcha', null)
            .then(async (res) => {
                await this.setState({ ...this.state, imgCaptcha: res })
            })
    }

    getCfmastInfo = () => {
        var { dispatch, dataFromParent, auth } = this.props;
        let isCustom = auth && auth.user && auth.user.ISCUSTOMER && auth.user.ISCUSTOMER === 'Y' ? true : false;
        var datanotify = {
            type: "",
            header: "",
            content: ""
        }
        let data = {
            language: this.props.language,
            // custodycd: this.props.CUSTODYCD_VIEW,
            custodycd: isCustom ? dataFromParent.CUSTODYCD : this.props.CUSTODYCD_VIEW,
            OBJNAME: this.props.OBJNAME
        }
        RestfulUtils.post('/account/getcfmastinfo', data)
            .then((res) => {
                if (res.EC == 0) {
                    this.setState({ ...this.state, CfmastInfo: res })
                } else {
                    datanotify.type = "error";
                    datanotify.content = res.EM;
                    dispatch(showNotifi(datanotify));
                }
            })
    }

    componentDidMount() {
        if (this.props.access !== "add") {
            //lấy thông tin trong trường hợp edit
            this.getCfmastInfo();
        }
    }

    checkValidBankAccount = (generalInformation) => {
        let isValidBankAcc = true;
        //todo: call api
        this.setState({
            ...this.state,
            isShowModalWarningBankAcc: true
        })

        return isValidBankAcc;
    }

    onCloseModalWarning = () => {
        this.setState({
            ...this.state,
            isShowModalWarningBankAcc: false
        })
    }

    onConfirmModalWarning = () => {

    }

    render() {
        let GeneralInfoMain = this.state.GeneralInfoMain;
        let BANKCODE = this.state.GeneralInfoMain ? this.state.GeneralInfoMain.BANKCODE : '';
        let { steps, currentStep } = this.state;
        steps[0].title = this.props.strings.tab1
        steps[1].title = this.props.strings.tab2
        //steps[2].title = this.props.strings.tab3
        steps[2].title = this.props.strings.tab4
        steps[3].title = this.props.strings.tab5
        const { user } = this.props.auth
        let ISCUSTOMER = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;

        // currentStep = 1;
        // ủy quyền = N; dấu hiệu mỹ = N -> tới bước 4
        // ủy quyền = Y; dấu hiệu mỹ = N -> tới bước 2
        // ủy quyền = N, dấu hiệu mỹ = Y -> tới bước 3


        return (
            <div className="ndt-general-info-container">
                <div className="ndt-stpper-container">
                    <Stepper
                        defaultColor="#303C52"
                        defaultTitleColor="#303C52"
                        activeTitleColor="#DF7A00"
                        completeTitleColor="#DF7A00"
                        completeBarColor="#DF7A00"
                        titleFontSize={11}
                        steps={steps}
                        activeStep={currentStep}
                        activeColor="#DF7A00"
                        completeColor="#DF7A00"
                        completeBarColor='#DF7A00'
                    />
                </div>
                <div className="ndt-add-info-acc-container">
                    {currentStep == 0 &&
                        <GeneralInfo_Main
                            OBJNAME={this.props.OBJNAME}
                            isLoadChiNhanh={this.state.isLoadChiNhanh}
                            CfmastInfo={this.state.CfmastInfo}
                            access={this.props.access}
                            GeneralInfoMain={this.state.GeneralInfoMain}
                            onSubmit={this.onSubmitGeneralInfoMain}
                            isConfirm={this.isConfirm}
                            ACCTGRP={this.props.ACCTGRP}
                            CUSTTYPE={this.state.GeneralInfoMain ? this.state.GeneralInfoMain.CUSTTYPE : ''}
                            BANKCODE={this.state.GeneralInfoMain ? this.state.GeneralInfoMain.BANKCODE : ''}
                            ISAGREESHARE={this.state.GeneralInfoMain ? this.state.GeneralInfoMain.ISAGREESHARE : ''}
                            checkValidBankAccount={this.checkValidBankAccount}
                        />}

                    {currentStep == 1 &&
                        <GeneralInfo_Auth
                            CfmastInfo={this.state.CfmastInfo}
                            access={this.props.access}
                            GeneralInfoAuth={this.state.GeneralInfoAuth}
                            GeneralInfoMain={this.state.GeneralInfoMain}
                            onSubmit={this.onSubmitGeneralInfoAuth}
                            previousPage={this.onPrevGeneralInfoAuth}
                            previousPageMain={this.onPrevGeneralInfoMain}
                            previousStep={this.state.previousStep}
                            currentStep={this.state.currentStep}
                        />
                        // <EditAccountStep2 />

                    }

                    {currentStep == 2 &&
                        <GeneralInfo_FatCa
                            CfmastInfo={this.state.CfmastInfo}
                            access={this.props.access}
                            GeneralInfoFatca={this.state.GeneralInfoFatca}
                            GeneralInfoMain={this.state.GeneralInfoMain}
                            onSubmit={this.onSubmitGeneralInfoFatca}
                            previousPage={this.onPrevGeneralInfoFatca}
                            previousPageMain={this.onPrevGeneralInfoMain}
                            previousStep={this.state.previousStep}
                            currentStep={this.state.currentStep}
                        />}

                    {currentStep == 3 &&
                        <GeneralInfo_Finish
                            OBJNAME={this.props.OBJNAME}
                            access={this.props.access}
                            GeneralInfoMain={this.state.GeneralInfoMain}
                            onSubmit={this.finishGeneralInfo}
                            previousPage={this.onClickPrev}
                            getCaptcha={this.getCaptcha}
                            isConfirm={this.state.isConfirm}
                            imgCaptcha={this.state.imgCaptcha}
                            previousStep={this.state.previousStep}
                            previousPageMain={this.onPrevGeneralInfoMain}
                            currentStep={this.state.currentStep}
                        />}
                    <ModalWarningBankAcc
                        isShowModalWarning={this.state.isShowModalWarningBankAcc}
                        onCloseModalWarning={this.onCloseModalWarning}
                        onConfirmModalWarning={this.onConfirmModalWarning}
                    />

                </div>
            </div>
        );
    }
}
const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth
});


const decorators = flow([
    connect(stateToProps),
    translate('GeneralInfo')
]);
module.exports = decorators(GeneralInfo);
