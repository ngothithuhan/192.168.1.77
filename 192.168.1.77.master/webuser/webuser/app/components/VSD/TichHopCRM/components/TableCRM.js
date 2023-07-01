import React, { Component } from 'react';
import ReactTable from "react-table";
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from './../../../../Helpers';
import { Checkbox } from 'react-bootstrap';

class TableCRM extends Component {
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
        RestfulUtils.post('/account/getlistcrm', { pagesize: this.state.pagesize, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
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
        await RestfulUtils.post('/account/getlistcrm', { pagesize, page, keySearch, sortSearch, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
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
    async reloadData() {
        let {pagesize, page, keySearch, sortSearch} = this.state
        let that = this;
        await RestfulUtils.posttrans('/account/getlistcrm', { pagesize, page, keySearch, sortSearch, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0)
                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord,
                });
        });

    }
    async checkYESNO(mobile) {
        var content = {
            "master": {
                "entity": "lead",
                "fields": [
                    {
                        "value": mobile,
                        "type": "string",
                        "fieldname": "mobilephone"
                    }
                ]
            }
        }
        //console.log('mobile >>>>>', mobile)
        let that = this
        await window.$.ajax({
            contentType: 'application/json; charset=utf-8',
            method: 'POST',
            url: 'https://crm.vfm.com.vn:8089/leadService.svc/CheckList',
            dataType: 'json',
            data: JSON.stringify({ data: content }),
            crossDomain: true,
            processData: true,
            async: false,
            timeout: 60000,
            error: function (xhr, status, error) {
                //console.log('error', error)
            },
            success: function (result, status, xhr) {
                //console.log('result service', result.d.Status)
                if (result.d.Status == "0") {
                    that.state.p_iscflead = 'N'
                }
                else if (result.d.Status == "2") {
                    that.state.p_iscflead = 'Y'
                }
                else if (result.d.Status == "3") {
                    toast.error(this.props.strings.emtymobile, { position: toast.POSITION.BOTTOM_RIGHT })
                }
            }
        })

    }
    submitGroup() {
        let i = 0;
        if (this.state.selectedRows.size > 0) {

            this.state.selectedRows.forEach((key, value, set) => {

                new Promise((resolve, reject) => {

                    let data = this.state.data.filter(e => e.CUSTODYCD === value);
                    let success = null;
                    this.checkYESNO(data[0].MOBILE);
                    //console.log('data[0].MOBILE', data[0].MOBILE)
                    let datasend = {
                        custodycd: data[0].CUSTODYCD,
                        iscflead: this.state.p_iscflead,
                        language: this.props.language,
                        objname: this.props.OBJNAME
                    }
                    //console.log('datasend ', datasend)
                    resolve(RestfulUtils.posttrans('/account/checkcrm', datasend)
                        .then((res) => {
                            i += 1
                            success = (res.EC == 0);
                            success ? toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                                : toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                            if (this.state.selectedRows.size == i) {
                                this.setState({ loaded: false })
                                this.refresh()
                                let data = {
                                    pageSize: this.state.pageSize,
                                    page: this.state.page,
                                    sorted: this.state.sorted1,
                                    filtered: this.state.filtered1,
                                }

                            }
                        })
                    )
                })
            })
        } else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT })
    }


    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    render() {
        const { data, pages, loading, dataTest } = this.state;
        var that = this;
        return (
            <div>
                <div className="col-md-12" >
                    <div style={{ marginLeft: "-41px" }} className="col-md-10 ">
                        <input type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
                        <ButtonExport style={{ marginLeft: "5px" }} HaveChk={true} dataRows={this.state.dataAll} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />
                    </div>
                    <div style={{ textAlign: "right", marginLeft: "3%" }} className="col-md-2">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}> <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                            <span className="ReloadButton" onClick={this.reloadData.bind(this)}><i className="fas fa-sync-alt"></i></span>
                        </h5>
                    </div>
                </div>
                <div className="col-md-12" >
                    <ReactTable
                        columns={[
                            {
                                Header: props => <div className=" header-react-table">  <Checkbox checked={that.state.checkedAll} style={{ marginBottom: "14px", marginLeft: "8px" }} onChange={that.handleChangeALL.bind(that)} inline /></div>,
                                maxWidth: 45,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>
                                        <Checkbox style={{ textAlign: "center", marginLeft: "8px", marginTop: "-14px" }}
                                            checked={that.state.selectedRows.has(row.original.CUSTODYCD)}
                                            onChange={that.handleChange.bind(that, row)} inline
                                        />
                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            {
                                Header: props => <div className="header_table_pad_3">{this.props.strings.CUSTODYCD}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                width: 177,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="header_table_pad_3">{this.props.strings.FULLNAME}</div>,
                                id: "FULLNAME",
                                accessor: "FULLNAME",
                                width: 300,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="header_table_pad_3">{this.props.strings.IDCODE}</div>,
                                id: "IDCODE",
                                accessor: "IDCODE",
                                width: 174,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="header_table_pad_3">{this.props.strings.MOBILE}</div>,
                                id: "MOBILE",
                                accessor: "MOBILE",
                                width: 200,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="header_table_pad_3">{this.props.strings.OPNDATE}</div>,
                                id: "OPNDATE",
                                accessor: "OPNDATE",
                                width: 110,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="header_table_pad_3">{this.props.strings[getExtensionByLang("CDCONTENT", this.props.language)]}</div>,
                                id: getExtensionByLang("CDCONTENT", this.props.language),
                                accessor: getExtensionByLang("CDCONTENT", this.props.language),
                                width: 130,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
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
    translate('TableCRM')
]);

module.exports = decorators(TableCRM);
