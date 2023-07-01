import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
// import ModalCreateUploadOriginalOrder from './components/ModalCreateUploadOriginalOrder'
import ModalManagerUploadOriginalOrder from './components/ModalManagerUploadOriginalOrder'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import Select from 'react-select'
import 'react-select/dist/react-select.css';
import RestfulUtils from 'app/utils/RestfulUtils';
import NumberFormat from 'react-number-format';
import NumberInput from 'app/utils/input/NumberInput'
import { DefaultPagesize, getExtensionByLang, getRowTextTable, getPageTextTable } from 'app/Helpers';
import ReactTable from 'react-table'
import { Col, FormControl, Checkbox } from 'react-bootstrap';
import { ButtonAdd, ButtonDelete, ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import CommonUtil from 'api/common/CommonUtil.js';

class ManagerUploadOriginalOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CUSTODYCD: { label: "", value: "" },
      DTAccInfor: {},
      DTUpload: [],
      DTUploadDetail: {},
      pages: 1,
      pagesize: DefaultPagesize,
      keySearch: {},
      sortSearch: {},
      page: 1,
      checkedAll: false,
      checkedAllDisabled: true,
      selectedRows: new Set(),
      showModal: false,
      showModalEditOrDelete: false,
      ACTIONEditOrDelete: '',
      ModalAction: '',
      loading: false,
    };
  }
  componentDidMount() {
    this.seacch("ALL", "SEARCH")
  }
  componentWillReceiveProps(nextProps) {
  }
  getOptions(input) {
    return RestfulUtils.post('/account/search_all', { key: input })
      .then((res) => {
        const { user } = this.props.auth
        let isCustom = user && user.ISCUSTOMER == 'Y';
        var data = [];
        if (isCustom) {
          var defaultCustodyCd = this.props.auth.user.USERID;
          data = [{ label: defaultCustodyCd, value: defaultCustodyCd }];
        } else {
          data = res;
        }
        return { options: data };
      })
  }
  async getInforAccount(CUSTODYCD) {
    let self = this
    let v_objname = this.props.datapage ? this.props.datapage.OBJNAME : '';
    self.setState({ DTAccInfor: {} });
    await RestfulUtils.post('/account/get_generalinfor', { CUSTODYCD: CUSTODYCD, OBJNAME: v_objname }).then((resData) => {
      if (resData.EC == 0) {
        self.setState({ DTAccInfor: resData.DT });
      } else {
        self.setState({ DTAccInfor: {} });
      }
    });
  }
  async getListUpload(CUSTODYCD, ACTION) {
    let self = this
    self.setState({ DTUpload: [], selectedRows: new Set() });
    let obj = {
      CUSTODYCD: CUSTODYCD,
      STATUS: "A",
      STATUSDOWNLOAD: "ALL",
      OBJNAME: this.props.datapage ? this.props.datapage.OBJNAME : '',
      language: this.props.language ? this.props.language : "vie",
      pagesize: self.state.pagesize,
      page: self.state.page,
      keySearch: self.state.keySearch,
      sortSearch: self.state.sortSearch,
    }
    await RestfulUtils.post('/order/get_list_manager_originalorder', obj).then((resData) => {
      if (resData.EC == 0) {
        self.setState({
          DTUpload: resData.DT ? resData.DT.data : [],
          pages: resData.numOfPages,
          keySearch: self.state.keySearch,
          page: self.state.page,
          pagesize: self.state.pagesize,
          sortSearch: self.state.sortSearch
        });
      } else {
        self.setState({ DTUpload: [] });
      }
    });
    self.updateCheckbox(ACTION)
  }
  seacch(ACTION) {
    this.getListUpload("ALL", ACTION)
  }
  async onChange(e) {
    var self = this;
    this.setState({ DTAccInfor: {}, DTUpload: [], selectedRows: new Set(), CUSTODYCD: { label: "", value: "" } });
    if (e) {
      this.setState({ CUSTODYCD: e });
      this.getInforAccount(e.label);
      this.getListUpload(e.label, "SEARCH");
    }
  }
  async loadData(pagesize, page, keySearch, sortSearch, columns) {
    let self = this
    self.setState({ DTUpload: [], selectedRows: new Set() });
    let obj = {
      CUSTODYCD: "ALL",
      STATUS: "A",
      OBJNAME: this.props.datapage ? this.props.datapage.OBJNAME : '',
      language: this.props.language ? this.props.language : "vie"
    }
    await RestfulUtils.post('/order/get_list_manager_originalorder', { ...obj, pagesize, page, keySearch, sortSearch }).then(resData => {
      if (resData.EC === 0) {
        self.setState({
          DTUpload: resData.DT ? resData.DT.data : [],
          pages: resData.numOfPages,
          keySearch,
          page,
          pagesize,
          sortSearch
        });
      }
    })
  }
  fetchData(state, instance) {
    if (this.state.loading) {
      new Promise((resolve, reject) => {
        let { pageSize, page, filtered, sorted } = state;
        setTimeout(() => resolve(this.loadData(pageSize, page + 1, filtered, sorted, instance.props.columns)), 500);
      })
    }
    this.setState({ loading: true })
  }
  // onRowClick(state, rowInfo, column, instance) {
  //   var that = this;
  //   return {
  //     onDoubleClick: e => {
  //       that.state.EditAUTOID = rowInfo.original.AUTOID;
  //       that.state.ModalUploadAction = 'V';
  //       this.state.showModal = true;
  //       that.setState(this.state);
  //     },
  //     style: {
  //       background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.AUTOID) ? '#dbe1ec' : '',
  //       color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.AUTOID) ? 'black' : '',
  //     }
  //   }
  // }
  handleChangeAll(evt) {
    var that = this;
    this.state.checkedAll = evt.target.checked;
    // console.log("handleChangeAll.0:", this.state.checkedAll)
    if (evt.target.checked) {
      this.state.selectedRows.clear();
      if (this.state.DTUpload && this.state.DTUpload.length > 0) {
        // console.log("handleChangeAll.1:", this.state.DTUpload)
        this.state.DTUpload.map(function (item) {
          that.state.selectedRows.add(item.AUTOID);
        })
      }
    }
    else {
      // console.log("handleChangeAll.2:")
      this.state.selectedRows.clear();
    }
    this.setState(this.state);
  }
  handleChangeRow(row) {
    if (!this.state.selectedRows.has(row.original.AUTOID))
      this.state.selectedRows.add(row.original.AUTOID);
    else {
      this.state.selectedRows.delete(row.original.AUTOID);
    }
    // console.log("handleChangeAll.3:", this.state.selectedRows.size)
    if (this.state.selectedRows.size == this.state.DTUpload.length) {
      this.state.checkedAll = true
    }
    else {
      this.state.checkedAll = false
    }
    this.setState(this.state);
  }
  showModalUpload() {
    let ModalAction = 'ADD';
    let showModal = true;
    this.setState({ showModal, ModalAction });
  }
  showModalViewUpload(AUTOID, row) {
    let DTUploadDetail = {}
    let self = this
    this.state.DTUpload.map(function (event) {
      if (event.AUTOID == AUTOID) {
        DTUploadDetail = { ...self.state.DTAccInfor, ...event, }
        DTUploadDetail.LASTCHANGE = event.LASTCHANGE
        DTUploadDetail.NOTE = event.DESCRIPTION
      }
      return null
    })
    if (DTUploadDetail) {
      this.setState({
        showModalEditOrDelete: true,
        DTUploadDetail: DTUploadDetail,
        ACTIONEditOrDelete: "VIEW"
      })
    }
  }
  close() {
    this.setState({ showModal: false })
  }
  closeModalEditOrDelete() {
    this.setState({ showModalEditOrDelete: false })
  }
  onClickEdit(AUTOID) {
    let data = null
    data = this.state.DTUpload.filter(e => e.AUTOID === AUTOID);
    let DTUploadDetail = { ...this.state.DTAccInfor, ...data[0], }
    DTUploadDetail.LASTCHANGE = data[0].LASTCHANGE
    DTUploadDetail.NOTE = data[0].DESCRIPTION ? data[0].DESCRIPTION : ''
    this.setState({
      showModalEditOrDelete: true,
      DTUploadDetail: DTUploadDetail,
      ACTIONEditOrDelete: "EDIT"
    })
  }

  onClickDelete() {
    let self = this
    let { strings } = this.props;
    // console.log("delete:=> ", this.state.selectedRows, this.state.selectedRows.size)
    if (this.state.selectedRows.size === 0) {
      toast.warn(this.props.strings.Warn1, { position: toast.POSITION.BOTTOM_RIGHT })
    }
    else if (this.state.selectedRows.size === 1) {
      let data = null
      this.state.selectedRows.forEach((key, value, set) => {
        data = this.state.DTUpload.filter(e => e.AUTOID === value);
      })
      let DTUploadDetail = { ...this.state.DTAccInfor, ...data[0], }
      DTUploadDetail.LASTCHANGE = data[0].LASTCHANGE
      DTUploadDetail.NOTE = data[0].DESCRIPTION ? data[0].DESCRIPTION : ''
      this.setState({
        showModalEditOrDelete: true,
        DTUploadDetail: DTUploadDetail,
        ACTIONEditOrDelete: "DELETE"
      })
    }
    else {
      let max_count = this.state.selectedRows.size
      let count = 0
      this.state.selectedRows.forEach((key, value, set) => {
        let item = this.state.DTUpload.filter(e => e.AUTOID === value);
        let obj = {
          ACTION: "DELETE",
          AUTOID: item[0].AUTOID,
          CUSTODYCD: item[0].CUSTODYCD,
          TYPE: item[0].TYPE,
          IMGSIGN: "",
          NOTE: "Delete file upload",
          OBJNAME: this.props.datapage ? this.props.datapage.OBJNAME : '',
          language: this.props.language ? this.props.language : "vie",
        }
        RestfulUtils.post('/order/prc_sy_mt_originalorder', obj)
          .then(res => {
            if (res.EC == 0) {
              toast.success(strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
            }
            else {
              toast.error(res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
            }
            count++
            //load lại dữ liệu table sau khi thực hiện submit dòng cuối cùng
            if (count == max_count) {
              self.seacch("DELETE")
            }
          })
      })
    }
  }
  updateCheckbox(ACTION) {
    let { DTUpload } = this.state
    if (ACTION == "ADD") {
      if (DTUpload && DTUpload.length == 0) {
        this.setState({ checkedAll: false, checkedAllDisabled: true })
      }
      else {
        this.setState({ checkedAll: false, checkedAllDisabled: false })
      }
    }
    else if (ACTION == "DELETE") {
      if (DTUpload && DTUpload.length == 0) {
        this.setState({ checkedAll: false, checkedAllDisabled: true })
      }
      else {
        this.setState({ checkedAll: false, checkedAllDisabled: false })
      }
    }
    else if (ACTION == "SEARCH") {
      if (DTUpload && DTUpload.length == 0) {
        this.setState({ checkedAll: false, checkedAllDisabled: true })
      }
      else {
        this.setState({ checkedAllDisabled: false })
      }
    }
  }
  downloadhandle(AUTOID) {
    let self = this
    let { strings } = this.props;
    let obj = {
      ACTION: "DOWNLOAD",
      AUTOID: AUTOID,
      OBJNAME: this.props.datapage ? this.props.datapage.OBJNAME : '',
      language: this.props.language ? this.props.language : "vie",
    }
    RestfulUtils.post('/order/prc_mt_download_originalorder', obj)
      .then(res => {
        if (res.EC == 0) {
          toast.success(strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
        }
        else {
          toast.error(res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
        }
        self.seacch("DELETE")
      })
  }
  render() {
    let self = this
    const { user } = this.props.auth
    let { strings, datapage, auth } = this.props;
    let { DTAccInfor, DTUpload, DTUploadDetail, pages, pagesize, CUSTODYCD } = this.state
    let ISCUSTODYCD = CUSTODYCD.label && CUSTODYCD.label != "" && CUSTODYCD.label != null && CUSTODYCD.label != undefined ? true : false
    let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
    return (
      <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">
        <div className="title-content">{strings.title}</div>
        {/* <div className="col-xs-12 mgt-10 customSelect">
          <div className="col-xs-6">
            <h5 className="col-xs-5"><b>{strings.custodycd}</b></h5>
            <div className="col-xs-7">
              <Select.Async
                disabled={isCustom}
                name="form-field-name"
                placeholder={strings.custodycd}
                loadOptions={this.getOptions.bind(this)}
                value={this.state.CUSTODYCD}
                onChange={this.onChange.bind(this)}
                cache={false}
              />
            </div>
          </div>
        </div>
        <div className="col-xs-12">
          <div className="col-xs-6">
            <h5 className="col-xs-5"><b>{strings.fullname}</b></h5>
            <div className="col-xs-7">
              <label className="form-control txtInput28" disabled >{DTAccInfor.FULLNAME} </label>
            </div>
          </div>
        </div>
        <div className="col-xs-12">
          <div className="col-xs-6">
            <h5 className="col-xs-5"><b>{strings.idcode}</b></h5>
            <div className="col-xs-7">
              <label className="form-control txtInput28" disabled >{DTAccInfor.IDCODE} </label>
            </div>
          </div>
        </div>
        <div className="col-xs-12">
          <div className="col-xs-6">
            <h5 className="col-xs-5"><b>{strings.iddate}</b></h5>
            <div className="col-xs-7">
              <label className="form-control txtInput28" disabled >{DTAccInfor.IDDATE} </label>
            </div>
          </div>
        </div>
        <div className="col-xs-12">
          <div className="col-xs-6">
            <h5 className="col-xs-5"><b>{strings.titleDetail}</b></h5>
          </div>
        </div>*/}
        <div className="col-md-12 btn-customer-crud" style={{ padding: "10px 0px 10px 0px" }} >
          <div style={{ marginLeft: "-15px" }} className="col-md-12">
            {/* <ButtonAdd disabled={!ISCUSTODYCD} data={this.props.datapage} onClick={this.showModalUpload.bind(this)} />
            <ButtonDelete disabled={!ISCUSTODYCD} style={{ marginLeft: "5px" }} onClick={this.onClickDelete.bind(this)} data={this.props.datapage} />*/}
            <h5 className="highlight" style={{ fontWeight: "bold", fontSize: "13px", float: "right" }}>
              <span className="ReloadButton" onClick={this.seacch.bind(this, "", "SEARCH")}><i className="fas fa-sync-alt"></i></span>
            </h5>
          </div>
        </div>

        <div className="col-xs-12 FixtableRT">
          <ReactTable
            columns={[
              // {
              //   Header: props => <div className=""><Checkbox checked={this.state.checkedAll} disabled={this.state.checkedAllDisabled} onChange={this.handleChangeAll.bind(this)} /></div>,
              //   id: "checkbox",
              //   Cell: (row) => (
              //     <div style={{ textAlign: "center" }}>
              //       <Checkbox style={{ textAlign: "center", marginLeft: "8px", marginBottom: "14px" }} checked={this.state.selectedRows.has(row.original.AUTOID)} onChange={this.handleChangeRow.bind(this, row)} inline />
              //       <span onClick={this.onClickEdit.bind(this, row.original.AUTOID)} className="glyphicon glyphicon-pencil"></span>
              //     </div>
              //   ),
              //   sortable: false,
              //   width: 80,
              //   Filter: ({ filter, onChange }) =>
              //     null
              // },
              {
                Header: props => <div className="">{strings.custodycd}</div>,
                accessor: "CUSTODYCD",
                width: 150,
                Cell: ({ value }) => (
                  <div className="col-left" style={{ float: "left" }}>{value}</div>
                )
              },
              {
                Header: props => <div className="">{strings.fullname}</div>,
                accessor: "FULLNAME",
                width: 200,
                Cell: ({ value }) => (
                  <div className="col-left" style={{ float: "left" }}>{value}</div>
                )
              },
              {
                Header: props => <div className="">{strings.idcode}</div>,
                accessor: "IDCODE",
                width: 120,
                Cell: ({ value }) => (
                  <div className="col-left" style={{ float: "left" }}>{value}</div>
                )
              },
              {
                Header: props => <div className="">{strings.download}</div>,
                accessor: "SIGNATURE",
                width: 120,
                Cell: (row) => {
                  let dataRow = row.original;
                  let isPDF = CommonUtil.isPDFBase64(dataRow.SIGNATURE)
                  return (
                    <div className="" style={{ float: "center", padding: "2px" }}>
                      {isPDF ?
                        <button id="download" style={{ width: "30px", marginTop: "-3px" }} class="btn"
                          onClick={this.downloadhandle.bind(this, row.original.AUTOID)}>
                          <a download href={dataRow.SIGNATURE} title='Download pdf document' >
                            <img style={{ width: "16px" }} src="../images/download.png" />
                          </a>
                        </button>
                        :
                        <button id="download" style={{ width: "30px", marginTop: "-3px" }} class="btn"
                          onClick={this.downloadhandle.bind(this, row.original.AUTOID)}>
                          <a href={row.original.SIGNATURE} download={"images_" + row.original.AUTOID + ".png"}>
                            <img style={{ width: "16px" }} src="../images/download.png" />
                          </a>
                        </button>

                      }

                    </div>
                  )
                }
              },
              // {
              //   Header: props => <div className="">{strings.typepaper}</div>,
              //   accessor: "TYPENAME",
              //   Cell: ({ value }) => (
              //     <div className="col-left" style={{ float: "left" }}>{value}</div>
              //   )
              // },
              {
                Header: props => <div className="">{strings.status}</div>,
                accessor: "STATUSDOWNLOADDESC",
                width: 150,
                Cell: ({ value }) => (
                  <div className="col-left" style={{ float: "left" }}>{value}</div>
                )
              },
              {
                Header: props => <div className="">{strings.dateupload}</div>,
                accessor: "LASTCHANGE",
                width: 150,
                Cell: ({ value }) => (
                  <div className="" style={{ float: "center" }}>{value}</div>
                )
              },
              {
                Header: props => <div className="">{strings.username}</div>,
                accessor: "USERNAME",
                width: 150,
                Cell: ({ value }) => (
                  <div className="col-left" style={{ float: "left" }}>{value}</div>
                )
              },
              {
                Header: props => <div className="">{strings.description}</div>,
                accessor: "DESCRIPTION",
                width: 300,
                Cell: ({ value }) => (
                  <div className="col-left" style={{ float: "left" }}>{value}</div>
                )
              },
              {
                Header: props => <div className="">{strings.detail}</div>,
                accessor: "detail",
                width: 120,
                Cell: (row) => (
                  <div className="" style={{ float: "center" }}> <button onClick={this.showModalViewUpload.bind(this, row.original.AUTOID, row.original)} className="btn btn-primary" >{strings.detail}</button></div>
                )
                // <button disabled={!ISCUSTODYCD} onClick={this.showModalUpload.bind(this)} className="btn btn-primary" ><span className="glyphicon glyphicon-plus-sign"></span>{strings.ADD}</button>
              }
            ]}
            getTheadTrProps={() => {
              return {
                className: 'head'
              }
            }}
            manual
            filterable
            pages={pages} // Display the total number of pages
            // loading={loading} // Display the loading overlay when we need it
            onFetchData={this.fetchData.bind(this)}
            data={DTUpload}
            style={{
              maxHeight: "600px" // This will force the table body to overflow and scroll, since there is not enough room
            }}
            noDataText={this.props.strings.textNodata}
            pageText={getPageTextTable(this.props.language)}
            rowsText={getRowTextTable(this.props.language)}
            previousText={<i className="fas fa-backward"></i>}
            nextText={<i className="fas fa-forward"></i>}
            loadingText="Ðang tải..."
            ofText="/"
            // getTrProps={this.onRowClick.bind(this)}
            defaultPageSize={this.state.pagesize}
            className="-striped -highlight"
          />
        </div>
        {/* <ModalCreateUploadOriginalOrder OBJNAME={datapage.OBJNAME} ACTION={this.state.ModalAction}
          CUSTODYCD={this.state.CUSTODYCD ? this.state.CUSTODYCD.label : ""}
          DTAccInfor={DTAccInfor}
          showModalDetail={this.state.showModal}
          closeModalDetail={this.close.bind(this)}
          refreshList={this.seacch.bind(this, self.state.ModalAction)}
        />*/}
        <ModalManagerUploadOriginalOrder OBJNAME={datapage.OBJNAME} ACTION={this.state.ACTIONEditOrDelete}
          DTUploadDetail={DTUploadDetail}
          showModalDetail={this.state.showModalEditOrDelete}
          closeModalDetail={this.closeModalEditOrDelete.bind(this)}
          refreshList={this.seacch.bind(this, self.state.ModalAction)}
        />

      </div>
    )
  }
}
ManagerUploadOriginalOrder.defaultProps = {
  strings: {
  },
};

const stateToProps = state => ({
  veryfiCaptcha: state.veryfiCaptcha,
  notification: state.notification,
  language: state.language.language,
  auth: state.auth
});

const decorators = flow([
  connect(stateToProps),
  translate('ManagerUploadOriginalOrder')
]);

module.exports = decorators(ManagerUploadOriginalOrder);
