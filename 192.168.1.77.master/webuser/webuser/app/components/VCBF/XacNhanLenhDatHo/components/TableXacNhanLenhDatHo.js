import React, { Component } from 'react';
import ReactTable from "react-table";
import NumberInput from 'app/utils/input/NumberInput'
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from 'app/Helpers';

class TableXacNhanLenhDatHo extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            lang: this.props.language,
            sumRecord: 0

        }
        // this.fetchData = this.fetchData.bind(this);
    }











    componentWillReceiveProps(nextProps) {
        if (this.state.lang != nextProps.currentLanguage) {
            this.state.lang = nextProps.currentLanguage
            this.state.loading = true
            this.refReactTable.fireFetchData()



        }
        this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch);
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

        if (!this.state.selectedRows.has(row.original.AUTOID))
            this.state.selectedRows.add(row.original.AUTOID);
        else {
            this.state.selectedRows.delete(row.original.AUTOID);
        }
        this.setState({ selectedRows: this.state.selectedRows });
    }
    onRowClick(state, rowInfo, column, instance) {
        var that = this;
        return {
            onDoubleClick: e => {

                that.props.showModalDetail("view", rowInfo.original)
            },
            style: {
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.AUTOID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.AUTOID) ? 'black' : '',
            }

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
    refresh = () => {
        let self = this
        // RestfulUtils.post('/user/getlistsalegroups', { pagesize: this.state.pagesize, language: this.props.language,OBJNAME: this.props.OBJNAME }).then((resData) => {
        //     if (resData.EC == 0) {
        //         //console.log('sync success', resData)
        //         self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord, dataALL: resData.DT.dataAll })

        //     } else {

        //         toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
        //     }
        // });



    }

    async loadData(pagesize, page, keySearch, sortSearch, columns) {






        let that = this;
        let {user}= this.props.auth;
        let custodycd = '';
        let iscustomer = '';
        if (user.ISCUSTOMER == 'Y'){
            iscustomer == 'Y';
            custodycd = user.USERID;
        }
        await RestfulUtils.post('/vcbf/getlistordersconfirm', { pagesize, page, keySearch, sortSearch, language: this.props.language, OBJNAME: this.props.OBJNAME, ISCUSTOMER : iscustomer , CUSTODYCD : custodycd }).then((resData) => {
            console.log('resData', resData);
            if (resData.EC == 0)
                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord,
                    colum: columns,
                    dataALL: resData.DT.dataAll
                });



        });
    }

    delete = () => {
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "Huỷ",
            content: ""
        }
        //console.log('data ', this.state.data)
        let i = 0;
        if (this.state.selectedRows.size > 0) {
            this.state.selectedRows.forEach((key, value, set) => {

                new Promise((resolve, reject) => {

                    let data = this.state.data.filter(e => e.AUTOID === value);
                    //console.log(' data ',  data, data[0])

                    let success = null;
                    let datadelete = {
                        ...data[0],
                        language: this.props.language,
                        objname: this.props.OBJNAME
                    }

                    resolve(RestfulUtils.posttrans('/user/deletelistsalegroups', datadelete)
                        .then(res => {
                            i += 1
                            success = (res.EC == 0);

                            success ? toast.success(this.props.strings.cancelacc, { position: toast.POSITION.BOTTOM_RIGHT })
                                : toast.error(res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                            if (this.state.selectedRows.size == i) {
                                this.setState({ loaded: false })
                                this.refresh()
                            }
                        })
                    );
                })
            })
        } else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT })

    }
    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    async reloadTable() {


        let that = this;
        let {user}= this.props.auth;
        let custodycd = '';
        let iscustomer = '';
        if (user.ISCUSTOMER == 'Y'){
            iscustomer == 'Y';
            custodycd = user.USERID;
        }
        await RestfulUtils.post('/vcbf/getlistordersconfirm', { pagesize: that.state.pagesize, page: that.state.page, keySearch: that.state.keySearch, sortSearch: that.state.sortSearch, language: that.props.language, OBJNAME: this.props.OBJNAME,ISCUSTOMER : iscustomer , CUSTODYCD : custodycd }).then((resData) => {
            console.log('resData', resData)
            if (resData.EC == 0)

                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord,
                    colum: columns,
                    dataALL: resData.DT.dataAll
                });
        });



    }



    render() {
        const { data, pages, loading } = this.state;
        
        console.log('user:', this.props)
        var that = this;
        return (
            <div>
                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                        <ButtonExport style={{ marginLeft: "7px" }} HaveChk={true} dataRows={this.state.dataALL} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />


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
                                maxWidth: 95,

                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>

                                        <button type="button" className="btn btn-primary" onClick={this.handlEdit.bind(this, row.original)}>  <a style={{ color: "#ffffff" }}>{this.props.strings.submit}</a></button>

                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ORDERID}</div>,
                                id: "ORDERID",
                                accessor: "ORDERID",
                                width: 120,

                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.SYMBOL}</div>,
                                id: "SYMBOL",
                                accessor: "SYMBOL",
                                width: 80,

                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.CUSTODYCD}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                width: 90,

                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.DBCODE}</div>,
                                id: "DBCODE",
                                accessor: "DBCODE",
                                width: 90,

                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("EXECTYPE_DESC", this.props.language)]}</div>,
                                id: getExtensionByLang("EXECTYPE_DESC", this.props.language),
                                accessor: getExtensionByLang("EXECTYPE_DESC", this.props.language),
                                width: 150,



                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ORDERVALUE}</div>,
                                id: "ORDERVALUE",
                                accessor: "ORDERVALUE",
                                width: 120,



                                Cell: ({ value }) => (
                                    <div className="col-right">
                                        <NumberInput value={value} displayType={'text'} thousandSeparator={true} decimalScale = {2} />
                                    </div>

                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("DESC_STATUS", this.props.language)]}</div>,
                                id: getExtensionByLang("DESC_STATUS", this.props.language),
                                accessor: getExtensionByLang("DESC_STATUS", this.props.language),
                                width: 150,



                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },


                            {
                                Header: props => <div className="wordwrap">{this.props.strings.USERNAME}</div>,
                                id: "USERNAME",
                                accessor: "USERNAME",
                                width: 170,



                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TXDATE}</div>,
                                id: "TXDATE",
                                accessor: "TXDATE",
                                width: 83,



                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TXTIME}</div>,
                                id: "TXTIME",
                                accessor: "TXTIME",
                                width: 69,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.SWSYMBOL}</div>,
                                id: "SWSYMBOL",
                                accessor: "SWSYMBOL",
                                width: 100,

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
                        loadingText="Đang tải..."
                        ofText="/"
                        getTrProps={this.onRowClick.bind(this)}
                        defaultPageSize={this.state.pagesize}
                        className="-striped -highlight"
                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                    />
                </div>
            </div>
        );
    }
}









const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    language: state.language.language,
    auth: state.auth,
});


const decorators = flow([
    connect(stateToProps),
    translate('TableXacNhanLenhDatHo')
]);

module.exports = decorators(TableXacNhanLenhDatHo);
