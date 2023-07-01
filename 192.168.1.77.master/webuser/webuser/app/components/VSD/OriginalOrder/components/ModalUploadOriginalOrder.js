import React, { Component } from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { Modal, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
// import ReactTable from 'react-table'
// import Dropzone from 'react-dropzone';
// import DropdownUtils from 'app/utils/input/DropdownUtils'
// import DatePicker from 'react-datepicker';
// import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
// import { convertDate } from 'app/utils/dateUtils'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
// import axios from 'axios'
// import LoadingScreen from 'app/utils/actionLoadingScreen';
// import { LabelEx } from 'app/utils/LabelEx';
const Compress = require('compress.js');
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

import {
    IMGMAXW,
    IMGMAXH, MAXSIZE_PDF
} from "app/Helpers";
import FileInput from "app/utils/input/FileInput";
import CommonUtil from '../../../../../api/common/CommonUtil';

class ModalUploadOriginalOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            upload: {
                TYPE: '',
                NOTE: '',
            },
            SIGN_IMG: null,
            err_msg_upload: {},
            urlPreviewPDF: "",
        }
    }
    componentDidMount() {
        var that = this
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.showModalUpload && nextProps.AUTOID != '') {
        //     this.getDetailsUpload(nextProps.CUSTID, nextProps.AUTOID);
        // }
        // if (nextProps.ACTION == 'ADD' && !this.props.showModalUpload) {
        //     this.state.inputPdfValue = '';
        //     this.state.inputImgValue = '';
        //     this.state.imagePreviewUrl = [];
        //     this.state.pdfPreviewUrl = [];
        //     this.setState(this.state);
        // }
        this.state.upload.NOTE = nextProps.DTUploadDetail ? nextProps.DTUploadDetail.NOTE ? nextProps.DTUploadDetail.NOTE : '' : ''
        this.setState({ upload: this.state.upload })
    }
    // getDetailsUpload(CUSTID, AUTOID) {
    //     let self = this;
    //     RestfulUtils.post('/Account/getDetailsInfoUploadFile', { CUSTID, AUTOID }).then(function (resdata) {
    //         self.state.imagePreviewUrl = [];
    //         self.state.pdfPreviewUrl = [];
    //         if (resdata.EC == 0) {
    //             if (resdata.DT.length > 0) {
    //                 if (resdata.DT[0].IMAGETYPE == 'P') {
    //                     self.state.imagePreviewUrl.push('/Account/getDetailsUploadFile?AUTOID=' + resdata.DT[0].AUTOID);
    //                     self.state.activeInputImage = true;
    //                 } else {
    //                     self.state.pdfPreviewUrl.push('/Account/getDetailsUploadFile?AUTOID=' + resdata.DT[0].AUTOID);
    //                     self.state.activeInputImage = false;
    //                 }
    //                 self.state.upload.TYPE = resdata.DT[0].TYPE;
    //             }
    //         }
    //         else {
    //             toast.error(resdata.EM, { position: toast.POSITION.BOTTOM_RIGHT });
    //         }
    //         self.setState(self.state);
    //     });
    // }
    refresh() {
        this.setState({
            upload: {
                TYPE: ''
            },
            SIGN_IMG: null
        })
    }
    close() {
        this.props.closeModalDetail()
        this.refresh()
    }
    onChange(type, event) {
        if (event.target) {
            this.state.upload[type] = event.target.value;
        }
        else {
            this.state.upload[type] = event.value;
        }
        this.setState({ upload: this.state.upload })
    }

    // onChange(type, event) {
    //     let data = {};
    //     if (event.target) {
    //         this.state.upload[type] = event.target.value;
    //     }
    //     else {
    //         this.state.upload[type] = event.value;
    //     }
    //     console.log("===Onchange=====Haki=", this.state.upload)
    //     this.setState({ upload: this.state.upload })
    // }
    checkValidate(data) {
        if (!data.CUSTODYCD || data.CUSTODYCD == undefined || data.CUSTODYCD == "") {
            return 1
        }
        if (!data.TYPE || data.TYPE == undefined || data.TYPE == "") {
            return 2
        }
        if (data.ACTION == "EDIT") {
            if (!data.IMGSIGN || data.IMGSIGN == undefined || data.IMGSIGN == "") {
                return 3
            }
        }
        return 0
    }
    refreshList() {
        this.props.refreshList()
    }
    edit() {
        let self = this;
        let { strings } = this.props;
        let DTUploadDetail = this.props.DTUploadDetail;
        let obj = {
            ACTION: "EDIT",
            AUTOID: DTUploadDetail.AUTOID,
            CUSTODYCD: DTUploadDetail.CUSTODYCD,
            TYPE: DTUploadDetail.TYPE,
            ORDERID: DTUploadDetail.ORDERID,
            IMGSIGN: this.state.SIGN_IMG,
            NOTE: this.state.upload.NOTE,
            OBJNAME: this.props.OBJNAME ? this.props.OBJNAME : '',
            language: this.props.language ? this.props.language : "vie"
        }
        // console.log("========Haki=edit", obj, this.state.upload)
        let MsgCheckValidate = this.checkValidate(obj)
        if (MsgCheckValidate == 0) {
            RestfulUtils.post('/order/prc_sy_mt_originalorder', obj).then(function (res) {
                if (res.EC == 0) {
                    toast.success(strings.success, { position: toast.POSITION.BOTTOM_RIGHT });
                    self.close()
                    // self.refresh()
                    self.refreshList()
                }
                else {
                    toast.error(res.EM, { position: toast.POSITION.BOTTOM_RIGHT });
                }
            });
        }
        else {
            toast.error(this.props.strings["Error" + MsgCheckValidate], { position: toast.POSITION.BOTTOM_RIGHT })
        }
    }
    _handleSIGNIMGChange = e => {
        e.preventDefault();
        let that = this;
        let reader = new FileReader();
        const compress = new Compress();
        const files = [...e.target.files];
        let file = e.target.files[0];
        let urlPreviewPDF = '';
    
        let isPDF = file.type === 'application/pdf' ? true : false;
        if (isPDF === true) {
            if (file.size > MAXSIZE_PDF) {
                let error = {
                    color: 'red',
                    contentText: this.props.strings.errorSizePDF
                }
                this.setState({ err_msg_upload: error, urlPreviewPDF: '', SIGN_IMG: null })
                return;
            } else {
                urlPreviewPDF = URL.createObjectURL(file)
            }
        }
        if (file.type !== 'image/jpeg'
            && file.type !== 'image/png'
            && file.type !== 'application/pdf') {
            console.log('this.props.strings.errorFileType:', this.props.strings.errorFileType)
            let error = {
                color: 'red',
                contentText: this.props.strings.errorFileType
            }
            this.setState({ err_msg_upload: error, urlPreviewPDF: '', SIGN_IMG: null })
        }
        else {
            let error = { color: 'red', contentText: '' }
            this.setState({ err_msg_upload: error, urlPreviewPDF: '', SIGN_IMG: null })
    
            //luồng xử lý preview ảnh 
            if (isPDF === false) {
                reader.onloadend = () => {
                    compress.compress(files, {
                        size: 0.2, // the max size in MB, defaults to 2MB
                        quality: 0.75, // the quality of the image, max is 1,
                        maxWidth: 1920, // the max width of the output image, defaults to 1920px
                        maxHeight: 1920, // the max height of the output image, defaults to 1920px
                        resize: true, // defaults to true, set false if you do not want to resize the image width and height
                    }).then((results) => {
                        const img1 = results[0]
                        const base64str = img1.data
                        const imgPrefix = img1.prefix
                        const dataBase64 = imgPrefix + base64str
                        var tempImg = new Image();
                        var MAX_WIDTH = IMGMAXW;
                        var MAX_HEIGHT = IMGMAXH;
                        var tempW = tempImg.width;
                        var tempH = tempImg.height;
                        if (tempW > tempH) {
                            if (tempW > MAX_WIDTH) {
                                tempH *= MAX_WIDTH / tempW;
                                tempW = MAX_WIDTH;
                            }
                        } else {
                            if (tempH > MAX_HEIGHT) {
                                tempW *= MAX_HEIGHT / tempH;
                                tempH = MAX_HEIGHT;
                            }
                        }
                        tempImg.src = dataBase64
                        tempImg.onload = function () {
                            var canvas = document.createElement("canvas");
                            canvas.width = tempW;
                            canvas.height = tempH;
                            var ctx = canvas.getContext("2d");
                            ctx.drawImage(this, 0, 0, tempW, tempH);
                            that.state.SIGN_IMG = dataBase64;
                            that.setState(that.state);
                        };
                    })
                };
                reader.readAsDataURL(file);
            } else {
                //luồng xử lý file preview pdf
                that.setState({
                    urlPreviewPDF: urlPreviewPDF,
                })
                reader.readAsDataURL(file);
                reader.onload = function () {
                    that.setState({
                        ...that.state,
                        SIGN_IMG: reader.result
                    })
                };
                reader.onerror = function (error) {
                    error = {
                        color: 'red',
                        contentText: 'Đã có lỗi xảy ra, vui lòng thử lại sau'
                    }
                    that.setState({
                        ...that.state,
                        urlPreviewPDF: '',
                        SIGN_IMG: null,
                        err_msg_upload: error
                    })
                };
            }
        }
    };
    delete() {
        let self = this;
        let { strings } = this.props;
        let DTUploadDetail = this.props.DTUploadDetail
        let obj = {
            ACTION: "DELETE",
            AUTOID: DTUploadDetail.AUTOID,
            CUSTODYCD: DTUploadDetail.CUSTODYCD,
            TYPE: DTUploadDetail.TYPE,
            IMGSIGN: "",
            NOTE: this.state.upload.NOTE,
            OBJNAME: this.props.OBJNAME ? this.props.OBJNAME : '',
            language: this.props.language ? this.props.language : "vie"
        }
        // console.log("========Haki=delete", obj, this.state.upload)
        RestfulUtils.post('/order/prc_sy_mt_originalorder', obj)
            .then(res => {
                if (res.EC == 0) {
                    toast.success(strings.success, { position: toast.POSITION.BOTTOM_RIGHT });
                    self.close()
                    // self.refresh()
                    self.refreshList()
                }
                else {
                    toast.error(res.EM, { position: toast.POSITION.BOTTOM_RIGHT });
                }
            })
    }
    render() {
        var self = this;
        let { strings } = this.props;
        let { SIGN_IMG } = this.state;
        let ACTION = this.props.ACTION ? this.props.ACTION : ""
        let DTUploadDetail = this.props.DTUploadDetail ? this.props.DTUploadDetail : {}
        let $SIGNIMGPreview = null;
        if (SIGN_IMG) {
            $SIGNIMGPreview = CommonUtil.isPDFBase64(SIGN_IMG) ?
                <iframe className="imgUpload-pdf" src={SIGN_IMG} style={{ minWidth: '100%'}}></iframe> :
                <img className="imgUpload" src={SIGN_IMG} style={{ width: '100%', height: '100%' }} />
        }

        let IMGbase64 = DTUploadDetail ? DTUploadDetail.SIGNATURE : ""
        let $OLDSIGNIMAGE = null;
        if (IMGbase64) {
            $OLDSIGNIMAGE = CommonUtil.isPDFBase64(IMGbase64) ?
                <iframe className="imgUpload-pdf" src={IMGbase64} style={{ minWidth: '100%'}}></iframe> :
                <img className="imgUpload" src={IMGbase64} style={{ width: '100%', height: '100%' }}  />
        }

        // console.log("IMGbase64===", IMGbase64)
        // console.log("DTUploadDetail===", DTUploadDetail)
        console.log("DTUploadDetail=Haki=ACTION==", ACTION)
        return (
            <Modal show={this.props.showModalDetail} bsSize="modalBigSize">
                {/* <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}> */}
                <Modal.Header>
                    <Modal.Title><div className="title-content col-md-6">{ACTION == "VIEW" ? strings.titleDetail : ACTION == "EDIT" ? strings.titleEdit : strings.titleDelete}<button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="">
                        {/* <div className="col-md-4" style={{ padding: "10px 10px 10px 10px" }}>
                            <div style={{ width: "200px", height: "200px" }}>
                                <img src="./images/logo.png" />
                            </div>
                        </div> */}
                        <div className="col-xs-12">
                            <div className="container panel panel-success col-xs-12 pdl-0 pdr-0">
                                <div className="mgt-10 customSelect">
                                    <div className="col-xs-6">
                                        <h5 className="col-xs-4"><b>{strings.custodycd}</b></h5>
                                        <div className="col-xs-8">
                                            <label className="form-control txtInput28" disabled >{DTUploadDetail.CUSTODYCD} </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-6">
                                    <h5 className="col-xs-4"><b>{strings.fullname}</b></h5>
                                    <div className="col-xs-8">
                                        <label className="form-control txtInput28" disabled >{DTUploadDetail.FULLNAME} </label>
                                    </div>
                                </div>
                                <div className="col-xs-6">
                                    <h5 className="col-xs-4"><b>{strings.typepaper}</b></h5>
                                    <div className="col-xs-8">
                                        <label className="form-control txtInput28" disabled >{DTUploadDetail.TYPENAME} </label>
                                    </div>
                                </div>
                                <div className="col-xs-6">
                                    <h5 className="col-xs-4"><b>{strings.idcode}</b></h5>
                                    <div className="col-xs-8">
                                        <label className="form-control txtInput28" disabled >{DTUploadDetail.IDCODE} </label>
                                    </div>
                                </div>
                                <div className="col-xs-6">
                                    <h5 className="col-xs-4"><b>{strings.status}</b></h5>
                                    <div className="col-xs-8">
                                        <label className="form-control txtInput28" disabled >{DTUploadDetail.STATUSDESC} </label>
                                    </div>
                                </div>
                                <div className="col-xs-6">
                                    <h5 className="col-xs-4"><b>{strings.iddate}</b></h5>
                                    <div className="col-xs-8">
                                        <label className="form-control txtInput28" disabled >{DTUploadDetail.IDDATE} </label>
                                    </div>
                                </div>
                                <div className="col-xs-6">
                                    <h5 className="col-xs-4"><b>{strings.dateupload}</b></h5>
                                    <div className="col-xs-8">
                                        <label className="form-control txtInput28" disabled >{DTUploadDetail.LASTCHANGE} </label>
                                    </div>
                                </div>
                                <div className="col-xs-6">
                                    <h5 className="col-xs-4"><b>{strings.typepaper}</b></h5>
                                    <div className="col-xs-8">
                                        <label className="form-control txtInput28" disabled >{DTUploadDetail.TYPENAME} </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {ACTION == "EDIT" ?
                            <div className="col-md-12 pdl-0 pdr-0">
                                <div className="col-xs-6 pdl-0 pdr-0">
                                    <div className="col-md-4">
                                        <FileInput
                                            className="btn btn-primary"
                                            id="btnSignImg"
                                            onChange={this._handleSIGNIMGChange}
                                        />
                                    </div>
                                    <div className="col-md-8"><h5 style={{ fontSize: "14px" }}>{strings.SizeImage}</h5></div>
                                </div>
                            </div>
                            : null}
                        {ACTION == "EDIT" ?
                            <div className="col-md-12 pdl-0 pdr-0">
                                <div className={"col-md-6"}><b>{strings.lblDetailImgOld}</b></div>
                                <div className={"col-md-6"}><b>{strings.lblDetailImgNew}</b></div>
                            </div>
                            :
                            <div className="col-md-12 pdl-0 pdr-0">
                                <div className={"col-md-6"}><b>{strings.lblDetailImg}</b></div>
                            </div>}
                        {ACTION == "EDIT" ?
                            <div className="col-md-12 pdt-5 pdl-0 pdr-0">
                                <div className="col-md-6 pdl-0 pdr-0">
                                    {/* {$OLDSIGNIMAGE} */}
                                    <div className="imgPreview" style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => this.setState({ isOpenOLDSIGN_IMG: true })}>
                                        {$OLDSIGNIMAGE}
                                        {this.state.isOpenOLDSIGN_IMG && (
                                            <Lightbox
                                                mainSrc={IMGbase64}
                                                onCloseRequest={() => this.setState({ isOpenOLDSIGN_IMG: false })}
                                                reactModalStyle={{ overlay: { zIndex: 10000 } }}
                                            />)
                                        }
                                    </div>
                                </div>
                                <div className="col-md-6 pdl-0 pdr-0">
                                    {this.state.err_msg_upload.contentText && (
                                        <div id="error" className="offset-6 col-md-12" style={{
                                            color: this.state.err_msg_upload.color,
                                            paddingLeft: "28px",
                                            paddingBottom: "7px",
                                            paddingTop: "12px",
                                            fontWeight: "bold"
                                        }}>{this.state.err_msg_upload.contentText}</div>
                                    )}
                                    {/* {$SIGNIMGPreview} */}
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
                                </div>
                            </div>
                            :
                            <div className="col-md-12 pdt-5 dl-0 pdr-0">
                                <div className={"col-md-12 pdl-0 pdr-5 text-center"}>
                                    {/* {$OLDSIGNIMAGE} */}
                                    <div className="imgPreview" style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => this.setState({ isOpenOLDSIGN_IMG: true })}>
                                        {$OLDSIGNIMAGE}
                                        {this.state.isOpenOLDSIGN_IMG && (
                                            <Lightbox
                                                mainSrc={IMGbase64}
                                                onCloseRequest={() => this.setState({ isOpenOLDSIGN_IMG: false })}
                                                reactModalStyle={{ overlay: { zIndex: 10000 } }}
                                            />)
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="col-md-12 pdt-5 pdl-0 pdr-0 pdt-10">
                            <h5 className="col-xs-2 "><b>{strings.Note}</b></h5>
                            <div className={"col-md-9"}>
                                <input className="form-control" disabled={ACTION == "VIEW" ? true : SIGN_IMG == null ? true : false} type="text" value={this.state.upload ? this.state.upload.NOTE : ''} onChange={this.onChange.bind(this, "NOTE")} />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="col-md-12 btn-customer-model">
                        {ACTION == "EDIT" ?
                            <button disabled={SIGN_IMG == null ? true : false} style={{ float: 'right' }} onClick={this.edit.bind(this)} className="btn btn-primary" > {strings.Submit}</button>
                            :
                            ACTION == "DELETE" ?
                                <button style={{ float: 'right' }} onClick={this.delete.bind(this)} className="btn btn-primary" > {strings.Submit}</button>
                                : null
                        }
                    </div>
                </Modal.Footer>
            </Modal >
        );
    }
}
ModalUploadOriginalOrder.defaultProps = {
    strings: {
        titleEdit: 'Thay đổi file upload thông tin tài khoản',
        titleDelete: 'Xóa file upload thông tin tài khoản'
    },
};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language,
    auth: state.auth
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalUploadOriginalOrder')
]);
module.exports = decorators(ModalUploadOriginalOrder);
