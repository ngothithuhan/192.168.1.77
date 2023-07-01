import React, { Component } from 'react';
import { Modal  } from 'react-bootstrap'
import flow from 'lodash.flow';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils'
import Select from 'react-select';
import { showNotifi } from 'app/action/actionNotification.js';
import NumberFormat from 'react-number-format';
import translate from 'app/utils/i18n/Translate.js';
import DateInput from 'app/utils/input/DateInput';
import { getExtensionByLang} from 'app/Helpers'

class ModalDetailHoanTienTheoTungLenh_info extends Component {
    constructor(props) {
        super(props);
        this.state = {

            access: 'add',
            datachange: {},
            checkFields: [

                { name: "p_txdate", id: "txtRefunddate" },
                { name: "p_custodycd", id: "drdCustodycd" },
                { name: "p_orderid", id: "drdorderid" },
                { name: "p_namt", id: "txtrefundmoney" },

            ],
            CUSTODYCD: { value: '', label: '' },
            ORDER: { value: '', label: '', fee: '', ordertype: '' },
            datagroup: {

                p_custodycd: '',
                p_orderid: '',
                p_namt: '',
                p_txdate: '',
                p_des: '',
                p_language: this.props.lang,
                pv_objname: this.props.OBJNAME,

            }
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

                        p_custodycd: nextProps.DATA.CUSTODYCD,
                        p_orderid: nextProps.DATA.ORDERID,
                        p_namt: nextProps.DATA.NAMT,
                        p_txdate: nextProps.DATA.TXDATE,
                        p_des: nextProps.DATA.TRDESC,
                        p_language: this.props.lang,
                        pv_objname: this.props.OBJNAME,
                    },
                    access: nextProps.access,
                    CUSTODYCD: { value: nextProps.DATA.ACCTNO, label: nextProps.DATA.ACCTNO },
                    ORDER: { value: nextProps.DATA.ACCTREF, label: nextProps.DATA.ACCTREF, fee: nextProps.DATA.FEEAMT, ordertype: nextProps.DATA[getExtensionByLang("SRTYPEDES",this.props.lang)]},
                })
            }
        }
        else
            if (nextProps.isClear) {

                this.props.change()
                this.setState({
                    datagroup: {

                        p_custodycd: '',
                        p_orderid: '',
                        p_namt: '',
                        p_txdate: this.props.tradingdate,
                        p_des: '',
                        p_language: this.props.lang,
                        pv_objname: this.props.OBJNAME,

                    },
                    access: nextProps.access,
                    ORDER: null,
                    CUSTODYCD: null,
                    dataORDER: []

                })
            }
    }
    onChangecb(e) {
        // console.log(e)
        if (e !== null) {
            this.loadOptions(e.value)
            this.state.datagroup["p_custodycd"] = e.value
        } else this.state.datagroup["p_custodycd"] = ''
        this.setState({
            CUSTODYCD: e,
            ORDER: { value: '', label: '', fee: '', ordertype: '' },
            dataORDER: [],
            datagroup: this.state.datagroup
        })

    }
    onChangeORDER(e) {
        // console.log(e)
        if (e === null) e = { value: '', label: '', fee: '', ordertype: '' }

        this.state.datagroup["p_orderid"] = e.value
        this.setState({
            ORDER: e,
            datagroup: this.state.datagroup
        })
    }
    getOptions(input) {
        return RestfulUtils.post('/account/search_all', { key: input })
            .then((res) => {
                // console.log(res.data);
                return { options: res }
            })
    }
    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        //console.log(`Selected: ${selectedOption.label}`);
    }
    onChange(type, event) {
        this.state.datagroup[type] = event.value;
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

            case "p_txdate":
                if (value == '') {
                    mssgerr = this.props.strings.requiredtxdate;
                }
                break;
            case "p_custodycd":
                if (value == '') {
                    mssgerr = this.props.strings.requiredcustodycd;
                }
                break;
            case "p_orderid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredorderid;
                }
                break;
            case "p_namt":
                if (value == '') {
                    mssgerr = this.props.strings.requirednamt;
                } else if (value <= 0) mssgerr = this.props.strings.requiredcondition0;
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
            var api = '/fund/addrefundbyorder';
            if (this.state.access == "update") {
                api = '/fund/updaterefundbyorder';
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
    loadOptions(p_custodycd) {

        let data = {
            p_orderid: 'ALL',
            p_custodycd: p_custodycd,
            p_language: this.props.lang,
        }

        RestfulUtils.post('/fund/getlistrefundbyorderadd', { data })
            .then((res) => {

                this.setState({
                    dataORDER: res
                })
            })
    }
    onChangetxt(type, event) {
        let data = {};
        if (event.target) {

            this.state.datagroup[type] = event.target.value;
        }
        else {
            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup })
    }
    render() {
        let displayy=this.state.access=='view'?true:false

        return (
            <Modal show={this.props.showModalDetail}  >
                <Modal.Header >
                    <Modal.Title><div className="title-content col-md-6">{this.props.title}<button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == 'view' ? "col-md-12 disable" : "col-md-12"} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight" ><b>{this.props.strings.refunddate}</b></h5>
                                    </div>
                                    <div className="col-md-8 fixWidthDatePickerForOthers">
                                        <DateInput disabled={true} onChange={this.onChange.bind(this)} value={this.state.datagroup.p_txdate} type="p_txdate" id="txtRefunddate" />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.custodycd}</b></h5>
                                    </div>
                                    <div className="col-md-8 customSelect">
                                        <Select.Async
                                            name="form-field-name"
                                            placeholder={this.props.strings.custodycd}
                                            loadOptions={this.getOptions.bind(this)}
                                            value={this.state.CUSTODYCD}
                                            onChange={this.onChangecb.bind(this)}
                                            id="drdCustodycd"
                                            disabled={displayy}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4 ">
                                        <h5 className="highlight"><b>{this.props.strings.orderid}</b></h5>
                                    </div>
                                    <div className="col-md-8 customSelect">
                                        <Select
                                            options={this.state.dataORDER}
                                            name="form-field-name"
                                            placeholder={this.props.strings.orderid}
                                            value={this.state.ORDER}
                                            onChange={this.onChangeORDER.bind(this)}
                                            id="drdorderid"
                                            disabled={displayy}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 ><b>{this.props.strings.ordertype}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-control" id="lblOrdertype">{this.state.ORDER?this.state.ORDER.ordertype:''}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 ><b>{this.props.strings.transactionfee}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <NumberFormat  className="form-control" thousandSeparator={true} value={this.state.ORDER?this.state.ORDER["fee"]:''} id="lblTransactionfee" prefix={''} decimalScale={0} disabled={true} />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.refundmoney}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <NumberFormat maxLength={13} disabled={displayy} className="form-control" id="txtrefundmoney" thousandSeparator={true} onValueChange={this.onValueChange.bind(this, 'p_namt')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.refundmoney} decimalScale={0} value={this.state.datagroup["p_namt"]} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 ><b>{this.props.strings.desc}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <input maxLength={500} disabled={displayy} className="form-control" id="txtDesc" placeholder={this.props.strings.desc} value={this.state.datagroup["p_des"]} onChange={this.onChangetxt.bind(this, "p_des")} />
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
    translate('ModalDetailHoanTienTheoTungLenh_info')
]);
module.exports = decorators(ModalDetailHoanTienTheoTungLenh_info);
