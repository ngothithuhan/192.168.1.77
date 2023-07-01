import React, { Component } from 'react';
import ReactTable from "react-table";
import { ButtonAdd, ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from '../../../../../Helpers';

class TableRE004 extends Component {
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
            lang: this.props.language
        }
        // this.fetchData = this.fetchData.bind(this);
    }
    componentDidMount() {
        this.refresh()
    }
    handleAdd(evt) {
        var that = this;
        that.props.showModalDetail("add");
    }
    handlEdit(AUTOID) {
        this.props.showModalDetail("update", AUTOID);
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
    componentWillReceiveProps(nextProps) {
        if (this.state.lang != nextProps.currentLanguage) {
            this.state.lang = nextProps.currentLanguage
            this.state.loading = true
            this.refReactTable.fireFetchData()
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
        RestfulUtils.post('/user/getlistsalecustomers', { pagesize: this.state.pagesize, language: this.props.language , OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord, dataAll: resData.DT.dataAll })
            } else {

                toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });

            }
        });

    }
    async loadData(pagesize, page, keySearch, sortSearch, columns) {
       
        let that = this;
        await RestfulUtils.post('/user/getlistsalecustomers', { pagesize, page, keySearch, sortSearch, language: this.props.language ,  OBJNAME: this.props.OBJNAME}).then(resData => {
          
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
                    //console.log('value ', value)

                    let success = null;
                    let datadelete = {
                        ...data[0],
                        language: this.props.language,
                        objname: this.props.OBJNAME
                    }

                    resolve(RestfulUtils.post('/user/deletesalecustomers', datadelete)
                        .then(res => {
                            i += 1
                            success = (res.data.EC == 0);

                            success ? toast.success(this.props.strings.cancelacc + value + this.props.strings.successtitle, { position: toast.POSITION.BOTTOM_RIGHT })
                                : toast.error(this.props.strings.cancelacc + value + this.props.strings.failtitle + res.data.EM, { position: toast.POSITION.BOTTOM_RIGHT })
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
    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    reloadTable(){
        this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch)
    }
    render() {
        const { data, pages, loading, dataTest } = this.state;
        var that = this;
        return (
            <div>
         
                    <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                            <ButtonAdd style={{ marginLeft: "5px" }} data={this.props.datapage} onClick={this.handleAdd.bind(this)} />
                            <ButtonExport style={{ marginLeft: "5px" }} HaveChk={false} dataRows={this.state.dataAll} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />

                        </div>
                        <div style={{ textAlign: "right" }} className="col-md-2 RightInfo">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}>
                            <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                            <span className="ReloadButton" onClick={this.reloadTable.bind(this)}><i className="fas fa-sync-alt"></i></span>
                        </h5>
                    </div>
                    </div>
                    {/* <ButtonDelete style={{ marginLeft: "5px" }} onClick={this.delete} data={this.props.datapage} /> */}
                

                <div className="col-md-12" >
                    <ReactTable
                        columns={[
                            // {
                            //     Header: props => <div className=" header-react-table">    <Checkbox checked={that.state.checkedAll} style={{ marginBottom: "14px", marginLeft: "8px" }} onChange={that.handleChangeALL.bind(that)} inline /></div>,
                            //     maxWidth: 70,
                            //     sortable: false,
                            //     style: { textAlign: 'center' },
                            //     Cell: (row) => (
                            //         <div>
                            //             <Checkbox style={{ textAlign: "center", marginLeft: "10px", marginTop: "-14px" }}
                            //                 checked={that.state.selectedRows.has(row.original.AUTOID)}
                            //                 onChange={that.handleChange.bind(that, row)} inline
                            //             />
                            //             <span onClick={that.handlEdit.bind(that, row.original)} className="glyphicon glyphicon-pencil" id={"pencil" + row.index}></span>
                            //         </div>
                            //     ),
                            //     Filter: ({ filter, onChange }) =>
                            //         null
                            // },
                            // {
                            //     Header: props => <div className=" header-react-table">  </div>,
                            //     maxWidth: 90,
                            //     sortable: false,
                            //     style: { textAlign: 'center' },
                            //     Cell: (row) => (
                            //         <div>
                            //             <button style={{textDecoration: 'none'}}type="button" className="btn btn-primary" onClick={this.handlEdit.bind(this, row.original)}>  <a  style={{color:"#ffffff"}}>Thực hiện</a></button>

                            //         </div>
                            //     ),
                            //     Filter: ({ filter, onChange }) =>
                            //         null
                            // },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.REFACCTNO}</div>,
                                id: "REFACCTNO",
                                accessor: "REFACCTNO",
                                width: 115,
                                Cell: ({ value }) => (
                                    <div className="" style={{ textAlign: "center" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.FULLNAME}</div>,
                                id: "FULLNAME",
                                accessor: "FULLNAME",
                                width: 180,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TLNAME}</div>,
                                id: "TLNAME",
                                accessor: "TLNAME",
                                width: 250,
                                Cell: ({ value }) => (
                                    <div style={{ float: "left" }} className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TLFULLNAME}</div>,
                                id: "TLFULLNAME",
                                accessor: "TLFULLNAME",
                                width: 250,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TYPENAME}</div>,
                                id: "TYPENAME",
                                accessor: "TYPENAME",
                                width: 250,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("REROLEDES", this.props.language)]}</div>,
                            //     id: getExtensionByLang("REROLEDES", this.props.language),
                            //     accessor: getExtensionByLang("REROLEDES", this.props.language),
                            //     width: 170,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },
                            // {
                            //     Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("REPRODUCTDES", this.props.language)]}</div>,
                            //     id: getExtensionByLang("REPRODUCTDES", this.props.language),
                            //     accessor: getExtensionByLang("REPRODUCTDES", this.props.language),
                            //     width: 170,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left">{value}</div>
                            //     )
                            // },
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
    translate('TableRE004'),

]);

module.exports = decorators(TableRE004);
