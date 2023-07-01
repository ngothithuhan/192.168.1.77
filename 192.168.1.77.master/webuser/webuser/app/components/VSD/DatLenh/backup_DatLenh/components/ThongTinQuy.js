import React from 'react';
// import {validate} from 'app/utils/validateInput.js';
import NumberInput from 'app/utils/input/NumberInput'
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import RestfulUtils from 'app/utils/RestfulUtils';

class ThongTinQuy extends React.Component {
  constructor(props) {
    super(props);
    var date = new Date();
    this.state = {
      // day : date.getDate(),
      // hour : date.getHours(),
      // min : date.getMinutes(),
      // sec : date.getSeconds()
      CODEID: { value: '', label: '' },
      timeout: null,
      day: 0,
      hour: 0,
      min: 1,
      sec: 5,
      sessionInfo: {},
      TenQuyMua: { value: null, validate: null, tooltip: "Không được để trống !!" },
      ThoiGianDongSoLenhMua: { value: null, validate: null, tooltip: "Không được để trống !!" },
      NAVPhienTruocMua: { value: null, validate: null, tooltip: "Không được để trống !!" },

      TenQuyBan: { value: null, validate: null, tooltip: "Không được để trống !!" },
      ThoiGianDongSoLenhBan: { value: null, validate: null, tooltip: "Không được để trống !!" },
      NAVPhienTruocBan: { value: null, validate: null, tooltip: "Không được để trống !!" }
    }
  }
  componentWillReceiveProps(nextProps) {

    if (nextProps.CODEID) {
      if (nextProps.CODEID != this.props.CODEID) {
        this.setState({ CODEID: nextProps.CODEID });
        this.getSessionInfo(nextProps.CODEID.value);
      }
    }
    else
      this.setState({ sessionInfo: {}, CODEID: {} })
  }
  getTime(totalSeconds) {
    var day = Math.floor(totalSeconds / (3600 * 24));
    var hour = Math.floor((totalSeconds - day * 3600 * 24) / 3600);

    var min = Math.floor((totalSeconds - day * 3600 * 24 - (hour * 3600)) / 60);
    var sec = totalSeconds - day * 3600 * 24 - (hour * 3600) - (min * 60);

    this.setState({ day, min, sec, hour })
  }
  componentDidMount() {
    var that = this;
    this.state.timeout = setInterval(function () {
      // var date = new Date();
      // that.state.hour = date.getHours();
      // that.state.min = date.getMinutes();
      // that.state.sec = date.getSeconds();
      // that.setState(that.state);

      that.state.sec -= 1;

      if (that.state.sec === -1) {
        that.state.min -= 1;
        that.state.sec = 59;
      }
      if (that.state.min === -1) {
        that.state.hour -= 1;
        that.state.min = 59;
      }
      if (that.state.hour === -1) {
        that.state.day -= 1;
        that.state.hour = 23;
      }
      if (that.state.day === -1) {
        that.state.sec = 0;
        that.state.min = 0;
        that.state.hour = 0;
        that.state.day = 0;
        clearTimeout(that.state.timeout);
      }
      that.setState(that.state);
    }, 1000);
  }


  getSessionInfo(CODEID) {
    let self = this
    RestfulUtils.post('/order/getSessionInfo', { CODEID: CODEID, TYPE: 'CLSORD' }).then(resData => {

      if (resData.EC == 0) {
        self.getTime(resData.DT[0].COUNTTIMESS)
        self.setState({ sessionInfo: resData.DT[0] })
      }
    })

  }
  componentWillUnmount() {
    // Hàm này thực hiện một lần duy nhất, khi component sẽ unmount
    // Hàm này hữu dụng khi bạn cần xoá các timer không còn sử dụng
    clearTimeout(this.state.timeout);
    this.setState({ day: 0, hour: 0, min: 0, sec: 0 });
  }
  handleChange(state, e, type) {
    // validate(e.target.value, type, (result)=>{
    //     if(result != null){
    //       this.setState({...this.state, [""+state]:{...this.state[""+state],value: e.target.value, validate:"warning", tooltip:result}});
    //     }else{
    //       this.setState({...this.state, [""+state]:{...this.state[""+state],value: e.target.value, validate:"success", tooltip:result}});
    //     }
    // });
    this.state[state].value = e.target.value;
    if (e.target.value == null) {
      this.state[state].validate = "warning",
        this.state[state].tooltip = this.props.strings.tooltip;
    }
    else {
      this.state[state].validate = "success",
        this.state[state].tooltip = "";
    }
    this.setState({ state: this.state })
    this.props.onChange(state, e, type);
  }
  render() {
    let { sessionInfo } = this.state
    let symbolname = sessionInfo.FULLNAME ? ((this.props.language=='vie'? sessionInfo.FULLNAME: sessionInfo.FULLNAME_EN) + ' (' + this.state.CODEID.label + ')') : '';
    var title = this.props.strings.infoFund + ': '+ symbolname;
    return (
      <div className={"inner55-" + this.props.type + " col-md-12"} style={{ paddingLeft: '8px', marginTop: '-1px' }}>

        <div className="col-xs-12" style={{ padding: '0px', paddingTop: '10px', marginTop: '-10px',marginBottom:'0px' }}>
          <label className="col-xs-11 inner55-title" style={{ fontWeight: "bold", paddingLeft: '0px' }}>{title}</label>
        </div>
        <div className="col-xs-12" style={{ paddingBottom: '10px', marginTop: '-12px' }}>
          <h5 className="col-xs-4" style={{ paddingLeft: '0px' }} ><b> {this.props.strings.traddingdate}</b></h5>
          <div className="col-xs-7" style={{ marginTop: '5px' }}>
            {/* <input className="form-control" disabled value={this.state.sessionInfo.DAY} type="text" /> */}
            <label className="form-control"  >{this.state.sessionInfo.DAY}</label>
            {/* <InputComponent disabled value={sessionInfo.DAY ? sessionInfo.DAY : ''} disabled  validate={this.props.type === "RS" ? this.state.TenQuyMua.validate : this.state.TenQuyBan.validate} type="text" name={this.props.type === "RN" ? "TenQuyMua" : "TenQuyBan"}
              tooltip={this.props.type === "mua" ? this.state.TenQuyMua.tooltip : this.state.TenQuyBan.tooltip} onChange={this.handleChange.bind(this)} /> */}
          </div>
        </div>
        <div className="col-xs-12" style={{ paddingBottom: '10px' }}>
        <h5 className="col-xs-4" style={{ paddingLeft: '0px' }}><b> {this.props.strings.timeclosebook}</b></h5>
          {/* <label className="col-xs-4" style={{ paddingLeft: '0px' }}>{this.props.strings.timeclosebook}</label> */}
          <div className="col-xs-7" style={{ marginTop: '5px' }}>
            {/* <input className="form-control" disabled value={this.state.sessionInfo.CLSORDTIME} type="text" /> */}
            <label className="form-control"  >{this.state.sessionInfo.CLSORDTIME}</label>
            {/* <InputComponent disabled value={sessionInfo.CLSORDTIME ? sessionInfo.CLSORDTIME : ''} disabled  validate={this.props.type === "RN" ? this.state.ThoiGianDongSoLenhMua.validate : this.state.ThoiGianDongSoLenhBan.validate} type="text" name={this.props.type === "RN" ? "ThoiGianDongSoLenhMua" : "ThoiGianDongSoLenhBan"}
              tooltip={this.props.type === "mua" ? this.state.ThoiGianDongSoLenhMua.tooltip : this.state.ThoiGianDongSoLenhBan.tooltip} onChange={this.handleChange.bind(this)} /> */}
          </div>
        </div>
        <div className="col-xs-12" style={{ padding: '0px' }}>
        <h5 className="col-xs-4" style={{ paddingLeft: '0px' }}><b> {this.props.strings.navbeforsession}</b></h5>
          {/* <label className="col-xs-4" style={{ paddingLeft: '0px' }}>{this.props.strings.navbeforsession}</label> */}
          <div className="col-xs-7" style={{ marginTop: '5px' }}>
            <NumberInput displayType='text' decimalScale={2} className="form-control" value={sessionInfo.PREVNAV ? sessionInfo.PREVNAV : ''}  thousandSeparator={true} prefix={''} id="txtPrevnav" />

            {/* <InputComponent value={this.state.sessionInfo.PREVNAV} placeholder="15.2345.58" validate={this.props.type === "RN" ? this.state.NAVPhienTruocMua.validate : this.state.NAVPhienTruocBan.validate} type="number" name={this.props.type === "RN" ? "NAVPhienTruocMua" : "NAVPhienTruocBan"}
              tooltip={this.props.type === "mua" ? this.state.NAVPhienTruocMua.tooltip : this.state.NAVPhienTruocBan.tooltip} onChange={this.handleChange.bind(this)} /> */}
          </div>
        </div>
        <div className="col-xs-12" style={{ paddingTop: "12px" }}>
        <h5 className="col-xs-4" style={{ paddingLeft: '0px' }}><b> {this.props.strings.countdown}</b></h5>
          {/* <label className="col-xs-4" style={{ paddingLeft: '0px' }}>{this.props.strings.countdown}</label> */}
          <div className=" col-xs-7 time-countdown">
            <div className="col-xs-3">
              <div className="number-time-countdown" id="divDay">{this.state.day}</div>
              <label>{this.props.strings.day}</label>
            </div>
            <div className="col-xs-3">
              <div className="number-time-countdown" id="divHour">{this.state.hour}</div>
              <label>{this.props.strings.hour}</label>
            </div>
            <div className="col-xs-3">
              <div className="number-time-countdown" id="divMin">{this.state.min}</div>
              <label>{this.props.strings.min}</label>
            </div>
            <div className="col-xs-3">
              <div className="number-time-countdown" id="divSec">{this.state.sec}</div>
              <label>{this.props.strings.second}</label>
            </div>
          </div>
        </div>
      </div>

    )
  }
}
const stateToProps = state => ({
  language: state.language.language,
  auth: state.auth
});
const decorators = flow([
  connect(stateToProps),
  translate('ThongTinQuy')
]);
module.exports = decorators(ThongTinQuy);
// <div className="countdown">
//     <h5 style={{marginLeft:"15px"}}>Đếm ngược :</h5>
//     <div className="time-countdown">
//       <div className="col-xs-3">
//         <div className="number-time-countdown">{this.state.day}</div>
//         <h5>Ngày</h5>
//       </div>
//       <div className="col-xs-3">
//         <div className="number-time-countdown">{this.state.hour}</div>
//         <h5>Giờ</h5>
//       </div>
//       <div className="col-xs-3">
//         <div className="number-time-countdown">{this.state.min}</div>
//         <h5>Phút</h5>
//       </div>
//       <div className="col-xs-3">
//         <div className="number-time-countdown">{this.state.sec}</div>
//         <h5>Giây</h5>
//       </div>
//     </div>
// </div>
