import React, { Component } from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import ReactTable from 'react-table'
var LenhChuaNhapOTP_main = require('./LenhChuaNhapOTP_main');
import { Route, Link } from 'react-router-dom'
import { Collapse, Well } from 'react-bootstrap'

import { connect } from 'react-redux'

class ModalDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: {
                general: true,
                authorize: false,
                fatca: false,
                upload: false,
                quydangki: false,
            },
            display: {
                fatca: false,
                authorize: false
            },
            access: 'add',
            CUSTID: '',
            disabled: false,
            new_create: false
        };
    }
    collapse(tab) {
        // console.log(tab)
        this.state.collapse[tab] = !this.state.collapse[tab];
        // console.log(this.state.collapse)
        this.setState({ collapse: this.state.collapse })
    }
    //   handleChange(type){
    //     this.props.handleChange(type);

    //  }
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
            this.setState({
                display: {
                    fatca: true,
                    authorize: true,
                    upload: true,
                    quydangki: true
                }
            })
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
  
    createSuccess(CUSTID, access, new_create) {
        this.setState(
            {
                display: {
                    fatca: true,
                    authorize: true,
                    upload: true,
                    quydangki: true
                },
                access: 'update',
                CUSTID: CUSTID,
                new_create
            }
        )
        this.props.createSuccess(access);

    }
    handleChange(type) {
        this.state.collapse[type] = !this.state.collapse[type];
        this.setState({ collapse: this.state.collapse })
    }
    render() {
        const pageSize = 5;

        return (
            <Modal show={this.props.showModalDetail} onHide={this.close.bind(this)} >
                <Modal.Header >
                    <Modal.Title><div className="title-content col-md-6">Xác nhận lệnh <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">

                        <LenhChuaNhapOTP_main new_create={this.state.new_create} CUSTID_VIEW={this.props.CUSTID_VIEW}
                            access={this.props.access}
                            createSuccess={this.createSuccess.bind(this)}
                            handleChange={this.handleChange.bind(this)}
                            data={this.props.data}
                        />
                    </div>




                </Modal.Body>

            </Modal>
        );
    }
}
module.exports = connect(function (state) {
    return { auth: state.auth }
})(ModalDetail);
// export default ModalDetail;
