import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import ModalDetailQuanLyPhiHoaHong_info from './components/ModalDetailQuanLyPhiHoaHong_info'
import TableQuanLyPhiHoaHong from './components/TableQuanLyPhiHoaHong'
import { connect } from 'react-redux'
class QuanLyPhiHoaHong extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: {
        general: true,
        authorize: true,
        fatca: false
      },
      showModalDetail: false,
      CUSTID_VIEW: -1,
      access: "add",
      isClear: true,
      loadgrid: false,
      databacthangg: ''
    };
  }
  collapse(tab) {
    this.state.collapse[tab] = !this.state.collapse[tab];
    this.setState({ collapse: this.state.collapse })
  }
  closeModalDetail() {

    this.setState({ showModalDetail: false, isClear: true, loadgrid: false })
  }
  showModalDetail(access, DATAUPDATE, databacthang) {
    console.log('upon show modal :::::',access, DATAUPDATE, databacthang)
    let titleModal = ""
    let DATA = ""

    switch (access) {
      case "add": titleModal = this.props.strings.modaladd; break
      case "update": titleModal = this.props.strings.modaledit; break;
      case "view": titleModal = this.props.strings.modalview; break
    }
    if (DATAUPDATE != undefined) {
      DATA = DATAUPDATE
    }
    this.setState({ showModalDetail: true, titleModal: titleModal, DATA: DATA, access: access, isClear: true, loadgrid: false})
  }
  change() {

    this.setState({ isClear: false })
  }
  load() {
    this.setState({ loadgrid: true })
  }

  createSuccess(access) {
    this.setState({ access: access })
  }
  render() {
    let { datapage } = this.props
    return (
      <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

        <div className="title-content">{this.props.strings.title}</div>
        <div className="panel-body" >
          <TableQuanLyPhiHoaHong datapage={datapage}
            showModalDetail={this.showModalDetail.bind(this)}
            loadgrid={this.state.loadgrid}
            OBJNAME={datapage?datapage.OBJNAME:''}
          />
          <ModalDetailQuanLyPhiHoaHong_info createSuccess={this.createSuccess.bind(this)}
            load={this.load.bind(this)}
            isClear={this.state.isClear}
            change={this.change.bind(this)}
            access={this.state.access}
            DATA={this.state.DATA}
            title={this.state.titleModal}
            showModalDetail={this.state.showModalDetail}
            closeModalDetail={this.closeModalDetail.bind(this)}
            OBJNAME={datapage?datapage.OBJNAME:''}
            />


        </div>

      </div>

    )
  }
}
QuanLyPhiHoaHong.defaultProps = {

  strings: {
    title: 'Đối tượng áp dụng hoa hồng quản lý tính theo NAV'

  },


};
const stateToProps = state => ({
  veryfiCaptcha: state.veryfiCaptcha,
  notification: state.notification
});


const decorators = flow([
  connect(stateToProps),
  translate('QuanLyPhiHoaHong')
]);

module.exports = decorators(QuanLyPhiHoaHong);
