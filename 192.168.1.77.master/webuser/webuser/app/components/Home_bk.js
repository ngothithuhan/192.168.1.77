import React from 'react'
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
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
    let divtime = document.getElementById("homeTimer")
    if (divtime)
        divtime.innerHTML = d.toLocaleTimeString('en-GB') + "(GMT+7)";
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
        myTimer();
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
    async changeLanguage(language) {

        let { dispatch } = this.props;
        await RestfulUtils.post('/session/setLanguage', { language }).then((resData) => {
            if (resData.errCode == 0) {
                console.log('setLanguage sussces!language.:', language)
                this.setState({ language: language })
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
        console.log('dayname:', this.state)
        console.log('user render: ', this.props.tradingdate);
        //let date = new Date(this.props.tradingdate);
        let parts = this.props.tradingdate.split("/")
        let date = new Date(parts[2], parts[1] - 1, parts[0])
        //var date = new Date(this.props.tradingdate);
        console.log('date name date:', date)
        let current_day = date.getDay();
        let day_name = '';
        switch (current_day) {
            case 0:
                day_name = "Chủ nhật, ";
                break;
            case 1:
                day_name = "Thứ hai, ";
                break;
            case 2:
                day_name = "Thứ ba, ";
                break;
            case 3:
                day_name = "Thứ tư, ";
                break;
            case 4:
                day_name = "Thứ năm, ";
                break;
            case 5:
                day_name = "Thứ sau, ";
                break;
            case 6:
                day_name = "Thứ bảy, ";
        }
        let currdate = day_name + this.props.tradingdate + ', ';
        return (
            <div>
                <div style={{  }} className="bgHome responsiveHome">
                    <section id="account-tool" style={{ display: "block", height: "100%", background: "#FFFFFF" }} className="row bottommenu title-header">
                        <div className="container" style={{ marginLeft: "0px", width: "95%" }}>
                            <div className="row" style={{ marginLeft: "4.4%" }}>
                                <div className="navLeft importantWhite" style={{}}>
                                    <div className="mytime timemargin" style={{  }}>
                                        <div>

                                            <span id="datename" style={{marginLeft:"5px", color:"#575B5F" }} className ="datename">{currdate}</span>
                                            <span id="homeTimer" style={{ color:"#575B5F" }} className ="datename"></span>


                                        </div>
                                    </div>
                                </div>
                                <div className="account-tool" >
                                    <div className="navbar-right scale800900" >
                                        
                                        <ul className="nav navbar-nav nav-profile">
                                            {user.ISCUSTOMER ? <li style={{}} className="dropdown dropdown-user drop-1">
                                                <div className="dropdown">
                                                    <a href="#" className="dropdown-toggle importantWhite" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><div className="icon-user" style={{ height: "30px" }}> </div><span className="render">{this.props.strings.account}: <strong>{user.USERID}</strong></span> <span className="caret"></span></a>
                                                    <ul className="dropdown-menu">
                                                        {this.state.listCustodycd.map((item, idx) => {
                                                            return <li><a className="importantBlack" onClick={this.onChangeCustodycd.bind(this, item.value)}><i class="fas fa-user-edit" style={{ marginRight: '5px' }}></i>{item.value}</a></li>
                                                        })}
                                                    </ul>
                                                </div>
                                            </li> : null}
                                            
                                            <li style={{}} className="dropdown dropdown-user drop-2">
                                                <div className="dropdown">
                                                    <a href="#" className="dropdown-toggle importantWhite" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><div className="icon-user"><i className="fas fa-user-circle"></i> </div><span className="render">
                                                        {this.props.strings.hello}, <strong>{user.TLFULLNAME}</strong></span> <span className="caret"></span></a>
                                                    
                                                    <ul className="dropdown-menu" style ={{left:"auto"}}>
                                                        {/* <li ><a href="#">Quản lý tài khoản</a></li> */}
                                                        <li><a className="importantBlack" href="/CHANGEPASSWORD"><i className="fas fa-user-edit"></i> {this.props.strings.changepass}</a></li>
                                                        <li role="separator" className="divider"></li>
                                                        <li><a className="importantBlack" onClick={this.logOut.bind(this)} href="#"><i className="fas fa-sign-out-alt"></i> {this.props.strings.logout}</a></li>
                                                    </ul>
                                                </div>
                                            </li>
                                        </ul>
                                        <div style={{ fontFamily: "Roboto", fontStyle: "normal", fontWeight: "bold", fontSize: "14px", lineHeight: "21px",  cursor: "pointer", display:"inline-block", float:"right" }} className="nav navbar-nav navbar-right languagebtn col-md-1">
                                            <div className= "col-md-5" onClick={this.changeLanguage.bind(this, 'vie')}><a style={{ color: this.state.language == "vie" ? "#D71B23" : "rgba(0, 0, 0, 0.5)" }}>{this.props.strings.vietnamese}</a></div>
                                            
                                            <div className= "col-md-5" onClick={this.changeLanguage.bind(this, 'en')}><a style={{ color: this.state.language == "en" ? "#D71B23" : "rgba(0, 0, 0, 0.5)" }}>{this.props.strings.english}</a></div>
                                            {/* <li onClick={this.changeLanguage.bind(this, 'vie')}><a style={{ color: this.state.language == "vie" ? "#D71B23" : "rgba(0, 0, 0, 0.5)" }}>{this.props.strings.vietnamese}</a></li>
                                            <li style={{ marginTop: "11px" }}>|</li>
                                            <li onClick={this.changeLanguage.bind(this, 'en')} ><a style={{ color: this.state.language == "en" ? "#D71B23" : "rgba(0, 0, 0, 0.5)" }}>{this.props.strings.english}</a></li> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                   
                </div>
                <div style={{ }} className= "logomb">
                    {/* <img alt="" src="./../images/MBC_Online-05.png" style={{ position: "fixed", height: "8%", left: "50%", marginLeft: "-12.3%" }}></img> */}
                </div>
                <div className="sloganmb" style={{  }}>
                {this.props.strings.sloganmb}
                </div>
                <div style={{ }} className="greyblock">

                </div>
                <NavLink onClick={this.showMenu} to="/MANAGERACCT" >
                    <div class=""
                        onMouseOver={this.handleMouseIn1.bind(this)} onMouseOut={this.handleMouseOut1.bind(this)}
                        style={{  }} >
                        {!this.state.hover1 ?
                            <img alt="" src="./../images/1.png" width="100%" style={{  }} className= "mouseon1"/> :
                            <img alt="" src="./../images/1.png" width="100%" style={{  }} className= "mouseleft1" />}
                    </div>
                </NavLink>
                <div className="title1" >
                    TÀI KHOẢN
                </div>
                <NavLink onClick={this.showMenu} to="/PLACEORDER" >
                    <div class="hhover2"
                        onMouseOver={this.handleMouseIn2.bind(this)} onMouseOut={this.handleMouseOut2.bind(this)}
                        style={{  }} >
                        {!this.state.hover2 ?
                            <img alt="" src="./../images/2.png" width="100%" style={{  }} className= "mouseon2"/> :
                            <img alt="" src="./../images/2.png" width="100%" style={{  }} className= "mouseleft2" />}
                    </div>
                </NavLink>
                <div className="title2">
                    GIAO DỊCH
                </div>
                <NavLink onClick={this.showMenu} to="/PORTFOLIO" >
                    <div class="hhover3"
                        onMouseOver={this.handleMouseIn3.bind(this)} onMouseOut={this.handleMouseOut3.bind(this)}
                        style={{  }} >
                        {!this.state.hover3 ?
                            <img alt="" src="./../images/3.png" width="100%" style={{  }} className= "mouseon3"/> :
                            <img alt="" src="./../images/3.png" width="100%" style={{  }} className= "mouseleft3" />
                        }
                    </div>
                </NavLink>
                <div className="title3">
                    DANH MỤC ĐẦU TƯ
                </div>
                <NavLink onClick={this.showMenu} to="/BALANCE" >
                    <div class="hhover4"
                        onMouseOver={this.handleMouseIn4.bind(this)} onMouseOut={this.handleMouseOut4.bind(this)}
                        style={{  }} >
                        {!this.state.hover4 ?
                            <img alt="" src="./../images/4.png" width="100%" style={{  }} className= "mouseon4"/> :
                            <img alt="" src="./../images/4.png" width="100%" style={{  }} className= "mouseleft4"/>}
                    </div>
                </NavLink>
                <div className="title4">
                    TRUY VẤN THÔNG TIN
                </div>
                <a href="http://www.mbcapital.com.vn/vi/" >
                    <div class="hhover5"
                        onMouseOver={this.handleMouseIn5.bind(this)} onMouseOut={this.handleMouseOut5.bind(this)}
                        style={{  }} >
                        {!this.state.hover5 ?
                            <img alt="" src="./../images/5.png" width="100%" style={{  }} className= "mouseon5" /> :
                            <img alt="" src="./../images/5.png" width="100%" style={{  }} className= "mouseleft5" />}
                    </div>
                </a>
                <div className="title5" >
                    TÀI LIỆU QUỸ
                </div>



                <div className="bgHome2 col-md-12" style={{ zIndex: 999 }}>
                    <div className="bgHome3 col-md-12" style={{ zIndex: 999 }}>
                        <div className="col-md-7">
                        </div>
                        <div className="col-md-5">
                            {/* <div className="menu-Right">
                                <NavLink onClick={this.showMenu} to="/PLACEORDER" >
                                    <div className="divMenu" onMouseOver={this.handleMouseIn1.bind(this)} onMouseOut={this.handleMouseOut1.bind(this)}>
                                        {!this.state.hover1 ? <img alt="" src="./../images/DatLenh2.png" width="390px" /> : <img alt="" src="./../images/DatLenh2_click.png" width="390px" />}
                                    </div>
                                </NavLink>
                                <NavLink onClick={this.showMenu} to="/BALANCE" >
                                    <div className="divMenu" onMouseOver={this.handleMouseIn4.bind(this)} onMouseOut={this.handleMouseOut4.bind(this)}>
                                        {!this.state.hover4 ? <img alt="" src="./../images/TruyVanSoDu4.png" width="390px" /> : <img alt="" src="./../images/TruyVanSoDu4_click.png" width="390px" />}
                                    </div>
                                </NavLink>
                                <NavLink onClick={this.showMenu} to="/PORTFOLIO">
                                    <div className="divMenu" onMouseOver={this.handleMouseIn2.bind(this)} onMouseOut={this.handleMouseOut2.bind(this)}>
                                        {!this.state.hover2 ? <img alt="" src="./../images/DanhMucDauTu3.png" width="390px" /> : <img alt="" src="./../images/DanhMucDauTu3_click.png" width="390px" />}
                                    </div>
                                </NavLink>
                                <NavLink onClick={this.showMenu} to="/MANAGERACCT" height="80px" width="390px" >
                                    <div className="divMenu" onMouseOver={this.handleMouseIn3.bind(this)} onMouseOut={this.handleMouseOut3.bind(this)}>
                                        {!this.state.hover3 ? <img alt="" src="./../images/ThongTinCaNhan2.png" width="390px" /> : <img alt="" src="./../images/ThongTinCaNhan2_click.png" width="390px" />}
                                    </div>
                                </NavLink>
                            </div> */}
                        </div>
                    </div>

                </div>
                <div style={{ fontSize: "calc(1px + .8vw)", height: '10.5%', position: "fixed", top: "84.5%" }} className="homefooter">
                    <div className="divMenu">
                        <img alt="" src="./../images/footer.png" width="100%" style={{ height: '15.5%', position: "fixed", top: "84.5%" }} />
                    </div>
                    <div className="block1" style={{ zIndex: 1000, position: "fixed", width: "35%", top: "85%", left: "4.25%", fontFamily: "Roboto", fontStyle: "normal", fontWeight: "500", fontSize: "calc(1px + .8vw)", lineHeight: "21px", color: "#FFFFFF" }}>
                        <div><span style={{ fontWeight: 'bold' }}>{this.props.strings.MB}</span></div>
                    </div>
                    <div className="" style={{ zIndex: 1000, position: "fixed", width: "35%", top: "89%", left: "4.25%", fontFamily: "Roboto", fontStyle: "normal", fontWeight: "bold", fontSize: "calc(1px + .8vw)", lineHeight: "21px", color: "#FFFFFF" }}>
                        <div><span >
                            {this.props.strings.trusochinh}
                        </span></div>
                    </div>
                    <div className="" style={{ zIndex: 1000, position: "fixed", width: "35%", top: "93%", left: "4.25%", fontFamily: "Roboto", fontStyle: "normal", fontWeight: "normal", fontSize: "calc(1px + .8vw)", lineHeight: "16px", color: "#FFFFFF" }}>
                        <div><span>
                            {this.props.strings.diachi}

                        </span></div>
                    </div>
                    <div className="" style={{ zIndex: 1000, position: "fixed", width: "35%", top: "95%", left: "4.25%", fontFamily: "Roboto", fontStyle: "normal", fontWeight: "normal", fontSize: "calc(1px + .8vw)", lineHeight: "16px", color: "#FFFFFF" }}>
                        <div><span>
                            {this.props.strings.sdt}
                        </span></div>
                    </div>
                    <div className="" style={{ zIndex: 1000, position: "fixed", width: "35%", top: "89%", left: "40%", fontFamily: "Roboto", fontStyle: "normal", fontWeight: "bold", fontSize: "calc(1px + .8vw)", lineHeight: "21px", color: "#FFFFFF" }}>
                        <div><span >
                            {this.props.strings.vpdd}
                        </span></div>
                    </div>
                    <div className="" style={{ zIndex: 1000, position: "fixed", width: "35%", top: "93%", left: "40%", fontFamily: "Roboto", fontStyle: "normal", fontWeight: "normal", fontSize: "calc(1px + .8vw)", lineHeight: "16px", color: "#FFFFFF" }}>
                        <div><span>
                            {this.props.strings.vpddadd}

                        </span></div>
                    </div>
                    <img alt="" src="./../images/icon-phone.png" height="20px" width="20px" style={{ zIndex: 1000, position: "fixed", top: "86.5%", left: "76%" }}></img>
                    <div className="block1" style={{ zIndex: 1000, position: "fixed", width: "25%", top: "85%", left: "78%", fontFamily: "Roboto", fontStyle: "normal", fontWeight: "normal", fontSize: "calc(1px + .8vw)", lineHeight: "21px", color: "#FFFFFF" }}>
                        <div><span >{this.props.strings.sdt2}</span></div>
                    </div>
                    <img alt="" src="./../images/icon-email.png" height="20px" width="20px" style={{ zIndex: 1000, position: "fixed", top: "90%", left: "76%" }}></img>
                    <div className="" style={{ zIndex: 1000, position: "fixed", width: "25%", top: "90%", left: "78%", fontFamily: "Roboto", fontStyle: "normal", fontWeight: "normal", fontSize: "calc(1px + .8vw)", lineHeight: "21px", color: "#FFFFFF" }}>
                        <div><span >{this.props.strings.email1}</span></div>
                    </div>
                    <div className="" style={{ zIndex: 1000, position: "fixed", width: "25%", top: "93%", left: "78%", fontFamily: "Roboto", fontStyle: "normal", fontWeight: "normal", fontSize: "calc(1px + .8vw)", lineHeight: "21px", color: "#FFFFFF" }}>
                        <div><span >{this.props.strings.email2}</span></div>
                    </div>
                </div>
            </div>
            // </div>
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