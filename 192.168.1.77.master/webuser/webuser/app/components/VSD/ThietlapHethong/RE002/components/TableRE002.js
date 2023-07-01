import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import { ButtonAdd, ButtonExport, ButtonDelete } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from '../../../../../Helpers';
 
class TableRE002 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //saleid: 'ALL',
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
            lang: this.props.language
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.lang != nextProps.currentLanguage) {
            this.state.lang = nextProps.currentLanguage
            this.state.loading = true
            this.refReactTable.fireFetchData()
        }
        if (nextProps.isrefresh) {
            //this.refresh()
            this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch);
        }
    }
    componentWillMount() {
        this.refresh();

    }
    handleAdd(evt) {
        this.props.showModalDetail("add");
    }
    handlEdit(data) {
        
        this.props.showModalDetail("update", data);
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
    refresh() {
        let self = this
        RestfulUtils.post('/user/getlistsaleroles', { pagesize: this.state.pagesize, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord, dataALL: resData.DT.dataAll })
            } else {
                toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
            }
        });
    }
    async loadData(pagesize, page, keySearch, sortSearch, columns) {

        let that = this;
        await RestfulUtils.post('/user/getlistsaleroles', { pagesize, page, keySearch, sortSearch, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                //console.log('sync success in load', resData)

                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord,
                    colum: columns
                });
            }
            else {

            }
        });

    }
    refreshData = async () => {
        let result = await this.refresh();
        let { pagesize, page, keySearch, sortSearch } = this.state
        this.loadData(pagesize, page, keySearch, sortSearch);

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
                    //console.log('value ', value)

                    let success = null;
                    let datadelete = {
                        ...data[0],
                        // autoid: data[0].AUTOID,
                        // retype: data.RETYPE,
                        // saleid: data.SALEID,
                        // effdate: data.EFFDATE,
                        // expdate: data.EXPDATE,
                        // saleacctno: data.RETYPE + data.SALEID,
                        language: this.props.language,
                        objname: this.props.OBJNAME
                    }

                    resolve(RestfulUtils.posttrans('/user/deletelistsaleroles', datadelete)
                        .then(res => {
                            i += 1
                            success = (res.EC == 0);
                            if (res.EC == '-900000'){
                                res.EM = this.props.strings.asignedgroup;
                              }
                            console.log('success:', success)
                            success ? toast.success(this.props.strings.cancelacc + ' ' + this.props.strings.successtitle, { position: toast.POSITION.BOTTOM_RIGHT })
                                : toast.error(this.props.strings.cancelacc + ' ' + this.props.strings.failtitle + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
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
    reloadTable() {
        this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch)
    }
    render() {
        const { data, pages } = this.state;
        var that = this;
        return (
            <div>
                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">

                        <ButtonAdd data={this.props.datapage} onClick={this.handleAdd.bind(this)} />

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
                                Header: props => <div className=" header-react-table"> <Checkbox checked={that.state.checkedAll} style={{ marginBottom: "14px" }} onChange={that.handleChangeALL.bind(that)} inline /></div>,
                                maxWidth: 55,
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
                                Header: props => <div className="wordwrap">{this.props.strings.TLNAME}</div>,
                                id: "TLNAME",
                                accessor: "TLNAME",
                                width: 137,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TLFULLNAME}</div>,
                                id: "TLFULLNAME",
                                accessor: "TLFULLNAME",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.MBCODE}</div>,
                                id: "MBCODE",
                                accessor: "MBCODE",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.EMAIL}</div>,
                                id: "EMAIL",
                                accessor: "EMAIL",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.MOBILE}</div>,
                                id: "MOBILE",
                                accessor: "MOBILE",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.BIRTHDATE}</div>,
                                id: "BIRTHDATE",
                                accessor: "BIRTHDATE",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.MACTV}</div>,
                                id: "MACTV",
                                accessor: "MACTV",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.IDCODE}</div>,
                                id: "IDCODE",
                                accessor: "IDCODE",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.IDDATE}</div>,
                                id: "IDDATE",
                                accessor: "IDDATE",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.IDPLACE}</div>,
                                id: "IDPLACE",
                                accessor: "IDPLACE",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TAXCODE}</div>,
                                id: "TAXCODE",
                                accessor: "TAXCODE",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.BANKACC}</div>,
                                id: "BANKACC",
                                accessor: "BANKACC",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.BANKNAME}</div>,
                                id: "BANKNAME",
                                accessor: "BANKNAME",
                                width: 350,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },



                            

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.MBNAME}</div>,
                                // id: "MBNAME",
                                // accessor: "MBNAME",
                                id: "MBNAME", 
                                accessor: "MBNAME", 
                                width: 298,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.BRNAME}</div>,
                                id: "BRNAME",
                                accessor: "BRNAME",
                                width: 170,
                                Cell: ({ value }) => (
                                    <div style={{ float: "left" }} className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.CONTRACTNO}</div>,
                                id: "CONTRACTNO",
                                accessor: "CONTRACTNO",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.CONTRACTDATE}</div>,
                                id: "CONTRACTDATE",
                                accessor: "CONTRACTDATE",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("AREADES", this.props.language)]}</div>,
                                id: getExtensionByLang("AREADES", this.props.language),
                                accessor: getExtensionByLang("AREADES", this.props.language),
                                // id: "AREADES",
                                // accessor: "AREADES",
                                width: 115,
                                Cell: ({ value }) => (
                                    <div style={{ float: "left" }} className="col-left">{value}</div>
                                )
                            },
                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("REROLEDES", this.props.language)]}</div>,
                            //     id: getExtensionByLang("REROLEDES", this.props.language),
                            //     accessor: getExtensionByLang("REROLEDES", this.props.language),
                            //     width: 140,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TYPENAME}</div>,
                                id: "TYPENAME",
                                accessor: "TYPENAME",
                                width: 160,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("REPRODUCTDES", this.props.language)]}</div>,
                                id: getExtensionByLang("REPRODUCTDES", this.props.language),
                                accessor: getExtensionByLang("REPRODUCTDES", this.props.language),
                                width: 104,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings.EFFDATE}</div>,
                            //     id: "EFFDATE",
                            //     accessor: "EFFDATE",
                            //     width: 80,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },

                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings.EXPDATE}</div>,
                            //     id: "EXPDATE",
                            //     accessor: "EXPDATE",
                            //     width: 80,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },
                            // {
                            //     Header: props => <div className="wordwrap">Định mức MG</div>,
                            //     id: "THRESHOLD",
                            //     accessor: "THRESHOLD",
                            //     width: 80,
                            //     Cell: ({ value }) => (
                            //         <div className="col-right">{value}</div>
                            //     )
                            // },
                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings.CONTRACTNO}</div>,
                            //     id: "CONTRACTNO",
                            //     accessor: "CONTRACTNO",
                            //     width: 80,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },
                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings.CONTRACTDATE}</div>,
                            //     id: "CONTRACTDATE",
                            //     accessor: "CONTRACTDATE",
                            //     width: 80,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TRANGTHAIDES}</div>,
                                id: "TRANGTHAIDES",
                                accessor: "TRANGTHAIDES",
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("STATUSDES", this.props.language)]}</div>,
                                id: getExtensionByLang("STATUSDES", this.props.language),
                                accessor: getExtensionByLang("STATUSDES", this.props.language),
                                width: 105,
                                Cell: (row) => (
                                    <span className="col-left">

                                        <span style={{

                                            color:
                                                row.original.STATUS == "A" ? 'rgb(0, 255, 247)' : row.original.STATUS == "P" ? 'rgb(230, 207, 17)' : row.original.STATUS == "R" ? 'rgb(230, 207, 17)'
                                                    : 'rgb(162, 42, 79)',
                                            transition: 'all .3s ease'
                                        }}>
                                            &#x25cf;
                                          </span> {
                                            row.value
                                        }
                                    </span>
                                ),
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
                        data={data} // truyen data da co qua 
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
                        loadDataAgain={this.refresh.bind(this)} //load lai data cho luoi
                        defaultPageSize={this.state.pagesize}
                        className="-striped -highlight"
                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                    // onPageChange={(pageIndex) => that.setState({
                    //     selectedRows: new Set(),
                    //     checkedAll: false
                    // })}
                    />
                </div>
            </div>
        );
    }
}
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    language: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('TableRE002'),

]);

module.exports = decorators(TableRE002);
