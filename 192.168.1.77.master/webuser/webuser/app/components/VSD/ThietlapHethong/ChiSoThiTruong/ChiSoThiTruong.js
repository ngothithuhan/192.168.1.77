import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import ModalDetailCSTT_Info from './components/ModalDetailCSTT_Info'
import TableCSTT from './components/TableCSTT'
import { connect } from 'react-redux'
import axios from 'axios'
import RestfulUtils from "app/utils/RestfulUtils";
class ChiSoThiTruong extends React.Component {
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
      tradingdate: ''
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
  async showModalDetail(access, DATAUPDATE) {

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
    await axios.get('/account/gettradingdate')
      .then((res) => {
        let that = this;
        that.setState({ tradingdate: res.data.DT.p_tradingdate, showModalDetail: true, titleModal: titleModal, DATA: DATA, access: access, isClear: true, loadgrid: false })
      })
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
          <TableCSTT datapage={datapage}
            showModalDetail={this.showModalDetail.bind(this)}
            loadgrid={this.state.loadgrid}
            OBJNAME={datapage.OBJNAME}
          />
          <ModalDetailCSTT_Info createSuccess={this.createSuccess.bind(this)}
            load={this.load.bind(this)}
            isClear={this.state.isClear}
            change={this.change.bind(this)}
            access={this.state.access}
            DATA={this.state.DATA}
            title={this.state.titleModal}
            showModalDetail={this.state.showModalDetail}
            OBJNAME={datapage.OBJNAME}
            closeModalDetail={this.closeModalDetail.bind(this)}
            tradingdate={this.state.tradingdate} />
        </div>

      </div>

    )
  }
}
ChiSoThiTruong.defaultProps = {

  strings: {
    title: 'Quản lý thông tin chỉ số thị trường'

  },


};
const stateToProps = state => ({
  veryfiCaptcha: state.veryfiCaptcha,
  notification: state.notification
});


const decorators = flow([
  connect(stateToProps),
  translate('ChiSoThiTruong')
]);

module.exports = decorators(ChiSoThiTruong);
