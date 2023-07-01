import React from 'react';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import DropdownFactory from '../../../../../utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';

class TradingCycleInfoSIP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      minmoney: { value: 0, validate: null, tooltip: "Không được để trống !!" },
      maxmoney: { value: 0, validate: null, tooltip: "Không được để trống !!" },
      datachange: {},
      selectedOption: '',
      dataTradingCycleInfoSIP: {
        transactionperiod: "",
        periodcode: "",
        //firsttradingsession: "",
        day: "",
        date: "",

      }
    }
  }
  componentWillMount() {
    if (this.props.data != '') {
      console.log('componentWillMount 1', this.props.data)
      this.state.dataTradingCycleInfoSIP["transactionperiod"] = this.props.data.CLEARDAYSIP
      this.state.dataTradingCycleInfoSIP["periodcode"] = this.props.data.PERIODCODE
      //this.state.dataTradingCycleInfoSIP["firsttradingsession"] = this.props.data.FISTTRADINGDATE
      if (this.props.data.CLEARDAYSIP == "W") {
        this.state.dataTradingCycleInfoSIP["day"] = this.props.data.PEDRIODSIP + "|";
        this.state.dataTradingCycleInfoSIP["date"] = "";
      }

      else if (this.props.data.CLEARDAYSIP == "M") {
        this.state.dataTradingCycleInfoSIP["date"] = this.props.data.PEDRIODSIP + "|";
        this.state.dataTradingCycleInfoSIP["day"] = "";
      }
      else {
        this.state.dataTradingCycleInfoSIP["date"] = "";
        this.state.dataTradingCycleInfoSIP["day"] = "";
      }

      this.setState({
        dataTradingCycleInfoSIP: this.state.dataTradingCycleInfoSIP
      })
      console.log('componentWillMount 2:', this.state.dataTradingCycleInfoSIP)
    }
  }

  handleChange1 = (selectedOption) => {
    this.setState({ selectedOption });
    //console.log('dataTradingCycleInfoSIP:handleChange1:',selectedOption)
  }
  onValueChange(type, data) {
    //console.log('dataTradingCycleInfoSIP:onValueChange:',type)
    this.state[type].value = data.value
    this.setState(this.state)
  }
  onChange(type, event) {
    //console.log('dataTradingCycleInfoSIP:onChange:',type)
    this.state.datachange[type] = event.value;
    this.setState({ datachange: this.state.datachange })
  }
  onChangeText(type, event) {
    console.log('type, event:::', type, event.target.value)
    let that = this
    let data = {};
    if (event.target) {

      this.state.dataTradingCycleInfoSIP[type] = event.target.value;
    }
    else {

      this.state.dataTradingCycleInfoSIP[type] = event.value;
    }

    this.setState({ dataTradingCycleInfoSIP: this.state.dataTradingCycleInfoSIP })
    this.props.onChange(this.state.dataTradingCycleInfoSIP)
  }
  handleChange(number, event) {
    //console.log('dataTradingCycleInfoSIP: handleChange',number)
    var v_return = this.state.dataTradingCycleInfoSIP["date"]
    if (!event.target.checked) {
      //console.log('thang 1',number);  
      v_return = v_return.replace(number + '|', '')
    }
    else {
      //console.log('thang 2',number)  
      v_return = v_return + number + '|';
    }


    this.state.dataTradingCycleInfoSIP["date"] = v_return
    this.setState({
      dataTradingCycleInfoSIP: this.state.dataTradingCycleInfoSIP
    })
    this.props.onChange(this.state.dataTradingCycleInfoSIP)
  }
  handleChangeDOW(number, event) {
    //console.log('dataTradingCycleInfoSIP: handleChangeDOW',number)


    var v_return = this.state.dataTradingCycleInfoSIP["day"]

    if (!event.target.checked)
      v_return = v_return.replace(number + '|', '')
    else v_return = v_return + number + '|';


    this.state.dataTradingCycleInfoSIP["day"] = v_return

    this.setState({
      dataTradingCycleInfoSIP: this.state.dataTradingCycleInfoSIP
    })
    this.props.onChange(this.state.dataTradingCycleInfoSIP)
  }
  onChangeDate(type, event) {
    //console.log('dataTradingCycleInfoSIP: onChangeDate',type, value)
    this.state.dataTradingCycleInfoSIP[type] = event.value;
    this.setState({ datagroup: this.state.dataTradingCycleInfoSIP })
    this.props.onChange(this.state.dataTradingCycleInfoSIP)
  }
  onSetDefaultValue = (type, value) => {
    //console.log('onSetDefaultValue:=========',type, value)
    //console.log('this.state.dataTradingCycleInfoSIP[type]:=======',this.state.dataTradingCycleInfoSIP[type])
    if (!this.state.dataTradingCycleInfoSIP[type]) {
      if (type == 'transactionperiod') this.state.dataTradingCycleInfoSIP[type] = 'M'
      else this.state.dataTradingCycleInfoSIP[type] = value
    }

  }

  onChangeDRD(type, event) {
    //console.log('dataTradingCycleInfoSIP: onChangeDRD',type, value)
    this.refs.formweek.reset()
    let data = {};
    if (event.target) {

      this.state.dataTradingCycleInfoSIP[type] = event.target.value;
    }
    else {
      if (event.value == 'W') {
        this.state.dataTradingCycleInfoSIP[type] = event.value;
        this.state.dataTradingCycleInfoSIP['date'] = '';
        this.state.dataTradingCycleInfoSIP['periodcode'] = '';
      }
      else {
        this.state.dataTradingCycleInfoSIP[type] = event.value;
        this.state.dataTradingCycleInfoSIP['day'] = '';
        this.state.dataTradingCycleInfoSIP['periodcode'] = '';
      }

    }
    this.setState({ dataTradingCycleInfoSIP: this.state.dataTradingCycleInfoSIP })
    this.props.onChange(this.state.dataTradingCycleInfoSIP)
  }
  componentDidMount() {
    //console.log('dataTradingCycleInfoSIP:didMount:====',this.state.dataTradingCycleInfoSIP)
    var isDay = "";
    var str = "";
    if (this.state.dataTradingCycleInfoSIP.date == "") {
      str = this.state.dataTradingCycleInfoSIP.day;
      isDay = "daySIP";
    }

    else {
      str = this.state.dataTradingCycleInfoSIP.date;
      isDay = "dateSIP"
    }
    console.log('componentDidMount:', isDay);
    console.log('componentDidMount dataTradingCycleInfoSIP.date:', this.state.dataTradingCycleInfoSIP.date);

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

      var checkid = window.$('#' + isDay + node);
      checkid.prop("checked", true);
      //console.log('checked:','#'+isDay+node);
    })
  }
  render() {
    console.log('render trong :====', this.state.dataTradingCycleInfoSIP)
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;
    let displayyTrading = this.props.accessTradingCycleInfo == 'view' ? true : false
    let displayy = this.state.dataTradingCycleInfoSIP.transactionperiod
    return (

      <div className="col-md-12" style={{ paddingTop: "11px" }}>
        <form ref="formweek" >
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight" id="lbltransactionperiod"><b>{this.props.strings.transactionperiod}</b></h5>
            </div>
            <div className="col-md-3 customSelect">
              <DropdownFactory disabled={displayyTrading} CDVAL={this.state.dataTradingCycleInfoSIP.transactionperiod} onSetDefaultValue={this.onSetDefaultValue} value="transactionperiod" CDTYPE="SY" CDNAME="TRADINGCYCLE" onChange={this.onChangeDRD.bind(this)} ID="drdTransactionperiodSIP" />
            </div>

            {/* <div className="col-md-3">
              <h5 className="highlight" id="lblfirsttradingsession"><b>{this.props.strings.firsttradingsession}</b></h5>
            </div> */}
            {/* <div className="col-md-3 fixWidthDatePickerForOthers">
              <DateInput disabled={displayyTrading} onChange={this.onChangeDate.bind(this)} value={this.state.dataTradingCycleInfoSIP["firsttradingsession"]} type="firsttradingsession" id="txtFirsttradingsession" />
            </div> */}
          </div>
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight" id="lbltransactionperiod"><b>{this.props.strings.periodcode}</b></h5>
            </div>
            <div className="col-md-3 ">
              <input

                value={this.state.dataTradingCycleInfoSIP.periodcode}
                onChange={this.onChangeText.bind(this, "periodcode")}
                id="txtperiodcode"
                className="form-control"
                type="text"
                placeholder={this.props.strings.periodcode}
              />
            </div>
          </div>
          <div className="col-md-12 row" style={{ display: displayy == 'W' ? 'block' : 'none' }}>
            <div className="col-md-3">
              <h5 className="highlight" id="lblday"><b>{this.props.strings.dayofweek}</b></h5>
            </div>

            <div className="col-md-9">
              <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="daySIP2" onChange={this.handleChangeDOW.bind(this, 2)} /> {this.props.strings.monday}</span>
              <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="daySIP3" onChange={this.handleChangeDOW.bind(this, 3)} /> {this.props.strings.tuesday}</span>
              <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="daySIP4" onChange={this.handleChangeDOW.bind(this, 4)} />{this.props.strings.wednesday}</span>
              <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="daySIP5" onChange={this.handleChangeDOW.bind(this, 5)} /> {this.props.strings.thursday}</span>
              <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="daySIP6" onChange={this.handleChangeDOW.bind(this, 6)} /> {this.props.strings.friday}</span>
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
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP1" onChange={this.handleChange.bind(this, 1)} /> 1</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP2" onChange={this.handleChange.bind(this, 2)} /> 2</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP3" onChange={this.handleChange.bind(this, 3)} /> 3</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP4" onChange={this.handleChange.bind(this, 4)} /> 4</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP5" onChange={this.handleChange.bind(this, 5)} /> 5</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP6" onChange={this.handleChange.bind(this, 6)} /> 6</span></td>
                  </tr>
                  <tr>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP7" onChange={this.handleChange.bind(this, 7)} /> 7</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP8" onChange={this.handleChange.bind(this, 8)} /> 8</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP9" onChange={this.handleChange.bind(this, 9)} /> 9</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP10" onChange={this.handleChange.bind(this, 10)} /> 10</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP11" onChange={this.handleChange.bind(this, 11)} /> 11</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP12" onChange={this.handleChange.bind(this, 12)} /> 12</span></td>
                  </tr>
                  <tr>

                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP13" onChange={this.handleChange.bind(this, 13)} /> 13</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP14" onChange={this.handleChange.bind(this, 14)} /> 14</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP15" onChange={this.handleChange.bind(this, 15)} /> 15</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP16" onChange={this.handleChange.bind(this, 16)} /> 16</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP17" onChange={this.handleChange.bind(this, 17)} /> 17</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP18" onChange={this.handleChange.bind(this, 18)} /> 18</span></td>
                  </tr>
                  <tr>


                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP19" onChange={this.handleChange.bind(this, 19)} /> 19</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP20" onChange={this.handleChange.bind(this, 20)} /> 20</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP21" onChange={this.handleChange.bind(this, 21)} /> 21</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP22" onChange={this.handleChange.bind(this, 22)} /> 22</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP23" onChange={this.handleChange.bind(this, 23)} /> 23</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP24" onChange={this.handleChange.bind(this, 24)} /> 24</span></td>
                  </tr>
                  <tr>


                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP25" onChange={this.handleChange.bind(this, 25)} /> 25</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP26" onChange={this.handleChange.bind(this, 26)} /> 26</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP27" onChange={this.handleChange.bind(this, 27)} /> 27</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP28" onChange={this.handleChange.bind(this, 28)} /> 28</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP29" onChange={this.handleChange.bind(this, 29)} /> 29</span></td>
                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP30" onChange={this.handleChange.bind(this, 30)} /> 30</span></td>
                  </tr>
                  <tr>


                    <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="dateSIP31" onChange={this.handleChange.bind(this, 31)} /> 31</span></td>

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
  translate('TradingCycleInfoSIP')
]);

module.exports = decorators(TradingCycleInfoSIP);
