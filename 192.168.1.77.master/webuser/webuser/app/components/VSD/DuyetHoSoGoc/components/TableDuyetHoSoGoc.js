import React, { Component } from 'react';
import ReactTable from "react-table";
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import { Checkbox } from 'react-bootstrap';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from './../../../../Helpers';

class TableDuyetHoSoGoc extends Component {
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
        if (nextProps.isLoad) {
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
    handleChangeRow(row) {

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
        RestfulUtils.post('/account/getlistDuyetHoSoGoc', { pagesize: this.state.pagesize, OBJNAME: this.props.OBJNAME }).then((resData) => {
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
        await RestfulUtils.post('/account/getlistDuyetHoSoGoc', { pagesize, page, keySearch, sortSearch, OBJNAME: this.props.OBJNAME }).then((resData) => {
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
        let { pagesize, page, keySearch, sortSearch } = this.state
        let that = this;
        await RestfulUtils.posttrans('/account/getlistDuyetHoSoGoc', { pagesize, page, keySearch, sortSearch, OBJNAME: this.props.OBJNAME }).then((resData) => {
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
    approve = () => {
        let self = this;
        if (this.state.selectedRows.size > 0) {
            Promise.all(Array.from(this.state.selectedRows).map((value, idx) => {
                return new Promise((resolve, reject) => {
                    let data = this.state.data.filter(e => e.CUSTODYCD === value);
                    let datasend = {
                        custid: data[0].CUSTID,
                        custodycd: data[0].CUSTODYCD,
                        language: this.props.language,
                        objname: 'APPROVEORIGINALFILE'
                    }
                    let success = null;
                    //console.log('datasend ', datasend)
                    RestfulUtils.post('/account/approveoriginalfile', datasend)
                        .then((res) => {
                            if (res.EC == -788898) {
                                res.EM = this.props.lang == 'vie' ? 'Chưa đăng nhập hoặc không có quyền thực hiện chức năng này!' : res.EM
                            }
                            success = (res.EC == 0);
                            success ? toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                                : toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT });
                            resolve();
                            this.refresh();
                        })

                })

            })).then((data) => {
            })
        } else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT });

    }
    
    render() {
        const { data, pages, loading, dataTest } = this.state;
        var that = this;
        return (
            <div>
                {/* <div style={{ marginLeft: "-41px" }} className="col-md-10 ">
                        <ButtonExport style={{ marginLeft: "5px" }} HaveChk={true} dataRows={this.state.dataAll} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />
                    </div> */}
                <div className="row" style={{ marginBottom: "10px", marginLeft: -13 }}>
                    <div style={{ marginLeft: "-15px" }} className="col-md-10 ">
                        <button style={{ marginRight: "5px" }} className="btn btn-primary" onClick={this.approve}><span className="glyphicon glyphicon-ok"></span> {this.props.strings.btnapprove}</button>
                    </div>
                    <div style={{ textAlign: "right", marginLeft: "1%" }} className="col-md-2">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}> <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                            <span className="ReloadButton" onClick={this.reloadTable.bind(this)}><i className="fas fa-sync-alt"></i></span>
                        </h5>
                    </div>
                </div>
                <div className="col-md-12" >
                    <ReactTable
                        columns={[
                            {
                                // Header: props => <div className="wordwrap">  </div>,
                                // maxWidth: 90,
                                // sortable: false,
                                // style: { textAlign: 'center' },
                                // Cell: (row) => (
                                //     <div>
                                //         {/* ho tro lay dc dung hang danh click */}
                                //         <button type="button" className="btn btn-primary" onClick={this.handlEdit.bind(this, row.original)}>  <a style={{ color: "#ffffff", textDecoration: "none" }}>{this.props.strings.submit}</a></button>

                                //     </div>
                                // ),
                                // Filter: ({ filter, onChange }) =>
                                //     null

                                Header: props => <div className=""><Checkbox checked={this.state.checkAll} onChange={that.handleChangeALL.bind(that)} /></div>,
                                Cell: (row) => (
                                    <div>
                                        <Checkbox checked={this.state.selectedRows.has(row.original.CUSTODYCD)} onChange={this.handleChangeRow.bind(this, row)} />
                                    </div>
                                ),
                                sortable: false,
                                width: 40,
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.CUSTODYCD}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                width: 90,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.FULLNAME}</div>,
                                id: "FULLNAME",
                                accessor: "FULLNAME",
                                width: 220,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.IDCODE}</div>,
                                id: "IDCODE",
                                accessor: "IDCODE",
                                width: 77,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
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
                                Header: props => <div className="wordwrap">{this.props.strings.IDPLACE}</div>,
                                id: "IDPLACE",
                                accessor: "IDPLACE",
                                width: 200,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings.BIRTHDATE}</div>,
                            //     id: "BIRTHDATE",
                            //     accessor: "BIRTHDATE",
                            //     width: 80,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },

                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("CUSTTYPE_DESC", this.props.language)]}</div>,
                            //     id: getExtensionByLang("CUSTTYPE_DESC", this.props.language),
                            //     accessor: getExtensionByLang("CUSTTYPE_DESC", this.props.language),
                            //     width: 79,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ADDRESS}</div>,
                                id: "ADDRESS",
                                accessor: "ADDRESS",
                                width: 250,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings.MOBILE}</div>,
                            //     id: "MOBILE",
                            //     accessor: "MOBILE",
                            //     width: 90,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },
                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings.EMAIL}</div>,
                            //     id: "EMAIL",
                            //     accessor: "EMAIL",
                            //     width: 200,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("CFSTATUS_DESC", this.props.language)]}</div>,
                                id: getExtensionByLang("CFSTATUS_DESC", this.props.language),
                                accessor: getExtensionByLang("CFSTATUS_DESC", this.props.language),
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.DATEMAKER}</div>,
                                id: "DATEMAKER",
                                accessor: "DATEMAKER",
                                width: 110,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.MAKER}</div>,
                                id: "MAKER",
                                accessor: "MAKER",
                                width: 110,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.DATEMAKER_EDIT}</div>,
                                id: "DATEMAKER_EDIT",
                                accessor: "DATEMAKER_EDIT",
                                width: 110,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.MAKER_EDIT}</div>,
                                id: "MAKER_EDIT",
                                accessor: "MAKER_EDIT",
                                width: 115
                                ,
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
    translate('TableDuyetHoSoGoc')
]);

module.exports = decorators(TableDuyetHoSoGoc);
