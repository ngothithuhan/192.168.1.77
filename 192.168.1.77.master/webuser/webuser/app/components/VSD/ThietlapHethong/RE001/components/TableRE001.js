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
class TableRE001 extends Component {
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
            lang: this.props.language
        }
        // this.fetchData = this.fetchData.bind(this);
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
        RestfulUtils.post('/user/getlistsalegroups', { pagesize: this.state.pagesize, language: this.props.language,OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                //console.log('sync success', resData)
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord, dataALL: resData.DT.dataAll })

            } else {
                toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
            }
        });

    }

    async loadData(pagesize, page, keySearch, sortSearch, columns) {
    
        let that = this;
        await RestfulUtils.post('/user/getlistsalegroups', { pagesize, page, keySearch, sortSearch, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0)

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
                        BRANCHID :'',
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
        await RestfulUtils.posttrans('/user/getlistsalegroups', { pagesize: that.state.pagesize, page: that.state.page, keySearch: that.state.keySearch, sortSearch: that.state.sortSearch, language: that.props.language, OBJNAME:this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0)

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
        });
    }
    render() {
        const { data, pages, loading, dataTest } = this.state;
        var that = this;
        return (
            <div>
                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                        <ButtonAdd data={this.props.datapage} onClick={this.handleAdd.bind(this)} />
                        <ButtonDelete style={{ marginLeft: "5px" }} onClick={this.delete} data={this.props.datapage} />
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
                                Header: props => <div className=" ">  <Checkbox checked={that.state.checkedAll} style={{ marginBottom: "14px" }} onChange={that.handleChangeALL.bind(that)} inline /></div>,
                                maxWidth: 45,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>
                                        <Checkbox style={{ textAlign: "center", marginLeft: "-1px", marginTop: "-14px" }}
                                            checked={that.state.selectedRows.has(row.original.AUTOID)}
                                            onChange={that.handleChange.bind(that, row)} inline
                                        />
                                        <span onClick={that.handlEdit.bind(that, row.original)} className="glyphicon glyphicon-pencil"></span>
                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.GRLLEVEL}</div>,
                                id: "GRLLEVEL",
                                accessor: "GRLLEVEL",
                                width: 70,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.PRGRPNAME}</div>,
                                id: "PRGRPNAME",
                                accessor: "PRGRPNAME",
                                width: 180,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.AUTOID}</div>,
                                id: "AUTOID",
                                accessor: "AUTOID",
                                width: 78,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.FULLNAME}</div>,
                                id: "FULLNAME",
                                accessor: "FULLNAME",
                                width: 135,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.BRANCHID}</div>,
                                id: "BRANCHID",
                                accessor: "BRANCHID",
                                width: 135,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.MANAGERTLNAME}</div>,
                                id: "MANAGERTLNAME",
                                accessor: "MANAGERTLNAME",
                                width: 180,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TLFULLNAME}</div>,
                                id: "TLFULLNAME",
                                accessor: "TLFULLNAME",
                                width: 180,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings.RATEAMT}</div>,
                            //     id: "RATEAMT",
                            //     accessor: "RATEAMT",
                            //     width: 94,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left" style={{ float: "left" }}>{value}</div>
                            //     )
                            // },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.RATECOMM}</div>,
                                id: "RATECOMM",
                                accessor: "RATECOMM",
                                width: 91,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.EFFDATE}</div>,
                                id: "EFFDATE",
                                accessor: "EFFDATE",
                                width: 80,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.EXPDATE}</div>,
                                id: "EXPDATE",
                                accessor: "EXPDATE",
                                width: 80,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">Định mức nhóm</div>,
                                id: "GROUPTHRESHOLD",
                                accessor: "GROUPTHRESHOLD",
                                width: 80,
                                Cell: ({ value }) => (
                                    <div className="col-right">{value}</div>
                                )
                            },
                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings.ISSALEOFSELF}</div>,
                            //     id: "ISSALESOFSELF",
                            //     accessor: "ISSALESOFSELF",
                            //     width: 80,
                            //     Cell: ({ value }) => (
                            //         <div className="col-right">{value == 'Y' ? this.props.strings.YES : this.props.strings.NO}</div>
                            //     )
                            // },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("STATUSDES", this.props.language)]}</div>,
                                id: getExtensionByLang("STATUSDES", this.props.language),
                                accessor: getExtensionByLang("STATUSDES", this.props.language),
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
                                width: 131

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
    language: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('TableRE001')
]);

module.exports = decorators(TableRE001);
