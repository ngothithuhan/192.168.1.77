import React, { Component, PureComponent } from 'react'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import HideShowDataInput from '../HideShowDataInput';
import DateInput from "app/utils/input/DateInput";
import DropdownFactory from "app/utils/DropdownFactory";
import Select from "react-select";
import { USER_TYPE_OBJ } from 'app/Helpers';
import TextContract from '../../Step4/TextContract';
export class ContractInfo extends Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        //todo
    }


    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    getIndexSection = (userType) => {
        let index = '';
        index = (userType === USER_TYPE_OBJ.CNTN || userType === USER_TYPE_OBJ.CNNN) ? '8.' : '10.';
        return index;
    }
    render() {
        let { handleOnChangeInput, userType, allDataStep3, allDataSelect, handleOnChangeUploadFile,
            onSetDefaultValue, isDisableWhenView, isDisableWhenUpdate, isUpdate
        } = this.props;
        return (
            <React.Fragment>
                <HideShowDataInput inputName={'SECTION_CONTRACT'}{...this.props}>
                    <div className="title-section"><b>{this.getIndexSection(userType)}{this.props.strings.section10}</b></div>
                    <TextContract />
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

module.exports = decorators(ContractInfo);
