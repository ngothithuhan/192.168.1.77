import React, { Component, PureComponent } from 'react'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import HideShowDataInput from '../HideShowDataInput';
import DateInput from "app/utils/input/DateInput";
import DropdownFactory from "app/utils/DropdownFactory";
import Select from "react-select";
import { USER_TYPE_OBJ } from 'app/Helpers';


export class FatCaInfo extends Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        //todo
        //window.$('#element').popover('show')
    }


    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    shouldComponentUpdate(nextProps, nextState) {
        let { allDataStep3 } = this.props;
        return allDataStep3.IS_FATCA !== nextProps.allDataStep3.IS_FATCA;
    }

    getIndexSection = (userType) => {
        let index = '';
        index = (userType === USER_TYPE_OBJ.CNTN || userType === USER_TYPE_OBJ.CNNN) ? '6.' : '7.';
        return index;
    }
    render() {
        let { handleOnChangeInput, userType, allDataStep3, allDataSelect, handleOnChangeUploadFile,
            onSetDefaultValue, isDisableWhenView, isDisableWhenUpdate, isUpdate
        } = this.props;
        return (
            <React.Fragment>
                <HideShowDataInput inputName={'SECTION_IS_FATCA'}{...this.props}>
                    <div className="col-md-12 col-xs-12 title-section"><b>{this.getIndexSection(userType)}{this.props.strings.section7}</b></div>
                </HideShowDataInput>
                <HideShowDataInput inputName={'IS_FATCA'}{...this.props}>
                    <div className="col-md-3 col-xs-12 form-group">
                        <label
                            //id="element"
                            data-toggle="popover"
                            data-container="body"
                            data-placement="right"
                            data-html="true"
                            title={this.props.language === "vie" ? "Chú ý" : "Note"}
                            data-content={this.props.strings.tooltipIsUS}
                        >
                            {this.props.strings.stringIsFatca} <span className="required-text"> *</span>
                        </label>
                        <DropdownFactory
                            disabled={isDisableWhenView}
                            onSetDefaultValue={onSetDefaultValue}
                            onChange={(type, value) => handleOnChangeInput('IS_FATCA', type, value)}
                            ID="IS_FATCA"
                            value="IS_FATCA"
                            CDTYPE="SY"
                            CDNAME="YESNO"
                            CDVAL={allDataStep3.IS_FATCA}
                        />
                    </div>
                </HideShowDataInput>
                <div className="col-md-12 col-xs-12"></div>
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

module.exports = decorators(FatCaInfo);
