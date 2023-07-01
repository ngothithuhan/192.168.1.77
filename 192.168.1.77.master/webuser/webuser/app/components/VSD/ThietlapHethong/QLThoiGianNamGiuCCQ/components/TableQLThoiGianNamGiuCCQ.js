import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang,getRowTextTable,getPageTextTable } from 'app/Helpers'
import { requestData } from 'app/utils/ReactTableUlti';
import NumberInput from 'app/utils/input/NumberInput';


class TableQLThoiGianNamGiuCCQ extends Component {
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
            firstRender: true,
            lang: this.props.lang,
        }
        // this.fetchData = this.fetchData.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.lang != nextProps.currentLanguage) {
            this.state.lang = nextProps.currentLanguage
            this.refReactTable.fireFetchData()
        }
        if (nextProps.loadgrid) {
            this.state.firstRender = true
            this.refReactTable.fireFetchData()
        }
    }

    onRowClick(state, rowInfo, column, instance) {
        var that = this;
        return {
            onDoubleClick: e => {
                var that = this;
                that.props.showModalDetail("view", rowInfo.original);
            },
            style: {
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.ID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.ID) ? 'black' : '',
            }
        }
    }

    fetchData(state, instance) {

        let that = this
        if (this.state.firstRender) {
            let data = {
                p_language: this.props.lang,
                objname:this.props.OBJNAME
            }
            RestfulUtils.posttrans('/fund/getsalecalculatortrailerfee ', { data }).then((resData) => {


                // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                if (resData.EC == 0) {
                    requestData(
                        state.pageSize,
                        state.page,
                        state.sorted,
                        state.filtered,
                        resData.DT.data,
                    ).then(res => {
                        // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                        this.setState({
                            data: res.rows,
                            pages: res.pages,
                            // loading: false,
                            firstRender: false,
                            dataALL: resData.DT.data,
                            selectedRows: new Set(),
                            checkedAll: false,
                            sumRecord: resData.DT.data.length,
                            colum: instance.props.columns,
                        });
                    });
                }

            })
        } else {
            requestData(
                state.pageSize,
                state.page,
                state.sorted,
                state.filtered,
                this.state.dataALL,
            ).then(res => {
                this.state.data = res.rows,
                    this.state.pages = res.pages,
                    this.state.colum = instance.props.columns
                    // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                    this.setState(that.state);
            });
        }
    }

    reloadTable() {
        this.state.firstRender = true
        this.refReactTable.fireFetchData()
    }
    render() {
        const { data, pagesize,pages } = this.state;
        var that = this;
        return (
            <div>
                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                        <ButtonExport style={{ marginLeft: "5px" }} HaveChk={true} dataRows={this.state.dataALL} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />
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
                                Header: props => <div className="wordwrap" id="lblMonthCal">{this.props.strings.MONTH_CAL}</div>,
                                id: "MONTH_CAL",
                                accessor: "MONTH_CAL",
                                width: 200,
                                Cell: ({ value }) => (
                                    <div className="" style={{ textAlign: "center" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblSaleid">{this.props.strings.SALEID}</div>,
                                id: "SALEID",
                                accessor: "SALEID",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="" style={{ textAlign: "center" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblTlfullname">{this.props.strings.TLFULLNAME}</div>,
                                id: "TLFULLNAME",
                                accessor: "TLFULLNAME",
                                width: 250,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblRetype">{this.props.strings.RETYPE}</div>,
                                id: "RETYPE",
                                accessor: "RETYPE",
                                width: 220,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblFeeamt">{this.props.strings.FEEAMT}</div>,
                                id: "FEEAMT",
                                accessor: "FEEAMT",
                                width: 150,
                                Cell: ({ value }) => (
                                    <NumberInput className="col-right" value={value} displayType={'text'} decimalScale={4} thousandSeparator={true} id={"lbl" + value} />
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblTrailerfeedeductamt">{this.props.strings.TRAILERFEEDEDUCTAMT}</div>,
                                id: "TRAILERFEEDEDUCTAMT",
                                accessor: "TRAILERFEEDEDUCTAMT",
                                width: 150,
                                Cell: ({ value }) => (
                                    <NumberInput className="col-right" value={value} displayType={'text'} decimalScale={4} thousandSeparator={true} id={"lbl" + value} />
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblFeeamtnet">{this.props.strings.FEEAMT_NET}</div>,
                                id: "FEEAMT_NET",
                                accessor: "FEEAMT_NET",
                                width: 150,
                                Cell: ({ value }) => (
                                    <NumberInput className="col-right" value={value} displayType={'text'} decimalScale={4} thousandSeparator={true} id={"lbl" + value} />
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
                        pageText={getPageTextTable(this.props.lang)}
                        rowsText={getRowTextTable(this.props.lang)}
                        previousText={<i className="fas fa-backward" id="previous"></i>}
                        nextText={<i className="fas fa-forward" id="next"></i>}
                        //loadingText="Đang tải..."
                        ofText="/"
                        getTrGroupProps={(row) => {
                            return {
                                id: "haha"
                            }
                        }}
                        getTrProps={this.onRowClick.bind(this)}
                        defaultPageSize={pagesize}
                        className="-striped -highlight"
                        onPageChange={(pageIndex) => {
                            this.state.selectedRows = new Set(),
                                this.state.checkedAll = false
                        }
                        }
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
    lang: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('TableQLThoiGianNamGiuCCQ')
]);

module.exports = decorators(TableQLThoiGianNamGiuCCQ);
