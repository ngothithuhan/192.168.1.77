import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import CanBoXacNhanOTP from 'app/components/VSD/CanBoXacNhanOTP/components/CanBoXacNhanOTP2'
import PopupWarningOpenAcc from './PopupWarningOpenAcc2'
import { showModalWarningInfoOpenAcc } from 'actionDatLenh';

import { changeLanguage } from 'app/action/actionLanguage.js';
import { getLanguageKey, saveLanguageKey, LANGUAGE_KEY } from 'app/Helpers';
import RestfulUtils from 'app/utils/RestfulUtils';

class NDTXacNhanOTP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        OTPCODE: "",
        CUSTODYCD: "",
        FULLNAME: "",
        IDCODE: "",
        OTPTYPE: '',
        LANG: this.props.lang
      },
    }
  }
  confirmSuccess = () => {

  }
  close() {
    this.props.closeModalOTPConfirm();
  }
  showModalWarningInfoOpenAcc() {
    var { dispatch } = this.props;
    dispatch(showModalWarningInfoOpenAcc());
  }
  getCUSTODYCD(custody) {
    console.log('custody:', custody)
    custody.p_custodycd = custody.CUSTODYCD;
    this.setState({ data: custody });
  }
  async componentDidMount() {
    let location = this.props.location
    if (location) {
      let language = location.search.replace("?langguage=", '')
      let { dispatch } = this.props;
      if (language && language != "" && language != undefined && language != null) {
        await RestfulUtils.post('/session/setLanguage', { language }).then((resData) => {
          if (resData.errCode == 0) {
            console.log('setLanguage sussces!language.:', language)
          }
          else
            console.log('setLanguage fail, set default language vie!')
          saveLanguageKey(language)
          dispatch(changeLanguage(language));
        });
        saveLanguageKey(language)
        dispatch(changeLanguage(language));
      }
    }
  }
  render() {
    console.log('data:', this.state.data)
    return (
      <div>
        <CanBoXacNhanOTP getCUSTODYCD={this.getCUSTODYCD.bind(this)} showModalWarningInfoOpenAcc={this.showModalWarningInfoOpenAcc.bind(this)} confirmSuccess={this.confirmSuccess} previousURL={window.location.href} OBJNAME='CUSTOMERACTIVEOTP' isMini={false} access='add' />
        <PopupWarningOpenAcc dataFinish={this.state.data} closeModalOTPConfirm={this.props.closeModalOTPConfirm} />

      </div>

    )
  }
}

const stateToProps = state => ({
  language: state.language.language,
  auth: state.auth,
  showModal: state.datLenh.showModalWarningInfoOpenAcc
});


const decorators = flow([
  connect(stateToProps),
  translate('NDTXacNhanOTP')
]);

module.exports = decorators(NDTXacNhanOTP);
