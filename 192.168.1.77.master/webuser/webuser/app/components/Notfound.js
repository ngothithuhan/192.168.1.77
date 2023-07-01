import React from 'react'
import PropTypes from 'prop-types';
import axios from 'axios'
import RestfulUtils from "app/utils/RestfulUtils";
class Notfound extends React.Component{
    async componentDidMount() {
        var { dispatch } = this.props;
        var that = this;
        // if (!localStorage.jwToken) {
          axios.get('auth/loginFlex')
            .then((res) => {
            })
            .catch(function (err) {
              // localStorage.removeItem('jwToken');
               that.context.router.history.push('/login');
            });
   }
     
    
    render(){

        return(
             <div className="row">
            <div className="col-md-4 col-md-offset-3">
             <div  className="alert alert-info">
                 <strong>Thông báo</strong> trang không tồn tại
            </div>
            </div>
            </div>
        )
    }
}

Notfound.contextTypes = {
  router: PropTypes.object.isRequired
};
module.exports = Notfound