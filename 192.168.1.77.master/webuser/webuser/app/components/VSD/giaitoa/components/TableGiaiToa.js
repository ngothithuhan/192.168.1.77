import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { requestData } from 'app/utils/ReactTableUlti';
import { DefaultPagesize,getRowTextTable,getPageTextTable } from 'app/Helpers'
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'

class TableGiaiToa extends Component {
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

            pagesize: DefaultPagesize,
            keySearch: {},
            sortSearch: {},
            page: 1,
            data1: [],
            loaded: false,

            sorted1: [],
            filtered1: [],
            firstRender:true,
            
        }
        // this.fetchData = this.fetchData.bind(this);
    }
    componentWillReceiveProps(nextProps) {
    
        if (nextProps.loadgrid) {
            this.state.firstRender = true
            this.refReactTable.fireFetchData()
        }
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
               
                language: this.props.lang,
                objname:this.props.datapage.OBJNAME
            }
            RestfulUtils.posttrans('/fund/getlistblockafmast', { data }).then((resData) => {
          
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
        const { data, pages,pagesize } = this.state;
        var that = this;
        return (
            <div>
                <div className="row">
                <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                        <ButtonExport style={{ marginLeft: "5px" }} dataRows={this.state.dataALL} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} HaveChk={true} />

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
                                    maxWidth: 90,
                                    sortable: false,
                                    style: { textAlign: 'center' },
                                    Cell: (row) => (
                                        <div>
                                            <button type="button" className="btn btn-primary" id={"btnThucHien" + row.index} onClick={this.handlEdit.bind(this, row.original)}>  <a style={{ color: "#ffffff" }}>{this.props.strings.submit}</a></button>
                                            {/*<span onClick={that.handlEdit.bind(that, row.original.CUSTID)} className="btn btn-primary"></span>*/}
                                        </div>
                                    ),
                                    Filter: ({ filter, onChange }) =>
                                        null
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblCustodycd">{this.props.strings.CUSTODYCD}</div>,
                                    id: "CUSTODYCD",
                                    accessor: "CUSTODYCD",
                                    width: 130,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblFullname">{this.props.strings.FULLNAME}</div>,
                                    id: "FULLNAME",
                                    accessor: "FULLNAME",
                                    width: 310,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblIdcode">{this.props.strings.IDCODE}</div>,
                                    id: "IDCODE",
                                    accessor: "IDCODE",
                                    width: 130,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblIddate">{this.props.strings.IDDATE}</div>,
                                    id: "IDDATE",
                                    accessor: "IDDATE",
                                    width: 110,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblIdplace">{this.props.strings.IDPLACE}</div>,
                                    id: "IDPLACE",
                                    accessor: "IDPLACE",
                                    width: 370,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
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
                           // loadingText="Đang tải..."
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
                
            </div>
        );
    }
}

TableGiaiToa.defaultProps = {

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
    translate('TableGiaiToa')
]);

module.exports = decorators(TableGiaiToa);
