import React from 'react';
import { connect } from 'react-redux';
import RestfulUtils from 'app/utils/RestfulUtils';
import { toast } from 'react-toastify';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';


class Broker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
            data: [],
            data2: []
        }
    }
    componentWillReceiveProps(nextProps) {
        let self = this

        console.log('nextProps componentWillReceiveProps Broker:', nextProps)
        let isAuth = nextProps.auth.isAuthenticated;
        let isCustom = nextProps.user ? nextProps.user.ISCUSTOMER ? nextProps.user.ISCUSTOMER == 'Y' : true : true;
        
        if (isCustom && isAuth) {
            console.log('isCustom componentWillReceiveProps Broker ::',isCustom && isAuth)
            //changeclassmargin()
            RestfulUtils.post('/account/getsalebycustodycd', { p_custodycd: nextProps.user.USERID, language: this.props.language }).then((resData) => {
                //console.log('sync success aaaaa >>>',resData )
                if (resData.EC == 0) {
                    //console.log('sync success >>>', resData)
                    self.setState({ data2: resData.data })
                }
            });
        }

    }
    
    render() {
        const { user } = this.props.auth
        let isCustom = this.props.user ? this.props.user.ISCUSTOMER ? this.props.user.ISCUSTOMER == 'Y' : true : true;
        console.log('this.state::', this.state)
        
        console.log('databroker render:::',this.state.data2)
        let databroker = this.state.data2.length > 0 ? this.state.data2[0] : {}
        return (
            // <div className="indexdock container col-md-12 mgt" style={{ top: "115px"}} >
            // <div className="indexdock container col-md-12 mgt" >
                
            //     {isCustom && <div className="row text-left col-md-12 top_18 fontS-11" >
            //         <div className="col-md-3">
            //             <p style={{ right: 0 }}>{this.props.strings.FULLNAME} : {this.state.data2.TLFULLNAME}</p>
            //         </div>

            //         <div className="col-md-3 text-left">
            //             <p style={{ right: 0 }}>{this.props.strings.MOBILE} : {this.state.data2.MOBILE}</p>
            //         </div>

            //     </div>}

            // </div>
            <div style = {{paddingTop: "200px"}}>
            {isCustom ?<p style={{ right: 0 }}>{this.props.strings.FULLNAME} : {databroker.TLFULLNAME} , {this.props.strings.MOBILE} : {databroker.MOBILE}</p>:null}
            </div>
        )
    }
}
const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth,

});
const decorators = flow([
    connect(stateToProps),
    translate('Broker')
]);
module.exports = decorators(Broker);
