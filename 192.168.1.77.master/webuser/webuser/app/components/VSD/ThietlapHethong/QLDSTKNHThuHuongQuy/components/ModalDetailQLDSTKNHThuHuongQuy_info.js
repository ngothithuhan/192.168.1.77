import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import flow from 'lodash.flow';
import Select from 'react-select';
import { connect } from 'react-redux'
import translate from 'app/utils/i18n/Translate.js';
import DropdownFactory from 'app/utils/DropdownFactory'
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';


class ModalDetailQLDSTKNHThuHuongQuy_info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            CODEID: { value: '', label: '' },
            access: 'add',
            datagroup: {
                p_id: '',
                p_codeid: '',
                pv_mbcode: '',
                p_bankactype: '',
                p_bankacc: '',
                p_bankacname: '',
                p_bankname: '',
                p_branch: '',
                p_province: '',
                p_status: '',
                pv_language: this.props.lang,

            },
            checkFields: [
                { name: "p_codeid", id: "cbCODEID" },
                { name: "FULLNAME", id: "drdTransactiontype" },
                { name: "p_bankacname", id: "txtBankaccname" },
                { name: "p_bankacname_en", id: "txtBankaccname_en" },
                { name: "p_bankacc", id: "txtBankaccno" },
                { name: "p_bankname", id: "txtBankname" },
                { name: "p_bankname_en", id: "txtBankname_en" },
                { name: "p_province", id: "txtCity" },
                { name: "p_branch", id: "txtBranhchname" },
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
    componentWillReceiveProps(nextProps) {
        let self = this;


        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()
                this.setState({

                    datagroup: {
                        p_id: nextProps.DATA.ID,
                        p_codeid: nextProps.DATA.CODEID,
                        pv_mbcode: nextProps.DATA.MBCODE,
                        p_bankactype: nextProps.DATA.BANKACTYPE,
                        p_bankacc: nextProps.DATA.BANKACC,
                        p_bankacname: nextProps.DATA.BANKACNAME,
                        p_bankname: nextProps.DATA.BANKNAME,
                        p_bankacname_en: nextProps.DATA.BANKACNAME_EN,
                        p_bankname_en: nextProps.DATA.BANKNAME_EN,
                        p_branch: nextProps.DATA.BRANCH,
                        p_province: nextProps.DATA.PROVINCE,
                        p_status: nextProps.DATA.STATUS,
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME,
                        p_description: nextProps.DATA.DESCRIPTION,
                    },
                    CODEID: { value: nextProps.DATA.CODEID, label: nextProps.DATA.SYMBOL },
                    access: nextProps.access,
                    isDone: true
                })
            }
        }
        else
            if (nextProps.isClear) {
                this.props.change()
                this.setState({

                    datagroup: {
                        p_id: '',
                        p_codeid: '',
                        pv_mbcode: '',
                        p_bankactype: '',
                        p_bankacc: '',
                        p_bankacname: '',
                        p_bankname: '',
                        p_bankacname_en: '',
                        p_bankname_en: '',
                        p_branch: '',
                        p_province: '',
                        p_status: '',
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME,
                        p_description: ''
                    },
                    access: nextProps.access,
                    isDone: false,
                    CODEID: null
                })
            }

    }
    handleChange(type) {
        this.state.collapse[type] = !this.state.collapse[type];
        this.setState({ collapse: this.state.collapse })
    }
    checkValid(name, id) {
        let value = this.state.datagroup[name];
        console.log("checkValid.:", name, value)
        // let value1=this.state.CODEID
        let language = this.props.lang
        let mssgerr = '';
        switch (name) {
            case "p_codeid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredcodeid;
                }
                break;
            case "p_bankacname":
                if (language == "vie") {
                    if (!value || value == '') {
                        mssgerr = this.props.strings.requiredbankacname;
                    }
                }
                else {
                    if (!this.state.datagroup["p_bankacname_en"] || this.state.datagroup["p_bankacname_en"] == '') {
                        mssgerr = this.props.strings.requiredbankacname_en;
                    }
                }

                break;
            case "p_bankacname_en":
                if (language == "vie") {
                    if (!value || value == '') {
                        mssgerr = this.props.strings.requiredbankacname_en;
                    }
                }
                else {
                    if (!this.state.datagroup["p_bankacname"] || this.state.datagroup["p_bankacname"] == '') {
                        mssgerr = this.props.strings.requiredbankacname;
                    }
                }
                break;
            case "p_bankname":
                if (language == "vie") {
                    if (!value || value == '') {
                        mssgerr = this.props.strings.requiredbankname;
                    }
                }
                else {
                    if (this.state.datagroup["p_bankname_en"] == '') {
                        mssgerr = this.props.strings.requiredbankname_en;
                    }
                }
                break;
                break;
            case "p_bankname_en":
                if (language == "vie") {
                    if (!value || value == '') {
                        mssgerr = this.props.strings.requiredbankname_en;
                    }
                }
                else {
                    if (this.state.datagroup["p_bankname"] == '') {
                        mssgerr = this.props.strings.requiredbankname;
                    }
                }
                break;
            case "p_bankacc":
                if (!value || value == '') {
                    mssgerr = this.props.strings.requiredbankacc;
                }
                break;
            /*
            else{
                if(value.length==10){
                    var i=['C','F','P'].filter(nodes=>nodes==value.substr(3,1))
                    if(i==0)
                     mssgerr = this.props.strings.checkbanhacc1;
                }else  mssgerr = this.props.strings.checkbanhacc;
            }

                break;
                */
            case "p_province":
                if (!value || value == '') {
                    mssgerr = this.props.strings.requiredprovince;
                }
                break;
            case "p_branch":
                if (!value || value == '') {
                    mssgerr = this.props.strings.requiredbranch;
                }
                break;

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
    onChange(type, event) {
        let data = {};
        if (event.target) {
            if (type == 'p_bankacc')
                this.state.datagroup[type] = event.target.value.trim();
            else this.state.datagroup[type] = event.target.value
        }
        else {
            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup })
    }
    onSetDefaultValue = (type, value) => {
        if (!this.state.datagroup[type])
            this.state.datagroup[type] = value
    }
    async submitGroup() {
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            var api = '/fund/addfnaccno';
            if (this.state.access == "update") {
                api = '/fund/updatefnaccno';
            }

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }

            RestfulUtils.posttrans(api, this.state.datagroup)
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

    getOptionsSYMBOL(input) {
        return RestfulUtils.post('/allcode/search_all_funds', { key: input })
            .then((res) => {

                return { options: res }
            })
    }
    onChangeSYMBOL(e) {

        var that = this
        if (e && e.value)
            this.state.datagroup["p_codeid"] = e.value
        else this.state.datagroup["p_codeid"] = ''
        this.setState({
            CODEID: e,
            datagroup: this.state.datagroup
        })


    }
    set_data_feettypes(CODEID) {

        RestfulUtils.post('/allcode/getlist_feetypes', { CODEID: CODEID })
            .then((res) => {
                this.setState({
                    data: res
                })

            })
    }
    onChangeDRD(type, event) {
        let data = {};
        if (event.target) {

            this.state.datagroup[type] = event.target.value;
        }
        else {
            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup })
    }
    onValueChange(type, data) {

        this.state.datagroup[type] = data.value
        this.setState(this.state)
    }
    async onSetDefaultValue(type, value) {
        this.state.generalInformation[type] = value;
    }
    render() {
        let displayy = this.state.access == 'view' ? true : false
        let language = this.props.lang
        console.log("ModalDetailQLDSTKNHThuHuongQuy_info=language=", language)
        return (
            <Modal show={this.props.showModalDetail} bsSize="lg" >
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.vfmcode}</b></h5>
                                    </div>
                                    <div className="col-md-3 customSelect">
                                        <Select.Async
                                            name="form-field-name"
                                            placeholder={this.props.strings.vfmcodetype}
                                            loadOptions={this.getOptionsSYMBOL.bind(this)}
                                            value={this.state.CODEID}
                                            onChange={this.onChangeSYMBOL.bind(this)}
                                            id="cbCODEID"
                                            disabled={displayy}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.transactiontype}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup.p_bankactype} onSetDefaultValue={this.onSetDefaultValue} value="p_bankactype" CDTYPE="SA" CDNAME="FEEAPPLYALT" onChange={this.onChangeDRD.bind(this)} ID="drdTransactiontype" />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.distributorname}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <DropdownFactory
                                            disabled={displayy}
                                            onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                                            onChange={this.onChange.bind(this)}
                                            value="pv_mbcode"
                                            CDTYPE="GW"
                                            CDNAME="ACTMEMBERS"
                                            CDVAL={this.state.datagroup["pv_mbcode"]}
                                        />
                                    </div>
                                </div>
                                {language == "vie" ?
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className="highlight"><b>{this.props.strings.bankaccname}</b></h5>
                                        </div>
                                        <div className="col-md-9">
                                            <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.bankaccname} id="txtBankaccname" value={this.state.datagroup["p_bankacname"]} onChange={this.onChange.bind(this, "p_bankacname")} maxLength={250} />
                                        </div>

                                    </div>
                                    :
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className="highlight"><b>{this.props.strings.bankaccname_en}</b></h5>
                                        </div>
                                        <div className="col-md-9">
                                            <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.bankaccname_en} id="txtBankaccname_en" value={this.state.datagroup["p_bankacname_en"]} onChange={this.onChange.bind(this, "p_bankacname_en")} maxLength={250} />
                                        </div>

                                    </div>
                                }
                                {language == "vie" ?
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className="highlight"><b>{this.props.strings.bankaccname_en}</b></h5>
                                        </div>
                                        <div className="col-md-9">
                                            <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.bankaccname_en} id="txtBankaccname_en" value={this.state.datagroup["p_bankacname_en"]} onChange={this.onChange.bind(this, "p_bankacname_en")} maxLength={250} />
                                        </div>

                                    </div>
                                    :
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className="highlight"><b>{this.props.strings.bankaccname}</b></h5>
                                        </div>
                                        <div className="col-md-9">
                                            <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.bankaccname} id="txtBankaccname" value={this.state.datagroup["p_bankacname"]} onChange={this.onChange.bind(this, "p_bankacname")} maxLength={250} />
                                        </div>

                                    </div>
                                }
                                <div className="col-md-12 row">

                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.bankaccno}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input disabled={displayy} className="form-control" id="txtBankaccno" placeholder={this.props.strings.bankaccno} value={this.state.datagroup["p_bankacc"]} onChange={this.onChange.bind(this, "p_bankacc")} />

                                    </div>
                                </div>
                                {language == "vie" ?
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className="highlight"><b>{this.props.strings.bankname}</b></h5>
                                        </div>
                                        <div className="col-md-9">
                                            <input maxLength={50} disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.bankname} id="txtBankname" value={this.state.datagroup["p_bankname"]} onChange={this.onChange.bind(this, "p_bankname")} maxLength={250} />
                                        </div>

                                    </div>
                                    :
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className="highlight"><b>{this.props.strings.bankname_en}</b></h5>
                                        </div>
                                        <div className="col-md-9">
                                            <input maxLength={50} disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.bankname_en} id="txtBankname" value={this.state.datagroup["p_bankname_en"]} onChange={this.onChange.bind(this, "p_bankname_en")} maxLength={250} />
                                        </div>

                                    </div>
                                }
                                {language == "vie" ?
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className="highlight"><b>{this.props.strings.bankname_en}</b></h5>
                                        </div>
                                        <div className="col-md-9">
                                            <input maxLength={50} disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.bankname_en} id="txtBankname" value={this.state.datagroup["p_bankname_en"]} onChange={this.onChange.bind(this, "p_bankname_en")} maxLength={250} />
                                        </div>

                                    </div>
                                    :
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className="highlight"><b>{this.props.strings.bankname}</b></h5>
                                        </div>
                                        <div className="col-md-9">
                                            <input maxLength={50} disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.bankname} id="txtBankname" value={this.state.datagroup["p_bankname"]} onChange={this.onChange.bind(this, "p_bankname")} maxLength={250} />
                                        </div>

                                    </div>
                                }
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.city}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup.p_province} onSetDefaultValue={this.onSetDefaultValue} value="p_province" CDTYPE="CF" CDNAME="PROVINCE" onChange={this.onChangeDRD.bind(this)} ID="drdProvince" />
                                    </div>
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.branhchname}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.branhchname} id="txtBranhchname" value={this.state.datagroup["p_branch"]} onChange={this.onChange.bind(this, "p_branch")} maxLength={50} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.desc}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.desc} id="txtDesc" value={this.state.datagroup["p_description"]} onChange={this.onChange.bind(this, "p_description")} maxLength={1000} />
                                    </div>

                                </div>

                                <div className="col-md-12 row">
                                    <div className="pull-right">

                                        <input disabled={displayy} type="button" className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" onClick={this.submitGroup.bind(this)} />

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
    lang: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalDetailQLDSTKNHThuHuongQuy_info')
]);
module.exports = decorators(ModalDetailQLDSTKNHThuHuongQuy_info);