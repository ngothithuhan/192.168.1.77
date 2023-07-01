import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import RestfulUtils from 'app/utils/RestfulUtils';
import { connect } from 'react-redux'
import DropdownFactory from '../../../../../utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';
import Select from 'react-select';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import NumberFormat from 'react-number-format';
import { showNotifi } from 'app/action/actionNotification.js';
class ModalDetailRE003_Info extends Component {
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
                { name: "p_areaid", id: "drdareaname" },
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
            let that = this
            await RestfulUtils.post('/user/getareassbymbid', { mbid: nextProps.DATA.MBCODE, language: this.props.language })
                .then((res) => {
                    that.setState({
                        ...that.state, dataKV: res.resultdata, optionsKhuVuc: res.result
                    })
                })
            await RestfulUtils.post('/user/getbrgrpbymbidareaid', { mbid: nextProps.DATA.MBCODE, areaid: nextProps.DATA.AREAID, language: this.props.language })
                .then((res) => {
                    that.setState({
                        ...that.state, dataCN: res.resultdata, optionsChiNhanh: res.result
                    })
                })
            if (nextProps.isClear) {
                this.setState({
                    p_autoid: nextProps.DATA.AUTOID,
                    p_saleid: nextProps.DATA.TLID,
                    p_tlname: nextProps.DATA.TLFULLNAME,
                    p_frdate: nextProps.DATA.EFFDATE,
                    p_todate: nextProps.DATA.EXPDATE,
                    p_mbcode: nextProps.DATA.MBCODE,
                    p_areaid: nextProps.DATA.AREAID,
                    p_brid: nextProps.DATA.BRID,
                    p_brname: nextProps.DATA.BRNAME,
                    p_ratecomm: nextProps.DATA.RATECOMM,
                    p_ratealoc: nextProps.DATA.RATEALOC,
                    p_description: nextProps.DATA.DESCRIPTION,
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
                    p_saleid: '',
                    p_tlname: '',
                    p_frdate: '',
                    p_todate: '',
                    p_mbcode: '',
                    p_areaid: '',
                    p_brid: '',
                    p_ratecomm: '',
                    p_ratealoc: '',
                    p_description: '',
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
            this.state[type] = value
            let that = this
            RestfulUtils.post('/user/getbrgrpbymbidareaid', { mbid: this.state.p_mbcode, areaid: this.state.p_areaid, language: this.props.language })
                .then((res) => {
                    that.setState({
                        ...that.state, dataCN: res.dresultdata, optionsChiNhanh: res.result
                    })
                })
            RestfulUtils.post('/user/getareassbymbid', { mbid: this.state.p_mbcode, language: this.props.language })
                .then((res) => {
                    that.setState({
                        ...that.state, dataKV: res.resultdata, optionsKhuVuc: res.result
                    })
                    //console.log( 'res.data.result', res.data.result )

                })
        }

    }
    onChange(type, event) {
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
                        ...that.state, dataCN: res.resultdata, optionsChiNhanh: res.result
                    })
                    //console.log( 'res.data.result', res.data.result )

                })
            await RestfulUtils.post('/user/getareassbymbid', { mbid: event.value, language: this.props.language })
                .then((res) => {
                    that.setState({
                        ...that.state, dataKV: res.resultdata, optionsKhuVuc: res.result
                    })
                    //console.log( 'res.data.result getAreassBymbid' , res.data.result, event.value )

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
                    mssgerr = this.props.strings.requiredratecommtrue2;
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
            if (this.state.access == "update") {
                api = '/user/updatelistsalebranchs';
            }
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""
            }
            //console.log('xemmmm', api)
            RestfulUtils.posttrans(api, {
                autoid: this.state.p_autoid,
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
                    ...that.state, dataMG: res.resultdata, optionsDataMG: res.result
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
                        ...that.state, dataCN: res.resultdata, optionsChiNhanh: res.result
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
        let disableWhenUpdate = (this.state.access == 'update')

        const { selectedOption } = this.state;
        return (
            <Modal show={this.props.showModalDetail} bsSize="md" >
                <Modal.Header>
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} >
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.saleid}</b></h5>
                                    </div>

                                    <div className="col-md-8 customSelect">
                                        <Select.Async className="form-field-name"
                                            disabled={disableWhenView || disableWhenUpdate}
                                            name="form-field-name"
                                            placeholder={this.props.strings.placeholder}
                                            loadOptions={this.getOptionsMaMoGioi.bind(this)}
                                            options={this.state.optionsDataMG}
                                            cache={false}
                                            value={this.state.p_saleid}
                                            onChange={this.onChangeMaMoGioi.bind(this)}
                                            id="drdsaleid"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.tlname}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-control" id="lbltlname">{this.state.p_tlname}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.frdate}</b></h5>
                                    </div>
                                    <div className="col-md-8 fixWidthDatePickerForOthers">
                                        <DateInput disabled={disableWhenView} onChange={this.onChange.bind(this)} value={this.state.p_frdate} type="p_frdate" id="txtfrdate" />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.todate}</b></h5>
                                    </div>
                                    <div className="col-md-8 fixWidthDatePickerForOthers">
                                        <DateInput disabled={disableWhenView} onChange={this.onChange.bind(this)} value={this.state.p_todate} type="p_todate" id="txttodate" />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.mbname}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <DropdownFactory disabled={disableWhenView || disableWhenUpdate} onChange={this.onChangeDropdown.bind(this)} onSetDefaultValue={this.onSetDefaultValue} CDVAL={this.state.p_mbcode} value="p_mbcode" CDTYPE="SA" CDNAME="MEMBERS" ID="drdmbname" />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.areaname}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <Select.Async className="form-field-name"
                                            disabled={disableWhenView||disableWhenUpdate}
                                            name="form-field-name"
                                            placeholder={this.props.strings.placeholder}
                                            loadOptions={this.getOptionsMaKhuVuc.bind(this)}
                                            options={this.state.optionsKhuVuc}
                                            cache={false}
                                            value={this.state.p_areaid}
                                            onChange={this.onChangeKhuVuc.bind(this)}
                                            id="drdareaname"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.brname}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <Select.Async className="form-field-name"
                                            disabled={disableWhenView||disableWhenUpdate}
                                            name="form-field-name"
                                            placeholder={this.props.strings.placeholder}
                                            loadOptions={this.getOptionsMaChiNhanh.bind(this)}
                                            options={this.state.optionsChiNhanh}
                                            cache={false}
                                            value={this.state.p_brid}
                                            onChange={this.onChangeMaChiNhanh.bind(this)}
                                            id="drdbrname"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.ratecomm}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <NumberFormat disabled={disableWhenView ||disableWhenUpdate} className="form-control" value={this.state.p_ratecomm == parseInt(this.state.p_ratecomm) ? parseInt(this.state.p_ratecomm) : this.state.p_ratecomm} id="txtrateamt" onValueChange={this.onValueChange.bind(this, 'p_ratecomm')} thousandSeparator={false} prefix={''} placeholder={this.props.strings.ratecomm} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.ratealoc}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <NumberFormat disabled={disableWhenView||disableWhenUpdate} className="form-control" value={this.state.p_ratealoc} id="txtratealoc" onValueChange={this.onValueChange.bind(this, 'p_ratealoc')} thousandSeparator={false} prefix={''} placeholder={this.props.strings.ratealoc} />
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        <input disabled={disableWhenView} onClick={this.submitGroup.bind(this)} type="button" className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
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
    language: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalDetailRE003_Info')
]);
module.exports = decorators(ModalDetailRE003_Info);
