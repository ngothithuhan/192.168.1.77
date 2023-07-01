import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import { connect } from 'react-redux'
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from '../../../../Helpers';
import 'react-select/dist/react-select.css';
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem';
import { Button } from 'react-bootstrap';
import NumberInput from 'app/utils/input/NumberInput';
import Select from 'react-select';

class TableDoiPhienGDLenhDat extends Component {
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
            CUSTODYCD: { value: '', label: '' },
        }
        // this.fetchData = this.fetchData.bind(this);
    }
    componentDidMount() {
        this.refresh()
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.lang != nextProps.currentLanguage) {
            this.state.lang = nextProps.currentLanguage
            this.state.loading = true
            this.refReactTable.fireFetchData()
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
        let custodycd = this.state.CUSTODYCD && this.state.CUSTODYCD.value ? this.state.CUSTODYCD.value : '';
        RestfulUtils.posttrans('/fund/getChangeSessionOrders', { pagesize: this.state.pagesize, language: this.props.language, p_custodycd: custodycd, OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord, dataALL: resData.DT.dataAll })
            }
        });

    }
    async loadData(pagesize, page, keySearch, sortSearch, columns) {
        let that = this;
        let custodycd = this.state.CUSTODYCD && this.state.CUSTODYCD.value ? this.state.CUSTODYCD.value : '';
        await RestfulUtils.post('/fund/getChangeSessionOrders', { pagesize, page, keySearch, sortSearch, language: this.props.language, p_custodycd: custodycd, OBJNAME: this.props.OBJNAME }).then((resData) => {

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


    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
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
            this.state.CUSTODYCD = e
            this.state.isSearch = true
            this.setState(this.state);
        }
    }

    render() {
        const { data, pages } = this.state;
        var that = this;
        return (
            <div>
                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                        <div className="col-md-2">
                            <h5 className="highlight"><b>{this.props.strings.custodycd}</b></h5>
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
                            <Button style={{ fontSize: 12 }} bsStyle="" className="pull-left btndangeralt" id="btnsubmit" onClick={this.refresh.bind(this)}>{this.props.strings.search}</Button>
                        </div>
                    </div>

                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                        <ButtonExport style={{ marginLeft: "5px" }} HaveChk={true} dataRows={this.state.dataALL} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />

                    </div>
                    <div style={{ textAlign: "right" }} className="col-md-2 RightInfo">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}> <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                            <span className="ReloadButton" onClick={this.refresh.bind(this)}><i className="fas fa-sync-alt"></i></span>
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
                                        {/* ho tro lay dc dung hang danh click */}
                                        <button type="button" className="btn btn-primary" onClick={this.handlEdit.bind(this, row.original)}>  <a style={{ color: "#ffffff", textDecoration: "none" }}>{this.props.strings.submit}</a></button>

                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            {
                                Header: props => <div className=""><b>{this.props.strings.orderid}</b></div>,
                                id: "ORDERID",
                                accessor: "ORDERID",
                                width: 140,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className=""><b>{this.props.strings.symbol}</b></div>,
                                id: "SYMBOL",
                                accessor: "SYMBOL",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className=""><b>{this.props.strings.custodycd}</b></div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                width: 110,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className=""><b>{this.props.strings.fullname}</b></div>,
                                id: "FULLNAME",
                                accessor: "FULLNAME",
                                width: 120,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className=""><b>{this.props.strings.ordertype}</b></div>,
                                id: "EXECTYPE",
                                accessor: "EXECTYPE",
                                width: 100,
                                Cell: row => (
                                    <div className="col-left" style={{ float: "left" }}>
                                        <span>{this.props.language == 'vie' ? row.original.EXECTYPE_DESC : row.original.EXECTYPE_DESC_EN}</span>
                                    </div>
                                ),
                            },
                            {
                                Header: props => <div className=""><b>{this.props.strings.ordervalue}</b></div>,
                                id: "ORDERVALUE",
                                accessor: "ORDERVALUE",
                                width: 120,
                                Cell: ({ value }) => (
                                    <span className="col-right">
                                        <NumberInput value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={''} />
                                    </span>
                                ),
                            },
                            {
                                Header: props => <div className=""><b>{this.props.strings.tradingdate}</b></div>,
                                id: "TRADINGDATE",
                                accessor: "TRADINGDATE",
                                width: 120,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className=""><b>{this.props.strings.status}</b></div>,
                                id: "STATUS",
                                accessor: "STATUS",
                                width: 100,
                                Cell: row => (
                                    <div className="col-left" style={{ float: "left" }}>
                                        <span>{this.props.language == 'vie' ? row.original.DESC_STATUS : row.original.DESC_STATUS_EN}</span>
                                    </div>
                                ),
                            },
                            {
                                Header: props => <div className=""><b>{this.props.strings.placeuser}</b></div>,
                                id: "USERNAME",
                                accessor: "USERNAME",
                                width: 120,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className=""><b>{this.props.strings.placedate}</b></div>,
                                id: "TXDATE",
                                accessor: "TXDATE",
                                width: 120,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className=""><b>{this.props.strings.placetime}</b></div>,
                                id: "TXTIME",
                                accessor: "TXTIME",
                                width: 120,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className=""><b>{this.props.strings.swsymbol}</b></div>,
                                id: "SWSYMBOL",
                                accessor: "SWSYMBOL",
                                width: 150,
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
                        pages={pages}
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
                        defaultPageSize={this.state.pagesize}
                        className="-striped -highlight"
                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}

                    />
                </div>
            </div >
        );
    }
}

TableDoiPhienGDLenhDat.defaultProps = {
};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    language: state.language.language
});

const decorators = flow([
    connect(stateToProps),
    translate('TableDoiPhienGDLenhDat')
]);
module.exports = decorators(TableDoiPhienGDLenhDat);
