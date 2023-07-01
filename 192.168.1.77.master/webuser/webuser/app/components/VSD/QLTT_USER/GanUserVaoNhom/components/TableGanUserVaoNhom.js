import React, { Component } from 'react';
import ReactTable from "react-table";
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from './../../../../../Helpers';

class TableGanUserVaoNhom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            p_iscflead: '',
            pages: null,
            loading: true,
            checkedAll: false,
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
        // this.fetchData = this.fetchData.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.lang != nextProps.currentLanguage) {
            this.state.lang = nextProps.currentLanguage
            this.state.loading = true
            this.refReactTable.fireFetchData()
        }
        if(nextProps.isLoad){
            this.reloadTable()
        }
    }
    componentDidMount() {
        this.refresh()
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
                if (!that.state.selectedRows.has(item.CUSTODYCD)) {
                    that.state.unSelectedRows.push(item.CUSTODYCD);
                    that.state.selectedRows.add(item.CUSTODYCD);
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

        if (!this.state.selectedRows.has(row.original.CUSTODYCD))
            this.state.selectedRows.add(row.original.CUSTODYCD);
        else {
            this.state.selectedRows.delete(row.original.CUSTODYCD);
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
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTODYCD) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTODYCD) ? 'black' : '',
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
    refresh = () => {
        let self = this
        RestfulUtils.post('/account/getlistusergroup', { pagesize: this.state.pagesize, OBJNAME: this.props.OBJNAME,language : this.props.language}).then((resData) => {
            if (resData.EC == 0) {
                //console.log('sync success', resData)
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord, dataAll: resData.DT.dataAll })

            } else {

                toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });

            }
        });

    }

    async loadData(pagesize, page, keySearch, sortSearch, columns) {
        let that = this;
        await RestfulUtils.post('/account/getlistusergroup', { pagesize, page, keySearch, sortSearch, OBJNAME: this.props.OBJNAME, language : this.props.language}).then((resData) => {
            if (resData.EC == 0)
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
        });

    }
    async reloadTable() {
        let {pagesize, page, keySearch, sortSearch } = this.state
        let that = this;
        await RestfulUtils.posttrans('/account/getlistusergroup', { pagesize, page, keySearch, sortSearch, OBJNAME: this.props.OBJNAME,language : this.props.language }).then((resData) => {
            if (resData.EC == 0)
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
        });

    }
    handlEdit(data) {
        var that = this;
        that.props.showModalDetail("add", data);
    }
    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    render() {
        const { data, pages, loading, dataTest } = this.state;
        console.log('dataRows:',this.state.dataAll);
        console.log('colum:',this.state.colum);
        console.log('data:',this.state.datapage);
        console.log('dataHeader:',this.state.strings);
        var that = this;
        return ( 
            <div>
                <div className="col-md-12" >
                    <div style={{ marginLeft: "-41px" }} className="col-md-10 ">
                        <ButtonExport style={{ marginLeft: "5px" }} HaveChk={true} dataRows={this.state.dataAll} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />
                    </div>
                    <div style={{ textAlign: "right", marginLeft: "3%" }} className="col-md-2">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}> <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                            <span className="ReloadButton" onClick={this.reloadTable.bind(this)}><i className="fas fa-sync-alt"></i></span>
                        </h5>
                    </div>
                </div>
                <div className="col-md-12" >
                    <ReactTable
                        columns={[
                            {
                                Header: props => <div className="wordwrap">  </div>,
                                maxWidth: 90,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>
                                        {/* ho tro lay dc dung hang danh click */}
                                        <button type="button" className="btn btn-primary" onClick={this.handlEdit.bind(this, row.original)}>  <a style={{ color: "#ffffff", textDecoration: "none" }}>{this.props.strings.submit}</a></button>

                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TLID}</div>,
                                id: "TLID",
                                accessor: "TLID",
                                width: 65,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.VSDSALEID}</div>,
                                id: "VSDSALEID",
                                accessor: "VSDSALEID",
                                width: 72,
                                Cell: ({ value }) => (
                                    <div className="col-left" >{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TLNAME}</div>,
                                id: "TLNAME",
                                accessor: "TLNAME",
                                width: 142,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TLFULLNAME}</div>,
                                id: "TLFULLNAME",
                                accessor: "TLFULLNAME",
                                width: 177,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.IDCODE}</div>,
                                id: "IDCODE",
                                accessor: "IDCODE",
                                width: 104,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.MOBILE}</div>,
                                id: "MOBILE",
                                accessor: "MOBILE",
                                width: 102,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.EMAIL}</div>,
                                id: "EMAIL",
                                accessor: "EMAIL",
                                width: 162,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )

                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("BRNAME", this.props.lang)]}</div>,
                                id: getExtensionByLang("BRNAME", this.props.lang),
                                accessor: getExtensionByLang("BRNAME", this.props.lang),
                                width: 152,
                                Cell: ({ value }) => (
                                    <div className="col-left" >{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("MBNAME", this.props.lang)]}</div>,
                                //  id: "MBNAME",
                                // accessor: "MBNAME",
                                id: getExtensionByLang("MBNAME", this.props.lang),
                                accessor: getExtensionByLang("MBNAME", this.props.lang),
                                width: 298,
                                Cell: ({ value }) => (
                                    <div className="col-left" >{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("AREA_DESC", this.props.lang)]}</div>,
                                // id: "AREA_DESC",
                                // accessor: "AREA_DESC",
                                id: getExtensionByLang("AREA_DESC", this.props.lang),
                                accessor: getExtensionByLang("AREA_DESC", this.props.lang),
                                width: 120,
                                Cell: ({ value }) => (
                                    <div className="col-left" >{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("ACTIVE_DESC", this.props.lang)]}</div>,
                                //   id: "ACTIVE_DESC",
                                //   accessor: "ACTIVE_DESC",
                                id: getExtensionByLang("ACTIVE_DESC", this.props.lang),
                                accessor: getExtensionByLang("ACTIVE_DESC", this.props.lang),
                                width: 82,
                                Cell: ({ value }) => (
                                    <span className="col-left">
                                        {value}
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
                        loadingText="Đang tải..."
                        ofText="/"
                        getTrProps={this.onRowClick.bind(this)}
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
    translate('TableGanUserVaoNhom')
]);

module.exports = decorators(TableGanUserVaoNhom);
