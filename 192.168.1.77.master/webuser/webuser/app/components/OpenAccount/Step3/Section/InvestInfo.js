import React, { Component, PureComponent } from 'react'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import HideShowDataInput from '../HideShowDataInput';
import DateInput from "app/utils/input/DateInput";
import DropdownFactory from "app/utils/DropdownFactory";
import Select from "react-select";
import { USER_TYPE_OBJ } from 'app/Helpers';


export class InvestInfo extends Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        //todo
    }


    componentDidUpdate(prevProps, prevState, snapshot) {

    }


    shouldComponentUpdate(nextProps, nextState) {
        let { allDataStep3, allDataSelect } = this.props;
        let arrCheck = [
            'INVEST_TIME', 'RISK', 'EXPERIENCE'
        ]
        let isRender = false;
        for (let i = 0; i < arrCheck.length; i++) {
            if (allDataStep3[arrCheck[i]] !== nextProps.allDataStep3[arrCheck[i]]) {
                isRender = true;
                break;
            }
        }

        return isRender || !_.isEqual(allDataSelect, nextProps.allDataSelect);

    }
    getIndexSection = (userType) => {
        let index = '';
        index = (userType === USER_TYPE_OBJ.CNTN || userType === USER_TYPE_OBJ.CNNN) ? '7.' : '8.';
        return index;
    }
    render() {
        let { handleOnChangeInput, userType, allDataStep3, allDataSelect, handleOnChangeUploadFile,
            onSetDefaultValue, isDisableWhenView, isDisableWhenUpdate, isUpdate
        } = this.props;
        return (
            <React.Fragment>
                <HideShowDataInput inputName={'SECTION_INVEST'}{...this.props}>
                    <div className="col-md-12 col-xs-12 title-section"><b>{this.getIndexSection(userType)}{this.props.strings.section8}</b></div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'INVEST_TIME'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.INVEST_TIME} </label>
                        {allDataSelect.optionInvestTimeType && !_.isEmpty(allDataSelect.optionInvestTimeType)
                            &&
                            <Select
                                name="form-field-name"
                                // disabled={isDisableWhenView || isUpdate}
                                disabled={isDisableWhenView}
                                // placeholder={this.props.strings.idtype}
                                options={allDataSelect.optionInvestTimeType}
                                value={allDataStep3.INVEST_TIME}
                                onChange={(event) => handleOnChangeInput('INVEST_TIME', event, '', true)}
                                id="INVEST_TIME"
                                cache={false}
                            />
                        }
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'RISK'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.RISK} </label>
                        {allDataSelect.optionRiskType && !_.isEmpty(allDataSelect.optionRiskType)
                            &&
                            <Select
                                name="form-field-name"
                                // disabled={isDisableWhenView || isUpdate}
                                disabled={isDisableWhenView}
                                // placeholder={this.props.strings.idtype}
                                options={allDataSelect.optionRiskType}
                                value={allDataStep3.RISK}
                                onChange={(event) => handleOnChangeInput('RISK', event, '', true)}
                                id="RISK"
                                cache={false}
                            />
                        }
                    </div>
                </HideShowDataInput>
                <HideShowDataInput inputName={'EXPERIENCE'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.EXPERIENCE} </label>
                        {allDataSelect.optionExperienceType && !_.isEmpty(allDataSelect.optionExperienceType)
                            &&
                            <Select
                                name="form-field-name"
                                //disabled={isDisableWhenView || isUpdate}
                                disabled={isDisableWhenView}
                                // placeholder={this.props.strings.idtype}
                                options={allDataSelect.optionExperienceType}
                                value={allDataStep3.EXPERIENCE}
                                onChange={(event) => handleOnChangeInput('EXPERIENCE', event, '', true)}
                                id="EXPERIENCE"
                                cache={false}
                            />
                        }
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

module.exports = decorators(InvestInfo);
