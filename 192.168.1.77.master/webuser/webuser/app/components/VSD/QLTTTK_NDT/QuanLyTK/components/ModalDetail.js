import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
var GeneralInfo = require('./GeneralInfo');
import { connect } from 'react-redux'
class ModalDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access: 'add',
            CUSTID: '',
            title: ''
        };
    }
    close() {

        this.props.closeModalDetail();
    }
    componentWillMount() {
        let self = this;
        console.log('willmount')

    }
    componentDidMount() {
        let self = this;
        console.log('didmount')

    }
    componentWillReceiveProps(nextProps) {
        let title = '';
        console.log('willprops')
        if (nextProps.language == 'vie' && nextProps.access == "add") {
            title = 'Má» TĂ€I KHOáº¢N NHĂ€ Äáº¦U TÆ¯'
        }
        if (nextProps.language == 'vie' && nextProps.access == "update") {
            title = 'Sá»¬A TĂ€I KHOáº¢N NHĂ€ Äáº¦U TÆ¯'
        }
        if (nextProps.language == 'en' && nextProps.access == "add") {
            title = 'CREATE CUSTOMER ACCOUNT'
        }
        if (nextProps.language == 'en' && nextProps.access == "update") {
            title = 'EDIT CUSTOMER ACCOUNT'
        }
        console.log('title:', title)
        this.setState({ title: title })

    }
    render() {
        const pageSize = 5;
        console.log(this.props.language, this.props.access)
        let title = this.props.access == "add" ? 'Má» TĂ€I KHOáº¢N NHĂ€ Äáº¦U TÆ¯' : 'Sá»¬A TĂ€I KHOáº¢N NHĂ€ Äáº¦U TÆ¯';
        // if (this.props.language == 'vie' && this.props.access == "add"){
        //     title = 'Má» TĂ€I KHOáº¢N NHĂ€ Äáº¦U TÆ¯'
        // }
        // if (this.props.language == 'vie' && this.props.access == "update"){
        //     title = 'Sá»¬A TĂ€I KHOáº¢N NHĂ€ Äáº¦U TÆ¯'
        // }
        // if (this.props.language == 'en' && this.props.access == "add"){
        //     title = 'Má» TĂ€I KHOáº¢N NHĂ€ Äáº¦U TÆ¯'
        // }
        // if (this.props.language == 'en' && this.props.access == "update"){
        //     title = 'Sá»¬A TĂ€I KHOáº¢N NHĂ€ Äáº¦U TÆ¯'
        // }
        return (
            <Modal show={this.props.showModalDetail} dialogClassName="custom-modal" bsSize="lg" backdropClassName="firstModal">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.state.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">Ă—</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="col-md-12">
                    </div>
                    <div className="panel-body ">
                        <div className="col-md-12 module">

                            <GeneralInfo OBJNAME={this.props.OBJNAME} CUSTID_VIEW={this.props.CUSTID_VIEW}
                                access={this.props.access}
                                closeModalDetail={this.props.closeModalDetail}
                                showModalOTPConfirm={this.props.showModalOTPConfirm}
                                ACCTGRP={this.props.ACCTGRP}
                                CUSTODYCD_VIEW={this.props.CUSTODYCD_VIEW}
                            />
                        </div>

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