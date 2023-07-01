import React, { Component, PureComponent } from 'react'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import HideShowDataInput from '../HideShowDataInput';
import DateInput from "app/utils/input/DateInput";
import DropdownFactory from "app/utils/DropdownFactory";
import Select from "react-select";
import { USER_TYPE_OBJ } from 'app/Helpers';
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

export class GeneralInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRender: true,
            isOpenSignatuePreview: false
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    shouldComponentUpdate(nextProps, nextState) {
        let { allDataStep3, allDataSelect } = this.props;
        let { isOpenSignatuePreview } = this.state;
        let arrCheck = [
            'POSITION', 'WORK_ADDRESS', 'TAX_NUMBER', 'TAX_COUNTRY', 'IDTYPE',
            'IDCODE_NO', 'IDCODE_DATE', 'IDCODE_ADDRESS', 'PASSPORT', 'PASSPORTDATE', 'PASSPORTPLACE',
            // 'ISSUED_NO', 'ISSUED_DATE', 'ISSUED_ADDRESS',
            'BUSSINESS_NO', 'BUSSINESS_DATE', 'BUSSINESS_ADDRESS', 'SIGNATURE',
            'CUSTTYPE', 'FULLNAME', 'BIRTHDATE', 'SEX', 'NATIONALITY', 'OTHER_NATIONALITY', 'JOB', 'BUSINESS_AREAS',
            'REASON_ENTRY', 'VISA_NO'
        ]
        let isRender = false;
        for (let i = 0; i < arrCheck.length; i++) {
            if (allDataStep3[arrCheck[i]] !== nextProps.allDataStep3[arrCheck[i]]) {
                isRender = true;
                break;
            }
        }

        return isRender || !_.isEqual(allDataSelect, nextProps.allDataSelect)
            || isOpenSignatuePreview !== nextState.isOpenSignatuePreview;
    }

    setSignaturePreviewImg = (status) => {
        if (!this.props.allDataStep3.SIGNATURE) return;
        this.setState({
            isOpenSignatuePreview: status
        })
    }

    render() {

        let { handleOnChangeInput, userType, allDataStep3, allDataSelect, handleOnChangeUploadFile,
            onSetDefaultValue, isDisableWhenView, isDisableWhenUpdate, isUpdate, isClone
        } = this.props;

        let disableNationality = (userType === USER_TYPE_OBJ.CNNN || userType == USER_TYPE_OBJ.TCNN) ? false : true
        return (
            <React.Fragment>

                <div className="col-xs-12 col-md-12 title-section"><b>1.{this.props.strings.section1}</b></div>

                <HideShowDataInput inputName={'CUSTTYPE'} {...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>
                            {this.props.strings.CUSTTYPE}
                        </label>
                        <DropdownFactory
                            disabled={isDisableWhenView || isDisableWhenUpdate}
                            onSetDefaultValue={onSetDefaultValue}
                            onChange={(type, value) => handleOnChangeInput('CUSTTYPE', type, value)}
                            ID="drdCusttype"
                            value="CUSTTYPE"
                            CDTYPE="CF"
                            CDNAME="CUSTTYPE"
                            CDVAL={allDataStep3.CUSTTYPE}
                        />
                    </div>
                </HideShowDataInput>


                <HideShowDataInput inputName={'FULLNAME'} {...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label
                            data-toggle="popover"
                            data-container="body"
                            data-placement="top"
                            title={this.props.language == 'vie' ? "Chú ý" : "Note"}
                            data-content={
                                (userType === USER_TYPE_OBJ.CNTN ||
                                    userType === USER_TYPE_OBJ.CNNN) ?
                                    this.props.strings.tooltipFullName :
                                    this.props.strings.tooltipOrganization
                            }
                        >
                            {(userType === USER_TYPE_OBJ.CNTN || userType === USER_TYPE_OBJ.CNNN) ?
                                this.props.strings.FULLNAME : this.props.strings.FULLNAME_TC
                            }
                            <span className="required-text"> *</span>
                        </label>
                        <input
                            className="form-control"
                            onChange={(event) => this.props.handleOnChangeInput('FULLNAME', event)}
                            value={this.props.allDataStep3.FULLNAME}
                            id={'FULLNAME'}
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'BIRTHDATE'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.BIRTHDATE} <span className="required-text"> *</span></label>
                        <DateInput
                            id="BIRTHDATE"
                            onChange={(type, value) => handleOnChangeInput('BIRTHDATE', type, value)}
                            value={allDataStep3.BIRTHDATE}
                            type="BIRTHDATE"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'SEX'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.SEX} <span className="required-text"> *</span></label>
                        <DropdownFactory
                            disabled={isDisableWhenView}
                            onSetDefaultValue={onSetDefaultValue}
                            onChange={(type, value) => handleOnChangeInput('SEX', type, value)}
                            ID="SEX"
                            value="SEX"
                            CDTYPE="CF"
                            CDNAME="SEX"
                            CDVAL={allDataStep3.SEX}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'NATIONALITY'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label
                            data-toggle="popover"
                            data-container="body"
                            data-placement="top"
                            title={this.props.language == 'vie' ? "Chú ý" : "Note"}
                            data-content={
                                this.props.strings.tooltipNationality
                            }
                        >
                            {this.props.strings.NATIONALITY} <span className="required-text"> *</span>
                        </label>
                        {allDataSelect.optionsCountryType && !_.isEmpty(allDataSelect.optionsCountryType)
                            &&
                            <Select
                                name="form-field-name"
                                disabled={isDisableWhenView || disableNationality}
                                // placeholder={this.props.strings.idtype}
                                options={allDataSelect.optionsCountryType}
                                value={allDataStep3.NATIONALITY}
                                onChange={(event) => handleOnChangeInput('NATIONALITY', event, '', true)}
                                id="NATIONALITY"
                                cache={false}
                            />
                        }
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'OTHER_NATIONALITY'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.OTHER_NATIONALITY}</label>
                        <DropdownFactory
                            disabled={isDisableWhenView}
                            onSetDefaultValue={onSetDefaultValue}
                            onChange={(type, value) => handleOnChangeInput('OTHER_NATIONALITY', type, value)}
                            ID="OTHER_NATIONALITY"
                            value="OTHER_NATIONALITY"
                            CDTYPE="CF"
                            CDNAME="COUNTRY"
                            CDVAL={allDataStep3.OTHER_NATIONALITY}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'JOB'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.JOB} </label>
                        {allDataSelect.optionsJobType && !_.isEmpty(allDataSelect.optionsJobType)
                            &&
                            <Select
                                name="form-field-name"
                                disabled={isDisableWhenView}
                                // placeholder={this.props.strings.idtype}
                                options={allDataSelect.optionsJobType}
                                value={allDataStep3.JOB}
                                onChange={(event) => handleOnChangeInput('JOB', event, '', true)}
                                id="JOB"
                                cache={false}
                            />
                        }
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'BUSINESS_AREAS'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.BUSINESS_AREAS}</label>
                        <input
                            className="form-control"
                            onChange={(event) => handleOnChangeInput('BUSINESS_AREAS', event)}
                            value={allDataStep3.BUSINESS_AREAS}
                            id='BUSINESS_AREAS'
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'POSITION'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.POSITION}</label>
                        <input
                            className="form-control"
                            onChange={(event) => handleOnChangeInput('POSITION', event)}
                            value={allDataStep3.POSITION}
                            id='POSITION'
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>


                <HideShowDataInput inputName={'WORK_ADDRESS'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.WORK_ADDRESS}</label>
                        <input
                            className="form-control"
                            onChange={(event) => handleOnChangeInput('WORK_ADDRESS', event)}
                            value={allDataStep3.WORK_ADDRESS}
                            id='WORK_ADDRESS'
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'TAX_NUMBER'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.TAX_NUMBER}
                            {(userType === USER_TYPE_OBJ.CNTN || userType === USER_TYPE_OBJ.CNNN) ? '' : <span className="required-text"> *</span>}
                        </label>
                        <input
                            className="form-control"
                            onChange={(event) => handleOnChangeInput('TAX_NUMBER', event)}
                            value={allDataStep3.TAX_NUMBER}
                            id='TAX_NUMBER'
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'TAX_COUNTRY'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.TAX_COUNTRY} </label>
                        <DropdownFactory
                            disabled={isDisableWhenView}
                            onSetDefaultValue={onSetDefaultValue}
                            onChange={(type, value) => handleOnChangeInput('TAX_COUNTRY', type, value)}
                            ID="TAX_COUNTRY"
                            value="TAX_COUNTRY"
                            CDTYPE="CF"
                            CDNAME="COUNTRY"
                            CDVAL={allDataStep3.TAX_COUNTRY}
                        />
                    </div>
                </HideShowDataInput>

                {/* padding */}
                <HideShowDataInput inputName={'PADDING1'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12 invisible">
                        <label>PADDING1</label>
                        <input className="form-control"
                            value='PADDING1'
                            id='PADDING1'
                        />
                    </div>
                </HideShowDataInput>
                <HideShowDataInput inputName={'PADDING1'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12 invisible">
                        <label>PADDING1</label>
                        <input className="form-control"
                            value='PADDING1'
                            id='PADDING1'
                        />
                    </div>
                </HideShowDataInput>
                <HideShowDataInput inputName={'PADDING_EKYC'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12 invisible">
                        <label>PADDING_EKYC</label>
                        <input className="form-control"
                            value='PADDING_EKYC'
                            id='PADDING_EKYC'
                        />
                    </div>
                </HideShowDataInput>

                {/* Loại giấy tờ */}
                <HideShowDataInput inputName={'IDTYPE'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.IDTYPE} <span className="required-text"> *</span></label>
                        {allDataSelect.optionsIdType && !_.isEmpty(allDataSelect.optionsIdType)
                            &&
                            <Select
                                name="form-field-name"
                                disabled={isDisableWhenView || isUpdate || isClone}
                                // placeholder={this.props.strings.idtype}
                                options={allDataSelect.optionsIdType}
                                value={allDataStep3.IDTYPE}
                                onChange={(event) => handleOnChangeInput('IDTYPE', event, '', true)}
                                id="IDTYPE"
                                cache={false}
                            />
                        }
                    </div>
                </HideShowDataInput>

                {/* Số đăng ký sở hữu */}
                <HideShowDataInput inputName={'IDCODE_NO'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.IDCODE_NO} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.IDCODE_NO}
                            onChange={(event) => handleOnChangeInput('IDCODE_NO', event)}
                            id='IDCODE_NO'
                            disabled={isDisableWhenView || isClone}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'IDCODE_DATE'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.IDCODE_DATE} <span className="required-text"> *</span></label>
                        <DateInput
                            id="IDCODE_DATE"
                            onChange={(type, value) => handleOnChangeInput('IDCODE_DATE', type, value)}
                            value={allDataStep3.IDCODE_DATE}
                            type="IDCODE_DATE"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'IDCODE_ADDRESS'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.IDCODE_ADDRESS} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.IDCODE_ADDRESS}
                            onChange={(event) => handleOnChangeInput('IDCODE_ADDRESS', event)}
                            id='IDCODE_ADDRESS'
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'PASSPORT'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.PASSPORT} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.PASSPORT}
                            onChange={(event) => handleOnChangeInput('PASSPORT', event)}
                            id='PASSPORT'
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>
                <HideShowDataInput inputName={'PASSPORTDATE'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.PASSPORTDATE} <span className="required-text"> *</span></label>
                        <DateInput
                            id="PASSPORTDATE"
                            onChange={(type, value) => handleOnChangeInput('PASSPORTDATE', type, value)}
                            value={allDataStep3.PASSPORTDATE}
                            type="PASSPORTDATE"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'PASSPORTPLACE'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.PASSPORTPLACE} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.PASSPORTPLACE}
                            onChange={(event) => handleOnChangeInput('PASSPORTPLACE', event)}
                            id='PASSPORTPLACE'
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>


                {/* Số ĐKSH */}
                {/* <HideShowDataInput inputName={'ISSUED_NO'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.ISSUED_NO} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.ISSUED_NO}
                            onChange={(event) => handleOnChangeInput('ISSUED_NO', event)}
                        />
                    </div>
                </HideShowDataInput> */}

                {/* Ngày cấp ĐKSH */}
                {/* <HideShowDataInput inputName={'ISSUED_DATE'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.ISSUED_DATE} <span className="required-text"> *</span></label>
                        <DateInput
                            id="ISSUED_DATE"
                            onChange={(type, value) => handleOnChangeInput('ISSUED_DATE', type, value)}
                            value={allDataStep3.ISSUED_DATE}
                            type="ISSUED_DATE"
                        />
                    </div>
                </HideShowDataInput> */}

                {/* <HideShowDataInput inputName={'ISSUED_ADDRESS'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.ISSUED_ADDRESS} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.ISSUED_ADDRESS}
                            onChange={(event) => handleOnChangeInput('ISSUED_ADDRESS', event)}
                        />
                    </div>
                </HideShowDataInput> */}



                {/* Số đăng ký kinh doanh */}
                <HideShowDataInput inputName={'BUSSINESS_NO'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.BUSSINESS_NO} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.BUSSINESS_NO}
                            onChange={(event) => handleOnChangeInput('BUSSINESS_NO', event)}
                            id='BUSSINESS_NO'
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                {/* Ngày cấp ĐKKD */}
                <HideShowDataInput inputName={'BUSSINESS_DATE'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.BUSSINESS_DATE} <span className="required-text"> *</span></label>
                        <DateInput className="form-control"
                            value={allDataStep3.BUSSINESS_DATE}
                            onChange={(type, value) => handleOnChangeInput('BUSSINESS_DATE', type, value)}
                            id='BUSSINESS_DATE'
                            type="BUSSINESS_DATE"
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>
                <HideShowDataInput inputName={'BUSSINESS_ADDRESS'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.BUSSINESS_ADDRESS} <span className="required-text"> *</span></label>
                        <input className="form-control"
                            value={allDataStep3.BUSSINESS_ADDRESS}
                            onChange={(event) => handleOnChangeInput('BUSSINESS_ADDRESS', event)}
                            id='BUSSINESS_ADDRESS'
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'VISA_NO'}{...this.props}>
                    <div className="col-md-12 col-xs-12"></div>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.VISA_NO}</label>
                        <input className="form-control"
                            value={allDataStep3.VISA_NO}
                            onChange={(event) => handleOnChangeInput('VISA_NO', event)}
                            id='VISA_NO'
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                <HideShowDataInput inputName={'REASON_ENTRY'}{...this.props}>
                    <div className="form-group col-md-3 col-xs-12">
                        <label>{this.props.strings.REASON_ENTRY}</label>
                        <input className="form-control"
                            value={allDataStep3.REASON_ENTRY}
                            onChange={(event) => handleOnChangeInput('REASON_ENTRY', event)}
                            id='REASON_ENTRY'
                            disabled={isDisableWhenView}
                        />
                    </div>
                </HideShowDataInput>

                {/* Bản scan chữ ký */}
                <div className="col-md-12 col-xs-12"></div>
                <HideShowDataInput inputName={'SIGNATURE'}{...this.props} shouldReRender={true}>
                    <div className="form-group col-md-6 col-xs-12">
                        <label>{this.props.strings.SIGNATURE} <span className="required-text"> *</span></label>
                        <div
                            onClick={() => this.setSignaturePreviewImg(true)}
                            className="img-signature-preview"
                            style={{ backgroundImage: `url(${allDataStep3.SIGNATURE})`, cursor: 'pointer' }}
                        ></div>
                        <input
                            className="form-control"
                            type="file"
                            id="SIGNATURE"
                            style={{ display: 'none' }}
                            onChange={(e) => { handleOnChangeUploadFile('SIGNATURE', e) }}
                            disabled={isDisableWhenView}
                        />
                        <label htmlFor="SIGNATURE" className="btn-upload">
                            <i className="fa fa-upload" aria-hidden="true"></i> {this.props.strings.UPLOAD}
                        </label>

                        {this.state.isOpenSignatuePreview && (
                            <Lightbox
                                mainSrc={(allDataStep3.SIGNATURE)}
                                onCloseRequest={() => this.setState({ isOpenSignatuePreview: false })}
                                reactModalStyle={{ overlay: { zIndex: 10000 } }}
                            />
                        )}
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

module.exports = decorators(GeneralInfo);
