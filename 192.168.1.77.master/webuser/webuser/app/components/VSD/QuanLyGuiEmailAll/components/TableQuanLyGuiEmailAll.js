import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize } from 'app/Helpers'
//import { Checkbox } from 'react-bootstrap';
//import { toast } from 'react-toastify';
import { getExtensionByLang } from '../../../../Helpers';

class TableQuanLyGuiEmailAll extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            keySearch: [],
            sortSearch: [],
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
        if (this.state.loading) {
            let { pageSize, page, filtered, sorted } = state;
            this.loadData(pageSize, page + 1, filtered, sorted);
        }
        this.setState({ loading: true })

    }
    async loadData(pagesize, page, keySearch, sortSearch) {
        let that = this;
        await RestfulUtils.post('/account/getemaillistmanagerall', { pagesize, page, keySearch, sortSearch, p_language: this.props.lang, OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                //console.log('res tra ve ,', resData)
                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    sumRecord: resData.DT.sumRecord,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch
                });
            }
            else {

            }
        });

    }
    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    reloadTable(){
        this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch)
    }
    render() {
        const { data, pages, loading } = this.state;
        var that = this;
        return (
            <div>
                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                    </div>
                    <div style={{ textAlign: "right" }} className="col-md-2 RightInfo">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}>
                            <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                            <span className="ReloadButton" onClick={this.reloadTable.bind(this)}><i className="fas fa-sync-alt"></i></span>
                        </h5>
                    </div>
                </div>

                <div className="col-md-12" >
                    <ReactTable
                        columns={[
                          
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.type}</div>,
                                id: "TYPE",
                                accessor: "TYPE",
                                width: 58,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.templateid}</div>,
                                id: "TEMPLATEID",
                                accessor: "TEMPLATEID",
                                width: 73,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.subject}</div>,
                                id: getExtensionByLang("SUBJECT", this.props.lang),
                                accessor: getExtensionByLang("SUBJECT", this.props.lang),
                                width: 367,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.custodycd}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                width: 104,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.fullname}</div>,
                                id: "FULLNAME",
                                accessor: "FULLNAME",
                                width: 200,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.email}</div>,
                                id: "EMAIL",
                                accessor: "EMAIL",
                                width: 190,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.status}</div>,
                                // id: "STATUS_DESC",
                                // accessor: "STATUS_DESC",
                                id: getExtensionByLang("STATUS_DESC", this.props.lang),
                                accessor: getExtensionByLang("STATUS_DESC", this.props.lang),
                                width: 124,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.createtime}</div>,
                                id: "CREATETIME",
                                accessor: "CREATETIME",
                                width: 130,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.sendtime}</div>,
                                id: "SENTTIME",
                                accessor: "SENTTIME",
                                width: 130,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.note}</div>,
                                id: "NOTE",
                                accessor: "NOTE",
                                width: 100,
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
                        pageText={this.props.strings.pageText}
                        rowsText={this.props.strings.rowsText}
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
                    
                    />
                </div>

            </div>

        );
    }
}

TableQuanLyGuiEmailAll.defaultProps = {
};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language

});
const decorators = flow([
    connect(stateToProps),
    translate('TableQuanLyGuiEmailAll')
]);
module.exports = decorators(TableQuanLyGuiEmailAll);
