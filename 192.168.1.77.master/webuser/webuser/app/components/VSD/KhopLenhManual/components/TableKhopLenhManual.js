import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils'
import { DefaultPagesize, getExtensionByLang, getRowTextTable, getPageTextTable } from 'app/Helpers'
import NumberInput from 'app/utils/input/NumberInput';
import { requestData } from 'app/utils/ReactTableUlti';
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import { showNotifi } from 'app/action/actionNotification.js';
class TableKhopLenhManual extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data1: [


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
            firstRender: true,
            lang: this.props.lang,
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
                p_orderid: 'ALL',
                language: this.props.lang,
                objname: this.props.datapage.OBJNAME,
                p_custodycd: this.state.datagroup["custodycd"] == '' ? 'nodata' : this.state.datagroup["custodycd"],
            }
            RestfulUtils.posttrans('/fund/getlistorder2execute', { data }).then((resData) => {

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
    reloadTable() {
        this.state.firstRender = true
        this.refReactTable.fireFetchData()
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
        const { data, pages, pagesize } = this.state;
        var that = this;
        return (
            <div>
                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                        {/*
                        <ButtonExport style={{ marginLeft: "5px" }} dataRows={this.state.dataALL} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} HaveChk={true} />
                    */}
                        <div className="col-md-2">
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
                </div>
                <div className="col-md-12" >
                    <ReactTable

                        columns={[
                            {
                                Header: props => <div className=" header-react-table">  </div>,
                                maxWidth: 90,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>
                                        <button type="button" className="btn btn-primary" onClick={this.handlEdit.bind(this, row.original)}>  <a style={{ color: "#ffffff" }}>{this.props.strings.submit}</a></button>
                                        {/*<span onClick={that.handlEdit.bind(that, row.original.CUSTID)} className="btn btn-primary"></span>*/}
                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ORDERID}</div>,
                                id: "ORDERID",
                                accessor: "ORDERID",
                                width: 143,
                                Cell: ({ value }) => (
                                    <div className="text-center" >{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.SYMBOL}</div>,
                                id: "SYMBOL",
                                accessor: "SYMBOL",
                                width: 78,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.CUSTODYCD}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                width: 92,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("EXECTYPE_DESC", this.props.lang)]}</div>,
                                // id: "EXECTYPE_DESC",
                                // accessor: "EXECTYPE_DESC",
                                id: getExtensionByLang("EXECTYPE_DESC", this.props.lang),
                                accessor: getExtensionByLang("EXECTYPE_DESC", this.props.lang),
                                width: 88,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ORDERVALUE}</div>,
                                id: "ORDERVALUE",
                                accessor: "ORDERVALUE",
                                width: 80,
                                Cell: ({ value }) => (
                                    <div className="col-right">
                                        <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                    </div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("STATUS_DES", this.props.lang)]}</div>,
                                //   id: "STATUS_DES",
                                //  accessor: "STATUS_DES",
                                id: getExtensionByLang("STATUS_DES", this.props.lang),
                                accessor: getExtensionByLang("STATUS_DES", this.props.lang),
                                width: 160,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.USERNAME}</div>,
                                id: "USERNAME",
                                accessor: "USERNAME",
                                width: 123,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TXDATE}</div>,
                                id: "TXDATE",
                                accessor: "TXDATE",
                                width: 80,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TXTIME}</div>,
                                id: "TXTIME",
                                accessor: "TXTIME",
                                width: 70,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.SWSYMBOL}</div>,
                                id: "SWSYMBOL",
                                accessor: "SWSYMBOL",
                                width: 87,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.VSDORDERID}</div>,
                                id: "VSDORDERID",
                                accessor: "VSDORDERID",
                                width: 143,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
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
                        //    loading={loading} // Display the loading overlay when we need it
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
                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}

                    />
                </div>

            </div>
        );
    }
}

TableKhopLenhManual.defaultProps = {

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
    translate('TableKhopLenhManual')
]);

module.exports = decorators(TableKhopLenhManual);
