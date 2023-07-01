import React from 'react'
import RestfulUtils from 'app/utils/RestfulUtils'
import ReactTable from "react-table";
import "react-table/react-table.css";
import flow from 'lodash.flow';
import NumberInput from 'app/utils/input/NumberInput';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import _ from 'lodash'
import { amt_width, qtty_width, symbol_width, date_width } from 'app/Helpers';
// import ModalDetail from './ModalDetail'
import 'app/utils/customize/CustomizeReactTable.scss';

function getSum(total, num) {
    return total + num;
}
class TableMixNAV extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            keySearch: {},
            isDetailModalOpen: false,
            dataCCQ: [],
            detailCCQ: {},
            idAccount: '',
            idCCQ: '',
        }
    }

    componentWillReceiveProps(nextProps) {
        let { keySearch } = nextProps
        //nextProps.keySearch.p_type='3'

        //if (keySearch.SYMBOL != this.state.keySearch.SYMBOL || keySearch.TRADINGID != this.state.keySearch.TRADINGID) {
        this.search(keySearch);
        //  this.props.refreshSearch();
        // }

    }
    search(keySearch) {
        let self = this

        RestfulUtils.post('/fund/getlisportfolioexpectnav', { keySearch, type: '5', OBJNAME: this.props.OBJNAME })
            .then(resData => {
                //  console.log(resData)
                if (resData.EC == 0) {

                    self.setState({ data: resData.DT.data, keySearch: { ...keySearch } })
                }
                else {
                    //  toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT })

                }
            })
    }

    moreInfo = (record) => {
        let { dataCCQ } = this.state
        dataCCQ.push(record)
        this.setState({
            isDetailModalOpen: true,
            detailCCQ: record,
            dataCCQ,
        })
    }

    onCloseDetailModal = () => {
        this.setState({
            isDetailModalOpen: false,
            dataCCQ: [],
            detailCCQ: {}
        })
    }

    /*
    componentDidMount() {
        let self = this;
        //fixHeight()
        let keySearch = {}
        keySearch.p_codeid = 'ALL';
        keySearch.p_custodycd = ''
        keySearch.p_type = '3'
        keySearch.language = this.props.lang
        this.search(keySearch);
    }
    */
    onRowClick(state, rowInfo, column, instance) {
        let self = this;
        return {
            onDoubleClick: e => {

                // console.log(rowInfo)
                if (rowInfo.original != undefined) {
                    let dataClick = self.state.data.filter(e => e.ORDERID === rowInfo.original.ORDERID);
                    if (rowInfo.original.CUSTODYCD) self.props.showPopupThongTinMonNop(dataClick);
                }
                // that.props.showModalDetail("view", rowInfo.row.CUSTID)
            },

            style: {
                background: rowInfo == undefined ? '' : rowInfo.original == undefined ? '' : rowInfo.original.background
                // color:rowInfo==undefined?'': that.state.selectedRows.has(rowInfo.original.CUSTID)?'black':'',
            }
        }
    }

    render() {
        let { data, isDetailModalOpen, detailCCQ, dataCCQ } = this.state
        let LASTORDERID = ''

        //Modals
        const detailColumn = [
            // Ngày GD mua
            {
                Header: props => <div className="">{this.props.strings.txdate}</div>,
                accessor: "NGAY_MUA",
                id: "NGAY_MUA",
                width: date_width,
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <span className="">
                            {cell.NGAY_MUA}
                        </span>)
                }
            },
            // Số lượng
            {
                Header: props => <div className="wordwrap" id="lblamount">{this.props.strings.amount}<div></div></div>,
                width: qtty_width,
                accessor: "SO_LUONG",
                Aggregated: (row) => {
                    return (
                        <span>
                            {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                        </span>
                    );
                },
                aggregate: vals => {
                    var b = vals.map(function (v) {
                        return parseFloat(v);
                    });
                    return _.sum(b).toFixed(2)
                },
                Cell: (row) => (
                    <span >
                        <NumberInput value={row.value} decimalScale={2} displayType={'text'} thousandSeparator={true} />
                    </span>
                ),
            },
            // Gía NAV vốn
            {
                Header: props => <div className="wordwrap" id="lblnavcapital">{this.props.strings.navcapital}<div></div></div>,
                accessor: "NAV_VON",
                Aggregated: (row) => {
                    return (
                        <span  >
                            {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                        </span>
                    );
                },
                aggregate: (values, rows) => {
                    //Giá NAV vốn = round(Giá trị vốn/Số lượng,2)
                    var SO_LUONG = rows.map(function (v) {
                        if (v.SO_LUONG != null) return parseFloat(v.SO_LUONG)
                        else return 0

                    });
                    var sum_SO_LUONG = SO_LUONG.reduce(getSum)
                    var sum = 0
                    if (sum_SO_LUONG > 0) {
                        var GT_NAV_VON = rows.map(function (v) {
                            if (v.GT_NAV_VON != null) return parseFloat(v.GT_NAV_VON)
                            else return 0
                        });
                        var sum_GT_NAV_VON = GT_NAV_VON.reduce(getSum)
                        sum = sum_GT_NAV_VON / sum_SO_LUONG
                    }

                    return sum.toFixed(2)

                },
                width: amt_width,
                Cell: (row) => (
                    <span>
                        <NumberInput value={row.value} decimalScale={2} displayType={'text'} thousandSeparator={true} />

                    </span>
                ),
            },
            // Giá NAV hiện tại
            {
                Header: props => <div className="wordwrap" id="lblnavpresent">{this.props.strings.navpresent}<div></div></div>,
                accessor: "NAV_HIEN_TAI",
                filterable: true,
                width: amt_width,
                Aggregated: (row) => {
                    return (
                        <span  >
                            {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                        </span>
                    );
                },
                aggregate: (values, rows) => {
                    //Giá NAV hiện tại = round(Giá trị hiện tại/số lượng,2)
                    var NAV_HIEN_TAI = rows.map(function (v) {
                        if (v.NAV_HIEN_TAI != null) return parseFloat(v.NAV_HIEN_TAI)
                        else return 0
                    });
                    return NAV_HIEN_TAI
                },
                width: 150,
                Cell: ({ value }) => {
                    return (
                        <span >
                            <NumberInput value={value} decimalScale={2} displayType={'text'} thousandSeparator={true} />

                        </span>)
                }
            },
            // Số tiền mua ban đầu
            {
                Header: props => <div className="wordwrap" id="lblnavcapitalvalue">{this.props.strings.SO_TIEN_MUA_BAN_DAU}<div></div></div>,
                accessor: "SO_TIEN_MUA_BAN_DAU",
                width: amt_width + 20,
                Aggregated: (row) => {
                    return (
                        <span  >
                            {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                        </span>
                    );
                },
                aggregate: vals => {
                    var b = vals.map(function (v) {
                        return parseFloat(v);
                    });

                    return _.sum(b).toFixed(2)
                },
                Cell: (row) => (
                    <span >
                        <NumberInput value={row.value} displayType={'text'} thousandSeparator={true} />

                    </span>
                )
            },
            // Giá trị vốn
            {
                Header: props => <div className="wordwrap" id="lblnavcapitalvalue">{this.props.strings.navcapitalvalue}<div></div></div>,
                accessor: "GT_NAV_VON",
                width: amt_width,
                Aggregated: (row) => {
                    return (
                        <span  >
                            {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                        </span>
                    );
                },
                aggregate: vals => {
                    var b = vals.map(function (v) {
                        return parseFloat(v);
                    });

                    return _.sum(b).toFixed(2)
                },
                Cell: (row) => (
                    <span >
                        <NumberInput value={row.value} displayType={'text'} thousandSeparator={true} />

                    </span>
                )
            },
            // Giá trị hiện tại
            {
                Header: props => <div className="wordwrap" id="lblnavpresentvalue">{this.props.strings.navpresentvalue}<div></div></div>,
                accessor: "GT_NAV_HIEN_TAI",
                width: amt_width,
                // aggregate: vals => _.sum(vals),
                Cell: (row) => (
                    <span >
                        <NumberInput value={row.value} displayType={'text'} thousandSeparator={true} />

                    </span>
                ),
                Aggregated: (row) => {
                    return (
                        <span  >
                            {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                        </span>
                    );
                },
                aggregate: vals => {
                    var b = vals.map(function (v) {
                        return parseFloat(v);
                    });
                    return _.sum(b).toFixed(2)
                },
            },
            // Phí mua
            {
                Header: props => <div className="wordwrap" id="lblfeebuy">{this.props.strings.feebuy}<div></div></div>,
                width: amt_width,
                accessor: "PHI_MUA",
                //  aggregate: vals =>'',
                Cell: (row) => (
                    <span  >
                        {row.value ? <NumberInput value={row.value} displayType={'text'} thousandSeparator={true} /> : ''}
                    </span>
                ),

                Aggregated: (row) => {
                    return (
                        <span >
                            {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                        </span>
                    );
                },
                aggregate: vals => {
                    var b = vals.map(function (v) {
                        return parseFloat(v);
                    });
                    return _.sum(b).toFixed(2)
                },
            },
            // Phí bán
            {
                Header: props => <div className="wordwrap" id="lblfeesell">{this.props.strings.feesell}<div></div></div>,
                accessor: "PHI_BAN",
                width: amt_width,
                Aggregated: row => {
                    return (
                        <span  >
                            {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                        </span>
                    );
                },
                Cell: ({ value }) => {
                    return (
                        <span>
                            <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                        </span>)
                },
                aggregate: vals => {
                    var b = vals.map(function (v) {
                        return parseFloat(v);
                    });
                    return _.sum(b).toFixed(2)
                },
            },
            // Phí phạt SIP dự kiến
            {
                Header: props => <div className="wordwrap" id="lblsipexpected">{this.props.strings.SIPExpected}<div></div></div>,
                accessor: "PHI_PHAT_SIP",
                width: amt_width,
                Aggregated: row => {
                    return (
                        <span  >
                            {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                        </span>
                    );
                },
                Cell: ({ value }) => {
                    return (
                        <span>
                            <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                        </span>)
                },
                aggregate: vals => {
                    var b = vals.map(function (v) {
                        return parseFloat(v);
                    });
                    return _.sum(b).toFixed(2)
                },
            },
            // Phí bán dự kiến
            {
                Header: props => <div className="wordwrap" id="lblfeesell">{this.props.strings.feesellDK}<div></div></div>,
                width: amt_width,
                accessor: "PHI_BAN_GD",
                aggregate: vals => '',
                width: amt_width,
                Aggregated: row => {
                    return (
                        <span  >
                            {row.aggregated ? <NumberInput value={row.value} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                        </span>
                    );
                },
                Cell: ({ value }) => {
                    return (
                        <span>
                            <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                        </span>)
                },
                aggregate: vals => {
                    var b = vals.map(function (v) {
                        return parseFloat(v);
                    });
                    return _.sum(b)
                },
            },
            // Thuế giao dịch dự kiến
            {
                Header: props => <div className="wordwrap" id="lbltax">{this.props.strings.taxDK}<div></div></div>,
                width: amt_width,
                accessor: "THUE_GD",
                Aggregated: row => {
                    return (
                        <span  >
                            {row.aggregated ? <NumberInput value={row.value} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                        </span>
                    );
                },
                aggregate: vals => {
                    var b = vals.map(function (v) {
                        return parseFloat(v);
                    });
                    return _.sum(b)
                },
                width: amt_width,
                Cell: ({ value }) => {
                    return (
                        <span >
                            <NumberInput value={value} displayType={'text'} thousandSeparator={true} />

                        </span>)
                }
            },
            // Giá trị lãi lỗ
            {
                Header: props => <div className="wordwrap" id="lblvalue">{this.props.strings.value}<div></div></div>,
                width: amt_width,
                accessor: "PROFIT",
                //  aggregate: vals =>'',
                Cell: (row) => (
                    <span  >
                        {row.value ? <NumberInput value={row.value} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                    </span>
                ),

                Aggregated: (row) => {
                    return (
                        <span  >
                            {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                        </span>
                    );
                },
                aggregate: vals => {
                    var b = vals.map(function (v) {
                        return parseFloat(v);
                    });
                    return _.sum(b).toFixed(2)
                },
            },
            // %Lãi/Lỗ
            {
                Header: props => <div className="wordwrap" id="lblper">{this.props.strings.per}<div></div></div>,
                accessor: "PER_PROFIT",
                width: 100,
                Aggregated: (row) => {
                    return (
                        <span  >
                            {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                        </span>
                    );
                },
                aggregate: (values, rows) => {
                    //%Lãi lỗ= Nếu Giá trị vốn = 0 thì 100 ngược lại Round(Giá trị lãi lỗ/Giá trị vốn*100,2)
                    var PROFIT = rows.map(function (v) {
                        if (v.PROFIT != null) return parseFloat(v.PROFIT);
                        else return 0
                    });
                    var SO_TIEN_MUA_BAN_DAU = rows.map(function (v) {
                        if (v.SO_TIEN_MUA_BAN_DAU != null) return parseFloat(v.SO_TIEN_MUA_BAN_DAU);
                        else return 0
                    });
                    // var sum_GT_NAV_VON=GT_NAV_VON.reduce(getSum)
                    // var sum = 0
                    // if (sum_GT_NAV_VON= 0) {
                    //     sum = 100
                    // } else {
                    //     var PROFIT = rows.map(function (v) {
                    //         if(v.PROFIT!=null) return parseFloat(v.PROFIT);
                    //         return 0;
                    //     });
                    //     var sum_PROFIT=PROFIT.reduce(getSum)
                    //     var GT_NAV_VON1 = rows.map(function (v) {
                    //         if(v.GT_NAV_VON!=null) return parseFloat(v.GT_NAV_VON);
                    //         else return 1
                    //     });
                    //     var sum_GT_NAV_VON1=GT_NAV_VON1.reduce(getSum)
                    //     sum = sum_PROFIT /sum_GT_NAV_VON1 *100
                    // }
                    var sum = 0
                    var sum_PROFIT = PROFIT.reduce(getSum)
                    var sum_SO_TIEN_MUA_BAN_DAU = SO_TIEN_MUA_BAN_DAU.reduce(getSum)
                    sum = sum_PROFIT / sum_SO_TIEN_MUA_BAN_DAU * 100
                    return sum.toFixed(2)
                },
                Cell: ({ value }) => {
                    return (
                        <span >
                            <NumberInput value={value} displayType={'text'} decimalScale={2} thousandSeparator={true} />
                        </span>)
                }
            }
        ]

        //Screen
        const column = [

            {
                Header: ' ',
                columns: [
                    // TKGD
                    {
                        Header: props => <div className="">{this.props.strings.accountTrade}</div>,
                        id: "AccTrade",
                        accessor: "CUSTODYCD",
                        minWidth: 150,
                        headerClassName: "sticky",
                        filterable: true,
                        PivotValue: row => {
                            var b = row.subRows.map(function (v) {
                                return parseFloat(v.PER_PROFIT);
                            });
                            var sum = _.sum(b).toFixed(2)
                            var color = ""
                            if (sum == 0 || sum == 'NaN') color = "green"
                            else if (sum > 0) color = "green"
                            else color = "green"
                            return (
                                <span style={{ color: color, paddingLeft: 5 }}>
                                    {row.value + ' (' + row.subRows.length + ')'}
                                </span>
                            );
                        },
                    },
                    // Mã CCQ
                    {
                        id: "SYMBOL",
                        Header: props => <div className="wordwrap" id="lblsymbol">{this.props.strings.symbol}</div>,
                        aggregate: vals => '',
                        accessor: "SYMBOL",
                        minWidth: 150,
                        className: "sticky text-custom-left",
                        headerClassName: "sticky",
                        PivotValue: row => {
                            var b = row.subRows.map(function (v) {
                                return parseFloat(v.PER_PROFIT);
                            });

                            var sum = _.sum(b).toFixed(2)
                            var color = ""
                            if (sum == 0 || sum == 'NaN') color = "#ff8201"
                            else if (sum > 0) color = "red"
                            else color = "red"
                            return (
                                <span style={{ color: color, paddingLeft: 5 }}>
                                    {row.value + ' (' + row.subRows.length + ')'}
                                </span>
                            );
                        },
                        filterMethod: (filter, row) =>
                            row[filter.id] != null ? row[filter.id].toUpperCase().includes(filter.value.toUpperCase()) : ''
                    },
                ]
            },

            {
                Header: props => <div className="add-border-bottom">{this.props.strings.buy}</div>,
                columns: [
                    {
                        id: "TXDATE",
                        Header: props => <div className="wordwrap" id="">{this.props.strings.txdate}</div>,
                        accessor: "NGAY_MUA",
                        minWidth: 150,
                        headerClassName: "",
                        aggregate: vals => {
                            return ''
                        },
                        Cell: (row) => {
                            return (
                                <span  >
                                    {row.value}
                                </span>
                            );
                        }
                    },
                    {
                        Header: props => <div className="wordwrap" id="lblamount">{this.props.strings.amount}<div></div></div>,
                        width: qtty_width,
                        accessor: "SO_LUONG",
                        Aggregated: (row) => {
                            return (
                                <span  >
                                    {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                                </span>
                            );
                        },
                        aggregate: vals => {
                            var b = vals.map(function (v) {
                                return parseFloat(v);
                            });
                            return _.sum(b).toFixed(2)
                        },
                        Cell: (row) => (
                            <span >
                                <NumberInput value={row.value} decimalScale={2} displayType={'text'} thousandSeparator={true} />
                            </span>
                        ),
                    },
                    {
                        Header: props => <div className="wordwrap" id="lblnavcapital">{this.props.strings.navcapital}<div></div></div>,
                        accessor: "NAV_VON",
                        Aggregated: (row) => {
                            return (
                                <span  >
                                    {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                                </span>
                            );
                        },
                        aggregate: (values, rows) => {
                            //Giá NAV vốn = round(Giá trị vốn/Số lượng,2)
                            var SO_LUONG = rows.map(function (v) {
                                if (v.SO_LUONG != null) return parseFloat(v.SO_LUONG)
                                else return 0

                            });
                            var sum_SO_LUONG = SO_LUONG.reduce(getSum)
                            var sum = 0
                            if (sum_SO_LUONG > 0) {
                                var GT_NAV_VON = rows.map(function (v) {
                                    if (v.GT_NAV_VON != null) return parseFloat(v.GT_NAV_VON)
                                    else return 0
                                });
                                var sum_GT_NAV_VON = GT_NAV_VON.reduce(getSum)
                                sum = sum_GT_NAV_VON / sum_SO_LUONG
                            }

                            return sum.toFixed(2)

                        },
                        width: amt_width,
                        Cell: (row) => (
                            <span>
                                <NumberInput value={row.value} decimalScale={2} displayType={'text'} thousandSeparator={true} />

                            </span>
                        ),
                    },
                    // Giá trị vốn
                    {
                        Header: props => <div className="wordwrap" id="lblnavcapitalvalue">{this.props.strings.navcapitalvalue}<div></div></div>,
                        accessor: "GT_NAV_VON",
                        width: amt_width,
                        Aggregated: (row) => {
                            return (
                                <span  >
                                    {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                                </span>
                            );
                        },
                        aggregate: vals => {
                            var b = vals.map(function (v) {
                                return parseFloat(v);
                            });

                            return _.sum(b).toFixed(2)
                        },
                        Cell: (row) => (
                            <span >
                                <NumberInput value={row.value} displayType={'text'} thousandSeparator={true} />

                            </span>
                        )
                    },
                    // Phí mua
                    {
                        Header: props => <div className="wordwrap" id="lblfeebuy">{this.props.strings.feebuy}<div></div></div>,
                        width: amt_width,
                        accessor: "PHI_MUA",
                        //  aggregate: vals =>'',
                        Cell: (row) => (
                            <span  >
                                {row.value ? <NumberInput value={row.value} displayType={'text'} thousandSeparator={true} /> : ''}
                            </span>
                        ),

                        Aggregated: (row) => {
                            return (
                                <span >
                                    {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                                </span>
                            );
                        },
                        aggregate: vals => {
                            var b = vals.map(function (v) {
                                return parseFloat(v);
                            });
                            return _.sum(b).toFixed(2)
                        },
                    },
                ]
            },

            {
                Header: props => <div className="add-border-bottom">{this.props.strings.sell}</div>,
                columns: [
                    //số lượng bán
                    {
                        Header: props => <div className="wordwrap" id="MATCHQTTY ">{this.props.strings.sellQtty}<div></div></div>,
                        accessor: "MATCHQTTY ",
                        minWidth: 150
                    },

                    // giá trị bán
                    {
                        Header: props => <div className="wordwrap" id="MATCHQTTY ">{this.props.strings.sellValue}<div></div></div>,
                        accessor: "MATCHQTTY ",
                    },

                    // Phí bán
                    {
                        Header: props => <div className="wordwrap" id="lblfeesell">{this.props.strings.feesell}<div></div></div>,
                        accessor: "PHI_BAN",
                        width: amt_width,
                        Aggregated: row => {
                            return (
                                <span  >
                                    {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                                </span>
                            );
                        },
                        Cell: ({ value }) => {
                            return (
                                <span>
                                    <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                </span>)
                        },
                        aggregate: vals => {
                            var b = vals.map(function (v) {
                                return parseFloat(v);
                            });
                            return _.sum(b).toFixed(2)
                        },
                    },
                    // Thuế bán
                    {
                        Header: props => <div className="wordwrap" id="lblfeesell">Thuế bán<div></div></div>,
                        width: amt_width,

                    },
                ]

            },

            {
                Header: props => <div className="add-border-bottom">{this.props.strings.remain}</div>,
                columns: [
                    // Giá NAV hiện tại
                    {
                        Header: props => <div className="wordwrap" id="lblnavpresent">{this.props.strings.navpresent}<div></div></div>,
                        accessor: "NAV_HIEN_TAI",
                        filterable: true,
                        width: amt_width,
                        Aggregated: (row) => {
                            return (
                                <span  >
                                    {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                                </span>
                            );
                        },
                        aggregate: (values, rows) => {
                            //Giá NAV hiện tại = round(Giá trị hiện tại/số lượng,2)
                            var NAV_HIEN_TAI = rows.map(function (v) {
                                if (v.NAV_HIEN_TAI != null) return parseFloat(v.NAV_HIEN_TAI)
                                else return 0
                            });
                            return NAV_HIEN_TAI
                        },
                        width: 150,
                        Cell: ({ value }) => {
                            return (
                                <span >
                                    <NumberInput value={value} decimalScale={2} displayType={'text'} thousandSeparator={true} />

                                </span>)
                        }
                    },

                    // Giá trị hiện tại
                    {
                        Header: props => <div className="wordwrap" id="lblnavpresentvalue">{this.props.strings.navpresentvalue}<div></div></div>,
                        accessor: "GT_NAV_HIEN_TAI",
                        width: amt_width,
                        // aggregate: vals => _.sum(vals),
                        Cell: (row) => (
                            <span >
                                <NumberInput value={row.value} displayType={'text'} thousandSeparator={true} />

                            </span>
                        ),
                        Aggregated: (row) => {
                            return (
                                <span  >
                                    {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                                </span>
                            );
                        },
                        aggregate: vals => {
                            var b = vals.map(function (v) {
                                return parseFloat(v);
                            });
                            return _.sum(b).toFixed(2)
                        },
                    },

                    // Phí bán dự kiến

                    {

                        Header: props => <div className="wordwrap" id="PHI_BAN_GD ">{this.props.strings.sellEpxFee}<div></div></div>,
                        minWidth: 150,
                        accessor: "PHI_BAN_GD",
                        aggregate: vals => '',
                        width: amt_width,
                        Aggregated: row => {
                            return (
                                <span  >
                                    {row.aggregated ? <NumberInput value={row.value} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                                </span>
                            );
                        },
                        Cell: ({ value }) => {
                            return (
                                <span>
                                    <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                </span>)
                        },
                        aggregate: vals => {
                            var b = vals.map(function (v) {
                                return parseFloat(v);
                            });
                            return _.sum(b)
                        },

                    },
                    //Phí phạt SIP dự kiến
                    {
                        Header: props => <div className="wordwrap" id="lblsipexpected">{this.props.strings.SIPExpected}<div></div></div>,
                        accessor: "PHI_PHAT_SIP",
                        minWidth: 150,
                        aggregate: vals => '',
                        Aggregated: row => {
                            return (
                                <span  >
                                    {row.aggregated ? <NumberInput value={row.value} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                                </span>
                            );
                        },
                        Cell: ({ value }) => {
                            return (
                                <span>
                                    <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                </span>)
                        },
                        aggregate: vals => {
                            var b = vals.map(function (v) {
                                return parseFloat(v);
                            });
                            return _.sum(b)
                        },
                    },
                    // Thuế giao dịch dự kiến
                    {
                        Header: props => <div className="wordwrap" id="lbltax">{this.props.strings.taxDK}<div></div></div>,
                        minWidth: 150,
                        accessor: "THUE_GD",
                        Aggregated: row => {
                            return (
                                <span  >
                                    {row.aggregated ? <NumberInput value={row.value} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                                </span>
                            );
                        },
                        aggregate: vals => {
                            var b = vals.map(function (v) {
                                return parseFloat(v);
                            });
                            return _.sum(b)
                        },
                        Cell: ({ value }) => {
                            return (
                                <span >
                                    <NumberInput value={value} displayType={'text'} thousandSeparator={true} />

                                </span>)
                        }
                    },
                ]
            },

            {
                Header: props => <div className="add-border-bottom">{this.props.strings.profitLost}</div>,
                columns: [
                    // Giá trị lãi lỗ
                    {
                        Header: props => <div className="wordwrap" id="lblvalue">{this.props.strings.value}<div></div></div>,
                        width: amt_width,
                        accessor: "PROFIT",
                        //  aggregate: vals =>'',
                        Cell: (row) => (
                            <span  >
                                {row.value ? <NumberInput value={row.value} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                            </span>
                        ),

                        Aggregated: (row) => {
                            return (
                                <span  >
                                    {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                                </span>
                            );
                        },
                        aggregate: vals => {
                            var b = vals.map(function (v) {
                                return parseFloat(v);
                            });
                            return _.sum(b).toFixed(2)
                        },
                    },
                    // %Lãi/Lỗ
                    {
                        Header: props => <div className="wordwrap" id="lblper">{this.props.strings.per}<div></div></div>,
                        accessor: "PER_PROFIT",
                        width: 100,
                        Aggregated: (row) => {
                            let dataFormat = ['-Infinity', 'NaN'].includes(row.value) ? 0 : row.value;
                            return (
                                <span  >
                                    {row.aggregated ? <NumberInput value={dataFormat} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                                </span>
                            );
                        },
                        aggregate: (values, rows) => {
                            //%Lãi lỗ= Nếu Giá trị vốn = 0 thì 100 ngược lại Round(Giá trị lãi lỗ/Giá trị vốn*100,2)
                            var PROFIT = rows.map(function (v) {
                                if (v.PROFIT != null) return parseFloat(v.PROFIT);
                                else return 0
                            });
                            var SO_TIEN_MUA_BAN_DAU = rows.map(function (v) {
                                if (v.SO_TIEN_MUA_BAN_DAU != null) return parseFloat(v.SO_TIEN_MUA_BAN_DAU);
                                else return 0
                            });
                            // var sum_GT_NAV_VON=GT_NAV_VON.reduce(getSum)
                            // var sum = 0
                            // if (sum_GT_NAV_VON= 0) {
                            //     sum = 100
                            // } else {
                            //     var PROFIT = rows.map(function (v) {
                            //         if(v.PROFIT!=null) return parseFloat(v.PROFIT);
                            //         return 0;
                            //     });
                            //     var sum_PROFIT=PROFIT.reduce(getSum)
                            //     var GT_NAV_VON1 = rows.map(function (v) {
                            //         if(v.GT_NAV_VON!=null) return parseFloat(v.GT_NAV_VON);
                            //         else return 1
                            //     });
                            //     var sum_GT_NAV_VON1=GT_NAV_VON1.reduce(getSum)
                            //     sum = sum_PROFIT /sum_GT_NAV_VON1 *100
                            // }
                            var sum = 0
                            var sum_PROFIT = PROFIT.reduce(getSum)
                            var sum_SO_TIEN_MUA_BAN_DAU = SO_TIEN_MUA_BAN_DAU.reduce(getSum)
                            sum = sum_PROFIT / sum_SO_TIEN_MUA_BAN_DAU * 100;
                            return sum.toFixed(2)
                        },
                        Cell: ({ value }) => {
                            return (
                                <span >
                                    <NumberInput value={value} displayType={'text'} decimalScale={2} thousandSeparator={true} />
                                </span>)
                        }
                    },
                ]
            },

            // Số tiền mua ban đầu
            // {
            //     Header: props => <div className="wordwrap" id="lblnavcapitalvalue">{this.props.strings.SO_TIEN_MUA_BAN_DAU}<div></div></div>,
            //     accessor: "SO_TIEN_MUA_BAN_DAU",
            //     minWidth: 150,
            //     Aggregated: (row) => {
            //         return (
            //             <span  >
            //                 {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

            //             </span>
            //         );
            //     },
            //     aggregate: vals => {
            //         var b = vals.map(function (v) {
            //             return parseFloat(v);
            //         });

            //         return _.sum(b).toFixed(2)
            //     },
            //     Cell: (row) => (
            //         <span >
            //             <NumberInput value={row.value} displayType={'text'} thousandSeparator={true} />

            //         </span>
            //     )
            // },




            // {
            //     Header: props => <div className="wordwrap" id="lbltax">{this.props.strings.tax}<div>(8)</div></div>,
            //     filterable: false,
            //     accessor: "THUE_GD",
            //     Aggregated: row => {
            //         return (
            //             <span  >
            //                 {row.aggregated ? <NumberInput value={row.value!='NaN'?row.value:0} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

            //             </span>
            //         );
            //     },
            //     aggregate: vals => {
            //         var b = vals.map(function (v) {
            //             return parseFloat(v);
            //         });
            //         return _.sum(b).toFixed(2)
            //     },
            //     width: amt_width,
            //     Cell: ({ value }) => {
            //         return (
            //             <span >
            //                 <NumberInput value={value} displayType={'text'} thousandSeparator={true} />

            //             </span>)
            //     }
            // },





            // Xem chi tiết
            // {
            //     Header: props => <div className=""></div>,
            //     // id: "Value",
            //     accessor: "Detail",
            //     minWidth: 150,
            //     headerClassName: "text-custom-left",
            //     filterable: false,
            //     Cell: (props) => {
            //         const cell = props.original;
            //         return (
            //             <span className="more_detail" onClick={() => { this.moreInfo(cell) }}>
            //                 {this.props.strings.viewDetail}
            //             </span>)
            //     }
            // }
        ];

        return (
            <div className="customize-react-table customize-sticky-table" >
                {/* <ModalDetail
                    isOpen={isDetailModalOpen}
                    dataCCQ={dataCCQ}
                    detailCCQ={detailCCQ}
                    idAccount={detailCCQ.CUSTODYCD}
                    idCCQ={detailCCQ.SYMBOL}
                    detailColumn={detailColumn}
                    onClose={this.onCloseDetailModal}
                /> */}

                <ReactTable
                    className="-striped -highlight dmdt-table-mix"
                    data={data}
                    columns={column}
                    getTheadTrProps={() => {
                        return {
                            className: 'head'
                        }
                    }}
                    getTheadGroupTrProps={() => {
                        return {
                            className: 'head'
                        }
                    }}
                    pageSizeOptions={[10, 20, 50, 100]}
                    defaultPageSize={10}
                    filterable={true}
                    getTrProps={this.onRowClick.bind(this)}
                    previousText={<i className="fas fa-backward" id="previous"></i>}
                    nextText={<i className="fas fa-forward" id="next"></i>}
                    showPagination={false}
                    manual
                    pivotBy={["AccTrade", "SYMBOL"]}
                />
            </div>
        )
    }
}
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('TableMixNAV')
]);

module.exports = decorators(TableMixNAV);
