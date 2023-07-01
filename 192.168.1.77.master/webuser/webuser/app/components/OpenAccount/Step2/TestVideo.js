import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import Webcam from "react-webcam";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './TestVideo.scss';

// import ekycServer from "../../../services/ekycServer";


import {
    RecordWebcam, CAMERA_STATUS
} from "react-record-webcam";

const WebcamRenderProps = {
    // status: string,
    isWebcamOn: true
    // isPreview: boolean;
    // isRecording: boolean;
    // openCamera: () => void;
    // closeCamera: () => void;
    // retake: () => void;
    // start: () => void;
    // stop: () => void;
    // download: () => void;
};

const typeImage = {
    img_1: 'F', // Máº·t trÆ°á»›c front
    img_2: 'B', // Máº·t sau back
}

const videoConstraints = {
    // width: "100vw",
    height: 298,
    facingMode: "user"
};

function urltoFile(url, filename, mimeType) {
    return (fetch(url)
        .then(function (res) { return res.arrayBuffer(); })
        .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
    );
}
class TestVideo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowTake: {
                'F': false,
                'B': false,
            },
            webcamRef: "webcamRef",
            VideoStatus: 'F', // Haki.: F = ChÆ°a báº¯t Ä‘áº§u, S = Báº¯t Ä‘áº§u, D = Xong
        }
        // console webcamRef = React.useRef(null)

    }
    componentDidMount() {
        // ekycServer.getInfoClient()
    }

    checkTypeFileByServerEkyc = (obj) => {
        let data = {
            'img_card': obj.hash,
            'client_session': '',
            'token': obj.tokenId
        }
        // ekycServer.checkTypeFileByServerEkyc(data)
    }
    checkRightFileByServerEkyc = (obj) => {
        let data = {
            'img': obj.hash,
            'client_session': ''
        }
        // ekycServer.checkRightFileByServerEkyc(data)
    }

    OpenStartVideo = async (props) => {
        console.log('run start')
        let { VideoStatus } = this.state
        let self = this
        self.setState({ VideoStatus: 'S' })
        VideoStatus == 'D' && await props.retake()
        await props.openCamera()
        await setTimeout(async function () {
            await props.start()
            await setTimeout(async function () {
                await props.stop()
                // await props.closeCamera()
                self.setState({ VideoStatus: 'D' })
            },
                3000)
        },
            0)

    }

    renderUploadForm() {
        let self = this;
        let { VideoStatus } = this.state
        return (
            <React.Fragment>
                <div className="img upload-image-preview text-center">
                    <div className="img-border">
                        <RecordWebcam
                            render={(props) => {
                                return (
                                    <div className="div-btn-video">
                                        <button
                                            id={"open-video-id"}
                                            disabled={props.isWebcamOn || props.isPreview}
                                            // onClick={props.openCamera}
                                            onClick={self.OpenStartVideo.bind(this, props)}
                                            style={{ width: '100%', display: 'none' }}
                                        >
                                            Open camera
                                        </button>
                                        {/* <button
                                                id={"show-take-video-" + typeImg}
                                                className="btn btn-take-photo"
                                                style={{ width: '100%', display: 'none' }}
                                                onClick={(e) => this.show_take_photo(e, typeImg)}
                                            // disabled={imgfiles && imgfiles.length === 0}
                                            >
                                            </button>
                                            <button
                                                id={"take-video-" + typeImg}
                                                className="btn btn-take-photo"
                                                style={{ width: '100%', display: 'none' }}
                                                onClick={(e) => this.get_take_photo(e, typeImg)}
                                            >
                                            </button> */}
                                        {/* {_isShowTake ?
                                                <label className="label-btn-video-photo">
                                                    <i class="fas fa-hourglass-half"></i>
                                                </label>
                                                : */}
                                        <button
                                            id={"re-open-video-id"}
                                            disabled={!props.isPreview}
                                            onClick={self.OpenStartVideo.bind(this, props)}
                                            style={{ width: '100%', display: 'none' }}
                                        >
                                            <i className="fas fa-play"></i>Start
                                        </button>
                                        {VideoStatus == 'F' && <label htmlFor={"open-video-id"} className="label-btn-take-photo">
                                            <i className="fas fa-play"></i> <span>Start</span>
                                        </label>}
                                        {VideoStatus == 'S' && <label htmlFor={"open-video-id"} className="label-btn-upload">
                                            <i className="fas fa-hourglass-half"></i>
                                        </label>}
                                        {VideoStatus == 'D' && <label htmlFor={"re-open-video-id"} className="label-btn-take-photo">
                                            <i className="fas fa-undo"></i><span>Again</span>
                                        </label>}
                                    </div>
                                )
                            }}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    };

    render() {
        let { setStep } = this.props
        return (
            <React.Fragment>
                <div className="Check-Ekyc">
                    <div className="intro-content">
                        <div className="content-intro">
                            <span className='title'>
                                2.2 Quay video
                            </span>

                            <div className='img_content'>
                                <div className='img_center'>
                                    {this.renderUploadForm()}
                                </div>
                            </div>
                            <span className='txt-content'>
                                Chý ý:
                            </span>

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
                </div>
                <div className="footer-register">
                    <button className="btn-return" onClick={() => setStep(2)}>Quay lại</button>
                    <button className="btn-continue" onClick={() => setStep(3)}>Tiếp tục</button>
                </div></React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(TestVideo);