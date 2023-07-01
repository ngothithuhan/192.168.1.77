import React from 'react';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import DropdownFactory from '../../../../../utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';

class TradingCycleInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      minmoney: { value: 0, validate: null, tooltip: "Không được để trống !!" },
      maxmoney: { value: 0, validate: null, tooltip: "Không được để trống !!" },
      datachange: {},
      selectedOption: '',
      dataTradingCycleInfo: {
        transactionperiod: "",
        firsttradingsession: "",
        day: "",
        date: "",

      }
    }
  }
  componentWillMount() {
if(this.props.data!=''){
  
    this.state.dataTradingCycleInfo["transactionperiod"] = this.props.data.CLEARDAY
    this.state.dataTradingCycleInfo["firsttradingsession"] = this.props.data.FISTTRADINGDATE
    if(this.props.data.CLEARDAY=="W"){
      this.state.dataTradingCycleInfo["day"] = this.props.data.PEDRIOD+"|";
      this.state.dataTradingCycleInfo["date"] ="";
    }
   
    else if(this.props.data.CLEARDAY=="M"){
      this.state.dataTradingCycleInfo["date"] = this.props.data.PEDRIOD+"|";
      this.state.dataTradingCycleInfo["day"] ="";
    }
    else {
      this.state.dataTradingCycleInfo["date"] = "";
      this.state.dataTradingCycleInfo["day"] ="";
    }
    
    this.setState({
      dataTradingCycleInfo: this.state.dataTradingCycleInfo
    })
  }
  }

  handleChange1 = (selectedOption) => {
    this.setState({ selectedOption });
  
  }
  onValueChange(type, data) {
    
    this.state[type].value = data.value
    this.setState(this.state)
  }
  onChange(type, event) {
    this.state.datachange[type] = event.value;
    this.setState({ datachange: this.state.datachange })
  }

  handleChange(number, event) {
    


    var v_return = this.state.dataTradingCycleInfo["date"]

    if (!event.target.checked)
      v_return = v_return.replace(number + '|', '')
    else v_return = v_return + number + '|';
   
    this.state.dataTradingCycleInfo["date"] = v_return
    this.setState({
      dataTradingCycleInfo: this.state.dataTradingCycleInfo
    })
    this.props.onChange(this.state.dataTradingCycleInfo)
  }
  handleChangeDOW(number, event) {
 


    var v_return = this.state.dataTradingCycleInfo["day"]

    if (!event.target.checked)
      v_return = v_return.replace(number + '|', '')
    else v_return = v_return + number + '|';

   
    this.state.dataTradingCycleInfo["day"] = v_return

    this.setState({
      dataTradingCycleInfo: this.state.dataTradingCycleInfo
    })
    this.props.onChange(this.state.dataTradingCycleInfo)
  }
  onChangeDate(type, event) {

    this.state.dataTradingCycleInfo[type] = event.value;
    this.setState({ datagroup: this.state.dataTradingCycleInfo })
    this.props.onChange(this.state.dataTradingCycleInfo)
  }
  onSetDefaultValue = (type, value) => {
 
    if (!this.state.dataTradingCycleInfo[type]){
      if(type=='transactionperiod')   this.state.dataTradingCycleInfo[type] = 'W'
      else  this.state.dataTradingCycleInfo[type] = value
    }
      
  }
  
  onChangeDRD(type, event) {
  
    this.refs.formweek.reset()
    let data = {};
    if (event.target) {

      this.state.dataTradingCycleInfo[type] = event.target.value;
    }
    else {
      if (event.value == 'W') {
        this.state.dataTradingCycleInfo[type] = event.value;
        this.state.dataTradingCycleInfo['date'] = '';
      }
      else {
        this.state.dataTradingCycleInfo[type] = event.value;
        this.state.dataTradingCycleInfo['day'] = '';
      }

    }
    this.setState({ dataTradingCycleInfo: this.state.dataTradingCycleInfo })
    this.props.onChange(this.state.dataTradingCycleInfo)
  }
  componentDidMount() {
    var isDay="";
    var str ="";
    if(this.state.dataTradingCycleInfo.date==""){
      str = this.state.dataTradingCycleInfo.day;
      isDay="day";
    }
 
    else {
      str = this.state.dataTradingCycleInfo.date;
      isDay="date"
    }  
    var array = []
    var count = str.split("|").length - 1;
    var day = "";
    for (var i = 0; i <= count; i++) {
      if (i == count) array.push(str.slice(-1));
      else {
        day = str.substr(0, str.indexOf('|'));
        str = str.replace(day + "|", "")
        array.push(day)
      }
    }
    array.map(function (node, index) {
     
      var checkid = window.$('#'+isDay+node);
      checkid.prop("checked", true);
      
    })
  }
  render() {
 
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;
    let displayyTrading=this.props.accessTradingCycleInfo=='view'?true:false
    let displayy = this.state.dataTradingCycleInfo.transactionperiod
    return (
      <div className="col-md-12" style={{ paddingTop: "11px" }}>
        <form ref="formweek" >
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight" id="lbltransactionperiod"><b>{this.props.strings.transactionperiod}</b></h5>
            </div>
            <div className="col-md-3 customSelect">
              <DropdownFactory disabled={displayyTrading} CDVAL={this.state.dataTradingCycleInfo.transactionperiod} onSetDefaultValue={this.onSetDefaultValue} value="transactionperiod" CDTYPE="SY" CDNAME="TRADINGCYCLE" onChange={this.onChangeDRD.bind(this)} ID="drdTransactionperiod" />
            </div>
            <div className="col-md-3">
              <h5 className="highlight" id="lblfirsttradingsession"><b>{this.props.strings.firsttradingsession}</b></h5>
            </div>
            <div className="col-md-3 fixWidthDatePickerForOthers">
              <DateInput disabled={displayyTrading} onChange={this.onChangeDate.bind(this)} value={this.state.dataTradingCycleInfo["firsttradingsession"]} type="firsttradingsession" id="txtFirsttradingsession" />
            </div>
          </div>
          <div className="col-md-12 row" style={{ display: displayy == 'W' ? 'block' : 'none' }}>
            <div className="col-md-3">
              <h5 className="highlight" id="lblday"><b>{this.props.strings.dayofweek}</b></h5>
            </div>

            <div className="col-md-9">
              <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="day2" onChange={this.handleChangeDOW.bind(this, 2)} /> {this.props.strings.monday}</span>
              <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="day3" onChange={this.handleChangeDOW.bind(this, 3)} /> {this.props.strings.tuesday}</span>
              <span className="checkbox_custom"><input disabled={displayyTrading}  type="checkbox" id="day4" onChange={this.handleChangeDOW.bind(this, 4)} />{this.props.strings.wednesday}</span>
              <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="day5" onChange={this.handleChangeDOW.bind(this, 5)} /> {this.props.strings.thursday}</span>
              <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="day6" onChange={this.handleChangeDOW.bind(this, 6)} /> {this.props.strings.friday}</span>
            </div>


          </div>
          <div className="col-md-12 row" style={{ display: displayy == 'M' ? 'block' : 'none' }}>
            <div className="col-md-3">
              <h5 className="highlight" id="lbldate"><b>{this.props.strings.dayofmonth}</b></h5>
            </div>

            <div className="col-md-9">
              <table>
             < tbody>
                <tr>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date1" onChange={this.handleChange.bind(this, 1)} /> 1</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date2" onChange={this.handleChange.bind(this, 2)} /> 2</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date3" onChange={this.handleChange.bind(this, 3)} /> 3</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date4" onChange={this.handleChange.bind(this, 4)} /> 4</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date5" onChange={this.handleChange.bind(this, 5)} /> 5</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date6" onChange={this.handleChange.bind(this, 6)} /> 6</span></td>
                </tr>
                <tr>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date7" onChange={this.handleChange.bind(this, 7)} /> 7</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date8" onChange={this.handleChange.bind(this, 8)} /> 8</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date9" onChange={this.handleChange.bind(this, 9)} /> 9</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date10" onChange={this.handleChange.bind(this, 10)} /> 10</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date11" onChange={this.handleChange.bind(this, 11)} /> 11</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date12" onChange={this.handleChange.bind(this, 12)} /> 12</span></td>
                </tr>
                <tr>

                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date13" onChange={this.handleChange.bind(this, 13)} /> 13</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date14" onChange={this.handleChange.bind(this, 14)} /> 14</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date15" onChange={this.handleChange.bind(this, 15)} /> 15</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date16" onChange={this.handleChange.bind(this, 16)} /> 16</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date17" onChange={this.handleChange.bind(this, 17)} /> 17</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date18" onChange={this.handleChange.bind(this, 18)} /> 18</span></td>
                </tr>
                <tr>


                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date19" onChange={this.handleChange.bind(this, 19)} /> 19</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date20" onChange={this.handleChange.bind(this, 20)} /> 20</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date21" onChange={this.handleChange.bind(this, 21)} /> 21</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date22" onChange={this.handleChange.bind(this, 22)} /> 22</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date23" onChange={this.handleChange.bind(this, 23)} /> 23</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date24" onChange={this.handleChange.bind(this, 24)} /> 24</span></td>
                </tr>
                <tr>


                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date25" onChange={this.handleChange.bind(this, 25)} /> 25</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date26" onChange={this.handleChange.bind(this, 26)} /> 26</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dat27" onChange={this.handleChange.bind(this, 27)} /> 27</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date28" onChange={this.handleChange.bind(this, 28)} /> 28</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date29" onChange={this.handleChange.bind(this, 29)} /> 29</span></td>
                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date30" onChange={this.handleChange.bind(this, 30)} /> 30</span></td>
                </tr>
                <tr>


                  <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="date31" onChange={this.handleChange.bind(this, 31)} /> 31</span></td>

                </tr>
                </ tbody>
              </table>


            </div>


          </div>


        </form>

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
  translate('TradingCycleInfo')
]);

module.exports = decorators(TradingCycleInfo);
