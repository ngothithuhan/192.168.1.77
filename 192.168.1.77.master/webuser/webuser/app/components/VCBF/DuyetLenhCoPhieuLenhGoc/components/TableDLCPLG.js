import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import { ButtonAdd, ButtonExport, ButtonReject ,ButtonApprove} from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import NumberInput from 'app/utils/input/NumberInput';
import { showNotifi } from 'app/action/actionNotification.js';

// import NumberFormat from 'react-number-format';
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from '../../../../Helpers';
import ModalDetailOriginalOrder from './ModalDetailOriginalOrder';

import './TableDLCPLG.scss';

class TableDLCPLG extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //saleid: 'ALL',
            pages: null,
            loading: true,
            checkedAll: false,
            checkboxChecked: false,
            selectedRows: new Set(),
            rowSelected: [],
            unSelectedRows: [],
            showModalAccess: false,
            showModalReview: false,
            CUSTID_DETAIL: '',
            pagesize: DefaultPagesize,
            keySearch: {},
            sortSearch: {},
            page: 1,
            lang: this.props.language,
            dataAll :[],
            filteredData: [],
            datamock: [{
                CUSTODYCD: "1",
                SYMBOL: "2",
                SRTYPE_DESC: "3",
                PRODUCT: "4",
                ORDAMT: "5",
                STATUS_DESC: "6",
                MATCHAMT: "7",
                EXAMT: "8",
                MISSAMT: "9",
                AMOUNT: "10",
            }],
            SIGN_IMG: null,
            SIGN_IMG_DESC: "",
            showModalDetailOriginalOrder: false
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.lang != nextProps.currentLanguage) {
            this.state.lang = nextProps.currentLanguage
            this.state.loading = true
            this.refReactTable.fireFetchData()
        }
        if (nextProps.isrefresh) {
            this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch);
        }
    }
    componentWillMount() {
        this.refresh();

    }
    handleAdd(evt) {
        this.props.showModalDetail("add");
    }
    handlEdit(data) {
        var that = this;
        that.props.showModalDetail("update", data);
       
    }
    viewImage(row) {
        let data = {
            p_orderid: row.ORDERID,
            language: this.props.language,
            OBJNAME: this.props.OBJNAME,
        }
        RestfulUtils.posttrans('/fund/getoriginalorderimage', { data }).then((resData) => {
            if (resData.EC == 0) {
                let data = resData.DT.data;
                if(data.length > 0) {
                    this.setState({
                        SIGN_IMG: data[0].SIGNATURE,
                        SIGN_IMG_DESC: data[0].DESCRIPTION
                    }, () => {
                        this.openModalDetailOriginalOrder();
                    })
                } else {
                    this.props.dispatch(showNotifi({ type: "error", header: "", content: this.props.strings.noimage }));
                }
            }
        })
    }
    openModalDetailOriginalOrder = () => {
        this.setState({ showModalDetailOriginalOrder: true })
    }
    closeModalDetailOriginalOrder = () => {
        this.setState({ showModalDetailOriginalOrder: false })
    }
    handleChangeALL(evt) {
        var that = this;
        this.setState({
            checkedAll: evt.target.checked,
            selectedRows: new Set(),
            unSelectedRows: [],
            rowSelected :[]
        });
        if (evt.target.checked) {
            that.state.filteredData.map(function (item) {
                if (!that.state.selectedRows.has(item.ORDERID)) {
                    that.state.unSelectedRows.push(item.ORDERID);
                    that.state.selectedRows.add(item.ORDERID);
                }
            })
            that.setState({ selectedRows: that.state.selectedRows,rowSelected:that.state.rowSelected,  unSelectedRows: that.state.unSelectedRows })
        }
        else {
            that.state.unSelectedRows.map(function (item) {
                that.state.selectedRows.delete(item);
            })
            that.setState({ selectedRows: that.state.selectedRows, unSelectedRows: [] })
        }
    }
    
    handleChange(row) {
        //let data = this.state.data.filter(e => e.ORDERID === value);
        if (!this.state.selectedRows.has(row.original.ORDERID)){
            this.state.selectedRows.add(row.original.ORDERID);   
            this.state.rowSelected.push(row.original);
        }
        else {
            this.state.selectedRows.delete(row.original.ORDERID);
            var finalArr = this.state.rowSelected.filter(function(val) { return val.ORDERID != row.original.ORDERID; });
            this.state.rowSelected = finalArr;
        }
        this.setState({ selectedRows: this.state.selectedRows,rowSelected: this.state.rowSelected, checkedAll: false });
    }
   
    // onRowClick(state, rowInfo, column, instance) {
    //     var that = this;
    //     return {
    //         onDoubleClick: e => {

    //             that.props.showModalDetail("view", rowInfo.original)

    //         },
    //         style: {
    //             background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.ORDERID) ? '#dbe1ec' : '',
    //             color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.ORDERID) ? 'black' : '',
    //         }

    //     }
    // }
    fetchData(state, instance) {
        let colum = instance.props
        if (this.state.loading) {
            new Promise((resolve, reject) => {
                let { pageSize, page, filtered, sorted } = state;
                
                setTimeout(() => resolve(this.loadData(pageSize, page + 1, filtered, sorted, instance.props.columns)), 500);
            })
        }
        this.setState({ loading: true , colum :colum })
    }
    refresh() {
        let self = this
        this.loadData();
        // RestfulUtils.post('/srreconcile/fetchListReconcile', {  }).then((resData) => {
        //     if (resData.EC == 0) {
        //         self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord, dataALL: resData.DT.dataAll })
        //     } else {
        //         toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
        //     }
        // });
    }
    async loadData(pagesize, page, keySearch, sortSearch, columns) {
        let that = this
            let data = {
                p_orderid: 'ALL',
                language: this.props.language,
                OBJNAME: this.props.OBJNAME,
                p_custodycd: '',
                pagesize, 
                page, 
                keySearch, 
                sortSearch, 
                columns

            }
            RestfulUtils.posttrans('/fund/fetchUnconfirmOrder', {p_orderid: 'ALL',language: this.props.language,OBJNAME: this.props.OBJNAME,p_custodycd: '',pagesize, page, keySearch, sortSearch, columns }).then((resData) => {
                if (resData.EC == 0) {
                    that.setState({
                        data: resData.DT.data,
                        pages: resData.DT.numOfPages,
                        keySearch,
                        page,
                        pagesize,
                        sortSearch,
                        sumRecord: resData.DT.sumRecord,
                        colum: columns,
                        dataAll : resData.DT.dataAll,
                        filteredData: resData.DT.filteredData,
                        checkedAll: false,
                    });
                }
                else {
                }
        
    })
}

    refreshData = async () => {
        let result = await this.refresh();
        let { pagesize, page, keySearch, sortSearch } = this.state
        this.loadData(pagesize, page, keySearch, sortSearch);
    }
    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    reloadTable() {
        this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch)
    }
    reloadTable() {
        this.state.firstRender = true
        this.refReactTable.fireFetchData()
    }
    approve = () => {
        var { dispatch } = this.props;
        let self = this
        Promise.all(Array.from(this.state.selectedRows).map((value, idx) => {
            return new Promise((resolve, reject) => {
                let data = this.state.filteredData.filter(e => e.ORDERID === value);
                if (data && data.length > 0) {
                    let orderid = data[0].ORDERID
                    let custodycd = data[0].CUSTODYCD
                    RestfulUtils.post('/fund/approveOrder', {orderid: orderid, custodycd : custodycd, language: this.props.language,OBJNAME: this.props.OBJNAME})
                        .then(res => {
                            let success = (res.EC == 0);
                            success ? toast.success("Duyệt  thành công!", { position: toast.POSITION.BOTTOM_RIGHT })
                                : toast.error("Duyệt lỗi: " + res.EM, { position: toast.POSITION.BOTTOM_RIGHT });
                            resolve();
                            //this.loadData(pageSize, page + 1, filtered, sorted, this.state.colum)
                            this.reloadTable()
                        })
                }
            })

        })).then((data) => {
            this.reloadTable()
            //this.loadData(pageSize, page + 1, filtered, sorted, this.state.colum)
        })

    };
                
    render() {
        const { data, pages, loading, dataTest } = this.state;
        //this.state.rowSelected
        var that = this;
        return (
            <div className='table-dlcplg'>
                <ModalDetailOriginalOrder
                    showModal={this.state.showModalDetailOriginalOrder}
                    closeModal={this.closeModalDetailOriginalOrder.bind(this)}
                    SIGN_IMG={this.state.SIGN_IMG}
                    SIGN_IMG_DESC={this.state.SIGN_IMG_DESC}
                    handleSIGNIMGChange={this._handleSIGNIMGChange}
                    onDescChange={this._handleSIGNIMGDESCChange}
                />
                <div className="row">
                <div className="col-md-10 row">
                        {/* <div className="col-md-2">
                            <h5 className="highlight"><b>{this.props.strings.CUSTODYCD}</b></h5>
                        </div>
                        <div className="col-md-5 customSelect">
                            <Select.Async
                                name="form-field-name"
                                loadOptions={this.getOptions.bind(this)}
                                value={this.state.CUSTODYCD}
                                onChange={this.onChangeCUSTODYCD.bind(this)}
                                id="cbCUSTODYCD"
                                clearable={false}

                            />
                        </div> */}
                        <div style={{ paddingLeft: "3px" }} className="col-md-5">
                            {/* <Button style={{ fontSize: 12 }} bsStyle="success" className="pull-left" id="btnsubmit" onClick={this.search.bind(this)}>{this.props.strings.search}</Button> */}
                            <ButtonApprove style={{ marginRight: "5px" }} data={{ ISAPPROVE: "Y" }} onClick={this.approve} />
                            {/* <ButtonReject style={{ marginLeft: "5px" }} onClick={this.delete} data={this.props.datapage} /> */}
                            {/* <input type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" /> */}
                            <ButtonExport style={{ marginLeft: "5px" }} dataRows={data} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} HaveChk={true}/>
                            {/* <input style={{ marginLeft:20, fontSize: 12 }} type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" value={this.props.strings.submit} id="btnSubmit" />
                            <ButtonExport style={{ float: 'right', fontSize: 12 }} dataRows={this.state.dataALL} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} HaveChk={true} /> */}
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }} className="col-md-2 RightInfo">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}> <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                            <span className="ReloadButton" onClick={this.reloadTable.bind(this)}><i className="fas fa-sync-alt"></i></span>
                        </h5>
                    </div>

                </div>
                <div className="col-md-12" >
                    <ReactTable
                        columns={[
                            {
                                Header: props => <div className=" header-react-table">    <Checkbox checked={that.state.checkedAll} style={{ marginBottom: "14px", marginLeft: "8px" }} onChange={that.handleChangeALL.bind(that)} inline /></div>,
                                minWidth: 140,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div className="table-dlcplg-btn-container">
                                        <Checkbox style={{ textAlign: "center", marginTop: "-14px" }}
                                            checked={that.state.selectedRows.has(row.original.ORDERID)}
                                            onChange={that.handleChange.bind(that, row)} inline
                                        />
                                        <span onClick={that.handlEdit.bind(that, row.original)} className="glyphicon glyphicon-remove"></span>
                                        <button
                                            type="button"
                                            className="table-dlcplg-btn-detail"
                                            onClick={this.viewImage.bind(this, row.original)}
                                        >
                                            {this.props.strings.viewImage}
                                        </button>
                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ORDERID}</div>,
                                id: "ORDERID",
                                accessor: "ORDERID",
                                width: 140,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.SYMBOL}</div>,
                                id: "SYMBOL",
                                accessor: "SYMBOL",
                                width: 74,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.CUSTODYCD}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                width: 90,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.FULLNAME}</div>,
                                id: "FULLNAME",
                                accessor: "FULLNAME",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.IDCODE}</div>,
                                id: "IDCODE",
                                accessor: "IDCODE",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.IDDATE}</div>,
                                id: "IDDATE",
                                accessor: "IDDATE",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.IDPLACE}</div>,
                                id: "IDPLACE",
                                accessor: "IDPLACE",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.DBCODE}</div>,
                                id: "DBCODE",
                                accessor: "DBCODE",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("EXECTYPE_DESC", this.props.language)]}</div>,
                                id: getExtensionByLang("EXECTYPE_DESC", this.props.language),
                                accessor: getExtensionByLang("EXECTYPE_DESC", this.props.language),
                                width: 104,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.PRODUCTTYPE}</div>,
                                id: "PRODUCTTYPE",
                                accessor: "PRODUCTTYPE", 
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-right">
                                        <div className="col-left">{value}</div>
                                    </div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.FEEID}</div>,
                                id: "FEEID",
                                accessor: "FEEID", 
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-right">
                                        <div className="col-left">{value}</div>
                                    </div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ORDERVALUE}</div>,
                                id: "ORDERVALUE",
                                accessor: "ORDERVALUE", 
                                width: 110,
                                Cell: ({ value }) => (
                                    <div className="col-right">
                                        <NumberInput value={value} decimalScale={2} displayType={'text'} thousandSeparator={true} />
                                    </div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("DESC_STATUS", this.props.language)]}</div>,
                                //   id: "STATUS_DES",
                                //   accessor: "STATUS_DES",
                                id: getExtensionByLang("DESC_STATUS", this.props.language),
                                accessor: getExtensionByLang("DESC_STATUS", this.props.language),
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TRADINGDATE}</div>,
                                id: "TRADINGDATE",
                                accessor: "TRADINGDATE",
                                width: 83,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.USERNAME}</div>,
                                id: "USERNAME",
                                accessor: "USERNAME",
                                width: 160,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TXDATE}</div>,
                                id: "TXDATE",
                                accessor: "TXDATE",
                                width: 83,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TXTIME}</div>,
                                id: "TXTIME",
                                accessor: "TXTIME",
                                width: 69,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.SWSYMBOL}</div>,
                                id: "SWSYMBOL",
                                accessor: "SWSYMBOL",
                                width: 112,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },

                            // {
                            //     Header: props => <div className="wordwrap">Số hiệu lệnh VSD</div>,
                            //     id: "VSDORDERID",
                            //     accessor: "VSDORDERID",
                            //     width: 143,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },
                            
                        ]}
                        getTheadTrProps={() => {
                            return {
                                className: 'head'
                            }
                        }}
                        // getTrProps={(state, rowInfo, column, instance) => {
                        //     console.log('rowInfo',rowInfo)
                        //     return {
                        //         onClick: (e, t) => {
                        //             t.srcElement.classList.add('active')
                        //         },
                        //         style: {
                        //             background: rowInfo.row.selected ? 'green' : 'red',
                        //             color:'green'
                        //         }
                        //     }
                        // }}
                        manual
                        filterable
                        pages={pages} // Display the total number of pages
                        // loading={loading} // Display the loading overlay when we need it
                        onFetchData={this.fetchData.bind(this)}
                        data={data} // truyen data da co qua 
                        style={{
                            maxHeight: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                        }}
                        noDataText="No data"
                        pageText={getPageTextTable(this.props.language)}
                        rowsText={getRowTextTable(this.props.language)}
                        previousText={<i className="fas fa-backward"></i>}
                        nextText={<i className="fas fa-forward"></i>}
                        loadingText="Đang tải..."
                        ofText="/"
                        //getTrProps={this.onRowClick.bind(this)}
                        loadDataAgain={this.refresh.bind(this)} //load lai data cho luoi
                        defaultPageSize={this.state.pagesize}
                        className="-striped -highlight"
                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                    />
                </div>
            </div>
        );
    }
}
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    language: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('TableDLCPLG')
]);

module.exports = decorators(TableDLCPLG);

