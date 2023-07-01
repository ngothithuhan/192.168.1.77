import React from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';

import { logout } from 'actionUserName';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import { PASSWORD_LENGTH, ISCHECKSPECIALCHARACTER } from 'app/Helpers'
import { resetMenu } from 'actionMenu';

class DoiMatKhau extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      datagroup: {
        p_oldpass: '',
        p_newpass: '',
        p_cfmnewpass: '',
        p_desc: '', //dùng khi gọi api
        pv_objname: '', // dùng khi gọi api
        p_language: this.props.lang,

      },
      checkFields: [
        { name: "p_oldpass", id: "txtOldpassword" },
        { name: "p_newpass", id: "txtNewpassword" },
        { name: "p_cfmnewpass", id: "txtNewpasswordagain" },

      ],
    };
  }

  componentDidMount() {

  }

  onChange(type, event) {
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

      case "p_oldpass":
        if (value == '') {
          mssgerr = this.props.strings.requiredoldpass;
        }
        break;
      case "p_newpass":
        if (value == '') {
          mssgerr = this.props.strings.requirednewpass;
        } else {
          if (ISCHECKSPECIALCHARACTER) {
            if (!((value.length >= PASSWORD_LENGTH && value.match(/[a-z]/)) && (value.match(/[A-Z]/)) && value.match(/[0-9]/) && value.match(/[\!\@\#\$\%\^\&\*\?\_\~\-\(\)]+/))) mssgerr = this.props.strings.requiredstrongpass1;
          } else {
            if (!((value.length >= PASSWORD_LENGTH && value.match(/[a-z]/)) && (value.match(/[A-Z]/)) && value.match(/[0-9]/))) mssgerr = this.props.strings.requiredstrongpass;
          }
        }
        break;
      case "p_cfmnewpass":
        if (value == '') {
          mssgerr = this.props.strings.requiredcfmnewpass;
        } else {
          if (value != this.state.datagroup['p_newpass']) mssgerr = this.props.strings.requirednotsame;
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

  submitGroup() {
    var mssgerr = '';
    for (let index = 0; index < this.state.checkFields.length; index++) {
      const element = this.state.checkFields[index];
      mssgerr = this.checkValid(element.name, element.id);
      if (mssgerr !== '')
        break;
    }

    if (mssgerr == '') {
      var api = '/accountinfo/changecustomerpassword';

      var { dispatch } = this.props;
      var datanotify = {
        type: "",
        header: "",
        content: ""

      }
      this.state.datagroup.p_language = this.props.lang,
        this.setState({ datagroup: this.state.datagroup })


      RestfulUtils.post(api, this.state.datagroup)
        .then((res) => {

          if (res.EC == 0) {
            datanotify.type = "success";
            datanotify.content = this.props.strings.success;
            window.setTimeout(dispatch(showNotifi(datanotify)), 4000);
            this.setState({
              datagroup: {
                p_oldpass: '',
                p_newpass: '',
                p_cfmnewpass: '',
              }
            })

            RestfulUtils.post('/session/logOut')
              .then(res => {
                // dispatch(logout());
                // dispatch(resetMenu())
                // window.location.href = '/Login'
              })
              .catch(err => console.log(err))

          } else {
            datanotify.type = "error";
            datanotify.content = res.EM;
            dispatch(showNotifi(datanotify));
          }
        })

    }
  }


  render() {

    return (
      <div className="dmk-container">
        <div className="dmk-header">
          {this.props.strings.DMK}
        </div>
        <div className="dmk-content">
          <div className="text-input">
            <label>{this.props.strings.oldPassword} <span style={{ color: 'red' }}>*</span></label>
            <input className="edit-field" type='password' id="txtOldpassword" value={this.state.datagroup["p_oldpass"]} onChange={this.onChange.bind(this, "p_oldpass")} />
          </div>
          <div className="text-input">
            <label>{this.props.strings.newPassword} <span style={{ color: 'red' }}>*</span></label>
            <input className="edit-field" type='password' id="txtNewpassword" value={this.state.datagroup["p_newpass"]} onChange={this.onChange.bind(this, "p_newpass")} />
          </div>
          <div className="text-input">
            <label>{this.props.strings.confirmPassword} <span style={{ color: 'red' }}>*</span></label>
            <input className="edit-field" type='password' id="txtNewpasswordagain" value={this.state.datagroup["p_cfmnewpass"]} onChange={this.onChange.bind(this, "p_cfmnewpass")} />
          </div>

          <button type="button" onClick={this.submitGroup.bind(this)}>{this.props.strings.save}</button>
        </div>
      </div>
    );
  }
}

const stateToProps = state => ({
  lang: state.language.language,
  auth: state.auth
});
const decorators = flow([
  connect(stateToProps),
  translate('NhaDauTu')
]);
module.exports = decorators(DoiMatKhau);