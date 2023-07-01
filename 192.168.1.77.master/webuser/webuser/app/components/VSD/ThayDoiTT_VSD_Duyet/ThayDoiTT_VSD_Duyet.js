import React from 'react';
import DateInput from 'app/utils/input/DateInput'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import {connect} from 'react-redux';


 class ThayDoiTT_VSD_Duyet extends React.Component {
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
      CUSTID_VIEW:-1,
      access:"add",
      datachange: {}
    };
  }

  onChange(type, event) {
      this.state.datachange[type] = event.value;
      this.setState({datachange: this.state.datachange})
    }

  render() {

    return (
        <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

      <div  className="add-info-account">

          <div className="title-content">{this.props.strings.title}</div>
              <div className="col-md-12  module">
          <div className="col-md-12" style={{ paddingTop: "11px" }}>

                                <div className="col-md-12 row">
                                  <div className="col-md-3">
                                  <h5><b>{this.props.strings.custodycd}</b></h5>
                                  </div>
                                  <div className="col-md-3">
                                  <input className="form-control" type="text" placeholder={this.props.strings.custodycd} id="txtcustodycd" />
                                  </div>
                                </div>
                                <div style={{ fontWeight: "bold", paddingBottom: "5px", paddingTop: "5px" ,background:"#ed1c24",color:"white",right:"10px"}} className="col-md-12">
                  {this.props.strings.oldtitle}
                      </div>


                                <div className="col-md-12 row">
                                  <div className="col-md-3">
                                  <h5><b>{this.props.strings.idcode}</b></h5>
                                  </div>
                                  <div className="col-md-3">
                                    <label className="form-control" id="lblIdcode"></label>
                                  </div>
                                </div>
                                <div className="col-md-12 row">
                                  <div className="col-md-3">
                                  <h5><b>{this.props.strings.idplace}</b></h5>
                                  </div>
                                  <div className="col-md-3">
                                <label className="form-control" id="lblIdplace"></label>
                                  </div>
                                </div>
                                <div className="col-md-12 row">
                                  <div className="col-md-3">
                                  <h5><b>{this.props.strings.iddate}</b></h5>
                                  </div>
                                  <div className="col-md-3">
                                  <label className="form-control" id="lblIddate"></label>
                                  </div>
                                </div>
                                <div className="col-md-12 row">
                                  <div className="col-md-3">
                                  <h5><b>{this.props.strings.bankaccno}</b></h5>
                                  </div>
                                  <div className="col-md-3">
                                  <label className="form-control" id="lblBankaccno"></label>
                                  </div>
                                </div>
                                <div className="col-md-12 row">
                                  <div className="col-md-3">
                                  <h5><b>{this.props.strings.bankname}</b></h5>
                                  </div>
                                  <div className="col-md-3">
                                  <label className="form-control" id="lblBankname"></label>
                                  </div>
                                </div>
                                <div className="col-md-12 row">
                                  <div className="col-md-3">
                                  <h5><b>{this.props.strings.branchname}</b></h5>
                                  </div>
                                  <div className="col-md-3">
                                  <label className="form-control" id="lblBranchname"></label>
                                  </div>
                                </div>
                                <div style={{ fontWeight: "bold", paddingBottom: "5px", paddingTop: "5px" ,background:"#ed1c24",color:"white",right:"10px"}} className="col-md-12">
                  {this.props.strings.newtitle}
                      </div>


                      <div className="col-md-12 row">
                        <div className="col-md-3">
                        <h5><b>{this.props.strings.idcode}</b></h5>
                        </div>
                        <div className="col-md-3">
                        <input className="form-control" type="text" placeholder={this.props.strings.idcode} id="txtIdcode"/>
                        </div>
                      </div>

                      <div className="col-md-12 row">
                        <div className="col-md-3">
                        <h5><b>{this.props.strings.idplace}</b></h5>
                        </div>
                        <div className="col-md-3">
                        <input className="form-control" type="text" placeholder={this.props.strings.idplace}  id="txtIdplace"/>
                        </div>
                      </div>
                      <div className="col-md-12 row">
                        <div className="col-md-3">
                        <h5><b>{this.props.strings.iddate}</b></h5>
                        </div>
                        <div className="col-md-3 fixWidthDatePickerForOthers">
                            <DateInput onChange={this.onChange.bind(this)} value={this.state.datachange.IDDATE} type="IDDATE"  id="txtIDDATE" />
                        </div>
                      </div>
                      <div className="col-md-12 row">
                        <div className="col-md-3">
                        <h5><b>{this.props.strings.bankaccno}</b></h5>
                        </div>
                        <div className="col-md-3">
                        <input className="form-control" type="text" placeholder={this.props.strings.bankaccno}  id="txtBankaccno"/>
                        </div>
                      </div>
                      <div className="col-md-12 row">
                        <div className="col-md-3">
                        <h5><b>{this.props.strings.bankname}</b></h5>
                        </div>
                        <div className="col-md-3">
                        <input className="form-control" type="text" placeholder={this.props.strings.bankname}  id="txtBankname"/>
                        </div>
                      </div>
                      <div className="col-md-12 row">
                        <div className="col-md-3">
                        <h5><b>{this.props.strings.branchname}</b></h5>
                        </div>
                        <div className="col-md-3">
                        <input className="form-control" type="text" placeholder={this.props.strings.branchname}  id="txtBranchname"/>
                        </div>
                      </div>
                      <div className="col-md-12 row">
                        <div className="col-md-3">
                        <h5><b>{this.props.strings.upload}</b></h5>
                        </div>
                        <div className="col-md-3">
                        <input className="form-control" type="text" placeholder={this.props.strings.upload}  id="txtUpload"/>
                        </div>
                        <div className="col-md-3">
                        <input type="button"  className="btn btn-primary" style={{fontSize:10}} value="In phiếu"  id="btnUpload"/>
                        </div>
                      </div>
                      <div className="col-md-12 row">
                          <div className="col-md-3">
                            <h5><b>{this.props.strings.desc}</b></h5>
                          </div>
                          <div className="col-md-9">
                            <input className="form-control" type="text" placeholder={this.props.strings.desc}  id="txtDesc"/>
                          </div>
                      </div>
                                <div className="col-md-12 row">
                                  <div className="pull-right">
                                  <input type="button"  className="btn btn-primary" style={{marginLeft:0,marginRight:5}} value="Chấp nhận"  id="btnSubmit"/>
                                    <input type="button"  className="btn btn-dark" style={{marginRight:15}} value="Thoát"  id="btnClose"/>
                                  </div>
                                </div>
                            </div>


                            </div>
                          </div>

    </div>

    )
  }
}
ThayDoiTT_VSD_Duyet.defaultProps = {

  strings: {
    title:'Thay đổi thông tin tài khoản'

  },


};
const stateToProps = state => ({

});


const decorators = flow([
  connect(stateToProps),
  translate('ThayDoiTT_VSD_Duyet')
]);

module.exports = decorators(ThayDoiTT_VSD_Duyet);
