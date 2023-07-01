import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { logout } from 'actionUserName';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import { PASSWORD_LENGTH, ISCHECKSPECIALCHARACTER } from 'app/Helpers'
import { resetMenu } from 'actionMenu';
import Modalconfim from 'app/utils/modal/ModalConfirmChangePass'
import './changePassword.scss'
class changePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datagroup: {
        //p_username: '',
        p_oldpass: '',
        p_newpass: '',
        p_cfmnewpass: '',
        p_desc: '',
        p_desc: '',
        p_language: this.props.lang,
        pv_objname: '',

      },
      checkFields: [
        { name: "p_oldpass", id: "txtOldpassword" },
        { name: "p_newpass", id: "txtNewpassword" },
        { name: "p_cfmnewpass", id: "txtNewpasswordagain" },
      ],
      showModalConfirm: false,
    };
  }
  onChange(type, event) {
    let data = {};
    //this.state.datagroup.p_username = this.props.auth.user.USERNAME;
    //this.state.datagroup.p_username = "";
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
    let user = this.props.auth.user
    let isfirstlogin = user ? user.ISFIRSTLOGIN ? user.ISFIRSTLOGIN == 'Y' : true : true;
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
  async access() {

    let result = [];
    var that = this;
    //this.accessSelectRows();

    this.setState({ showModalConfirm: false })


  }


  componentDidUpdate(prevProps, prevState) {
    if (prevProps.auth && prevProps.auth.user && this.props.auth && this.props.auth.user
      && prevProps.auth.user !== this.props.auth.user
    ) {
      let user = this.props.auth.user;
      let isCustom = (user && user.ISCUSTOMER && user.ISCUSTOMER == 'Y') ? true : false;
      let isfirstlogin = (user && user.ISFIRSTLOGIN && user.ISFIRSTLOGIN == 'Y') ? true : false;

      //hardcode để show modal;
      // isfirstlogin = true;


      let showModalConfirm = (isCustom && isfirstlogin) ? true : false;
      this.setState({
        ...this.state,
        showModalConfirm: showModalConfirm
      })

      let element = document.getElementById('main_body');
      if (element && isCustom) {
        element.classList.add('change-pin-reset');
      }
    }
  }

  componentDidMount() {
    let user = this.props.auth.user;
    let isCustom = (user && user.ISCUSTOMER && user.ISCUSTOMER == 'Y') ? true : false;
    let isfirstlogin = (user && user.ISFIRSTLOGIN && user.ISFIRSTLOGIN == 'Y') ? true : false;
    window.$(function () {
      var options = { trigger: "hover" };
      $('[data-toggle="popover"]').popover(options);
    });
    let showModalConfirm = (isCustom && isfirstlogin) ? true : false;
    this.setState({
      ...this.state,
      showModalConfirm: showModalConfirm
    })

    let element = document.getElementById('main_body');
    if (element && isCustom) {
      element.classList.add('change-password-reset');
    }

  }

  componentWillUnmount() {
    let element = document.getElementById('main_body');
    if (element) {
      element.classList.remove('change-password-reset');
    }
  }

  closeModalDelete = () => this.setState({ showModalConfirm: false });

  render() {
    let { showModalConfirm } = this.state;

    return (
      <div className="change-password-container-bg">
        <div className="changePassword">
          <div className="changePassword-title" >
            {this.props.strings.title}
          </div>

          {/* Pass cu */}
          <div className="">
            <div>
              <h5 className=""><b>{this.props.strings.oldpassword}</b></h5>
            </div>
            <div className="">
              <input
                className="form-control inputPass"
                type="password"
                placeholder={this.props.strings.oldpassword}
                id="txtOldpassword"
                value={this.state.datagroup["p_oldpass"]}
                onChange={this.onChange.bind(this, "p_oldpass")}
              />
            </div>
          </div>

          {/* Pass moi */}
          <div className="">
            <div className="">
              <h5 className="">
                <b>
                  {this.props.strings.newpassword}
                </b>
              </h5>
            </div>
            <div className="">
              <input
                className="form-control inputPass"
                type="password"
                placeholder={this.props.strings.newpassword}
                id="txtNewpassword"
                value={this.state.datagroup["p_newpass"]}
                onChange={this.onChange.bind(this, "p_newpass")}
                data-container="body"
                data-toggle="popover"
                data-placement="bottom"
                data-content={this.props.strings.requiredstrongpass1}
              />
            </div>
          </div>

          {/* Nhap lai pass moi */}
          <div className="">
            <div className="">
            </div>
            <div className="">
              <h5 className=""><b>{this.props.strings.newpasswordagain}</b></h5>
            </div>
            <div className="">
              <input
                className="form-control inputPass"
                type="password"
                placeholder={this.props.strings.newpasswordagain}
                id="txtNewpasswordagain"
                value={this.state.datagroup["p_cfmnewpass"]}
                onChange={this.onChange.bind(this, "p_cfmnewpass")}
                data-container="body"
                data-toggle="popover"
                data-placement="top"
                data-content={this.props.strings.requiredstrongpass1}
              />
            </div>
          </div>

          <div className="">
            <input
              type="button"
              onClick={this.submitGroup.bind(this)}
              className="btn savePass"
              value={this.props.strings.submit}
              id="btnSubmit"
            />
          </div>
          <Modalconfim show={showModalConfirm} onHide={() => this.closeModalDelete()} access={this.access.bind(this)} />
        </div>

      </div>
    )
  }
}
changePassword.defaultProps = {

  strings: {
    title: 'Thay đổi tên đăng nhập/mật khẩu'

  },


};
const stateToProps = state => ({
  auth: state.auth,
  lang: state.language.language
});


const decorators = flow([
  connect(stateToProps),
  translate('changePassword')
]);

module.exports = decorators(changePassword);
