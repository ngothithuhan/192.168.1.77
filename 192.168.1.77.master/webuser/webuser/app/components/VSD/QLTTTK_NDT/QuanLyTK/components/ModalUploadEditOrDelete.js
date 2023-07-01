import React, { Component } from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { Modal, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import ReactTable from 'react-table'
// import Dropzone from 'react-dropzone';
import DropdownUtils from 'app/utils/input/DropdownUtils'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { convertDate } from 'app/utils/dateUtils'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import axios from 'axios'
// import LoadingScreen from 'app/utils/actionLoadingScreen';
import { LabelEx } from 'app/utils/LabelEx';


import {
    IMGMAXW,
    IMGMAXH,
} from "../../../../../Helpers";
import FileInput from "app/utils/input/FileInput";
import CommonUtil from '../../../../../../api/common/CommonUtil';

class ModalUploadEditOrDelete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            upload: {
                TYPE: '',
                NOTE: '',
            },
            SIGN_IMG: null,
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
        let DTUploadDetail = this.props.DTUploadDetail
        let obj = {
            ACTION: "EDIT",
            AUTOID: DTUploadDetail.AUTOID,
            CUSTODYCD: DTUploadDetail.CUSTODYCD,
            TYPE: DTUploadDetail.TYPE,
            IMGSIGN: this.state.SIGN_IMG,
            NOTE: this.state.upload.NOTE,
            OBJNAME: this.props.OBJNAME ? this.props.OBJNAME : '',
            language: this.props.language ? this.props.language : "vie"
        }
        // console.log("========Haki=edit", obj, this.state.upload)
        let MsgCheckValidate = this.checkValidate(obj)
        if (MsgCheckValidate == 0) {
            RestfulUtils.post('/account/prc_sy_mt_cfsign', obj).then(function (res) {
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
        let file = e.target.files[0];
        that.setState({ SIGN_IMG: null });
        // console.log("_handleSIGNIMGChange1")

        let isPDF = file.type === 'application/pdf' ? true : false;

        //luồng cũ, với trường hợp upload file ảnh
        if (isPDF === false) {
            reader.onloadend = () => {
                var tempImg = new Image();
                tempImg.src = reader.result;
                tempImg.onload = function () {
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
                    var canvas = document.createElement("canvas");
                    canvas.width = tempW;
                    canvas.height = tempH;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(this, 0, 0, tempW, tempH);
                    var dataURL = canvas.toDataURL("image/png");
                    that.state.SIGN_IMG = dataURL;
                    // console.log("_handleSIGNIMGChange2", dataURL)
                    that.setState(that.state);
                };
            };
            reader.readAsDataURL(file);
        }

        // với trường hợp upload file pdf
        if (isPDF === true) {
            that.setState({
                ...that.state,
                SIGN_IMG: '',
            })
            reader.readAsDataURL(file);
            reader.onload = function () {
                that.setState({
                    ...that.state,
                    SIGN_IMG: reader.result
                })
            };
            reader.onerror = function (error) {
                // error = {
                //     color: 'red',
                //     contentText: 'Đã có lỗi xảy ra, vui lòng thử lại sau'
                // }
                // that.setState({
                //     ...that.state,
                //     SIGN_IMG: '',
                //     error: error
                // })
            };
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
        RestfulUtils.post('/account/prc_sy_mt_cfsign', obj)
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
        let isPDFFilePreivew = false;

        if (SIGN_IMG) {
            isPDFFilePreivew = CommonUtil.isPDFBase64(SIGN_IMG);
            $SIGNIMGPreview = isPDFFilePreivew ?
                <iframe className="imgUpload-pdf" src={SIGN_IMG}></iframe> :
                <img className="imgUpload" src={SIGN_IMG} />
        }

        let IMGbase64 = DTUploadDetail ? DTUploadDetail.SIGNATURE : "";
        let isPDFFile = CommonUtil.isPDFBase64(IMGbase64);


        // console.log("IMGbase64===", IMGbase64)
        // console.log("DTUploadDetail===", DTUploadDetail)

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
                        {ACTION == "EDIT" &&
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
                        }
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
                                    {isPDFFile ?
                                        <iframe src={IMGbase64} className="imgUpload-pdf"></iframe>
                                        :
                                        <img src={IMGbase64} className="imgUpload" />
                                    }
                                </div>
                                <div className="col-md-6 pdl-0 pdr-0">
                                    <div className="imgPreview">
                                        {$SIGNIMGPreview}
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="col-md-12 pdt-5 dl-0 pdr-0">
                                <div className={"col-md-12 pdl-0 pdr-0"}>
                                    {isPDFFile ?
                                        <iframe src={IMGbase64} className="imgUpload-pdf"></iframe>
                                        :
                                        <img src={IMGbase64} className="imgUpload" />
                                    }
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
ModalUploadEditOrDelete.defaultProps = {
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
    translate('ModalUploadEditOrDelete')
]);
module.exports = decorators(ModalUploadEditOrDelete);
