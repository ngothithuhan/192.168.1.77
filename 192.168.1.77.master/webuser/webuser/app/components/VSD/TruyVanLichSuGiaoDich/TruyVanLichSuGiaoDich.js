import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableTVLSGD from './components/TableTVLSGD'
import { connect } from 'react-redux';
import 'app/utils/customize/CustomizeReactTable.scss';
import './TruyVanLichSuGiaoDich.scss';

import ModalViewTranshistHistory from './ModalViewTranshistHistory';

class TruyVanLichSuGiaoDich extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: {
        general: true,
        authorize: true,
        fatca: false
      },
      showModalDetail: false,
      isrefresh: false,
      titleModal: 'Tạo ngân hàng',
      CUSTID_VIEW: -1,
      access: "add",
      isShowModalViewTranHistory: false
    };
  }
  collapse(tab) {
    // console.log(tab)
    this.state.collapse[tab] = !this.state.collapse[tab];
    // console.log(this.state.collapse)
    this.setState({ collapse: this.state.collapse })
  }

  showModalDetail(access, DATAUPDATE) {
    let titleModal = ""
    let DATA = ""
    switch (access) {
      case "add": titleModal = this.props.strings.modaladd; break
      case "update": titleModal = this.props.strings.modaledit; break;
      case "view": titleModal = this.props.strings.modalview; break
    }
    if (DATAUPDATE) {
      DATA = DATAUPDATE
    }
    this.setState({ showModalDetail: true, titleModal: titleModal, DATA: DATA, access: access, isClear: true, loadgrid: false })
  }

  closeModalDetail() {
    this.setState({ showModalDetail: false })
  }

  createSuccess(access) {
    this.setState({ isrefresh: true })
  }

  load() {
    this.setState({ loadgrid: true })
  }

  change() {
    this.setState({ isClear: false })
  }

  componentDidMount() {
    let element = document.getElementById('main_body');
    const { user } = this.props.auth
    let isCustom = user && user.ISCUSTOMER && user.ISCUSTOMER === 'Y' ? true : false;
    if (element && isCustom === true) {
      element.classList.add('truy-van-ls-gd-customize-body');
    }
  }

  componentWillUnmount() {
    let element = document.getElementById('main_body');
    if (element) {
      element.classList.remove('truy-van-ls-gd-customize-body');
    }
  }

  //view transhist history
  handleShowModalViewTranHistory = () => {
    this.setState({ isShowModalViewTranHistory: true })
  }
  handleCloseModalViewTranHistory = () => {
    this.setState({ isShowModalViewTranHistory: false })
  }

  render() {
    let { datapage } = this.props
    return (
      <div className="truy-van-lich-su-giao-dich-container">
        <div className="truy-van-lich-su-giao-dich-body">
          <TableTVLSGD
            datapage={datapage}
            showModalDetail={this.showModalDetail.bind(this)}
            OBJNAME={datapage.OBJNAME}
            loadgrid={this.state.loadgrid}
            isrefresh={this.state.isrefresh}
          />
        </div>
        <button onClick={this.handleShowModalViewTranHistory}
          className="history-trading-btn">
          <span>Lịch sử GD trước ngày 08/10/2021</span>
          <i className="fa fa-clock-o" aria-hidden="true"></i>
        </button>
        <ModalViewTranshistHistory
          closeModalViewTranHistory={this.handleCloseModalViewTranHistory}
          showModalViewTranHistory={this.state.isShowModalViewTranHistory}
        />

      </div>
    )
  }
}
TruyVanLichSuGiaoDich.defaultProps = {

  strings: {


  },


};
const stateToProps = state => ({
  veryfiCaptcha: state.veryfiCaptcha,
  notification: state.notification,
  auth: state.auth,
  lang: state.language.language,
});


const decorators = flow([
  connect(stateToProps),
  translate('TruyVanLichSuGiaoDich')
]);

module.exports = decorators(TruyVanLichSuGiaoDich);
