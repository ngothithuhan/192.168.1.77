import React, { Component } from 'react';
import ReactTable from "react-table";
import { ButtonAdd } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize } from 'app/Helpers'
import orderBy from 'lodash.orderby';
import { getExtensionByLang, getPageTextTable, getRowTextTable } from '../../../../Helpers';
const requestData = (pageSize, page, sorted, filtered, rawData) => {
    return new Promise((resolve, reject) => {

        // You can retrieve your data however you want, in this case, we will just use some local data.
        let filteredData = rawData;

        // You can use the filters in your request, but you are responsible for applying them.
        if (filtered.length) {
            filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
                return filteredSoFar.filter(row => {
                    return (row[nextFilter.id].toUpperCase() + "").includes(nextFilter.value.toUpperCase());
                });
            }, filteredData);
        }

        // You can also use the sorting in your request, but again, you are responsible for applying it.

        const sortedData = orderBy(
            filteredData,
            sorted.map(sort => {
                return row => {
                    if (row[sort.id] === null || row[sort.id] === undefined) {
                        return -Infinity;
                    }
                    return typeof row[sort.id] === "string"
                        ? row[sort.id].toLowerCase()
                        : row[sort.id];
                };
            }),
            sorted.map(d => (d.desc ? "desc" : "asc"))
        );
        // You must return an object containing the rows of the current page, and optionally the total pages number.
        const res = {
            rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
            pages: Math.ceil(filteredData.length / pageSize)
        };

        // Here we'll simulate a server response with 500ms of delay.
        setTimeout(() => resolve(res), 500);
    });
};
class TableSendEmail extends Component {
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
            data1: [],
            loaded: false,

            sorted1: [],
            filtered1: [],
        }
        // this.fetchData = this.fetchData.bind(this);
    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.loadgrid) {

            //console.log('componentWillReceiveProps')


            this.setState({ loaded: false })
            this.loadData();
            if (this.state.loaded == false) {

                let data = {
                    pageSize: this.state.pageSize,
                    page: this.state.page,
                    sorted: this.state.sorted1,
                    filtered: this.state.filtered1,
                }
                this.fetchData(data)
            }
        }
    }
    componentWillMount() {

        this.loadData();

        // this.refresh()
    }
    handleAdd(evt) {
        var that = this;
        that.props.showModalDetail("add");
    }
    handlEdit(data) {
        var that = this;
        that.props.showModalDetail("update", data);
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
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTID) ? 'black' : '',
            }

        }
    }
    fetchData(state, instance) {

        // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
        // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
        var that = this;

        this.setState({ loading: true });
        requestData(
            state.pageSize,
            state.page,
            state.sorted,
            state.filtered,
            that.state.data1
        ).then(res => {

            // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
            this.setState({
                data: res.rows,
                pages: res.pages,
                loading: false,
                pageSize: state.pageSize,
                page: state.page,
                sorted1: state.sorted,
                filtered1: state.filtered,
                checkedAll: false,
                selectedRows: new Set(),
            });

        });
        //}

        // this.setState({loading:true})
    }
    refresh = () => {
        // let self = this
        //      RestfulUtils.post('/Account/getListSendEmail', {pagesize:this.state.pagesize, p_language: this.props.lang}).then((resData) => {
        //             if (resData.EC == 0) {
        //                 console.log('sync success',resData)
        //                  self.setState({ data: resData.DT.data,pages :resData.DT.numOfPages })
        //             } else {

        //                 toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });

        //             }
        //         });

    }
    async loadData() {
        let that = this;
        let data = {
            p_language: this.props.lang,
            OBJNAME: this.props.OBJNAME
        }
        await RestfulUtils.posttrans('/account/getlistsendemail', { data }).then((resData) => {
            //console.log('resDATAAAAA', resData)
            // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
            if (resData.EC == 0) {
                that.setState({
                    data1: resData.DT.data,
                    data: resData.DT.data,
                    loaded: true,
                    sumRecord: resData.DT.sumRecord
                    //pages: resData.DT.numOfPages,

                });

            }
        });

    }
    refreshData = async () => {

        let { pagesize, page, keySearch, sortSearch } = this.state
        this.loadData(pagesize, page, keySearch, sortSearch);

    }

    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    render() {
        const { data, pages, loading } = this.state;
        var that = this;
        return (
            <div> 
                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                        <ButtonAdd data={this.props.datapage} onClick={this.handleAdd.bind(this)} />
                    </div>
                    <div style={{ textAlign: "right" }} className="col-md-2 RightInfo">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}> <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                            <span className="ReloadButton" onClick={this.refreshData}><i className="fas fa-sync-alt"></i></span>

                        </h5>
                    </div>
                </div>
                {this.state.loaded &&
                    <div className="col-md-12" >
                        <ReactTable
                            columns={[

                                {
                                    Header: props => <div className="header_table_pad_3">{this.props.strings.emailtype}</div>,
                                    id: getExtensionByLang("EMAILTYPE_DESC", this.props.lang),
                                    accessor: getExtensionByLang("EMAILTYPE_DESC", this.props.lang),
                                    width: 260,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="header_table_pad_3">{this.props.strings.notedesc}</div>,
                                    id: getExtensionByLang("NOTE_DESC", this.props.lang),
                                    accessor: getExtensionByLang("NOTE_DESC", this.props.lang),
                                    width: 145,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
                                },

                                {
                                    Header: props => <div className="header_table_pad_3">{this.props.strings.subject}</div>,
                                    id: "SHORTCONTENT",
                                    accessor: "SHORTCONTENT",
                                    width: 270,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="header_table_pad_3">{this.props.strings.createtime}</div>,
                                    id: "SENDDATE",
                                    accessor: "SENDDATE",
                                    width: 80,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="header_table_pad_3">{this.props.strings.frdate}</div>,
                                    id: "FRDATE",
                                    accessor: "FRDATE",
                                    width: 80,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="header_table_pad_3">{this.props.strings.todate}</div>,
                                    id: "TODATE",
                                    accessor: "TODATE",
                                    width: 80,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.bgdate}</div>,
                                    id: "RETRADINGDATE",
                                    accessor: "RETRADINGDATE",
                                    width: 90,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="header_table_pad_3">{this.props.strings.status}</div>,
                                    id: getExtensionByLang("STATUS_DESC", this.props.lang),
                                    accessor: getExtensionByLang("STATUS_DESC", this.props.lang),
                                    width: 133,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
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
                            //loading={loading} // Display the loading overlay when we need it
                            onFetchData={this.fetchData.bind(this)}
                            data={data}
                            style={{
                                maxHeight: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                            }}
                            noDataText={this.props.strings.textNodata}
                            pageText={getPageTextTable(this.props.lang)}
                            rowsText={getRowTextTable(this.props.lang)}
                            previousText={<i className="fas fa-backward" id="previous"></i>}
                            nextText={<i className="fas fa-forward" id="next"></i>}
                            loadingText="Đang tải..."
                            ofText="/"
                            getTrProps={this.onRowClick.bind(this)}
                            defaultPageSize={DefaultPagesize}
                            className="-striped -highlight"
                            getTrGroupProps={(row) => {
                                return {
                                    id: "haha"
                                }
                            }}
                            onPageChange={(pageIndex) => that.setState({
                                selectedRows: new Set(),
                                checkedAll: false
                            })}
                        />
                    </div>
                }
            </div>

        );
    }
}
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language

});

const decorators = flow([
    connect(stateToProps),
    translate('TableSendEmail')
]);

module.exports = decorators(TableSendEmail);
