import React, { Component } from 'react'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'

import './Welcome.scss'

export class Welcome extends Component {

    changeScreenCreateAccount = () => {
        let { setStep, changeStateShowWelcomeScreen } = this.props
        setStep(1)
        changeStateShowWelcomeScreen(false)
    }
    render() {

        return (
            <div className="open-account-welcome">
                <div className="container-welcome">
                    <div className="image-welcome">
                    </div>
                    <div className="content-welcome">
                        <div className="content-welcome-title">{this.props.strings.welcome_title}</div>

                        <div className="content-welcome-text">
                            {this.props.strings.greeting}
                            <ul>
                                <li>{this.props.strings.prepare1}</li>
                                <li>{this.props.strings.prepare2}
                                    <span className="note-text">
                                        {this.props.strings.prepare2_note}
                                    </span>
                                </li>
                                <li>{this.props.strings.prepare3}</li>
                            </ul>
                            <div className="recommend-web-browser">
                                {this.props.strings.recommend1}
                                <span className="note-text">{this.props.strings.recommend2}</span>
                                {this.props.strings.recommend3}
                                <span className="note-text">{this.props.strings.recommend4}</span>
                                {this.props.strings.recommend5}
                            </div>
                            <button className="btn-begin" onClick={this.changeScreenCreateAccount}>{this.props.strings.buttonBegin}</button>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}

const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth
});

const decorators = flow([
    connect(stateToProps),
    translate('WelcomeOpenAccount')
]);

module.exports = decorators(Welcome);
