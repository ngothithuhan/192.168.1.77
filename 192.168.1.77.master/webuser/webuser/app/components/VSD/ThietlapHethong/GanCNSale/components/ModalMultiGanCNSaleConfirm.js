import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import ReactTable from "react-table";
import Select from 'react-select';
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { showNotifi } from 'app/action/actionNotification.js';
import NumberInput from 'app/utils/input/NumberInput';

class ModalMultiGanCNSaleConfirm extends Component {
       constructor(props) {
              super(props);
              this.state = {
                     newbrokerageid: { value: '', label: '', text: '' },
                     TYPE: [],
                     detailTypes: [],
                     type: { value: '', label: '' },
                     datagroup: {
                            p_saleid: '',
                            p_retype: '',
                            p_language: this.props.lang,
                            pv_objname: this.props.OBJNAME,
                     },
                     label_rerole: '',
                     label_reproduct: '',
                     checkFields: [
                            { name: "p_saleid", id: "txtnewbrokerageid" },
                            { name: "p_retype", id: "txttype" },
                     ],

              };
       }

       onReset = () => {
              this.setState({
                     newbrokerageid: { value: '', label: '', text: '' },
                     TYPE: [],
                     detailTypes: [],
                     type: { value: '', label: '' },
                     datagroup: {
                            p_saleid: '',
                            p_retype: '',
                            p_language: this.props.lang,
                            pv_objname: this.props.OBJNAME,
                     },
                     label_rerole: '',
                     label_reproduct: '',
              })
       }

       close() {
              this.props.closeModalMultiConfirm();
              this.onReset();
       }
       componentWillReceiveProps(nextProps) {
              let self = this;
       }

       onChangecb(e) {
              if (e === null) {
                     this.state.datagroup["p_saleid"] = '';
                     this.state.datagroup["p_retype"] = '';
                     this.setState({
                            newbrokerageid: { value: '', label: '', text: '' },
                            datagroup: this.state.datagroup,
                            TYPE: [],
                            label_reproduct: '',
                            label_rerole: '',
                     })
              } else {
                     if (this.state.datagroup["p_saleid"] != e.value) {
                            this.state.datagroup["p_saleid"] = e.value;
                            this.state.datagroup["p_retype"] = '';
                            this.getOptionsTypes(e.value);
                            this.setState({
                                   newbrokerageid: e,
                                   datagroup: this.state.datagroup,
                                   type: null,
                                   label_reproduct: '',
                                   label_rerole: '',
                            })
                     }
              }
       }
       onChangecbtype(e) {
              const { detailTypes } = this.state;
              if (e === null) {
                     this.state.datagroup["p_retype"] = '';
                     this.setState({
                            type: { value: '', label: '' },
                            label_rerole: '',
                            label_reproduct: '',
                            datagroup: this.state.datagroup
                     })
              }
              else {
                     this.state.datagroup["p_retype"] = e.value;
                     if (detailTypes && detailTypes.length > 0) {
                            for (let i = 0; i < detailTypes.length; i++) {
                                   if (detailTypes[i].AUTOID === e.value) {
                                          this.setState({
                                                 type: e,
                                                 label_rerole: detailTypes[i].REROLEDESC,
                                                 label_reproduct: detailTypes[i].REPRODUCTDESC,
                                                 datagroup: this.state.datagroup,
                                          })
                                          break;
                                   }
                            }
                     }
              }
       }
       getOptions(input) {
              return RestfulUtils.post('/fund/getlistsale_roles_alt', { p_saleid: 'ALL', p_language: this.props.lang })
                     .then((res) => {
                            return { options: res };
                     })
       }
       async getOptionsTypes(saleid) {
              await RestfulUtils.post('/user/getretypebysaleidalt', { saleid: saleid, language: this.props.lang })
                     .then((res) => {
                            this.setState({
                                   TYPE: res.result,
                                   detailTypes: res.resultdata,
                            })
                     })
       }
       checkValid(name, id) {
              let value = this.state.datagroup[name];
              let mssgerr = '';
              switch (name) {
                     case "p_saleid":
                            if (value == '') mssgerr = this.props.strings.requiredsaleid;
                            break;
                     case "p_retype":
                            if (value == '') mssgerr = this.props.strings.requiredretype;
                            break;
                     default:
                            break;
              }
              if (mssgerr !== '') {
                     var { dispatch } = this.props;
                     dispatch(showNotifi({ type: "error", header: "", content: mssgerr }));
                     window.$(`#${id}`).focus();
              }
              return mssgerr;
       }
       checkRetype = (data) => {
              let isValidRetype = true;
              let arrOrderIdErr = []
              data.forEach(item => {
                     if (item["SALEID"] == this.state.datagroup["p_saleid"] && item['RETYPE'] == this.state.datagroup["p_retype"]) {
                            arrOrderIdErr.push(item["ORDERID"]);
                     }
              });
              if (arrOrderIdErr.length > 0) {
                     isValidRetype = false;
                     toast.error(this.props.strings.error1 + " (" + this.props.strings.orderid + ': ' + arrOrderIdErr.toString(), { position: toast.POSITION.BOTTOM_RIGHT });
              }
              return isValidRetype;
       }
       async submitGroup() {
              var mssgerr = '';
              var { dataConfirmModal } = this.props;
              for (let index = 0; index < this.state.checkFields.length; index++) {
                     const element = this.state.checkFields[index];
                     mssgerr = this.checkValid(element.name, element.id);
                     if (mssgerr !== '')
                            break;
              }
              if (mssgerr == '') {
                     if (dataConfirmModal && dataConfirmModal.length > 0) {
                            let isValidRetype = this.checkRetype(dataConfirmModal);
                            if (isValidRetype) {
                                   let orderidArr = '';
                                   let notiInfo = '';
                                   let orderItems = '';
                                   dataConfirmModal.forEach(item => {
                                          orderItems += item["ORDERID"] + ',';
                                          orderidArr += item['ORDERID'] + '~#~';                                        
                                   });
                                   notiInfo = " (" + this.props.strings.orderid + ": " + orderItems + ")";
                                   let dataBody = {
                                          p_orderid: orderidArr,
                                          p_retype: this.state.datagroup.p_retype,
                                          p_saleid: this.state.datagroup.p_saleid,
                                          p_language: this.state.datagroup.p_language,
                                          pv_objname: this.state.datagroup.pv_objname,
                                   }
                                   RestfulUtils.posttrans('/fund/prc_sale_ordersmap', dataBody)
                                          .then((res) => {
                                                 if (res.EC == 0) {
                                                        toast.success(this.props.strings.success + notiInfo, { position: toast.POSITION.BOTTOM_RIGHT });
                                                        this.props.load();
                                                        this.close();
                                                 } else {
                                                        toast.error(res.EM + notiInfo, { position: toast.POSITION.BOTTOM_RIGHT });
                                                 }
                                          });
                            }
                     }
              }
       }
       render() {
              let dataLength = this.props.dataConfirmModal.length;
              return (
                     <Modal className="modal-multi-gan-cn-sale-confirm" bsSize="lg" dialogClassName="custom-modal" show={this.props.showModalMultiConfirm}>
                            <Modal.Header>
                                   <Modal.Title ><div className="title-content col-md-6">{this.props.strings.modalmulticonfirmtitle} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                            </Modal.Header>
                            <Modal.Body style={{ height: "100%" }}>
                                   <div className="panel-body">
                                          <div className="add-info-account" style={{ padding: '0px 12px' }}>
                                                 <div className={"col-md-12"} style={{ paddingTop: "11px" }}>
                                                        <div className="col-md-6 row">
                                                               <div className="col-md-5"><h5 className="highlight"><b>{this.props.strings.newbrokerageid}</b></h5></div>
                                                               <div className="col-md-7 customSelect">
                                                                      <Select.Async
                                                                             name="form-field-name"
                                                                             loadOptions={this.getOptions.bind(this)}
                                                                             value={this.state.newbrokerageid}
                                                                             onChange={this.onChangecb.bind(this)}
                                                                             id="txtnewbrokerageid"
                                                                             placeholder={this.props.strings.newbrokerageid}
                                                                             backspaceRemoves={false}
                                                                      />
                                                               </div>
                                                        </div>

                                                        <div className="col-md-6 row">
                                                               <div className="col-md-5" ><h5><b>{this.props.strings.newrole}</b></h5></div>
                                                               <div className="col-md-7">
                                                                      <label className="form-control" id="txtnewrole">{this.state.label_rerole}</label>
                                                               </div>
                                                        </div>

                                                        <div className="col-md-6 row">
                                                               <div className="col-md-5" ><h5 className="highlight"><b>{this.props.strings.newtype}</b></h5></div>
                                                               <div className="col-md-7 customSelect" >
                                                                      <Select
                                                                             name="form-field-name"
                                                                             options={this.state.TYPE}
                                                                             value={this.state.type}
                                                                             onChange={this.onChangecbtype.bind(this)}
                                                                             id="txttype"
                                                                             placeholder={this.props.strings.newtype}
                                                                             backspaceRemoves={false}
                                                                      />
                                                               </div>
                                                        </div>

                                                        <div className="col-md-6 row">
                                                               <div className="col-md-5"><h5><b>{this.props.strings.newproductype}</b></h5></div>
                                                               <div className="col-md-7">
                                                                      <label className="form-control" id="txtrole">{this.state.label_reproduct}</label>
                                                               </div>
                                                        </div>

                                                        <div className="col-md-12">
                                                               <ReactTable
                                                                      columns={[
                                                                             {
                                                                                    Header: props => <div className="wordwrap">{this.props.strings.oderdate}</div>,
                                                                                    id: "TXDATE",
                                                                                    accessor: "TXDATE",
                                                                                    width: 80,
                                                                                    Cell: ({ value }) => (
                                                                                           <div className="col-left" style={{ float: "left" }}>{value}</div>
                                                                                    )
                                                                             },
                                                                             {
                                                                                    Header: props => <div className="wordwrap">{this.props.strings.custodycd}</div>,
                                                                                    id: "CUSTODYCD",
                                                                                    accessor: "CUSTODYCD",
                                                                                    width: 108,
                                                                                    Cell: ({ value }) => (
                                                                                           <div className="text-center" style={{ float: "center" }}>{value}</div>
                                                                                    )
                                                                             },
                                                                             {
                                                                                    Header: props => <div className="wordwrap">{this.props.strings.orderid}</div>,
                                                                                    id: "ORDERID",
                                                                                    accessor: "ORDERID",
                                                                                    width: 122,
                                                                                    Cell: ({ value }) => (
                                                                                           <div className="col-left">{value}</div>
                                                                                    )
                                                                             },
                                                                             {
                                                                                    Header: props => <div className="wordwrap">{this.props.strings.fullname}</div>,
                                                                                    id: "FULLNAME",
                                                                                    accessor: "FULLNAME",
                                                                                    width: 200,
                                                                                    Cell: ({ value }) => (
                                                                                           <div className="col-left">{value}</div>
                                                                                    )
                                                                             },
                                                                             {
                                                                                    Header: props => <div className="wordwrap">{this.props.strings.ordertype}</div>,
                                                                                    id: "SRTYPEDESC",
                                                                                    accessor: "SRTYPEDESC",
                                                                                    width: 200,
                                                                                    Cell: ({ value }) => (
                                                                                           <div className="col-left">{value}</div>
                                                                                    )
                                                                             },
                                                                             {
                                                                                    Header: props => <div className="wordwrap">{this.props.strings.value}</div>,
                                                                                    id: "ORDERAMT",
                                                                                    accessor: "ORDERAMT",
                                                                                    width: 98,
                                                                                    Cell: ({ value }) => (
                                                                                           <div className="col-right">
                                                                                                  <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                                                                           </div>
                                                                                    )
                                                                             },
                                                                             {
                                                                                    Header: props => <div className="wordwrap">{this.props.strings.transactionfee}</div>,
                                                                                    id: "FEEAMT",
                                                                                    accessor: "FEEAMT",
                                                                                    width: 84,
                                                                                    Cell: ({ value }) => (
                                                                                           <div className="col-right">
                                                                                                  <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                                                                           </div>

                                                                                    )
                                                                             },
                                                                             {
                                                                                    Header: props => <div className="wordwrap">{this.props.strings.tax}</div>,
                                                                                    id: "TAXAMT",
                                                                                    accessor: "TAXAMT",
                                                                                    width: 84,
                                                                                    Cell: ({ value }) => (
                                                                                           <div className="col-right">
                                                                                                  <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                                                                           </div>

                                                                                    )
                                                                             },
                                                                             {
                                                                                    Header: props => <div className="wordwrap">{this.props.strings.managementfee}</div>,
                                                                                    id: "FEEMANAGE",
                                                                                    accessor: "FEEMANAGE",
                                                                                    width: 98,
                                                                                    Cell: ({ value }) => (
                                                                                           <div className="col-right">
                                                                                                  <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                                                                           </div>
                                                                                    )
                                                                             },
                                                                             {
                                                                                    Header: props => <div className="wordwrap">{this.props.strings.oldbrokerageid}</div>,
                                                                                    id: "TLNAME",
                                                                                    accessor: "TLNAME",
                                                                                    width: 217,
                                                                                    Cell: ({ value }) => (
                                                                                           <div className="col-left">{value}</div>
                                                                                    )
                                                                             },
                                                                             {
                                                                                    Header: props => <div className="wordwrap">{this.props.strings.oldbrokeragetype}</div>,
                                                                                    id: "TYPENAME",
                                                                                    accessor: "TYPENAME",
                                                                                    width: 217,
                                                                                    Cell: ({ value }) => (
                                                                                           <div className="col-left">{value}</div>
                                                                                    )
                                                                             },
                                                                             {
                                                                                    Header: props => <div className="wordwrap">{this.props.strings.role}</div>,
                                                                                    id: "REROLEDESC",
                                                                                    accessor: "REROLEDESC",
                                                                                    width: 217,
                                                                                    Cell: ({ value }) => (
                                                                                           <div className="col-left">{value}</div>
                                                                                    )
                                                                             },
                                                                             {
                                                                                    Header: props => <div className="wordwrap">{this.props.strings.productype}</div>,
                                                                                    id: "REPRODUCTDESC",
                                                                                    accessor: "REPRODUCTDESC",
                                                                                    width: 217,
                                                                                    Cell: ({ value }) => (
                                                                                           <div className="col-left">{value}</div>
                                                                                    )
                                                                             },
                                                                      ]}

                                                                      getTheadTrProps={() => {
                                                                             return {
                                                                                    className: 'head'
                                                                             }
                                                                      }}

                                                                      manual
                                                                      filterable={false}
                                                                      showPagination={false}
                                                                      data={this.props.dataConfirmModal}
                                                                      defaultPageSize={dataLength < 5 ? 5 : dataLength}
                                                                      style={{
                                                                             maxHeight: "300px", // This will force the table body to overflow and scroll, since there is not enough room
                                                                             marginTop: 10,
                                                                      }}
                                                                      ofText="/"
                                                                      className="-striped -highlight"
                                                               />
                                                        </div>

                                                        <div className="col-md-12 row">
                                                               <div className="pull-right">
                                                                      <input type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
                                                               </div>
                                                        </div>
                                                 </div>

                                          </div>
                                   </div>
                            </Modal.Body>
                     </Modal>
              );
       }
}
const stateToProps = state => ({
       lang: state.language.language
});
const decorators = flow([
       connect(stateToProps),
       translate('ModalDetailGanCNSale_info')
]);
module.exports = decorators(ModalMultiGanCNSaleConfirm);
