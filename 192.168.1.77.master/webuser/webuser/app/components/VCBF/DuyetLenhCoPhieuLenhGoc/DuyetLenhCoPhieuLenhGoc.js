import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableDLCPLG from './components/TableDLCPLG'
//import ModalDLCPLG from './components/ModalDLCPLG'
import  ModalTuChoiLenh from './components/ModalTuChoiLenh'
import { connect } from 'react-redux'
class DuyetLenhCoPhieuLenhGoc extends React.Component {
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
      titleModal: 'Taọ ngân hàng',
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
  showModalDetail(access, DATAUPDATE) {

    let titleModal = ""
    let DATA = ""
    //console.log('dataupdate', DATAUPDATE)
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
    this.setState({ showModalDetail: false ,isrefresh: true})
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
  render() {
    let { datapage } = this.props
    return (
      <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">
        <div className="title-content">{this.props.strings.title}</div>
        <div className="panel-body" >
          <TableDLCPLG datapage={datapage}
            showModalDetail={this.showModalDetail.bind(this)}
            OBJNAME={datapage.OBJNAME}
            loadgrid={this.state.loadgrid}
            isrefresh={this.state.isrefresh} />
          {<ModalTuChoiLenh createSuccess={this.createSuccess.bind(this)}
            load={this.load.bind(this)}
            isClear={this.state.isClear}
            change={this.change.bind(this)}
            access={this.state.access}
            DATA={this.state.DATA}
            title={this.state.titleModal}
            showModalDetail={this.state.showModalDetail}
            closeModalDetail={this.closeModalDetail.bind(this)}
            OBJNAME={datapage.OBJNAME} /> }
        </div>
      </div>
    )
  }
}
const stateToProps = state => ({
  veryfiCaptcha: state.veryfiCaptcha,
  notification: state.notification
});
const decorators = flow([
  connect(stateToProps),
  translate('DuyetLenhCoPhieuLenhGoc')
]);
module.exports = decorators(DuyetLenhCoPhieuLenhGoc);
