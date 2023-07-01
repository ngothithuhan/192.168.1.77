import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableGanUserVaoNhom from './components/TableGanUserVaoNhom'
import ModalGanUserVaoNhom from './components/ModalGanUserVaoNhom'
import { connect } from 'react-redux'
class GanUserVaoNhom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: {
        general: true,
        authorize: true,
        fatca: false
      },
      showModalDetail: false,
      titleModal: 'Taọ tài khoản',
      DATA: "",
      access: "add",
      isClear: true,
      loadgrid: false,
      isLoad: false
    };
  }
  createSuccess(access) {
    this.setState({ access: access })
  }
  closeModalDetail() {

    this.setState({ showModalDetail: false, isClear: true, loadgrid: true })
  }
  showModalDetail(access, DATAUPDATE) {

    let titleModal = ""
    let DATA = ""

    switch (access) {
      case "add": titleModal = this.props.strings.title; break
      case "update": titleModal = this.props.strings.title; break;
      case "view": titleModal = this.props.strings.modalview; break
    }
    if (DATAUPDATE != undefined) {
      DATA = DATAUPDATE
    }

    this.setState({ showModalDetail: true, titleModal: titleModal, DATA: DATA, access: access, isClear: true, loadgrid: false })
  }
  change() {

    this.setState({ isClear: false })
  }
  load() {
    this.setState({ loadgrid: true })
  }
  loadWhenSuccess() {
    this.setState({ isLoad: true})
  }
  render() {
    let { datapage } = this.props
    return (
      <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

        <div className="title-content">{this.props.strings.title}</div>
        <div className="panel-body" >
          <TableGanUserVaoNhom 
            OBJNAME={datapage.OBJNAME} datapage={datapage}
            showModalDetail={this.showModalDetail.bind(this)}
            loadgrid={this.state.loadgrid} 
            isLoad= {this.state.isLoad}/>
          <ModalGanUserVaoNhom createSuccess={this.createSuccess.bind(this)}
            load={this.load.bind(this)}
            loadWhenSuccess = {this.loadWhenSuccess.bind(this)}
            isClear={this.state.isClear}
            change={this.change.bind(this)}
            access={this.state.access}
            DATA={this.state.DATA}
            title={this.state.titleModal}
            showModalDetail={this.state.showModalDetail}
            closeModalDetail={this.closeModalDetail.bind(this)}
            OBJNAME={datapage.OBJNAME} /> 
        </div>
      </div>
    )
  }
}
const stateToProps = state => ({
  veryfiCaptcha: state.veryfiCaptcha,
  notification: state.notification,
});
const decorators = flow([
  connect(stateToProps),
  translate('GanUserVaoNhom')
]);

module.exports = decorators(GanUserVaoNhom);
