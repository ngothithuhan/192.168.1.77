import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { DefaultPagesize, getRowTextTable, getPageTextTable, getExtensionByLang } from 'app/Helpers'
// import { ButtonExport } from '../../../../../utils/buttonSystem/ButtonSystem'
import RestfulUtils from 'app/utils/RestfulUtils'
import NumberInput from 'app/utils/input/NumberInput';
import { requestData } from 'app/utils/ReactTableUlti';
import { Button, Checkbox } from 'react-bootstrap';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { showNotifi } from 'app/action/actionNotification.js';
import ModalMultiGanCNSaleConfirm from './ModalMultiGanCNSaleConfirm'

class TableCNSale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataTest: [],
            filteredData: [],
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
            firstRender: true,
            lang: this.props.lang,
            CUSTODYCD: { label: '', value: '' },
            SALEID: { label: '', value: '' },
            datagroup: {
                custodycd: '',
                saleid: '',
            },
            isSearch: false,
            checkFields: [
                { name: "custodycd", id: "cbCUSTODYCD" },
            ],

            showModalMultiConfirm: false,
            dataConfirmModal: [],
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
                p_txdate: 'ALL',
                language: this.props.lang,
                objname: this.props.datapage.OBJNAME,
                p_custodycd: this.state.datagroup["custodycd"] || 'ALL',
                p_saleid: this.state.datagroup["saleid"] || 'ALL',
            }
            RestfulUtils.posttrans('/fund/getlistsale_ordersmap', { data }).then((resData) => {

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
                            filteredData: resData.DT.data,
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
                    this.state.colum = instance.props.columns,
                    this.state.filteredData = res.filteredData,
                    this.state.checkedAll = false;
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
                res.unshift({ value: 'ALL', label: 'All-Tất cả' })
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

    getOptionsSALEID() {
        return RestfulUtils.post('/fund/getlistsale_roles_alt', { p_saleid: 'ALL', p_language: this.props.lang })
            .then((res) => {
                res.unshift({ value: 'ALL', label: 'All-Tất cả' })
                return { options: res };
            })
    }
    onChangeSALEID(e) {
        if (e) {
            if (this.state.datagroup["saleid"] != e.value) {
                this.state.datagroup["saleid"] = e.value
                this.state.SALEID = e
                this.state.isSearch = true
                this.setState(this.state);
            }
        }
    }

    handleChangeALL(e) {
        var that = this;
        this.setState({
            checkedAll: e.target.checked,
            selectedRows: new Set(),
            unSelectedRows: []
        });
        if (e.target.checked) {
            that.state.filteredData.map(function (item) {
                if (!that.state.selectedRows.has(item.ORDERID)) {
                    that.state.unSelectedRows.push(item.ORDERID);
                    that.state.selectedRows.add(item.ORDERID);
                }
            })
            that.setState({ selectedRows: that.state.selectedRows, unSelectedRows: that.state.unSelectedRows })
        }
        else {
            that.setState({ selectedRows: new Set(), unSelectedRows: [] })
        }
    }

    handleChange(row) {
        if (!this.state.selectedRows.has(row.original.ORDERID))
            this.state.selectedRows.add(row.original.ORDERID);
        else {
            this.state.selectedRows.delete(row.original.ORDERID);
        }
        this.setState({ selectedRows: this.state.selectedRows, checkedAll: false });
    }

    closeModalMultiConfirm = () => {
        this.setState({
            showModalMultiConfirm: false,
            dataConfirmModal: [],
        })
    }

    getDisplayConfirmData = () => {
        let { filteredData, selectedRows } = this.state;
        let displayData = [];
        selectedRows.forEach(item => {
            for (let i = 0; i < filteredData.length; i++) {
                if (filteredData[i].ORDERID === item) {
                    displayData.push(filteredData[i]);
                    break;
                }
            }
        })
        return displayData;
    }

    submit = () => {
        if (this.state.selectedRows.size > 0) {
            let dataConfirmModal = this.getDisplayConfirmData();
            this.setState({
                showModalMultiConfirm: true,
                dataConfirmModal,
            })
        } else {
            toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT });
        }
    }

    search() {
        // var mssgerr = '';
        // for (let index = 0; index < this.state.checkFields.length; index++) {
        //     const element = this.state.checkFields[index];
        //     mssgerr = this.checkValid(element.name, element.id);
        //     if (mssgerr !== '')
        //         break;
        // }
        // if (mssgerr == '') {
        if (this.state.isSearch == true) {
            this.state.firstRender = true
            this.state.isSearch = false
            this.refReactTable.fireFetchData()
        }
        // }

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
        const { data, pages, pagesize, dataConfirmModal } = this.state;
        var that = this;
        return (
            <div>
                <ModalMultiGanCNSaleConfirm
                    OBJNAME={this.props.datapage.OBJNAME}
                    dataConfirmModal={dataConfirmModal}
                    showModalMultiConfirm={this.state.showModalMultiConfirm}
                    selectedRows={this.state.selectedRows}
                    closeModalMultiConfirm={this.closeModalMultiConfirm.bind(this)}
                    load={this.props.load}
                />

                <div className="row">
                    <div style={{ marginLeft: "-12px" }} className="col-md-12 ">
                        {/*
                        <ButtonExport style={{ marginLeft: "5px" }} dataRows={this.state.dataALL} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} HaveChk={true} />
                    */}
                        <div className="col-md-2 text-right">
                            <h5 className="highlight"><b>{this.props.strings.CUSTODYCD}</b></h5>
                        </div>
                        <div className="col-md-3 customSelect">
                            <Select.Async
                                name="form-field-name"
                                loadOptions={this.getOptions.bind(this)}
                                value={this.state.CUSTODYCD}
                                onChange={this.onChangeCUSTODYCD.bind(this)}
                                id="cbCUSTODYCD"
                                clearable={false}
                            />
                        </div>

                        <div className="col-md-1 text-right">
                            <h5 className="highlight"><b>{this.props.strings.BROKER}</b></h5>
                        </div>
                        <div className="col-md-3 customSelect">
                            <Select.Async
                                name="form-field-name"
                                loadOptions={this.getOptionsSALEID.bind(this)}
                                value={this.state.SALEID}
                                onChange={this.onChangeSALEID.bind(this)}
                                id="drdSALEID"
                                clearable={false}
                            />
                        </div>

                        <div className="col-md-2">
                            <Button style={{ fontSize: 12 }} bsStyle="" className="pull-left btndangeralt" id="btnsubmit" onClick={this.search.bind(this)}>{this.props.strings.search}</Button>
                        </div>

                    </div>
                </div>

                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 "></div>
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
                                Header: props => <div className=" header-react-table">    <Checkbox checked={that.state.checkedAll} style={{ marginBottom: "14px", marginLeft: "8px" }} onChange={that.handleChangeALL.bind(that)} inline /></div>,
                                maxWidth: 182,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>
                                        {/* <button type="button" className="btn btn-primary" onClick={that.handlEdit.bind(that, row.original)}>  <a style={{ color: "#ffffff" }}>{this.props.strings.submit}</a></button> */}
                                        <Checkbox style={{ textAlign: "center", marginLeft: "8px", marginTop: "-14px" }}
                                            checked={that.state.selectedRows.has(row.original.ORDERID)}
                                            onChange={that.handleChange.bind(that, row)} inline
                                        />
                                        {/*<span onClick={that.handlEdit.bind(that, row.original.CUSTID)} className="btn btn-primary"></span>*/}
                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TXDATE}</div>,
                                id: "TXDATE",
                                accessor: "TXDATE",
                                width: 80,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.CUSTODYCD}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                width: 108,
                                Cell: ({ value }) => (
                                    <div className="text-center" style={{ float: "center" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ORDERID}</div>,
                                id: "ORDERID",
                                accessor: "ORDERID",
                                width: 122,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.FULLNAME}</div>,
                                id: "FULLNAME",
                                accessor: "FULLNAME",
                                width: 200,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("SRTYPEDESC", this.props.lang)]}</div>,
                                //    id: "REPRODUCTDESC",
                                //     accessor: "REPRODUCTDESC",
                                id: getExtensionByLang("SRTYPEDESC", this.props.lang),
                                accessor: getExtensionByLang("SRTYPEDESC", this.props.lang),
                                width: 95,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.EXECTYPEDESC}</div>,
                                id: "EXECTYPEDESC",
                                accessor: "EXECTYPEDESC",
                                width: 95,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ORSTATUSDESC}</div>,
                                id: "ORSTATUSDESC",
                                accessor: "ORSTATUSDESC",
                                width: 200,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TRADINGDATE}</div>,
                                id: "TRADINGDATE",
                                accessor: "TRADINGDATE",
                                width: 95,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.ORDERAMT}</div>,
                                id: "ORDERAMT",
                                accessor: "ORDERAMT",
                                width: 90,
                                Cell: ({ value }) => (
                                    <div className="col-right">
                                        <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                    </div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.FEEAMT}</div>,
                                id: "FEEAMT",
                                accessor: "FEEAMT",
                                width: 98,
                                Cell: ({ value }) => (
                                    <div className="col-right">
                                        <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                    </div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TAXAMT}</div>,
                                id: "TAXAMT",
                                accessor: "TAXAMT",
                                width: 84,
                                Cell: ({ value }) => (
                                    <div className="col-right">
                                        <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                    </div>

                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.FEEMANAGE}</div>,
                                id: "FEEMANAGE",
                                accessor: "FEEMANAGE",
                                width: 98,
                                Cell: ({ value }) => (
                                    <div className="col-right">
                                        <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                    </div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TLNAME}</div>,
                                id: "TLNAME",
                                accessor: "TLNAME",
                                width: 217,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TLFULLNAME}</div>,
                                id: "TLFULLNAME",
                                accessor: "TLFULLNAME",
                                width: 136,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.TYPENAME}</div>,
                                id: "TYPENAME",
                                accessor: "TYPENAME",
                                width: 120,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("REROLEDESC", this.props.lang)]}</div>,
                                //  id: "REROLEDESC",
                                //  accessor: "REROLEDESC",
                                id: getExtensionByLang("REROLEDESC", this.props.lang),
                                accessor: getExtensionByLang("REROLEDESC", this.props.lang),
                                width: 135,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("REPRODUCTDESC", this.props.lang)]}</div>,
                                //    id: "REPRODUCTDESC",
                                //   accessor: "REPRODUCTDESC",
                                id: getExtensionByLang("REPRODUCTDESC", this.props.lang),
                                accessor: getExtensionByLang("REPRODUCTDESC", this.props.lang),
                                width: 106,
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

                <div className="col-md-12">
                    <input
                        type="button"
                        className="btn btn-primary"
                        onClick={this.submit}
                        style={{ float: 'right', marginRight: 15, marginTop: 10 }}
                        value={this.props.strings.submit}
                        id='btnSubmit'
                    />
                </div>

            </div>
        );
    }
}

TableCNSale.defaultProps = {

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
    translate('TableCNSale')
]);

module.exports = decorators(TableCNSale);
