import React, { Component, PureComponent } from 'react'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import HideShowDataInput from '../HideShowDataInput';
import DateInput from "app/utils/input/DateInput";
import DropdownFactory from "app/utils/DropdownFactory";
import Select from "react-select";
import { USER_TYPE_OBJ } from 'app/Helpers';


export class BrokerInfo extends Component {

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

        return allDataStep3.CAREBY_GROUP !== nextProps.allDataStep3.CAREBY_GROUP
            || allDataStep3.CAREBY_PERSON !== nextProps.allDataStep3.CAREBY_PERSON
            || !_.isEqual(allDataSelect, nextProps.allDataSelect);

    }

    getIndexSection = (userType) => {
        let index = '';
        index = (userType === USER_TYPE_OBJ.CNTN || userType === USER_TYPE_OBJ.CNNN) ? '5.' : '6.';
        return index;
    }
    render() {
        let { handleOnChangeInput, userType, allDataStep3, allDataSelect, handleOnChangeUploadFile,
            onSetDefaultValue, isDisableWhenView, isUpdate
        } = this.props;
        return (
            <React.Fragment>
                <HideShowDataInput inputName={'SECTION_BROKER'}{...this.props}>
                    <div className="col-md-12 col-xs-12 title-section"><b>{this.getIndexSection(userType)}{this.props.strings.section6}</b></div>
                </HideShowDataInput>
                <HideShowDataInput inputName={'CAREBY_GROUP'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.CAREBY_GROUP} <span className="required-text"> *</span></label>
                        {allDataSelect.optionCareByType && !_.isEmpty(allDataSelect.optionCareByType)
                            &&
                            <Select
                                name="form-field-name"
                                disabled={isDisableWhenView || isUpdate}
                                // placeholder={this.props.strings.idtype}
                                options={allDataSelect.optionCareByType}
                                value={allDataStep3.CAREBY_GROUP}
                                onChange={(event) => handleOnChangeInput('CAREBY_GROUP', event, '', true)}
                                id="CAREBY_GROUP"
                                cache={false}
                            />
                        }
                    </div>
                </HideShowDataInput>
                <HideShowDataInput inputName={'CAREBY_PERSON'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.CAREBY_PERSON} <span className="required-text"> *</span></label>
                        {allDataSelect.optionSaleType && !_.isEmpty(allDataSelect.optionSaleType)
                            &&
                            <Select
                                name="form-field-name"
                                disabled={isDisableWhenView || isUpdate}
                                // placeholder={this.props.strings.idtype}
                                options={allDataSelect.optionSaleType}
                                value={allDataStep3.CAREBY_PERSON}
                                onChange={(event) => handleOnChangeInput('CAREBY_PERSON', event, '', true)}
                                id="CAREBY_PERSON"
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

module.exports = decorators(BrokerInfo);
