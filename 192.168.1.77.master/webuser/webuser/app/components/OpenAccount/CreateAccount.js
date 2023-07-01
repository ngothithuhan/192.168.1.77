import React, { Component, Fragment } from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import WizardComponent from "./Wizard/WizardComponent";
import Welcome from './Welcome/Welcome'
import './CreateAccount.scss';
import CreateAccountStep1 from './Step1/CreateAccountStep1';
import CreateAccountStep2 from './Step2/CreateAccountStep2';
import CreateAccountStep2_1 from "./Step2/CreateAccountStep2_1";
import CreateAccountStep3 from "./Step3/CreateAccountStep3";
import CreateAccountStep4 from './Step4/CreateAccountStep4';
import CreateAccountStep4_1 from "./Step4/CreateAccountStep4_1";
import CreateAccountStep4_2 from "./Step4/CreateAccountStep4_2";
import _ from 'lodash';
import { ACTIONS_ACC } from 'app/Helpers';

import { changeLanguage } from 'app/action/actionLanguage.js';
import { getLanguageKey, saveLanguageKey, LANGUAGE_KEY } from 'app/Helpers.js';
import RestfulUtils from 'app/utils/RestfulUtils';

class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 1,
            isShowWelcomeScreen: true,
            allData: {
                dataStep1: {},
                dataStep1Select: {},
                dataStep2: {},
                dataStep3: {},
                dataStep3Select: {},
                dataStep4: {},
                dataStep4_1: {},
                dataStep4_2: {},
                dataStep4_3: {},
            },
        }
    }

    setDefaultLanguage = async () => {
        let location = this.props.location
        if (location) {
            let language = location.search.replace("?language=", '')
            let { dispatch } = this.props;
            if (language && language != "" && language != undefined && language != null) {
                await RestfulUtils.post('/session/setLanguage', { language }).then((resData) => {
                    if (resData.errCode == 0) {
                        console.log('>>>> setLanguage sussces!language.:', language)
                    }
                    else
                        console.log('>>>> setLanguage fail, set default language vie!')
                    saveLanguageKey(language)
                    dispatch(changeLanguage(language));
                });
                saveLanguageKey(language)
                dispatch(changeLanguage(language));
            }
        }
    }

    async componentDidMount() {
        await this.setDefaultLanguage();

        let element = document.getElementById('main_body');
        if (element) {
            element.classList.add('reset-css-open-account');
        }
        const { user } = this.props.auth;
        if (user && !_.isEmpty(user)) {
            this.props.history.push('/LOGIN');
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let { auth } = this.props;
        if (prevProps.auth && prevProps.auth !== auth && prevProps.auth.user && auth.user && prevProps.auth.user !== auth.user) {
            let { user } = auth;
            if (user && !_.isEmpty(user)) {
                this.props.history.push('/LOGIN');
            }
        }
    }

    redirectToPrev = () => {
        const { currentStep } = this.state;
        this.setState({
            currentStep: currentStep - 1,
        });
    }

    redirectToNext = () => {
        const { currentStep } = this.state;
        this.setState({
            currentStep: currentStep + 1,
        });
    }


    setStep = (step) => {
        this.setState({
            currentStep: step
        })
    }

    changeStateShowWelcomeScreen = (status) => {
        this.setState({
            ...this.state,
            isShowWelcomeScreen: status
        })
    }


    canGoToStep2 = (step) => {
        const { allData, resultValidateStep2 } = this.state;
        if (allData.currentTransaction == '0000000') {
            resultValidateStep2.currentTransaction = false
        } else {
            resultValidateStep2.currentTransaction = true
        }

        this.setState({
            resultValidateStep2: resultValidateStep2
        })

        const arrResult = [];
        for (const property in resultValidateStep2) {
            arrResult.push(resultValidateStep2[property]);
        }
        let canGoToStep3 = arrResult.every(item => item === true);
        if (canGoToStep3) {
            this.setStep(step)
        }
    }


    onLegendClick = (stepClicked) => {
        // if (ENABLE_CLICK_TITLE_STEP) {
        // this.setState({ currentStep: stepClicked });
        // }
    }

    // setParentStateFromChild = async (name, data) => {
    //     let dataOld = this.state.allData[name]
    //     this.state.allData[name] = { ...dataOld, ...data };
    //     await this.setState((state) => ({
    //         ...state,
    //     }));
    // }

    setParentStateFromChild = async (name, data, otherName, otherData) => {
        let allDataCopy = { ...this.state.allData };
        allDataCopy[name] = data;
        if (otherName && otherData) {
            allDataCopy[otherName] = otherData;
        }
        this.setState({
            allData: allDataCopy
        });

    }

    clearAllData = () => {
        this.setState({
            currentStep: 1,
            allData: {
                dataStep1: {},
                dataStep2: {},
                dataStep3: {},
                dataStep3_2: {},
                dataStep4: {},
                dataStep5: {},
            }
        })
    }

    render() {
        let { currentStep, isShowWelcomeScreen, allData } = this.state;
        let userType = allData.dataStep1.USER_TYPE ? allData.dataStep1.USER_TYPE : '';
        let CUSTTYPE = allData.dataStep1.CUSTYPE ? allData.dataStep1.CUSTYPE : '';
        let GRINVESTOR = allData.dataStep1.GRINVESTOR ? allData.dataStep1.GRINVESTOR : '';

        return (
            <React.Fragment>
                {
                    isShowWelcomeScreen === true ?
                        <React.Fragment>
                            <Welcome
                                setStep={this.setStep}
                                changeStateShowWelcomeScreen={this.changeStateShowWelcomeScreen}
                            />
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <div className="account-register-container">
                                <div className="text-center" >
                                    <div className="commonTitle">{this.props.strings.openAcc}</div>
                                </div>
                                <div className="flow-create-acc" >
                                    <WizardComponent
                                        className="stepname"
                                        step={currentStep}
                                        multiStep={true}
                                        clickable={true}
                                        onClick={this.onLegendClick}
                                        isOpenAccount={true}
                                    />
                                </div>
                                <div className="content-register">
                                    {currentStep === 1 &&
                                        <CreateAccountStep1
                                            changeStateShowWelcomeScreen={this.changeStateShowWelcomeScreen}
                                            setParentStateFromChild={this.setParentStateFromChild}
                                            setStep={this.setStep}
                                            allData={allData}
                                            action={ACTIONS_ACC.CREATE}
                                        />
                                    }
                                    {currentStep === 2 &&
                                        <CreateAccountStep2
                                            setStep={this.setStep}
                                            currentStep={currentStep}
                                            setParentStateFromChild={this.setParentStateFromChild}
                                            allData={allData}
                                            isLoggedOut={true}
                                            userType={userType}
                                            CUSTTYPE={CUSTTYPE}
                                            GRINVESTOR={GRINVESTOR}
                                            action={ACTIONS_ACC.CREATE}
                                        />
                                    }
                                    {currentStep === 2.1 &&
                                        <CreateAccountStep2_1
                                            setStep={this.setStep}
                                            currentStep={currentStep}
                                            setParentStateFromChild={this.setParentStateFromChild}
                                            allData={allData}
                                            isLoggedOut={true}
                                            userType={userType}
                                            CUSTTYPE={CUSTTYPE}
                                            GRINVESTOR={GRINVESTOR}
                                            action={ACTIONS_ACC.CREATE}
                                        />

                                    }

                                    {currentStep === 3 &&
                                        <CreateAccountStep3
                                            setParentStateFromChild={this.setParentStateFromChild}
                                            allData={allData}
                                            setStep={this.setStep}
                                            isLoggedOut={true}
                                            userType={userType}
                                            CUSTTYPE={CUSTTYPE}
                                            GRINVESTOR={GRINVESTOR}
                                            action={ACTIONS_ACC.CREATE}
                                        />
                                    }
                                    {currentStep === 4.1 &&
                                        <CreateAccountStep4_1
                                            setParentStateFromChild={this.setParentStateFromChild}
                                            allData={allData}
                                            setStep={this.setStep}
                                            isLoggedOut={true}
                                            userType={userType}
                                            CUSTTYPE={CUSTTYPE}
                                            GRINVESTOR={GRINVESTOR}
                                            action={ACTIONS_ACC.CREATE}
                                        />
                                    }
                                    {currentStep === 4.2 &&
                                        <CreateAccountStep4_2
                                            setParentStateFromChild={this.setParentStateFromChild}
                                            allData={allData}
                                            setStep={this.setStep}
                                            isLoggedOut={true}
                                            userType={userType}
                                            CUSTTYPE={CUSTTYPE}
                                            GRINVESTOR={GRINVESTOR}
                                            action={ACTIONS_ACC.CREATE}
                                        />
                                    }

                                    {currentStep === 4 &&
                                        <CreateAccountStep4
                                            setParentStateFromChild={this.setParentStateFromChild}
                                            allData={allData}
                                            setStep={this.setStep}
                                            isLoggedOut={true}
                                            userType={userType}
                                            CUSTTYPE={CUSTTYPE}
                                            GRINVESTOR={GRINVESTOR}
                                            action={ACTIONS_ACC.CREATE}
                                        />
                                    }

                                </div>
                            </div >
                        </React.Fragment>
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

module.exports = decorators(CreateAccount);
