import React from 'react';
import Notification from 'Notification';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux'
import MenuHo from './MenuHo'
import IndexDock from './IndexDock'
import { setTradingdate } from 'app/action/actionSystemdate.js';
import axios from 'axios'
import { setCurrentUser, setAllAccounts } from 'app/action/authActions.js';
import { loadMenu, showMenu } from 'actionMenu';
import RestfulUtils from 'app/utils/RestfulUtils';
import { changeLanguage } from 'app/action/actionLanguage.js';
import { saveLanguageKey } from '../Helpers';
import MenuNotLogin from 'app/utils/MenuNotLogin/MenuNotLogin';

class Main extends React.Component {
  changeLanguage(language) {

    saveLanguageKey(language)
    this.props.changeLanguage(language);
  }
  render() {

    let auth = this.props.auth;
    let { isDisplay } = this.props.dataMenu;

    let isCustom = (auth && auth.user && auth.user.ISCUSTOMER == 'Y') ? true : false;

    return (

      <div className="main" >

        {auth.isAuthenticated && isDisplay && <MenuHo />}
        {/* off dock */}
        {/* {auth.isAuthenticated && isDisplay && !isCustom && <IndexDock />} */}
        {!auth.isAuthenticated && isDisplay}
        {auth.isAuthenticated ?
          <div style={{ marginTop: "30px", display: "none" }} className="choose_language">
            <span style={{ opacity: this.props.language == "vie" ? "1" : "0.6", marginTop: "15px" }} onClick={this.changeLanguage.bind(this, 'vie')} className="flag_vn"></span>
            <span style={{ opacity: this.props.language == "en" ? "1" : "0.6", marginTop: "15px" }} onClick={this.changeLanguage.bind(this, 'en')} className="flag_en"></span>
          </div> : null}

        {/* menu dành cho khi đăng ký/đăng nhập, quên mật khẩu */}
        {!auth.isAuthenticated &&
          <MenuNotLogin />
        }
        <div className="content-main">{this.props.children}</div>


        <Notification />
        <ToastContainer />
      </div>
    )
  }
  setTradingDate = () => {
    var that = this;

    axios.get('account/gettradingdate')
      .then((res) => {

        that.props.setTradingdate(res.data.DT.p_tradingdate);
      })
  }
  syncAccountList = () => {
    RestfulUtils.post('/account/refresh', { pagesize: 10, language: this.props.language, isSync: true }).then((resData) => {
      if (resData.EC == 0) {
        console.log('syncAccountList success')
      } else {
        console.log('syncAccountList fail')
      }
    });

  }
  syncOrderList = () => {
    let CUSTODYCD = ''
    const { user } = this.props.auth;
    if (!user) {
      console.log("syncOrderList============Not logged in=======================")
      return;
    }
    let isCustom = (user && user.ISCUSTOMER == 'Y') ? true : true;
    if (isCustom)
      CUSTODYCD = user.USERID;

    let self = this
    RestfulUtils.post('/order/getOrderList', { pagesize: 10, CUSTODYCD: CUSTODYCD, LANGUAGE: this.props.language, OBJNAME: 'PLACEORDER', isSync: true }).then((resData) => {
      if (resData.EC == 0) {
        console.log('syncOrderList success')
      } else {

        console.log('syncOrderList success')

      }
    });
  }
  syncTransList = () => {
    let self = this
    RestfulUtils.post('/transactions/get', { pagesize: 10, p_language: this.props.language, isSync: true }).then((resData) => {
      if (resData.EC == 0) {
        console.log('syncTransList success')
      } else {

        console.log('syncTransList success')

      }
    });
  }
  async componentDidMount() {
    var that = this;
    await axios.get('auth/loginFlex')
      .then((res) => {

        localStorage.setItem('jwToken', res.data.token);
        let data = res.data.user;

        let isCustom = data.ISCUSTOMER == 'Y' ? true : false;
        if (isCustom) {
          let mainBodyElement = document.getElementById('main_body');
          mainBodyElement.classList.add('customer');
        } else {
          let mainBodyElement = document.getElementById('main_body');
          mainBodyElement.classList.add('admin');
        }

        that.props.setCurrentUser(data);
        that.fetchAllAccounts();
        io.socket.get('/userfunc/getmenu', function (resData, jwRes) {

          that.props.loadMenu(resData);
          //that.props.showMenu();
        })
      })


      .catch(function (err) {

      });
    this.setTradingDate();
    io.socket.on('loadAccounts', function () {
      that.fetchAllAccounts();
    });
    //changeclassmargin();
    //this.syncAccountList();
    // this.syncOrderList();
    // const { user } = this.props.auth
    // let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
    // if (!isCustom)
    //   await this.syncTransList();
  }

  fetchAllAccounts = async () => {
    let { auth } = this.props;
    if (auth && auth.user && auth.user.ISCUSTOMER && auth.user.ISCUSTOMER == 'Y') {
      let obj1 = {
        OBJNAME: "ACCOUNT",
        sortSearch: '',
        keySearch: '',
        pagesize: 10000,
        page: 1
      }
      let that = this;
      await RestfulUtils.post('account/getlist', obj1)
        .then(resData => {
          let accounts = [];
          if (resData.EC === 0) {
            accounts = resData.DT ? resData.DT.data : [];
          }
          that.props.setAllAccounts(accounts);
        })
    }
  }
}

Main.contextTypes = {
  router: PropTypes.object.isRequired
}
const stateToProps = state => ({
  language: state.language.language,
  auth: state.auth,
  dataMenu: state.dataMenu
});
const dispatchToProps = dispatch => ({
  setTradingdate: bindActionCreators(setTradingdate, dispatch),
  setCurrentUser: bindActionCreators(setCurrentUser, dispatch),
  loadMenu: bindActionCreators(loadMenu, dispatch),
  showMenu: bindActionCreators(showMenu, dispatch),
  changeLanguage: bindActionCreators(changeLanguage, dispatch),
  setAllAccounts: bindActionCreators(setAllAccounts, dispatch),
});

module.exports = connect(stateToProps, dispatchToProps)(Main);
