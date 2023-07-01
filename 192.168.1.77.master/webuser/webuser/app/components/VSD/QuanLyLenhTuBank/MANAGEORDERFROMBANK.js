import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import ModalDetailQuanLyLenhTuBank_info from './components/ModalDetailQuanLyLenhTuBank_info'
import TableLenhTuBank from './components/TableLenhTuBank'
import { connect } from 'react-redux'
class MANAGEORDERFROMBANK extends React.Component {
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
      loadgrid: false,
      databacthangg: ''
    };
  }
  collapse(tab) {
    // console.log(tab)
    this.state.collapse[tab] = !this.state.collapse[tab];
    // console.log(this.state.collapse)
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
    //let databt = access = 'add' ? '' : databacthang;
    this.setState({ showModalDetail: true, titleModal: titleModal, DATA: DATA, access: access, isClear: true, loadgrid: false, databacthangg: databacthang})
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
          <TableLenhTuBank datapage={datapage}
            showModalDetail={this.showModalDetail.bind(this)}
            loadgrid={this.state.loadgrid}
            OBJNAME={datapage?datapage.OBJNAME:''}
          />
          {/* <ModalDetailQuanLyBieuPhi_info createSuccess={this.createSuccess.bind(this)}
            load={this.load.bind(this)}
            isClear={this.state.isClear}
            change={this.change.bind(this)}
            access={this.state.access}
            DATA={this.state.DATA}
            title={this.state.titleModal}
            showModalDetail={this.state.showModalDetail}
            closeModalDetail={this.closeModalDetail.bind(this)}
            databacthangg={this.state.databacthangg} 
            OBJNAME={datapage?datapage.OBJNAME:''}
            /> */}


        </div>

      </div>

    )
  }
}
MANAGEORDERFROMBANK.defaultProps = {

  strings: {
    title: 'QUẢN LÝ LỆNH ĐẶT TỪ APP MBBANK'

  },


};
const stateToProps = state => ({
  veryfiCaptcha: state.veryfiCaptcha,
  notification: state.notification
});


const decorators = flow([
  connect(stateToProps),
  translate('MANAGEORDERFROMBANK')
]);

module.exports = decorators(MANAGEORDERFROMBANK);
