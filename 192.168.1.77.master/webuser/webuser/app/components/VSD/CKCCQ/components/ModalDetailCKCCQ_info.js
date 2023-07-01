import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import moment from 'moment';
import flow from 'lodash.flow';
import DropdownFactory from 'app/utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';
import NumberFormat from 'react-number-format';
import Select from 'react-select';

class ModalDetailCKCCQ_info extends Component {
    constructor(props) {
        super(props);
        this.state = {

            access: 'add',

            datagroup: {},
            checkFields: [
                { name: "p_busdate", id: "txtDate" },
                { name: "p_qtty", id: "txtAmount" },
                { name: "p_qttysip", id: "txtqttysip" },
                { name: "p_price", id: "txtPrice" },
                { name: "p_feeamt", id: "txtTransactionfee" },
                { name: "p_rcvaccount", id: "txtCustodycdrecive" },

            ],
            listVsdspcode: [],
            VSDSPCODE: '',
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
                    datagroup: {
                        p_busdate: this.props.tradingdate,
                        p_trfaccount: nextProps.DATA.CUSTODYCD,
                        p_trfullname: nextProps.DATA.FULLNAME,
                        p_codeid: nextProps.DATA.CODEID,
                        p_vsdspcode: '',
                        p_trftype: '',
                        p_avlqtty: nextProps.DATA.AVLQTTY?nextProps.DATA.AVLQTTY:'0',
                        p_qtty: '0',
                        p_avlqttysip: nextProps.DATA.AVLQTTYSIP?nextProps.DATA.AVLQTTYSIP:'0',
                        p_qttysip: '0',
                        p_price: nextProps.DATA.NAV?nextProps.DATA.NAV:'0',
                        p_feeamt: '0',
                        p_rcvaccount: '',
                        p_rcvmbcode: '',
                        p_desc: '',
                        pv_objname: this.props.OBJNAME,
                        p_language: this.props.lang
                    },
                    access: nextProps.access,
                    symbol: nextProps.DATA.SYMBOL,
                    codeid: nextProps.DATA.CODEID
                })
            }
        }
        else
            this.setState({

            })
    }

    onValueChange(type, data) {

        this.state.datagroup[type] = data.value
        this.setState(this.state)
    }
    onChangeDate(type, event) {
        this.state.datagroup[type] = event.value;
        this.setState({ datagroup: this.state.datagroup })
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

    onSetDefaultValue = (type, value) => {
        if (!this.state.datagroup[type])
            this.state.datagroup[type] = value
    }
    onChangeDRD(type, event) {
        if (event.target) {
            this.state.datagroup[type] = event.target.value;
        }
        else {
            this.state.datagroup[type] = event.value;
            this.state.VSDSPCODE = event;
        }
        this.setState({ 
            datagroup: this.state.datagroup,
            VSDSPCODE: this.state.VSDSPCODE
        })
    }
    getVsdspcodeByCodeid(codeid) {
        let data = {
            p_codeid: this.state.codeid,
            p_objname: this.props.OBJNAME,
            p_language: this.props.lang
        }
        return RestfulUtils.post('/fund/getvsdspcodebycodeid', data)
            .then((res) => {
                return {options: res.DT.data};
            });
    }

    checkValid(name, id) {
        let value = this.state.datagroup[name];
        let mssgerr = '';
        switch (name) {

            case "p_busdate":
                if (value == '') {
                    mssgerr = this.props.strings.requiredbusdate;
                }
                break;
            case "p_qtty":
                if (value == '') {
                  
                    mssgerr = this.props.strings.requiredqtty;
                } else {
                   // if (value <= 0) mssgerr = this.props.strings.wrongvalue;
                    if (parseFloat(value) > parseFloat(this.state.datagroup["p_avlqtty"])) mssgerr = this.props.strings.wrongvalue1;
                }
                break;
            case "p_qttysip":
                if (value == '') {
                    mssgerr = this.props.strings.requiredqttysip;
                } 
                else {
                   // if (value <= 0) mssgerr = this.props.strings.wrongvaluesip;
                  if (parseFloat(value) > parseFloat(this.state.datagroup["p_avlqttysip"])) mssgerr = this.props.strings.wrongvalue1sip;
                }
                break;
            case "p_price":
                if (value == '') {
                    mssgerr = this.props.strings.requiredprice;
                } else {
                    if (value <= 0) mssgerr = this.props.strings.requiredprice1;
                }
                break;
            case "p_feeamt":
                if (value == '') {
                    mssgerr = this.props.strings.requiredfeeamt;
                }
                break;
            case "p_rcvaccount":
                if (value == '') {
                    mssgerr = this.props.strings.requiredrcvaccount;
                } else {
                    if (value.length == 10) {
                        var i = ['C', 'F', 'P'].filter(nodes => nodes == value.substr(3, 1))
                        if (i == 0)
                            mssgerr = this.props.strings.checkbanhacc1;
                    } else mssgerr = this.props.strings.checkbanhacc;
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
            var api = '/fund/setranfer_req';


            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
           // console.log(this.state.datagroup)
           RestfulUtils.posttrans(api, this.state.datagroup)
                .then((res) => {
                   // console.log('chek ma loi ---- ', res)
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

    render() {
        // console.log('this.state.VSDSPCODE.SPTYPE:::',this.state.VSDSPCODE.SPTYPE);
        // console.log('this.state.VSDSPCODE:::',this.state.VSDSPCODE);
        let displayy = this.state.access == 'view' ? true : false;
        let displayQtty = this.state.access == 'view' ? true : false;
        let displayQttySip = this.state.access == 'view' ? true : false;
        if(this.state.VSDSPCODE && this.state.VSDSPCODE.SPTYPE == 'N') {
            displayQtty = false;
            displayQttySip = true;
        } else {
            displayQtty = true;
            displayQttySip = false;
        }
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
                                        <h5 className="highlight"><b>{this.props.strings.date}</b></h5>
                                    </div>
                                    <div className="col-md-3 fixWidthDatePickerForOthers">
                                        <DateInput disabled={displayy} onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["p_busdate"]} type="p_busdate" id="txtDate" maxDate={moment(this.props.tradingdate, "DD/MM/YYYY")} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.custodycd}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblCustodycd">{this.state.datagroup["p_trfaccount"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.fullname}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <label className="form-control" id="lblFullname">{this.state.datagroup["p_trfullname"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.vfmcode}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblVfmcode">{this.state["symbol"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.vsdspcode}</b></h5>
                                    </div>
                                    <div className="col-md-9 ">
                                        <Select.Async
                                            name="form-field-name"
                                            loadOptions={this.getVsdspcodeByCodeid.bind(this)}
                                            value={this.state.VSDSPCODE}
                                            onChange={this.onChangeDRD.bind(this, "p_vsdspcode")}
                                            id="drdVsdspcode"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.transfertype}</b></h5>
                                    </div>
                                    <div className="col-md-9 ">
                                        <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup.p_trftype} onSetDefaultValue={this.onSetDefaultValue} value="p_trftype" CDTYPE="SE" CDNAME="TRFTYPE" onChange={this.onChangeDRD.bind(this)} ID="drdTransfertype" />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.balancetransfer}</b></h5>
                                    </div>
                                    <div className="col-md-3">

                                        <NumberFormat disabled={displayy} className="form-control" value={this.state.datagroup["p_avlqtty"]} id="lblBalancetransfer" thousandSeparator={true} decimalScale={2} disabled={true} />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.avlqttysip}</b></h5>
                                    </div>
                                    <div className="col-md-3">

                                        <NumberFormat disabled={displayy} className="form-control" value={this.state.datagroup["p_avlqttysip"]} id="lblBalancetransfer" thousandSeparator={true} decimalScale={2} disabled={true} />

                                    </div>
                                </div>
                            
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.amount}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <NumberFormat allowNegative={false}  disabled={displayQtty} maxLength={21} className="form-control" thousandSeparator={true} value={this.state.datagroup["p_qtty"]} id="txtAmount" onValueChange={this.onValueChange.bind(this, 'p_qtty')} prefix={''} placeholder={this.props.strings.amount} decimalScale={2} />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.qttysip}</b></h5>
                                    </div>
                                    <div className="col-md-3">

                                        <NumberFormat allowNegative={false}  disabled={displayQttySip} maxLength={21} className="form-control" id="txtqttysip" value={this.state.datagroup["p_qttysip"]} onValueChange={this.onValueChange.bind(this, 'p_qttysip')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.qttysip} decimalScale={2} />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.price}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <NumberFormat allowNegative={false}  disabled={displayy} maxLength={21} className="form-control" id="txtPrice" value={this.state.datagroup["p_price"]} onValueChange={this.onValueChange.bind(this, 'p_price')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.price} decimalScale={2} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.transactionfee}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <NumberFormat allowNegative={false} disabled={displayy} maxLength={21} className="form-control" id="txtTransactionfee" value={this.state.datagroup["p_feeamt"]} onValueChange={this.onValueChange.bind(this, 'p_feeamt')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.transactionfee} decimalScale={2} />


                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.custodycdrecive}</b></h5>
                                    </div>
                                    <div className="col-md-3 ">
                                        <input disabled={displayy} maxLength={10} className="form-control" placeholder={this.props.strings.custodycdrecive} id="txtCustodycdrecive" value={this.state.datagroup["p_rcvaccount"]} onChange={this.onChange.bind(this, "p_rcvaccount")} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.distributorname}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input maxLength={2147483647} disabled={displayy} className="form-control" placeholder={this.props.strings.distributorname} id="txtdistributorname" value={this.state.datagroup["p_rcvmbcode"]} onChange={this.onChange.bind(this, "p_rcvmbcode")} />
                                        
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.desc}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input maxLength={1000} disabled={displayy} className="form-control" placeholder={this.props.strings.desc} id="txtDesc" value={this.state.datagroup["p_desc"]} onChange={this.onChange.bind(this, "p_desc")} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        <input disabled={displayy} type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />

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
    translate('ModalDetailCKCCQ_info')
]);

module.exports = decorators(ModalDetailCKCCQ_info);
