import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { DefaultPagesize, getRowTextTable, getPageTextTable } from 'app/Helpers'
import RestfulUtils from 'app/utils/RestfulUtils';
import { requestData } from 'app/utils/ReactTableUlti';
import NumberFormat from 'react-number-format';
import { Checkbox } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import { showNotifi } from 'app/action/actionNotification.js';
class TableDien extends Component {
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
            CUSTODYCD: { label: '', value: '' },
            datagroup: {
                custodycd: ''
            },
            isSearch: false,
            checkFields: [
                { name: "custodycd", id: "cbCUSTODYCD" },
            ],
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
    handlEdit(data) {
        var that = this;
        that.props.showModalDetail("update", data);
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
                that.props.showModalDetail("view", rowInfo.original)
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

        let that = this
        if (this.state.firstRender) {
            let data = {
                p_custodycd: this.state.datagroup["custodycd"] == '' ? 'nodata' : this.state.datagroup["custodycd"],
                p_language: this.props.lang,
                objname: this.props.OBJNAME
            }
            RestfulUtils.posttrans('/fund/get_all_stpstatus', { data }).then((resData) => {

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
                            dataAll: resData.DT.data,
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
                this.state.dataAll,
            ).then(res => {
                this.state.data = res.rows,
                    this.state.pages = res.pages,
                    // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                    this.setState(that.state);
            });
        }
    }
    reloadTable() {
        this.state.firstRender = true
        this.refReactTable.fireFetchData()
    }
    handleChange(row) {

        if (!this.state.selectedRows.has(row.original.CUSTODYCD))
            this.state.selectedRows.add(row.original.CUSTODYCD);
        else {
            this.state.selectedRows.delete(row.original.CUSTODYCD);
        }
        this.setState({ selectedRows: this.state.selectedRows });
    }
    handleChangeALL(evt) {
        var that = this;
        this.setState({ checkedAll: evt.target.checked });
        if (evt.target.checked) {
            that.state.data.map(function (item) {
                if (!that.state.selectedRows.has(item.CUSTODYCD)) {
                    that.state.unSelectedRows.push(item.CUSTODYCD);
                    that.state.selectedRows.add(item.CUSTODYCD);
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
    submitGroup() {
        let i = 0;
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }
        var api = '/fund/send_account_message_vsd';
        if (this.state.selectedRows.size > 0) {

            this.state.selectedRows.forEach((key, value, set) => {

                new Promise((resolve, reject) => {

                    let data = this.state.data.filter(e => e.CUSTODYCD === value);
                    let success = null;
                    //console.log('data[0].MOBILE', data[0].MOBILE)
                    let datasend = {
                        p_CUSTID: data[0].CUSTID,
                        p_IDTYPE: data[0].IDTYPE,
                        p_BIRTHDATE: data[0].BIRTHDATE,
                        p_CUSTTYPE: data[0].CUSTTYPE,
                        p_GRINVESTOR: data[0].GRINVESTOR,
                        p_REGADDRESS: data[0].REGADDRESS,
                        p_MOBILE: data[0].MOBILE,
                        p_PHONE: data[0].PHONE,
                        p_EMAIL : data[0].EMAIL,
                        p_OPNID: data[0].OPNID,
                        p_APPROVEDATE: data[0].APPROVEDATE,
                        p_APPROVE_ID: data[0].APPROVE_ID,
                        p_BANKACC: data[0].BANKACC,
                        p_BANKACNAME: data[0].BANKACNAME,
                        p_BANKCODE: data[0].BANKCODE,
                        p_CITYBANK: data[0].CITYBANK,
                        p_STATUS: data[0].STATUS,
                        p_VSDSTATUS: data[0].VSDSTATUS,
                        p_STPSTATUS: data[0].STPSTATUS,
                        //----------------------
                        p_CUSTODYCD: data[0].CUSTODYCD,                        
                        p_FULLNAME: data[0].FULLNAME,
                        p_IDCODE: data[0].IDCODE,
                        p_IDDATE: data[0].IDDATE,
                        p_IDPLACE: data[0].IDPLACE,
                        p_ADDRESS: data[0].ADDRESS,
                        p_OPNDATE: data[0].OPNDATE,
                        p_SEX: data[0].SEX,

                        p_PASSPORT: data[0].PASSPORT,
                        p_PASSPORTDATE: data[0].PASSPORTDATE,
                        p_PASSPORTPLACE: data[0].PASSPORTPLACE,	
                        p_COUNTRY: data[0].COUNTRY,
                        p_SALEID: data[0].SALEID,	
                        p_FAX: data[0].FAX,	
                        p_LRNAME: data[0].LRNAME,	
                        p_LRID: data[0].LRID,
                        p_LRIDDATE: data[0].LRIDDATE,	
                        p_LRIDPLACE: data[0].LRIDPLACE,	
                        p_LRADDRESS: data[0].LRADDRESS,	
                        p_LRPOSITION: data[0].LRPOSITION,	
                        p_LRPHONE: data[0].LRPHONE,	
                        p_des: '',
                        pv_action: 'C',
                        p_language: this.props.lang,
                        pv_objname: this.props.OBJNAME
                    }
                    resolve(RestfulUtils.post(api, datasend)
                        .then((res) => {
                            // if (res.EC == 0) {
                            //     datanotify.type = "success";
                            //     datanotify.content =this.props.strings.success

                            //     dispatch(showNotifi(datanotify));


                            // } else {
                            //     datanotify.type = "error";
                            //     datanotify.content = res.EM;
                            //     dispatch(showNotifi(datanotify));
                            // }

                            i += 1
                            success = (res.EC == 0);

                            success ? toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                                : toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                            if (this.state.selectedRows.size == i) {
                                this.state.firstRender = true
                                this.refReactTable.fireFetchData()
                                window.$('#btnSubmit').prop('disabled', false);
                            }
                        })
                    )
                })

            })
        } else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT })
    }
    getOptions(input) {
        return RestfulUtils.post('/account/search_all_fullname', { key: input })
            .then((res) => {
                res.push({ value: 'ALL', label: 'All-Tất cả'  })
                return { options: res }
            })
    }
    onChangeCUSTODYCD(e) {
        if (e) {
            if (this.state.datagroup["custodycd"] != e.value) {
                this.state.datagroup["custodycd"] = e.value
                this.state.CUSTODYCD = e
                this.state.isSearch = true
                this.setState(this.state);
            }
        }


    }
    search() {
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }
        if (mssgerr == '') {
            if (this.state.isSearch == true) {
                this.state.firstRender = true
                this.state.isSearch = false
                this.refReactTable.fireFetchData()
            }
        }

    }
    checkValid(name, id) {
        let value = this.state.datagroup[name];

        let mssgerr = '';
        switch (name) {
            case "custodycd":
                if (value == '') {
                    mssgerr = this.props.strings.requiredcustodycd;
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
        console.log("dataall:=====",this.state.dataAll)
        const { data, pages, pagesize } = this.state;
        var that = this;
        return (
            <div>
                <div  className="row">
                <div className="col-md-10 row">
                        {/* <div className="col-md-2">
                            <h5 className="highlight"><b>{this.props.strings.CUSTODYCD}</b></h5>
                        </div>
                        <div className="col-md-5 customSelect">
                            <Select.Async
                                name="form-field-name"
                                loadOptions={this.getOptions.bind(this)}
                                value={this.state.CUSTODYCD}
                                onChange={this.onChangeCUSTODYCD.bind(this)}
                                id="cbCUSTODYCD"
                                clearable={false}

                            />
                        </div> */}
                        <div style={{ paddingLeft: "3px" }} className="col-md-5">
                            {/* <Button style={{ fontSize: 12 }} bsStyle="success" className="pull-left" id="btnsubmit" onClick={this.search.bind(this)}>{this.props.strings.search}</Button> */}
                            {/* <input type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" /> */}
                            <ButtonExport style={{ marginLeft: "5px" }} dataRows={this.state.dataAll} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} HaveChk={false}/>
                            {/* <input style={{ marginLeft:20, fontSize: 12 }} type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" value={this.props.strings.submit} id="btnSubmit" />
                            <ButtonExport style={{ float: 'right', fontSize: 12 }} dataRows={this.state.dataAll} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} HaveChk={true} /> */}
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }} className="col-md-2 RightInfo">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}> <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                            <span className="ReloadButton" onClick={this.reloadTable.bind(this)}><i className="fas fa-sync-alt"></i></span>
                        </h5>
                    </div>

                </div>
                <div className="col-md-12" >
                    <ReactTable
                        columns={[
                            
                            
                            {
                                Header: props => <div className="wordwrap" id="lblREQID">{this.props.strings.REQID}</div>,
                                id: "REQID",
                                accessor: "REQID",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblREQID">{this.props.strings.TXDESC}</div>,
                                id: "TXDESC",
                                accessor: "TXDESC",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblCustodycd">{this.props.strings.CUSTODYCD}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblIDTYPE">{this.props.strings.FULLNAME}</div>,
                                id: "FULLNAME",
                                accessor: "FULLNAME",
                                width: 200,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblIDCODE">{this.props.strings.TXNUM}</div>,
                                id: "TXNUM",
                                accessor: "TXNUM",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="TRFCODE">{this.props.strings.TRFCODE}</div>,
                                id: "TRFCODE",
                                accessor: "TRFCODE",
                                width: 200,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="NOTES">{this.props.strings.NOTES}</div>,
                                id: "NOTES",
                                accessor: "NOTES",
                                width: 200,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="TRANGTHAIDIEN" >{this.props.strings.TRANGTHAIDIEN}</div>,
                                id: "TRANGTHAIDIEN",
                                accessor: "TRANGTHAIDIEN",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="LIDOTUCHOI">{this.props.strings.LIDOTUCHOI}</div>,
                                id: "LIDOTUCHOI",
                                accessor: "LIDOTUCHOI",
                                width: 200,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="NGAYYEUCAU">{this.props.strings.NGAYYEUCAU}</div>,
                                id: "NGAYYEUCAU",
                                accessor: "NGAYYEUCAU",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="GIOYEUCAU">{this.props.strings.GIOYEUCAU}</div>,
                                id: "GIOYEUCAU",
                                accessor: "GIOYEUCAU",
                                width: 250,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="IDGIAODICH">{this.props.strings.IDGIAODICH}</div>,
                                id: "IDGIAODICH",
                                accessor: "IDGIAODICH",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="TLFULLNAME">{this.props.strings.TLFULLNAME}</div>,
                                id: "TLFULLNAME",
                                accessor: "TLFULLNAME",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="SOCHUNGTUVSD">{this.props.strings.SOCHUNGTUVSD}</div>,
                                id: "SOCHUNGTUVSD",
                                accessor: "SOCHUNGTUVSD",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="NGAYNHAN">{this.props.strings.NGAYNHAN}</div>,
                                id: "NGAYNHAN",
                                accessor: "NGAYNHAN",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="THOIGIANNHAN">{this.props.strings.THOIGIANNHAN}</div>,
                                id: "THOIGIANNHAN",
                                accessor: "THOIGIANNHAN",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="MACCQ">{this.props.strings.MACCQ}</div>,
                                id: "MACCQ",
                                accessor: "MACCQ",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="SOLUONG">{this.props.strings.SOLUONG}</div>,
                                id: "SOLUONG",
                                accessor: "SOLUONG",
                                width: 120,
                                Cell: ({ value }) => {
                                    return (
                                        <span style={{ float: 'left', paddingLeft: '5px'}}>
                                            <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                        </span>)
                                }
                            },
                            {
                                Header: props => <div className="wordwrap" id="LOAIGD">{this.props.strings.LOAIGD}</div>,
                                id: "LOAIGD",
                                accessor: "LOAIGD",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="SESSIONNO">{this.props.strings.SESSIONNO}</div>,
                                id: "SESSIONNO",
                                accessor: "SESSIONNO",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            // {
                            //     Header: props => <div className="wordwrap" id="LOAIGD">{this.props.strings.NAV}</div>,
                            //     id: "NAV",
                            //     accessor: "NAV",
                            //     width: 100,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                            //     )
                            // },
                            // {
                            //     Header: props => <div className="wordwrap" id="LOAIGD">{this.props.strings.TOTALNAV}</div>,
                            //     id: "TOTALNAV",
                            //     accessor: "TOTALNAV",
                            //     width: 100,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                            //     )
                            // },
                            // {
                            //     Header: props => <div className="wordwrap" id="LOAIGD">{this.props.strings.SESSIONKEY}</div>,
                            //     id: "SESSIONKEY",
                            //     accessor: "SESSIONKEY",
                            //     width: 100,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                            //     )
                            // },

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
                        //  loadingText="Đang tải..."
                        ofText="/"
                        getTrGroupProps={(row) => {
                            return {
                                id: "haha"
                            }
                        }}


                        //getTrProps={this.onRowClick.bind(this)}
                        defaultPageSize={pagesize}
                        className="-striped -highlight"
                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}
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

TableDien.defaultProps = {

    strings: {

    },


};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language

});


const decorators = flow([
    connect(stateToProps),
    translate('TableDien')
]);

module.exports = decorators(TableDien);
