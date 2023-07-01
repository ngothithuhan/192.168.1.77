import React from 'react'
import RestfulUtils from 'app/utils/RestfulUtils'
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import { toast } from 'react-toastify';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { DefaultPagesize, SRTYPE_SW, COLORSW, SRTYPE_NR, COLORNR, COLORNS, getExtensionByLang } from '../../../../Helpers';
import NumberInput from 'app/utils/input/NumberInput';
import ModalDialog from 'app/utils/Dialog/ModalDialog'

class TableCompareOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: null,

      pagesize: DefaultPagesize,
      loading: true,
      data: [],
      keySearch: [],
      sortSearch: [],
      checkedAll: false,
      checkboxChecked: false,
      selectedRows: new Set(),
      unSelectedRows: [],
      row: [],
      showModalConfirm: false,
      showModalDetail: false,
      access: "",

    }
  }



  log(row) {
    // console.log('row',row)
  }
  fetchData = (state, instance) => {

    if (this.state.loading) {
      let { pageSize, page, filtered, sorted } = state;
      this.loadData(pageSize, page + 1, filtered, sorted);
    }
    this.setState({ loading: true })
  }
  async loadData(pagesize, page, keySearch, sortSearch) {
    let that = this;

    await RestfulUtils.post('/srreconcile/getlistsrreconcile', { pagesize, page, keySearch, sortSearch, CUSTODYCD: '', language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {


      if (resData.EC == 0) {
        that.setState({
          data: resData.DT.data,
          pages: resData.DT.numOfPages,
          keySearch,
          page,
          pagesize,
          sortSearch,
          sumRecord: resData.DT.sumRecord
        });
      }
      else {

      }


    });

  }
  async reloadDataTable() {
    let that = this;
    let { pagesize, page, keySearch, sortSearch } = that.state;
    await RestfulUtils.posttrans('/srreconcile/getlistsrreconcile', { pagesize, page, keySearch, sortSearch, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
      if (resData.EC == 0) {
        that.setState({
          data: resData.DT.data,
          pages: resData.DT.numOfPages,
          keySearch,
          page,
          pagesize,
          sortSearch,
          sumRecord: resData.DT.sumRecord
        });
      }
      else {

      }


    });

  }
  getListSips(CUSTODYCD) {
    let self = this;
    //console.time('/srreconcile/getListSrreconcile');
    RestfulUtils.post('/srreconcile/getlistsrreconcile', { pagesize: self.state.pagesize, CUSTODYCD, language: this.props.language }).then((resdata) => {
      if (resdata.EC == 0) {

        self.setState({ data: resdata.DT.data, pages: resdata.DT.numOfPages })
      }
      else {
        toast.error(resdata.EM, { position: toast.POSITION.BOTTOM_RIGHT })
      }
    })
    //console.timeEnd('/srreconcile/getListSrreconcile');
  }
  // componentWillReceiveProps(nextProps) {
  //   const { user } = this.props.auth
  //   let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
  //   if (isCustom)
  //     if (nextProps.custodycd != this.props.custodycd)
  //       this.getListSips(nextProps.custodycd.value)
  // }
  componentDidMount() {

    const { user } = this.props.auth
    //let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;

    var that = this;
    io.socket.on('loadSips', function (CUSTODYCD) {
      let { keySearch, page, pagesize, sortSearch } = that.state;
      that.loadData(pagesize, page, keySearch, sortSearch);
      // if (isCustom) {
      //   if (CUSTODYCD == user.USERID)
      //     that.loadData(pagesize, page, keySearch, sortSearch);
      // }
      // else {
      //   RestfulUtils.post('/account/isCareby', { CUSTODYCD: CUSTODYCD }).then((resData) => {
      //     if (resData.isCareby) {
      //       that.loadData(pagesize, page, keySearch, sortSearch);
      //     }
      //   });
      // }

    });
  }
  handleChangeALL(evt) {
    var that = this;
    this.setState({ checkedAll: evt.target.checked });
    if (evt.target.checked) {
      that.state.data.map(function (item) {
        if (!that.state.selectedRows.has(item.ORDERID)) {
          that.state.unSelectedRows.push(item.ORDERID);
          that.state.selectedRows.add(item.ORDERID);
        }
      })
      that.setState({ selectedRows: that.state.selectedRows, unSelectedRows: that.state.unSelectedRows })
    }
    else {
      that.state.unSelectedRows.map(function (item) {
        that.state.selectedRows.delete(item);
      })
      that.setState({ selectedRows: that.state.selectedRows, unSelectedRows: [] })
    }

  }
  eventEdit(row) {

    this.props.eventEdit(row)
  }
  eventCancel(row) {

    this.props.eventDelete(row)
  }
  eventViewDetail(row) {
    this.props.viewSipDetail(row.SPID)
  }
  confirmPopup(ISConfirm, ACTION) {
    //console.log('ISConfirm, ACTION:', ISConfirm, ACTION)
    if (ISConfirm == true) {
      if (ACTION == "delete")
        this.eventCancel(this.state.datarow)
      else if (ACTION == "edit")
        this.props.eventEdit(this.state.datarow)
    }
    else {
      // this.props.eventDelete(this.state.datarow)
      this.setState({ showModalConfirm: false, ACTION: ACTION })
    }
  }
  checkConfirm(ACTION, data, event) {
    this.setState({ showModalDetail: true, ACTION: ACTION, datarow: data })
  }
  closeModalDetail() {
    this.setState({ showModalDetail: false })
  }
  onRowClick(state, rowInfo, column, instance) {
    let self = this;




    return {
      onDoubleClick: e => {

        // if (rowInfo.original != undefined) {
        //   let dataClick = self.state.data.filter(e => e.ORDERID === rowInfo.original.ORDERID);
        //   self.props.showPopupThongTinMonNop(dataClick);
        // }
      },
      onClick: (e, handleOriginal) => {
        //this.props.viewSipDetail(rowInfo.original.SPID)
        // if (handleOriginal) {
        //   handleOriginal()
        // }
      },
      style: {
        background: rowInfo == undefined ? '' : rowInfo.original == undefined ? '' : rowInfo.original.background
        // color:rowInfo==undefined?'': that.state.selectedRows.has(rowInfo.original.CUSTID)?'black':'',
      }
    }
  }

  render() {
    let { data, pagesize, pages } = this.state
    let that = this;
    const { user } = this.props.auth
    let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
    return (

      <div className="panel-body">
        <div className="col-md-12 ">
          <h5 className="highlight" style={{ fontWeight: "bold", fontSize: "13px", float: "right" }}> <span className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
            <span className="ReloadButton" onClick={this.reloadDataTable.bind(this)}><i className="fas fa-sync-alt"></i></span>
          </h5>
        </div>
        <div className="col-md-12 forFireFox customize-react-table " >
          <ReactTable
            columns={[
              {
                Header: props => <div className=" header-react-table">    </div>,
                width: 50,
                sortable: false,
                style: { textAlign: 'center' },
                Cell: (row) => (
                  <div>
                    {/* <div>{row.original.ISAMEND == 'Y' ? <span id={"btnEdit" + row.index} onClick={this.eventEdit.bind(this, row.original)} className="glyphicon glyphicon-pencil"></span> : null} */}
                    {row.original.ISCANCEL == 'Y' ? <span id={"btnCancel" + row.index} onClick={this.checkConfirm.bind(this, "delete", row.original)} className="glyphicon glyphicon-remove" style={{ color: "red", marginLeft: "5px" }}></span> : null}

                  </div>

                ),

                Filter: ({ filter, onChange }) =>
                  null

              },
              {
                Header: props => <div className="">    </div>,
                width: 70,
                sortable: false,
                style: { textAlign: 'center' },
                Cell: (row) => (
                  <div>

                    <div>
                      <input type="button" className="btn btn-primary" onClick={this.eventViewDetail.bind(this, row.original)} value={this.props.strings.detail} />
                    </div>
                  </div>

                ),

                Filter: ({ filter, onChange }) =>
                  null

              },
              {
                Header: props => <div className="">{this.props.strings.parentorderid}</div>,
                id: "SPID",
                accessor: "SPID",
                width: 146
              },
              {
                Header: props => <div className="">{this.props.strings.exectype}</div>,
                id: "DESC_EXECTYPE",
                accessor: "DESC_EXECTYPE",
                Cell: row => (
                  <span style={{ fontWeight: 'bold', color: row.original.SRTYPE == SRTYPE_SW ? COLORSW : (row.original.EXECTYPE == SRTYPE_NR ? COLORNR : COLORNS) }}>
                    {

                      row.value

                    }
                  </span>
                ),
                width: 105
              },
              {
                Header: props => <div className="">{this.props.strings.custodycd}</div>,
                id: "CUSTODYCD",
                accessor: "CUSTODYCD",
                show: !isCustom,
                width: 102
              },
              {
                Header: props => <div className="">{this.props.strings.symbol}</div>,
                id: "SYMBOL",
                accessor: "SYMBOL",
                width: 81
              },
              {
                Header: props => <div className="wordwrap">{this.props.strings.minflamt}</div>,
                id: "AMT",
                accessor: "AMT",
                Cell: ({ value }) => (
                  <span className="">
                    {

                      <NumberInput value={value} displayType={'text'} thousandSeparator={true} />

                    }
                  </span>
                ),
                width: 89
              },
              {
                Header: props => <div className="">{this.props.strings.statusparent}</div>,
                id: getExtensionByLang("STATUS_DESC", this.props.language),
                accessor: getExtensionByLang("STATUS_DESC", this.props.language),
                width: 140,
                Cell: ({ value }) => (
                  <span className="col-center">
                    {value}
                  </span>
                ),

              },
              {
                Header: props => <div className="">{this.props.strings.begindate}</div>,
                accessor: 'BEGINDATE',
                width: 100,
                Cell: ({ value }) => (
                  <span className="col-center">
                    {value}
                  </span>
                ),

              },
              {
                Header: props => <div className="">{this.props.strings.username}</div>,
                id: "USERNAME",
                accessor: "USERNAME",
                width: 154
              },
              {
                Header: props => <div className="">{this.props.strings.time}</div>,
                id: "TXTIME",
                accessor: "TXTIME",
                width: 130
              },
              {
                Header: props => <div className="">{this.props.strings.feedbackmsg}</div>,
                id: "FEEDBACKMSG",
                accessor: "FEEDBACKMSG",
                width: 250
              },
              {
                Header: props => <div className="wordwrap">{this.props.strings.VSDSTATUS}</div>,
                id: "VSDSTATUS",
                accessor: "VSDSTATUS",
                width: 250
              },

            ]}
            manual
            data={data}
            onFetchData={this.fetchData}
            defaultPageSize={pagesize}
            pages={pages}
            className="-striped -highlight"
            // pivotBy={["CUSTODYCD"]}
            filterable
            style={{
              maxHeight: "300px"
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
          />
          <ModalDialog confirmPopup={this.confirmPopup.bind(this)} ACTION={this.state.ACTION} data={this.state.datarow} showModalDetail={this.state.showModalDetail} closeModalDetail={this.closeModalDetail.bind(this)} />
          <br />
        </div>
      </div>
      // </div>

    )
  }
}
const stateToProps = state => ({
  language: state.language.language
});
const dispatchToProps = dispatch => ({

})
const decorators = flow([
  connect(stateToProps, dispatchToProps),
  translate('TableCompareOrder')
]);
module.exports = decorators(TableCompareOrder);
//module.exports = connect(function(state){return{
  //styleWeb :state.styleWeb
//}})(DoiChieuLenh);
