import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import NumberInput from 'app/utils/input/NumberInput';
import DateInput from 'app/utils/input/DateInput'

class ModalDoiPhienGDLenhDat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access: 'add',
            newTradingDate: '',
        };
    }
    close() {
        this.closeModalDetail();
    }

    componentWillReceiveProps(nextProps) {
    }

    closeModalDetail() {
        this.setState({ newTradingDate: '' })
        this.props.closeModalDetail()
    }

    onChangeDate(type, data) {
        this.setState({
            newTradingDate: data.value
        })
    }

    action = () => {
        var api = '/order/changeOrderTradingSession';
        var { dispatch } = this.props;
        var dataProps = this.props.DATA ? this.props.DATA : {};
        var datanotify = {
            type: "",
            header: "",
            content: ""
        }

        if (!this.state.newTradingDate || this.state.newTradingDate == '') {
            dispatch(showNotifi({
                header: "",
                type: "error",
                content: this.props.strings.requirenewtradingdate
            }));
            return;
        }

        var data = {
            p_orderid: dataProps.ORDERID,
            p_custodycd: dataProps.CUSTODYCD,
            p_codeid: dataProps.CODEID,
            p_dealtype: dataProps.EXECTYPE_DESC,
            p_amount: dataProps.ORDERVALUE,
            p_oldtradingdate: dataProps.TRADINGDATE,
            p_tradingdate: this.state.newTradingDate,
            pv_objname: this.props.OBJNAME,
            p_language: this.props.lang,
        }

        RestfulUtils.posttrans(api, data)
            .then((res) => {
                if (res.EC == 0) {
                    datanotify.type = "success";
                    datanotify.content = this.props.strings.success;
                    dispatch(showNotifi(datanotify));
                    this.props.load()
                    this.closeModalDetail()
                } else {
                    datanotify.type = "error";
                    datanotify.content = res.EM;
                    dispatch(showNotifi(datanotify));
                }
            })
    }

    render() {
        return (
            <Modal show={this.props.showModalDetail}   >
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body">
                        <div className="add-info-account">
                            <div className="row col-md-12">
                                <div className="col-md-5">
                                    <h5><b>{this.props.strings.orderid}</b></h5>
                                </div>
                                <div className="col-md-7">
                                    <input disabled={true} className="form-control" value={this.props.DATA.ORDERID} />
                                </div>
                            </div>
                            <div className="row col-md-12">
                                <div className="col-md-5">
                                    <h5><b>{this.props.strings.symbol}</b></h5>
                                </div>
                                <div className="col-md-7">
                                    <input disabled={true} className="form-control" value={this.props.DATA.SYMBOL} />
                                </div>
                            </div>
                            <div className="row col-md-12">
                                <div className="col-md-5">
                                    <h5><b>{this.props.strings.custodycd}</b></h5>
                                </div>
                                <div className="col-md-7">
                                    <input disabled={true} className="form-control" value={this.props.DATA.CUSTODYCD} />
                                </div>
                            </div>
                            <div className="row col-md-12">
                                <div className="col-md-5">
                                    <h5><b>{this.props.strings.ordertype}</b></h5>
                                </div>
                                <div className="col-md-7">
                                    <input disabled={true} className="form-control" value={this.props.lang == 'vie' ? this.props.DATA.EXECTYPE_DESC : this.props.DATA.EXECTYPE_DESC_EN} />
                                </div>
                            </div>
                            <div className="row col-md-12">
                                <div className="col-md-5">
                                    <h5><b>{this.props.strings.ordervalue}</b></h5>
                                </div>
                                <div className="col-md-7">
                                    <NumberInput className='form-control' value={this.props.DATA.ORDERVALUE} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={''} disabled={true} />
                                </div>
                            </div>
                            <div className="row col-md-12">
                                <div className="col-md-5">
                                    <h5><b>{this.props.strings.orderstatus}</b></h5>
                                </div>
                                <div className="col-md-7">
                                    <input disabled={true} className="form-control" value={this.props.lang == 'vie' ? this.props.DATA.DESC_STATUS : this.props.DATA.DESC_STATUS_EN} />
                                </div>
                            </div>
                            <div className="row col-md-12">
                                <div className="col-md-5">
                                    <h5><b>{this.props.strings.oldtradingdate}</b></h5>
                                </div>
                                <div className="col-md-7">
                                    <input disabled={true} className="form-control" value={this.props.DATA.TRADINGDATE} />
                                </div>
                            </div>
                            <div className="row col-md-12">
                                <div className="col-md-5">
                                    <h5><b>{this.props.strings.newtradingdate}</b></h5>
                                </div>
                                <div className="col-md-7 fixWidthDatePickerForOthers">
                                    <DateInput onChange={this.onChangeDate.bind(this)} value={this.state.newTradingDate} type="newTradingDate" id="txtDate" />
                                </div>
                            </div>
                            <div style={{ marginRight: 20 }} className="text-right row">
                                <button onClick={this.action} type="button" className="btn btn-primary" style={{ marginTop: 170 }}>  <a style={{ color: "#ffffff", textDecoration: "none" }}>{this.props.strings.submit}</a></button>
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
    translate('ModalDoiPhienGDLenhDat')
]);

module.exports = decorators(ModalDoiPhienGDLenhDat);