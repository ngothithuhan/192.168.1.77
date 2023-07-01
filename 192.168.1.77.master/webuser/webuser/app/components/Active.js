import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import {connect} from 'react-redux'
import NumberFormat from 'react-number-format';
 class Active extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       phone: { value: 0, validate: null, tooltip: "Không được để trống !!" },
     }
   }
   onValueChange(type, data) {
     this.state[type].value = data.value
     this.setState(this.state)
   }
  render() {

    return (
        <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">


  <div  className="add-info-account">
          <div className="title-content" >{this.props.strings.title}</div>

          <div className="col-md-12" style={{ paddingTop: "11px" }}>
                            <div className="col-md-12 row">
                              <div className="col-md-3">
                              </div>
                              <div className="col-md-8">
                          <h5><b>{this.props.strings.desc}</b></h5>
                              </div>
                              </div>
                                <div className="col-md-12 row">
                                  <div className="col-md-3">
                                  </div>
                                    <div className="col-md-3">
                                    <h5><b>{this.props.strings.fullname}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                    <input className="form-control" type="text" placeholder={this.props.strings.fullname} id="txtfullname"/>
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                  <div className="col-md-3">
                                  </div>
                                    <div className="col-md-3">
                                    <h5><b>{this.props.strings.email}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                    <input className="form-control" type="text" placeholder={this.props.strings.email} id="txtemail" />
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                  <div className="col-md-3">
                                  </div>
                                    <div className="col-md-3">
                                    <h5><b>{this.props.strings.phone}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                      <NumberFormat className="form-control" id="txtphone" onValueChange={this.onValueChange.bind(this, 'phone')} thousandSeparator={false} prefix={''} placeholder={this.props.strings.phone}/>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                  <div className="col-md-3">
                                  </div>
                                    <div className="col-md-3">
                                    <h5><b>{this.props.strings.username}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                    <input className="form-control" type="text" placeholder={this.props.strings.username} id="txtusername"/>
                                    </div>
                                </div>


                                <div className="col-md-12 row">
                                  <div className="pull-right">
                                  <input type="button"  className="btn btn-primary" style={{marginLeft:0,marginRight:286}} value="Xác nhận" id="btnsubmit"/>
                                  </div>
                                </div>
                            </div>


  </div>
      </div>
    )
  }
}
Active.defaultProps = {

  strings: {
    title:'Kích hoạt tài khoản'

  },


};
const stateToProps = state => ({

});


const decorators = flow([
  connect(stateToProps),
  translate('Active')
]);

module.exports = decorators(Active);
