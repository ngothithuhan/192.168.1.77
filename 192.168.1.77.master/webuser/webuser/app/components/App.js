import React from 'react';
//var PrivateRoute = require('PrivateRoute');
import requireAuth from 'app/utils/requireAuth.js';
import { BrowserRouter as Router, Route, Switch, hashHistory } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';
import axios from 'axios'

//import { login, logout } from 'app/action/actionAuthenticate.js';

import Layout from 'app/components/Layout';
import Login from 'app/components/Login';
import Home from 'app/components/Home';
//import Logout from './Logout';
import components from './ListPages';
import Notfound from './Notfound'
import DuyetGiaoDich from './VSD/QLTTTK_NDT/DuyetGiaoDich/DuyetGiaoDich'
import CreateAccount from 'app/components/CreateAccount'
import active from 'app/components/Active';
import forgotPassword from 'app/components/forgotPassword';
import changePassword from 'app/components/changePassword';
import changePin from 'app/components/changePin';
import customerActiveOTP from 'app/components/VSD/NDTXacNhanOTP/NDTXacNhanOTP';
import DoiChieuLenh from 'app/components/VSD/DoiChieuLenh/DoiChieuLenh';
var ConfirmLogin = require('app/components/ConfirmLogin.js');
import customLayout from 'app/utils/customLayout.js';
import RestfulUtils from "app/utils/RestfulUtils";

//đang hardcode, cần khai động menu để cái story bên dưới nó render
import TongQuanTaiSan from "./VSD/TongQuanTaiSan/TongQuanTaiSan";
import CreateAccountEKYC from "./OpenAccount/CreateAccount"
import AccOverview from "app/components/VSD/QLTTTK_NDT/ThongTinTaiKhoan/AccOverview.js"



function Story(data) {
  // Correct! JSX type can be a capitalized variable.
  //console.log('data', data.OBJNAME)
  const SpecificStory = components[data.OBJNAME];
  if (SpecificStory)
    return <SpecificStory key={data.CMDID} datapage={data} />;
  else
    return <Notfound />
}
// async function loadmenu() {
//   let self = this
//   // nam.nguyen
//   await RestfulUtils.post('/userfunc/getMenu', { USERID: "NSD" })
//     .then((res) => {
//       self.setState({ datamenu: res.data })
//     })
// }

function renderActive(data) {
  // console.log('giang.ngo===================>',data.children,data.CMDID,data.OBJNAME);

  if (data.children && data.children.length > 0) {
    return (
      data.children.map(c => (renderActive(c)))
    )
  }
  else {
    return (
      <Route key={data.CMDID} path={"/" + data.OBJNAME} render={function () {
        return (<div>{Story(data)}</div>)
      }} />
    )
  }
}

class App extends React.Component {

  // require('style-loader!css-loader!foundation-sites/dist/css/foundation.min.css');
  //require('style!css!sass!./css/style.scss');
  // $(document).ready(() => $(document).foundation());
  constructor(props) {
    super(props)
    this.state = {
      datamenu: []
    }
  }

  async componentDidMount() {
    let self = this
    // nam.nguyen
    // console.log('==========1aaaaaaa')
    await axios.get('/userfunc/getmenu')
      .then((res) => {
        console.log('resdata==app', res.data)
        self.setState({ datamenu: res.data })
      })
  }

  render() {
    var that = this
    let datamenu1 = this.state.datamenu
    var RouterFactory = (
      <Layout>
        <Switch>
          <Route path="/LOGIN" component={Login} />
          <Route path="/CONFIRMLOGIN" component={customLayout(ConfirmLogin)} />
          <Route path="/CREATEACCOUNT" component={CreateAccount} />
          <Route path="/FORGOTPASSWORD" component={forgotPassword} />
          <Route path="/ACTIVE" component={active} />
          <Route path="/CHANGEPASSWORD" component={changePassword} />
          <Route path="/CHANGEPIN" component={changePin} />
          <Route path="/CUSTOMERACTIVEOTP" component={customerActiveOTP} />
          {/* <Route path="/HOAHONG" component={QLDoanhSo} /> */}
          <Route path="/DOICHIEULENH" component={DoiChieuLenh} />
          <Route path="/HOME" component={Home} />
          <Route exact path="/" component={requireAuth(DuyetGiaoDich, [])} />
          <Route path="/TRANSACTIONS" component={requireAuth(DuyetGiaoDich, [])} />


          {/* ko cần hardcode như thế này, fix = cách khai động thêm menu */}
          <Route path="/OVERVIEWPROPERTY" component={TongQuanTaiSan} />
          <Route path="/CREATEACCOUNTEKYC" component={CreateAccountEKYC} />
          <Route path="/ACCOVERVIEW" component={AccOverview} />



          {datamenu1 && datamenu1.length && datamenu1.map(c => renderActive(c))}
          <Route render={function () {
            return (<div className="row">
              <Notfound />
            </div>)
          }
          } />
        </Switch>
      </Layout>
    )
    return (
      <Provider store={store}>
        <Router history={hashHistory}>
          <div>
            {RouterFactory}
          </div>
        </Router>
      </Provider>
    )
  }
}
module.exports = App;
