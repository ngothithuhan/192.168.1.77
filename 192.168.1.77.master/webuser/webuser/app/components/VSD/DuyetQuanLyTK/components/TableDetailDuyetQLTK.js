import React, { Component } from 'react';
import ReactTable from "react-table";
//import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from './../../../../Helpers';

class TableDetailDuyetQLTK extends Component {
    constructor(props) {
        super(props);
        this.state = {
            p_custid: '',
            p_desc: '',
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
        }
        // this.fetchData = this.fetchData.bind(this);
    }

    async componentDidMount() {
        await this.setState({
            p_custid: this.props.dataAction.p_custid,
            p_custodycd: this.props.dataAction.p_custodycd,
            p_fullname:this.props.dataAction.p_fullname,
            p_status: this.props.dataAction.p_status,
        })
        //await this.refresh()
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
        console.log('jump in refresh')
        let self = this
        RestfulUtils.posttrans('/account/getlistduyettkdetail', { custid: this.state.p_custid, pagesize: this.state.pagesize, language: this.props.language, OBJNAME: this.props.objname }).then((resData) => {
            //console.log('sync success', resData)
            if (resData.EC == 0) {
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages })
            } else {
                toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
            }
        });

    }

    async loadData(pagesize, page, keySearch, sortSearch, columns) {
        console.log('jump in loadData')
        let that = this;
        await RestfulUtils.posttrans('/account/getlistduyettkdetail', { custid: this.state.p_custid, pagesize, page, keySearch, sortSearch, language: this.props.language, OBJNAME: this.props.objname }).then((resData) => {
            if (resData.EC == 0)
                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                });
        });

    }

    handlEdit(data) {
        var that = this;
        that.props.showModalDetail("add", data);
    }

    approve = () => {
        let datasend = {
            custid: this.state.p_custid,
            custodycd: this.state.p_custodycd,
            fullname: this.state.p_fullname,
            status: this.state.p_status,
            desc: this.state.p_desc,
            language: this.props.language,
            objname: this.props.objname
        }
        let success = null;
        //console.log('datasend ', datasend)
        RestfulUtils.post('/account/approvemanaacc', datasend)
            .then((res) => {
                if(res.EC==0) {
                    toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                    this.props.closeModalDetail()
                    this.props.loadWhenSuccess()
                }
                else {
                    toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                }
            })
    }
    reject = () => {
        let datasend = {
            custid: this.state.p_custid,
            custodycd: this.state.p_custodycd,
            fullname: this.state.p_fullname,
            status: this.state.p_status,
            desc: this.state.p_desc,
            language: this.props.language,
            objname: this.props.objname
        }
        RestfulUtils.post('/account/rejectmanaacc', datasend)
            .then((res) => {
                if(res.EC==0) {
                    toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                    this.props.closeModalDetail()
                    this.props.loadWhenSuccess()
                }
                else {
                    toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                }
            })
    }

    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    onChange(type, event) {

        if (event.target) {

            this.state[type] = event.target.value;
        }
        else {
            this.state[type] = event.value;
        }
        this.setState({
            p_desc: this.state.p_desc,
        })
    }
    render() {
        let disableWhenView = (this.props.access == 'view')
        const { data, pages, loading } = this.state;
        var that = this;
        return (
            <div>
                <div className="col-md-12" >
                    <div style={{ marginLeft: "-41px" }} className="col-md-5">
                        {/* <b>{this.props.strings.desc}</b> */}
                        <input style={{fontSize: 11 }} maxLength='200' placeholder={this.props.strings.desc} value={this.state.p_desc} onChange={this.onChange.bind(this, "p_desc")} className="form-control" id="txtdesc" disabled={disableWhenView} />
                    </div>
                    <div className="col-md-3">
                    </div>
                    <div style={{ textAlign: "right", marginLeft: "4%", right: '-37px' }} className="col-md-4">
                        <button disabled={disableWhenView} style={{ marginRight: "5px", fontSize: 11 }} className="btn btn-primary" onClick={this.approve}><span className="glyphicon glyphicon-ok"></span> {this.props.strings.approvebtn}</button>
                        <button disabled={disableWhenView} style={{ marginRight: "5px", fontSize: 11 }} className="btn btn-default" onClick={this.reject}><span className="glyphicon glyphicon-minus" onClick={this.reject}></span> {this.props.strings.rejectbtn}</button>
                    </div>
                </div>
                <div className="col-md-12" >
                    <ReactTable
                        columns={[

                            {
                                Header: props => <div className="wordwrap">Tab</div>,
                                id: "OBJTITLE",
                                accessor: "OBJTITLE",
                                width: 120,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.CAPTION}</div>,
                                id: "CAPTION",
                                accessor: "CAPTION",
                                width: 160,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ACTIONDESC}</div>,
                                id: "ACTIONDESC",
                                accessor: "ACTIONDESC",
                                width: 77,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.FROM_VALUE}</div>,
                                id: "FROM_VALUE",
                                accessor: "FROM_VALUE",
                                width: 180,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TO_VALUE}</div>,
                                id: "TO_VALUE",
                                accessor: "TO_VALUE",
                                width: 180,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TLNAME}</div>,
                                id: "TLNAME",
                                accessor: "TLNAME",
                                width: 105,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.MAKER_DT}</div>,
                                id: "MAKER_DT",
                                accessor: "MAKER_DT",
                                width: 80,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.MAKER_TIME}</div>,
                                id: "MAKER_TIME",
                                accessor: "MAKER_TIME",
                                width: 66,
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
    translate('TableDetailDuyetQLTK')
]);

module.exports = decorators(TableDetailDuyetQLTK);
