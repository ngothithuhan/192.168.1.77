import React, { Component } from 'react';
import ReactTable from "react-table";
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from './../../../../Helpers';
import ModalDetailImages from './ModalDetailImages';

class TableDuyetQLTK extends Component {
    constructor(props) {
        super(props);
        this.state = {
            p_iscflead: '',
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
            lang: this.props.language,

            //hiển thị modal chi tiết ảnh
            isShowModalDetailImages: false,
            dataModalDetailImages: [],
            isEditAccount: false
        }
        // this.fetchData = this.fetchData.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        console.log('this.state.lang::', this.state.lang)
        console.log('nextProps.currentLanguage::', nextProps.currentLanguage)
        console.log('nextProps.isLoad::', nextProps.isLoad)
        if (this.state.lang != nextProps.currentLanguage) {
            console.log('lang change')
            this.state.lang = nextProps.currentLanguage
            this.state.loading = true
            this.refReactTable.fireFetchData()
        }
        if (nextProps.isLoad) {
            this.reloadTable()
        }
    }
    componentDidMount() {
        //this.refresh()
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
        console.log('load table refresh')
        let self = this
        RestfulUtils.post('/account/getlistduyettk', { pagesize: this.state.pagesize, OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                console.log('load table refresh length:::', resData.DT.data.length)
                //console.log('sync success', resData)
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord, dataAll: resData.DT.dataAll })

            } else {

                toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });

            }
        });

    }

    async loadData(pagesize, page, keySearch, sortSearch, columns) {
        console.log('load table loadData:::')
        let that = this;
        await RestfulUtils.post('/account/getlistduyettk', { pagesize, page, keySearch, sortSearch, OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                console.log('load table loadData length:::', resData.DT.data.length)
                that.setState({
                    data: resData.DT.data,
                    dataAll: resData.DT.dataAll,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord,
                    colum: columns

                });
            }

        });

    }
    async reloadTable() {
        console.log('reloadTable:::')
        let { pagesize, page, keySearch, sortSearch } = this.state
        let that = this;
        await RestfulUtils.posttrans('/account/getlistduyettk', { pagesize, page, keySearch, sortSearch, OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                console.log('reloadTable data length :::', resData.DT.data.length)
                that.setState({
                    data: resData.DT.data,
                    dataAll: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord,
                    colum: columns

                });
            }

        });

    }
    handlEdit(data) {
        var that = this;
        that.props.showModalDetail("add", data);
    }
    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }

    handlBtnDetailImage = async (row) => {
        this.setState({
            ...this.state,
            isShowModalDetailImages: false,
            dataModalDetailImages: [],
            isEditAccount: false
        })

        //status = J -> chờ duyệt sửa
        //status = P -> chờ duyệt
        let isEditAccount = row.STATUS === 'J' ? true : false;
        let obj = {
            CUSTODYCD: row.CUSTODYCD ? row.CUSTODYCD : '',
            STATUS: "A",
            OBJNAME: 'UPLOADMANAGER', //UPLOADMANAGER
            language: this.props.language ? this.props.language : "vie"
        }
        let that = this;
        await RestfulUtils.post('/account/get_list_cfsign', obj).then((resData) => {
            if (resData.EC == 0) {
                that.setState({
                    ...that.state,
                    isShowModalDetailImages: true,
                    dataModalDetailImages: resData.DT && resData.DT.data ? resData.DT.data : [],
                    isEditAccount: isEditAccount
                })
            } else {
                that.setState({
                    ...that.state,
                    isShowModalDetailImages: false,
                    dataModalDetailImages: []
                });
                console.log('get_list_cfsign resData', resData)
                toast.error("Đã có lỗi xảy ra khi lấy danh sách ảnh", {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }
        });
    }

    onCloseModalDetailImages = () => {
        this.setState({
            ...this.state,
            isShowModalDetailImages: false,
            dataModalDetailImages: []
        })
    }

    render() {
        const { data, pages, loading, dataTest, isShowModalDetailImages, dataModalDetailImages } = this.state;
        console.log('dataRows:', this.state.dataAll);
        console.log('colum:', this.state.colum);
        console.log('data:', this.state.datapage);
        console.log('dataHeader:', this.state.strings);
        var that = this;
        return (
            <div>
                <div className="col-md-12" >
                    <div style={{ marginLeft: "-41px" }} className="col-md-10 ">
                        <ButtonExport style={{ marginLeft: "5px" }} HaveChk={true} dataRows={this.state.dataAll} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />
                    </div>
                    <div style={{ textAlign: "right", marginLeft: "3%" }} className="col-md-2">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}> <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                            <span className="ReloadButton" onClick={this.reloadTable.bind(this)}><i className="fas fa-sync-alt"></i></span>
                        </h5>
                    </div>
                </div>
                <div className="col-md-12" >
                    <ReactTable
                        columns={[

                            {
                                Header: props => <div className="wordwrap">  </div>,
                                maxWidth: 90,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>
                                        {/* ho tro lay dc dung hang danh click */}
                                        <button type="button" className="btn btn-primary" onClick={this.handlEdit.bind(this, row.original)}>  <a style={{ color: "#ffffff", textDecoration: "none" }}>{this.props.strings.submit}</a></button>

                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
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
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.BIRTHDATE}</div>,
                                id: "BIRTHDATE",
                                accessor: "BIRTHDATE",
                                width: 80,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("CUSTTYPE_DESC", this.props.language)]}</div>,
                                id: getExtensionByLang("CUSTTYPE_DESC", this.props.language),
                                accessor: getExtensionByLang("CUSTTYPE_DESC", this.props.language),
                                width: 79,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ADDRESS}</div>,
                                id: "ADDRESS",
                                accessor: "ADDRESS",
                                width: 250,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.MOBILE}</div>,
                                id: "MOBILE",
                                accessor: "MOBILE",
                                width: 90,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.EMAIL}</div>,
                                id: "EMAIL",
                                accessor: "EMAIL",
                                width: 200,
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
                                Header: props => <div className="wordwrap">{this.props.strings.MAKER_EDIT}</div>,
                                id: "MAKER_EDIT",
                                accessor: "MAKER_EDIT",
                                width: 115

                                ,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
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
                                Header: props => <div className="wordwrap">{this.props.strings.OPNDATE}</div>,
                                id: "OPNDATE",
                                accessor: "OPNDATE",
                                width: 115

                                ,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.VSDSTATUS}</div>,
                                id: "VSDSTATUS",
                                accessor: "VSDSTATUS",
                                width: 150

                                ,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">  </div>,
                                maxWidth: 90,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>
                                        <button type="button"
                                            className="btn btn-primary"
                                            onClick={this.handlBtnDetailImage.bind(this, row.original)}>
                                            <a style={{ color: "#ffffff", textDecoration: "none" }}>
                                                {this.props.strings.detailImage}
                                            </a>
                                        </button>

                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
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
                <ModalDetailImages
                    onClose={this.onCloseModalDetailImages}
                    isShow={isShowModalDetailImages}
                    dataModal={dataModalDetailImages}
                    isEditAccount={this.state.isEditAccount}
                />
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
    translate('TableDuyetQLTK')
]);

module.exports = decorators(TableDuyetQLTK);