import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import DropdownFactory from 'app/utils/DropdownFactory';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import NumberFormat from 'react-number-format';

class ModalDieuChinhNDNopTien extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access: 'add',
            DATA: '',
            checkFields: [
            ],
        };
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
    async componentWillReceiveProps(nextProps) {
        let self = this;
        //console.log('nextProps.acces', nextProps.access)
        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()

                this.setState({
                    p_autoid: nextProps.DATA.AUTOID,
                    p_txnum: nextProps.DATA.TXNUM,
                    p_txdate: nextProps.DATA.TXDATE,
                    p_symbol: nextProps.DATA.SYMBOL,
                    p_codeid: nextProps.DATA.CODEID,
                    p_descbank: nextProps.DATA.DESCBANK,
                    p_custodycd: nextProps.DATA.CUSTODYCD,
                    p_amt: nextProps.DATA.AMT,
                    p_cistatus: nextProps.DATA.CISTATUS,
                    p_desc: '',
                    pv_objname: this.props.OBJNAME,
                    pv_language: this.props.language,
                    access: nextProps.access,
                })
            }
        }
        else {
            //this.setDefaultNCT()
            if (nextProps.isClear) {

                this.props.change()

                this.setState({
                    p_autoid: '',
                    p_txnum: '',
                    p_txdate: '',
                    p_symbol: '',
                    p_codeid: '',
                    p_descbank: '',
                    p_custodycd: '',
                    p_amt: '',
                    p_cistatus: '',
                    p_desc: '',
                    pv_objname: this.props.OBJNAME,
                    pv_language: this.props.language,
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

    onChange(type, event) {
        if (event.target) {
            this.state[type] = event.target.value;
        }
        else {
            this.state[type] = event.value;
        }
        this.setState({
            //sua dien giai bank
            p_p_descbank: this.state.p_descbank,
        })
    }

    checkValid(name, id) {
        let value = this.state[name];
        let mssgerr = '';

        switch (name) {

            default:
                break;
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
    onValueChange(type, data) {
        this.state[type] = data.value
        this.setState(this.state)
    }
    async submitCashMod() {
        //console.log('this.state.p_prgrpid', this.state.p_prgrpid)

        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }
        if (mssgerr == '') {
            var api = '/vcbf/prc_iv_mod_cash_3012';
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""
            }
            let self = this
            RestfulUtils.posttrans(api, {
                autoid: this.state.p_autoid,
                txnum: this.state.p_txnum,
                txdate: this.state.p_txdate,
                codeid: this.state.p_codeid,
                custodycd: this.state.p_custodycd,
                descbank: this.state.p_descbank,
                amt: this.state.p_amt,
                desc: this.state.p_desc,
                cistatus: this.state.p_cistatus,
                p_language: this.props.language, pv_objname: this.props.OBJNAME
            })
                .then((res) => {
                    //onsole.log('res ', res)
                    if (res.EC == 0) {
                        datanotify.type = "success"

                        datanotify.content = this.props.strings.success;
                        dispatch(showNotifi(datanotify));
                        this.props.closeModalDetail()
                        this.props.createSuccess()


                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                    }

                })

        }
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
                                        <h5 className="highlight"><b>{this.props.strings.ngaychungtu}</b></h5>
                                    </div>
                                    <div className="col-md-8 fixWidthDatePickerForOthers">
                                        <label className="form-control">{this.state.p_txdate}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.sochungtu}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-control">{this.state.p_txnum}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.maquy}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-control">{this.state.p_symbol}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.noidungchuyen}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <input maxLength='1000' disabled={disableWhenView} className="form-control" value={this.state.p_descbank} onChange={this.onChange.bind(this, "p_descbank")} id="txtdescbank" />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.sotkchuyen}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-control">{this.state.p_custodycd}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.sotienchuyen}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <NumberFormat thousandSeparator={true}  disabled={disableWhenView} className="form-control" value={this.state.p_amt} onValueChange={this.onValueChange.bind(this, "p_amt")} id="txtamt"  />
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.diengiai}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <input maxLength='1000' value={this.state.p_desc} onChange={this.onChange.bind(this, "p_desc")} ref="txtDesc" className="form-control" id="txtDesc" type="text" placeholder={this.props.strings.labelinput} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        <input disabled={disableWhenView} type="button" onClick={this.submitCashMod.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
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
    translate('ModalDieuChinhNDNopTien')
]);
module.exports = decorators(ModalDieuChinhNDNopTien);
