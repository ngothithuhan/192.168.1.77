import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import { connect } from 'react-redux'
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import NumberInput from 'app/utils/input/NumberInput'
import { DefaultPagesize, SRTYPE_SW, COLORSW, SRTYPE_NR, COLORNS, COLORNR, getExtensionByLang, getPageTextTable, getRowTextTable } from '../../../../Helpers';
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'


class TableLenhChuaNhapOTP extends Component {
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
            lang: this.props.language

        }
        // this.fetchData = this.fetchData.bind(this);
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
        this.refresh()
    }
    componentWillReceiveProps(nextProps) {
        //console.log('ahihi', nextProps.loadgrid)
        if (this.state.lang != nextProps.currentLanguage) {
            this.state.lang = nextProps.currentLanguage
            this.state.loading = true
            this.refReactTable.fireFetchData()
        }
        this.refresh()
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

        RestfulUtils.post('/order/getotpconfirmorder', { pagesize: this.state.pagesize, language: this.props.language }).then((resData) => {
            if (resData.EC == 0) {
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord, dataALL: resData.DT.dataAll })
                //console.log('resData.DT', resData.DT)
            }
        });

    }
    reloadTable = () => {
        let self = this

        RestfulUtils.posttrans('/order/getotpconfirmorder', { pagesize: this.state.pagesize, language: this.props.language,OBJNAME: this.props.datapage ? this.props.datapage.OBJNAME : '' }).then((resData) => {
            if (resData.EC == 0) {
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord, dataALL: resData.DT.dataAll })
                //console.log('resData.DT', resData.DT)
            }
        });

    }
    async loadData(pagesize, page, keySearch, sortSearch, columns) {

        let that = this;
        await RestfulUtils.post('/order/getotpconfirmorder', { pagesize, page, keySearch, sortSearch, language: this.props.language }).then((resData) => {
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
            else {

            }
        });

    }

    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    render() {
        const { data, pages } = this.state;
        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        var that = this;
        return (
            <div>
                <div className="row">
                    <div style={{  marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                        <ButtonExport style={{ marginLeft: "5px" }} HaveChk={true} dataRows={this.state.dataALL} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />
                    </div>
                    <div style={{ textAlign: "right" }} className="col-md-2 RightInfo">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}> <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                        <span className="ReloadButton" onClick={this.reloadTable}><i className="fas fa-sync-alt"></i></span>
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
                                Header: props => <div className="">{this.props.strings.ORDERID}</div>,
                                id: "ORDERID",
                                accessor: "ORDERID",
                                width: 164,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.SYMBOL}</div>,
                                id: "SYMBOL",
                                accessor: "SYMBOL",
                                width: 85,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.CUSTODYCD}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                show: !isCustom,
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.DBCODE}</div>,
                                id: "DBCODE",
                                accessor: "DBCODE",
                                show: !isCustom,
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.EXECTYPE_DESC}</div>,
                                id: getExtensionByLang("EXECTYPE_DESC", this.props.language),
                                accessor: getExtensionByLang("EXECTYPE_DESC", this.props.language),
                                width: 140,
                                Cell: row => (
                                    <span style={{ fontWeight: 'bold', textTransform: 'uppercase', color: row.original.SRTYPE == SRTYPE_SW ? COLORSW : (row.original.EXECTYPE == SRTYPE_NR ? COLORNR : COLORNS) }}>
                                        {

                                            row.value

                                        }
                                    </span>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.ORDERVALUE}</div>,
                                id: "ORDERVALUE",
                                accessor: "ORDERVALUE",
                                Cell: ({ value }) => (
                                    <div className="col-left"><NumberInput value={value} displayType={'text'} thousandSeparator={true} /></div>
                                ),

                                width: 130

                            },
                            // {
                            //     Header: props => <div className="">{this.props.strings.status}</div>,

                            //     accessor: "DESC_STATUS",
                            //     width: 120,
                            //     Cell : ({value}) =>(
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.SWSYMBOL}</div>,
                                id: "SWSYMBOL",
                                accessor: "SWSYMBOL",
                                width: 85,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.USERNAME}</div>,
                                id: "USERNAME",
                                accessor: "USERNAME",
                                width: 156,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="" >{this.props.strings.TXDATE}</div>,
                                id: "TXDATE",
                                accessor: "TXDATE",
                                width: 94,
                                Cell: ({ value }) => (
                                    <div className="col-left" >{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" >{this.props.strings.TXTIME}</div>,
                                id: "TXTIME",
                                accessor: "TXTIME",
                                width: 92,
                                Cell: ({ value }) => (
                                    <div className="col-left" >{value}</div>
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
            </div>
        );
    }
}

TableLenhChuaNhapOTP.defaultProps = {

    strings: {
        tkgd: 'Số TKGD',
        fullname: 'Họ tên',
        ĐKSH: 'Số ĐKSH',
        iddate: 'Ngày cấp',
        idplace: 'Nơi cấp',
        pageText: 'Trang',


        rowsText: 'bản ghi',
        textNodata: 'Không có kết quả',
        vsdstatus: 'Trạng thái VSD',

    },


};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    language: state.language.language,
    auth: state.auth
});


const decorators = flow([
    connect(stateToProps),
    translate('TableLenhChuaNhapOTP')
]);

module.exports = decorators(TableLenhChuaNhapOTP);
