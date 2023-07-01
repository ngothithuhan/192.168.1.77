import React, { Component, PureComponent } from 'react'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import HideShowDataInput from '../HideShowDataInput';
import DateInput from "app/utils/input/DateInput";
import DropdownFactory from "app/utils/DropdownFactory";
import Select from "react-select";
import { USER_TYPE_OBJ } from 'app/Helpers';



export class LawInfo extends Component {

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
            'LAW_FULLNAME', 'LAW_BIRTHDAY', 'LAW_NATIONALITY', 'LAW_POSITION', 'LAW_IDCODE_NO', 'LAW_IDCODE_DATE',
            'LAW_IDCODE_ADDRESS', 'LAW_EMAIL', 'LAW_PHONE_CONTACT', 'LAW_GENDER',
            'LAW_VISA_NO',
            'LAW_VISA_DATE',
            'LAW_VISA_ADDRESS',

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

    getIndexSection = (userType) => {
        let { isLoggedOut } = this.props;
        let index = '';
        index = isLoggedOut === true ? '4.' : '5.';
        return index;
    }

    render() {
        let { handleOnChangeInput, userType, allDataStep3, allDataSelect, handleOnChangeUploadFile,
            onSetDefaultValue, isDisableWhenView, isDisableWhenUpdate, isUpdate
        } = this.props;
        return (
            <React.Fragment>
                <HideShowDataInput inputName={'SECTION_DAI_DIEN_PHAP_LUAT'}{...this.props}>
                    <div className="col-md-12 col-xs-12 title-section"><b>{this.getIndexSection(userType)}{this.props.strings.section5}</b></div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'LAW_FULLNAME'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.LAW_FULLNAME} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.LAW_FULLNAME}
                            onChange={(event) => handleOnChangeInput('LAW_FULLNAME', event)}
                            id="LAW_FULLNAME"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'LAW_BIRTHDAY'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.LAW_BIRTHDAY} <span className="required-text"> *</span></label>
                        <DateInput
                            id="LAW_BIRTHDAY"
                            onChange={(type, value) => handleOnChangeInput('LAW_BIRTHDAY', type, value)}
                            value={allDataStep3.LAW_BIRTHDAY}
                            type="LAW_BIRTHDAY"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'LAW_GENDER'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.LAW_GENDER}</label>
                        <DropdownFactory
                            disabled={isDisableWhenView}
                            onSetDefaultValue={onSetDefaultValue}
                            onChange={(type, value) => handleOnChangeInput('LAW_GENDER', type, value)}
                            ID="LAW_GENDER"
                            value="LAW_GENDER"
                            CDTYPE="CF"
                            CDNAME="SEX"
                            CDVAL={allDataStep3.LAW_GENDER}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'LAW_NATIONALITY'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.LAW_NATIONALITY} <span className="required-text"> *</span></label>
                        <DropdownFactory
                            disabled={isDisableWhenView}
                            onSetDefaultValue={onSetDefaultValue}
                            onChange={(type, value) => handleOnChangeInput('LAW_NATIONALITY', type, value)}
                            ID="LAW_NATIONALITY"
                            value="LAW_NATIONALITY"
                            CDTYPE="CF"
                            CDNAME="COUNTRY"
                            CDVAL={allDataStep3.LAW_NATIONALITY}
                        />
                    </div>
                </HideShowDataInput>

                {/* Chức vụ */}
                <HideShowDataInput inputName={'LAW_POSITION'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.LAW_POSITION} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.LAW_POSITION}
                            onChange={(event) => handleOnChangeInput('LAW_POSITION', event)}
                            id="LAW_POSITION"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'LAW_IDCODE_NO'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.LAW_IDCODE_NO} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.LAW_IDCODE_NO}
                            onChange={(event) => handleOnChangeInput('LAW_IDCODE_NO', event)}
                            id="LAW_IDCODE_NO"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'LAW_IDCODE_DATE'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.LAW_IDCODE_DATE} <span className="required-text"> *</span></label>
                        <DateInput
                            id="LAW_IDCODE_DATE"
                            onChange={(type, value) => handleOnChangeInput('LAW_IDCODE_DATE', type, value)}
                            value={allDataStep3.LAW_IDCODE_DATE}
                            type="LAW_IDCODE_DATE"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'LAW_IDCODE_ADDRESS'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.LAW_IDCODE_ADDRESS} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.LAW_IDCODE_ADDRESS}
                            onChange={(event) => handleOnChangeInput('LAW_IDCODE_ADDRESS', event)}
                            id="LAW_IDCODE_ADDRESS"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'LAW_EMAIL'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.LAW_EMAIL} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.LAW_EMAIL}
                            onChange={(event) => handleOnChangeInput('LAW_EMAIL', event)}
                            id="LAW_EMAIL"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'LAW_PHONE_CONTACT'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.LAW_PHONE_CONTACT} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.LAW_PHONE_CONTACT}
                            onChange={(event) => handleOnChangeInput('LAW_PHONE_CONTACT', event)}
                            id="LAW_PHONE_CONTACT"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                {/* Chỉ hiển thị khi quốc tịch khác việt nam */}
                {allDataStep3.LAW_NATIONALITY && allDataStep3.LAW_NATIONALITY !== '234' &&
                    <React.Fragment>
                        <HideShowDataInput inputName={'LAW_VISA_NO'}{...this.props}>
                            <div className="form-group col-md-3 col-xs-12">
                                <label>{this.props.strings.LAW_VISA_NO} </label>
                                <input className="form-control"
                                    value={allDataStep3.LAW_VISA_NO}
                                    onChange={(event) => handleOnChangeInput('LAW_VISA_NO', event)}
                                    id="LAW_VISA_NO"
                                    disabled={isDisableWhenView}
                                />
                            </div>
                        </HideShowDataInput>

                        <HideShowDataInput inputName={'LAW_VISA_DATE'}{...this.props}>
                            <div className="form-group col-md-3 col-xs-12">
                                <label>{this.props.strings.LAW_VISA_DATE} </label>
                                <DateInput
                                    id="LAW_VISA_DATE"
                                    onChange={(type, value) => handleOnChangeInput('LAW_VISA_DATE', type, value)}
                                    value={allDataStep3.LAW_VISA_DATE}
                                    type="LAW_VISA_DATE"
                                    disabled={isDisableWhenView}
                                />
                            </div>
                        </HideShowDataInput>

                        <HideShowDataInput inputName={'LAW_VISA_ADDRESS'}{...this.props}>
                            <div className="form-group col-md-3 col-xs-12">
                                <label>{this.props.strings.LAW_VISA_ADDRESS}</label>
                                <input className="form-control"
                                    value={allDataStep3.LAW_VISA_ADDRESS}
                                    onChange={(event) => handleOnChangeInput('LAW_VISA_ADDRESS', event)}
                                    id="LAW_VISA_ADDRESS"
                                    disabled={isDisableWhenView}
                                />
                            </div>
                        </HideShowDataInput>
                    </React.Fragment>
                }
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

module.exports = decorators(LawInfo);
