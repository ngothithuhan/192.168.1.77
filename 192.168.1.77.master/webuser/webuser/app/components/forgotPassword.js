import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { changeLanguage } from 'app/action/actionLanguage.js';
import { getLanguageKey, saveLanguageKey, LANGUAGE_KEY } from '../Helpers';

class forgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      access: 'add',

      datagroup: {
        p_idcode: '',
        p_email: '',
        p_desc: '',
        p_language: '',
        pv_objname: '',
      },
      checkFields: [
        { name: "p_idcode", id: "txtIdcode" },
        { name: "p_email", id: "txtEmail" },


      ],
    };
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
  async submitGroup() {

    var mssgerr = '';
    for (let index = 0; index < this.state.checkFields.length; index++) {
      const element = this.state.checkFields[index];
      mssgerr = this.checkValid(element.name, element.id);
      if (mssgerr !== '')
        break;
    }
    if (mssgerr == '') {
      var api = '/accountinfo/forgot_usernamepassword';


      var { dispatch } = this.props;
      var datanotify = {
        type: "",
        header: "",
        content: ""

      }
      this.state.datagroup["p_language"] = this.props.lang
      RestfulUtils.post(api, this.state.datagroup)
        .then((res) => {
          if (res.EC == 0) {
            datanotify.type = "success";
            datanotify.content = this.props.strings.success;
            window.setTimeout(dispatch(showNotifi(datanotify)), 4000);
            window.location.href = '/TRANSACTIONS'
          } else {
            datanotify.type = "error";
            datanotify.content = res.EM;
            dispatch(showNotifi(datanotify));
          }

        })

    }

  }
  onChange(type, event) {
    let data = {};

    if (event.target) {

      this.state.datagroup[type] = event.target.value;
    }
    else {

      this.state.datagroup[type] = event.value;
    }
    this.setState({ datagroup: this.state.datagroup })
  }
  checkValid(name, id) {
    let value = this.state.datagroup[name];

    let mssgerr = '';
    switch (name) {

      case "p_idcode":
        if (value == '') {
          mssgerr = this.props.strings.requiredusername;
        }
        break;
      case "p_email":
        if (value == '') {
          mssgerr = this.props.strings.requiredphone;
        }
        break;


      default:
        break;
    }
    if (mssgerr !== '') {
      var { dispatch } = this.props;
      var datanotify = {
        type: "",
        header: "",
        content: ""

      }
      datanotify.type = "error";
      datanotify.content = mssgerr;
      dispatch(showNotifi(datanotify));
      window.$(`#${id}`).focus();
    }
    return mssgerr;
  }
  render() {
    return (
      <div className="forgot-password-container">
        <div className="share-background">
        </div>
        <div className="forgot-password-content">
          <div className="row">
            <div className="fpc-title col-md-12"><b>{this.props.strings.title}</b></div>
            <div className="col-md-12 fpc-desc">
              {this.props.strings.desc}
            </div>
            <div className="col-md-12 form-group fpc-pb-16">
              <label>{this.props.strings.username} <span style={{ color: 'red' }}>*</span></label>
              <input className="form-control" type="text" placeholder={this.props.strings.username} id="txtIdcode" value={this.state.datagroup["p_idcode"]} onChange={this.onChange.bind(this, "p_idcode")} />
            </div>

            <div className="col-md-12  form-group fpc-pb-16">
              <label>{this.props.strings.email} <span style={{ color: 'red' }}>*</span></label>
              <input className="form-control" type="text" placeholder={this.props.strings.email} id="txtEmail" value={this.state.datagroup["p_email"]} onChange={this.onChange.bind(this, "p_email")} />
            </div>
            <div className="col-md-12 ">
              <input type="button" className="btn-confirm" style={{ marginLeft: 0, marginRight: 286 }} value={this.props.strings.submit} id="btnSubmit" onClick={this.submitGroup.bind(this)} />
              <div className="back-login">
                <a href="/LOGIN">{this.props.strings.backLogin}</a>
              </div>
            </div>
          </div>
        </div>

      </div>

    )
  }
}
forgotPassword.defaultProps = {

  strings: {
    title: 'Thiết lập lại mật khẩu truy cập'

  },


};
const stateToProps = state => ({
  lang: state.language.language
});


const decorators = flow([
  connect(stateToProps),
  translate('forgotPassword')
]);

module.exports = decorators(forgotPassword);
