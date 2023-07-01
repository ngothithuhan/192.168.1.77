import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { Collapse, Well } from 'react-bootstrap'
import { connect } from 'react-redux'
import GeneralInfo from './GeneralInfo'
import TSLenhGD from './TSLenhGD'
import TGianGD from './TGianGD'
import TradingCycleInfo from './TradingCycleInfo'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';

class ModalDetailQLQM extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: {
                general: true,
                authorize: false,
                fatca: false,
                upload: false,
                quydangki: false,
                general1: false,
                general2: false,
                general3: false,
                general4: false,
                general5: false,
            },
            display: {
                fatca: false,
                authorize: false
            },
            isDone: true,
            access: 'add',
            CUSTID: '',
            dataupdate: {},
            disabled: false,
            new_create: false,
            GeneralInfo: {
                p_CODEID: '',
                p_SYMBOL: '',
                p_NAMEVN: '',
                p_NAME_EN: '',
                p_LICENSENO: '',
                p_LICENSEDATE: '',
                p_LICENSEPLACE: '',
                p_FTYPE: 'O',
                pv_objname: this.props.OBJNAME,
                pv_language: this.props.lang,
                TSLenhGD: {
                    vfmcodehold: '',
                    vfmamountmax: '',
                    vfmamountmin: '',
                    soldoutifodd: 'Y',
                    vfmswamountmin: '',
                    vfmswamountmax: '',
                    minswamt: '',
                },
                TGianGD: {
                    datecloseorderbook: '',
                    timecloseorderbook: '',
                    datereceivemoney: '',
                    timedatereceivemoney: '',
                    dateordermatch: '',
                    timeordermatch: '',
                    dateattribution: '',
                    timeattribution: '',
                    datepayment: '',
                    timepayment: ''
                },
                dataTradingCycleInfo: {
                    transactionperiod: "",
                    firsttradingsession: "",
                    day: "",
                    date: "",
                },
            },
            checkFields: [
                { name: "p_SYMBOL", id: "txtVfmcode", obj: "Info" },
                { name: "p_NAMEVN", id: "txtVietnamesename", obj: "Info" },
                { name: "p_NAME_EN", id: "txtEnglishname", obj: "Info" },

                { name: "vfmcodehold", id: "txtVfmcodehold", obj: "LenhGD" },
                { name: "vfmswamountmin", id: "txtVfmswamountmin", obj: "LenhGD" },
                { name: "vfmswamountmax", id: "txtVfmswamountmax", obj: "LenhGD" },
                { name: "minswamt", id: "txtMinswamt", obj: "LenhGD" },

                { name: "timecloseorderbook", id: "txttimecloseorderbook", obj: "TGianGD" },

                { name: "firsttradingsession", id: "txtFirsttradingsession", obj: "TradingCycleInfo" },
                { name: "day", id: "lblday", obj: "TradingCycleInfo" },
                { name: "date", id: "lbldate", obj: "TradingCycleInfo" },
            ],

        };
    }
    collapse(tab) {
        //  console.log(tab)
        this.state.collapse[tab] = !this.state.collapse[tab];
        // console.log(this.state.collapse)
        this.setState({ collapse: this.state.collapse })
    }
    close() {
        this.props.closeModalDetail();
    }
    /**
     * Trường hợp update thì hiển thị tất cả thông tin lên cho sửa
     * Trường hơp view thì ẩn các nút sửa không cho duyệt
     * Trường hợp add thì ẩn thông tin chỉ hiện thông tin chung cho người dùng -> Thực hiện -> Mở các thông tin tiếp theo cho người dùng khai
     * @param {*access} nextProps
     */
    componentWillReceiveProps(nextProps) {

        let self = this;
        //console.log('componentWillReceiveProps:', nextProps.DATA)

        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()
                this.state.GeneralInfo["p_CODEID"] = nextProps.DATA.CODEID
                this.state.GeneralInfo["p_SYMBOL"] = nextProps.DATA.SYMBOL
                this.state.GeneralInfo["p_FTYPE"] = nextProps.DATA.FTYPE
                this.state.GeneralInfo["p_NAMEVN"] = nextProps.DATA.NAME_VN
                this.state.GeneralInfo["p_NAME_EN"] = nextProps.DATA.NAME_EN
                this.state.GeneralInfo["p_LICENSENO"] = nextProps.DATA.LICENSENO
                this.state.GeneralInfo["p_LICENSEDATE"] = nextProps.DATA.LICENSEDATE
                this.state.GeneralInfo["p_LICENSEPLACE"] = nextProps.DATA.LICENSEPLACE

                this.state.GeneralInfo.TSLenhGD["vfmcodehold"] = nextProps.DATA.MQTTY
                this.state.GeneralInfo.TSLenhGD["vfmamountmax"] = nextProps.DATA.MAXQTTY
                this.state.GeneralInfo.TSLenhGD["vfmamountmin"] = nextProps.DATA.MINQTTY
                this.state.GeneralInfo.TSLenhGD["soldoutifodd"] = nextProps.DATA.SELLFULLODD
                this.state.GeneralInfo.TSLenhGD["vfmswamountmin"] = nextProps.DATA.SWMINQTTY
                this.state.GeneralInfo.TSLenhGD["vfmswamountmax"] = nextProps.DATA.SWMAXQTTY
                this.state.GeneralInfo.TSLenhGD["minswamt"] = nextProps.DATA.MINSWAMT

                this.state.GeneralInfo.TGianGD["datecloseorderbook"] = nextProps.DATA.CLSORDDAY
                this.state.GeneralInfo.TGianGD["timecloseorderbook"] = nextProps.DATA.CLSORDTIME
                this.state.GeneralInfo.TGianGD["datereceivemoney"] = nextProps.DATA.RBANKDAY
                this.state.GeneralInfo.TGianGD["timedatereceivemoney"] = nextProps.DATA.RBANKTIME
                this.state.GeneralInfo.TGianGD["dateordermatch"] = nextProps.DATA.MATCHDAY
                this.state.GeneralInfo.TGianGD["timeordermatch"] = nextProps.DATA.MATCHTIME
                this.state.GeneralInfo.TGianGD["dateattribution"] = nextProps.DATA.EXECDAY
                this.state.GeneralInfo.TGianGD["timeattribution"] = nextProps.DATA.EXECTIME
                this.state.GeneralInfo.TGianGD["datepayment"] = nextProps.DATA.EXECMONNEYD
                this.state.GeneralInfo.TGianGD["timepayment"] = nextProps.DATA.EXECMONNEYT

                this.state.GeneralInfo.dataTradingCycleInfo["transactionperiod"] = nextProps.DATA.CLEARDAY
                this.state.GeneralInfo.dataTradingCycleInfo["firsttradingsession"] = nextProps.DATA.FISTTRADINGDATE
                if (nextProps.DATA.CLEARDAY == "M") {
                    this.state.GeneralInfo.dataTradingCycleInfo["day"] = ""
                    this.state.GeneralInfo.dataTradingCycleInfo["date"] = nextProps.DATA.PEDRIOD
                }
                else {
                    this.state.GeneralInfo.dataTradingCycleInfo["day"] = nextProps.DATA.PEDRIOD
                    this.state.GeneralInfo.dataTradingCycleInfo["date"] = ""
                }
                if (nextProps.access == 'view') {
                    this.state.collapse['general1'] = true
                    this.state.collapse['general2'] = true
                    this.state.collapse['general3'] = true
                    this.state.collapse['general5'] = true
                    this.setState({
                        display: {
                            fatca: true,
                            authorize: true,
                            upload: true,
                            quydangki: true
                        },
                        GeneralInfo: this.state.GeneralInfo,
                        access: nextProps.access,
                        isDone: true,
                        collapse: this.state.collapse
                    })
                }
                else {
                    this.state.collapse['general1'] = false
                    this.state.collapse['general2'] = false
                    this.state.collapse['general3'] = false
                    this.state.collapse['general4'] = false
                    this.state.collapse['general5'] = false
                    this.setState({
                        display: {
                            fatca: true,
                            authorize: true,
                            upload: true,
                            quydangki: true
                        },
                        GeneralInfo: this.state.GeneralInfo,
                        access: nextProps.access,
                        isDone: true,
                        collapse: this.state.collapse
                    })
                }
            }
        }
        else
            if (nextProps.isClear) {
                this.props.change()
                this.setState({
                    display: {
                        fatca: false,
                        authorize: false,
                        upload: false,
                        quydangki: false,
                    },
                    new_create: true,
                    access: nextProps.access,
                    GeneralInfo: {
                        p_CODEID: '',
                        p_SYMBOL: '',
                        p_NAMEVN: '',
                        p_NAME_EN: '',
                        p_LICENSENO: '',
                        p_LICENSEDATE: '',
                        p_LICENSEPLACE: '',
                        p_FTYPE: 'O',
                        pv_objname: this.props.OBJNAME,
                        pv_language: this.props.lang,
                        TSLenhGD: {
                            vfmcodehold: 0,
                            vfmamountmax: 0,
                            vfmamountmin: 0,
                            soldoutifodd: 'Y',
                            vfmswamountmin: 0,
                            vfmswamountmax: 0,
                            minswamt: 0,
                        },
                        TGianGD: {
                            datecloseorderbook: '',
                            timecloseorderbook: '',
                            datereceivemoney: '',
                            timedatereceivemoney: '',
                            dateordermatch: '',
                            timeordermatch: '',
                            dateattribution: '',
                            timeattribution: '',
                            datepayment: '',
                            timepayment: ''
                        },
                        dataTradingCycleInfo: {
                            transactionperiod: "",
                            firsttradingsession: "",
                            day: "",
                            date: "",
                        },
                    },
                    isDone: false
                })
            }

    }


    handleChange(type) {
        this.state.collapse[type] = !this.state.collapse[type];
        this.setState({ collapse: this.state.collapse })
    }
    getvalGeneralInfo(data) {
        //console.log('2')
        if (data)
        this.state.GeneralInfo["p_SYMBOL"] = data.p_SYMBOL
        this.state.GeneralInfo["p_FTYPE"] = data.p_FTYPE
        this.state.GeneralInfo["p_NAMEVN"] = data.p_NAMEVN
        this.state.GeneralInfo["p_NAME_EN"] = data.p_NAME_EN
        this.state.GeneralInfo["p_LICENSENO"] = data.p_LICENSENO
        this.state.GeneralInfo["p_LICENSEDATE"] = data.p_LICENSEDATE
        this.state.GeneralInfo["p_LICENSEPLACE"] = data.p_LICENSEPLACE
        this.setState({
            GeneralInfo: this.state.GeneralInfo
        })
    }
    getvalTSLenhGD(data) {
        //console.log('3')
        let that = this
        if (data) {
            this.state.GeneralInfo["TSLenhGD"] = data
            that.setState({
                GeneralInfo: this.state.GeneralInfo
            })
        }

    }
    getvalTGianGD(data) {
        //console.log('4')
        let that = this
        if (data) {
            this.state.GeneralInfo["TGianGD"] = data
            that.setState({
                GeneralInfo: this.state.GeneralInfo
            })
        }
    }
    getvalTradingCycleInfo(data) {
        //console.log('5')
        let that = this
        if (data) {
            this.state.GeneralInfo["dataTradingCycleInfo"] = data
            that.setState({
                GeneralInfo: this.state.GeneralInfo
            })
        }
    }
    onSetDefaultValue = (type, value) => {
        if (!this.state.GeneralInfo.TGianGD[type])
            this.state.GeneralInfo.TGianGD[type] = value

    }

    async handleSubmit() {
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id, element.obj);
            if (mssgerr !== '')
                break;
        }
        if (mssgerr == '') {
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""
            }
            var api = '/fund/add';
            if (this.state.access == "update") {
                api = '/fund/update';
            }
            RestfulUtils.posttrans(api, this.state.GeneralInfo)
                .then((res) => {
                    if (res.EC == 0) {
                        datanotify.type = "success";
                        datanotify.content = this.props.strings.success;

                        dispatch(showNotifi(datanotify));
                        this.props.load()
                        this.props.closeModalDetail()
                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                    }
                })
        }
    }
    checkValid(name, id, obj) {
        let value = ""
        let mssgerr = '';
        if (obj == 'Info') {
            value = this.state.GeneralInfo[name];
            switch (name) {
                case "p_SYMBOL":
                    if (value == '' || value == undefined) mssgerr = this.props.strings.requiredcodeid;
                    break;
                case "p_NAMEVN":
                    if (value == '' || value == undefined) mssgerr = this.props.strings.requiredvnname;
                    break;
                case "p_NAME_EN":
                    if (value == '' || value == undefined) mssgerr = this.props.strings.requiredenname;
                    break;
                default:
                    break;
            }
        }
        else if (obj == 'LenhGD') {
            value = this.state.GeneralInfo.TSLenhGD[name];
            switch (name) {
                case "vfmcodehold":
                    if (value === '') mssgerr = this.props.strings.requiredvfmcodehold; // cho phép nhập 0
                    break;
                case "vfmswamountmin":
                    if (value === '') mssgerr = this.props.strings.requiredvfmswamountmin; // cho phép nhập 0
                    break;
                case "vfmswamountmax":
                    if (value === '') mssgerr = this.props.strings.requiredvfmswamountmax; // cho phép nhập 0
                    break;
                case "minswamt":
                    if (value === '') mssgerr = this.props.strings.requiredminswamt; // cho phép nhập 0
                    break;
                default:
                    break;
            }
        }
        else if (obj == 'TGianGD') {
            value = this.state.GeneralInfo.TGianGD[name];
            switch (name) {
                case "timecloseorderbook":
                    if (value == '' || value == undefined) mssgerr = this.props.strings.requiredtimecloseorderbook;
                    break;
                default:
                    break;
            }
        }
        else if (obj == 'TradingCycleInfo') {
            value = this.state.GeneralInfo.dataTradingCycleInfo[name];
            switch (name) {
                case "firsttradingsession":
                    if (value == '' || value == null) mssgerr = this.props.strings.requiredfirsttradingsession;
                    break;
                case "day":
                    if (this.state.GeneralInfo.dataTradingCycleInfo['transactionperiod'] == 'W') {
                        if (value == '') mssgerr = this.props.strings.requiredtimeday;
                    }
                    break;
                case "date":
                    if (this.state.GeneralInfo.dataTradingCycleInfo['transactionperiod'] == 'M') {
                        if (value == '') mssgerr = this.props.strings.requiredtimedate;
                    }
                    break;
                default:
                    break;
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
    render() {
        let displayy = this.state.access == 'view' ? true : false

        return (

            <Modal show={this.props.showModalDetail} dialogClassName="custom-modal" bsSize="lg">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <form >
                        <div className="col-md-12 ">

                        </div>
                        <div className={this.state.access == "view" ? "panel-body disable" : "panel-body"}>
                            <div className="col-md-12 module">
                                <div onClick={this.collapse.bind(this, 'general')} className="title-module">{this.props.strings.title1}<i style={{ float: "right", cursor: "pointer" }} className={!this.state.collapse["general"] ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up"}></i> </div>
                                <Collapse in={this.state.collapse["general"]}>
                                    <div className="col-md-12 row-data">
                                        <GeneralInfo onChange={this.getvalGeneralInfo.bind(this)} data={this.props.DATA} datatest={this.state.GeneralInfo} accessGeneralInfo={this.state.access} />
                                    </div>
                                </Collapse>

                            </div>
                            <div className="col-md-12 module">
                                <div onClick={this.collapse.bind(this, 'general1')} className="title-module">{this.props.strings.title2}<i style={{ float: "right", cursor: "pointer" }} className={!this.state.collapse["general1"] ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up"}></i> </div>
                                <Collapse in={this.state.collapse["general1"]}>
                                    <div className="col-md-12 row-data">
                                        <TSLenhGD onChange={this.getvalTSLenhGD.bind(this)} data={this.props.DATA} datatest={this.state.GeneralInfo.TSLenhGD} accessTSLenhGD={this.state.access} />
                                    </div>
                                </Collapse>

                            </div>
                            <div className="col-md-12 module">
                                <div onClick={this.collapse.bind(this, 'general2')} className="title-module">{this.props.strings.title3}<i style={{ float: "right", cursor: "pointer" }} className={!this.state.collapse["general2"] ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up"}></i> </div>
                                <Collapse in={this.state.collapse["general2"]}>
                                    <div className="col-md-12 row-data">
                                        <TGianGD onChange={this.getvalTGianGD.bind(this)} onSetDefaultValue={this.onSetDefaultValue.bind(this)} data={this.props.DATA} datatest={this.state.GeneralInfo.TGianGD} accessTGianGD={this.state.access} />
                                    </div>
                                </Collapse>

                            </div>
                            <div className="col-md-12 module">
                                <div onClick={this.collapse.bind(this, 'general3')} className="title-module">{this.props.strings.title4}<i style={{ float: "right", cursor: "pointer" }} className={!this.state.collapse["general3"] ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up"}></i> </div>
                                <Collapse in={this.state.collapse["general3"]}>
                                    <div className="col-md-12 row-data">
                                        <TradingCycleInfo onChange={this.getvalTradingCycleInfo.bind(this)} data={this.props.DATA} accessTradingCycleInfo={this.state.access} />
                                    </div>
                                </Collapse>

                            </div>

                            <div className="col-md-12 row">
                                <div className="pull-right">
                                    <input disabled={displayy} type="button" className="btn btn-primary" style={{ marginLeft: 0 }} value={this.props.strings.submit} onClick={this.handleSubmit.bind(this)} id="btnSubmit" />
                                </div>
                            </div>
                        </div>
                    </form >

                </Modal.Body>

            </Modal>
        );
    }
}
const stateToProps = state => ({
    lang: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalDetailQLQM')
]);
module.exports = decorators(ModalDetailQLQM);
