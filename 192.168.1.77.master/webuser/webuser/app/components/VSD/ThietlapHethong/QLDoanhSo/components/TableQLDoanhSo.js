import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import { ButtonExport } from '../../../../../utils/buttonSystem/ButtonSystem';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils'
import { DefaultPagesize, getExtensionByLang,getRowTextTable,getPageTextTable } from 'app/Helpers'
import { requestData } from 'app/utils/ReactTableUlti';
import NumberFormat from 'react-number-format';

class TableQLDoanhSo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                
            ],
            mock: [
                {
                    DateHH : "14/10/2018",
                    CodeMG : "123456",
                    NameMG : "LamVDT",
                    Role : "test",
                    Type : "test loai hinh",
                    OrderType : "test loai lenh",
                    DirectThreshold : "1000000",
                    IndirectThreshold :"500000",
                    DuocHoaHong : "Y",
                    DoanhSo : "10000000",
                    DoanhSoVuotDinhMuc : "9000000",
                    AMT :"500000"
                }
           

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
            page: 1,
            data1: [],
            loaded: false,

            sorted: [],
            filtered: [],
            firstRender:true,
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
   
    handleAdd(evt) {
        var that = this;
        that.props.showModalDetail("add");
    }
    handlEdit(DATA) {
        var that = this;
        that.props.showModalDetail("update", DATA);
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
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.AUTOID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.AUTOID) ? 'black' : '',
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
        let colum = instance.props
        if (this.state.loading) {
            new Promise((resolve, reject) => {
                let { pageSize, page, filtered, sorted } = state;
                
                setTimeout(() => resolve(this.loadData(pageSize, page + 1, filtered, sorted, instance.props.columns)), 500);
            })
        }
        this.setState({ loading: true , colum :colum })
    }
    async loadData(pagesize, page, keySearch, sortSearch, columns) {
        let that = this
            let data = {
                p_orderid: 'ALL',
                language: this.props.lang,
                OBJNAME: this.props.OBJNAME,
                p_custodycd: '',
                pagesize, 
                page, 
                keySearch, 
                sortSearch, 
                columns

            }
            console.log(data)
            RestfulUtils.posttrans('/fund/getsalescalculator', {p_language: this.props.lang,OBJNAME: this.props.OBJNAME,pagesize, page, keySearch, sortSearch, columns }).then((resData) => {
                if (resData.EC == 0) {
                    that.setState({
                        data: resData.DT.data,
                        pages: resData.DT.numOfPages,
                        keySearch,
                        page,
                        pagesize,
                        sortSearch,
                        sumRecord: resData.DT.sumRecord,
                        colum: columns,
                        dataAll : resData.DT.dataAll
                    });
                }
                else {
                }
        
    })
}

    delete = () => {
       
        let i = 0;
        if (this.state.selectedRows.size > 0) {
            this.state.selectedRows.forEach((key, value, set) => {

                new Promise((resolve, reject) => {

                    let data = this.state.data.filter(e => e.AUTOID === value);
                    let success = null;
                    let datadelete = {
                        data: data[0],
                        p_language: this.props.lang,
                        pv_objname: this.props.OBJNAME
                    }
                    resolve(RestfulUtils.posttrans('/fund/deletesale_retype', datadelete)
                        .then(res => {
                            i += 1

                            success = (res.EC == 0);
                            success ? toast.success(this.props.strings.deletesuccess, { position: toast.POSITION.BOTTOM_RIGHT })
                                : toast.error(this.props.strings.deletefail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                            if (this.state.selectedRows.size == i) {
                                this.state.firstRender = true
                                this.refReactTable.fireFetchData()

                            }
                        })
                    );

                })

            })
        } else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT })



    }
    reloadTable() {
        this.state.firstRender = true
        this.refReactTable.fireFetchData()
    }
    render() {
        const { data,mock, pages, pagesize } = this.state;
        console.log(this.props.strings)
        var that = this;
        return (
            <div>
                <div className="row">
                    
                    <div className="col-md-3">
                        <ButtonExport style={{ marginLeft: "5px" }} HaveChk={true} dataRows={this.state.dataAll} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />
                    </div>
                    <div style={{ textAlign: "right" }} className="col-md-12 RightInfo">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}>
                            <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {data.length}
                            <span className="ReloadButton" onClick={this.reloadTable.bind(this)}><i className="fas fa-sync-alt"></i></span>
                        </h5>
                    </div>
                </div>
                
                    <div className="col-md-12" >
                        <ReactTable
                            columns={[
                                // {
                                //     Header: props => <div className=" header-react-table">    
                                //     </div>,
                                //     maxWidth: 100,
                                //     sortable: false,
                                //     style: { textAlign: 'center' },
                                //     Cell: (row) => (
                                        
                                //         <div>
                                //             {row.original.SALETYPE == 'A'? <button onClick={that.handlEdit.bind(that, row.original)} className="btn btn-primary" id={"pencil" + row.index}>{this.props.strings.detail}</button> :null}
                                //         </div>
                                        
                                //     ),
                                //     Filter: ({ filter, onChange }) =>
                                //         null
                                // },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.S_SALEDATE}</div>,
                                    id: "S_SALEDATE",
                                    accessor: "S_SALEDATE",
                                    width: 70,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.SALEIDNEW}</div>,
                                    id: "SALEIDNEW",
                                    accessor: "SALEIDNEW",
                                    width: 100,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.TLFULLNAME}</div>,
                                    id: "TLFULLNAME",
                                    accessor: "TLFULLNAME",
                                    width: 150,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
                                },
                                // {
                                //     Header: props => <div className="wordwrap">{this.props.strings.REROLEDES}</div>,
                                //   //  id: "ACTYPEDES",
                                //   //  accessor: "ACTYPEDES",
                                //   id: "REROLEDES",
                                //   accessor: "REROLEDES",
                                //   width: 200,
                                //   Cell: ({ value }) => (
                                //       <div className="col-left" style={{ float: "left" }}>{value}</div>
                                //   )
                                // },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.TYPENAME}</div>,
                                  //  id: "REPRODUCTDES",
                                 //   accessor: "REPRODUCTDES",
                                 id: "TYPENAME",
                                 accessor: "TYPENAME",
                                 width: 200,
                                 Cell: ({ value }) => (
                                     <div className="col-left" style={{ float: "left" }}>{value}</div>
                                 )
                                },
                                // {
                                //     Header: props => <div className="wordwrap">Loại lệnh</div>,
                                //   //  id: "REROLEDES",
                                //    // accessor: "REROLEDES",
                                //    id: "OrderType",
                                //    accessor: "OrderType",
                                //    width: 100,
                                //    Cell: ({ value }) => (
                                //        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                //    )
                                // },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.DMDS_NEW}</div>,
                                    id: "DMDS_NEW",
                                    accessor: "DMDS_NEW",
                                    width: 150,
                                    Cell: ({ value }) => (
                                        <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                    )

                                },

                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.DMNHOM_NEW}</div>,
                                    id: "DMNHOM_NEW",
                                    accessor: "DMNHOM_NEW",
                                    width: 150,
                                    Cell: ({ value }) => (
                                        <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                    )
                                },
                                // {
                                //     Header: props => <div className="wordwrap">{this.props.strings.ISCOMM}</div>,
                                //     id: "ISCOMM",
                                //     accessor: "ISCOMM_NEW",
                                //     width: 100,
                                //     Cell: ({ value }) => (
                                //         <div className="col-right">{value}</div>
                                //     )

                                // },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.TRADINGVALUE}</div>,
                                    id: "TRADINGVALUE",
                                    accessor: "TRADINGVALUE",
                                    width: 85,
                                    Cell: ({ value }) => (
                                        <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                    )

                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.DSHH}</div>,
                                    id: "DSHH",
                                    accessor: "DSHH",
                                    width: 100,
                                    Cell: ({ value }) => (
                                        <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                    )

                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.FEEVALUE}</div>,
                                    id: "FEEVALUE",
                                    accessor: "FEEVALUE",
                                    width: 100,
                                    Cell: ({ value }) => (
                                        <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                    )

                                },
                                // {
                                //     Header: props => <div className="wordwrap">{this.props.strings.FEEVALUEBONUS}</div>,
                                //   //  id: "ACTYPEDES",
                                //   //  accessor: "ACTYPEDES",
                                //   id: "FEEVALUEBONUS",
                                //   accessor: "FEEVALUEBONUS",
                                //   width: 150,
                                //   Cell: ({ value }) => (
                                //     <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                // )
                                // },
                                // {
                                //     Header: props => <div className="wordwrap">{this.props.strings.FEEVALUEREAL}</div>,
                                //   //  id: "ACTYPEDES",
                                //   //  accessor: "ACTYPEDES",
                                //   id: "FEEVALUEREAL",
                                //   accessor: "FEEVALUEREAL",
                                //   width: 150,
                                //   Cell: ({ value }) => (
                                //     <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                // )
                                // },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.TAX}</div>,
                                  //  id: "ACTYPEDES",
                                  //  accessor: "ACTYPEDES",
                                  id: "TAX",
                                  accessor: "TAX",
                                  width: 150,
                                  Cell: ({ value }) => (
                                    <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                )
                                },
                                // {
                                //     Header: props => <div className="wordwrap">{this.props.strings.FEEVALUELEFT}</div>,
                                //   //  id: "ACTYPEDES",
                                //   //  accessor: "ACTYPEDES",
                                //   id: "FEEVALUELEFT",
                                //   accessor: "FEEVALUELEFT",
                                //   width: 150,
                                //   Cell: ({ value }) => (
                                //     <NumberFormat id={"lbl" + value} value={value ? value : ''} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                // )
                                // },
                                
                                // {
                                //     Header: props => <div className="wordwrap">{this.props.strings.DIENGIAI}</div>,
                                //   //  id: "ACTYPEDES",
                                //   //  accessor: "ACTYPEDES",
                                //   id: "DIENGIAI",
                                //   accessor: "DIENGIAI",
                                //   width: 150,
                                //   Cell: ({ value }) => (
                                //       <div className="col-left" style={{ float: "left" }}>{value}</div>
                                //   )
                                // },
                                
                                
                                /*
                                {
                                    Header: props => <div className="header_table_pad_3">{this.props.strings.desc}</div>,
                                    ID: "DESCRIPTION",
                                    accessor: "DESCRIPTION",
                                    width: 219,
                                    Cell : ({value}) =>(
                                        <div className="col-left" >{value}</div>
                                    )
                                },
    
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
                            // onPageChange={(pageIndex) => {
                            //     this.state.selectedRows = new Set(),
                            //         this.state.checkedAll = false
                            // }
                            // }
                            ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                        />
                    </div>
               
            </div>
        );
    }
}

TableQLDoanhSo.defaultProps = {

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
    lang: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('TableQLDoanhSo')
]);

module.exports = decorators(TableQLDoanhSo);
