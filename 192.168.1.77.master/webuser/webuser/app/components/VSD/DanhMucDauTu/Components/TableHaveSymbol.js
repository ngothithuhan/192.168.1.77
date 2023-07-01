import React, { Fragment } from 'react'
import RestfulUtils from 'app/utils/RestfulUtils'
import ReactTable from "react-table";
import "react-table/react-table.css";
import translate from 'app/utils/i18n/Translate.js';
import NumberInput from 'app/utils/input/NumberInput';
import flow from 'lodash.flow';
import { connect } from 'react-redux'
import _ from 'lodash'
import { amt_width, qtty_width, symbol_width, date_width } from 'app//Helpers';
import ModalDetail from './ModalDetail'

function getSum(total, num) {
    return total + num;
}
//Danh mục còn nắm giữ
class TableHaveSymbol extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDetailModalOpen: false,
            dataCCQ: [],
            detailCCQ: {},
            data: [],
            keySearch: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        let { keySearch } = nextProps
        //if (keySearch.SYMBOL != this.state.keySearch.SYMBOL || keySearch.TRADINGID != this.state.keySearch.TRADINGID) {
        this.search(keySearch);
        //  this.props.refreshSearch();
        // }
    }

    search(keySearch) {
        let self = this
        RestfulUtils.post('/fund/getlisportfolio', { keySearch, type: '2', OBJNAME: this.props.OBJNAME })
            .then(resData => {
                if (resData.EC == 0) {
                    self.setState({ data: resData.DT.data, keySearch: { ...keySearch } })
                    //console.log(this.state.data)
                }
                else {
                    // toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT })
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

    onRowClick(state, rowInfo, column, instance) {
        let self = this;
        return {
            onDoubleClick: e => {
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
        const { isDetailModalOpen, detailCCQ, dataCCQ, data } = this.state;
        let LASTORDERID = ''
        let that = this;


        const detailColumn = [
            // Ngày GD mua
            {
                Header: props => <div className="wordwrap">{this.props.strings.txdate}</div>,
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
            //  Số lượng (1)
            {
                Header: props => <div className="wordwrap">{this.props.strings.amount}<div>(1)</div></div>,
                id: "amount",
                accessor: "amount",
                minWidth: 100,
                headerClassName: "text-custom-center",
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <span className="">
                            {cell.NAM_GIU}
                        </span>)
                }
            },
            // Giá NAV vốn (2)
            {
                Header: props => <div className="wordwrap">{this.props.strings.navcapital}<div>(2)</div></div>,
                accessor: "navcapital",
                minWidth: 100,
                headerClassName: "text-custom-center",
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <span className="">
                            {cell.NAV_VON}
                        </span>)
                }
            },
            // Giá NAV hiện tại (3)
            {
                Header: props => <div className="wordwrap">{this.props.strings.navpresent}<div>(3)</div></div>,
                accessor: "navpresent",
                minWidth: 100,
                headerClassName: "text-custom-center",
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <span className="">
                            {cell.NAV_HIEN_TAI}
                        </span>)
                }
            },
            // Số tiền mua
            {
                Header: props => <div className="wordwrap">{this.props.strings.buyamtvalue}</div>,
                id: "buyamtvalue",
                accessor: "buyamtvalue",
                minWidth: 100,
                headerClassName: "text-custom-center",
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <span className="">
                            {cell.GT_MUA}
                        </span>)
                }
            },
            // Phí mua (4)
            {
                Header: props => <div className="wordwrap">{this.props.strings.feebuy}<div>(4)</div></div>,
                id: "feebuy",
                accessor: "feebuy",
                minWidth: 100,
                headerClassName: "text-custom-center",
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <span className="">
                            {cell.PHI_MUA}
                        </span>)
                }
            },
            // Giá trị vốn
            {
                Header: props => <div className="wordwrap">{this.props.strings.navcapitalvalue}<div>(5)=(1)*(2)</div></div>,
                id: "navcapitalvalue",
                accessor: "navcapitalvalue",
                minWidth: 100,
                headerClassName: "text-custom-center",
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <span className="">
                            {cell.GT_MUA}
                        </span>)
                }
            },
            // Giá trị hiện tại (6)
            {
                Header: props => <div className="wordwrap">{this.props.strings.navpresentvalue}<div>(6)=(1)*(3)</div></div>,
                id: "navpresentvalue",
                accessor: "navpresentvalue",
                minWidth: 100,
                headerClassName: "text-custom-center",
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <span className="">
                            {cell.GT_NAV_HIEN_TAI}
                        </span>)
                }
            },
            // Phí mua lại dự kiến (7) ----------- 
            {
                Header: props => <div className="wordwrap">{this.props.strings.feesell}<div>(7)</div></div>,
                id: "feesell",
                accessor: "feesell",
                minWidth: 100,
                headerClassName: "text-custom-center",
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <span className="">
                            {cell.PHI_BAN_GD}
                        </span>)
                }
            },
            // Phí phạt SIP DK (8)
            {
                Header: props => <div className="wordwrap">{this.props.strings.SIPPenFee}<div>(8)</div></div>,
                id: "SIPPenFee",
                accessor: "SIPPenFee",
                headerClassName: "text-custom-center",
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <span className="">
                            {cell.PHI_PHAT_SIP}
                        </span>)
                }
            },
            // Thuế GD dự kiến (9)
            {
                Header: props => <div className="wordwrap">{this.props.strings.tax}<div>(9)</div></div>,
                id: "tax",
                accessor: "tax",
                minWidth: 80,
                headerClassName: "text-custom-center",
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <span className="">
                            {cell.THUE_GD}
                        </span>)
                }
            },
            // Giá  trị lãi / lỗ (10)
            {
                Header: props => <div className="wordwrap">{this.props.strings.ProfitAndLoss}<div>(10)=(6)-(4)–(5)-(8)-(9)</div></div>,
                id: "ProfitAndLoss",
                accessor: "ProfitAndLoss",
                minWidth: 80,
                headerClassName: "text-custom-center",
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <span className="">
                            {cell.PROFIT}
                        </span>)
                }
            },
            // % lãi / lỗ (11)
            {
                Header: props => <div className="wordwrap">{this.props.strings.per}<div>(11)=(10)/((4)+(5))</div></div>,
                id: "per",
                accessor: "per",
                minWidth: 80,
                headerClassName: "text-custom-center",
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <span className="">
                            {cell.PER_PROFIT}
                        </span>)
                }
            },

            // % lãi lỗ / năm
            {
                Header: props => <div className="wordwrap">{this.props.strings.ProfitNLoss}</div>,
                id: "SESSIONNO",
                accessor: "SESSIONNO",
                minWidth: 80,
                headerClassName: "text-custom-center",
                Cell: (props) => {
                    const cell = props.original;
                    return (
                        <span className="">
                            {cell.PER_PROFIT_NAM}
                        </span>)
                }
            }
            // {
            //         Header: props => <div className="wordwrap" id="lblperl_nam">{this.props.strings.per_nam}<div></div></div>,
            //         accessor: 'PER_PROFIT_NAM',

            //         filterable: false,
            //         width: 100,

            //         Cell: ({ value }) => {
            //             return (
            //                 <span >
            //                     {value ? <NumberInput value={value} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : ''}

            //                 </span>)
            //         },
            //         Aggregated: row => {

            //             // return (
            //             //     <span >
            //             //         {row.value != "NaN" ? <NumberInput value={row.value} decimalScale= {2}  displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

            //             //     </span>
            //             // );
            //         },
            //         aggregate: (values, rows) => {
            //             //%Lãi lỗ= Nếu Giá trị vốn = 0 thì 100 ngược lại Round(Giá trị lãi lỗ/Giá trị vốn*100,2)
            //             // var GT_NAV_VON = rows.map(function (v) {
            //             //     if(v.GT_NAV_VON!=null) return parseFloat(v.GT_NAV_VON);
            //             //     else return 0
            //             // });
            //             // var sum_GT_NAV_VON=GT_NAV_VON.reduce(getSum)
            //             // var sum = 0
            //             // if (sum_GT_NAV_VON= 0) {
            //             //     sum = 100
            //             // } else {
            //             //     var PROFIT = rows.map(function (v) {
            //             //         if(v.PROFIT!=null) return parseFloat(v.PROFIT);
            //             //         return 0;
            //             //     });
            //             //     var sum_PROFIT=PROFIT.reduce(getSum)
            //             //     var GT_NAV_VON1 = rows.map(function (v) {
            //             //         if(v.GT_NAV_VON!=null) return parseFloat(v.GT_NAV_VON);
            //             //         else return 1
            //             //     });
            //             //     var sum_GT_NAV_VON1=GT_NAV_VON1.reduce(getSum)
            //             //     sum = sum_PROFIT /sum_GT_NAV_VON1 *100
            //             // }

            //             // return sum
            //             return ''
            //             // .toFixed(2)
            //         },
            //     },

        ]


        //Tab
        const columns = [
            // TKGD
            {
                Header: props => <div className="wordwrap">{this.props.strings.accountTrade}</div>,
                id: "AccTrade",
                accessor: "CUSTODYCD",
                minWidth: 150,
                className: "sticky",

                headerClassName: " sticky",
                PivotValue: row => {
                    var b = row.subRows.map(function (v) {
                        return parseFloat(v.PER_PROFIT);
                    });
                    var sum = _.sum(b).toFixed(2)
                    var color = ""
                    if (sum == 0 || sum == 'NaN') color = "red"
                    else if (sum > 0) color = "green"
                    else color = "green"
                    return (
                        <span style={{ color: color, paddingLeft: 5 }}>
                            { row.value + ' (' + row.subRows.length + ')'}
                        </span>
                    );
                },
            },
            // Mã CCQ
            {
                id: "SYMBOL",
                Header: props => <div className="wordwrap" id="">{this.props.strings.symbol}</div>,
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
                            { row.value + ' (' + row.subRows.length + ')'}
                        </span>
                    );
                },
                filterMethod: (filter, row) =>
                    row[filter.id] != null ? row[filter.id].toUpperCase().includes(filter.value.toUpperCase()) : ''
            },

            {
                id: "TXDATE",
                Header: props => <div className="wordwrap" id="">{this.props.strings.txdate}</div>,
                accessor: "NGAY_MUA",
                minWidth: 150,
                className: "text-custom-left",
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


            // Số lượng (1)
            {
                Header: props => <div className="wordwrap">{this.props.strings.amount}<div>(1)</div></div>,
                width: qtty_width,
                minWidth: 100,
                accessor: "NAM_GIU",
                Aggregated: (row) => {
                    return (
                        <span  >
                            {row.aggregated ? <NumberInput value={row.value} displayType={'text'} decimalScale={2} className="rowColorTable" thousandSeparator={true} /> : ''}

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
                        <NumberInput value={row.value} displayType={'text'} decimalScale={2} thousandSeparator={true} />
                    </span>
                ),
            },
            //  Gía NAV vốn (2)
            {
                Header: props => <div className="wordwrap">{this.props.strings.navcapital}<div>(2)</div></div>,
                width: amt_width,
                accessor: "NAV_VON",
                aggregate: (values, rows) => {
                    //Giá NAV vốn = round(Giá trị vốn/Số lượng,2)
                    var NAM_GIU = rows.map(function (v) {
                        if (v.NAM_GIU != null) return parseFloat(v.NAM_GIU)
                        else return 0
                    });
                    var sum_NAM_GIU = NAM_GIU.reduce(getSum)
                    var sum = 0
                    if (sum_NAM_GIU > 0) {
                        var GT_NAV_VON = rows.map(function (v) {
                            if (v.GT_NAV_VON != null) return parseFloat(v.GT_NAV_VON)
                            else return 0
                        });
                        var sum_GT_NAV_VON = GT_NAV_VON.reduce(getSum)
                        sum = sum_GT_NAV_VON / sum_NAM_GIU
                    }
                    return sum.toFixed(2)
                },

                Aggregated: (row) => {
                    return (
                        <span>
                            {row.aggregated ? <NumberInput value={row.value} displayType={'text'} decimalScale={2} className="rowColorTable" thousandSeparator={true} /> : ''}
                        </span>
                    );
                },

                Cell: (row) => (
                    <span>
                        <NumberInput value={row.value} displayType={'text'} decimalScale={2} thousandSeparator={true} />
                    </span>
                ),
            },
            // Giá NAV hiện tại (3)
            {
                Header: props => <div className="wordwrap">{this.props.strings.navpresent}<div>(3)</div></div>,
                minWidth: 150,
                accessor: "NAV_HIEN_TAI",
                Aggregated: (row) => {
                    return (
                        <span  >
                            {row.aggregated ? <NumberInput value={row.value} displayType={'text'} decimalScale={2} className="rowColorTable" thousandSeparator={true} /> : ''}
                        </span>
                    );
                },
                aggregate: (values, rows) => {
                    //Giá NAV hiện tại = round(Giá trị hiện tại/số lượng,2)
                    var NAM_GIU = rows.map(function (v) {
                        if (v.NAM_GIU != null) return parseFloat(v.NAM_GIU)
                        else return 0
                    });
                    var sum_NAM_GIU = NAM_GIU.reduce(getSum)
                    var sum = 0
                    if (sum_NAM_GIU > 0) {
                        var GT_NAV_HIEN_TAI = rows.map(function (v) {
                            if (v.GT_NAV_HIEN_TAI != null) return parseFloat(v.GT_NAV_HIEN_TAI)
                            else return 0
                        });
                        var sum_GT_NAV_HIEN_TAI = GT_NAV_HIEN_TAI.reduce(getSum)
                        sum = sum_GT_NAV_HIEN_TAI / sum_NAM_GIU
                    }
                    return sum.toFixed(2)
                },
                Cell: ({ value }) => {
                    return (
                        <span >
                            <NumberInput value={value} displayType={'text'} decimalScale={2} thousandSeparator={true} />

                        </span>)
                }
            },
            //  Số tiền mua
            {
                Header: props => <div className="wordwrap">{this.props.strings.buyamtvalue}</div>,
                minWidth: 150,
                accessor: "GT_MUA",
                aggregate: vals => {
                    var b = vals.map(function (v) {
                        //  return sum=(parseFloat(sum)+ parseFloat(v)).toFixed(2)
                        return parseFloat(v)
                    });
                    return _.sum(b).toFixed(2)
                },
                Aggregated: (row) => {
                    return (
                        <span  >
                            {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                        </span>
                    );
                },
                Cell: (row) => (
                    <span>
                        <NumberInput value={row.value} displayType={'text'} thousandSeparator={true} />
                    </span>
                )
            },
            // Phí mua (4)
            {
                Header: props => <div className="wordwrap">{this.props.strings.feebuy}<div>(4)</div></div>,
                width: amt_width,
                accessor: "PHI_MUA",
                Cell: (row) => (
                    <span  >
                        {row.value ? <NumberInput value={row.value} displayType={'text'} thousandSeparator={true} /> : ''}
                    </span>
                ),
                aggregate: vals => {
                    var b = vals.map(function (v) {
                        return parseFloat(v);
                    });
                    return _.sum(b)
                },
                Aggregated: (row) => {
                    return (
                        <span>
                            {row.aggregated ? <NumberInput value={row.value} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                        </span>
                    );
                },
            },
            // Giá trị vốn (5)
            {
                Header: props => <div className="wordwrap">{this.props.strings.navcapitalvalue}<div>(5)=(1)*(2)</div></div>,
                width: amt_width,
                accessor: "GT_NAV_VON",
                aggregate: vals => {
                    var b = vals.map(function (v) {
                        //  return sum=(parseFloat(sum)+ parseFloat(v)).toFixed(2)
                        return parseFloat(v)
                    });
                    return _.sum(b).toFixed(2)
                },
                Aggregated: (row) => {
                    return (
                        <span>
                            {row.aggregated ? <NumberInput value={row.value != 'NaN' ? row.value : 0} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                        </span>
                    );
                },
                Cell: (row) => (
                    <span >
                        <NumberInput value={row.value} displayType={'text'} thousandSeparator={true} />
                    </span>
                )
            },
            // Giá trị hiện tại (6)
            {
                Header: props => <div className="wordwrap">{this.props.strings.navpresentvalue}<div>(6)=(1)*(3)</div></div>,
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
            },
            // Phí mua lại dự kiến (7)
            {
                Header: props => <div className="wordwrap">{this.props.strings.feesell}<div>(7)</div></div>,
                minWidth: 150,
                accessor: "PHI_BAN_GD",
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
            // Phí phạt SIP DK (8)
            {
                Header: props => <div className="wordwrap">{this.props.strings.SIPPenFee}<div>(8)</div></div>,
                // id: "SellingFee",
                accessor: "PHI_PHAT_SIP",
                minWidth: 150,
                Cell: (row) => (
                    <span >
                        <NumberInput value={row.value} displayType={'text'} thousandSeparator={true} />
                    </span>
                ),
                Aggregated: (row) => {
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
            },
            // Thuế DG dự kiến (9)
            {
                Header: props => <div className="wordwrap">{this.props.strings.tax}<div>(9)</div></div>,
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
            // Giá trị lãi/lỗ (10)
            {
                Header: props => <div className="wordwrap">{this.props.strings.ProfitAndLoss}<div>(10)=(6)-(4)–(5)-(7)-(8)-(9)</div></div>,
                minWidth: 180,
                accessor: "PROFIT",
                //  aggregate: vals =>'',
                Cell: (row) => (
                    <span  >
                        {row.value ? <NumberInput value={row.value} displayType={'text'} thousandSeparator={true} /> : ''}
                    </span>
                ),
                Aggregated: (row) => {
                    return (
                        <span  >
                            {row.aggregated ? <NumberInput value={row.value} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
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
            // % lãi/lỗ(11)
            {
                Header: props => <div className="wordwrap">{this.props.strings.per}<div>(11)=(10)/((4)+(5))</div></div>,
                accessor: 'PER_PROFIT',
                minWidth: 150,
                Cell: ({ value }) => {
                    return (
                        <span >
                            {value ? <NumberInput value={value} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : ''}
                        </span>)
                },
                Aggregated: row => {
                    return (
                        <span >
                            {row.value != "NaN" ? <NumberInput value={row.value} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                        </span>
                    );
                },
                aggregate: (values, rows) => {
                    //%Lãi lỗ= Nếu Giá trị vốn = 0 thì 100 ngược lại Round(Giá trị lãi lỗ/Giá trị vốn*100,2)
                    var GT_NAV_VON = rows.map(function (v) {
                        if (v.GT_NAV_VON != null) return parseFloat(v.GT_NAV_VON);
                        else return 0
                    });
                    var sum_GT_NAV_VON = GT_NAV_VON.reduce(getSum)
                    var sum = 0
                    if (sum_GT_NAV_VON = 0) {
                        sum = 100
                    } else {
                        var PROFIT = rows.map(function (v) {
                            if (v.PROFIT != null) return parseFloat(v.PROFIT);
                            return 0;
                        });
                        var sum_PROFIT = PROFIT.reduce(getSum)

                        var PHI_MUA = rows.map(function (v) {
                            if (v.PHI_MUA != null) return parseFloat(v.PHI_MUA);
                            return 0;
                        });
                        var sum_PHI_MUA = PHI_MUA.reduce(getSum)

                        var GT_NAV_VON1 = rows.map(function (v) {
                            if (v.GT_NAV_VON != null) return parseFloat(v.GT_NAV_VON);
                            else return 1
                        });
                        var sum_GT_NAV_VON1 = GT_NAV_VON1.reduce(getSum)
                        sum = sum_PROFIT / (sum_GT_NAV_VON1 + sum_PHI_MUA) * 100
                    }
                    return sum
                },
            },
            {
                Header: props => <div className="wordwrap">{this.props.strings.ProfitNLoss}</div>,
                aggregate: vals => '',
                accessor: 'PER_PROFIT_NAM',
                minWidth: 150,
            },
            // Chi tiết
            // {
            //     Header: '',
            //     // id: "detail",
            //     accessor: "detail",
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
            // },
        ]
        return (
            <div className="customize-react-table customize-sticky-table " >
                <ModalDetail
                    isOpen={isDetailModalOpen}
                    dataCCQ={dataCCQ}
                    detailCCQ={detailCCQ}
                    idAccount={detailCCQ.CUSTODYCD}
                    idCCQ={detailCCQ.SYMBOL}
                    detailColumn={detailColumn}
                    onClose={this.onCloseDetailModal}
                />
                <ReactTable
                    data={data}
                    columns={columns}
                    defaultPageSize={10}
                    className="-striped -highlight dmdt-table-have-symbol"
                    filterable={true}
                    previousText={<i className="fas fa-backward" id="previous"></i>}
                    nextText={<i className="fas fa-forward" id="next"></i>}
                    showPagination={false}
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
    translate('TableHaveSymbol')
]);

module.exports = decorators(TableHaveSymbol);
