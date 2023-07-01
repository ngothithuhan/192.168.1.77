import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import { connect } from 'react-redux'
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from '../../../../Helpers';
import 'react-select/dist/react-select.css';
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'

class TableDuKienKhop extends Component {
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
            lang: this.props.language

        }
        // this.fetchData = this.fetchData.bind(this);
    }
    componentDidMount() {
        this.refresh()
    }
    componentWillReceiveProps(nextProps) {
        //console.log('ahihi', nextProps.loadgrid)
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

        RestfulUtils.posttrans('/order/getlisttradingsession_feecaculate', { pagesize: this.state.pagesize, language: this.props.language, symbol: this.state.CODEID, OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord, dataALL: resData.DT.dataAll })
            }
        });

    }
    async loadData(pagesize, page, keySearch, sortSearch, columns) {
        let that = this;
        await RestfulUtils.post('/order/getlisttradingsession_feecaculate', { pagesize, page, keySearch, sortSearch, language: this.props.language, symbol: this.state.CODEID, OBJNAME: this.props.OBJNAME }).then((resData) => {

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
    //thao tac voi seclect option
    getOptionsSYMBOL(input) {
        return RestfulUtils.post('/allcode/search_all_funds', { key: input })
            .then((res) => {

                return { options: res.data }
            })
    }
    onChangeSYMBOL(e) {
        //console.log("onChangeSYMBOL", e.value)
        if (e && e.value)
            this.setState({
                CODEID: e.value
            })
    }
    render() {
        const { data, pages } = this.state;
        var that = this;
        return (
            <div>
                <div className="row">
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
                                Header: props => <div className=""><b>{this.props.strings.SYMBOL}</b></div>,
                                id: "SYMBOL",
                                accessor: "SYMBOL",
                                width: 210,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className=""><b>{this.props.strings.TRADINGID}</b></div>,
                                id: "TRADINGID",
                                accessor: "TRADINGID",
                                width: 210,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className=""><b>{this.props.strings[getExtensionByLang("DESC_STATUS", this.props.language)]}</b></div>,
                                id: getExtensionByLang("DESC_STATUS", this.props.language),
                                accessor: getExtensionByLang("DESC_STATUS", this.props.language),
                                width: 200,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className=""><b>{this.props.strings.TRADINGDATE}</b></div>,
                                id: "TRADINGDATE",
                                accessor: "TRADINGDATE",
                                width: 210,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className=""><b>{this.props.strings.CLSORDDATE}</b></div>,
                                id: "CLSORDDATE",
                                accessor: "CLSORDDATE",
                                width: 220,
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

TableDuKienKhop.defaultProps = {
};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    language: state.language.language
});

const decorators = flow([
    connect(stateToProps),
    translate('TableDuKienKhop')
]);
module.exports = decorators(TableDuKienKhop);
