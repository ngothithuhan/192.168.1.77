import React from 'react';
import { Popover, Tooltip } from 'react-bootstrap'
import { connect } from 'react-redux';
import "react-toggle/style.css"
import { RadioGroup, Radio } from 'react-radio-group'
import ToggleUtil from 'app/utils/toggle/Toggle'
import DropdownFactory from 'app/utils/DropdownFactory'
import DateInput from 'app/utils/input/DateInput'
import 'react-select/dist/react-select.css';
import { showNotifi } from 'app/action/actionNotification.js';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import './EditAccountStep3.scss'
import { ACTIONS_ACC } from '../../../Helpers';
import _ from 'lodash'
import { mapDataFatca, dataBundleStep3, convertDataStep3, FieldApiFatca } from './UtilityStep3'


const listFormW8 = [
    'ISUSPLACEOFBIRTH',
    'ISUSMAIL',
    'ISUSPHONE',
    'ISUSTRANFER',
    'ISAUTHRIGH',
    'ISSOLEADDRESS'
]
class EditAccountStep3 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hover1: "",
            hover2: "",
            hover3: "",
            date: {},
            radiogroup: '',
            info_fatca: {
                HAS_OLD_DATA: '',
                CUSTID: '',
                ISUSCITIZEN: 'N',
                ISUSPLACEOFBIRTH: 'N',
                ISUSMAIL: 'N',
                ISUSPHONE: 'N',
                ISUSTRANFER: 'N',
                ISAUTHRIGH: 'N',
                ISSOLEADDRESS: 'N',
                OPNDATE: '',
                ISDISAGREE: '',
                ISOPPOSITION: '',
                ISUSSIGN: '',
                REOPNDATE: '',
                W9ORW8BEN: 'W9',
                FULLNAME: '',
                ROOMNUMBER: '',
                CITY: '',
                STATE: '',
                NATIONAL: '',
                ZIPCODE: '',
                ISSSN: '',
                ISIRS: '',
                OTHER: '',
                W8MAILROOMNUMBER: '',
                W8MAILCITY: '',
                W8MAILSTATE: '',
                W8MAILNATIONAL: '',
                W8MAILZIPCODE: '',
                IDENUMTAX: '',
                FOREIGNTAX: '',
                REF: '',
                FIRSTCALL: '',
                FIRSTNOTE: '',
                SECONDCALL: '',
                SECONDNOTE: '',
                THIRTHCALL: '',
                THIRTHNOTE: '',
                ISUS: 'N',
                SIGNDATE: '',
                NOTE: '',
                isActiveISUSCITIZEN: '',//check form
            },
        };
    }


    onSetDefaultInitValue = () => {
        let { action } = this.props
        // if (action === ACTIONS_ACC.EDIT || action === ACTIONS_ACC.VIEW) {
        let data = this.props.allDataEdit.dataStep3;
        let cloneInfo_fatca = { ...this.state.info_fatca }
        if (!_.isEmpty(data)) {
            for (let i = 0; i < mapDataFatca.length; i++) {
                if (data[mapDataFatca[i].key]) {
                    cloneInfo_fatca[mapDataFatca[i].name] = data[mapDataFatca[i].key]
                }
            }
            if (cloneInfo_fatca['ISUSCITIZEN'] === 'Y') {
                cloneInfo_fatca['isActiveISUSCITIZEN'] = 'Y'
            } else {
                cloneInfo_fatca['isActiveISUSCITIZEN'] = 'N'
            }

            let arrayCheckForm = listFormW8.map((item) => {
                return cloneInfo_fatca[item]
            })
            if (arrayCheckForm.every(v => v === "N") && cloneInfo_fatca['ISUSCITIZEN'] === 'N') {
                cloneInfo_fatca['isActiveISUSCITIZEN'] = ''
            }
        } else {
            cloneInfo_fatca['isActiveISUSCITIZEN'] = ''
        }


        this.setState({ info_fatca: cloneInfo_fatca })
        // } 
    }

    handleChange(value) {
        let cloneInfo_fatca = { ...this.state.info_fatca }
        cloneInfo_fatca["ISSSN"] = (value == "ISSSN") ? "Y" : "N";
        cloneInfo_fatca["ISIRS"] = (value == "ISIRS") ? "Y" : "N";
        cloneInfo_fatca["OTHER"] = (value == "OTHER") ? "Y" : "N";
        this.setState({ radiogroup: value, info_fatca: cloneInfo_fatca });
    }

    handleMouseIn(idHover) {
        this.state[idHover] = true
        this.setState({
            ...this.state
        })
    }

    handleMouseOut(idHover) {
        this.state[idHover] = false
        this.setState({
            ...this.state
        })
    }

    close = () => {
        this.props.close();
    };

    backToPrevStep = () => {
        let { allDataEdit, setStep } = this.props
        if (allDataEdit.dataStep1 &&
            (allDataEdit.dataStep1.IS_AUTHORIZED === "Y"
                || allDataEdit.dataStep1.ISAUTH === "Y")) {
            setStep(2)
        } else {
            setStep(1)
        }
    }

    componentWillMount() {
        window.$(function () {
            $('[data-toggle="popover"]').popover({ trigger: "hover" });
        });
        this.onSetDefaultInitValue();
        let { allDataEdit, setStep } = this.props;
        //console.log('isFatca', allDataEdit.dataStep1.IS_FATCA)
        if (allDataEdit && allDataEdit.dataStep1) {
            //console.log('ha_check_isAuth0', allDataEdit.dataStep1.IS_FATCA)
            if (allDataEdit.dataStep1 &&
                (allDataEdit.dataStep1.IS_FATCA === true || allDataEdit.dataStep1.IS_FATCA === "Y")) {
            } else {
                // console.log('ha_check_next1')
                this.props.setParentStateFromChild('dataStep3', FieldApiFatca);
                setStep(4)
            }
        }
        //console.log('ha_info_fatca_did', this.state.info_fatca, this.props.dataStep1, this.props.allDataEdit.dataStep3)
        //console.log('ha_allState_info_fatca_did', this.props.allDataEdit)
    }

    onSetDefaultValue = (type, value) => {
        let cloneInfo_fatca = { ...this.state.info_fatca };
        if (!cloneInfo_fatca[type]) {
            cloneInfo_fatca[type] = value;
            this.setState({
                info_fatca: cloneInfo_fatca
            })
        }
    }

    checkValid() {
        let cloneInfo_fatca = { ...this.state.info_fatca }
        let mssgerr = ''
        let fieldReq = [...listFormW8, 'ISUSCITIZEN']
        let arrayValidation = fieldReq.map((item) => {
            return cloneInfo_fatca[item]
        })
        if (arrayValidation.every(v => v === "N")) {
            mssgerr = this.props.strings.requiredisuscitizen
        } else {
            mssgerr = ''
        }

        if (mssgerr !== '') {
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""
            }
            datanotify.type = "error";
            datanotify.content = mssgerr;
            dispatch(showNotifi(datanotify));
        }
        return mssgerr;
    }

    onSubmit = async () => {
        //console.log('info_fatca', this.state.info_fatca)
        let { action } = this.props
        if (action === ACTIONS_ACC.VIEW) {
            this.props.setStep(4);
            return;
        }
        var mssgerr = '';
        //of check valid
        //mssgerr = this.checkValid()
        if (mssgerr == '') {
            const resultPreCheckStep3 = await dataBundleStep3(this.state.info_fatca)
            if (resultPreCheckStep3 && resultPreCheckStep3.status == "pass") {
                this.props.setParentStateFromChild('dataStep3', this.state.info_fatca)
                this.props.setStep(4);
            } else {
                datanotify.type = "error";
                datanotify.content = resultPreCheckStep3.error;
                dispatch(showNotifi(datanotify));
            }
        }
        // console.log('ha_check_state_fatca', this.state.info_fatca)
        // console.log('ha_allState_in_fatca', this.props.allDataEdit)

    }

    //ISUSCITIZEN
    onChange(type, event) {
        let cloneInfo_fatca = { ...this.state.info_fatca }
        if (event.type == "toggle") {
            cloneInfo_fatca[type] = event.value
            if (type === 'ISUSCITIZEN') {
                cloneInfo_fatca['isActiveISUSCITIZEN'] = event.value
                if (cloneInfo_fatca['isActiveISUSCITIZEN'] === 'Y') {
                    cloneInfo_fatca['W9ORW8BEN'] = 'W9'
                } else {
                    cloneInfo_fatca['W9ORW8BEN'] = 'W8'
                }

            }
            let arrayCheckForm = listFormW8.map((item) => {
                return cloneInfo_fatca[item]
            })

            if (type !== 'ISUSCITIZEN') {
                if (arrayCheckForm.every(v => v === "N")) {
                    cloneInfo_fatca['isActiveISUSCITIZEN'] = 'Y'
                    cloneInfo_fatca['W9ORW8BEN'] = 'W9'
                } else {
                    cloneInfo_fatca['isActiveISUSCITIZEN'] = 'N'
                    cloneInfo_fatca['W9ORW8BEN'] = 'W8'
                }
            }

            if (arrayCheckForm.every(v => v === "N") && cloneInfo_fatca['ISUSCITIZEN'] === 'N') {
                cloneInfo_fatca['isActiveISUSCITIZEN'] = ''
                cloneInfo_fatca['W9ORW8BEN'] = 'W9'
            }

        }
        else if (event.target && event.target.value) {
            cloneInfo_fatca[type] = event.target.value;
        }
        else {
            cloneInfo_fatca[type] = event.value;
        }
        //console.log('ha_clone', cloneInfo_fatca)
        this.setState({ data: this.state.date, info_fatca: cloneInfo_fatca }, () => console.log('ha_check_state_fatca', this.state.info_fatca.isActiveISUSCITIZEN))
    }

    onChangeName = (id, event, dataCustomize, isSelect) => {
        let cloneInfo_fatca = { ...this.state.info_fatca }
        if (event && event.target) {
            cloneInfo_fatca[id] = event.target.value;
        }
        if (dataCustomize) {
            //check theo value -> date input / dropdown factory
            cloneInfo_fatca[id] = dataCustomize.value;
        }

        if (isSelect) {

            cloneInfo_fatca[id] = event;
        }
        this.setState({
            info_fatca: cloneInfo_fatca
        })
    }

    previousPage = () => {
        this.props.previousPage(this.state.info_fatca);
    }

    render() {
        //console.log('check_render', this.state.info_fatca)
        //console.log('isActiveISUSCITIZEN', this.state.info_fatca.isActiveISUSCITIZEN)

        const { user } = this.props.auth;
        let { action } = this.props
        let { isActiveISUSCITIZEN } = this.state.info_fatca
        let isDisableWhenView = action === ACTIONS_ACC.VIEW
        let isDisableWithFormW9
        let isDisableWithFormW8
        console.log('isActiveISUSCITIZEN', isActiveISUSCITIZEN)
        if (isActiveISUSCITIZEN === undefined || isActiveISUSCITIZEN === '') {
            isDisableWithFormW8 = false
            isDisableWithFormW9 = true
        } else {
            isDisableWithFormW9 = this.state.info_fatca.isActiveISUSCITIZEN === 'Y' ? true : false
            isDisableWithFormW8 = this.state.info_fatca.isActiveISUSCITIZEN === 'Y' ? true : false
        }

        let ISVIE = this.props.language == 'vie' ? true : false
        const tooltipStyle1 = {
            display: this.state.hover1 ? 'block' : 'none',
            color: 'red'
        }
        const tooltipStyle2 = {
            display: this.state.hover2 ? 'block' : 'none',
            color: 'red'
        }
        return (

            <div className="edit-account-fatca">
                <div className="modal-fatca background-white">
                    <div className="background-white mb-10">
                        <div className="col-md-12" style={{ paddingTop: '5px' }}>
                            <h5 className="">
                                <b>{this.props.strings.section1}</b>
                            </h5>
                        </div>
                        <div className="col-md-12" style={{ height: '35px' }}>
                            {ISVIE ?
                                <React.Fragment>
                                    <div style={tooltipStyle1}>Nếu tích chọn (1), vui lòng khai báo mẫu W-9</div>
                                    <div style={tooltipStyle2}>Nếu tích chọn tại bất cứ mục (2), (3), (4), (5), (6), (7), vui lòng khai mẫu W-8BEN và hộ chiếu, giấy tờ tương đương chứng nhận là công dân nước ngoài và giải trình bằng văn bản liên quan đến công dân Mỹ</div>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <div style={tooltipStyle1}>If ticked (1), please obtain W-9</div>
                                    <div style={tooltipStyle2}>If ticked (2), (3), (4), (5), (6), (7), please obtain W-9 or W-8BEN and Non-US passport or similar documentation establishing foreign citizenship and written explanation regarding US citizenship.</div>
                                </React.Fragment>}
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10" >
                                <span
                                    data-toggle="popover"
                                    data-container="body"
                                    data-placement="right"
                                    title={this.props.language == 'vie' ? "Chú ý" : "Note"}
                                    data-content={this.props.strings.W9}
                                    onMouseOver={() => this.handleMouseIn("hover1")}
                                    onMouseOut={() => this.handleMouseOut("hover1")}>
                                    {this.props.strings.iisuscitizensus}
                                </span>
                            </div>
                            <div className="col-md-1 ndt-pull-right">
                                <ToggleUtil id="cbFatcaIsuscitizen"
                                    type="ISUSCITIZEN"
                                    disabled={isDisableWhenView || !isDisableWithFormW9}
                                    value={this.state.info_fatca['ISUSCITIZEN']}
                                    onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10" >
                                <span
                                    data-toggle="popover"
                                    data-container="body"
                                    data-placement="right"
                                    title={this.props.language == 'vie' ? "Chú ý" : "Note"}
                                    data-content={this.props.strings.W8}
                                    onMouseOver={() => this.handleMouseIn("hover2")}
                                    onMouseOut={() => this.handleMouseOut("hover2")}>
                                    {this.props.strings.isusplaceofbirth}
                                </span>
                            </div>
                            <div className="col-md-1 ndt-pull-right">
                                <ToggleUtil id="cbFatcaIsusplaceofbirth1"
                                    type="ISUSPLACEOFBIRTH"
                                    disabled={isDisableWhenView || isDisableWithFormW8}
                                    value={this.state.info_fatca['ISUSPLACEOFBIRTH']}
                                    onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10">
                                <span
                                    data-toggle="popover"
                                    data-container="body"
                                    data-placement="right"
                                    title={this.props.language == 'vie' ? "Chú ý" : "Note"}
                                    data-content={this.props.strings.W8}
                                    onMouseOver={() => this.handleMouseIn("hover2")}
                                    onMouseOut={() => this.handleMouseOut("hover2")}>
                                    {this.props.strings.isusmail}
                                </span>
                            </div>
                            <div className="col-md-1 ndt-pull-right">
                                <ToggleUtil id="cbFatcaIsusmail"
                                    type="ISUSMAIL"
                                    disabled={isDisableWhenView || isDisableWithFormW8}
                                    value={this.state.info_fatca['ISUSMAIL']}
                                    onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10">
                                <span
                                    data-toggle="popover"
                                    data-container="body"
                                    data-placement="right"
                                    title={this.props.language == 'vie' ? "Chú ý" : "Note"}
                                    data-content={this.props.strings.W8}
                                    onMouseOver={() => this.handleMouseIn("hover2")}
                                    onMouseOut={() => this.handleMouseOut("hover2")}>
                                    {this.props.strings.isusphone}</span>
                            </div>
                            <div className="col-md-1 ndt-pull-right">
                                <ToggleUtil id="cbFatcaIsusphone"
                                    type="ISUSPHONE"
                                    disabled={isDisableWhenView || isDisableWithFormW8}
                                    value={this.state.info_fatca['ISUSPHONE']}
                                    onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10">
                                <span
                                    data-toggle="popover"
                                    data-container="body"
                                    data-placement="right"
                                    title={this.props.language == 'vie' ? "Chú ý" : "Note"}
                                    data-content={this.props.strings.W8}
                                    onMouseOver={() => this.handleMouseIn("hover2")}
                                    onMouseOut={() => this.handleMouseOut("hover2")}>
                                    {this.props.strings.isustranfer}</span>
                            </div>
                            <div className="col-md-1 ndt-pull-right">
                                <ToggleUtil id="cbFatcaIsustranfer"
                                    type="ISUSTRANFER"
                                    disabled={isDisableWhenView || isDisableWithFormW8}
                                    value={this.state.info_fatca['ISUSTRANFER']}
                                    onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10">
                                <span
                                    data-toggle="popover"
                                    data-container="body"
                                    data-placement="right"
                                    title={this.props.language == 'vie' ? "Chú ý" : "Note"}
                                    data-content={this.props.strings.W8}
                                    onMouseOver={() => this.handleMouseIn("hover2")}
                                    onMouseOut={() => this.handleMouseOut("hover2")}>
                                    {this.props.strings.isauthrigh}</span>
                            </div>
                            <div className="col-md-1 ndt-pull-right">
                                <ToggleUtil id="cbFatcaIsAuthrigh"
                                    type="ISAUTHRIGH"
                                    disabled={isDisableWhenView || isDisableWithFormW8}
                                    value={this.state.info_fatca['ISAUTHRIGH']}
                                    onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10">
                                <span
                                    data-toggle="popover"
                                    data-container="body"
                                    data-placement="right"
                                    title={this.props.language == 'vie' ? "Chú ý" : "Note"}
                                    data-content={this.props.strings.W8}
                                    onMouseOver={() => this.handleMouseIn("hover2")}
                                    onMouseOut={() => this.handleMouseOut("hover2")}>
                                    {this.props.strings.issoleaddress}</span>
                            </div>
                            <div className="col-md-1 ndt-pull-right">
                                <ToggleUtil id="cbFatcaIssoleaddress"
                                    type="ISSOLEADDRESS"
                                    disabled={isDisableWhenView || isDisableWithFormW8}
                                    value={this.state.info_fatca['ISSOLEADDRESS']}
                                    onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                    </div>


                    <div className="background-white mb-10 ">
                        <div className="col-md-12">
                            <h5 className="">
                                <b>{this.props.strings.section2}</b>
                            </h5>
                        </div>
                        <div className="col-md-12">
                            <div className="col-md-3 form-group">
                                <label>{this.props.strings.W8orw8ben}</label>
                                <DropdownFactory id="drdW9ORW8BEN"
                                    disabled={true}
                                    onSetDefaultValue={this.onSetDefaultValue}
                                    CDVAL={this.state.info_fatca["W9ORW8BEN"]}
                                    value="W9ORW8BEN" CDTYPE="CF" CDNAME="W9ORW8BEN"
                                    onChange={(type, value) => this.onChangeName('W9ORW8BEN', type, value)} />
                            </div>
                            <div className="col-md-3 form-group">
                                <label>{this.props.strings.signdate}</label>
                                <DateInput id="txtSigndate"
                                    disabled={isDisableWhenView}
                                    onChange={this.onChange.bind(this)}
                                    value={this.state.info_fatca.SIGNDATE}
                                    type="SIGNDATE" />
                            </div>
                            <div className="col-md-3 form-group">
                                <label>{this.props.strings.reopndate}</label>
                                <DateInput id="txtReopndate"
                                    disabled={isDisableWhenView}
                                    onChange={this.onChange.bind(this)}
                                    value={this.state.info_fatca.REOPNDATE}
                                    type="REOPNDATE" />
                            </div>

                        </div>
                    </div>

                    <div className="background-white mb-10 ">
                        <div className="col-md-12">
                            <h5 className="">
                                <b>{this.props.strings.section3}</b>
                            </h5>
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10">
                                {this.props.strings.isus}
                            </div>
                            <div className="col-md-1 ndt-pull-right">
                                <ToggleUtil id="cbFatcaISUS" type="ISUS"
                                    disabled={isDisableWhenView}
                                    value={this.state.info_fatca['ISUS']}
                                    onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10">
                                {this.props.strings.isdisagree}
                            </div>
                            <div className="col-md-1 ndt-pull-right">
                                <ToggleUtil id="cbFatcaIsdisagree"
                                    type="ISDISAGREE"
                                    disabled={isDisableWhenView}
                                    value={this.state.info_fatca['ISDISAGREE']}
                                    onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                    </div>
                </div>
                <div className="footer-register">
                    <button
                        className="btn-return"
                        onClick={() => this.backToPrevStep()}
                    >
                        {this.props.strings.btnReturn}

                    </button>
                    <button className="btn-continue"
                        onClick={() => this.onSubmit()}
                    >
                        {this.props.strings.buttonContinuous}

                    </button>
                </div>

            </div>
        );
    }
}
const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth
});


const decorators = flow([
    connect(stateToProps),
    translate('EditAccountStep3')
]);
module.exports = decorators(EditAccountStep3);
