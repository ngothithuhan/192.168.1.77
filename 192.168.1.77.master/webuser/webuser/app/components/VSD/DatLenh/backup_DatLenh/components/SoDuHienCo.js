import React from 'react';
import { connect } from 'react-redux';

import ReactTable from 'react-table'
import { toast } from 'react-toastify';
import RestfulUtil from "app/utils/RestfulUtils";
import ModalChiTietSoDu from './ModalChiTietSoDu';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import NumberInput from 'app/utils/input/NumberInput';
import { DefaultPagesize } from '../../../../Helpers';
import Select from 'react-select'



class SoDuHienCo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avaiBalances: [],
      sendPropsToShowDetail: {},
      showDetail: false,
      CUSTODYCD: { value: '', label: '' },
      CODEID: { value: '', label: '' },
      TLID: '',
      pages: null,
      pagesize: DefaultPagesize,
      loading: false,
    }
  }

  fetchData = (state, instance) => {

    if (this.state.loading) {
      let { pageSize, page, filtered, sorted } = state;
      this.loadData(pageSize, page + 1, filtered, sorted);
    }
    this.setState({ loading: true })
  }
  async loadData(pagesize, page, keySearch, sortSearch) {
    var that = this;
    let CODEID = this.state.CODEID.value === null ? "" : this.state.CODEID.value;
    let CUSTODYCD = this.state.CUSTODYCD.value === null ? "" : this.state.CUSTODYCD.value;
    var obj = {
      CUSTODYCD: CUSTODYCD,
      CODEID: CODEID,
      OBJNAME: this.props.OBJNAME
    }
    RestfulUtil.post('/Balance/searchFundBalance', { ...obj, pagesize, page, keySearch, sortSearch }).then(resData => {
      if (resData.EC === 0) {
        that.setState({
          avaiBalances: resData.DT.data,
          pages: resData.DT.numOfPages,
          keySearch,
          page,
          pagesize,
          sortSearch
        });
      }

    })
  }
  search() {

    var that = this;
    let CODEID = this.state.CODEID.value === null ? "" : this.state.CODEID.value;
    let CUSTODYCD = this.state.CUSTODYCD.value === null ? "" : this.state.CUSTODYCD.value;
    if (CODEID != "" && CUSTODYCD != "") {

      var obj = {
        CUSTODYCD: CUSTODYCD,
        CODEID: CODEID,
        language: this.props.language,
        pagesize: this.state.pagesize,
        OBJNAME: this.props.OBJNAME
      }
      if (obj.CUSTODYCD || obj.CODEID) {
        RestfulUtil.post('/balance/getfundbalance', obj)
          .then(resData => {

            if (resData.EC === 0) {
              //console.log('resData.DT', resData.DT)
              that.setState({ avaiBalances: resData.DT.data, pages: resData.DT.numOfPages })
            }
          })
      }
      else {
        toast.error("Nhập thông tin để tìm kiếm !", {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }
    }
    else {
      toast.error("Không được để trống tiêu chí tìm kiếm!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }
  getOptionsSYMBOL(input) {
    return RestfulUtil.post('/allcode/search_all_funds', { key: input })
      .then((res) => {
        // console.log(res.data);
        return { options: res }
      })
  }
  getOptions(input) {
    return RestfulUtil.post('/account/search_all', { key: input })
      .then((res) => {
        // console.log(res.data);
        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        if (isCustom)
          if (res)
            if (res.length > 0) {
              var CUSTODYCD = { label: "", value: "" }
              res.map(function (event) {
                if (user.USERID == event.label) {
                  CUSTODYCD = { label: event.label, value: event.value }
                  return null
                }
              })
              this.setState({ ...this.state, CUSTODYCD: CUSTODYCD })
            }
        return { options: res }
      })
  }
  onChangeSYMBOL(e) {
    if (e === null) e = { value: '', label: '' }
    this.setState({
      CODEID: e
    })
  }
  onChange(e) {
    // console.log(e)
    if (e === null) e = { value: '', label: '' }
    this.setState({
      CUSTODYCD: e
    })
  }
  onRowClick = (state, rowInfo, column, instance) => {
    var that = this;

    return {
      onDoubleClick: () => {
        if (rowInfo.original != undefined) {
          this.state.sendPropsToShowDetail["CODEID"] = rowInfo.original["CODEID"];
          this.state.sendPropsToShowDetail["CUSTODYCD"] = rowInfo.original["CUSTODYCD"];
          that.setState({ sendPropsToShowDetail: this.state.sendPropsToShowDetail, showDetail: true })
        }

      },
      // style: {
      //   background: '#dbe1ec',
      //   color:  'black',
      // }
    }
  }
  render() {
    const { user } = this.props.auth
    let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
    var self = this;
    const { avaiBalances, pages, loading, pagesize } = this.state;
    return (
      <div className="panel-body">

        <div className="col-md-12" style={{ marginBottom: "20px" }}>
          <h5>{this.props.strings.custodycd}</h5>
          {/* <div className="col-xs-2"><input type="text" onKeyUp={this.search.bind(this)} className="form-control" placeholder="081209381" ref="SHTKGD" /></div> */}
          <div className="col-xs-2 customSelect2">
            <Select.Async
              name="form-field-name"
              disabled={isCustom}
              placeholder={this.props.strings.custodycd}
              loadOptions={this.getOptions.bind(this)}
              value={this.state.CUSTODYCD}
              onChange={this.onChange.bind(this)}
              id="CBcustodycdCCQ"
            />
          </div>
          <h5 >{this.props.strings.vfmcode}</h5>
          {/* <div className="col-xs-2"><input type="text" onKeyUp={this.search.bind(this)} className="form-control" placeholder="VFMVF1" ref="MaCCQ" /></div> */}
          <div className="col-xs-2 customSelect2">
            <Select.Async
              name="form-field-name"
              placeholder={this.props.strings.vfmcode}
              loadOptions={this.getOptionsSYMBOL.bind(this)}
              value={this.state.CODEID}
              onChange={this.onChangeSYMBOL.bind(this)}
              id="CBvfmcodeCCQ"
            />
          </div>

          <input onClick={this.search.bind(this)} type="button" defaultValue={this.props.strings.btnSearch} className="btn btndangeralt" id="btnSearch" />
          {/* <input onClick={this.resetTable.bind(this)} type="button" defaultValue="Làm mới" className="btn btn-primary" /> */}
        </div>


        <div className="col-md-12 customize-react-table ">
          <ReactTable
            columns={[

              {
                Header: props => <div className="">{this.props.strings.vfmcode}</div>,
                id: "SYMBOL",
                accessor: "SYMBOL",
                Cell: ({ value }) => {
                  return (
                    <span >
                      {value}
                    </span>)
                },
                width: 93
              },
              {
                Header: props => <div className="">{this.props.strings.sum}</div>,
                id: "BALQTTY",
                accessor: "BALQTTY",
                Cell: ({ value }) => {
                  return (
                    <span style={{ float: 'right', paddingRight: '5px' }}>
                      <NumberInput decimalScale={2} value={value} displayType={'text'} thousandSeparator={true} />
                    </span>)
                },
                width: 135
              },
              {
                Header: props => <div className="">{this.props.strings.available}</div>,
                id: "AVLQTTY",
                accessor: "AVLQTTY",
                Cell: ({ value }) => {
                  return (
                    <span style={{ float: 'right', paddingRight: '5px' }}>
                      <NumberInput decimalScale={2} value={value} displayType={'text'} thousandSeparator={true} />
                    </span>)
                },
                width: 160
              },
              {
                Header: props => <div className="">SIP</div>,
                id: "AVLTRADESIP",
                accessor: "AVLTRADESIP",
                Cell: ({ value }) => {
                  return (
                    <span style={{ float: 'right', paddingRight: '5px' }}>
                      <NumberInput decimalScale={2} value={value} displayType={'text'} thousandSeparator={true} />
                    </span>)
                },
                width: 160
              },
              {
                Header: props => <div className="">{this.props.strings.buyvalue}</div>,
                id: "BUYAMT",
                accessor: "BUYAMT",
                Cell: ({ value }) => {
                  return (
                    <span style={{ float: 'right', paddingRight: '5px' }}>
                      <NumberInput decimalScale={2} value={value} displayType={'text'} thousandSeparator={true} />
                    </span>)
                },
                width: 160
              },
              {
                Header: props => <div className="">{this.props.strings.navvalue}</div>,
                id: "CURRAMT",
                accessor: "CURRAMT",
                Cell: ({ value }) => {
                  return (
                    <span style={{ float: 'right', paddingRight: '5px' }}>
                      <NumberInput decimalScale={2} value={value} displayType={'text'} thousandSeparator={true} />
                    </span>)
                },
                width: 170
              },
              {
                Header: props => <div className="wordwrap">{this.props.strings.profitandloss}</div>,
                id: "COT9",
                accessor: "COT9",
                Cell: ({ value }) => {
                  return (
                    <span style={{ float: 'right', paddingRight: '5px' }}>
                      <NumberInput decimalScale={2} value={value} displayType={'text'} thousandSeparator={true} />
                    </span>)
                },
                width: 120
              },
              {
                Header: props => <div className="wordwrap">{this.props.strings.percentprofitandloss}</div>,
                id: "COT10",
                accessor: "COT10",
                Cell: ({ value }) => {
                  return (
                    <span style={{ float: 'right', paddingRight: '5px' }}>
                      <NumberInput value={value} decimalScale={2} displayType={'text'} thousandSeparator={true} />
                    </span>)
                },
                width: 126
              },
            ]}
            getTheadTrProps={() => {
              return {
                className: 'head'
              }
            }}
            manual
            style={{
              maxHeight: "300px" // This will force the table body to overflow and scroll, since there is not enough room
            }}
            manual
            filterable
            pages={pages}
            onFetchData={this.fetchData}
            data={avaiBalances}
            getTrProps={this.onRowClick.bind(this)}
            loadingText="Đang tải..."
            previousText={<i className="fas fa-backward"></i>}
            nextText={<i className="fas fa-forward"></i>}
            ofText="/"
            defaultPageSize={pagesize}
            className="-striped -highlight"
          />
        </div>

        <ModalChiTietSoDu showModal={this.state.showDetail} sendPropsToShowDetail={this.state.sendPropsToShowDetail} />
      </div>
    )
  }
}
const stateToProps = state => ({
  language: state.language.language,
  auth: state.auth
});
const decorators = flow([
  connect(stateToProps),
  translate('SoDuHienCo')
]);
module.exports = decorators(SoDuHienCo);
//module.exports = connect(function (state) {
  //return { list: state.datLenh.searchListSoDuHienCo, auth: state.auth };
//})(SoDuHienCo);
