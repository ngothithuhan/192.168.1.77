import React, { Children } from 'react'
import RestfulUtils from 'app/utils/RestfulUtils'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import { toast } from 'react-toastify';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux'

class TableHDSIP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [

      ],

    }
  }



  log(row) {
    // console.log('row',row)
  }
  componentWillReceiveProps(nextProps) {
    let { keySearch } = nextProps

    this.search(keySearch);
    //  this.props.refreshSearch();

  }
  search(keySearch) {
    let self = this
    RestfulUtils.post('/srreconcile/getListSrreconcile', keySearch)
      .then(resData => {
        if (resData.EC == 0) {
          self.setState({ data: resData.DT })
        }
        else {
          toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT })

        }
      })
  }
  componentDidMount() {
    let self = this;
    console.time('/srreconcile/getListSrreconcile');
    RestfulUtils.post('/srreconcile/getListSrreconcile', {}).then((resdata) => {
      if (resdata.EC == 0)
        self.setState({ data: resdata.DT })
      else {
        toast.error(resdata.EM, { position: toast.POSITION.BOTTOM_RIGHT })
      }
    })
    console.timeEnd('/srreconcile/getListSrreconcile');
    /*
 chú thích    48+10*2+2+20+36+15*2+2+34

 48 : paddingtop của class jumbotron
 10*2 : 10 là padding của div ngay sau thẻ div có class jumbotron do có 2 chiều top bottom nên x2
 2 : border thẻ div ngay sau thẻ div có class jumbotron (border 1px nhưng có 2 chiều nên x2)
 20 : marginbottom của thẻ div div ngay sau thẻ div có class jumbotron
 36 : height thẻ div có class title-content
 10 : padding của thẻ div có class là panel-body do có 2 chiều nên x2
 -10 : marginBottom cua the div tren
 2 : border thẻ div có class là panel-body (border 1px nhưng có 2 chiều nên x2)
 10: padding thẻ div có class col-md-12  chưa các buttonsystem
 36 : height thẻ div có class col-md-12  chưa các buttonsystem


 */
    //  let maxHeightTable = this.props.styleWeb.height_window - (48+10*2+2 +20 +36 +10*2 +10*2 -10 +2 +10*2+36)
    //  this.setState({maxHeightTable})
  }
  onRowClick(state, rowInfo, column, instance) {
    let self = this;
    //  console.log('rowinfo',this.refs["LASTORDERID"].value)
    // if(rowInfo!=undefined&& rowInfo.original!=undefined &&rowInfo.original.ORDERID !=this.state.LASTORDERID){
    //    console.log(rowInfo.original.ORDERID)
    //    this.setState({LASTORDERID:rowInfo.original.ORDERID})
    //  // this.refs.LASTORDERID.value = row.original.ORDERID

    // }

    return {
      onDoubleClick: e => {
        // console.log('A Td Element was clicked!')
        // console.log('it produced this event:', e)
        // console.log('It was in this column:', column)
        // console.log('It was in this table instance:', instance)
        console.log(rowInfo)
        if (rowInfo.original != undefined) {
          let dataClick = self.state.data.filter(e => e.ORDERID === rowInfo.original.ORDERID);
          self.props.showPopupThongTinMonNop(dataClick);
        }
        // that.props.showModalDetail("view", rowInfo.row.CUSTID)
      },

      style: {
        background: rowInfo == undefined ? '' : rowInfo.original == undefined ? '' : rowInfo.original.background
        // color:rowInfo==undefined?'': that.state.selectedRows.has(rowInfo.original.CUSTID)?'black':'',
      }
    }
  }

  render() {
    let data = this.state.data
    let LASTORDERID = ''
    let that = this;
    // console.log('res commpareXXXX',this.state.data);

    return (

      <div className="inner">
        <div className="col-md-12 customize-react-table " >
          <ReactTable
            data={data}


            columns={[
              {



                Header: this.props.strings.orderidvsd,

                width: 150,
                Aggregated: row => {
                  return (
                    <span className="col-left" style={{ fontWeight: "bold", float: "left" }}>
                      {row.value}
                    </span>
                  );
                }

              },
              {



                Header: this.props.strings.parentorderid,
                accessor: "CUSTODYCD",
                width: 150,
                Aggregated: row => {
                  return (
                    <span className="col-left" style={{ fontWeight: "bold", float: "left" }}>
                      {row.value}
                    </span>
                  );
                }

              },
              {



                Header: this.props.strings.orderdate,
                accessor: "CUSTODYCD",
                width: 150,
                Aggregated: row => {
                  return (
                    <span className="col-left" style={{ fontWeight: "bold", float: "left" }}>
                      {row.value}
                    </span>
                  );
                }

              },
              {
                Header: this.props.strings.ordertype,
                // accessor: "SRTYPE_DESC",
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.SRTYPE_DESC}
                  </span>
                ),
              },
              {



                Header: this.props.strings.custodycd,

                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.SRTYPE_DESC}
                  </span>
                ),

              },
              {



                Header: this.props.strings.vfmsellcode,
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.SRTYPE_DESC}
                  </span>
                ),

              },
              {



                Header: this.props.strings.amountbuy,
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.SRTYPE_DESC}
                  </span>
                ),

              },
              {



                Header: this.props.strings.vfmcodeidbuy,
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.SRTYPE_DESC}
                  </span>
                ),

              },
              {



                Header: this.props.strings.statusordersw,
                aggregate: vals => '',
                filterable: true,
                width: 200,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.SRTYPE_DESC}
                  </span>
                ),

              },
              {



                Header: this.props.strings.orderdate,
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.SRTYPE_DESC}
                  </span>
                ),

              },
              {



                Header: this.props.strings.buyorsell,
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.SRTYPE_DESC}
                  </span>
                ),

              },
              {



                Header: this.props.strings.custodycd,
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.SRTYPE_DESC}
                  </span>
                ),

              },
              {



                Header: this.props.strings.swidbuyparent,
                aggregate: vals => '',
                filterable: true,
                width: 200,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.SRTYPE_DESC}
                  </span>
                ),

              },
              {



                //

                Header: this.props.strings.swidbuychild,
                width: 200,
                // accessor: "SYMBOL",
                aggregate: vals => '',
                filterable: true,
                // Aggregated: row => {
                //   return (
                //     <span style={{fontWeight:"bold"}}>
                //         {row.row.isClearOrder?'':row.row.value?row.row.value.toLocaleString():""}
                //         </span>
                //   );
                // },
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.SYMBOL}
                  </span>
                ),
              },
              {
                Header: this.props.strings.vfmsellcode,
                // accessor: "SRTYPE_DESC",
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.SRTYPE_DESC}
                  </span>
                ),
              },
              {
                Header: this.props.strings.amountbuy,
                // accessor: "SRTYPE_DESC",
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.ORDERID}
                  </span>
                ),
              },
              {
                Header: this.props.strings.amountsoldjoints,
                // accessor: "SRTYPE_DESC",
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.ORDERID}
                  </span>
                ),
              },
              {
                Header: this.props.strings.buyvalue,
                // accessor: "SRTYPE_DESC",
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.ORDERID}
                  </span>
                ),
              },
              {
                Header: this.props.strings.vfmcodeidbuy,
                // accessor: "SRTYPE_DESC",
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.ORDERID}
                  </span>
                ),
              },
              {
                Header: this.props.strings.transactionbuyvalue,
                // accessor: "SRTYPE_DESC",
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.ORDERID}
                  </span>
                ),
              },
              {
                Header: this.props.strings.vfmamount,
                // accessor: "SRTYPE_DESC",
                aggregate: vals => '',
                filterable: true,
                width: 250,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.ORDERID}
                  </span>
                ),
              },
              {
                Header: this.props.strings.nav,
                // accessor: "SRTYPE_DESC",
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.ORDERID}
                  </span>
                ),
              },
              {
                Header: this.props.strings.whoorder,
                // accessor: "SRTYPE_DESC",
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.ORDERID}
                  </span>
                ),
              },
              {
                Header: this.props.strings.cancelpurchasevalue,
                // accessor: "SRTYPE_DESC",
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.ORDERID}
                  </span>
                ),
              },
              {
                Header: this.props.strings.amountmoney,
                // accessor: "SRTYPE_DESC",
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.ORDERID}
                  </span>
                ),
              },
              {
                Header: this.props.strings.purchasevalueremaining,
                // accessor: "SRTYPE_DESC",
                aggregate: vals => '',
                filterable: true,
                width: 150,
                Cell: (row) => (
                  <span className="col-left" style={{ fontWeight: "normal", float: "left" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : row.original.ORDERID}
                  </span>
                ),
              },
              {
                Header: this.props.strings.cancelsalevalue,
                width: 200,
                // accessor: "ORDAMT",
                // aggregate: vals => _.sum(vals),
                filterable: true,
                // className:"td-group",
                Cell: (row) => (
                  <span className="col-right" style={{ fontWeight: "normal" }}>
                    {/* {row.value?row.value.toLocaleString():""} */}
                    {row.original == undefined ? "" : row.original.isClearOrder ? '' : <NumberFormat value={row.original.ORDAMT ? row.original.ORDAMT : 0} displayType={'text'} thousandSeparator={true} />}
                  </span>
                ),

                Aggregated: (row) => {

                  return (
                    <span className="col-right" style={{ fontWeight: "bold" }}>
                      {/* {row.value?row.value.toLocaleString():""} */}
                      {row.row.isClearOrder ? '' : <NumberFormat value={row.row.value ? row.row.value : 0} displayType={'text'} thousandSeparator={true} />}
                    </span>
                  );
                }



              },


              {

                Header: this.props.strings.selleditvalue,
                width: 200,
                accessor: "AMOUNT",
                aggregate: vals => '',
                filterable: true,
                Cell: (row) => (
                  <span className="col-right" style={{ fontWeight: "normal" }}>
                    {row.value ? <NumberFormat value={row.value} displayType={'text'} thousandSeparator={true} /> : ''}
                  </span>
                ),

                // Aggregated: row => {
                //   return (
                //     <span className="col-right" style={{fontWeight:"bold"}}>
                //      {row.value?<NumberFormat value={row.value} displayType={'text'} thousandSeparator={true} />:''}
                //      </span>
                //   );
                // },
              },
              {
                Header: this.props.strings.remainingsalesamount,
                accessor: "CONTENT",
                aggregate: vals => '',
                filterable: true,
                width: 200,
                Aggregated: row => {
                  return (
                    <span className="col-left" style={{ fontWeight: "bold" }}>
                      {row.value}
                    </span>
                  );
                },
                Cell: ({ value }) => {
                  return (
                    <span style={{ float: 'left', paddingLeft: '5px' }}>
                      {value}
                    </span>)
                }
              },
              {
                Header: this.props.strings.sipsell,
                accessor: "CONTENT",
                aggregate: vals => '',
                filterable: true,
                width: 200,
                Aggregated: row => {
                  return (
                    <span className="col-left" style={{ fontWeight: "bold" }}>
                      {row.value}
                    </span>
                  );
                },
                Cell: ({ value }) => {
                  return (
                    <span style={{ float: 'left', paddingLeft: '5px' }}>
                      {value}
                    </span>)
                }
              },
              {
                Header: this.props.strings.sipbuy,
                accessor: "CONTENT",
                aggregate: vals => '',
                filterable: true,
                width: 200,
                Aggregated: row => {
                  return (
                    <span className="col-left" style={{ fontWeight: "bold" }}>
                      {row.value}
                    </span>
                  );
                },
                Cell: ({ value }) => {
                  return (
                    <span style={{ float: 'left', paddingLeft: '5px' }}>
                      {value}
                    </span>)
                }
              },
              {
                Header: this.props.strings.status,
                accessor: "CONTENT",
                aggregate: vals => '',
                filterable: true,
                width: 300,
                Aggregated: row => {
                  return (
                    <span className="col-left" style={{ fontWeight: "bold" }}>
                      {row.value}
                    </span>
                  );
                },
                Cell: ({ value }) => {
                  return (
                    <span style={{ float: 'left', paddingLeft: '5px' }}>
                      {value}
                    </span>)
                }
              },
            ]

            }
            defaultPageSize={20}
            className="-striped -highlight"
            pivotBy={["CUSTODYCD"]}
            filterable
            style={{
              maxHeight: this.state.maxHeightTable + "px"// This will force the table body to overflow and scroll, since there is not enough room
            }}
            getTheadTrProps={() => {
              return {
                className: 'head'
              }
            }}
            getTheadGroupThProps={() => {
              return {
                className: 'head'
              }
            }}
            getTrProps={this.onRowClick.bind(this)}
            previousText={<i className="fas fa-backward"></i>}
            nextText={<i className="fas fa-forward"></i>}
          // SubComponent={row => {
          //   return (
          //     <div style={{ padding: "20px" }}>
          //       <em>
          //         You can put any component you want here, even another React
          //         Table!
          //       </em>
          //       <br />
          //       <br />
          //       <ReactTable
          //         data={data}
          //         columns={columns}
          //         defaultPageSize={3}
          //         showPagination={false}
          //         SubComponent={row => {
          //           return (
          //             <div style={{ padding: "20px" }}>Sub Component!</div>
          //           );
          //         }}
          //       />
          //     </div>
          //   );
          // }}
          />
          <br />
        </div>
      </div>
      // </div>

    )
  }
}
const stateToProps = state => ({

});
const decorators = flow([
  connect(stateToProps),
  translate('TableHDSIP')
]);
module.exports = decorators(TableHDSIP);
//module.exports = connect(function(state){return{
//  styleWeb :state.styleWeb
//}})(TableHDSIP);
