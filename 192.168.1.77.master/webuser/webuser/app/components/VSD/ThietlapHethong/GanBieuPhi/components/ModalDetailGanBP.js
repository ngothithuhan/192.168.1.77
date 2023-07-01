import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import DropdownFactory from '../../../../../utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import Select from 'react-select';
import { showNotifi } from 'app/action/actionNotification.js';
import { getExtensionByLang } from 'app/Helpers'


class ModalDetailGanBP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objecttype: { value: '', label: '' },
            object: { value: '', label: '' },
            FEEID: { value: '', label: '' },
            access: 'add',
            feetypename: '',
            datagroup: {
                p_id: '',
                p_feeid: '',
                p_feeapplyname: '',
                p_objfeetype: '',
                p_objfeevalue: '',
                p_feeapply: '',
                p_status: '',
                p_pstatus: '',
                p_ver: '',
                p_lastchange: '',
                pv_language: this.props.lang,
            },
            checkFields: [
                { name: "p_feeid", id: "txtFeeid" },
                { name: "p_frdate", id: "txtfromdate" },
                { name: "p_todate", id: "txttodate" },
                { name: "p_objfeetype", id: "txtObjecttype" },
                { name: "p_objfeevalue", id: "txtObject" },


            ],
            isDone: true,
            isLoadingExternally: false,
            loaiBP: '',

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

        if (nextProps.access == "update" || nextProps.access == "view") {

            if (nextProps.isClear) {
                this.props.change()
                this.setState({
                    datagroup: {
                        p_id: nextProps.DATA.ID,
                        p_feeid: nextProps.DATA.FEEID,
                        p_feeapplyname: "",
                        p_objfeetype: nextProps.DATA.OBJFEETYPECD,
                        p_objfeevalue: nextProps.DATA.OBJFEEVALUE,
                        p_feeapply: nextProps.DATA.FEEAPPLYCD,
                        p_frdate: nextProps.DATA.FRDATE,
                        p_todate: nextProps.DATA.TODATE,
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME

                    },
                    loaiBP: nextProps.DATA.FEETYPECD,
                    feetypename: nextProps.DATA[getExtensionByLang("FEETYPEDES", this.props.lang)],
                    access: nextProps.access,
                    objecttype: { value: nextProps.DATA.OBJFEETYPECD, label: nextProps.DATA[getExtensionByLang("OBJFEETYPEDES", this.props.lang)] },
                    object: { value: nextProps.DATA.OBJFEEVALUE, label: nextProps.DATA.OBJFEEVALUE == 'ALL' ? this.props.strings.all : nextProps.DATA[getExtensionByLang("OBJFEEVALUEDES", this.props.lang)] },
                    FEEID: { value: nextProps.DATA.FEEID, label: nextProps.DATA.FEEFULLNAME },

                })
            }
        }
        else
            if (nextProps.isClear) {

                this.props.change()
                this.setState({
                    datagroup: {
                        p_id: '',
                        p_feeid: '',
                        p_feeapplyname: '',
                        p_objfeetype: '',
                        p_objfeevalue: '',
                        p_feeapply: '',
                        p_frdate: '',
                        p_todate: '',
                        pv_objname: this.props.OBJNAME,
                        pv_language: this.props.lang,
                    },
                    feetypename: "",
                    loaiBP: '',
                    access: 'add',
                    objecttype: { value: '', label: '' },
                    object: { value: '', label: '' },
                    FEEID: { value: '', label: '' },
                    dataOBJTYPE: [],
                    dataOBJ: []
                })

            }

    }

    handleChange(type) {
        this.state.collapse[type] = !this.state.collapse[type];
        this.setState({ collapse: this.state.collapse })
    }
    onChange(type, event) {
        let data = {};
        if (event.target) {

            this.state.datagroup[type] = event.target.value;
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
    checkValid(name, id) {

        let value = this.state.datagroup[name];
        let mssgerr = '';
        switch (name) {

            case "p_feeid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredfeeid;
                }
                break;
            case "p_frdate":
                if (value == '') {

                    mssgerr = this.props.strings.requiredfrdate;
                }
                break;
            case "p_todate":
                if (value == '') {
                    mssgerr = this.props.strings.requiredtodate;
                }
                break;
            case "p_objfeetype":
                if (value == '') {
                    mssgerr = this.props.strings.requiredobjfeetype;
                }
                break;

            case "p_objfeevalue":
                if (value == '') {
                    mssgerr = this.props.strings.requiredobjfeevalue;
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
    async submitGroup() {
        //console.log(this.state.datagroup)
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            var api = '/fund/addfeeassign';
            if (this.state.access == "update") {
                api = '/fund/updatefeeassign';
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
    getOptionsfeeid(input) {
        let data = {

            p_language: this.props.lang,
        }
        return RestfulUtils.post('/fund/getlistfeeassignfeeid', { data })
            .then((res) => {
                return { options: res }
            })
    }
    async getOptionsobjecttype(input) {

        let data = {
            p_language: this.props.lang,
            feetype: input
        }
        await RestfulUtils.post('/fund/getlistobjecttype', { data })
            .then((res) => {
                this.setState({
                    dataOBJTYPE: res
                })
            })
    }
    async getOptionsobject(input) {

        if (input == 'ALL') {
            this.state.datagroup["p_objfeevalue"] = 'ALL'
            this.setState({
                object: { value: 'ALL', label: this.props.strings.all },
                datagroup: this.state.datagroup,

            })
        }
        else {
            if (input != 'CFM') {
                let data = {
                    p_language: this.props.lang,
                    p_objfeetype: input
                }
                await RestfulUtils.post('/fund/getlistobject', { data })
                    .then((res) => {
                        this.setState({
                            dataOBJ: res
                        })
                    })
            }

        }
    }
    loadOptions(name) {

        var api = ''
        var data = {
            p_language: this.props.lang,
            p_feetype: '004'
        }
        if (name == 'FEEID') {
            api = '/fund/getlistfeeassignfeeid'

        }
        else if (name == 'OBJECTTYPE') {
            api = '/fund/getlistobjecttype'
            data.feetype = this.state.loaiBP
            this.getOptionsobject(this.state.datagroup["p_objfeetype"])
        }

        return RestfulUtils.post(api, { data })
            .then((res) => {

                return { options: res }
            })
    }
    onChangeNoAsync(name, e) {

        var that = this
        if (e && e.value) {
            if (name == 'FEEID') {
                if (this.state.datagroup["p_feeid"] != e.value) {
                    this.state.datagroup["p_feeid"] = e.value
                    this.state.datagroup["p_id"] = e.id
                    this.state.datagroup["p_objfeetype"] = ''
                    this.state.datagroup["p_objfeevalue"] = ''
                    this.getOptionsobjecttype(e.id)
                    that.setState({
                        feetypename: e.name,
                        datagroup: this.state.datagroup,
                        FEEID: e,
                        objecttype: { value: '', label: '' },
                        object: { value: '', label: '' },
                        dataOBJ: []
                    })
                }
            } else if (name == 'OBJECTTYPE') {
                if (this.state.datagroup["p_objfeetype"] != e.value) {
                    this.state.datagroup["p_objfeetype"] = e.value
                    this.getOptionsobject(e.value)
                    if (e.value == 'ALL')
                        that.setState({
                            datagroup: this.state.datagroup,
                            objecttype: e,
                            // object: { value: '', label: '' },
                        })
                    else {
                        this.state.datagroup["p_objfeevalue"] = ''
                        that.setState({
                            datagroup: this.state.datagroup,
                            objecttype: e,
                            object: { value: '', label: '' },
                        })
                    }
                }
            } else {
                this.state.datagroup["p_objfeevalue"] = e.value
                this.setState({
                    object: e,
                    datagroup: this.state.datagroup
                })
            }
        }
        // ko phai e.value
        else {
            if (name == 'FEEID') {
                this.state.datagroup["p_feeid"] = ""
                this.state.datagroup["p_objfeetype"] = ""
                this.state.datagroup["p_objfeevalue"] = ""
                that.setState({
                    feetypename: "",
                    FEEID: e,
                    objecttype: { value: '', label: '' },
                    object: { value: '', label: '' },
                    datagroup: this.state.datagroup,
                })
            } else if (name == 'OBJECTTYPE') {
                this.state.datagroup["p_objfeetype"] = ""
                this.state.datagroup["p_objfeevalue"] = ""
                that.setState({
                    datagroup: this.state.datagroup,
                    objecttype: { value: '', label: '' },
                    object: { value: '', label: '' },
                })
            } else {
                this.state.datagroup["p_objfeevalue"] = ""

                this.setState({
                    object: { value: '', label: '' },
                    datagroup: this.state.datagroup
                })
            }
        }
    }
    onChangeDate(type, event) {

        this.state.datagroup[type] = event.value;
        this.setState({ datagroup: this.state.datagroup })

    }
    getOptions(input) {
        return RestfulUtils.post('/account/search_all_fullname', { key: input })
          .then((res) => {
            res.unshift({ value: 'ALL', label: this.props.strings.all })
            return { options: res }
          })
      }

    render() {
        let feetypeid = this.state.datagroup["p_id"] ;
        let ISLOAD = feetypeid == '003' ? false : true;
        let displayy = this.state.access == 'view' ? true : false
        return (
            <Modal show={this.props.showModalDetail} >
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>
                                <div className={this.state.access == 'update' ? "disable" : "GiangCoi"}>
                                    <div className="col-md-12 row" >
                                        <div className="col-md-3">
                                            <h5 className="highlight"><b>{this.props.strings.feeid}</b></h5>
                                        </div>
                                        <div className="col-md-9 customSelect">
                                            <Select.Async
                                                name="form-field-name"
                                                //loadOptions={this.getOptionsfeeid.bind(this)}
                                                loadOptions={this.loadOptions.bind(this, 'FEEID')}
                                                value={this.state.FEEID}
                                                //onChange={this.onChangefeeid.bind(this)}
                                                onChange={this.onChangeNoAsync.bind(this, 'FEEID')}
                                                id="txtFeeid"
                                                //searchable={false}
                                                placeholder=" "
                                                clearable={false}
                                                backspaceRemoves={false}
                                                disabled={displayy}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className="highlight"><b>{this.props.strings.fromdate}</b></h5>
                                        </div>
                                        <div className="col-md-9 fixWidthDatePickerForOthers">
                                            <DateInput disabled={displayy} onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["p_frdate"]} type="p_frdate" id="txtfromdate" />
                                        </div>

                                    </div>
                                </div>
                                <div className={this.state.access != 'view' ? "col-md-12 row" : "col-md-12 row disable"}>
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.todate}</b></h5>
                                    </div>
                                    <div className="col-md-9 fixWidthDatePickerForOthers">
                                        <DateInput disabled={displayy} onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["p_todate"]} type="p_todate" id="txttodate" />
                                    </div>

                                </div>
                                <div className={this.state.access == 'update' ? "disable" : "Giang"}>

                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className="highlight"><b>{this.props.strings.feetype}</b></h5>
                                        </div>
                                        <div className="col-md-9">
                                            <label className="form-control" id="lblFeetypename">{this.state.feetypename}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className="highlight"><b>{this.props.strings.objecttype}</b></h5>
                                        </div>
                                        <div className="col-md-9 customSelect">
                                            {this.state.access == 'add' ?
                                                <Select
                                                    name="form-field-name"
                                                    //loadOptions={this.loadOptions.bind(this,'OBJECTTYPE')}
                                                    options={this.state.dataOBJTYPE}
                                                    value={this.state.objecttype}
                                                    //onChange={this.onChangeobjecttype.bind(this)}
                                                    onChange={this.onChangeNoAsync.bind(this, 'OBJECTTYPE')}
                                                    id="txtObjecttype"
                                                    //searchable={false}
                                                    clearable={false}
                                                    disabled={displayy}
                                                    backspaceRemoves={false}
                                                //searchable={false}
                                                /> :
                                                <Select.Async
                                                    name="form-field-name"
                                                    loadOptions={this.loadOptions.bind(this, 'OBJECTTYPE')}
                                                    options={this.state.dataOBJTYPE}
                                                    value={this.state.objecttype}
                                                    //onChange={this.onChangeobjecttype.bind(this)}
                                                    onChange={this.onChangeNoAsync.bind(this, 'OBJECTTYPE')}
                                                    id="txtObjecttype"
                                                    //searchable={false}
                                                    clearable={false}
                                                    disabled={displayy}
                                                // searchable={false}
                                                />
                                            }
                                        </div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className="highlight"><b>{this.props.strings.object}</b></h5>
                                        </div>
                                        <div className="col-md-9 customSelect">
                                            {this.state.objecttype.value == 'CFM' ?
                                                <Select.Async
                                                    name="form-field-name"
                                                    loadOptions={this.getOptions.bind(this)}
                                                    value={this.state.object}
                                                    onChange={this.onChangeNoAsync.bind(this, 'OBJECT')}
                                                    id="cbCUSTODYCD"
                                                    disabled={this.state.objecttype.value == 'ALL' ? true : false}
                                                /> :
                                                <Select
                                                    name="form-field-name"
                                                    options={this.state.dataOBJ}
                                                    value={this.state.object}
                                                    //onChange={this.onChangeobject.bind(this)}
                                                    onChange={this.onChangeNoAsync.bind(this, 'OBJECT')}
                                                    id="txtObject"
                                                    disabled={this.state.objecttype.value == 'ALL' ? true : false}
                                                    //searchable={false}
                                                    clearable={false}
                                                    backspaceRemoves={false}

                                                />
                                            }
                                        </div>
                                    </div>
                                </div>
                                {ISLOAD &&
                                <div className={this.state.access != 'view' ? "col-md-12 row " : "col-md-12 row disable"}>
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.ordertype}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup["p_feeapply"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} value="p_feeapply" CDTYPE="SA" CDNAME="FEEAPPLY" ID="drdALERTTYPE" />
                                    </div>
                                </div>}
                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        <input type="button" disabled={displayy} onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
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
    translate('ModalDetailGanBP')
]);
module.exports = decorators(ModalDetailGanBP);
// export default ModalDetail;
