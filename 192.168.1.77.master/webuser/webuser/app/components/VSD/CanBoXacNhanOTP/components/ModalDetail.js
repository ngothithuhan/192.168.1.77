import React from 'react';
import { Modal } from 'react-bootstrap';

import CanBoXacNhanOTP from './CanBoXacNhanOTP';
class ModalDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    close() {
        if (this.props.closeModalDetail)
            this.props.closeModalDetail();
    }
    render() {
        
        return (
            <div>
                <Modal show={this.props.showModalDetail} >
                    <Modal.Header >
                        <Modal.Title><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                        <div className="panel-body ">
                            <CanBoXacNhanOTP confirmSuccess={this.props.confirmSuccess} OBJNAME={this.props.OBJNAME} isMini={true} dataOTP={this.props.dataOTP} access={this.props.access} />
                    </div>
                    </Modal.Body>

                </Modal>
            </div>
        )
    }
}

export default ModalDetail;