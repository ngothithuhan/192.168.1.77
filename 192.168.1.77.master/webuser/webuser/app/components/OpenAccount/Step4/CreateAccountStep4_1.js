import React, { Component } from 'react'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import TextContract from './TextContract'
import './CreateAccountStep4_1.scss';
import { showNotifi } from 'app/action/actionNotification.js';
import _ from 'lodash';

class CreateAccountStep4_1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IS_AGREE: ''
        }
    }

    componentDidMount() {
        let { allData } = this.props;
        if (allData && allData.dataStep4_1 && !_.isEmpty(allData.dataStep4_1)) {
            this.setState({
                IS_AGREE: allData.dataStep4_1.IS_AGREE
            })
        }
    }

    handlePrevBtn = () => {
        this.props.setStep(3)
    }
    handleNextBtn = async () => {
        let { IS_AGREE } = this.state;
        if (IS_AGREE !== 'Y') {
            let datanotify = {
                type: "",
                header: "",
                content: ""
            }
            datanotify.type = "error";
            datanotify.content = this.props.strings.reqTick
            this.props.dispatch(showNotifi(datanotify));
            window.$(`#IS_AGREE`).focus();
            return;
        }
        await this.props.setParentStateFromChild('dataStep4_1', this.state)
        this.props.setStep(4.2)
    }

    handleOnChangeCheckBox = (event) => {
        let value = event.target.checked ? 'Y' : 'N';
        this.setState({
            IS_AGREE: value
        })
    }

    render() {

        return (
            <React.Fragment>
                <div className="create-account-step-4-1">
                    <div className="title-create-account-step-4-1">{this.props.strings.titleCreateStep4}</div>
                    <div className="read-note">{this.props.strings.note1}</div>
                    <TextContract />

                    <div className="checkbox-confirm">
                        <input
                            className=''
                            type="checkbox"
                            id="IS_AGREE"
                            value={this.state.IS_AGREE}
                            checked={this.state.IS_AGREE === 'Y' ? true : false}
                            onChange={(e) => this.handleOnChangeCheckBox(e)}
                        />
                        <label htmlFor="IS_AGREE">{this.props.strings.note2}</label>
                    </div>
                </div>
                <div className="footer-register">
                    <button className="btn-return"
                        onClick={() => this.handlePrevBtn()}
                    >
                        {this.props.strings.buttonReturn}
                    </button>
                    <button className="btn-continue"
                        onClick={() => this.handleNextBtn()}>
                        {this.props.strings.buttonContinuous}
                    </button>
                </div>
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
    translate('CreateAccountStep4')
]);

module.exports = decorators(CreateAccountStep4_1);
