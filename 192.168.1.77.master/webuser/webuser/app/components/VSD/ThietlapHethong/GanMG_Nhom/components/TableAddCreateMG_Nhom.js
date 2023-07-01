import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import { showNotifi } from 'app/action/actionNotification.js';
import { ButtonExport } from '../../../../../utils/buttonSystem/ButtonSystem'
import RestfulUtils from 'app/utils/RestfulUtils';
import { requestData } from 'app/utils/ReactTableUlti';
import { DefaultPagesize,getRowTextTable,getPageTextTable } from 'app/Helpers'


class TableAddCreateMG_Nhom extends Component {
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
            pagesize: 5,
            keySearch: {},
            sortSearch: {},
            page: 1,
            data1: [],
            filteredData: [],
            loaded: false,
            p_saleacctno: '',
            sorted1: [],
            filtered1: [],
            checkFields: [
                { name: "grpid", id: "cbGrpid" },
            ],
            firstRender:true
        }
        // this.fetchData = this.fetchData.bind(this);
    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.loadgrid) {
            this.state.firstRender = true
            this.refReactTable.fireFetchData()
        }
    }
  

    handleChangeALL(evt) {
        var that = this;
        this.setState({ checkedAll: evt.target.checked });
        if (evt.target.checked) {
            that.state.filteredData.map(function (item) {
                if (!that.state.selectedRows.has(item.SALEACCTNO)) {
                    that.state.unSelectedRows.push(item.SALEACCTNO);
                    that.state.selectedRows.add(item.SALEACCTNO);
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

    handleChange(row) {

        if (!this.state.selectedRows.has(row.original.SALEACCTNO))
            this.state.selectedRows.add(row.original.SALEACCTNO);
        else {
            this.state.selectedRows.delete(row.original.SALEACCTNO);
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
                background: rowInfo== undefined ? '' : that.state.selectedRows.has(rowInfo.original.SALEACCTNO) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.SALEACCTNO) ? 'black' : '',
            }

        }
    }
   
    fetchData(state, instance) {

        let that = this
        if (this.state.firstRender) {
            let data = {
                p_saleid: 'ALL',
                language: this.props.lang,
                OBJNAME: this.props.OBJNAME
            }
            RestfulUtils.posttrans('/fund/getlistmove_sale_managers', { data }).then((resData) => {
             
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
                    this.state.filteredData = res.filteredData,
                    this.state.checkedAll = false;
                    // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                    this.setState(that.state);
            });
        }
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
            let i = 0;
            if (this.state.selectedRows.size > 0) {
                window.$('#btnSubmit').prop('disabled', true);
                this.state.selectedRows.forEach((key, value, set) => {

                    new Promise((resolve, reject) => {

                        let data = this.state.filteredData.filter(e => e.SALEACCTNO === value);
                        if (data && data.length > 0) {
                            let success = null;
                            console.log('data',data[0]);
                            let datadelete = {
                                p_newgrpid: this.props.grpid,
                                p_oldgrpid: data[0].GRPID,
                                p_saleacctno: data[0].SALEID+data[0].RETYPEID,
                                data: data[0],
                                p_language: this.props.lang,
                                pv_objname: this.props.OBJNAME
                            }
                            resolve(RestfulUtils.posttrans('/fund/move_sale_managers', datadelete)
                                .then(res => {
                                  
                                    i += 1
    
                                    success = (res.EC == 0);
                                    success ? toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                                        : toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                                    if (this.state.selectedRows.size == i) {
                                        this.state.firstRender = true
                                        this.refReactTable.fireFetchData()
                                        this.props.clearGroup()
                                        window.$('#btnSubmit').prop('disabled', false);
                                    }
                                })
                            );
                        }

                    })

                })
            } else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT })
        }
    }

    checkValid(name, id) {
        let value = this.props[name];
        let mssgerr = '';


        switch (name) {

            case "grpid":
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
    reloadTable() {
        this.state.firstRender = true
        this.refReactTable.fireFetchData()
    }
    render() {
        const { data, pages, loading } = this.state;
        var that = this;
        return (
            <div>
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
                                    maxWidth: 70,
                                    sortable: false,
                                    style: { textAlign: 'center' },
                                    Cell: (row) => (
                                        <div>
                                            <Checkbox style={{ textAlign: "center", marginLeft: "8px", marginTop: "-14px" }}
                                                checked={that.state.selectedRows.has(row.original.SALEACCTNO)}
                                                onChange={that.handleChange.bind(that, row)} inline
                                            />
                                            {/* <span onClick={that.handlEdit.bind(that, row.original.CUSTID)} className="glyphicon glyphicon-pencil"></span> */}
                                        </div>
                                    ),
                                    Filter: ({ filter, onChange }) =>
                                        null
                                },
                                {
                                    Header: props => <div className="">{this.props.strings.TLNAME}</div>,
                                    id: "TLNAME",
                                    accessor: "TLNAME",
                                    width: 150,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="">{this.props.strings.TLFULLNAME}</div>,
                                    id: "TLFULLNAME",
                                    accessor: "TLFULLNAME",
                                    width: 200,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="">{this.props.strings.RETYPE}</div>,
                                    id: "RETYPE",
                                    accessor: "RETYPE",
                                    width: 200,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.GRPID}</div>,
                                    id: "GRPID",
                                    accessor: "GRPID",
                                    width: 100,
                                    Cell: ({ value }) => (
                                        <div className="col-left">{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="">{this.props.strings.FULLNAME}</div>,
                                    id: "FULLNAME",
                                    accessor: "FULLNAME",
                                    width: 160,
                                    Cell: ({ value }) => (
                                        <div className="col-left">{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="">{this.props.strings.MANAGERNAME}</div>,
                                    id: "MANAGERNAME",
                                    accessor: "MANAGERNAME",
                                    width: 200,
                                    Cell: ({ value }) => (
                                        <div className="col-left">{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="">{this.props.strings.MANAGERFULLNAME}</div>,
                                    id: "MANAGERFULLNAME",
                                    accessor: "MANAGERFULLNAME",
                                    width: 200,
                                    Cell: ({ value }) => (
                                        <div className="col-left">{value}</div>
                                    )
                                },
                                /*
                                {
                                    Header: props => <div className="">{this.props.strings.desc}</div>,
                                    id: "DESC",
                                    accessor: "DESC",
                                    width: 150,
                                    Cell: ({ value }) => (
                                        <div className="col-left">{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="">{this.props.strings.status}</div>,
                                    id: "TXSTATUSDES",
                                    accessor: "TXSTATUSDES",
                                    width: 150,
                                    Cell: ({ value }) => (
                                        <div className="col-left">{value}</div>
                                    )
                                }
                                */
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
                            previousText={<i className="fas fa-backward"></i>}
                            nextText={<i className="fas fa-forward"></i>}
                          //  loadingText="Đang tải..."
                            ofText="/"
                            getTrProps={this.onRowClick.bind(this)}
                            defaultPageSize={DefaultPagesize}
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
                            // }}
                            ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                        />
                    </div>
               
                <div className="col-md-12">
                    <ButtonExport style={{ marginLeft: "5px" }} HaveChk={true} dataRows={this.state.dataALL} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />
                    <div className="pull-right">
                        <input type="button" onClick={this.submitGroup} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />

                    </div>
                </div>
            </div>
        );
    }
}

TableAddCreateMG_Nhom.defaultProps = {

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
    translate('TableAddCreateMG_Nhom')
]);

module.exports = decorators(TableAddCreateMG_Nhom);
