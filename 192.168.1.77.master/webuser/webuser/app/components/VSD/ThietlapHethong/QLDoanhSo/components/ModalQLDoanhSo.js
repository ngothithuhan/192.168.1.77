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

class ModalQLDoanhSo extends Component {
    constructor(props) {
        super(props);
        this.state = {

            access: 'add',

            feeDS: { value: 0, validate: null, tooltip: "Không được để trống !!" },
            feeHH: { value: 0, validate: null, tooltip: "Không được để trống !!" },
            ROLE: { value: '', label: '' },
            datagroup: {
                p_autoid: '',
                p_saleid :'',
                p_typename: '',
                p_retype: '',
                p_reproduct: '',
                p_rerole: '',
                p_effdate: '',
                p_expdate: '',
                p_description: '',
                p_s_saledate: '',
                p_feevaluereal: '0',
                p_feevaluebonus: '0',
                p_feevalueleft: '0',
                p_feevalueleft_backup:'0',
                p_diengiai:'',
                p_tax :'0',
                // QuarterOrMonth: '1',
                Month: '',
                Day: ''
            },
            checkFields: [

                { name: "p_typename", id: "txtNamebrokeragetype" },
                // { name: "p_ratedensity", id: "txtPercentsales" },
                { name: "p_effdate", id: "txteffdate" },
                { name: "p_expdate", id: "txtexpdate" },
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

        console.log('data:', nextProps.DATA)
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
                        p_tlname: nextProps.DATA.TLNAME,
                        p_saleid :nextProps.DATA.SALEID,
                        p_idbrokerage: nextProps.DATA.SALEIDNEW,
                        p_s_saledate: nextProps.DATA.S_SALEDATE,
                        p_namebrokerage: nextProps.DATA.TLFULLNAME,
                        p_typename: nextProps.DATA.TYPENAME,
                        p_feevalue: nextProps.DATA.FEEVALUE,
                        p_feevaluebonus: '0',
                        p_feevaluereal:  '0',
                        p_feevalueleft: nextProps.DATA.FEEVALUELEFT ? nextProps.DATA.FEEVALUELEFT : nextProps.DATA.FEEVALUE,
                        p_feevalueleft_backup: nextProps.DATA.FEEVALUELEFT ? nextProps.DATA.FEEVALUELEFT : nextProps.DATA.FEEVALUE,
                        p_diengiai:nextProps.DATA.DIENGIAI,
                        p_tax : '0',
                        p_rerole: nextProps.DATA.REROLEDES,
                        //p_effdate: nextProps.DATA.EFFDATE,
                        //p_expdate: nextProps.DATA.EXPDATE,
                        // p_ratedensity: "100",
                        // QuarterOrMonth: nextProps.DATA.QUARTERORMONTH,
                        // Month: nextProps.DATA.MONTH,
                        // Day: nextProps.DATA.DAY,
                        //p_description: nextProps.DATA.DESCRIPTION ? nextProps.DATA.DESCRIPTION : '',
                        p_language: this.props.lang,
                        pv_objname: this.props.OBJNAME
                    },
                    access: nextProps.access,
                    ROLE: { value: nextProps.DATA.REROLE, label: nextProps.DATA[getExtensionByLang("REROLEDES", this.props.lang)] },
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
                        p_tlname: '',
                        p_saleid :'',
                        p_idbrokerage: '',
                        p_namebrokerage: '',
                        p_typename: '',
                        p_feevalue: '',
                        p_s_saledate: '',
                        p_feevaluebonus: '0',
                        p_feevaluereal: '0',
                        p_feevalueleft: '0',
                        p_feevalueleft_backup:'0',
                        p_rerole: '',
                        p_diengiai:'',
                        p_tax :'0',
                        p_language: this.props.lang,
                        pv_objname: this.props.OBJNAME
                    },
                    access: nextProps.access,
                    ROLE: { value: '', label: '' },
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
    onBlurInput(type, data) {
        console.log(type, data.target.value)
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }
        let tmp = '';
        let tmpleft = this.state.datagroup['p_feevalueleft'];
        
        if (data.target.value == '' || data.target.value  == null) {
            this.state.datagroup[type] = "0";
            tmp = "0"
            //this.state.datagroup['p_feevalueleft'] = parseInt(this.state.datagroup.p_feevalueleft) + parseInt(this.state.datagroup.p_feevaluebonus) - parseInt(this.state.datagroup.p_feevaluereal)
        }
        else {
            this.state.datagroup[type] = data.target.value;
            tmp = data.target.value
            //this.state.datagroup['p_feevalueleft'] = parseInt(this.state.datagroup.p_feevalueleft) + parseInt(this.state.datagroup.p_feevaluebonus) - parseInt(this.state.datagroup.p_feevaluereal)
        }        
        if (type == 'p_feevaluereal' ) {
            console.log('this.state.datagroup.p_feevalueleft:',this.state.datagroup['p_feevalueleft'])
            console.log('tmp:',tmp)
            //this.state.datagroup['p_feevalueleft'] = parseInt(this.state.datagroup.p_feevalue) + parseInt(this.state.datagroup.p_feevaluebonus) - parseInt(this.state.datagroup.p_feevaluereal)
            this.state.datagroup['p_feevalueleft'] = parseInt(this.state.datagroup['p_feevalueleft_backup'])  - parseInt(tmp)
        }
        else if (type == 'p_feevaluebonus'){
            console.log('this.state.datagroup.p_feevalueleft:',this.state.datagroup['p_feevalueleft'])
            console.log('tmp:',tmp)
            this.state.datagroup['p_feevalueleft'] = parseInt(this.state.datagroup['p_feevalueleft_backup']) + parseInt(tmp)
        }
        else if (type == 'p_tax'){
            console.log('this.state.datagroup.p_feevalueleft:',this.state.datagroup['p_feevalueleft'])
            console.log('tmp:',tmp)
            this.state.datagroup['p_feevalueleft'] = parseInt(this.state.datagroup['p_feevalueleft_backup']) - parseInt(tmp)
        }
        this.setState(this.state)
        // console.log(parseInt(data.target.value) , parseInt(this.state.datagroup.p_feevalue))
        // if (type == 'p_feevaluereal' && parseInt(data.target.value) > (parseInt(this.state.datagroup.p_feevalue)+parseInt(this.state.datagroup.p_feevaluebonus)) ) {
        //     console.log('case sai')
        //                 datanotify.type = "error";
        //                 datanotify.content = 'Hoa hồng thực tế không thể lớn hơn tổng hoa hồng hiện tại và hoa hồng thưởng thêm';
        //                 dispatch(showNotifi(datanotify));
        //                 if (this.state.datagroup.p_feevaluebonus == '0'){
        //                     data.target.value  = data.target.value  ;
        //                 } 
        //                 else {
        //                     data.target.value  = '0';
        //                 }

        //                 this.state.datagroup.p_feevalueleft = (parseInt(this.state.datagroup.p_feevalue)+parseInt(this.state.datagroup.p_feevaluebonus)).toString();

        // }
        // if (type == 'p_feevaluebonus' && this.state.datagroup.p_feevalue != '0' && parseInt(this.state.datagroup.p_feevaluereal) > (parseInt(this.state.datagroup.p_feevalue)+parseInt(data.target.value)) ) {
        //     console.log('case sai')
        //                 datanotify.type = "error";
        //                 datanotify.content = 'Hoa hồng thực tế không thể lớn hơn tổng hoa hồng hiện tại và hoa hồng thưởng thêm';
        //                 dispatch(showNotifi(datanotify));
        //                 data.target.value  = '0';
        // }
        //this.state.datagroup[type] = data.target.value
        this.setState(this.state)
    }
    onValueChange(type, data) {
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }
        let tmp = '';
        let tmpleft = this.state.datagroup['p_feevalueleft'];
        
        if (data.value == '' || data.value  == null) {
            this.state.datagroup[type] = "0";
            tmp = "0"
            //this.state.datagroup['p_feevalueleft'] = parseInt(this.state.datagroup.p_feevalueleft) + parseInt(this.state.datagroup.p_feevaluebonus) - parseInt(this.state.datagroup.p_feevaluereal)
        }
        else {
            this.state.datagroup[type] = data.value;
            tmp = data.value
            //this.state.datagroup['p_feevalueleft'] = parseInt(this.state.datagroup.p_feevalueleft) + parseInt(this.state.datagroup.p_feevaluebonus) - parseInt(this.state.datagroup.p_feevaluereal)
        }        
        if (type == 'p_feevaluereal' || type == 'p_feevaluebonus'||type == 'p_tax') {
            
            //this.state.datagroup['p_feevalueleft'] = parseInt(this.state.datagroup.p_feevalue) + parseInt(this.state.datagroup.p_feevaluebonus) - parseInt(this.state.datagroup.p_feevaluereal)
            this.state.datagroup['p_feevalueleft'] = parseInt(this.state.datagroup['p_feevalueleft_backup']) + parseInt(this.state.datagroup['p_feevaluebonus']) - parseInt(this.state.datagroup['p_feevaluereal']) - parseInt(this.state.datagroup['p_tax'])
        }
        
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
    // onChangeDRD(type, event) {
    //     let data = {};
    //     if (event.target) {

    //         this.state.datagroup[type] = event.target.value;
    //     }
    //     else {

    //         if (type == 'p_retype') {
    //             this.getOptionsRole(event.value)
    //         }
    //         this.state.datagroup[type] = event.value;
    //     }
    //     this.setState({ datagroup: this.state.datagroup })
    // }
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
    checkValid(name, id) {

        let value = this.state.datagroup[name];
        let mssgerr = '';
        if (this.state.ROLE.value == '') {
            mssgerr = this.props.strings.requiredretype;
        }
        switch (name) {

            // case "p_typename":
            //     if (value == '') {
            //         mssgerr = this.props.strings.requiredtypename;
            //     }
            //     break;

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
            // default:
            //break;
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
            var api = '/fund/update_sale_calculator';


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
        console.log('this.state.datagroup:', this.state.datagroup)
        const pageSize = 5;
        var displayView = this.state.access == 'view' ? true : false
        return (
            <Modal show={this.props.showModalDetail}  >
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == 'view' ? "col-md-12 disable" : "col-md-12"} style={{ paddingTop: "11px" }}>

                                <div className="col-md-12 row disable" style={{ display: this.state.access != 'add' ? 'block' : 'none' }}>
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.idbrokerage}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" type="text" placeholder={this.props.strings.idbrokerage} id="txtIdbrokeragetype">{this.state.datagroup["p_tlname"]}</label>
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5><b>{this.props.strings.namebrokerage}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" type="text" placeholder={this.props.strings.namebrokerage} id="txtNamebrokeragetype">{this.state.datagroup["p_namebrokerage"]}</label></div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5><b>{this.props.strings.commissiondate}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" type="text" placeholder={this.props.strings.commissiondate} id="txtcommissiondate">{this.state.datagroup["p_s_saledate"]}</label></div>
                                </div>
                                {/* <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.rerole}</b></h5>
                                    </div>
                                    <div className="col-md-7 ">
                                        <label className="form-control" type="text" placeholder={this.props.strings.rerole} id="txtreroledes">{this.state.datagroup["p_rerole"]}</label>
                                    
                                    </div>
                                </div> */}
                                {/* <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.typename}</b></h5>
                                    </div>
                                    <div className="col-md-7 ">
                                        <label className="form-control" type="text" placeholder={this.props.strings.typename} id="txttypename">{this.state.datagroup["p_typename"]}</label>
                                    
                                    </div>
                                </div> */}
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.feevalue}</b></h5>
                                    </div>
                                    <div className="col-md-7 customSelect">
                                        <NumberFormat maxLength={21} disabled={true} className="form-control" id="txtFeevalue" value={this.state.datagroup["p_feevalue"] ? this.state.datagroup["p_feevalue"] : 0} onValueChange={this.onValueChange.bind(this, 'p_feevalue')} prefix={''} placeholder={this.props.strings.feevalue} allowNegative={false} decimalScale={2} thousandSeparator={true}  />

                                    </div>
                                </div>
                                {/* <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.feevaluebonus}</b></h5>
                                    </div>
                                    <div className="col-md-7 customSelect">
                                        <NumberFormat maxLength={21} className="form-control" id="txtFeevaluebonus"
                                            value={this.state.datagroup["p_feevaluebonus"] ? this.state.datagroup["p_feevaluebonus"] : 0}
                                            //onBlur={this.onBlurInput.bind(this, 'p_feevaluebonus')}
                                            onValueChange={this.onValueChange.bind(this, 'p_feevaluebonus')}
                                            prefix={''} placeholder={this.props.strings.feevaluebonus} allowNegative={false} decimalScale={2} thousandSeparator={true} />

                                    </div>
                                </div> */}
                                {/* <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.feevaluereal}</b></h5>
                                    </div>
                                    <div className="col-md-7 customSelect">
                                        <NumberFormat maxLength={21} className="form-control" id="txtFeevaluereal" value={this.state.datagroup["p_feevaluereal"] ? this.state.datagroup["p_feevaluereal"] : 0}
                                            onValueChange={this.onValueChange.bind(this, 'p_feevaluereal')}
                                            //onBlur={this.onBlurInput.bind(this, 'p_feevaluereal')}
                                            prefix={''} placeholder={this.props.strings.feevalue} allowNegative={false} decimalScale={2} thousandSeparator={true} />

                                    </div>
                                </div> */}
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.tax}</b></h5>
                                    </div>
                                    <div className="col-md-7 customSelect">
                                        <NumberFormat maxLength={21}
                                            //disabled={true} 
                                            className="form-control" id="txttax"
                                            //value={this.state.datagroup["p_feevalue"]+ this.state.datagroup["p_feevaluebonus"] - this.state.datagroup["p_feevaluereal"]} 
                                            value={this.state.datagroup["p_tax"]}
                                            onValueChange={this.onValueChange.bind(this, 'p_tax')} 
                                            prefix={''} placeholder={this.props.strings.tax} allowNegative={false} decimalScale={2} thousandSeparator={true} />

                                    </div>
                                </div>
                                {/* <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.feevalueleft}</b></h5>
                                    </div>
                                    <div className="col-md-7 customSelect">
                                        <NumberFormat maxLength={21} disabled={true} className="form-control" id="txtFeevalueleft"
                                            //value={this.state.datagroup["p_feevalue"]+ this.state.datagroup["p_feevaluebonus"] - this.state.datagroup["p_feevaluereal"]} 
                                            value={this.state.datagroup["p_feevalueleft"]}
                                            onValueChange={this.onValueChange.bind(this, 'p_feevalueleft')} prefix={''} placeholder={this.props.strings.feevalueleft} allowNegative={true} decimalScale={2} thousandSeparator={true} />

                                    </div>
                                </div> */}
                                
                                {/* <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.diengiai}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <input
                                            maxLength="500"
                                            //disabled={isDisableWhenView}
                                            value={this.state.datagroup["p_diengiai"]}
                                            onChange={this.onChange.bind(this, "p_diengiai")}
                                            id="txtdiengiai"
                                            className="form-control"
                                            type="text"
                                            placeholder={this.props.strings.diengiai}
                                        />
                                    </div>
                                </div> */}
                                
                                {/* <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 className="highlight"><b>{this.props.strings.percentsales}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <NumberFormat maxLength={21} disabled={true} className="form-control" id="txtPercentsales" value={this.state.datagroup["p_ratedensity"]} onValueChange={this.onValueChange.bind(this, 'p_ratedensity')} prefix={''} placeholder={this.props.strings.percentsales} allowNegative={false} decimalScale={2} thousandSeparator={true} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 className="highlight"><b>{this.props.strings.QuarterOrMonth}</b></h5>
                                    </div>
                                    <div className="col-md-7 customSelect">
                                        <select className="form-control"
                                            onChange={this.onchangeDropChuKy.bind(this)}
                                            value={this.state.datagroup.QuarterOrMonth}
                                            id="s_QuarterOrMonth">
                                            <option value="1">{this.props.strings.EveryQuarter}</option>
                                            <option value="2">{this.props.strings.EveryMonth}</option>

                                        </select>
                                    </div>
                                </div>

                                {this.state.datagroup.QuarterOrMonth == 1 ?
                                    <div>
                                        <div className="col-md-12 row">
                                            <div className="col-md-5">
                                                <h5 className="highlight"><b>{this.props.strings.Month}</b></h5>
                                            </div>
                                            <div className="col-md-7 customSelect">
                                                <select className="form-control"
                                                    onChange={this.onchangeMonth.bind(this)}
                                                    value={this.state.datagroup.Month}
                                                    id="s_Month">
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-12 row">
                                            <div className="col-md-5">
                                                <h5 className="highlight"><b>{this.props.strings.Day}</b></h5>
                                            </div>
                                            <div className="col-md-7 customSelect">
                                                <NumberFormat maxLength={2} disabled={displayView}
                                                    isAllowed={(values) => {
                                                        const { formattedValue, floatValue } = values;
                                                        return formattedValue === "" || (floatValue >= 1 && floatValue <= 31);
                                                    }}
                                                    decimalScale={0} allowNegative={false} className="form-control"
                                                    value={this.state.datagroup.Day ? this.state.datagroup.Day : ''}
                                                    id="txtthreshold" onValueChange={this.onValueChange.bind(this, 'Day')}
                                                    prefix={''} placeholder={this.props.strings.Dayplaceholder} />
                                            </div>
                                        </div>
                                    </div> :
                                    <div className="col-md-12 row">
                                        <div className="col-md-5">
                                            <h5 className="highlight"><b>{this.props.strings.Day}</b></h5>
                                        </div>
                                        <div className="col-md-7 customSelect">
                                            <NumberFormat maxLength={2} disabled={displayView}
                                                isAllowed={(values) => {
                                                    const { formattedValue, floatValue } = values;
                                                    return formattedValue === "" || (floatValue >= 1 && floatValue <= 31);
                                                }}
                                                decimalScale={0} allowNegative={false} className="form-control"
                                                value={this.state.datagroup.Day ? this.state.datagroup.Day : ''}
                                                id="txtthreshold" onValueChange={this.onValueChange.bind(this, 'Day')}
                                                prefix={''} placeholder={this.props.strings.Dayplaceholder} />
                                        </div>
                                    </div>} */}


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
                                </div> */}
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
    translate('ModalQLDoanhSo')
]);
module.exports = decorators(ModalQLDoanhSo);
