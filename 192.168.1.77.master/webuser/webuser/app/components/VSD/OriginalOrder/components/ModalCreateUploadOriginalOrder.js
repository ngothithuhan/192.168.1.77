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
} from "app/Helpers";
import FileInput from "app/utils/input/FileInput";

class ModalCreateUploadOriginalOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            upload: {
                TYPE: '',
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
        if (!data.IMGSIGN || data.IMGSIGN == undefined || data.IMGSIGN == "") {
            return 3
        }
        return 0
    }
    refreshList() {
        this.props.refreshList()
    }
    submit() {
        let self = this;
        let { strings } = this.props;
        let obj = {
            ACTION: this.props.ACTION,
            CUSTODYCD: this.props.CUSTODYCD,
            TYPE: this.state.upload.TYPE ? this.state.upload.TYPE : "",
            IMGSIGN: this.state.SIGN_IMG,
            NOTE: this.state.upload.NOTE != "" ? this.state.upload.NOTE : "Add new file upload",
            OBJNAME: this.props.OBJNAME ? this.props.OBJNAME : '',
            language: this.props.language ? this.props.language : "vie"
        }
        // console.log("========Haki=", obj, this.state.upload)
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
        let file = e.target.files[0];
        that.setState({ SIGN_IMG: null });
        // console.log("_handleSIGNIMGChange_0")
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
                // console.log("_handleSIGNIMGChange_00", dataURL)
                that.setState(that.state);
            };
        };
        reader.readAsDataURL(file);
    };
    render() {
        var self = this;
        let { strings } = this.props;
        let { SIGN_IMG } = this.state;
        let $SIGNIMGPreview = null;
        if (SIGN_IMG) {
            $SIGNIMGPreview = (
                <img
                    className="imgUpload"
                    src={SIGN_IMG}
                />
            );
        }
        // console.log("SIGN_IMG0===", SIGN_IMG)
        return (
            <Modal show={this.props.showModalDetail} bsSize="modalBigSize">
                {/* <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}> */}
                <Modal.Header>
                    <Modal.Title><div className="title-content col-md-6">{strings.title}<button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="col-md-12">
                        <div className="col-md-3" style={{ padding: "10px 10px 10px 10px" }}>
                            <div style={{ width: "200px", height: "200px" }}>
                                {
                                    this.props.lang == 'vie' ? <img src="./images/Logo_VN.png" className="LogoUpload" />
                                        : <img src="./images/Logo_VN.png" className="LogoUpload" />

                                }
                            </div>
                        </div>
                        <div className="col-md-9 modal-upload">
                            <div className="col-md-12">
                                <div className="col-md-3"><h5>{strings.typepaper}</h5></div>
                                <div className="col-md-9">
                                    <DropdownUtils disabled={true} IsNULL={true} typeValue="CDVAL" typeLabel="CDCONTENT" value={this.state.upload["TYPE"]} callApi={true} onChange={this.onChange.bind(this)} type="TYPE" CDID="" urlApi="/allcode/getlist" optionFilter={{ CDNAME: { value: "IMGORIGINALORDERTYPE", isFilter: true, checkFilter: true }, CDTYPE: { value: "OD", isFilter: true, checkFilter: true } }} />
                                    {/* <DropdownUtils IsNULL={true} CDVAL={this.state.upload["TYPE"]} value="TYPE" CDTYPE="CF" CDNAME="IMGTYPE" onChange={this.onChange.bind(this)} /> */}
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="col-md-3"><h5>{strings.Note}</h5></div>
                                <div className={"col-md-9"}>
                                    <input className="form-control" type="text" value={this.state.upload.NOTE} onChange={this.onChange.bind(this, "NOTE")} />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="col-md-12 pdt-8 pdl-0 pdr-0">
                                    <div className="col-md-3">
                                        <FileInput
                                            className="btn btn-primary"
                                            id="btnSignImg"
                                            onChange={this._handleSIGNIMGChange}
                                        />
                                    </div>
                                    <div className="col-md-9"><h5>{strings.SizeImage}</h5></div>
                                </div>
                                <div className="col-md-12 pdl-5 pdr-5">
                                    <div className="imgPreview">{$SIGNIMGPreview}</div>
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
ModalCreateUploadOriginalOrder.defaultProps = {
    strings: {
        // title: 'Thêm mới file upload thông tin tài khoản'
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
    translate('ModalCreateUploadOriginalOrder')
]);
module.exports = decorators(ModalCreateUploadOriginalOrder);
