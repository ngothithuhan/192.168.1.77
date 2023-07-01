import React, { Component } from "react";
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { DefaultPagesize, getRowTextTable, getPageTextTable,getExtensionByLang } from 'app/Helpers'
import NumberFormat from 'react-number-format';
import RestfulUtils from 'app/utils/RestfulUtils';
import { requestData } from 'app/utils/ReactTableUlti';
import Select from 'react-select';
import { showNotifi } from 'app/action/actionNotification.js';
import { Button } from 'react-bootstrap';
import { Checkbox } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ButtonAdd, ButtonExport, ButtonDelete } from 'app/utils/buttonSystem/ButtonSystem';


class TableXNTraTienThua extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [

            ],
            filteredData: [],
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
            data1: [],
            loaded: false,

            sorted1: [],
            filtered1: [],
            firstRender: true,
            CODEID: { label: '', value: '' },
            datagroup: {
                codeid: ''
            },
            isSearch: false,
            checkFields: [
                { name: "codeid", id: "cbCODEID" },
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

    handleChangeALL(evt) {

        var that = this;
        this.setState({
            checkedAll: evt.target.checked,
            selectedRows: new Set(),
            unSelectedRows: []
        });
        if (evt.target.checked) {
            that.state.filteredData.map(function (item) {
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

                p_language: this.props.lang,
                OBJNAME: this.props.OBJNAME,
                p_codeid: this.state.datagroup["codeid"]
            }
            if (data.p_codeid != '') {
                RestfulUtils.posttrans('/vcbf/getlistcashback_confirm', { data }).then((resData) => {

                    //console.log('rs',resData)
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
                                filteredData: resData.DT.data,
                                selectedRows: new Set(),
                                checkedAll: false,
                                sumRecord: resData.DT.data.length,
                                colum: instance.props.columns
                            });
                        });
                    }

                })
            }
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
                    this.state.colum = instance.props.columns,
                    this.state.filteredData = res.filteredData,
                    this.state.checkedAll = false;
                // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                this.setState(that.state);
            });
        }
    }
    reloadTable() {
        this.state.firstRender = true
        this.refReactTable.fireFetchData()
    }
    getOptionsSYMBOL(input) {
        return RestfulUtils.post('/allcode/search_all_funds', { key: input })
            .then((res) => {
                res.push({ value: 'ALL', label: 'All-Tất cả' })
                return { options: res }
            })
    }
    onChangeSYMBOL(e) {
        if (e) {
            if (this.state.datagroup["codeid"] != e.value) {
                this.state.datagroup["codeid"] = e.value
                this.state.CODEID = e
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
            case "codeid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredcodeid;
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
    submit() {
        let i = 0;
        if (this.state.selectedRows.size > 0) {
            this.state.selectedRows.forEach((key, value, set) => {

                new Promise((resolve, reject) => {

                    let data = this.state.filteredData.filter(e => e.AUTOID === value);
                    if (data && data.length > 0) {
                        let success = null;
                        let datasubmit = {
                            data: data[0],
                            p_language: this.props.lang,
                            pv_objname: this.props.OBJNAME
                        }
                        resolve(RestfulUtils.posttrans('/vcbf/cashback_confirm', datasubmit)
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
                    }

                })

            })
        } else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT })
    }
    render() {
        const { data, pages, pagesize } = this.state;
        var that = this;
        return (
            <div>
                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                        <div className="col-md-2">
                            <h5 className="highlight"><b>{this.props.strings.codeid}</b></h5>
                        </div>
                        <div className="col-md-3 customSelect">
                            <Select.Async
                                name="form-field-name"
                                placeholder={this.props.strings.VCBFCODE}
                                loadOptions={this.getOptionsSYMBOL.bind(this)}
                                value={this.state.CODEID}
                                onChange={this.onChangeSYMBOL.bind(this)}
                                id="cbCODEID"
                            />
                        </div>
                        <div className="col-md-2">
                            <Button style={{ fontSize: 12 }} bsStyle="" className="pull-left btndangeralt" id="btnsubmit" onClick={this.search.bind(this)}>{this.props.strings.search}</Button>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }} className="col-md-2 RightInfo">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}>
                            <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                            <span className="ReloadButton" onClick={this.reloadTable.bind(this)}><i className="fas fa-sync-alt"></i></span>
                        </h5>
                    </div>
                    <div className="col-md-12">
                    <button type="button" id="btnThucHien" className="btn btn-primary" onClick={this.submit.bind(this)}>  <a style={{ color: "#ffffff" }}>{this.props.strings.submit}</a></button>
                    <ButtonExport style={{ marginLeft: "5px" }} HaveChk={true} dataRows={this.state.dataAll} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />
 
                </div>
            </div>
            <div className="col-md-12" >
                <ReactTable
                    columns={[
                        {
                            Header: props => <div className=" header-react-table"> <Checkbox checked={that.state.checkedAll} style={{ marginBottom: "14px", marginLeft: 11 }} onChange={that.handleChangeALL.bind(that)} inline />  </div>,
                            maxWidth: 55,
                            sortable: false,
                            style: { textAlign: 'center' },
                            Cell: (row) => (
                                <div>
                                    <Checkbox style={{ textAlign: "center", marginLeft: "10px", marginTop: "-14px" }}
                                        checked={that.state.selectedRows.has(row.original.AUTOID)}
                                        onChange={that.handleChange.bind(that, row)} inline
                                    />
                                </div>
                            ),
                            Filter: ({ filter, onChange }) =>
                                null
                        },
                        {
                            Header: props => <div className="wordwrap" id="lblCUSTODYCD">{this.props.strings.CUSTODYCD}</div>,
                            id: "CUSTODYCD",
                            accessor: "CUSTODYCD",
                            width: 88,
                            Cell: ({ value }) => (
                                <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="wordwrap" id="lblDBCODE">{this.props.strings.DBCODE}</div>,
                            id: "DBCODE",
                            accessor: "DBCODE",
                            width: 88,
                            Cell: ({ value }) => (
                                <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="wordwrap" id="lblFULLNAME">{this.props.strings.FULLNAME}</div>,
                            id: "FULLNAME",
                            accessor: "FULLNAME",
                            width: 88,
                            Cell: ({ value }) => (
                                <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="wordwrap" id="lblSYMBOL">{this.props.strings.SYMBOL}</div>,
                            id: "SYMBOL",
                            accessor: "SYMBOL",
                            width: 100,
                            Cell: ({ value }) => (
                                <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="wordwrap" id="lblSRTYPE">{this.props.strings[getExtensionByLang("SRTYPE_DESC", this.props.lang)]}</div>,
                            id: "SRTYPE_DESC",
                            accessor: getExtensionByLang("SRTYPE_DESC", this.props.lang),
                            width: 100,
                            Cell: ({ value }) => (
                                <div className="col-left" id={"lbl" + value}>{value}</div>
                            )

                        },

                        {
                            Header: props => <div className="wordwrap" id="lblTXDATE">{this.props.strings.TXDATE}</div>,
                            id: "TXDATE",
                            accessor: "TXDATE",
                            width: 80,
                            Cell: ({ value }) => (
                                <div className="col-left" id={"lbl" + value}>{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="wordwrap" id="lblBANKACC">{this.props.strings.BANKACC}</div>,
                            id: "BANKACC",
                            accessor: "BANKACC",
                            width: 120,
                            Cell: ({ value }) => (
                                <div className="col-left" id={"lbl" + value}>{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="wordwrap" id="lblBANKNAME">{this.props.strings.BANKNAME}</div>,
                            id: "BANKNAME",
                            accessor: "BANKNAME",
                            width: 347,
                            Cell: ({ value }) => (
                                <div className="col-left" id={"lbl" + value}>{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="wordwrap" id="lblAMOUNT">{this.props.strings.AMOUNT}</div>,
                            id: "AMOUNT",
                            accessor: "AMOUNT",
                            width: 130,
                            Cell: ({ value }) => {
                                return (
                                    <span style={{ float: 'right', paddingRight: '5px' }}>
                                        <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                    </span>)
                            }
                        },
                        {
                            Header: props => <div className="wordwrap" id="lblSTATUS">{this.props.strings[ getExtensionByLang("STATUS", this.props.lang)]}</div>,
                            id: "STATUS",
                            accessor:  getExtensionByLang("STATUS", this.props.lang),
                            width: 120,
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
                    pageText={getPageTextTable(this.props.lang)}
                    rowsText={getRowTextTable(this.props.lang)}
                    previousText={<i className="fas fa-backward" id="previous"></i>}
                    nextText={<i className="fas fa-forward" id="next"></i>}
                    // loadingText="Đang tải..."
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

            </div >
        );
    }
}

TableXNTraTienThua.defaultProps = {
    strings: {}
};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language
});

const decorators = flow([connect(stateToProps), translate("TableXNTraTienThua")]);

module.exports = decorators(TableXNTraTienThua);
