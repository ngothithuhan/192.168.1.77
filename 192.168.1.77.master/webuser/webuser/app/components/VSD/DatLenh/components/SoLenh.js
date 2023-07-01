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
import {
    SRTYPE_SW, SRTYPE_NR, COLORSW, COLORNR, COLORNS, DefaultPagesize,
    getExtensionByLang, getRowTextTable, getPageTextTable, EVENT, IMGMAXW, IMGMAXH, MAXSIZE_PDF
} from '../../../../Helpers';
import { emitter } from 'app/utils/emitter';
import ModalCreateUploadOriginalOrder from './ModalCreateUploadOriginalOrder'
const Compress = require('compress.js');

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
            SIGN_IMG: null,
            SIGN_IMG_DESC: "",
            showModalCreateUploadOriginalOrder: false,
            err_msg_upload: {},
            urlPreviewPDF: "",
        };
        this.fetchData = this.fetchData.bind(this);
        this.listenToTheEmitter();
    }


    listenToTheEmitter() {
        console.log(">>>> placeorder run listen emitter 000")
        emitter.on(EVENT.CANCEL_ORDER_IF_TIMEOUT_NORMAL, async (dataParent) => {
            console.log(">>>> placeorder run listen emitter 111 listen event data: orderid", dataParent.ORDERID)
            console.log(">>>> placeorder run listen emitter 222  data emit receive: data", dataParent)
            // await this.fetchData(this.state);
            console.log(">>>> placeorder run listen emitter 222-fetch newest data")

            if (dataParent && dataParent.ORDERID) {
                let { data } = this.state; //data của table sổ lệnh react (lưu memory)
                console.log(">>>> placeorder run listen emitter 333 data table sổ lệnh react: table", data);

                let row = data.find(item => item.ORDERID === dataParent.ORDERID);
                // let row = undefined;

                console.log(">>>> placeorder run listen emitter 444 data row need delete: row", row)

                if (row && row.ORDERID) {
                    console.log(">>>> placeorder run listen emitter 555 do cancel order normal, data row: ", row)
                    //hủy lệnh
                    this.props.eventDelete(row);
                } else {
                    console.log(">>>> placeorder run listen emitter 666 do cancel order build row, data row: ", row)

                    //trong trường hợp lệnh vừa đặt chưa đc load lên memory, cần build inputs để hủy lệnh
                    row = this.buildCurrentRow(dataParent);
                    console.log(">>>> placeorder run listen emitter 777 do cancel order build row, data row: ", row)

                    this.props.eventDelete(row);
                }
            }
        });
    }

    //trong trường hợp sổ lệnh chưa đc load lên memory, cần tạo 1 row data chuẩn với api hủy lệnh -> hủy lệnh
    buildCurrentRow = (dataParent) => {
        return {
            CUSTODYCD: dataParent.CUSTODYCD && dataParent.CUSTODYCD.value ? dataParent.CUSTODYCD.value : '',
            SRTYPE: dataParent.SRTYPE ? dataParent.SRTYPE : '',
            CODEID: dataParent.CODEID && dataParent.CODEID.value ? dataParent.CODEID.value : '',
            CODEID_OBJECT: dataParent.CODEID ? dataParent.CODEID : '',
            SEDTLID: dataParent.SEDTLID ? dataParent.SEDTLID : '',
            FEEID: dataParent.FEEID ? dataParent.FEEID : '',
            SWID: dataParent.SWID ? dataParent.SWID : '',
            SWCODEID: dataParent.SWCODEID ? dataParent.SWCODEID : '',
            ORDERID: dataParent.ORDERID ? dataParent.ORDERID : '',
            EXECTYPE: dataParent.SRTYPE ? dataParent.SRTYPE : '',
            ORDERVALUE: dataParent.AMOUNT && dataParent.AMOUNT.value ? dataParent.AMOUNT.value : ''
        }
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
    refresh() {
        this.setState({
            SIGN_IMG: null,
            SIGN_IMG_DESC: "",
            err_msg_upload: {},
            urlPreviewPDF: "",
        })
    }
    eventCancel(row) {
        this.props.eventDelete(row, this.state.SIGN_IMG, this.state.SIGN_IMG_DESC)
        this.refresh();
    }
    eventEdit(row) {
        this.props.eventEdit(row)
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
                // this.props.eventEdit(this.state.datarow)
                this.eventEdit(this.state.datarow)
        }
        else {
            this.setState({ showModalConfirm: false, ACTION: ACTION })
        }
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
        await RestfulUtils.post('/order/getlist', { pagesize, page, keySearch: [...keySearch, { id: 'SRTYPE', value: '~!~SP' }, { id: 'ISSIP', value: 'NN' }], sortSearch, OBJNAME: this.props.datapage.OBJNAME }).then((resData) => {
            if (resData.EC == 0)
                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pageSize: pagesize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord,
                });
            else {

            }
        });

    }
    async reloadTable() {
        let that = this;
        let { keySearch, page, pageSize, sortSearch } = this.state
        await RestfulUtils.posttrans('/order/getlist', { pagesize: pageSize, page, keySearch: [...keySearch, { id: 'SRTYPE', value: '~!~SP' }, { id: 'ISSIP', value: 'NN' }], sortSearch, OBJNAME: this.props.datapage.OBJNAME }).then((resData) => {
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

    openModalCreateUploadOriginalOrder = () => {
        this.setState({ showModalCreateUploadOriginalOrder: true })
    }
    closeModalCreateUploadOriginalOrder = () => {
        this.setState({ showModalCreateUploadOriginalOrder: false })
    }
    _handleSIGNIMGDESCChange = e => {
        this.setState({ SIGN_IMG_DESC: e.target.value })
    }
    _handleSIGNIMGChange = e => {
        e.preventDefault();
        let that = this;
        let reader = new FileReader();
        const compress = new Compress();
        const files = [...e.target.files];
        let file = e.target.files[0];
        let urlPreviewPDF = '';

        let isPDF = file.type === 'application/pdf' ? true : false;
        if (isPDF === true) {
            if (file.size > MAXSIZE_PDF) {
                let error = {
                    color: 'red',
                    contentText: this.props.strings.errorSizePDF
                }
                this.setState({ err_msg_upload: error, urlPreviewPDF: '', SIGN_IMG: null })
                return;
            } else {
                urlPreviewPDF = URL.createObjectURL(file)
            }
        }
        if (file.type !== 'image/jpeg'
            && file.type !== 'image/png'
            && file.type !== 'application/pdf') {
            console.log('this.props.strings.errorFileType:', this.props.strings.errorFileType)
            let error = {
                color: 'red',
                contentText: this.props.strings.errorFileType
            }
            this.setState({ err_msg_upload: error, urlPreviewPDF: '', SIGN_IMG: null })
        }
        else {
            let error = { color: 'red', contentText: '' }
            this.setState({ err_msg_upload: error, urlPreviewPDF: '', SIGN_IMG: null })

            //luồng xử lý preview ảnh 
            if (isPDF === false) {
                reader.onloadend = () => {
                    compress.compress(files, {
                        size: 0.2, // the max size in MB, defaults to 2MB
                        quality: 0.75, // the quality of the image, max is 1,
                        maxWidth: 1920, // the max width of the output image, defaults to 1920px
                        maxHeight: 1920, // the max height of the output image, defaults to 1920px
                        resize: true, // defaults to true, set false if you do not want to resize the image width and height
                    }).then((results) => {
                        const img1 = results[0]
                        const base64str = img1.data
                        const imgPrefix = img1.prefix
                        const dataBase64 = imgPrefix + base64str
                        var tempImg = new Image();
                        var MAX_WIDTH = IMGMAXW;
                        var MAX_HEIGHT = IMGMAXH;
                        var tempW = tempImg.width;
                        var tempH = tempImg.height;
                        if (tempW > tempH) {
                            if (tempW > MAX_WIDTH) {
                                tempH *= MAX_WIDTH / tempW;
                                tempW = MAX_WIDTH;
                            }
                        } else {
                            if (tempH > MAX_HEIGHT) {
                                tempW *= MAX_HEIGHT / tempH;
                                tempH = MAX_HEIGHT;
                            }
                        }
                        tempImg.src = dataBase64
                        tempImg.onload = function () {
                            var canvas = document.createElement("canvas");
                            canvas.width = tempW;
                            canvas.height = tempH;
                            var ctx = canvas.getContext("2d");
                            ctx.drawImage(this, 0, 0, tempW, tempH);
                            that.state.SIGN_IMG = dataBase64;
                            that.setState(that.state);
                        };
                    })
                };
                reader.readAsDataURL(file);
            } else {
                //luồng xử lý file preview pdf
                that.setState({
                    urlPreviewPDF: urlPreviewPDF,
                })
                reader.readAsDataURL(file);
                reader.onload = function () {
                    that.setState({
                        ...that.state,
                        SIGN_IMG: reader.result
                    })
                };
                reader.onerror = function (error) {
                    error = {
                        color: 'red',
                        contentText: 'Đã có lỗi xảy ra, vui lòng thử lại sau'
                    }
                    that.setState({
                        ...that.state,
                        urlPreviewPDF: '',
                        SIGN_IMG: null,
                        err_msg_upload: error
                    })
                };
            }
        }
    };

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
                <div className="col-md-12 forFireFox customize-react-table">
                    <ReactTable
                        columns={[
                            {
                                Header: props => <div className="wordwrap"></div>,
                                minWidth: 50,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    // <div>
                                    //     <div className="table-so-lenh-btn-container">
                                    //         {
                                    //             row.original.ISAMEND == 'Y' &&
                                    //             <span
                                    //                 id={"btnEdit" + row.index}
                                    //                 onClick={this.eventEdit.bind(this, row.original)}
                                    //                 className="table-so-lenh-btn-edit">
                                    //                 {this.props.strings.edit}
                                    //             </span>
                                    //         }
                                    //         {
                                    //             row.original.ISCANCEL == 'Y' &&
                                    //             <span
                                    //                 id={"btnCancel" + row.index}
                                    //                 onClick={this.checkConfirm.bind(this, "delete", row.original)}
                                    //                 className="table-so-lenh-btn-cancel"
                                    //             >{this.props.strings.cancel}</span>
                                    //         }

                                    //     </div>
                                    // </div>

                                    <div>
                                        <div>{(isCustom && row.original.ISAMENDCF == 'Y') || (!isCustom && row.original.ISAMEND == 'Y') ? <span id={"btnEdit" + row.index} onClick={this.checkConfirm.bind(this, "edit", row.original)} className="glyphicon glyphicon-pencil"></span> : null}
                                            {(isCustom && row.original.ISCANCELCF == 'Y') || (!isCustom && row.original.ISCANCEL == 'Y') ? <span id={"btnCancel" + row.index} onClick={this.checkConfirm.bind(this, "delete", row.original)} className="glyphicon glyphicon-remove" style={{ color: "red", marginLeft: "5px" }}></span> : null}
                                        </div>
                                    </div>


                                ),

                                Filter: ({ filter, onChange }) =>
                                    null

                            },

                            //Số hiệu TKGD
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.custodycd}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                // show: !isCustom,
                                minWidth: 100
                            },


                            {
                                Header: props => <div className="wordwrap">{this.props.strings.vfmcode}</div>,
                                id: "SYMBOL",
                                accessor: "SYMBOL",
                                minWidth: 82
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
                                minWidth: 140
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
                                minWidth: 121

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
                                minWidth: 110

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
                                minWidth: 100,

                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.tradingdate}</div>,
                                id: "TRADINGDATE",
                                accessor: "TRADINGDATE",
                                minWidth: 113,

                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.date}</div>,
                                id: "TXTIME",
                                accessor: "TXTIME",
                                minWidth: 101,

                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.user}</div>,
                                id: "USERNAME",
                                accessor: "USERNAME",
                                minWidth: 180,

                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.vfmcodesw}</div>,
                                id: "SWSYMBOL",
                                accessor: "SWSYMBOL",
                                minWidth: 150
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.sessionno}</div>,
                                id: "SESSIONNO",
                                accessor: "SESSIONNO",
                                show: !isCustom,
                                minWidth: 150
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.orderid}</div>,
                                id: "ORDERID",
                                accessor: "ORDERID",
                                minWidth: 150
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.vsdorderid}</div>,
                                id: "VSDORDERID",
                                accessor: "VSDORDERID",
                                show: !isCustom,
                                minWidth: 150
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.feedbackmsg}</div>,
                                id: "FEEDBACKMSG",
                                accessor: "FEEDBACKMSG",
                                show: !isCustom,
                                minWidth: 250
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ipMac}</div>,
                                id: "ipMac",
                                accessor: "ipMac",
                                minWidth: 100
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

                        // style={{
                        //     maxHeight: "500px" // This will force the table body to overflow and scroll, since there is not enough room
                        // }}
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

                    <ModalDialog
                        confirmPopup={this.confirmPopup.bind(this)}
                        ACTION={this.state.ACTION}
                        data={this.state.datarow}
                        showModalDetail={this.state.showModalDetail}
                        closeModalDetail={this.closeModalDetail.bind(this)}
                        SIGN_IMG={this.state.SIGN_IMG}
                        isCustom={isCustom}
                        openModalCreateUploadOriginalOrder={this.openModalCreateUploadOriginalOrder.bind(this)}
                    />

                    {/* Modal hiển thị ảnh/file Upload phiếu lệnh gốc */}
                    <ModalCreateUploadOriginalOrder
                        showModal={this.state.showModalCreateUploadOriginalOrder}
                        closeModal={this.closeModalCreateUploadOriginalOrder.bind(this)}
                        SIGN_IMG={this.state.SIGN_IMG}
                        SIGN_IMG_DESC={this.state.SIGN_IMG_DESC}
                        urlPreviewPDF={this.state.urlPreviewPDF}
                        err_msg_upload={this.state.err_msg_upload}
                        handleSIGNIMGChange={this._handleSIGNIMGChange}
                        onDescChange={this._handleSIGNIMGDESCChange}
                    />
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
