import React from 'react';
import {connect} from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import DropdownFactory from '../../../../../utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';

class SessionInfo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {


    datachange: {}

    }
  }
  onValueChange(type, data) {
    //console.log('valueChange', type, data)
    this.state[type].value = data.value
    this.setState(this.state)
  }
  onChange(type, event) {
      this.state.datachange[type] = event.value;
      this.setState({datachange: this.state.datachange})
    }
    render(){
        return(
            <div className="col-md-12" style={{ paddingTop: "11px" }}>

                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5><b>Phiên giao dịch đầu tiên</b></h5>
                    </div>
                    <div className="col-md-3 fixWidthDatePickerForOthers">
                  <DateInput onChange={this.onChange.bind(this)} value={this.state.datachange.BIRTHDATE} type="BIRTHDATE" />
                    </div>
                    <div className="col-md-3">
                        <h5><b>Ngày phân bổ CCQ</b></h5>
                    </div>
                    <div className="col-md-3">
                    <DropdownFactory  value="TERM" CDTYPE="CF" CDNAME="TERM"  />
                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5><b>Thời gian phân bổ CCQ</b></h5>
                    </div>
                    <div className="col-md-3">
                    <input id="txtDLPPRegisterNo" className="form-control" type="text" placeholder="Thời gian phân bổ CCQ" />
                    </div>
                    <div className="col-md-3">
                        <h5><b>Ngày thanh toán tiền</b></h5>
                    </div>
                    <div className="col-md-3">
                    <DropdownFactory  value="TERM" CDTYPE="CF" CDNAME="TERM"  />
                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5><b>Thời gian thanh toán tiền</b></h5>
                    </div>
                    <div className="col-md-3">
                    <input id="txtDLPPRegisterNo" className="form-control" type="text" placeholder="Thời gian thanh toán tiền" />
                    </div>
                    <div className="col-md-3">
                        <h5><b>Ngày đóng sổ lệnh</b></h5>
                    </div>
                    <div className="col-md-3">
                    <DropdownFactory  value="TERM" CDTYPE="CF" CDNAME="TERM"  />
                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5><b>Thời gian đóng sổ lệnh</b></h5>
                    </div>
                    <div className="col-md-3">
                    <input id="txtDLPPId" className="form-control" type="text" placeholder="Thời gian đóng sổ lệnh" />
                    </div>
                    <div className="col-md-3">
                        <h5><b>Ngày khớp lệnh</b></h5>
                    </div>
                    <div className="col-md-3">
                    <DropdownFactory  value="TERM" CDTYPE="CF" CDNAME="TERM"  />
                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5><b>Thời gian khớp lệnh</b></h5>
                    </div>
                    <div className="col-md-3">
                    <input id="txtDLPPId" className="form-control" type="text" placeholder="Thời gian khớp lệnh" />
                    </div>
                    <div className="col-md-3">
                        <h5><b>Ngày nhận tiền</b></h5>
                    </div>
                    <div className="col-md-3">
                    <DropdownFactory  value="TERM" CDTYPE="CF" CDNAME="TERM"  />
                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5><b>Thời gian nhận tiền</b></h5>
                    </div>
                    <div className="col-md-3">
                    <input id="txtDLPPId" className="form-control" type="text" placeholder="Thời gian nhận tiền" />
                    </div>
                    <div className="col-md-3">
                        <h5><b>Có tự động sinh lệnh lô lẻ không</b></h5>
                    </div>
                    <div className="col-md-3">
                    <DropdownFactory  value="TERM" CDTYPE="CF" CDNAME="TERM"  />
                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5><b>Hạn mức mua lại tối đa Quỹ</b></h5>
                    </div>
                    <div className="col-md-3">
                    <input id="txtDLPPId" className="form-control" type="text" placeholder="Hạn mức mua lại tối đa Quỹ" />
                    </div>
                    <div className="col-md-3">
                        <h5><b>Luật khớp mua</b></h5>
                    </div>
                    <div className="col-md-3">
                    <DropdownFactory  value="TERM" CDTYPE="CF" CDNAME="TERM"  />
                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5><b>Luật phân bổ mua</b></h5>
                    </div>
                    <div className="col-md-3">
                    <DropdownFactory  value="TERM" CDTYPE="CF" CDNAME="TERM"  />
                    </div>
                    <div className="col-md-3">
                        <h5><b>Luật phân bổ bán</b></h5>
                    </div>
                    <div className="col-md-3">
                    <DropdownFactory  value="TERM" CDTYPE="CF" CDNAME="TERM"  />
                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5><b>Giao dịch bị tính thêm phí  bổ sung</b></h5>
                    </div>
                    <div className="col-md-3">
                    <input id="txtDLPPId" className="form-control" type="text" placeholder="Giao dịch bị tính thêm phí  bổ sung" />
                    </div>
                    <div className="col-md-3">
                        <h5><b>Tỷ lệ tính phí bổ sung</b></h5>
                    </div>
                    <div className="col-md-3">
                    <input id="txtDLPPId" className="form-control" type="text" placeholder="Tỷ lệ tính phí bổ sung" />
                    </div>
                </div>

            </div>
        )
    }

}

const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification
  });


  const decorators = flow([
    connect(stateToProps),
    translate('SessionInfo')
  ]);

  module.exports = decorators(SessionInfo);
