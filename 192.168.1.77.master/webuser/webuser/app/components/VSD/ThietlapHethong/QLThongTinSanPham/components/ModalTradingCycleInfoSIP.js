import React from 'react';
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import DropdownFactory from '../../../../../utils/DropdownFactory';
import { showNotifi } from 'app/action/actionNotification.js';
import { METHODS_FIX, METHODS_FLEX } from '../../../../../Helpers';
import { toast } from 'react-toastify';
import NumberFormat from 'react-number-format';

class ModalTradingCycleInfoSIP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTradingCycleInfoSIP: {
        transactionperiod: "",
        periodcode: "",
        day: "",
        date: "",
        month: "",
        minamt: 0,
        maxamt: 0,
        minterm: 0,
        maxtermbreak: 0,
      },
    }
  }
  isFirstSetDefaultFix = true;
  isFirstSetDefaultFlex = true;

  componentWillReceiveProps(nextProps) {
    if (nextProps.access == "update" || nextProps.access == "view") {
      if (nextProps.dataUPDATE) {
        this.isFirstSetDefaultFix = false;
        this.isFirstSetDefaultFlex = false;
        this.setState({
          dataTradingCycleInfoSIP: {
            id: nextProps.dataUPDATE['id'],
            transactionperiod: nextProps.dataUPDATE['transactionperiod'],
            periodcode: nextProps.dataUPDATE['periodcode'],
            day: nextProps.dataUPDATE['day'],
            date: nextProps.dataUPDATE['date'],
            month: nextProps.dataUPDATE['month'],
            minamt: nextProps.dataUPDATE['minamt'],
            maxamt: nextProps.dataUPDATE['maxamt'],
            minterm: nextProps.dataUPDATE['minterm'],
            maxtermbreak: nextProps.dataUPDATE['maxtermbreak'],
          }
        })
      }
    }
  }
  onChangeText(type, event) {
    let that = this
    let data = {};
    if (event.target) {
      this.state.dataTradingCycleInfoSIP[type] = event.target.value;
    }
    else {
      this.state.dataTradingCycleInfoSIP[type] = event.value;
    }
    this.setState({ dataTradingCycleInfoSIP: this.state.dataTradingCycleInfoSIP })
    // this.props.onChange(this.state.dataTradingCycleInfoSIP)
  }
  handleChange(number, event) {
    var v_return = this.state.dataTradingCycleInfoSIP["date"]
    if (!event.target.checked) {
      v_return = v_return.replace(number + '|', '')
    }
    else {
      if (v_return.length > 0) {
        toast.error(this.props.strings.checkOnlyOneDate, { position: toast.POSITION.BOTTOM_RIGHT });
      } else {
        v_return = v_return + number + '|';
      }
    }
    this.state.dataTradingCycleInfoSIP["date"] = v_return
    this.setState({
      dataTradingCycleInfoSIP: this.state.dataTradingCycleInfoSIP
    })
    // this.props.onChange(this.state.dataTradingCycleInfoSIP)
  }
  handleChangeDOW(number, event) {
    var v_return = this.state.dataTradingCycleInfoSIP["day"]

    if (!event.target.checked)
      v_return = v_return.replace(number + '|', '')
    else v_return = v_return + number + '|';

    this.state.dataTradingCycleInfoSIP["day"] = v_return

    this.setState({
      dataTradingCycleInfoSIP: this.state.dataTradingCycleInfoSIP
    })
    // this.props.onChange(this.state.dataTradingCycleInfoSIP)
  }
  handleChangeMonth(number, event) {
    var v_return = this.state.dataTradingCycleInfoSIP["month"];

    if (!event.target.checked) {
      v_return = v_return.replace(number + '|', '');
    } else {
      if (v_return.length > 0) {
        toast.error(this.props.strings.checkOnlyOneMonth, { position: toast.POSITION.BOTTOM_RIGHT });
      } else {
        v_return = v_return + number + '|';
      }
    }

    this.state.dataTradingCycleInfoSIP["month"] = v_return;
    this.setState({
      dataTradingCycleInfoSIP: this.state.dataTradingCycleInfoSIP
    })
    // this.props.onChange(this.state.dataTradingCycleInfoSIP)
  }
  onSetDefaultValue = (type, value) => {
    let currentMethods = this.props.ProductInfo && this.props.ProductInfo.p_methods;
    if (type == 'transactionperiod' && (this.isFirstSetDefaultFix || this.isFirstSetDefaultFlex)) {
      if (currentMethods == METHODS_FLEX && this.isFirstSetDefaultFlex) {
        this.isFirstSetDefaultFlex = false;
        this.state.dataTradingCycleInfoSIP[type] = 'D';
        this.setState({ dataTradingCycleInfoSIP: this.state.dataTradingCycleInfoSIP })
      }
      else if (currentMethods == METHODS_FIX && this.isFirstSetDefaultFix) {
        this.isFirstSetDefaultFix = false;
        this.state.dataTradingCycleInfoSIP[type] = 'M';
        this.setState({ dataTradingCycleInfoSIP: this.state.dataTradingCycleInfoSIP })
      }
      else this.state.dataTradingCycleInfoSIP[type] = value;
    }
  }
  onChangeDRD(type, event) {
    this.isFirstSetDefaultFix = false;
    this.isFirstSetDefaultFlex = false;
    this.refs.formweek.reset()
    let data = {};
    if (event.target) {
      this.state.dataTradingCycleInfoSIP[type] = event.target.value;
    } else {
      this.state.dataTradingCycleInfoSIP[type] = event.value;
    }
    this.setState({ dataTradingCycleInfoSIP: this.state.dataTradingCycleInfoSIP })
    // this.props.onChange(this.state.dataTradingCycleInfoSIP)
  }
  clearDataModal = () => {
    this.isFirstSetDefaultFix = true;
    this.isFirstSetDefaultFlex = true;
    this.setState({
      dataTradingCycleInfoSIP: {
        transactionperiod: "",
        periodcode: "",
        day: "",
        date: "",
        month: "",
        minamt: 0,
        maxamt: 0,
        minterm: 0,
        maxtermbreak: 0,
      },
    })
  }
  close() {
    this.clearDataModal();
    this.props.closeModalDetail();
  }
  addTradingCycleSIP() {
    let mssgerr = this.checkValid(this.state.dataTradingCycleInfoSIP);
    if (mssgerr == '') {
      this.props.addTradingCycleSIP(this.state.dataTradingCycleInfoSIP, this.props.access)
      this.clearDataModal();
    }
  }
  checkValid = (dataToCheck) => {
    let mssgerr = '';
    if (dataToCheck['minamt'] === '') {
      mssgerr = this.props.strings.requireminBuyValue;
    } 
    else if (dataToCheck['maxamt'] === '') {
      mssgerr = this.props.strings.requiremaxBuyValue;
    } 
    else if (dataToCheck['minterm'] === '') {
      mssgerr = this.props.strings.requireminTerm;
    } 
    else if (dataToCheck['maxtermbreak'] === '') {
      mssgerr = this.props.strings.requiremaxTermbreak;
    } 
    else if (dataToCheck['periodcode'] == '') {
      mssgerr = this.props.strings.requirePeriodcode;
    } else {
      switch (dataToCheck['transactionperiod']) {
        case "D":
          break;
        case "W":
          if (dataToCheck['day'] == '') mssgerr = this.props.strings.requireDayOfWeek;
          break;
        case "M":
          if (dataToCheck['date'] == '') mssgerr = this.props.strings.requireDateOfMonth;
          break;
        case "Q":
          if (dataToCheck['month'] == '') mssgerr = this.props.strings.requireMonthOfQuater;
          if (dataToCheck['date'] == '') mssgerr = this.props.strings.requireDateOfMonth;
          break;
        default:
          break;
      }
    }
    if (mssgerr !== '') this.props.dispatch(showNotifi({ type: "error", header: "", content: mssgerr }));
    return mssgerr;
  }
  render() {
    let displayyTrading = this.props.access == 'view' ? true : false
    let displayy = this.state.dataTradingCycleInfoSIP.transactionperiod
    let showData = this.state.dataTradingCycleInfoSIP;
    let currentMethods = this.props.ProductInfo && this.props.ProductInfo.p_methods;
    return (
      <Modal show={this.props.showModalDetail} backdropClassName="secondModal" dialogClassName="custom-second-modal" bsSize="lg">
        <Modal.Header >
          <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflow: "auto", height: "100%" }}>
          <div className="col-md-12" style={{ paddingTop: "11px" }}>
            <form ref="formweek" >
              {/* minBuyValue: "Giá trị đặt mua tối thiểu" */}
              <div className="col-md-12 row">
                <div className="col-md-3">
                  <h5 className="highlight" id="lblminBuyValue"><b>{this.props.strings.minBuyValue}</b></h5>
                </div>
                <div className="col-md-9">
                  <NumberFormat 
                    maxLength={21} 
                    disabled={displayyTrading} 
                    allowNegative={false} 
                    className="form-control" 
                    id="txtminBuyValue" 
                    value={this.state.dataTradingCycleInfoSIP && this.state.dataTradingCycleInfoSIP["minamt"]} 
                    onValueChange={this.onChangeText.bind(this, 'minamt')} 
                    prefix={''} 
                    decimalScale={2} 
                    thousandSeparator={true} 
                    placeholder={this.props.strings.minBuyValue} 
                  />
                </div>
              </div>
              {/* maxBuyValue: "Giá trị đặt mua tối đa", */}
              <div className="col-md-12 row">
                <div className="col-md-3">
                  <h5 className="highlight" id="lblmaxBuyValue"><b>{this.props.strings.maxBuyValue}</b></h5>
                </div>
                <div className="col-md-9">
                  <NumberFormat 
                    maxLength={21} 
                    disabled={displayyTrading} 
                    allowNegative={false} 
                    className="form-control" 
                    id="txtmaxBuyValue" 
                    value={this.state.dataTradingCycleInfoSIP && this.state.dataTradingCycleInfoSIP["maxamt"]} 
                    onValueChange={this.onChangeText.bind(this, 'maxamt')} 
                    prefix={''} 
                    decimalScale={2} 
                    thousandSeparator={true} 
                    placeholder={this.props.strings.maxBuyValue} 
                  />
                </div>
              </div>
              <div className="col-md-12 row">
                <div className="col-md-3">
                  <h5 className="highlight" id="lblminTerm"><b>{this.props.strings.minTerm}</b></h5>
                </div>
                <div className="col-md-9">
                  <NumberFormat
                    maxLength={21}
                    disabled={displayyTrading}
                    allowNegative={false}
                    className="form-control"
                    id="txtminTerm"
                    value={this.state.dataTradingCycleInfoSIP && this.state.dataTradingCycleInfoSIP["minterm"]}
                    onValueChange={this.onChangeText.bind(this, 'minterm')}
                    prefix={''}
                    decimalScale={2}
                    thousandSeparator={true}
                    placeholder={this.props.strings.minTerm}
                  />
                </div>
              </div>
              <div className="col-md-12 row">
                <div className="col-md-3">
                  <h5 className="highlight" id="lblmaxTermbreak"><b>{this.props.strings.maxTermbreak}</b></h5>
                </div>
                <div className="col-md-9">
                  <NumberFormat
                    maxLength={21}
                    disabled={displayyTrading}
                    allowNegative={false}
                    className="form-control"
                    id="txtmaxTermbreak"
                    value={this.state.dataTradingCycleInfoSIP && this.state.dataTradingCycleInfoSIP["maxtermbreak"]}
                    onValueChange={this.onChangeText.bind(this, 'maxtermbreak')}
                    prefix={''}
                    decimalScale={2}
                    thousandSeparator={true}
                    placeholder={this.props.strings.maxTermbreak}
                  />
                </div>
              </div>
              <div className="col-md-12 row">
                <div className="col-md-3">
                  <h5 className="highlight" id="lbltransactionperiod"><b>{this.props.strings.transactionperiod}</b></h5>
                </div>
                <div className="col-md-9 customSelect">
                  {currentMethods === METHODS_FLEX && (
                    <DropdownFactory disabled={true} CDVAL={this.state.dataTradingCycleInfoSIP.transactionperiod} onSetDefaultValue={this.onSetDefaultValue} value="transactionperiod" CDTYPE="FO" CDNAME="TRADINGCYCLE" onChange={this.onChangeDRD.bind(this)} ID="drdTransactionperiodSIP" listShowOptions={['D']} />
                  )}
                  {currentMethods === METHODS_FIX && (
                    <DropdownFactory disabled={displayyTrading} CDVAL={this.state.dataTradingCycleInfoSIP.transactionperiod} onSetDefaultValue={this.onSetDefaultValue} value="transactionperiod" CDTYPE="FO" CDNAME="TRADINGCYCLE" onChange={this.onChangeDRD.bind(this)} ID="drdTransactionperiodSIP" listShowOptions={['M', 'Q']} />
                  )}
                </div>
              </div>
              <div className="col-md-12 row">
                <div className="col-md-3">
                  <h5 className="highlight" id="lbltransactionperiod"><b>{this.props.strings.periodcode}</b></h5>
                </div>
                <div className="col-md-9">
                  <input
                    value={this.state.dataTradingCycleInfoSIP.periodcode}
                    onChange={this.onChangeText.bind(this, "periodcode")}
                    id="txtperiodcode"
                    className="form-control"
                    type="text"
                    placeholder={this.props.strings.periodcode}
                    disabled={displayyTrading}
                  />
                </div>
              </div>
              <div className="col-md-12 row" style={{ display: displayy == 'W' ? 'block' : 'none' }}>
                <div className="col-md-3">
                  <h5 className="highlight" id="lblday"><b>{this.props.strings.dayofweek}</b></h5>
                </div>

                <div className="col-md-9" style={{ marginTop: 10, whiteSpace: 'nowrap' }}>
                  <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="daySIP2" checked={showData['day'].split('|').includes('2')} onChange={this.handleChangeDOW.bind(this, 2)} /> {this.props.strings.monday}</span>
                  <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="daySIP3" checked={showData['day'].split('|').includes('3')} onChange={this.handleChangeDOW.bind(this, 3)} /> {this.props.strings.tuesday}</span>
                  <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="daySIP4" checked={showData['day'].split('|').includes('4')} onChange={this.handleChangeDOW.bind(this, 4)} />{this.props.strings.wednesday}</span>
                  <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="daySIP5" checked={showData['day'].split('|').includes('5')} onChange={this.handleChangeDOW.bind(this, 5)} /> {this.props.strings.thursday}</span>
                  <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="daySIP6" checked={showData['day'].split('|').includes('6')} onChange={this.handleChangeDOW.bind(this, 6)} /> {this.props.strings.friday}</span>
                </div>
              </div>

              <div className="col-md-12 row" style={{ display: displayy == 'Q' ? 'block' : 'none' }}>
                <div className="col-md-3">
                  <h5 className="highlight" id="lblquater"><b>{this.props.strings.monthofquater}</b></h5>
                </div>
                <div className="col-md-9" style={{ marginTop: 10 }}>
                  <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="monthSIP1" checked={showData['month'].split('|').includes('1')} onChange={this.handleChangeMonth.bind(this, 1)} /> {this.props.strings.firstMonth}</span>
                  <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="monthSIP2" checked={showData['month'].split('|').includes('2')} onChange={this.handleChangeMonth.bind(this, 2)} /> {this.props.strings.secondMonth}</span>
                  <span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" id="monthSIP3" checked={showData['month'].split('|').includes('3')} onChange={this.handleChangeMonth.bind(this, 3)} /> {this.props.strings.thirdMonth}</span>
                </div>
              </div>

              <div className="col-md-12 row" style={{ display: (displayy == 'M' || displayy == 'Q') ? 'block' : 'none' }}>
                <div className="col-md-3">
                  <h5 className="highlight" id="lbldate"><b>{this.props.strings.dayofmonth}</b></h5>
                </div>

                <div className="col-md-9" style={{ marginTop: 10 }}>
                  <table>
                    < tbody>
                      <tr>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('1')} id="dateSIP1" onChange={this.handleChange.bind(this, 1)} /> 1</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('2')} id="dateSIP2" onChange={this.handleChange.bind(this, 2)} /> 2</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('3')} id="dateSIP3" onChange={this.handleChange.bind(this, 3)} /> 3</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('4')} id="dateSIP4" onChange={this.handleChange.bind(this, 4)} /> 4</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('5')} id="dateSIP5" onChange={this.handleChange.bind(this, 5)} /> 5</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('6')} id="dateSIP6" onChange={this.handleChange.bind(this, 6)} /> 6</span></td>
                      </tr>
                      <tr>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('7')} id="dateSIP7" onChange={this.handleChange.bind(this, 7)} /> 7</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('8')} id="dateSIP8" onChange={this.handleChange.bind(this, 8)} /> 8</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('9')} id="dateSIP9" onChange={this.handleChange.bind(this, 9)} /> 9</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('10')} id="dateSIP10" onChange={this.handleChange.bind(this, 10)} /> 10</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('11')} id="dateSIP11" onChange={this.handleChange.bind(this, 11)} /> 11</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('12')} id="dateSIP12" onChange={this.handleChange.bind(this, 12)} /> 12</span></td>
                      </tr>
                      <tr>

                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('13')} id="dateSIP13" onChange={this.handleChange.bind(this, 13)} /> 13</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('14')} id="dateSIP14" onChange={this.handleChange.bind(this, 14)} /> 14</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('15')} id="dateSIP15" onChange={this.handleChange.bind(this, 15)} /> 15</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('16')} id="dateSIP16" onChange={this.handleChange.bind(this, 16)} /> 16</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('17')} id="dateSIP17" onChange={this.handleChange.bind(this, 17)} /> 17</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('18')} id="dateSIP18" onChange={this.handleChange.bind(this, 18)} /> 18</span></td>
                      </tr>
                      <tr>


                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('19')} id="dateSIP19" onChange={this.handleChange.bind(this, 19)} /> 19</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('20')} id="dateSIP20" onChange={this.handleChange.bind(this, 20)} /> 20</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('21')} id="dateSIP21" onChange={this.handleChange.bind(this, 21)} /> 21</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('22')} id="dateSIP22" onChange={this.handleChange.bind(this, 22)} /> 22</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('23')} id="dateSIP23" onChange={this.handleChange.bind(this, 23)} /> 23</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('24')} id="dateSIP24" onChange={this.handleChange.bind(this, 24)} /> 24</span></td>
                      </tr>
                      <tr>


                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('25')} id="dateSIP25" onChange={this.handleChange.bind(this, 25)} /> 25</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('26')} id="dateSIP26" onChange={this.handleChange.bind(this, 26)} /> 26</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('27')} id="dateSIP27" onChange={this.handleChange.bind(this, 27)} /> 27</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('28')} id="dateSIP28" onChange={this.handleChange.bind(this, 28)} /> 28</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('29')} id="dateSIP29" onChange={this.handleChange.bind(this, 29)} /> 29</span></td>
                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('30')} id="dateSIP30" onChange={this.handleChange.bind(this, 30)} /> 30</span></td>
                      </tr>
                      <tr>


                        <td><span className="checkbox_custom"><input disabled={displayyTrading} type="checkbox" checked={showData['date'].split('|').includes('31')} id="dateSIP31" onChange={this.handleChange.bind(this, 31)} /> 31</span></td>

                      </tr>
                    </ tbody>
                  </table>


                </div>


              </div>

              <div className="col-md-12 row">
                <div className="col-md-12">
                  <div className="pull-right">
                    <input type="button" onClick={this.addTradingCycleSIP.bind(this)} className="btn btn-primary" style={{ marginRight: 10, marginTop: 10 }} value={this.props.strings.submit} id="btnSubmit" />
                  </div>
                </div>
              </div>

            </form>
          </div>
        </Modal.Body>

      </Modal>
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

module.exports = decorators(ModalTradingCycleInfoSIP);
