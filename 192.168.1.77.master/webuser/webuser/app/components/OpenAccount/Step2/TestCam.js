import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';

//import { CommonUtils } from '../../../utils';
import Webcam from "react-webcam";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './TestCam.scss';

// import ekycServer from "../../../services/ekycServer";

// import { emitter } from "../../../clients/emitter";
// import { Event } from "../../../../src/utils";

const typeImage = {
    img_F: 'F', // Mặt trước front
    img_B: 'B', // Mặt sau back
}

const videoConstraints = {
    // width: "100vw",
    height: 210,
    width: 320,
    facingMode: "user"
};

function urltoFile(url, filename, mimeType) {
    return (fetch(url)
        .then(function (res) { return res.arrayBuffer(); })
        .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
    );
}

class CheckEkyc extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imagePreviewUrl: {
                'F': [],
                'B': [],
            },
            // inputImgValue: {
            //     'F': undefined,
            //     'B': undefined,
            // },
            imgfiles: {
                'F': undefined,
                'B': undefined,
            },
            imgtypefiles: {
                'F': undefined,
                'B': undefined,
            },
            isShowTake: {
                'F': false,
                'B': false,
            },
            webcamRef: "webcamRef",
            dataFront: {},
            dataBack: {},
            msg_err_front: undefined,
            msg_err_back: undefined
        }
        //this.get_take_photo = this.get_take_photo.bind(this);
        this.listenToTheEmitter();
        // console webcamRef = React.useRef(null)

    }

    listenToTheEmitter = () => {
        let self = this
        // emitter.on(Event.DO_SUBMIT_ADD_FILE_CAM, data => {
        //     self.addFileServerEkyc(data)
        // });
    }
    componentDidMount() {
        //ekycServer.getInfoClient()
    }

    handleImageChange = (e, typeImg) => {
        let { imagePreviewUrl, inputImgValue, imgfiles, imgtypefiles, isShowTake } = this.state

        let urlImg = document.getElementById("upload-image-files-" + typeImg).value
        urlImg = urlImg.split('.')
        imgtypefiles[typeImg] = urlImg[urlImg.length - 1]
        console.log('handleImageChange.:', urlImg, imgtypefiles[typeImg])
        e.preventDefault();
        if (e.target.files.length > 0) {
            let _imagePreviewUrl = [];
            if (e.target.files.length > 0) {
                // inputImgValue[typeImg] = typeImg;
                imgfiles[typeImg] = e.target.files
                // var data = e.target.files[0].getAsBinary();
                for (var file of imgfiles[typeImg]) {
                    _imagePreviewUrl.push(URL.createObjectURL(file));
                    console.log('handleImageChange.:', file)

                }
                imagePreviewUrl[typeImg] = _imagePreviewUrl
                console.log('handleImageChange.:', _imagePreviewUrl)
                // console.log(_imagePreviewUrl)
                isShowTake[typeImg] = false
                this.setState({
                    imagePreviewUrl,
                    // inputImgValue,
                    imgfiles,
                    imgtypefiles,
                    isShowTake
                })
                // alert(this.state.isShowTake)
            }
        }
    }

    checkTypeFileByServerEkyc = async (obj) => {
        // let data = {
        //     'img_card': obj.hash,
        //     // 'client_session': 'TEST-FROM-FSS',
        //     'client_session': ''
        //     // 'token': obj.tokenId
        // }
        // return ekycServer.checkTypeFileByServerEkyc(data)
    }
    checkRightFileByServerEkyc = async (obj) => {
        // let data = {
        //     'img': obj.hash,
        //     // 'client_session': 'TEST-FROM-FSS.:checkRightFileByServerEkyc()'
        //     'client_session': ''
        // }
        // return ekycServer.checkRightFileByServerEkyc(data)
    }
    getInfoFileFrontByServerEkyc = async (obj) => {
        // let data = {
        //     'img_front': obj.hash,
        //     // 'client_session': 'TEST-FROM-FSS.:getInfoFileFrontByServerEkyc()'
        //     'client_session': ''
        // }
        // return ekycServer.getInfoFileFrontByServerEkyc(data)
    }
    getInfoFileBackByServerEkyc = async (obj) => {
        // let data = {
        //     'img_back': obj.hash,
        //     // 'client_session': 'TEST-FROM-FSS.:getInfoFileBackByServerEkyc()'
        //     'client_session': ''
        // }
        // return ekycServer.getInfoFileBackByServerEkyc(data)
    }
    checkValidate = (dataFront, dataBack) => {
        console.log('checkValidate.F:dataFront=', dataFront)
        console.log('checkValidate.B:dataBack=', dataBack)
        return true
    }
    resetChangeFile = async () => {
        let self = this
        let objReset = {
            img_front: undefined,
            file_front: undefined,
            customername: '', // Họ và tên
            idcode: '', // Số CCMD/CCCD
            customerGender: '000', // Giới tính
            customerbirth: undefined, // Ngày sinh
            personalPapersChoice: '001', //Loại giấy tờ
            address: '', // Địa chỉ thường trú
            // contactaddress: '', Địa chỉ liên hệ
            //
            img_back: undefined,
            file_back: undefined,

            img_front_type: '',
            img_back_type: '',

            idplace: '',   // Nơi cấp
            iddate: '',    // Ngày cấp
            iddate: '',    // Ngày cấp
        }
        // reset thông tin
        await self.props.onChangeAllData(objReset)
    }
    addFileServerEkyc = async () => {
        let self = this
        // CommonUtils.showLoaderScreen()
        // setTimeout(function () { CommonUtils.hideLoaderScreen() }, 3000)
        // return null
        let { imgfiles, imgtypefiles, imagePreviewUrl, inputImgValue } = this.state;
        let rf1, rf2, rf3, df1, df2, df3
        let rb1, rb2, rb3, db1, db2, db3
        let check1, check2 = false
        let dataFront = { id: {}, liveness: {}, front: {} }
        let dataBack = { id: {}, liveness: {}, back: {} }
        let msg_err_front, msg_err_back = undefined

        self.setState({
            msg_err_front,
            msg_err_back
        })
        // Img mặt trước
        let dataF, dataB
        await self.resetChangeFile()
        let file = imgfiles[typeImage.img_F] ? imgfiles[typeImage.img_F][0] : undefined
        console.log('addFileServerEkyc.F:file=============', file)
        let ischeckimgback = true
        if (file) {
            if (file.type != 'image/jpeg' && file.type != 'image/png') {
                msg_err_front = 'account-register-2.error.img_type_fail'
                // <FormattedMessage id="account-register-2.error.img_type_fail" />
            }
            else {
                dataF = {
                    file: file,
                    title: 'addFileServerEkyc title',
                    description: 'addFileServerEkyc description'

                }
                //1. Upload ảnh
                // return null
                try {
                    // await ekycServer.addFileServerEkyc(dataF).then(async (res) => {
                    //     // console.log('addFileServerEkyc.F:file.:rs============', res, res.message, res.object, res.object.hash)
                    //     // console.log('addFileServerEkyc.F:file.:hash============', res.object.hash)

                    //     if (res && res.object) {
                    //         // console.log('addFileServerEkyc.:file.:rs============', res.object)
                    //         // 2. API kiểm tra loại giấy tờ
                    //         // check Type File By Driver =  // Bị lỗi chưa gọi được
                    //         rf1 = await self.checkTypeFileByServerEkyc(res.object)
                    //         if (rf1) {
                    //             if (rf1.message == 'IDG-00000000') {
                    //                 df1 = rf1.object
                    //                 if (df1) {
                    //                     if (df1.type && rf1.object.name) {
                    //                         console.log('checkTypeFileByServerEkyc.F:[OK].IMG_TYPE=', df1.type, '.:NAME=', df1.name)
                    //                     }
                    //                     dataFront.id = df1
                    //                 }
                    //             }
                    //             else {
                    //                 msg_err_front = 'Thông tin không hợp lệ!'
                    //                 // msg_err_front = <FormattedMessage id="account-register-2.error.img_front_hide" />
                    //             }
                    //         }

                    //         // type = 0,1 : CMT cũ trước, sau ; 2,3 : mới trước sau
                    //         console.log('checkTypeFileByServerEkyc.F.df1=', df1)
                    //         if (df1 && (df1.type == 0 || df1.type == 2)) {
                    //             // 3. Kiểm tra giấy tờ thật giả
                    //             rf2 = await self.checkRightFileByServerEkyc(res.object)
                    //             if (rf2) {
                    //                 if (rf2.message == 'IDG-00000000') {
                    //                     df2 = rf2.object
                    //                     if (df2) {
                    //                         if (df2.liveness) {
                    //                             console.log('checkTypeFileByServerEkyc.:[OK].liveness=', df2.liveness, '.:liveness_msg=', df2.liveness_msg)
                    //                         }
                    //                         dataFront.liveness = df2
                    //                     }
                    //                 }
                    //             }
                    //             console.log('checkTypeFileByServerEkyc.F.df2=', df2)
                    //             if (df2 && df2.liveness == "success") {
                    //                 // 4. Api bóc tách mặt trước thông tin giấy tờ
                    //                 rf3 = await self.getInfoFileFrontByServerEkyc(res.object)
                    //                 if (rf3) {
                    //                     if (rf3.message == 'IDG-00000000') {
                    //                         df3 = rf3.object
                    //                         if (df3) {
                    //                             if (df3.id) {
                    //                                 // Haki.: Map thông tin từ IMG_FRONT vào ALLDATA
                    //                                 console.log('checkRightFileByServerEkyc.F:[OK].id=', df3.id, '.:object=', df3.object)
                    //                                 let address = df3.recent_location.replace(/(?:\r\n|\r|\n)/g, ', ')
                    //                                 let customerGender = '000'; // Mặc định
                    //                                 if (df1.type == 2) {
                    //                                     // CMT mới = CCCD
                    //                                     // API VNPT k trả ra gender_prob
                    //                                     if (df3.gender == 'Nam') {
                    //                                         customerGender = '001'
                    //                                     }
                    //                                     else {
                    //                                         if (df3.gender == 'Nữ') {
                    //                                             customerGender = '002'
                    //                                         }
                    //                                     }
                    //                                 }
                    //                                 let objImgFront = {
                    //                                     img_front: res.object.hash,
                    //                                     file_front: dataF,
                    //                                     customername: df3.name, // Họ và tên
                    //                                     idcode: df3.id, // Số CCMD/CCCD
                    //                                     customerGender: customerGender, // Giới tính
                    //                                     customerbirth: df3.birth_day, // Ngày sinh
                    //                                     personalPapersChoice: df3.card_type == 'GIẤY CHỨNG MINH NHÂN DÂN' ? '001' : '004', //Loại giấy tờ
                    //                                     address: address, // Địa chỉ thường trú
                    //                                     img_front_type: imgtypefiles[typeImage.img_F]
                    //                                     // contactaddress: address // Địa chỉ liên hệ
                    //                                 }
                    //                                 await self.props.onChangeAllData(objImgFront)
                    //                                 check1 = true
                    //                             }
                    //                             dataFront.front = df3
                    //                         }
                    //                     }
                    //                     console.log('checkTypeFileByServerEkyc.F.df3=', df3)
                    //                     if (df3 && df3.warning && df3.warning.length > 0) {
                    //                         let isWarning = false
                    //                         df3.warning.map((event) => {
                    //                             console.log('checkTypeFileByServerEkyc.F.df3.:warning=', event)
                    //                             if (event.indexOf('mo_nhoe') > -1 || event.indexOf('mat_goc') > -1) {
                    //                                 isWarning = true
                    //                             }
                    //                         })
                    //                         // msg_err_front = 'Thông tin không hợp lệ!'
                    //                         if (isWarning) {
                    //                             msg_err_front = 'Thông tin không hợp lệ!'
                    //                             // msg_err_front = <FormattedMessage id="account-register-2.error.img_front_hide" />
                    //                         }
                    //                     }
                    //                 }

                    //             }
                    //             else {
                    //                 msg_err_front = 'Không thể nhận diện giấy tờ trong ảnh hoặc ảnh có chất lượng kém (quá mờ, quá tối/sáng). Quý khách vui lòng chụp/ tải lại CMND/CCCD mặt trước rõ nét hơn!'
                    //                 // msg_err_front = <FormattedMessage id="account-register-2.error.img_front_hide" />
                    //             }
                    //         }
                    //         else {
                    //             // msg_err_front = 'Không đúng định dạng CMND/CCCD mặt trước!'
                    //             msg_err_front = 'Vui lòng tải ảnh mặt trước của CMND/CCCD!'
                    //             // msg_err_front = <FormattedMessage id="account-register-2.error.img_front_not_found" />
                    //             ischeckimgback = false
                    //         }

                    //     }
                    // })
                }
                catch (e) {
                    console.log(e)
                    msg_err_front = 'Không đúng định dạng CMND/CCCD mặt trước!'
                    // msg_err_front = <FormattedMessage id="account-register-2.error.img_front_hide" />
                }
            }

        }
        else {
            msg_err_front = 'Không đúng định dạng CMND/CCCD mặt trước!'
            // msg_err_front = <FormattedMessage id="account-register-2.error.img_front_not_found" />
        }
        // Img mặt sau
        file = imgfiles[typeImage.img_B] ? imgfiles[typeImage.img_B][0] : undefined
        // console.log('addFileServerEkyc.B:file2=============', file)
        if (file) {

            if (file.type != 'image/jpeg' && file.type != 'image/png') {
                msg_err_front = 'Không đúng định dạng CMND/CCCD mặt trước!'
                // msg_err_front = <FormattedMessage id="account-register-2.error.img_type_fail" />
            }
            else {
                dataB = {
                    file: file,
                    title: 'addFileServerEkyc title',
                    description: 'addFileServerEkyc description'

                }
                // return null
                try {
                    // await ekycServer.addFileServerEkyc(dataB).then(async (res) => {
                    //     //     console.log('addFileServerEkyc.B:file.:rs============', res, res.message, res.object, res.object.hash)
                    //     //     console.log('addFileServerEkyc.B:file.:hash============', res.object.hash)

                    //     if (res && res.object) {
                    //         // console.log('addFileServerEkyc.:file.:rs============', res.object)
                    //         // 2. API kiểm tra loại giấy tờ
                    //         // check Type File By Driver =  // Bị lỗi chưa gọi được
                    //         rb1 = await self.checkTypeFileByServerEkyc(res.object)
                    //         if (rb1) {
                    //             if (rb1.message == 'IDG-00000000') {
                    //                 db1 = rb1.object
                    //                 if (db1) {
                    //                     if (db1.type && db1.name) {
                    //                         console.log('checkTypeFileByServerEkyc.B:[OK].IMG_TYPE=', db1.type, '.:NAME=', db1.name)

                    //                     }
                    //                     dataBack.id = db1
                    //                 }
                    //             }
                    //             else {
                    //                 msg_err_back = 'Thông tin không hợp lệ!'
                    //                 // msg_err_back = <FormattedMessage id="account-register-2.error.img_back_hide" />
                    //             }

                    //         }
                    //         // type = 0,1 : CMT cũ trước, sau ; 2,3 : mới trước sau
                    //         console.log('checkTypeFileByServerEkyc.B.db1=', db1)
                    //         if (db1 && (db1.type == 1 || db1.type == 3)) {
                    //             if ((df1.type == 0 && db1.type == 1) || (df1.type == 2 && db1.type == 3)) {
                    //                 // 3. Kiểm tra giấy tờ thật giả
                    //                 rb2 = await self.checkRightFileByServerEkyc(res.object)
                    //                 if (rb2) {
                    //                     if (rb2.message == 'IDG-00000000') {
                    //                         db2 = rb2.object
                    //                         if (db2) {
                    //                             if (db2.liveness) {
                    //                                 console.log('checkTypeFileByServerEkyc.:[OK].liveness=', db2.liveness, '.:liveness_msg=', db2.liveness_msg)

                    //                             }
                    //                             dataBack.liveness = db2
                    //                         }
                    //                     }
                    //                 }
                    //                 console.log('checkTypeFileByServerEkyc.B.db2=', db2)
                    //                 if (db2 && db2.liveness == "success") {
                    //                     // 5. Api bóc tách thông tin mặt sau giấy tờ
                    //                     rb3 = await self.getInfoFileBackByServerEkyc(res.object)
                    //                     if (rb3) {
                    //                         if (rb3.message == 'IDG-00000000') {
                    //                             db3 = rb3.object
                    //                             if (db3) {
                    //                                 if (db3.msg_back == 'OK') {
                    //                                     // Haki.: Map thông tin từ IMG_BACK vào ALLDATA
                    //                                     // console.log('checkRightFileByServerEkyc.B:[OK].id=', db3.id, '.:object=', db3.object)
                    //                                     let objImgBack = {
                    //                                         img_back: res.object.hash,
                    //                                         file_back: dataB,
                    //                                         idplace: db3.issue_place,   // Nơi cấp
                    //                                         iddate: db3.issue_date,    // Ngày cấp
                    //                                         iddate: db3.issue_date,    // Ngày cấp
                    //                                         img_back_type: imgtypefiles[typeImage.img_B]
                    //                                     }
                    //                                     await self.props.onChangeAllData(objImgBack)
                    //                                     check2 = true
                    //                                 }
                    //                                 dataBack.liveness = db3
                    //                             }
                    //                         }
                    //                     }
                    //                     console.log('checkTypeFileByServerEkyc.B.db3=', db3)
                    //                     if (db3 && db3.warning && db3.warning.length > 0) {
                    //                         let isWarning = false
                    //                         db3.warning.map((event) => {
                    //                             console.log('checkTypeFileByServerEkyc.B.db3.:warning=', event)
                    //                             if (event.indexOf('mo_nhoe') > -1 || event.indexOf('mat_goc') > -1) {
                    //                                 isWarning = true
                    //                             }
                    //                         })
                    //                         // msg_err_back = 'Thông tin không hợp lệ!'
                    //                         if (isWarning) {
                    //                             msg_err_back = 'Thông tin không hợp lệ!'
                    //                             // msg_err_back = <FormattedMessage id="account-register-2.error.img_back_hide" />
                    //                         }
                    //                     }
                    //                 }
                    //                 else {
                    //                     msg_err_back = 'Không thể nhận diện giấy tờ trong ảnh hoặc ảnh có chất lượng kém (quá mờ, quá tối/sáng). Quý khách vui lòng chụp/ tải lại CMND/CCCD mặt sau rõ nét hơn!'
                    //                     // msg_err_back = <FormattedMessage id="account-register-2.error.img_back_hide" />
                    //                 }
                    //             }
                    //             else {
                    //                 msg_err_back = 'CMND/CCCD mặt trước và sau không khớp loại!'
                    //                 if (ischeckimgback) {
                    //                     msg_err_back = 'CMND/CCCD mặt trước và sau không khớp loại!'
                    //                     // msg_err_back = <FormattedMessage id="account-register-2.error.img_front_back_not_type" />
                    //                 }
                    //             }
                    //         }
                    //         else {
                    //             // msg_err_back = 'Không đúng định dạng CMND/CCCD mặt sau!'
                    //             msg_err_back = 'Vui lòng tải ảnh mặt sau của CMND/CCCD!'
                    //             // msg_err_back = <FormattedMessage id="account-register-2.error.img_back_not_found" />

                    //         }
                    //     }
                    // })
                }
                catch (e) {
                    console.log(e)
                    sg_err_back = 'Không đúng định dạng CMND/CCCD mặt sau!'
                    // msg_err_back = <FormattedMessage id="account-register-2.error.img_back_hide" />
                }
            }
        }
        else {
            sg_err_back = 'Không đúng định dạng CMND/CCCD mặt sau!'
            // msg_err_back = <FormattedMessage id="account-register-2.error.img_back_not_found" />
        }
        let check3 = self.checkValidate(dataFront, dataBack) // check thêm điều kiệm nếu cần
        if (check1 && check2 && check3) {
            //emitter.emit(Event.DO_SUBMIT_ADD_FILE_CAM_SUSSESS)
        }
        else {
            self.setState({
                msg_err_front,
                msg_err_back
            })
        }
        // CommonUtils.hideLoaderScreen()
    }
    show_take_photo = (e, typeImg) => {
        // alert('take_photo: Issue pending!!!' + typeImg)
        let { imgfiles, imagePreviewUrl, inputImgValue, isShowTake } = this.state;

        if (isShowTake[typeImg] != true) {
            if (typeImg == typeImage.img_F) {
                isShowTake[typeImg] = true
                isShowTake[typeImage.img_B] = false
            } else {
                isShowTake[typeImg] = true
                isShowTake[typeImage.img_F] = false
            }
            imgfiles[typeImg] = undefined
            imagePreviewUrl[typeImg] = []
            // inputImgValue[typeImg] = undefined
            this.setState({
                isShowTake,
                imgfiles,
                imagePreviewUrl,
                // inputImgValue,
            })
        }
    }

    async get_take_photo(typeImg) {
        //console.log('get_take_photo.:png', event)
        let self = this
        const imageSrc = this.refs['webcam-' + typeImg].getScreenshot();
        let time = Date.now();
        let file_name = typeImg + '_img_' + time
        let { imgfiles, imagePreviewUrl, inputImgValue, imgtypefiles, isShowTake } = this.state;
        let cloneImgfiles = { ...this.state.imgfiles }
        let cloneImagePreviewUrl = { ...this.state.imagePreviewUrl }
        let cloneImgtypefiles = { ...this.state.imgtypefiles }
        let cloneIsShowTake = { ...this.state.isShowTake }
        let _imgfiles = await urltoFile(imageSrc, file_name, "image/png")
        cloneImgtypefiles[typeImg] = 'png'; // Mặc định
        // console.log('get_take_photo.:imgfiles=', _imgfiles)
        // Haki.: Convert về dạng FileList giống với logic upload ảnh
        let _FileList = new DataTransfer();
        _FileList.items.add(_imgfiles)
        cloneImgfiles[typeImg] = _FileList.files
        // console.log('get_take_photo.:imgfiles=', _FileList)
        let _imagePreviewUrl = [];
        for (var file of cloneImgfiles[typeImg]) {
            _imagePreviewUrl.push(URL.createObjectURL(file));
        }
        cloneImagePreviewUrl[typeImg] = _imagePreviewUrl

        cloneIsShowTake[typeImg] = false
        console.log('get_take_photo.:', cloneImgfiles[typeImg], cloneImagePreviewUrl[typeImg])
        this.setState({
            isShowTake: cloneIsShowTake,
            imgfiles: cloneImgfiles,
            imagePreviewUrl: cloneImagePreviewUrl,
            imgtypefiles: cloneImgtypefiles,
            // inputImgValue,
        })
    }

    renderUploadForm(typeImg) {
        let self = this;
        let { imgfiles, imagePreviewUrl, inputImgValue, isShowTake } = this.state;
        let _imgfiles = imgfiles[typeImg];
        let _imagePreviewUrl = imagePreviewUrl[typeImg];
        console.log('renderUploadForm.:', _imagePreviewUrl, _imgfiles
        )
        let _isShowTake = isShowTake[typeImg]
        return (
            <React.Fragment>
                <div className="upload-image-preview text-center">
                    <div className="img-border">
                        {_isShowTake ?
                            <Webcam
                                audio={false}
                                height={videoConstraints.height}
                                // width={videoConstraints.width}
                                ref={'webcam-' + typeImg}
                                screenshotFormat="image/png"
                                minScreenshotHeight="210"
                                minScreenshotWidth="320"
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
                                                return (
                                                    <div className="custom-view-image" key={i}>
                                                        <img alt="" src={imageItem} height='210px' width='320px' />
                                                    </div>
                                                )
                                            })

                                        }
                                    </Carousel>
                                )}
                                {_imgfiles && _imgfiles.length === 0 && (
                                    <div className="no-image-div">
                                    </div>
                                )}
                            </span>
                        }
                    </div>
                </div>
                <div className="img-btn">
                    <input
                        id={"upload-image-files-" + typeImg}
                        className="textInput btn btn-upload btn btn-refresh"
                        style={{ width: '100%', display: 'none' }}
                        type="file"
                        accept=".jpeg,.jpg,.png"
                        onChange={(e) => this.handleImageChange(e, typeImg)}
                        name="files[]"
                        // value={_inputImgValue}
                        multiple={false}
                    />
                    <label htmlFor={"upload-image-files-" + typeImg} className="label-btn-upload">
                        <i className="fas fa-upload"></i>
                        &nbsp;Tải ảnh
                        {/* <FormattedMessage id="account-register-2.section-2.upload" /> */}
                    </label>
                    <button
                        // ref={this.uploadBtnRef}
                        id={"show-take-photo-" + typeImg}
                        className="btn btn-take-photo"
                        style={{ width: '100%', display: 'none' }}
                        onClick={(e) => this.show_take_photo(e, typeImg)}
                    // disabled={imgfiles && imgfiles.length === 0}
                    >
                    </button>
                    <button
                        // ref={this.uploadBtnRef}
                        id={"take-photo-" + typeImg}
                        className="btn btn-take-photo"
                        style={{ width: '100%', display: 'none' }}
                        onClick={this.get_take_photo.bind(this, typeImg)}
                    // disabled={imgfiles && imgfiles.length === 0}
                    >
                    </button>
                    {_isShowTake ?
                        <label htmlFor={"take-photo-" + typeImg} className="label-btn-take-photo">
                            <i className="fas fa-camera"></i>
                            &nbsp;Chụp ảnh
                        </label>
                        :
                        <label htmlFor={"show-take-photo-" + typeImg} className="label-btn-take-photo">
                            <i className="fas fa-camera"></i>
                            &nbsp;Chụp ảnh
                            {/* <FormattedMessage id="account-register-2.section-2.choose" /> */}
                        </label>
                    }
                    {/* label hiển thị thay cho input file none */}
                </div>
            </React.Fragment>
        )
    };


    render() {
        let { msg_err_front, msg_err_back } = this.state
        let { setStep } = this.props
        return (
            <React.Fragment>
                <div className="TestCam">
                    <div className="intro-content">
                        <div className="content-intro">
                            <div className="create-account2-title">
                                {this.props.strings.title}
                                {/* <FormattedMessage id="account-register-2.section-2.sectionTitle" /> */}
                            </div>
                            <div className='txt-content'>
                                {this.props.strings.note}
                                {/* <FormattedMessage id="account-register-2.section-2.notice" /> */}
                            </div>

                            <div className='img_content'>
                                <div className="block-image">
                                    <div className='lable_left'>
                                        {this.props.strings.imageFront}
                                        {/* <FormattedMessage id="account-register-2.section-2.fontCard" /> */}
                                    </div>
                                    <div className='img_left'>
                                        {this.renderUploadForm(typeImage.img_F)}
                                    </div>
                                    <div className='lbl_error lable_left'>
                                        {msg_err_front && msg_err_front}
                                    </div>
                                </div>

                                <div className="block-image">
                                    <div className='lable_right'>
                                        {this.props.strings.imageBack}
                                        {/* <FormattedMessage id="account-register-2.section-2.bakcsideCard" /> */}
                                    </div>
                                    <div className='img_right'>
                                        {this.renderUploadForm(typeImage.img_B)}
                                    </div>
                                    <div className='lbl_error lable_right'>
                                        {msg_err_back && msg_err_back}
                                    </div>
                                </div>
                                {/* <div className='img_center'>
                            </div> */}
                            </div>
                            {/* <div>
                            <button
                                className="btn btn-take-photo floatR"
                                onClick={(e) => this.addFileServerEkyc(e)}
                            // disabled={imgfiles && imgfiles.length === 0}
                            >
                                Ekyc
                            </button>
                        </div> */}
                        </div>
                    </div>
                    <div className="noteContainer">
                        <span className="note">{this.props.strings.if} <span onClick={() => this.props.setStep(3)} className="this">{this.props.strings.this}</span> {this.props.strings.keep}</span>
                    </div>

                </div>
                <div className="footer-register">
                    <button className="btn-return"
                        onClick={() => setStep(1)}>{this.props.strings.btnReturn}</button>
                    <button className="btn-continue"
                        onClick={() => setStep(2.1)}>{this.props.strings.buttonContinuous}</button>
                </div>
            </React.Fragment>
        )
    }
}

const stateToProps = state => ({
    auth: state.auth,
    isConfirmLogin: state.auth.isConfirmLogin
});

const dispatchToProps = dispatch => ({
})

const decorators = flow([
    connect(stateToProps, dispatchToProps),
    translate('CreateAccountStep2')
]);

module.exports = decorators(CheckEkyc);