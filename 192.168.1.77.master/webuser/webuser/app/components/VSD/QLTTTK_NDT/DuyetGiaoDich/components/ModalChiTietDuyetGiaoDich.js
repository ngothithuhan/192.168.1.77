import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import TableDuyetGiaoDich from './TableDuyetGiaoDich'
import ModalDetailTrans from './ModalDetailTrans'
import flow from 'lodash.flow';
import { connect } from 'react-redux'
import translate from 'app/utils/i18n/Translate.js';

export default class ModalChiTietDuyetGiaoDich extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            key:{}
        };
    }
    close = () => {
        this.props.close();
    }
    componentWillReceiveProps(nextProps){
        let data = nextProps.sendPropsToShowDetail;
        
        this.setState({key: data})
       
    }
   
    render() {
        let {data} = this.state;
        
        return (
            <Modal show={this.props.showModal}  bsSize={this.props.sendPropsToShowDetail.OBJTYPE=="MT"?"lg":"lg"} dialogClassName={this.props.sendPropsToShowDetail.OBJTYPE=="MT"?'':"custom-modal"}>
                <Modal.Header >
                    <Modal.Title><div className="title-content">{this.props.strings.title}<button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{overflow: "auto"}}>
                    <div className="panel ">
                    {
                       this.props.sendPropsToShowDetail.OBJTYPE=="MT"? <TableDuyetGiaoDich DATA={this.props.sendPropsToShowDetail} KEY={this.state.key} closeModalDetail={this.close} isApprove={this.props.sendPropsToShowDetail.TXSTATUSCD}/> :
                       <ModalDetailTrans DATA={this.props.sendPropsToShowDetail} KEY={this.state.key} closeModalDetail={this.close} isApprove={this.props.sendPropsToShowDetail.TXSTATUSCD}/>
                    }
                       
                       
                    </div>
                </Modal.Body>
            </Modal>

        )
    }
}
const stateToProps = state => ({
    lang: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalChiTietDuyetGiaoDich')
]);

module.exports = decorators(ModalChiTietDuyetGiaoDich);
