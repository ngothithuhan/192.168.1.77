import React from 'react'
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

class MainFooter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataInfo: {},
            datamenu: [],
            data: [],
            notificationNUM: 1,
            page: 1
        }
    }

    showMenu = () => {
        this.props.showMenu();
    }
    async componentWillMount() {
        let { dispatch } = this.props


        // get info company
        // khong dung HEADEMAIL va HEADHOSTLINE
        // await RestfulUtils.post('/nav/getcompanycontact', { language: this.props.language }).then((resData) => {
        //     //console.log('sync success aaaaa >>>',resData )
        //     if (resData.EC == 0) {

        //         this.setState({ dataInfo: resData.data[0] })
        //         //console.log('sync success >>>', this.state.dataInfo, resData.data[0])
        //     } else {
        //         toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
        //     }
        // });


    }
    backToTop() {
        window.scrollTo(0, 0)
    }
    render() {

        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        let auth = this.props.auth

        return (
            <div>
                {(auth.isAuthenticated && isCustom) && <div className="myfooter">
                    <div className="container">
                        <div className="row">
                            {/* <h4><b>{this.props.strings.help}</b></h4>
                            <span><i className="fas fa-phone-square"></i> {this.state.dataInfo.HEADHOSTLINE}</span><span style={{ marginLeft: '20px' }}><i className="fas fa-envelope-square"></i> {this.state.dataInfo.HEADEMAIL}</span> */}
                            {/* <hr style={{ borderTop: '1px solid rgb(62, 63, 63)', marginBottom: '50px', marginTop: '50px', width: '100% ' }} /> */}
                            <div><p style={{fontSize:"14"}}><b>{this.props.strings.quickaccess}</b></p>
                                <div className="col-md-12 truycapnhanh">
                                    <div className="col-md-3">
                                        <NavLink onClick={this.backToTop.bind(this)} to="/MANAGERACCT" >{this.props.strings.manageracct}</NavLink>
                                    </div>
                                    <div className="col-md-3">
                                        <NavLink onClick={this.backToTop.bind(this)} to="/PLACEORDER" >{this.props.strings.placeorder}</NavLink>
                                    </div>

                                    <div className="col-md-3">
                                        <NavLink onClick={this.backToTop.bind(this)} to="/BALANCE" >{this.props.strings.BalanceInquiry}</NavLink>
                                    </div>
                                    <div className="col-md-3">
                                        <NavLink onClick={this.backToTop.bind(this)} to="/PORTFOLIO" >{this.props.strings.Portfolio}</NavLink>
                                    </div>
                                </div> </div>
                        </div>
                    </div>
                </div>}
            </div>
        )
    }
}
MainFooter.contextTypes = {
}
const stateToProps = state => ({
    auth: state.auth,
    language: state.language.language
});

const decorators = flow([
    connect(stateToProps),
    translate('MainFooter')
]);
module.exports = decorators(MainFooter)
