import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import Select from 'react-select';
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { getExtensionByLang } from 'app/Helpers'
class ModalDetailQLCN extends Component {
    constructor(props) {
        super(props);
        this.state = {

            CODEID: { value: '', label: '' },
            access: 'add',

            datagroup: {

                p_brid: '',
                p_mbid: '',
                p_brname: '',
                p_areaid: '',
                p_dcname: '',
                p_brdeputy: '',
                p_broffice: '',
                p_brtele: '',
                p_bremail: '',
                p_status: '',
                p_description: '',
                pv_language: this.props.lang,
                p_braddress: '',


            },

            checkFields: [

                { name: "p_vsdbrid", id: "txtvsdbrid" },
                { name: "p_brname", id: "txtBranhchname" },
                { name: "p_brname_en", id: "txtBranhchnameen" },
                { name: "p_mbid", id: "txtMbid" },
                { name: "p_areaid", id: "txtAREA" },


            ],
            dataArea: []
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
        let that = this
        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {


                this.props.change()
                that.getOptionsAREAedit(nextProps.DATA.MBID)
                this.setState({

                    datagroup: {
                        p_brid: nextProps.DATA.BRID,
                        p_mbid: nextProps.DATA.MBID,
                        p_brname: nextProps.DATA.BRNAME,
                        p_brname_en: nextProps.DATA.BRNAME_EN,
                        p_areaid: nextProps.DATA.AREAID,
                        p_brdeputy: nextProps.DATA.BRDEPUTY,
                        p_broffice: nextProps.DATA.BROFFICE,
                        p_brtele: nextProps.DATA.BRTELE,
                        p_bremail: nextProps.DATA.BREMAIL,
                        p_status: nextProps.DATA.STATUS,
                        p_description: nextProps.DATA.DESCRIPTION,
                        p_vsdbrid: nextProps.DATA.VSDBRID,
                        pv_language: this.props.lang,
                        p_braddress: nextProps.DATA.BRADDRESS,
                        pv_objname: this.props.OBJNAME
                    },

                    access: nextProps.access,
                    CODEID: { value: nextProps.DATA.MBID, label: nextProps.DATA[getExtensionByLang("MBNAME", this.props.lang)] },
                    AREA: { value: nextProps.DATA.AREAID, label: nextProps.DATA[getExtensionByLang("DESC_AREA", this.props.lang)] },


                })
            }
        }
        else
            if (nextProps.isClear) {
                this.props.change()
                this.setState({

                    datagroup: {

                        p_brid: '',
                        p_mbid: '',
                        p_brname: '',
                        p_areaid: '',
                        p_brdeputy: '',
                        p_broffice: '',
                        p_brtele: '',
                        p_bremail: '',
                        p_status: '',
                        p_description: '',
                        p_vsdbrid: '',
                        p_brname_en: '',
                        pv_language: this.props.lang,
                        p_braddress: '',
                        pv_objname: this.props.OBJNAME

                    },

                    access: nextProps.access,
                    AREA: { value: '', label: '' },
                    CODEID: { value: '', label: '' },
                    dataArea: []
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
            if (type == 'p_brtele')
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
    checkValid(name, id) {
        let value = this.state.datagroup[name];
        let mssgerr = '';
        switch (name) {

            case "p_vsdbrid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredvsdbrid;
                }
                break;
            case "p_brname":
                if (value == '') {
                    mssgerr = this.props.strings.requiredbrname;
                }
                break;
            case "p_brname_en":
                if (value == '') {
                    mssgerr = this.props.strings.requiredbrname_en;
                }
                break;
            case "p_mbid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredmbid;
                }
                break;
            case "p_areaid":
                if (value == '' || value == null) {
                    mssgerr = this.props.strings.requiredareaid;
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
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            var api = '/fund/addgrp';
            if (this.state.access == "update") {
                api = '/fund/updategrp';
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
    getOptionsSYMBOL(input) {
        return RestfulUtils.post('/allcode/search_all_mb', { data: { CDNAME: "MEMBERS", CDTYPE: 'SA' }, language: this.props.lang })
            .then((res) => {

                return { options: res }
            })
    }
    onChangeSYMBOL(e) {
        var that = this
        if (e && e.value) {
            if (this.state.datagroup["p_mbid"] != e.value) {
                this.getOptionsAREA(e)
            }
        }
        // this.getSessionInfo(e.value);

        else {
            this.state.datagroup["p_mbid"] = ''
            this.state.datagroup["p_areaid"] = ''
            this.setState({
                AREA: { value: '', label: '' },
                dataArea: [],
                CODEID: e,
                datagroup: this.state.datagroup
            })

        }



    }
    getOptionsAREA(input) {
        let that = this
        let data = {
            p_mbid: input.value,
            p_type: 'Y',
            p_language: this.props.lang,
        }
        this.state.datagroup["p_mbid"] = input.value
        RestfulUtils.post('/fund/getlistareas_bymbid', { data })
            .then((res) => {
                this.setState({
                    AREA: { value: '', label: '' },
                    CODEID: input,
                    datagroup: that.state.datagroup,
                    dataArea: res
                })

            })
    }
    getOptionsAREAedit(input) {

        let that = this
        let data = {
            p_mbid: input,
            p_type: 'Y',
            p_language: this.props.lang,
        }

        RestfulUtils.post('/fund/getlistareas_bymbid', { data })
            .then((res) => {

                this.setState({
                    dataArea: res
                })
            })

    }
    onChangeAREA(e) {

        var that = this
        if (e && e.value)
            // this.getSessionInfo(e.value);
            this.state.datagroup["p_areaid"] = e.value
        else this.state.datagroup["p_areaid"] = ''
        this.setState({
            AREA: e,
            datagroup: this.state.datagroup
        })


    }
    onValueChange(type, data) {

        this.state.datagroup[type] = data.value
        this.setState(this.state)
    }
    render() {
        let displayy = this.state.access == 'view' ? true : false
        return (
            <Modal show={this.props.showModalDetail} bsSize="lg">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body " >
                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.vsdbrid}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input className="form-control" disabled={displayy} type="text" placeholder={this.props.strings.vsdbrid} id="txtvsdbrid" value={this.state.datagroup["p_vsdbrid"]} onChange={this.onChange.bind(this, "p_vsdbrid")} maxLength={20} />
                                    </div>
                                </div>
                                <div className="col-md-12 row" style={{ display: 'none' }}>
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.branhchid}</b></h5>
                                    </div>
                                    <div className="col-md-5">
                                        <input className="form-control" disabled={displayy} type="text" placeholder={this.props.strings.branhchid} id="txtBranhchid" value={this.state.datagroup["p_brid"]} onChange={this.onChange.bind(this, "p_brid")} maxLength={6} />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.branhchname}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input className="form-control" disabled={displayy} type="text" placeholder={this.props.strings.branhchname} id="txtBranhchname" value={this.state.datagroup["p_brname"]} onChange={this.onChange.bind(this, "p_brname")} maxLength={250} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.branhchname_en}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input className="form-control" disabled={displayy} type="text" placeholder={this.props.strings.branhchname_en} id="txtBranhchnameen" value={this.state.datagroup["p_brname_en"]} onChange={this.onChange.bind(this, "p_brname_en")} maxLength={250} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.institutionid}</b></h5>
                                    </div>
                                    <div className="col-md-5 customSelect">
                                        <Select.Async
                                            name="form-field-name"
                                            loadOptions={this.getOptionsSYMBOL.bind(this)}
                                            value={this.state.CODEID}
                                            onChange={this.onChangeSYMBOL.bind(this)}
                                            id="txtMbid"
                                            disabled={displayy}
                                        //  searchable={false}
                                        />                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.area}</b></h5>
                                    </div>
                                    <div className="col-md-5 customSelect">
                                        <Select
                                            name="form-field-name"

                                            options={this.state.dataArea}
                                            value={this.state.AREA}
                                            onChange={this.onChangeAREA.bind(this)}
                                            id="txtAREA"
                                            disabled={displayy}
                                        //  searchable={false}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.address}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input className="form-control" disabled={displayy} type="text" placeholder={this.props.strings.address} id="txtAddress" value={this.state.datagroup["p_braddress"]} onChange={this.onChange.bind(this, "p_braddress")} maxLength={250} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.fullname}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input className="form-control" disabled={displayy} type="text" placeholder={this.props.strings.fullname} id="txtFullname" value={this.state.datagroup["p_brdeputy"]} onChange={this.onChange.bind(this, "p_brdeputy")} maxLength={250} />


                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.position}</b></h5>
                                    </div>
                                    <div className="col-md-5">
                                        <input className="form-control" disabled={displayy} type="text" placeholder={this.props.strings.position} id="txtPosition" value={this.state.datagroup["p_broffice"]} onChange={this.onChange.bind(this, "p_broffice")} maxLength={250} />


                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.phone}</b></h5>
                                    </div>
                                    <div className="col-md-5">
                                        <input maxLength={250} disabled={displayy} className="form-control" id="txtPhone" placeholder={this.props.strings.phone} value={this.state.datagroup["p_brtele"]} onChange={this.onChange.bind(this, "p_brtele")} />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.email}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input className="form-control" type="text" disabled={displayy} placeholder={this.props.strings.email} id="txtEmail" value={this.state.datagroup["p_bremail"]} onChange={this.onChange.bind(this, "p_bremail")} maxLength={250} />


                                    </div>
                                </div>
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
    translate('ModalDetailQLCN')
]);
module.exports = decorators(ModalDetailQLCN);
// export default ModalDetail;
