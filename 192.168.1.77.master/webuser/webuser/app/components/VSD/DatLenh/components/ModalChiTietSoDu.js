import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import RestfulUtil from "app/utils/RestfulUtils";

export default class ModalChiTietSoDu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avaiBalanceDetails: [],
            showModal: false
        };
    }
    close = () => {
        this.setState({ showModal: false });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.sendPropsToShowDetail.CUSTODYCD && nextProps.sendPropsToShowDetail.CODEID) {
            let data = nextProps.sendPropsToShowDetail;
            RestfulUtil.post('/balance/getfundbalancedetails', data)
                .then((resData) => {
                    if (resData.EC == 0) {
                        this.setState({ avaiBalanceDetails: resData.DT })
                    }
                    else {
                        console.log('getFundBalanceDetails error', resData);
                    }
                });
        }
        if (nextProps.showModal) {
            this.setState({ showModal: nextProps.showModal });
        }
    }
    render() {
        let { avaiBalanceDetails } = this.state;
        return (
            <Modal show={this.state.showModal} onHide={this.close} bsSize="large">
                <Modal.Header closeButton>
                    <Modal.Title><div className="title-content">Chi tiết</div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto" }}>
                    <div className="panel panel-success modal-chitiet">
                        <table className="table table-hover" >
                            <thead>
                                <tr className="head">
                                    <th>Mã CCQ</th>
                                    <th>Khả dụng</th>
                                    <th>Chờ giao</th>
                                    <th>Chờ nhận</th>
                                    <th>Chờ chuyển</th>
                                    <th>Ký quỹ</th>
                                    <th>Ngày phát sinh</th>
                                    <th>Loại </th>
                                    <th>Sản phẩm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.avaiBalanceDetails.map(function (i, index) {
                                    return (
                                        <tr key={index}>
                                            <td ><span style={{float:'left',paddingLeft:'5px'}}>{i.SYMBOL}</span></td>
                                            <td ><span style={{float:'right',paddingRight:'5px'}}>{i.AVLQTTY}</span></td>
                                            <td ><span style={{float:'right',paddingRight:'5px'}}>{i.NETTING}</span></td>
                                            <td ><span style={{float:'right',paddingRight:'5px'}}>{i.REVEIVING}</span></td>
                                            <td ><span style={{float:'right',paddingRight:'5px'}}>{i.SENDDING}</span></td>
                                            <td ><span style={{float:'right',paddingRight:'5px'}}>{i.SECURED}</span></td>
                                            <td ><span style={{float:'left',paddingLeft:'5px'}}>{i.TXDATE}</span></td>
                                            <td ><span style={{float:'left',paddingLeft:'5px'}}>{i.NORS_DESC}</span></td>
                                            <td ><span style={{float:'left',paddingLeft:'5px'}}>{i.SPNAME}</span></td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
            </Modal>

        )
    }
}
