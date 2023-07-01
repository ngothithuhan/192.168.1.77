import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import { ButtonExport } from '../../../../../utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import Select from 'react-select';
import { requestData } from 'app/utils/ReactTableUlti';
import { DefaultPagesize, getExtensionByLang, getRowTextTable, getPageTextTable } from 'app/Helpers'

class TableAddCreateMG_TK extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [


            ],
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
            data1: [],
            loaded: false,

            sorted1: [],
            filtered1: [],
            CUSTODYCD: { value: '', label: '' },
            CUSTODYCDtext: '',
            datagroup: {
                p_refacctno: '',
                p_saleid: '',
                p_saleacctno: '',
                p_rerole: '',
                p_reproduct: '',

                p_language: this.props.lang,
                pv_objname: this.props.OBJNAME,
            },
            checkFields: [
                { name: "p_saleid", id: "cbCUSTODYCD" },
                { name: "p_rerole", id: "cbretype" },


            ],

            p_retype: { value: '', label: '' },
            optionMaLoaiHinh: [],
            label_rerole: '',
            label_reproduct: '',
            firstRender: true,
            lang: this.props.lang,

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
                p_saleid: 'ALL',
                language: this.props.lang,
                objname: this.props.OBJNAME
            }
            RestfulUtils.posttrans('/fund/getlistsale_customers', { data }).then((resData) => {

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

    handleChangeALL(evt) {

        var that = this;
        this.setState({
            checkedAll: evt.target.checked,
            selectedRows: new Set(),
            unSelectedRows: []
        });
        if (evt.target.checked) {
            that.state.filteredData.map(function (item) {
                if (!that.state.selectedRows.has(item.AUTOID)) {
                    that.state.unSelectedRows.push(item.AUTOID);
                    that.state.selectedRows.add(item.AUTOID);
                }
            })
            that.setState({ selectedRows: that.state.selectedRows, unSelectedRows: that.state.unSelectedRows })
        }
        else {
            //that.state.unSelectedRows.map(function (item) {
            //  that.state.selectedRows.delete(item);
            // })
            that.setState({ selectedRows: new Set(), unSelectedRows: [] })
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
    getOptions(input) {


        return RestfulUtils.post('/fund/getlistsale_roles_alt', { p_saleid: 'ALL', p_language: this.props.lang })
            .then((res) => {

                console.log(res)
                return { options: res };
            })
    }

    onChange(e) {
        console.log(e, this.state.CUSTODYCD)
        let that = this
        if (e && e.value) {
            if (this.state.datagroup["p_saleid"] != e.value) {
                this.state.datagroup["p_saleid"] = e.value
                this.state.datagroup["p_saleacctno"] = ''
                this.state.datagroup["p_rerole"] = ''
                this.state.datagroup["p_reproduct"] = ''
                this.getOptionsMaLoaiHinh(e.value)
                this.setState({ CUSTODYCD: e.value, CUSTODYCDtext: e.text, datagroup: this.state.datagroup, p_retype: { value: '', label: '' }, label_rerole: '', label_reproduct: '' });
            }
        } else {
            this.state.datagroup["p_saleid"] = ''
            this.state.datagroup["p_saleacctno"] = ''
            this.state.datagroup["p_rerole"] = ''
            this.state.datagroup["p_reproduct"] = ''
            this.state.optionMaLoaiHinh = []
            this.state.dataLH = []
            this.state.CUSTODYCD = { value: '', label: '' }
            this.state.CUSTODYCDtext = ''
            this.state.p_retype = { value: '', label: '' }
            this.state.label_rerole = ''
            this.state.label_reproduct = ''
            //this.getOptionsMaLoaiHinh('empty')
            //this.setState({ CUSTODYCD: { value: '', label: '' }, datagroup: this.state.datagroup, p_retype: { value: '', label: '' }, label_rerole: '', label_reproduct: '' });
            this.setState(that.state)
        }
    }
    async  getOptionsMaLoaiHinh(salid) {
        await RestfulUtils.post('/user/getretypebysaleidalt', { saleid: salid, language: this.props.lang })
            .then((res) => {
                // console.log('res', res)
                this.setState({
                    optionMaLoaiHinh: res.result, dataLH: res.resultdata,
                })

            })
    }
    checkValid(name, id) {
        let value = this.state.datagroup[name];
        // let value1=this.state.CODEID
        let mssgerr = '';
        switch (name) {
            case "p_saleid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredsaleid;
                }
                break;
            case "p_rerole":
                if (value == '') {
                    mssgerr = this.props.strings.requiredrerole;
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
    submit = () => {
        let { datagroup } = this.state;

        console.log('this.state.CUSTODYCD + this.state.p_retype.value:', this.state.CUSTODYCD.value + this.state.p_retype.value)
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            if (this.state.selectedRows.size > 0) {
                this.state.selectedRows.forEach((key, value, set) => {
                    window.$('#btnSubmit').prop('disabled', true);
                    let datax = this.state.filteredData.filter(e => e.AUTOID === value);
                    if (datax && datax.length > 0) {
                        let success = null;
                        //datagroup["p_refacctno"] = data[0].REFACCTNO;
                        //datagroup["p_saleacctno"] = data[0].SALEACCTNO;
    
                        RestfulUtils.post('/fund/move_sale_customers', {
                            p_refacctno: datax[0].REFACCTNO,
                            p_saleid: datagroup.p_saleid,
                            p_saleacctno: this.state.CUSTODYCD + this.state.p_retype.value,
                            //p_saleacctno : data[0].SALEACCTNO, 
                            p_rerole: datagroup.p_rerole,
                            p_reroleid: this.state.p_retype.value,
                            p_reproduct: datagroup.p_reproduct,
                            p_language: datagroup.p_language,
                            pv_objname: datagroup.pv_objname
                        })
                            .then(res => {
                                success = (res.EC == 0);
                                success ? toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                                    : toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                                //if (this.state.selectedRows.size == i) {
                                this.setState({
                                    loaded: false,
                                    CUSTODYCD: { value: '', label: '', text: '', type: '', role_product: '' },
                                    CUSTODYCDtext: '',
                                    p_retype: { value: '', label: '' },
                                    optionMaLoaiHinh: [],
                                    label_rerole: '',
                                    label_reproduct: '',
                                    datagroup: {
                                        p_refacctno: '',
                                        p_saleid: '',
                                        p_saleacctno: '',
                                        p_rerole: '',
                                        p_reproduct: '',
                                        p_language: this.props.lang,
                                        pv_objname: this.props.OBJNAME,
                                    },
                                }
                                )
    
                                window.$('#btnSubmit').prop('disabled', false);
                            });
                        console.log('-------------------------------------')
                    }
                });
            }
            else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT })
        }
    }
    async onChangeMaLoaiHinh(e) {
        let that = this
        let result = {};
        let { dataLH } = this.state
        console.log('e 1:::', e)
        if (e && e.value) {
            console.log('e:::', e)
            if (dataLH) {
                console.log('dataLH:::', dataLH)
                if (dataLH.length > 0) {
                    console.log('dataLH length >0')
                    result = await dataLH.filter(item => item.AUTOID == e.value)
                    console.log('result:::', result)
                    if (result)
                        if (result.length > 0) {
                            //console.log('result dataLH', result[0])
                            this.state.datagroup["p_rerole"] = result[0]["REROLE"]
                            this.state.datagroup["p_reproduct"] = result[0]["REPRODUCT"]
                            this.setState({
                                p_retype: e,
                                datagroup: that.state.datagroup,
                                label_reproduct: result[0]["REPRODUCTDESC"],
                                label_rerole: result[0]["REROLEDESC"],
                            })
                        }
                }
            }
        } else {

            this.state.datagroup["p_rerole"] = ''
            this.state.datagroup["p_reproduct"] = ''
            this.setState({
                p_retype: { value: '', label: '' },
                datagroup: that.state.datagroup,
                label_reproduct: '',
                label_rerole: '',
            })
        }
    }
    reloadTable() {
        this.state.firstRender = true
        this.refReactTable.fireFetchData()
    }
    render() {
        const { data, pages, loading } = this.state;
        var that = this;
        return (
            <div>
                <div className="col-md-12">
                    <div className="col-md-6">
                        <div className="col-md-12">
                            <div className="col-md-3" style={{ paddingLeft: 0 }}><h5 className="highlight"><b>{this.props.strings.oldbrokerageidnew}</b></h5></div>
                            <div className="col-md-9 customSelect">
                                <Select.Async
                                    name="form-field-name"
                                    placeholder="Nhập MG..."
                                    loadOptions={this.getOptions.bind(this)}
                                    value={this.state.CUSTODYCD}
                                    onChange={this.onChange.bind(this)}
                                    id="cbCUSTODYCD"
                                    backspaceRemoves={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="col-md-12">
                            <div className="col-md-5" ><h5 className="highlight"><b>{this.props.strings.brokeragetype}</b></h5></div>
                            <div className="col-md-7 customSelect" >
                                <Select

                                    name="form-field-name"
                                    placeholder={this.props.strings.brokeragetype}
                                    options={this.state.optionMaLoaiHinh}
                                    cache={false}
                                    value={this.state.p_retype}
                                    onChange={this.onChangeMaLoaiHinh.bind(this)}
                                    id="cbretype"
                                    backspaceRemoves={false}
                                />                        </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="col-md-6" style={{ right: 35 }}>
                            <div className="col-md-12">
                                <div className="col-md-3" ><h5><b>{this.props.strings.oldbrokeragenamenew}</b></h5></div>
                                <div className="col-md-9" style={{ paddingRight: 4, left: 18 }}>
                                    <label className="form-control" id="txtoldbrokeragenamenew">{this.state.CUSTODYCDtext}</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="col-md-12">
                                <div className="col-md-5" style={{ paddingLeft: 7 }} ><h5><b>{this.props.strings.roledesc}</b></h5></div>
                                <div className="col-md-7" style={{ paddingRight: 9, right: 2 }}>
                                    <label className="form-control" id="txtrole">{this.state.datagroup.p_rerole != '' ? this.state.label_rerole + '-' + this.state.label_reproduct : ''}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">

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
                                    Header: props => <div className=" header-react-table">    <Checkbox checked={that.state.checkedAll} style={{ marginBottom: "14px", marginLeft: "8px" }} onChange={that.handleChangeALL.bind(that)} inline /></div>,
                                    maxWidth: 45,
                                    sortable: false,
                                    style: { textAlign: 'center' },
                                    Cell: (row) => (
                                        <div>
                                            <Checkbox style={{ textAlign: "center", marginLeft: "8px", marginTop: "-14px" }}
                                                checked={that.state.selectedRows.has(row.original.AUTOID)}
                                                onChange={that.handleChange.bind(that, row)} inline
                                            />
                                            {/* <span onClick={that.handlEdit.bind(that, row.original.CUSTID)} className="glyphicon glyphicon-pencil"></span> */}
                                        </div>
                                    ),
                                    Filter: ({ filter, onChange }) =>
                                        null
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.REFACCTNO}</div>,
                                    id: "REFACCTNO",
                                    accessor: "REFACCTNO",
                                    width: 105,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.FULLNAME}</div>,
                                    id: "FULLNAME",
                                    accessor: "FULLNAME",
                                    width: 196,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
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
                                    width: 175,
                                    Cell: ({ value }) => (
                                        <div className="col-left">{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.TYPENAME}</div>,
                                    id: "TYPENAME",
                                    accessor: "TYPENAME",
                                    width: 166,
                                    Cell: ({ value }) => (
                                        <div className="col-left">{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("REROLEDES", this.props.lang)]}</div>,

                                    id: getExtensionByLang("REROLEDES", this.props.lang),
                                    accessor: getExtensionByLang("REROLEDES", this.props.lang),
                                    width: 168,
                                    Cell: ({ value }) => (
                                        <div className="col-left">{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings[getExtensionByLang("REPRODUCTDES", this.props.lang)]}</div>,
                                    id: getExtensionByLang("REPRODUCTDES", this.props.lang),
                                    accessor: getExtensionByLang("REPRODUCTDES", this.props.lang),
                                    width: 90,
                                    Cell: ({ value }) => (
                                        <div className="col-left">{value}</div>
                                    )
                                }

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
                            onFetchData={this.fetchData.bind(this)}
                            data={data}
                            style={{
                                maxHeight: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                            }}
                            noDataText={this.props.strings.textNodata}
                            pageText={getPageTextTable(this.props.lang)}
                            rowsText={getRowTextTable(this.props.lang)}
                            previousText={<i className="fas fa-backward"></i>}
                            nextText={<i className="fas fa-forward"></i>}
                            ofText="/"
                            getTrProps={this.onRowClick.bind(this)}
                            defaultPageSize={this.state.pagesize}
                            className="-striped -highlight"
                            getTrGroupProps={(row) => {
                                return {
                                    id: "haha"
                                }
                            }}


                            getTrProps={this.onRowClick.bind(this)}
                            defaultPageSize={10}
                            className="-striped -highlight"
                            // onPageChange={(pageIndex) => {
                            //     this.state.selectedRows = new Set(),
                            //         this.state.checkedAll = false
                            // }
                            // }
                            ref={(refReactTable) => { this.refReactTable = refReactTable; }}

                        />
                    </div>

                </div>
                <div className="col-md-12">
                    <input type="button" className="btn btn-primary" onClick={this.submit} style={{ float: 'right', marginRight: 15 }} value={this.props.strings.accept} id='btnSubmit' />
                    <ButtonExport style={{ marginLeft: "5px" }} HaveChk={true} dataRows={this.state.dataALL} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />

                </div>
            </div>
        );
    }
}

TableAddCreateMG_TK.defaultProps = {

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
    translate('TableAddCreateMG_TK')
]);

module.exports = decorators(TableAddCreateMG_TK);
