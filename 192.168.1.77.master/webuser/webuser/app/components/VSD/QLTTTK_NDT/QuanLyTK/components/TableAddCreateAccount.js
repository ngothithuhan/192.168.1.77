import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
//import moment from 'moment'
import { ButtonAdd, ButtonDelete, ButtonExport } from '../../../../../utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import {
    DefaultPagesize, getExtensionByLang, getRowTextTable, getPageTextTable, ACTIONS_ACC,
    DISABLE_EDIT_ACCOUNT, DISABLE_CUSTODYCD_STARTWITH

} from '../../../../../Helpers';


class TableAddCreateAccount extends Component {
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
    componentWillReceiveProps(nextProps) {
        if (this.state.lang != nextProps.currentLanguage) {
            this.state.lang = nextProps.currentLanguage
            this.state.loading = true
            this.refReactTable.fireFetchData()
        }
    }
    componentDidMount() {

        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        var that = this;
        io.socket.on('loadAccounts', function (CUSTODYCD) {
            let { keySearch, page, pagesize, sortSearch } = that.state;
            that.loadData(pagesize, page, keySearch, sortSearch);
            // if (!isCustom) {
            //     RestfulUtils.post('/account/isCareby', { CUSTODYCD: CUSTODYCD }).then((resData) => {
            //         if (resData.isCareby) {
            //             that.loadData(pagesize, page, keySearch, sortSearch);
            //         }
            //     });
            // }
        });
    }
    handleAdd(evt) {
        var that = this;
        that.props.showModalDetail(ACTIONS_ACC.CREATE);
    }
    handlEdit(CUSTID, row) {
        var that = this;
        that.props.showModalDetail(ACTIONS_ACC.EDIT, CUSTID, row);
    }
    handleChangeALL(evt) {
        var that = this;
        this.setState({ checkedAll: evt.target.checked });
        if (evt.target.checked) {
            that.state.data.map(function (item) {
                if (!that.state.selectedRows.has(item.CUSTID)) {
                    that.state.unSelectedRows.push(item.CUSTID);
                    that.state.selectedRows.add(item.CUSTID);
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
        if (!this.state.selectedRows.has(row.original.CUSTID))
            this.state.selectedRows.add(row.original.CUSTID);
        else {
            this.state.selectedRows.delete(row.original.CUSTID);
        }
        this.setState({ selectedRows: this.state.selectedRows });
        //console.log('handelchange this.state.selectedRows  ???? ', this.state.selectedRows)

    }
    onRowClick(state, rowInfo, column, instance) {
        var that = this;
        return {
            onDoubleClick: e => {
                // console.log('A Td Element was clicked!')
                // console.log('it produced this event:', e)
                // console.log('It was in this column:', column)
                // console.log('It was in this row:', rowInfo)
                // console.log('It was in this table instance:', instance)
                that.props.showModalDetail(ACTIONS_ACC.VIEW, '', rowInfo)
            },
            style: {
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTID) ? 'black' : '',
            }
            // onClick: (e, handleOriginal) => {
            //     console.log('A Td Element was clicked!')
            //     console.log('it produced this event:', e)
            //     console.log('It was in this column:', column)
            //     console.log('It was in this row:', rowInfo)
            //     console.log('It was in this table instance:', instance)

            //     // IMPORTANT! React-Table uses onClick internally to trigger
            //     // events like expanding SubComponents and pivots.
            //     // By default a custom 'onClick' handler will override this functionality.
            //     // If you want to fire the original onClick handler, call the
            //     // 'handleOriginal' function.
            //     if (handleOriginal) {
            //       handleOriginal()
            //     }
            //   }
        }
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
    // refresh = () => {
    //     let self = this

    //     RestfulUtils.post('/account/refresh', { pagesize: this.state.pagesize, language: this.props.language }).then((resData) => {
    //         if (resData.EC == 0) {
    //             //console.log('sync success', resData)


    //             self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages })
    //         } else {

    //             toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });

    //         }
    //     });

    // }
    async loadData(pagesize, page, keySearch, sortSearch, columns) {
        let that = this;
        await RestfulUtils.post('/account/getlist', { pagesize, page, keySearch, sortSearch, OBJNAME: this.props.OBJNAME }).then((resData) => {


            //console.log('datatable',resData.DT.data[0])
            // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
            if (resData.EC == 0) {
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
            }
            else {

            }


        });

    }
    async loadDataTable() {
        let that = this;
        await RestfulUtils.posttrans('/account/getlist', { pagesize: this.state.pagesize, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
            //console.log('datatable',resData)
            // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
            if (resData.EC == 0) {
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
            }

        });

    }

    // approve = () => {
    //     var { dispatch } = this.props;
    //     var datanotify = {
    //         type: "",
    //         header: "Duy?t",
    //         content: ""
    //     }
    //     this.state.selectedRows.forEach((key, value, set) => {
    //         new Promise((resolve, reject) => {
    //             let data = this.state.data.filter(e => e.CUSTID === value);
    //             let success = null;
    //             resolve(RestfulUtils.post('/account/approve', data[0])
    //                 .then(res => {
    //                     success = (res.data.EC == 0);
    //                     success ? toast.success("Duy?t tài kho?n " + value + " thành công !", { position: toast.POSITION.BOTTOM_RIGHT })
    //                         : toast.error("Duy?t tài kho?n " + value + " không thành công!. " + res.data.EM, { position: toast.POSITION.BOTTOM_RIGHT })
    //                     return res.data
    //                 })
    //             );
    //         })
    //     })

    // }
    // reject = () => {
    //     var { dispatch } = this.props;
    //     var datanotify = {
    //         type: "",
    //         header: "T? ch?i",
    //         content: ""
    //     }
    //     this.state.selectedRows.forEach((key, value, set) => {
    //         new Promise((resolve, reject) => {
    //             let data = this.state.data.filter(e => e.CUSTID === value);
    //             let success = null;
    //             resolve(RestfulUtils.post('/account/reject', data[0])
    //                 .then(res => {
    //                     success = (res.data.EC == 0);
    //                     success ? toast.success("T? ch?i tài kho?n " + value + " thành công !", { position: toast.POSITION.BOTTOM_RIGHT })
    //                         : toast.error("T? ch?i tài kho?n " + value + " không thành công !. " + res.data.EM, { position: toast.POSITION.BOTTOM_RIGHT })
    //                     return res.data
    //                 })
    //             );
    //         })
    //     })
    // }
    delete = () => {
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""
        }
        if (this.state.selectedRows.size == 0) {
            datanotify.type = "error";
            datanotify.content = this.props.strings.choosetodelete;
            dispatch(showNotifi(datanotify));
        }
        else
            this.state.selectedRows.forEach((key, value, set) => {
                new Promise((resolve, reject) => {
                    let data = this.state.data.filter(e => e.CUSTID === value);
                    let success = null;
                    let v_objname = this.props.OBJNAME;
                    resolve(RestfulUtils.post('/account/cancelgeneralinfo', { ...data[0], language: this.props.language, OBJNAME: v_objname })
                        .then(res => {
                            // if (res.data.EC == 0) {
                            //     datanotify.type = "success";
                            //     datanotify.content = this.props.strings.deleteacc + " " + data[0].CUSTODYCD + " " + this.props.strings.success;
                            //     dispatch(showNotifi(datanotify));
                            // }
                            // else {
                            //     datanotify.type = "error";
                            //     datanotify.content = this.props.strings.deleteacc+" " + data[0].CUSTODYCD + " "+this.props.strings.unsuccess+": " + res.data.EM;
                            //     dispatch(showNotifi(datanotify));
                            // }
                            success = (res.EC == 0);
                            success ? toast.success(this.props.strings.deleteacc + " " + data[0].CUSTODYCD + " " + this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                                : toast.error(this.props.strings.deleteacc + " " + data[0].CUSTODYCD + " " + this.props.strings.unsuccess + ": " + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                            return res
                        })
                    );
                })
            })
    }
    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }

    handleCloneAccount = (row) => {
        this.props.showModalDetail(ACTIONS_ACC.CLONE, '', row)
    }

    //disable sửa tài khoản đầu 003...
    isDisableRowEdit = (row) => {
        let isDisable = false;
        if (DISABLE_EDIT_ACCOUNT && row) {
            for (let i = 0; i < DISABLE_CUSTODYCD_STARTWITH.length; i++) {
                if (row.CUSTODYCD.startsWith(DISABLE_CUSTODYCD_STARTWITH[i])) {
                    isDisable = true;
                    break;
                }
            }
        }
        return isDisable;
    }

    render() {
        const { data, pages, loading } = this.state;
        var that = this;

        return (
            <div>
                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10">

                        <ButtonAdd data={this.props.datapage} onClick={this.handleAdd.bind(this)} />

                        <ButtonDelete style={{ marginLeft: "5px" }} onClick={this.delete} data={this.props.datapage} />
                        {/* <ButtonExport style={{ marginLeft: "5px" }} HaveChk={true} dataRows={this.state.dataAll} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} /> */}

                    </div>
                    <div style={{ textAlign: "right" }} className="col-md-2 RightInfo">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}> <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                            <span className="ReloadButton" onClick={this.loadDataTable.bind(this)}><i className="fas fa-sync-alt"></i></span>
                        </h5>
                    </div>

                </div>

                <div className="col-md-12" >
                    <ReactTable
                        columns={[
                            {
                                Header: props => <div className=" header-react-table">    <Checkbox checked={that.state.checkedAll} style={{ marginBottom: "14px" }} onChange={that.handleChangeALL.bind(that)} inline /></div>,
                                maxWidth: 60,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => {
                                    let isDisableEdit = this.isDisableRowEdit(row.original)
                                    return (
                                        <div style={{ paddingLeft: '12px' }}>
                                            <Checkbox style={{ textAlign: "center", marginLeft: "-8px", marginTop: "-14px" }}
                                                checked={that.state.selectedRows.has(row.original.CUSTID)}
                                                onChange={that.handleChange.bind(that, row)} inline
                                            />
                                            {isDisableEdit === true ?
                                                <span title="Xem thông tin" onClick={that.handlEdit.bind(that, row.original, row)} className="glyphicon glyphicon-eye-open"></span>
                                                :
                                                <span title="Sửa tài khoản" onClick={that.handlEdit.bind(that, row.original, row)} className="glyphicon glyphicon-pencil"></span>
                                            }
                                            {/* <span title="Mở tài khoản theo thông tin có sẵn trong hệ thống" onClick={() => this.handleCloneAccount(row)} className=" glyphicon glyphicon-upload" style={{ margin: '5px' }}></span> */}
                                        </div>
                                    )
                                },
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            // {
                            //     Header: props => <div className="">{this.props.strings.custid}</div>,
                            //     id: "CUSTID",
                            //     accessor: "CUSTID",
                            //     width: 110,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left" style={{ float: "left" }}>{value}</div>
                            //     )
                            // },
                            {
                                Header: props => <div className="">{this.props.strings.CUSTODYCD}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                width: 105,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.FULLNAME}</div>,
                                id: "FULLNAME",
                                accessor: "FULLNAME",
                                width: 220,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.DBCODE}</div>,
                                id: "DBCODE",
                                accessor: "DBCODE",
                                width: 120,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.IDCODE}</div>,
                                id: "IDCODE",
                                accessor: "IDCODE",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.IDPLACE}</div>,
                                id: "IDPLACE",
                                accessor: "IDPLACE",
                                width: 130,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.IDDATE}</div>,
                                id: "IDDATE",
                                accessor: "IDDATE",
                                width: 80,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )

                            },
                            {
                                Header: props => <div className="">{this.props.strings.ADDRESS}</div>,
                                id: "ADDRESS",
                                accessor: "ADDRESS",
                                width: 368,
                                Cell: ({ value }) => (
                                    <div className="col-left" >{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.MOBILE}</div>,
                                id: "MOBILE",
                                accessor: "MOBILE",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" >{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.EMAIL}</div>,
                                id: "EMAIL",
                                accessor: "EMAIL",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" >{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.BANKACC}</div>,
                                id: "BANKACC",
                                accessor: "BANKACC",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" >{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.MBNAME}</div>,
                                id: "MBNAME",
                                accessor: "MBNAME",
                                width: 370,
                                Cell: ({ value }) => (
                                    <div className="col-left" >{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.CITYBANK}</div>,
                                id: "CITYBANK",
                                accessor: "CITYBANK",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" >{value}</div>
                                )
                            },
                            // {
                            //     Header: props => <div className="">{this.props.strings.custtype}</div>,
                            //     id: 'CUSTTYPE_DESC',
                            //     Cell: (row) => (
                            //         <span style={{ float: 'left', paddingLeft: '5px' }}>

                            //              {row.original.CUSTTYPE_DESC}
                            //         </span>
                            //     ),
                            // width: 120,
                            // Filter: ({ filter, onChange }) => <ComboDataBind dataurl='/allcode/getlist'
                            //     datafilter={{ CDTYPE: 'CF', CDNAME: 'CUSTTYPE' }} onChange={onChange} filter={filter} />
                            //},
                            // {
                            //     Header: props => <div className="">{this.props.strings.custtype}</div>,
                            //     accessor: "CUSTTYPE_DESC",
                            //     width: 120,
                            //     Cell: ({ value }) => (
                            //         <span className="col-left">
                            //             {value}
                            //         </span>
                            //     ),
                            // },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("CLASSCD_DESC", this.props.language)]}</div>,
                                id: getExtensionByLang("CLASSCD_DESC", this.props.language),
                                accessor: getExtensionByLang("CLASSCD_DESC", this.props.language),
                                width: 99,
                                Cell: ({ value }) => (
                                    <span className="col-left">
                                        {value}
                                    </span>
                                ),
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("CLASSSIPCD_DESC", this.props.language)]}</div>,
                                id: getExtensionByLang("CLASSSIPCD_DESC", this.props.language),
                                accessor: getExtensionByLang("CLASSSIPCD_DESC", this.props.language),
                                width: 100,
                                Cell: ({ value }) => (
                                    <span className="col-left">
                                        {value}
                                    </span>
                                ),
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("ACCTGRP_DESC", this.props.language)]}</div>,
                                id: getExtensionByLang("ACCTGRP_DESC", this.props.language),
                                accessor: getExtensionByLang("ACCTGRP_DESC", this.props.language),
                                width: 68,
                                Cell: ({ value }) => (
                                    <span className="col-left">
                                        {value}
                                    </span>
                                ),
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.CAREBY_DESC}</div>,
                                id: "CAREBY_DESC",
                                accessor: "CAREBY_DESC",
                                width: 95,
                                Cell: ({ value }) => (
                                    <span className="col-left">
                                        {value}
                                    </span>
                                ),
                            },
                            {
                                Header: props => <div className="">{this.props.strings.OPNDATE}</div>,
                                id: "OPNDATE",
                                accessor: "OPNDATE",
                                width: 95,
                                Cell: ({ value }) => (
                                    <span className="col-left">
                                        {value}
                                    </span>
                                ),
                            },
                            {
                                Header: props => <div className="">{this.props.strings[getExtensionByLang("CFSTATUS_DESC", this.props.language)]}</div>,
                                id: getExtensionByLang("CFSTATUS_DESC", this.props.language),
                                accessor: getExtensionByLang("CFSTATUS_DESC", this.props.language),
                                Cell: (row) => (
                                    <span className="col-left">

                                        <span style={{

                                            color:
                                                row.original.STATUS == "A" ? 'rgb(0, 255, 247)' : row.original.STATUS == "P" ? 'rgb(230, 207, 17)' : row.original.STATUS == "R" ? 'rgb(230, 207, 17)'
                                                    : 'rgb(162, 42, 79)',
                                            transition: 'all .3s ease'
                                        }}>
                                            &#x25cf;
                                        </span> {
                                            row.value
                                        }
                                    </span>
                                ),
                                width: 120

                            },

                            {
                                Header: props => <div className="">{this.props.strings[getExtensionByLang("VSDSTATUS_DESC", this.props.language)]}</div>,
                                id: getExtensionByLang("VSDSTATUS_DESC", this.props.language),
                                accessor: getExtensionByLang("VSDSTATUS_DESC", this.props.language),
                                Cell: (row) => (
                                    <span className="col-left">

                                        <span style={{

                                            color:
                                                row.original.VSDSTATUS == "A" ? 'rgb(0, 255, 247)' : row.original.VSDSTATUS == "P" ? 'rgb(230, 207, 17)' : row.original.VSDSTATUS == "R" ? 'rgb(230, 207, 17)'
                                                    : 'rgb(162, 42, 79)',
                                            transition: 'all .3s ease'
                                        }}>
                                            &#x25cf;
                                        </span> {
                                            row.value
                                        }
                                    </span>
                                ),
                                width: 164

                            },
                            {
                                Header: props => <div className="">{this.props.strings.MAKER}</div>,
                                id: "MAKER",
                                accessor: "MAKER",
                                width: 91,
                                Cell: ({ value }) => (
                                    <span className="col-left">
                                        {value}
                                    </span>
                                ),
                            },
                            {
                                Header: props => <div className="">{this.props.strings.STATUSFILE}</div>,
                                id: "STATUSFILE",
                                accessor: "STATUSFILE",
                                width: 150,
                                Cell: ({ value }) => (
                                    <span className="col-left">
                                        {value}
                                    </span>
                                ),
                            },
                            {
                                Header: props => <div className="">{this.props.strings[getExtensionByLang("ISCFLEAD_DESC", this.props.language)]}</div>,
                                id: getExtensionByLang("ISCFLEAD_DESC", this.props.language),
                                accessor: getExtensionByLang("ISCFLEAD_DESC", this.props.language),
                                width: 112,
                                Cell: ({ value }) => (
                                    <span className="col-left">
                                        {value}
                                    </span>
                                ),
                            },
                            {
                                Header: props => <div className="">{this.props.strings.NOTE}</div>,
                                id: "NOTE",
                                accessor: "NOTE",
                                width: 200,
                                Cell: ({ value }) => (
                                    <span className="col-left">
                                        {value}
                                    </span>
                                ),
                            },
                            {
                                Header: props => <div className="">{this.props.strings.ISAGREESHARE}</div>,
                                id: "ISAGREESHARE",
                                accessor: "ISAGREESHARE",
                                width: 200,
                                Cell: ({ value }) => (
                                    <span className="col-left">
                                        {value == 'N' ? 'Không' : 'Có'}
                                    </span>
                                ),
                            },

                        ]}
                        getTheadTrProps={() => {
                            return {
                                className: 'head'
                            }
                        }}
                        // getTrProps={(state, rowInfo, column, instance) => {
                        //     console.log('rowInfo',rowInfo)
                        //     return {
                        //         onClick: (e, t) => {
                        //             t.srcElement.classList.add('active')
                        //         },
                        //         style: {
                        //             background: rowInfo.row.selected ? 'green' : 'red',
                        //             color:'green'
                        //         }
                        //     }
                        // }}
                        manual
                        filterable
                        pages={pages} // Display the total number of pages
                        // loading={loading} // Display the loading overlay when we need it
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
                        loadingText="Ðang tải..."
                        ofText="/"
                        getTrProps={this.onRowClick.bind(this)}
                        defaultPageSize={this.state.pagesize}
                        className="-striped -highlight"
                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}

                    />
                </div>
            </div >
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
    translate('TableAddCreateAccount')
]);

module.exports = decorators(TableAddCreateAccount);
