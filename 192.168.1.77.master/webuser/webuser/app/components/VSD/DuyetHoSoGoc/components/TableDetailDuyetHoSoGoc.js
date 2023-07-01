import React, { Component } from 'react';
import ReactTable from "react-table";
//import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from './../../../../Helpers';

class TableDetailDuyetHoSoGoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            p_custid: '',
            p_custodycd: '',
            p_desc: '',
            pages: null,
            loading: true,
            checkedAll: false,
            selectedRows: new Set(),
            unSelectedRows: [],
            showModalAccess: false,
            showModalReview: false,
            CUSTID_DETAIL: '',
            pagesize: DefaultPagesize,
            keySearch: {},
            sortSearch: {},
            page: 1,
        }
        // this.fetchData = this.fetchData.bind(this);
    }

    async componentDidMount() {
        await this.setState({
            p_custid: this.props.dataAction.p_custid,
            p_custodycd: this.props.dataAction.p_custodycd,
            p_fullname:this.props.dataAction.p_fullname,
            p_status: this.props.dataAction.p_status,
        })
        await this.refresh()
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

        if (!this.state.selectedRows.has(row.original.CUSTODYCD))
            this.state.selectedRows.add(row.original.CUSTODYCD);
        else {
            this.state.selectedRows.delete(row.original.CUSTODYCD);
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
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTODYCD) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTODYCD) ? 'black' : '',
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
        RestfulUtils.posttrans('/account/getListDuyetHoSoGocDetail', { custid: this.state.p_custid,custodycd: this.state.p_custodycd, pagesize: this.state.pagesize, language: this.props.language, OBJNAME: this.props.objname }).then((resData) => {
            //console.log('sync success', resData)
            if (resData.EC == 0) {
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages })
            } else {
                toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
            }
        });

    }

    async loadData(pagesize, page, keySearch, sortSearch, columns) {

        let that = this;
        await RestfulUtils.posttrans('/account/getListDuyetHoSoGocDetail', { custid: this.state.p_custid,custodycd: this.state.p_custodycd, pagesize, page, keySearch, sortSearch, language: this.props.language, OBJNAME: this.props.objname }).then((resData) => {
            if (resData.EC == 0)
                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                });
        });

    }

    handlEdit(data) {
        var that = this;
        that.props.showModalDetail("add", data);
    }

    approve = () => {
        let datasend = {
            custid: this.state.p_custid,
            custodycd: this.state.p_custodycd,
            fullname: this.state.p_fullname,
            status: this.state.p_status,
            desc: this.state.p_desc,
            language: this.props.language,
            objname: this.props.objname
        }
        let success = null;
        //console.log('datasend ', datasend)
        RestfulUtils.post('/account/approvemanaacc', datasend)
            .then((res) => {
                if(res.EC==0) {
                    toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                    this.props.closeModalDetail()
                    this.props.loadWhenSuccess()
                }
                else {
                    toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                }
            })
    }
    // reject = () => {
    //     let datasend = {
    //         custid: this.state.p_custid,
    //         custodycd: this.state.p_custodycd,
    //         fullname: this.state.p_fullname,
    //         status: this.state.p_status,
    //         desc: this.state.p_desc,
    //         language: this.props.language,
    //         objname: this.props.objname
    //     }
    //     RestfulUtils.post('/account/rejectmanaacc', datasend)
    //         .then((res) => {
    //             if(res.EC==0) {
    //                 toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
    //                 this.props.closeModalDetail()
    //                 this.props.loadWhenSuccess()
    //             }
    //             else {
    //                 toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
    //             }
    //         })
    // }

    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    onChange(type, event) {

        if (event.target) {

            this.state[type] = event.target.value;
        }
        else {
            this.state[type] = event.value;
        }
        this.setState({
            p_desc: this.state.p_desc,
        })
    }
    render() {
        let disableWhenView = (this.props.access == 'view')
        const { data, pages, loading } = this.state;
        var that = this;
        return (
            <div>
                <div className="col-md-12" >
                    <div style={{ marginLeft: "-41px" }} className="col-md-5">
                        {/* <b>{this.props.strings.desc}</b> */}
                        <input style={{fontSize: 11 }} maxLength='200' placeholder={this.props.strings.desc} value={this.state.p_desc} onChange={this.onChange.bind(this, "p_desc")} className="form-control" id="txtdesc" disabled={disableWhenView} />
                    </div>
                    <div className="col-md-3">
                    </div>
                    <div style={{ textAlign: "right", marginLeft: "4%", right: '-37px' }} className="col-md-4">
                        <button disabled={disableWhenView} style={{ marginRight: "5px", fontSize: 11 }} className="btn btn-primary" onClick={this.approve}><span className="glyphicon glyphicon-ok"></span> {this.props.strings.approvebtn}</button>
                        {/* <button disabled={disableWhenView} style={{ marginRight: "5px", fontSize: 11 }} className="btn btn-default" onClick={this.reject}><span className="glyphicon glyphicon-minus" onClick={this.reject}></span> {this.props.strings.rejectbtn}</button> */}
                    </div>
                </div>
                <div className="col-md-12" >
                    <ReactTable
                        columns={[
                            // {
                            //     // Header: props => <div className="wordwrap">  </div>,
                            //     // maxWidth: 90,
                            //     // sortable: false,
                            //     // style: { textAlign: 'center' },
                            //     // Cell: (row) => (
                            //     //     <div>
                            //     //         {/* ho tro lay dc dung hang danh click */}
                            //     //         <button type="button" className="btn btn-primary" onClick={this.handlEdit.bind(this, row.original)}>  <a style={{ color: "#ffffff", textDecoration: "none" }}>{this.props.strings.submit}</a></button>

                            //     //     </div>
                            //     // ),
                            //     // Filter: ({ filter, onChange }) =>
                            //     //     null

                            //     Header: props => <div className=""><Checkbox checked={this.state.checkAll} onChange={this.handleChangeAll} /></div>,
                            //     Cell: (row) => (
                            //         <div>
                            //             <Checkbox checked={this.state.selectedRows.has(row.original.CUSTODYCD)} onChange={this.handleChangeRow.bind(this, row)} />
                            //         </div>
                            //     ),
                            //     sortable: false,
                            //     width: 40,
                            //     Filter: ({ filter, onChange }) =>
                            //         null
                            // },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.CUSTODYCD}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                width: 90,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.FULLNAME}</div>,
                                id: "FULLNAME",
                                accessor: "FULLNAME",
                                width: 220,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.IDCODE}</div>,
                                id: "IDCODE",
                                accessor: "IDCODE",
                                width: 77,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.IDDATE}</div>,
                                id: "IDDATE",
                                accessor: "IDDATE",
                                width: 80,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.IDPLACE}</div>,
                                id: "IDPLACE",
                                accessor: "IDPLACE",
                                width: 200,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings.BIRTHDATE}</div>,
                            //     id: "BIRTHDATE",
                            //     accessor: "BIRTHDATE",
                            //     width: 80,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },

                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("CUSTTYPE_DESC", this.props.language)]}</div>,
                            //     id: getExtensionByLang("CUSTTYPE_DESC", this.props.language),
                            //     accessor: getExtensionByLang("CUSTTYPE_DESC", this.props.language),
                            //     width: 79,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ADDRESS}</div>,
                                id: "ADDRESS",
                                accessor: "ADDRESS",
                                width: 250,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings.MOBILE}</div>,
                            //     id: "MOBILE",
                            //     accessor: "MOBILE",
                            //     width: 90,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },
                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings.EMAIL}</div>,
                            //     id: "EMAIL",
                            //     accessor: "EMAIL",
                            //     width: 200,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("CFSTATUS_DESC", this.props.language)]}</div>,
                                id: getExtensionByLang("CFSTATUS_DESC", this.props.language),
                                accessor: getExtensionByLang("CFSTATUS_DESC", this.props.language),
                                width: 150,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.DATEMAKER}</div>,
                                id: "DATEMAKER",
                                accessor: "DATEMAKER",
                                width: 110,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.MAKER}</div>,
                                id: "MAKER",
                                accessor: "MAKER",
                                width: 110,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.DATEMAKER_EDIT}</div>,
                                id: "DATEMAKER_EDIT",
                                accessor: "DATEMAKER_EDIT",
                                width: 110,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.MAKER_EDIT}</div>,
                                id: "MAKER_EDIT",
                                accessor: "MAKER_EDIT",
                                width: 115
                                ,
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
    translate('TableDetailDuyetHoSoGoc')
]);

module.exports = decorators(TableDetailDuyetHoSoGoc);
