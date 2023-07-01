import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { logout } from 'actionUserName';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import { PASSWORD_LENGTH, ISCHECKSPECIALCHARACTER } from 'app/Helpers'
import { resetMenu } from 'actionMenu';

class changeUsername extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datagroup: {
        p_oldusername: '',
        p_newusername: '',
        p_cfmnewusername: '',
        p_mobile:'',
        p_email:'',
        p_desc: '',
        p_language: this.props.lang,
        pv_objname: this.props.datapage.OBJNAME,
      },
    };
  }

  resetForm() {
    this.state.datagroup= {
      p_oldusername: '',
      p_newusername: '',
      p_cfmnewusername: '',
      p_mobile:'',
      p_email:'',
      p_desc: '',
      p_language: this.props.lang,
      pv_objname: this.props.datapage.OBJNAME,
    };
    this.setState(this.state);
  }

  onChange(type, event) {
    if (event.target) {
      this.state.datagroup[type] = event.target.value;
    }
    else {
      this.state.datagroup[type] = event.value;
    }
    this.setState({ datagroup: this.state.datagroup })
    if (type =='p_oldusername') {
      var api = '/accountinfo/getaccountinfo_by_username';
      RestfulUtils.post(api, {p_username:this.state.datagroup.p_oldusername,p_language:this.state.datagroup.p_language})
        .then((res) => {
          if (res.EC == 0 && res.DT && res.DT.length >0) {
            var info = res.DT[0];
            this.state.datagroup.p_mobile = info.MOBILE;
            this.state.datagroup.p_email = info.EMAIL;
            this.setState(this.state);
          }
        })
    }
  }
  checkValid() {
    let mssgerr = '';
    var { dispatch } = this.props;
    var datanotify = {
      type: "",
      header: "",
      content: ""

    }
    datanotify.type = "error";

    let p_oldusername = this.state.datagroup.p_oldusername;
    if (p_oldusername == '') {
      mssgerr = this.props.strings.requiredoldusername;
      datanotify.content = mssgerr;
      dispatch(showNotifi(datanotify));
      window.$(`#${'txtOldUsername'}`).focus();
      return mssgerr;
    }
    let p_newusername = this.state.datagroup.p_newusername;
    if (p_newusername == '') {
      mssgerr = this.props.strings.requirednewusername;
      datanotify.content = mssgerr;
      dispatch(showNotifi(datanotify));
      window.$(`#${'txtNewUsername'}`).focus();
      return mssgerr;
    }
    let p_cfmnewusername = this.state.datagroup.p_cfmnewusername;
    if (p_cfmnewusername == '') {
      mssgerr = this.props.strings.requiredcfmnewusername;
      datanotify.content = mssgerr;
      dispatch(showNotifi(datanotify));
      window.$(`#${'txtNewUsernameagain'}`).focus();
      return mssgerr;
    } else {
      if (p_cfmnewusername != this.state.datagroup.p_newusername) {
        mssgerr = this.props.strings.requirednotsame;
        datanotify.content = mssgerr;
        dispatch(showNotifi(datanotify));
        window.$(`#${'txtNewUsernameagain'}`).focus();
        return mssgerr
      }
    }
    return mssgerr;
  }
  submitGroup() {
    var mssgerr = this.checkValid();
    if (mssgerr == '') {
      var api = '/accountinfo/changecustomerusername';

      var { dispatch } = this.props;
      var datanotify = {
        type: "",
        header: "",
        content: ""
      }
      RestfulUtils.post(api, this.state.datagroup)
        .then((res) => {
          if (res.EC == 0) {
            datanotify.type = "success";
            datanotify.content = this.props.strings.success;
            this.resetForm();
          } else {
            datanotify.type = "error";
            datanotify.content = res.EM;
          }
          dispatch(showNotifi(datanotify));
        })
    }
  }
  render() {

    return (
      <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

        <div className="add-info-account">

          <div className="title-content" >{this.props.strings.title}</div>

          <div className="col-md-12" style={{ paddingTop: "11px" }}>
            <div className="col-md-12 row">
              <div className="col-md-3">
              </div>
              <div className="col-md-3">
                <h5 className="highlight"><b>{this.props.strings.oldusername}</b></h5>
              </div>
              <div className="col-md-3">
                <input className="form-control" type="text" placeholder={this.props.strings.oldusername} id="txtOldUsername" value={this.state.datagroup["p_oldusername"]} onChange={this.onChange.bind(this, "p_oldusername")} />
              </div>
            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
              </div>
              <div className="col-md-3">
                <h5 className="highlight"><b>{this.props.strings.newusername}</b></h5>
              </div>
              <div className="col-md-3">
                <input className="form-control" type="text" placeholder={this.props.strings.newusername} id="txtNewUsername" value={this.state.datagroup["p_newusername"]} onChange={this.onChange.bind(this, "p_newusername")} />
              </div>
            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
              </div>
              <div className="col-md-3">
                <h5 className="highlight"><b>{this.props.strings.newusernameagain}</b></h5>
              </div>
              <div className="col-md-3">
                <input className="form-control" type="text" placeholder={this.props.strings.newusernameagain} id="txtNewUsernameagain" value={this.state.datagroup["p_cfmnewusername"]} onChange={this.onChange.bind(this, "p_cfmnewusername")} />
              </div>
            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
              </div>
              <div className="col-md-3">
                <h5 className="highlight"><b>{this.props.strings.mobile}</b></h5>
              </div>
              <div className="col-md-3">
                <input className="form-control" type="text" disabled value={this.state.datagroup["p_mobile"]} onChange={this.onChange.bind(this, "p_mobile")} />
              </div>
            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
              </div>
              <div className="col-md-3">
                <h5 className="highlight"><b>Email</b></h5>
              </div>
              <div className="col-md-3">
                <input className="form-control" type="text" disabled value={this.state.datagroup["p_email"]} onChange={this.onChange.bind(this, "p_email")} />
              </div>
            </div>

            <div className="col-md-12 row">
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <input style={{ display: 'inline-block' }} type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" value={this.props.strings.submit} id="btnSubmit" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
changeUsername.defaultProps = {

  strings: {
    title: 'Thay đổi tên đăng nhập'

  },


};
const stateToProps = state => ({
  lang: state.language.language
});


const decorators = flow([
  connect(stateToProps),
  translate('changeUsername')
]);

module.exports = decorators(changeUsername);
