import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang } from 'app/Helpers'
import moment from 'moment';
import DateInput from 'app/utils/input/DateInput';
var Select = require('react-select');
import NumberInput from 'app/utils/input/NumberInput'

class TableTVLSGD extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avaiBalances: [],
            pages: null,
            loading: true,
            checkedAll: false,
            checkboxChecked: false,
            selectedRows: new Set(),
            unSelectedRows: [],
            showModalAccess: false,
            showModalReview: false,
            isFirstLoad: true,
            CUSTID_DETAIL: '',
            pagesize: DefaultPagesize,
            keySearch: {},
            sortSearch: {},
            page: 1,
            p_custodycd: 'ALL', // ALL is default / Customer is just ONE 
            p_exectype: 'ALL',
            p_srtype: 'ALL',
            DBCODE: '',
        }
        // this.fetchData = this.fetchData.bind(this);
    }
    formatNumber(nStr, decSeperate, groupSeperate) {
        nStr += '';
        let x = nStr.split(decSeperate);
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + groupSeperate + '$2');
        }
        return x1 + x2;
    }


    handleAdd(evt) {
        var that = this;
        that.props.showModalDetail("add");
    }
    handlEdit(data) {
        var that = this;
        that.props.showModalDetail("add", data);
    }
    handleChangeALL(evt) {
        var that = this;
        this.setState({ checkedAll: evt.target.checked });
        if (evt.target.checked) {
            that.state.data.map(function (item) {
                if (!that.state.selectedRows.has(item.AUTOID)) {
                    that.state.unSelectedRows.push(item.AUTOID);
                    that.state.selectedRows.add(item.AUTOID);
                }
            })
            that.setState({ selectedRows: that.state.selectedRows, unSelectedRows: that.state.unSelectedRows })
        }
        else {
            that.state.unSelectedRows.map(function (item) {
                that.state.selectedRows.delete(item);
            })
            that.setState({ selectedRows: that.state.selectedRows, unSelectedRows: [] })
        }

    }
    onClick(type) {
        let self = this;
        switch (type) {
            case "create": {

                self.handleAdd();
            }
            case "edit": {
            }
        }
    }
    handleChange(row) {

        if (!this.state.selectedRows.has(row.original.AUTOID))
            this.state.selectedRows.add(row.original.AUTOID);
        else {
            this.state.selectedRows.delete(row.original.AUTOID);
        }
        this.setState({ selectedRows: this.state.selectedRows });
    }
    onRowClick(state, rowInfo, column, instance) {
        var that = this;
        return {
            onDoubleClick: e => {

                that.props.showModalDetail("view", rowInfo.original)
            },
            style: {
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.AUTOID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.AUTOID) ? 'black' : '',
            }

        }
    }

    componentDidMount() {
        let to_date = new Date();
        let from_date = moment(to_date).subtract(3, 'months');;
        this.setState({
            ...this.state,
            p_frdate: moment(from_date).format('DD/MM/YYYY'),
            p_todate: moment(to_date).format('DD/MM/YYYY'),
        })
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

    async loadData(pagesize, page, keySearch, sortSearch) {
        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        var that = this;
        var custodycd = user.USERNAME;
        let valueCustodycd = isCustom ? custodycd : 'ALL'
        var obj = {
            exectype: 'ALL',
            srtype: 'ALL',
            custodycd: valueCustodycd,
            codeid: 'ALL',
            frdate: this.state.p_frdate,
            todate: this.state.p_todate,
            language: this.props.language,
            pagesize: this.state.pagesize,
            objname: this.props.OBJNAME,
            dbcode: this.state.DBCODE.value ? this.state.DBCODE.value : 'ALL',
        }

        RestfulUtils.post('/fund/getorderdbookall', { ...obj, pagesize, page, keySearch, sortSearch }).then(resData => {
            if (resData.EC == 0) {
                that.setState({
                    avaiBalances: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord
                });
            }

        })
    }
    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    getOptionsSYMBOL(input) {
        return RestfulUtils.post('/allcode/search_all_funds', { key: input })
            .then((res) => {
                // console.log(res.data);
                return { options: res }
            })
    }

    onChangeSelect(type, e) {
        if (e) {
            this.state.isFirstLoad = false;
            this.setState({ DBCODE: e });
        }
        else {
            this.state.isFirstLoad = true;
            this.setState({ DBCODE: { label: '', value: '' } });

        }
    }

    getOptions(input) {
        return RestfulUtils.post('/account/search_all', { key: input })
            .then((res) => {
                const { user } = this.props.auth
                let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
                if (isCustom)
                    if (res)
                        if (res.length > 0)
                            this.setState({ ...this.state, p_custodycd: res[0].value })
                return { options: res }
            })
    }
    onChangeSYMBOL(e) {
        if (e === null) e = ''
        this.setState({
            p_codeid: e.value
        })
    }
    onChange(e) {
        // console.log(e)
        if (e === null) e = ''
        this.setState({
            p_custodycd: e.value
        })
    }
    onChangeDate(type, event) {

        if (event.target) {

            this.state[type] = event.target.value;
        }
        else {
            this.state[type] = event.value;
        }
        this.setState({
            p_frdate: this.state.p_frdate, p_todate: this.state.p_todate
        })
    }

    search() {
        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        var that = this;
        var custodycd = user.USERID;
        let valueCustodycd = isCustom ? custodycd : 'ALL'
        var obj = {
            exectype: 'ALL',
            srtype: 'ALL',
            custodycd: valueCustodycd,
            codeid: 'ALL',
            frdate: this.state.p_frdate,
            todate: this.state.p_todate,
            language: this.props.language,
            pagesize: this.state.pagesize,
            objname: this.props.OBJNAME,
            dbcode: this.state.DBCODE.value ? this.state.DBCODE.value : 'ALL',
        }
        // console.log('obj =====>>> ', obj)
        if (obj.frdate && obj.todate) {
            var api = '/fund/getorderdbookall';

            RestfulUtils.post(api, obj)
                .then((res) => {
                    //console.log('res =====>>> ', res)
                    if (res.EC == 0) {
                        that.setState({
                            avaiBalances: res.DT.data,
                            pages: res.DT.numOfPages,
                        })
                    } else {
                        toast.error(res.EM, {
                            position: toast.POSITION.BOTTOM_RIGHT
                        });
                    }

                })
        }
        else {
            if (!obj.frdate) {
                toast.error(this.props.strings.requiredfrdate, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
                window.$(`#txtfrdate`).focus();
            } else {
                toast.error(this.props.strings.requiredtodate, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
                window.$(`#txttodate`).focus();
            }

        }
    }
    async onSetDefaultValue(type, value) {
        // this.state[type] = value
        // this.state[type] = 'ALL'
    }
    async onChangeDropdown(type, event) {

        this.state[type] = event.value

        this.setState(this.state)

    }

    getAgentOptions(input) {
        return RestfulUtils.post('/vcbf/getAgentsList', { key: input, OBJNAME: this.props.OBJNAME })
            .then((res) => {
                res.unshift({ value: 'ALL', label: 'All-Tất cả' })
                return { options: res }
            })
    }

    render() {
        const { pages, loading, avaiBalances } = this.state;
        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        let disableCustodycdBox = this.state.ISEDIT || isCustom;

        const columns = [
            // // Số hiệu TKGD
            {
                Header: props => <div className="">{this.props.strings.CUSTODYCD}</div>,
                id: "CUSTODYCD",
                accessor: "CUSTODYCD",
                // show: !isCustom,
                minWidth: 140,
                className: "texr-custom-left"
            },

            // Mã CCQ
            {
                Header: props => <div className="">{this.props.strings.SYMBOL}</div>,
                id: "SYMBOL",
                accessor: "SYMBOL",
                minWidth: 110,
                className: "texr-custom-left"
            },

            // Loại lệnh
            {
                Header: props => <div className="">{this.props.strings.EXECTYPE_DESC}</div>,
                id: "EXECTYPE_DESC",
                accessor: "EXECTYPE_DESC",
                minWidth: 120,
                className: "texr-custom-left",
                Cell: row => (
                    <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {row.value}
                    </span>
                ),
            },
            // Loại sản phẩm
            {
                Header: props => <div className="">{this.props.strings.PRODUCTTYPE}</div>,
                id: "PRODUCTTYPE",
                accessor: "PRODUCTTYPE",
                minWidth: 130,
                className: "texr-custom-left"
            },
            // Mã sản phẩm
            {
                Header: props => <div className="">{this.props.strings.FEEID}</div>,
                id: "FEEID",
                accessor: "FEEID",
                minWidth: 130,
                className: "texr-custom-left"
            },
            // Số tiền/SL
            {
                Header: props => <div className="">{this.props.strings.ORDERVALUE}</div>,
                accessor: "ORDERVALUE",
                minWidth: 120,
                className: "texr-custom-right",
                Cell: ({ value }) => (
                    <div>
                        {
                            <NumberInput value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                        }
                    </div>
                ),
            },
            // Số lượng khớp
            {
                Header: props => <div className="">{this.props.strings.MATCHQTTY}</div>,
                accessor: "MATCHQTTY",
                minWidth: 110,
                className: "texr-custom-right",
                Cell: ({ value }) => (
                    <div >
                        {
                            <NumberInput value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                        }
                    </div>
                ),
            },
            // Trạng thái
            {
                Header: props => <div className="">{this.props.strings.STATUS_DES}</div>,
                id: getExtensionByLang("STATUS_DES", this.props.language),
                accessor: getExtensionByLang("STATUS_DES", this.props.language),
                minWidth: 160,
                className: "texr-custom-left"
            },
            // Ngày đặt lệnh
            {
                Header: props => <div className="">{this.props.strings.TXDATE}</div>,
                id: "TXDATE",
                accessor: "TXDATE",
                minWidth: 140,
                className: "texr-custom-left"
            },
            // Ngày giao dịch
            {
                Header: props => <div className="">{this.props.strings.TRADINGDATE}</div>,
                id: "TRADINGDATE",
                accessor: "TRADINGDATE",
                minWidth: 140,
                className: "texr-custom-left"
            },
            // Thời gian đặt
            {
                Header: props => <div className="">{this.props.strings.TXTIME}</div>,
                id: "TXTIME",
                accessor: "TXTIME",
                minWidth: 140,
                className: "texr-custom-left"
            },
            // User đặt
            {
                Header: props => <div className="">{this.props.strings.USERNAME}</div>,
                id: "USERNAME",
                accessor: "USERNAME",
                minWidth: 140,
                className: "texr-custom-left"
            },
            // Mã CCQ chuyển đổi
            {
                Header: props => <div className="wordwrap">{this.props.strings.SWSYMBOL}</div>,
                id: "SWSYMBOL",
                accessor: "SWSYMBOL",
                minWidth: 150,
                className: "texr-custom-left"
            },
            // Mã phiên
            {
                Header: props => <div className="">{this.props.strings.SESSIONNO}</div>,
                id: "SESSIONNO",
                accessor: "SESSIONNO",
                show: !isCustom,
                minWidth: 135
            },
            // Số hiệu lệnh
            {
                Header: props => <div className="">{this.props.strings.ORDERID}</div>,
                id: "ORDERID",
                accessor: "ORDERID",
                minWidth: 140,
                className: "texr-custom-right"
            },
            // Số hiệu lệnh VSD
            {
                Header: props => <div className="">{this.props.strings.VSDORDERID}</div>,
                id: "VSDORDERID",
                accessor: "VSDORDERID",
                show: !isCustom,
                minWidth: 140,
                className: "texr-custom-right"
            },
        ]

        return (
            <div className="table-tvlsdg-container row">
                <div className="table-tvlsdg-content-header col-md-12">
                    <div className="title-table">
                        Lịch sử giao dịch
                    </div>
                    <div className="inputs-table">
                        {/* DLPP, Số hiệu TKGD, ko hiển thị với nhà đầu tư */}
                        {!isCustom &&
                            <div className="col-md-2 div-select-dbcode">
                                <Select.Async
                                    name="form-field-name"
                                    disabled={disableCustodycdBox}
                                    loadOptions={this.getAgentOptions.bind(this)}
                                    value={this.state.DBCODE}
                                    onChange={this.onChangeSelect.bind(this, 'DBCODE')}
                                    id="cbDBCODE"
                                    placeholder={this.props.strings.dbcode}
                                    cache={false}
                                    backspaceRemoves={true}
                                    clearable={true}
                                />
                            </div>
                            // <div className="col-md-3 form-group">
                            //     <label>{this.props.strings.CUSTODYCD}</label>
                            //     <Select.Async
                            //         name="form-field-name"
                            //         disabled={disableCustodycdBox}
                            //         loadOptions={this.getOptions.bind(this)}
                            //         value={this.state.p_custodycd}
                            //         onChange={this.onChangeSelect.bind(this, 'CUSTODYCD2')}
                            //         //options={this.state.listOptionSelect['CUSTODYCD2']}
                            //         id="cbCUSTODYCD2"
                            //         cache={false}
                            //         backspaceRemoves={true}
                            //         clearable={true}
                            //     />
                            // </div>
                        }
                        <div className="cus-input-date">
                            <DateInput
                                id="txtfrdate"
                                onChange={this.onChangeDate.bind(this)}
                                value={this.state.p_frdate}
                                type="p_frdate"
                                placeholderText={this.props.strings.frdate}
                            />
                            <i className="fa fa-calendar" aria-hidden="true"></i>
                        </div>
                        <div className="cus-input-date">
                            <DateInput
                                id="txttodate"
                                onChange={this.onChangeDate.bind(this)}
                                value={this.state.p_todate}
                                type="p_todate"
                                placeholderText={this.props.strings.todate}
                            />
                            <i className="fa fa-calendar" aria-hidden="true"></i>
                        </div>
                        <button
                            onClick={this.search.bind(this)}
                            type="button"
                            className="btn-search-tvlsgd"
                            id="btnSearch"
                        >
                            {this.props.strings.btnSearch}</button>
                    </div>

                </div>
                <div className="customize-react-table col-md-12" >
                    <ReactTable
                        className="-striped -highlight"
                        columns={columns}
                        pages={pages}
                        onFetchData={this.fetchData.bind(this)}
                        data={avaiBalances}
                        pageText={this.props.strings.pageText}
                        rowsText={this.props.strings.rowsText}
                        previousText={<i className="fas fa-backward"></i>}
                        nextText={<i className="fas fa-forward"></i>}
                        loadingText="Loading..."
                        defaultPageSize={this.state.pagesize}
                        getTrProps={this.onRowClick.bind(this)}
                        ofText="/"
                        filterable
                        manual
                        getTheadTrProps={() => {
                            return {
                                className: 'head'
                            }
                        }}
                        style={{
                            maxHeight: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                        }}
                        noDataText={this.props.strings.textNodata}
                    />
                </div>
            </div>
        );
    }
}

const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    language: state.language.language,
    auth: state.auth

});


const decorators = flow([
    connect(stateToProps),
    translate('TableTVLSGD')
]);

module.exports = decorators(TableTVLSGD);