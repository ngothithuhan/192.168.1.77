import React, { Component, PureComponent } from 'react'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import HideShowDataInput from '../HideShowDataInput';
import DateInput from "app/utils/input/DateInput";
import DropdownFactory from "app/utils/DropdownFactory";
import Select from "react-select";
import { USER_TYPE_OBJ } from 'app/Helpers';


export class AuthInfo extends Component {

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
        return allDataStep3.IS_AUTHORIZED !== nextProps.allDataStep3.IS_AUTHORIZED;
    }

    render() {
        let { handleOnChangeInput, userType, allDataStep3, allDataSelect, handleOnChangeUploadFile,
            onSetDefaultValue, isDisableWhenView, isDisableWhenUpdate, isUpdate
        } = this.props;
        return (
            <React.Fragment>
                <HideShowDataInput inputName={'SECTION_UY_QUYEN'}{...this.props}>
                    <div className="col-md-12 col-xs-12 title-section"><b>4.{this.props.strings.section4}</b></div>
                </HideShowDataInput>
                <HideShowDataInput inputName={'IS_AUTHORIZED'}{...this.props}>
                    <div className="col-md-3 col-xs-12 form-group">
                        <label
                            data-toggle="popover"
                            data-container="body"
                            data-placement="top"
                            title={this.props.language == 'vie' ? "Chú ý" : "Note"}
                            data-content={this.props.strings.tooltipAuth}
                        >{this.props.strings.IS_AUTHORIZED} <span className="required-text"> *</span></label>
                        <DropdownFactory
                            disabled={isDisableWhenView}
                            onSetDefaultValue={onSetDefaultValue}
                            onChange={(type, value) => handleOnChangeInput('IS_AUTHORIZED', type, value)}
                            ID="IS_AUTHORIZED"
                            value="IS_AUTHORIZED"
                            CDTYPE="SY"
                            CDNAME="YESNO"
                            CDVAL={allDataStep3.IS_AUTHORIZED}
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

module.exports = decorators(AuthInfo);
