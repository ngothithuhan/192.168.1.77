import React from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import GeneralInfo_Main from './GeneralInfo_Main';
import GeneralInfo_Auth from './GeneralInfo_Auth';
import GeneralInfo_Contact from './GeneralInfo_Contact';
import GeneralInfo_FatCa from './GeneralInfo_FatCa';
import GeneralInfo_Finish from './GeneralInfo_Finish';
import Stepper from 'react-stepper-horizontal';
import RestfulUtils from 'app/utils/RestfulUtils'
import { showNotifi } from 'app/action/actionNotification.js';



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
        };
        this.onClickNext = this.onClickNext.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
    }

    // onClickNext() {
    //     if (this.state.currentStep == 0) {
    //         console.log('log step :======',this.state.currentStep)
    //         if (this.state.GeneralInfoMain.ISAUTH == 'Y') {
    //             this.state.previousStep == this.state.currentStep;
    //             this.state.currentStep == 1;
    //             this.setState(this.state);
    //         }

    //         else if (this.state.GeneralInfoMain.ISAUTH == 'N' && this.state.GeneralInfoMain.ISFATCA == 'Y') {
    //             this.state.previousStep == this.state.currentStep;
    //             this.state.currentStep == 2;
    //             this.setState(this.state);
    //         }
    //         else if (this.state.GeneralInfoMain.ISAUTH == 'N' && this.state.GeneralInfoMain.ISFATCA == 'N') {
    //             this.state.previousStep == this.state.currentStep;
    //             this.state.currentStep == 3;
    //             this.setState(this.state);
    //         }
    //     }
    //     else if (this.state.currentStep == 1) {
    //         if (this.state.GeneralInfoMain.ISFATCA == 'Y') {
    //             this.state.previousStep == this.state.currentStep;
    //             this.state.currentStep == 2;
    //             this.setState(this.state);
    //         }

    //         else if (this.state.GeneralInfoMain.ISFATCA == 'N') {
    //             this.state.previousStep == this.state.currentStep;
    //             this.state.currentStep == 3;
    //             this.setState(this.state);
    //         }
    //     }
    //     else {
    //         this.state.previousStep = this.state.currentStep;
    //         this.state.currentStep++;
    //         this.setState(this.state);
    //     }


    //     if (this.props.getStep) { this.props.getStep(this.state.currentStep) }
    // }
    // onClickPrev() {
    //     if (this.state.currentStep == 3) {
    //         if (this.state.GeneralInfoMain.ISFATCA == 'Y') {
    //             this.state.previousStep == this.state.currentStep;
    //             this.state.currentStep == 2;
    //             this.state.isLoadChiNhanh = true;
    //             this.setState(this.state);
    //         }

    //         else if (this.state.GeneralInfoMain.ISAUTH == 'Y' && this.state.GeneralInfoMain.ISFATCA == 'N') {
    //             this.state.previousStep == this.state.currentStep;
    //             this.state.currentStep == 1;
    //             this.state.isLoadChiNhanh = true;
    //             this.setState(this.state);
    //         }
    //         else if (this.state.GeneralInfoMain.ISAUTH == 'N' && this.state.GeneralInfoMain.ISFATCA == 'N') {
    //             this.state.previousStep == this.state.currentStep;
    //             this.state.currentStep == 0;
    //             this.state.isLoadChiNhanh = true;
    //             this.setState(this.state);
    //         }
    //     }
    //     else if (this.state.currentStep == 2) {
    //         if (this.state.GeneralInfoMain.ISAUTH == 'Y') {
    //             this.state.previousStep == this.state.currentStep;
    //             this.state.currentStep == 1;
    //             this.state.isLoadChiNhanh = true;
    //             this.setState(this.state);
    //         }

    //         else if (this.state.GeneralInfoMain.ISAUTH == 'N') {
    //             this.state.previousStep == this.state.currentStep;
    //             this.state.currentStep == 0;
    //             this.state.isLoadChiNhanh = true;
    //             this.setState(this.state);
    //         }
    //     }
    //     else {
    //         this.state.previousStep = this.state.currentStep;
    //         this.state.currentStep--;
    //         this.state.isLoadChiNhanh = true;
    //         this.setState(this.state);
    //     }

    //     //this.setState(this.state);
    //     if (this.props.getStep) { this.props.getStep(this.state.currentStep - 1) }
    // }
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
        else
            this.onClickNext();
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
        else
            this.onClickNext();
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
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }

        RestfulUtils.post('/account/getcfmastinfo', { language: this.props.language, custodycd: this.props.CUSTODYCD_VIEW, OBJNAME: this.props.OBJNAME })
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
        if (this.props.access !== "add")
            this.getCfmastInfo()
    }
    render() {

        let GeneralInfoMain = this.state.GeneralInfoMain;
        let BANKCODE = this.state.GeneralInfoMain ? this.state.GeneralInfoMain.BANKCODE : '';
        const { steps, currentStep } = this.state;
        steps[0].title = this.props.strings.tab1
        steps[1].title = this.props.strings.tab2
        //steps[2].title = this.props.strings.tab3
        steps[2].title = this.props.strings.tab4
        steps[3].title = this.props.strings.tab5
        const { user } = this.props.auth
        let ISCUSTOMER = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        return (
            <div>
                <Stepper activeTitleColor="#ed1c24" completeBarColor="#ed1c24" titleFontSize={11}
                    //steps={ISCUSTOMER ? [] : steps} 
                    steps={steps}
                    activeStep={currentStep} activeColor="#ed1c24" completeColor="#ed1c24" />

                <div className="add-info-account" style={{ paddingTop: 20 }}>
                    {currentStep == 0 && <GeneralInfo_Main OBJNAME={this.props.OBJNAME} isLoadChiNhanh={this.state.isLoadChiNhanh} CfmastInfo={this.state.CfmastInfo} access={this.props.access} GeneralInfoMain={this.state.GeneralInfoMain} onSubmit={this.onSubmitGeneralInfoMain} isConfirm={this.isConfirm} ACCTGRP={this.props.ACCTGRP} CUSTTYPE={this.state.GeneralInfoMain ? this.state.GeneralInfoMain.CUSTTYPE : ''} BANKCODE={this.state.GeneralInfoMain ? this.state.GeneralInfoMain.BANKCODE : ''} ISAGREESHARE={this.state.GeneralInfoMain ? this.state.GeneralInfoMain.ISAGREESHARE : ''} />}
                    {currentStep == 1 && <GeneralInfo_Auth CfmastInfo={this.state.CfmastInfo} access={this.props.access} GeneralInfoAuth={this.state.GeneralInfoAuth} GeneralInfoMain={this.state.GeneralInfoMain} onSubmit={this.onSubmitGeneralInfoAuth} previousPage={this.onPrevGeneralInfoAuth} previousPageMain={this.onPrevGeneralInfoMain} previousStep={this.state.previousStep} currentStep={this.state.currentStep} />}
                    {/* {currentStep == 2 && <GeneralInfo_Contact CfmastInfo={this.state.CfmastInfo} access={this.props.access} GeneralInfoContact={this.state.GeneralInfoContact} GeneralInfoMain={this.state.GeneralInfoMain} onSubmit={this.onSubmitGeneralInfoContact} previousPage={this.onPrevGeneralInfoContact} />} */}
                    {currentStep == 2 && <GeneralInfo_FatCa CfmastInfo={this.state.CfmastInfo} access={this.props.access} GeneralInfoFatca={this.state.GeneralInfoFatca} GeneralInfoMain={this.state.GeneralInfoMain} onSubmit={this.onSubmitGeneralInfoFatca} previousPage={this.onPrevGeneralInfoFatca} previousPageMain={this.onPrevGeneralInfoMain} previousStep={this.state.previousStep} currentStep={this.state.currentStep} />}
                    {currentStep == 3 && <GeneralInfo_Finish OBJNAME={this.props.OBJNAME} access={this.props.access} GeneralInfoMain={this.state.GeneralInfoMain} onSubmit={this.finishGeneralInfo} previousPage={this.onClickPrev} getCaptcha={this.getCaptcha} isConfirm={this.state.isConfirm} imgCaptcha={this.state.imgCaptcha} previousStep={this.state.previousStep} previousPageMain={this.onPrevGeneralInfoMain} currentStep={this.state.currentStep} />}
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
