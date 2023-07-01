import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'

class TableAddDBCode extends Component {
       constructor(props) {
              super(props);
              this.state = {
                     data: [],
                     dataTest: [],
                     pagesize: 4,
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
              }
       }
       add() {
              this.props.showModalDetail("add");
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
                                                        },
                                                        {
                                                               Header: props => <div className="wordwrap">{this.props.strings.dbcode}</div>,
                                                               id: "value",
                                                               accessor: "value",
                                                               width: 200,
                                                               Cell: ({ value }) => (
                                                                      <div className="col-left" style={{ float: "left" }} id={"lb" + value}>{value}</div>
                                                               )
                                                        },
                                                        {
                                                               Header: props => <div className="wordwrap">{this.props.strings.dbcodename}</div>,
                                                               id: "label",
                                                               accessor: "label",
                                                               Cell: ({ value }) => (
                                                                      <div className="col-left" style={{ float: "left" }} id={"lb" + value}>{value}</div>
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
       translate('TableAddDBCode')
]);

module.exports = decorators(TableAddDBCode);
