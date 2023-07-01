import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import flow from 'lodash.flow';
import NumberInput from 'app/utils/input/NumberInput';


class ModalDetailTraTienThua extends Component {
    constructor(props) {
        super(props);
        this.state = {

            access: 'add',

            datagroup: {},
            checkFields: [


            ],
            checkFields1: [

                { name: "p_otpval", id: "txtOTP" },
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
                        p_custodycd: nextProps.DATA.CUSTODYCD,
                        p_fullname: nextProps.DATA.FULLNAME,
                        p_idcode: nextProps.DATA.CODEID,
                        p_bankacc: nextProps.DATA.BANKACC,
                        p_bankcode: nextProps.DATA.BANKCODE,
                        p_citybank: nextProps.DATA.CITYBANK,
                        p_codeid: nextProps.DATA.CODEID,
                        p_ivsrtype: nextProps.DATA.SRTYPE,
                        p_amount: nextProps.DATA.BALANCE,
                        p_desc: '',
                        pv_objname: this.props.OBJNAME,
                        p_language: this.props.lang,
                        p_otpval: ''
                    },
                    access: nextProps.access,
                    symbol: nextProps.DATA.SYMBOL,
                    SRTYPE: nextProps.DATA.SRTYPE_DESC,
                    TXDATE: nextProps.DATA.TXDATE,
                    isCheckOTP: false
                })
            }
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



    async submitGroup() {
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields1.length; index++) {
            const element = this.state.checkFields1[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            var api = '/vcbf/cashback';
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
    async checkOTP() {
        var api = '/vcbf/pre_check_3007';


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
                    /*
                    datanotify.type = "success";
                    datanotify.content = this.props.strings.success;
                    dispatch(showNotifi(datanotify));
                    this.props.load()
                    this.props.closeModalDetail()
                    */
                    this.setState({
                        isCheckOTP: true
                    })
                } else {
                    datanotify.type = "error";
                    datanotify.content = res.EM;
                    dispatch(showNotifi(datanotify));
                }

            })


    }
    checkValid(name, id) {
        let value = this.state.datagroup[name];
        let mssgerr = '';


        switch (name) {
            case "p_otpval":
                if (value == '') {
                    mssgerr = this.props.strings.requiredotpval;
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
        let isCheck = this.state.isCheckOTP ? 'block' : 'none'
        return (
            <Modal show={this.props.showModalDetail} bsSize="lg" dialogClassName="custom-modal">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12"} style={{ paddingTop: "11px" }}>
                                <div className={this.state.isCheckOTP ? "col-md-12 row disable" : "col-md-12 row"}>

                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className=""><b>{this.props.strings.CUSTODYCD}</b></h5>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-control" id="lblCustodycd">{this.state.datagroup["p_custodycd"]}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className=""><b>{this.props.strings.SYMBOL}</b></h5>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-control" id="lblSYMBOL">{this.state["symbol"]}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 ><b>{this.props.strings.SRTYPE}</b></h5>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-control" id="lblSRTYPE">{this.state["SRTYPE"]}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className=""><b>{this.props.strings.TXDATE}</b></h5>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-control" id="lblTXDATE">{this.state["TXDATE"]}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 ><b>{this.props.strings.BANKACC}</b></h5>
                                        </div>
                                        <div className="col-md-9">
                                            <label className="form-control" id="lblBANKACC">{this.state.datagroup["p_bankacc"]}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className=""><b>{this.props.strings.CITYBANK}</b></h5>
                                        </div>
                                        <div className="col-md-9">
                                            <label className="form-control" id="lblCITYBANK">{this.state.datagroup["p_citybank"]}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 ><b>{this.props.strings.BALANCE}</b></h5>
                                        </div>
                                        <div className="col-md-9">
                                            <NumberInput className="form-control" id="lblBALANCE" value={this.state.datagroup["p_amount"]} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                        </div>
                                    </div>
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className=""><b>{this.props.strings.DESC}</b></h5>
                                        </div>
                                        <div className="col-md-9">
                                            <input disabled={displayy} className="form-control" id="txtDESC" type="text" placeholder={this.props.strings.DESC} value={this.state.datagroup["p_desc"]} onChange={this.onChange.bind(this, "p_desc")} maxLength={200} />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: isCheck }}>
                                    <div className="col-md-12 row" >
                                        <div className="col-md-9" style={{ float: 'right' }}>
                                            <h5 className=""><b>{this.props.strings.otpdesc}</b></h5>
                                        </div>

                                    </div>
                                    <div className="col-md-12 row" >
                                        <div className="col-md-3">
                                        </div>
                                        <div className="col-md-3">
                                            <h5 className="highlight"><b>{this.props.strings.OTP}</b></h5>
                                        </div>
                                        <div className="col-md-3">
                                            <input disabled={displayy} className="form-control" id="txtOTP" type="text" placeholder={this.props.strings.OTP} value={this.state.datagroup["p_otpval"]} onChange={this.onChange.bind(this, "p_otpval")} maxLength={200} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        {
                                            this.state.isCheckOTP ? <input disabled={displayy} type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.otpsubmit} id="btnSubmit" />
                                                : <input disabled={displayy} type="button" onClick={this.checkOTP.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />

                                        }

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
    translate('ModalDetailTraTienThua')
]);

module.exports = decorators(ModalDetailTraTienThua);
