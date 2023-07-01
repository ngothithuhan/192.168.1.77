import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import DropdownFactory from 'app/utils/DropdownFactory'
import DateInput from "app/utils/input/DateInput";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import Select from 'react-select';
import { getExtensionByLang } from 'app/Helpers'

class ModalDetailuser_info extends Component {
    constructor(props) {
        super(props);
        this.state = {

            access: 'add',
            DATA: '',

            phone: { value: '', validate: null, tooltip: "Không được để trống !!" },
            datauser: {
                // p_tlid:'',
                p_tlname: '',
                p_tlfullname: '',
                p_mbid: '',
                p_brid: '',
                p_department: '',
                p_tltitle: '',
                p_idcode: '',

                p_mobile: '',
                p_email: '',
                p_active: '',
                p_description: '',
                p_vsdsaleid: '',
                // pv_action:'C',
                pv_language: this.props.lang,
                p_birthdate: '',
                p_iddate: '',
                p_idplace: '',
                p_mbcode: '',
                p_bankacc: '',
                p_bankbranch: '',
                p_address: '',
                p_taxcode: '',
                p_bankbranchuser: '',
                p_isrm: ''
            },
            checkFields: [
                { name: "p_tlname", id: "txtUsername" },
                { name: "p_tlfullname", id: "txtFullname" },
                // { name: "p_idcode", id: "txtIdcode" },
                { name: "p_mobile", id: "txtPhone" },
                { name: "p_email", id: "txtEmail" },
                { name: "p_brid", id: "txtBranhchname" },
            ],
            chinhanh: { value: '', label: '' },
            dataCN: []
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

                this.getOptionsAREA(nextProps.DATA.MBID)
                this.loadOptionsChinhanh(nextProps.DATA.MBID, nextProps.DATA.AREAID)
                this.setState({

                    datauser: {
                        p_edittlid: nextProps.DATA.TLID,
                        p_tlname: nextProps.DATA.TLNAME,
                        p_tlfullname: nextProps.DATA.TLFULLNAME,
                        p_mbid: nextProps.DATA.MBID,
                        p_brid: nextProps.DATA.BRID,
                        p_department: nextProps.DATA.DEPARTMENT,
                        p_tltitle: nextProps.DATA.TLTITLE,
                        p_idcode: nextProps.DATA.IDCODE,
                        p_mobile: nextProps.DATA.MOBILE,
                        p_email: nextProps.DATA.EMAIL,
                        p_active: nextProps.DATA.ACTIVE,
                        p_description: nextProps.DATA.DESCRIPTION,
                        p_vsdsaleid: nextProps.DATA.VSDSALEID,
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME,
                        p_area: nextProps.DATA.AREAID,
                        p_birthdate: nextProps.DATA.BIRTHDATE,
                        p_iddate: nextProps.DATA.IDDATE,
                        p_idplace: nextProps.DATA.IDPLACE,
                        p_mbcode: nextProps.DATA.MBCODE,
                        p_bankacc: nextProps.DATA.BANKACC,
                        p_bankbranch: nextProps.DATA.BANKBRANCH,
                        p_address: nextProps.DATA.ADDRESS,
                        p_taxcode: nextProps.DATA.TAXCODE,
                        p_bankbranchuser: nextProps.DATA.BANKBRANCHUSER,
                        p_isrm: nextProps.DATA.ISRMVALUE
                    },
                    phone: { value: nextProps.DATA.MOBILE, validate: null, tooltip: "Không được để trống !!" },
                    access: nextProps.access,
                    chinhanh: { value: nextProps.DATA.BRID, label: nextProps.DATA[getExtensionByLang("BRNAME", this.props.lang)] },
                    AREA: { value: nextProps.DATA.AREAID, label: nextProps.DATA[getExtensionByLang("AREA_DESC", this.props.lang)] },

                })
            }
        } else if (nextProps.isClear) {

            this.props.change()

            this.setState({
                display: {
                    fatca: false,
                    authorize: false,
                    upload: false,
                    quydangki: false,

                },
                datauser: {
                    // p_tlid: '',
                    p_tlname: '',
                    p_tlfullname: '',
                    p_mbid: '',
                    p_brid: '',
                    p_department: '',
                    p_tltitle: '',
                    p_idcode: '',
                    p_mobile: '',
                    p_email: '',
                    p_active: '',
                    p_description: '',
                    p_vsdsaleid: '',
                    p_area: '',
                    // pv_action:'C',
                    pv_language: this.props.lang,
                    pv_objname: this.props.OBJNAME,
                    p_birthdate: '',
                    p_iddate: '',
                    p_idplace: '',
                    p_mbcode: '',
                    p_bankacc: '',
                    p_bankbranch: '',
                    p_address: '',
                    p_taxcode: '',
                    p_bankbranchuser: '',
                    p_isrm: ''
                },
                access: nextProps.access,
                chinhanh: { value: '', label: '' },
                phone: { value: '', validate: null, tooltip: "Không được để trống !!" },
                AREA: { value: '', label: '' },
                dataCN: [],
                dataArea: []
            })
        }
    }



    closeModalDetail() {
        this.props.closeModalDetail()
    }
    onSetDefaultValue = (type, value) => {

        if (!this.state.datauser[type]) {
            if (type == 'p_mbid') {

                this.getOptionsAREA(value)

                this.state.datauser[type] = value

            } else if (type == 'p_area') {
                this.loadOptionsChinhanh(this.state.datauser["p_mbid"], value)
                this.state.datauser[type] = value

            }
            else this.state.datauser[type] = value
        }

    }
    onChange(type, event) {
        console.log('type, event:', type, event)
        let data = {};
        if (event.target) {
            console.log('event.target:', event.target.value)
            if (type == 'p_idcode' || type == 'p_mobile')
                this.state.datauser[type] = event.target.value.trim();
            else this.state.datauser[type] = event.target.value
        }
        else {
            if (type == 'p_mbid') {
                this.state.chinhanh = { value: '', label: '' }
                this.state.dataCN = []
                this.state.AREA = { value: '', label: '' }
                this.state.dataArea = []
                // this.loadOptionsChinhanh(event.value, this.state.datauser["p_area"])
                this.getOptionsAREA(event.value)
                this.state.datauser["p_brid"] = ''
                this.state.datauser[type] = event.value;

            }
            else if (type == 'p_bankbranch') {

                this.state.datauser[type] = event.value;

            } else if (type == 'p_area') {
                this.state.chinhanh = { value: '', label: '' }
                this.loadOptionsChinhanh(this.state.datauser["p_mbid"], event.value)
                this.state.datauser[type] = event.value;
                this.state.datauser["p_brid"] = ''
            }
            else if (type == 'p_birthdate') {
                this.state.datauser[type] = event.value;
            }
            else if (type == 'p_iddate') {
                this.state.datauser[type] = event.value;
            }
            else {
                this.state.datauser[type] = event.value;
            }
        }
        this.setState({ datauser: this.state.datauser, chinhanh: this.state.chinhanh })



    }

    onValueChange(type, data) {

        //console.log('type',type)
        ////console.log('data',data)
        this.state.datauser[type] = data.event.value
        this.setState(this.state)
    }
    getData() {

        this.state.datauser.p_mobile = this.state.phone.value
        this.setState({ datauser: this.state.datauser })
    }
    async Add() {
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }

        let data = await this.getData()
        RestfulUtils.post('/user/add', this.state.datauser)
            .then((res) => {
                if (res.EC == 0) {
                    datanotify.type = "success";
                    datanotify.content = this.props.strings.success;
                    dispatch(showNotifi(datanotify));
                    //this.setState({ err_msg: "Thêm mới user thành công" })
                } else {
                    datanotify.type = "error";
                    datanotify.content = res.EM;
                    dispatch(showNotifi(datanotify));
                }

            })


    }
    checkValid(name, id) {
        let value = this.state.datauser[name];
        let mssgerr = '';


        switch (name) {

            case "p_tlname":
                if (value == '') {
                    mssgerr = this.props.strings.requiredtlname;
                }
                break;
            case "p_tlfullname":
                if (value == '') {
                    mssgerr = this.props.strings.requiredtlfullname;
                }
                break;
            /*
        case "p_idcode":
            if (value == '') {
                mssgerr = this.props.strings.requiredidcode;
            }
            break;
        case "p_mobile":
            if (value == '') {
        
                mssgerr = this.props.strings.requiredmobile;
            }
           
            else{
                //console.log(value.indexOf("e"))
                if(value.indexOf("e")<0 ) mssgerr = this.props.strings.requiredmobilewrong;
            }
           
            break;
        case "p_email":
            if (value == '') {
                mssgerr = this.props.strings.requiredemail;
            }
            break;
            */
            case "p_brid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredbrid;
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
    async submitUser() {
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            var api = '/user/add';
            if (this.props.DATA.TLID) {
                api = '/user/update';
            }
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            let that = this
            ////console.log(api)
            //console.log(this.state.datauser)
            RestfulUtils.posttrans(api, this.state.datauser)
                .then((res) => {
                    //console.log(res)
                    if (res.EC == 0) {
                        datanotify.type = "success";
                        datanotify.content = this.props.strings.success;
                        dispatch(showNotifi(datanotify));
                        this.props.load()
                        this.props.closeModalDetail()
                        //this.setState({ err_msg: "Thêm mới user thành công" })


                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                    }

                })
        }
    }

    async onChangeSelect(e) {

        var that = this
        if (e && e.value)
            // this.getSessionInfo(e.value);

            this.state.datauser["p_brid"] = e.value
        this.setState({
            chinhanh: e,
            datauser: this.state.datauser
        })
    }
    loadOptionsChinhanh(mbid, area) {

        let data = {
            p_mbid: mbid,
            p_areaid: area,
            p_language: this.props.lang,
        }

        RestfulUtils.post('/fund/getlistbrgrp_bymbid_areaid', { data })
            .then((res) => {

                this.setState({
                    dataCN: res
                })
            })
    }
    getOptions(input) {
        let data = {
            p_mbid: this.state.datauser["p_mbid"],
            p_areaid: this.state.datauser["p_area"],
            p_language: this.props.lang,
        }

        return RestfulUtils.post('/fund/getlistbrgrp_bymbid_areaid', { data })
            .then((res) => {

                return { options: res }
            })
    }

    getOptionsAREA(input) {

        let that = this
        let data = {
            p_mbid: input,
            p_type: 'Y',
            p_language: this.props.lang,
        }
        //  this.state.datauser["p_mbid"] = input.value
        RestfulUtils.post('/fund/getlistareas_bymbid', { data })
            .then((res) => {

                this.setState({

                    dataArea: res
                })

            })
    }
    onChangeAREA(e) {
        if (this.state.datauser['p_area'] != e.value) {
            var that = this
            if (e && e.value) {

                this.state.chinhanh = { value: '', label: '' }
                this.loadOptionsChinhanh(this.state.datauser["p_mbid"], e.value)
                this.state.datauser['p_area'] = e.value;
                this.state.datauser["p_brid"] = ''
            }

            else this.state.datagroup["p_area"] = ''
            this.setState({
                AREA: e,
                datauser: this.state.datauser,
                chinhanh: this.state.chinhanh
            })
        }

    }
    render() {
        console.log('this.state.datauser:', this.state.datauser)
        const pageSize = 5;
        let displayy = this.state.access == 'view' ? true : false
        return (
            <Modal show={this.props.showModalDetail} dialogClassName="custom-modal" bsSize="lg" >
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">

                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row module">
                                    <div className="col-md-12 row">

                                        <div className="col-md-2">
                                            <h5 className="highlight"><b>{this.props.strings.username}</b></h5>
                                        </div>
                                        <div className="col-md-4">
                                            <input disabled={this.state.access == 'add' ? false : true} className="form-control" id="txtUsername" type="text" placeholder={this.props.strings.username} value={this.state.datauser["p_tlname"]} onChange={this.onChange.bind(this, "p_tlname")} maxLength={200} />

                                        </div>
                                        <div className="col-md-2">
                                            <h5 className=""><b>{this.props.strings.vsdsaleid}</b></h5>
                                        </div>
                                        <div className="col-md-4">
                                            <input className="form-control" id="txtvsdsaleid" type="text" placeholder={this.props.strings.vsdsaleid} value={this.state.datauser["p_vsdsaleid"]} onChange={this.onChange.bind(this, "p_vsdsaleid")} maxLength={200} />

                                        </div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-2">
                                            <h5 className="highlight"><b>{this.props.strings.fullname}</b></h5>
                                        </div>
                                        <div className="col-md-10">
                                            <input disabled={displayy} className="form-control" id="txtFullname" type="text" placeholder={this.props.strings.fullname} value={this.state.datauser["p_tlfullname"]} onChange={this.onChange.bind(this, "p_tlfullname")} maxLength={200} />
                                        </div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-2">
                                            <h5 className=""><b>{this.props.strings.birthdate}</b></h5>
                                        </div>
                                        <div className="col-md-4">
                                            <DateInput
                                                //disabled={isDisableWhenView}
                                                id="txtbirthdate"
                                                onChange={this.onChange.bind(this)}
                                                value={this.state.datauser.p_birthdate}
                                                type="p_birthdate"
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <h5 className="" ><b>{this.props.strings.idcode}</b></h5>
                                        </div>
                                        <div className="col-md-4">
                                            <input maxLength={50} disabled={displayy} className="form-control" id="txtIdcode" placeholder={this.props.strings.idcode} value={this.state.datauser["p_idcode"]} onChange={this.onChange.bind(this, "p_idcode")} />

                                        </div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-2">
                                            <h5 className="">
                                                <b>{this.props.strings.idplace}</b>
                                            </h5>
                                        </div>
                                        <div className="col-md-4 ">
                                            <input
                                                //disabled={isDisableWhenView}
                                                value={this.state.datauser.p_idplace}
                                                onChange={this.onChange.bind(this, "p_idplace")}
                                                id="txtidplace"
                                                className="form-control"
                                                type="text"
                                                placeholder={this.props.strings.idplace}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <h5 className="">
                                                <b>{this.props.strings.iddate}</b>
                                            </h5>
                                        </div>
                                        <div className="col-md-4 ">
                                            <DateInput
                                                //disabled={isDisableWhenView}
                                                id="txtiddate"
                                                onChange={this.onChange.bind(this)}
                                                value={this.state.datauser.p_iddate}
                                                type="p_iddate"
                                            />
                                            {/* <input
                                            maxLength="500"
                                            //disabled={isDisableWhenView}
                                            value={this.state.datauser.p_iddate}
                                            onChange={this.onChange.bind(this, "p_iddate")}
                                            id="txtiddate"
                                            className="form-control"
                                            type="text"
                                            placeholder={this.props.strings.iddate}
                                        /> */}
                                        </div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-2">
                                            <h5 className=""><b>{this.props.strings.phone}</b></h5>
                                        </div>
                                        <div className="col-md-4">

                                            <input maxLength={20} disabled={displayy} className="form-control" id="txtPhone" placeholder={this.props.strings.phone} value={this.state.datauser["p_mobile"]} onChange={this.onChange.bind(this, "p_mobile")} />

                                        </div>
                                        <div className="col-md-2">
                                            <h5 className=""><b>{this.props.strings.email}</b></h5>
                                        </div>
                                        <div className="col-md-4">
                                            <input disabled={displayy} className="form-control" type="email" id="txtEmail" placeholder={this.props.strings.email} value={this.state.datauser["p_email"]} onChange={this.onChange.bind(this, "p_email")} maxLength={100} />
                                        </div>
                                    </div>

                                    <div className="col-md-12 row">
                                        <div className="col-md-2">
                                            <h5 className=""><b>{this.props.strings.mbcode}</b></h5>
                                        </div>
                                        <div className="col-md-4">

                                            <input maxLength={500} disabled={displayy} className="form-control" id="txtmbcode" placeholder={this.props.strings.mbcode} value={this.state.datauser["p_mbcode"]} onChange={this.onChange.bind(this, "p_mbcode")} />

                                        </div>
                                        <div className="col-md-2">
                                            <h5 className=""><b>{this.props.strings.taxcode}</b></h5>
                                        </div>
                                        <div className="col-md-4">

                                            <input maxLength={500} disabled={displayy} className="form-control" id="txttaxcode" placeholder={this.props.strings.taxcode} value={this.state.datauser["p_taxcode"]} onChange={this.onChange.bind(this, "p_taxcode")} />

                                        </div>

                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-2">
                                            <h5 className=""><b>{this.props.strings.address}</b></h5>
                                        </div>
                                        <div className="col-md-4">

                                            <input maxLength={500} disabled={displayy} className="form-control" id="txtaddress" placeholder={this.props.strings.address} value={this.state.datauser["p_address"]} onChange={this.onChange.bind(this, "p_address")} />

                                        </div>
                                        <div className="col-md-2">
                                            <h5 className=""><b>{this.props.strings.bankacc}</b></h5>
                                        </div>
                                        <div className="col-md-4">

                                            <input maxLength={500} disabled={displayy} className="form-control" id="txtbankacc" placeholder={this.props.strings.bankacc} value={this.state.datauser["p_bankacc"]} onChange={this.onChange.bind(this, "p_bankacc")} />

                                        </div>
                                    </div>
                                    <div className="col-md-12 row">

                                        <div className="col-md-2">
                                            <h5 className=""><b>{this.props.strings.bankbranch}</b></h5>
                                        </div>
                                        <div className="col-md-4">
                                            <DropdownFactory
                                                //disabled={isDisableWhenView}
                                                onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                                                onChange={this.onChange.bind(this)}
                                                ID="drdBank"
                                                value="p_bankbranch"
                                                CDTYPE="GW"
                                                CDNAME="BANK"
                                                CDVAL={this.state.datauser["p_bankbranch"]}
                                            />
                                        </div>

                                        <div className="col-md-2">
                                            <h5 className=""><b>{this.props.strings.bankbranchuser}</b></h5>
                                        </div>
                                        <div className="col-md-4">
                                            <input maxLength={500} disabled={displayy} className="form-control" id="txtbankbranchuser" placeholder={this.props.strings.bankbranchuser} value={this.state.datauser["p_bankbranchuser"]} onChange={this.onChange.bind(this, "p_bankbranchuser")} />
                                        </div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-2">
                                            <h5 className='highlight'><b>{this.props.strings.ISRM}</b></h5>
                                        </div>
                                        <div className="col-md-4">
                                            <DropdownFactory disabled={displayy} onSetDefaultValue={this.onSetDefaultValue} CDVAL={this.state.datauser.p_isrm} value="p_isrm" CDTYPE="SY" CDNAME="YESNO" onChange={this.onChange.bind(this)} ID="drdISRM" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 row module">
                                    <div className="col-md-12 row">
                                        <div className="col-md-2">
                                            <h5 className="highlight"><b>{this.props.strings.institution}</b></h5>
                                        </div>
                                        <div className="col-md-4">
                                            <DropdownFactory disabled={displayy} onSetDefaultValue={this.onSetDefaultValue} CDVAL={this.state.datauser.p_mbid} value="p_mbid" CDTYPE="SA" CDNAME="MEMBERS" onChange={this.onChange.bind(this)} ID="drdInstitution" />
                                        </div>
                                        <div className="col-md-2">
                                            <h5 className="highlight"><b>{this.props.strings.area}</b></h5>
                                        </div>
                                        <div className="col-md-4 customSelect">
                                            <Select
                                                name="form-field-name"
                                                options={this.state.dataArea}
                                                value={this.state.AREA}
                                                onChange={this.onChangeAREA.bind(this)}
                                                id="txtAREA"
                                                disabled={displayy}
                                                clearable={false}
                                            //  searchable={false}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-12 row">
                                        <div className="col-md-2">
                                            <h5 className="highlight"><b>{this.props.strings.branhchname}</b></h5>
                                        </div>
                                        <div className="col-md-4 customSelect">
                                            <Select
                                                name="form-field-name"
                                                options={this.state.dataCN}
                                                value={this.state.chinhanh}
                                                onChange={this.onChangeSelect.bind(this)}
                                                id="txtBranhchname"
                                                clearable={false}
                                                disabled={displayy}
                                            />

                                        </div>

                                        <div className="col-md-2">
                                            <h5><b>{this.props.strings.title}</b></h5>
                                        </div>
                                        <div className="col-md-4">
                                            <input disabled={displayy} className="form-control" type="text" id="txtTitle" placeholder={this.props.strings.title} value={this.state.datauser["p_tltitle"]} onChange={this.onChange.bind(this, "p_tltitle")} maxLength={100} />
                                        </div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-2">
                                            <h5><b>{this.props.strings.department}</b></h5>
                                        </div>
                                        <div className="col-md-4">
                                            <input disabled={displayy} className="form-control" type="text" id="txtDepartment" placeholder={this.props.strings.department} value={this.state.datauser["p_department"]} onChange={this.onChange.bind(this, "p_department")} maxLength={100} />
                                        </div>
                                        <div className="col-md-2">
                                            <h5 className="highlight"><b>{this.props.strings.status}</b></h5>
                                        </div>
                                        <div className="col-md-4">
                                            <DropdownFactory disabled={displayy} onSetDefaultValue={this.onSetDefaultValue} CDVAL={this.state.datauser.p_active} value="p_active" CDTYPE="SA" CDNAME="ACTIVE" onChange={this.onChange.bind(this)} ID="ACTIVE" />
                                        </div>

                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-2">
                                            <h5><b>{this.props.strings.note}</b></h5>
                                        </div>
                                        <div className="col-md-10">
                                            <input disabled={displayy} className="form-control" id="txtNote" type="text" placeholder={this.props.strings.note} value={this.state.datauser["p_description"]} onChange={this.onChange.bind(this, "p_description")} maxLength={500} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        <input disabled={displayy} type="button" className="btn btn-primary" style={{ marginLeft: 0, marginRight: 5 }} value={this.props.strings.submit} onClick={this.submitUser.bind(this)} id="btnSubmit" />

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
    translate('ModalDetailuser_info')
]);

module.exports = decorators(ModalDetailuser_info);