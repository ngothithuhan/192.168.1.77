import React, { Component } from 'react'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import _ from 'lodash'

import './CreateAccountStep1.scss'
import { USER_TYPE_OBJ, CUSTYPE_CN, CUSTYPE_TC, GRINVESTOR_TN, GRINVESTOR_NN } from 'app/Helpers';

const YES_NO_ARR = [
    { key: 'YES', value: 'Y' },
    { key: 'NO', value: 'N' }
]

class CreateAccountStep1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataStep1: {
                IS_PERSONAL: 'Y', //check là cá nhân hay tổ chức
                IS_CITIZEN: 'Y', //check cos phải là quốc tịch vn hay nước ngoài
                IS_INVITER: 'Y',
                INVITER_EMAIL: '',
                IS_EKYC: 'Y',
                USER_TYPE: '',
                GRINVESTOR: '',
                CUSTTYPE: ''
            },

            VALIDATE_ARR: [
                { key: 'IS_PERSONAL', value: '' },
                { key: 'IS_CITIZEN', value: '' },
                { key: 'IS_INVITER', value: '' },
                { key: 'INVITER_EMAIL', value: '' },
                { key: 'IS_EKYC', value: '' },
            ]
        }
    }

    handleOnChange = (event, type) => {
        let cloneDataStep1 = { ...this.state.dataStep1 }
        if (event && event.target) {
            cloneDataStep1[type] = event.target.value
        }
        this.setState({
            dataStep1: cloneDataStep1
        })
    }

    validateDataStep1 = () => {
        let { dataStep1, VALIDATE_ARR } = this.state;
        let isValidValue = true;
        for (let i = 0; i < VALIDATE_ARR.length; i++) {
            if (!dataStep1[VALIDATE_ARR[i].key]) {
                isValidValue = false;
                break;
            }
        }
        //hardcode isValidValue = true;
        isValidValue = true;

        if (isValidValue === true) {
            //gán loại user
            let { IS_PERSONAL, IS_CITIZEN } = dataStep1;
            let userType = '', CUSTYPE = '', GRINVESTOR = '';
            if (IS_PERSONAL === 'Y' && IS_CITIZEN === 'Y') {
                userType = USER_TYPE_OBJ.CNTN;
                CUSTYPE = CUSTYPE_CN;
                GRINVESTOR = GRINVESTOR_TN;
            }
            if (IS_PERSONAL === 'Y' && IS_CITIZEN === 'N') {
                userType = USER_TYPE_OBJ.CNNN;
                CUSTYPE = CUSTYPE_CN;
                GRINVESTOR = GRINVESTOR_NN;
            }

            if (IS_PERSONAL === 'N' && IS_CITIZEN === 'Y') {
                userType = USER_TYPE_OBJ.TCTN;
                CUSTYPE = CUSTYPE_TC;
                GRINVESTOR = GRINVESTOR_TN;
            }
            if (IS_PERSONAL === 'N' && IS_CITIZEN === 'N') {
                userType = USER_TYPE_OBJ.TCNN;
                CUSTYPE = CUSTYPE_TC;
                GRINVESTOR = GRINVESTOR_NN;
            }
            dataStep1.USER_TYPE = userType;
            dataStep1.CUSTYPE = CUSTYPE;
            dataStep1.GRINVESTOR = GRINVESTOR;

            this.setState({
                ...this.state, ...dataStep1
            })
        }

        return isValidValue;
    }

    nextToStep2 = async () => {
        let isValidValue = this.validateDataStep1();
        let { setStep, setParentStateFromChild } = this.props;
        if (isValidValue === true) {
            await setParentStateFromChild('dataStep1', this.state.dataStep1);
            if (this.state.dataStep1.IS_PERSONAL === 'Y' &&
                this.state.dataStep1.IS_CITIZEN === 'Y'
                && this.state.dataStep1.IS_EKYC === 'Y') {
                setStep(2);
            } else {
                setStep(3);
            }
        } else {
            alert('Invalid input')
        }
    }

    backToStep0 = () => {
        this.props.changeStateShowWelcomeScreen(true);
    }

    componentDidMount() {
        let { allData } = this.props
        if (!_.isEmpty(allData.dataStep1)) {
            this.setState({ dataStep1: allData.dataStep1 })
        }
    }

    render() {
        return (
            <div className="create-account-step1">
                <div className="create-account-step1-content">
                    {/* 1. Quý khách là nhà đầu tư? */}
                    <div>
                        <div className="title-step1">{this.props.strings.typeInvestor}</div>
                        <div className="custom-radio">
                            {YES_NO_ARR.map((item, index) => {
                                return (
                                    <div key={index} >
                                        <input
                                            className="regular-radio"
                                            name='IS_PERSONAL'
                                            type="radio"
                                            value={item.value}
                                            onChange={(e) => this.handleOnChange(e, 'IS_PERSONAL')}
                                            checked={this.state.dataStep1.IS_PERSONAL === item.value}
                                        />
                                        {index === 0 ? this.props.strings.personal : this.props.strings.organization}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    {/* 2. Quốc tịch của quý khách? */}
                    <div>
                        <div className="title-step1">{this.props.strings.Nationality}</div>
                        <div className="custom-radio">
                            {YES_NO_ARR.map((item, index) => {
                                return (
                                    <div key={index} >
                                        <input
                                            className="regular-radio"
                                            name='IS_CITIZEN'
                                            type="radio"
                                            value={item.value}
                                            onChange={(e) => this.handleOnChange(e, 'IS_CITIZEN')}
                                            checked={this.state.dataStep1.IS_CITIZEN === item.value}
                                        />
                                        {index === 0 ? this.props.strings.vietnam : this.props.strings.oversea}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    {/* 3. Quý khách có người giới thiệu không? */}
                    <div>
                        <div className="title-step1">{this.props.strings.inviter}</div>
                        <div className="custom-radio">
                            {YES_NO_ARR.map((item, index) => {
                                return (
                                    <div key={index} >
                                        <input
                                            className="regular-radio"
                                            name='IS_INVITER'
                                            type="radio"
                                            value={item.value}
                                            onChange={(e) => this.handleOnChange(e, 'IS_INVITER')}
                                            checked={this.state.dataStep1.IS_INVITER === item.value}

                                        />
                                        {index === 0 ? this.props.strings.yes : this.props.strings.no}
                                    </div>
                                )
                            })}
                        </div>
                        {
                            this.state.dataStep1.IS_INVITER == "Y" ? (<React.Fragment>
                                <div>
                                    {this.props.strings.emailInviter} <span className="important">*</span>
                                </div>
                                <div>
                                    <input
                                        disabled={this.state.dataStep1.IS_INVITER == 'N'}
                                        className="referrerEmail"
                                        type="email"
                                        value={this.state.dataStep1.INVITER_EMAIL}
                                        placeholder={this.props.strings.placeholder}
                                        onChange={(e) => this.handleOnChange(e, 'INVITER_EMAIL')}
                                    />
                                </div>
                            </React.Fragment>) : null
                        }



                    </div>
                    {
                        (this.state.dataStep1.IS_PERSONAL === 'Y' && this.state.dataStep1.IS_CITIZEN === 'Y')
                        && (
                            <div>
                                {/* 4. Quý khác có lựa chọn xác thực giấy tờ (CMND/CCCD) và khuôn mặt không? */}
                                <div className="title-step1">{this.props.strings.faceId}</div>
                                <div className="custom-radio">
                                    {YES_NO_ARR.map((item, index) => {
                                        return (
                                            <div key={index} >
                                                <input
                                                    className="regular-radio"
                                                    name='IS_EKYC'
                                                    type="radio"
                                                    value={item.value}
                                                    onChange={(e) => this.handleOnChange(e, 'IS_EKYC')}
                                                    checked={this.state.dataStep1.IS_EKYC === item.value}
                                                />
                                                {index === 0 ? this.props.strings.authentication : this.props.strings.unauthenticated}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    }



                </div >

                <div className="footer-register">
                    <button className="btn-return" onClick={() => this.backToStep0()}>{this.props.strings.buttonReturn}</button>
                    <button className="btn-continue"
                        onClick={() => this.nextToStep2()}>
                        {this.props.strings.buttonContinuous}
                    </button>
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
    translate('CreateAccountStep1')
]);

module.exports = decorators(CreateAccountStep1);
