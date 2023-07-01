import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { logout } from 'actionUserName';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import { PIN_LENGTH, ISCHECKSPECIALCHARACTER } from 'app/Helpers'
import { resetMenu } from 'actionMenu';
import Modalconfim from 'app/utils/modal/ModalConfirmChangePass';
import './changePin.scss';

class changePin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datagroup: {
        p_oldpin: '',
        p_newpin: '',
        p_cfmnewpin: '',
        p_desc: '',
        p_desc: '',
        p_language: this.props.lang,
        pv_objname: '',

      },
      checkFields: [
        { name: "p_oldpin", id: "txtOldpin" },
        { name: "p_newpin", id: "txtNewpin" },
        { name: "p_cfmnewpin", id: "txtNewpinagain" },

      ],
      showModalConfirm: false,
    };
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

      case "p_oldpin":
        if (value == '') {
          mssgerr = this.props.strings.requiredoldpin;
        }
        break;
      case "p_newpin":
        if (value == '') {
          mssgerr = this.props.strings.requirednewp;
        } else {
          if (ISCHECKSPECIALCHARACTER) {
            if (!((value.length >= PIN_LENGTH && value.match(/[a-z]/)) && (value.match(/[A-Z]/)) && value.match(/[0-9]/) && value.match(/[\!\@\#\$\%\^\&\*\?\_\~\-\(\)]+/)))
              mssgerr = this.props.strings.requiredstrongpin1;
          } else {
            if (!((value.length >= PIN_LENGTH && value.match(/[a-z]/)) && (value.match(/[A-Z]/)) && value.match(/[0-9]/)))
              mssgerr = this.props.strings.requiredstrongpin;
          }
        }
        break;
      case "p_cfmnewpin":
        if (value == '') {
          mssgerr = this.props.strings.requiredcfmnewpin;
        } else {
          if (value != this.state.datagroup['p_newpin']) mssgerr = this.props.strings.requirednotsame;
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
    this.setState({ showModalConfirm: false })
  }

  componentDidMount() {
    let user = this.props.auth.user;
    let isCustom = (user && user.ISCUSTOMER && user.ISCUSTOMER == 'Y') ? true : false;
    let isfirstlogin = (user && user.ISFIRSTLOGIN && user.ISFIRSTLOGIN == 'Y') ? true : false;

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

  componentWillUnmount() {
    let element = document.getElementById('main_body');
    if (element) {
      element.classList.remove('change-pin-reset');
    }
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

  closeModalDelete = () => this.setState({ showModalConfirm: false });

  render() {
    let { showModalConfirm } = this.state;


    return (
      <React.Fragment>
        <div className="change-pin-container-bg">
          <div className="change-pin-container row">
            <div className="change-pin-title col-md-12" >
              <span>{this.props.strings.title}</span>
            </div>
            <div className="row change-pin-body">
              <div className="col-md-12 form-group add-pdt-10">
                <label>{this.props.strings.oldpin} <span style={{ color: 'red' }}>*</span></label>
                <input
                  className="form-control"
                  type="password"
                  placeholder={this.props.strings.oldpin}
                  id="txtOldpin"
                  value={this.state.datagroup["p_oldpin"]}
                  onChange={this.onChange.bind(this, "p_oldpin")}
                />
              </div>
              <div className="col-md-12 form-group add-pdt-10">
                <label>{this.props.strings.newpin} <span style={{ color: 'red' }}>*</span></label>
                <input
                  className="form-control"
                  type="password"
                  placeholder={this.props.strings.newpin}
                  id="txtNewpin"
                  value={this.state.datagroup["p_newpin"]}
                  onChange={this.onChange.bind(this, "p_newpin")}
                />

              </div>
              {/* <div className="col-md-12 add-pdt-10">
                {this.props.strings.requiredstrongpass1}
              </div> */}
              <div className="col-md-12 form-group add-pdt-10">
                <label>{this.props.strings.newpinagain} <span style={{ color: 'red' }}>*</span></label>
                <input
                  className="form-control"
                  type="password"
                  placeholder={this.props.strings.newpinagain}
                  id="txtNewpinagain"
                  value={this.state.datagroup["p_cfmnewpin"]}
                  onChange={this.onChange.bind(this, "p_cfmnewpin")}
                />
              </div>
              <div className="col-md-12 add-pdt-10">
                <input type="button"
                  onClick={this.submitGroup.bind(this)}
                  className="btn-change-pin"
                  value={this.props.strings.submit}
                  id="btnSubmit"
                />
              </div>
            </div>
          </div>
        </div>
        <Modalconfim show={showModalConfirm} onHide={() => this.closeModalDelete()} access={this.access.bind(this)} />
      </React.Fragment>
    )
  }
}
changePin.defaultProps = {

  strings: {
    title: 'Thay đổi PIN'

  },


};
const stateToProps = state => ({
  auth: state.auth,
  lang: state.language.language
});


const decorators = flow([
  connect(stateToProps),
  translate('changePin')
]);

module.exports = decorators(changePin);
