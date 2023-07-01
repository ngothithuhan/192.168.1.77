import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableSaoKeLSGDTien from './components/TableSaoKeLSGDTien';
import { connect } from 'react-redux';
import 'app/utils/customize/CustomizeReactTable.scss';
import './SaoKeLSGDTien.scss'
class SaoKeLSGDTien extends React.Component {
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
      element.classList.add('saoke-lsdg-tien-customize-body');
    }
  }
  componentWillUnmount() {
    let element = document.getElementById('main_body');
    if (element) {
      element.classList.remove('saoke-lsdg-tien-customize-body');
    }
  }

  render() {
    let { datapage } = this.props
    console.log('datapage parent:', datapage)
    let ISCUSTOMER = this.props.auth.user.ISCUSTOMER;
    return (
      <div className="saoke-lsdg-tien-container">
        <div className="saoke-lsdg-tien-content">
          <TableSaoKeLSGDTien
            datapage={datapage}
            OBJNAME={datapage ? datapage.OBJNAME : ""}
            ISCUSTOMER={ISCUSTOMER}
            showModalDetail={this.showModalDetail.bind(this)}
            loadgrid={this.state.loadgrid}
            isrefresh={this.state.isrefresh}
            auth={this.props.auth}
            titleTableSaoKeLSGDTien={this.props.strings.title}
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
  translate('SaoKeLSGDTien')
]);

module.exports = decorators(SaoKeLSGDTien);
