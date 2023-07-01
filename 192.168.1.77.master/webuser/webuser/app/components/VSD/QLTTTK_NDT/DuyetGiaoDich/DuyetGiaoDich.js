import React, { Component } from 'react';
import { toast } from 'react-toastify';
import ReactTable from 'react-table';
import { Checkbox } from 'react-bootstrap';
import RestfulUtils from 'app/utils/RestfulUtils';
import ModalChiTietDuyetGiaoDich from './components/ModalChiTietDuyetGiaoDich';
import NumberFormat from 'react-number-format';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { DefaultPagesize, getExtensionByLang, getRowTextTable, getPageTextTable } from 'app/Helpers';

class DuyetGiaoDich extends Component {
    constructor(props) {
        super();
        this.state = {
            showModal: false,
            checkAll: false,
            selectedRows: new Set(),
            unSelectedRows: [],
            pages: null,
            pagesize: DefaultPagesize,
            page: 1,

            data: [],
            keySearch: {},
            sortSearch: {},
            sendPropsToShowDetail: {},
            data1: [],
            loaded: false,
            loading: true,
            sorted1: [],
            filtered1: [],
            dataapprove_reject: []

        }
        this.fetchData = this.fetchData.bind(this);
    }

    // refresh = () => {
    //     let self = this
    //     RestfulUtils.post('/transactions/get', { pagesize: this.state.pagesize, p_language: this.props.lang }).then((resData) => {
    //         if (resData.EC == 0) {
    //             //   console.log(resData.DT.data)
    //             self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages })
    //         } else {

    //             toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });

    //         }
    //     });
    // }
    componentDidMount() {
        const { user } = this.props.auth 

        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        var that = this;
        io.socket.on('loadTrans', function (TLID) {
            let { keySearch, page, pagesize, sortSearch } = that.state;
            if (!isCustom) {
                if (TLID == user.TLID || TLID == 'ALL')
                    that.loadData(pagesize, page, keySearch, sortSearch);
            }
            //console.log('loadOrders', msg)

        });

    }

    getSelected = (selectedRows, unSelectedRows) => {
        this.setState({
            selectedRows: selectedRows,
            unSelectedRows: unSelectedRows
        })
    }
    /**
     * Duyệt : Gửi data lên Transactions
     */
    approve = () => {
        // var { dispatch } = this.props;
        // var datanotify = {
        //     type: "",
        //     header: "Duyệt",
        //     content: ""
        // }
        let self = this;
        if (this.state.selectedRows.size > 0) {
            Promise.all(Array.from(this.state.selectedRows).map((value, idx) => {
                return new Promise((resolve, reject) => {
                    let data = this.state.data.filter(e => e.AUTOID === value);

                    let success = null;
                    delete data[0].TLID;
                    RestfulUtils.posttrans('/transactions/approvesysprocess', {...data[0],OBJNAME: "TRANSACTIONS", language: this.props.lang})
                        .then(res => {
                            if (res.EC == -788898) {
                                res.EM = this.props.lang == 'vie' ? 'Chưa đăng nhập hoặc không có quyền thực hiện chức năng này!' : res.EM 
                            } 
                            success = (res.EC == 0);
                            success ? toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                                : toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT });
                            resolve();
                            this.reloadData();
                        })
                
                })

            })).then((data) => {
                //self.loadData(self.state.pagesize, self.state.page, self.state.keySearch, self.state.sortSearch);
            })
            // this.state.selectedRows.forEach((key, value, set) => {
            //     let data = this.state.data.filter(e => e.AUTOID === value);
            //     console.log("data...", data);
            //     let success = null;
            //     axios.post('/fund/approvesysprocess', data[0])
            //         .then(res => success = res.data.EC)
            //         .then(() => {
            //             success ? toast.error("Duyệt giao dịch không thành công !", { position: toast.POSITION.BOTTOM_RIGHT })
            //                 : toast.success("Duyệt giao dịch thành công !", { position: toast.POSITION.BOTTOM_RIGHT });
            //         })
            // })
        } else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT });

    }
    /**
     * Từ chối: Gửi data lên Transactions
     */
    reject = () => {
        // var { dispatch } = this.props;
        // var datanotify = {
        //     type: "",
        //     header: "Duyệt",
        //     content: ""
        // }
        if (this.state.selectedRows.size > 0) {
            Promise.all(Array.from(this.state.selectedRows).map((value, idx) => {
                return new Promise((resolve, reject) => {
                    let data = this.state.data.filter(e => e.AUTOID === value);

                    let success = null;
                    delete data[0].TLID;
                    RestfulUtils.posttrans('/transactions/rejrectsysprocess', {...data[0],OBJNAME: "TRANSACTIONS", language: this.props.lang})
                        .then(res => {
                            if (res.EC == -788898) {
                                res.EM = this.props.lang == 'vie' ? 'Chưa đăng nhập hoặc không có quyền thực hiện chức năng này!' : res.EM 
                            }
                            success = (res.EC == 0);
                            success ? toast.success(this.props.strings.successreject, { position: toast.POSITION.BOTTOM_RIGHT })
                                : toast.error(this.props.strings.failreject + res.EM, { position: toast.POSITION.BOTTOM_RIGHT });
                            resolve();
                            this.reloadData();

                        })
                })

            })).then((data) => {
                //self.loadData(self.state.pagesize, self.state.page, self.state.keySearch, self.state.sortSearch);
            })
            // this.state.selectedRows.forEach((key, value, set) => {

            //     let data = this.state.data.filter(e => e.AUTOID === value);
            //     let success = null;

            //     axios.post('/fund/rejrectsysprocess', data[0])
            //         .then(res => success = res.data.EC)
            //         .then(() => {
            //             success ? toast.error("Từ chối giao dịch không thành công !", { position: toast.POSITION.BOTTOM_RIGHT })
            //                 : toast.success("Từ chối giao dịch thành công !", { position: toast.POSITION.BOTTOM_RIGHT });
            //         })
            // })
        } else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT });
    }


    fetchData(state, instance) {

        var that = this;

        if (this.state.loading) {
            let { pageSize, page, filtered, sorted } = state;
            this.loadData(pageSize, page + 1, filtered, sorted);
        }
        this.setState({ loading: true })
    }



    async loadData(pagesize, page, keySearch, sortSearch) {
        let that = this;
        
        RestfulUtils.post('/transactions/search', { pagesize, page, keySearch, sortSearch, OBJNAME: 'TRANSACTIONS' }).then(function (resData) {
            
            if (resData.EC == 0)

                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch
                });
            else {
            }
        });

    }
    async reloadData() {
        let that = this;
        let { pagesize, page, keySearch, sortSearch } = this.state;
        RestfulUtils.posttrans('/transactions/search', { pagesize, page, keySearch, sortSearch, OBJNAME: 'TRANSACTIONS' }).then(function (resData) {
            if (resData.EC == 0)

                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch
                });
            else {
            }
        });

    }
    handleChangeAll = (event) => {
        this.setState({ checkAll: event.target.checked })
        if (event.target.checked) {
            this.state.data.map((element) => {
                if (!this.state.selectedRows.has(element.AUTOID)) {
                    if (element.TXSTATUSCD == '4') {
                        this.state.unSelectedRows.push(element.AUTOID)
                        this.state.selectedRows.add(element.AUTOID)
                    }
                }
            })
            this.setState({ selectedRows: this.state.selectedRows, unSelectedRows: this.state.unSelectedRows })
        }
        else {
            this.state.unSelectedRows.map((element) => {
                this.state.selectedRows.delete(element)
            })
            this.setState({ selectedRows: this.state.selectedRows, unSelectedRows: [] })
        }
        // this.props.sendStateToParent(this.state.selectedRows, this.state.unSelectedRows)
    }
    handleChangeRow = (row) => {
        if (!this.state.selectedRows.has(row.original.AUTOID)) {
            if (row.original.TXSTATUSCD == '4') {
                this.state.selectedRows.add(row.original.AUTOID);
            }
        }

        else {
            this.state.selectedRows.delete(row.original.AUTOID);
        }
        this.setState({ selectedRows: this.state.selectedRows });
        // this.props.sendStateToParent(this.state.selectedRows, this.state.unSelectedRows)
    }

    // fetchData(state, instance) {
    //     let self = this
    //     RestfulUtils.post('/transactions/search', { pagesize: state.pageSize, page: state.page + 1, keySearch: state.filtered, sortSearch: state.sorted }).then((resData) => {
    //         console.log('resdata qldd',resData)
    //         if (resData.EC == 0) {
    //             self.setState({
    //                 data: resData.DT.data,
    //                 pages: resData.DT.numOfPages,
    //                 loading: false
    //             });
    //         } else {
    //             toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
    //         }
    //     });
    // }
    close = () => {
        this.setState({
            showModal: false
        })
    }
    showModal = () => {
        this.setState({
            showModal: true
        })
    }
    onRowClick = (state, rowInfo, column, instance) => {
        var that = this;

        return {
            onDoubleClick: () => {
                if (rowInfo.original != undefined) {
                    this.state.sendPropsToShowDetail["TXDATE"] = rowInfo.original["TXDATE"];
                    this.state.sendPropsToShowDetail["TXNUM"] = rowInfo.original["TXNUM"];
                    this.state.sendPropsToShowDetail["OBJTYPE"] = rowInfo.original["OBJTYPE"];
                    this.state.sendPropsToShowDetail["TXSTATUSCD"] = rowInfo.original["TXSTATUSCD"];
                    that.setState({ sendPropsToShowDetail: this.state.sendPropsToShowDetail, showModal: true })
                }

            },
            style: {
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.AUTOID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.AUTOID) ? 'black' : '',
            }
        }
    }
    render() {
        let that = this;
        let { data, pages, loading } = this.state;
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">
                <div className="title-content"><div>{this.props.strings.manartran}</div></div>
                <div className="panel-body ">
                    <div className="row" style={{ marginBottom: "10px", marginLeft: -13 }}>
                        <div style={{ marginLeft: "-15px" }} className="col-md-10 ">
                            <button style={{ marginRight: "5px" }} className="btn btn-primary" onClick={this.approve}><span className="glyphicon glyphicon-ok"></span> {this.props.strings.btnapprove}</button>
                            <button style={{ marginRight: "5px" }} className="btn btn-default" onClick={this.reject}><span className="glyphicon glyphicon-minus" onClick={this.reject}></span> {this.props.strings.btnreject}</button>
                        </div>
                        <div style={{ textAlign: "right", marginLeft: "1%" }} className="col-md-2">
                            <span className="ReloadButton" onClick={this.reloadData.bind(this)}><i className="fas fa-sync-alt"></i></span>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <ReactTable
                            columns={[
                                {
                                    Header: props => <div className=""><Checkbox checked={this.state.checkAll} onChange={this.handleChangeAll} /></div>,
                                    Cell: (row) => (
                                        <div>
                                            <Checkbox checked={this.state.selectedRows.has(row.original.AUTOID)} onChange={this.handleChangeRow.bind(this, row)} />
                                        </div>
                                    ),
                                    sortable: false,
                                    width: 40,
                                    Filter: ({ filter, onChange }) =>
                                        null
                                },

                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.status}</div>,
                                    id: getExtensionByLang("TXSTATUS", this.props.lang),
                                    accessor: getExtensionByLang("TXSTATUS", this.props.lang),
                                    Cell: (row) => (
                                        <span style={{ float: 'left', paddingLeft: '5px' }}>

                                            <span style={{
                                                color:
                                                    row.original.TXSTATUSCD == "1" ? 'rgb(0, 255, 247)' : row.original.TXSTATUSCD == "4" ? 'rgb(230, 207, 17)' : row.original.TXSTATUSCD == "5" ? 'rgb(230, 207, 17)'
                                                        : 'rgb(162, 42, 79)',
                                                transition: 'all .3s ease'
                                            }}>
                                                &#x25cf;
                                          </span> {row.value}
                                        </span>
                                    ),
                                },

                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.txdate}</div>,
                                    id: "TXDATE",
                                    accessor: "TXDATE",
                                    width: 80,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ paddingLeft: '5px', textAlign: 'center' }}>
                                                {value}
                                            </span>)
                                    }
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.txdatenum}</div>,
                                    id: "BUSDATE",
                                    accessor: "BUSDATE",
                                    width: 80,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ paddingLeft: '5px', textAlign: 'center' }}>
                                                {value}
                                            </span>)
                                    }
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.txnum}</div>,
                                    id: "TXNUM",
                                    accessor: "TXNUM",
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    }
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.majorname}</div>,
                                    id: getExtensionByLang("TLTXCD", this.props.lang),
                                    accessor: getExtensionByLang("TLTXCD", this.props.lang),
                                    width: 280,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    }
                                    // Filter: ({ filter, onChange }) =>

                                    //  <DropdownHeaderTable onChange={onChange} urlApi='/allcode/getall_status_orders' labelKey='CDCONTENT' valueKey='CDCONTENT' />
                                },

                                // {
                                //     Header: props => <div className=" ">Ngày chứng từ</div>,
                                //     id: "BRDATE",
                                //     accessor: "BRDATE",
                                //     Cell: ({ value }) => {
                                //         let date = moment({ value }).format('MM/DD/YYYY')
                                //         return (
                                //             <span>
                                //                 {date}
                                //             </span>)
                                //     }
                                // },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.custodycd}</div>,
                                    id: "IDAFACCTNO",
                                    accessor: "IDAFACCTNO",
                                    width: 120,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    }
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.account}</div>,
                                    id: "CFFULLNAME",
                                    accessor: "CFFULLNAME",
                                    width: 150,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    }
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.vfmcode}</div>,
                                    id: "CODEID",
                                    accessor: "CODEID",
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    }
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.amount}</div>,
                                    id: "AMT",
                                    accessor: "AMT",
                                    width: 150,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                <NumberFormat value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                            </span>)
                                    }

                                },

                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.maker}</div>,
                                    id: "TLNAME",
                                    accessor: "TLNAME",
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    }
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.checker}</div>,
                                    id: "OFFNAME",
                                    accessor: "OFFNAME",
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    }
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.timecreated}</div>,
                                    id: "TXTIME",
                                    accessor: "TXTIME",
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    }
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.timechecker}</div>,
                                    id: "OFFTIME",
                                    accessor: "OFFTIME",
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    }
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.desc}</div>,
                                    id: getExtensionByLang("TXDESC", this.props.lang),
                                    accessor: getExtensionByLang("TXDESC", this.props.lang),
                                    width: 300,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    }
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
                            onFetchData={this.fetchData.bind(this)}
                            data={data}
                            style={{
                                maxHeight: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                            }}
                            noDataText={this.props.strings.textNodata}
                            pageText={getPageTextTable(this.props.lang)}
                            rowsText={getRowTextTable(this.props.lang)}
                            previousText={<i className="fas fa-backward" id="previous"></i>}
                            nextText={<i className="fas fa-forward" id="next"></i>}
                            loadingText="Đang tải..."
                            ofText="/"
                            getTrGroupProps={(row) => {
                                return {
                                    id: "haha"
                                }
                            }}


                            getTrProps={this.onRowClick.bind(this)}
                            defaultPageSize={this.state.pagesize}
                            className="-striped -highlight"
                            onPageChange={(pageIndex) => that.setState({
                                selectedRows: new Set(),
                                checkedAll: false
                            })}

                        />
                    </div>

                </div>

                <ModalChiTietDuyetGiaoDich showModal={this.state.showModal} close={this.close} sendPropsToShowDetail={this.state.sendPropsToShowDetail} />
            </div>
        );
    }
}

const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language,
    auth: state.auth
});


const decorators = flow([
    connect(stateToProps),
    translate('DuyetGiaoDich')
]);

module.exports = decorators(DuyetGiaoDich);
