import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'

import RestfulUtils from 'app/utils/RestfulUtils';
import { connect } from 'react-redux'

import axios from 'axios';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { showNotifi } from 'app/action/actionNotification.js';


class ModalQLUserTheoNhomNSD extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ISEDIT: false,
            access: 'add',
            DATA: '',
            optionsDataMG: [],
            optionMaLoaiHinh: [],
            dataMGrow: {}, //obj kq loc dc
            dataLHrow: {},
            dataMG: [],
            dataLH: [],
            //du lieu can truyen

            pv_objname: this.props.OBJNAME,
            pv_language: this.props.language,
            //du lieu tra ve


            checkFields: [

                { name: "p_saleid", id: "drdsaleid" },
                { name: "p_frdate", id: "txtfrdate" },
                { name: "p_todate", id: "txttodate" },
                { name: "p_mbname", id: "drdmbname" },
                { name: "p_areaname", id: "drdareaname" },
                { name: "p_brid", id: "drdbrname" },
                { name: "p_ratecomm", id: "txtratecomm" },
                { name: "p_ratealoc", id: "txtratealoc" },
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

        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.setState({
                    p_grpid: nextProps.DATA.GRPID,
                    p_grpname: nextProps.DATA.GRPNAME,
                    p_grptype_desc: nextProps.DATA.GRPTYPE_DESC,
                    p_tlid: nextProps.DATA.TLID,
                    p_tlname: nextProps.DATA.TLNAME,
                    p_tlfullname: nextProps.DATA.TLFULLNAME,
                    p_idcode: nextProps.DATA.IDCODE,
                    p_mobile: nextProps.DATA.MOBILE,
                    p_email: nextProps.DATA.EMAIL,
                    p_department: nextProps.DATA.DEPARTMENT,
                    p_tltitle: nextProps.DATA.TLTITLE,
                    p_mbname: nextProps.DATA.MBNAME,
                    p_brname: nextProps.DATA.BRNAME,
                    p_areaname: nextProps.DATA.AREANAME,
                    p_mbname_en: nextProps.DATA.MBNAME_EN,
                    p_brname_en: nextProps.DATA.BRNAME_EN,
                    p_areaname_en: nextProps.DATA.AREANAME_EN,
                    p_status_desc: nextProps.DATA.STATUS_DESC,
                    p_status_desc_en: nextProps.DATA.STATUS_DESC_EN,
                    pv_language: this.props.language,
                    pv_objname: this.props.OBJNAME,
                    access: nextProps.access,

                })
            }
        }
        else
            if (nextProps.isClear) {

                this.props.change()

                this.setState({

                    fatca: false,
                    authorize: false,
                    upload: false,

                    access: nextProps.access,

                })
            }
    }
    handleChange(type) {
        this.state.collapse[type] = !this.state.collapse[type];
        this.setState({ collapse: this.state.collapse })
    }
    closeModalDetail() {
        this.props.closeModalDetail()
    }
    onSetDefaultValue = (type, value) => {
        //console.log('this.state.REROLE.fdfd', this.state.REROLE)
        if (!this.state[type]) {

            // let that = this
            // if (type == 'p_mbcode') {
            //     RestfulUtils.post('/user/getBrgrpBymbidAreaid', { mbid: value, language: this.props.language })
            //     .then((res) => {
            //         that.setState({
            //             ...that.state, dataCN: res.data.resultdata, optionsChiNhanh: res.data.result
            //         })
            //         //console.log( 'res.data.result', res.data.result )
            //     })
            //     this.state[type] = value
            // } else this.state[type] = value
            this.state[type] = value
            let that = this
            RestfulUtils.post('/user/getbrgrpbymbidareaid', { mbid: this.state.p_mbcode, areaid: this.state.p_areaid, language: this.props.language })
                .then((res) => {
                    that.setState({
                        ...that.state, dataCN: res.data.resultdata, optionsChiNhanh: res.data.result
                    })
                    //console.log( 'res.data.result', res.data.result )

                })
                RestfulUtils.post('/user/getareassbymbid', { mbid: this.state.p_mbcode, language: this.props.language })
                .then((res) => {
                    that.setState({
                        ...that.state, dataKV: res.data.resultdata, optionsKhuVuc: res.data.result
                    })
                    //console.log( 'res.data.result', res.data.result )

                })

        }

    }
    onChange(type, event) {
        let data = {};
        this.state[type] = event.value;

        this.setState({ p_frdate: this.state.p_frdate, p_todate: this.state.p_todate, p_description: this.state.p_description })

    }

    async onChangeDropdown(type, event) {
        this.state[type] = event.value //type dai dien la REROLE

        let that = this
        if (type == 'p_mbcode') {
            await RestfulUtils.post('/user/getbrgrpbymbidareaid', { mbid: event.value, areaid: this.state.p_areaid, language: this.props.language })
                .then((res) => {
                    that.setState({
                        ...that.state, dataCN: res.data.resultdata, optionsChiNhanh: res.data.result
                    })
                    //console.log( 'res.data.result', res.data.result )

                })
            await RestfulUtils.post('/user/getareassbymbid', { mbid: event.value, language: this.props.language })
                .then((res) => {
                    that.setState({
                        ...that.state, dataKV: res.data.resultdata, optionsKhuVuc: res.data.result
                    })
                    console.log('res.data.result getAreassBymbid', res.data.result, event.value)

                })
        }
        //console.log('to chuc , khu vuc , optionsChiNhanh after', this.state.p_mbid, this.state.p_areaid, this.state.optionsChiNhanh)
        this.setState(this.state)

    }

    checkValid(name, id) {
        let value = this.state[name];
        let mssgerr = '';

        switch (name) {

            case "p_saleid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredsaleid;
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
            case "p_mbcode":
                if (value == '') {
                    mssgerr = this.props.strings.requiredmbname;
                }
                break;
            case "p_areaid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredareaname;
                }
                break;
            case "p_brid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredbrname;
                }
                break;
            case "p_ratecomm":
                if (value == '') {
                    mssgerr = this.props.strings.requiredratecomm;
                }
                if (value < 0 || value > 100) {
                    mssgerr = this.props.strings.requiredratecommtrue;
                }
                break;
            case "p_ratealoc":
                if (value == '') {
                    mssgerr = this.props.strings.requiredratealoc;
                }
                if (value < 0 || value > 100) {
                    mssgerr = this.props.strings.requiredratecommtrue;
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
            var api = '/user/addlistsalebranchs';

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""
            }
            //consoconsole.log('xxx ', this.state.LOAIHINH, this.state.CODEID)
            let self = this

            RestfulUtils.post(api, {
                saleacctno: this.state.p_saleid,
                mbcode: this.state.p_mbcode,
                areaid: this.state.p_areaid,
                brid: this.state.p_brid,
                ratecomm: this.state.p_ratecomm,
                ratealoc: this.state.p_ratealoc,
                effdate: this.state.p_frdate,
                expdate: this.state.p_todate,
                description: this.state.p_description,
                language: this.props.language, objname: this.props.OBJNAME
            })
                .then((res) => {
                    //console.log('res ', res)
                    if (res.EC == 0) {
                        datanotify.type = "success"
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                        this.props.closeModalDetail()
                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                    }
                })

        }
    }

    getOptionsSoHieuTKGD(input) {
        return RestfulUtils.post('/account/search_all', { key: input })
            .then((res) => {

                return { options: res }
            })
    }

    //--------lay ma mo gioi-----

    async componentWillMount() {
        let that = this
        await RestfulUtils.post('/user/getleader', { language: this.props.language })
            .then((res) => {
                that.setState({
                    ...that.state, dataMG: res.data.resultdata, optionsDataMG: res.data.result
                })
                //console.log('datamg: ', res.data.resultdata, res.data.resultdata.TLID)
            })

    }
    async getOptionsMaMoGioi(input) {

        return { options: this.state.optionsDataMG }

    }
    async onChangeMaMoGioi(e) {
        let that = this
        let result = {};
        let { dataMG } = this.state
        if (e && e.value) {
            if (dataMG)
                if (dataMG.length > 0) {
                    result = await dataMG.filter(item => item.TLID == e.value)
                    // console.log(' e value ', e.value)
                    if (result)
                        if (result.length > 0) {
                            //console.log('result dataMG', result)
                            that.setState({
                                dataMGrow: result[0],
                                p_tlname: result[0]["TLFULLNAME"],

                            })
                        }
                    //console.log('saleid: ', this.state.p_saleid)
                    //console.log('dataMGrow', this.state.dataMGrow)
                }
            this.setState({
                p_saleid: e.value,
            })
        }
        else {
            this.setState({
                p_saleid: '',
            })
        }
    }
    async getOptionsMaChiNhanh(input) {

        return { options: this.state.optionsChiNhanh }

    }
    async getOptionsMaKhuVuc(input) {

        return { options: this.state.optionsKhuVuc }

    }
    async onChangeMaChiNhanh(e) {
        if (e && e.value) {
            this.setState({
                p_brid: e.value,
            })
        }
        else {
            this.setState({
                p_brid: '',
            })
        }
    }
    async onChangeKhuVuc(e) {
        let that = this
        if (e && e.value) {
            RestfulUtils.post('/user/getbrgrpbymbidareaid', { mbid: this.state.p_mbcode, areaid: e.value, language: this.props.language })
                .then((res) => {
                    that.setState({
                        ...that.state, dataCN: res.data.resultdata, optionsChiNhanh: res.data.result
                    })
                    //console.log( 'res.data.result', res.data.result )

                })
            this.setState({
                p_areaid: e.value,
            })
        }
        else {
            this.setState({
                p_areaid: '',
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
    onValueChange(type, data) {
        // console.log('valueChange', type, data)
        this.state[type] = data.value
        this.setState(this.state)
    }

    render() {
        let disableWhenView = (this.state.access == 'view')
        const pageSize = 5;
        const { selectedOption } = this.state;
        const value = selectedOption && selectedOption.value;
        return (
            <Modal show={this.props.showModalDetail} bsSize="md" >
                <Modal.Header>
                    <Modal.Title ><div className="title-content col-md-8">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">

                            <div className="col-md-12 row">
                                <div className="col-md-4">
                                    <h5 ><b>{this.props.strings.grpid}</b></h5>
                                </div>
                                <div className="col-md-8">
                                    <label className="form-control"> {this.state.p_grpid} </label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-4">
                                    <h5 ><b>{this.props.strings.grpname}</b></h5>
                                </div>
                                <div className="col-md-8">
                                    <label className="form-control"> {this.state.p_grpname} </label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-4">
                                    <h5 ><b>{this.props.strings.grptype_desc}</b></h5>
                                </div>
                                <div className="col-md-8">
                                    <label className="form-control"> {this.state.p_grptype_desc} </label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-4">
                                    <h5 ><b>{this.props.strings.tlid}</b></h5>
                                </div>
                                <div className="col-md-8">
                                    <label className="form-control"> {this.state.p_tlid} </label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-4">
                                    <h5 ><b>{this.props.strings.tlname}</b></h5>
                                </div>
                                <div className="col-md-8">
                                    <label className="form-control">{this.state.p_tlname}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-4">
                                    <h5 ><b>{this.props.strings.tlfullname}</b></h5>
                                </div>
                                <div className="col-md-8">
                                    <label className="form-control">{this.state.p_tlfullname}</label>
                                </div>
                            </div>

                            <div className="col-md-12 row">
                                <div className="col-md-4">
                                    <h5 ><b>{this.props.strings.idcode}</b></h5>
                                </div>
                                <div className="col-md-8">
                                    <label className="form-control">{this.state.p_idcode}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-4">
                                    <h5 ><b>{this.props.strings.mobile}</b></h5>
                                </div>
                                <div className="col-md-8">
                                    <label className="form-control">{this.state.p_mobile}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-4">
                                    <h5><b>{this.props.strings.email}</b></h5>
                                </div>
                                <div className="col-md-8">
                                    <label className="form-control">{this.state.p_email}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-4">
                                    <h5><b>{this.props.strings.department}</b></h5>
                                </div>
                                <div className="col-md-8">
                                    <label className="form-control">{this.state.p_department}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-4">
                                    <h5><b>{this.props.strings.tltitle}</b></h5>
                                </div>
                                <div className="col-md-8">
                                    <label className="form-control">{this.state.p_tltitle}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-4">
                                    <h5><b>{this.props.strings.mbname}</b></h5>
                                </div>
                                <div className="col-md-8">
                                    <label className="form-control">{this.props.language=='vie' ? this.state.p_mbname :this.state.p_mbname_en }</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-4">
                                    <h5><b>{this.props.strings.brname}</b></h5>
                                </div>
                                <div className="col-md-8">
                                    <label className="form-control">{this.props.language=='vie' ? this.state.p_brname : this.state.p_brname_en}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-4">
                                    <h5><b>{this.props.strings.areaname}</b></h5>
                                </div>
                                <div className="col-md-8">
                                    <label className="form-control">{this.props.language=='vie' ? this.state.p_areaname: this.state.p_areaname_en}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-4">
                                    <h5><b>{this.props.strings.status_desc}</b></h5>
                                </div>
                                <div className="col-md-8">
                                    <label className="form-control">{this.props.language=='vie' ? this.state.p_status_desc: this.state.p_status_desc_en}</label>

                                </div>
                            </div>
                            <div className="col-md-12 row">

                            </div>
                        </div>
                    </div>

                </Modal.Body>
            </Modal>
        );
    }
}
const stateToProps = state => ({
    language: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalQLUserTheoNhomNSD')
]);
module.exports = decorators(ModalQLUserTheoNhomNSD);
