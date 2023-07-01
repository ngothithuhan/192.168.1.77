import React from 'react';
import { Route, Link } from 'react-router-dom'
import DropdownFactory from 'app/utils/DropdownFactory'
import DateInput from 'app/utils/input/DateInput'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux';
import Select from 'react-select';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import RestfulUtils from "app/utils/RestfulUtils";

class ThayDoiTTDKGoiDauTuDK extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: {
        general: true,
        authorize: true,
        fatca: false
      },
      showModalDetail: false,
      titleModal: 'Taọ tài khoản',
      CUSTID_VIEW: -1,
      access: "add",
      datachange: {},
      CUSTODYCD: { value: '', label: '' },
      sotienbandau: { value: 123456789, validate: null, tooltip: "Không được để trống !!" },
      sotiendonggop: { value: 1000000, validate: null, tooltip: "Không được để trống !!" },

      selectedOption: '',
      selectedOption1: '',

    };
  }

  onChange(type, event) {
    this.state.datachange[type] = event.value;
    this.setState({ datachange: this.state.datachange })
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
  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Selected: ${selectedOption.label}`);
  }
  handleChange1 = (selectedOption1) => {
    this.setState({ selectedOption1 });

  }
  onValueChange(type, data) {
    console.log('valueChange', type, data)
    this.state[type].value = data.value
    this.setState(this.state)
  }
  render() {
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;
    const { selectedOption1 } = this.state;
    const value1 = selectedOption1 && selectedOption1.value;
    return (
      <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

        <div className="add-info-account">

          <div className="title-content">{this.props.strings.title}</div>
          <div className="col-md-12  ">
            <div className="col-md-12" style={{ paddingTop: "11px" }}>

              <div className="col-md-12 row">
                <div className="col-md-3">
                  <h5><b>{this.props.strings.custodycd}</b></h5>
                </div>
                <div className="col-md-3">
                  <div className="col-md-12 customSelect" style={{ right: 20, width: '110%' }}>
                    <Select.Async
                      name="form-field-name"
                      placeholder="Nhập Mã tham chiếu NSD..."
                      loadOptions={this.getOptions.bind(this)}
                      value={this.state.CUSTODYCD}
                      onChange={this.onChangecb.bind(this)}
                      id="drdCustodycd"
                    />
                  </div>
                </div>

              </div>



              <div className="col-md-12 row">
                <div className="col-md-3">
                  <h5><b>{this.props.strings.vfmcode}</b></h5>
                </div>
                <div className="col-md-3">
                  <div className="col-md-12 customSelect" style={{ right: 20, width: '110%' }}>
                    <Select
                      placeholder="Trạng thái..."
                      name="form-field-name"
                      value='VFMVF1'
                      onChange={this.handleChange}
                      options={[
                        { value: 'VFMVF1', label: 'VFMVF1' },

                      ]}
                      id="drdVfmcode"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 row">
                <div className="col-md-3">
                  <h5><b>{this.props.strings.ischangesip}</b></h5>
                </div>
                <div className="col-md-3">
                  <div className="col-md-12 customSelect" style={{ right: 20, width: '110%' }}>
                    <Select
                      placeholder="Có cho phép thay đổi..."
                      name="form-field-name"
                      value={value1}
                      onChange={this.handleChange1}
                      options={[
                        { value: 'yes', label: 'Có' },
                        { value: 'no', label: 'Không' },
                      ]}
                      id="drdIschangesip"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12 row">
                <div className="col-md-3">
                  <h5><b>{this.props.strings.originalmoney}</b></h5>
                </div>
                <div className="col-md-3">
                  <NumberFormat className="form-control" id="txtOriginalmoney" onValueChange={this.onValueChange.bind(this, 'sotienbandau')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.originalmoney} value={this.state.sotienbandau.value} />
                </div>
              </div>
              <div className="col-md-12 row">
                <div className="col-md-3">
                  <h5><b>{this.props.strings.contributemoney}</b></h5>
                </div>
                <div className="col-md-3">
                  <NumberFormat className="form-control" id="txtContributemoney" onValueChange={this.onValueChange.bind(this, 'sotiendonggop')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.contributemoney} value={this.state.sotiendonggop.value} />
                </div>
              </div>
              <div className="col-md-12 row">
                <div className="col-md-3">
                  <h5><b>{this.props.strings.desc}</b></h5>
                </div>
                <div className="col-md-9">
                  <input className="form-control" id="txtDesc" type="text" placeholder={this.props.strings.desc} />
                </div>
              </div>

              <div className="col-md-12 row">
                <div className="pull-right">
                  <input type="button" className="btn btn-primary" style={{ marginLeft: 0, marginRight: 5 }} value="Chấp nhận" id="btnSubmit" />
                  <input type="button" className="btn btn-dark" style={{ marginRight: 15 }} value="Thoát" id="btnClose" />
                </div>
              </div>
            </div>


          </div>
        </div>

      </div>

    )
  }
}
ThayDoiTTDKGoiDauTuDK.defaultProps = {

  strings: {
    title: 'Thay đổi thông tin đăng ký gói đầu tư định kỳ'

  },


};
const stateToProps = state => ({

});


const decorators = flow([
  connect(stateToProps),
  translate('ThayDoiTTDKGoiDauTuDK')
]);

module.exports = decorators(ThayDoiTTDKGoiDauTuDK);
