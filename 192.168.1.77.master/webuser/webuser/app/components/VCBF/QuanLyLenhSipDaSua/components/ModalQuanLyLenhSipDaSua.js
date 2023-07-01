import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import NumberFormat from 'react-number-format';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import moment from 'moment';
class ModalQuanLyLenhSipDaSua extends Component {
    constructor(props) {
        super(props);
        this.state = {

            access: 'add',
            DATA: '',
            AccountInfo: {},
            optionMaNhomCapTren: [],
            optionMaLoaiHinh: [],
            dataMNrow: {}, //obj kq loc dc
            dataMN: [],
            //du lieu can truyen
            p_dealtype: '',
            pv_objname: this.props.OBJNAME,
            pv_language: this.props.language,
            //du lieu lay len
            p_orderid: '',
            p_custodycd: '',
            p_codeid: '',
            p_fullname: '',
            p_qtty: '',
            p_amount: '',
            p_ordervalue: '',
            p_symbol: '',
            p_exectype_desc: '',
            p_status: '',
            p_swsymbol: '',
            p_username: '',
            p_orderdate: '',
            p_ordertime: '',
            p_siptype_desc: '',
            p_oldordervalue: ''
        };
    }
    close() {
        this.props.closeModalDetail();
    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()
                this.setState({
                    p_orderid: nextProps.DATA.ORDERID,
                    p_custodycd: nextProps.DATA.CUSTODYCD,
                    p_codeid: nextProps.DATA.CODEID,
                    p_symbol: nextProps.DATA.SYMBOL,
                    p_fullname: nextProps.DATA.FULLNAME,
                    p_ordervalue: nextProps.DATA.ORDERVALUE,
                    p_amount: nextProps.DATA.ORDERAMT,
                    p_qtty: nextProps.DATA.ORDERQTTY,
                    p_exectype_desc: this.props.language == 'vie' ? nextProps.DATA.EXECTYPE_DESC : nextProps.DATA.EXECTYPE_DESC_EN,
                    p_status: this.props.language == 'vie' ? nextProps.DATA.DESC_STATUS : nextProps.DATA.DESC_STATUS_EN,
                    p_swsymbol: nextProps.DATA.SWSYMBOL,
                    p_username: nextProps.DATA.USERNAME,
                    p_orderdate: nextProps.DATA.TXDATE,
                    p_ordertime: nextProps.DATA.TXTIME,
                    p_dealtype: nextProps.DATA.DEALTYPE,
                    pv_objname: this.props.OBJNAME,
                    pv_language: this.props.language,
                    p_siptype_desc: nextProps.DATA.SIPTYPE_DESC,
                    p_oldordervalue: nextProps.DATA.OLDORDERVALUE,
                    access: nextProps.access,
                })
            }
        }
        else {
            if (nextProps.isClear) {
                this.props.change()
                this.setState({
                    fatca: false,
                    authorize: false,
                    upload: false,
                    p_orderid: '',
                    p_custodycd: '',
                    p_codeid: '',
                    p_fullname: '',
                    p_qtty: '',
                    p_amount: '',
                    p_ordervalue: '',
                    p_symbol: '',
                    p_exectype_desc: '',
                    p_status: '',
                    p_swsymbol: '',
                    p_username: '',
                    p_orderdate: '',
                    p_ordertime: '',
                    p_dealtype: '',
                    pv_language: this.props.language,
                    pv_objname: this.props.OBJNAME,
                    p_siptype_desc: '',
                    p_oldordervalue: '',
                    access: nextProps.access,

                })
            }
        }

    }


    handleChange(type) {
        this.state.collapse[type] = !this.state.collapse[type];
        this.setState({ collapse: this.state.collapse })
    }
    closeModalDetail() {
        this.props.closeModalDetail()
    }

    async submitGroup() {
        var api = '/vcbf/submitConfirmAmendSip';
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""
        }
        let { p_orderid, p_custodycd, p_codeid, p_fullname, p_oldordervalue, p_amount, p_dealtype } = this.state
        RestfulUtils.posttrans(api, {
            p_orderid, p_custodycd, p_codeid, p_fullname, p_oldordervalue, p_amount, p_dealtype,
            language: this.props.language, objname: this.props.OBJNAME
        }).then((res) => {
            //onsole.log('res ', res)
            if (res.EC == 0) {
                datanotify.type = "success"
                datanotify.content = this.props.strings.success;
                dispatch(showNotifi(datanotify));
                this.props.closeModalDetail()
            } else {
                datanotify.type = "error";
                datanotify.content = res.EM;
                dispatch(showNotifi(datanotify));
            }
        })
    }
    showModalDetail(access, bacthang) {
        let titleModal = ""
        let DATA = ""

        switch (access) {
            case "add": titleModal = this.props.strings.modaladd; break
            case "update": titleModal = this.props.strings.modaledit; break;
            case "view": titleModal = this.props.strings.modalview; break
        }
        if (bacthang != undefined) {
            DATA = bacthang
        }

        this.setState({ showModalDetail: true, titleModal: titleModal, databacthang: DATA, accessBACTHANG: access, isClearbacthang: true, loadgrid: false })
    }

    render() {
        let disableWhenView = (this.state.access == 'view')
        return (
            <Modal show={this.props.showModalDetail} bsSize="md" >
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.sohieulenh}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <label className="form-control">{this.state.p_orderid}</label>
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 ><b>{this.props.strings.maccq}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <label className="form-control">{this.state.p_symbol}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.sohieutkgd}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <label className="form-control">{this.state.p_custodycd}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4 ">
                                        <h5><b>{this.props.strings.loailenh}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <label className="form-control">{this.state.p_exectype_desc}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4 ">
                                        <h5><b>{this.props.strings.loaisanpham}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <label className="form-control">{this.state.p_siptype_desc}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 ><b>{this.props.strings.sotiencu}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <NumberFormat className="form-control" value={this.state.p_oldordervalue} displayType={'text'} thousandSeparator={true} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 ><b>{this.props.strings.sotien}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <NumberFormat className="form-control" value={this.state.p_amount} displayType={'text'} thousandSeparator={true} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.trangthai}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <label className="form-control">{this.state.p_status}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.userdat}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <label className="form-control">{this.state.p_username}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.thoigiandat}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <label className="form-control">{this.state.p_ordertime}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.ngaydat}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <label className="form-control">{this.state.p_orderdate}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        <input disabled={disableWhenView} type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
const stateToProps = state => ({
    language: state.language.language,
    tradingdate: state.systemdate.tradingdate
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalQuanLyLenhSipDaSua')
]);
module.exports = decorators(ModalQuanLyLenhSipDaSua);
