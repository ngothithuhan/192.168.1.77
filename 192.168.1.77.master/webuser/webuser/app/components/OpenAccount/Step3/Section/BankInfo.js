import React, { Component, PureComponent } from 'react'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import HideShowDataInput from '../HideShowDataInput';
import DateInput from "app/utils/input/DateInput";
import DropdownFactory from "app/utils/DropdownFactory";
import Select from "react-select";
import { USER_TYPE_OBJ } from 'app/Helpers';



export class BankInfo extends Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        //todo
    }


    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    shouldComponentUpdate(nextProps, nextState) {
        let { allDataStep3 } = this.props;

        return allDataStep3.BANK_NO !== nextProps.allDataStep3.BANK_NO
            || allDataStep3.BANK_NAME !== nextProps.allDataStep3.BANK_NAME
            || allDataStep3.BANK_BRANCH !== nextProps.allDataStep3.BANK_BRANCH
    }


    render() {
        let { handleOnChangeInput, userType, allDataStep3, allDataSelect, handleOnChangeUploadFile,
            onSetDefaultValue, isDisableWhenView, isDisableWhenUpdate, isUpdate
        } = this.props;
        return (
            <React.Fragment>
                <div className="col-md-12 col-xs-12 title-section"><b>3.{this.props.strings.section3}</b></div>

                {/* Số tài khoản ngân hàng */}
                <HideShowDataInput inputName={'BANK_NO'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.BANK_NO} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.BANK_NO}
                            onChange={(event) => handleOnChangeInput('BANK_NO', event)}
                            id="BANK_NO"
                            disabled={isDisableWhenView}
                        />
                    </div>

                </HideShowDataInput>

                <HideShowDataInput inputName={'BANK_NAME'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.BANK_NAME} <span className="required-text"> *</span></label>
                        <DropdownFactory
                            disabled={isDisableWhenView}
                            onSetDefaultValue={onSetDefaultValue}
                            onChange={(type, value) => handleOnChangeInput('BANK_NAME', type, value)}
                            ID="BANK_NAME"
                            value="BANK_NAME"
                            CDTYPE="GW"
                            CDNAME="BANK"
                            CDVAL={allDataStep3.BANK_NAME}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'BANK_BRANCH'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.BANK_BRANCH} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.BANK_BRANCH}
                            onChange={(event) => handleOnChangeInput('BANK_BRANCH', event)}
                            id="BANK_BRANCH"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>
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

module.exports = decorators(BankInfo);
