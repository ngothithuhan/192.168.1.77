import React from 'react';
import {connect} from 'react-redux';
import DropdownFactory from 'app/utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';
import NumberFormat from 'react-number-format';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
class LenhChuaNhapOTP_info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AMOUNT: { value: 0, validate: null, tooltip: "Không được để trống !!" },
      AccHold: { value: 0, validate: null, tooltip: "Không được để trống !!" },

    datachange: {}

    }
  }

  onValueChange(type, data) {
    this.state[type].value = data.value
    this.setState(this.state)
  }
  onChange(type, event) {
      this.state.datachange[type] = event.value;
      this.setState({datachange: this.state.datachange})
    }
  render(){
    const { onSubmit } = this.props;
    let strSRTYPE= this.props.data.LOAILENH == "NR" ? this.props.strings.sell : this.props.data.LOAILENH == "NS"? this.props.strings.buy : this.props.strings.sw;
    let strColorSRTYPE= this.props.data.LOAILENH == "NR" ? "#ed1c24" : this.props.data.LOAILENH == "NS"? "#0076a3" : "#ef4322";
    return(
      <div>

        <div>
        <div className="col-xs-9">
            <div className="col-md-12">
                <div className="col-md-12 row"><div className="col-md-12" style={{backgroundColor:'yellow',fontWeight:'bold'}}>Lệnh này sẽ được xử lý vào ngày 14/03/2018</div></div>
                <div className="col-md-12 row">
                    <div className="col-md-5"><h5><b>{this.props.strings.fullname}</b></h5></div>
                    <div className="col-md-7"><h5>{this.props.data.CUSTODYCD}</h5></div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-5"><h5><b>{this.props.strings.custodycd}</b></h5></div>
                    <div className="col-md-7"><h5>{this.props.data.CUSTODYCD}</h5></div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-5"><h5><b>{this.props.strings.vfmcode}</b></h5></div>
                    <div className="col-md-7"><h5>{this.props.data.MACCQ}</h5></div>
                </div>
                {this.props.SRTYPE =="SW" &&<div className="col-md-12 row">
                    <div className="col-md-5"><h5><b>{this.props.strings.vfmcodesw}</b></h5></div>
                    <div className="col-md-7"><h5>{this.props.SWCODEID}</h5></div>
                </div>}
                {this.props.SRTYPE =="NS" &&<div className="col-md-12 row">
                    <div className="col-md-5"><h5><b>{this.props.strings.buyvalue}</b></h5></div>
                    <div className="col-md-7"><h5>{this.props.AMOUNT}</h5></div>
                </div>}
                {(this.props.SRTYPE =="NR"||this.props.SRTYPE =="SW") &&<div className="col-md-12 row">
                    <div className="col-md-5"><h5><b>{this.props.strings.sellvalue}</b></h5></div>
                    <div className="col-md-7"><h5>{this.props.QTTY}</h5></div>
                </div>}
                <div className="col-md-12 row">
                    <div className="col-md-5"><h5><b>{this.props.strings.otp}</b></h5></div>
                    <div className="col-md-7"><input style={{width:95}} id="txtDLPPId" className="form-control" type="text" placeholder={this.props.strings.otp} /></div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-12" style={{color:'#Ed1c24'}}><span style={{textDecoration:'underline'}}>{this.props.strings.titlewarning}</span> {this.props.strings.desc}</div>
                </div>

            </div>
        </div>
        <div className="col-xs-3">
            <div style={{fontWeight:'bold',marginTop:20,fontSize:'40px',color: strColorSRTYPE,textTransform: 'uppercase',textAlign:'center',verticalAlign:'middle'}}>{strSRTYPE}</div>
        </div>
        <div className="col-md-12" style={{textAlign:'center'}}><input  type="button" className="btn btn-primary" style={{marginRight:10,width:120}} value="Chấp nhận" id="btnSubmit"/><input type="button" className="btn btn-primary" style={{marginLeft:0,width:120}} value="Thoát" id="btnClose" /></div>
        </div>
          </div>
    )
  }
}
const stateToProps = state => ({

});
const decorators = flow([
  connect(stateToProps),
  translate('LenhChuaNhapOTP_info')
]);
module.exports = decorators(LenhChuaNhapOTP_info);
//module.exports = connect(function(state){
//    return{auth : state.auth}
//  })(LenhChuaNhapOTP_info);
