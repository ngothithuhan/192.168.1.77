import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import { getExtensionByLang } from '../../../../Helpers';
import Modalconfim from 'app/utils/modal/ModalConfirmBatch' 

class TableUndone extends Component {
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

            pagesize: 10,
            keySearch: {},
            sortSearch: {},
            page: 1,
            data1: [],
            loaded: false,

            sorted1: [],
            filtered1: [],
            txdate: '',
            firstRender: true,
            showModalConfirm: false,
        }
        // this.fetchData = this.fetchData.bind(this);
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
                if (!that.state.selectedRows.has(item.BCHMDL)) {
                    that.state.unSelectedRows.push(item.BCHMDL);
                    that.state.selectedRows.add(item.BCHMDL);
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

        if (!this.state.selectedRows.has(row.original.BCHMDL))
            this.state.selectedRows.add(row.original.BCHMDL);
        else {
            this.state.selectedRows.delete(row.original.BCHMDL);
        }
        this.setState({ selectedRows: this.state.selectedRows, checkedAll: false });
    }

   async fetchData(state, instance) {
        let date = this.state.txdate
        let that = this
        if (this.state.firstRender) {
            await RestfulUtils.post('/account/gettradingdate')
                .then((res) => {
                    let that = this;
                    date == '' ? date = res.DT.p_tradingdate : date = this.state.txdate
                    let data = {
                        p_txdate: date,
                        p_language: this.props.lang,
                        objname:this.props.OBJNAME
                    }
                    RestfulUtils.post('/fund/getlistbatcheod', { data }).then((resData) => {
                        // console.log('rs',resData.data.DT.data)
                        // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                        if (resData.EC == 0) {
                            // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                            this.setState({
                                // pages: res.pages,
                                // loading: false,
                                firstRender: false,
                                selectedRows: new Set(),
                                checkedAll: false,
                                data1: resData.DT.data,
                                data: resData.DT.data,
                                txdate: date
                            });

                        }
                    })
                })
        }
    }
    
    submit = async () => {
        let i = 0;
        let that=this
        let systemdate = this.props.tradingdate.split('/')
        
        let date = new Date();
        let date2 = new Date(systemdate[2],systemdate[1]-1,systemdate[0]);

        console.log('date2::::',date2)
            console.log('date:::',date)
            console.log('logic:::',date2 > date)
        let logic = date2 > date;
        if (this.state.selectedRows.size > 0) {
            
            //check ngày hệ thống > ngày hiện tại 
            if (logic){
                this.setState({showModalConfirm : true})
            }
            else{

            
                const iterator1 = this.state.selectedRows.entries();
            for (let entry of iterator1) {
                let data = this.state.data.filter(e => e.BCHMDL === entry[0]);
                let success = null;
                let datadelete = {
                    data: data[0],
                    p_txdate: this.state.txdate,
                    p_language: this.props.lang,
                    pv_objname: this.props.OBJNAME
                }
                var err = 0
                var errmsg
                await RestfulUtils.posttrans('/fund/batch_pr_batch', datadelete)
                    .then((res) => {
                        i = i + 1
                        err = res.EC
                        errmsg = res.EM
                        if (this.state.selectedRows.size == i) {
                            toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                            this.state.firstRender = true
                            this.refReactTable.fireFetchData()
                            this.props.load()
                       //     window.$('#btnSubmit').prop('disabled', false);
                            

                        }
                    })
                if (err != 0) {
                    toast.error(this.props.strings.errorbatch + errmsg, { position: toast.POSITION.BOTTOM_RIGHT })
                    this.state.firstRender = true
                    this.refReactTable.fireFetchData()
                    this.props.load()
                   // window.$('#btnSubmit').prop('disabled', false);
                    break;
                }
            }
        }
           // window.$('#btnSubmit').prop('disabled', true);
            
            
        } else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT })

    }
    submit2 = async () => {
        let i = 0;
        let that=this
        let date = new Date()
        if (this.state.selectedRows.size > 0) {

            
           // window.$('#btnSubmit').prop('disabled', true);
            
            const iterator1 = this.state.selectedRows.entries();
            for (let entry of iterator1) {
                let data = this.state.data.filter(e => e.BCHMDL === entry[0]);
                let success = null;
                let datadelete = {
                    data: data[0],
                    p_txdate: this.state.txdate,
                    p_language: this.props.lang,
                    pv_objname: this.props.OBJNAME
                }
                var err = 0
                var errmsg
                await RestfulUtils.posttrans('/fund/batch_pr_batch', datadelete)
                    .then((res) => {
                        i = i + 1
                        err = res.EC
                        errmsg = res.EM
                        if (this.state.selectedRows.size == i) {
                            toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                            this.state.firstRender = true
                            this.refReactTable.fireFetchData()
                            this.props.load()
                       //     window.$('#btnSubmit').prop('disabled', false);
                            

                        }
                    })
                if (err != 0) {
                    toast.error(this.props.strings.errorbatch + errmsg, { position: toast.POSITION.BOTTOM_RIGHT })
                    this.state.firstRender = true
                    this.refReactTable.fireFetchData()
                    this.props.load()
                   // window.$('#btnSubmit').prop('disabled', false);
                    break;
                }
            }
        } else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT })

    }
    async access() {

        let result = [];
        var that = this;
        //this.accessSelectRows();

        this.setState({ showModalConfirm: false })
        this.submit2();

    }
    render() {
        const { data, pages, loading } = this.state;
        let closeModalDelete = () => this.setState({ showModalConfirm: false });
        var that = this;

        return (
            <div>

                <div className="col-md-12 tablecustom" >
                    <ReactTable
                        columns={
                            [
                                {
                                    maxWidth: 40,
                                    sortable: false,
                                    style: { textAlign: 'center' },
                                    Cell: (row) => (
                                        <div>
                                            <Checkbox style={{ textAlign: "center", marginLeft: "10px", marginTop: "-14px" }}
                                                checked={that.state.selectedRows.has(row.original.BCHMDL)}
                                                onChange={that.handleChange.bind(that, row)} inline
                                            />
                                        </div>
                                    ),

                                },
                                {
                                    id: getExtensionByLang("BCHTITLE", this.props.lang),
                                    accessor: getExtensionByLang("BCHTITLE", this.props.lang),
                                    width: 511,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                    )
                                },
                            ]}
                        getTheadTrProps={() => {
                            return {
                                className: 'head'
                            }
                        }}

                        manual
                        filterable={false}
                        pages={pages} // Display the total number of pages
                        // loading={loading} // Display the loading overlay when we need it
                        onFetchData={this.fetchData.bind(this)}
                        data={data}
                        style={{
                            maxHeight: "293px" // This will force the table body to overflow and scroll, since there is not enough room
                        }}
                        noDataText={this.props.strings.textNodata}
                        showPageSizeOptions={false}
                        showPagination={false}

                        // loadingText="Đang tải..."
                        ofText="/"
                        defaultPageSize={20}
                        className="-striped -highlight"
                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}


                    />
                </div>

                <Checkbox checked={that.state.checkedAll} style={{ paddingLeft: "20px", paddingTop: "10px" }} onChange={that.handleChangeALL.bind(that)} inline >{this.props.strings.all}</Checkbox>

                <input type="button" onClick={this.submit.bind(this)} className="btn btn-primary" style={{ marginRight: -570, float: "right" }} value={this.props.strings.submit} id="btnSubmit" />
                <Modalconfim show={this.state.showModalConfirm} onHide={closeModalDelete} access={this.access.bind(this)} />
            </div>
        );
    }
}

TableUndone.defaultProps = {

    strings: {


    },


};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language,
    tradingdate: state.systemdate.tradingdate
});


const decorators = flow([
    connect(stateToProps),
    translate('TableUndone')
]);

module.exports = decorators(TableUndone);
