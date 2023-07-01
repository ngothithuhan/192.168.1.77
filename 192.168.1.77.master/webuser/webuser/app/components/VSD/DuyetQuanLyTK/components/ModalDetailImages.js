import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { toast } from 'react-toastify';
import './ModalDetailImages.scss';
import _ from 'lodash';
import CommonUtil from '../../../../../api/common/CommonUtil';

class ModalDetailImages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allTypeImages: []
        };
    }


    async componentDidMount() {
        let that = this;
        await RestfulUtils.post('/allcode/getlist',
            { CDNAME: "IMGTYPE", CDTYPE: "CF" }).then((resData) => {
                if (resData.errCode == 0) {
                    that.setState({
                        ...that.state,
                        allTypeImages: resData.data
                    })
                } else {
                    console.log('err getlist ', resData)
                    toast.error("Đã có lỗi xảy ra khi lấy danh sách các loại ảnh", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                }
            });
    }

    componentDidUpdate(prevProps, prevState) {

    }

    renderImages = () => {
        let { dataModal, isEditAccount, language } = this.props;
        let { allTypeImages } = this.state;
        let isPDFFile = false;

        {/* Với duyệt sửa tài khoản: Loại ảnh hiển thị lên là "Chứng từ điều chỉnh thông tin" 
         và chỉ lấy ảnh gần ngày hiện tại nhất lên. */}
        if (isEditAccount && allTypeImages && allTypeImages.length > 0 && dataModal && dataModal.length > 0) {
            let typeImages = allTypeImages.find(item => item.CDVAL === 'DCT');
            let images = dataModal.find(item => item.TYPE === 'DCT');
            if (images && !_.isEmpty(images)) {
                isPDFFile = CommonUtil.isPDFBase64(images.SIGNATURE);
            }

            return (
                <React.Fragment>
                    {typeImages && images ?
                        <div className="image-edit-container">
                            <div className="img-title">
                                {language === 'vie' ? typeImages.CDCONTENT : typeImages.EN_CDCONTENT}
                            </div>
                            {isPDFFile ?
                                <iframe className="custom-pdf-viewer" src={images.SIGNATURE}></iframe>
                                :
                                <img src={images.SIGNATURE} />
                            }

                        </div>
                        : <span>Không có dữ liệu</span>}
                </React.Fragment>
            )
        }

        {/* Với duyệt mở tài khoản: Loại ảnh hiển thị lên là "Hồ sơ gốc" + "Ảnh CMND"+ "Ảnh chữ ký". */ }
        if (!isEditAccount && allTypeImages && allTypeImages.length > 0 && dataModal && dataModal.length > 0) {
            let typeImages = allTypeImages.filter(item => item.CDVAL === 'CTR' || item.CDVAL === 'IDC' || item.CDVAL === 'CIG');
            let images = dataModal.filter(item => item.TYPE === 'CTR' || item.TYPE === 'IDC' || item.TYPE === 'CIG');
            let newSortImages = [];
            let hd = images.find(item => item.TYPE === 'CTR')
            let cmnd = images.find(item => item.TYPE === 'IDC')
            let ck = images.find(item => item.TYPE === 'CIG')
            let other = images.filter(item => item.TYPE !== 'CTR' && item.TYPE !== 'IDC' && item.TYPE !== 'CIG')
            if (hd) {
                newSortImages = [...newSortImages, hd]
            }
            if (cmnd) {
                newSortImages = [...newSortImages, cmnd]
            }
            if (ck) {
                newSortImages = [...newSortImages, ck]
            }
            if (other.length > 0) {
                newSortImages = [...newSortImages, ...other]
            }

            return (
                <React.Fragment>
                    {typeImages && newSortImages ?
                        <React.Fragment>
                            {newSortImages.map((item, index) => {
                                let currentType = typeImages.find(image => image.CDVAL === item.TYPE);
                                isPDFFile = CommonUtil.isPDFBase64(item.SIGNATURE);

                                return (
                                    <div className="image-not-edit-container" key={index}>
                                        <div className="img-title">
                                            {language === 'vie' ? currentType.CDCONTENT : currentType.EN_CDCONTENT}
                                        </div>
                                        {isPDFFile ?
                                            <iframe className="custom-pdf-viewer" src={item.SIGNATURE + "#toolbar=0"}></iframe>
                                            :
                                            <img src={item.SIGNATURE} />
                                        }

                                    </div>
                                )
                            })}
                        </React.Fragment>
                        : <span>Không có dữ liệu</span>}
                </React.Fragment>
            )
        }

        if (dataModal && dataModal.length === 0) {
            return (<span>Không có dữ liệu</span>)
        }

    }
    render() {
        let { isShow, onClose, dataModal, isEditAccount, language } = this.props;
        let { allTypeImages } = this.state;

        return (
            <Modal show={isShow} bsSize="lg" className="ad-modal-detail-images">
                <Modal.Header  >
                    <Modal.Title >
                        <div className="title-content col-md-6">{this.props.strings.title}
                            <button type="button" className="close"
                                onClick={onClose}><span aria-hidden="true">×</span>
                                <span className="sr-only">Close</span></button></div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="ad-modal-detai-images-body-container">
                        {this.renderImages()}
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
const stateToProps = state => ({
    language: state.language.language,
    tradingdate: state.systemdate.tradingdate
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalDetailImages')
]);
module.exports = decorators(ModalDetailImages);
