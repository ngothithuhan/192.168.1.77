import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import { ButtonAdd, ButtonExport, ButtonDelete } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import NumberFormat from 'react-number-format';
import DropdownUtils from 'app/utils/input/DropdownUtils';
var Select = require('react-select');
import { Collapse, Well } from 'react-bootstrap'
import ModalTimKiemFullname from 'app/utils/Dialog/ModalTimKiemFullname.js'
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from '../../../../Helpers';

class TableTruyVanThongTinSoDuNAV extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModalSearch: false,
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
            lang: this.props.language,
            dataOrder: [],
            sumBALANCEAMT: 0,
            sumBLOCKEDAMT: 0,
            sumRECEIVINGAMT: 0,
            sumORDERAMT: 0,
            dataSoDu: [],
            listCareBy: [],
            collapse: {
                tienkhadung: false,
                tienphongtoa: false,
                tienbanchove: false,
                tienmua: false,
                soduccq: true,
            },

            isFirstLoad: true,
            CUSTODYCD: { label: '', value: '' },
            defaultValueCustomer: '',
            datamock: [{
                CUSTODYCD: "1",
                SYMBOL: "2",
                SRTYPE_DESC: "3",
                PRODUCT: "4",
                ORDAMT: "5",
                STATUS_DESC: "6",
                MATCHAMT: "7",
                EXAMT: "8",
                MISSAMT: "9",
                AMOUNT: "10",
            }]
        }
    }
    collapse(tab) {
        this.state.collapse[tab] = !this.state.collapse[tab];
        this.setState({ collapse: this.state.collapse })
    }
    componentWillReceiveProps(nextProps) {
        this.state.username = nextProps.username;
        let ISCUSTOMER = this.props.ISCUSTOMER;
        console.log('componentWillReceiveProps customer:', ISCUSTOMER)
        //this.setListOptionPention();
        if (this.state.lang != nextProps.currentLanguage) {
            this.state.lang = nextProps.currentLanguage
            this.state.loading = true
            //this.setListOptionPention();
            this.refReactTable.fireFetchData()
        }
        if (nextProps.isrefresh) {
            //this.setListOptionPention();
            //this.refresh()
            this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch);
            this.loadDataOrderAmt(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch);
            this.loadDataSoDu(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch);

        }
    }
    // async getOptionsSelect(type, input) {
    //     return { options: this.state.listOptionSelect[type] }
    // }
    onChangeSelect(type, e) {
        console.log('e:', type, e)
        if (e) {
            this.state.isFirstLoad = false;
            this.state[type] = e;
            this.refresh();
            this.setState({ state: this.state });

        }
        else {
            this.state.isFirstLoad = true;
            this.state[type] = '';
            this.refresh();

            this.setState({ state: this.state });

        }
    }
    onChangeDropdown(type, e) {
        this.state.isFirstLoad = false;
        this.state[type] = e.value;
        this.refresh();

        this.setState({ state: this.state });
    }
    async getgroupcareby() {
        let self = this;
        await RestfulUtils.post('/account/getcarebygroupbytlid', { OBJNAME: this.props.datapage.OBJNAME, language: this.props.currentLanguage })
            .then((res) => {
                if (res.EC == 0) {
                    let tmp = [];
                    var i;
                    if (res.DT.length > 0) {
                        for (i = 0; i < res.DT.length; i++) {
                            tmp.push(res.DT[i].GRPID)
                        }
                        console.log('tmp  :========', tmp)
                        self.setState({ listCareBy: tmp })
                    }

                }
            })
        console.log('listcareby1 :======', this.state.listCareBy)
    }
    getOptionsCustody(input) {

        let self = this;
        let username = this.state.username;
        let ISCUSTOMER = this.props.ISCUSTOMER;
        if (ISCUSTOMER) {
            console.log('is customer')
            var defaultCustodyCd = this.props.auth.user.USERID;
            console.log('defaultCustodyCd:', defaultCustodyCd)
            // var listOptionSelect = {};
            // listOptionSelect['CUSTODYCD'] = [{ label: defaultCustodyCd, value: defaultCustodyCd }];
            // self.state.CUSTODYCD = defaultCustodyCd;
            // self.setState({ listOptionSelect: listOptionSelect })
            // console.log('listOptionSelect CUSTODYCD:', listOptionSelect['CUSTODYCD'])
            // return { options: listOptionSelect['CUSTODYCD'] };
            return RestfulUtils.post('/account/search_all',  { key: input })
                .then((res) => {
                    if (res && res.length > 0) {
                        self.setState({ CUSTODYCD: { label: defaultCustodyCd, value: defaultCustodyCd } })
                        return { options: res };
                    }
                    return { options: [] };
                })
        } else {
            return RestfulUtils.post('/account/search_all', { key: input })
                .then((res) => {
                    let j = 0;
                    for (j = 0; j < res.length; j++) {
                        res[j] = { label: res[j].label + ' - ' + res[j].detail.FULLNAME, value: res[j].value }
                    }
                    if (res && res.length > 0) {
                        return { options: res };
                    }
                    return { options: [] };
                })

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
                setTimeout(() => resolve(
                    this.loadData(pageSize, page + 1, filtered, sorted),
                    this.loadDataOrderAmt(pageSize, page + 1, filtered, sorted),
                    this.loadDataSoDu(pageSize, page + 1, filtered, sorted)
                ), 500);
            })
        }
        this.setState({ loading: true })
    }
    refresh() {
        let self = this
        this.loadData();
        this.loadDataOrderAmt();
        this.loadDataSoDu();
    }
    async loadData(pagesize, page, keySearch, sortSearch) {
        let that = this;
        let CUSTODYCD = '';
        CUSTODYCD = this.state.CUSTODYCD.value
        if (CUSTODYCD != '') {
            RestfulUtils.post('/fund/fetchBalanceInfo', { OBJNAME: this.props.OBJNAME, language: this.props.language, custodycd: CUSTODYCD, pagesize, page, keySearch, sortSearch }).then((resData) => {
                if (resData.EC == 0) {

                    that.setState({
                        data: resData.DT,
                        sumBALANCEAMT: resData.sumBALANCEAMT,
                        sumBLOCKEDAMT: resData.sumBLOCKEDAMT,
                        sumRECEIVINGAMT: resData.sumRECEIVINGAMT
                    });
                }
            })
        }

    }
    async loadDataOrderAmt(pagesize, page, keySearch, sortSearch) {
        let that = this;
        let CUSTODYCD = '';
        CUSTODYCD = this.state.CUSTODYCD.value
        if (CUSTODYCD != '') {
            RestfulUtils.post('/fund/fetchOrderAmtInfo', { OBJNAME: this.props.OBJNAME, language: this.props.language, custodycd: CUSTODYCD, pagesize, page, keySearch, sortSearch }).then((resData) => {
                if (resData.EC == 0) {

                    that.setState({
                        dataOrder: resData.DT,
                        sumORDERAMT: resData.sumORDERAMT
                    });
                }
            });
        }
    }
    async loadDataSoDu(pagesize, page, keySearch, sortSearch) {
        let that = this;
        let CUSTODYCD = '';
        CUSTODYCD = this.state.CUSTODYCD.value
        if (CUSTODYCD != '') {
            RestfulUtils.post('/fund/getsoduccqexpectnav', { OBJNAME: this.props.OBJNAME, language: this.props.language, custodycd: CUSTODYCD, pagesize, page, keySearch, sortSearch }).then((resData) => {
                if (resData.EC == 0) {

                    that.setState({
                        dataSoDu: resData.DT
                    });
                }
            });
        }
    }
    refreshData = async () => {
        let result = await this.refresh();
        let { pagesize, page, keySearch, sortSearch } = this.state
        this.loadData(pagesize, page, keySearch, sortSearch);

    }


    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    reloadTable() {
        this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch)
    }
    closeModalSearch() {
        this.setState({ showModalSearch: false })
    }
    handleClickSearch() {
        console.log('haki=================== :')
        this.setState({ showModalSearch: true })
    }
    selectCustodycd(data) {
        console.log('data selected :::', data)
        this.onChangeSelect('CUSTODYCD', { label: data.CUSTODYCD+' - '+ data.FULLNAME, value: data.CUSTODYCD })

    }
    render() {
        const { CUSTODYCD1, CUSTODYCD, data, dataOrder, dataSoDu, pages, sumBALANCEAMT, sumORDERAMT, sumRECEIVINGAMT, sumBLOCKEDAMT } = this.state;
        var that = this;
        console.log('CUSTODYCD:', CUSTODYCD);
        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        let isGroupUser = user ? (user.ISGROUPUSER ? true : false) : false;
        let disableCustodycdBox = this.state.ISEDIT || isCustom;
        return (
            <div>
                <ModalTimKiemFullname onSelectRow={this.selectCustodycd.bind(this)} showModal={this.state.showModalSearch} closeModalTimKiem={this.closeModalSearch.bind(this)} />
                <div className="row" >
                    <div style={{ marginBottom: "10px", marginLeft: '-12px' }} className="col-md-12">
                        <div style={{ textAlign: "left", paddingLeft: "0px", fontSize: "14px", fontWeight: "bold" }} className="col-md-1">
                            <h5 style={{ fontSize: "14px", fontWeight: "bold" }}>{this.props.strings.account}</h5>
                        </div>
                        <div className="col-md-7" style={{ marginLeft: "-16px" }}>

                            {/* <Select.Async 
                                name="form-field-name"
                                disabled={disableCustodycdBox}
                                loadOptions={this.getOptionsCustody.bind(this)}
                                value={this.state.CUSTODYCD}
                                onChange={this.onChangeSelect.bind(this, 'CUSTODYCD')}
                                options={this.state.listOptionSelect['CUSTODYCD']}
                                id="cbCUSTODYCD"
                                cache={false}
                                backspaceRemoves={true}
                                clearable={true}
                            />  */}
                            <Select.Async
                                name="form-field-name"
                                //disabled={disableCustodycdBox}
                                //placeholder={this.props.strings.custodycd}
                                loadOptions={this.getOptionsCustody.bind(this)}
                                value={this.state.CUSTODYCD}
                                //options={this.state.listOptionSelect['CUSTODYCD']}
                                onChange={this.onChangeSelect.bind(this, 'CUSTODYCD')}
                                id="drdCUSTODYCD"
                                ref="refCUSTODYCD"
                            />
                        </div>
                        {!isCustom && <div className="col-xs-1" style={{ paddingLeft: "0px" }}>
                            <input style={{ margin: "0 0 0 0", minHeight: "34px" }} type="button" onClick={this.handleClickSearch.bind(this)}
                                className="pull-left btn btndangeralt" defaultValue={this.props.strings.searchfullname} id="btupdate22" />
                        </div>}
                    </div>

                </div>
                <div className="" style={{ fontSize: "14px", fontWeight: "bold", marginLeft: "-12px" }} >{this.props.strings.totalamt} : {<NumberFormat value={sumBALANCEAMT + sumBLOCKEDAMT + sumRECEIVINGAMT} disabled={true} displayType={'text'} isNumericString={true} decimalScale={2} thousandSeparator={true} prefix={''} />} đ</div>
                {sumBALANCEAMT != 0 ?
                    <div>
                        <div className="col-md-1"></div>
                        <div className="col-md-11 row module">
                            <div onClick={this.collapse.bind(this, 'tienkhadung')} style={{ cursor: "pointer", marginBottom: "10px" }} className="title-module">{this.props.strings.tienkhadung} {<NumberFormat value={parseInt(sumBALANCEAMT)} displayType={'text'} thousandSeparator={true} />} đ <i style={{ float: "right", cursor: "pointer", marginBottom: "10px" }} className={!this.state.collapse["tieuchidautu"] ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up"}></i> </div>
                            <Collapse in={this.state.collapse["tienkhadung"]}>
                                <div className="col-md-8" >
                                    <ReactTable
                                        columns={
                                            [
                                                {
                                                    Header: props => <div className="wordwrap" >{this.props.strings.SYMBOL}</div>,

                                                    accessor: "SYMBOL",
                                                    width: 150,
                                                    Cell: ({ value }) => {
                                                        return (
                                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                                {value}
                                                            </span>)
                                                    }
                                                },
                                                {
                                                    Header: props => <div className="wordwrap" >{this.props.strings[getExtensionByLang("SRTYPEDESC", this.props.currentLanguage)]}</div>,
                                                    accessor: getExtensionByLang("SRTYPEDESC", this.props.currentLanguage),
                                                    width: 150,
                                                    Cell: ({ value }) => {
                                                        return (
                                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                                {value}
                                                            </span>)
                                                    }
                                                },
                                                {
                                                    Header: props => <div className="wordwrap" >{this.props.strings.BALANCEAMT}</div>,

                                                    accessor: "BALANCEAMT",
                                                    width: 150,
                                                    Cell: ({ value }) => {
                                                        return (

                                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                                {
                                                                    <NumberFormat value={parseInt(value)} displayType={'text'} thousandSeparator={true} />
                                                                }
                                                            </span>)
                                                    }
                                                }
                                            ]
                                        }
                                        getTheadTrProps={() => {
                                            return {
                                                className: 'head'
                                            }
                                        }}
                                        manual
                                        pages={pages}
                                        onFetchData={this.fetchData.bind(this)}
                                        data={data}
                                        style={{
                                            maxHeight: "600px"
                                        }}
                                        noDataText="No data"
                                        pageText={getPageTextTable(this.props.language)}
                                        rowsText={getRowTextTable(this.props.language)}
                                        previousText={<i className="fas fa-backward"></i>}
                                        nextText={<i className="fas fa-forward"></i>}
                                        loadingText="Đang tải..."
                                        ofText="/"
                                        getTrProps={this.onRowClick.bind(this)}
                                        loadDataAgain={this.refresh.bind(this)} //load lai data cho luoi
                                        pageSize={data ? data.length : 10}
                                        showPagination={false}
                                        className="-striped -highlight"
                                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                                    />
                                </div>
                            </Collapse>
                        </div>
                    </div> :
                    <div>
                        <div className="col-md-1"></div>
                        <div className="col-md-11 row  module">
                            <div className="" style={{ fontSize: "14px", fontWeight: "bold" }} >{this.props.strings.BALANCEAMT}: {<NumberFormat value={parseInt(sumBALANCEAMT)} disabled={true} displayType={'text'} isNumericString={true} decimalScale={2} thousandSeparator={true} prefix={''} />}</div>
                        </div>
                    </div>
                }
                {sumBLOCKEDAMT != 0 ?
                    <div>
                        <div className="col-md-1"></div>
                        <div className="col-md-11 row module">
                            <div onClick={this.collapse.bind(this, 'tienphongtoa')} style={{ cursor: "pointer", marginBottom: "10px" }} className="title-module">Tiền phong tỏa :{<NumberFormat value={parseInt(sumBLOCKEDAMT)} displayType={'text'} thousandSeparator={true} />} đ<i style={{ float: "right", cursor: "pointer", marginBottom: "10px" }} className={!this.state.collapse["tienphongtoa"] ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up"}></i> </div>
                            <Collapse in={this.state.collapse["tienphongtoa"]}>
                                <div className="col-md-8" >
                                    <ReactTable
                                        columns={
                                            [
                                                {
                                                    Header: props => <div className="wordwrap"  >{this.props.strings.SYMBOL}</div>,
                                                    accessor: "SYMBOL",
                                                    width: 150,
                                                    Cell: ({ value }) => {
                                                        return (
                                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                                {value}
                                                            </span>)
                                                    }
                                                },
                                                {
                                                    Header: props => <div className="wordwrap" >{this.props.strings[getExtensionByLang("SRTYPEDESC", this.props.currentLanguage)]}</div>,
                                                    accessor: getExtensionByLang("SRTYPEDESC", this.props.currentLanguage),
                                                    width: 150,
                                                    Cell: ({ value }) => {
                                                        return (
                                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                                {value}
                                                            </span>)
                                                    }
                                                },
                                                {
                                                    Header: props => <div className="wordwrap"  >{this.props.strings.BLOCKEDAMT}</div>,
                                                    accessor: "BLOCKEDAMT",
                                                    width: 150,
                                                    Cell: ({ value }) => {
                                                        return (
                                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                                {
                                                                    <NumberFormat value={parseInt(value)} displayType={'text'} thousandSeparator={true} />
                                                                }
                                                            </span>)
                                                    }
                                                }
                                            ]
                                        }
                                        getTheadTrProps={() => {
                                            return {
                                                className: 'head'
                                            }
                                        }}
                                        manual
                                        pages={pages}
                                        onFetchData={this.fetchData.bind(this)}
                                        data={data}
                                        style={{
                                            maxHeight: "600px"
                                        }}
                                        noDataText="No data"
                                        pageText={getPageTextTable(this.props.language)}
                                        rowsText={getRowTextTable(this.props.language)}
                                        previousText={<i className="fas fa-backward"></i>}
                                        nextText={<i className="fas fa-forward"></i>}
                                        loadingText="Đang tải..."
                                        ofText="/"
                                        getTrProps={this.onRowClick.bind(this)}
                                        loadDataAgain={this.refresh.bind(this)} //load lai data cho luoi
                                        pageSize={data ? data.length : 10}
                                        showPagination={false}
                                        className="-striped -highlight"
                                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                                    />
                                </div>
                            </Collapse>
                        </div>
                    </div> :
                    <div>
                        <div className="col-md-1"></div>
                        <div className="col-md-11 row module">
                            <div className="" style={{ fontSize: "14px", fontWeight: "bold" }} >{this.props.strings.BLOCKEDAMT} : {<NumberFormat value={parseInt(sumBLOCKEDAMT)} disabled={true} displayType={'text'} isNumericString={true} decimalScale={2} thousandSeparator={true} prefix={''} />}</div>
                        </div>
                    </div>
                }
                {sumRECEIVINGAMT != 0 ?
                    <div>
                        <div className="col-md-1"></div>
                        <div className="col-md-11 row module">
                            <div onClick={this.collapse.bind(this, 'tienbanchove')} style={{ cursor: "pointer", marginBottom: "10px" }} className="title-module">{this.props.strings.tienbanchove} {<NumberFormat value={parseInt(sumRECEIVINGAMT)} displayType={'text'} thousandSeparator={true} />} đ<i style={{ float: "right", cursor: "pointer", marginBottom: "10px" }} className={!this.state.collapse["tienbanchove"] ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up"}></i> </div>
                            <Collapse in={this.state.collapse["tienbanchove"]}>
                                <div className="col-md-8" >
                                    <ReactTable
                                        columns={
                                            [
                                                {
                                                    Header: props => <div className="wordwrap"  >{this.props.strings.SYMBOL}</div>,
                                                    accessor: "SYMBOL",
                                                    width: 150,
                                                    Cell: ({ value }) => {
                                                        return (
                                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                                {value}
                                                            </span>)
                                                    }
                                                },
                                                {
                                                    Header: props => <div className="wordwrap" >{this.props.strings[getExtensionByLang("SRTYPEDESC", this.props.currentLanguage)]}</div>,
                                                    accessor: getExtensionByLang("SRTYPEDESC", this.props.currentLanguage),
                                                    width: 150,
                                                    Cell: ({ value }) => {
                                                        return (
                                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                                {value}
                                                            </span>)
                                                    }
                                                },
                                                {
                                                    Header: props => <div className="wordwrap"  >{this.props.strings.RECEIVINGAMT}</div>,
                                                    accessor: "RECEIVINGAMT",

                                                    width: 150,
                                                    Cell: ({ value }) => {
                                                        return (
                                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                                {
                                                                    <NumberFormat value={parseInt(value)} displayType={'text'} thousandSeparator={true} />
                                                                }
                                                            </span>)
                                                    }
                                                }
                                            ]
                                        }
                                        getTheadTrProps={() => {
                                            return {
                                                className: 'head'
                                            }
                                        }}
                                        manual
                                        pages={pages}
                                        onFetchData={this.fetchData.bind(this)}
                                        data={data}
                                        style={{
                                            maxHeight: "600px"
                                        }}
                                        noDataText="No data"
                                        pageText={getPageTextTable(this.props.language)}
                                        rowsText={getRowTextTable(this.props.language)}
                                        previousText={<i className="fas fa-backward"></i>}
                                        nextText={<i className="fas fa-forward"></i>}
                                        loadingText="Đang tải..."
                                        ofText="/"
                                        getTrProps={this.onRowClick.bind(this)}
                                        loadDataAgain={this.refresh.bind(this)} //load lai data cho luoi
                                        pageSize={data ? data.length : 10}
                                        showPagination={false}
                                        className="-striped -highlight"
                                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                                    />
                                </div>
                            </Collapse>
                        </div>
                    </div> :
                    <div>
                        <div className="col-md-1"></div>
                        <div className="col-md-11 row module">
                            <div className="" style={{ fontSize: "14px", fontWeight: "bold" }} >{this.props.strings.RECEIVINGAMT} : {<NumberFormat value={parseInt(sumRECEIVINGAMT)} disabled={true} displayType={'text'} isNumericString={true} decimalScale={2} thousandSeparator={true} prefix={''} />}</div>
                        </div>
                    </div>
                }
                {sumORDERAMT != 0 ?
                    <div>
                        <div className="col-md-1"></div>
                        <div className="col-md-11 row module">
                            <div onClick={this.collapse.bind(this, 'tienmua')} style={{ cursor: "pointer", marginBottom: "10px" }} className="title-module">{this.props.strings.tienmua} {<NumberFormat value={parseInt(sumORDERAMT)} displayType={'text'} thousandSeparator={true} />} đ<i style={{ float: "right", cursor: "pointer", marginBottom: "10px" }} className={!this.state.collapse["tienmua"] ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up"}></i> </div>
                            <Collapse in={this.state.collapse["tienmua"]}>
                                <div className="col-md-8" >
                                    <ReactTable
                                        columns={
                                            [
                                                {
                                                    Header: props => <div className="wordwrap"  >{this.props.strings.SYMBOL}</div>,
                                                    accessor: "SYMBOL",
                                                    width: 150,
                                                    Cell: ({ value }) => {
                                                        return (
                                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                                {value}
                                                            </span>)
                                                    }
                                                },
                                                {
                                                    Header: props => <div className="wordwrap" >{this.props.strings[getExtensionByLang("SRTYPEDESC", this.props.currentLanguage)]}</div>,
                                                    accessor: getExtensionByLang("SRTYPEDESC", this.props.currentLanguage),
                                                    width: 150,
                                                    Cell: ({ value }) => {
                                                        return (
                                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                                {value}
                                                            </span>)
                                                    }
                                                },
                                                {
                                                    Header: props => <div className="wordwrap"  >{this.props.strings.ORDERAMOUNT}</div>,
                                                    accessor: "ORDERAMOUNT",
                                                    width: 150,
                                                    Cell: ({ value }) => {
                                                        return (
                                                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                                                {
                                                                    <NumberFormat value={parseInt(value)} displayType={'text'} thousandSeparator={true} />}
                                                            </span>)
                                                    }
                                                }
                                            ]
                                        }
                                        getTheadTrProps={() => {
                                            return {
                                                className: 'head'
                                            }
                                        }}
                                        manual
                                        pages={pages}
                                        onFetchData={this.fetchData.bind(this)}
                                        data={dataOrder}
                                        style={{
                                            maxHeight: "600px"
                                        }}
                                        noDataText="No data"
                                        pageText={getPageTextTable(this.props.language)}
                                        rowsText={getRowTextTable(this.props.language)}
                                        previousText={<i className="fas fa-backward"></i>}
                                        nextText={<i className="fas fa-forward"></i>}
                                        loadingText="Đang tải..."
                                        ofText="/"
                                        getTrProps={this.onRowClick.bind(this)}
                                        loadDataAgain={this.refresh.bind(this)} //load lai data cho luoi
                                        pageSize={data ? data.length : 10}
                                        showPagination={false}
                                        className="-striped -highlight"
                                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                                    />
                                </div>
                            </Collapse>
                        </div>
                    </div> :
                    <div>
                        <div className="col-md-1"></div>
                        <div className="col-md-11 row module">
                            <div className="" style={{ fontSize: "14px", fontWeight: "bold" }} >{this.props.strings.ORDERAMOUNT} : {<NumberFormat value={parseInt(sumORDERAMT)} disabled={true} displayType={'text'} isNumericString={true} decimalScale={2} thousandSeparator={true} prefix={''} />}</div>
                        </div>
                    </div>
                }

                {/*-------------------------- so du chung chi quy------------------------------ */}
                <div className="col-md-12 row module">
                    <div onClick={this.collapse.bind(this, 'soduccq')} style={{ cursor: "pointer", marginBottom: "10px" }} className="title-module"> {this.props.strings.soduccq}<i style={{ float: "right", cursor: "pointer", marginBottom: "10px" }} className={!this.state.collapse["soduccq"] ? "glyphicon glyphicon-menu-down" : "glyphicon glyphicon-menu-up"}></i> </div>
                    <Collapse in={this.state.collapse["soduccq"]}>
                        <div className="col-md-12" >
                            <ReactTable
                                columns={
                                    [
                                        {
                                            Header: props => <div className="wordwrap"  >{this.props.strings.SYMBOL}</div>,
                                            accessor: "SYMBOL",
                                            width: 100,
                                            Cell: ({ value }) => {
                                                return (
                                                    <span style={{ float: 'right', paddingRight: '5px' }}>
                                                        {value}
                                                    </span>)
                                            }
                                        },
                                        //  số dư SIP (tradesip)
                                        {
                                            Header: props => <div className="wordwrap"  >{this.props.strings.TRADESIP}</div>,
                                            accessor: "TRADESIP",
                                            width: 150,
                                            Cell: ({ value }) => {
                                                return (
                                                    <span style={{ float: 'right', paddingRight: '5px' }}>
                                                        {
                                                            <NumberFormat decimalScale={2} value={value} displayType={'text'} thousandSeparator={true} />}
                                                    </span>)
                                            }
                                        },
                                        //Thông thường (trade)
                                        {
                                            Header: props => <div className="wordwrap"  >{this.props.strings.NORMAL}</div>,
                                            accessor: "TRADE",
                                            width: 150,
                                            Cell: ({ value }) => {
                                                return (
                                                    <span style={{ float: 'right', paddingRight: '5px' }}>
                                                        {
                                                            <NumberFormat decimalScale={2} value={value} displayType={'text'} thousandSeparator={true} />}
                                                    </span>)
                                            }
                                        },
                                        //phong tỏa thông thường (blocked)
                                        {
                                            Header: props => <div className="wordwrap"  >{this.props.strings.BLOCKEDNORMAL}</div>,
                                            accessor: "BLOCKED",
                                            width: 200,
                                            Cell: ({ value }) => {
                                                return (
                                                    <span style={{ float: 'right', paddingRight: '5px' }}>
                                                        {
                                                            <NumberFormat decimalScale={2} value={value} displayType={'text'} thousandSeparator={true} />}
                                                    </span>)
                                            }
                                        },
                                        //phong tỏa SIP(blockedsip)
                                        {
                                            Header: props => <div className="wordwrap"  >{this.props.strings.BLOCKEDSIP}</div>,
                                            accessor: "BLOCKEDSIP",
                                            width: 150,
                                            Cell: ({ value }) => {
                                                return (
                                                    <span style={{ float: 'right', paddingRight: '5px' }}>
                                                        {
                                                            <NumberFormat decimalScale={2} value={value} displayType={'text'} thousandSeparator={true} />}
                                                    </span>)
                                            }
                                        },
                                        // {
                                        //     Header: props => <div className="wordwrap"  >{this.props.strings.TRADE}</div>,
                                        //     accessor: "TRADE",
                                        //     width: 150,
                                        //     Cell: ({ value }) => {
                                        //         return (
                                        //             <span style={{ float: 'right', paddingRight: '5px' }}>
                                        //                 {
                                        //                     <NumberFormat decimalScale={2} value={value} displayType={'text'} thousandSeparator={true} />}
                                        //             </span>)
                                        //     }
                                        // },
                                        // {
                                        //     Header: props => <div className="wordwrap"  >{this.props.strings.RECEIVING}</div>,
                                        //     accessor: "RECEIVING",
                                        //     width: 150,
                                        //     Cell: ({ value }) => {
                                        //         return (
                                        //             <span style={{ float: 'right', paddingRight: '5px' }}>
                                        //                 {
                                        //                     <NumberFormat decimalScale={2} value={value} displayType={'text'} thousandSeparator={true} />}
                                        //             </span>)
                                        //     }
                                        // },
                                        // {
                                        //     Header: props => <div className="wordwrap"  >{this.props.strings.BLOCKED}</div>,
                                        //     accessor: "BLOCKED",
                                        //     width: 150,
                                        //     Cell: ({ value }) => {
                                        //         return (
                                        //             <span style={{ float: 'right', paddingRight: '5px' }}>
                                        //                 {
                                        //                     <NumberFormat decimalScale={2} value={value} displayType={'text'} thousandSeparator={true} />}
                                        //             </span>)
                                        //     }
                                        // },
                                        {
                                            Header: props => <div className="wordwrap"  >{this.props.strings.AMOUNT}</div>,
                                            accessor: "AMOUNT",
                                            width: 150,
                                            Cell: ({ value }) => {
                                                return (
                                                    <span style={{ float: 'right', paddingRight: '5px' }}>
                                                        {
                                                            <NumberFormat decimalScale={2} value={value} displayType={'text'} thousandSeparator={true} />}
                                                    </span>)
                                            }
                                        },
                                        {
                                            Header: props => <div className="wordwrap"  >{this.props.strings.NAVV}</div>,
                                            Header: "NAV",
                                            accessor: "NAV",
                                            width: 120,
                                            Cell: ({ value }) => {
                                                return (
                                                    <span style={{ float: 'right', paddingRight: '5px' }}>
                                                        {
                                                            <NumberFormat decimalScale={2} value={value ? value : ''} displayType={'text'} thousandSeparator={true} />}
                                                    </span>)
                                            }
                                        },
                                        {
                                            Header: props => <div className="wordwrap"  >{this.props.strings.TOTAL}</div>,
                                            accessor: "AMT",
                                            width: 150,
                                            Cell: ({ value }) => {
                                                return (
                                                    <span style={{ float: 'right', paddingRight: '5px' }}>
                                                        {
                                                            <NumberFormat value={value ? parseInt(value) : ''} displayType={'text'} thousandSeparator={true} />}
                                                    </span>)
                                            }
                                        }
                                    ]
                                }
                                getTheadTrProps={() => {
                                    return {
                                        className: 'head'
                                    }
                                }}
                                manual
                                pages={pages}
                                onFetchData={this.fetchData.bind(this)}
                                data={dataSoDu}
                                style={{
                                    maxHeight: "600px",
                                    width: "100%",
                                    marginRight: "0px"
                                }}
                                pageText={getPageTextTable(this.props.language)}
                                rowsText={getRowTextTable(this.props.language)}
                                previousText={<i className="fas fa-backward"></i>}
                                nextText={<i className="fas fa-forward"></i>}
                                noDataText={this.props.strings.textNodata}
                                // loadingText="Đang tải..."
                                ofText="/"
                                getTrProps={this.onRowClick.bind(this)}
                                loadDataAgain={this.refresh.bind(this)} //load lai data cho luoi
                                pageSize={data ? data.length : 10}
                                showPagination={false}
                                className="-striped -highlight"
                                ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                            />
                        </div>
                    </Collapse>
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
    translate('TableTruyVanThongTinSoDuNAV'),

]);
module.exports = decorators(TableTruyVanThongTinSoDuNAV);
