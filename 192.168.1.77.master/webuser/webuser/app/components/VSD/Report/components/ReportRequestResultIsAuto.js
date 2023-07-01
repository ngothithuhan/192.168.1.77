import React from 'react';
import { connect } from 'react-redux';
import RestfulUtils from 'app/utils/RestfulUtils';
import 'react-toastify/dist/ReactToastify.min.css';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import ComfirmCA from './ComfirmCA';
import DateInput from 'app/utils/input/DateInput';
var path = require('path')
var Select = require('react-select');

class ReportRequestResultIsAuto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportRequestData: [],
      activePage: '1',
      numPerPage: '5',
      pages: 1,
      pageSize: 10,
      dataCA: {
        showModal: false,
        actionConfirmCA: ''
      },
      CODEID: "",
      TRADINGDATE: "",
      RPTID: "",
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
  componentDidMount() {
    this.getReportRequest();
    if (this.props.onRef) {
      this.props.onRef(this)
    }
  }
  componentWillUnmount() {
    if (this.props.onRef) {
      this.props.onRef(undefined)
    }
  }
  componentWillReceiveProps(nextProps) {
    var that = this;
    if (nextProps.refresh) {
      this.getReportRequest();
    }
  }
  getReportRequest() {
    var self = this;
    var obj = {};
    obj.TYPE = "A";
    obj.CODEID = this.state.CODEID
    obj.TRADINGDATE = this.state.TRADINGDATE
    obj.RPTID = this.state.RPTID
    self.setState({ reportRequestData: [] });
    RestfulUtils.post('/report/getReportRequest', obj)
      .then((res) => {
        if (res.EC == 0) {
          self.setState({ reportRequestData: res.DT });
        } else {
        //  toast.error(res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
          self.setState({ reportRequestData: [] });

        }
      });
  }
  onClickShowCA(row, action) {
    let state = { ...this.state };
    state.urlConfirmCA = '/Report/downloadReport?AUTOID=' + row.original.AUTOID + '&extension=.xml' + '&TYPE=A';
    state.dataCA = row.original
    state.dataCA.showModal = true
    state.dataCA.actionConfirmCA = action
    this.setState(state);
  }
  onCloseShowCA() {
    let state = { ...this.state };
    state.dataCA.showModal = false
    this.setState(state);
  }
  getOptionsSYMBOLbyTLID(input) {
    return RestfulUtils.post('/CashStatement/getFundBankAccount', { key: input })
      .then((res) => {
        return { options: res }
      })
  }
  getReportOptions() {
    return RestfulUtils.post('/report/getListReport', {})
      .then((res) => {
        var data = [];
        for (var item of res) {
          data.push({ label: item.RPTID, value: item.RPTID });
        }
        return { options: data }
      });
  }
  getSearchInfo(type, e) {
    if (e) {
      this.state[type] = e.value
    }
    else this.state[type] = ""
    this.setState(this.state)
    // this.getReportRequest()
  }
  render() {
    var that = this;
    var { reportRequestData, pages, pageSize, } = this.state;
    return (
      <div className="col-md-12 FormAuto" style={{ height: "auto" }}>
        <div >
          <div className="col-md-12 btn-customer-crud" style={{ paddingBottom: "10px" }}>
            <div className="col-md-9">
              <div className="col-md-4">
                <div className="col-md-5" style={{ padding: "0px" }}><h5>Mã quỹ</h5></div>
                <div className="col-md-7" style={{ padding: "0px" }}>
                  <Select.Async
                    name="form-field-name"
                    placeholder="Nhập Mã CCQ..."
                    loadOptions={this.getOptionsSYMBOLbyTLID.bind(this)}
                    value={this.state.CODEID}
                    onChange={this.getSearchInfo.bind(this, "CODEID")}
                  />
                </div>
              </div>
              <div className="col-md-4" >
                <div className="col-md-5" style={{ padding: "0px" }}><h5>Phiên giao dịch</h5></div>
                <div className="col-md-7 fixWidthDatePickerForOthers" style={{ padding: "0px" }}>
                  <DateInput onChange={this.getSearchInfo.bind(this)} value={this.state.TRADINGDATE} type="TRADINGDATE" />
                </div>
              </div>
              <div className="col-md-4">
                <div className="col-md-5" style={{ padding: "0px" }}><h5>Mã báo cáo</h5></div>
                <div className="col-md-7" style={{ padding: "0px" }}>
                  <Select.Async
                    name="form-field-name"
                    placeholder="Nhập Mã báo cáo..."
                    loadOptions={this.getReportOptions.bind(this)}
                    value={this.state.RPTID}
                    onChange={this.getSearchInfo.bind(this, "RPTID")}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <button style={{ marginLeft: "5px" }} onClick={this.getReportRequest.bind(this)} className="btn btn-primary">Tìm kiếm</button>
            </div>
          </div>
          <div className="content-left">
            <ReactTable
              columns={[
                {
                  Header: props => <div>STT</div>,
                  id: "STT",
                  accessor: "STT",
                  width: 40
                },
                {
                  Header: props => <div>Mã quỹ</div>,
                  id: "SYMBOL",
                  accessor: "SYMBOL",
                  width: 80,
                  Cell: ({ value }) => {
                    return (
                      <span style={{ float: 'left', paddingLeft: '5px' }}>
                        {value}
                      </span>)
                  },
                },
                {
                  Header: props => <div>Phiên GD</div>,
                  id: "TRADINGDATE",
                  accessor: "TRADINGDATE",
                  width: 70,
                  Cell: ({ value }) => {
                    return (
                      <span style={{ float: 'left', paddingLeft: '5px' }}>
                        {value}
                      </span>)
                  },
                },
                {
                  Header: props => <div>Ngày tạo</div>,
                  id: "CRTDATETIME",
                  accessor: "CRTDATETIME",
                  width: 70,
                  Cell: ({ value }) => {
                    return (
                      <span style={{ float: 'left', paddingLeft: '5px' }}>
                        {value}
                      </span>)
                  },
                },
                {
                  Header: props => <div>Mã báo cáo</div>,
                  id: "RPTID",
                  accessor: "RPTID",
                  width: 85,
                  Cell: ({ value }) => {
                    return (
                      <span style={{ float: 'left', paddingLeft: '5px' }}>
                        {value}
                      </span>)
                  },
                },
                {
                  Header: props => <div>Tên báo cáo</div>,
                  id: "DESCRIPTION",
                  accessor: "DESCRIPTION",
                  width: 330,
                  Cell: ({ value }) => {
                    return (
                      <span style={{ float: 'left', paddingLeft: '5px' }}>
                        {value}
                      </span>)
                  },
                },
                {
                  Header: props => <div>Trạng thái</div>,
                  id: "STATUS",
                  accessor: "STATUS",
                  width: 100,
                  Cell: ({ value }) => (
                    //A thanh cong, P cho xu ly, E exception (note: exception error), R reject (note)
                    <span style={{ float: 'left', paddingLeft: '5px' }}>
                      {value === "A" ? 'Thành công' : value === "P" ? 'Chờ xử lý' : value === "E" ? 'Lỗi xuất báo cáo' : value === "R" ? 'Từ chối' : 'Không xác định'}
                    </span>
                  )
                },
                {
                  Header: props => <div>Định dạng</div>,
                  id: "AUTOID",
                  width: 100,
                  Cell: (row) => (
                    <span style={{ float: 'left', paddingLeft: '5px' }}>
                      {row.original.STATUS == 'A' ? row.original.REFRPTFILE.split('$#').map((item, indx) => {
                        return <a href={'/Report/downloadReport?AUTOID=' + row.original.AUTOID + '&extension=' + path.extname(item) + '&TYPE=A'} target="_blank">{path.extname(item)}</a>
                      }) : null}
                    </span>
                  )
                },
                {
                  Header: props => <div>Xác nhận ký số</div>,
                  width: 100,
                  // id: "ISCA",
                  Cell: (row) => (
                    row.original.STATUS === "A" && row.original.ISCA === "Y" && row.original.ISSIGNOFF === "N" ? <span className="text-center"><button className="btn btn-primary" onClick={that.onClickShowCA.bind(this, row, "A")}> Xác nhận </button></span>
                      : row.original.STATUS === "A" && row.original.ISCA === "Y" && row.original.ISSIGNOFF === "P" ? <span className="text-center"> Chờ duyệt xác nhận </span>
                        : row.original.STATUS === "A" && row.original.ISCA === "Y" && row.original.ISSIGNOFF === "A" ? <span className="text-center"> Đã xác nhận </span> : null
                  )
                },
                {
                  Header: props => <div>Từ chối ký số</div>,
                  width: 90,
                  // id: "ISCA",
                  Cell: (row) => (
                    row.original.STATUS === "A" && row.original.ISCA === "Y" && row.original.ISSIGNOFF === "N" ? <span className="text-center"><button className="btn btn-primary" onClick={that.onClickShowCA.bind(this, row, "R")}> Từ chối </button></span>
                      : row.original.STATUS === "A" && row.original.ISCA === "Y" && row.original.ISSIGNOFF === "J" ? <span className="text-center"> Chờ duyệt từ chối </span>
                        : row.original.STATUS === "A" && row.original.ISCA === "Y" && row.original.ISSIGNOFF === "R" ? <span className="text-center"> Đã từ chối </span> : null
                  )
                },

              ]}
              getTheadTrProps={() => {
                return {
                  className: 'head'
                }
              }}
              manual
              // filterable
              pages={pages}
              data={reportRequestData}
              // onFetchData={this.fetchData}
              pageText="Trang"
              rowsText="dòng"
              previousText="Trước"
              nextText="Tiếp"
              loadingText="Đang tải..."
              ofText="/"
              noDataText=''
              defaultPageSize={pageSize}
              showPagination={false}
              className="-striped -highlight"

            />
          </div>
        </div >
        <ComfirmCA urlConfirmCA={this.state.urlConfirmCA} showModal={this.state.dataCA.showModal} onClose={this.onCloseShowCA.bind(this)} dataCA={this.state.dataCA} refreshTableReport={this.getReportRequest.bind(this)} />
      </div >
    )
  }
}

const stateToProps = state => ({
  notification: state.notification,
  styleWeb: state.styleWeb

});


const decorators = flow([
  connect(stateToProps),
  translate('')
]);

module.exports = decorators(ReportRequestResultIsAuto);
