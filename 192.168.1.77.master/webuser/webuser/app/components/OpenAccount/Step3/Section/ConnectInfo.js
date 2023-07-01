import React, { Component, PureComponent } from 'react'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import HideShowDataInput from '../HideShowDataInput';
import DateInput from "app/utils/input/DateInput";
import DropdownFactory from "app/utils/DropdownFactory";
import Select from "react-select";
import { USER_TYPE_OBJ } from 'app/Helpers';


export class ConnectInfo extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }


    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    shouldComponentUpdate(nextProps, nextState) {
        let { allDataStep3 } = this.props;
        let arrCheck = [
            'COUNTRY_ADDRESS', 'ADDRESS',
            'REGADDRESS', 'COUNTRY_REGADDRESS',
            'EMAIL', 'FAX', 'PHONE_CONTACT'
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

    getTitleAddress = (userType, id) => {
        let titleAddress = '', titleCountry;
        if (userType === USER_TYPE_OBJ.CNTN) {
            titleAddress = id === 'ADDRESS' ? 'Địa chỉ hiện tại' : 'Địa chỉ đăng ký thường trú/ trụ sở';
            titleCountry = id === 'ADDRESS' ? 'Quốc gia (địa chỉ hiện tại)' : 'Quốc gia (Địa chỉ đăng ký thường trú/ trụ sở)';
        }
        if (userType === USER_TYPE_OBJ.CNNN) {
            titleAddress = id === 'ADDRESS' ? 'Địa chỉ đăng ký tạm trú tại Việt Nam' : 'Địa chỉ đăng ký thường trú/ trụ sở';
            titleCountry = id === 'ADDRESS' ? '' : ' Quốc gia (Địa chỉ đăng ký thường trú/ trụ sở)';
        }
        if (userType === USER_TYPE_OBJ.TCTN) {
            titleAddress = id === 'ADDRESS' ? 'Địa chỉ trụ sở chính' : '';
            titleCountry = id === 'ADDRESS' ? 'Quốc gia (địa chỉ trụ sở chính)' : '';
        }
        if (userType === USER_TYPE_OBJ.TCNN) {
            titleAddress = id === 'ADDRESS' ? 'Địa chỉ trụ sở chính' : 'Địa chỉ đăng ký tạm trú tại Việt Nam';
            titleCountry = id === 'ADDRESS' ? 'Quốc gia (địa chỉ trụ sở chính)' : '';
        }
        return {
            titleAddress, titleCountry
        }
    }


    render() {
        let { handleOnChangeInput, userType, allDataStep3, allDataSelect, handleOnChangeUploadFile,
            onSetDefaultValue, isDisableWhenView, isDisableWhenUpdate, isUpdate
        } = this.props;
        return (
            <React.Fragment>

                <div className="col-md-12 col-xs-12 title-section"><b>2.{this.props.strings.section2}</b></div>

                <HideShowDataInput inputName={'ADDRESS'}{...this.props}>
                    <div className="form-group col-md-9 col-xs-12">
                        <label>{this.getTitleAddress(userType, 'ADDRESS').titleAddress} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.ADDRESS}
                            onChange={(event) => handleOnChangeInput('ADDRESS', event)}
                            id="ADDRESS"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'COUNTRY_ADDRESS'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.getTitleAddress(userType, 'ADDRESS').titleCountry} <span className="required-text"> *</span></label>
                        <DropdownFactory
                            disabled={isDisableWhenView}
                            onChange={(type, value) => handleOnChangeInput('COUNTRY_ADDRESS', type, value)}
                            ID="COUNTRY_ADDRESS"
                            value="COUNTRY_ADDRESS"
                            CDTYPE="CF"
                            CDNAME="COUNTRY"
                            CDVAL={allDataStep3.COUNTRY_ADDRESS}
                            onSetDefaultValue={onSetDefaultValue}

                        />
                    </div>
                </HideShowDataInput>


                <HideShowDataInput inputName={'REGADDRESS'}{...this.props}>
                    <div className="form-group col-md-9 col-xs-12">
                        <label>{this.getTitleAddress(userType, 'REGADDRESS').titleAddress}
                        </label>
                        <input className="form-control"
                            value={allDataStep3.REGADDRESS}
                            onChange={(event) => handleOnChangeInput('REGADDRESS', event)}
                            id="REGADDRESS"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'COUNTRY_REGADDRESS'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.getTitleAddress(userType, 'REGADDRESS').titleCountry} </label>
                        <DropdownFactory
                            disabled={isDisableWhenView}
                            onChange={(type, value) => handleOnChangeInput('COUNTRY_REGADDRESS', type, value)}
                            ID="COUNTRY_REGADDRESS"
                            value="COUNTRY_REGADDRESS"
                            CDTYPE="CF"
                            CDNAME="COUNTRY"
                            CDVAL={allDataStep3.COUNTRY}
                            onSetDefaultValue={onSetDefaultValue}

                        />
                    </div>
                </HideShowDataInput>
                {/* padding */}
                <HideShowDataInput inputName={'PADDING2'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12 invisible">
                        <label>PADDING2</label>
                        <input className="form-control"
                            value='PADDING2'
                            id='PADDING2'
                        />
                    </div>
                </HideShowDataInput>
                <HideShowDataInput inputName={'PADDING_EKYC2'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12 invisible">
                        <label>PADDING_EKYC2</label>
                        <input className="form-control"
                            value='PADDING_EKYC2'
                            id='PADDING_EKYC2'
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'EMAIL'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label
                            data-toggle="popover"
                            data-container="body"
                            data-placement="top"
                            title={this.props.language === "vie" ? "Chú ý" : "Note"}
                            data-content={
                                this.props.strings.tooltipEmail
                            }
                        >
                            {this.props.strings.EMAIL} <span className="required-text"> *</span>
                        </label>
                        <input className="form-control"
                            value={allDataStep3.EMAIL}
                            onChange={(event) => handleOnChangeInput('EMAIL', event)}
                            id="EMAIL"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'FAX'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.FAX} </label>
                        <input className="form-control"
                            value={allDataStep3.FAX}
                            onChange={(event) => handleOnChangeInput('FAX', event)}
                            id="FAX"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                {/* Điện thoại liên hệ */}
                <HideShowDataInput inputName={'PHONE_CONTACT'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label
                            data-toggle="popover"
                            data-container="body"
                            data-placement="top"
                            title={this.props.language === "vie" ? "Chú ý" : "Note"}
                            data-content={
                                this.props.strings.tooltipPhone
                            }
                        >
                            {this.props.strings.PHONE_CONTACT} <span className="required-text"> *</span>
                        </label>
                        <input className="form-control"
                            value={allDataStep3.PHONE_CONTACT}
                            onChange={(event) => handleOnChangeInput('PHONE_CONTACT', event)}
                            id="PHONE_CONTACT"
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

module.exports = decorators(ConnectInfo);
