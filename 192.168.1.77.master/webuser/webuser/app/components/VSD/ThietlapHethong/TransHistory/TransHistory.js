import React, { Component } from 'react';
import ReactTable from 'react-table';
import NumberFormat from 'react-number-format';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import ModalChiTietDuyetGiaoDich from './components/ModalChiTietDuyetGiaoDich';
import DateInput from 'app/utils/input/DateInput';
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getRowTextTable, getPageTextTable, getExtensionByLang } from 'app/Helpers'
import { requestData } from 'app/utils/ReactTableUlti';

class TransHistory extends Component {
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
            loading: false,
            sorted1: [],
            filtered1: [],
            dataapprove_reject: [],
            datagroup: {
                txdate: ''
            },
            checkFields: [
                { name: "txdate", id: "txttxdate" },

            ],
            firstRender: true,
            next: false
        }
    }
    fetchData(state, instance) {

        let that = this
        if (this.state.firstRender) {
            let data = {
                p_txdate: this.state.datagroup["txdate"],
                p_searchfilter: '',
                p_language: this.props.lang,
                OBJNAME: this.props.datapage.OBJNAME
            }
            RestfulUtils.posttrans('/fund/getlisttranshistory', data).then((resData) => {
               
                // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                if (resData.EC == 0) {
                    requestData(
                        state.pageSize,
                        state.page,
                        state.sorted,
                        state.filtered,
                        resData.DT.data,
                    ).then(res => {
                        // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                        this.setState({
                            data: res.rows,
                            pages: res.pages,
                            // loading: false,
                            firstRender: false,
                             dataALL: resData.DT.data,
                            selectedRows: new Set(),
                            checkedAll: false,
                           // sumRecord: resData.DT.data.length,
                            colum: instance.props.columns,
                            next: false
                        });
                    });
                }

            })
        } else {
            requestData(
                state.pageSize,
                state.page,
                state.sorted,
                state.filtered,
                this.state.dataALL,
            ).then(res => {
                this.state.data = res.rows,
                    this.state.pages = res.pages,
                    this.state.colum = instance.props.columns
                // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                this.setState(that.state);
            });
        }
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
    onChangeDate(type, event) {

        if (this.state.datagroup[type] != event.value) {

            this.state.datagroup[type] = event.value;
            this.setState({ datagroup: this.state.datagroup, next: true })
        }

    }
    Search() {
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            // if (this.state.keySearch.length == 0 || (this.state.keySearch[0].value != this.state.datagroup["txdate"])) {
            if (this.state.next) {
                this.state.firstRender = true
                this.refReactTable.fireFetchData()
            }
            // }

        }

    }
    checkValid(name, id) {
        let value = this.state.datagroup[name];
        let mssgerr = '';
        switch (name) {


            case "txdate":
                if (value == '') {
                    mssgerr = this.props.strings.requiredtxdate;
                }
                break;

            default:
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
    render() {
        let that = this;
        let { data, pages, pagesize } = this.state;
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">
                <div className="title-content"><div>{this.props.strings.tittle}</div></div>
                <div className="panel-body ">
                    <div className="col-md-12 row">
                        <div className="add-info-account">
                            <div className="col-md-2">
                                <h5 className="highlight"><b>{this.props.strings.txdate}</b></h5>
                            </div>
                            <div className="col-md-3 fixWidthDatePickerForOthers">
                                <DateInput onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["txdate"]} type="txdate" id="txttxdate" />

                            </div>
                            <div className="col-md-7">
                                <button style={{ marginRight: "5px", fontSize: 10 }} className="btn btndangeralt" onClick={this.Search.bind(this)} id="btnSearch"><span className="glyphicon glyphicon-search"></span> {this.props.strings.search}</button>

                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">

                        <ReactTable
                            columns={[


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
                                /*
                                                                {
                                                                    Header: props => <div className=" ">{this.props.strings.txdate}</div>,
                                                                    id: "TXDATE",
                                                                    accessor: "TXDATE",
                                                                    width: 150,
                                                                    Cell: ({ value }) => {
                                                                        return (
                                                                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                                                                                {value}
                                                                            </span>)
                                                                    }
                                                                },
                                                                */
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.txdatenum}</div>,
                                    id: "BUSDATE",
                                    accessor: "BUSDATE",
                                    width: 80,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    }
                                },
                                {
                                    Header: props => <div className=" ">{this.props.strings.txnum}</div>,
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
                                    Header: props => <div className=" ">{this.props.strings.majorname}</div>,
                                    id: getExtensionByLang("TLTXCD", this.props.lang),
                                    accessor: getExtensionByLang("TLTXCD", this.props.lang),
                                    width: 310,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    }
                                    // Filter: ({ filter, onChange }) =>

                                    //  <DropdownHeaderTable onChange={onChange} urlApi='/allcode/getall_status_orders' labelKey='CDCONTENT' valueKey='CDCONTENT' />
                                },
                                {
                                    Header: props => <div className=" ">{this.props.strings.desc}</div>,
                                    id: getExtensionByLang("TXDESC", this.props.lang),
                                    accessor: getExtensionByLang("TXDESC", this.props.lang),
                                
                                    width: 330,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    }
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
                                    Header: props => <div className=" ">{this.props.strings.custodycd}</div>,
                                    id: "IDAFACCTNO",
                                    accessor: "IDAFACCTNO",
                                    width: 160,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    }
                                },
                                {
                                    Header: props => <div className=" ">{this.props.strings.account}</div>,
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
                                    Header: props => <div className=" ">{this.props.strings.vfmcode}</div>,
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
                                    Header: props => <div className=" ">{this.props.strings.amount}</div>,
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
                                    Header: props => <div className=" ">{this.props.strings.maker}</div>,
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
                                    Header: props => <div className=" ">{this.props.strings.checker}</div>,
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
                                    Header: props => <div className=" ">{this.props.strings.timecreated}</div>,
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
                                    Header: props => <div className=" ">{this.props.strings.timechecker}</div>,
                                    id: "OFFTIME",
                                    accessor: "OFFTIME",
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
                            //  loading={loading} // Display the loading overlay when we need it
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
                            defaultPageSize={pagesize}
                            className="-striped -highlight"
                            ref={(refReactTable) => { this.refReactTable = refReactTable; }}


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
    lang: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('TransHistory')
]);

module.exports = decorators(TransHistory);
