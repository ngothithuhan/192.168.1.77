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
import { DefaultPagesize, getPageTextTable, getRowTextTable } from '../../../../../Helpers';
import Select from 'react-select';

class TableAddCreateThemMG_Nhom extends Component {
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
            pagesize: DefaultPagesize,
            keySearch: [],
            sortSearch: [],
            page: 1,
            sumRecord: '', //tong cac record tren luoi,
            GROUP: { value: '', label: '' },
            checkFields: [
                { name: "GROUP", id: "cbGrpid" },
            ],
            lang: this.props.lang
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
    handlEdit(SALEID) {
        var that = this;
        that.props.showModalDetail("update", SALEID);
    }
    handleChangeALL(evt) {
        var that = this;
        this.setState({ checkedAll: evt.target.checked });
        if (evt.target.checked) {
            that.state.data.map(function (item) {
                if (!that.state.selectedRows.has(item.SALEID)) {
                    that.state.unSelectedRows.push(item.SALEID);
                    that.state.selectedRows.add(item.SALEID);
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
      
        if (!this.state.selectedRows.has(row.original.SALEID))
            this.state.selectedRows.add(row.original.SALEID);
        else {
            this.state.selectedRows.delete(row.original.SALEID);
        }
        this.setState({ selectedRows: this.state.selectedRows });
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
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.SALEID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.SALEID) ? 'black' : '',
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
    componentWillReceiveProps(nextProps) {
        if (this.state.lang != nextProps.currentLanguage) {
            this.state.lang = nextProps.currentLanguage
            this.state.loading=true
            this.refReactTable.fireFetchData()
        }
        if (nextProps.isrefresh) {
            //this.refresh()
            let { pagesize, page, keySearch, sortSearch, colum } = this.state
            this.loadData(pagesize, page, keySearch, sortSearch, colum);
        }
    }
    fetchData(state, instance) {
        // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
        // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
        var that = this;
        // Request the data however you want.  Here, we'll use our mocked service we created earlier

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

        RestfulUtils.post('/user/getlistsalemanagers', { pagesize: this.state.pagesize, language: this.props.lang, OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                //console.log('sync success', resData)

                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord , dataAll: resData.DT.dataAll})
            } else {

                toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });

            }
        });

    }
    async loadData(pagesize, page, keySearch, sortSearch, columns) {

        let that = this;
        await RestfulUtils.post('/user/getlistsalemanagers', { pagesize, page, keySearch, sortSearch, language: this.props.lang, OBJNAME: this.props.OBJNAME }).then(resData => {


            // console.log('datatable',resData)
            // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
            if (resData.EC == 0) {
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
            }
            else {

            }


        });

    }
    refreshData = async () => {
        let result = await this.refresh();
        let { pagesize, page, keySearch, sortSearch } = this.state
        this.loadData(pagesize, page, keySearch, sortSearch);

    }
    // delete = () => {
    //     var { dispatch } = this.props;
    //     var datanotify = {
    //         type: "",
    //         header: "Huỷ",
    //         content: ""
    //     }
    //     this.state.selectedRows.forEach((key, value, set) => {
    //         new Promise((resolve, reject) => {
    //             let data = this.state.data.filter(e => e.SALEID === value);
    //             let success = null;
    //             resolve(RestfulUtils.post('/account/cancel', data[0])
    //                 .then(res => {
    //                     success = (res.data.EC == 0);
    //                     success ? toast.success("Huỷ tài khoản " + value + " thành công !", { position: toast.POSITION.BOTTOM_RIGHT })
    //                         : toast.error("Huỷ tài khoản " + value + " không thành công!. " + res.data.EM, { position: toast.POSITION.BOTTOM_RIGHT })
    //                     return res.data
    //                 })
    //             );
    //         })
    //     })
    // }
    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    checkValid(name, id) {
        let value = this.state[name].value;
        let mssgerr = '';


        switch (name) {

            case "GROUP":
                if (value == '') {
                    mssgerr = this.props.strings.requiredgrpid;
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
    submitGroup = () => {
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: " ,",
                content: ""
            }
            let i = 0;
            if (this.state.selectedRows.size > 0) {
                
                this.state.selectedRows.forEach((key, value, set) => {

                    new Promise((resolve, reject) => {

                        let data = this.state.data.filter(e => e.SALEID === value);
                        let success = null;
                        let datadelete = {
                            grpid: this.state.GROUP.value,
                            saleid: data[0].SALEID,
                            language: this.props.lang,
                            objname: this.props.OBJNAME
                        }
                        //console.log('datadelete ', datadelete)
                        resolve(RestfulUtils.post('/user/addsaleidtogroup', datadelete)
                            .then(res => {
                                i += 1

                                success = (res.EC == 0);
                                success ? toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                                    : toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                                if (this.state.selectedRows.size == i) {
                                    this.setState({ loaded: false })
                                    this.refresh()
                                    let data = {
                                        pageSize: this.state.pagesize,
                                        page: this.state.page,
                                        sorted: this.state.sortSearch,
                                        filtered: this.state.keySearch,
                                    }
                                    this.fetchData(data, { props: { columns: this.state.colum } })

                                    this.clearGroup()
                                    
                                }
                            })
                        );

                    })

                })
            } else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT })
        }
    }
    getOptions(input) {
        let data = {
            p_language: this.props.lang,
            p_autoid: 'ALL',

        }
        return RestfulUtils.post('/fund/getlistsale_groups', data)
            .then((res) => {

                //console.log(res.data)
                return { options: res };
            })
    }
    onChange(e) {
        if (e && e.value) {
            this.setState({ GROUP: e });
        } else {
            this.setState({ GROUP: { value: '', label: '' } });
        }
    }

    clearGroup() {
        this.setState({
            GROUP: { value: '', label: '' }
        })
    }
    reloadTable(){
        this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch)
    }
    handlEdit(SALEID) {
        this.props.showModalDetail("update", SALEID);
    }

    render() {
        const { data, pages, loading } = this.state;
        var that = this;

        return (
            <div>
                <div style={{ marginLeft: "-4px" }} className="col-md-12 ">

                    {/* <div className="col-md-2" style={{ marginRight: '28px', marginLeft: '-34px' }}><h5><b>{this.props.strings.titleNhom}</b></h5></div>
                    <div style={{ marginLeft: "-9%" }} className="col-md-4">
                        <Select.Async

                            name="form-field-name"
                            loadOptions={this.getOptions.bind(this)}
                            value={this.state.GROUP.value}
                            onChange={this.onChange.bind(this)}
                            id="cbGrpid"
                            autosize={false}
                        />

                    </div> */}
                    <div className="col-md-3">
                        <ButtonExport style={{ marginLeft: "5px" }} HaveChk={true} dataRows={this.state.dataAll} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />
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
                            // {
                            //     Header: props => <div className=" header-react-table">    <Checkbox checked={that.state.checkedAll} style={{ marginBottom: "14px", marginLeft: "8px" }} onChange={that.handleChangeALL.bind(that)} inline /></div>,
                            //     maxWidth: 45,
                            //     sortable: false,
                            //     style: { textAlign: 'center' },
                            //     Cell: (row) => (
                            //         <div>
                            //             <Checkbox style={{ textAlign: "center", marginLeft: "8px", marginTop: "-14px" }}
                            //                 checked={that.state.selectedRows.has(row.original.SALEID)}
                            //                 onChange={that.handleChange.bind(that, row)} inline
                            //             />
                            //         </div>
                            //     ),
                            //     Filter: ({ filter, onChange }) =>
                            //         null
                            // },
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
                                Header: props => <div className="">{this.props.strings.TLNAME}</div>,
                                id: "TLNAME",
                                accessor: "TLNAME",
                                width: 175,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.TLFULLNAME}</div>,
                                id: "TLFULLNAME",
                                accessor: "TLFULLNAME",
                                width: 190,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.RETYPE}</div>,
                                id: "RETYPE",
                                accessor: "RETYPE",
                                width: 190,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            // {
                            //     Header: props => <div className="">{this.props.strings.ROLENAME}</div>,
                            //     id: "ROLENAME",
                            //     accessor: "ROLENAME",
                            //     width: 190,
                            //     Cell: ({ value }) => (
                            //         <div className="col-left" style={{ float: "left" }}>{value}</div>
                            //     )
                            // },
                            {
                                Header: props => <div className="">{this.props.strings.BRNAME}</div>,
                                id: "BRNAME",
                                accessor: "BRNAME",
                                width: 160,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.MBNAME}</div>,
                                id: "MBNAME",
                                accessor: "MBNAME",
                                width: 270,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="">{this.props.strings.AREA}</div>,
                                id: "AREA",
                                accessor: "AREA",
                                width: 113,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="">{this.props.strings.ACTIVEDESC}</div>,
                                id: "ACTIVEDESC",
                                accessor: "ACTIVEDESC",
                                width: 125,
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
                        // loading={loading} // Display the loading overlay when we need it
                        onFetchData={this.fetchData.bind(this)}
                        data={data}
                        style={{
                            maxHeight: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                        }}
                        noDataText={this.props.strings.textNodata}
                        previousText={<i className="fas fa-backward"></i>}
                        pageText={getPageTextTable(this.props.lang)}
                        rowsText={getRowTextTable(this.props.lang)}
                        nextText={<i className="fas fa-forward"></i>}
                        loadingText="Đang tải..."
                        ofText="/"
                        getTrProps={this.onRowClick.bind(this)}
                        defaultPageSize={this.state.pagesize}
                        className="-striped -highlight"
                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                    />
                </div>
                {/* <div className="pull-right">
                    <input type="button" onClick={this.submitGroup} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
                </div> */}

            </div>
        );
    }
}

TableAddCreateThemMG_Nhom.defaultProps = {

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
    translate('TableAddCreateThemMG_Nhom')
]);

module.exports = decorators(TableAddCreateThemMG_Nhom);
