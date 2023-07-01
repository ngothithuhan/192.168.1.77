import React, { Component } from 'react';
import ReactTable from "react-table";
import Select from 'react-select';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from 'app/Helpers';
import { Button } from 'react-bootstrap';
import { showNotifi } from 'app/action/actionNotification.js';
import NumberFormat from 'react-number-format';

class TablePhongToaCCQ extends Component {
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
            keySearch: {},
            sortSearch: {},
            page: 1,
            lang: this.props.language,
            CUSTODYCD: '',
            sumRecord: 0,
            checkFields: [
                { name: "CUSTODYCD", id: "cbCUSTODYCD" },
            ],
        }
        // this.fetchData = this.fetchData.bind(this);
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
        var that = this;
        var obj = {
            custodycd: this.state.CUSTODYCD.value,
            language: this.props.language,
            pagesize: pagesize,
            objname: this.props.OBJNAME,
        }

        RestfulUtils.post('/balance/getlistsemastblock', { ...obj, page, keySearch, sortSearch }).then(resData => {
            if (resData.EC == 0) {
                that.setState({
                    data: resData.DT.data,
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
    getOptions(input) {
        return RestfulUtils.post('/account/search_all_fullname', { key: input })
            .then((res) => {
                res.push({ value: 'ALL', label: 'All-Tất cả' })

                return { options: res }
            })
    }
    onChangeCUSTODYCD(e) {
        if (e) {
            if (this.state["CUSTODYCD"] != e.value) {
                this.state["CUSTODYCD"] = e.value
                this.state.CUSTODYCD = e
                this.setState(this.state);
            }
        }
    }
    search() {
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }
        if (mssgerr == '') {
            RestfulUtils.post('/balance/getlistsemastblock', { custodycd: this.state.CUSTODYCD.value, pagesize: this.state.pagesize, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
                if (resData.EC == 0) {
                    this.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord })

                } else {
                    toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
                }
            });
        }

    }
    checkValid(name, id) {
        let value = this.state[name];

        let mssgerr = '';
        switch (name) {
            case "CUSTODYCD":
                if (value == '') {
                    mssgerr = this.props.strings.requiredcustodycd;
                }
                break;
            default:
                break;
        }
        if (mssgerr !== '') {
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            datanotify.type = "error";
            datanotify.content = mssgerr;
            dispatch(showNotifi(datanotify));
            window.$(`#${id}`).focus();
        }
        return mssgerr;
    }
    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    async reloadTable() {
        let that = this;
        await RestfulUtils.posttrans('/balance/getlistsemastblock', { pagesize: that.state.pagesize, page: that.state.page, keySearch: that.state.keySearch, sortSearch: that.state.sortSearch, language: that.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
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
    render() {
        const { data, pages, loading } = this.state;
        var that = this;
        return (
            <div>
                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                        <div className="col-md-2">
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
                        </div>
                        <div className="col-md-2">
                            <Button style={{ fontSize: 12 }} bsStyle="" className="pull-left btndangeralt" id="btnsubmit" onClick={this.search.bind(this)}>{this.props.strings.search}</Button>
                        </div>
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
                                Header: props => <div className=" header-react-table">  </div>,
                                maxWidth: 90,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>
                                        <button type="button" className="btn btn-primary" onClick={this.handlEdit.bind(this, row.original)}>  <a style={{ color: "#ffffff" }}>{this.props.strings.submit}</a></button>
                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.CUSTODYCD}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                width: 85,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.FULLNAME}</div>,
                                id: "FULLNAME",
                                accessor: "FULLNAME",
                                width: 190,
                                Cell: ({ value }) => (
                                    <div className="col-center">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.SYMBOL}</div>,
                                id: "SYMBOL",
                                accessor: "SYMBOL",
                                width: 90,
                                Cell: ({ value }) => (
                                    <div className="col-center">{value}</div>
                                )
                            },
                          
                           
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TRADE}</div>,
                                id: "TRADE",
                                accessor: "TRADE",
                                width: 120,
                                Cell: ({ value }) => {
                                    return (
                                        <span style={{ float: 'left', paddingLeft: '5px'}}>
                                            <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                        </span>)
                                }
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.AVLQTTY}</div>,
                                id: "AVLQTTY",
                                accessor: "AVLQTTY",
                                width: 120,
                                Cell: ({ value }) => {
                                    return (
                                        <span style={{ float: 'left', paddingLeft: '5px'}}>
                                            <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                        </span>)
                                }
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.AVLQTTYSIP}</div>,
                                id: "AVLQTTYSIP",
                                accessor: "AVLQTTYSIP",
                                width: 120,
                                Cell: ({ value }) => {
                                    return (
                                        <span style={{ float: 'left', paddingLeft: '5px'}}>
                                            <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                        </span>)
                                }
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.SENDING}</div>,
                                id: "SENDING",
                                accessor: "SENDING",
                                width: 108,
                                Cell: ({ value }) => {
                                    return (
                                        <span style={{ float: 'left', paddingLeft: '5px'}}>
                                            <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                        </span>)
                                }
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.RECEIVING}</div>,
                                id: "RECEIVING",
                                accessor: "RECEIVING",
                                width: 108,
                                Cell: ({ value }) => {
                                    return (
                                        <span style={{ float: 'left', paddingLeft: '5px'}}>
                                            <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                        </span>)
                                }
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.SECURED}</div>,
                                id: "SECURED",
                                accessor: "SECURED",
                                width: 105,
                                Cell: ({ value }) => {
                                    return (
                                        <span style={{ float: 'left', paddingLeft: '5px'}}>
                                            <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                        </span>)
                                }
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
    translate('TablePhongToaCCQ')
]);

module.exports = decorators(TablePhongToaCCQ);
