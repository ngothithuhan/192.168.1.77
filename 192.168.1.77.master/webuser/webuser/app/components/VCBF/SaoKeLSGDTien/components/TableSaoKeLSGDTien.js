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
import { showNotifi } from 'app/action/actionNotification.js';
import DropdownFactory from 'app/utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';
import ModalTimKiemFullname from 'app/utils/Dialog/ModalTimKiemFullname.js';
import moment from 'moment';

var Select = require('react-select');
import { DefaultPagesize, getExtensionByLang, getPageTextTable, getRowTextTable } from '../../../../Helpers';

class TableSaoKeLSGDTien extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //saleid: 'ALL',
            listOptionSelect: {
                CUSTODYCD1: [],
                CUSTODYCD2: [],
                CODEID: []
            },
            CUSTODYCD: '',
            SRTYPE: '',
            CODEID: '',
            p_frdate: '',
            p_todate: '',
            showModalSearch: false,

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
            isFirstLoad: true,
            CUSTODYCD1: '',
            CUSTODYCD2: '',
            dataAll: [],
            optionFIXED: [
                {
                    "value": "NN",
                    "label": "Thường"
                },
                {
                    "value": "SP",
                    "label": "SIP"
                }
            ],
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
            }],

            checkFields: [
                { name: "CUSTODYCD2", id: "CUSTODYCD2" },
                { name: "SRTYPE", id: "SRTYPE" },
                { name: "CODEID", id: "CODEID" },
                { name: "p_frdate", id: "p_frdate" },
                { name: "p_todate", id: "p_todate" },
            ],
        }
    }

    async componentDidMount() {
        let to_date = new Date();
        let from_date = moment(to_date).subtract(3, 'months');;
        this.setState({
            ...this.state,
            p_frdate: moment(from_date).format('DD/MM/YYYY'),
            p_todate: moment(to_date).format('DD/MM/YYYY'),
        })

        await this.getOptionTypeOrder('IV', 'IVSRTYPE', '');

    }

    componentWillReceiveProps(nextProps) {
        this.setListOptionPention();
        if (this.state.lang != nextProps.currentLanguage) {
            this.state.lang = nextProps.currentLanguage
            this.state.loading = true
            this.refReactTable.fireFetchData()
        }
        if (nextProps.isrefresh) {
            this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch);
        }
    }
    componentWillMount() {
        this.setListOptionPention();
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
        let colum = instance.props
        if (this.state.loading) {
            new Promise((resolve, reject) => {
                let { pageSize, page, filtered, sorted } = state;
                setTimeout(() => resolve(this.loadData(pageSize, page + 1, filtered, sorted, instance.props.columns)), 500);
            })
        }
        this.setState({ loading: true, colum: colum })
    }
    refresh() {
        let self = this
        self.loadData(self.state.pagesize, self.state.page, self.state.keySearch, self.state.sortSearch, self.state.colum);
        // RestfulUtils.post('/srreconcile/fetchListReconcile', {  }).then((resData) => {
        //     if (resData.EC == 0) {
        //         self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord, dataALL: resData.DT.dataAll })
        //     } else {
        //         toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
        //     }
        // });
    }
    search() {
        this.refresh()
    }
    async loadData(pagesize, page, keySearch, sortSearch, columns) {
        let that = this;
        let tmpCUSTODYCD = '';
        const { user } = that.props.auth
        let isCustom = user && user.ISCUSTOMER == 'Y';
        tmpCUSTODYCD =
            isCustom ?
                (that.state.CUSTODYCD ? that.state.CUSTODYCD.value : '')
                : (that.state.CUSTODYCD2 ? that.state.CUSTODYCD2.value ?
                    that.state.CUSTODYCD2.value : that.state.CUSTODYCD2 : '')


        let obj = {
            OBJNAME: that.props.OBJNAME,
            custodycd:
                (isCustom && that.state.CUSTODYCD2 && that.state.CUSTODYCD2.value) ? that.state.CUSTODYCD2.value : tmpCUSTODYCD,
            srtype: that.state.SRTYPE,
            codeid: that.state.CODEID,
            txdate_from: that.state.p_frdate,
            txdate_to: that.state.p_todate,
            language: that.props.language,
            pagesize, page, keySearch, sortSearch, columns
        };

        await RestfulUtils.post('/cashmanual/fetchListCashTransHis', obj
        ).then((resData) => {
            if (resData && resData.EC == 0) {
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
            else {
                that.setState({
                    data: [],
                    dataAll: [],
                    pages: 0,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                    sumRecord: 0,
                    colum: columns
                });
            }
        });
    }
    refreshData = async () => {
        let result = await this.refresh();
        let { pagesize, page, keySearch, sortSearch } = this.state
        this.loadData(pagesize, page, keySearch, sortSearch, this.state.colum);
    }
    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }

    checkValid(name, id) {
        let value = this.state[name];
        let mssgerr = '';
        switch (name) {
            case "CUSTODYCD2":
                if (value == '') {
                    mssgerr = 'Chưa chọn tài khoản giao dịch';
                }
                break;
            case "CODEID":
                if (value == '') {
                    mssgerr = 'Chưa chọn mã quỹ';
                }
                break;
            case "p_frdate":
                if (value == '') {
                    mssgerr = 'Chưa chọn ngày (from date) tìm kiếm';
                }
                break;
            case "p_todate":
                if (value == '') {
                    mssgerr = 'Chưa chọn ngày (to date) tìm kiếm';
                }
                break;
            case "SRTYPE":
                if (value == '') {
                    mssgerr = 'Chưa chọn loại lệnh';
                }
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
    reloadTable() {

        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            let mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch, this.state.colum)
    }
    async getOptionsSelect(type, input) {
        return { options: this.state.listOptionSelect[type] }
    }

    onChangeSelect(type, e) {
        console.log('type, e:::', type, e)
        if (e) {
            this.state.isFirstLoad = false;
            this.setState({ CUSTODYCD2: e });
        }
        else {
            this.state.isFirstLoad = true;
            this.setState({ CUSTODYCD2: { label: '', value: '' } });

        }
    }
    async onChangeCUSTODYCD(e) {

        var self = this;
        if (e) {
            this.state.keySearch.p_custodycd = e.value;
            this.state.keySearch.p_codeid = 'ALL';

        } else {
            e = { label: '', value: '' }
            this.state.keySearch.p_custodycd = '';
            this.state.keySearch.p_codeid = 'EMPTY';
        }

        this.setState({ CUSTODYCD: e, keySearch: this.state.keySearch });
    }
    onChange(type, event) {
        console.log(type, event)
        let data = {};

        if (event.target) {

            this.state[type] = event.target.value;
        }
        else {

            this.state[type] = event.value;
        }
        this.setState({ state: this.state })
    }
    setListOptionPention(input) {

        let self = this;
        let username = this.state.username;
        let ISCUSTOMER = this.props.ISCUSTOMER;
        if (ISCUSTOMER == 'Y') {
            var defaultCustodyCd = this.props.auth.user.USERID;
            var listOptionSelect = {};
            listOptionSelect['CUSTODYCD2'] = [{ label: defaultCustodyCd, value: defaultCustodyCd }];
            // self.state.CUSTODYCD2 = defaultCustodyCd;
            self.setState({ ...this.state, listOptionSelect: listOptionSelect })
        } else {
            RestfulUtils.post('/account/getAccountIdsByUsername', { key: input })
                .then((res) => {
                    if (res.length > 0) {
                        self.state.listOptionSelect['CUSTODYCD2'] = res
                        self.setState({ listOptionSelect: self.state.listOptionSelect })
                    }
                })
        }
    }
    getOptionsSYMBOL(input) {
        return RestfulUtils.post('/allcode/search_all_funds', { key: input })
            .then((res) => {

                return { options: res }
            })
    }

    async getOptionTypeOrder() {
        let res = await RestfulUtils.post('/allcode/getlist', { CDTYPE: 'IV', CDNAME: 'IVSRTYPE', CDVAL: '' })
        let listOptionSelect = [];
        if (res && res.data && res.errCode === 0) {
            let { language } = this.props;
            if (res.data && res.data.length > 0) {
                res.data.map(item => {
                    let object = {};
                    object.label = language === 'vie' ? item.CDCONTENT : item.EN_CDCONTENT;
                    object.value = item.CDVAL;
                    listOptionSelect.push(object)
                })
            }
        } else {
            //do something
        }

        return { options: listOptionSelect };
    }

    onChangeTypeOrder(selectedOption) {
        this.setState({
            ...this.state,
            SRTYPE: selectedOption.value ? selectedOption.value : ''
        })
    }


    onChangeSYMBOL(e) {
        if (e && e.value) {

            this.setState({
                CODEID: e.value,
                SYMBOL: e.label
            })
            //this.refresh();
        }
        else

            this.setState({
                CODEID: '',
                SYMBOL: ''
            })
        //this.refresh();
    }
    getOptionsFIXED(input) {
        return RestfulUtils.post('/fund/prc_get_fixed_ordertype', { OBJNAME: this.props.OBJNAME, language: this.props.currentLanguage })
            .then((res) => {

                return { options: res.DT.data }
            })


    }
    onChangeDate(type, event) {

        if (event.target) {

            this.state[type] = event.target.value;
            this.setState({
                p_frdate: this.state.p_frdate, p_todate: this.state.p_todate
            })
            //this.refresh();
        }
        else {
            this.state[type] = event.value;
            this.setState({
                p_frdate: this.state.p_frdate, p_todate: this.state.p_todate
            })
            //this.refresh();
        }

    }
    onSetDefaultValue = (type, value) => {
        console.log('value:', value)
        //console.log('this.state.REROLE.fdfd', this.state.REROLE)
        if (!this.state[type])
            this.state[type] = value
    }
    getOptions(input) {
        let { auth } = this.props;
        var self = this;
        return RestfulUtils.post('/account/search_all', { key: input })
            .then((res) => {
                // const { user } = self.props.auth
                // let isCustom = user && user.ISCUSTOMER == 'Y';
                // var data = [];
                // let j = 0;
                // for (j = 0; j < res.length; j++) {
                //     res[j] = { label: res[j].label + ' - ' + res[j].detail.FULLNAME, value: res[j].value }
                // }
                // if (isCustom) {
                //     var defaultName1 = self.props.auth.user;
                //     console.log('defaultName1:', defaultName1)
                //     var defaultCustodyCd = self.props.auth.user.USERID;
                //     var listOptionSelect = [{ label: defaultCustodyCd, value: defaultCustodyCd }];
                //     self.state.CUSTODYCD = { label: defaultCustodyCd, value: defaultCustodyCd };
                //     self.state.keySearch.p_custodycd = defaultCustodyCd;
                //     self.setState(self.state);

                //     console.log('abc 111 ', listOptionSelect)
                //     alert('1')
                //     return { options: listOptionSelect }

                // } else {
                //     console.log('abc 111222 ', res)
                //     alert('2')
                return { options: res }
                // }


            })

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
        this.setState({ ...this.state, CUSTODYCD2: { label: data.CUSTODYCD + ' - ' + data.FULLNAME, value: data.CUSTODYCD } });

    }

    render() {
        const { data, datamock, pages, dataAll } = this.state;
        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        let isGroupUser = user ? (user.ISGROUPUSER ? true : false) : false;
        let disableCustodycdBox = this.state.ISEDIT || isCustom;
        var that = this;
        // {this.props.strings.title}
        const columns =
            [
                {
                    id: "TXDATE",
                    Header: props => <div className="wordwrap"  >{this.props.strings.TXDATE}</div>,
                    minWidth: 100,
                    height: 30,
                    accessor: "TXDATE",
                    Cell: ({ value }) => (
                        <div className="" style={{ textAlign: 'center' }}>{value}</div>
                    )
                },
                {
                    id: "TXNUM",
                    Header: props => <div className="wordwrap"  >{this.props.strings.TXNUM}</div>,
                    minWidth: 100,
                    height: 30,
                    accessor: "TXNUM",
                    Cell: ({ value }) => (
                        <div className="" style={{ textAlign: 'center' }}>{value}</div>
                    )
                },
                {
                    id: "DBCODE",
                    Header: props => <div className="wordwrap"  >{this.props.strings.DBCODE}</div>,
                    minWidth: 100,
                    height: 30,
                    accessor: "DBCODE",
                    Cell: ({ value }) => (
                        <div className="" style={{ textAlign: 'center' }}>{value}</div>
                    )
                },

                {
                    id: "INCREASE",
                    Header: props => <div className="wordwrap"  >{this.props.strings.INCREASE}</div>,
                    accessor: "INCREASE",
                    filterable: true,
                    minWidth: 150,
                    Cell: ({ value }) => {
                        return (
                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                {
                                    <NumberFormat value={value} displayType={'text'} thousandSeparator={true} />
                                }
                            </span>)
                    }
                },
                {
                    id: "DECREASE",
                    Header: props => <div className="wordwrap"  >{this.props.strings.DECREASE}</div>,
                    accessor: "DECREASE",
                    filterable: true,
                    minWidth: 150,
                    Cell: ({ value }) => {
                        return (
                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                {
                                    <NumberFormat value={value} displayType={'text'} thousandSeparator={true} />
                                }
                            </span>)
                    }
                },
                {
                    id: "AMOUNT",
                    Header: props => <div className="wordwrap"  >{this.props.strings.AMOUNT}</div>,
                    accessor: "AMOUNT",
                    filterable: true,
                    minWidth: 150,
                    Cell: ({ value }) => {
                        return (
                            <span style={{ float: 'right', paddingRight: '5px' }}>
                                {
                                    <NumberFormat decimalScale={0} value={value} displayType={'text'} thousandSeparator={true} />
                                }
                            </span>)
                    }
                },
                {
                    id: "DESCRIPTION",
                    Header: props => <div className="wordwrap"  >{this.props.strings.DESCRIPTION}</div>,
                    minWidth: 200,
                    height: 30,
                    accessor: "DESCRIPTION",
                    Cell: ({ value }) => (
                        <div className="" style={{ textAlign: 'center' }}>{value}</div>
                    )
                },
            ]

        return (
            <div className="saoke-lsdg-tien-table-container">
                <ModalTimKiemFullname onSelectRow={this.selectCustodycd.bind(this)} showModal={this.state.showModalSearch} closeModalTimKiem={this.closeModalSearch.bind(this)} />
                <div className="saoke-lsdg-tien-header">
                    <div className="saoke-lsdg-title">
                        <span>{this.props.titleTableSaoKeLSGDTien}</span>
                    </div>
                    <div className="all-inputs" >
                        <div className="input-container custom-button">
                            <ButtonExport
                                dataRows={dataAll}
                                colum={this.state.colum}
                                data={this.state.datapage}
                                dataHeader={this.props.strings}
                                HaveChk={false}
                                titleButton={this.props.strings.titleButtonExport}
                            />
                        </div>

                        <div className="input-container">
                            <Select.Async
                                name="form-field-name"
                                // disabled={disableCustodycdBox}
                                loadOptions={this.getOptions.bind(this)}
                                value={this.state.CUSTODYCD2}
                                onChange={this.onChangeSelect.bind(this, 'CUSTODYCD2')}
                                //options={this.state.listOptionSelect['CUSTODYCD2']}
                                id="CUSTODYCD2"
                                cache={false}
                                backspaceRemoves={true}
                                clearable={true}
                                placeholder={this.props.strings.account}
                            />
                        </div>


                        {!isCustom &&
                            <div className="input-container custom-small-button">
                                <div class="add-padding"></div>
                                <input
                                    type="button"
                                    onClick={this.handleClickSearch.bind(this)}
                                    className="pull-left btn btndangeralt"
                                    defaultValue={this.props.strings.searchfullname}
                                    id="btupdate22"
                                />
                            </div>
                        }

                        <div className="input-container smaller">
                            <Select.Async
                                name="form-field-name"
                                loadOptions={this.getOptionsSYMBOL.bind(this)}
                                value={this.state.CODEID}
                                onChange={this.onChangeSYMBOL.bind(this)}
                                cache={false}
                                backspaceRemoves={true}
                                clearable={true}
                                id="CODEID"
                                placeholder={this.props.strings.SYMBOL}
                            />
                        </div>
                        <div className="input-container smaller diplay-flex">
                            <DateInput
                                id="p_frdate"
                                onChange={this.onChangeDate.bind(this)}
                                value={this.state.p_frdate}
                                type="p_frdate"
                                placeholderText={this.props.strings.FRDATE}
                            />
                            <i className="fa fa-calendar" aria-hidden="true"></i>

                        </div>
                        <div className="input-container smaller diplay-flex remove-ml">
                            <DateInput
                                id="p_todate"
                                onChange={this.onChangeDate.bind(this)}
                                value={this.state.p_todate}
                                type="p_todate"
                                placeholderText={this.props.strings.TDATE}
                            />
                            <i className="fa fa-calendar" aria-hidden="true"></i>

                        </div>
                        <div className="input-container smaller remove-ml">
                            {/* <DropdownFactory
                                onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                                CDVAL={this.state.SRTYPE}
                                onChange={this.onChange.bind(this)}
                                value="SRTYPE"
                                CDTYPE="IV" 
                                CDNAME="IVSRTYPE" 
                                ID="drdIVSRTYPE"
                            /> */}

                            <Select.Async
                                name="form-field-name"
                                loadOptions={this.getOptionTypeOrder.bind(this)}
                                value={this.state.SRTYPE}
                                onChange={this.onChangeTypeOrder.bind(this)}
                                cache={false}
                                backspaceRemoves={true}
                                clearable={true}
                                id="SRTYPE"
                                placeholder={this.props.strings.ORDER}

                            />
                        </div>
                        <div className="input-container btn-submit smaller custom-small-button">
                            <button
                                className=""
                                id="btnsubmit"
                                onClick={this.reloadTable.bind(this)}>
                                {this.props.strings.search}
                            </button>
                        </div>
                    </div>

                </div>

                <div className="table-sao-ke customize-react-table" >
                    <ReactTable
                        columns={columns}
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
                        noDataText={this.props.strings.textNoData}
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
    language: state.language.language,
    auth: state.auth

});
const decorators = flow([
    connect(stateToProps),
    translate('TableSaoKeLSGDTien'),
]);
module.exports = decorators(TableSaoKeLSGDTien);
