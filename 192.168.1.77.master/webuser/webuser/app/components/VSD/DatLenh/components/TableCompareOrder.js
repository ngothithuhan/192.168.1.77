import React from 'react'
import RestfulUtils from 'app/utils/RestfulUtils'
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import { toast } from 'react-toastify';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import {
  DefaultPagesize, SRTYPE_SW, COLORSW, SRTYPE_NR, COLORNR, COLORNS, getExtensionByLang,
  EVENT, IMGMAXW, IMGMAXH, MAXSIZE_PDF
} from '../../../../Helpers';
import NumberInput from 'app/utils/input/NumberInput';
import ModalDialog from 'app/utils/Dialog/ModalDialog'
import { emitter } from 'app/utils/emitter';
import ModalCreateUploadOriginalOrder from './ModalCreateUploadOriginalOrder'
const Compress = require('compress.js');

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
      SIGN_IMG: null,
      SIGN_IMG_DESC: "",
      showModalCreateUploadOriginalOrder: false,
      err_msg_upload: {},
      urlPreviewPDF: "",
    }

    this.listenToTheEmitter();
  }

  listenToTheEmitter() {
    console.log(">>>> placeorder run listen emitter 000")
    emitter.on(EVENT.CANCEL_ORDER_IF_TIMEOUT_SIP, async (dataParent) => {
      console.log(">>>> placeorder run listen emitter 111 listen event data: orderid", dataParent.ORDERID)
      console.log(">>>> placeorder run listen emitter 222  data emit receive: data", dataParent)
      // await this.fetchData(this.state);
      console.log(">>>> placeorder run listen emitter 222-fetch newest data")

      if (dataParent && dataParent.ORDERID) {
        let { data } = this.state; //data của table sổ lệnh react (lưu memory)
        console.log(">>>> placeorder run listen emitter 333 data table sổ lệnh react: table", data);

        let row = data.find(item => item.ORDERID === dataParent.ORDERID);
        // let row = undefined;

        console.log(">>>> placeorder run listen emitter 444 data row need delete: row", row)

        if (row && row.ORDERID) {
          console.log(">>>> placeorder run listen emitter 555 do cancel order normal, data row: ", row)
          //hủy lệnh
          this.props.eventDelete(row);
        } else {
          console.log(">>>> placeorder run listen emitter 666 do cancel order build row, data row: ", row)

          //trong trường hợp lệnh vừa đặt chưa đc load lên memory, cần build inputs để hủy lệnh
          row = this.buildCurrentRow(dataParent);
          console.log(">>>> placeorder run listen emitter 777 do cancel order build row, data row: ", row)

          this.props.eventDelete(row);
        }
      }
    });
  }

  //trong trường hợp sổ lệnh chưa đc load lên memory, cần tạo 1 row data chuẩn với api hủy lệnh -> hủy lệnh
  buildCurrentRow = (dataParent) => {
    return {
      CUSTODYCD: dataParent.CUSTODYCD && dataParent.CUSTODYCD.value ? dataParent.CUSTODYCD.value : '',
      SRTYPE: dataParent.SRTYPE ? dataParent.SRTYPE : '',
      CODEID: dataParent.CODEID && dataParent.CODEID.value ? dataParent.CODEID.value : '',
      CODEID_OBJECT: dataParent.CODEID ? dataParent.CODEID : '',
      SEDTLID: dataParent.SEDTLID ? dataParent.SEDTLID : '',
      FEEID: dataParent.FEEID ? dataParent.FEEID : '',
      SWID: dataParent.SWID ? dataParent.SWID : '',
      SWCODEID: dataParent.SWCODEID ? dataParent.SWCODEID : '',
      ORDERID: dataParent.ORDERID ? dataParent.ORDERID : '',
      EXECTYPE: dataParent.SRTYPE ? dataParent.SRTYPE : '',
      ORDERVALUE: dataParent.AMOUNT && dataParent.AMOUNT.value ? dataParent.AMOUNT.value : '',
      SPCODE: '',
      CYCLE: dataParent.TRADINGCYCLE && dataParent.TRADINGCYCLE.value ? dataParent.TRADINGCYCLE.value : '',
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
  refresh() {
    this.setState({
      SIGN_IMG: null,
      SIGN_IMG_DESC: "",
      err_msg_upload: {},
      urlPreviewPDF: "",
    })
  }
  eventEdit(row) {
    this.props.eventEdit(row)
  }
  eventCancel(row) {
    this.props.eventDelete(row, false, this.state.SIGN_IMG, this.state.SIGN_IMG_DESC)
    this.refresh();
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
        this.eventEdit(this.state.datarow)
      // this.props.eventEdit(this.state.datarow)
    }
    else {
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

  openModalCreateUploadOriginalOrder = () => {
    this.setState({ showModalCreateUploadOriginalOrder: true })
  }
  closeModalCreateUploadOriginalOrder = () => {
    this.setState({ showModalCreateUploadOriginalOrder: false })
  }
  _handleSIGNIMGDESCChange = e => {
    this.setState({ SIGN_IMG_DESC: e.target.value })
  }
  _handleSIGNIMGChange = e => {
    e.preventDefault();
    let that = this;
    let reader = new FileReader();
    const compress = new Compress();
    const files = [...e.target.files];
    let file = e.target.files[0];
    let urlPreviewPDF = '';

    let isPDF = file.type === 'application/pdf' ? true : false;
    if (isPDF === true) {
      if (file.size > MAXSIZE_PDF) {
        let error = {
          color: 'red',
          contentText: this.props.strings.errorSizePDF
        }
        this.setState({ err_msg_upload: error, urlPreviewPDF: '', SIGN_IMG: null })
        return;
      } else {
        urlPreviewPDF = URL.createObjectURL(file)
      }
    }
    if (file.type !== 'image/jpeg'
      && file.type !== 'image/png'
      && file.type !== 'application/pdf') {
      console.log('this.props.strings.errorFileType:', this.props.strings.errorFileType)
      let error = {
        color: 'red',
        contentText: this.props.strings.errorFileType
      }
      this.setState({ err_msg_upload: error, urlPreviewPDF: '', SIGN_IMG: null })
    }
    else {
      let error = { color: 'red', contentText: '' }
      this.setState({ err_msg_upload: error, urlPreviewPDF: '', SIGN_IMG: null })

      //luồng xử lý preview ảnh 
      if (isPDF === false) {
        reader.onloadend = () => {
          compress.compress(files, {
            size: 0.2, // the max size in MB, defaults to 2MB
            quality: 0.75, // the quality of the image, max is 1,
            maxWidth: 1920, // the max width of the output image, defaults to 1920px
            maxHeight: 1920, // the max height of the output image, defaults to 1920px
            resize: true, // defaults to true, set false if you do not want to resize the image width and height
          }).then((results) => {
            const img1 = results[0]
            const base64str = img1.data
            const imgPrefix = img1.prefix
            const dataBase64 = imgPrefix + base64str
            var tempImg = new Image();
            var MAX_WIDTH = IMGMAXW;
            var MAX_HEIGHT = IMGMAXH;
            var tempW = tempImg.width;
            var tempH = tempImg.height;
            if (tempW > tempH) {
              if (tempW > MAX_WIDTH) {
                tempH *= MAX_WIDTH / tempW;
                tempW = MAX_WIDTH;
              }
            } else {
              if (tempH > MAX_HEIGHT) {
                tempW *= MAX_HEIGHT / tempH;
                tempH = MAX_HEIGHT;
              }
            }
            tempImg.src = dataBase64
            tempImg.onload = function () {
              var canvas = document.createElement("canvas");
              canvas.width = tempW;
              canvas.height = tempH;
              var ctx = canvas.getContext("2d");
              ctx.drawImage(this, 0, 0, tempW, tempH);
              that.state.SIGN_IMG = dataBase64;
              that.setState(that.state);
            };
          })
        };
        reader.readAsDataURL(file);
      } else {
        //luồng xử lý file preview pdf
        that.setState({
          urlPreviewPDF: urlPreviewPDF,
        })
        reader.readAsDataURL(file);
        reader.onload = function () {
          that.setState({
            ...that.state,
            SIGN_IMG: reader.result
          })
        };
        reader.onerror = function (error) {
          error = {
            color: 'red',
            contentText: 'Đã có lỗi xảy ra, vui lòng thử lại sau'
          }
          that.setState({
            ...that.state,
            urlPreviewPDF: '',
            SIGN_IMG: null,
            err_msg_upload: error
          })
        };
      }
    }
  };

  render() {
    let { data, pagesize, pages } = this.state
    let that = this;
    const { user } = this.props.auth
    let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
    const columns = [
      {
        Header: props => <div className="">  </div>,
        minWidth: 50,
        sortable: false,
        style: { textAlign: 'center' },
        Cell: (row) => (
          <div className="table-compare-order-btn-container">
            {/* {
              row.original.ISCANCEL == 'Y' &&
              <span
                id={"btnCancel" + row.index}
                onClick={this.checkConfirm.bind(this, "delete", row.original)}
                className="table-compare-order-btn-cancel"
              >
                {this.props.strings.cancel}
              </span>
            }

            {
              row.original.ISAMEND != 'Y' &&
              <span
                id={"btnEdit" + row.index}
                onClick={this.eventEdit.bind(this, row.original)}
                className="table-compare-order-btn-edit"
              >
                {this.props.strings.edit}
              </span>
            } */}

            <div>
              {row.original.ISAMEND == 'Y' ? <span id={"btnEdit" + row.index} onClick={this.checkConfirm.bind(this, "edit", row.original)} className="glyphicon glyphicon-pencil"></span> : null}
              {row.original.ISCANCEL == 'Y' && !isCustom ? <span id={"btnCancel" + row.index} onClick={this.checkConfirm.bind(this, "delete", row.original)} className="glyphicon glyphicon-remove" style={{ color: "red", marginLeft: "5px" }}></span> : null}
            </div>
          </div>

        ),
        Filter: ({ filter, onChange }) =>
          null
      },
      {
        Header: props => <div className="">  </div>,
        minWidth: 70,
        sortable: false,
        style: { textAlign: 'center' },
        Cell: (row) => (
          <div className="table-compare-order-btn-container">
            <button
              type="button"
              className="table-compare-order-btn-detail"
              onClick={this.eventViewDetail.bind(this, row.original)}
            >
              {this.props.strings.detail}
            </button>
          </div>

        ),
        Filter: ({ filter, onChange }) =>
          null
      },

      {
        Header: props => <div className="">{this.props.strings.custodycd}</div>,
        id: "CUSTODYCD",
        accessor: "CUSTODYCD",
        // show: !isCustom,
        minWidth: 102
      },

      {
        Header: props => <div className="">{this.props.strings.parentorderid}</div>,
        id: "SPID",
        accessor: "SPID",
        minWidth: 146
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
        minWidth: 105
      },
      {
        Header: props => <div className="">{this.props.strings.symbol}</div>,
        id: "SYMBOL",
        accessor: "SYMBOL",
        minWidth: 81
      },
      {
        Header: props => <div className="">{this.props.strings.productType}</div>,
        id: "PRODUCTTYPE",
        accessor: "PRODUCTTYPE",
        minWidth: 105
      },
      {
        Header: props => <div className="">{this.props.strings.feeid}</div>,
        id: "FEEID",
        accessor: "FEEID",
        minWidth: 150
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
        minWidth: 89
      },
      {
        Header: props => <div className="">{this.props.strings.statusparent}</div>,
        id: getExtensionByLang("STATUS_DESC", this.props.language),
        accessor: getExtensionByLang("STATUS_DESC", this.props.language),
        minWidth: 140,
        Cell: ({ value }) => (
          <span className="col-center">
            {value}
          </span>
        ),

      },
      {
        Header: props => <div className="">{this.props.strings.begindate}</div>,
        accessor: 'BEGINDATE',
        minWidth: 100,
        Cell: ({ value }) => (
          <span className="col-center">
            {value}
          </span>
        ),

      },
      {
        Header: props => <div className="">{this.props.strings.time}</div>,
        id: "TXTIME",
        accessor: "TXTIME",
        minWidth: 130
      },
      {
        Header: props => <div className="">{this.props.strings.username}</div>,
        id: "USERNAME",
        accessor: "USERNAME",
        minWidth: 154
      },

      {
        Header: props => <div className="">{this.props.strings.feedbackmsg}</div>,
        id: "FEEDBACKMSG",
        accessor: "FEEDBACKMSG",
        minWidth: 250
      },
      {
        Header: props => <div className="wordwrap">{this.props.strings.VSDSTATUS}</div>,
        id: "VSDSTATUS",
        accessor: "VSDSTATUS",
        minWidth: 250
      },
      {
        Header: props => <div className="wordwrap">{this.props.strings.TERMMISS}</div>,
        id: "TERMMISS",
        accessor: "TERMMISS",
        minWidth: 100
      },
      {
        Header: props => <div className="wordwrap">{this.props.strings.ipMac}</div>,
        id: "ipMac",
        accessor: "ipMac",
        minWidth: 100
      },

    ];

    return (

      <div className="panel-body table-compare-order-container">
        <div className="col-md-12 ">
          {/* <h5><b>{this.props.titleTable}</b></h5> */}
          <h5 className="highlight" style={{ fontWeight: "bold", fontSize: "13px", float: "right" }}> <span className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
            <span className="ReloadButton" onClick={this.reloadDataTable.bind(this)}><i className="fas fa-sync-alt"></i></span>
          </h5>
        </div>
        <div className="col-md-12 forFireFox customize-react-table so-lenh-dau-tu-dinh-ki" >
          <ReactTable
            columns={columns}
            manual
            data={data}
            onFetchData={this.fetchData}
            defaultPageSize={pagesize}
            pages={pages}
            className="-striped -highlight"
            // pivotBy={["CUSTODYCD"]}
            filterable
            // style={{
            //   maxHeight: "400px"
            // }}
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

          <ModalDialog
            confirmPopup={this.confirmPopup.bind(this)}
            ACTION={this.state.ACTION}
            data={this.state.datarow}
            showModalDetail={this.state.showModalDetail}
            closeModalDetail={this.closeModalDetail.bind(this)}
            SIGN_IMG={this.state.SIGN_IMG}
            isCustom={isCustom}
            openModalCreateUploadOriginalOrder={this.openModalCreateUploadOriginalOrder.bind(this)}
          />

          {/* Modal hiển thị ảnh/file Upload phiếu lệnh gốc */}
          <ModalCreateUploadOriginalOrder
            showModal={this.state.showModalCreateUploadOriginalOrder}
            closeModal={this.closeModalCreateUploadOriginalOrder.bind(this)}
            SIGN_IMG={this.state.SIGN_IMG}
            SIGN_IMG_DESC={this.state.SIGN_IMG_DESC}
            urlPreviewPDF={this.state.urlPreviewPDF}
            err_msg_upload={this.state.err_msg_upload}
            handleSIGNIMGChange={this._handleSIGNIMGChange}
            onDescChange={this._handleSIGNIMGDESCChange}
          />

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
