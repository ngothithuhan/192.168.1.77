import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import {
    DefaultPagesize, getExtensionByLang, getRowTextTable, getPageTextTable, ACTIONS_ACC,
    DISABLE_EDIT_ACCOUNT, DISABLE_CUSTODYCD_STARTWITH
} from 'app/Helpers';
// const debounce = require('lodash.debounce');
import _ from "lodash"
class TableAccounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [


            ],
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
            lang: this.props.language

        }
    }

    //todo: cần fetch lại data khi thay đổi language
    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (this.state.lang != nextProps.currentLanguage) {
        //     this.state.lang = nextProps.currentLanguage
        //     this.state.loading = true
        //     this.refReactTable.fireFetchData()
        // }

        if (this.props.shouldEnablesearch !== prevProps.shouldEnablesearch
            && this.props.shouldEnablesearch === true
        ) {
            //do something
            this._debouncedSearch();
        }
    }

    _debouncedSearch = _.debounce(() => {
        let { keySearch, page, pagesize, sortSearch } = this.state;
        this.loadData(pagesize, page, keySearch, sortSearch);
    }, 100);

    componentDidMount() {
        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        var that = this;
        io.socket.on('loadAccounts', function (CUSTODYCD) {
            let { keySearch, page, pagesize, sortSearch } = that.state;
            that.loadData(pagesize, page, keySearch, sortSearch);
            // if (!isCustom) {
            //     RestfulUtils.post('/account/isCareby', { CUSTODYCD: CUSTODYCD }).then((resData) => {
            //         if (resData.isCareby) {
            //             that.loadData(pagesize, page, keySearch, sortSearch);
            //         }
            //     });
            // }
        });
    }


    handleChangeALL(evt) {
        var that = this;
        this.setState({ checkedAll: evt.target.checked });
        if (evt.target.checked) {
            that.state.data.map(function (item) {
                if (!that.state.selectedRows.has(item.CUSTID)) {
                    that.state.unSelectedRows.push(item.CUSTID);
                    that.state.selectedRows.add(item.CUSTID);
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


    handleChange(row) {
        if (!this.state.selectedRows.has(row.original.CUSTID))
            this.state.selectedRows.add(row.original.CUSTID);
        else {
            this.state.selectedRows.delete(row.original.CUSTID);
        }
        this.setState({ selectedRows: this.state.selectedRows });
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

    async loadData(pagesize, page, keySearch, sortSearch, columns) {
        let that = this;
        await RestfulUtils.post('/account/getlist',
            {
                pagesize, page, keySearch, sortSearch,
                OBJNAME: this.props.OBJNAME,
                objectCreterial: {
                    keySearch: that.props.keySearchAcc
                }
            }
        ).then((resData) => {
            if (resData.EC == 0) {
                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord,
                    colum: columns
                });
            }
            else {

            }
        });
    }

    async loadDataTable() {
        let that = this;
        await RestfulUtils.posttrans('/account/getlist', { pagesize: this.state.pagesize, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
            //console.log('datatable',resData)
            // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
            if (resData.EC == 0) {
                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord,
                    colum: columns
                });
            }

        });

    }

    handlEdit(CUSTID, row) {
        var that = this;
        that.props.handleShowModal(CUSTID, row);
    }

    delete = async (row) => {
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""
        }
        if (!row) {
            datanotify.type = "error";
            datanotify.content = this.props.strings.choosetodelete;
            dispatch(showNotifi(datanotify));
        }

        let data = {
            CUSTID: row.CUSTID,
            CUSTODYCD: row.CUSTODYCD,
            language: this.props.language,
            OBJNAME: 'MANAGERACCT'
        }

        let success = null;
        await RestfulUtils.post('/account/cancelgeneralinfo', { ...data, ...row })
            .then(res => {
                success = (res.EC == 0);
                success ? toast.success(this.props.strings.deleteacc + " " + data.CUSTODYCD + " " + this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                    : toast.error(this.props.strings.deleteacc + " " + data.CUSTODYCD + " " + this.props.strings.unsuccess + ": " + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
            })
    }

    //disable sửa tài khoản đầu 003...
    isDisableRowEdit = (row) => {
        let isDisable = false;
        if (DISABLE_EDIT_ACCOUNT && row) {
            for (let i = 0; i < DISABLE_CUSTODYCD_STARTWITH.length; i++) {
                if (row.CUSTODYCD.startsWith(DISABLE_CUSTODYCD_STARTWITH[i])) {
                    isDisable = true;
                    break;
                }
            }
        }
        return isDisable;
    }

    onRowClick(state, rowInfo, column, instance) {
        return {
            onDoubleClick: e => {
                this.props.handleShowModal(rowInfo.original.CUSTID, rowInfo);
            },
        }
    }


    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.keySearchAcc !== this.props.keySearchAcc) return false;
        return true;
    }

    render() {
        const { data, pages, loading } = this.state;
        var that = this;

        return (
            <div className="table-acc-overview-container" >
                <ReactTable
                    columns={[
                        {
                            Header: '',
                            minWidth: 60,
                            Cell: (row) => {
                                // let isDisableEdit = this.isDisableRowEdit(row.original)
                                let isDisableEdit = false; //off logic check tài khoản 003
                                return (
                                    <div>
                                        <span className="glyphicon glyphicon-remove" style={{ margin: "0 10px" }} onClick={() => this.delete(row.original)}></span>
                                        {isDisableEdit === true ?
                                            <span title="Xem thông tin" onClick={that.handlEdit.bind(that, row.original, row)} className="glyphicon glyphicon-eye-open"></span>
                                            :
                                            <span title="Sửa tài khoản" onClick={that.handlEdit.bind(that, row.original, row)} className="glyphicon glyphicon-pencil"></span>
                                        }
                                    </div>
                                )
                            },
                            Filter: ({ filter, onChange }) =>
                                null
                        },
                        {
                            Header: props => <div className="">{this.props.strings.CUSTODYCD}</div>,
                            id: "CUSTODYCD",
                            accessor: "CUSTODYCD",
                            width: 105,
                            Cell: ({ value }) => (
                                <div className="col-left" style={{ float: "left" }}>{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.FULLNAME}</div>,
                            id: "FULLNAME",
                            accessor: "FULLNAME",
                            width: 220,
                            Cell: ({ value }) => (
                                <div className="col-left">{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.DBCODE}</div>,
                            id: "DBCODE",
                            accessor: "DBCODE",
                            width: 120,
                            Cell: ({ value }) => (
                                <div className="col-left">{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.IDCODE}</div>,
                            id: "IDCODE",
                            accessor: "IDCODE",
                            width: 100,
                            Cell: ({ value }) => (
                                <div className="col-left">{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.IDPLACE}</div>,
                            id: "IDPLACE",
                            accessor: "IDPLACE",
                            width: 130,
                            Cell: ({ value }) => (
                                <div className="col-left">{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="wordwrap">{this.props.strings.IDDATE}</div>,
                            id: "IDDATE",
                            accessor: "IDDATE",
                            width: 80,
                            Cell: ({ value }) => (
                                <div className="col-left">{value}</div>
                            )

                        },
                        {
                            Header: props => <div className="">{this.props.strings.ADDRESS}</div>,
                            id: "ADDRESS",
                            accessor: "ADDRESS",
                            width: 368,
                            Cell: ({ value }) => (
                                <div className="col-left" >{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.MOBILE}</div>,
                            id: "MOBILE",
                            accessor: "MOBILE",
                            width: 100,
                            Cell: ({ value }) => (
                                <div className="col-left" >{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.EMAIL}</div>,
                            id: "EMAIL",
                            accessor: "EMAIL",
                            width: 100,
                            Cell: ({ value }) => (
                                <div className="col-left" >{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.BANKACC}</div>,
                            id: "BANKACC",
                            accessor: "BANKACC",
                            width: 100,
                            Cell: ({ value }) => (
                                <div className="col-left" >{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.MBNAME}</div>,
                            id: "MBNAME",
                            accessor: "MBNAME",
                            width: 370,
                            Cell: ({ value }) => (
                                <div className="col-left" >{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.CITYBANK}</div>,
                            id: "CITYBANK",
                            accessor: "CITYBANK",
                            width: 100,
                            Cell: ({ value }) => (
                                <div className="col-left" >{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("CLASSCD_DESC", this.props.language)]}</div>,
                            id: getExtensionByLang("CLASSCD_DESC", this.props.language),
                            accessor: getExtensionByLang("CLASSCD_DESC", this.props.language),
                            width: 99,
                            Cell: ({ value }) => (
                                <span className="col-left">
                                    {value}
                                </span>
                            ),
                        },
                        {
                            Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("CLASSSIPCD_DESC", this.props.language)]}</div>,
                            id: getExtensionByLang("CLASSSIPCD_DESC", this.props.language),
                            accessor: getExtensionByLang("CLASSSIPCD_DESC", this.props.language),
                            width: 100,
                            Cell: ({ value }) => (
                                <span className="col-left">
                                    {value}
                                </span>
                            ),
                        },
                        {
                            Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("ACCTGRP_DESC", this.props.language)]}</div>,
                            id: getExtensionByLang("ACCTGRP_DESC", this.props.language),
                            accessor: getExtensionByLang("ACCTGRP_DESC", this.props.language),
                            width: 68,
                            Cell: ({ value }) => (
                                <span className="col-left">
                                    {value}
                                </span>
                            ),
                        },
                        {
                            Header: props => <div className="wordwrap">{this.props.strings.CAREBY_DESC}</div>,
                            id: "CAREBY_DESC",
                            accessor: "CAREBY_DESC",
                            width: 95,
                            Cell: ({ value }) => (
                                <span className="col-left">
                                    {value}
                                </span>
                            ),
                        },
                        {
                            Header: props => <div className="">{this.props.strings.OPNDATE}</div>,
                            id: "OPNDATE",
                            accessor: "OPNDATE",
                            width: 95,
                            Cell: ({ value }) => (
                                <span className="col-left">
                                    {value}
                                </span>
                            ),
                        },
                        {
                            Header: props => <div className="">{this.props.strings[getExtensionByLang("CFSTATUS_DESC", this.props.language)]}</div>,
                            id: getExtensionByLang("CFSTATUS_DESC", this.props.language),
                            accessor: getExtensionByLang("CFSTATUS_DESC", this.props.language),
                            Cell: (row) => (
                                <span className="col-left">

                                    <span style={{

                                        color:
                                            row.original.STATUS == "A" ? 'rgb(0, 255, 247)' : row.original.STATUS == "P" ? 'rgb(230, 207, 17)' : row.original.STATUS == "R" ? 'rgb(230, 207, 17)'
                                                : 'rgb(162, 42, 79)',
                                        transition: 'all .3s ease'
                                    }}>
                                        &#x25cf;
                                    </span> {
                                        row.value
                                    }
                                </span>
                            ),
                            width: 120

                        },

                        {
                            Header: props => <div className="">{this.props.strings[getExtensionByLang("VSDSTATUS_DESC", this.props.language)]}</div>,
                            id: getExtensionByLang("VSDSTATUS_DESC", this.props.language),
                            accessor: getExtensionByLang("VSDSTATUS_DESC", this.props.language),
                            Cell: (row) => (
                                <span className="col-left">

                                    <span style={{

                                        color:
                                            row.original.VSDSTATUS == "A" ? 'rgb(0, 255, 247)' : row.original.VSDSTATUS == "P" ? 'rgb(230, 207, 17)' : row.original.VSDSTATUS == "R" ? 'rgb(230, 207, 17)'
                                                : 'rgb(162, 42, 79)',
                                        transition: 'all .3s ease'
                                    }}>
                                        &#x25cf;
                                    </span> {
                                        row.value
                                    }
                                </span>
                            ),
                            width: 164

                        },
                        {
                            Header: props => <div className="">{this.props.strings.MAKER}</div>,
                            id: "MAKER",
                            accessor: "MAKER",
                            width: 91,
                            Cell: ({ value }) => (
                                <span className="col-left">
                                    {value}
                                </span>
                            ),
                        },
                        {
                            Header: props => <div className="">{this.props.strings.STATUSFILE}</div>,
                            id: "STATUSFILE",
                            accessor: "STATUSFILE",
                            width: 150,
                            Cell: ({ value }) => (
                                <span className="col-left">
                                    {value}
                                </span>
                            ),
                        },
                        {
                            Header: props => <div className="">{this.props.strings[getExtensionByLang("ISCFLEAD_DESC", this.props.language)]}</div>,
                            id: getExtensionByLang("ISCFLEAD_DESC", this.props.language),
                            accessor: getExtensionByLang("ISCFLEAD_DESC", this.props.language),
                            width: 112,
                            Cell: ({ value }) => (
                                <span className="col-left">
                                    {value}
                                </span>
                            ),
                        },
                        {
                            Header: props => <div className="">{this.props.strings.NOTE}</div>,
                            id: "NOTE",
                            accessor: "NOTE",
                            width: 200,
                            Cell: ({ value }) => (
                                <span className="col-left">
                                    {value}
                                </span>
                            ),
                        },
                        {
                            Header: props => <div className="">{this.props.strings.ISAGREESHARE}</div>,
                            id: "ISAGREESHARE",
                            accessor: "ISAGREESHARE",
                            width: 200,
                            Cell: ({ value }) => (
                                <span className="col-left">
                                    {value == 'N' ? 'Không' : 'Có'}
                                </span>
                            ),
                        },

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
                    data={data}
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
                    defaultPageSize={this.state.pagesize}
                    className="-striped -highlight"
                    ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                    getTrProps={this.onRowClick.bind(this)}

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
    translate('TableAddCreateAccount')
]);

module.exports = decorators(TableAccounts);
