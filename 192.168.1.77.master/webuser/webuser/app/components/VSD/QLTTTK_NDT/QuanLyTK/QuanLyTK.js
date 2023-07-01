import React from 'react';
//var GeneralInformation = require('./components/GeneralInformation');
//var UyQuyenInformation = require('./components/UyQuyenInformation');
//import { Route, Link } from 'react-router-dom'
//var InfFATCA = require('./components/InfFATCA');
//import Upload from './components/Upload'
//import Layout from './components/Layout'
//import Test from './components/Test'

import GeneralInfo from 'app/components/VSD/QLTTTK_NDT/QuanLyTK/components/GeneralInfo'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';

import ModalUpsertAccount from './components/ModalUpsertAccount'
import ModalOTPConfirm from './components/ModalOTPConfirm'
import ModalOTPConfirm2 from './components/ModalOTPConfirm2'
import TableAddCreateAccount from './components/TableAddCreateAccount'
import { connect } from 'react-redux';

import NhaDauTu from "app/components/VSD/QLTTTK_NDT/QuanLyTK/NhaDauTu/NhaDauTu"
import { emitter } from 'app/utils/emitter';
import { EVENT, ACTIONS_ACC, DISABLE_CUSTODYCD_STARTWITH, DISABLE_EDIT_ACCOUNT } from 'app/Helpers'

class QuanLyTK extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: {
        general: true,
        authorize: true,
        fatca: false
      },
      dataOTP: {},
      showModalDetail: false,
      showModalOTPConfirm: false,
      showModalOTPConfirm2: false,
      titleModal: 'Taọ tài khoản',
      CUSTID_VIEW: -1,
      access: "add",
      ACCTGRP: '',
      CUSTODYCD: '',
      getstep: 0,
      titleCreateAcc: '',
      success: false,

      dataFromParent: {}, //data row edit
      actionCurrentRow: '',
    };
  }
  collapse(tab) {
    // console.log(tab)
    this.state.collapse[tab] = !this.state.collapse[tab];
    // console.log(this.state.collapse)
    this.setState({ collapse: this.state.collapse })
  }

  showModalDetail(access, ID, row) {
    let titleModal = ""
    let CUSTID = -1;
    let ACCTGRP = '';
    let CUSTODYCD = -1;
    switch (access) {
      case "add": titleModal = this.props.strings.modaladd; break
      case "update": titleModal = this.props.strings.modalupdate; break;
      case "view": titleModal = this.props.strings.modalview; break
    }
    if (ID) {
      CUSTID = ID.CUSTID
      ACCTGRP = ID.ACCTGRP
      CUSTODYCD = ID.CUSTODYCD
    }

    let isDisableEditAccount = false;
    if (row && row.original) {
      isDisableEditAccount = this.isDisableEditAccount(row.original);
    }

    this.setState({
      showModalDetail: true,
      titleModal: titleModal,
      CUSTID_VIEW: CUSTID,
      access: access,
      ACCTGRP: ACCTGRP,
      CUSTODYCD,
      dataFromParent: (row && row.original) ? row.original : {},
      actionCurrentRow: isDisableEditAccount === true ? ACTIONS_ACC.VIEW : access,
    })
  }
  closeModalDetail() {
    this.setState({ ...this.state, showModalDetail: false });
    emitter.emit('EVENT.CLOSE_MODAL_DETAIL_ACC');
  }
  closeModalDetail2() {
    console.log('jump to closeModalDetail2')
    this.setState({ showModalDetail: false })
  }
  showModalOTPConfirm(data) {

    this.setState({ showModalOTPConfirm: true, dataOTP: data, access: 'update' })
  }
  closeModalOTPConfirm() {
    this.setState({ showModalOTPConfirm: false })
  }
  showModalOTPConfirm2(data) {
    this.setState({ showModalOTPConfirm2: true, dataOTP: data })
  }
  closeModalOTPConfirm2() {
    console.log('jump to closeModalOTPConfirm2')
    this.setState({ showModalOTPConfirm2: false, success: false })
  }
  confirmSuccess() {
    console.log('jump to confirmSuccess1')
    this.closeModalDetail();
    this.closeModalOTPConfirm();
    this.setState({ isRefresh: true })
  }
  confirmSuccess2() {
    console.log('jump to confirmSuccess2')
    this.closeModalDetail2();
    this.closeModalOTPConfirm2();
    this.setState({ success: true, isRefresh: true })
  }
  // lay step truyen qua 
  getStep(step) {
    this.setState({ getstep: step })
  }


  isDisableEditAccount = (row) => {
    let isDisable = false;
    if (row && row.CUSTODYCD) {
      if (DISABLE_EDIT_ACCOUNT === true) {
        for (let i = 0; i < DISABLE_CUSTODYCD_STARTWITH.length; i++) {
          if (row.CUSTODYCD.startsWith(DISABLE_CUSTODYCD_STARTWITH[i])) {
            isDisable = true;
            break;
          }
        }
      }
    }
    return isDisable;
  }
  render() {
    let { getstep, titleCreateAcc } = this.state;
    titleCreateAcc = ''
    console.log('stepppp', getstep)
    console.log('this.state:::', this.state)
    console.log('language:::', this.props.language)
    switch (getstep) {
      case 0:
        titleCreateAcc = this.props.strings.tab1
        break;
      case 1:
        titleCreateAcc = this.props.strings.tab2
        break;
      case 2:
        titleCreateAcc = this.props.strings.tab4
        break;
      case 3:
        titleCreateAcc = this.props.strings.tab5
        break;
      default:
        titleCreateAcc = ''
    }
    let { datapage, auth } = this.props;
    let { user } = auth;
    let access = user.ISCUSTOMER == 'Y' ? 'update' : this.state.access;
    return (

      <React.Fragment>
        {user.ISCUSTOMER !== 'Y' ?
          <React.Fragment>
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">
              <div className="panel-body" >
                {(user.ISCUSTOMER !== 'Y')
                  &&
                  <TableAddCreateAccount
                    OBJNAME={datapage.OBJNAME}
                    isRefresh={this.state.isRefresh}
                    datapage={datapage}
                    showModalDetail={this.showModalDetail.bind(this)}

                  />}
              </div>

              <ModalUpsertAccount
                access={this.state.actionCurrentRow}
                CUSTID_VIEW={this.state.CUSTID_VIEW}
                CUSTODYCD_VIEW={this.state.CUSTODYCD}
                title={this.state.titleModPal}
                showModalDetail={this.state.showModalDetail}
                closeModalDetail={this.closeModalDetail.bind(this)}
                showModalOTPConfirm={this.showModalOTPConfirm.bind(this)}
                language={this.props.language}
                OBJNAME={datapage.OBJNAME}
                ACCTGRP={this.state.ACCTGRP}
                dataFromParent={this.state.dataFromParent} //data row edit
              />


            </div>
          </React.Fragment>
          :
          <React.Fragment>
            <NhaDauTu
              datapage={this.props.datapage}
              OBJNAME={datapage.OBJNAME}
              CUSTODYCD_VIEW={user.USERID}
              CUSTID_VIEW={user.CUSTID}
              access={'update'}
              closeModalDetail={this.closeModalDetail.bind(this)}
              closeModalDetail2={this.closeModalDetail2.bind(this)}
              showModalOTPConfirm={this.showModalOTPConfirm2.bind(this)}

            />

            {user.ISCUSTOMER == 'Y' && access != 'add' ? <ModalOTPConfirm2 OBJNAME={datapage ? datapage.OBJNAME : ''} access={user.ISCUSTOMER == 'Y' ? 'update' : this.state.access} confirmSuccess={this.confirmSuccess2.bind(this)} showModalOTPConfirm={this.state.showModalOTPConfirm2}
              successs={this.state.success} closeModalOTPConfirm={this.closeModalOTPConfirm2.bind(this)} dataOTP={this.state.dataOTP} /> : <ModalOTPConfirm OBJNAME={datapage ? datapage.OBJNAME : ''} access={user.ISCUSTOMER == 'Y' ? 'update' : this.state.access} confirmSuccess={this.confirmSuccess.bind(this)} showModalOTPConfirm={this.state.showModalOTPConfirm}
                closeModalOTPConfirm={this.closeModalOTPConfirm.bind(this)} dataOTP={this.state.dataOTP} />}

          </React.Fragment>
        }

      </React.Fragment>
    )
  }
}
QuanLyTK.defaultProps = {

  strings: {
    title: 'Quản tài khoản NĐT'

  },


};

const stateToProps = state => ({
  veryfiCaptcha: state.veryfiCaptcha,
  notification: state.notification,
  auth: state.auth,
  language: state.language.language,

});


const decorators = flow([
  connect(stateToProps),
  translate('QuanLyTK')
]);

module.exports = decorators(QuanLyTK);
