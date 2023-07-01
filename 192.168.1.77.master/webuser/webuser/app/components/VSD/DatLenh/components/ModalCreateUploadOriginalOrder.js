import React, { Component } from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
// import DropdownUtils from 'app/utils/input/DropdownUtils'
import 'react-datepicker/dist/react-datepicker.css';
import FileInput from "app/utils/input/FileInput";
import CommonUtil from '../../../../../api/common/CommonUtil';
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

class ModalCreateUploadOriginalOrder extends Component {
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
        let { strings, SIGN_IMG, SIGN_IMG_DESC, urlPreviewPDF, err_msg_upload } = this.props;
        let $SIGNIMGPreview = null;
        if (SIGN_IMG && !CommonUtil.isPDFBase64(SIGN_IMG)) {
            $SIGNIMGPreview = (
                <img
                    className="imgUpload"
                    src={SIGN_IMG}
                />
            );
        }
        return (
            <Modal show={this.props.showModal} bsSize="modalBigSize">
                <Modal.Header>
                    <Modal.Title><div className="title-content col-md-6">{strings.title}<button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="col-md-12">
                        <div className="col-md-3" style={{ padding: "10px 10px 10px 10px" }}>
                            <div style={{ width: "200px", height: "200px" }}>
                                <img src="./images/logo_SSIAM.png" className="LogoUpload" />
                            </div>
                        </div>
                        <div className="col-md-9 modal-upload">
                            <div className="col-md-12">
                                <div className="col-md-3"><h5>{strings.typepaper}</h5></div>
                                <div className="col-md-9">
                                    {/* <DropdownUtils disabled={true} IsNULL={true} typeValue="CDVAL" typeLabel="CDCONTENT" value={this.state.upload["TYPE"]} callApi={true} type="TYPE" CDID="" urlApi="/allcode/getlist" optionFilter={{ CDNAME: { value: "IMGORIGINALORDERTYPE", isFilter: true, checkFilter: true }, CDTYPE: { value: "OD", isFilter: true, checkFilter: true } }} /> */}
                                    <input className="form-control" type="text" value={strings.originalOrderImage} disabled={true} />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="col-md-3"><h5>{strings.Note}</h5></div>
                                <div className={"col-md-9"}>
                                    <input className="form-control" type="text" value={SIGN_IMG_DESC} onChange={this.props.onDescChange} />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="col-md-12 pdt-8 pdl-0 pdr-0">
                                    <div className="col-md-3">
                                        <FileInput
                                            className="btn btn-primary"
                                            id="btnSignImg"
                                            onChange={this.props.handleSIGNIMGChange}
                                        />
                                    </div>
                                    <div className="col-md-9"><h5>{strings.SizeImage} ({strings.sizePDF})</h5></div>
                                </div>
                                <div id="error" className="col-md-12" style={{
                                    color: err_msg_upload && err_msg_upload.color,
                                    paddingLeft: "28px",
                                    paddingBottom: "7px",
                                    paddingTop: "12px",
                                    fontWeight: "bold"
                                }}>{err_msg_upload && err_msg_upload.contentText}</div>
                                <div className="col-md-12 pdl-5 pdr-5">
                                    <div className="imgPreview" style={{ cursor: 'pointer' }} onClick={() => this.setState({ isOpenSIGN_IMG: true })}>
                                        {$SIGNIMGPreview}
                                        {this.state.isOpenSIGN_IMG && (
                                            <Lightbox
                                                mainSrc={SIGN_IMG}
                                                onCloseRequest={() => this.setState({ isOpenSIGN_IMG: false })}
                                                reactModalStyle={{ overlay: { zIndex: 10000 } }}
                                            />)
                                        }
                                    </div>
                                    {urlPreviewPDF &&
                                        <div className="pdfPreview" style={{ height: '400px' }}>
                                            <iframe src={urlPreviewPDF} width='100%' height='100%' style={{ border: 'none' }}>
                                            </iframe>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="col-md-12 btn-customer-model">
                        <button disabled={SIGN_IMG == null ? true : false} style={{ display: this.props.ACTION == 'VIEW' ? 'none' : 'block', float: 'right' }} onClick={this.submit.bind(this)} className="btn btn-primary" > Chấp nhận</button>
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
    translate('ModalCreateUploadOriginalOrder')
]);
module.exports = decorators(ModalCreateUploadOriginalOrder);
