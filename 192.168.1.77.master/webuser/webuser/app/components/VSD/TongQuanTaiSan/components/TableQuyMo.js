import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getRowTextTable, getPageTextTable } from 'app/Helpers'
import { DataTableQuyMo } from 'app/utils/MockData';
import NumberInput from 'app/utils/input/NumberInput';

class TableQuyMo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTableQuyMo: [],
            pages: null,
            loading: true,
            checkedAll: false,
            checkboxChecked: false,
            selectedRows: new Set(),
            unSelectedRows: [],
            showModalAccess: false,
            showModalReview: false,
            CUSTID_DETAIL: '',
            pagesize: DefaultPagesize, //10
            keySearch: {},
            sortSearch: {},
            page: 1,
            p_custodycd: 'ALL', // ALL is default / Customer is just ONE 
            p_exectype: 'ALL',
            p_srtype: 'ALL'
        }
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
        // if (this.state.loading) {
        let { pageSize, page, filtered, sorted } = state;
        this.loadData(pageSize, page + 1, filtered, sorted);
        // }
        this.setState({ loading: true })
    }

    async loadData(pagesize, page, keySearch, sortSearch) {
        const { user } = this.props.auth;
        let that = this;

        let obj = {
            CUSTODYCD: user.USERNAME,
            CODEID: 'ALL',
            language: this.props.language,
            pagesize: pagesize,
            OBJNAME: "PLACEORDER"
        }

        RestfulUtils.post('/balance/getfundbalance', obj)
            .then(resData => {
                if (resData.EC === 0) {
                    that.setState({
                        dataTableQuyMo: resData.DT.data,
                        pages: resData.DT.numOfPages,
                        loading: false,
                        keySearch,
                        page,
                        pagesize,
                        sortSearch,
                    })
                    that.props.setDataTableQuyMo(resData.DT.data);
                }
            })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.auth && this.props.auth && prevProps.auth !== this.props.auth) {
            this.fetchData(this.state);
        }
    }

    render() {
        const { pages, loading, dataTableQuyMo } = this.state;

        const cols =
            [
                {
                    Header: props => <div className="">{this.props.strings.accountId}</div>,
                    id: "CUSTODYCD",
                    accessor: "CUSTODYCD",
                    minWidth: 125,
                    headerClassName: "text-custom-center",
                    className: "text-custom-left"
                },

                {
                    Header: props => <div className="">{this.props.strings.fundId}</div>,
                    id: "SYMBOL",
                    accessor: "SYMBOL",
                    minWidth: 155,
                    headerClassName: "text-custom-center",
                    className: "text-custom-left"
                },
                {
                    Header: props => <div className="">{this.props.strings.balanceSIP}</div>,
                    id: "AVLTRADESIP",
                    accessor: "AVLTRADESIP",
                    minWidth: 125,
                    headerClassName: "text-custom-center",
                    className: "text-custom-right",
                    Cell: ({ value }) => {
                        return (
                            <NumberInput
                                decimalScale={2}
                                value={value}
                                displayType={'text'}
                                thousandSeparator={true}
                            />
                        )
                    },
                },
                {
                    Header: props => <div className="">{this.props.strings.normal}</div>,
                    id: "AVLQTTY",
                    accessor: "AVLQTTY",
                    minWidth: 125,
                    headerClassName: "text-custom-center",
                    className: "text-custom-right",
                    Cell: ({ value }) => {
                        return (
                            <NumberInput
                                decimalScale={2}
                                value={value}
                                displayType={'text'}
                                thousandSeparator={true}
                            />
                        )
                    },
                },

                {
                    Header: props => <div className="">{this.props.strings.totalBalance}</div>,
                    id: "BALQTTY",
                    accessor: "BALQTTY",
                    minWidth: 125,
                    headerClassName: "text-custom-center",
                    className: "text-custom-right",
                    Cell: ({ value }) => {
                        return (
                            <NumberInput
                                decimalScale={2}
                                value={value}
                                displayType={'text'}
                                thousandSeparator={true}
                            />
                        )
                    },
                },
                {
                    Header: props => <div className="">{this.props.strings.avgBuyPrice}</div>,
                    id: "AVGBUYPRICE",
                    accessor: "AVGBUYPRICE",
                    minWidth: 155,
                    headerClassName: "text-custom-center",
                    className: "text-custom-right",
                    Cell: ({ value }) => {
                        return (
                            <NumberInput
                                decimalScale={2}
                                value={value}
                                displayType={'text'}
                                thousandSeparator={true}
                            />
                        )
                    },
                },

                {
                    Header: props => <div className="">{this.props.strings.currentPrice}</div>,
                    id: "ENAV",
                    accessor: "ENAV",
                    minWidth: 125,
                    headerClassName: "text-custom-center",
                    className: "text-custom-right",
                    Cell: ({ value }) => {
                        return (
                            <NumberInput
                                decimalScale={2}
                                value={value}
                                displayType={'text'}
                                thousandSeparator={true}
                            />
                        )
                    },
                },
                {
                    Header: props => <div className="">{this.props.strings.sumCurrentValue}</div>,
                    id: "CURRAMT",
                    accessor: "CURRAMT",
                    minWidth: 165,
                    headerClassName: "text-custom-right",
                    className: "text-custom-right",
                    Cell: ({ value }) => {
                        return (
                            <NumberInput
                                decimalScale={2}
                                value={value}
                                displayType={'text'}
                                thousandSeparator={true}
                            />
                        )
                    },
                },

                {
                    Header: props => <div className="">{this.props.strings.profitLoss}</div>,
                    id: "COT10",
                    accessor: "COT10",
                    minWidth: 140,
                    headerClassName: "text-custom-center",
                    className: "text-custom-right",
                    Cell: ({ value }) => {
                        return (
                            <NumberInput
                                value={value}
                                decimalScale={2}
                                displayType={'text'}
                                thousandSeparator={true}
                            />
                        )
                    },
                },

                {
                    id: "sell",
                    minWidth: 80,
                    filterable: false,
                    headerClassName: "text-custom-center",
                    Cell: (props) => {
                        const cell = props.original;
                        return (
                            <button className="btn btn-danger">{this.props.strings.sell}</button>
                        );
                    }
                },
                {
                    id: "buy",
                    minWidth: 80,
                    filterable: false,
                    headerClassName: "text-custom-center",
                    Cell: (props) => {
                        const cell = props.original;
                        return (
                            <button className="btn btn-warning">{this.props.strings.buy}</button>
                        );
                    }
                },
            ]


        return (
            <div className="table-quy-mo-container customize-react-table ">
                <div className="table-quy-mo-header ">{this.props.strings.tableHeader}</div>
                <ReactTable
                    className="table-quy-mo-content -striped -highlight without-margin "
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
                    data={dataTableQuyMo}
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
    translate('TableQuyMo')
]);

module.exports = decorators(TableQuyMo);
