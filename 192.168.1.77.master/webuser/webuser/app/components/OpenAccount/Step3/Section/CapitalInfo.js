import React, { Component, PureComponent } from 'react'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import HideShowDataInput from '../HideShowDataInput';
import DateInput from "app/utils/input/DateInput";
import DropdownFactory from "app/utils/DropdownFactory";
import Select from "react-select";
import { USER_TYPE_OBJ } from 'app/Helpers';



export class CapitalInfo extends Component {

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
        let arrCheck = [
            'CAPITAL_NAME', 'CAPITAL_POSITION', 'CAPITAL_ID_NO', 'CAPITAL_ID_DATE', 'CAPITAL_ID_ADDRESS',
            'CAPITAL_PHONE', 'CAPITAL_EMAIL',

        ]
        let isRender = false;
        for (let i = 0; i < arrCheck.length; i++) {
            if (allDataStep3[arrCheck[i]] !== nextProps.allDataStep3[arrCheck[i]]) {
                isRender = true;
                break;
            }
        }

        return isRender;
    }



    render() {
        let { handleOnChangeInput, userType, allDataStep3, allDataSelect, handleOnChangeUploadFile,
            onSetDefaultValue, isDisableWhenView, isDisableWhenUpdate, isUpdate
        } = this.props;
        return (
            <React.Fragment>
                <HideShowDataInput inputName={'SECTION_CAPITAL'}{...this.props}>
                    <div className="col-md-12 col-xs-12 title-section"><b>9.{this.props.strings.section9}</b></div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'CAPITAL_NAME'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.CAPITAL_NAME}</label>
                        <input
                            className="form-control"
                            value={allDataStep3.CAPITAL_NAME}
                            onChange={(event) => handleOnChangeInput('CAPITAL_NAME', event)}
                            id="CAPITAL_NAME"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'CAPITAL_ID_NO'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.CAPITAL_ID_NO}</label>
                        <input
                            className="form-control"
                            value={allDataStep3.CAPITAL_ID_NO}
                            onChange={(event) => handleOnChangeInput('CAPITAL_ID_NO', event)}
                            id="CAPITAL_ID_NO"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>
                <HideShowDataInput inputName={'CAPITAL_ID_DATE'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.CAPITAL_ID_DATE}</label>
                        <DateInput
                            id="CAPITAL_ID_DATE"
                            onChange={(type, value) => handleOnChangeInput('CAPITAL_ID_DATE', type, value)}
                            value={allDataStep3.CAPITAL_ID_DATE}
                            id="CAPITAL_ID_DATE"
                            type="CAPITAL_ID_DATE"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>
                <HideShowDataInput inputName={'CAPITAL_ID_ADDRESS'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.CAPITAL_ID_ADDRESS}</label>
                        <input
                            className="form-control"
                            value={allDataStep3.CAPITAL_ID_ADDRESS}
                            onChange={(event) => handleOnChangeInput('CAPITAL_ID_ADDRESS', event)}
                            id="CAPITAL_ID_ADDRESS"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'CAPITAL_POSITION'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.CAPITAL_POSITION}</label>
                        <input
                            className="form-control"
                            value={allDataStep3.CAPITAL_POSITION}
                            onChange={(event) => handleOnChangeInput('CAPITAL_POSITION', event)}
                            id="CAPITAL_POSITION"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'CAPITAL_PHONE'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.CAPITAL_PHONE}</label>
                        <input
                            className="form-control"
                            value={allDataStep3.CAPITAL_PHONE}
                            onChange={(event) => handleOnChangeInput('CAPITAL_PHONE', event)}
                            id="CAPITAL_PHONE"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>
                <HideShowDataInput inputName={'CAPITAL_EMAIL'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.CAPITAL_EMAIL}</label>
                        <input
                            className="form-control"
                            value={allDataStep3.CAPITAL_EMAIL}
                            onChange={(event) => handleOnChangeInput('CAPITAL_EMAIL', event)}
                            id="CAPITAL_EMAIL"
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

module.exports = decorators(CapitalInfo);
