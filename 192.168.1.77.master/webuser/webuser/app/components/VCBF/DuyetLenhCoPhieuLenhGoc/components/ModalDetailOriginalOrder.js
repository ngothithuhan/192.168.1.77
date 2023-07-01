import React, { Component } from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
// import DropdownUtils from 'app/utils/input/DropdownUtils'
import 'react-datepicker/dist/react-datepicker.css';
import CommonUtil from '../../../../../api/common/CommonUtil';
// import FileInput from "app/utils/input/FileInput";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

class ModalDetailOriginalOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        var that = this
    }
    componentWillReceiveProps(nextProps) {
    }
    close() {
        this.props.closeModal()
    }
    submit() {
        this.props.closeModal();
    }
    render() {
        var self = this;
        let { strings, SIGN_IMG, SIGN_IMG_DESC } = this.props;
        let $SIGNIMGPreview = null;
        if (SIGN_IMG) {
            $SIGNIMGPreview = CommonUtil.isPDFBase64(SIGN_IMG) ?
                <iframe className="imgUpload-pdf" src={SIGN_IMG} style={{ minWidth: '100%' }}></iframe> :
                <img className="imgUpload" src={SIGN_IMG} />
        }
        return (
            <Modal show={this.props.showModal} bsSize="modalBigSize">
                <Modal.Header>
                    <Modal.Title><div className="title-content col-md-6">{strings.title}<button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="col-md-12">
                        {/* <div className="col-md-3" style={{ padding: "10px 10px 10px 10px" }}>
                            <div style={{ width: "200px", height: "200px" }}>
                                <img src="./images/logo_SSIAM.png" className="LogoUpload" />
                            </div>
                        </div> */}
                        <div className="col-md-12 modal-upload">
                            <div className="col-md-12">
                                <div className="col-md-3"><h5>{strings.typepaper}</h5></div>
                                <div className="col-md-9">
                                    <input className="form-control" type="text" value={strings.originalOrderImage} disabled={true} />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="col-md-3"><h5>{strings.Note}</h5></div>
                                <div className={"col-md-9"}>
                                    <input className="form-control" type="text" value={SIGN_IMG_DESC} onChange={this.props.onDescChange} disabled={true} />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="col-md-12 pdl-5 pdr-5">
                                    <div className="imgPreview" style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => this.setState({ isOpenSIGN_IMG: true })}>
                                        {$SIGNIMGPreview}
                                        {this.state.isOpenSIGN_IMG && (
                                            <Lightbox
                                                mainSrc={SIGN_IMG}
                                                onCloseRequest={() => this.setState({ isOpenSIGN_IMG: false })}
                                                reactModalStyle={{ overlay: { zIndex: 10000 } }}
                                            />)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="col-md-12 btn-customer-model">
                        <button disabled={SIGN_IMG == null ? true : false} style={{ display: this.props.ACTION == 'VIEW' ? 'none' : 'block', float: 'right' }} onClick={this.submit.bind(this)} className="btn btn-primary" > Đóng</button>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language,
    auth: state.auth
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalDetailOriginalOrder')
]);
module.exports = decorators(ModalDetailOriginalOrder);
