import React from 'react';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableINTERNALACCOUNT from './components/TableINTERNALACCOUNT'
import ModalDetailINTERNALACCOUNT_info from './components/ModalDetailINTERNALACCOUNT_info'

class INTERNALACCOUNT extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModalDetail: false,
      isrefresh: false,
      titleModal: '',
      access: "ADD",
      isClear: true,
      loadgrid: false,
      ISFIRSTLOAD: true,
    };
  }

  closeModalDetail() {
    this.setState({ showModalDetail: false, isClear: true, loadgrid: false, access: "ADD", ISFIRSTLOAD: true  })
  }
  showModalDetail(access, DATAUPDATE) {

    let titleModal = ""
    let DATA = ""

    switch (access) {
      case "ADD": titleModal = this.props.strings.modaladd; break
      case "EDIT": titleModal = this.props.strings.modaledit; break;
      case "VIEW": titleModal = this.props.strings.modalview; break
    }
    if (DATAUPDATE != undefined) {
      DATA = DATAUPDATE
    }

    this.setState({ showModalDetail: true, titleModal: titleModal, DATA: DATA, access: access, isClear: true, loadgrid: false, ISFIRSTLOAD: true })
  }
  change() {

    this.setState({ isClear: false })
  }
  load() {
    this.setState({ loadgrid: true })
  }
  createSuccess(access) {
    this.setState({ isrefresh: true })
  }
  change_ISFIRSTLOAD(){
    this.setState({ ISFIRSTLOAD: false })
  }
  render() {
    let { datapage } = this.props
    //console.log("datapage.OBJNAME:",datapage.OBJNAME)
    return (
      <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

        <div className="title-content">{this.props.strings.title}</div>
        <div className="panel-body" >
          <TableINTERNALACCOUNT datapage={datapage}
            showModalDetail={this.showModalDetail.bind(this)}
            loadgrid={this.state.loadgrid}
            isrefresh={this.state.isrefresh}
            OBJNAME="INTERNALACCOUNT" />
        </div>
        <ModalDetailINTERNALACCOUNT_info ISFIRSTLOAD={this.state.ISFIRSTLOAD} change_ISFIRSTLOAD={this.change_ISFIRSTLOAD.bind(this)} createSuccess={this.createSuccess.bind(this)}
          load={this.load.bind(this)}
          isClear={this.state.isClear}
          change={this.change.bind(this)}
          access={this.state.access}
          DATA={this.state.DATA}
          title={this.state.titleModal}
          showModalDetail={this.state.showModalDetail}
          closeModalDetail={this.closeModalDetail.bind(this)}
          OBJNAME="INTERNALACCOUNT" />
      </div>
    )
  }
}
const stateToProps = state => ({
  veryfiCaptcha: state.veryfiCaptcha,
  notification: state.notification,
  lang: state.language.language
});


const decorators = flow([
  connect(stateToProps),
  translate('INTERNALACCOUNT')
]);

module.exports = decorators(INTERNALACCOUNT);
