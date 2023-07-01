import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import { connect } from 'react-redux';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getRowTextTable, getPageTextTable } from '../../../../Helpers';
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
class TableDSXacNhanOTP extends Component {
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

        }

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

    handlEdit(data) {       
        this.props.showModalDetail(data);
    }

    fetchData(state, instance) {
        var that = this;
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

        RestfulUtils.post('/account/getcfmastotp', { pagesize: this.state.pagesize, language: this.props.language,OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord, dataAll: resData.DT.dataAll })
            }
        });

    }
    async loadData(pagesize, page, keySearch, sortSearch, columns) {

        let that = this;
        await RestfulUtils.post('/account/getcfmastotp', { pagesize, page, keySearch, sortSearch, language: this.props.language, OBJNAME: this.props.OBJNAME }).then(resData => {
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
        let that = this;
        await RestfulUtils.posttrans('account/getcfmastotp', { pagesize: that.state.pagesize, page: that.state.page, keySearch: that.state.keySearch, sortSearch: that.state.sortSearch, language: that.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
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
                <div  className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10">
                        <ButtonExport style={{ marginLeft: "7px" }} HaveChk={true} dataRows={this.state.dataAll} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />
                    </div>
                    <div style={{ textAlign: "right" }} className="col-md-2 RightInfo" >
                        <h5 className="highlight" style={{ fontWeight: "bold" }}> <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
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
                                Header: props => <div className="">{this.props.strings.CUSTODYCD}</div>,
                                id: "CUSTID",
                                accessor: "CUSTODYCD",
                                width: 112,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.FULLNAME}</div>,
                                id: "FULLNAME",
                                accessor: "FULLNAME",
                                width: 290,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },


                            {
                                Header: props => <div className="">{this.props.strings.IDTYPE_DESC}</div>,
                                id: "IDTYPE_DESC",
                                accessor: "IDTYPE_DESC",
                                width: 250,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.IDCODE}</div>,
                                id: "IDCODE",
                                accessor: "IDCODE",
                                width: 165,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.OTPTYPE_DESC}</div>,
                                id: "OTPTYPE_DESC",
                                accessor: "OTPTYPE_DESC",
                                width: 230,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            }
                        ]}
                        getTheadTrProps={() => {
                            return {
                                className: 'head'
                            }
                        }}

                        manual
                        filterable
                        pages={pages}
                        data={data}
                        style={{
                            maxHeight: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                        }}
                        noDataText={this.props.strings.textNodata}
                        onFetchData={this.fetchData.bind(this)}
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
            </div>
        );
    }
}

TableDSXacNhanOTP.defaultProps = {

    strings: {
        custid: 'Mã khách hàng',
        custodycd: 'Số hiệu TKGD',
        fullname: 'Họ tên',
        idtype: 'Loại giấy tờ',
        idcode: 'Số ĐKSH',
        otptype: 'Loại xác thực OTP'

    },


};
const stateToProps = state => ({
    notification: state.notification,
    language: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('TableDSXacNhanOTP')
]);

module.exports = decorators(TableDSXacNhanOTP);
