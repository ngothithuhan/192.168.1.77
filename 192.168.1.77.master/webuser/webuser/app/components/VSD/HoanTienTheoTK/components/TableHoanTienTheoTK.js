import React, { Component } from 'react';
import ReactTable from "react-table";
import { ButtonAdd,ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize,getRowTextTable,getPageTextTable } from 'app/Helpers'
import NumberFormat from 'react-number-format';
import { requestData } from 'app/utils/ReactTableUlti';

class TableHoanTienTheoTK extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
            

            ],
            dataTest: [
             

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
                p_custodycd: 'ALL',
                language: this.props.lang,
                OBJNAME: this.props.OBJNAME
            }
            RestfulUtils.posttrans('/fund/getlistrefundbyaccount', { data }).then((resData) => {
               
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
                    // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                    this.setState(that.state);
            });
        }
    }


    

    reloadTable() {
        this.state.firstRender = true
        this.refReactTable.fireFetchData()
    }
    render() {
        const { data, pages, pagesize } = this.state;
        var that = this;
        return (
            <div>
                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                        <ButtonAdd style={{ marginLeft: "5px" }} data={this.props.datapage} onClick={this.handleAdd.bind(this)} />
                        <ButtonExport style={{ marginLeft: "5px" }} dataRows={this.state.dataALL} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} />

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
                                    Header: props => <div className="wordwrap">{this.props.strings.TXDATE}</div>,
                                    id: "TXDATE",
                                    accessor: "TXDATE",
                                    width: 240,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.ACCTNO}</div>,
                                    id: "ACCTNO",
                                    accessor: "ACCTNO",
                                    width: 300,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.NAMT}</div>,
                                    id: "NAMT",
                                    accessor: "NAMT",
                                    width: 300,
                                    Cell: ({ value }) => (
                                        <NumberFormat id={"lbl" + value} className="col-right" value={value == 0 ? 0 : value} displayType={'text'} decimalScale={0} thousandSeparator={true} />
                                    )
                                },
                                /*
                                {
                                    Header: props => <div className="">{this.props.strings.status}</div>,
                                    id: "STATUSDES",
                                    accessor: "STATUSDES",
                                    Cell: ( row ) => (
                                        <span className="col-left">
    
                                            <span style={{
    
                                                color:
                                                  row.original.STATUS =="P" ? 'rgb(0, 255, 247)' : row.original.STATUS=="R" ? 'rgb(230, 207, 17)'
                                                        : 'rgb(0, 255, 247)',
                                                transition: 'all .3s ease'
                                            }}>
                                                &#x25cf;
                                          </span> {
                                                row.original.STATUSDES
                                            }
                                        </span>
                                    ),
                                    width: 300
    
                                },
                                */
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.MAKER}</div>,
                                    id: "MAKER",
                                    accessor: "MAKER",
                                    width: 300,
                                    Cell: ({ value }) => (
                                        <div className="col-left">{value}</div>
                                    )
                                },
                                /*
                                {
                                    Header: props => <div className="">{this.props.strings.checker}</div>,
    
                                    accessor: "NGUOIDUYET",
                                    width: 150,
                                    Cell : ({value}) =>(
                                        <div className="col-left">{value}</div>
                                    )
    
                                },
    
    
                                {
                                    Header: props => <div className="">{this.props.strings.desc}</div>,
                                    id: "TRDESC",
                                    accessor: "TRDESC",
                                    width: 270,
                                    Cell : ({value}) =>(
                                        <div className="col-left">{value}</div>
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
                          ///  loading={loading} // Display the loading overlay when we need it
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
                            onPageChange={(pageIndex) => {
                                this.state.selectedRows = new Set(),
                                    this.state.checkedAll = false
                            }
                            }
                            ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                        />
                    </div>
                
            </div>
        );
    }
}

TableHoanTienTheoTK.defaultProps = {

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
    translate('TableHoanTienTheoTK')
]);

module.exports = decorators(TableHoanTienTheoTK);
