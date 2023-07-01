import React, { Component } from 'react';
import Select from 'react-select';
import RestfulUtils from 'app/utils/RestfulUtils'
import { Checkbox } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import DateInput from 'app/utils/input/DateInput';
import DateInputMonth from 'app/utils/input/DateInputMonth';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import { showNotifi } from 'app/action/actionNotification.js';
import InputMask from 'react-input-mask';
import { AllKeyLang } from 'app//Helpers';
// import YearPicker from 'react-year-picker';
import DateInputYear from 'app/utils/input/DateInputYear';

class ReportParamsBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportParams: [],
            showModal: false,
            RPTID: '',
            outParams: {},
            dataParams: {},
            downloadPDF: false,
            downloadXML: false,
            downloadEXCEL: false,
            downloadCSV: false,
            isDisable: {
                isXml: true,
                isPdf: true,
                isExcel: true,
                isCsv: true,
            },
            checkFields: {
                vie: [],
                en: []
            }
        }
    }
    componentWillReceiveProps(nextprops) {

        if (nextprops.showModal) {
            if (nextprops.isClear) {
                this.props.change()
                this.state = {
                    reportParams: [],
                    showModal: false,
                    RPTID: '',
                    outParams: {},
                    dataParams: {},
                    downloadPDF: false,
                    downloadXML: false,
                    downloadEXCEL: false,
                    downloadCSV: false,
                }
                this.state.showModal = nextprops.showModal;
                this.state.RPTID = nextprops.RPTID;
                this.state.reportParams = [];
                this.state.outParams = {};
                this.state.isDisable = {
                    isXml: true,
                    isPdf: true,
                    isExcel: true,
                    isCsv: true,
                }
                this.state.checkFields = {
                    vie: [],
                    en: []
                }
                this.state.selectedOption = '',
                    this.setState(this.state);
                this.getTYPEREPORT(nextprops.TYPEREPORT);
                this.getReportParams(nextprops.RPTID);

            }
        } else {
            if (nextprops.isClear) {
                //   this.props.change()
                this.state.showModal = false;
                this.setState(this.state);
            }
        }
    }
    getReportParams(RPTID) {

        var self = this;
        let caption = ''
        RestfulUtils.post('/report/getreportparams', { RPTID: this.state.RPTID }).then(async (resData) => {
            if (resData.EC == 0) {

                self.state.reportParams = resData.DT;
                console.log('self.state.reportParams:',self.state.reportParams)
                await self.state.reportParams.map(function (i, index) {
                    if (self.props.lang != 'vie') caption = i[self.props.lang.toUpperCase() + '_CAPTION']
                    else caption = i.CAPTION
                    if (i.DEFVAL != null && i.DATATYPE == 'C') {
                        for (let k = 0; k < AllKeyLang.length; k++) {
                            self.state.dataParams[AllKeyLang[k] + i.DEFNAME] = { value: i.DEFVAL, label: i.DEFVAL }
                        }
                        self.state.outParams[i.DEFNAME] = i.DEFVAL;
                    } else {
                        self.state.outParams[i.DEFNAME] = '';
                    }
                    if (i.LLIST && i.LLIST.length > 0) {

                        self.getOptions(i.DEFNAME, i.OBJNAME, i.DEFVAL)
                    }
                    for (let j = 0; j < AllKeyLang.length; j++) {
                        if (AllKeyLang[j] != 'vie') caption = i[AllKeyLang[j].toUpperCase() + '_CAPTION']
                        else caption = i.CAPTION
                        self.state.checkFields[AllKeyLang[j]].push({ name: i.DEFNAME, id: i.DEFNAME, mandatory: i.MANDATORY, caption: caption, mask: i.INVFORMAT })
                    }
                })
                //console.log('======1.self.state.outParams:',self.state.outParams)
                self.ReloadDataCombobox()
                //console.log('======2.self.state.outParams:',self.state.outParams)
                this.setState(self.state)

            } else {
                self.state.reportParams = [];
            }
            // self.setState(self.state);
        })
    }
    getTYPEREPORT(type) {

        var str = type
        var array = []
        var count = str.split(",").length - 1;
        var day = "";
        var download = false
        for (var i = 0; i <= count; i++) {
            if (i == 0) {
                download = true
            } else download = false
            if (i == count) {
                //    console.log('dwa',str.slice(0,str.length-1))
                array.push(str.slice(0));
                if (str.slice(0).toUpperCase() == 'XML') {
                    this.state.isDisable.isXml = false
                    this.state.downloadXML = download;
                }
                else if (str.slice(0).toUpperCase() == 'PDF') {
                    this.state.isDisable.isPdf = false
                    this.state.downloadPDF = download;
                }
                else if (str.slice(0).toUpperCase() == 'XLSX') {
                    this.state.isDisable.isExcel = false
                    this.state.downloadEXCEL = download;
                }
                else {
                    this.state.isDisable.isCsv = false
                    this.state.downloadCSV = download;
                }
            }
            else {
                day = str.substr(0, str.indexOf(',')).toUpperCase();
                str = str.toUpperCase().replace(day + ",", "")
                if (day == 'XML') {
                    this.state.isDisable.isXml = false
                    this.state.downloadXML = download;
                }
                else if (day == 'PDF') {
                    this.state.isDisable.isPdf = false
                    this.state.downloadPDF = download;
                }

                else if (day == 'XLSX') {
                    this.state.isDisable.isExcel = false
                    this.state.downloadEXCEL = download;
                }
                else {
                    this.state.isDisable.isCsv = false
                    this.state.downloadCSV = download;
                }
            }
        }
        this.setState(this.state)

    }

    getOptions(DEFNAME, OBJNAME, DEFVAL) {

        let self = this
        let TLNAME = this.props.AUTH.USERID
        let language = this.props.lang

        RestfulUtils.post('/report/getdropdowndatafield', { DEFNAME, OBJNAME, TLNAME, language, valueall: self.state.outParams, AllKeyLang })
            .then((res) => {

                if (res) {
                    for (let i = 0; i < AllKeyLang.length; i++) {
                        this.state[AllKeyLang[i] + "_data" + DEFNAME] = res.dataResult["result" + AllKeyLang[i]]
                    }
                    this.setState(self.state)
                }


            })
    }

    onGenReport() {
        let self = this
        var mssgerr = '';
        //console.log('=========this.state.outParams:',this.state.outParams)
        //console.log('=========this.state.checkFields:',this.state.checkFields)
        for (let index = 0; index < this.state.checkFields[self.props.lang].length; index++) {
            const mandatory = this.state.checkFields[self.props.lang][index]["mandatory"];
            if (mandatory == 'Y') {
                const element = this.state.checkFields[self.props.lang][index];
                mssgerr = this.checkValid(element.name, element.id, element.caption, element.mask);
            }
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            if (this.state.downloadCSV || this.state.downloadXML || this.state.downloadPDF || this.state.downloadEXCEL) {

                var EXPTYPE = (this.state.downloadPDF ? ',PDF' : '') + (this.state.downloadEXCEL ? ',XLSX' : '') + (this.state.downloadXML ? ',XML' : '') + (this.state.downloadCSV ? ',CSV' : '');
                if (EXPTYPE.length > 0) {
                    EXPTYPE = EXPTYPE.substring(1, EXPTYPE.length);
                }

                this.props.onGenReport(this.state.outParams, EXPTYPE);
                // this.clearValue()

            } else {
                toast.error(this.props.strings.requireddownload, { position: toast.POSITION.BOTTOM_RIGHT });
            }
        }


    }
    clearValue() {
        Object.keys(this.state.dataParams).forEach(v => this.state.dataParams[v] = { value: '', label: '' })
        Object.keys(this.state.outParams).forEach(v => this.state.outParams[v] = '')
        this.setState(this.state)
    }
    ReloadDataCombobox() {
        let self = this
        let reportParams = this.state.reportParams
        this.state.reportParams.map(function (item, index) {
            if ((item.LLIST && item.LLIST.length > 0)&&(item.KEYFILTER &&item.KEYFILTER.length>0)) {
                var pv_keyfilter = item.KEYFILTER ? item.KEYFILTER.split(',') : {};
                var VALUEFILTER = ""
                //console.log('pv_keyfilter:',pv_keyfilter)
                for (var i = 0; i < pv_keyfilter.length; i++) {
                    reportParams.map(function (item, index) {
                        if (item.DEFNAME.toUpperCase() == pv_keyfilter[i].toUpperCase()) {
                            if ((item.LLIST && item.LLIST.length) > 0) {
                                VALUEFILTER += self.state.dataParams[self.props.lang + pv_keyfilter[i]] ? self.state.dataParams[self.props.lang + pv_keyfilter[i]].value + "," : ","
                            }
                            else {
                                VALUEFILTER += self.state.outParams[pv_keyfilter[i]] ? self.state.outParams[pv_keyfilter[i]] + "," : ","
                            }
                        }
                        return null
                    })
                }
                self.getOptionsNoAsync(false, item.DEFNAME, item.OBJNAME, item.KEYFILTER, VALUEFILTER, "")
            }
        })
    }

    onChange(type, OBJNAME, condition, e) {
        let self = this
        if (event.target) {
            this.state.outParams[type] = event.target.value;
        } else {
            this.state.outParams[type] = event.value;
        }
        // this.state.outParams[type] = event.value;
        this.setState({ outParams: this.state.outParams })
        if (e === null) {
            if (this.state.outParams[type] != '') {
                this.state.outParams[type] = '';
                e = { value: '', label: '' }
                if (condition != null && condition != '') {
                    this.ReloadDataCombobox()
                }
                for (let i = 0; i < AllKeyLang.length; i++) {
                    this.state.dataParams[AllKeyLang[i] + type] = e
                }
                this.setState(this.state);
            }
        }
        else {
            if (this.state.outParams[type] != e.value) {
                this.state.outParams[type] = e.value;
                if (condition != null && condition.trim() != '') {
                    this.ReloadDataCombobox()
                }
                for (let i = 0; i < AllKeyLang.length; i++) {
                    this.state.dataParams[AllKeyLang[i] + type] = this.state[AllKeyLang[i] + "_data" + type].filter(nodes => nodes.value == e.value)[0];

                }
                this.setState(this.state);
            }
        }

    }
    getOptionsNoAsync(FIRSTLOAD, DEFNAME, OBJNAME, KEYFILTER, VALUEFILTER, input) {
        // console.log("getOptionsNoAsync================", FIRSTLOAD, DEFNAME, OBJNAME, KEYFILTER, VALUEFILTER)
        let self = this
        let TLNAME = this.props.AUTH.USERID
        let language = this.props.lang

        var PV_KEYFILTER = KEYFILTER ? KEYFILTER : ""
        var PV_VALUEFILTER = VALUEFILTER ? VALUEFILTER : ""
        var pv_input = input ? input : ""
        if (FIRSTLOAD) {
            self.state.dataParams[self.props.lang + i.DEFNAME] = { value: '', label: '', }
            self.setState({
                dataParams: self.state.dataParams,
            });
        }
        self.state[self.props.lang + "_data" + DEFNAME] = []
        self.setState(self.state);
        RestfulUtils.post('/report/getDropdownDataField', { DEFNAME, OBJNAME, TLNAME, language, valueall: self.state.outParams, AllKeyLang, KEYFILTER: PV_KEYFILTER, VALUEFILTER: PV_VALUEFILTER, key: pv_input, tagFields: this.state.outParams })
            .then((res) => {

                if (res) {
                    if (res.Gettagfields != '') {
                        this.state.outParams[res.Gettagfields] = '';
                        for (let i = 0; i < AllKeyLang.length; i++) {
                            this.state.dataParams[AllKeyLang[i] + res.Gettagfields] = { value: '', label: '' }
                            this.state[AllKeyLang[i] + "_data" + res.Gettagfields] = []
                        }
                    }
                    this.state.outParams[DEFNAME] = '';
                    for (let i = 0; i < AllKeyLang.length; i++) {
                        this.state.dataParams[AllKeyLang[i] + DEFNAME] = { value: '', label: '' },
                            this.state[AllKeyLang[i] + "_data" + DEFNAME] = res.dataResult["result" + AllKeyLang[i]]
                    }
                    this.setState(self.state)
                }
            })
    }
    onChange1(type, e) {

        if (e.target) {
            this.state.outParams[type] = e.target.value;
            this.ReloadDataCombobox()
        } else {
            this.state.outParams[type] = e.value;
            this.ReloadDataCombobox()
        }
        this.state.dataParams[type] = e;
        this.setState(this.state);
    }
    onChangeDate(type, event) {
        if (event.target) {
            this.state.outParams[type] = event.target.value;
        } else {
            this.state.outParams[type] = event.value;
        }
        this.setState({ outParams: this.state.outParams })
        this.ReloadDataCombobox()

    }
    onClickCheckbox(type, e) {
        this.state[type] = !this.state[type];
        this.setState(this.state);
    }
    checkValid(name, id, caption, mask) {

        let value = this.state.outParams[name];
        let mssgerr = '';
        if (value == '') {
            mssgerr = caption + this.props.strings.required;
        } else {
            if (mask != null || mask != '') {
                var numMask = value.indexOf(mask)
                if (numMask >= 0) mssgerr = caption + this.props.strings.valid;
            }
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
            window.$(`#${id}`).focus();
        }
        return mssgerr;
    }
    getOptionsCUSTODYCD(type, defval, input) {
        return RestfulUtils.post('/account/search_all_fullname', { key: input })
            .then((res) => {
                if (defval && defval == 'ALL') {
                    res.unshift({ value: 'ALL', label: 'ALL' })
                    this.state.CUSTODYCD = { value: 'ALL', label: 'ALL' }
                    this.state.outParams[type] = 'ALL'
                    this.setState(this.state);
                    return { options: res }
                } else return { options: res }
            })
    }
    onChangeCUSTODYCD(type, e) {
        this.state.outParams[type] = e.value;
        //  this.state.dataParams[type] = e;
        this.state.CUSTODYCD = e;
        this.setState(this.state);
        this.ReloadDataCombobox()
    }
    handleChange(date) {
        console.log(date);
      }
    render() {

        let displayExcel = this.state.isDisable.isExcel == true ? 'none' : 'block'
        let displayPdf = this.state.isDisable.isPdf == true ? 'none' : 'block'
        let displayXml = this.state.isDisable.isXml == true ? 'none' : 'block'
        let displayCsv = this.state.isDisable.isCsv == true ? 'none' : 'block'
        const { reportParams, showModal } = this.state;
        var self = this;
        let caption = ''
        let valuee = null
        return (
            <div style={{ display: showModal ? "inherit" : "none" }} >
                {this.state.reportParams.map(function (i, index) {
                    if (self.props.lang != 'vie') {
                        caption = i[self.props.lang.toUpperCase() + '_CAPTION']

                    }
                    else {
                        caption = i.CAPTION
                    }
                    return (
                        <div className="col-md-12" key={index}>
                            <div className="col-md-2 row-data" style={{ marginTop: "7px" }}><span className="highlight" style={{ fontWeight: "bold" }}>{caption}</span></div>
                            <div className="col-md-6 row-data form-bc fixWidthDatePickerForOthers">

                                {(i.FLDNAME.toUpperCase() == 'CUSTODYCD' || i.FLDNAME == 'p_custodycd') ?
                                    <Select.Async
                                        name="form-field-name"
                                        loadOptions={self.getOptionsCUSTODYCD.bind(self, i.FLDNAME, i.DEFVAL)}
                                        value={self.state.CUSTODYCD}
                                        onChange={self.onChangeCUSTODYCD.bind(self, i.FLDNAME)}
                                        id="cbCUSTODYCD"
                                        clearable={false}

                                    /> :
                                    (i.DATATYPE == 'D') ?
                                        <DateInput placeholder={i.FLDFORMAT} disabled={false} id={i.DEFNAME} onChange={self.onChangeDate.bind(self)} type={i.DEFNAME} value={self.state.outParams[i.DEFNAME] != undefined ? self.state.outParams[i.DEFNAME] : ''} />
                                        :
                                        (i.DATATYPE == 'X') ?
                                            <DateInputMonth placeholder={i.FLDFORMAT} disabled={false} id={i.DEFNAME} onChange={self.onChangeDate.bind(self)} type={i.DEFNAME} value={self.state.outParams[i.DEFNAME] != undefined ? self.state.outParams[i.DEFNAME] : ''} />
                                            :
                                            (i.DATATYPE == 'U') ?
                                            <DateInputYear placeholder={i.FLDFORMAT} disabled={false} id={i.DEFNAME} onChange={self.onChangeDate.bind(self)} type={i.DEFNAME} value={self.state.outParams[i.DEFNAME] != undefined ? self.state.outParams[i.DEFNAME] : ''} />
                                            :
                                            (i.LLIST && i.LLIST.length > 0) ?
                                                <Select
                                                    name="form-field-name"
                                                    options={self.state[self.props.lang + "_data" + i.DEFNAME] ? self.state[self.props.lang + "_data" + i.DEFNAME] : []}
                                                    value={self.state.dataParams[self.props.lang + i.DEFNAME] ? self.state.dataParams[self.props.lang + i.DEFNAME] : { value: '', label: '' }}
                                                    onChange={self.onChange.bind(self, i.DEFNAME, i.OBJNAME, i.TAGFIELD)}
                                                    //  clearable={true}
                                                    backspaceRemoves={false}
                                                    // isLoading={self.state["loading"+i.DEFNAME]==undefined?true:self.state["loading"+i.DEFNAME]}
                                                    id={i.DEFNAME}
                                                />
                                                : <InputMask mask={i.FLDMASK} className="form-control" id={i.DEFNAME} onChange={self.onChange1.bind(self, i.DEFNAME)} placeholder={i.FLDFORMAT} style={{ height: '30px' }} />
                                    }
                            </div>
                            <div className="col-md-4 row-data"></div>
                        </div>
                    )
                })}

                <div className="col-md-12" style={{ display: showModal ? "flex" : "none", textAlign: "center", marginTop: "20px", marginLeft: "14px", }}>
                    {/* <Button style={{ padding: "5px 10px", fontSize: "12px" }} bsStyle="success" onClick={this.onConfirm.bind(this)}>Tra cứu</Button> */}
                    <Button bsStyle="" className="btndangeralt" style={{ padding: "5px 10px", fontSize: "12px", marginRight: '10px' }} onClick={this.onGenReport.bind(this)} id="btnSubmitReport">{this.props.strings.submitreport}</Button>
                    <Checkbox style={{ padding: "5px 10px", marginRight: '10px', display: displayPdf }}
                        checked={this.state.downloadPDF}
                        onChange={this.onClickCheckbox.bind(this, 'downloadPDF')}
                        disabled={this.state.isDisable.isPdf}
                    >PDF</Checkbox>

                    <Checkbox style={{ padding: "5px 10px", marginRight: '10px', display: displayExcel }}
                        checked={this.state.downloadEXCEL}
                        onChange={this.onClickCheckbox.bind(this, 'downloadEXCEL')}
                        disabled={this.state.isDisable.isExcel}
                    >XLSX</Checkbox>

                    <Checkbox style={{ padding: "5px 10px", marginRight: '10px', display: displayXml }}
                        checked={this.state.downloadXML}
                        onChange={this.onClickCheckbox.bind(this, 'downloadXML')}
                        disabled={this.state.isDisable.isXml}
                    >XML</Checkbox>

                    <Checkbox style={{ padding: "5px 10px", marginRight: '10px', display: displayCsv }}
                        checked={this.state.downloadCSV}
                        onChange={this.onClickCheckbox.bind(this, 'downloadCSV')}
                        disabled={this.state.isDisable.isCsv}
                    >CSV</Checkbox>
                </div>
            </div>
        )
    }
}

const stateToProps = state => ({
    lang: state.language.language,

});
const decorators = flow([
    connect(stateToProps),
    translate('ReportParamsBuilder')
]);
module.exports = decorators(ReportParamsBuilder);