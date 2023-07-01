import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
// import { injectIntl, FormattedMessage } from 'react-intl';
import * as queryString from 'query-string';
// import * as actions from '../../../store/actions';
// import { ToastUtil, KeyCodeUtils, LanguageUtils, CommonUtils } from '../../../utils';
import Webcam from "react-webcam";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './TestCamFace.scss';
import $ from "jquery";
// import ekycServer from "../../../services/ekycServer";

import { emitter } from "app/utils/emitter.js";
// import { Event } from "../../../../src/utils";


const DEFAULT_MIN_OPNPOINT = 90;

const videoConstraints = {
    // width: "100vw",
    height: 328,
    width: 500,
    facingMode: "user"
};

function urltoFile(url, filename, mimeType) {
    return (fetch(url)
        .then(function (res) { return res.arrayBuffer(); })
        .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
    );
}

class TestCamFace extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imagePreviewUrl: [],
            // inputImgValue: {
            //     'F': undefined,
            //     'B': undefined,
            // },
            imgfiles: undefined,
            imgtypefiles: 'png',// Máº·c Ä‘á»‹nh
            isShowTake: undefined,
            isShowDeleteIcon: false,
            webcamRef: "webcamRef",
            msg_error: undefined
        }
        // console webcamRef = React.useRef(null)
        this.listenToTheEmitter();
    }
    listenToTheEmitter = () => {
        let self = this
        emitter.on(Event.DO_SUBMIT_COMPARE_FILE_AND_FACE, data => {
            self.compareFlieAndFaceByServerEkyc(data)
        });
        emitter.on(Event.DO_SHOW_TAKE_PHOTO, data => {
            // auto click 'chá»n chá»¥p'
            self.show_take_photo()
        });

    }
    componentDidMount() {
        // ekycServer.getInfoClient()
    }

    checkRightFaceByServerEkyc = async (obj) => {
        // let data = {
        //     'img': obj.hash,
        //     // 'client_session': 'TEST-FROM-FSS.:checkRightFaceByServerEkyc()'
        //     'client_session': ''
        // }
        // return ekycServer.checkRightFaceByServerEkyc(data)
    }

    checkHideFaceByServerEkyc = async (obj) => {
        // let data = {
        //     'img': obj.hash,
        //     "face_bbox": '',
        //     "face_lmark": '',
        //     // 'client_session': 'TEST-FROM-FSS.:checkHideFaceByServerEkyc()'
        //     'client_session': ''
        // }
        // return ekycServer.checkHideFaceByServerEkyc(data)
    }

    doCompareFileFrontByServerEkyc = async (obj) => {
        // let data = {
        //     'img_front': obj.img_front,
        //     'img_face': obj.hash,
        //     // 'client_session': 'TEST-FROM-FSS.:doCompareFileFrontByServerEkyc()'
        //     'client_session': ''
        // }
        // return ekycServer.compareFlieAndFaceByServerEkyc(data)
    }
    checkValidate = (dataCompare) => {
        console.log('checkValidate.C:dataFront=', dataCompare)
        return true
    }
    ClearFile = () => {
        let self = this
        self.setState({
            imagePreviewUrl: [],
            // inputImgValue,
            imgfiles: undefined,
            imgtypefiles: 'png',// Máº·c Ä‘á»‹nh
            isShowTake: undefined,
            isShowDeleteIcon: false,
            msg_error: undefined
        })
        self.resetChangeFile()
        $("#upload-image-files-face").val('');
    }
    resetChangeFile = async () => {
        let self = this
        let objReset = {
            img_face: undefined,
            file_face: undefined,
            opnpoint: '0',
            img_face_type: ''
        }
        // reset thĂ´ng tin
        await self.props.onChangeAllData(objReset)
    }
    compareFlieAndFaceByServerEkyc = async () => {
        // alert('compareFlieAndFaceByServerEkyc')
        // CommonUtils.showLoaderScreen()
        let self = this
        let { imgfiles, imgtypefiles, imagePreviewUrl, inputImgValue } = this.state;
        let { allData } = this.props
        // Img máº·t trÆ°á»›c
        let dataFace
        self.setState({
            dataFace: undefined,
        })
        await self.resetChangeFile()
        let file = imgfiles ? imgfiles[0] : undefined
        console.log('compareFlieAndFaceByServerEkyc.FACE:file=============', file)
        let rs1, rs2, rs3, rs4, dt1, dt2, dt3, dt4
        let msg_error = undefined
        let check = false
        let is_show_msg = true

        if (file) {
            dataFace = {
                file: file,
                title: 'compareFlieAndFaceByServerEkyc title',
                description: 'compareFlieAndFaceByServerEkyc description'

            }
            //1. Upload áº£nh
            // return null
            try {
                // let dataCompare = {}
                // await ekycServer.addFileServerEkyc(dataFace).then(async (res) => {
                //     if (res && res.object) {
                //         // console.log('compareFlieAndFaceByServerEkyc.FACE:file.:rs============', res, res.message, res.object, res.object.hash)
                //         // console.log('compareFlieAndFaceByServerEkyc.FACE:file.:hash============', res.object.hash)

                //         // 7. API so sĂ¡nh khuĂ´n máº·t trĂªn giáº¥y tá» vá»›i máº·t chĂ¢n dung
                //         let obj = { ...res.object, img_front: allData.img_front }

                //         if (obj.img_front && obj.img_front != "") {
                //             rs2 = await self.checkRightFaceByServerEkyc(obj)
                //             if (rs2 && rs2.message == 'IDG-00000000') {
                //                 dt2 = rs2.object
                //                 // Haki.: Táº¡m pass qua trÆ°á»ng há»£p dt2.liveness == "failure"
                //                 // if (dt2 && (dt2.liveness == "success" || dt2.liveness == "failure")) {
                //                 if (dt2 && (dt2.liveness == "success")) {
                //                     // rs3 = await self.checkHideFaceByServerEkyc(obj)
                //                     // if (rs3 && rs3.masked == 'IDG-00000000') {
                //                     //     dt3 = rs3.object
                //                     //     if (dt3 && rs3.masked == "yes") {
                //                     rs4 = await self.doCompareFileFrontByServerEkyc(obj)
                //                     if (rs4 && rs4.message == 'IDG-00000000') {
                //                         dt4 = rs4.object
                //                         if (dt4 && dt4.prob) {
                //                             // Haki.: Map thĂ´ng tin tá»« IMG_FRONT vĂ o ALLDATA
                //                             console.log('checkRightFileByServerEkyc.FACE:[OK].msg=', rs4.prob, '.:object=', rs4.object)
                //                             // alert(dt4.msg + ' === Tá»· lá»‡ khá»›p: ' + dt4.prob ? dt4.prob : '0')
                //                             let objImg = {
                //                                 img_face: res.object.hash,
                //                                 file_face: dataFace,
                //                                 opnpoint: dt4.prob ? dt4.prob : '0',
                //                                 img_face_type: imgtypefiles,
                //                             }
                //                             await self.props.onChangeAllData(objImg)
                //                             if (parseFloat(objImg.opnpoint) < parseFloat(allData.minpoint)) {
                //                                 //W = thĂ´ng bĂ¡o cáº£nh bĂ¡o Ä‘iá»ƒm opnpoint tháº¥p hÆ¡n minpoint
                //                                 emitter.emit(Event.DO_SKIP_SUBMIT_COMPARE_FILE_AND_FACE, 'W')
                //                                 CommonUtils.hideLoaderScreen()
                //                                 is_show_msg = false
                //                                 return null
                //                             }
                //                             check = true
                //                             // if (objImg.opnpoint > DEFAULT_MIN_OPNPOINT) {
                //                             //     check = true
                //                             // }
                //                             // else {
                //                             //     msg_error = 'Äiá»ƒm xĂ¡c thá»±c khĂ´ng Ä‘á»§: ' + DEFAULT_MIN_OPNPOINT + ' (Ä‘iá»ƒm)!'
                //                             // }
                //                         }
                //                         else {
                //                             // msg_error = "KhĂ´ng xĂ¡c Ä‘á»‹nh Ä‘Æ°á»£c opnpoint!"
                //                             msg_error = <FormattedMessage id="account-register-2.error.img_face_match_fail" />
                //                         }
                //                         dataCompare = dt4
                //                     }
                //                     // }
                //                     // else {
                //                     //     // msg_error = "Máº·t bá»‹ che!"
                //                     //     msg_error = <FormattedMessage id="account-register-2.error.img_face_hide_fail" />

                //                     // }
                //                     // }
                //                 }
                //                 else {
                //                     if (dt2 && dt2.liveness == "failure") {
                //                         // msg_error = "áº¢nh khuĂ´n máº·t khĂ´ng há»£p lá»‡!"
                //                         msg_error = <FormattedMessage id="account-register-2.error.img_face_match_fail" />
                //                     }
                //                     else {
                //                         // msg_error = "KhĂ´ng pháº£i ngÆ°á»i tháº­t!"
                //                         msg_error = <FormattedMessage id="account-register-2.error.img_face_not_scan" />
                //                     }
                //                 }
                //             }
                //             else {
                //                 msg_error = <FormattedMessage id="account-register-2.error.img_face_not_scan" />
                //             }
                //         }
                //         else {
                //             // msg_error = "ChÆ°a cĂ³ img_front!"
                //             msg_error = <FormattedMessage id="account-register-2.error.img_front_not_found" />
                //         }
                //     }
                //     else {
                //         // msg_error = "Lá»—i add img_face!"
                //         msg_error = <FormattedMessage id="account-register-2.error.img_front_not_found" />
                //     }
                // })

                // let check2 = self.checkValidate(dataCompare)

                // if (check && check2) {

                //     emitter.emit(Event.DO_SUBMIT_COMPARE_FILE_AND_FACE_SUSSESS)

                //     self.setState({
                //         dataFace: dataFace,
                //     })
                // }
                // else {
                //     // msg_error = "Lá»—i checkValidate"
                //     if (is_show_msg) {
                //         msg_error = <FormattedMessage id="account-register-2.error.img_face_match_fail" />
                //     }
                // }
            }
            catch (e) {
                console.log(e)
                msg_error = "Lá»—i gá»i API"
                // msg_error = <FormattedMessage id="account-register-2.error.img_face_not_scan" />
            }

        }
        else {
            //S = thĂ´ng bĂ¡o Tiáº¿p tá»¥c Ä‘á»ƒ bá» qua bÆ°á»›c xĂ¡c thá»±c nĂ y
            // emitter.emit(Event.DO_SKIP_SUBMIT_COMPARE_FILE_AND_FACE, 'S')
        }
        self.setState({
            msg_error
        })
        // CommonUtils.hideLoaderScreen()
    }
    show_take_photo = (e) => {
        let { imgfiles, imagePreviewUrl, inputImgValue, isShowTake } = this.state;
        if (isShowTake != true) {
            isShowTake = true
            imgfiles = undefined
            imagePreviewUrl = []
            // inputImgValue = undefined
            this.setState({
                isShowTake,
                imgfiles,
                imagePreviewUrl,
                // inputImgValue,
            })
        }
    }

    get_take_photo = async (event) => {
        let self = this
        const imageSrc = this.refs['webcam-Face-Id'].getScreenshot();
        let time = Date.now();
        let file_name = 'Face_img_' + time
        let { imgfiles, imgtypefiles, imagePreviewUrl, inputImgValue, isShowTake, isShowDeleteIcon } = this.state;
        let _imgfiles = await urltoFile(imageSrc, file_name, "image/png")
        imgtypefiles = 'png'; // Máº·c Ä‘á»‹nh
        // console.log('get_take_photo.:imgfiles=', _imgfiles)
        // Haki.: Convert vá» dáº¡ng FileList giá»‘ng vá»›i logic upload áº£nh
        let _FileList = new DataTransfer();
        _FileList.items.add(_imgfiles)
        imgfiles = _FileList.files
        // console.log('get_take_photo.:imgfiles=', _FileList)
        let _imagePreviewUrl = [];
        for (var file of imgfiles) {
            _imagePreviewUrl.push(URL.createObjectURL(file));
        }
        imagePreviewUrl = _imagePreviewUrl

        isShowTake = false
        isShowDeleteIcon = true
        $("#upload-image-files-face").val('');
        // console.log('get_take_photo.:', imgfiles, imagePreviewUrl)
        this.setState({
            isShowTake,
            isShowDeleteIcon,
            imgfiles,
            imgtypefiles,
            imagePreviewUrl,
            // inputImgValue,
        })
    }
    handleImageChange = (e) => {
        let { imagePreviewUrl, inputImgValue, imgfiles, isShowTake, isShowDeleteIcon } = this.state
        e.preventDefault();
        if (e.target.files.length > 0) {
            let _imagePreviewUrl = [];
            if (e.target.files.length > 0) {
                // inputImgValue[typeImg] = typeImg;
                imgfiles = e.target.files
                // var data = e.target.files[0].getAsBinary();
                for (var file of imgfiles) {
                    _imagePreviewUrl.push(URL.createObjectURL(file));
                }
                imagePreviewUrl = _imagePreviewUrl
                // console.log(_imagePreviewUrl)
                isShowTake = false
                isShowDeleteIcon = true
                this.setState({
                    imagePreviewUrl,
                    // inputImgValue,
                    imgfiles,
                    isShowTake
                })
                // alert(this.state.isShowTake)
            }
        }
    }
    renderUploadForm() {
        let self = this;
        let { imgfiles, imagePreviewUrl, inputImgValue, isShowTake, isShowDeleteIcon } = this.state;
        let _imgfiles = imgfiles;
        console.log(_imgfiles)
        let _imagePreviewUrl = imagePreviewUrl;
        // console.log('renderUploadForm.:', _imagePreviewUrl, _imgfiles)
        let _isShowTake = isShowTake
        let _isShowDeleteIcon = isShowDeleteIcon
        return (
            <React.Fragment>
                <div className="upload-image-preview text-center">
                    <div className="border-image">
                        {_isShowTake ?
                            <Webcam
                                audio={false}
                                height={videoConstraints.height}
                                width={videoConstraints.width}
                                ref={'webcam-Face-Id'}
                                screenshotFormat="image/png"
                                minScreenshotHeight="328"
                                minScreenshotWidth="500"
                                // width={videoConstraints.width}
                                videoConstraints={videoConstraints}
                            />
                            :
                            <span>
                                {_imgfiles && _imgfiles.length > 0 && (
                                    <Carousel
                                        autoPlay={false}
                                        showThumbs={false}
                                    >
                                        {
                                            _imagePreviewUrl.map((imageItem, i) => {
                                                // console.log('imageItem.:', imageItem, _isShowTake)
                                                return (
                                                    <div key={i}>
                                                        <img className="image-preview" alt="" src={imageItem} />
                                                    </div>
                                                )
                                            })

                                        }
                                    </Carousel>
                                )}
                                {(_imgfiles === undefined) && (
                                    <div className="no-image-div">
                                    </div>
                                )}
                            </span>
                        }

                        {/* button */}
                        <div className="img-btn-clear">
                            <button
                                // ref={this.uploadBtnRef}
                                id={"clear-photo-face"}
                                className="btn btn-take-photo"
                                style={{ width: '100%', display: 'none' }}
                                onClick={(e) => this.ClearFile(e)}
                            // disabled={imgfiles && imgfiles.length === 0}
                            >
                            </button>
                            {_isShowDeleteIcon ?
                                <label htmlFor={"clear-photo-face"} className="label-btn-clear-photo">
                                    {/* <i className="fas fa-upload"></i> */}
                                    {/* Chá»¥p áº£nh */}
                                    <i class="fa fa-times" aria-hidden="true"></i>
                                </label>
                                :
                                null
                            }
                            {/* label hiá»ƒn thá»‹ thay cho input file none */}
                        </div>
                        <div className="img-btn">
                            <input
                                id={"upload-image-files-face"}
                                className="textInput btn btn-upload btn btn-refresh"
                                style={{ width: '100%', display: 'none' }}
                                type="file"
                                accept=".jpeg,.jpg,.png"
                                onChange={(e) => this.handleImageChange(e)}
                                name="files[]"
                                // value={_inputImgValue}
                                multiple={false}
                            />
                            {/* Haki.: Hardcode upload áº£nh chĂ¢n dung */}
                            <label htmlFor={"upload-image-files-face"} className="label-btn-upload" style={{ display: 'none' }}>
                                <i className="fas fa-upload"></i>
                                {/* <FormattedMessage id="account-register-2.section-2.upload" /> */}
                            </label>
                            <button
                                // ref={this.uploadBtnRef}
                                id={"show-take-photo-"}
                                className="btn btn-take-photo"
                                style={{ width: '100%', display: 'none' }}
                                onClick={(e) => this.show_take_photo(e)}
                            // disabled={imgfiles && imgfiles.length === 0}
                            >
                            </button>
                            <button
                                // ref={this.uploadBtnRef}
                                id={"take-photo-"}
                                className="btn btn-take-photo"
                                style={{ width: '100%', display: 'none' }}
                                onClick={(e) => this.get_take_photo(e)}
                            // disabled={imgfiles && imgfiles.length === 0}
                            >
                            </button>
                            {_isShowTake ?
                                <label htmlFor={"take-photo-"} className="label-btn-take-photo">
                                    {/* <i className="fas fa-upload"></i> */}
                                    Chọn chụp
                                    <i className="fas fa-camera"></i>
                                </label>
                                :
                                <label htmlFor={"show-take-photo-"} className="label-btn-take-photo">
                                    {/* <i className="fas fa-upload"></i> */}
                                    Chọn chụp
                                    {/* <FormattedMessage id="account-register-2.section-2.choose" /> */}
                                </label>
                            }
                            {/* label hiá»ƒn thá»‹ thay cho input file none */}
                        </div>
                    </div>
                </div>


            </React.Fragment>
        )
    };


    render() {
        let { msg_error } = this.state
        let { setStep } = this.props
        return (
            <React.Fragment>
                <div className="TestCamFace">
                    <div className="intro-content">
                        <div className="content-intro">
                            <div className='title-test-cam-face'>
                                2. Xác thực khuôn mặt
                            </div>
                            <div className='txt-content'>
                                * Vui lòng quay video không quá sát camera và cử động gương mặt tự nhiên trong vài giây. Trường hợp sử dụng iPhone/iPad, quý khách vui lòng cài đặt theo hướng dẫn để quay video: Cài đặt &#62; Safari &#62; Nâng cao &#62; Experimental Features &#62; Media Recorder &#62; True. (version 12.4.1 trở lên)
                            </div>
                            <div className='img_content'>
                                {this.renderUploadForm()}
                            </div>

                            <div className='txt-content lbl_error'>
                                {msg_error && msg_error}
                                Mặt không khớp
                            </div>
                            {/* <div>
                            <button
                                className="btn btn-take-photo floatR"
                                onClick={(e) => this.compareFlieAndFaceByServerEkyc(e)}
                            // disabled={imgfiles && imgfiles.length === 0}
                            >
                                Ekyc
                            </button>
                        </div> */}
                        </div>
                    </div>
                </div>
                <div className="footer-register">
                    <button className="btn-return" onClick={() => setStep(2)}>Quay lại</button>
                    <button className="btn-continue" onClick={() => setStep(3)}>Tiếp tục</button>
                </div>
            </React.Fragment>
        )
    }
}
const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestCamFace);