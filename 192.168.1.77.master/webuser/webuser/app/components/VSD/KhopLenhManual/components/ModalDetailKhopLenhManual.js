import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils'
import { showNotifi } from 'app/action/actionNotification.js';
import NumberFormat from 'react-number-format';
import NumberInput from 'app/utils/input/NumberInput';
import { getExtensionByLang } from 'app/Helpers'
class ModalDetailKhopLenhManual extends Component {
    constructor(props) {
        super(props);
        this.state = {

            access: 'add',
            data: {},
            datagroup: {
                p_desc: ''
            },
            checkFields: [

                { name: "p_amount", id: "txtrealbuymoney" },
                { name: "p_qtty", id: "txtvfmcodedistribution" },
                { name: "p_feeamt", id: "txtfee" },
                { name: "p_taxamt", id: "txttax" },
                { name: "p_qtty", id: "txtrealvfmcodesell" },
                { name: "p_amount", id: "txtreceivemoney" },

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
                    datagroup: {

                        p_orderid: nextProps.DATA.ORDERID,
                        p_codeid: nextProps.DATA.CODEID,
                        p_custodycd: nextProps.DATA.CUSTODYCD,
                        p_acctno: nextProps.DATA.AFACCTNO,
                        p_seacctno: nextProps.DATA.SEACCTNO,
                        p_srtype: nextProps.DATA.SRTYPE,
                        p_exectype: nextProps.DATA.EXECTYPE,
                        p_orderqtty: nextProps.DATA.ORDERQTTY,
                        p_orderamt: nextProps.DATA.ORDERAMT,
                        p_nav: '0',
                        p_qtty: '',
                        p_amount: '',
                        p_feeamt: '',
                        p_taxamt: '',
                        p_username: nextProps.DATA.USERNAME,
                        p_txtime: nextProps.DATA.TXTIME,
                        p_desc: '',
                        p_language: this.props.lang,
                        pv_objname: this.props.OBJNAME,
                    },
                    symbol: nextProps.DATA.SYMBOL,
                    exectype: nextProps.DATA[getExtensionByLang("EXECTYPE_DESC", this.props.lang)],
                    status: nextProps.DATA[getExtensionByLang("STATUS_DES", this.props.lang)],
                    user: nextProps.DATA.USERNAME,
                    access: nextProps.access,
                    vfmcodesw: nextProps.DATA.SWSYMBOL,
                })
            }
        }
        else
            if (nextProps.isClear) {
                this.props.change()
                this.setState({
                    datagroup: {

                        p_orderid: '',
                        p_codeid: '',
                        p_custodycd: '',
                        p_acctno: '',
                        p_seacctno: '',
                        p_srtype: '',
                        p_exectype: '',
                        p_orderqtty: '',
                        p_orderamt: '',
                        p_nav: '',
                        p_qtty: '',
                        p_amount: '',
                        p_desc: '',
                        p_language: '',
                        pv_objname: '',
                    }
                })
            }
    }
    componentDidMount() {

        // io.socket.post('/account/get_detail',{CUSTID:this.props.CUSTID_VIEW,TLID:"0009"}, function (resData, jwRes) {
        //     console.log('detail',resData)
        //     // self.setState({generalInformation:resData});

        // });

    }
    handleChange(type) {
        this.state.collapse[type] = !this.state.collapse[type];
        this.setState({ collapse: this.state.collapse })
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
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""
            }

            // console.log('this.state.datagroup')
            //  console.log(this.state.datagroup)
            RestfulUtils.posttrans('/fund/process_tx5017', this.state.datagroup)
                .then((res) => {
                    //console.log(res)
                    if (res.EC == 0) {
                        datanotify.type = "success";
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
    onValueChange(type, data) {

        this.state.datagroup[type] = data.value
        this.setState(this.state)
    }
    checkValid(name, id) {
        let value = this.state.datagroup[name];
        let mssgerr = '';
        switch (name) {
            case "p_amount":
                if (value == '') {
                    if (this.state.datagroup["p_exectype"] == 'NS')
                        mssgerr = this.props.strings.requirednsamount;
                    else mssgerr = this.props.strings.requirednramount;
                }
                else {
                    if (this.state.datagroup["p_exectype"] == 'NS') {
                        if (value <= 0) mssgerr = this.props.strings.requiredcondition0nsamount;
                    }

                    else {
                        if (value <= 0) mssgerr = this.props.strings.requiredcondition0nsamount;
                    }

                }
                break;
            case "p_qtty":
                if (value == '') {
                    if (this.state.datagroup["p_exectype"] == 'NS')
                        mssgerr = this.props.strings.requirednsqtty;
                    else mssgerr = this.props.strings.requirednrqtty;
                }
                else {
                    if (this.state.datagroup["p_exectype"] == 'NR') {
                        // if (value > this.state.datagroup["p_orderqtty"])
                        // mssgerr = this.props.strings.requiredobjconditionsell;
                        if (value <= 0) mssgerr = this.props.strings.requiredcondition0nrqtty;
                    } else {
                        if (value <= 0) mssgerr = this.props.strings.requiredcondition0nsqtty;
                    }
                }
                break;
            case "p_feeamt":
                if (value == '') {
                    mssgerr = this.props.strings.requiredfeeamt;
                } else {
                    if (value < 0) mssgerr = this.props.strings.requiredcondition0fee;
                }
                break;
            case "p_taxamt":
                if (value == '') {
                    mssgerr = this.props.strings.requiredtaxamt;
                } else {
                    if (value < 0) mssgerr = this.props.strings.requiredcondition0tax;
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
    render() {
        let displayy = this.state.access == 'view' ? true : false
        return (
            <Modal show={this.props.showModalDetail} bsSize="lg">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == 'view' ? "col-md-12 disable" : "col-md-12"} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.orderid}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblCustodycd">{this.state.datagroup.p_orderid}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.vfmcode}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblvfmcode">{this.state.symbol}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.custodycd}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblcustodycd">{this.state.datagroup.p_custodycd}</label>
                                    </div>
                                </div>
                                {/*}
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.productype}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblIddate">{this.state.data.IDDATE}</label>
                                    </div>
                                </div>
        */}
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.ordertype}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblexectype">{this.state.exectype}</label>
                                    </div>
                                </div>
                                {this.state.datagroup.p_exectype == 'NS' ?
                                    <div id="NS">
                                        <div className="col-md-12 row">
                                            <div className="col-md-3">
                                                <h5 id="lblbuymoney"><b>{this.props.strings.buymoney}</b></h5>
                                            </div>
                                            <div className="col-md-3">
                                                <NumberInput maxLength={21} disabled={displayy} className="form-control" id="txtbuymoney" value={this.state.datagroup.p_orderamt} displayType={'text'} thousandSeparator={true} />
                                            </div>
                                        </div>
                                        <div className="col-md-12 row">
                                            <div className="col-md-3">
                                                <h5 className="highlight" id="lblrealbuymoney"><b>{this.props.strings.realbuymoney}</b></h5>
                                            </div>
                                            <div className="col-md-3">
                                                <NumberFormat maxLength={21} disabled={displayy} className="form-control" id="txtrealbuymoney" onValueChange={this.onValueChange.bind(this, 'p_amount')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.realbuymoney} value={this.state.datagroup["p_amount"]} decimalScale={0} />

                                            </div>
                                        </div>



                                        <div className="col-md-12 row">
                                            <div className="col-md-3">
                                                <h5 className="highlight" id="lblvfmcodedistribution"><b>{this.props.strings.vfmcodedistribution}</b></h5>
                                            </div>
                                            <div className="col-md-3">
                                                <NumberFormat maxLength={21} disabled={displayy} className="form-control" id="txtvfmcodedistribution" onValueChange={this.onValueChange.bind(this, 'p_qtty')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.vfmcodedistribution} value={this.state.datagroup["p_qtty"]} decimalScale={2} />

                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div id="NB">
                                        <div className="col-md-12 row">
                                            <div className="col-md-3">
                                                <h5 id="lblvfmcodesell"><b>{this.props.strings.vfmcodesell}</b></h5>
                                            </div>
                                            <div className="col-md-3">
                                                <NumberInput maxLength={21} disabled={displayy} className="form-control" id="txtvfmcodesell" value={this.state.datagroup.p_orderqtty} displayType={'text'} thousandSeparator={true} />

                                            </div>
                                        </div>
                                        <div className="col-md-12 row">
                                            <div className="col-md-3">
                                                <h5 className="highlight" id="lblrealvfmcodesell"><b>{this.props.strings.realvfmcodesell}</b></h5>
                                            </div>
                                            <div className="col-md-3">
                                                <NumberFormat maxLength={21} disabled={displayy} className="form-control" id="txtrealvfmcodesell" onValueChange={this.onValueChange.bind(this, 'p_qtty')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.realvfmcodesell} value={this.state.datagroup["p_qtty"]} decimalScale={2} />

                                            </div>
                                        </div>
                                        <div className="col-md-12 row">
                                            <div className="col-md-3">
                                                <h5 className="highlight" id="lblreceivemoney"><b>{this.props.strings.receivemoney}</b></h5>
                                            </div>
                                            <div className="col-md-3">
                                                <NumberFormat maxLength={21} disabled={displayy} className="form-control" id="txtreceivemoney" onValueChange={this.onValueChange.bind(this, 'p_amount')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.receivemoney} value={this.state.datagroup["p_amount"]} decimalScale={2} />

                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.fee}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <NumberFormat maxLength={21} disabled={displayy} className="form-control" id="txtfee" onValueChange={this.onValueChange.bind(this, 'p_feeamt')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.fee} value={this.state.datagroup["p_feeamt"]} decimalScale={2} />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.tax}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <NumberFormat maxLength={21} disabled={displayy} className="form-control" id="txttax" onValueChange={this.onValueChange.bind(this, 'p_taxamt')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.tax} value={this.state.datagroup["p_taxamt"]} decimalScale={2} />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.status}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <label className="form-control" id="lblIdcode">{this.state.status}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.user}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblIddate">{this.state.user}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.vfmcodesw}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblIddate">{this.state.vfmcodesw}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.desc}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input maxLength={500} disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.desc} id="txtDesc" value={this.state.datagroup["p_desc"]} onChange={this.onChange.bind(this, "p_desc")} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        <input disabled={displayy} type="button" className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" onClick={this.submitGroup.bind(this)} />

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
    translate('ModalDetailKhopLenhManual')
]);

module.exports = decorators(ModalDetailKhopLenhManual);
