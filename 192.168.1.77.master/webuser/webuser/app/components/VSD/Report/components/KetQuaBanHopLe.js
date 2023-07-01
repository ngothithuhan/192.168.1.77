import React from 'react';
import { connect } from 'react-redux';
import RestfulUtils from 'app/utils/RestfulUtils'
var Select = require('react-select');
import ReactTable from "react-table";
import { LabelEx } from 'app/utils/LabelEx';
import { ButtonAdd, ButtonReject, ButtonDelete, ButtonEdit, ButtonApprove, ButtonExport } from 'app/utils/buttonSystem/ButtonSystem';
import NumberFormat from 'react-number-format';

class KetQuaBanHopLe extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTraCuuLenh: [],
            CODEID: { value: '', label: '' },
            SESSION: { value: '', label: '' },
            optionsTradingsession: [],
            keySearch: {},
            search: false,
            err_msg: '',
            pageSize: 2,
            pageSize: 2,
            page: 0,
            // maxHeightTable: 100,
        };
    }
    componentDidMount() {
        // let maxHeightTable = this.props.styleWeb.height_window - (48 + 20 + 2 + 36 + 15 * 2 + 34)
        // this.setState({ maxHeightTable })
    }

    getOptionsSYMBOL(input) {
        return RestfulUtils.post('/allcode/search_all_funds', { key: input })
            .then((res) => {
                return { options: res }
            });
    }
    async getOptionsSession(input) {
        return { options: this.state.optionsTradingsession }

    }
    getListTradingSession(CODEID) {
        let self = this
        RestfulUtils.post('/allcode/search_all_session', { key: '', CODEID: CODEID })
            .then((res) => {
                self.setState({ optionsTradingsession: res })
            });
    }

    onChange(type, e) {
        var self = this;
        this.state[type] = e
        switch (type) {
            case 'CODEID':
                if (e) {
                    this.getListTradingSession(e.value);
                } else {
                    this.state.optionsTradingsession = [];
                    this.state.CODEID = { value: '', label: '' };
                    this.state.SESSION = { value: '', label: '' };
                }
                break;
        }
        this.setState(this.state)
    }
    onClickSearch() {
        var self = this;
        RestfulUtils.post('/Report/searchOrder', { key: '', RPTID: 'SR0006', TRADINGID: this.state.SESSION.value, page: 1, pagesize: this.state.pagesize })
            .then((res) => {
                self.state.err_msg = res.EM;
                if (res.EC == 0) {
                    self.state.dataTraCuuLenh = res.DT.data;
                }
                self.setState(self.state);
            });
    }
    fetchData(state, instance) {
        var self = this;
        if (!this.state.SESSION.value || this.state.SESSION.value.length == 0) {
            return;
        }
        //Request the data however you want.  Here, we'll use our mocked service we created earlier
        RestfulUtils.post('/Report/filterOrder', { pagesize: state.pageSize, page: state.page + 1, keySearch: state.filtered, sortSearch: state.sorted }).then(function (res) {
            if (res.EC == 0) {
                self.state.dataTraCuuLenh = res.DT.data;
                self.state.page = res.DT.numOfPages;
            }
            self.setState(self.state);
        });
    }

    render() {
        let { SESSION, dataTraCuuLenh, pagesize, page } = this.state;
        var tableState = null;

        return (
                <div className="tab-content" style={{ height:'100%',padding: "5px" }}>
                    <div style={{ padding: "5px" }} className="col-md-12">
                        <div style={{ padding: "0px",margin:'0px' }} className="col-md-12">
                            <h5 className="" style={{ fontSize: "12px", float: "left" }}>Mã quỹ </h5>
                            <div className="col-md-2">
                                <Select.Async
                                    name="form-field-name"
                                    disabled={this.state.ISEDIT}
                                    placeholder="Nhập Mã CCQ..."
                                    loadOptions={this.getOptionsSYMBOL.bind(this)}
                                    value={this.state.CODEID}
                                    onChange={this.onChange.bind(this, 'CODEID')}
                                />
                            </div>
                            <h5 className="" style={{ fontSize: "12px", float: "left" }}>Mã phiên</h5>
                            <div className="col-md-3">
                                <Select.Async
                                    name="form-field-name"
                                    disabled={this.state.ISEDIT}
                                    placeholder="Nhập Mã phiên..."
                                    loadOptions={this.getOptionsSession.bind(this)}
                                    value={this.state.SESSION}
                                    options={this.state.optionsTradingsession}
                                    onChange={this.onChange.bind(this, 'SESSION')}
                                    cache={false}
                                />
                            </div>
                            <div className="col-md-1">
                                <button className="btn btn-default" style={{ fontSize: "12px", padding: "5px 12px" }} onClick={this.onClickSearch.bind(this)}>Tìm kiếm</button>
                            </div>
                            <div className="col-md-1">
                                <ButtonExport filename="DANH SÁCH NHÀ ĐẦU TƯ ĐẶT LỆNH MUA HỢP LỆ ĐƯỢC PHÂN BỔ CHỨNG CHỈ QUỸ.csv" data={function () {
                                    return tableState;
                                }} style={{ marginRight: "5px" }} />
                            </div>
                        </div>
                    </div>
                    <ReactTable
                        columns={[
                            {
                                Header: props => <LabelEx text="FULLNAME" />,
                                id: "FULLNAME",
                                accessor: "FULLNAME"
                            },
                            {
                                Header: props => <LabelEx text="CUSTODYCD" />,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD"
                            },
                            {
                                Header: props =><LabelEx text="ACTYPE" />,
                                id: "ACTYPE",
                                accessor: "ACTYPE"
                            },
                            {
                                Header: props => <LabelEx text="ORDERQTTY2" />,
                                id: "ORDERQTTY",
                                accessor: "ORDERQTTY",
                                width: 180,
                                Cell: ({ value }) => {
                                    return (
                                        <span style={{ float: 'right', paddingRight: '5px' }}>
                                            {value ? <NumberFormat value={parseFloat(value)} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : ''}
                                        </span>)
                                }
                            },
                            {
                                Header: props => <LabelEx text="MATCHQTTY2" />,
                                id: "MATCHQTTY",
                                accessor: "MATCHQTTY",
                                width: 180,
                                Cell: ({ value }) => {
                                    return (
                                        <span style={{ float: 'right', paddingRight: '5px' }}>
                                            {value ? <NumberFormat value={parseFloat(value)} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : ''}
                                        </span>)
                                }
                            },
                            {
                                Header: props => <LabelEx text="MATCHAMT2" />,
                                id: "MATCHAMT",
                                accessor: "MATCHAMT",
                                width: 180,
                                Cell: ({ value }) => {
                                    return (
                                        <span style={{ float: 'right', paddingRight: '5px' }}>
                                            {value ? <NumberFormat value={parseFloat(value)} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : ''}
                                        </span>)
                                }
                            },
                            {
                                Header: props => <LabelEx text="FEEFUND2" />,
                                id: "FEEFUND",
                                accessor: "FEEFUND",
                                width: 180,
                                Cell: ({ value }) => {
                                    return (
                                        <span style={{ float: 'right', paddingRight: '5px' }}>
                                            {value ? <NumberFormat value={parseFloat(value)} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : ''}
                                        </span>)
                                }
                            },
                            {
                                Header: props => <LabelEx text="FEEAMC2" />,
                                id: "FEEAMC",
                                accessor: "FEEAMC",
                                width: 180,
                                Cell: ({ value }) => {
                                    return (
                                        <span style={{ float: 'right', paddingRight: '5px' }}>
                                            {value ? <NumberFormat value={parseFloat(value)} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : ''}
                                        </span>)
                                }
                            },
                            {
                                Header: props => <LabelEx text="FEEDXX2" />,
                                id: "FEEDXX",
                                accessor: "FEEDXX",
                                width: 180,
                                Cell: ({ value }) => {
                                    return (
                                        <span style={{ float: 'right', paddingRight: '5px' }}>
                                            {value ? <NumberFormat value={parseFloat(value)} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : ''}
                                        </span>)
                                }
                            },
                            
                            {
                                Header: props => <LabelEx text="TOTALFEE2" />,
                                id: "TOTALFEE",
                                accessor: "TOTALFEE",
                                width: 180,
                                Cell: ({ value }) => {
                                    return (
                                        <span style={{ float: 'right', paddingRight: '5px' }}>
                                            {value ? <NumberFormat value={parseFloat(value)} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : ''}
                                        </span>)
                                }
                            },
                            {
                                Header: props => <LabelEx text="TAXAMT2" />,
                                id: "TAXAMT",
                                accessor: "TAXAMT",
                                width: 180,
                                Cell: ({ value }) => {
                                    return (
                                        <span style={{ float: 'right', paddingRight: '5px' }}>
                                            {value ? <NumberFormat value={parseFloat(value)} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : ''}
                                        </span>)
                                }
                            },
                            {
                                Header: props => <LabelEx text="AMT2" />,
                                id: "AMT",
                                accessor: "AMT",
                                width: 180,
                                Cell: ({ value }) => {
                                    return (
                                        <span style={{ float: 'right', paddingRight: '5px' }}>
                                            {value ? <NumberFormat value={parseFloat(value)} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : ''}
                                        </span>)
                                }
                            },
                            {
                                Header: props => <LabelEx text="BANKACC" />,
                                id: "BANKACC",
                                accessor: "BANKACC"
                            },
                            {
                                Header: props => <LabelEx text="BANKACNAME" />,
                                id: "BANKACNAME",
                                accessor: "BANKACNAME"
                            },
                            {
                                Header: props => <LabelEx text="CITYBANK" />,
                                id: "CITYBANK",
                                accessor: "CITYBANK"
                            },
                            {
                                Header: props => <LabelEx text="NOTE" />,
                                id: "NOTE",
                                accessor: "NOTE"
                            },
                        ]}
                        getTheadTrProps={() => {
                            return {
                                className: 'head'
                            }
                        }}
                        manual
                        filterable
                        pages={page} // Display the total number of pages
                        // loading={loading} // Display the loading overlay when we need it
                        onFetchData={this.fetchData.bind(this)}
                        data={dataTraCuuLenh}
                        style={{
                            height:'100%',
                        }}
                        noDataText="Khong co du lieu"
                        pageText="Trang"
                        rowsText="dòng"
                        previousText="Trước"
                        nextText="Tiếp"
                        loadingText="Đang tải..."
                        loadingText="Đang tải..."
                        ofText="/"
                        defaultPageSize={pagesize}
                        className="-striped -highlight"
                    >
                        {(state, makeTable, instance) => {
                            tableState = state;
                            return (
                                <div style={{height:'100%',paddingBottom:'43px'}}>{makeTable()}</div>
                            )
                        }}
                    </ReactTable>
                </div>
        );
    }
}
module.exports = connect(function (state) {
    return {

    };
})(KetQuaBanHopLe);