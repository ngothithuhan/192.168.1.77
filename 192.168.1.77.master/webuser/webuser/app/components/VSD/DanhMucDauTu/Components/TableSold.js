import React from 'react'
import RestfulUtils from 'app/utils/RestfulUtils'
import ReactTable from "react-table";
import "react-table/react-table.css";
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import NumberInput from 'app/utils/input/NumberInput';
import _ from 'lodash'
import flow from 'lodash.flow';
import { amt_width, qtty_width, symbol_width, date_width } from 'app/Helpers';


function getSum(total, num) {
    return total + num;
}
class TableSold extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [

            ],
            keySearch: {},
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


        RestfulUtils.post('/fund/getlisportfolio', { keySearch, type: '1', OBJNAME: this.props.OBJNAME })
            .then(resData => {
                //   console.log('1',resData)
                if (resData.EC == 0) {

                    self.setState({ data: resData.DT.data, keySearch: { ...keySearch } })
                }
                else {
                    //toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT })

                }
            })


    }
    /*
        componentDidMount() {
            let self = this;
            //fixHeight()
            let keySearch = {}
            keySearch.p_codeid = 'ALL';
            keySearch.p_custodycd = ''
            keySearch.p_type = '1'
            keySearch.language = this.props.lang
            this.search(keySearch);
    
        }
        */
    onRowClick(state, rowInfo, column, instance) {
        let self = this;




        return {
            onDoubleClick: e => {

                //  console.log(rowInfo)
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
        let data = this.state.data
        let LASTORDERID = ''

        const columns = [
            {
                Header: ' ',
                width: symbol_width,
                columns: [
                    // TKGD
                    {
                        Header: props => <div className="wordwrap">{this.props.strings.accountTrade}</div>,
                        id: "AccTrade",
                        accessor: "CUSTODYCD",
                        minWidth: 150,
                        headerClassName: "sticky",
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
                                    {row.value + ' (' + row.subRows.length + ')'}
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
                // className: "order-group abc2",
                // headerClassName: "order-group abc22",
                columns: [
                    {
                        id: "TXDATE",
                        Header: props => <div className="wordwrap" id="">{this.props.strings.txdate}</div>,
                        accessor: "TXDATE",
                        minWidth: 150,
                        headerClassName: "",
                        filterable: false,
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
                        Header: props => <div className="wordwrap" id="lblamount">{this.props.strings.amount}<div>(1)</div></div>,
                        width: qtty_width,
                        accessor: "SL_MUA_MAP",
                        aggregate: vals => {
                            var b = vals.map(function (v) {
                                return parseFloat(v);
                            });
                            return _.sum(b).toFixed(2)
                        },
                        Aggregated: row => {

                            return (
                                <span>
                                    {row.aggregated ? <NumberInput value={row.value} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                                </span>
                            );
                        },
                        filterable: false,
                        Cell: (row) => (

                            <span >
                                <NumberInput value={row.value} decimalScale={2} displayType={'text'} thousandSeparator={true} />
                            </span>
                        ),

                    },
                    {
                        Header: props => <div className="wordwrap" id="lblnavcapital">{this.props.strings.navcapital}<div>(2)</div></div>,
                        accessor: "NAV_VON",
                        aggregate: (values, rows) => {
                            //Giá NAV bán= round(sum (Số lượng * NAV)/Số lượng map,2)
                            var SL_MUA_MAP = rows.map(function (v) {
                                if (v.SL_MUA_MAP) return parseFloat(v.SL_MUA_MAP);
                                return 0
                            });

                            var sum_SL_MUA_MAP = SL_MUA_MAP.reduce(getSum)
                            var sum = 0
                            if (sum_SL_MUA_MAP > 0) {
                                var GT_MUA = rows.map(function (v) {
                                    if (v.SL_MUA_MAP) return parseFloat(v.SL_MUA_MAP * v.NAV_VON);
                                    return 0
                                });
                                var sum_GT_MUA = GT_MUA.reduce(getSum)
                                sum = sum_GT_MUA / sum_SL_MUA_MAP
                            }

                            return sum.toFixed(2)
                        },
                        Aggregated: row => {

                            return (
                                <span>
                                    {row.aggregated ? <NumberInput value={row.value} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                                </span>
                            );
                        },
                        filterable: false,
                        width: amt_width,
                        Cell: (row) => (
                            <span>
                                <NumberInput value={row.value} decimalScale={2} displayType={'text'} thousandSeparator={true} />

                            </span>
                        ),
                    },
                    {
                        Header: props => <div className="wordwrap" id="lblnavvalue">{this.props.strings.navvalue}<div>(3)=(1)*(2)</div></div>,
                        accessor: "GT_MUA_MAP",
                        // aggregate: vals => '',
                        filterable: false,
                        width: amt_width,

                        Cell: (row) => (
                            <span >
                                <NumberInput value={row.value} displayType={'text'} thousandSeparator={true} />

                            </span>
                        ),
                        aggregate: vals => {
                            var b = vals.map(function (v) {
                                return parseFloat(v);
                            });
                            return _.sum(b)
                        },
                        Aggregated: row => {

                            return (
                                <span>
                                    {row.aggregated ? <NumberInput value={row.value} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                                </span>
                            );
                        }
                    },


                ]
            },
            {
                Header: props => <div className="add-border-bottom">{this.props.strings.sell}</div>,
                columns: [
                    {
                        id: "saleDate",
                        Header: props => <div className="wordwrap" id="">{this.props.strings.selldate}</div>,
                        accessor: "SELLDATE",
                        minWidth: 150,
                        filterable: false,
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
                        Header: props => <div className="wordwrap" id="lblamount">{this.props.strings.amount}<div>(4)</div></div>,
                        accessor: "SL_BAN",
                        aggregate: vals => {
                            var b = vals.map(function (v) {
                                return parseFloat(v);
                            });
                            return _.sum(b).toFixed(2)
                        },
                        Aggregated: row => {

                            return (
                                <span>
                                    {row.aggregated ? <NumberInput value={row.value} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                                </span>
                            );
                        },
                        filterable: false,
                        width: qtty_width,
                        Cell: ({ value }) => {
                            return (
                                <span >
                                    <NumberInput value={value} decimalScale={2} displayType={'text'} thousandSeparator={true} />

                                </span>)
                        }
                    },
                    {
                        Header: props => <div className="wordwrap" id="lblnavsellcost">{this.props.strings.navsellcost}<div>(5)</div></div>,
                        accessor: "NAV_BAN",
                        width: amt_width,
                        filterable: false,
                        aggregate: (values, rows) => {
                            //Giá NAV vốn= round(Giá trị vốn/Số lượng,2)
                            var SL_BAN = rows.map(function (v) {
                                if (v.SL_BAN) return parseFloat(v.SL_BAN);
                                return 0
                            });
                            var NAV_BAN = rows.map(function (k) {
                                if (k.NAV_BAN != null) return parseFloat(k.NAV_BAN)
                                else return 0
                            });
                            var sum_SL_BAN = SL_BAN.reduce(getSum)
                            var sum = 0
                            if (sum_SL_BAN > 0) {
                                var GT_BAN = rows.map(function (v) {
                                    if (v.SL_BAN) return parseFloat(v.SL_BAN * v.NAV_BAN);
                                    return 0
                                });
                                var sum_GT_BAN = GT_BAN.reduce(getSum)
                                sum = sum_GT_BAN / sum_SL_BAN
                            }

                            return sum.toFixed(2)
                        },
                        Aggregated: row => {

                            return (
                                <span>
                                    {row.aggregated ? <NumberInput value={row.value} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                                </span>
                            );
                        },
                        Cell: (row) => (
                            <span >
                                <NumberInput value={row.value} decimalScale={2} displayType={'text'} thousandSeparator={true} />

                            </span>
                        )
                    },
                    {
                        Header: props => <div className="wordwrap" id="lblnavvaluesell">{this.props.strings.navvaluesell}<div>(6)=(4)*(5)-(8)-(9)</div></div>,
                        accessor: "GT_BAN",
                        minWidth: 170,
                        // aggregate: vals => _.sum(vals),
                        filterable: false,
                        Cell: (row) => (
                            <span >
                                <NumberInput value={row.value} decimalScale={2} displayType={'text'} thousandSeparator={true} />

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
                            return _.sum(b)
                        },
                    },


                ]
            },


            {
                Header: props => <div className="add-border-bottom">{this.props.strings.money}</div>,
                columns: [

                    {
                        Header: props => <div className="wordwrap" id="lblfeebuy">{this.props.strings.feebuy}<div>(7)</div></div>,
                        width: amt_width,
                        accessor: "PHI_MUA",
                        //  aggregate: vals =>'',
                        filterable: false,
                        Cell: (row) => (
                            <span  >
                                {row.value ? <NumberInput value={row.value} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : ''}
                            </span>
                        ),

                        Aggregated: (row) => {
                            return (
                                <span className="rowColorTable">
                                    {row.value != 'NaN' ? <NumberInput value={row.value} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : 0}

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
                    {
                        Header: props => <div className="wordwrap" id="lblfeesell">{this.props.strings.feesell}<div>(8)</div></div>,
                        accessor: "PHI_BAN",
                        filterable: false,
                        width: amt_width,
                        Cell: (row) => (
                            <span  >
                                {row.value ? <NumberInput value={row.value} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : ''}
                            </span>
                        ),
                        Aggregated: row => {

                            return (
                                <span className="rowColorTable">
                                    {row.value != 'NaN' ? <NumberInput value={row.value} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : 0}
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
                    {
                        Header: props => <div className="wordwrap" id="lbltax">{this.props.strings.tax}<div>(9)</div></div>,
                        filterable: false,
                        accessor: "TAX_BAN",
                        aggregate: vals => {
                            var b = vals.map(function (v) {
                                return parseFloat(v);
                            });
                            return _.sum(b).toFixed(2)
                        },
                        Aggregated: row => {
                            return (
                                <span className="rowColorTable">
                                    {row.value != 'NaN' ? <NumberInput value={row.value} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : 0}

                                </span>
                            );
                        },

                        width: amt_width,
                        Cell: ({ value }) => {
                            return (
                                <span >
                                    <NumberInput value={value} decimalScale={2} displayType={'text'} thousandSeparator={true} />

                                </span>)
                        }
                    }

                ]
            },
            {
                Header: props => <div className="add-border-bottom">{this.props.strings.profit}</div>,
                columns: [

                    {
                        Header: props => <div className="wordwrap" id="lblvalue">{this.props.strings.value}<div>(10)=(6)-(3)-(7)</div></div>,
                        width: amt_width,
                        accessor: "PROFIT",
                        //  aggregate: vals =>'',
                        filterable: false,
                        Cell: (row) => (
                            <span  >
                                {row.value ? <NumberInput value={row.value} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}
                            </span>
                        ),

                        Aggregated: (row) => {

                            return (
                                <span  >
                                    {row.value != "NaN" ? <NumberInput decimalScale={2} value={row.value} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

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
                    {
                        Header: props => <div className="wordwrap" id="lblper">{this.props.strings.per}<div>(11)=(10)/((3)+(7))</div></div>,
                        accessor: "PER_PROFIT",
                        filterable: false,
                        minWidth: 200,
                        Aggregated: row => {

                            return (
                                <span >
                                    {row.value != "NaN" ? <NumberInput value={row.value} decimalScale={2} displayType={'text'} className="rowColorTable" thousandSeparator={true} /> : ''}

                                </span>
                            );
                        },
                        aggregate: (values, rows) => {
                            //%Lãi lỗ= Nếu Giá trị vốn = 0 thì 100 ngược lại Round(Giá trị lãi lỗ/Giá trị vốn*100,2)
                            var GT_MUA_MAP = rows.map(function (v) {
                                if (v.GT_MUA_MAP != null) return parseFloat(v.GT_MUA_MAP);
                                else return 0
                            });

                            var sum_GT_MUA_MAP = GT_MUA_MAP.reduce(getSum)
                            var sum = 0
                            if (sum_GT_MUA_MAP = 0) {
                                sum = 100
                            } else {
                                var PROFIT = rows.map(function (v) {
                                    if (v.PROFIT != null) return parseFloat(v.PROFIT);
                                    return 0;
                                });
                                var sum_PROFIT = PROFIT.reduce(getSum)
                                var GT_MUA_MAP1 = rows.map(function (v) {
                                    if (v.GT_MUA_MAP != null) return parseFloat(v.GT_MUA_MAP);
                                    else return 1
                                });
                                var sum_GT_MUA_MAP1 = GT_MUA_MAP1.reduce(getSum)
                                sum = sum_PROFIT / sum_GT_MUA_MAP1 * 100
                            }

                            return sum
                            //.toFixed(2)
                        },

                        Cell: ({ value }) => {
                            return (
                                <span >
                                    {value ? <NumberInput value={value} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : ''}

                                </span>)
                        }
                    },


                ]
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
            //             <span className="more_detail" >
            //                 {this.props.strings.viewDetail}
            //             </span>)
            //     }
            // },

        ]

        return (
            <div className="customize-react-table customize-sticky-table " >
                <ReactTable
                    data={data}
                    columns={columns}
                    getTheadTrProps={() => {
                        return {
                            className: 'head'
                        }
                    }}
                    defaultPageSize={10}
                    className="-striped -highlight dmdt-table-sold"
                    filterable
                    getTrProps={this.onRowClick.bind(this)}
                    getTheadGroupTrProps={() => {
                        return {
                            className: 'head'
                        }
                    }}
                    previousText={<i className="fas fa-backward" id="previous"></i>}
                    nextText={<i className="fas fa-forward" id="next"></i>}
                    showPagination={false}
                    pivotBy={["AccTrade", "SYMBOL"]}


                //nút expand khi gộp cột customize
                // ExpanderComponent={({ isExpanded, ...rest }) =>
                // isExpanded ? 
                // <span> <i style={{ color: "rgba(90, 75, 75, 0.59)", fontSize: "85%" }} className="fas fa-minus"></i> </span> : <span> <i style={{ color: "rgba(90, 75, 75, 0.59)", fontSize: "85%" }} className="fas fa-plus"></i></span>}
                />

            </div>


        )
    }
}
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language,

});
const decorators = flow([
    connect(stateToProps),
    translate('TableSold')
]);

module.exports = decorators(TableSold);
