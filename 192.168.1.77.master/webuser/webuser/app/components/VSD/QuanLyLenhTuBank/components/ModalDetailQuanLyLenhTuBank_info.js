import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import DropdownFactory from '../../../../utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';
import NumberFormat from 'react-number-format';
import RestfulUtils from 'app/utils/RestfulUtils';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableBacThang from './TableBacThang';
import TableBacThangAlt from './TableBacThangAlt';
import ModalBacThang from './ModalBacThang';
import { showNotifi } from 'app/action/actionNotification.js';
import Select from 'react-select';

class ModalDetailQuanLyLenhTuBank_info extends Component {
    constructor(props) {
        super(props);
        this.state = {

            access: 'add',
            CUSTID: '',
            disabled: false,
            new_create: false,

            datachange: {},

            datagroup: {
                p_idtype: '',
                p_feeid: '',
                p_feetype: '001',
                p_exectype: 'NR',
                p_timetype: '1'
            },
            tierdata: '',
            showModalDetail: false,
            titleModal2: '',
            dataBT: [],
            dataOBJ: [],
            dataCodeid: [],
            dataUPDATE: '',
            isClear: true,
            loadgrid: false,
            allcode: '',
            checkFields: [
                { name: "p_vsdfeeid", id: "txtvsdfeeid" },
                { name: "p_feename", id: "txtFeename" },
                { name: "p_frdate", id: "txtFrdate" },
                { name: "p_todate", id: "txtTodate" },
                { name: "p_feerate", id: "txtPercentfee" },
                { name: "p_buyfromdate", id: "txtbuyFrdate" },
                { name: "p_buytodate", id: "txtbuyTodate" },
                { name: "p_fundcode", id: "drdFUNDCODE" }
            ],
        };
    }
    onChange(type, event) {
        console.log(type, event)
        if (type == 'p_fundcode') {
            //this.state.datagroup.p_object = {value : event.value ,label : event.label};
            this.state.datagroup.p_fundcode = event.value;
        }
        if (type == 'p_object') {
            //this.state.datagroup.p_object = {value : event.value ,label : event.label};
            this.state.datagroup.p_object = event.value;
        }
        if (event.target) {

            this.state.datagroup[type] = event.target.value;
        }
        else {
            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup })
    }
    onSetDefaultValue = (type, value) => {

        if (!this.state.datagroup[type]) {

            this.state.datagroup[type] = value
        }

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
        console.log('nextProps:::', nextProps)
        let self = this;
        this.getOptionsobjecttype('RETYPE');

        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()
                this.setState({

                    access: nextProps.access,
                    tierdata: nextProps.databacthangg,
                    datagroup: {
                        p_id: nextProps.DATA.ID,
                        p_feename: nextProps.DATA.FEENAME,
                        p_feetype: nextProps.DATA.FEETYPECD,
                        p_ruletype: nextProps.DATA.RULETYPECD,
                        p_feecalc: nextProps.DATA.FEECALCCD,
                        p_feeamt: nextProps.DATA.FEEAMT,
                        p_feerate: nextProps.DATA.FEERATE,
                        p_minamt: '',
                        p_maxamt: '',
                        p_frdate: nextProps.DATA.FRDATE,
                        p_todate: nextProps.DATA.TODATE,
                        p_status: nextProps.DATA.STATUSCD,
                        p_note: nextProps.DATA.NOTE,
                        p_ver: '',
                        p_vsdfeeid: nextProps.DATA.VSDFEEID,
                        p_exectype: nextProps.DATA.EXECTYPECODE,
                        p_srtype: nextProps.DATA.SRTYPECODE,
                        p_buyfromdate: nextProps.DATA.BUYFROMDATE,
                        p_buytodate: nextProps.DATA.BUYTODATE,
                        //p_object: nextProps.DATA.OBJECTCODE,
                        p_object: '',
                        p_fundcode: nextProps.DATA.FUNDCODECODE,
                        pv_objname: this.props.OBJNAME,
                        p_feetierdata: nextProps.databacthangg,
                        pv_language: this.props.lang,
                        p_timetype: nextProps.DATA.TIMETYPE
                    }
                })
            }
        }
        else
            if (nextProps.isClear) {
                this.props.change()
                this.setState({

                    access: nextProps.access,
                    tierdata: '',
                    new_create: true,
                    datagroup: {
                        p_id: '',
                        p_feename: '',
                        p_feetype: '001',
                        p_ruletype: '',
                        p_feecalc: '',
                        p_feeamt: '',
                        p_feerate: '',
                        p_minamt: '',
                        p_maxamt: '',
                        p_frdate: '',
                        p_todate: '',
                        p_status: '',
                        p_note: '',
                        p_ver: '',
                        p_feetierdata: '',
                        p_vsdfeeid: '',
                        p_exectype: 'NR',
                        p_srtype: '',
                        p_buyfromdate: '',
                        p_buytodate: '',
                        p_object: '',
                        p_fundcode: '',
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME,
                        p_timetype: '1'
                    },
                    dataBT: []
                })
            }
    }


    onValueChange(type, data) {

        this.state.datagroup[type] = data.value
        this.setState(this.state)
    }

    checkValid(name, id) {
        console.log
        let value = this.state.datagroup[name];
        let mssgerr = '';
        switch (name) {

            case "p_feename":
                if (value == '') {
                    mssgerr = this.props.strings.requiredfeename;
                }
                break;
            case "p_vsdfeeid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredvsdfeeid;
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
            case "p_buyfromdate":
                if (value == '' && this.state.datagroup.p_feetype == '001' && ((this.state.datagroup.p_exectype == 'NR' && this.state.datagroup.p_srtype != 'SP') || this.state.datagroup.p_exectype == 'SW')) {
                    mssgerr = this.props.strings.requiredbuyfrdate;
                }
                break;
            case "p_buytodate":
                if (value == '' && this.state.datagroup.p_feetype == '001' && ((this.state.datagroup.p_exectype == 'NR' && this.state.datagroup.p_srtype != 'SP') || this.state.datagroup.p_exectype == 'SW')) {
                    mssgerr = this.props.strings.requiredbuytodate;
                }
                break;
            case "p_feerate":
                if (this.state.datagroup.p_ruletype != "T") {
                    if (this.state.datagroup.p_feecalc == 1) {
                        if (value == '') {
                            mssgerr = this.props.strings.requiredfeerate;
                        } else {

                            if (value < 0 || value > 100) mssgerr = this.props.strings.requiredpercent;
                        }
                    }

                    break;
                }

            case "p_feeamt":
                if (this.state.datagroup.p_ruletype != "T") {
                    if (this.state.datagroup.p_feecalc == 0) {
                        if (value == '') {
                            mssgerr = this.props.strings.requiredfeeamt;
                        } else {

                            if (value < 0) mssgerr = this.props.strings.requiredfixedfee;

                        }
                    }

                    break;
                }
            case "p_fundcode":
                if (this.state.datagroup.p_feetype == "001" && this.state.datagroup.p_fundcode == '') {
                    mssgerr = this.props.strings.requiredfundcode;
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
        let str = ""
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            var api = '/fund/addFeetype';
            if (this.state.access == "update") {
                api = '/fund/updateFeetype';
            }
            this.state.dataBT.map(function (node, index) {
                str += node.fromvalue + "~#~" + node.tovalue + "~#~" + node.fee + "~$~"
            })
            this.state.datagroup["p_feetierdata"] = str.slice(0, str.length - 3)


            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }

            if (this.state.datagroup["p_feecalc"] != "0") this.state.datagroup["p_feeamt"] = ""
            else this.state.datagroup["p_feerate"] = ""
            if (this.state.datagroup["p_ruletype"] != "T") {
                this.state.datagroup["p_feetierdata"] = ""

            } else {
                this.state.datagroup["p_feeamt"] = ""
                this.state.datagroup["p_feerate"] = ""
            }

            this.setState({
                datagroup: this.state.datagroup
            })


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
    onChangeDate(type, event) {

        this.state.datagroup[type] = event.value;
        this.setState({ datagroup: this.state.datagroup })

    }
    showModalDetail(action, dataUPDATE) {

        let titleModal = ""
        switch (action) {
            case "add": titleModal = this.props.strings.modal2add; break
            case "update": titleModal = this.props.strings.modal2edit; break;
            case "view": titleModal = "Xem chi tiết"; break
        }
        this.setState({
            showModalDetail: true, titleModal2: titleModal, dataUPDATE: dataUPDATE, accessBT: action
        })
    }
    closeModalDetail() {

        this.setState({ showModalDetail: false, isClear: true, loadgrid: false })
    }
    addBacThang(data, access) {

        if (access == 'add') {

            var id = 0
            let index = this.state.dataBT[this.state.dataBT.length - 1]
            if (index == undefined) id = 0
            else id = index.id + 1



            if (this.state.dataBT.length == 0) this.state.datagroup.p_feetierdata = data.fromvalue + "~#~" + data.tovalue + "~#~" + data.fee
            else this.state.datagroup.p_feetierdata = this.state.datagroup.p_feetierdata + '~$~' + data.fromvalue + "~#~" + data.tovalue + "~#~" + data.fee
            this.state.dataBT.push({ id: id, fromvalue: data.fromvalue, tovalue: data.tovalue, fee: data.fee })

            this.setState({
                dataBT: this.state.dataBT.sort((a, b) => parseFloat(a.fromvalue) - parseFloat(b.fromvalue)),
                datagroup: this.state.datagroup
            })

            this.closeModalDetail()
        } else {
            console.log('this.state.dataBT:', this.state.dataBT)
            let result = this.state.dataBT.filter(node => node.id != data.id);

            this.state.dataBT = result

            this.state.dataBT.push({ id: data.id, fromvalue: data.fromvalue, tovalue: data.tovalue, fee: data.fee })
            this.setState({
                dataBT: this.state.dataBT.sort((a, b) => parseFloat(a.fromvalue) - parseFloat(b.fromvalue))
            })

            this.closeModalDetail()
        }
    }
    loadagain(data) {

        this.setState({
            dataBT: data
        })
    }

    change() {

        this.setState({ isClear: false })
    }
    load() {
        this.setState({ loadgrid: true })
    }
    onChangeDRD(type, event) {
        let tier = this.state.tierdata;
        let allcode = ''
        console.log('tier data on change:', tier)
        let data = {};
        console.log('change drop :', type, event)
        if (event.target) {
            console.log('event.target:', event.target)
            this.state.datagroup[type] = event.target.value;
        }
        else {

            if (type == 'p_ruletype' && event.value == 'F') {
                this.state.datagroup.p_feetierdata = '';
            }
            if (type == 'p_ruletype' && event.value == 'T') {
                this.state.datagroup.p_feetierdata = tier;
            }
            if (type == 'p_feecalc') {
                this.state["dataBT"] = []
            }
            if (type == 'p_exectype') {
                this.state.datagroup.p_buytodate = '01/01/0001'
                this.state.datagroup.p_buyfromdate = '01/01/0001'
                if (event.value == 'NR') {
                    allcode = 'SASRTYPE'
                }
                else {
                    allcode = 'SASRTYPE2'
                }
            }
            if (type == 'p_feetype') {
                if(event.value == '003'){
                    this.state.datagroup.p_srtype ='ALL';
                }
                
            }

            
            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup, dataBT: [], allcode: allcode })
    }
    async getOptionsobjecttype(input) {

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
    getOptionscodeid(input) {
        return RestfulUtils.post('/allcode/search_all_funds_with_all', { key: input })
            .then((res) => {

                return { options: res }
            })
    }

    // data1() {
    //     return (
    //         <div className="col-md-6">
    //             <div className="col-md-4">
    //                 <h5 className="highlight"><b>{this.props.strings.ordertype}</b></h5>
    //             </div>
    //             <div className="col-md-8 ">
    //                 <DropdownFactory disabled={displaydisablednew} CDVAL={this.state.datagroup["p_srtype"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChangeDRD.bind(this)} value="p_srtype" CDTYPE="SA" CDNAME="SASRTYPE2" ID="drd_p_srtype" />

    //             </div>

    //         </div>
    //     )
    // }
    // data2() {
    //     return (
    //         <div className="col-md-6">
    //             <div className="col-md-4">
    //                 <h5 className="highlight"><b>{this.props.strings.ordertype}</b></h5>
    //             </div>
    //             <div className="col-md-8 ">
    //                 <DropdownFactory disabled={displaydisablednew} CDVAL={this.state.datagroup["p_srtype"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChangeDRD.bind(this)} value="p_srtype" CDTYPE="SA" CDNAME="SASRTYPE" ID="drd_p_srtype" />

    //             </div>

    //         </div>
    //     )
    // }

    render() {
        console.log('this.state.datagroup.p_ruletype:', this.state.datagroup.p_ruletype)
        console.log('this.state.datagroup.p_feetype:', this.state.datagroup.p_feetype)
        console.log('this.state.datagroup.p_exectype:', this.state.datagroup.p_exectype)
        let displayy = this.state.datagroup.p_ruletype == "T" ? "none" : "block"
        let displaydisablednew = this.state.access == 'view' || this.state.access == 'update' ? true : false
        let displaydisabled = this.state.access == 'view' ? true : false
        let allcode = this.state.allcode;
        const pageSize = 5;
        let displayyID = this.state.access == "add" ? "none" : "block"
        let valuee = this.state.datagroup["p_feerate"] ? parseFloat(this.state.datagroup["p_feerate"]) : 0

        
        console.log('allcode:::', allcode)
        return (
            <Modal dialogClassName="your-dialog-classname" show={this.props.showModalDetail} backdropClassName="firstModal" size="lg" width="80%">
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">

                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row ">
                                    {/* <div className="col-md-6 disable" style={{ display: displayyID }}>
                                        <div className="col-md-4">
                                            <h5 className="highlight"><b>{this.props.strings.feeid}</b></h5>
                                        </div>
                                        <div className="col-md-8">
                                            <input disabled={displaydisabled} className="form-control" type="text" id="txtFeeid" value={this.state.datagroup["p_id"]} />
                                        </div>
                                    </div> */}
                                    <div className="col-md-6  ">
                                        <div className="col-md-4 ">
                                            <h5 className="highlight"><b>{this.props.strings.vsdfeeid}</b></h5>
                                        </div>
                                        <div className="col-md-8">
                                            <input disabled={displaydisablednew} className="form-control" type="text" placeholder={this.props.strings.vsdfeeid} id="txtvsdfeeid" value={this.state.datagroup["p_vsdfeeid"]} onChange={this.onChange.bind(this, "p_vsdfeeid")} maxLength={10} />
                                        </div>
                                    </div>
                                    <div className="col-md-6  ">
                                        <div className="col-md-4 ">
                                            <h5 className="highlight"><b>{this.props.strings.feename}</b></h5>
                                        </div>
                                        <div className="col-md-8">
                                            <input className="form-control" type="text" placeholder={this.props.strings.feename} id="txtFeename" value={this.state.datagroup["p_feename"]} onChange={this.onChange.bind(this, "p_feename")} maxLength={200} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-6">
                                        <div className="col-md-4">
                                            <h5 className="highlight"><b>{this.props.strings.feetype}</b></h5>
                                        </div>
                                        <div className="col-md-8 ">
                                            <DropdownFactory disabled={displaydisablednew} CDVAL={this.state.datagroup["p_feetype"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChangeDRD.bind(this)} value="p_feetype" CDTYPE="SY" CDNAME="FEETYPE" ID="drdFeetype" />

                                        </div>

                                    </div>
                                    {this.state.datagroup.p_feetype == '001' ?
                                        <div className="col-md-6">
                                            <div className="col-md-4">
                                                <h5 className="highlight"><b>{this.props.strings.codeid}</b></h5>
                                            </div>
                                            <div className="col-md-8 ">

                                                <Select.Async
                                                    name="form-field-name"
                                                    disabled={displaydisablednew}
                                                    //placeholder={this.props.strings.inputccq}
                                                    loadOptions={this.getOptionscodeid.bind(this)}
                                                    //options={this.state.dataCodeid}
                                                    value={this.state.datagroup.p_fundcode}
                                                    //value={this.state.CODEID}
                                                    onChange={this.onChange.bind(this, "p_fundcode")}
                                                    id="drdFUNDCODE"
                                                    clearable={false}
                                                    backspaceRemoves={false}
                                                />

                                            </div>

                                        </div>
                                        : null}
                                    {/* {this.state.datagroup.p_feetype == '003' ?
                                        <div className="col-md-6">
                                            <div className="col-md-4">
                                                <h5 className="highlight"><b>{this.props.strings.brokeragetype}</b></h5>
                                            </div>
                                            <div className="col-md-8 ">
                                                <Select
                                                    name="form-field-name"
                                                    options={this.state.dataOBJ}
                                                    value={this.state.datagroup.p_object}
                                                    //onChange={this.onChangeobject.bind(this)}
                                                    onChange={this.onChange.bind(this, "p_object")}
                                                    id="txtObject"
                                                    //disabled={this.state.objecttype.value == 'ALL' ? true : false}
                                                    //searchable={false}
                                                    clearable={false}
                                                    backspaceRemoves={false}

                                                />
                                            </div>

                                        </div>
                                        :
                                        null
                                    } */}
                                </div>

                                <div className="col-md-12 row">

                                    {this.state.datagroup.p_feetype == '001' ?
                                        <div className="col-md-6">
                                            <div className="col-md-4">
                                                <h5 className="highlight"><b>{this.props.strings.exectype}</b></h5>
                                            </div>
                                            <div className="col-md-8 ">
                                                <DropdownFactory disabled={displaydisablednew} CDVAL={this.state.datagroup["p_exectype"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChangeDRD.bind(this)} value="p_exectype" CDTYPE="SA" CDNAME="FOSRTYPESIP" ID="drdFoSrtype" />

                                            </div>

                                        </div>
                                        :
                                        null
                                    }
                                    
                                    {this.state.datagroup.p_feetype != '002' &&this.state.datagroup.p_feetype != '003' && this.state.datagroup.p_exectype == 'NR' &&
                                        <div className="col-md-6">
                                            <div className="col-md-4">
                                                <h5 className="highlight"><b>{this.props.strings.ordertype}</b></h5>
                                            </div>
                                            <div className="col-md-8 ">
                                                <DropdownFactory disabled={displaydisablednew} CDVAL={this.state.datagroup["p_srtype"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChangeDRD.bind(this)} value="p_srtype" CDTYPE="SA" CDNAME= "SASRTYPE" ID="drd_p_srtype" />

                                            </div>

                                        </div>
                                        
                                    }  
                                    {this.state.datagroup.p_feetype != '002' && this.state.datagroup.p_feetype != '003' && this.state.datagroup.p_exectype != 'NR' &&
                                        <div className="col-md-6">
                                            <div className="col-md-4">
                                                <h5 className="highlight"><b>{this.props.strings.ordertype}</b></h5>
                                            </div>
                                            <div className="col-md-8 ">
                                                <DropdownFactory disabled={displaydisablednew} CDVAL={this.state.datagroup["p_srtype"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChangeDRD.bind(this)} value="p_srtype" CDTYPE="SA" CDNAME= "SASRTYPE2" ID="drd_p_srtype" />

                                            </div>

                                        </div>
                                        
                                    }
                                    {this.state.datagroup.p_feetype == '003' &&
                                        <div className="col-md-6">
                                            <div className="col-md-4">
                                                <h5 className="highlight"><b>{this.props.strings.ordertype}</b></h5>
                                            </div>
                                            <div className="col-md-8 ">
                                                <input className="form-control" disabled= "true" type="text" placeholder={this.props.strings.feename} id="txtFeename" value={this.state.datagroup["p_srtype"]}  maxLength={200} />
                                                {/* <DropdownFactory disabled= "true" CDVAL={this.state.datagroup["p_srtype"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChangeDRD.bind(this)} value="p_srtype" CDTYPE="SA" CDNAME= "SASRTYPE2" ID="drd_p_srtype" /> */}

                                            </div>

                                        </div>
                                        
                                    }  
                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-6">
                                        <div className="col-md-4">
                                            <h5 className="highlight"><b>{this.props.strings.fromdate}</b></h5>
                                        </div>
                                        <div className="col-md-8 fixWidthDatePickerForOthers">
                                            <DateInput disabled={displaydisabled} onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["p_frdate"]} type="p_frdate" id="txtFrdate" />
                                        </div>

                                    </div>
                                    <div className="col-md-6">
                                        <div className="col-md-4">
                                            <h5 className="highlight"><b>{this.props.strings.todate}</b></h5>
                                        </div>
                                        <div className="col-md-8 fixWidthDatePickerForOthers">
                                            <DateInput disabled={displaydisabled} onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["p_todate"]} type="p_todate" id="txtTodate" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    {this.state.datagroup.p_feetype == '001' && ((this.state.datagroup.p_exectype == 'NR' && this.state.datagroup.p_srtype != 'SP' )|| this.state.datagroup.p_exectype == 'SW') ?
                                    // {this.state.datagroup.p_feetype == '001' && (this.state.datagroup.p_exectype == 'NR' || this.state.datagroup.p_exectype == 'SW') ?
                                        <div className="col-md-6">
                                            <div className="col-md-4">
                                                <h5 className="highlight"><b>{this.props.strings.buyfromdate}</b></h5>
                                            </div>
                                            <div className="col-md-8 fixWidthDatePickerForOthers">
                                                <DateInput disabled={displaydisabled} onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["p_buyfromdate"]} type="p_buyfromdate" id="txtbuyFrdate" />
                                            </div>

                                        </div> :
                                        null}
                                        {this.state.datagroup.p_feetype == '001' && ((this.state.datagroup.p_exectype == 'NR' && this.state.datagroup.p_srtype != 'SP' )|| this.state.datagroup.p_exectype == 'SW') ?
                                    // {this.state.datagroup.p_feetype == '001' && (this.state.datagroup.p_exectype == 'NR' || this.state.datagroup.p_exectype == 'SW') ?
                                        <div className="col-md-6">
                                            <div className="col-md-4">
                                                <h5 className="highlight"><b>{this.props.strings.buytodate}</b></h5>
                                            </div>
                                            <div className="col-md-8 fixWidthDatePickerForOthers">
                                                <DateInput disabled={displaydisabled} onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["p_buytodate"]} type="p_buytodate" id="txtbuyTodate" />
                                            </div>
                                        </div> : null}
                                </div>
                                <div className="col-md-12 row">

                                    {this.state.datagroup.p_exectype == 'NR' && this.state.datagroup.p_srtype == 'SP' ? 
                                    <div className="col-md-6">
                                        <div className="col-md-4">
                                            <h5 className="highlight"><b>{this.props.strings.feestyle}</b></h5>
                                        </div>
                                        <div className="col-md-8 ">
                                            <DropdownFactory disabled={displaydisabled} CDVAL={this.state.datagroup["p_ruletype"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChangeDRD.bind(this)} value="p_ruletype" CDTYPE="SA" CDNAME="RULETYPE2" ID="drdFeestyle" />

                                        </div>
                                    </div>:null }
                                    {this.state.datagroup.p_exectype != 'NR' || this.state.datagroup.p_srtype != 'SP' ? 
                                    <div className="col-md-6">
                                        <div className="col-md-4">
                                            <h5 className="highlight"><b>{this.props.strings.feestyle}</b></h5>
                                        </div>
                                        <div className="col-md-8 ">
                                            <DropdownFactory disabled={displaydisabled} CDVAL={this.state.datagroup["p_ruletype"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChangeDRD.bind(this)} value="p_ruletype" CDTYPE="SA" CDNAME="RULETYPE" ID="drdFeestyle" />

                                        </div>
                                    </div>:null }

                                    <div className="col-md-6">
                                        <div className="col-md-4">
                                            <h5 className="highlight"><b>{this.props.strings.feecalculated}</b></h5>
                                        </div>
                                        <div className="col-md-8 " >
                                            <DropdownFactory disabled={true} CDVAL={this.state.datagroup["p_feecalc"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChangeDRD.bind(this)} value="p_feecalc" CDTYPE="SA" CDNAME="FEECALC" ID="drdFeecalculated" />
                                        </div>

                                    </div>
                                </div>
                                {this.state.datagroup.p_ruletype == 'T' && (this.state.datagroup.p_feetype == '001') && this.state.datagroup.p_exectype != 'NS' ?
                                    <div className="col-md-12 row">
                                        <div className="col-md-6">
                                            <div className="col-md-4">
                                                <h5 className=""><b>{this.props.strings.timetype}</b></h5>
                                            </div>
                                            <div className="col-md-8 " >
                                                <DropdownFactory CDVAL={this.state.datagroup["p_timetype"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChangeDRD.bind(this)} value="p_timetype" CDTYPE="CF" CDNAME="TIMETYPE" ID="drdtimetype" />
                                            </div>

                                        </div>
                                    </div> : null}
                                <div className="col-md-12 row">
                                    <div className="col-md-6" style={{ display: displayy }}>
                                        <div className="col-md-4">
                                            {this.state.datagroup.p_feecalc == "1" ?
                                                <h5 className="highlight"><b>{this.props.strings.percentfee}</b></h5> :
                                                <h5 className="highlight"><b>{this.props.strings.fixedfee}</b></h5>

                                            }


                                        </div>
                                        <div className="col-md-8">
                                            {this.state.datagroup.p_feecalc == "1" ?
                                                <NumberFormat maxLength={6} disabled={displaydisabled} decimalScale={2} className="form-control" id="txtPercentfee" onValueChange={this.onValueChange.bind(this, 'p_feerate')} prefix={''} placeholder={this.props.strings.percentfee} value={this.state.datagroup["p_feerate"]} allowNegative={false} /> :
                                                <NumberFormat maxLength={21} disabled={displaydisabled} className="form-control" id="txtFixedfee" onValueChange={this.onValueChange.bind(this, 'p_feeamt')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.fixedfee} value={parseFloat(this.state.datagroup["p_feeamt"] ? this.state.datagroup["p_feeamt"] : 0)} decimalScale={0} allowNegative={false} />
                                            }
                                        </div>
                                    </div>


                                    <div className="col-md-6">
                                        <div className="col-md-4">
                                            <h5><b>{this.props.strings.desc}</b></h5>
                                        </div>
                                        <div className="col-md-8">
                                            <input disabled={displaydisabled} className="form-control" type="text" placeholder={this.props.strings.desc} id="txtdesc" value={this.state.datagroup["p_note"]} onChange={this.onChange.bind(this, "p_note")} maxLength={100} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* {this.state.datagroup.p_ruletype == 'T' && this.state.datagroup.p_feetype == '001' && this.state.datagroup.p_exectype == 'NR' ?
                                <TableBacThangAlt showModalDetail={this.showModalDetail.bind(this)}
                                    dataEDIT={this.state.datagroup.p_feetierdata}
                                    dataBT={this.state.dataBT}
                                    loadagain={this.loadagain.bind(this)}
                                    access={this.state.access}
                                    isPercent={this.state.datagroup.p_feecalc}
                                /> :
                                null
                            } */}
                            {this.state.datagroup.p_ruletype == 'T' ?
                                <TableBacThang showModalDetail={this.showModalDetail.bind(this)}
                                    dataEDIT={this.state.datagroup.p_feetierdata}
                                    dataBT={this.state.dataBT}
                                    loadagain={this.loadagain.bind(this)}
                                    access={this.state.access}
                                    isPercent={this.state.datagroup.p_feecalc}
                                /> :
                                null
                            }
                            <ModalBacThang
                                load={this.load.bind(this)}
                                isClear={this.state.isClear}
                                change={this.change.bind(this)}
                                showModalDetail={this.state.showModalDetail}
                                title={this.state.titleModal2}
                                closeModalDetail={this.closeModalDetail.bind(this)}
                                addBacThang={this.addBacThang.bind(this)}
                                isPercent={this.state.datagroup.p_feecalc}
                                dataUPDATE={this.state.dataUPDATE}
                                access={this.state.accessBT}
                                dataBT={this.state.dataBT}
                            />
                            <div className="col-md-12 row">
                                <div className="col-md-12">
                                    <div className="pull-right">

                                        <input disabled={displaydisabled} type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 10 }} value={this.props.strings.submit} id="btnSubmit" />
                                    </div>
                                </div>
                            </div>
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
    translate('ModalDetailQuanLyLenhTuMBB_info')
]);
module.exports = decorators(ModalDetailQuanLyLenhTuBank_info);
