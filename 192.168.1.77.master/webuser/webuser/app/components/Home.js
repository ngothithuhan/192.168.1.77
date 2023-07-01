import React from 'react'
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { changeLanguage } from 'app/action/actionLanguage.js';
import { bindActionCreators } from 'redux'
import { hideMenu, showMenu, resetMenu } from 'actionMenu';
import { NavLink } from 'react-router-dom';
import axios from 'axios'
import { getLanguageKey, saveLanguageKey, LANGUAGE_KEY } from '../Helpers';
import RestfulUtils from 'app/utils/RestfulUtils';
import { setCurrentUser } from 'app/action/authActions.js';
var log = require('app/utils/LoggerFactory.js').LoggerFactory({
    prefix: true, module: 'LoginSuccess.:'
});


function myTimer() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    var nowTime = h + ":" + m + ":" + s;
    var tmp = nowTime;
    let divtime = document.getElementById("homeTimer")
    // if (divtime){
    divtime.innerHTML = tmp + "(GMT+7)";
    // .toLocaleTimeString('en-GB') 

    // }
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

}
function myFunction() {
    var element = document.getElementById("main_body");
    element.classList.remove("container");
    element.classList.remove("main_body")
}
function changediv() {

    if (document.getElementById("main_body")) {
        // document.getElementById("div_top1").innerHTML=Date();          
        document.getElementById("main_body").setAttribute("id", "main_body2");
    }
    // else {
    //     //document.getElementById("div_top2").innerHTML="teste";            
    //     document.getElementById("div_top2").setAttribute("id", "div_top1");
    // }


}
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataInfo: {},
            listCustodycd: [],
            hover1: "",
            hover2: "",
            hover3: "",
            hover4: "",
            hover5: "",
            day_name: "",
            language: "",
            time: ''
        }
    }
    logOut(e) {
        e.preventDefault();
        window.location.replace("/auth/logout");
    }

    componentWillMount() {
        // khong dung HEADEMAIL va HEADHOSTLINE
        // RestfulUtils.post('/nav/getcompanycontact', { language: this.props.language }).then((resData) => {
        //     //console.log('sync success aaaaa >>>',resData )
        //     if (resData.EC == 0) {

        //         this.setState({ dataInfo: resData.data[0] })
        //         //console.log('sync success >>>', this.state.dataInfo, resData.data[0])
        //     } else {
        //         toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
        //     }
        // });
    }
    componentDidMount() {
        this.props.hideMenu()

        console.log('this.props.language:', this.props.language)
        this.setState({ language: this.props.language })
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
        //     today = new Date();
        //     let time = '';
        //     h = today.getHours();
        //     m = today.getMinutes();
        //     s = today.getSeconds();
        //     //   m = that.checkTime(m);
        //     if (m < 10) { m = "0" + m }
        //     //   s = that.checkTime(s);
        //     if (s < 10) { s = "0" + s }
        //     time = h + ":" + m + ":" + s;
        //     let divtime = document.getElementById("homeTimer")
        //     // if (divtime){
        //     divtime.innerHTML = time + "(GMT+7)";
        //     // this.setState({ time: time })
        // }, 1000);
        myFunction();
        changediv();
        let self = this;
        RestfulUtils.post('/account/getAccountIdsByUsername', { key: '' })
            .then((res) => {
                if (res.length > 0) {
                    self.state.listCustodycd = res;
                } else self.state.listCustodycd = [];
                self.setState(self.state);
            });
    }
    onChangeCustodycd(custodycd) {
        RestfulUtils.post('/auth/changeDefaultCustodyCd', { P_CUSTODYCD: custodycd })
            .then((res) => {
                if (res.EC == 0) {
                    window.location.reload();
                }
            });
    }
    showMenu = () => {
        this.props.showMenu();
    }
    handleMouseIn4() {
        this.setState({ hover4: true })
    }

    handleMouseOut4() {
        this.setState({ hover4: false })
    }
    handleMouseIn5() {
        this.setState({ hover5: true })
    }

    handleMouseOut5() {
        this.setState({ hover5: false })
    }
    handleMouseIn1() {
        this.setState({ hover1: true })
    }

    handleMouseOut1() {
        this.setState({ hover1: false })
    }
    handleMouseIn2() {
        this.setState({ hover2: true })
    }

    handleMouseOut2() {
        this.setState({ hover2: false })
    }
    handleMouseIn3() {
        this.setState({ hover3: true })
    }

    handleMouseOut3() {
        this.setState({ hover3: false })
    }
    // async changeLanguage(language) {

    //     let { dispatch } = this.props;
    //     await RestfulUtils.post('/session/setLanguage', { language }).then((resData) => {
    //         if (resData.errCode == 0) {
    //             console.log('setLanguage sussces!language.:', language)
    //             this.state.language = language
    //             this.setState({ state: this.state });
    //         }
    //         else{
    //         console.log('setLanguage fail, set default language vie!')
    //         saveLanguageKey(language)
    //         //dispatch(changeLanguage(language));
    //         this.setState({ state: this.state })
    //         }
    //     });
    //     saveLanguageKey(language)
    //     //dispatch(changeLanguage(language));
    //     //this.setState({ language: language });
    //     this.setState({ state: this.state });
    // }
    async changeLanguage(language) {

        let { dispatch } = this.props;
        await RestfulUtils.post('/session/setLanguage', { language }).then((resData) => {
            if (resData.errCode == 0) {
                console.log('setLanguage sussces!language.:', language)
                this.state.language = language
                this.setState({ state: this.state });
            }
            else
                console.log('setLanguage fail, set default language vie!')
            saveLanguageKey(language)
            dispatch(changeLanguage(language));
        });
        saveLanguageKey(language)
        dispatch(changeLanguage(language));
    }
    render() {
        let { user } = this.props.auth;
        console.log("this.state.hover1::::", this.state.hover1)
        console.log("this.state.hover2::::", this.state.hover2)
        let lang = this.state.language
        console.log('lang:::', lang)
        //let date = new Date(this.props.tradingdate);
        // let parts = (new Date()).split("/")
        // let date = new Date(parts[2], parts[1] - 1, parts[0])
        // //var date = new Date(this.props.tradingdate);
        // let current_day = date.getDay();
        // let day_name = '';
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
        return (
            <div className="body_home">
                <section className="section-main clearfix" >
                    <section className="topbar-header clearfix" >
                        <div className="date">
                            <span id="datename" >{currdate}</span>
                            <span id="homeTimer" ></span>
                            {/* Thứ bảy, 3/8/2019, 18:47 (GMT+7) */}
                        </div>
                        <div className="col_right">

                            {user.ISCUSTOMER ?
                                <div className="tk">{this.props.strings.account}:  <span>{user.USERID}</span></div> : null}

                            <div className="user">
                                <a href="#" className="dropdown-toggle importantWhite" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                    <img className="ava" src="images/icons/user.svg" alt="this" />
                                    {this.props.strings.hello}, <a href="#" className="name">{user.TLFULLNAME}</a>
                                </a>
                                <ul className="dropdown-menu" style={{ left: "auto" }}>
                                    {/* <li ><a href="#">Quản lý tài khoản</a></li> */}
                                    <li><a className="importantBlack" href="/CHANGEPASSWORD"><i className="fas fa-user-edit"></i> {this.props.strings.changepass}</a></li>
                                    <li><a className="importantBlack" href="/CHANGEPIN"><i className="fas fa-user-edit"></i> {this.props.strings.changepin}</a></li>
                                    <li role="separator" className="divider"></li>
                                    <li><a className="importantBlack" onClick={this.logOut.bind(this)} href="#"><i className="fas fa-sign-out-alt"></i> {this.props.strings.logout}</a></li>
                                </ul>
                            </div>

                            {/* <div className="tk">Tài khoản: <span>909C00052</span></div>
                            <div className="user">
                                <a href="#" className="dropdown-toggle importantWhite" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                    <img className="ava" src="images/icons/user.svg" alt="this" />
                                    {this.props.strings.hello}, <a href="#" className="name">{user.TLFULLNAME}</a>
                                </a>

                            </div> */}
                            <div className="lang">
                                <a onClick={this.changeLanguage.bind(this, 'vie')} style={{ color: this.state.language == "vie" ? "#D71B23" : "rgba(0, 0, 0, 0.5)", cursor: "pointer" }}>VN</a>
                                <a onClick={this.changeLanguage.bind(this, 'en')} style={{ color: this.state.language == "en" ? "#D71B23" : "rgba(0, 0, 0, 0.5)", cursor: "pointer" }}>EN</a>
                            </div>
                        </div>
                    </section>



                    <div className="min-width frame_list">
                        {/* <a className="logo"><img className="ava" src="images/graphics/logo1.png" alt="this" /></a> */}
                        {/* <h2 className="slogan">{this.props.strings.sloganmb}</h2> */}
                        <div className="warp_list flex"  >

                            <a className="item" href="/MANAGERACCT" onMouseOver={this.handleMouseIn1.bind(this)} onMouseOut={this.handleMouseOut1.bind(this)} >
                                {!this.state.hover1 ?
                                    <img className="ava" src="images/icons/taikhoan.svg" style={{ transition: "all 0.6s ease" }} alt="this" /> :
                                    <img className="ava" src="images/icons/taikhoan.svg" style={{ transition: "all 0.6s ease", width: "100px" }} alt="this" />}

                                {this.props.strings.account}
                            </a>

                            <a className="item" href="/PLACEORDER" onMouseOver={this.handleMouseIn2.bind(this)} onMouseOut={this.handleMouseOut2.bind(this)} >
                                {!this.state.hover2 ?
                                    <img className="ava" src="images/icons/giaodich.svg" style={{ transition: "all 0.6s ease" }} alt="this" /> :
                                    <img className="ava" src="images/icons/giaodich.svg" style={{ transition: "all 0.6s ease", width: "100px" }} alt="this" />}


                                {this.props.strings.trade}
                            </a>
                            <a className="item" href="/PORTFOLIO" onMouseOver={this.handleMouseIn3.bind(this)} onMouseOut={this.handleMouseOut3.bind(this)} >

                                {!this.state.hover3 ?
                                    <img className="ava" src="images/icons/danhmuc.svg" style={{ transition: "all 0.6s ease" }} alt="this" /> :
                                    <img className="ava" src="images/icons/danhmuc.svg" style={{ transition: "all 0.6s ease", width: "100px" }} alt="this" />}


                                {this.props.strings.portfolio}
                            </a>
                            <a className="item" href="/BALANCE" onMouseOver={this.handleMouseIn4.bind(this)} onMouseOut={this.handleMouseOut4.bind(this)} >
                                {!this.state.hover4 ?
                                    <img className="ava" src="images/icons/truyvan.svg" style={{ transition: "all 0.6s ease" }} alt="this" /> :
                                    <img className="ava" src="images/icons/truyvan.svg" style={{ transition: "all 0.6s ease", width: "100px" }} alt="this" />}



                                {this.props.strings.infor}
                            </a>
                            <a className="item" href="http://www.mbcapital.com.vn/quan-ly-quy-dau-tu/" onMouseOver={this.handleMouseIn5.bind(this)} onMouseOut={this.handleMouseOut5.bind(this)} >
                                {!this.state.hover5 ?
                                    <img className="ava" src="images/icons/tienich.svg" style={{ transition: "all 0.6s ease" }} alt="this" /> :
                                    <img className="ava" src="images/icons/tienich.svg" style={{ transition: "all 0.6s ease", width: "100px" }} alt="this" />}



                                {this.props.strings.document}
                            </a>
                        </div>
                    </div>


                    <section className="section-footer clearfix">
                        <div className="flex">
                            <h2>{this.props.strings.company}</h2>
                            <div className="col col1">
                                <h3>{this.props.strings.headquarter}</h3>
                                <p>{this.props.strings.add1}</p>

                            </div>
                            <div className="col col2">
                                {/* <h3>{this.props.strings.reoffice}</h3>
                                <p>{this.props.strings.add2}</p> */}
                            </div>
                            <div className="col col3">
                                <div className="hotline">
                                    <img className="code" src="images/graphics/icon-phone.svg" alt="this" />
                                    <a style={{ color: "#fff" }}>(84.24) 3726 2808</a>
                                    <a style={{ color: "#fff" }}>| Ext: 14/17/32</a>
                                </div>
                                <div className="email" style={{ display: "grid" }}>
                                    <img className="code" src="images/graphics/icon-email.svg" alt="this" />
                                    <a style={{ color: "#fff" }}>mbvf@mbcapital.com.vn</a>
                                    <a style={{ color: "#fff" }}>mbgf@mbcapital.com.vn</a>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>


            </div>
        )
    }
}
const stateToProps = state => ({
    auth: state.auth,
    tradingdate: state.systemdate.tradingdate,
    language: state.language.language
});

const dispatchToProps = dispatch => ({

    hideMenu: bindActionCreators(hideMenu, dispatch),
    showMenu: bindActionCreators(showMenu, dispatch)
});
const decorators = flow([
    connect(stateToProps, dispatchToProps),
    translate('Home')
]);
module.exports = decorators(Home);