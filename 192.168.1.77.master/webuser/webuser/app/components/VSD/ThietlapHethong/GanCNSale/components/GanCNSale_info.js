import React from 'react';
import {connect} from 'react-redux';
import DropdownFactory from 'app/utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';
import NumberFormat from 'react-number-format';
import Select from 'react-select';
import axios from 'axios';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from "app/utils/RestfulUtils";
class GanCNSale_info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AMOUNT: { value: 0, validate: null, tooltip: "Không được để trống !!" },
      AccHold: { value: 0, validate: null, tooltip: "Không được để trống !!" },

   CUSTODYCD: { value: '', label: '' },
    datachange: {}

    }
  }
  onValueChange(type, data) {
    console.log('valueChange', type, data)
    this.state[type].value = data.value
    this.setState(this.state)
  }
  onChange(type, event) {
      this.state.datachange[type] = event.value;
      this.setState({datachange: this.state.datachange})
    }

    onChangecb(e) {
      // console.log(e)
      if (e === null) e = { value: '', label: '' }
      this.setState({
        CUSTODYCD: e
      })
    }
 getOptions(input) {
   return RestfulUtils.post('/account/search_all', { key: input })
     .then((res) => {
       // console.log(res.data);
       return { options: res.data }
     })
 }
  render(){

    const { onSubmit } = this.props;

    return(
      <div>

      <div className="col-md-12" style={{ paddingTop: "11px" }}>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5 ><b>{this.props.strings.oderdate}</b></h5>
                                </div>
                                <div className="col-md-3">
                              <label className="form-control" id="lblOderdate">21/03/2018</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5 ><b>{this.props.strings.custodycd}</b></h5>
                                </div>
                                <div className="col-md-3">
                                  <label className="form-control" id="lblCustodycd">009F111125</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5 ><b>{this.props.strings.orderid}</b></h5>
                                </div>
                                <div className="col-md-3">
                                  <label className="form-control" id="lblOrderid">VFMX0001</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5 ><b>{this.props.strings.fullname}</b></h5>
                                </div>
                                <div className="col-md-9">
                            <label className="form-control" id="lblFullname">Sơn Tùng</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5><b>{this.props.strings.ordertype}</b></h5>
                                </div>
                                <div className="col-md-3">
                                <label className="form-control" id="lblOrdertype">SIP</label>

                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5><b>{this.props.strings.value}</b></h5>
                                </div>
                                <div className="col-md-3">
                                <label className="form-control" id="lblValue">320.000</label>

                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5><b>{this.props.strings.transactionfee}</b></h5>
                                </div>
                                <div className="col-md-3">
                                <label className="form-control" id="lblTransactionfee">10.000</label>

                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5><b>{this.props.strings.tax}</b></h5>
                                </div>
                                <div className="col-md-3">
                                <label className="form-control" id="lblTax">10</label>

                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5><b>{this.props.strings.transactionfee}</b></h5>
                                </div>
                                <div className="col-md-3">
                                <label className="form-control" id="lblTransactionfee">20.000</label>

                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5><b>{this.props.strings.oldbrokerageid}</b></h5>
                                </div>
                                <div className="col-md-3">
                                <label className="form-control" id="lblOldbrokerageid">123456789</label>

                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5><b>{this.props.strings.oldbrokeragename}</b></h5>
                                </div>
                                <div className="col-md-9">
                                <label className="form-control" id="lblOldbrokeragename">Nguyễn Văn B</label>

                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5><b>{this.props.strings.newbrokerageid}</b></h5>
                                </div>
                                <div className="col-md-3 customSelect">
                                  <Select
                                     name="form-field-name"
                                     value='1234'
                                     onChange={this.handleChange}
                                     options={[
                                       { value: '1234', label: 'MG002' },
                                     ]}
                                     id="drdNewbrokerageid"
                                   />

                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5><b>{this.props.strings.newbrokeragename}</b></h5>
                                </div>
                                <div className="col-md-9">
                                <label className="form-control" id="lblNewbrokeragename">Nguyễn Tùng Sơn</label>
                                </div>
                            </div>


                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5><b>{this.props.strings.desc}</b></h5>
                                </div>
                                <div className="col-md-9">
                                <input className="form-control" type="text" placeholder={this.props.strings.desc} id="txtDesc"/>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                              <div className="pull-right">
                                <input type="button" onClick={onSubmit} className="btn btn-primary" style={{marginRight:15}} value="Chấp nhận" id="btnSubmit"/>

                              </div>
                            </div>
                        </div>
          </div>
    )
  }
}

const stateToProps = state => ({

});
const decorators = flow([
  connect(stateToProps),
  translate('GanCNSale_info')
]);
module.exports = decorators(GanCNSale_info);
