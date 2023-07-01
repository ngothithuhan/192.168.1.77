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

class GeneralInfo_FatCa extends React.Component {
    state = {
        // checkFields: [
        //     { name: "ISUSCITIZEN", id: "cbFatcaIsuscitizen" },
        // ],
        hover1: "",
        hover2: "",
        hover3: "",
        date: {},
        radiogroup: '',
        info_fatca: {
            CUSTID: '',
            ISUSCITIZEN: 'N',
            ISUSPLACEOFBIRTH: 'N',
            ISUSMAIL: 'N',
            ISUSPHONE: 'N',
            ISUSTRANFER: 'N',
            ISAUTHRIGH: 'N',
            ISSOLEADDRESS: 'N',
            OPNDATE: '',
            ISDISAGREE: 'N',
            ISOPPOSITION: 'N',
            ISUSSIGN: 'N',
            REOPNDATE: '',
            W9ORW8BEN: '',
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
            NOTE: ''
        }

    };
    componentWillReceiveProps(nextProps) {

    }
    handleChange(value) {

        this.state.info_fatca["ISSSN"] = (value == "ISSSN") ? "Y" : "N";
        this.state.info_fatca["ISIRS"] = (value == "ISIRS") ? "Y" : "N";
        this.state.info_fatca["OTHER"] = (value == "OTHER") ? "Y" : "N";
        this.setState({ radiogroup: value, info_fatca: this.state.info_fatca });
    }
    handleMouseIn1() {
        this.setState({ hover1: true })
    }

    handleMouseOut1() {
        this.setState({ hover1: false })
    }
    handleMouseIn2() {
        this.setState({ hover2: true })
    }

    handleMouseOut2() {
        this.setState({ hover2: false })
    }
    handleMouseIn3() {
        this.setState({ hover3: true })
    }

    handleMouseOut3() {
        this.setState({ hover3: false })
    }
    close = () => {
        this.props.close();
    };

    componentWillMount() {
        //gan lai thong tin cu
        let oldInfor = this.props.GeneralInfoFatca ? this.props.GeneralInfoFatca : (this.props.CfmastInfo ? this.props.CfmastInfo.DT.dataFatca : null)
        if (oldInfor)
            this.setState({ ...this.state, info_fatca: oldInfor })
    }
    componentDidMount() {
        //kiem tra neu (ko fai quoc tich My, ISFATCA = false ) hoac (la khach hang to chuc va fatca = y)thi bo wa
        //update : bo dieu kien check khach hang to chuc && fatca = y
        if (this.props.GeneralInfoMain && (!this.props.GeneralInfoMain.ISFATCA || this.props.GeneralInfoMain.ISFATCA == 'N') && this.props.GeneralInfoMain.COUNTRY != '229') {
            var isForwardStep = (this.props.currentStep - this.props.previousStep) > 0;
            if (isForwardStep) this.props.onSubmit(this.state.info_fatca, true);
            else this.previousPage();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.access !== "add") {
            if (nextProps.CfmastInfo) {
                let oldInfor = nextProps.CfmastInfo.DT.dataFatca;
                if (oldInfor) {
                    this.setState({ ...this.state, info_fatca: oldInfor })
                }
            }
        }
    }
    refreshDataModal() {
        this.setState({
            info_fatca: {
                CUSTID: '',
                ISUSCITIZEN: 'N',
                ISUSPLACEOFBIRTH: 'N',
                ISUSMAIL: 'N',
                ISUSPHONE: 'N',
                ISUSTRANFER: 'N',
                ISAUTHRIGH: 'N',
                ISSOLEADDRESS: 'N',
                OPNDATE: '01/01/0001',
                ISDISAGREE: 'N',
                ISOPPOSITION: 'N',
                ISUSSIGN: '',
                REOPNDATE: '',
                W9ORW8BEN: '',
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
                ISUS: '',
                SIGNDATE: '',
                NOTE: '',
            }
        })
    }
    onSetDefaultValue = (type, value) => {
        if (!this.state.info_fatca[type])
            this.state.info_fatca[type] = value
    }
    checkValid(name, id) {
        let value = this.state.info_fatca[name];
        let mssgerr = '';
        // switch (name) {
        //     case "ISUSCITIZEN":
        //         if (value == 'N')
        //             mssgerr = this.props.strings.requiredisuscitizen;
        //         break;
        //     default:
        //         break;
        // }
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
            window.$(`#${id}`).focus();
        }
        return mssgerr;
    }
    onSubmit = () => {
        var mssgerr = '';
        // for (let index = 0; index < this.state.checkFields.length; index++) {
        //     const element = this.state.checkFields[index];
        //     mssgerr = this.checkValid(element.name, element.id);
        //     if (mssgerr !== '')
        //         break;
        // }

        if (mssgerr == '')
            this.props.onSubmit(this.state.info_fatca, false)
    }

    onChange(type, event) {

        if (event.type == "toggle") {

            this.state.info_fatca[type] = event.value

        }
        else if (event.target && event.target.value) {

            this.state.info_fatca[type] = event.target.value;
        }

        else {

            this.state.info_fatca[type] = event.value;
        }

        this.setState({ data: this.state.date, info_fatca: this.state.info_fatca })
    }

    onChangeName(type, event) {
        this.state.info_fatca[type] = event.value;
        this.setState({ info_fatca: this.state.info_fatca })
    }

    previousPage = () => {
        this.props.previousPage(this.state.info_fatca);
    }

    render() {
        const { user } = this.props.auth;

        let ISCUSTOMER = user;

        ISCUSTOMER = user ? user.ISCUSTOMER ? user.ISCUSTOMER == "Y" ? true : false : false : false;
        let ISVIE = this.props.language == 'vie' ? true : false
        const tooltipStyle1 = {
            display: this.state.hover1 ? 'block' : 'none',
            color: 'red'
        }
        const tooltipStyle2 = {
            display: this.state.hover2 ? 'block' : 'none',
            color: 'red'
        }
        const tooltipStyle3 = {
            display: this.state.hover3 ? 'block' : 'none',
        }
        const popover = (
            <Popover id="modal-popover" title="popover">
                very popover. such engagement
            </Popover>
        );
        const tooltip = (
            <Tooltip id="modal-tooltip">
                wow.
            </Tooltip>
        );
        return (

            <div>
                <div className={this.props.access !== "view" ? "modal-fatca" : "modal-fatca disable"}>
                    <div className="row background-white mb-10">

                        <div className="col-md-12 container" style={{ paddingTop: '5px' }}>
                            <h5 className="">
                                <b>Thông tin bổ sung đạo luật tuân thủ FATCA</b>
                            </h5>
                        </div>
                        <div className="col-md-12" style={{ marginLeft: '15px', height: '35px' }}>
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
                                <span onMouseOver={this.handleMouseIn1.bind(this)} onMouseOut={this.handleMouseOut1.bind(this)}>{this.props.strings.iisuscitizensus}</span>
                            </div>
                            <div className="col-md-2 ndt-pull-right">
                                <ToggleUtil id="cbFatcaIsuscitizen" type="ISUSCITIZEN" value={this.state.info_fatca['ISUSCITIZEN']} onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10" >
                                <span onMouseOver={this.handleMouseIn2.bind(this)} onMouseOut={this.handleMouseOut2.bind(this)}>{this.props.strings.isusplaceofbirth}</span>
                            </div>
                            <div className="col-md-2 ndt-pull-right">
                                <ToggleUtil id="cbFatcaIsusplaceofbirth" type="ISUSPLACEOFBIRTH" value={this.state.info_fatca['ISUSPLACEOFBIRTH']} onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10">
                                <span onMouseOver={this.handleMouseIn2.bind(this)} onMouseOut={this.handleMouseOut2.bind(this)}>{this.props.strings.isusmail}</span>
                            </div>
                            <div className="col-md-2 ndt-pull-right">
                                <ToggleUtil id="cbFatcaIsusmail" type="ISUSMAIL" value={this.state.info_fatca['ISUSMAIL']} onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10">
                                <span onMouseOver={this.handleMouseIn2.bind(this)} onMouseOut={this.handleMouseOut2.bind(this)}>{this.props.strings.isusphone}</span>
                            </div>
                            <div className="col-md-2 ndt-pull-right">
                                <ToggleUtil id="cbFatcaIsusphone" type="ISUSPHONE" value={this.state.info_fatca['ISUSPHONE']} onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10">
                                <span onMouseOver={this.handleMouseIn2.bind(this)} onMouseOut={this.handleMouseOut2.bind(this)}> {this.props.strings.isustranfer}</span>
                            </div>
                            <div className="col-md-2 ndt-pull-right">
                                <ToggleUtil id="cbFatcaIsustranfer" type="ISUSTRANFER" value={this.state.info_fatca['ISUSTRANFER']} onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10">
                                <span onMouseOver={this.handleMouseIn2.bind(this)} onMouseOut={this.handleMouseOut2.bind(this)}>{this.props.strings.isauthrigh}</span>
                            </div>
                            <div className="col-md-2 ndt-pull-right">
                                <ToggleUtil id="cbFatcaIsAuthrigh" type="ISAUTHRIGH" value={this.state.info_fatca['ISAUTHRIGH']} onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10">
                                <span onMouseOver={this.handleMouseIn2.bind(this)} onMouseOut={this.handleMouseOut2.bind(this)}>  {this.props.strings.issoleaddress}</span>
                            </div>
                            <div className="col-md-2 ndt-pull-right">
                                <ToggleUtil id="cbFatcaIssoleaddress" type="ISSOLEADDRESS" value={this.state.info_fatca['ISSOLEADDRESS']} onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                    </div>
                    {/* <div className="clearfix"></div>
                        <div className="row">
                            <div className="col-md-7 date-register fixWidthDatePickerForOthers">{this.props.strings.opndate}  </div>

                            <DateInput id="txtFatcaOpendate" onChange={this.onChange.bind(this)} value={this.state.info_fatca.OPNDATE} type="OPNDATE" />

                        </div> */}
                    {/* <div className="row">
                            <div className="col-md-8">{this.props.strings.isdisagree} </div>


                            <ToggleUtil id="cbFatcaIsdisagree" type="ISDISAGREE" value={this.state.info_fatca['ISDISAGREE']} onChange={this.onChange.bind(this)} />

                        </div> */}
                    {/* <div className="row">
                            <div className="col-md-8">{this.props.strings.isopposition}</div>

                            <ToggleUtil id="cbIsopposition" type="ISOPPOSITION" value={this.state.info_fatca['ISOPPOSITION']} onChange={this.onChange.bind(this)} />

                        </div>
                        <div className="clearfix"></div>
                        <div className="row">
                            <div className="col-md-8">{this.props.strings.isussign}</div>

                            <ToggleUtil id="cbIsussign" type="ISUSSIGN" value={this.state.info_fatca['ISUSSIGN']} onChange={this.onChange.bind(this)} />
                        </div> */}

                    <div className="row background-white mb-10 ">
                        <div className="col-md-12 container">
                            <b><h5>Form</h5></b>
                        </div>
                        <div className="col-md-12">
                            <div className="col-md-3 form-group">
                                <label>{this.props.strings.w9orw8ben}</label>
                                <DropdownFactory id="drdW9ORW8BEN" onSetDefaultValue={this.onSetDefaultValue} CDVAL={this.state.info_fatca["W9ORW8BEN"]} value="W9ORW8BEN" CDTYPE="CF" CDNAME="W9ORW8BEN" onChange={this.onChangeName.bind(this)} />
                            </div>
                            <div className="col-md-3 form-group">
                                <label>{this.props.strings.signdate}</label>
                                <DateInput id="txtSigndate" onChange={this.onChange.bind(this)} value={this.state.info_fatca.SIGNDATE} type="SIGNDATE" />
                            </div>
                            <div className="col-md-3 form-group">
                                <label>{this.props.strings.reopndate}</label>
                                <DateInput id="txtReopndate" onChange={this.onChange.bind(this)} value={this.state.info_fatca.REOPNDATE} type="REOPNDATE" />
                            </div>

                        </div>
                    </div>

                    <div className="row background-white mb-10 ">
                        <div className="col-md-12 container">
                            <b><h5>Đối tượng</h5></b>
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10">
                                {this.props.strings.isus}
                            </div>
                            <div className="col-md-2 ndt-pull-right">
                                <ToggleUtil id="cbFatcaISUS" type="ISUS" value={this.state.info_fatca['ISUS']} onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>
                        <div className="col-md-12 fatca-child">
                            <div className="col-md-10">
                                {this.props.strings.isdisagree}
                            </div>
                            <div className="col-md-2 ndt-pull-right">
                                <ToggleUtil id="cbFatcaIsdisagree" type="ISDISAGREE" value={this.state.info_fatca['ISDISAGREE']} onChange={this.onChange.bind(this)} />
                            </div>
                        </div>
                        <hr></hr>

                    </div>


                    <div style={{}}>
                        <div
                        // className={this.state.info_fatca["ISUSCITIZEN"] == "Y" ? "" : "disable"} 
                        >

                            <div className="col-md-12" >
                                {/* <div className="row" style={{ paddingTop: "5px", paddingBottom: "5px" }} >
                                    <div className="col-md-6">{this.props.strings.fullname}</div>
                                    <input id="txtFatcaFullname" value={this.state.info_fatca.FULLNAME} onChange={this.onChange.bind(this, "FULLNAME")} type="text" className="form-control" />
                                </div> */}
                                {/* <div className="row">

                                    <div className="col-md-6">
                                        <div className="row" style={{ border: "1px solid #ddd" }}>
                                            <h5 style={{ fontSize: "13px", fontWeight: "bold" }}>{this.props.strings.taxcode}</h5>

                                            <RadioGroup
                                                name="radiogroup"
                                                onChange={this.handleChange.bind(this)}
                                                selectedValue={this.state.radiogroup}
                                            >
                                                <div className="col-md-12">
                                                    <label>
                                                        <Radio id="rdFatcaISSSN" value="ISSSN" /> {this.props.strings.isssn}
                                                    </label>
                                                </div>
                                                <div className="col-md-12">
                                                    <label>
                                                        <Radio id="rdFatcaISIRS" value="ISIRS" /> {this.props.strings.isirs}
                                                    </label>
                                                </div>
                                                <div className="col-md-12">
                                                    <label>
                                                        <Radio id="rdFatcaOTHER" value="OTHER" /> {this.props.strings.other}
                                                    </label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                        <div className="row" style={{ border: "1px solid #ddd" }}>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.foreigntax}</div>
                                                <input id="txtFatcaFOREIGNTAX" value={this.state.info_fatca.FOREIGNTAX} onChange={this.onChange.bind(this, "FOREIGNTAX")} type="text" className="form-control" />
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.ref}</div>
                                                <input id="txtFatcaREF" value={this.state.info_fatca.REF} onChange={this.onChange.bind(this, "REF")} type="text" className="form-control" />
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.firstcall}</div>
                                                <div style={{ paddingLeft: "0px", paddingRight: "0px" }} className="col-md-6 fixWidthDatePickerForOthers">

                                                    <DateInput id="txtFatcaFIRSTCALL" onChange={this.onChange.bind(this)} value={this.state.info_fatca.FIRSTCALL} type="FIRSTCALL" />

                                                </div>
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.firstnote}</div>
                                                <input id="txtFatcaFIRSTNOTE" value={this.state.info_fatca.FIRSTNOTE} onChange={this.onChange.bind(this, "FIRSTNOTE")} type="text" className="form-control" />
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.secondcall}</div>
                                                <div style={{ paddingLeft: "0px", paddingRight: "0px" }} className="col-md-6 fixWidthDatePickerForOthers">

                                                    <DateInput id="txtFatcaSECONDCALL" onChange={this.onChange.bind(this)} value={this.state.info_fatca.SECONDCALL} type="SECONDCALL" />
                                                </div>
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.secondnote}</div>
                                                <input id="txtFatcaSECONDNOTE" value={this.state.info_fatca.SECONDNOTE} onChange={this.onChange.bind(this, "SECONDNOTE")} type="text" className="form-control" />

                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.thirthcall}</div>
                                                <div style={{ paddingLeft: "0px", paddingRight: "0px" }} className="col-md-6 fixWidthDatePickerForOthers">

                                                    <DateInput id="txtFatcaTHIRTHCALL" onChange={this.onChange.bind(this)} value={this.state.info_fatca.THIRTHCALL} type="THIRTHCALL" />

                                                </div>
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.thirthnote}</div>
                                                <input id="txtFatcaTHIRTHNOTE" value={this.state.info_fatca.THIRTHNOTE} onChange={this.onChange.bind(this, "THIRTHNOTE")} type="text" className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row" style={{ border: "1px solid #ddd" }}>
                                            <h5 style={{ fontSize: "13px", fontWeight: "bold" }}>{this.props.strings.regaddress}</h5>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.roomnumber}</div>
                                                <input id="txtFatcaRoomnumber" value={this.state.info_fatca.ROOMNUMBER} onChange={this.onChange.bind(this, "ROOMNUMBER")} type="text" className="form-control" style={{ marginTop: "5px" }} />
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.city}</div>
                                                <input id="txtFatcaCity" value={this.state.info_fatca.CITY} onChange={this.onChange.bind(this, "CITY")} type="text" className="form-control" />
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.state}</div>
                                                <input id="txtFatcaState" value={this.state.info_fatca.STATE} onChange={this.onChange.bind(this, "STATE")} type="text" className="form-control" />
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.national}</div>
                                                <input id="txtFatcaNational" value={this.state.info_fatca.NATIONAL} onChange={this.onChange.bind(this, "NATIONAL")} type="text" className="form-control" />
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.zipcode}</div>
                                                <input id="txtFatcaZipcode" value={this.state.info_fatca.ZIPCODE} onChange={this.onChange.bind(this, "ZIPCODE")} type="text" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="row" style={{ border: "1px solid #ddd" }}>
                                            <h5 style={{ fontSize: "13px", fontWeight: "bold" }}>{this.props.strings.regtomail}</h5>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.roomnumber}</div>
                                                <input id="txtW8MAILROOMNUMBER" value={this.state.info_fatca.W8MAILROOMNUMBER} type="text" onChange={this.onChange.bind(this, "W8MAILROOMNUMBER")} className="form-control" style={{ marginTop: "5px" }} />
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.city}</div>
                                                <input id="txtW8MAILCITY" value={this.state.info_fatca.W8MAILCITY} type="text" onChange={this.onChange.bind(this, "W8MAILCITY")} className="form-control" />
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.state}</div>
                                                <input id="txtW8MAILSTATE" value={this.state.info_fatca.W8MAILSTATE} type="text" onChange={this.onChange.bind(this, "W8MAILSTATE")} className="form-control" />
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.national}</div>
                                                <input id="txtW8MAILNATIONAL" value={this.state.info_fatca.W8MAILNATIONAL} onChange={this.onChange.bind(this, "W8MAILNATIONAL")} type="text" className="form-control" />
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">{this.props.strings.zipcode}</div>
                                                <input id="txtW8MAILZIPCODE" value={this.state.info_fatca.W8MAILZIPCODE} onChange={this.onChange.bind(this, "W8MAILZIPCODE")} type="text" className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                </div> */}

                                {/* <div className="row" style={{ border: "1px solid #ddd" }}> */}

                                {/* <div className="row">
                                        <div className="col-md-6">{this.props.strings.note}</div>
                                        <input id="txtFatcaNOTE" value={this.state.info_fatca.NOTE} onChange={this.onChange.bind(this, "NOTE")} type="text" className="form-control" />
                                    </div> */}


                                {/* </div> */}
                            </div>

                        </div>

                    </div>



                </div>
                <div className="col-md-12 row">
                    <div className="btn-next-prev">
                        <input id="btnFatcaPrev" type="button" onClick={this.previousPage} className="btn btn-prev" style={{ marginLeft: 0, marginRight: 5 }} value={this.props.strings.prev} />
                        <input id="btnFatcaSubmit" type="button" onClick={this.onSubmit} className="btn btn-next" style={{ marginRight: 15 }} value={this.props.strings.next} />

                    </div>
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
    translate('GeneralInfo_FatCa')
]);
module.exports = decorators(GeneralInfo_FatCa);
