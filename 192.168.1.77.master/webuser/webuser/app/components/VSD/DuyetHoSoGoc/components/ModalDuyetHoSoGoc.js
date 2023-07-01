import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableDetailDuyetHoSoGoc from './TableDetailDuyetHoSoGoc'
class ModalDuyetHoSoGoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access: 'add',
            DATA: '',
        };
    }
    close() {
        this.props.closeModalDetail();
    }
    async componentWillReceiveProps(nextProps) {
        this.setState({
            dataAction: {
                p_custid: nextProps.DATA.CUSTID,
                p_custodycd: nextProps.DATA.CUSTODYCD,
                p_fullname: nextProps.DATA.FULLNAME,
                p_status: nextProps.DATA.STATUS,
            },
            access: nextProps.access,
        })
    }
    handleChange(type) {
        this.state.collapse[type] = !this.state.collapse[type];
        this.setState({ collapse: this.state.collapse })
    }
    closeModalDetail() {
        this.props.closeModalDetail()
    }
    loadWhenSuccess() {
        this.props.loadWhenSuccess()
    }
    render() {
        return (
            <Modal show={this.props.showModalDetail} bsSize="lg" >
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <TableDetailDuyetHoSoGoc dataAction={this.state.dataAction} objname={this.props.OBJNAME} closeModalDetail={this.closeModalDetail.bind(this)} access={this.state.access} loadWhenSuccess={this.loadWhenSuccess.bind(this)} />
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
const stateToProps = state => ({
    language: state.language.language,
    tradingdate: state.systemdate.tradingdate
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalDuyetHoSoGoc')
]);
module.exports = decorators(ModalDuyetHoSoGoc);
