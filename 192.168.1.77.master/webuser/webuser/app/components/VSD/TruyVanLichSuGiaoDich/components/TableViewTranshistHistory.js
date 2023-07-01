import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import DateInput from 'app/utils/input/DateInput';
import { ButtonAdd, ButtonDelete, ButtonExport } from 'app/utils/buttonSystem/ButtonSystem.js'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getRowTextTable, getPageTextTable, ACTIONS_ACC } from 'app/Helpers.js';

import './TableViewTranshistHistory.scss'

const DATA_SAMPLE = [{
    "IDNUM": "53280",
    "Dealing Date": "31/12/2020",
    "Account Number": "003CC00572",
    "Customer Name": "PHẠM NGỌC TUẤN",
    "Order Type": "SWITCH_OUT",
    "Distributor": "SSI",
    "Channel": "VSD",
    "Fund": "SSIBF",
    "Shares": "172.76",
    "Value": "2,103,593",
    "Fee": "0",
    "Order Time": "31/12/2020 00:00",
    "Status": "PARTIALLY-FILLED",
    "Document Status": "NA"
},
{
    "IDNUM": "53281",
    "Dealing Date": "31/12/2020",
    "Account Number": "003CC00192",
    "Customer Name": "VŨ NGỌC NGHI",
    "Order Type": "SELL_NORMAL",
    "Distributor": "SSI",
    "Channel": "VSD",
    "Fund": "SSISCA",
    "Shares": "29,704.00",
    "Value": "634,005,146",
    "Fee": "0",
    "Order Time": "31/12/2020 00:00",
    "Status": "FILLED",
    "Document Status": "NA"
},
{
    "IDNUM": "53282",
    "Dealing Date": "31/12/2020",
    "Account Number": "003CM00025",
    "Customer Name": "MAI THANH VÂN",
    "Order Type": "SELL_NORMAL",
    "Distributor": "SSI",
    "Channel": "VSD",
    "Fund": "SSISCA",
    "Shares": "100,000.00",
    "Value": "2,134,410,000",
    "Fee": "0",
    "Order Time": "31/12/2020 00:00",
    "Status": "FILLED",
    "Document Status": "NA"
},
{
    "IDNUM": "53283",
    "Dealing Date": "31/12/2020",
    "Account Number": "003CLS0060",
    "Customer Name": "NGÔ THỊ THẢO",
    "Order Type": "SELL_SIP",
    "Distributor": "SSI",
    "Channel": "VSD",
    "Fund": "SSISCA",
    "Shares": "1,398.19",
    "Value": "29,843,107",
    "Fee": "327,462",
    "Order Time": "31/12/2020 00:00",
    "Status": "FILLED",
    "Document Status": "NA"
},
{
    "IDNUM": "53247",
    "Dealing Date": "31/12/2020",
    "Account Number": "988CC000N7",
    "Customer Name": "NGUYỄN TIẾN SỸ",
    "Order Type": "BUY_NORMAL",
    "Distributor": "SSIAM",
    "Sub-Agent": "VPB",
    "Channel": "MANUAL",
    "Request IP": "14.238.24.76",
    "Fund": "SSIBF",
    "Shares": "32,850.45",
    "Value": "400,000,000",
    "Fee": "0",
    "Order Time": "30/12/2020 15:37",
    "Status": "FILLED",
    "Document Status": "REQUIRE"
},
{
    "IDNUM": "53246",
    "Dealing Date": "31/12/2020",
    "Account Number": "988CC000N4",
    "Customer Name": "NGUYỄN DIỆP LINH",
    "Order Type": "BUY_NORMAL",
    "Distributor": "SSIAM",
    "Sub-Agent": "VPB",
    "Channel": "MANUAL",
    "Request IP": "14.238.24.76",
    "Fund": "SSIBF",
    "Shares": "24,637.84",
    "Value": "300,000,000",
    "Fee": "0",
    "Order Time": "30/12/2020 14:43",
    "Status": "FILLED",
    "Document Status": "REQUIRE"
},
{
    "IDNUM": "53244",
    "Dealing Date": "31/12/2020",
    "Account Number": "988CC000N5",
    "Customer Name": "CHU QUANG KIM",
    "Order Type": "BUY_NORMAL",
    "Distributor": "SSIAM",
    "Sub-Agent": "VPB",
    "Channel": "MANUAL",
    "Request IP": "45.122.241.164",
    "Fund": "SSIBF",
    "Shares": "82,126.14",
    "Value": "1,000,000,000",
    "Fee": "0",
    "Order Time": "30/12/2020 14:25",
    "Status": "FILLED",
    "Document Status": "REQUIRE"
},
{
    "IDNUM": "53243",
    "Dealing Date": "31/12/2020",
    "Account Number": "988CC000N6",
    "Customer Name": "NGUYỄN KHẮC XUYÊN",
    "Order Type": "BUY_NORMAL",
    "Distributor": "SSIAM",
    "Sub-Agent": "VPB",
    "Channel": "MANUAL",
    "Request IP": "45.122.241.164",
    "Fund": "SSIBF",
    "Shares": "821,261.47",
    "Value": "10,000,000,000",
    "Fee": "0",
    "Order Time": "30/12/2020 14:24",
    "Status": "FILLED",
    "Document Status": "REQUIRE"
},
{
    "IDNUM": "53242",
    "Dealing Date": "31/12/2020",
    "Account Number": "988CD000DC",
    "Customer Name": "NGUYỄN THỊ HẰNG HẢI",
    "Order Type": "BUY_NORMAL",
    "Distributor": "SSIAM",
    "Sub-Agent": "MBB",
    "Channel": "MANUAL",
    "Request IP": "45.122.241.164",
    "Fund": "SSIBF",
    "Shares": "5,748.83",
    "Value": "70,000,000",
    "Fee": "0",
    "Order Time": "30/12/2020 14:22",
    "Status": "FILLED",
    "Document Status": "REQUIRE"
},
{
    "IDNUM": "53240",
    "Dealing Date": "31/12/2020",
    "Account Number": "988CD000DF",
    "Customer Name": "TRỊNH KIM YẾN",
    "Order Type": "BUY_NORMAL",
    "Distributor": "SSIAM",
    "Sub-Agent": "MBB",
    "Channel": "WEB",
    "Fund": "SSIBF",
    "Shares": "9,855.13",
    "Value": "120,000,000",
    "Fee": "0",
    "Order Time": "30/12/2020 13:48",
    "Status": "FILLED",
    "Document Status": "WEB"
},
{
    "IDNUM": "53239",
    "Dealing Date": "31/12/2020",
    "Account Number": "988CD000DE",
    "Customer Name": "TRẦN THỊ MINH THU",
    "Order Type": "BUY_NORMAL",
    "Distributor": "SSIAM",
    "Sub-Agent": "MBB",
    "Channel": "WEB",
    "Fund": "SSIBF",
    "Shares": "24,637.84",
    "Value": "300,000,000",
    "Fee": "0",
    "Order Time": "30/12/2020 13:38",
    "Status": "FILLED",
    "Document Status": "WEB"
},
{
    "IDNUM": "53238",
    "Dealing Date": "31/12/2020",
    "Account Number": "988CC000N3",
    "Customer Name": "NGHIÊM THỊ KIỀU ANH",
    "Order Type": "BUY_NORMAL",
    "Distributor": "SSIAM",
    "Sub-Agent": "VPB",
    "Channel": "MANUAL",
    "Request IP": "45.122.241.164",
    "Fund": "SSIBF",
    "Shares": "82.12",
    "Value": "1,000,000",
    "Fee": "0",
    "Order Time": "30/12/2020 13:37",
    "Status": "FILLED",
    "Document Status": "REQUIRE"
},
{
    "IDNUM": "53237",
    "Dealing Date": "31/12/2020",
    "Account Number": "988FCB6651",
    "Customer Name": "TRINITY SECURITIES COMPANY LIMITED",
    "Order Type": "BUY_NORMAL",
    "Distributor": "SSIAM",
    "Channel": "WEB",
    "Fund": "SSISCA",
    "Shares": "3,497.70",
    "Value": "75,219,613",
    "Fee": "564,147",
    "Order Time": "30/12/2020 12:14",
    "Status": "FILLED",
    "Document Status": "WEB"
},
{
    "IDNUM": "53236",
    "Dealing Date": "31/12/2020",
    "Account Number": "988CD000AW",
    "Customer Name": "NGUYỄN DUY HUÂN",
    "Order Type": "BUY_NORMAL",
    "Distributor": "SSIAM",
    "Sub-Agent": "MBB",
    "Channel": "WEB",
    "Fund": "SSIBF",
    "Shares": "8,212.61",
    "Value": "100,000,000",
    "Fee": "0",
    "Order Time": "30/12/2020 11:24",
    "Status": "FILLED",
    "Document Status": "WEB"
},
{
    "IDNUM": "53235",
    "Dealing Date": "31/12/2020",
    "Account Number": "988CC000N1",
    "Customer Name": "ĐỖ THỊ KIM DUNG",
    "Order Type": "BUY_NORMAL",
    "Distributor": "SSIAM",
    "Sub-Agent": "VPB",
    "Channel": "MANUAL",
    "Request IP": "14.238.24.76",
    "Fund": "SSIBF",
    "Shares": "110,623.92",
    "Value": "1,347,000,000",
    "Fee": "0",
    "Order Time": "30/12/2020 10:44",
    "Status": "FILLED",
    "Document Status": "REQUIRE"
},
{
    "IDNUM": "53234",
    "Dealing Date": "31/12/2020",
    "Account Number": "988CC000N0",
    "Customer Name": "NGUYEN THI XUAN LAN",
    "Order Type": "BUY_NORMAL",
    "Distributor": "SSIAM",
    "Sub-Agent": "VPB",
    "Channel": "WEB",
    "Fund": "SSIBF",
    "Shares": "172,464.90",
    "Value": "2,100,000,000",
    "Fee": "0",
    "Order Time": "30/12/2020 10:44",
    "Status": "FILLED",
    "Document Status": "WEB"
},
{
    "IDNUM": "53233",
    "Dealing Date": "31/12/2020",
    "Account Number": "988CC000BD",
    "Customer Name": "PHAN THỊ THANH HIỀN",
    "Order Type": "SELL_NORMAL",
    "Distributor": "SSIAM",
    "Sub-Agent": "VPB",
    "Channel": "WEB",
    "Fund": "SSIBF",
    "Shares": "8,260.00",
    "Value": "100,576,981",
    "Fee": "80,462",
    "Order Time": "30/12/2020 10:27",
    "Status": "FILLED",
    "Document Status": "WEB"
},
{
    "IDNUM": "53232",
    "Dealing Date": "31/12/2020",
    "Account Number": "988CC000MZ",
    "Customer Name": "HOÀNG THỊ HẰNG",
    "Order Type": "BUY_NORMAL",
    "Distributor": "SSIAM",
    "Sub-Agent": "VPB",
    "Channel": "MOBILE",
    "Fund": "SSIBF",
    "Shares": "8,212.61",
    "Value": "100,000,000",
    "Fee": "0",
    "Order Time": "30/12/2020 10:04",
    "Status": "FILLED",
    "Document Status": "MISSING"
},
{
    "IDNUM": "53231",
    "Dealing Date": "31/12/2020",
    "Account Number": "988CC000MY",
    "Customer Name": "NGUYỄN HỮU TRƯỜNG",
    "Order Type": "BUY_NORMAL",
    "Distributor": "SSIAM",
    "Sub-Agent": "VPB",
    "Channel": "MANUAL",
    "Request IP": "14.238.24.76",
    "Fund": "SSIBF",
    "Shares": "20,531.53",
    "Value": "250,000,000",
    "Fee": "0",
    "Order Time": "30/12/2020 09:25",
    "Status": "FILLED",
    "Document Status": "REQUIRE"
}
]



export class TableViewTranshistHistory extends Component {
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
            lang: this.props.language,
            clientHeight: 768
        }
    }

    onChangeDate = () => {

    }
    onSearch = () => {

    }
    componentDidMount() {
        let height = window.screen.height
        this.setState({ clientHeight: height })
    }
    render() {
        let { pages, data } = this.state
        const columns = [
            {
                Header: props => <div className="wordwrap" id="numTKGD">Số TKGD</div>,
                id: "numTKGD",
                accessor: "Account Number",
                headerClassName: 'custom-header-react-table',
                width: 120,
                Cell: ({ value }) => (
                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                )
            },
            {
                Header: props => <div className="wordwrap" id="noCCQ">Mã CCQ</div>,
                id: "noCCQ",
                accessor: "Fund",
                headerClassName: 'custom-header-react-table',
                width: 100,
                Cell: ({ value }) => (
                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                )
            },
            {
                Header: props => <div className="wordwrap" id="typeOrder">Loại lệnh</div>,
                id: "typeOrder",
                accessor: "Order Type",
                headerClassName: 'custom-header-react-table',
                width: 120,
                Cell: ({ value }) => (
                    <div className="col-left" id={"lbl" + value}>{value}</div>
                )

            },
            {
                Header: props => <div className="wordwrap" id="lblGRPNAME">DLPP</div>,
                id: "Distributor",
                accessor: "Distributor",
                headerClassName: 'custom-header-react-table',
                width: 80,
                Cell: ({ value }) => (
                    <div className="col-left" id={"lbl" + value}>{value}</div>
                )
            },
            {
                Header: props => <div className="wordwrap" id="lblSTATUS">Đối tác bán hàng</div>,
                id: "customer",
                accessor: "Customer Name",
                headerClassName: 'custom-header-react-table',
                width: 200,
                Cell: ({ value }) => (
                    <div className="col-left" id={"lbl" + value}>{value}</div>
                )
            },
            {
                Header: props => <div className="wordwrap" id="lblOPNID">Số tiền/ Số lượng</div>,
                id: "Value",
                accessor: "Value",
                headerClassName: 'custom-header-react-table',
                width: 120,
                Cell: ({ value }) => (
                    <div className="col-left" id={"lbl" + value}>{value}</div>
                )
            },
            {
                Header: props => <div className="wordwrap" id="lblOPNDATE">Phí giao dịch</div>,
                id: "Fee",
                accessor: "Fee",
                headerClassName: 'custom-header-react-table',
                width: 120,
                Cell: ({ value }) => (
                    <div className="col-left" id={"lbl" + value}>{value}</div>
                )
            }
            ,
            {
                Header: props => <div className="wordwrap" id="lblOPNDATE">Ngày giao dịch</div>,
                id: "Dealing Date",
                accessor: "Dealing Date",
                headerClassName: 'custom-header-react-table',
                width: 160,
                Cell: ({ value }) => (
                    <div className="col-left" id={"lbl" + value}>{value}</div>
                )
            }
            ,
            {
                Header: props => <div className="wordwrap" id="lblOPNDATE">Ngày đặt lệnh</div>,
                id: "OrderDate",
                accessor: "Order Time",
                headerClassName: 'custom-header-react-table',
                width: 160,
                Cell: ({ value }) => (
                    <div className="col-left" id={"lbl" + value}>{value}</div>
                )
            }
            ,
            {
                Header: props => <div className="wordwrap" id="lblOPNDATE">Thời gian đặt lệnh</div>,
                id: "Time",
                accessor: "Order Time",
                headerClassName: 'custom-header-react-table',
                width: 120,
                Cell: ({ value }) => (
                    <div className="col-left" id={"lbl" + value}>{value}</div>
                )
            }
            ,
            {
                Header: props => <div className="wordwrap" id="lblOPNDATE">Trạng thái</div>,
                id: "Status",
                accessor: "Status",
                headerClassName: 'custom-header-react-table',
                width: 120,
                Cell: ({ value }) => (
                    <div className="col-left" id={"lbl" + value}>{value}</div>
                )
            }
            ,
            {
                Header: props => <div className="wordwrap" id="lblOPNDATE">Kênh đặt lệnh</div>,
                id: "Channel",
                accessor: "Channel",
                headerClassName: 'custom-header-react-table',
                width: 120,
                Cell: ({ value }) => (
                    <div className="col-left" id={"lbl" + value}>{value}</div>
                )
            }
            ,
            {
                Header: props => <div className="wordwrap" id="lblOPNDATE">IP/MAC</div>,
                id: "Request IP",
                accessor: "Request IP",
                headerClassName: 'custom-header-react-table',
                width: 120,
                Cell: ({ value }) => (
                    <div className="col-left" id={"lbl" + value}>{value}</div>
                )
            }
        ]
        let heightTable = this.state.clientHeight > 768 ? {
            maxHeight: "700px"
        } : {
            maxHeight: "500px"
        }
        return (
            <React.Fragment>
                <div className="block-search">
                    <div className="inputs-table">
                        <div className="cus-input-date">
                            <DateInput
                                id="txtfrdate"
                                onChange={this.onChangeDate}
                                value={this.state.p_frdate}
                                type="p_frdate"
                                placeholderText={this.props.strings.frdate}
                            />
                            <i className="fa fa-calendar" aria-hidden="true"></i>
                        </div>
                        <div className="cus-input-date">
                            <DateInput
                                id="txttodate"
                                onChange={this.onChangeDate}
                                value={this.state.p_todate}
                                type="p_todate"
                                placeholderText={this.props.strings.todate}
                            />
                            <i className="fa fa-calendar" aria-hidden="true"></i>
                        </div>
                        <button
                            onClick={this.search}
                            type="button"
                            className="btn-search-tvlsgd"
                            id="btnSearch"
                        >
                            {this.props.strings.btnSearch}</button>
                    </div>
                </div>

                <div className='view-trans-history customize-react-table' >
                    <ReactTable
                        // getTheadTrProps={() => {
                        //     return {
                        //         className: 'head'
                        //     }
                        // }}
                        columns={columns}
                        manual
                        filterable
                        pages={pages}
                        // loading={loading} // Display the loading overlay when we need it
                        //onFetchData={this.fetchData.bind(this)}
                        data={DATA_SAMPLE}
                        style={heightTable}
                        noDataText={'ko co data'}
                        pageText={getPageTextTable(this.props.language)}
                        rowsText={getRowTextTable(this.props.language)}
                        previousText={<i className="fas fa-backward"></i>}
                        nextText={<i className="fas fa-forward"></i>}
                        loadingText="Ðang tải..."
                        ofText="/"
                        //getTrProps={this.onRowClick.bind(this)}
                        defaultPageSize={this.state.pagesize}
                        className="-striped -highlight"
                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                    />
                </div>
            </React.Fragment>
        )
    }
}

const stateToProps = state => ({
    notification: state.notification,
    language: state.language.language,
    auth: state.auth
});

const decorators = flow([
    connect(stateToProps),
    translate('TableViewTranshistHistory')
]);

module.exports = decorators(TableViewTranshistHistory);