import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import ModalQuanLyGuiEmailAll from './components/ModalQuanLyGuiEmailAll';
import TableQuanLyGuiEmailAll from './components/TableQuanLyGuiEmailAll'
import { connect } from 'react-redux'
class QuanLyGuiEmailAll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: {
        general: true,
        authorize: true,
        fatca: false
      },
      showModalDetail: false,
      titleModal: 'Taọ ngân hàng',
      CUSTID_VIEW: -1,
      access: "add",
      isClear: true,
      loadgrid: false
    };
  }
  collapse(tab) {
    this.state.collapse[tab] = !this.state.collapse[tab];
    this.setState({ collapse: this.state.collapse })
  }
  showModalDetail(access, DATAUPDATE) {
    let titleModal = ""
    let DATA = "";

    switch (access) {
      case "add": titleModal = "Thêm thông báo gửi khách hàng"; break
      case "update": titleModal = "Sửa thông báo"; break;
      case "view": titleModal = this.props.strings.modalview; break
    }
    if (DATAUPDATE != undefined) {
      DATA = DATAUPDATE
    }
    this.setState({ showModalDetail: true, titleModal: titleModal, DATA: DATA, access: access, isClear: true, loadgrid: false })
  }
  closeModalDetail() {
    this.setState({ showModalDetail: false, isClear: true, loadgrid: false })
  }
  createSuccess(access) {
    this.setState({ access: access })
  }
  change() {
    this.setState({ isClear: false })
  }
  load() {
    this.setState({ loadgrid: true })
  }
  render() {
    let { datapage } = this.props
    return (
      <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

        <div className="title-content">{this.props.strings.title}</div>
        <div className="panel-body" >
         <TableQuanLyGuiEmailAll datapage={datapage}
            showModalDetail={this.showModalDetail.bind(this)}
            OBJNAME={datapage.OBJNAME}
            loadgrid={this.state.loadgrid} />
          <ModalQuanLyGuiEmailAll createSuccess={this.createSuccess.bind(this)}
            load={this.load.bind(this)}
            isClear={this.state.isClear}
            change={this.change.bind(this)}
            access={this.state.access}
            DATA={this.state.DATA}
            title={this.state.titleModal}
            showModalDetail={this.state.showModalDetail}
            OBJNAME={datapage.OBJNAME}
            closeModalDetail={this.closeModalDetail.bind(this)} />
        </div>
      </div>
    )
  }
}
QuanLyGuiEmailAll.defaultProps = {
};
const stateToProps = state => ({
  veryfiCaptcha: state.veryfiCaptcha,
  notification: state.notification,
  lang: state.language.language
});


const decorators = flow([
  connect(stateToProps),
  translate('QuanLyGuiEmailAll')
]);

module.exports = decorators(QuanLyGuiEmailAll);
