import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import NumberInput from 'app/utils/input/NumberInput'

class TableTradingCycleInfoSIP extends Component {
       constructor(props) {
              super(props);
              this.state = {
                     data: [],
                     dataTest: [],
                     pages: null,
                     loading: true,
                     checkedAll: false,
                     checkboxChecked: false,
                     selectedRows: new Set(),
                     unSelectedRows: [],
                     pagesize: 4,
                     keySearch: {},
                     sortSearch: {},
                     page: 1,
              }
       }
       handleAdd(evt) {
              var that = this;
              that.props.showModalDetail("add");
       }
       handlEdit(CUSTID) {
              var that = this;
              that.props.showModalDetail("update", CUSTID);
       }
       onRowClick(state, rowInfo, column, instance) {
              var that = this;
              return {
                     onDoubleClick: e => {
                            that.props.showModalDetail("view", rowInfo.original)
                     },
                     style: {
                            background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTID) ? '#dbe1ec' : '',
                            color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTID) ? 'black' : '',
                     }
              }
       }
       fetchData(state, instance) {
              // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
              // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
              var that = this;
              // Request the data however you want.  Here, we'll use our mocked service we created earlier
              if (this.state.loading) {
                     let { pageSize, page, filtered, sorted } = state;
                     this.loadData(pageSize, page + 1, filtered, sorted);
              }
              this.setState({ loading: true })
       }
       add() {
              // sp SIP co dinh chi duoc them 1 chu ki GD SIP
              if (this.props.ProductInfo['p_methods'] === 'FLX' && this.props.data.length >= 1) {
                     toast.error(this.props.strings.notitradingCycle, { position: toast.POSITION.BOTTOM_RIGHT });
              } else {
                     this.props.showModalDetail("add");
              }
       }
       edit(record) {
              var that = this;
              that.props.showModalDetail("update", record);
       }
       delete(data) {
              let result = this.state.dataTest.filter(node => node.id != data);
              this.props.loadagain(result)
              this.setState({
                     dataTest: result
              })
       }
       componentWillReceiveProps(nextProps) {
              this.setState({ dataTest: nextProps.data })
       }
       componentWillMount() {
              this.setState({ dataTest: this.props.data })
       }
       render() {
              const { dataTest } = this.state;
              var that = this;
              return (
                     <div>
                            <div className="col-md-12" style={{ marginLeft: 20 }}>
                                   <div className="container panel panel-success" style={{ width: "94%", padding: 40, float: "left", paddingTop: 10, paddingBottom: 10 }}>
                                          <ReactTable
                                                 columns={[
                                                        {
                                                               Header: props => <div className=" header-react-table"><span className="fas fa-plus-circle" style={{ color: "#ed1c24" }} onClick={this.add.bind(this)}></span></div>,
                                                               maxWidth: 70,
                                                               sortable: false,
                                                               style: { textAlign: 'center' },
                                                               Cell: (row) => (
                                                                      <div>
                                                                             <span onClick={that.edit.bind(that, row.original)} className="glyphicon glyphicon-pencil" id={'pencil' + row.original.id}></span>
                                                                             <span className="far fa-trash-alt" style={{ marginLeft: 10 }} onClick={this.delete.bind(that, row.original.id)} id={'trash' + row.original.id}></span>
                                                                      </div>
                                                               ),
                                                               Filter: ({ filter, onChange }) => null
                                                        },
                                                        {
                                                               Header: props => <div className="wordwrap">{this.props.strings.transactionperiod}</div>,
                                                               id: "transactionperiod",
                                                               accessor: "transactionperiod",
                                                               width: 100,
                                                               Cell: ({ value }) => (
                                                                      <div className="col-left" style={{ float: "left" }} id={"lb" + value}>{value}</div>
                                                               )
                                                        },
                                                        {
                                                               Header: props => <div className="wordwrap">{this.props.strings.periodcode}</div>,
                                                               id: "periodcode",
                                                               accessor: "periodcode",
                                                               width: 100,
                                                               Cell: ({ value }) => (
                                                                      <div className="col-left" style={{ float: "left" }} id={"lb" + value}>{value}</div>
                                                               )
                                                        },
                                                        {
                                                               Header: props => <div className="wordwrap">{this.props.strings.minBuyValue}</div>,
                                                               id: "minamt",
                                                               accessor: "minamt",
                                                               width: 130,
                                                               Cell: ({ value }) => (
                                                                      <NumberInput value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={''} />
                                                               )
                                                        },
                                                        {
                                                               Header: props => <div className="wordwrap">{this.props.strings.maxBuyValue}</div>,
                                                               id: "maxamt",
                                                               accessor: "maxamt",
                                                               width: 130,
                                                               Cell: ({ value }) => (
                                                                      <NumberInput value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={''} />
                                                               )
                                                        },
                                                        {
                                                               Header: props => <div className="wordwrap">{this.props.strings.minTerm}</div>,
                                                               id: "minterm",
                                                               accessor: "minterm",
                                                               width: 120,
                                                               Cell: ({ value }) => (
                                                                      <NumberInput value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={''} />
                                                               )
                                                        },
                                                        {
                                                               Header: props => <div className="wordwrap">{this.props.strings.maxTermbreak}</div>,
                                                               id: "maxtermbreak",
                                                               accessor: "maxtermbreak",
                                                               width: 120,
                                                               Cell: ({ value }) => (
                                                                      <NumberInput value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={''} />
                                                               )
                                                        },
                                                        {
                                                               Header: props => <div className="wordwrap">{this.props.strings.detail}</div>,
                                                               id: "fee",
                                                               accessor: "fee",
                                                               Cell: (row) => {
                                                                      let record = row.original;
                                                                      let value = '';
                                                                      switch (record.transactionperiod) {
                                                                             case 'D':
                                                                                    break;
                                                                             case 'W':
                                                                                    value = this.props.strings.dayofweek + record.day.split('|').slice(0, -1); // bỏ dấu , ở cuối
                                                                                    break;
                                                                             case 'M':
                                                                                    value = this.props.strings.dayofmonth + record.date.split('|').slice(0, -1);
                                                                                    break;
                                                                             case 'Q':
                                                                                    value = this.props.strings.monthofquater + record.month.split('|').slice(0, -1) 
                                                                                           + '; ' + this.props.strings.dayofmonth + record.date.split('|').slice(0, -1);
                                                                                    break;
                                                                             default:
                                                                                    break;
                                                                      }
                                                                      return (
                                                                             <div className="col-left" style={{ float: "left" }} id={"lb" + value}>{value}</div>
                                                                      )
                                                               }
                                                        },
                                                 ]}
                                                 getTheadTrProps={() => {
                                                        return {
                                                               className: 'head'
                                                        }
                                                 }}
                                                 manual
                                                 filterable={false}
                                                 data={dataTest}
                                                 style={{
                                                        maxHeight: "300px" // This will force the table body to overflow and scroll, since there is not enough room
                                                 }}
                                                 noDataText={this.props.strings.textNodata}
                                                 pageText={this.props.strings.pageText}
                                                 rowsText={this.props.strings.rowsText}
                                                 previousText={<i className="fas fa-backward"></i>}
                                                 nextText={<i className="fas fa-forward"></i>}
                                                 loadingText="Đang tải..."
                                                 ofText="/"
                                                 getTrProps={this.onRowClick.bind(this)}
                                                 defaultPageSize={this.state.pagesize}
                                                 className="-striped -highlight"
                                                 showPagination={false}
                                          />
                                   </div>
                            </div>
                     </div>
              );
       }
}

const stateToProps = state => ({
       veryfiCaptcha: state.veryfiCaptcha,
       notification: state.notification
});


const decorators = flow([
       connect(stateToProps),
       translate('TableTradingCycleInfoSIP')
]);

module.exports = decorators(TableTradingCycleInfoSIP);
