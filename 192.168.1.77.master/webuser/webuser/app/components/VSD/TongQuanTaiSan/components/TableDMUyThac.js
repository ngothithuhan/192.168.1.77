import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getRowTextTable, getPageTextTable } from 'app/Helpers'
import { DataTableDMUyThac } from 'app/utils/MockData';
import ModalDetail from './ModalDetail';

class TableDMUyThac extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DataTableDMUyThac: [],
            pages: null,
            loading: true,
            checkedAll: false,
            checkboxChecked: false,
            selectedRows: new Set(),
            unSelectedRows: [],
            showModalAccess: false,
            showModalReview: false,
            CUSTID_DETAIL: '',
            pagesize: DefaultPagesize,
            keySearch: {},
            sortSearch: {},
            page: 1,
            p_custodycd: 'ALL', // ALL is default / Customer is just ONE 
            p_exectype: 'ALL',
            p_srtype: 'ALL',
            isDetailModalOpen: false,
            dataDetail: [],
            catalogDetails: {}
        }
    }

    moreInfo = (record) => {
        let { dataDetail } = this.state
        dataDetail.push(record)
        this.setState({
            isDetailModalOpen: true,
            catalogDetails: record,
            dataDetail,
        })
    }

    onCloseDetailModal = () => {
        this.setState({
            isDetailModalOpen: false,
            catalogDetails: {},
            dataDetail: [],
        })
    }


    handleAdd(evt) {
        var that = this;
        that.props.showModalDetail("add");
    }

    handlEdit(data) {
        var that = this;
        that.props.showModalDetail("add", data);
    }

    handleChangeALL(evt) {
        var that = this;
        this.setState({ checkedAll: evt.target.checked });
        if (evt.target.checked) {
            that.state.data.map(function (item) {
                if (!that.state.selectedRows.has(item.AUTOID)) {
                    that.state.unSelectedRows.push(item.AUTOID);
                    that.state.selectedRows.add(item.AUTOID);
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

    onClick(type) {
        let self = this;
        switch (type) {
            case "create": {

                self.handleAdd();
            }
            case "edit": {
            }
        }
    }
    handleChange(row) {

        if (!this.state.selectedRows.has(row.original.AUTOID))
            this.state.selectedRows.add(row.original.AUTOID);
        else {
            this.state.selectedRows.delete(row.original.AUTOID);
        }
        this.setState({ selectedRows: this.state.selectedRows });
    }
    onRowClick(state, rowInfo, column, instance) {
        var that = this;
        return {
            onDoubleClick: e => {
                that.props.showModalDetail("view", rowInfo.original)
            },
            style: {
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.AUTOID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.AUTOID) ? 'black' : '',
            }

        }
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

    async loadData(pagesize, page, keySearch, sortSearch) {
        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        var that = this;
        var custodycd = user.USERID;
        let valueCustodycd = isCustom ? custodycd : 'ALL'
        var obj = {
            exectype: 'ALL',
            srtype: 'ALL',
            custodycd: valueCustodycd,
            codeid: 'ALL',
            frdate: this.state.p_frdate,
            todate: this.state.p_todate,
            language: this.props.language,
            pagesize: this.state.pagesize,
            objname: this.props.OBJNAME,

        }


        this.setState({
            DataTableDMUyThac: DataTableDMUyThac(),
            pages: 123, //tổng số trang server trả ra
            page, //current page
            pagesize, //current page size
            sortSearch, //react table
            keySearch, //react table
            loading: false
        })

        return;

        RestfulUtils.post('/fund/getorderdbookall', { ...obj, pagesize, page, keySearch, sortSearch }).then(resData => {
            if (resData.EC == 0) {
                that.setState({
                    DataTableDMUyThac: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord
                });
            }

        })
    }



    render() {
        const { pages, loading, DataTableDMUyThac, isDetailModalOpen, dataDetail, catalogDetails } = this.state;
        const { user } = this.props.auth
        const detailColumn = [
            // Số thứ tự
            {
                Header: props => <div className="wordwrap">{this.props.strings.numericalOrder}</div>,
                id: "r",
                accessor: "r",
                filterable: false,
                maxWidth: 80,
                width: 80,
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <div>{cell.r}</div>
                    );
                },
            },
            // Loại tài sản, mã chứng khoán
            {
                Header: props => <div className="wordwrap">{this.props.strings.assetType}</div>,
                id: "assetType",
                accessor: "assetType",
                minWidth: 125,
                width: 125,
                maxWidth: 125,
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <div>{cell.assetType}</div>
                    );
                },
            },
            // Số lượng
            {
                Header: props => <div className="wordwrap">{this.props.strings.amount}</div>,
                accessor: "amount",
                minWidth: 100,
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <div>{cell.amount}</div>
                    );
                },
            },
            // Giá mua (VNĐ)
            {
                Header: props => <div className="wordwrap">{this.props.strings.purchasePrice}</div>,
                accessor: "purchasePrice",
                minWidth: 125,
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <div>{cell.purchasePrice}</div>
                    );
                },
            },
            // Giá thị trường tại thời điểm báo cáo (VNĐ)
            {
                Header: props => <div className="wordwrap">{this.props.strings.priceReportingTime}</div>,
                id: "priceReportingTime",
                accessor: "priceReportingTime",
                minWidth: 150,
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <div>{cell.priceReportingTime}</div>
                    );
                },
            },
            // Tổng giá trị thị trường tại thời điểm báo cáo (VNĐ)
            {
                Header: props => <div className="wordwrap">{this.props.strings.totalPriceReportingTime}</div>,
                id: "totalPriceReportingTime",
                accessor: "totalPriceReportingTime",
                minWidth: 150,
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <div>{cell.totalPriceReportingTime}</div>
                    );
                },
            },
            // Tỷ lệ %/Tổng giá trị của danh mục tại thời điểm báo cáo
            {
                Header: props => <div className="wordwrap">{this.props.strings.percentage}</div>,
                id: "percentage",
                accessor: "percentage",
                minWidth: 125,
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <div>{cell.percentage}</div>
                    );
                },
            },
            // % Lãi/ Lỗ
            {
                Header: props => <div className="wordwrap">{this.props.strings.profitLossPercent}</div>,
                id: "profitLossPercent",
                accessor: "profitLossPercent",
                minWidth: 125,
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <div>{cell.profitLossPercent}</div>
                    );
                },
            },
        ]
        const cols =
            [
                {
                    Header: props => <div className="">{this.props.strings.categoryId}</div>,
                    id: "categoryId",
                    accessor: "categoryId",
                    minWidth: 125,
                    className: "text-custom-left"
                },

                {
                    Header: props => <div className="">{this.props.strings.frDate}</div>,
                    id: "frDate",
                    accessor: "frDate",
                    minWidth: 125,
                    className: "text-custom-left"
                },
                {
                    Header: props => <div className="">{this.props.strings.categoryUnit}</div>,
                    accessor: "categoryUnit",
                    minWidth: 125,
                    className: "text-custom-right"
                },
                {
                    Header: props => <div className="">{this.props.strings.navCategoryUnitBegin}</div>,
                    accessor: "navCategoryUnitBegin",
                    minWidth: 170,
                    className: "text-custom-right"
                },

                {
                    Header: props => <div className="">{this.props.strings.navCategoryUnitCurrent}</div>,
                    id: "navCategoryUnitCurrent",
                    accessor: "navCategoryUnitCurrent",
                    minWidth: 170,
                    className: "text-custom-right"
                },
                {
                    Header: props => <div className="">{this.props.strings.nav}</div>,
                    id: "nav",
                    accessor: "nav",
                    minWidth: 125,
                    className: "text-custom-right"
                },
                {
                    Header: props => <div className="">{this.props.strings.profitLoss}</div>,
                    id: "profitLoss",
                    accessor: "profitLoss",
                    minWidth: 125,
                    className: "text-custom-right"
                },

                {
                    id: "sell",
                    accessor: "sell",
                    minWidth: 120,
                    filterable: false,
                    //headerClassName: "text-custom-right",
                    //className: "text-custom-right",
                    Cell: (props) => {
                        const cell = props.original;
                        return (
                            <div className="more_detail" onClick={() => { this.moreInfo(cell) }}>
                                {this.props.strings.viewDetail}
                            </div>)
                    }
                },
            ]

        return (
            <div className="table-dm-uy-thac-container customize-react-table ">
                <div className="table-dm-uy-thac-header">{this.props.strings.tableHeader}</div>

                <ModalDetail
                    isOpen={isDetailModalOpen}
                    dataDetail={dataDetail}
                    catalogDetails={catalogDetails}
                    detailColumn={detailColumn}
                    onClose={this.onCloseDetailModal}
                />

                <ReactTable
                    className="table-dm-uy-thac-content -striped -highlight  without-margin"
                    columns={cols}
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
                    data={DataTableDMUyThac}
                    noDataText={this.props.strings.textNodata}
                    pageText={getPageTextTable(this.props.language)}
                    rowsText={getRowTextTable(this.props.language)}
                    previousText={<i className="fas fa-backward"></i>}
                    nextText={<i className="fas fa-forward"></i>}
                    loadingText="Loading..."
                    ofText="/"
                    getTrProps={this.onRowClick.bind(this)}
                    defaultPageSize={this.state.pagesize}

                />
            </div>
        );
    }
}

const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    language: state.language.language,
    auth: state.auth

});


const decorators = flow([
    connect(stateToProps),
    translate('TableDMUyThac')
]);

module.exports = decorators(TableDMUyThac);
