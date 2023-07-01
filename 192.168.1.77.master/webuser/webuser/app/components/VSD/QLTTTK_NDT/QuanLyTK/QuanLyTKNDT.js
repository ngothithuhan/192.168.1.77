import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js'
import { connect } from 'react-redux'
import { GeneralInfo } from 'app/components/VSD/QLTTTK_NDT/QuanLyTK/components/GeneralInfo';
import { ModalOTPConfirm } from 'app/components/VSD/QLTTTK_NDT/QuanLyTK/components/ModalOTPConfirm';
class QuanLyTKNDT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: {
                general: true,
                authorize: true,
                fatca: false
            },
            dataOTP: {},
            showModalDetail: false,
            showModalOTPConfirm: false,
            titleModal: 'Taọ tài khoản',
            CUSTID_VIEW: -1,
            access: "add"
        };
    }
    collapse(tab) {
        // console.log(tab)
        this.state.collapse[tab] = !this.state.collapse[tab];
        // console.log(this.state.collapse)
        this.setState({ collapse: this.state.collapse })
    }

    showModalDetail(access, ID) {
        let titleModal = ""
        let CUSTID = -1;

        switch (access) {
            case "add": titleModal = "Tạo tài khoản"; break
            case "update": titleModal = "Sửa tài khoản"; break;
            case "view": titleModal = "Xem chi tiết"; break
        }
        if (ID) {
            CUSTID = ID
        }
        this.setState({ showModalDetail: true, titleModal: titleModal, CUSTID_VIEW: CUSTID, access: access })
    }
    closeModalDetail() {
        this.setState({ showModalDetail: false })
    }
    showModalOTPConfirm(data) {

        this.setState({ showModalOTPConfirm: true, dataOTP: data })
    }
    closeModalOTPConfirm() {
        this.setState({ showModalOTPConfirm: false })
    }
    confirmSuccess = () => {
        this.closeModalDetail();
        this.closeModalOTPConfirm();
        this.setState({ isRefresh: true })
    }
    render() {
        let { datapage, auth } = this.props;
        let { user } = auth;
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

                <div className="title-content">{this.props.strings.title}</div>
                <div className="panel-body" >
                    <GeneralInfo OBJNAME={datapage.OBJNAME} CUSTID_VIEW={user.CUSTID}
                        access={'update'}
                        closeModalDetail={this.closeModalDetail.bind(this)}
                        showModalOTPConfirm={this.showModalOTPConfirm.bind(this)}
                    />
                </div>
                    <ModalOTPConfirm OBJNAME={datapage ? datapage.OBJNAME : ''} access={'update'} confirmSuccess={this.confirmSuccess} showModalOTPConfirm={this.state.showModalOTPConfirm}
                        closeModalOTPConfirm={this.closeModalOTPConfirm.bind(this)} dataOTP={this.state.dataOTP} />
            </div>

        )
    }
}
QuanLyTKNDT.defaultProps = {

};

const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    auth: state.auth
});
const decorators = flow([
    connect(stateToProps),
    translate('QuanLyTKNDT')
]);

module.exports = decorators(QuanLyTKNDT);
