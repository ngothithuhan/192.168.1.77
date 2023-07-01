import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import { ButtonAdd, ButtonDelete, ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import { DefaultPagesize, getExtensionByLang,getRowTextTable,getPageTextTable } from 'app/Helpers'
import { requestData } from 'app/utils/ReactTableUlti';
import RestfulUtils from 'app/utils/RestfulUtils';

class TableQLToChucNH extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                // {
                //     id: "1", CUSTODYCD: "1353041132003CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // },
                // {
                //     id: "2", CUSTODYCD: "1353041132004CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // },
                // {
                //     id: "3", CUSTODYCD: "1353041132005CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // },
                // {
                //     id: "4", CUSTODYCD: "1353041132005CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // },
                // {
                //     id: "5", CUSTODYCD: "1353041132005CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // },
                // {
                //     id: "6", CUSTODYCD: "1353041132005CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // }

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
            firstRender: true,
            lang: this.props.lang,

        }
        // this.fetchData = this.fetchData.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.lang != nextProps.currentLanguage) {
            this.state.lang = nextProps.currentLanguage
            this.refReactTable.fireFetchData()
        }
        if (nextProps.loadgrid) {
            this.state.firstRender = true
            this.refReactTable.fireFetchData()
        }
    }
    handleAdd(evt) {
        var that = this;
        that.props.showModalDetail("add");
    }
    handlEdit(data) {

        var that = this;
        that.props.showModalDetail("update", data);
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

        if (!this.state.selectedRows.has(row.original.AUTOID))
            this.state.selectedRows.add(row.original.AUTOID);
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
            let data = {
                p_language: this.props.lang,
                objname:this.props.OBJNAME
            }
            RestfulUtils.posttrans('/fund/getlistmember', { data }).then((resData) => {

                // console.log('rs',resData.DT.data)
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
                            colum: instance.props.columns
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
    delete = () => {

        let i = 0;
        //console.log(this.state.selectedRows.size)
        if (this.state.selectedRows.size > 0) {
            this.state.selectedRows.forEach((key, value, set) => {

                new Promise((resolve, reject) => {

                    let data = this.state.data.filter(e => e.AUTOID === value);
                    let success = null;

                    //console.log('value ', value)
                    //console.log('data ', data)
                    let datadelete = {
                        data: data[0],
                        p_language: this.props.lang,
                        pv_objname: this.props.OBJNAME
                    }
                    resolve(RestfulUtils.posttrans('/fund/deletemember', datadelete)
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
    reloadTable() {
        this.state.firstRender = true
        this.refReactTable.fireFetchData()
    }
    render() {
        const { data, pages,pagesize } = this.state;
        var that = this;
        return (
            <div>
                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                        <ButtonAdd style={{ marginLeft: "5px" }} data={this.props.datapage} onClick={this.handleAdd.bind(this)} />
                        {/* <ButtonApprove style={{marginLeft:"5px"}} onClick={this.approve} data={this.props.datapage} />*/}
                        {/*  <ButtonReject onClick={this.reject} style={{marginLeft:"5px"}} data={this.props.datapage} />*/}
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
                                maxWidth: 50,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>
                                        <Checkbox style={{ textAlign: "center", marginLeft: "10px", marginTop: "-14px" }}
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
                                Header: props => <div className="wordwrap" id="lblSHORTNAME">{this.props.strings.SHORTNAME}</div>,
                                id: "SHORTNAME",
                                accessor: "SHORTNAME",
                                width: 92,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblMBNAME">{this.props.strings.MBNAME}</div>,
                                id: "MBNAME",
                                accessor: "MBNAME",
                                width: 272,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblMBNAME_EN">{this.props.strings.MBNAME_EN}</div>,
                                id: "MBNAME_EN",
                                accessor: "MBNAME_EN",
                                width: 290,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblGRPTYPE">{this.props.strings[getExtensionByLang("GRPTYPEDESC",this.props.lang)]}</div>,
                              //  id: "GRPTYPEDESC",
                               // accessor: "GRPTYPEDESC",
                                id: getExtensionByLang("GRPTYPEDESC",this.props.lang),
                                accessor: getExtensionByLang("GRPTYPEDESC",this.props.lang),
                                width: 95,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblMBTYPE">{this.props.strings[getExtensionByLang("MBTYPE_TEXT",this.props.lang)]}</div>,
                              //  id: "MBTYPE_TEXT",
                              //  accessor: "MBTYPE_TEXT",
                                id: getExtensionByLang("MBTYPE_TEXT",this.props.lang),
                                accessor: getExtensionByLang("MBTYPE_TEXT",this.props.lang),
                                width: 65,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblADDRESS">{this.props.strings.ADDRESS}</div>,
                                id: "ADDRESS",
                                accessor: "ADDRESS",
                                width: 250,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap" id="lblLEGALPERSON">{this.props.strings.LEGALPERSON}</div>,
                                id: "LEGALPERSON",
                                accessor: "LEGALPERSON",
                                width: 160,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="" id="lblChecker">{this.props.strings.NOTE}</div>,
                                id: "NOTE",
                                accessor: "NOTE",
                                width: 78,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblPHONE">{this.props.strings.PHONE}</div>,
                                id: "PHONE",
                                accessor: "PHONE",
                                width: 95,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblEMAIL">{this.props.strings.EMAIL}</div>,
                                id: "EMAIL",
                                accessor: "EMAIL",
                                width: 175,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },

                        ]}
                        getTheadTrProps={() => {
                            return {
                                className: 'head'
                            }
                        }}
                        // getTrProps={(state, rowInfo, column, instance) => {
                        //     //console.log('rowInfo',rowInfo)
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
                        pageText={getPageTextTable(this.props.lang)}
                        rowsText={getRowTextTable(this.props.lang)}
                        previousText={<i className="fas fa-backward" id="previous"></i>}
                        nextText={<i className="fas fa-forward" id="next"></i>}
                        //   loadingText="Đang tải..."
                        ofText="/"
                        getTrGroupProps={(row) => {
                            return {
                                id: "haha"
                            }
                        }}

                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                        getTrProps={this.onRowClick.bind(this)}
                        defaultPageSize={pagesize}
                        className="-striped -highlight"
                        // onPageChange={(pageIndex) => {
                        //     this.state.selectedRows = new Set(),
                        //         this.state.checkedAll = false
                        // }
                        // }
                    />
                </div>

            </div>
        );
    }
}

TableQLToChucNH.defaultProps = {

    strings: {
        tkgd: 'Số TKGD',
        fullname: 'Họ tên',
        ĐKSH: 'Số ĐKSH',
        ccq: 'CCQ giao dịch',
        TTBT: 'Chờ TTBT',
        quyen: 'Quyền chờ về',
        desc: 'Diễn giải',
        pageText: 'Trang',


        rowsText: 'bản ghi',
        textNodata: 'Không có kết quả',
        vsdstatus: 'Trạng thái VSD',

    },


};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('TableQLToChucNH')
]);

module.exports = decorators(TableQLToChucNH);
