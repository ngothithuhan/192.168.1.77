import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import NumberFormat from 'react-number-format';
import { getExtensionByLang } from 'app/Helpers'
import flow from 'lodash.flow';
class ModalDetailCKCCQtuchoi_info extends Component {
    constructor(props) {
        super(props);
        this.state = {

            access: 'add',
            datagroup: {}
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
                        p_reqid: nextProps.DATA.AUTOID,
                        p_trfaccount: nextProps.DATA.TRFACCOUNT,
                        p_trfullname: nextProps.DATA.TRFULLNAME,
                        p_codeid: nextProps.DATA.CODEID,
                        p_trftype: nextProps.DATA.TRFTYPE,
                        p_qtty: nextProps.DATA.QTTY,
                        p_nqtty: nextProps.DATA.NQTTY,
                        p_sqtty: nextProps.DATA.SQTTY,
                        p_price: nextProps.DATA.PRICE,
                        p_feeamt: nextProps.DATA.FEEAMT,
                        p_rcvaccount: nextProps.DATA.RCVACCOUNT,
                        p_rcvmbcode: nextProps.DATA.RCVMBCODE,
                        p_desc: '',
                        pv_objname:this.props.OBJNAME,
                        p_language:this.props.lang
                    },
                    symbol:nextProps.DATA.SYMBOL,
                    access:nextProps.access,
                    trftype:nextProps.DATA[getExtensionByLang("TRFTYPEDESC",this.props.lang)]
                })
            }
        }
        else
            this.setState({

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
    async submitGroup() {
      
     
            var api = '/fund/setranfer_reject';
        

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
           // console.log(this.state.datagroup)
           RestfulUtils.posttrans(api, this.state.datagroup)
                .then((res) => {
                   // console.log(res.data)
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
    render() {
        let displayy=this.state.access=='view'?true:false
        return (
            <Modal show={this.props.showModalDetail} bsSize="lg">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access=="view"?"col-md-12 disable":"col-md-12"} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.vfmcode}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblVfmcode">{this.state["symbol"]}</label>                                </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.custodycd}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblCustodycd">{this.state.datagroup["p_trfaccount"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.trftype}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <label className="form-control" id="lblTrftype">{this.state.trftype}</label>
                                    </div>
                                </div>
                           
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.amount}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <NumberFormat disabled={displayy} className="form-control" value={this.state.datagroup["p_qtty"]} id="lblAmount"   prefix={''} placeholder={this.props.strings.amount} decimalScale={2} disabled={true} thousandSeparator={true}/>

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.nqtty}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <NumberFormat disabled={displayy} className="form-control" value={this.state.datagroup["p_nqtty"]} id="lblTransactionfee"   prefix={''} placeholder={this.props.strings.nqtty} decimalScale={0} disabled={true} thousandSeparator={true}/>

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.sqtty}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <NumberFormat disabled={displayy} className="form-control" value={this.state.datagroup["p_sqtty"]} id="lblTransactionfee"   prefix={''} placeholder={this.props.strings.sqtty} decimalScale={0} disabled={true} thousandSeparator={true}/>

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.price}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <NumberFormat disabled={displayy} className="form-control" value={this.state.datagroup["p_price"]} id="lblp_price"   prefix={''} placeholder={this.props.strings.price} decimalScale={0} disabled={true} thousandSeparator={true}/>

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.transactionfee}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <NumberFormat disabled={displayy} className="form-control" value={this.state.datagroup["p_feeamt"]} id="lblTransactionfee"   prefix={''} placeholder={this.props.strings.transactionfee} decimalScale={0} disabled={true} thousandSeparator={true}/>

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.custodycdrecive}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblCustodycdrecive">{this.state.datagroup["p_rcvaccount"]}</label>

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.distributornamerec}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <label className="form-control" id="lblDistributornamerec">{this.state.datagroup["p_rcvmbcode"]}</label>

                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.desc}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input disabled={displayy} className="form-control" id="txtDesc" value={this.state.datagroup["p_desc"]} onChange={this.onChange.bind(this, "p_desc")} placeholder={this.props.strings.desc}/>
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
    lang: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('ModalDetailCKCCQtuchoi_info')
]);

module.exports = decorators(ModalDetailCKCCQtuchoi_info);
