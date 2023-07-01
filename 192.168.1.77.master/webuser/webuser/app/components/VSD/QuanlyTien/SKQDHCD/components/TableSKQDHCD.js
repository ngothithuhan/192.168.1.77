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
import { DefaultPagesize, getExtensionByLang, getRowTextTable, getPageTextTable } from 'app/Helpers'
import { requestData } from 'app/utils/ReactTableUlti';


class TableSKQDHCD extends Component {
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
                p_autoid: 'ALL',
                language: this.props.lang,
                objname: this.props.OBJNAME
            }
            RestfulUtils.posttrans('/fund/getlistcamast', { data }).then((resData) => {

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

                    var tradingdate = moment(this.props.tradingdate, 'DD/MM/YYYY')
                    var duedate = moment(data[0].DUEDATE, 'DD/MM/YYYY')
                    if (!(tradingdate).isBefore(duedate)) {
                        i += 1
                        toast.error(this.props.strings.errdate, { position: toast.POSITION.BOTTOM_RIGHT })
                        if (this.state.selectedRows.size == i) {
                            this.state.firstRender = true
                            this.refReactTable.fireFetchData()
                           

                        }
                    }
                    else {
                        resolve(RestfulUtils.posttrans('/fund/deletecamast', datadelete)
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
                        <ButtonDelete style={{ marginLeft: "5px" }} onClick={this.delete} data={this.props.datapage} id="btnDel" />
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
                                Header: props => <div className=" header-react-table"> <Checkbox checked={that.state.checkedAll} style={{ marginBottom: "14px", marginLeft: "11px" }} onChange={that.handleChangeALL.bind(that)} inline /> </div>,
                                maxWidth: 70,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>
                                        <Checkbox style={{ textAlign: "center", marginLeft: "11px", marginTop: "-14px" }}
                                            checked={that.state.selectedRows.has(row.original.AUTOID)}
                                            onChange={that.handleChange.bind(that, row)} inline
                                        />
                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },

                            {
                                Header: props => <div id="lblCAMASTID" className="wordwrap">{this.props.strings.AUTOID}</div>,
                                id: "AUTOID",
                                accessor: "AUTOID",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div id={"lbl" + value} className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div id="lblCATYPEDES" className="wordwrap">{this.props.strings[getExtensionByLang("CATYPEDES", this.props.lang)]}</div>,
                                // id: "CATYPEDES",
                                // accessor: "CATYPEDES",
                                id: getExtensionByLang("CATYPEDES", this.props.lang),
                                accessor: getExtensionByLang("CATYPEDES", this.props.lang),
                                width: 150,
                                Cell: ({ value }) => (
                                    <div id={"lbl" + value} className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div id="lblSYMBOL" className="wordwrap">{this.props.strings.SYMBOL}</div>,
                                id: "SYMBOL",
                                accessor: "SYMBOL",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div id={"lbl" + value} className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div id="lblBANKACC" className="wordwrap">{this.props.strings.ISINCODE}</div>,
                                id: "ISINCODE",
                                accessor: "ISINCODE",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div id={"lbl" + value} className="col-left">{value}</div>
                                )
                            },

                            {
                                Header: props => <div id="lblREPORTDATE" className="wordwrap">{this.props.strings.REPORTDATE}</div>,
                                id: "REPORTDATE",
                                accessor: "REPORTDATE",
                                width: 170,
                                Cell: ({ value }) => (
                                    <div id={"lbl" + value} className="col-left">{value}</div>
                                )

                            },
                            {
                                Header: props => <div id="lblDUEDATE" className="wordwrap">{this.props.strings.DUEDATE}</div>,
                                id: "DUEDATE",
                                accessor: "DUEDATE",
                                width: 160,
                                Cell: ({ value }) => (
                                    <div id={"lbl" + value} className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div id="lblRATE" className="wordwrap">{this.props.strings.RATE}</div>,
                                id: "RATE",
                                accessor: "RATE",
                                width: 140,
                                Cell: ({ value }) => (

                                    <div id={"lbl" + value} className="col-left">{value}</div>

                                )
                            },

                            {
                                Header: props => <div id="lblDESCRIPTION" className="header_table_pad_3">{this.props.strings.DESCRIPTION}</div>,
                                id: "DESCRIPTION",
                                accessor: "DESCRIPTION",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div id={"lbl" + value} className="col-left" >{value}</div>
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
                        //  loading={loading} // Display the loading overlay when we need it
                        onFetchData={this.fetchData.bind(this)}
                        data={data}
                        style={{
                            maxHeight: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                        }}
                        getTrGroupProps={(row) => {
                            return {
                                id: "haha"
                            }
                        }}
                        noDataText={this.props.strings.textNodata}
                        pageText={getPageTextTable(this.props.lang)}
                        rowsText={getRowTextTable(this.props.lang)}
                        previousText={<i className="fas fa-backward" id="previous"></i>}
                        nextText={<i className="fas fa-forward" id="next"></i>}
                        //  loadingText="Đang tải..."
                        ofText="/"
                        getTrProps={this.onRowClick.bind(this)}
                        defaultPageSize={pagesize}
                        className="-striped -highlight"
                        // onPageChange={(pageIndex) => {
                        //     this.state.selectedRows = new Set(),
                        //         this.state.checkedAll = false
                        // }
                        // }
                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                    />
                </div>

            </div>
        );
    }
}

TableSKQDHCD.defaultProps = {

    strings: {

    },


};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language,
    tradingdate: state.systemdate.tradingdate
});


const decorators = flow([
    connect(stateToProps),
    translate('TableSKQDHCD')
]);

module.exports = decorators(TableSKQDHCD);
