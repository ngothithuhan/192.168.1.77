import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableSaoKeCCQ from './components/TableSaoKeCCQ';
import { connect } from 'react-redux';
import 'app/utils/customize/CustomizeReactTable.scss';
import './SaoKeCCQ.scss';

class SaoKeCCQ extends React.Component {
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
    this.state.collapse[tab] = !this.state.collapse[tab];
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
  change() {

    this.setState({ isClear: false })
  }
  load() {
    this.setState({ loadgrid: true })
  }

  componentDidMount() {
    let element = document.getElementById('main_body');
    const { user } = this.props.auth
    let isCustom = user && user.ISCUSTOMER && user.ISCUSTOMER === 'Y' ? true : false;
    if (element && isCustom === true) {
      element.classList.add('sao-ke-ccq-customize-body');
    }
  }
  componentWillUnmount() {
    let element = document.getElementById('main_body');
    if (element) {
      element.classList.remove('sao-ke-ccq-customize-body');
    }
  }


  render() {
    let { datapage } = this.props
    let ISCUSTOMER = this.props.auth.user.ISCUSTOMER;

    return (
      <div className="sao-ke-ccq-container">
        <div className="sao-ke-ccq-content" >
          <TableSaoKeCCQ
            datapage={datapage}
            OBJNAME={datapage ? datapage.OBJNAME : ""}
            ISCUSTOMER={ISCUSTOMER}
            showModalDetail={this.showModalDetail.bind(this)}
            loadgrid={this.state.loadgrid}
            isrefresh={this.state.isrefresh}
            auth={this.props.auth}
            titleTableSaoKeCCQ={this.props.strings.title}
          />

        </div>

      </div>

    )
  }
}
const stateToProps = state => ({
  auth: state.auth,
  veryfiCaptcha: state.veryfiCaptcha,
  notification: state.notification,
});


const decorators = flow([
  connect(stateToProps),
  translate('SaoKeCCQ')
]);

module.exports = decorators(SaoKeCCQ);
