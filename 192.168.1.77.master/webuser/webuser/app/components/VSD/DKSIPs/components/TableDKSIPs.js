import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import NumberInput from 'app/utils/input/NumberInput'
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getPageTextTable, getRowTextTable, getExtensionByLang } from '../../../../Helpers';

class TableDKSIPs extends Component {
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
            pagesize: DefaultPagesize,
            keySearch: {},
            sortSearch: {},
            page: 1,
            sumRecord: '', //tong cac record tren luoi,
            lang: this.props.lang
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
        this.refresh()
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
        this.setState({ checkedAll: evt.target.checked });
        if (evt.target.checked) {
            that.state.data.map(function (item) {
                if (!that.state.selectedRows.has(item.SPID)) {
                    that.state.unSelectedRows.push(item.SPID);
                    that.state.selectedRows.add(item.SPID);
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

        if (!this.state.selectedRows.has(row.original.SPID))
            this.state.selectedRows.add(row.original.SPID);
        else {
            this.state.selectedRows.delete(row.original.SPID);
        }
        this.setState({ selectedRows: this.state.selectedRows });
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
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.SPID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.SPID) ? 'black' : '',
            }

        }
    }
    fetchData(state, instance) {
        // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
        // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
        var that = this;
        // Request the data however you want.  Here, we'll use our mocked service we created earlier
        if (this.state.loading) {
            new Promise((resolve, reject) => {
                let { pageSize, page, filtered, sorted } = state;
                setTimeout(() => resolve(this.loadData(pageSize, page + 1, filtered, sorted, instance.props.columns)), 500);
            })
        }
        this.setState({ loading: true })
    }
    refresh = () => {
        let self = this
    
        RestfulUtils.posttrans('/user/getlisttasip', { pagesize: this.state.pagesize, language: this.props.lang, OBJNAME: this.props.OBJNAME }).then((resData) => {
            
            if (resData.EC == 0) {
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord, dataAll: resData.DT.sum })
            } else {

                toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });

            }
        });
    }
    async loadData(pagesize, page, keySearch, sortSearch, columns) {

        let that = this;
        await RestfulUtils.post('/user/getlisttasip', { pagesize, page, keySearch, sortSearch, language: this.props.lang,OBJNAME: this.props.OBJNAME }).then((resData) => {
            //console.log('datatable   ----', resData)
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
                    colum: columns,
                    selectedRows: new Set(),
                });
            }
        });

    }
    refreshData = async () => {
        let result = await this.refresh();
        let { pagesize, page, keySearch, sortSearch } = this.state
        this.loadData(pagesize, page, keySearch, sortSearch);

    }
    delete = () => {
        // var { dispatch } = this.props;
        // var datanotify = {
        //     type: "",
        //     header: "Huỷ",
        //     content: ""
        // }
        // this.state.selectedRows.forEach((key, value, set) => {
        //     new Promise((resolve, reject) => {
        //         let data = this.state.data.filter(e => e.SPID === value);
        //         let success = null;
        //         resolve(axios.post('/account/cancel', data[0])
        //             .then(res => {
        //                 success = (res.data.EC == 0);
        //                 success ? toast.success("Huỷ tài khoản " + value + " thành công !", { position: toast.POSITION.BOTTOM_RIGHT })
        //                     : toast.error("Huỷ tài khoản " + value + " không thành công!. " + res.data.EM, { position: toast.POSITION.BOTTOM_RIGHT })
        //                 return res.data
        //             })
        //         );
        //     })
        // })
    }
    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }

    submitGroup = () => {
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: " ,",
            content: ""
        }
        let i = 0;
        
        if (this.state.selectedRows.size > 0) {
            
            this.state.selectedRows.forEach((key, value, set) => {
                new Promise((resolve, reject) => {

                    let data = this.state.data.filter(e => e.SPID === value);
                    let success = null;
                    let dataACCEPT = {
                        spid: data[0].SPID,
                        codeid: data[0].CODEID,
                        custodycd: data[0].CUSTODYCD,
                        fullname: data[0].FULLNAME,
                        amt: data[0].AMT,
                        symbol: data[0].SYMBOL,
                        language: this.props.lang,
                        objname: this.props.OBJNAME
                    }
                    //console.log('dataACCEPT ', dataACCEPT)
                    resolve(RestfulUtils.posttrans('/user/acceptsips', dataACCEPT)
                        .then(res => {
                            i += 1

                            success = (res.EC == 0);
                            success ? toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                                : toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                            if (this.state.selectedRows.size == i) {
                                this.setState({ loaded: false })
                                this.refresh()
                                /*
                                let data = {
                                    pageSize: this.state.pageSize,
                                    page: this.state.page,
                                    sorted: this.state.sorted1,
                                    filtered: this.state.filtered1,
                                }
                                */
                                this.refReactTable.fireFetchData()
                              //  this.fetchData(data)
                                
                            }
                        })
                    );

                })

            })
        } else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT })
    }
    deny = () => {

        let i = 0;
        if (this.state.selectedRows.size > 0) {
            
            this.state.selectedRows.forEach((key, value, set) => {

                new Promise((resolve, reject) => {
                    let data = this.state.data.filter(e => e.SPID === value);
                    let success = null;
                    let dataDENY = {
                        spid: data ? data[0].SPID : '',
                        codeid: data[0].CODEID,
                        custodycd: data[0].CUSTODYCD,
                        fullname: data[0].FULLNAME,
                        amt: data[0].AMT,
                        symbol: data[0].SYMBOL,
                        language: this.props.lang,
                        objname: this.props.OBJNAME
                    }
                    //console.log('datadeny  ', dataDENY)
                    resolve(RestfulUtils.posttrans('/user/denysips', dataDENY)
                        .then(res => {
                            i += 1
                            //nothing t
                            success = (res.EC == 0);
                            success ? toast.success(this.props.strings.successdeny, { position: toast.POSITION.BOTTOM_RIGHT })
                                : toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                            if (this.state.selectedRows.size == i) {
                                this.setState({ loaded: false })
                                this.refresh()
                                /*
                                let data = {
                                    pageSize: this.state.pageSize,
                                    page: this.state.page,
                                    sorted: this.state.sorted1,
                                    filtered: this.state.filtered1,
                                }
                                this.fetchData(data)
                                */
                                this.refReactTable.fireFetchData()

                            }
                        })
                    );

                })

            })
        } else toast.error("Chưa chọn record gán!", { position: toast.POSITION.BOTTOM_RIGHT })
    }


    render() {
        const { data, pages, loading } = this.state;
        var that = this;
        return (
            <div>
                <div className="row" >
                    <div style={{ marginLeft: "-10px", marginBottom: "10px" }} className="col-md-10">
                        <ButtonExport HaveChk={true} dataRows={this.state.dataAll} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />
                    </div>
                    <div style={{ textAlign: "right" }} className="col-md-2 RightInfo" >
                        <h5 className="highlight" style={{ fontWeight: "bold" }}> <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                            <span className="ReloadButton" onClick={this.refresh}><i className="fas fa-sync-alt"></i></span>
                        </h5>
                    </div>
                </div>
                <ReactTable
                    columns={[
                        {
                            Header: props => <div className=" header-react-table">    <Checkbox checked={that.state.checkedAll} style={{ marginBottom: "14px", marginLeft: "8px" }} onChange={that.handleChangeALL.bind(that)} inline /></div>,
                            maxWidth: 45,
                            sortable: false,
                            style: { textAlign: 'center' },
                            Cell: (row) => (
                                <div>
                                    <Checkbox style={{ textAlign: "center", marginLeft: "8px", marginTop: "-14px" }}
                                        checked={that.state.selectedRows.has(row.original.SPID)}
                                        onChange={that.handleChange.bind(that, row)} inline
                                    />
                                    {/* <span onClick={that.handlEdit.bind(that, row.original.CUSTID)} className="glyphicon glyphicon-pencil"></span> */}
                                </div>
                            ),
                            Filter: ({ filter, onChange }) =>
                                null
                        },
                        {
                            Header: props => <div className="">{this.props.strings.SPID}</div>,
                            id: "SPID",
                            accessor: "SPID",
                            width: 118,
                            Cell: ({ value }) => (
                                <div className="col-left" style={{ float: "left" }}>{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.SYMBOL}</div>,
                            id: "SYMBOL",
                            accessor: "SYMBOL",
                            width: 90,
                            Cell: ({ value }) => (
                                <div className="col-left" style={{ float: "left" }}>{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.CUSTODYCD}</div>,
                            id: "CUSTODYCD",
                            accessor: "CUSTODYCD",
                            width: 110,
                            Cell: ({ value }) => (
                                <div className="col-left">{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.FULLNAME}</div>,
                            id: "FULLNAME",
                            accessor: "FULLNAME",
                            width: 110,
                            Cell: ({ value }) => (
                                <div className="col-left">{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.DBCODE}</div>,
                            id: "DBCODE",
                            accessor: "DBCODE",
                            width: 100,
                            Cell: ({ value }) => (
                                <div className="col-left">{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings[getExtensionByLang("DESC_EXECTYPE", this.props.lang)]}</div>,
                            id: getExtensionByLang("DESC_EXECTYPE", this.props.language),
                            accessor: getExtensionByLang("DESC_EXECTYPE", this.props.language),

                            width: 90,
                            Cell: ({ value }) => (
                                <div className="col-left">{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.PRODUCTTYPE}</div>,
                            id: "PRODUCTTYPE",
                            accessor: "PRODUCTTYPE",
                            width: 150,
                            Cell: ({ value }) => (
                                <div className="col-left">{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.FEEID}</div>,
                            id: "FEEID",
                            accessor: "FEEID",
                            width: 150,
                            Cell: ({ value }) => (
                                <div className="col-left">{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.AMT}</div>,
                            id: "AMT",
                            accessor: "AMT",
                            width: 170,
                            Cell: ({ value }) => (
                                <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings[getExtensionByLang("STATUS_DESC", this.props.lang)]}</div>,
                            id: getExtensionByLang("STATUS_DESC", this.props.language),
                            accessor: getExtensionByLang("STATUS_DESC", this.props.language),
                            width: 100,
                            Cell: ({ value }) => (
                                <div className="col-left">{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.TXDATE}</div>,
                            id: "TXDATE",
                            accessor: "TXDATE",
                            width: 110,
                            Cell: ({ value }) => (
                                <div className="col-left">{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.USERNAME}</div>,
                            id: "USERNAME",
                            accessor: "USERNAME",
                            width: 168,
                            Cell: ({ value }) => (
                                <div className="col-left">{value}</div>
                            )
                        },
                        {
                            Header: props => <div className="">{this.props.strings.TXTIME}</div>,
                            id: "TXTIME",
                            accessor: "TXTIME",
                            width: 136,
                            Cell: ({ value }) => (
                                <div className="col-left">{value}</div>
                            )
                        }
                    ]}
                    getTheadTrProps={() => {
                        return {
                            className: 'head'
                        }
                    }}

                    manual
                    filterable
                    pages={pages} // Display the total number of pages
                    onFetchData={this.fetchData.bind(this)}
                    data={data}
                    style={{
                        maxHeight: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                    }}
                    noDataText={this.props.strings.textNodata}
                    pageText={getPageTextTable(this.props.lang)}
                    rowsText={getRowTextTable(this.props.lang)}
                    previousText={<i className="fas fa-backward"></i>}
                    nextText={<i className="fas fa-forward"></i>}
                    loadingText="Đang tải..."
                    ofText="/"
                    getTrProps={this.onRowClick.bind(this)}
                    defaultPageSize={this.state.pagesize}
                    className="-striped -highlight"
                    ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                    getTrGroupProps={(row) => {
                        return {
                            id: "haha"
                        }
                    }}

                />

                <div style={{marginTop: '10px'}} className="pull-right">
                    <input type="button" onClick={this.submitGroup} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
                    <input type="button" onClick={this.deny} className="btn btn-default" style={{ marginRight: 15 }} value={this.props.strings.reject} id="btnDeny" />
                </div>
            </div>


        );
    }
}

TableDKSIPs.defaultProps = {

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
    translate('TableDKSIPs')
]);

module.exports = decorators(TableDKSIPs);
