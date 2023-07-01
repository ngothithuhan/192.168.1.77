import React from 'react';
import { connect } from 'react-redux';
import { searchListSoLenh } from 'actionDatLenh';
import { toast } from 'react-toastify';
import ModalDialog from 'app/utils/Dialog/ModalDialog'
import NumberInput from 'app/utils/input/NumberInput'
//import { Checkbox } from 'react-bootstrap';
import Modalconfim from 'app/utils/modal/Modalconfirm'
import ReactTable from "react-table";
import { showNotifi } from 'app/action/actionNotification.js';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import "react-table/react-table.css";
import RestfulUtils from 'app/utils/RestfulUtils';
import { SRTYPE_SW, SRTYPE_NR, COLORSW, COLORNR, COLORNS, DefaultPagesize, getExtensionByLang, getRowTextTable, getPageTextTable } from '../../../../Helpers';
// var log = require('app/utils/LoggerFactory.js').LoggerFactory({
//     prefix: true, module: 'Solenh.:'
// });
// class ListStatus extends React.Component {
//     state = {
//         Data: []
//     };
//     componentDidMount() {
//         var that = this;
//         axios.post('/allcode/getall_status_orders'
//         ).then(res => {
//             that.setState({ Data: res.data });
//         });
//     }

//     render() {

//         var Data = this.state.Data,
//             MakeItem = function (X, index) {
//                 return <option key={index}>{X.CDCONTENT}</option>;
//             };


//         return (
//             <select
//                 onChange={event => this.props.onChange(event.target.value)}
//                 style={{ width: "100%" }}
//                 value={this.props.filter ? this.props.filter.value : "T?t c?"}>
//                 <option></option>
//                 {Data.map(MakeItem)}
//             </select>
//         )

//     }
// }

class SoLenh extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: null,
            ACTION: 'add',
            datarow: [],
            pageSize: DefaultPagesize,
            loading: true,
            data: [],
            checkedAll: false,
            checkboxChecked: false,
            selectedRows: new Set(),
            unSelectedRows: []
            ,
            row: [],
            showModalConfirm: false,
            showModalDetail: false,
            access: "",
        };
        this.fetchData = this.fetchData.bind(this);
    }
    closeModalDetail() {
        this.setState({ showModalDetail: false })
    }

    handleChangeALL(evt) {
        var that = this;
        this.setState({ checkedAll: evt.target.checked });
        if (evt.target.checked) {
            that.state.data.map(function (item) {
                if (!that.state.selectedRows.has(item.ORDERID)) {
                    that.state.unSelectedRows.push(item.ORDERID);
                    that.state.selectedRows.add(item.ORDERID);
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
    handleChange(row) {
        if (!this.state.selectedRows.has(row.original.ORDERID))
            this.state.selectedRows.add(row.original.ORDERID);
        else {
            this.state.selectedRows.delete(row.original.ORDERID);
        }
        this.setState({ selectedRows: this.state.selectedRows });
    }
    onRowClick(state, rowInfo, column, instance) {
        var that = this;
        return {
            onDoubleClick: e => {
                console.log('A Td Element was clicked!')
                console.log('it produced this event:', e)
                console.log('It was in this column:', column)
                console.log('It was in this row:', rowInfo)
                console.log('It was in this table instance:', instance)
                that.props.showModalDetail("view", rowInfo.original.CUSTID)
            }


        }
    }
    accessSelectRows(dispatch) {
        var { dispatch } = this.props;
        var { action } = this.state

        var datanotify = {
            type: "",
            header: action == "cancel" ? "H?y" : action == "delete" ? "Xóa" : "",
            content: ""
        }
        // let oldData = []
        // let newData = []
        // console.log(this.state.action)
        this.state.selectedRows.forEach((key, value, set) => {
            new Promise((resolve, reject) => {
                let data = this.state.data.filter(e => e.ORDERID === value);
                resolve(io.socket.post('/order/' + this.state.action, data[0],
                    (resData => {
                        // console.log("....res...", resData)
                        if (resData.EC == 0) {
                            // datanotify.type="success";
                            // datanotify.content=" thành công ! "
                            // dispatch(showNotifi(datanotify));
                            toast.success(action + " " + value + " thành công !", {
                                position: toast.POSITION.BOTTOM_RIGHT
                            });
                        }
                        else {
                            toast.error(action + " " + value + " thành công !" + resData.EM, {
                                position: toast.POSITION.BOTTOM_RIGHT
                            });
                            // datanotify.type="error";
                            // datanotify.content=" không thành công ! "
                            // dispatch(showNotifi(datanotify));
                        }
                        return resData
                    })))
            })
        });
    }

    componentWillMount() {

        // var that = this;
        // var { dispatch } = this.props;
        // io.socket.on('orders', function (event) {
        //     // console.log(event);
        //     // console.log('thêm b?n ghi');
        //     if (event.verb === 'created') {

        //         that.state.data.push(event.data)
        //         that.setState({ data: that.state.data });
        //         var datanotify = {
        //             type: "info",
        //             header: "Ð?t l?nh",
        //             content: "có b?n ghi m?i"

        //         }
        //         dispatch(showNotifi(datanotify))
        //     }
        // });
    }

    callCancelOrder(order) {
        var self = this;
        RestfulUtils.post('/Order/delete', order).then((resData) => {
            if (resData.EC == 0) {
                toast.success(resData.EM, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            } else {
                toast.error(resData.EM, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }
        })
    }

    fn(shtk) {
        this.getAllStatus();
    }
    onRowClick(state, rowInfo, column, instance) {
        var that = this
        return {
            onDoubleClick: e => {
                console.log('A Td Element was clicked!')
                console.log('it produced this event:', e)
                console.log('It was in this column:', column)
                console.log('It was in this row:', rowInfo)
                console.log('It was in this table instance:', instance)
            },
            style: {
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.ORDERID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.ORDERID) ? 'black' : '',
            }

        }
    }
    getDataSelectRows(dispatch) {
        let result = [];
        var datanotify = {
            type: "",
            header: "Ð?t l?nh",
            content: ""

        }

        datanotify.type = "success";
        datanotify.content = "h?y l?nh thành công ! "
        dispatch(showNotifi(datanotify));


        datanotify.type = "success";
        datanotify.content = "h?y l?nh thành công ! "
        dispatch(showNotifi(datanotify));

    }
    async access() {

        let result = [];
        var that = this;
        this.accessSelectRows();

        this.setState({ showModalConfirm: false })

    }
    search() {
        var { dispatch } = this.props;
        var dataSearch = { SHTKGD: this.refs.SHTKGD.value, MaCCQ: this.refs.MaQuy.value };
        dispatch(searchListSoLenh(dataSearch));
    }
    eventCancel(row) {

        this.props.eventDelete(row)
    }
    eventDelete() {
        this.setState({ showModalConfirm: true, ACTION: "delete" })
    }
    checkConfirm(ACTION, data, event) {
        this.setState({ showModalDetail: true, ACTION: ACTION, datarow: data })
    }
    confirmPopup(ISConfirm, ACTION) {
        console.log('ISConfirm, ACTION:', ISConfirm, ACTION)
        if (ISConfirm == true) {
            if (ACTION == "delete")
                this.eventCancel(this.state.datarow)
            else if (ACTION == "edit")
                this.props.eventEdit(this.state.datarow)
        }
        else {
            // this.props.eventDelete(this.state.datarow)
            this.setState({ showModalConfirm: false, ACTION: ACTION })
        }
    }

    eventApprove() {
        this.setState({ showModalConfirm: true, action: "aprrove" })
    }
    eventEdit(row) {

        this.props.eventEdit(row)
    }
    fetchData(state, instance) {
        if (this.state.loading) {
            let { pageSize, page, filtered, sorted } = state;
            this.loadData(pageSize, page + 1, filtered, sorted);
        }
        this.setState({ loading: true })
    }
    async loadData(pagesize, page, keySearch, sortSearch) {
        let that = this;
        await RestfulUtils.post('/order/getlist', { pagesize, page, keySearch: [...keySearch, { id: 'SRTYPE', value: '~!~SP' }], sortSearch, OBJNAME: this.props.datapage.OBJNAME }).then((resData) => {
            if (resData.EC == 0)
                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pageSize: pagesize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord
                });
            else {

            }
        });

    }
    async reloadTable() {
        let that = this;
        let { keySearch, page, pageSize, sortSearch } = this.state
        await RestfulUtils.posttrans('/order/getlist', { pagesize: pageSize, page, keySearch: [...keySearch, { id: 'SRTYPE', value: '~!~SP' }], sortSearch, OBJNAME: this.props.datapage.OBJNAME }).then((resData) => {
            if (resData.EC == 0)
                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pageSize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord
                });
            else {

            }
        });
    }
    componentWillReceiveProps(nextProps) {
        // const { user } = this.props.auth
        // let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        // if (isCustom)
        //     if (nextProps.custodycd != this.props.custodycd)
        //         this.getOrderList(nextProps.custodycd.value)
    }
    componentDidMount() {
        const { user } = this.props.auth
        //let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        // if (!isCustom)
        //this.getOrderList('')
        var that = this;
        io.socket.on('loadNormalOrders', function (CUSTODYCD) {
            let { keySearch, page, pageSize, sortSearch } = that.state;
            that.loadData(pageSize, page, keySearch, sortSearch);
            // if (isCustom) {
            //     if (CUSTODYCD == user.USERID)
            //         that.loadData(pageSize, page, keySearch, sortSearch);
            // }
            // else {
            //     RestfulUtils.post('/account/isCareby', { CUSTODYCD: CUSTODYCD }).then((resData) => {
            //         if (resData.isCareby) {
            //             that.loadData(pageSize, page, keySearch, sortSearch);
            //         }
            //     });
            // }
            //that.getOrderList('')
        });
    }
    getOrderList = (CUSTODYCD) => {
        let self = this
        RestfulUtils.post('/order/getOrderList', { pagesize: this.state.pageSize, CUSTODYCD: CUSTODYCD, LANGUAGE: this.props.language, OBJNAME: this.props.datapage.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages })
            } else {

                toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });

            }
        });

    }

    render() {
        const { data, pages, loading, pageSize } = this.state;
        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        let that = this
        let closeModalDelete = () => this.setState({ showModalConfirm: false });
        return (

            <div className="panel-body">
                <div className="col-md-12 ">

                    <h5 className="highlight" style={{ fontWeight: "bold", fontSize: "13px", float: "right" }}> <span className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                        <span className="ReloadButton" onClick={this.reloadTable.bind(this)}><i className="fas fa-sync-alt"></i></span>
                    </h5>

                </div>
                <div className="col-md-12 forFireFox customize-react-table " >
                    <ReactTable
                        columns={[
                            {
                                Header: props => <div className=" header-react-table"></div>,
                                maxWidth: 50,
                                sortable: false,

                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>
                                        {/* {['1','3'].includes(row.original.STATUS)?<div> <span onClick={this.eventEdit.bind(this, row.original)} className="glyphicon glyphicon-pencil"></span>
                                        <span onClick={this.eventCancel.bind(this, row.original)} className="glyphicon glyphicon-remove" style={{color:"red",marginLeft:"5px"}}></span>
                                        </div>:null} */}
                                        <div>{row.original.ISAMEND == 'Y' ? <span id={"btnEdit" + row.index} onClick={this.eventEdit.bind(this, row.original)} className="glyphicon glyphicon-pencil"></span> : null}
                                            {row.original.ISCANCEL == 'Y' ? <span id={"btnCancel" + row.index} onClick={this.checkConfirm.bind(this, "delete", row.original)} className="glyphicon glyphicon-remove" style={{ color: "red", marginLeft: "5px" }}></span> : null}
                                        </div>
                                    </div>

                                ),

                                Filter: ({ filter, onChange }) =>
                                    null

                            },


                            {
                                Header: props => <div className="wordwrap">{this.props.strings.vfmcode}</div>,
                                id: "SYMBOL",
                                accessor: "SYMBOL",
                                width: 82
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.custodycd}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                show: !isCustom,
                                width: 106
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ordertype}</div>,
                                id: "EXECTYPE_DESC",
                                accessor: "EXECTYPE_DESC",
                                Cell: row => (
                                    <span style={{
                                        fontWeight: 'bold',
                                        // textTransform: 'uppercase', 
                                        color: row.original.SRTYPE == SRTYPE_SW ? COLORSW : (row.original.EXECTYPE == SRTYPE_NR ? COLORNR : COLORNS)
                                    }}>
                                        {

                                            row.value

                                        }
                                    </span>
                                ),
                                width: 140
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.amount}</div>,
                                accessor: "ORDERVALUE",
                                Cell: ({ value }) => (
                                    <span className="col-right">
                                        {

                                            <NumberInput value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={''} />

                                        }
                                    </span>
                                ),
                                width: 121

                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.matchqtty}</div>,
                                accessor: "MATCHQTTY",
                                Cell: ({ value }) => (
                                    <span className="col-right">
                                        {

                                            <NumberInput value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={''} />

                                        }
                                    </span>
                                ),
                                width: 110

                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.status}</div>,
                                id: getExtensionByLang("STATUS_DES", this.props.language),
                                accessor: getExtensionByLang("STATUS_DES", this.props.language),
                                width: 163
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.txdate}</div>,
                                id: "TXDATE",
                                accessor: "TXDATE",
                                width: 100,

                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.tradingdate}</div>,
                                id: "TRADINGDATE",
                                accessor: "TRADINGDATE",
                                width: 113,

                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.date}</div>,
                                id: "TXTIME",
                                accessor: "TXTIME",
                                width: 101,

                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.user}</div>,
                                id: "USERNAME",
                                accessor: "USERNAME",
                                width: 180,

                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.vfmcodesw}</div>,
                                id: "SWSYMBOL",
                                accessor: "SWSYMBOL",
                                width: 70
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.sessionno}</div>,
                                id: "SESSIONNO",
                                accessor: "SESSIONNO",
                                show: !isCustom,
                                width: 150
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.orderid}</div>,
                                id: "ORDERID",
                                accessor: "ORDERID",
                                width: 150
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.vsdorderid}</div>,
                                id: "VSDORDERID",
                                accessor: "VSDORDERID",
                                show: !isCustom,
                                width: 150
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.feedbackmsg}</div>,
                                id: "FEEDBACKMSG",
                                accessor: "FEEDBACKMSG",
                                show: !isCustom,
                                width: 250
                            },

                        ]}
                        getTheadTrProps={() => {
                            return {
                                className: 'head'
                            }
                        }}
                        manual
                        filterable
                        pages={pages} // Display the total number of pages
                        // loading={loading} // Display the loading overlay when we need it
                        onFetchData={this.fetchData}

                        data={data}

                        style={{
                            maxHeight: "300px" // This will force the table body to overflow and scroll, since there is not enough room
                        }}
                        pageText={getPageTextTable(this.props.language)}
                        rowsText={getRowTextTable(this.props.language)}
                        previousText={<i className="fas fa-backward"></i>}
                        nextText={<i className="fas fa-forward"></i>}
                        loadingText="Ðang t?i..."

                        ofText="/"
                        getTrProps={this.onRowClick.bind(this)}
                        defaultPageSize={pageSize}
                        className="-striped -highlight"
                    />
                    <Modalconfim show={this.state.showModalConfirm} onHide={closeModalDelete} access={this.access.bind(this)} />
                    <ModalDialog confirmPopup={this.confirmPopup.bind(this)} ACTION={this.state.ACTION} data={this.state.datarow} showModalDetail={this.state.showModalDetail} closeModalDetail={this.closeModalDetail.bind(this)} />
                </div>
            </div>

        )
    }
}

const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth
});
const decorators = flow([
    connect(stateToProps),
    translate('SoLenh')
]);
module.exports = decorators(SoLenh);
