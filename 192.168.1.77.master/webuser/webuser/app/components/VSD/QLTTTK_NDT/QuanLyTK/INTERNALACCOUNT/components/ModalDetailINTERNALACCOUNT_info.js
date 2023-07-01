import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import DropdownFactory from '../../../../../../utils/DropdownFactory';
import DropdownUtils from 'app/utils/input/DropdownUtils'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import Select from 'react-select'
import 'react-select/dist/react-select.css';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
class ModalDetailINTERNALACCOUNT_info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access: 'ADD',
            autoid: '',
            CUSTODYCD: { label: '', value: '', detail: {} },
            CODEID: { label: '', value: '' },
            POSITIONS: "NULL",
            DESCRIPTION: '',
            // ISFIRSTLOAD: true,
            datagroup: {
                // CUSTODYCD: '',
                FULLNAME: '',
                IDCODE: '',
                IDTYPE: '',
                // CODEID: '',
                // DESCRIPTION: '',
            },
            checkFields: [
                { name: "CUSTODYCD", id: "drdCUSTODYCD" },
                { name: "POSITIONS", id: "drdPOSITIONS" },
                { name: "CODEID", id: "drdCODEID" },
            ],
            isDone: true,
        };
    }
    close() {
        this.refresh();
        // this.setState({ ISFIRSTLOAD: true })
        this.props.closeModalDetail();
    }
    /**
     * Trường hợp EDIT thì hiển thị tất cả thông tin lên cho sửa
     * Trường hơp VIEW thì ẩn các nút sửa không cho duyệt
     * Trường hợp add thì ẩn thông tin chỉ hiện thông tin chung cho người dùng -> Thực hiện -> Mở các thông tin tiếp theo cho người dùng khai
     * @param {*access} nextProps
     */
    componentWillReceiveProps(nextProps) {
        let self = this;
        console.log("componentWillReceiveProps.:", nextProps.access, nextProps.ISFIRSTLOAD)
        if ((nextProps.access == "EDIT" || nextProps.access == "VIEW") && nextProps.ISFIRSTLOAD) {
            self.setState({
                CUSTODYCD: { label: nextProps.DATA.CUSTODYCD, value: nextProps.DATA.CUSTODYCD, detail: nextProps.DATA },
                CODEID: { label: nextProps.DATA.SYMBOL, value: nextProps.DATA.CODEID },
                POSITIONS: nextProps.DATA.POSITIONS,
                DESCRIPTION: nextProps.DATA.DESCRIPTION,
                // ISFIRSTLOAD: false,
                datagroup: {
                    CUSTODYCD: nextProps.DATA.CUSTODYCD,
                    FULLNAME: nextProps.DATA.FULLNAME,
                    IDCODE: nextProps.DATA.IDCODE,
                    IDTYPE: nextProps.DATA.IDTYPE,
                    // POSITIONS: nextProps.DATA.POSITIONS,
                    // CODEID: nextProps.DATA.CODEID,
                },
                access: nextProps.access,
                autoid: nextProps.DATA.AUTOID,
                isDone: true
            })
            self.props.change_ISFIRSTLOAD();
        }
    }
    componentDidMount() {
        // window.$('#drdCUSTODYCD').focus()
    }

    submitGroup() {
        let mssgerr = this.checkValid();
        if (mssgerr == '') {
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""
            }
            let datagroup = this.state.datagroup
            var api = '/account/prc_internal_account';
            var obj = {
                p_action: this.state.access,
                p_autoid: this.state.autoid ? this.state.autoid : "",
                p_custodycd: this.state.CUSTODYCD ? this.state.CUSTODYCD.value : "",
                p_fullname: datagroup.FULLNAME,
                p_idcode: datagroup.IDCODE,
                p_idtype: datagroup.IDTYPE,
                p_positions: this.state.POSITIONS ? this.state.POSITIONS : "",
                p_codeid: this.state.CODEID ? this.state.CODEID.value : "",
                p_description: this.state.DESCRIPTION ? this.state.DESCRIPTION : "",
                pv_language: this.props.lang,
                pv_objname: this.props.OBJNAME
            }
            RestfulUtils.post(api, obj)
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

    checkValid() {
        let mssgerr = ''
        let element = ''
        let value = ''
        let id = ''
        let datacheck = this.state.datagroup
        datacheck.CUSTODYCD = this.state.CUSTODYCD ? this.state.CUSTODYCD.value : ""
        datacheck.CODEID = this.state.CODEID ? this.state.CODEID.value : ""
        datacheck.POSITIONS = this.state.POSITIONS ? this.state.POSITIONS : "NULL"
        for (let index = 0; index < this.state.checkFields.length; index++) {
            element = this.state.checkFields[index];
            value = datacheck[element.name];
            // console.log(element, value, this.props.strings["required" + element.name])
            if (!value || value == undefined || value == '' || value == 'NULL') {
                mssgerr = this.props.strings["required" + element.name];
                id = element.id
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
    refresh() {
        let access = 'ADD'
        let CUSTODYCD = { label: '', value: '', detail: {} }
        let CODEID = { label: '', value: '' }
        let autoid = ''
        let POSITIONS = 'NULL'
        let DESCRIPTION = ''
        let datagroup = {
            // CUSTODYCD: '',
            FULLNAME: '',
            IDCODE: '',
            IDTYPE: '',
            // CODEID: '',

        }
        this.setState({ datagroup, CUSTODYCD, CODEID, POSITIONS, DESCRIPTION, autoid, access })
    }
    onChange(type, e) {
        if (e) {
            let p_action = this.state.access
            if (type == "CUSTODYCD") {
                if (p_action == "ADD") this.refresh()
                let datagroup = { ...e.detail }
                if (p_action == "ADD") this.state.POSITIONS = 'NULL'
                this.setState({ CUSTODYCD: e, datagroup, POSITIONS: this.state.POSITIONS });
            }
            else
                if (type == "IDTYPE") {
                    this.state.datagroup[type] = e.value
                    this.setState({ datagroup: this.state.datagroup });
                }
                else
                    if (type == "POSITIONS") {
                        this.state.POSITIONS = e.value
                        this.setState({ datagroup: this.state.datagroup, POSITIONS: this.state.POSITIONS });
                    }
                    else
                        if (type == "CODEID") {
                            this.state.datagroup[type] = e.value
                            this.setState({ CODEID: e, datagroup: this.state.datagroup });
                        }
        }
        else {
            this.state.datagroup[type] = ''
            if (type == "CUSTODYCD") {
                this.refresh()
            }
            else
                if (type == "IDTYPE") {
                    this.setState({ datagroup: this.state.datagroup });
                }
                else
                    if (type == "POSITIONS") {
                        this.state.POSITIONS = 'NULL'
                        this.setState({ datagroup: this.state.datagroup });
                    }
                    else
                        if (type == "CODEID") {
                            this.setState({ CODEID: { label: '', value: '' }, datagroup: this.state.datagroup });
                        }
        }
    }
    getOptions(input) {
        var self = this
        return RestfulUtils.post('/account/search_all', { key: input, detail: "DETAIL", keyStatus: ["A", "J"] })
            // return RestfulUtils.post('/account/search_all', { key: input, detail: "DETAIL" })
            .then((res) => {
                if (res && res.length > 0) {
                    if (self.state.access == "ADD") {
                        self.setState({ CUSTODYCD: { label: '', value: '', detail: {} } })
                    }
                    return { options: res };
                }
                else {
                    return { options: [] };
                }
            })
    }
    getOptionsSYMBOL(input) {
        return RestfulUtils.post('/allcode/search_all_funds', { key: input })
            .then((res) => {
                return { options: res }
            })
    }
    onchangeDESC(event) {
        if (event) {
            this.setState({ DESCRIPTION: event.target.value });
        }
        else {
            this.setState({ DESCRIPTION: '' });
        }
    }
    render() {
        var ISCUSTODYCD = this.state.CUSTODYCD.value && this.state.CUSTODYCD.value != '' && this.state.CUSTODYCD.value != undefined ? true : false
        var ISVIEW = this.state.access == 'VIEW' ? true : false
        var ISADD = this.state.access == 'ADD' ? true : false
        if (!ISCUSTODYCD) this.state.datagroup = {}
        // console.log("render=================2==", ISCUSTODYCD, this.state.datagroup, this.state.CUSTODYCD, this.state.CODEID)
        return (
            <Modal show={this.props.showModalDetail} >
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="panel-body internalaccount">
                        <div className="add-info-account">
                            <div className={this.state.access == "VIEW" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row">
                                    <div className="col-md-3 ">
                                        <h5 className="highlight"><b>{this.props.strings.custodycd}</b></h5>
                                    </div>
                                    <div className="col-md-5 customSelect ">
                                        <Select.Async
                                            name="form-field-name"
                                            disabled={ISADD ? false : true}
                                            placeholder={this.props.strings.custodycd}
                                            loadOptions={this.getOptions.bind(this)}
                                            value={this.state.CUSTODYCD}
                                            onChange={this.onChange.bind(this, "CUSTODYCD")}
                                            id="drdCUSTODYCD"
                                            ref="refCUSTODYCD"
                                            className="btn-pos-fix_1 btn-with-200"
                                        // backspaceRemoves={true}
                                        // cache={false}
                                        // clearable={true}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.fullname}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input maxLength={500} disabled={true} className="form-control" style={{ with: "100%!important" }} type="text" id="txtFULLNAME" value={ISCUSTODYCD ? this.state.datagroup["FULLNAME"] : ''} />
                                    </div>
                                </div>
                                <div className="col-md-12 row ">
                                    <div className="col-md-3 ">
                                        <h5><b>{this.props.strings.idcode}</b></h5>
                                    </div>
                                    <div className="col-md-5 ">
                                        <input disabled={true} className="form-control" type="text" id="txtIDCODE" value={ISCUSTODYCD ? this.state.datagroup["IDCODE"] : ''} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3 ">
                                        <h5><b>{this.props.strings.idtype}</b></h5>
                                    </div>
                                    <div className="col-md-5 ">
                                        {ISCUSTODYCD ?
                                            <DropdownFactory className="form-control" disabled={true} onChange={this.onChange.bind(this, "IDTYPE")} ID="drdIdtype" value="IDTYPE" CDTYPE="CF" CDNAME="IDTYPE" CDVAL={this.state.datagroup["IDTYPE"]} />
                                            : <input disabled={true} className="form-control" type="text" value="" />
                                        }
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3 ">
                                        <h5><b>{this.props.strings.positions}</b></h5>
                                    </div>
                                    <div className="col-md-5 customSelect ">
                                        {ISCUSTODYCD ?
                                            <DropdownUtils IsNULL={true} className="form-control" disabled={!ISCUSTODYCD} typeValue="CDVAL" typeLabel="CDCONTENT" ID="drdPOSITIONS" value={this.state.POSITIONS} callApi={true} onChange={this.onChange.bind(this)} type="POSITIONS" CDID="" urlApi="/allcode/getlist" optionFilter={{ CDNAME: { value: "POSITIONS", isFilter: true, checkFilter: true }, CDTYPE: { value: "CF", isFilter: true, checkFilter: true } }} />
                                            : <input disabled={true} className="form-control" type="text" value="" />
                                        }
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3 ">
                                        <h5><b>{this.props.strings.codeid}</b></h5>
                                    </div>
                                    <div className="col-md-5 customSelect ">
                                        <Select.Async
                                            name="form-field-name"
                                            // disabled={}
                                            placeholder={this.props.strings.codeid}
                                            loadOptions={this.getOptionsSYMBOL.bind(this)}
                                            value={this.state.CODEID}
                                            onChange={this.onChange.bind(this, "CODEID")}
                                            id="drdCODEID"
                                            className="btn-pos-fix_2 btn-with-200"
                                        // backspaceRemoves={true}
                                        // cache={false}
                                        // clearable={true}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3 ">
                                        <h5><b>{this.props.strings.description}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input disabled={ISVIEW} className="form-control" style={{ with: "100%!important;" }} type="text" value={this.state.DESCRIPTION} onChange={this.onchangeDESC.bind(this)} />
                                    </div>
                                </div>
                            </div>
                            {!ISVIEW ?
                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        <input disabled={!ISCUSTODYCD} type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
                                    </div>
                                </div>
                                : null}
                        </div>
                    </div>
                </Modal.Body>
            </Modal >
        );
    }
}
const stateToProps = state => ({
    lang: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalDetailINTERNALACCOUNT_info')
]);
module.exports = decorators(ModalDetailINTERNALACCOUNT_info);
