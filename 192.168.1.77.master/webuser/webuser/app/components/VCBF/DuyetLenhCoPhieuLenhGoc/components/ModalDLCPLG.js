import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import DateInput from 'app/utils/input/DateInput';
import Select from 'react-select';
import NumberFormat from 'react-number-format';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import moment from 'moment';
class ModalDLCPLG extends Component {
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

            pv_objname: this.props.OBJNAME,
            pv_language: this.props.language,
            //du lieu tra ve
            p_grllevel: '',
            p_prgrpid: '',
            p_fullname: '',
            p_managerid: '',
            p_tlfullname: '',
            p_rateamt: '',
            p_ratecomm: '',
            p_effdate: '',
            p_expdate: '',
            checkFields: [
                { name: "p_grllevel", id: "drdgrllevel" },
                { name: "p_prgrpid", id: "drdprgrpid" },
                { name: "p_fullname", id: "txtfullname" },
                { name: "p_managerid", id: "drdmanagerid" },
                { name: "p_rateamt", id: "txtrateamt" },
                { name: "p_ratecomm", id: "txtratecomm" },
                { name: "p_effdate", id: "effdate" },
                { name: "p_expdate", id: "expdate" },
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
                this.getInfolevelSaleGroups(nextProps.DATA.GRLLEVEL)
                //console.log('nextProps.DATA.GRLLEVEL', nextProps.DATA.GRLLEVEL)

                this.setState({
                    p_autoid: nextProps.DATA.AUTOID,
                    p_grllevel: nextProps.DATA.GRLLEVEL,
                    p_prgrpid: nextProps.DATA.PRGRPID,
                    p_fullname: nextProps.DATA.FULLNAME,
                    p_managerid: nextProps.DATA.MANAGERID,
                    p_tlfullname: nextProps.DATA.TLFULLNAME,
                    p_rateamt: nextProps.DATA.RATEAMT,
                    p_ratecomm: nextProps.DATA.RATECOMM,
                    p_effdate: nextProps.DATA.EFFDATE,
                    p_expdate: nextProps.DATA.EXPDATE,
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

                    fatca: false,
                    authorize: false,
                    upload: false,
                    p_grllevel: '',
                    p_prgrpid: '',
                    p_fullname: '',
                    p_managerid: '',
                    p_tlfullname: '',
                    p_rateamt: '',
                    p_ratecomm: '',
                    p_effdate: '',
                    p_expdate: '',
                    pv_language: this.props.language,
                    pv_objname: this.props.OBJNAME,
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
    async onSetDefaultValue(type, value) {
        //console.log('this.state.REROLE.fdfd', this.state.REROLE)
        if (!this.state[type])
            if (type == 'p_grllevel') {
                this.getInfolevelSaleGroups(value)
                if (this.state.p_grllevel == "0") {
                    this.setState({
                        p_prgrpid: -1
                    })
                } else {
                    this.setState({
                        p_prgrpid: ''
                    })
                }
                this.state[type] = value
            } else this.state[type] = value

    }
    onChange(type, event) {

        if (event.target) {

            this.state[type] = event.target.value;
        }
        else {
            this.state[type] = event.value;
        }
        this.setState({
            p_fullname: this.state.p_fullname,
            p_desc: this.state.p_desc,
            p_effdate: this.state.p_effdate,
            p_expdate: this.state.p_expdate
        })
    }
    //lay ds nhom theo level
    getInfolevelSaleGroups(value) {
        let that = this
        RestfulUtils.post('/user/getinfolevelsalegroups', { cdval: value, language: that.props.language })
            .then((res) => {

                //console.log('option ne:  ', res)
                that.setState({
                    ...that.state, dataMaNhomCapTren: res.resultdata, optionMaNhomCapTren: res.result
                })

            })
    }
    async onChangeDropdown(type, event) {

        this.state[type] = event.value

        if (type == 'p_grllevel') {
            //console.log('this.state.p_grllevel',this.state.p_grllevel)
            this.getInfolevelSaleGroups(event.value)
            if (this.state.p_grllevel == "0") {
                this.setState({
                    p_prgrpid: -1
                })
            } else {
                this.setState(this.state)
            }
        }

        this.setState(this.state)

    }

    checkValid(name, id) {
        let value = this.state[name];
        let mssgerr = '';

        switch (name) {

            case "p_grllevel":
                if (value == '') {
                    mssgerr = this.props.strings.requiredgrllevel;
                }
                break;
            case "p_prgrpid":
                if (value == '' && this.state.p_grllevel != "0") {
                    mssgerr = this.props.strings.requiredprgrpid;
                }
                break;
            case "p_fullname":
                if (value == '') {
                    mssgerr = this.props.strings.requiredfullname;
                }
                break;
            case "p_managerid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredmanagerid;
                }
                break;

            case "p_rateamt":
                if (value == '') {
                    mssgerr = this.props.strings.requiredrateamt;
                }
                if (value < 0 || value > 100) {
                    mssgerr = this.props.strings.required;
                }
                break;
            case "p_ratecomm":
                if (value == '') {
                    mssgerr = this.props.strings.requiredratecomm;
                }
                if (value < 0 || value > 100) {
                    mssgerr = this.props.strings.required;
                }
                break;
            case "p_effdate":
                if (value == '') {
                    mssgerr = this.props.strings.requiredeffdate;
                }
                if (value < 0 || value > 100) {
                    mssgerr = this.props.strings.required;
                }
                break;
            case "p_expdate":
                if (value == '') {
                    mssgerr = this.props.strings.requiredexpdate;
                }
                if (value < 0 || value > 100) {
                    mssgerr = this.props.strings.required;
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
        //console.log('this.state.p_prgrpid', this.state.p_prgrpid)

        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }
        if (mssgerr == '') {
            var api = '/user/addlistsalegroups';
            if (this.state.access == "update") {
                api = '/user/updatelistsalegroups';
            }
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            //consoconsole.log('xxx ', this.state.LOAIHINH, this.state.CODEID)
            let self = this

            RestfulUtils.posttrans(api, {
                autoid: this.state.p_autoid,
                grllevel: this.state.p_grllevel,
                prgrpid: this.state.p_prgrpid,
                fullname: this.state.p_fullname,
                managerid: this.state.p_managerid,
                rateamt: this.state.p_rateamt,
                ratecomm: this.state.p_ratecomm,
                effdate: this.state.p_effdate,
                expdate: this.state.p_expdate,
                groupthreshold: this.state.GROUPTHRESHOLD,
                language: this.props.language, objname: this.props.OBJNAME
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

    async componentWillMount() {

        let that = this
        await RestfulUtils.post('/user/getleader', { language: this.props.language })
            .then((res) => {
                //console.log('check ', res.data.resultdata)
                that.setState({
                    ...that.state, dataTN: res.resultdata, optionsTruongNhom: res.result
                })

            })
    }
    async getOptionsTruongNhom(input) {
        return await { options: this.state.optionsTruongNhom }

    }

    async  onChangeTruongNhom(e) {
        let result = {};
        let { dataTN } = this.state
        //console.log('dataTN: ', dataTN)

        if (e && e.value) {
            if (dataTN) {
                if (dataTN.length > 0) {
                    result = await dataTN.filter(item => item.TLID == e.value)
                    if (result) {
                        if (result.length > 0) {
                            //console.log('truong nhom: ', result)
                            this.setState({
                                dataTNrow: result[0]
                            })
                        }
                    }
                }
                this.setState({
                    p_managerid: e.value,
                    p_tlfullname: this.state.dataTNrow.TLFULLNAME
                })
            }
        }
        else {
            this.setState({ p_managerid: '' });
        }


    }

    async getOptionsMaNhomCapTren(input) {

        return { options: this.state.optionMaNhomCapTren }

    }
    async onChangeMaNhomCapTren(e) {

        let result = {};
        let { dataMN } = this.state
        if (e && e.value) {
            if (dataMN)
                if (dataMN.length > 0) {
                    result = await dataMN.filter(item => item.TLID == e.value)
                    if (result)
                        if (result.length > 0) {
                            //console.log('result dataMG',result[0])
                            this.setState({
                                dataMNrow: result[0],
                                p_tlname: result[0]["TLFULLNAME"],

                            })
                        }
                    //console.log('saleid: ', this.state.p_saleid)

                }
            this.setState({
                p_prgrpid: e.value,
            })
        } else {
            this.setState({
                p_prgrpid: '',
            })
        }
    }
    async onChangeMaMoGioi(e) {
        let result = {};
        let { dataMG } = this.state
        if (dataMG)
            if (dataMG.length > 0) {
                result = await dataMG.filter(item => item.TLID == e.value)
                if (result)
                    if (result.length > 0) {
                        //console.log('result dataMG',result[0])
                        this.setState({
                            dataMGrow: result[0],
                            p_tlname: result[0]["TLFULLNAME"],

                        })
                    }
                //console.log('saleid: ', this.state.p_saleid)
                //console.log('dataMGrow', this.state.dataMGrow)
            }

        await RestfulUtils.post('/user/getretypebysaleid', { saleid: this.state.dataMGrow["TLID"], language: this.props.language })
            .then((res) => {
                if (res.data.result.length > 0) {
                    this.setState({
                        ...this.state, optionMaLoaiHinh: res.result, dataLH: res.resultdata,
                        p_rerole: res.resultdata[0].REROLE,
                        p_reproduct: res.resultdata[0].REPRODUCT,
                    })
                }

                //console.log('checking', dataLH, dataLH[0].REROLE)
            })

        if (e && e.value) {

            this.setState({
                p_saleid: e.value,
            })
        }
    }
    async getOptionsMaLoaiHinh(input) {

        return { options: this.state.optionMaLoaiHinh }

    }
    async onChangeMaLoaiHinh(e) {
        if (e && e.value) {
            this.setState({
                p_retype: e.value,
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
    //load mac dinh la level 0 -- ko can dung vi co onsetDefault value r
    setDefaultNCT() {
        var that = this
        RestfulUtils.post('/allcode/getlist', { CDTYPE: 'SA', CDNAME: "MAXREGRPLEVEL" })
            .then((res) => {

                if (res.errCode == 0) {
                    if (res)
                        if (res.data.length > 0) {
                            that.setState({ p_grllevel: res.data[0].CDVAL })
                            that.getInfolevelSaleGroups(that.state.p_grllevel)
                        }

                }
            })
            .catch((e) => {

            })
    }

    render() {
        let disableWhenView = (this.state.access == 'view')
        let disableWhenUpdate = (this.state.access == 'update')
        let isDisableMaNhomCapTren = (this.state.p_grllevel == '0')
        let isDisableMaNhom = (this.state.access != 'add')
        let isDisableEffdate = moment(this.state.p_effdate, 'DD/MM/YYYY') <= moment(this.props.tradingdate, 'DD/MM/YYYY')
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
                                        <h5 className="highlight"><b>{this.props.strings.prgrpid}</b></h5>
                                    </div>
                                    <div className="col-md-8 customSelect">
                                        <Select.Async
                                            name="form-field-name"
                                            disabled={isDisableMaNhomCapTren || disableWhenView || disableWhenUpdate}
                                            placeholder={this.props.strings.prgrpid}
                                            loadOptions={this.getOptionsMaNhomCapTren.bind(this)}
                                            options={this.state.optionMaNhomCapTren}
                                            value={this.state.p_prgrpid}
                                            cache={false}
                                            onChange={this.onChangeMaNhomCapTren.bind(this)}
                                            id="drdprgrpid"
                                        />
                                    </div>
                                </div>

                                {isDisableMaNhom && <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 ><b>{this.props.strings.autoid}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <label className="form-control">{this.state.p_autoid}</label>
                                    </div>
                                </div>}
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.fullname}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <input maxLength='100' placeholder={this.props.strings.fullname} value={this.state.p_fullname} onChange={this.onChange.bind(this, "p_fullname")} className="form-control" id="txtfullname" disabled={disableWhenView} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4 ">
                                        <h5 className="highlight"><b>{this.props.strings.managerid}</b></h5>
                                    </div>
                                    <div className="col-md-8 customSelect">
                                        <Select.Async
                                            name="form-field-name"
                                            placeholder={this.props.strings.managerid}
                                            loadOptions={this.getOptionsTruongNhom.bind(this)}
                                            value={this.state.p_managerid}
                                            onChange={this.onChangeTruongNhom.bind(this)}
                                            id="drdmanagerid"
                                            disabled={disableWhenView || disableWhenUpdate}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 ><b>{this.props.strings.tlfullname}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-control" id="lbltlfullname">{this.state.p_tlfullname}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.rateamt}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <NumberFormat disabled={disableWhenView} className="form-control" value={this.state.p_rateamt} id="txtrateamt" onValueChange={this.onValueChange.bind(this, 'p_rateamt')} prefix={''} placeholder={this.props.strings.rateamt} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.ratecomm}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <NumberFormat disabled={disableWhenView} className="form-control" value={this.state.p_ratecomm} id="txtratecomm" onValueChange={this.onValueChange.bind(this, 'p_ratecomm')} prefix={''} placeholder={this.props.strings.ratecomm} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.effdate}</b></h5>
                                    </div>
                                    <div className="col-md-8 fixWidthDatePickerForOthers">
                                        <DateInput disabled={(isDisableEffdate && this.state.access == "update") || disableWhenView} onChange={this.onChange.bind(this)} value={this.state.p_effdate} type="p_effdate" id='effdate' />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.expdate}</b></h5>
                                    </div>
                                    <div className="col-md-8 fixWidthDatePickerForOthers">
                                        <DateInput disabled={disableWhenView} onChange={this.onChange.bind(this)} value={this.state.p_expdate} type="p_expdate" id='expdate' />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>Định mức nhóm</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <NumberFormat disabled={disableWhenView} decimalScale={0} allowNegative = {false} className="form-control" value={this.state.GROUPTHRESHOLD ? this.state.GROUPTHRESHOLD : '0'} id="txtthreshold" onValueChange={this.onValueChange.bind(this, 'GROUPTHRESHOLD')} prefix={''} placeholder={this.props.strings.GROUPTHRESHOLD} />
                                    </div>
                                    {/* <div className="col-md-8">
                                    <NumberFormat  decimalScale={0} allowNegative = {false} value={this.state.GROUPTHRESHOLD ? this.state.GROUPTHRESHOLD : '0'}  onValueChange={this.onValueChange.bind(this, 'GROUPTHRESHOLD')} disabled={false} className="form-control" displayType={'text'}  prefix={''} placeholder="0" />
                                    </div> */}
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
    translate('ModalDLCPLG')
]);
module.exports = decorators(ModalDLCPLG);
