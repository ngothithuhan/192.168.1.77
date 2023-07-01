import React from 'react';
import { connect } from 'react-redux';
import './MenuNotLogin.scss'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { bindActionCreators } from 'redux';
import { changeLanguage } from 'app/action/actionLanguage.js';
import { saveLanguageKey } from 'app/Helpers';

class MenuNotLogin extends React.Component {

    componentDidMount() {
        //reset parents CSS classes
        let element = document.getElementById('main_body');
        if (element) {
            element.classList.add('menu-not-login-reset');
            element.classList.remove('container');
        }
    }

    componentWillUnmount() {
        let element = document.getElementById('main_body');
        if (element) {
            element.classList.remove('menu-not-login-reset');
            element.classList.add('container');
        }
    }

    onChangeLangue = (language) => {
        saveLanguageKey(language)
        this.props.changeLanguage(language);
    }
    render() {
        let { language } = this.props;
        return (
            <div className="menu-not-login-container">
                <div className="menu-not-login-left">
                    <img src="./images/logo_ssi_1.png" alt="image not found" />
                    <div className="company-name">
                        {this.props.strings.companyName}
                    </div>
                </div>
                <div className="menu-not-login-right">
                    <div className={language === 'vie' ? 'active lang-vie' : 'lang-vie'}
                        onClick={() => this.onChangeLangue('vie')}
                    >
                        {this.props.strings.VI}
                    </div>
                    <div className={language === 'en' ? 'active lang-en' : 'lang-en'}
                        onClick={() => this.onChangeLangue('en')}
                    >
                        {this.props.strings.EN}
                    </div>
                </div>
            </div>
        )
    }


}


const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth,
    dataMenu: state.dataMenu
});
const dispatchToProps = dispatch => ({
    changeLanguage: bindActionCreators(changeLanguage, dispatch)
});

const decorators = flow([
    connect(stateToProps),
    translate('MenuNotLogin')
]);

module.exports = connect(stateToProps, dispatchToProps)(decorators(MenuNotLogin));
