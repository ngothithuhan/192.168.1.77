import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableDoiChieuLenh from './components/TableDoiChieuLenh';
import { connect } from 'react-redux'
import './DoiChieuLenh.scss'
class DoiChieuLenh extends React.Component {
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
      CUSTID_VIEW: -1,
      access: "add",
      loadgrid: false
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
      case "add": titleModal = this.props.strings.modaladd; break
      case "update": titleModal = this.props.strings.modaledit; break;
      case "view": titleModal = this.props.strings.modalview; break
    }
    if (CUSTID) {
      CUSTID = ID
    }
    this.setState({ showModalDetail: true, titleModal: titleModal, CUSTID_VIEW: CUSTID, access: access })
  }
  closeModalDetail() {
    this.setState({ showModalDetail: false, isClear: true, loadgrid: false, isrefresh: false })
  }
  createSuccess() {
    this.setState({ isrefresh: true })
  }
  showModalDetail(access, DATAUPDATE) {

    let titleModal = ""
    let DATA = ""
    //console.log('dataupdate', DATAUPDATE)
    switch (access) {
      case "add": titleModal = this.props.strings.modaladd; break
      case "update": titleModal = this.props.strings.modaledit; break;
      case "view": titleModal =this.props.strings.modalview; break
    }
    if (DATAUPDATE) {
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

  render() {
    let { datapage } = this.props
    console.log('datapage.OBJNAME',datapage.OBJNAME)
    return (
      <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

        <div className="title-content">{this.props.strings.title}</div>
        <div className="panel-body" >
          <TableDoiChieuLenh 
            datapage = {datapage}
            OBJNAME=  {datapage?datapage.OBJNAME:""}
            showModalDetail={this.showModalDetail.bind(this)}
            loadgrid={this.state.loadgrid}
            isrefresh={this.state.isrefresh}
             />
          
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
  translate('DoiChieuLenh')
]);

module.exports = decorators(DoiChieuLenh);
