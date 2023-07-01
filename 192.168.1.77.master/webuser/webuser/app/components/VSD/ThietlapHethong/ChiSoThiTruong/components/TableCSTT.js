import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import moment from 'moment'
import { ButtonAdd, ButtonDelete, ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getRowTextTable, getPageTextTable } from 'app/Helpers'
import NumberInput from 'app/utils/input/NumberInput';
import { requestData } from 'app/utils/ReactTableUlti';

class TableCSTT extends Component {
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
            dataTest: [

            ],
            data1: [],
            loaded: false,

            sorted1: [],
            filtered1: [],
            tradingdate: '',
            firstRender: true
        }
        // this.fetchData = this.fetchData.bind(this);
    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.loadgrid) {
            this.state.firstRender = true
            this.refReactTable.fireFetchData()
        }
    }

    handleAdd(evt) {
        var that = this;
        that.props.showModalDetail("add");
    }
    handlEdit(DATA) {
        /*
        var TXDATE = moment(DATA.TXDATE, 'DD/MM/YYYY')
        var tradingdate = moment(this.state.tradingdate, 'DD/MM/YYYY')
        if (moment(TXDATE).isBefore(moment(tradingdate)) == false ){
            var that = this;
            that.props.showModalDetail("update", DATA);
        }
        */
        var that = this;
        that.props.showModalDetail("update", DATA);
    }
    handleChangeALL(evt) {

        var that = this;
        this.setState({
            checkedAll: evt.target.checked,
            selectedRows: new Set(),
            unSelectedRows: []
        });
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
            //that.state.unSelectedRows.map(function (item) {
            //  that.state.selectedRows.delete(item);
            // })
            that.setState({ selectedRows: new Set(), unSelectedRows: [] })
        }

    }

    handleChange(row) {

        if (!this.state.selectedRows.has(row.original.AUTOID)) {
            var TXDATE = moment(row.original.TXDATE, 'DD/MM/YYYY')
            var tradingdate = moment(this.state.tradingdate, 'DD/MM/YYYY')

            if (moment(TXDATE).isBefore(tradingdate) == false)
                this.state.selectedRows.add(row.original.AUTOID);
        }
        else {
            this.state.selectedRows.delete(row.original.AUTOID);
        }
        this.setState({ selectedRows: this.state.selectedRows, checkedAll: false });
    }
    onRowClick(state, rowInfo, column, instance) {
        var that = this;
        return {
            onDoubleClick: e => {
                // //console.log('A Td Element was clicked!')
                // //console.log('it produced this event:', e)
                // //console.log('It was in this column:', column)
                // //console.log('It was in this row:', rowInfo)
                // //console.log('It was in this table instance:', instance)
                that.props.showModalDetail("view", rowInfo.original)
            },
            style: {
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTID) ? 'black' : '',
            }
            // onClick: (e, handleOriginal) => {
            //     //console.log('A Td Element was clicked!')
            //     //console.log('it produced this event:', e)
            //     //console.log('It was in this column:', column)
            //     //console.log('It was in this row:', rowInfo)
            //     //console.log('It was in this table instance:', instance)

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

        let that = this
        if (this.state.firstRender) {
            RestfulUtils.post('/account/gettradingdate')
                .then((res1) => {
                    let data = {
                        p_autoid: '',
                        p_language: this.props.lang,
                        OBJNAME: this.props.OBJNAME
                    }
                    RestfulUtils.posttrans('/fund/getlistmarketinfo', { data }).then((resData) => {

                        // console.log('rs',resData.data.DT.data)
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
                                    sumRecord: resData.DT.data.length,
                                    colum: instance.props.columns,
                                    tradingdate: res1.DT.p_tradingdate,
                                });
                            });
                        }

                    })
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
                    // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                    this.setState(that.state);
            });
        }
    }


    delete = () => {

        let i = 0;
        if (this.state.selectedRows.size > 0) {
            this.state.selectedRows.forEach((key, value, set) => {

                new Promise((resolve, reject) => {

                    let data = this.state.data.filter(e => e.AUTOID === value);
                    let success = null;
                    let datadelete = {
                        data: data[0],
                        p_language: this.props.lang,
                        pv_objname: this.props.OBJNAME
                    }
                    resolve(RestfulUtils.posttrans('/fund/deletemarketinfo', datadelete)
                        .then(res => {
                            i += 1

                            success = (res.EC == 0);
                            success ? toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                                : toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                            if (this.state.selectedRows.size == i) {
                                this.state.firstRender = true
                                this.refReactTable.fireFetchData()

                            }
                        })
                    );

                })

            })
        } else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT })



    }

    checkDate(txdate) {
        var TXDATE = moment(txdate, 'DD/MM/YYYY')
        var tradingdate = moment(this.state.tradingdate, 'DD/MM/YYYY')

        if (moment(TXDATE).isBefore(tradingdate) == false) return ""
        return "none"
    }
    reloadTable() {
        this.state.firstRender = true
        this.refReactTable.fireFetchData()
    }
    render() {
        const { data, pages, pagesize } = this.state;
        var that = this;
        return (
            <div>
                <div className="row">

                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                        <ButtonAdd style={{ marginLeft: "5px" }} data={this.props.datapage} onClick={this.handleAdd.bind(this)} />
                        <ButtonDelete style={{ marginLeft: "5px" }} onClick={this.delete} data={this.props.datapage} />
                        <ButtonExport style={{ marginLeft: "5px" }} HaveChk={true} dataRows={this.state.dataALL} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />
                    </div>
                    <div style={{ textAlign: "right" }} className="col-md-2 RightInfo">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}>
                            <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                            <span className="ReloadButton" onClick={this.reloadTable.bind(this)}><i className="fas fa-sync-alt"></i></span>
                        </h5>
                    </div>
                </div>

                <div className="col-md-12" >
                    <ReactTable
                        columns={[
                            {
                                Header: props => <div className=" header-react-table">    <Checkbox checked={that.state.checkedAll} style={{ marginBottom: "14px" }} onChange={that.handleChangeALL.bind(that)} inline /></div>,
                                maxWidth: 70,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) =>
                                    (

                                        <div>
                                            <Checkbox style={{ textAlign: "center", marginLeft: "11px", marginTop: "-14px", display: that.checkDate(row.original.TXDATE) }}
                                                checked={that.state.selectedRows.has(row.original.AUTOID)}
                                                onChange={that.handleChange.bind(that, row)} inline
                                            />
                                            <span onClick={that.handlEdit.bind(that, row.original)} className="glyphicon glyphicon-pencil" id={"pencil" + row.index}></span>
                                        </div>
                                    ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblNGAYCAPNHAT">{this.props.strings.TXDATE}</div>,
                                id: "TXDATE",
                                accessor: "TXDATE",
                                width: 160,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblVNINDEX">{this.props.strings.VNINDEX}</div>,
                                id: "VNINDEX",
                                accessor: "VNINDEX",
                                width: 220,
                                Cell: ({ value }) => (
                                    <div className="col-right">
                                        <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                    </div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblHNXINDEX">{this.props.strings.HNXINDEX}</div>,
                                id: "HNXINDEX",
                                accessor: "HNXINDEX",
                                width: 230,
                                Cell: ({ value }) => (
                                    <div className="col-right">
                                        <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                    </div>)
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblVN30">{this.props.strings.VN30INDEX}</div>,
                                id: "VN30INDEX",
                                accessor: "VN30INDEX",
                                width: 230,
                                Cell: ({ value }) => (
                                    <div className="col-right">
                                        <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                    </div>)
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblHNX30">{this.props.strings.HNX30INDEX}</div>,
                                id: "HNX30INDEX",
                                accessor: "HNX30INDEX",
                                width: 230,
                                Cell: ({ value }) => (
                                    <div className="col-right">
                                        <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                    </div>)
                            },
                            /*
                                         {
                                             Header: props => <div className="" id="lblNGUOINHAP">{this.props.strings.maker}</div>,
                                             id: "TLNAME",
                                             accessor: "TLNAME",
                                             width: 180,
                                             Cell : ({value}) =>(
                                                 <div className="col-left" id={"lbl"+value}>{value}</div>
                                             )
                                         },
                                     
                                         {
                                             Header: props => <div className="" id="lblDESC">{this.props.strings.note}</div>,
                                             id: "IDDATE",
                                             accessor: "DESC",
                                             width: 350,
                                             Cell : ({value}) =>(
                                                 <div className="col-left" id={"lbl"+value}>{value}</div>
                                             )
             
                                         },
             
             */

                        ]}
                        getTheadTrProps={() => {
                            return {
                                className: 'head'
                            }
                        }}

                        manual
                        filterable

                        pages={pages} // Display the total number of pages
                        //   loading={loading} // Display the loading overlay when we need it
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
                        //  loadingText="Đang tải..."
                        ofText="/"
                        getTrGroupProps={(row) => {
                            return {
                                id: "haha"
                            }
                        }}


                        getTrProps={this.onRowClick.bind(this)}
                        defaultPageSize={pagesize}
                        className="-striped -highlight"
                        onPageChange={(pageIndex) => {
                            this.state.selectedRows = new Set(),
                                this.state.checkedAll = false
                        }
                        }
                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}

                    />
                </div>

            </div>
        );
    }
}

TableCSTT.defaultProps = {

    strings: {
        code_CTQLQ: 'Mã CTQLQ',
        name_CTQLQ: 'Tên CTQLQ',
        shortname: 'Tên viết tắt',
        job: 'Ngành nghề KD',
        capital: 'Vốn điều lệ',
        code_establishment: 'Giấy phép thành lập',
        date_establishment: 'Ngày cấp GPTL',
        place_establishment: 'Nơi cấp GPTL',
        code_license: 'Giấy phép hoạt động',
        date_license: 'Ngày cấp GPHĐ',
        place_license: 'Nơi cấp GPHĐ',
        code_business: 'Số ĐKKD',
        date_business: 'Ngày cấp ĐKKD',
        place_business: 'Nơi cấp ĐKKD',
        name_auth: 'Người được ủy quyền',
        name_legal: 'NGười đại diện pháp luật',
        fullname: 'Họ tên người liên lạc',
        mobile: 'Số điện thoại người liên lạc',
        address: 'Địa chỉ',
        phone: 'Số điện thoại',

    },


};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('TableCSTT')
]);

module.exports = decorators(TableCSTT);
