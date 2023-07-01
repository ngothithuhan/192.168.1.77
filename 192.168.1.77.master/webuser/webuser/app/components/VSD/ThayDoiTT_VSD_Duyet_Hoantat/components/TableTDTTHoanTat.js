import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { getPageTextTable, getRowTextTable, getExtensionByLang } from '../../../../Helpers';
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'


class TableTDTTHoanTat extends Component {
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
            pagesize: 10,
            keySearch: {},
            sortSearch: {},
            page: 1,
            lang: this.props.language
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
        //console.log("hadledit: ", data)
        this.props.showModalDetail("update", data);
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.lang != nextProps.currentLanguage) {
            this.state.lang = nextProps.currentLanguage
            this.state.loading = true
            this.refReactTable.fireFetchData()
        }
    }
    refresh = () => {

        let self = this
        RestfulUtils.posttrans('/account/getlistchangeinfocus', { pagesize: this.state.pagesize, language: this.props.language,OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                console.log('resData.DT.data',resData.DT.data)
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord, dataALL: resData.DT.resultAll })
            }
        });
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
    reloadTable() {
        this.refresh();
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
    async loadData(pagesize, page, keySearch, sortSearch, columns) {
        let that = this;
        await RestfulUtils.post('/account/getlistchangeinfocus', { pagesize, page, keySearch, sortSearch, language: this.props.language,OBJNAME: this.props.OBJNAME }).then(resData => {
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

    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    render() {
        const { data, pages, loading } = this.state;
        var that = this;
        return (
            <div>
                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                        <ButtonExport style={{ marginLeft: "7px" }} HaveChk={true} dataRows={this.state.dataALL} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />
                    </div>
                    <div style={{ textAlign: "right" }} className="col-md-2 RightInfo">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}> <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                            <span className="ReloadButton" onClick={this.reloadTable.bind(this)}><i className="fas fa-sync-alt"></i></span>
                        </h5>
                    </div>
                </div>

                <div className="col-md-12" >
                    <ReactTable
                        columns={[
                            {
                                Header: props => <div className=" header-react-table">  </div>,
                                maxWidth: 80,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>
                                        <button style={{ textDecoration: 'none' }} type="button" className="btn btn-primary" onClick={this.handlEdit.bind(this, row.original)}>  <a style={{ color: "#ffffff" }} id={"submit" + row.index}>{this.props.strings.submit}</a></button>

                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            {
                                Header: props => <div className="" id="lblcustodycd">{this.props.strings.CUSTODYCD}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                width: 96,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="" id="lblcustodycd">{this.props.strings.DBCODE}</div>,
                                id: "DBCODE",
                                accessor: "DBCODE",
                                width: 96,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="" id="lblold_idcode">{this.props.strings.OLD_IDCODE}</div>,
                                id: "OLD_IDCODE",
                                accessor: "OLD_IDCODE",
                                width: 82,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="" id="lblold_iddate">{this.props.strings.OLD_IDDATE}</div>,
                                id: "OLD_IDDATE",
                                accessor: "OLD_IDDATE",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="" id="lblold_idplace">{this.props.strings.OLD_IDPLACE}</div>,
                                id: "OLD_IDPLACE",
                                accessor: "OLD_IDPLACE",
                                width: 200,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblold_bankacc">{this.props.strings.OLD_BANKACC}</div>,
                                id: "OLD_BANKACC",
                                accessor: "OLD_BANKACC",
                                width: 115,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="" id="lblold_bankname">{this.props.strings[getExtensionByLang("OLD_BANKNAME", this.props.language)]}</div>,
                                id: getExtensionByLang("OLD_BANKNAME", this.props.language),
                                accessor: getExtensionByLang("OLD_BANKNAME", this.props.language),
                                width: 230,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            /*
                            {
                                Header: props => <div className="" id="lblold_citybank">{this.props.strings.OLD_CITYBANKNAME}</div>,
                                id: "OLD_CITYBANKNAME",
                                accessor: "OLD_CITYBANKNAME",
                                width: 200,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
*/
                            {
                                Header: props => <div className="" id="lblnew_idcode">{this.props.strings.NEW_IDCODE}</div>,
                                id: "NEW_IDCODE",
                                accessor: "NEW_IDCODE",
                                width: 120,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="" id="lblnew_iddate">{this.props.strings.NEW_IDDATE}</div>,
                                id: "NEW_IDDATE",
                                accessor: "NEW_IDDATE",
                                width: 98,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="" id="lblnew_idplace">{this.props.strings.NEW_IDPLACE}</div>,
                                id: "NEW_IDPLACE",
                                accessor: "NEW_IDPLACE",
                                width: 200,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblnew_bankacc">{this.props.strings.NEW_BANKACC}</div>,
                                id: "NEW_BANKACC",
                                accessor: "NEW_BANKACC",
                                width: 115,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="" id="lblnew_bankname">{this.props.strings[getExtensionByLang("NEW_BANKNAME", this.props.language)]}</div>,
                                id: getExtensionByLang("NEW_BANKNAME", this.props.language),
                                accessor: getExtensionByLang("NEW_BANKNAME", this.props.language),
                                width: 230,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="" id="lblnew_citybank">{this.props.strings.NEW_CITYBANKNAME}</div>,
                                id: "NEW_CITYBANKNAME",
                                accessor: "NEW_CITYBANKNAME",
                                width: 175,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
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
                        //loading={loading} // Display the loading overlay when we need it
                        onFetchData={this.fetchData.bind(this)}
                        data={data}
                        style={{
                            maxHeight: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                        }}

                        pageText={getPageTextTable(this.props.language)}
                        rowsText={getRowTextTable(this.props.language)}
                        getTrProps={this.onRowClick.bind(this)}
                        previousText={<i className="fas fa-backward"></i>}
                        nextText={<i className="fas fa-forward"></i>}
                        //loadingText="Đang tải..."
                        ofText="/"
                        defaultPageSize={this.state.pagesize}
                        showModalDetail={this.state.showModalDetail}
                        className="-striped -highlight"
                        ref={(refReactTable) => { this.refReactTable = refReactTable }}
                    />
                </div>
            </div>
        );
    }
}

TableTDTTHoanTat.defaultProps = {

    strings: {
        tkgd: 'Số TKGD',
        fullname: 'Họ tên',
        ĐKSH: 'Số ĐKSH',
        iddate: 'Ngày cấp',
        idplace: 'Nơi cấp',
        pageText: 'Trang',
        rowsText: 'bản ghi',
        textNodata: 'Không có kết quả',
        vsdstatus: 'Trạng thái VSD',

    },


};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    language: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('TableTDTTHoanTat')
]);

module.exports = decorators(TableTDTTHoanTat);
