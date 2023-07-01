import React, { Component } from 'react';
import { Modal  } from 'react-bootstrap'
import { connect } from 'react-redux'
import DropdownFactory from 'app/utils/DropdownFactory';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils'
import { showNotifi } from 'app/action/actionNotification.js';
import { getExtensionByLang } from 'app/Helpers'

class ModalDetailPhanLoaiKH_info extends Component {
    constructor(props) {
        super(props);
        this.state = {

            access: 'add',
            datagroup: {
                p_custodycd: '',
                p_fullname: '',
                p_idcode: '',
                p_iddate: '',
                p_idplace: '',
                p_classcd: '',
                p_des: '',
                pv_language: this.props.lang,
            },
            data: {
                custodycd: '',
                fullname: '',
                idcode: '',
                iddate: '',
                idplace: '',
                oldcustclass: '',
                transactionfee: '',
            },
            CODEID: { value: '', label: '' },
            checkFields: [
                { name: "p_classcd", id: "txtNewcustclass" },

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
    componentWillReceiveProps(nextProps) {
        let self = this;

     
        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()
                this.setState({
                    display: {
                        fatca: true,
                        authorize: true,
                        upload: true,
                        quydangki: true
                    },
                    datagroup: {
                        p_custodycd: nextProps.DATA.CUSTODYCD,
                        p_fullname: nextProps.DATA.FULLNAME,
                        p_idcode: nextProps.DATA.IDCODE,
                        p_iddate: nextProps.DATA.IDDATE,
                        p_idplace: nextProps.DATA.IDPLACE,
                        p_refid: nextProps.DATA.REFID?nextProps.DATA.REFID:'',
                        p_applycd: 'A',
                        p_classcd_old: '',
                        p_classcd: nextProps.DATA.NEW_CLASSCD,
                        p_fee: 0,
                        p_desc: this.props.strings.titledes,
                        p_language: this.props.lang,
                        pv_objname: this.props.OBJNAME,

                    },
                    data: {
                        custodycd: nextProps.DATA.CUSTODYCD,
                        fullname: nextProps.DATA.FULLNAME,
                        idcode: nextProps.DATA.IDCODE,
                        iddate: nextProps.DATA.IDDATE,
                        idplace: nextProps.DATA.IDPLACE,
                        oldcustclassid: nextProps.DATA.CLASSCD,
                        oldcustclassSipid: nextProps.DATA.CLASSSIPCD,
                        oldcustclass: nextProps.DATA[ getExtensionByLang("CLASSSIP_DESC",this.props.lang)],
                        transactionfee: nextProps.DATA.FEE_AMT,
                        transactionfeeSip: nextProps.DATA.FEE_AMT_SIP,
                    },
                    CLASSSIP_DESC:nextProps.DATA[getExtensionByLang("CLASSSIP_DESC",this.props.lang)],
                    CLASS_DESC:nextProps.DATA.CLASS_DESC,
                    access: nextProps.access

                })
            }
        }
        else
            this.setState({
                display: {
                    fatca: false,
                    authorize: false,
                    upload: false,
                    quydangki: false,

                },
                new_create: true
            })
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
    getOptionsSYMBOL(input) {

        let data = {
            p_custodycd: this.state.datagroup.p_custodycd,
            p_language: this.props.lang,
        }

        return RestfulUtils.post('/fund/getlistclasscd', { data })
            .then((res) => {

                return { options: res }
            })
    }
    onChangeSYMBOL(e) {

        var that = this
        if (e && e.value)
            // this.getSessionInfo(e.value);

            this.state.datagroup["p_classcd"] = e.value
        this.setState({
            CODEID: e,
            datagroup: this.state.datagroup
        })


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
            var api = '/fund/changecfmastclass';


            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            if (this.state.datagroup["p_classcd_old"] == this.state.datagroup["p_classcd"]) {
                datanotify.type = "error";
                datanotify.content = this.props.strings.errtypecus;
                dispatch(showNotifi(datanotify));
            } else {


               // console.log(this.state.datagroup)
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
    }
    checkValid(name, id) {
        let value = this.state.datagroup[name];

        let mssgerr = '';
        switch (name) {

            case "p_classcd":
                if (value == '') {
                    mssgerr = this.props.strings.requiredclasscd;
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
    onChangeDRD(type, event) {
        let data = {};
        if (event.target) {

            this.state.datagroup[type] = event.target.value;
        }
        else {
            if(type=='p_applycd'){
                if(event.value=='S'){
                    this.state.datagroup[type] = event.value;
                    this.state.datagroup['p_classcd_old'] = this.state.data["oldcustclassSipid"];
                    this.state.data['oldcustclass'] = this.state["CLASSSIP_DESC"];
                    this.state.datagroup['p_fee'] = this.state.data["transactionfeeSip"];
           
                }else{
                    this.state.datagroup[type] = event.value;
                    this.state.datagroup['p_classcd_old'] = this.state.data["oldcustclassid"];
                    this.state.data['oldcustclass'] = this.state["CLASS_DESC"];
                    this.state.datagroup['p_fee'] = this.state.data["transactionfee"];
                }
            }else 
            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup })
    }

    onSetDefaultValue = (type, value) => {
        if (!this.state.datagroup[type])
        {
            this.state.datagroup[type] = value
            if(type=='p_applycd'){
               /*
                if(value=='S'){
                    this.state.datagroup['p_classcd_old'] = this.state.data["oldcustclassSipid"];
                    this.state.data['oldcustclass'] = this.state["CLASSSIP_DESC"];
                    this.state.datagroup['p_fee'] = this.state.data["transactionfeeSip"];
           
                }else{
                    this.state.datagroup['p_classcd_old'] = this.state.data["oldcustclassid"];
                    this.state.data['oldcustclass'] = this.state["CLASS_DESC"];
                    this.state.datagroup['p_fee'] = this.state.data["transactionfee"];
                }
               
                this.setState({datagroup:this.state.datagroup})
                 */
            }
        }
           
    }
    render() {
        let displayy=this.state.access=='view'?true:false
        let array = ['001', '002', '003', '004']
      
        return (
            <Modal show={this.props.showModalDetail} bsSize="lg">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12"} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.custodycd}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="txtCustodycd">{this.state.data["custodycd"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.fullname}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <label className="form-control" id="txtFullname">{this.state.data["fullname"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.idcode}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="txtIdcode">{this.state.data["idcode"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.iddate}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="txtIddate">{this.state.data["iddate"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.idplace}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <label className="form-control" id="txtIdplace">{this.state.data["idplace"]}</label>

                                    </div>
                                </div>
                                {/*
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.apply}</b></h5>
                                    </div>
                                    <div className="col-md-3 customSelect">

                                        <DropdownFactory  CDVAL={this.state.datagroup.p_applycd} onSetDefaultValue={this.onSetDefaultValue} value="p_applycd" CDTYPE="SE" CDNAME="NORS" onChange={this.onChangeDRD.bind(this)} ID="drdClasstype" />
                                    </div>
                                </div>
                                */}
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.oldcustclass}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="txtoldcustclass">{this.state.data["oldcustclass"]}</label>
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.newcustclass}</b></h5>
                                    </div>
                                    <div className="col-md-3 customSelect">
                                        {/*
                                        <Select.Async
                                            name="form-field-name"
                                            loadOptions={this.getOptionsSYMBOL.bind(this)}
                                            value={this.state.CODEID}
                                            onChange={this.onChangeSYMBOL.bind(this)}
                                            id="txtNewcustclass"
                                            searchable={false}
                                        />
                                    */}
                                        <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup.p_classcd} onSetDefaultValue={this.onSetDefaultValue} value="p_classcd" CDTYPE="CF" CDNAME="CLASSNEW" onChange={this.onChangeDRD.bind(this)} ID="drdNewcustclass"  />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.transactionfee}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="txttransactionfee">{this.state.datagroup['p_fee']}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.desc}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input maxLength={1000} disabled={displayy} value={this.state.datagroup["p_desc"]} onChange={this.onChange.bind(this, "p_desc")} className="form-control" type="text" id="txtdesc" />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        <input disabled={displayy} type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 16 }} value={this.props.strings.submit} id="btnSubmit" />

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
    translate('ModalDetailPhanLoaiKH_info')
]);
module.exports = decorators(ModalDetailPhanLoaiKH_info);
