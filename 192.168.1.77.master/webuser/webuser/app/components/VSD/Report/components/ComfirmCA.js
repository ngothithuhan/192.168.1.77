import React, { Component } from 'react';
import ReactTable from 'react-table';
var Select = require('react-select');
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody, Button, PageHeader } from 'react-bootstrap';
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import { inherits } from 'util';

class ComfirmCA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            err_msg: { color: "", text: "" },
        }
    }
    componentWillReceiveProps(nextprops) {
        if (nextprops.showModal) {
            this.state = {
                showModal: false,
                err_msg: { color: "", text: "" },
            }
            this.state.showModal = nextprops.showModal;
            this.setState(this.state);
        } else {
            this.state.showModal = false;
            this.setState(this.state);
        }
    }
    closeDialog() {
        this.props.onClose();
        this.setState({ showModal: false });
    }
    handleSubmitCA(action, event) {
        let self = this
        console.log("handleSubmitCA", action)
        self.setState({ err_msg: "" })
        console.log("handleSubmitCA.:", self.props.dataCA.AUTOID, this.props.urlConfirmCA)
        axios.get(this.props.urlConfirmCA)
            .then((res) => {
                if (res) {
                    if (res.EC != null) {
                        // Has error on show file
                        let err_msg = { text: res.EM + ":" + res.DT, color: "red" }
                        self.setState({ err_msg: err_msg })
                    } else {
                        var Obj = {
                            REF: base64.encode(res),
                            AUTOID: self.props.dataCA.AUTOID,
                            RPTID: self.props.dataCA.RPTID,
                            DESC: '',
                            TLID: self.props.dataCA.TLID,
                            ACTION: action,
                        };
                        RestfulUtils.post('/report/submitCA', Obj).then(function (resData) {
                            if (resData.EC == 0) {
                                // self.refresh()
                                self.closeDialog()
                                self.props.refreshTableReport()
                                toast.success("Xác nhận thành công!", {
                                    position: toast.POSITION.BOTTOM_RIGHT
                                });
                            }
                            else {
                                let err_msg = { text: resData.EM, color: "red" }
                                self.setState({ err_msg: err_msg })
                            }
                        });
                    }
                } else {
                    // Has error on show file
                    let err_msg = { text: "Lỗi lấy dữ liệu XML", color: "red" }
                    self.setState({ err_msg: err_msg })
                }
            });

    }
    render() {
        const { reportParams } = this.state;
        var self = this;
        return (
            <div className='popup-form'>
                <Modal show={this.state.showModal} onHide={this.closeDialog.bind(this)}>
                    <ModalHeader closeButton>
                        <ModalTitle><b>{self.props.dataCA.actionConfirmCA == "A" ? "Xác nhận ký số" : "Từ chối ký số"}</b></ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <table className='table tableCA row-data'>
                            <tbody>
                                <tr>
                                    <td style={{ width: '100px' }}><span>Mã quỹ</span></td>
                                    <td className="col-xs-10"><button type="text" className="form-control inputFixed10 text-left text-CA" readOnly >{self.props.dataCA.SYMBOL}</button></td>
                                </tr>
                                <tr>
                                    <td style={{ width: '100px' }}><span>Phiên giao dịch</span></td>
                                    <td className="col-xs-10"><button type="text" className="form-control inputFixed10 text-left text-CA" readOnly >{self.props.dataCA.TRADINGDATE}</button></td>
                                </tr>
                                <tr>
                                    <td style={{ width: '100px' }}><span>Ngày tạo báo cáo</span></td>
                                    <td className="col-xs-10"><button type="text" className="form-control inputFixed10 text-left text-CA" readOnly >{self.props.dataCA.CRTDATETIME}</button></td>
                                </tr>
                                <tr>
                                    <td style={{ width: '100px' }}><span>Mã báo cáo</span></td>
                                    <td className="col-xs-10"><button type="text" className="form-control inputFixed10 text-left text-CA" readOnly >{self.props.dataCA.RPTID}</button></td>
                                </tr>
                                <tr>
                                    <td style={{ width: '100px' }}><span>Tên báo cáo</span></td>
                                    <td className="col-xs-10"><button type="text" className="form-control inputFixed10 text-left text-CA autoHeight" readOnly >{self.props.dataCA.DESCRIPTION}</button></td>
                                </tr>
                            </tbody>
                        </table>
                        <table className='table tableCA'>
                            <tbody>
                                <tr className="col-md-12" style={{ color: this.state.err_msg.color }}>
                                    <td>{this.state.err_msg.text}</td>
                                </tr>
                                <tr className="trCenter">
                                    <td>
                                        {self.props.dataCA.actionConfirmCA == "A" ?
                                            < button className="btn btn-primary" onClick={this.handleSubmitCA.bind(this, "A")} style={{ marginRight: "10px" }}>Chấp nhận</button>
                                            : <button className="btn btn-primary" onClick={this.handleSubmitCA.bind(this, "R")} style={{ marginRight: "10px" }}>Từ chối</button>}
                                        <button className="btn btn-default" onClick={this.closeDialog.bind(this)}>Thoát</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
export default ComfirmCA;
