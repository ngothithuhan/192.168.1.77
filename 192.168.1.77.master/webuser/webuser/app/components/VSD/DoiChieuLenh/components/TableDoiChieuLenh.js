import React, { Component } from 'react';
import ReactTable from "react-table";
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import Select from 'react-select'
import { Button } from 'react-bootstrap';
import DateInput from 'app/utils/input/DateInput'
import RestfulUtils from 'app/utils/RestfulUtils';
import NumberFormat from 'react-number-format';
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from '../../../../Helpers';

class TableDoiChieuLenh extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //saleid: 'ALL',
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
            SRTYPE: '',
            tradingdate: '',
            DBCODE: '',
            SYMBOL: '',
            datamock: [{
                CUSTODYCD: "1",
                SYMBOL: "2",
                SRTYPE_DESC: "3",
                PRODUCT: "4",
                ORDAMT: "5",
                STATUS_DESC: "6",
                MATCHAMT: "7",
                EXAMT: "8",
                MISSAMT: "9",
                AMOUNT: "10",
            }]
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.lang != nextProps.currentLanguage) {
            this.state.lang = nextProps.currentLanguage
            this.state.loading = true
            this.refReactTable.fireFetchData()
        }
        if (nextProps.isrefresh) {
            this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch);
        }
    }
    componentWillMount() {
        this.refresh();

    }
    handleAdd(evt) {
        this.props.showModalDetail("add");
    }
    handlEdit(data) {
        this.props.showModalDetail("update", data);
    }
    handleChangeALL(evt) {
        var that = this;
        this.setState({
            checkedAll: evt.target.checked,
            selectedRows: new Set(),
            unSelectedRows: []
        });
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
        this.setState({ selectedRows: this.state.selectedRows, checkedAll: false });
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
                console.log('col:', instance.props.columns)
                setTimeout(() => resolve(this.loadData(pageSize, page + 1, filtered, sorted, instance.props.columns)), 500);
            })
        }
        this.setState({ loading: true })
    }
    refresh() {
        let self = this
        this.loadData();
    }
    async loadData(pagesize, page, keySearch, sortSearch, columns) {
        let that = this;
        let data = {
            pagesize, page, keySearch, sortSearch, columns,
            OBJNAME: this.props.OBJNAME, 
            language: this.props.language,
            srtype: this.state.SRTYPE ? this.state.SRTYPE.value : '',
            tradingdate: this.state.tradingdate,
            dbcode: this.state.DBCODE ? this.state.DBCODE.value : '',
            codeid: this.state.SYMBOL ? this.state.SYMBOL.value : '',
        }
        await RestfulUtils.post('/srreconcile/fetchListreconcile', data).then((resData) => {
            if (resData.EC == 0) {
                this.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord,
                    colum: columns,
                    dataAll: resData.DT.dataAll
                });
            }
            else {
            }
        });
    }
    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    reloadTable() {
        this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch)
    }
    onChangeTypeOrder(e) {
        this.setState({ SRTYPE: e })
    }
    async getOptionTypeOrder() {
        let res = await RestfulUtils.post('/allcode/getlist', { CDTYPE: 'IV', CDNAME: 'IVSRTYPE', CDVAL: '' })
        let listOptionSelect = [];
        if (res && res.data && res.errCode === 0) {
            if (res.data && res.data.length > 0) {
                res.data.map(item => {
                    listOptionSelect.push({
                        value: item.CDVAL,
                        label: this.props.language === 'vie' ? item.CDCONTENT : item.EN_CDCONTENT,
                    })
                })
            }
        }
        return { options: listOptionSelect };
    }
    onChangeDate(type, data) {
        this.setState({ tradingdate: data.value })
    }
    onChangeDbcode(e) {
        this.setState({ DBCODE: e })
    }
    getAgentOptions(input) {
        return RestfulUtils.post('/vcbf/getAgentsList', { key: input, OBJNAME: this.props.OBJNAME })
        .then((res) => {
            let showDbcode = ['003','988'],
            options = [];
                if (res && res.length > 0) {
                    res.forEach(item => {
                        if (showDbcode.includes(item.value)) options.push(item);
                    })
                }
                return { options }
            })
        }
    getOptionsSYMBOL(input) {
        return RestfulUtils.post('/allcode/search_all_funds', { key: input })
            .then((res) => {
                return { options: res }
            })
    }
    onChangeSYMBOL(e) {
        this.setState({ SYMBOL: e })
    }
    render() {
        const { data, datamock, pages } = this.state;
        var that = this;
        return (
            <div className='table-doi-chieu-lenh-container'>
                <div className="row table-doi-chieu-lenh-header col-md-12">
                    <div className="col-md-5">
                        <div className="col-md-12">
                            <div className="col-md-3" style={{ paddingLeft: 0 }}>
                                <h5><b>{this.props.strings.SRTYPEDESC}</b></h5>
                            </div>
                            <div className="col-md-9 customSelect">
                                <Select.Async
                                    name="form-field-name form-control"
                                    loadOptions={this.getOptionTypeOrder.bind(this)}
                                    value={this.state.SRTYPE}
                                    onChange={this.onChangeTypeOrder.bind(this)}
                                    cache={false}
                                    backspaceRemoves={true}
                                    clearable={true}
                                    id="drdSRTYPE"
                                    placeholder={this.props.strings.SRTYPEDESC}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="col-md-12">
                            <div className="col-md-3" style={{ paddingLeft: 0 }}>
                                <h5><b>{this.props.strings.TRADINGDATE}</b></h5>
                            </div>
                            <div className="col-md-9">
                                <DateInput 
                                    onChange={this.onChangeDate.bind(this)} 
                                    value={this.state.tradingdate} 
                                    type="tradingdate" 
                                    id="txtDate"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="col-md-12">
                            <div className="col-md-3" style={{ paddingLeft: 0 }}>
                                <h5><b>{this.props.strings.DBCODE}</b></h5>
                            </div>
                            <div className="col-md-9 customSelect">
                                <Select.Async
                                    name="form-field-name form-control"
                                    loadOptions={this.getAgentOptions.bind(this)}
                                    value={this.state.DBCODE}
                                    onChange={this.onChangeDbcode.bind(this)}
                                    cache={false}
                                    backspaceRemoves={true}
                                    clearable={true}
                                    id="drdDBCODE"
                                    placeholder={this.props.strings.DBCODE}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="col-md-12">
                            <div className="col-md-3" style={{ paddingLeft: 0 }}>
                                <h5><b>{this.props.strings.SYMBOL}</b></h5>
                            </div>
                            <div className="col-md-9 customSelect">
                                <Select.Async
                                    name="form-field-name form-control"
                                    loadOptions={this.getOptionsSYMBOL.bind(this)}
                                    value={this.state.SYMBOL}
                                    onChange={this.onChangeSYMBOL.bind(this)}
                                    cache={false}
                                    backspaceRemoves={true}
                                    clearable={true}
                                    id="drdSYMBOL"
                                    placeholder={this.props.strings.SYMBOL}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="col-md-12">
                            <Button 
                                style={{ fontSize: 12 }} 
                                bsStyle="" className="pull-left btndangeralt" id="btnsubmit" 
                                onClick={this.reloadTable.bind(this)}>{this.props.strings.search}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="row"  style={{ marginBottom: "10px"}}>
                    <ButtonExport style={{ marginLeft: "5px" }} HaveChk={false} dataRows={this.state.dataAll} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />

                </div>
                <div className="col-md-12" >
                    <ReactTable
                        columns={
                            [
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.CUSTODYCD}</div>,
                                    id: "CUSTODYCD",
                                    accessor: "CUSTODYCD",
                                    width: 150,
                                    Cell: ({ value }) => (
                                        <div className="" style={{ textAlign: 'center' }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.FULLNAME}</div>,
                                    id: "FULLNAME",
                                    accessor: "FULLNAME",
                                    width: 150,
                                    Cell: ({ value }) => (
                                        <div className="" style={{ textAlign: 'left', paddingLeft: '5px' }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.IDCODE}</div>,
                                    id: "IDCODE",
                                    accessor: "IDCODE",
                                    width: 110,
                                    Cell: ({ value }) => (
                                        <div className="" style={{ textAlign: 'left', paddingLeft: '5px' }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.DBCODE}</div>,
                                    id: "DBCODE",
                                    accessor: "DBCODE",
                                    width: 100,
                                    Cell: ({ value }) => (
                                        <div className="" style={{ textAlign: 'center' }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.SYMBOL}</div>,

                                    accessor: "SYMBOL",
                                    width: 120,
                                    id: "SYMBOL",
                                    aggregate: vals => '',
                                    filterable: true,
                                    Cell: ({ value }) => (
                                        <div className="" style={{ textAlign: 'center' }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.SRTYPEDESC}</div>,
                                    id: "SRTYPEDESC",
                                    accessor: "SRTYPEDESC",
                                    aggregate: vals => '',
                                    filterable: true,

                                    width: 100,
                                    Cell: ({ value }) => (
                                        <div className="" style={{ textAlign: 'center' }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.PRODUCT}</div>,
                                    accessor: "PRODUCT",
                                    id: "PRODUCT",
                                    filterable: true,
                                    width: 100,

                                    Cell: ({ value }) => (
                                        <div className="" style={{ textAlign: 'center' }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.ORDAMT}</div>,
                                    accessor: "ORDAMT",
                                    id: "ORDAMT",
                                    filterable: true,
                                    width: 150,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                {
                                                    <NumberFormat value={parseInt(value)} displayType={'text'} thousandSeparator={true} />
                                                }
                                            </span>)
                                    }
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.AMOUNT}</div>,
                                    accessor: "AMOUNT",
                                    id: "AMOUNT",
                                    filterable: true,
                                    width: 150,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                {
                                                    <NumberFormat decimalScale={0} value={parseInt(value)} displayType={'text'} thousandSeparator={true} />
                                                }
                                            </span>)
                                    }
                                },
                                
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.MATCHAMT}</div>,
                                    accessor: "MATCHAMT",
                                    id: "MATCHAMT",
                                    width: 150,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                {
                                                    <NumberFormat value={parseInt(value)} displayType={'text'} thousandSeparator={true} />
                                                }
                                            </span>)
                                    }
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.EXAMT}</div>,
                                    accessor: "EXAMT",
                                    id: "EXAMT",
                                    filterable: true,
                                    width: 150,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                {
                                                    <NumberFormat value={parseInt(value)} displayType={'text'} thousandSeparator={true} />
                                                }
                                            </span>)
                                    }
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.MISSAMT}</div>,
                                    id: "MISSAMT",
                                    accessor: "MISSAMT",
                                    filterable: true,
                                    width: 150,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                {
                                                    <NumberFormat value={parseInt(value)} displayType={'text'} thousandSeparator={true} />
                                                }
                                            </span>)
                                    }
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.TRADINGDATE}</div>,
                                    id: "TRADINGDATE",
                                    accessor: "TRADINGDATE",
                                    width: 100,
                                    Cell: ({ value }) => (
                                        <div className="" style={{ textAlign: 'center' }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblSTATUS">{this.props.strings.STATUS_DESC}</div>,
                                    id: "STATUS_DESC",
                                    accessor: "STATUS_DESC",
                                    width: 120,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                },
                            ]
                        }
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
                        data={data} // truyen data da co qua 
                        style={{
                            maxHeight: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                        }}
                        noDataText="No data"
                        pageText={getPageTextTable(this.props.language)}
                        rowsText={getRowTextTable(this.props.language)}
                        previousText={<i className="fas fa-backward"></i>}
                        nextText={<i className="fas fa-forward"></i>}
                        loadingText="Đang tải..."
                        ofText="/"
                        getTrProps={this.onRowClick.bind(this)}
                        loadDataAgain={this.refresh.bind(this)} //load lai data cho luoi
                        defaultPageSize={this.state.pagesize}
                        className="-striped -highlight"
                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                    // onPageChange={(pageIndex) => that.setState({
                    //     selectedRows: new Set(),
                    //     checkedAll: false
                    // })}
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
    translate('TableDoiChieuLenh'),
]);
module.exports = decorators(TableDoiChieuLenh);
