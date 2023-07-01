import React from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { changeLanguage } from 'app/action/actionLanguage.js';
import { getLanguageKey, saveLanguageKey, LANGUAGE_KEY } from '../Helpers';
import RestfulUtils from 'app/utils/RestfulUtils';
//import DateInput from 'app/utils/input/DateInput';
import GeneralInfo from 'app/components/VSD/QLTTTK_NDT/QuanLyTK/components/GeneralInfo'
import ModalOTPConfirm from 'app/components/VSD/QLTTTK_NDT/QuanLyTK/components/ModalOTPConfirm'
class CreateAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModalOTPConfirm: false,
            getstep: 0,
            titleCreateAcc: ''
        }
    }
    getStep(step) {
        this.setState({ getstep: step })
    }
    showModalOTPConfirm(data) {

        this.setState({ showModalOTPConfirm: true, dataOTP: data })
    }
    closeModalOTPConfirm() {
        this.setState({ showModalOTPConfirm: false })
        this.props.history.push('/LOGIN')
    }
    confirmSuccess = () => {
        this.setState({ showModalOTPConfirm: false })
    }
    async componentDidMount() {
        let location = this.props.location
        if (location) {
            let language = location.search.replace("?language=", '')
            let { dispatch } = this.props;
            if (language && language != "" && language != undefined && language != null) {
                await RestfulUtils.post('/session/setLanguage', { language }).then((resData) => {
                    if (resData.errCode == 0) {
                        console.log('setLanguage sussces!language.:', language)
                    }
                    else
                        console.log('setLanguage fail, set default language vie!')
                    saveLanguageKey(language)
                    dispatch(changeLanguage(language));
                });
                saveLanguageKey(language)
                dispatch(changeLanguage(language));
            }
        }

        let { auth } = this.props;
        if (auth) {
            let isLogin = auth.isAuthenticated;
            if (isLogin === false) {
                let element = document.getElementById('main_body');
                if (element) {
                    element.classList.add('customize-create-acc-not-login');
                }
            }
        }
    }

    componentWillUnmount() {
        let element = document.getElementById('main_body');
        if (element) {
            element.classList.remove('customize-create-acc-not-login');
        }
    }
    // this.props.location.search

    render() {
        let { getstep, titleCreateAcc } = this.state;
        //console.log('stepppp', this.state.getstep)
        // console.log('===============================', this.props.location.search, this.props.language, this.props.match.params, this.props.match.params.language, this.props.params)
        titleCreateAcc = ''
        switch (getstep) {
            case 0:
                titleCreateAcc = this.props.strings.tab1
                break;
            case 1:
                titleCreateAcc = this.props.strings.tab2
                break;
            case 2:
                titleCreateAcc = this.props.strings.tab4
                break;
            case 3:
                titleCreateAcc = this.props.strings.tab5
                break;
            default:
                titleCreateAcc = ''
        }
        return (
            <div>
                {/* <div style={{ marginTop: '-100px' }} className="add-info-account"> */}
                <div className="">
                    <div className="title-content" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} >{this.props.strings.title} - {titleCreateAcc}</div>
                    <div className="container panel panel-success margintopNewUI" style={{ marborderTopLeftRadius: 0, borderTopRightRadius: 0 }} >
                        <GeneralInfo
                            getStep={this.getStep.bind(this)}
                            OBJNAME='CREATEACCOUNT'
                            access="add"
                            showModalOTPConfirm={this.showModalOTPConfirm.bind(this)} />
                    </div>
                    <ModalOTPConfirm
                        OBJNAME='CREATEACCOUNT'
                        access="add" confirmSuccess={this.confirmSuccess}
                        showModalOTPConfirm={this.state.showModalOTPConfirm}
                        closeModalOTPConfirm={this.closeModalOTPConfirm.bind(this)}
                        dataOTP={this.state.dataOTP} />
                </div>
            </div>
        )
    }
}

const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth,
});


const decorators = flow([
    connect(stateToProps),
    translate('CreateAccount')
]);

module.exports = decorators(CreateAccount);
