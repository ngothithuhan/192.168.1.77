import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import moment from 'moment'
import { connect } from 'react-redux'
import DateInput from 'app/utils/input/DateInput';
import NumberFormat from 'react-number-format';
import Select from 'react-select';
import RestfulUtils from 'app/utils/RestfulUtils'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import DropdownFactory from '../../../../../utils/DropdownFactory';
import { showNotifi } from 'app/action/actionNotification.js';
import { getExtensionByLang } from 'app/Helpers'

class ModalDetailQLLoaiHinhMG_info extends Component {
    constructor(props) {
        super(props);
        this.state = {

            access: 'add',

            feeDS: { value: 0, validate: null, tooltip: "Không được để trống !!" },
            feeHH: { value: 0, validate: null, tooltip: "Không được để trống !!" },
            ROLE: { value: '', label: '' },
            CODEID: { value: '', label: '' },
            FEETYPEID: { value: '', label: '' },
            datagroup: {
                p_autoid: '',
                p_typename: '',
                p_retype: '',
                p_reproduct: '',
                p_codeid: '',
                p_rerole: '',
                p_effdate: '',
                p_expdate: '',
                p_description: '',
                p_feetypeid: '',
                // QuarterOrMonth: '1',
                Month: '',
                Day: ''
            },
            checkFields: [

                { name: "p_typename", id: "txtNamebrokeragetype" },
                // { name: "p_ratedensity", id: "txtPercentsales" },
                { name: "p_effdate", id: "txteffdate" },
                { name: "p_expdate", id: "txtexpdate" },
                { name: "p_feetypeid", id: "cbFEETYPEID" },
                { name: "ROLE", id: "cbRole" },


            ],
        };
    }
    collapse(tab) {
        // console.log(tab)
        this.state.collapse[tab] = !this.state.collapse[tab];
        // console.log(this.state.collapse)
        this.setState({ collapse: this.state.collapse })
    }
    //   handleChange(type){
    //     this.props.handleChange(type);

    //  }
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
        this.getOptionsFEETYPEID()
        this.getOptionsSYMBOL(nextProps.DATA.CODEID)
        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()
                this.getOptionsRole(nextProps.DATA.RETYPE)
                this.setState({
                    display: {
                        fatca: true,
                        authorize: true,
                        upload: true,
                        quydangki: true
                    },
                    datagroup: {
                        p_autoid: nextProps.DATA.AUTOID,
                        p_typename: nextProps.DATA.TYPENAME,
                        p_retype: nextProps.DATA.RETYPE,
                        p_reproduct: nextProps.DATA.REPRODUCT,
                        p_codeid: nextProps.DATA.CODEID,
                        p_rerole: nextProps.DATA.REROLE,
                        p_effdate: nextProps.DATA.EFFDATE,
                        p_expdate: nextProps.DATA.EXPDATE,
                        // p_ratedensity: "100",
                        // QuarterOrMonth: nextProps.DATA.QUARTERORMONTH,
                        // Month: nextProps.DATA.MONTH,
                        // Day: nextProps.DATA.DAY,
                        p_description: nextProps.DATA.DESCRIPTION ? nextProps.DATA.DESCRIPTION : '',
                        p_feetypeid: nextProps.DATA.FEETYPEID,
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME
                    },
                    access: nextProps.access,
                    ROLE: { value: nextProps.DATA.REROLE, label: nextProps.DATA[getExtensionByLang("REROLEDES", this.props.lang)] },
                    CODEID: { value: nextProps.DATA.CODEID, label: nextProps.DATA[getExtensionByLang("CODEID", this.props.lang)] },
                    tradingdate: this.props.tradingdate,
                    status: nextProps.DATA[getExtensionByLang("STATUSDES", this.props.lang)]
                })
            }
        }
        else
            if (nextProps.isClear) {
                this.props.change()
                this.setState({
                    display: {
                        fatca: false,
                        authorize: false,
                        upload: false,
                        quydangki: false,

                    },
                    new_create: true,
                    datagroup: {
                        p_autoid: '',
                        p_typename: '',
                        p_retype: '',
                        p_reproduct: '',
                        p_codeid: '',
                        p_rerole: '',
                        p_effdate: '',
                        p_expdate: '',
                        p_description: '',
                        p_feetypeid: '',
                        // p_ratedensity: '100',
                        // QuarterOrMonth: '1',
                        Month: '',
                        Day: '',
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME
                    },
                    access: nextProps.access,
                    ROLE: { value: '', label: '' },
                    CODEID: { value: '', label: '' },
                    tradingdate: this.props.tradingdate,
                    status: this.props.strings.pending

                })
            }
    }
    componentDidMount() {

        // io.socket.post('/account/get_detail',{CUSTID:this.props.CUSTID_VIEW,TLID:"0009"}, function (resData, jwRes) {
        //     console.log('detail',resData)
        //     // self.setState({generalInformation:resData});

        // });

    }

    onValueChange(type, data) {

        this.state.datagroup[type] = data.value
        this.setState(this.state)
    }
    handleChange = (selectedOption) => {
        this.setState({ selectedOption });

    }
    onChangeDate(type, event) {
        this.state.datagroup[type] = event.value;
        this.setState({ datagroup: this.state.datagroup })
    }
    onSetDefaultValue = (type, value) => {

        if (!this.state.datagroup[type]) {
            if (type == 'p_retype') {
                this.getOptionsRole(value)
                this.state.datagroup[type] = value
            } else this.state.datagroup[type] = value
        }


    }
    onChangeDRD(type, event) {
        let data = {};
        if (event.target) {

            this.state.datagroup[type] = event.target.value;
        }
        else {

            if (type == 'p_retype') {
                this.getOptionsRole(event.value)
            }
            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup })
    }
    getOptionsRole(input) {

        let data = {
            p_language: this.props.lang,
            p_retype: input
        }
        RestfulUtils.post('/fund/getlistrole_byretype', { data })
            .then((res) => {

                this.setState({
                    dataROLE: res
                })
            })
    }
    onChangeRole(e) {

        var that = this
        if (e && e.value)
            // this.getSessionInfo(e.value);
            //this.set_data_feettypes(e.value)
            this.state.datagroup["p_rerole"] = e.value
        this.setState({
            ROLE: e,
            datagroup: this.state.datagroup
        })


    }
    getOptionsFEETYPEID(input) {

        let data = {
            p_language: this.props.lang,
        }
        RestfulUtils.post('/fund/getlistfeetypeid', { data })
            .then((res) => {

                this.setState({
                    dataFEETYPEID: res
                })
            })
    }
    getOptionsSYMBOL(input) {
        let data = {
            key: '',
        }
        RestfulUtils.post('/allcode/search_all_funds', { data })
            .then((res) => {
                this.setState({
                    dataSYMBOL: res
                })
            })
    }
    onChangeSYMBOL(e) {
        if (e && e.value)
            this.state.datagroup["p_codeid"] = e.value
        this.setState({
            CODEID: e,
            datagroup: this.state.datagroup
        })
    }
    onChangeFEETYPEID(e) {
        var that = this
        if (e && e.value)
            this.state.datagroup["p_feetypeid"] = e.value
        this.setState({
            datagroup: this.state.datagroup
        })
    }
    checkValid(name, id) {

        let value = this.state.datagroup[name];
        let mssgerr = '';
        // if (this.state.ROLE.value == '') {
        //     mssgerr = this.props.strings.requiredretype;
        // }
        switch (name) {

            case "p_typename":
                if (value == '') {
                    mssgerr = this.props.strings.requiredtypename;
                }
                break;

            // case "p_ratedensity":
            //     if (value == '') {
            //         mssgerr = this.props.strings.requiredratedensity;
            //     } else {
            //         if (value > 100) mssgerr = this.props.strings.requiredratedensity100;
            //     }
            //     break;
            // case "p_effdate":
            //     if (value == '') {

            //         mssgerr = this.props.strings.requiredeffdate;
            //     } else {
            //         if ((this.state.tradingdate != this.state.datagroup["p_effdate"]) && this.state.access == "add") {
            //             var tradingdate = moment(this.state.tradingdate, 'DD/MM/YYYY')
            //             var effdate = moment(value, 'DD/MM/YYYY')
            //             if (moment(tradingdate).isBefore(effdate) == false) mssgerr = this.props.strings.requiredeffdatecondition;
            //         }
            //     }
            //     break;
            // case "p_expdate":
            //     if (value == '') {
            //         mssgerr = this.props.strings.requiredexpdate;
            //     } else {
            //         var effdate = moment(this.state.datagroup["p_effdate"], 'DD/MM/YYYY')
            //         var expdate = moment(value, 'DD/MM/YYYY')
            //         if (moment(effdate).isBefore(expdate) == false) mssgerr = this.props.strings.requiredexpdatecondition;
            //     }
            //     break;
            case "p_feetypeid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredfeetypeid;
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
            var api = '/fund/addsale_retype';
            if (this.state.access == "update") {
                api = '/fund/updatesale_retype';
            }

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            //  console.log(this.state.datagroup)
            RestfulUtils.posttrans(api, this.state.datagroup)
                .then((res) => {

                    if (res.EC == 0) {
                        datanotify.type = "success";
                        datanotify.content = this.props.strings.success
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
    // onchangeDropChuKy(event) {
    //     let { datagroup } = this.state;
    //     console.log('onchangeDropChuKy:', event.target.value)
    //     if (event.target.value == 1) {
    //         this.state.datagroup.Month = '1';
    //     }
    //     else {
    //         this.state.datagroup.Month = '';
    //     }
    //     this.state.datagroup.QuarterOrMonth = event.target.value
    //     this.setState(datagroup);
    // }

    // onchangeMonth(event) {
    //     let { datagroup } = this.state;
    //     this.state.datagroup.Month = event.target.value
    //     this.setState(datagroup);
    // }
    render() {
        // console.log('this.state.datagroup:', this.state.datagroup);
        const pageSize = 5;
        var displayView = this.state.access == 'view' ? true : false
        return (
            <Modal show={this.props.showModalDetail}  >
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: "100%", overflow: "auto" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == 'view' ? "col-md-12 disable" : "col-md-12"} style={{ paddingTop: "11px" }}>

                                <div className="col-md-12 row disable" style={{ display: this.state.access != 'add' ? 'block' : 'none' }}>
                                    <div className="col-md-5">
                                        <h5 className="highlight"><b>{this.props.strings.idbrokeragetype}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" type="text" placeholder={this.props.strings.idbrokeragetype} id="txtIdbrokeragetype">{this.state.datagroup["p_autoid"]}</label>
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 className="highlight"><b>{this.props.strings.namebrokeragetype}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <input maxLength={300} className="form-control" type="text" placeholder={this.props.strings.namebrokeragetype} id="txtNamebrokeragetype" value={this.state.datagroup["p_typename"]} onChange={this.onChange.bind(this, "p_typename")} disabled={displayView} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.type}</b></h5>
                                    </div>
                                    <div className="col-md-7 ">
                                        <DropdownFactory CDVAL={this.state.datagroup.p_retype} onSetDefaultValue={this.onSetDefaultValue} value="p_retype" CDTYPE="RE" CDNAME="RETYPE" onChange={this.onChangeDRD.bind(this)} ID="drdRetype" disabled={displayView} />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.ordertype}</b></h5>
                                    </div>
                                    <div className="col-md-7 ">
                                        <DropdownFactory CDVAL={this.state.datagroup.p_reproduct} onSetDefaultValue={this.onSetDefaultValue} value="p_reproduct" CDTYPE="SA" CDNAME="FEEAPPLY" onChange={this.onChangeDRD.bind(this)} ID="drdOrdertype" disabled={true} />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.codeid}</b></h5>
                                    </div>
                                    <div className="col-md-7 ">
                                        <Select
                                            name="form-field-name"
                                            //disabled={this.state.ISEDIT}
                                            placeholder={this.props.strings.inputCCQ}
                                            options={this.state.dataSYMBOL}
                                            value={this.state.CODEID}
                                            onChange={this.onChangeSYMBOL.bind(this)}
                                            id="cbCODEID"
                                        />
                                    </div>
                                </div>
                                {/* <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 className="highlight"><b>{this.props.strings.role}</b></h5>
                                    </div>
                                    <div className="col-md-7 customSelect">
                                        <Select
                                            name="form-field-name"
                                            placeholder={this.props.strings.role}
                                            options={this.state.dataROLE}
                                            value={this.state.ROLE}
                                            onChange={this.onChangeRole.bind(this)}
                                            id="cbRole"
                                            disabled={displayView}
                                        />
                                    </div>
                                </div> */}

                                {/* <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 className="highlight"><b>{this.props.strings.effdate}</b></h5>
                                    </div>
                                    <div className="col-md-7 fixWidthDatePickerForOthers">
                                        <DateInput disabled={this.state.access == 'add' ? false : true} onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["p_effdate"]} type="p_effdate" id="txteffdate" />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 className="highlight"><b>{this.props.strings.expdate}</b></h5>
                                    </div>
                                    <div className="col-md-7 fixWidthDatePickerForOthers">
                                        <DateInput disabled={displayView} onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["p_expdate"]} type="p_expdate" id="txtexpdate" />

                                    </div>
                                </div> */}
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 className="highlight"><b>{this.props.strings.FEETYPEID}</b></h5>
                                    </div>
                                    <div className="col-md-7 customSelect">
                                        <Select
                                            name="form-field-name"
                                            placeholder={this.props.strings.FEETYPEID}
                                            options={this.state.dataFEETYPEID}
                                            value={this.state.datagroup.p_feetypeid}
                                            onChange={this.onChangeFEETYPEID.bind(this)}
                                            id="cbFEETYPEID"
                                            disabled={displayView}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5><b>{this.props.strings.status}</b></h5>
                                    </div>
                                    <div className="col-md-7  disable">

                                        <label className="form-control" id="drdStatus">{this.state.status}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5><b>{this.props.strings.desc}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <input maxLength={500} disabled={displayView} className="form-control" type="text" placeholder={this.props.strings.desc} id="txtDesc" value={this.state.datagroup["p_description"]} onChange={this.onChange.bind(this, "p_description")} />
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="pull-right">

                                        <input type="button" disabled={displayView} onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />

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
    lang: state.language.language,
    tradingdate: state.systemdate.tradingdate

});
const decorators = flow([
    connect(stateToProps),
    translate('ModalDetailQLLoaiHinhMG_info')
]);
module.exports = decorators(ModalDetailQLLoaiHinhMG_info);
