import React, { Component } from 'react';
import ReactTable from "react-table";
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from '../../../../../Helpers';

class TableQLUserTheoNhomNSD extends Component {
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
            page: 1
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
    handlEdit(data) {
        var that = this;
        that.props.showModalDetail("update", data);
    }
    handleChangeALL(evt) {
        var that = this;
        this.setState({ checkedAll: evt.target.checked });
        if (evt.target.checked) {
            that.state.data.map(function (item) {
                if (!that.state.selectedRows.has(item.ID)) {
                    that.state.unSelectedRows.push(item.ID);
                    that.state.selectedRows.add(item.ID);
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

        if (!this.state.selectedRows.has(row.original.ID))
            this.state.selectedRows.add(row.original.ID);
        else {
            this.state.selectedRows.delete(row.original.ID);
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
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.ID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.ID) ? 'black' : '',
            }

        }
    }
    fetchData(state, instance) {
        // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
        // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
        var that = this;
        // this.setState({ loading: true });

        // console.log('filer',state.filtered);
        // console.log('sort',state.sorted);
        // Request the data however you want.  Here, we'll use our mocked service we created earlier
        if (this.state.loading) {
            let { pageSize, page, filtered, sorted } = state;
            this.loadData(pageSize, page + 1, filtered, sorted, instance.props.columns);
        }
        this.setState({ loading: true })
    }
    refresh = () => {
        let self = this
        RestfulUtils.post('/user/getlistgruser', { pagesize: this.state.pagesize, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                //console.log('sync success', resData)
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord })

            } else {

                toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });

            }
        });

    }

    async loadData(pagesize, page, keySearch, sortSearch, columns) {
        let that = this;
        await RestfulUtils.post('/user/getlistgruser', { pagesize, page, keySearch, sortSearch, language: this.props.language , OBJNAME :this.props.OBJNAME}).then(resData=> {

            
                // console.log('datatable',resData)
                // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
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
                else {

                }
            
        });

    }



    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }

    reloadTable() {
        this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch)
    }
    render() {
        const { data, pages, loading, dataTest } = this.state;
        var that = this;
        return (
            <div>
                <div className="col-md-12" >
                    <div style={{ marginLeft: "-41px" }} className="col-md-10 ">
                        <ButtonExport HaveChk={false} dataRows={this.state.data} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />
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
                                Header: props => <div className="wordwrap">{this.props.strings.GRPID}</div>,
                                id: "GRPID",
                                accessor: "GRPID",
                                width: 54,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.GRPNAME}</div>,
                                id: "GRPNAME",
                                accessor: "GRPNAME",
                                width: 120,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("GRPTYPE_DESC", this.props.language)]}</div>,
                                id: getExtensionByLang("GRPTYPE_DESC", this.props.language),
                                accessor: getExtensionByLang("GRPTYPE_DESC", this.props.language),
                                width: 85,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TLID}</div>,
                                id: "TLID",
                                accessor: "TLID",
                                width: 80,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TLNAME}</div>,
                                id: "TLNAME",
                                accessor: "TLNAME",
                                width: 160,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TLFULLNAME}</div>,
                                id: "TLFULLNAME",
                                accessor: "TLFULLNAME",
                                width: 160,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.IDCODE}</div>,
                                id: "IDCODE",
                                accessor: "IDCODE",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.MOBILE}</div>,
                                id: "MOBILE",
                                accessor: "MOBILE",
                                width: 95,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.EMAIL}</div>,
                                id: "EMAIL",
                                accessor: "EMAIL",
                                width: 160,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.DEPARTMENT}</div>,
                                id: "DEPARTMENT",
                                accessor: "DEPARTMENT",
                                width: 90,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TLTITLE}</div>,
                                id: "TLTITLE",
                                accessor: "TLTITLE",
                                width: 82,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("MBNAME", this.props.language)]}</div>,
                                id: getExtensionByLang("MBNAME", this.props.language),
                                accessor:getExtensionByLang("MBNAME", this.props.language),
                                width: 186,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("BRNAME", this.props.language)]}</div>,
                                id: getExtensionByLang("BRNAME", this.props.language),
                                accessor: getExtensionByLang("BRNAME", this.props.language),
                                width: 160,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("AREANAME", this.props.language)]}</div>,
                                id: getExtensionByLang("AREANAME", this.props.language),
                                accessor: getExtensionByLang("AREANAME", this.props.language),
                                width: 82,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("STATUS_DESC", this.props.language)]}</div>,
                                id: getExtensionByLang("STATUS_DESC", this.props.language),
                                accessor: getExtensionByLang("STATUS_DESC", this.props.language),
                                width: 90,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
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
                        pageText= {getPageTextTable(this.props.language)}
                        rowsText={getRowTextTable(this.props.language)}
                        previousText={<i className="fas fa-backward"></i>}
                        nextText={<i className="fas fa-forward"></i>}
                        loadingText="Đang tải..."
                        ofText="/"
                        getTrProps={this.onRowClick.bind(this)}
                        defaultPageSize={this.state.pagesize}
                        className="-striped -highlight"
                    />
                </div>
            </div>
        );
    }
}

TableQLUserTheoNhomNSD.defaultProps = {

    strings: {
        custid: 'Mã ngân hàng',
        custiodycd: 'Tên ngân hàng',
        fullname: 'Giấy phép NHNN',
        iddate: 'Ngày cấp',
        opendate: 'Địa chỉ',
        idplace: 'Fax',
        place: 'Ghi chú',

    },


};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    language: state.language.language

});


const decorators = flow([
    connect(stateToProps),
    translate('TableQLUserTheoNhomNSD')
]);

module.exports = decorators(TableQLUserTheoNhomNSD);
