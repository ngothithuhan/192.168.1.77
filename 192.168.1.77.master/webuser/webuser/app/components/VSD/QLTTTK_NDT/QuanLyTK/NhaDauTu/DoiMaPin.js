import React from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { logout } from 'actionUserName';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import { PIN_LENGTH, ISCHECKSPECIALCHARACTER_PIN } from 'app/Helpers'
import { resetMenu } from 'actionMenu';

class DoiMaPin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      datagroup: {
        p_oldpin: '',
        p_newpin: '',
        p_cfmnewpin: '',
        p_desc: '', // dùng khi gọi api
        p_language: this.props.lang,
        pv_objname: '', // dùng khi gọi api

      },
      checkFields: [
        { name: "p_oldpin", id: "txtOldpin" },
        { name: "p_newpin", id: "txtNewpin" },
        { name: "p_cfmnewpin", id: "txtNewpinagain" },

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

      case "p_oldpin":
        if (value == '') {
          mssgerr = this.props.strings.requiredoldpin;
        }
        break;
      case "p_newpin":

        if (value == '') {
          mssgerr = this.props.strings.requirednewpin;
        } else {
          if (ISCHECKSPECIALCHARACTER_PIN === true) {
            if (!((value.length <= PIN_LENGTH && value.match(/[a-z]/)) && (value.match(/[A-Z]/)) && value.match(/[0-9]/) && value.match(/[\!\@\#\$\%\^\&\*\?\_\~\-\(\)]+/)))
              mssgerr = this.props.strings.requiredstrongpin1;
          } else {
            let reg = new RegExp(`^[0-9]{${PIN_LENGTH}}$`);
            if (!reg.test(value))
              mssgerr = this.props.strings.requiredstrongpin;
          }
        }
        break;
      case "p_cfmnewpin":
        if (value == '') {
          mssgerr = this.props.strings.requiredcfmnewpin;
        } else {
          if (value != this.state.datagroup['p_newpin']) mssgerr = this.props.strings.requirednotsamepin;
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

            RestfulUtils.post('/session/logOut')
              .then(res => {
                dispatch(logout());
                dispatch(resetMenu())
                window.location.href = '/Login'
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
      <div className="dmp-container">
        <div className="dmp-header">
          {this.props.strings.DMP}
        </div>
        <div className="dmp-content">
          <div className="text-input">
            <label>{this.props.strings.oldPin} <span style={{ color: 'red' }}>*</span></label>
            <input type='password'
              className="edit-field"
              id="txtOldpin"
              value={this.state.datagroup["p_oldpin"]}
              onChange={this.onChange.bind(this, "p_oldpin")}
              maxlength={PIN_LENGTH}
            />
          </div>
          <div className="text-input">
            <label>{this.props.strings.newPin} <span style={{ color: 'red' }}>*</span></label>
            <input maxlength={PIN_LENGTH}
              className="edit-field" type='password' id="txtNewpin" value={this.state.datagroup["p_newpin"]} onChange={this.onChange.bind(this, "p_newpin")} />
          </div>
          <div className="text-input">
            <label>{this.props.strings.confirmPin} <span style={{ color: 'red' }}>*</span></label>
            <input maxlength={PIN_LENGTH}
              className="edit-field" type='password' id="txtNewpinagain" value={this.state.datagroup["p_cfmnewpin"]} onChange={this.onChange.bind(this, "p_cfmnewpin")} />
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
module.exports = decorators(DoiMaPin);