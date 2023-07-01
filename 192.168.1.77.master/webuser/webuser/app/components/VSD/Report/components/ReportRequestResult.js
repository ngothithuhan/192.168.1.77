import React from 'react';
import { connect } from 'react-redux';
import RestfulUtils from 'app/utils/RestfulUtils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
// import ComfirmCA from './ComfirmCA';
import { Collapse } from 'react-bootstrap';
import ReportParamsBuilder from './ReportParamsBuilder'
import Select from 'react-select'
import path from 'path'
import { DefaultPagesize, getExtensionByLang,getRowTextTable,getPageTextTable,AllKeyLang,ArrSpecial  } from 'app/Helpers'
import moment from 'moment'

function toNormalize(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
}
const requestData = (pageSize, page, sorted, filtered, rawData) => {
  return new Promise((resolve, reject) => {

    // You can retrieve your data however you want, in this case, we will just use some local data.
    let filteredData = rawData;

    // You can use the filters in your request, but you are responsible for applying them.
    if (filtered.length) {
      filteredData = filtered.reduce((filteredSoFar, nextFilter) => {

        return filteredSoFar.filter(row => {
          if (nextFilter.value == 'all') return (row[nextFilter.id].toUpperCase() + "")
          else return (toNormalize(row[nextFilter.id].toUpperCase()) + "").includes(toNormalize(nextFilter.value.toUpperCase()));

        });
      }, filteredData);
    }

    // You can also use the sorting in your request, but again, you are responsible for applying it.

    if (sorted.length) {
      let filteredDatanull = filteredData.filter(nodes => nodes[sorted[0].id] != null)
      if (filteredDatanull.length != 0) {
        let filteredDatanotnull = filteredDatanull[0][sorted[0].id]
        if (moment(filteredDatanotnull, "DD/MM/YYYY", true).isValid() == true) {
          filteredData = _.sortBy(filteredData, function (dateObj) {
            return new moment(dateObj[sorted[0].id], "DD/MM/YYYY") || '';
          });
          filteredData = sorted[0].desc == false ? filteredData : filteredData.reverse()
        } else if (isNaN(filteredDatanotnull) == false) {
          filteredData = _.sortBy(filteredData, function (num) {
            return parseFloat(num[sorted[0].id]) || '';

          })
          filteredData = sorted[0].desc == false ? filteredData : filteredData.reverse()

        } else {
          filteredData = _.sortBy(filteredData, function (str) {
            return str[sorted[0].id] || '';
          })
          filteredData = sorted[0].desc == false ? filteredData : filteredData.reverse()
        }
      }
    }

    const sortedData = filteredData
    // You must return an object containing the rows of the current page, and optionally the total pages number.
    const res = {
      rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
      pages: Math.ceil(filteredData.length / pageSize)
    };

    // Here we'll simulate a server response with 500ms of delay.
    setTimeout(() => resolve(res), 500);
  });
};
class ReportRequestResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportRequestData: [],
      activePage: '1',
      numPerPage: '5',
      pages: null,
      pageSize: DefaultPagesize,
      dataCA: {
        showModal: false
      },
      collapse: {
        FormInfo1: true,
        FormInfo2: true,
        FormInfo3: true,
      },
      RPTID: {},
      showReportParamsModal: false,
      CODEID: "",
      TRADINGDATE: "",
      TYPEREPORT: '',
      data1: [],
      loaded: false,
      page: 1,
      sorted1: [],
      filtered1: [],
      loading: true,
      loadgrid: false,
      isClear: true,
      firstRender: true,
      datareport: []
    };
  }

  // fetchData(state, instance) {
  //   var that = this;
  //   var body = { CUSTID: this.state.CUSTID, pagesize: 5, page: state.page + 1, keySearch: state.filtered, sortSearch: state.sorted };
  //   RestfulUtils.post('/authorize/getlist', body).then((resData) => {
  //     if (resData.EC == 0) {
  //       that.setState({
  //         data: resData.DT.data,
  //         pages: resData.DT.numOfPages
  //       })
  //     } else {
  //       toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
  //     }
  //   });
  // }
  fetchData(state, instance) {

    let that = this
    if (this.state.firstRender) {
      var obj = {};
      obj.p_autoid = ''
      obj.p_type = "M";
      obj.p_codeid = this.state.CODEID
      obj.p_tradingdate = this.state.TRADINGDATE
      obj.p_rptid = ''
      obj.objname=this.props.OBJNAME
      RestfulUtils.posttrans('/report/getreportrequest', obj).then((resData) => {



        // console.log('rs',resData.data.DT.data)
        // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
        if (resData.EC == 0) {
          requestData(
            state.pageSize,
            state.page,
            state.sorted,
            state.filtered,
            resData.DT.data,
          ).then(res => {
            // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
            this.setState({
              reportRequestData: res.rows,
              pages: res.pages,
              // loading: false,
              firstRender: false,
              data1: resData.DT.data,
            });
          });

        }
      })
    } else {
      requestData(
        state.pageSize,
        state.page,
        state.sorted,
        state.filtered,
        this.state.data1,
      ).then(res => {
        this.state.reportRequestData = res.rows,
          this.state.pages = res.pages,
          // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
          this.setState(that.state);
      });
    }
  }

  componentDidMount() {
    let self = this
    RestfulUtils.post('/report/getlistreport', { language: this.props.lang, p_objname: this.props.OBJNAME, p_tlname: this.props.AUTH.USERID ? this.props.AUTH.USERID : '', p_reflogid: '', AllKeyLang })
      .then((res) => {
        for (let i = 0; i < AllKeyLang.length; i++) {
          this.state.datareport[AllKeyLang[i]] = res['result' + AllKeyLang[i]]
        }
        self.setState({ datareport: self.state.datareport })
      });
  }

  componentWillReceiveProps(nextProps) {

    var that = this;
    if (nextProps.refresh) {
      //  this.getReportRequest();
    }
  }

  onClickShowCA(row) {
    let state = { ...this.state };
    state.urlConfirmCA = '/Report/downloadReport?AUTOID=' + row.original.AUTOID + '&extension=.xml' + '&TYPE=M';
    state.dataCA = row.original
    state.dataCA.showModal = true
    this.setState(state);
  }
  onCloseShowCA() {
    let state = { ...this.state };
    state.dataCA.showModal = false
    this.setState(state);
  }
  collapse(tab) {
    this.state.collapse[tab] = !this.state.collapse[tab];
    this.setState({ collapse: this.state.collapse })
  }
  onChangeRPTID(e) {
    let that = this
    let rptid = this.state.RPTID[that.props.lang] ? this.state.RPTID[that.props.lang].value : ''
    if (!e) {
      e = { value: '', label: '' };
      this.state.showReportParamsModal = false;
      this.state.RPTID[that.props.lang] = e;
      this.state.TYPEREPORT = ''
      this.state.isClear = true
    } else {
      if (rptid != e.value) {
        this.state.RPTID[that.props.lang] = e;
        this.state.TYPEREPORT = e.type
        this.state.showReportParamsModal = true;
        this.state.isClear = true

      }
    }
    for (let i = 0; i < AllKeyLang.length; i++) {
      this.state.RPTID[AllKeyLang[i]] = this.state.datareport[AllKeyLang[i]].filter(nodes => nodes.value == e.value)[0];
    }
    this.setState(that.state);
  }

  onGenReport(outParams, EXPTYPE) {
    var self = this;
    var arraySpecial = ArrSpecial

    if (this.state.RPTID[self.props.lang].cmdtype == 'E') {
      outParams.pv_language = this.props.lang
      RestfulUtils.posttrans('/report/createreportspecial', { outParams, arraySpecial, RPTID: this.state.RPTID[self.props.lang].value, EXPTYPE })
        .then((res) => {

          self.state.err_msg = res.EM;
          if (res.EC == 0) {
            this.state.firstRender = true
            this.refReactTable.fireFetchData()
            // this.getReportSpecial(res.DT.data, this.state.RPTID.value);
            toast.success(this.props.strings.succcess, { position: toast.POSITION.BOTTOM_RIGHT });
       

          } else {
            toast.error(res.EM, { position: toast.POSITION.BOTTOM_RIGHT });
          
          }
        });
    } else {
      var body = {};
      //  body.p_rptparam ='('+ this.genRPTPARAM(outParams)+')';
      body.p_rptparam = this.genRPTPARAM(outParams);
      body.p_rptid = this.state.RPTID[self.props.lang].value;
      body.p_exptype = EXPTYPE;

     
      RestfulUtils.posttrans('/report/createreportrequest', body)
        .then((res) => {
          self.state.err_msg = res.EM;
          if (res.EC == 0) {
            this.state.firstRender = true
            this.refReactTable.fireFetchData()
            toast.success(this.props.strings.succcess, { position: toast.POSITION.BOTTOM_RIGHT });
         

          } else {
            toast.error(res.EM, { position: toast.POSITION.BOTTOM_RIGHT });
           
          }
        });
    }

  }
  genRPTPARAM(outParams) {
    /*
   var param = '';
   if (outParams) {
     for (var key in outParams) {
       param += key + '=>\'' + outParams[key] + '\',';
     }
   }
   if (param.length > 0) {
     param = param.substring(0, param.length - 1);
   }

   return param;
 */

    Object.keys(outParams).forEach(key => (key === '' || key === null || key === 'undefined') && delete outParams[key])
    var param = '';
    if (outParams) {
      for (var key in outParams) {
        param += '\'' + outParams[key] + '\','
      }
    }
    if (param.length > 0) {
      param = param.substring(0, param.length - 1);
    }

    return param;

  }
  getOptionsSYMBOLbyTLID(input) {
    return RestfulUtils.post('/allcode/search_all_funds', { key: input })
      .then((res) => {

        return { options: res }
      })
  }
  getSearchInfo(type, e) {
    if (e) {
      this.state[type] = e.value
    }
    else this.state[type] = ""
    this.setState(this.state)
    // this.getReportRequest()
  }
  onChangeDate(type, event) {
    if (event) {
      this.state[type] = event.text;
    }
    else this.state[type] = ''
    this.setState(this.state)
  }
  load() {
    this.setState({ loadgrid: true })
  }
  change() {

    this.setState({ isClear: false })
  }
  getReportRequest() {
    this.state.firstRender = true
    this.refReactTable.fireFetchData()
  }
  render() {

    var that = this;
    var { reportRequestData, pages, pageSize, RPTID, loading } = this.state;
    return (
      <div className="col-md-12" style={{ height: "auto", padding: "10px 10px 10px 10px" }}>
        <div >
          <div className="col-md-12 module">
            <div onClick={this.collapse.bind(this, 'FormInfo1')} style={{ cursor: "pointer" }} className="title-module">{that.props.strings.search}<i style={{ float: "right", cursor: "pointer" }} className={!this.state.collapse["FormInfo1"] ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up"}></i> </div>
            <Collapse in={this.state.collapse["FormInfo1"]}>
              <div style={{ margin: '10px', padding: '0px' }} className="col-md-12">
                <div className="col-md-12">
                  <div>
                    <div className="col-md-12">
                      <div className="col-md-2" ><h5 className="highlight" style={{ fontWeight: "bold" }}>{this.props.strings.type}</h5> </div>
                      <div className="col-md-6">
                        <Select
                          name="form-field-name"
                          disabled={this.state.ISEDIT}
                          options={this.state.datareport[that.props.lang]}
                          value={this.state.RPTID[that.props.lang] ? this.state.RPTID[that.props.lang] : { value: '', label: '' }}
                          onChange={this.onChangeRPTID.bind(this)}
                        />
                      </div>
                      <div className="col-md-4"></div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <ReportParamsBuilder
                    change={this.change.bind(this)}
                    load={this.load.bind(this)}
                    isClear={this.state.isClear}
                    showModal={this.state.showReportParamsModal}
                    RPTID={this.state.RPTID[that.props.lang] ? this.state.RPTID[that.props.lang].value : ''}
                    onGenReport={this.onGenReport.bind(this)}
                    TYPEREPORT={this.state.TYPEREPORT}
                    AUTH={this.props.AUTH} />
                </div>
              </div>

            </Collapse>
          </div>
          <div className="col-md-12 module">
            <div onClick={this.collapse.bind(this, 'FormInfo2')} style={{ cursor: "pointer" }} className="title-module">{this.props.strings.result}<i style={{ float: "right", cursor: "pointer" }} className={!this.state.collapse["FormInfo2"] ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up"}></i> </div>
            <Collapse in={this.state.collapse["FormInfo2"]}>
              <div style={{ margin: '10px', padding: '0px' }} className="col-md-12">
                <div className="col-md-12 btn-customer-crud" style={{ paddingBottom: "10px" }}>
                  <button style={{ marginLeft: "5px" }} onClick={this.getReportRequest.bind(this)} className="btn btn-default"><span style={{ marginRight: "3px" }} className="glyphicon glyphicon-refresh"></span>{this.props.strings.refesh}</button>
                </div>


                <div className="content-left">
                  <ReactTable
                    columns={[
                      {
                        Header: props => <div className="wordwrap">{this.props.strings.createdate}</div>,
                        id: "CRTDATETIME",
                        accessor: "CRTDATETIME",

                        width: 100,
                        Cell: ({ value }) => {
                          return (
                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                              {value}
                            </span>)
                        },
                      },
                      {
                        Header: props => <div className="wordwrap">{this.props.strings.createtime}</div>,
                        id: "CRTTIME",
                        accessor: "CRTTIME",

                        width: 100,
                        Cell: ({ value }) => {
                          return (
                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                              {value}
                            </span>)
                        },
                      },
                      {
                        Header: props => <div className="wordwrap">{this.props.strings.rptid}</div>,
                        id: "RPTID",
                        accessor: "RPTID",
                        // filterable: false,
                        width: 80,
                        Cell: ({ value }) => {
                          return (
                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                              {value}
                            </span>)
                        },
                      },
                      {
                        Header: props => <div className="wordwrap">{this.props.strings.reportname}</div>,
                        id: getExtensionByLang("DESCRIPTION", this.props.lang),
                        accessor: getExtensionByLang("DESCRIPTION", this.props.lang),
                        width: 480,
                        //  filterable: false,
                        Cell: ({ value }) => {
                          return (
                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                              {value}
                            </span>)
                        },

                      },
                      {
                        Header: props => <div className="wordwrap">{this.props.strings.status}</div>,
                        id: "STATUS",
                        accessor: "STATUS",
                        width: 120,
                        sortable: false,
                        Cell: ({ value }) => (
                          //A thanh cong, P cho xu ly, E exception (note: exception error), R reject (note)
                          <span style={{ float: 'left', paddingLeft: '5px' }}>
                            {value === "A" ? this.props.strings.succcess : value === "P" ? this.props.strings.waiting : value === "E" ? this.props.strings.error : value === "R" ? this.props.strings.reject:value === "F" ? this.props.strings.nodata : this.props.strings.undefined}
                          </span>
                        ),
                        filterMethod: (filter, row) => {
                          if (filter.value === "all") {
                            return true;
                          }
                          if (filter.value === "A") {
                            return row[filter.id] == 'A';
                          }
                          if (filter.value === "P") {
                            return row[filter.id] == 'P';
                          }
                          if (filter.value === "E") {
                            return row[filter.id] == 'E';
                          }
                          if (filter.value === "F") {
                            return row[filter.id] == 'F';
                          }
                          return row[filter.id] == 'R';
                        },
                        Filter: ({ filter, onChange }) =>
                          <select
                            onChange={event => onChange(event.target.value)}
                            style={{ width: "100%" }}
                            value={filter ? filter.value : "all"}
                          >
                            <option value="all" >{this.props.strings.all}</option>
                            <option value="A" >{this.props.strings.succcess}</option>
                            <option value="P" >{this.props.strings.waiting}</option>
                            <option value="E" >{this.props.strings.error}</option>
                            <option value="F" >{this.props.strings.nodata}</option>
                            <option value="R" >{this.props.strings.reject}</option>
                          </select>
                      },
                      {
                        Header: props => <div className="wordwrap">{this.props.strings.reportformat}</div>,
                        id: "AUTOID",
                        filterable: false,
                        width: 160,
                        Cell: (row) => (
                          <span style={{ float: 'left', paddingLeft: '5px' }}>
                            {row.original.STATUS == 'A' ? row.original.REFRPTFILE.split('$#').map((item, index) => {
                              return <a key={index} href={'/report/downloadreport?AUTOID=' + row.original.AUTOID + '&extension=' + path.extname(item) + '&TYPE=M' + '&RPTID=' + row.original.RPTID + '&REFRPTFILE=' + row.original.REFRPTFILE} target="_blank">{path.extname(item).toUpperCase()}</a>
                            }) : null}
                          </span>
                        )
                      },
                      // {
                      //   Header: props => <div>Xác nhận ký số</div>,
                      //   width: 100,
                      //   id: "ISCA",
                      //   Cell: (row) => (
                      //     row.original.ISCA === "Y" && row.original.ISSIGNOFF === "N" ? <span className="text-center"><button className="btn btn-primary" onClick={that.onClickShowCA.bind(this, row)}> Xác nhận </button></span>
                      //       : row.original.ISCA === "Y" && row.original.ISSIGNOFF === "Y" ? <span className="text-center"> Đã xác nhận </span> : null
                      //   )
                      // },

                    ]}
                    getTheadTrProps={() => {
                      return {
                        className: 'head'
                      }
                    }}
                    manual
                    filterable
                    pages={pages}
                    data={reportRequestData}
                    onFetchData={this.fetchData.bind(this)}
                    pageText={getPageTextTable(this.props.lang)}
                    rowsText={getRowTextTable(this.props.lang)}
                    previousText={<i className="fas fa-backward" id="previous"></i>}
                    nextText={<i className="fas fa-forward" id="next"></i>}
                    // loadingText="Đang tải..."
                    ofText="/"
                    noDataText=''
                    defaultPageSize={pageSize}
                    //  showPagination={false}
                    className="-striped -highlight"
                    //   loading={loading}
                    ref={(refReactTable) => { this.refReactTable = refReactTable; }}

                  />
                </div>

              </div>
            </Collapse>
          </div>
        </div>
        {/* <ComfirmCA urlConfirmCA={this.state.urlConfirmCA} showModal={this.state.dataCA.showModal} onClose={this.onCloseShowCA.bind(this)} dataCA={this.state.dataCA} refreshTableReport={this.getReportRequest.bind(this)} /> */}
      </div >
    )
  }
}

const stateToProps = state => ({
  notification: state.notification,
  styleWeb: state.styleWeb,
  lang: state.language.language,

});


const decorators = flow([
  connect(stateToProps),
  translate('ReportRequestResult')
]);

module.exports = decorators(ReportRequestResult);
