import React, { Component } from 'react';
import ReactTable from "react-table";
import NumberInput from 'app/utils/input/NumberInput'
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from 'app/Helpers';
import Select from 'react-select'
import { Button, Checkbox } from 'react-bootstrap';
import { toast } from 'react-toastify';

class TableQuanLyLenhSipDaSua extends Component {
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
            sumRecord: 0,
            CUSTODYCD: { label: '', value: '' },
            DBCODE: { label: '', value: '' },
            //SALEID: { label: '', value: '' },
            datagroup: {
                custodycd: '',
                //saleid: '',
            },
            checkFields: [
                { name: "custodycd", id: "cbCUSTODYCD" },
            ],    
        }
        // this.fetchData = this.fetchData.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.lang != nextProps.currentLanguage) {
            this.state.lang = nextProps.currentLanguage
            this.state.loading = true
            this.refReactTable.fireFetchData()
        }
        this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch);
    }
    handleAdd(evt) {
        var that = this;
        that.props.showModalDetail("add");
    }
    handlEdit(data) {
        var that = this;
        that.props.showModalDetail("update", data);
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
    onRowClick(state, rowInfo, column, instance) {
        var that = this;
        return {
            onDoubleClick: e => {
                // that.props.showModalDetail("view", rowInfo.original)
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

    async loadData(pagesize, page, keySearch, sortSearch, columns) {
        let that = this;
        let {user}= this.props.auth;
        let custodycd = '';
        let iscustomer = '';
        if (user.ISCUSTOMER == 'Y'){
            iscustomer == 'Y';
            custodycd = user.USERID;
        }
        
        let p_custodycd = this.state.CUSTODYCD && this.state.CUSTODYCD.value ? this.state.CUSTODYCD.value : 'ALL';
        let p_dbcode = this.state.DBCODE && this.state.DBCODE.value ? this.state.DBCODE.value : 'ALL';

        await RestfulUtils.post('/vcbf/getAmendSipConfirm', 
            { pagesize, page, keySearch, sortSearch, 
            language: this.props.language, OBJNAME: this.props.OBJNAME,
            p_custodycd: p_custodycd, p_dbcode: p_dbcode,
            ISCUSTOMER : iscustomer , CUSTODYCD : custodycd }) .then((resData) => {
            console.log('resData', resData);
            if (resData.EC == 0)
                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord,
                    colum: columns,
                    dataALL: resData.DT.dataAll
                });
        });
    }
    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    async reloadTable() {
        this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch);
    }

    async onChange(e) {
        var self = this;
        if (e) {
            this.setState({ CUSTODYCD: e });
        }
    }

    getOptions(input) {
        return RestfulUtils.post('/account/search_all', { key: input })
            .then((res) => {
                const { user } = this.props.auth
                let isCustom = user && user.ISCUSTOMER == 'Y';
                var data = [];
                if (isCustom) {
                    var defaultCustodyCd = this.props.auth.user.USERID;
                    data = [{ label: defaultCustodyCd, value: defaultCustodyCd }];
                } else {
                    data = res;
                    data.unshift({ value: 'ALL', label: 'All-Tất cả' })
                }
                return { options: data };
        })
    }

    getAgentOptions(input) {
        return RestfulUtils.post('/vcbf/getAgentsList', { key: input, OBJNAME: this.props.OBJNAME })
            .then((res) => {
                res.unshift({ value: 'ALL', label: 'All-Tất cả' })
                return { options: res };
        })
    }

    async onAgentChange(e) {
        var self = this;
        if (e) {
            this.setState({ DBCODE: e });
        }
    }

    submitGroup = () => {
        let i = 0;
        if (this.state.selectedRows.size > 0) {
            this.state.selectedRows.forEach((key, value, set) => {
                new Promise((resolve, reject) => {
                    let data = this.state.data.filter(e => e.ORDERID === value);
                    let success = null;
                    let dataACCEPT = {
                        p_orderid: data[0].ORDERID, 
                        p_custodycd: data[0].CUSTODYCD, 
                        p_codeid: data[0].CODEID, 
                        p_fullname: data[0].FULLNAME, 
                        p_oldordervalue: data[0].OLDORDERVALUE, 
                        p_amount: data[0].ORDERAMT, 
                        p_dealtype: data[0].DEALTYPE,
                        language: this.props.language, 
                        objname: this.props.OBJNAME
                    }
                    console.log('dataACCEPT ', dataACCEPT)
                    resolve(RestfulUtils.posttrans('/vcbf/submitConfirmAmendSip', dataACCEPT)
                        .then(res => {
                            i += 1
                            success = (res.EC == 0);
                            success ? toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                                : toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                            if (this.state.selectedRows.size == i) {
                                this.setState({ loaded: false })
                                this.refReactTable.fireFetchData()
                            }
                        })
                    );
                })
            })
        } else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT })
    }

    handleChangeALL(evt) {
        var that = this;
        this.setState({ checkedAll: evt.target.checked });
        if (evt.target.checked) {
            that.state.data.map(function (item) {
                if (!that.state.selectedRows.has(item.ORDERID)) {
                    that.state.unSelectedRows.push(item.ORDERID);
                    that.state.selectedRows.add(item.ORDERID);
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

        if (!this.state.selectedRows.has(row.original.ORDERID))
            this.state.selectedRows.add(row.original.ORDERID);
        else {
            this.state.selectedRows.delete(row.original.ORDERID);
        }
        this.setState({ selectedRows: this.state.selectedRows });
    }

    render() {
        const { data, pages, loading } = this.state;

        const { user } = this.props.auth
        let isCustom = user && user.ISCUSTOMER == 'Y';

        var that = this;
        return (
            <div>
                <div className="row col-md-12 mgt-10 customSelect">
                    <div className="col-md-5">
                        <h5 className="col-md-5"><b>{this.props.strings.CUSTODYCD}</b></h5>
                        <div className="col-md-7">
                            <Select.Async
                                disabled={isCustom}
                                name="form-field-name"
                                placeholder={this.props.strings.CUSTODYCD}
                                loadOptions={this.getOptions.bind(this)}
                                value={this.state.CUSTODYCD}
                                onChange={this.onChange.bind(this)}
                                cache={false}
                            />
                        </div>
                    </div>
                    <div className="col-md-5">
                        <h5 className="col-md-5"><b>{this.props.strings.distributionagent}</b></h5>
                        <div className="col-md-7">
                            <Select.Async
                                disabled={isCustom}
                                name="form-field-name"
                                placeholder={this.props.strings.distributionagent}
                                loadOptions={this.getAgentOptions.bind(this)}
                                value={this.state.DBCODE}
                                onChange={this.onAgentChange.bind(this)}
                                cache={false}
                            />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <Button style={{ fontSize: 12 }} bsStyle="" className="pull-left btndangeralt" id="btnsubmit" onClick={this.reloadTable.bind(this)}>{this.props.strings.search}</Button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-10 ">
                        <ButtonExport style={{ marginLeft: "7px", marginTop: "10px", marginBottom: "10px" }} HaveChk={true} dataRows={this.state.dataALL} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />
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
                            // {
                            //     Header: props => <div className=" header-react-table">  </div>,
                            //     maxWidth: 95,

                            //     sortable: false,
                            //     style: { textAlign: 'center' },
                            //     Cell: (row) => (
                            //         <div>

                            //             <button type="button" className="btn btn-primary" onClick={this.handlEdit.bind(this, row.original)}>  <a style={{ color: "#ffffff" }}>{this.props.strings.perform}</a></button>

                            //         </div>
                            //     ),
                            //     Filter: ({ filter, onChange }) =>
                            //         null
                            // },
                            {
                                Header: props => <div className=" header-react-table">    <Checkbox checked={that.state.checkedAll} style={{ marginBottom: "14px", marginLeft: "8px" }} onChange={that.handleChangeALL.bind(that)} inline /></div>,
                                maxWidth: 45,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>
                                        <Checkbox style={{ textAlign: "center", marginLeft: "8px", marginTop: "-14px" }}
                                            checked={that.state.selectedRows.has(row.original.ORDERID)}
                                            onChange={that.handleChange.bind(that, row)} inline
                                        />
                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ORDERID}</div>,
                                id: "ORDERID",
                                accessor: "ORDERID",
                                width: 120,

                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.SYMBOL}</div>,
                                id: "SYMBOL",
                                accessor: "SYMBOL",
                                width: 80,

                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.CUSTODYCD}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                width: 90,

                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.SIPTYPE_DESC}</div>,
                                id: "PRODUCTTYPE",
                                accessor: "PRODUCTTYPE",
                                width: 150,

                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.FEEID}</div>,
                                id: "FEEID",
                                accessor: "FEEID",
                                width: 150,

                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("EXECTYPE_DESC", this.props.language)]}</div>,
                                id: getExtensionByLang("EXECTYPE_DESC", this.props.language),
                                accessor: getExtensionByLang("EXECTYPE_DESC", this.props.language),
                                width: 150,



                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ORDERVALUE}</div>,
                                id: "ORDERVALUE",
                                accessor: "ORDERVALUE",
                                width: 120,



                                Cell: ({ value }) => (
                                    <div className="col-right">
                                        <NumberInput value={value} displayType={'text'} thousandSeparator={true} decimalScale = {2} />
                                    </div>

                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.OLDORDERVALUE}</div>,
                                id: "OLDORDERVALUE",
                                accessor: "OLDORDERVALUE",
                                width: 120,



                                Cell: ({ value }) => (
                                    <div className="col-right">
                                        <NumberInput value={value} displayType={'text'} thousandSeparator={true} decimalScale = {2} />
                                    </div>

                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("DESC_STATUS", this.props.language)]}</div>,
                                id: getExtensionByLang("DESC_STATUS", this.props.language),
                                accessor: getExtensionByLang("DESC_STATUS", this.props.language),
                                width: 150,



                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },


                            {
                                Header: props => <div className="wordwrap">{this.props.strings.USERNAME}</div>,
                                id: "USERNAME",
                                accessor: "USERNAME",
                                width: 170,



                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TXDATE}</div>,
                                id: "TXDATE",
                                accessor: "TXDATE",
                                width: 83,



                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TXTIME}</div>,
                                id: "TXTIME",
                                accessor: "TXTIME",
                                width: 69,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.VSDSTATUS_DESC}</div>,
                                id: "VSDSTATUS_DESC",
                                accessor: "VSDSTATUS_DESC",
                                width: 150,

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
                <div style={{marginTop: '10px'}} className="pull-right">
                    <input type="button" onClick={this.submitGroup} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
                </div>
            </div>
        );
    }
}









const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    language: state.language.language,
    auth: state.auth,
});


const decorators = flow([
    connect(stateToProps),
    translate('TableQuanLyLenhSipDaSua')
]);

module.exports = decorators(TableQuanLyLenhSipDaSua);
