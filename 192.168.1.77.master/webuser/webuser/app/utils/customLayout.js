import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { showNotifi } from 'actionNotification';
var store = require('store');

export default function (ComposedComponent, allowedRoles) {
  class Authenticate extends React.Component {
    constructor(props) {
      super(props)

      // In this case the user is hardcoded, but it could be loaded from anywhere.
      // Redux, MobX, RxJS, Backbone...
      this.state = {
        user: {
          name: 'vcarl',
          role: 'a'
        }
      }
    }
    componentDidMount(){
      window.$("#menu_customer_1").css("display", "none");
      window.$("#indexdock_1").css("display", "none");
    }


    render() {

      // const  role = this.props.role
      // console.log(role);
      // if (allowedRoles.includes(role)) {
      return (
        <div className="login_wrap">
          <div className="login_form">
            <ComposedComponent {...this.props} />
            {/* <div className="login_footer">
              <div className="login_footer_info clearfix">
                <p><img src="/images/footer_ico_phone.png" alt="" /><a href="tel:+842873010079">+84 28 7301 0079</a></p>
                <p><img src="/images/footer_ico_location.png" alt="" /><a href="https://goo.gl/maps/U99U1aX2UzYTRPc58" target="_blank">138 - 142 Hai Ba Trung, Da Kao Ward, District 1, Ho Chi Minh City</a></p>
                <p><img src="/images/footer_ico_web.png" alt="" /><a href="#">https://custody.shinhan.com.vn</a></p>
              </div>
            </div> */}
            
          </div>
        </div>
      );
      // }
      // else{
      //    return(
      //       <div className="row">
      //        <div className="col-md-4 col-md-offset-3">
      //         <div className="alert alert-danger">
      //             <strong>!</strong> Bạn không có quyền truy nhập trang này
      //        </div>
      //        </div>
      //        </div>
      //    )
      // }
    }
  }

  // Authenticate.propTypes = {
  //   isAuthenticated: PropTypes.bool.isRequired,
  //   addFlashMessage: PropTypes.func.isRequired
  // }
  //
  Authenticate.contextTypes = {
    router: PropTypes.object.isRequired
  }

  function mapStateToProps(state) {
    return {
      isAuthenticated: state.auth.isAuthenticated,
      isConfirmLogin: state.auth.isConfirmLogin
      // role : state.authenticate.username

    };
  }

  return connect(mapStateToProps)(Authenticate);
}
