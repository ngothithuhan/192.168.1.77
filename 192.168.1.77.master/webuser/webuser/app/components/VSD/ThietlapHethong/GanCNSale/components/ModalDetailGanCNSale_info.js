import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import Select from 'react-select';
import RestfulUtils from 'app/utils/RestfulUtils'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { showNotifi } from 'app/action/actionNotification.js';
import NumberInput from 'app/utils/input/NumberInput';
import { getExtensionByLang } from 'app/Helpers'

class ModalDetailGanCNSale_info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newbrokerageid: { value: '', label: '', text: '' },
            access: 'add',
            CUSTID: '',
            disabled: false,
            new_create: false,
            AMOUNT: { value: 0, validate: null, tooltip: "Không được để trống !!" },
            AccHold: { value: 0, validate: null, tooltip: "Không được để trống !!" },

            type: { value: '', label: '' },
            datachange: {},
            datagroup: {
                p_custodycd: '',
                p_orderid: '',
                p_saleid: '',
                p_saleacctno: '',
                p_retype: '',
                p_language: this.props.lang,
                pv_objname: this.props.OBJNAME,
            },
            checkFields: [

                { name: "p_saleid", id: "txtnewbrokerageid" },
                { name: "p_retype", id: "txttype" },

            ],
            TYPE: []
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
            // console.log(nextProps.DATA)
            if (nextProps.isClear) {
                this.props.change()
                this.setState({
                    datagroup: {
                        p_custodycd: nextProps.DATA.CUSTODYCD,
                        p_orderid: nextProps.DATA.ORDERID,
                        p_saleid: '',
                        p_saleacctno: '',
                        p_retype: '',
                        p_language: this.props.lang,
                        pv_objname: this.props.OBJNAME,


                    },
                    REPRODUCT: nextProps.DATA.REPRODUCT,
                    SRTYPEDESC: nextProps.DATA[getExtensionByLang("SRTYPEDESC",this.props.lang)],
                    txdate: nextProps.DATA.TXDATE,
                    fullname: nextProps.DATA.FULLNAME,
                    orderamt: nextProps.DATA.ORDERAMT,
                    feeamt: nextProps.DATA.FEEAMT,
                    taxamt: nextProps.DATA.TAXAMT,
                    feeid: nextProps.DATA.FEEID,
                    saleid: nextProps.DATA.SALEID,
                    tlfullname: nextProps.DATA.TLFULLNAME,
                    tlsalefullname: nextProps.DATA.SALEID != '' ? nextProps.DATA.TLNAME : '',
                    FEEMANAGE: nextProps.DATA.FEEMANAGE,
                    access: nextProps.access,
                    type: null,
                    role: '',
                    roduct: '',
                    newbrokerageid: null,
                    TYPE: [],
                    oldbrokeragetype: nextProps.DATA.TYPENAME,
                    oldbrokeragetypeid: nextProps.DATA.RETYPE,
                    oldrole: nextProps.DATA[getExtensionByLang("REROLEDESC",this.props.lang)],
                    oldproduct: nextProps.DATA[getExtensionByLang("REPRODUCTDESC",this.props.lang)],
                })
            }
        }

    }


    onValueChange(type, data) {

        this.state[type].value = data.value
        this.setState(this.state)
    }
    onChange(type, event) {
        this.state.datachange[type] = event.value;
        this.setState({ datachange: this.state.datachange })
    }

    onChangecb(e) {
        // console.log(e)
        if (e === null) {
            this.state.datagroup["p_saleid"] = ''
            this.state.datagroup["p_retype"] = ''
            e = { value: '', label: '', text: '' }
            this.setState({
                newbrokerageid: e,
                datagroup: this.state.datagroup,
                TYPE: []
            })
        }
        else {
            if (this.state.datagroup["p_saleid"] != e.value) {
                this.state.datagroup["p_saleid"] = e.value
                this.getOptionstype(e.value)
                this.setState({
                    newbrokerageid: e,
                    datagroup: this.state.datagroup,
                    type: null
                })
            }
        }
    }
    onChangecbtype(e) {

        if (e === null) {
            e = { value: '', label: '' }
            this.state.datagroup["p_retype"] = ''
            //  this.state.datagroup["p_saleacctno"]=e.saleacctno
            this.setState({
                type: e,

                datagroup: this.state.datagroup
            })
        }
        else {
            this.state.datagroup["p_retype"] = e.value
            //  this.state.datagroup["p_saleacctno"]=e.saleacctno
            this.setState({
                type: e,
                role: e.role,
                product: e.product,
                datagroup: this.state.datagroup
            })
        }

    }
    getOptions(input) {
        return RestfulUtils.post('/fund/getlistsaleintlprofiles', { p_retype: 'D', p_rerole: 'ALL', p_reproduct: this.state.REPRODUCT, p_language: this.props.lang })
            .then((res) => {

                return { options: res }
            })
    }
    getOptionstype(input) {
        return RestfulUtils.post('/fund/getlistretype_by_saleid', { p_saleid: input,p_reproduct: this.state.REPRODUCT, p_retype: 'D', p_rerole: 'ALL', p_language: this.props.lang, p_rerole: 'ALL' })
            .then((res) => {

                //  return { options: res.data }
                this.setState({
                    TYPE: res
                })
            })
    }
    checkValid(name, id) {
        let value = this.state.datagroup[name];
        let mssgerr = '';
        switch (name) {

            case "p_saleid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredsaleid;
                }
                break;
            case "p_retype":
                if (value == '') {
                    mssgerr = this.props.strings.requiredretype;
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
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            if (this.state["saleid"] == this.state.datagroup["p_saleid"] && this.state["oldbrokeragetypeid"] == this.state.datagroup["p_retype"]) {
                datanotify.type = "error";
                datanotify.content = this.props.strings.error;
                dispatch(showNotifi(datanotify));
            } else {
                var api = '/fund/prc_sale_ordersmap';

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
    render() {
        //const pageSize = 5;
        var isDisplay = this.state.access == 'view' ? true : false
        return (
            <Modal show={this.props.showModalDetail} >
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ 
                    //overflow: "auto", 
                    height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account" style={{ padding: '5px 12px' }}>
                            <div className={this.state.access == 'view' ? "col-md-12 disable" : "col-md-12"} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.oderdate}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" id="lblOderdate">{this.state["txdate"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.custodycd}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" id="lblCustodycd">{this.state.datagroup["p_custodycd"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.orderid}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" id="lblOrderid">{this.state.datagroup["p_orderid"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.fullname}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" id="lblFullname">{this.state["fullname"]}</label>
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5><b>{this.props.strings.ordertype}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" id="lblOrdertype">{this.state["SRTYPEDESC"]}</label>

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5><b>{this.props.strings.value}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <NumberInput className="form-control" value={this.state["orderamt"]} id="lblValue" displayType={'text'} thousandSeparator={true} />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5><b>{this.props.strings.transactionfee}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <NumberInput className="form-control" id="lblTransactionfee" value={this.state["feeamt"]} displayType={'text'} thousandSeparator={true} />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5><b>{this.props.strings.tax}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <NumberInput className="form-control" id="lblTax" value={this.state["taxamt"]} displayType={'text'} thousandSeparator={true} />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5><b>{this.props.strings.managementfee}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <NumberInput className="form-control" id="lblTax" value={this.state["FEEMANAGE"]} displayType={'text'} thousandSeparator={true} />


                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5><b>{this.props.strings.oldbrokerageid}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" id="lblOldbrokerageid">{this.state.tlsalefullname}</label>

                                    </div>
                                </div>
                                {/*
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5><b>{this.props.strings.oldbrokeragename}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" id="lblOldbrokeragename">{this.state["tlfullname"]}</label>

                                    </div>
                                </div>
                                */}
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.oldbrokeragetype}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" id="lbloldbrokeragetype">{this.state["oldbrokeragetype"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.role}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" id="lbloldrole">{this.state["oldrole"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 ><b>{this.props.strings.productype}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" id="lbloldproduct">{this.state["oldproduct"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 className="highlight"><b>{this.props.strings.newbrokerageid}</b></h5>
                                    </div>
                                    <div className="col-md-7 customSelect">
                                        <Select.Async
                                            name="form-field-name"

                                            loadOptions={this.getOptions.bind(this)}
                                            value={this.state.newbrokerageid}
                                            //onChange={this.onChangefeeid.bind(this)}
                                            onChange={this.onChangecb.bind(this)}
                                            id="txtnewbrokerageid"
                                            //searchable={false}
                                            placeholder={this.props.strings.newbrokerageid}
                                            clearable={false}
                                            disabled={isDisplay}
                                            backspaceRemoves={false}

                                        />

                                    </div>
                                </div>
                                {/*
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5><b>{this.props.strings.newbrokeragename}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" id="lblNewbrokeragename">{this.state.newbrokerageid.text}</label>
                                    </div>
                                </div>
                                */}
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5 className="highlight"><b>{this.props.strings.newtype}</b></h5>
                                    </div>
                                    <div className="col-md-7 customSelect">
                                        <Select
                                            name="form-field-name"

                                            // loadOptions={this.getOptionstype.bind(this)}
                                            options={this.state.TYPE}
                                            value={this.state.type}
                                            //onChange={this.onChangefeeid.bind(this)}
                                            onChange={this.onChangecbtype.bind(this)}
                                            id="txttype"
                                            //searchable={false}
                                            placeholder={this.props.strings.newtype}
                                            clearable={false}
                                            disabled={isDisplay}
                                            backspaceRemoves={false}

                                        />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5><b>{this.props.strings.newrole}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" id="lblnewrole">{this.state.role}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5><b>{this.props.strings.newproductype}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <label className="form-control" id="lblnewproductype">{this.state.product}</label>
                                    </div>
                                </div>
                                {/* <div className="col-md-12 row">
                                    <div className="col-md-5">
                                        <h5><b>{this.props.strings.desc}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <input className="form-control" disabled={isDisplay} type="text" placeholder={this.props.strings.desc} id="txtDesc" />
                                    </div>
                                </div> */}
                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        <input type="button" disabled={isDisplay} onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
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
    translate('ModalDetailGanCNSale_info')
]);
module.exports = decorators(ModalDetailGanCNSale_info);
