import React from 'react'

import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import PropTypes from 'prop-types';
import { setCurrentUser } from 'app/action/authActions.js';
import { changeLanguage } from 'app/action/actionLanguage.js';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { showMenu } from 'actionMenu';
import { resetMenu } from 'actionMenu';
import RingABell from 'app/components/RingABell';
import { getLanguageKey, saveLanguageKey, LANGUAGE_KEY } from '../Helpers';
import RestfulUtils from 'app/utils/RestfulUtils';
import { toast } from 'react-toastify';
import BellNotification from 'app/utils/RingBell/BellNotification.js';




var log = require('app/utils/LoggerFactory.js').LoggerFactory({
  prefix: true, module: 'LoginSuccess.:'
});
function renderActive(data, language) {

  if (data.children && data.children.length > 0) {
    // console.log("GroupMenu = " + data.GroupMenu)
    let classMenu = "dropdown-mainmenu"
    if (data.PRID) {
      classMenu = "dropdown-submenu"
    }
    // console.log(data,language)
    return (


      <li key={data.id} className={classMenu}>
        {/* <NavLink to={"/"+data.OBJNAME} className="dropdown-toggle" data-toggle="dropdown"></NavLink> */}
        <a href="#">{language == "vie" ? data.CMDNAME : data.EN_CMDNAME}</a>
        <ul style={{ zIndex: 1001 }} className="dropdown-menu">
          {data.children.map(c => (renderActive(c, language)))}
        </ul>
      </li>

    )
  }
  else {
    if (data.CMDNAME !== '---')
      return <li key={data.id}><NavLink to={"/" + data.OBJNAME} >{language == "vie" ? data.CMDNAME : data.EN_CMDNAME}</NavLink></li>
    else
      return <li style={{ paddingTop: 0, paddingBottom: 0 }} key={data.id}><hr style={{ marginBottom: 0, marginTop: 0 }} /></li>
  }
}


class MenuNgang extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataInfo: {},
      datamenu: [],
      data: [],
      notificationNUM: 1,
      page: 1,
      listCustodycd: []
    }
  }
  async changeLanguage(language) {

    let { dispatch } = this.props;
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


  async componentWillMount() {
    let { dispatch } = this.props
    // axios.get('/session/getLanguage')
    //   .then(async (res) => {
    //     console.log('res.data.data',res.data.data)
    //     if (res.data.errCode == 0) {
    //       await dispatch(changeLanguage(res.data.data));
    //     }
    //   })
    let language = "vie"
    await RestfulUtils.post('/session/getLanguage', {}).then((resData) => {
      if (resData.errCode == 0) {
        language = resData.data
        console.log('getLanguage.:language.:', language)
      }
      else
        console.log('getLanguage fail, get default language vie!')
      saveLanguageKey(language)
      dispatch(changeLanguage(language));
    });
    // get info company
    // khong dung HEADEMAIL va HEADHOSTLINE
    // await RestfulUtils.post('/nav/getcompanycontact', { language: this.props.language }).then((resData) => {
    //   if (resData.EC == 0) {
    //     this.setState({ dataInfo: resData.data[0] })
    //   } else {
    //     toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
    //   }
    // });


  }

  async componentDidMount() {

    let self = this
    console.log('this.props.auth.ISCUSTOMER:', this.props.auth.ISCUSTOMER)
    if (this.props.auth.ISCUSTOMER) {
      RestfulUtils.post('/account/getAccountIdsByUsername', { key: '' })
        .then((res) => {
          if (res.length > 0) {
            self.state.listCustodycd = res;
          } else self.state.listCustodycd = [];
          self.setState(self.state);
        });
    }
    await RestfulUtils.post('/userfunc/getmenu').then(resData => {
      console.log('coc coc  >>>>>', resData)
      self.setState({ datamenu: resData })
    })
    // jquery for header
    $(document).ready(
      function () {
        $('.menu-toggle').click(function () {
          $('nav').toggleClass('active')
        })

        $('header ul li').click(function () {
          $(this).siblings().removeClass('active');
          $(this).toggleClass('active');
        })
      }
    )
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    //  m = this.checkTime(m);
    //  s = this.checkTime(s);
    //  this.state.time =
    //  h + ":" + m + ":" + s;
    //  this.setState(this.state)
    // setInterval(function () {
    //   today = new Date();
    //   let time = '';
    //   h = today.getHours();
    //   m = today.getMinutes();
    //   s = today.getSeconds();
    //   //   m = that.checkTime(m);
    //   if (m < 10) { m = "0" + m }
    //   //   s = that.checkTime(s);
    //   if (s < 10) { s = "0" + s }
    //   time = h + ":" + m + ":" + s;
    //   let divtime = document.getElementById("homeTimer")
    //   // if (divtime){
    //   divtime.innerHTML = time + "(GMT+7)";
    //   // this.setState({ time: time })
    // }, 1000);
  }
  onChangeCustodycd(custodycd) {
    RestfulUtils.post('/auth/changeDefaultCustodyCd', { P_CUSTODYCD: custodycd })
      .then((res) => {
        if (res.EC == 0) {
          window.location.reload();
        }
      });
  }
  logOut(e) {
    e.preventDefault();
    window.location.replace("/auth/logout");
  }
  showMenu = () => {
    this.props.showMenu();
  }
  handleClick = (e) => {
    const linkDisabled = this.props.auth.user.ISFIRSTLOGIN
    if (linkDisabled) e.preventDefault()
  }
  render() {
    let language = this.props.language
    //console.log('thay doi language', language)
    let { datamenu, data, page } = this.state
    const { user } = this.props.auth
    let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
    let ISFIRSTLOGIN = user ? user.ISFIRSTLOGIN ? user.ISFIRSTLOGIN == 'Y' : true : true;
    let ischangepass = user ? user.NEEDCHANGEPASS ? user.NEEDCHANGEPASS == 'Y' : true : true;
    let ISRM = user ? user.ISRM ? user.ISRM == 'Y' : true : true;
    let auth = this.props.auth
    let dataMenu = this.props.dataMenu
    let lang = this.props.language
    console.log('lang:::', lang)
    let today = new Date()
    let todaydisplay = new Date()
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    todaydisplay = dd + '/' + mm + '/' + yyyy;
    console.log('today:::', today)
    let date = new Date(today)
    //var date = new Date(this.props.tradingdate);
    let current_day = date.getDay();
    let day_name = '';
    switch (current_day) {
      case 0:
        day_name = lang == 'vie' ? "Chủ nhật, " : "Sunday, ";
        break;
      case 1:
        day_name = lang == 'vie' ? day_name = "Thứ hai, " : "Monday, ";
        break;
      case 2:
        day_name = lang == 'vie' ? day_name = "Thứ ba, " : "Tuesday, ";
        break;
      case 3:
        day_name = lang == 'vie' ? day_name = "Thứ tư, " : "Wednesday, ";
        break;
      case 4:
        day_name = lang == 'vie' ? day_name = "Thứ năm, " : "Thursday, ";
        break;
      case 5:
        day_name = lang == 'vie' ? day_name = "Thứ sáu, " : "Friday, ";
        break;
      case 6:
        day_name = lang == 'vie' ? day_name = "Thứ bảy, " : "Saturday, ";
    }
    let currdate = day_name + todaydisplay + ', ';
    //console.log('isCustom', isCustom)
    const MenuNgang = (

      <ul style={{ backgroundColor: 'white' }} className="nav navbar-nav">
        <li style={{ zIndex: 1001 }} className="dropdown">
          <NavLink style={{ paddingTop: "24px", fontSize: "14px", marginLeft: "20px", marginRight: "-15px", height: '53px' }}
            to={!isCustom ? "/TRANSACTIONS" : "/PLACEORDER"}
            className=""
            data-toggle=""
            role=""
            aria-expanded="false">
            <i className="fas fa-home"></i>
            <span className=""></span>
          </NavLink>

        </li>
        {datamenu && datamenu.length && datamenu.map(c => renderActive(c, language))}


      </ul>
    )
    const MenuCustomer = (
      <div>
        <div style={{ zIndex: '2000' }} className="menu_customer" id="menu_customer_1">
          <nav style={{}} className="navbar navbar-default nav-cus title-header navbar-fixed-top">
            {/* <div className=" container menu-user" style={{ height: '50px' }} >

              <div style={{ fontSize: "14px", marginTop: '5px' }} className="collapse navbar-collapse"> */}
            {/* <div className="navbar-left importantWhite2">
                  <div className="mytime">
                    <div><b><i className="far fa-clock"></i>
                      <span id="datename" >{currdate}</span>
                      <span id="homeTimer"></span></b>
                    </div>
                  </div>
                </div> */}
            {/* <div> */}
            <div className="container menu-user">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a style={{}} className="navbar-brand" href="#">
                  <img style={{ maxWidth: 'unset' }} src="../images/logo_SSIAM2.png" />
                </a>
              </div>
              {/* nav first login */}
              <div style={{ background: 'transparent', fontSize: "14px", width: "100%", marginTop: '0px' }} className="collapse navbar-collapse" id="myNavbar">
                {((!ISFIRSTLOGIN || ischangepass) && isCustom) && <ul className="nav navbar-nav navbar-customer">
                  {/* HOME */}
                  {/* <li>
                          <NavLink style={{ paddingTop: "24px", fontSize: "14px", marginLeft: "20px", marginRight: "-15px" }}
                            to={"/HOME"}
                            className=""
                            data-toggle=""
                            role=""
                            aria-expanded="false">
                            <i className="fas fa-home"></i>
                            <span className=""></span>
                          </NavLink>
                        </li> */}


                  {/* Tổng quan tài sản */}
                  <li>
                    <NavLink to="/OVERVIEWPROPERTY" >
                      <div className="">{this.props.strings.overviewproperty}</div>
                    </NavLink>
                  </li>

                  {/* Danh mục đầu tư */}
                  <li>
                    <NavLink to="/PORTFOLIO" >
                      <div className="">{this.props.strings.report}</div>
                    </NavLink>
                  </li>
                  {/* đặt lệnh */}
                  <li className="dropdown dropdown-mainmenu">
                    <NavLink to="/PLACEORDER" >
                      <div className="">{this.props.strings.placeorder} </div>
                    </NavLink>
                  </li>
                  {/* Lịch sử giao dịch */}
                  <li>
                    <NavLink to="/ODTRANSHIST" >
                      <div className="">{this.props.strings.transHist}</div>
                    </NavLink>
                  </li>
                  {/* Truy vấn số dư & CCQ */}
                  {/* <li>
                          <NavLink to="/BALANCE" >
                            <div className="">{this.props.strings.BALANCE}</div>
                          </NavLink>
                        </li> */}
                  {/* Sao kê tiền */}
                  <li>
                    <NavLink to="/CASHTRANSACTIONHIS" >
                      <div className="">{this.props.strings.cashStatement}</div>
                    </NavLink>
                  </li>
                  {/* Sao kê số dư CCQ */}
                  <li>
                    <NavLink to="/FUNDTRANSACTIONHIST" >
                      <div className="">{this.props.strings.fundStatement}</div>
                    </NavLink>
                  </li>
                  {/* Tài khoản */}
                  <li className="dropdown dropdown-mainmenu">
                    <NavLink to="/MANAGERACCT" >
                      <div className="">{this.props.strings.QuanLyTK}</div>
                    </NavLink>
                  </li>
                </ul>}
              </div>

              <div className="account-tool">
                <ul className="nav navbar-nav nav-profile">
                  {/* {user.ISCUSTOMER ? <li style={{}} className="dropdown dropdown-user">
                          <div className="dropdown">
                            <a href="#" className="dropdown-toggle importantWhite2" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><div className="icon-user" style={{ height: "30px" }}> </div><span className="render">{this.props.strings.account}: <strong>{user.USERID}</strong></span> <span className="caret" style={{ marginTop: "0px" }}></span></a>
                            <ul className="dropdown-menu">
                              {this.state.listCustodycd.map((item, idx) => {
                                return <li><a className="importantBlack" onClick={this.onChangeCustodycd.bind(this, item.value)}><i class="fas fa-user-edit" style={{ marginRight: '5px' }}></i>{item.value}</a></li>
                              })}
                            </ul>
                          </div>
                        </li> : null} */}
                  {/* <li style={{ color: '#242729 ' }}><a href=""><i className="fa fa-phone-square"></i> {this.state.dataInfo.HEADHOSTLINE}</a></li>
                            <li style={{ borderRight: '1px solid #f2f3f5', color: '#242729' }}><a href=""><i className="fa fa-envelope-square"></i> {this.state.dataInfo.HEADEMAIL}</a></li> */}
                  <li style={{}} className="dropdown dropdown-user">
                    <div className="dropdown">
                      <a href="#" className="dropdown-toggle importantWhite2" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                        {/* <div className="icon-user"><i className="fas fa-user-circle"></i> </div> */}
                        <span className="render">{this.props.strings.hello}, <strong>{user.TLFULLNAME}</strong></span> <span className="caret"></span></a>
                      {/*<a href="#" className="dropdown-toggle importantWhite" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><div className="icon-user"><i className="fas fa-user-circle"></i> </div><span className="render">
                            {this.props.strings.hello}, <strong>{user.TLFULLNAME}</strong>
                            </span> <span className="caret"></span></a> */}
                      <ul className="dropdown-menu">
                        {/* <li ><a href="#">Quản lý tài khoản</a></li> */}
                        <li><a className="importantBlack" href="/changePassword"><i className="fas fa-user-edit"></i> {this.props.strings.changepass}</a></li>
                        <li><a className="importantBlack" href="/changePin"><i className="fas fa-user-edit"></i> {this.props.strings.changepin}</a></li>
                        <li role="separator" className="divider"></li>
                        <li><a className="importantBlack" onClick={this.logOut.bind(this)} href="#"><i className="fas fa-sign-out-alt"></i> {this.props.strings.logout}</a></li>
                      </ul>
                    </div>
                  </li>
                </ul>
                <ul style={{ paddingRight: "0" }} className="nav navbar-nav">
                  <li style={{ opacity: this.props.language == "vie" ? "1" : "0.6", marginTop: "11px" }} onClick={this.changeLanguage.bind(this, 'vie')} data-tip={this.props.strings.vietnamese} className="flag_vn"></li>
                  <li style={{ opacity: this.props.language == "en" ? "1" : "0.6", marginTop: "11px" }} onClick={this.changeLanguage.bind(this, 'en')} data-tip={this.props.strings.english} className="flag_en"></li>
                </ul>
              </div>
            </div>

            {/* </div> */}
            {/* </div>

            </div> */}
          </nav>
        </div>

        <header>
          <div className="logo"><a className="navbar-brand" href="#"> <img src="../images/Logo2.png" /></a></div>
          <nav>
            <ul>
              <li>
                <NavLink
                  to={"/HOME"}
                  data-toggle=""
                  role=""
                  aria-expanded="false">
                  <i style={{}} className="fas fa-home"></i>
                  <span className=""></span>
                </NavLink>
              </li>
              <li className="sub-menu">
                <NavLink data-toggle="dropdown" to="" >
                  <div>{this.props.strings.account}</div>
                </NavLink>
                <ul>
                  <li>
                    <NavLink to="/MANAGERACCT" >
                      <div>{this.props.strings.accountmanager}</div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/OTPCONFIRMCF" >
                      <div >{this.props.strings.otpopen}</div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/BALANCE" >
                      <div className="">{this.props.strings.balance}</div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/CUSTOMER4SALE" >
                      <div className="">{this.props.strings.customer4sale}</div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/CASHTRANSACTIONHIS" >
                      <div className="">{this.props.strings.cashtrans}</div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/FUNDTRANSACTIONHIST" >
                      <div className="">{this.props.strings.fundtrans}</div>
                    </NavLink>
                  </li>

                </ul>
              </li>
              <li className="sub-menu">
                <NavLink className="dropdown-toggle" data-toggle="dropdown" to="" >
                  <div >{this.props.strings.placeorder} </div>
                </NavLink>
                <ul>
                  <li>
                    <NavLink to="/PLACEORDER" >
                      <div>{this.props.strings.normalorder}</div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/PLACEORDERSIP" >
                      <div>{this.props.strings.sip}</div>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/OTPCONFIRMOD" >
                      <div >{this.props.strings.otpcofirm}</div>
                    </NavLink>
                  </li>
                  {/* <li>
                    <NavLink to="/CFORDERCONFIRM" >
                      <div className="">{this.props.strings.cforderconfirm}</div>
                    </NavLink>
                  </li> */}
                  {/* <li>
                    <NavLink to="/SRRECONCILE" >
                      <div className="">{this.props.strings.srreconcile}</div>
                    </NavLink>
                  </li> */}
                </ul>
              </li>
              <li>
                <NavLink to="/ODTRANSHIST" >
                  <div >{this.props.strings.fundcode}</div>
                </NavLink>

              </li>
              <li>
                <NavLink to="/PORTFOLIO" >
                  <div>{this.props.strings.report}</div>
                </NavLink>
              </li>
              {/* <li>
                <RingABell />
              </li> */}
              <li>
                <span style={{ opacity: this.props.language == "vie" ? "1" : "0.6", marginTop: "11px" }} onClick={this.changeLanguage.bind(this, 'vie')} data-tip={this.props.strings.vietnamese} className="flag_vn"></span>
                <span style={{ opacity: this.props.language == "en" ? "1" : "0.6", marginTop: "11px" }} onClick={this.changeLanguage.bind(this, 'en')} data-tip={this.props.strings.english} className="flag_en"></span>
              </li>
            </ul>
          </nav>
          <div className="menu-toggle">
            <i style={{ paddingTop: '21px' }} className="fa fa-bars" aria-hidden="true"></i>
          </div>
        </header>
        <section style={{ top: "65px" }} id="account-tool-mobile" className="bottommenu">
          <div className="row col-md-12">
            <div className="dropdown">
              <a href="#" className="dropdown-toggle importantWhite2" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span className="render"><div className="icon-user"><i className="fas fa-user-circle"></i> </div>{this.props.strings.hello}, <strong>{auth.isAuthenticated ? auth.user.TLFULLNAME : ""}</strong></span> <span className="caret" style={{ marginTop: "16px" }}></span></a>
              <ul className="dropdown-menu">
                <li><a href="/changePassword"><i className="fas fa-user-edit"></i> {this.props.strings.changepass}</a></li>
                <li><a href="/changePin"><i className="fas fa-user-edit"></i> {this.props.strings.changepin}</a></li>
                <li role="separator" className="divider"></li>
                <li><a onClick={this.logOut.bind(this)} href="#"><i className="fas fa-sign-out-alt"></i> {this.props.strings.logout}</a></li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    )
    return (
      <div>
        {(dataMenu.isDisplay && !isCustom) &&
          <nav style={{}} className="navbar navbar-default nav-cus title-header navbar-fixed-top" id="main_Menu" role="navigation">

            <div className=" container menu-user" style={{ height: '50px' }} >

              <div style={{ fontSize: "14px", marginTop: '5px' }} className="collapse navbar-collapse">
                <div className="navbar-left importantWhite2">
                  <div className="mytime">
                    <div><b><i className="far fa-clock"></i>
                      <span id="datename" >{currdate}</span>
                      <span id="homeTimer"></span></b> </div>
                  </div>
                </div>
                <div className="navbar-right account-tool">
                  {/* <p className="navbar-text">
                        <span className="label">
                          <strong>{this.props.strings.needhelp}</strong>
                        </span>
                      </p> */}
                  <ul className="nav navbar-nav nav-profile">
                    {/* <li style={{ color: '#242729 ' }}><a href=""><i className="fa fa-phone-square"></i> {this.state.dataInfo.HEADHOSTLINE}</a></li>
                        <li style={{ borderRight: '1px solid #f2f3f5', color: '#242729' }}><a href=""><i className="fa fa-envelope-square"></i> {this.state.dataInfo.HEADEMAIL}</a></li> */}
                    <li style={{}} className="dropdown dropdown-user">
                      <div className="dropdown">
                        <a href="#" className="dropdown-toggle importantWhite2" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><div className="icon-user"><i className="fas fa-user-circle"></i> </div><span className="render">
                          {this.props.strings.hello}, <strong>{user.TLFULLNAME}</strong></span> <span className="caret"></span></a>
                        {/*<a href="#" className="dropdown-toggle importantWhite" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><div className="icon-user"><i className="fas fa-user-circle"></i> </div><span className="render">
                         {this.props.strings.hello}, <strong>{user.TLFULLNAME}</strong>
                        </span> <span className="caret"></span></a> */}
                        <ul className="dropdown-menu">
                          {/* <li ><a href="#">Quản lý tài khoản</a></li> */}
                          <li><a className="importantBlack" href="/changePassword"><i className="fas fa-user-edit"></i> {this.props.strings.changepass}</a></li>
                          <li><a className="importantBlack" href="/changePin"><i className="fas fa-user-edit"></i> {this.props.strings.changepin}</a></li>
                          <li role="separator" className="divider"></li>
                          <li><a className="importantBlack" onClick={this.logOut.bind(this)} href="#"><i className="fas fa-sign-out-alt"></i> {this.props.strings.logout}</a></li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                  <ul style={{ paddingRight: "8px" }} className="nav navbar-nav navbar-right ">
                    <li className="dropdown">
                      <RingABell />
                    </li>
                    <li style={{ opacity: this.props.language == "vie" ? "1" : "0.6", marginTop: "11px" }} onClick={this.changeLanguage.bind(this, 'vie')} data-tip={this.props.strings.vietnamese} className="flag_vn"></li>
                    <li style={{ opacity: this.props.language == "en" ? "1" : "0.6", marginTop: "11px" }} onClick={this.changeLanguage.bind(this, 'en')} data-tip={this.props.strings.english} className="flag_en"></li>
                  </ul>
                </div>

              </div>

            </div>
            <div style={{ background: 'white' }} >
              <div className=" container menu-user">
                <div className="col-md-11">
                  <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                      <span className="sr-only">Toggle navigation</span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                    </button>

                    <a style={{}} className="navbar-brand" href="#"> <img style={{
                      height: "50px"
                    }} src="../images/logo_SSIAM.png" /></a>
                  </div>


                  <div style={{ background: 'white', fontSize: "14px", marginTop: '5px' }} className="collapse navbar-collapse">
                    {MenuNgang}

                    <ReactTooltip />

                  </div>

                </div>
                <div className="col-md-1">
                  <BellNotification />
                </div>
              </div>
            </div>


            <section id="account-tool-mobile" className="bottommenu">
              <div className="row col-md-12">
                <div className="dropdown">
                  <a href="#" className="dropdown-toggle importantWhite2" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span className="render"><div className="icon-user"><i className="fas fa-user-circle"></i> </div>{this.props.strings.hello}, <strong>{auth.isAuthenticated ? auth.user.TLFULLNAME : ""}</strong></span> <span className="caret" style={{ marginTop: "16px" }}></span></a>
                  <ul className="dropdown-menu">
                    <li><a href="/changePassword"><i className="fas fa-user-edit"></i> {this.props.strings.changepass}</a></li>
                    <li><a href="/changePin"><i className="fas fa-user-edit"></i> {this.props.strings.changepin}</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a onClick={this.logOut.bind(this)} href="#"><i className="fas fa-sign-out-alt"></i> {this.props.strings.logout}</a></li>
                  </ul>
                </div>
              </div>
            </section>
          </nav>
        }
        {(dataMenu.isDisplay && isCustom) && MenuCustomer}
      </div>
    )
  }
}
MenuNgang.contextTypes = {
  router: PropTypes.object.isRequired
}
const stateToProps = state => ({
  dataMenu: state.dataMenu,
  auth: state.auth,
  language: state.language.language,
  tradingdate: state.systemdate.tradingdate,

});

const dispatchToProps = dispatch => ({
  showMenu: bindActionCreators(showMenu, dispatch)
});


const decorators = flow([
  connect(stateToProps),
  translate('MenuHo')
]);
module.exports = decorators(MenuNgang)
