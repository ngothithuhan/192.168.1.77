import React from 'react'
import RestfulUtils from 'app/utils/RestfulUtils'
import ReactTable from "react-table";
import "react-table/react-table.css";
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import NumberInput from 'app/utils/input/NumberInput';
import DropdownFactory from '../../../../utils/DropdownFactory';
import { showNotifi } from 'app/action/actionNotification.js';
import _ from 'lodash'
import flow from 'lodash.flow';
import { amt_width, qtty_width, symbol_width, date_width } from 'app/Helpers';

const Select = require('react-select');

function getSum(total, num) {
    return total + num;
}
class TableExpectedSell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            keySearch: {},
            CUSTODYCD: '',
            CODEID: '',
            SELLTYPE: '',
            QTTY: { value: 0, validate: null, tooltip: "Không được để trống !!" },
            checkFields: [
                { name: "CUSTODYCD", id: "drdCUSTODYCD" },
                { name: "CODEID", id: "drdCODEID" },
                { name: "QTTY", id: "txtQTTY" },
            ],
        }
    }

    componentWillReceiveProps(nextProps) {
        let { keySearch } = nextProps

        //if (keySearch.SYMBOL != this.state.keySearch.SYMBOL || keySearch.TRADINGID != this.state.keySearch.TRADINGID) {
        // this.search(keySearch);
        //  this.props.refreshSearch();
        // }

    }
    search() {
        let self = this
        //todo account overview
        let keySearch = {
            p_custodycd: this.state.CUSTODYCD.value ? this.state.CUSTODYCD.value : 'EMPTY',
            p_codeid: this.state.CODEID.value ? this.state.CODEID.value : 'EMPTY',
            p_language: this.props.lang,
        }

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
    checkValid(name, id) {
        let value = this.state[name];
        let mssgerr = '';
        switch (name) {
            case "CUSTODYCD":
                if (!value || value == '') {
                    mssgerr = this.props.strings.requiredCUSTODYCD;
                }
                break;
            case "CODEID":
                if (!value || value == '') {
                    mssgerr = this.props.strings.requiredCODEID;
                }
                break;
            case "QTTY":
                if (!value || value == '' || !value.value) {
                    mssgerr = this.props.strings.requiredQTTY;
                }
                break;
        }

        if (mssgerr !== '') {
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""
            }
            datanotify.type = "error";
            datanotify.content = mssgerr;
            dispatch(showNotifi(datanotify));
            window.$(`#${id}`).focus();
        }
        return mssgerr;
    }
    onClickExpectedSellBtn() {
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            let mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        this.getDataExpectedSell();
    }
    getDataExpectedSell() {
        let self = this
        let data = {
            p_custodycd: this.state.CUSTODYCD.value || 'nodata',
            p_codeid: this.state.CODEID.value || 'nodata',
            p_srtype: this.state.SELLTYPE || 'nodata',
            p_qtty: this.state.QTTY.value || '0',
            p_language: this.props.lang,
        }

        RestfulUtils.post('/fund/precheckCalcExpectedSellOrder', { data, OBJNAME: this.props.OBJNAME })
            .then(resData => {
                if (resData.EC == 0) {
                    RestfulUtils.post('/fund/getExpectedSellOrder', { data, OBJNAME: this.props.OBJNAME })
                        .then(res => {
                            if (res.EC == 0) {
                                self.setState({ data: res.DT.data })
                            }
                            else {
                                self.setState({ data: [] })
                            }
                        })
                }
                else {
                    this.props.dispatch(showNotifi({
                        type: "error",
                        header: "",
                        content: resData.EM
                    }));
                    self.setState({ data: [] })
                }
            })
    }
    componentDidMount() {
        //
    }
    onRowClick(state, rowInfo, column, instance) {
        let self = this;

        return {
            onDoubleClick: e => {

                //  console.log(rowInfo)
                if (rowInfo.original != undefined) {
                    let dataClick = self.state.data.filter(e => e.ORDERID === rowInfo.original.ORDERID);
                    // if (rowInfo.original.CUSTODYCD) self.props.showPopupThongTinMonNop(dataClick);
                }
                // that.props.showModalDetail("view", rowInfo.row.CUSTID)
            },

            style: {
                background: rowInfo == undefined ? '' : rowInfo.original == undefined ? '' : rowInfo.original.background
                // color:rowInfo==undefined?'': that.state.selectedRows.has(rowInfo.original.CUSTID)?'black':'',
            }
        }
    }

    getOptionsSYMBOL = () => {
        return RestfulUtils.post('/allcode/search_all_funds', { key: '' })
            .then((res) => {
                return { options: res }
            })
    }

    async onChangeSYMBOL(e) {
        this.setState({ CODEID: e, data: [] });
    }

    async onChangeCUSTODYCD(e) {
        this.setState({ CUSTODYCD: e, data: [] });
    }

    onChangeDropdown(type, event) {
        this.state[type] = event.value;
        this.state.data = [];
        this.setState(this.state)
    }

    onSetDefaultValue = (type, value) => {
        if (!this.state[type]) {
            this.state[type] = value;
            this.setState(this.state);
        }
    }

    onValueChange(type, data) {
        this.state[type].value = data.value.replace(/^0+/, '')
        this.state[type].formattedValue = data.formattedValue
        this.state.data = []
        this.setState(this.state)
    }

    getOptions(input) {
        var self = this;
        return RestfulUtils.post('/account/search_all', { key: input })
            .then((res) => {
                // let j = 0;
                // for (j = 0; j < res.length; j++) {
                //     res[j] = { label: res[j].label + ' - ' + res[j].detail.FULLNAME, value: res[j].value }
                // }
                return { options: res }
            })
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
                        id: "TKGD",
                        accessor: "TKGD",
                        minWidth: 150,
                        headerClassName: "sticky",
                        PivotValue: row => {
                            var b = row.subRows.map(function (v) {
                                return parseFloat(v.PHAN_TRAM_LAILO);
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
                        id: "MA_CCQ",
                        Header: props => <div className="wordwrap" id="">{this.props.strings.symbol}</div>,
                        aggregate: vals => '',
                        accessor: "MA_CCQ",
                        minWidth: 150,
                        className: "sticky text-custom-left",
                        headerClassName: "sticky",
                        PivotValue: row => {
                            var b = row.subRows.map(function (v) {
                                return parseFloat(v.PHAN_TRAM_LAILO);
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
                    //So luong ban du kien
                    {
                        Header: props => <div className="wordwrap" id="lblamount">{this.props.strings.amount}</div>,
                        width: qtty_width,
                        accessor: "SO_LUONG",
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
                ]
            },


            {
                Header: props => <div className="add-border-bottom">{this.props.strings.buy}</div>,
                // className: "order-group abc2",
                // headerClassName: "order-group abc22",
                headerClassName: "sticky",
                columns: [
                    // Ngày GD mua
                    {
                        Header: props => <div className="">{this.props.strings.txdate}</div>,
                        accessor: "NGAY_MUA",
                        id: "NGAY_MUA",
                        minWidth: 120,
                        filterable: false,
                        aggregate: vals => {
                            return ''
                        },
                        Cell: (row) => {
                            return (
                                <span className="">
                                    {row.value}
                                </span>)
                        }
                    },
                    {
                        Header: props => <div className="wordwrap" id="lblnavcapital">{this.props.strings.navcapital}</div>,
                        accessor: "NAV_MUA",
                        aggregate: (values, rows) => {
                            //Giá NAV bán= round(sum (Số lượng * NAV)/Số lượng map,2)
                            var SO_LUONG = rows.map(function (v) {
                                if (v.SO_LUONG) return parseFloat(v.SO_LUONG);
                                return 0
                            });
                            var sum_SO_LUONG = SO_LUONG.reduce(getSum)
                            var sum = 0
                            if (sum_SO_LUONG > 0) {
                                var GT_MUA = rows.map(function (v) {
                                    if (v.SO_LUONG) return parseFloat(v.SO_LUONG * v.NAV_MUA);
                                    return 0
                                });
                                var sum_GT_MUA = GT_MUA.reduce(getSum)
                                sum = sum_GT_MUA / sum_SO_LUONG
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
                        Header: props => <div className="wordwrap" id="lblnavvalue">{this.props.strings.navvalue}</div>,
                        accessor: "GIA_TRI_MUA",
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
                    {
                        Header: props => <div className="wordwrap" id="lblfeebuy">{this.props.strings.feebuy}</div>,
                        accessor: "PHI_MUA",
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
                ]
            },
            {
                Header: props => <div className="add-border-bottom">{this.props.strings.expectedSell}</div>,
                columns: [
                    // Ngày bán
                    {
                        Header: props => <div className="">{this.props.strings.saleDate}</div>,
                        accessor: "NGAY_BAN",
                        id: "NGAY_BAN",
                        minWidth: 120,
                        filterable: false,
                        aggregate: vals => {
                            return ''
                        },
                        Cell: (row) => {
                            return (
                                <span className="">
                                    {row.value}
                                </span>
                            )
                        }
                    },
                    {
                        Header: props => <div className="wordwrap" id="lblnavsellcost">{this.props.strings.navsellcost}</div>,
                        accessor: "NAV_BAN",
                        width: amt_width,
                        filterable: false,
                        aggregate: (values, rows) => {
                            //Giá NAV vốn= round(Giá trị vốn/Số lượng,2)
                            var SO_LUONG = rows.map(function (v) {
                                if (v.SO_LUONG) return parseFloat(v.SO_LUONG);
                                return 0
                            });
                            var NAV_BAN = rows.map(function (k) {
                                if (k.NAV_BAN != null) return parseFloat(k.NAV_BAN)
                                else return 0
                            });
                            var sum_SO_LUONG = SO_LUONG.reduce(getSum)
                            var sum = 0
                            if (sum_SO_LUONG > 0) {
                                var GT_BAN = rows.map(function (v) {
                                    if (v.SO_LUONG) return parseFloat(v.SO_LUONG * v.NAV_BAN);
                                    return 0
                                });
                                var sum_GT_BAN = GT_BAN.reduce(getSum)
                                sum = sum_GT_BAN / sum_SO_LUONG
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
                        Header: props => <div className="wordwrap" id="lblnavvaluesell">{this.props.strings.navvaluesell}</div>,
                        accessor: "GIA_TRI_BAN",
                        minWidth: 190,
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
                Header: props => <div className="add-border-bottom">{this.props.strings.ExpectedFeesTaxes}</div>,
                columns: [
                    {
                        Header: props => <div className="wordwrap" id="lblfeesell">{this.props.strings.feesell}</div>,
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
                    //phí SIP
                    {
                        Header: props => <div className="wordwrap" id="lbltax">{this.props.strings.sipPenantyFees}</div>,
                        filterable: false,
                        accessor: "PHI_PHAT_SIP",
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
                    },

                    {
                        Header: props => <div className="wordwrap" id="lbltax">{this.props.strings.tax}</div>,
                        filterable: false,
                        accessor: "THUE",
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
                Header: props => <div className="add-border-bottom">{this.props.strings.profitAndLossExp}</div>,
                columns: [
                    {
                        Header: props => <div className="wordwrap" id="lblvalue">{this.props.strings.value}</div>,
                        width: amt_width,
                        accessor: "GIA_TRI_LAILO",
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
                        Header: props => <div className="wordwrap" id="lblper">{this.props.strings.percent}</div>,
                        accessor: "PHAN_TRAM_LAILO",
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
                            var GIA_TRI_MUA = rows.map(function (v) {
                                if (v.GIA_TRI_MUA != null) return parseFloat(v.GIA_TRI_MUA);
                                else return 0
                            });
                            var sum_GIA_TRI_MUA = GIA_TRI_MUA.reduce(getSum)
                            var sum = 0
                            if (sum_GIA_TRI_MUA = 0) {
                                sum = 100
                            } else {
                                var GIA_TRI_LAILO = rows.map(function (v) {
                                    if (v.GIA_TRI_LAILO != null) return parseFloat(v.GIA_TRI_LAILO);
                                    return 0;
                                });
                                var sum_GIA_TRI_LAILO = GIA_TRI_LAILO.reduce(getSum)

                                var GIA_TRI_MUA1 = rows.map(function (v) {
                                    if (v.GIA_TRI_MUA != null) return parseFloat(v.GIA_TRI_MUA);
                                    else return 1
                                });
                                var sum_GIA_TRI_MUA1 = GIA_TRI_MUA1.reduce(getSum)

                                var PHI_MUA = rows.map(function (v) {
                                    if (v.PHI_MUA != null) return parseFloat(v.PHI_MUA);
                                    else return 1
                                });
                                var sum_PHI_MUA = PHI_MUA.reduce(getSum)
                                sum = sum_GIA_TRI_LAILO * 100 / (parseFloat(sum_GIA_TRI_MUA1) + parseFloat(sum_PHI_MUA))
                            }
                            return sum
                            //.toFixed(2)
                        },
                        Cell: ({ value }) => {
                            return (
                                <span >
                                    {value ? <NumberInput value={value} decimalScale={2} displayType={'text'} thousandSeparator={true} /> : ''}
                                </span>
                            )
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
            <React.Fragment>
                <div className="dmdt-table-exps-header">
                    <div className="input-container">
                        <Select.Async
                            name="form-field-name"
                            loadOptions={this.getOptions.bind(this)}
                            value={this.state.CUSTODYCD}
                            onChange={this.onChangeCUSTODYCD.bind(this)}
                            id="drdCUSTODYCD"
                            cache={false}
                            backspaceRemoves={true}
                            clearable={true}
                            placeholder={this.props.strings.account}
                        />
                    </div>
                    <div className="input-container smaller">
                        <Select.Async
                            name="form-field-name"
                            loadOptions={this.getOptionsSYMBOL.bind(this)}
                            value={this.state.CODEID}
                            onChange={this.onChangeSYMBOL.bind(this)}
                            cache={false}
                            backspaceRemoves={true}
                            clearable={true}
                            id="drdCODEID"
                            placeholder={this.props.strings.symbol}
                        />
                    </div>
                    <div className="input-container smaller remove-ml">
                        {/* <label>{this.props.strings.ordertypenew}</label> */}
                        <DropdownFactory
                            CDVAL={this.state.SELLTYPE}
                            value="SELLTYPE"
                            CDTYPE="SE"
                            CDNAME="SELLTYPE"
                            onChange={this.onChangeDropdown.bind(this)}
                            onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                            ID="drdSELLTYPE"
                        />
                    </div>
                    <div className="input-container input-container-number-sell">
                        {/* {!this.state.QTTY.value && (
                            <label className='number-sell-label'>{this.props.strings.expectedSellQtty}</label>
                        )} */}
                        <NumberInput
                            className="number-sell"
                            value={this.state.QTTY.value}
                            onValueChange={this.onValueChange.bind(this, 'QTTY')}
                            thousandSeparator={true}
                            decimalScale={2}
                            prefix={''}
                            placeholder={this.props.strings.expectedSellQtty}
                            id="txtQTTY"
                        />
                    </div>
                    {/* translate */}
                    <button className="btn-du-kien-ban" onClick={this.onClickExpectedSellBtn.bind(this)}>
                        {this.props.strings.expectedSellBtn}
                    </button>
                </div>

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
                        className="-striped -highlight dmdt-table-exps"
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
                        pivotBy={["TKGD", "MA_CCQ"]}
                    />
                </div>
            </React.Fragment>
        )
    }
}
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language,
    auth: state.auth,
});
const decorators = flow([
    connect(stateToProps),
    translate('TableExpectedSell')
]);

module.exports = decorators(TableExpectedSell);
