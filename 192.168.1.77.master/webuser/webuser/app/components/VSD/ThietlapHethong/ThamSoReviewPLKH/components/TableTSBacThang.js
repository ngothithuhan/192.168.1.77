import React, { Component } from 'react';
import ReactTable from "react-table";
import {  Checkbox } from 'react-bootstrap';
import { ButtonAdd, ButtonDelete } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import {  toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import NumberFormat from 'react-number-format';
import { requestData } from 'app/utils/ReactTableUlti';

class TableTSBacThang extends Component {
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

            pagesize: 5,
            keySearch: {},
            sortSearch: {},
            page: 1,
            data1: [],
            loaded: false,

            sorted1: [],
            filtered1: [],
            firstRender:true
        }
        // this.fetchData = this.fetchData.bind(this);
    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.loadgridbacthang) {
            this.state.firstRender = true
            this.refReactTable1.fireFetchData()

        }
    }
  
    handleAdd(evt) {

        var that = this;
        that.props.showModalDetail1("add", this.state.data);

    }
    handlEdit(data) {
        var that = this;
        that.props.showModalDetail1("update", data);
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
       
      
        if (!this.state.selectedRows.has(row.original.AUTOID)) {
                this.state.selectedRows.clear()
                this.state.selectedRows.add(row.original.AUTOID);
        }

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
                that.props.showModalDetail("view", rowInfo.original.CUSTID)
            },
            style: {
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTID) ? 'black' : '',
            }

        }
    }
   
    fetchData(state, instance) {

        let that = this
        if (this.state.firstRender) {
            let data = {
                refid: this.props.refID,
                p_language: this.props.lang,
                OBJNAME: this.props.OBJNAME
            }
            RestfulUtils.post('/fund/getlistreviewparam', { data }).then((resData) => {
           
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
                        resolve(RestfulUtils.posttrans('/fund/deletereviewparam', datadelete)
                            .then(res => {
                                i += 1

                                success = (res.EC == 0);
                                success ? toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                                    : toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                                if (this.state.selectedRows.size == i) {
                                    this.state.firstRender = true
                                    this.refReactTable1.fireFetchData()
    

                                }
                            })
                        );

                    })

                })
            
        }else toast.error(this.props.strings.warningchooserecord, { position: toast.POSITION.BOTTOM_RIGHT })



    }

    render() {
       
        const { data, pages, loading } = this.state;
        let displayy=this.props.accesss=='view'?true:false
        var that = this;
        let datapage = {
            ISADD: "Y",
            ISDELETE: "Y",
            ISAPPROVE: "Y"

        }

        return (
            <div>

                <div style={{ marginLeft: "-18px" }} className="col-md-12 ">

                    <ButtonAdd disabled={displayy} style={{ marginLeft: "5px" }} data={datapage} onClick={this.handleAdd.bind(this)} id="btnADDTSBT"/>
                    <ButtonDelete disabled={displayy} style={{ marginLeft: "5px" }} onClick={this.delete} data={datapage} id="btnDELTSBT"/>

                </div>
               
                    <div className={this.props.accesss=='view'?"col-md-12 disable":"col-md-12"} style={{ paddingLeft: 30, paddingRight: 30 }}>
                        <ReactTable
                            columns={[
                                {
                                    Header: props => <div className=" header-react-table">   </div>,
                                    maxWidth: 70,
                                    sortable: false,
                                    style: { textAlign: 'center' },
                                    Cell: (row) => (
                                        <div>
                                            <Checkbox style={{ textAlign: "center", marginLeft: "11px", marginTop: "-14px" }}
                                                checked={that.state.selectedRows.has(row.original.AUTOID)}
                                                onChange={that.handleChange.bind(that, row)} inline
                                                id={'ck'+row.original.AUTOID}
                                                disabled={displayy}
                                            />
                                        </div>
                                    ),
                                    Filter: ({ filter, onChange }) =>
                                        null
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblFRAMT">{this.props.strings.fromfee}</div>,
                                    id: "FRAMT",
                                    accessor: "FRAMT",
                                    width: 130,
                                    Cell: ({ value }) => (
                                        <NumberFormat id={"lbl" + value} className="col-right" value={value==0 ? 0 : value} displayType={'text'}  decimalScale={0} thousandSeparator={true}/>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblTOAMT">{this.props.strings.tofee}</div>,
                                    id: "TOAMT",
                                    accessor: "TOAMT",
                                    width: 130,
                                    Cell: ({ value }) => (
                                        <NumberFormat id={"lbl" + value} className="col-right" value={value==0 ? 0 : value} displayType={'text'}  decimalScale={0} thousandSeparator={true}/>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblCLASSDES">{this.props.strings.custtype}</div>,
                                    id: "CLASSDES",
                                    accessor: "CLASSDES",
                                    width: 110,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblAPPLY">{this.props.strings.apply}</div>,
                                    id: "APPLYDES",
                                    accessor: "APPLYDES",
                                    width: 120,
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
                            pageText={this.props.strings.pageText}
                            rowsText={this.props.strings.rowsText}
                            previousText={<i className="fas fa-backward" id="previous"></i>}
                            nextText={<i className="fas fa-forward" id="next"></i>}
                         //   loadingText="Đang tải..."
                            ofText="/"
                            getTrGroupProps={(row) => {
                                return {
                                    id: "haha"
                                }
                            }}
                            getTrProps={this.onRowClick.bind(this)}
                            defaultPageSize={this.state.pagesize}
                            className="-striped -highlight"
                            onPageChange={(pageIndex) => {
                                this.state.selectedRows = new Set(),
                                    this.state.checkedAll = false
                            }
                            }
                            ref={(refReactTable1) => { this.refReactTable1 = refReactTable1; }}
                            showPagination={false}
                        />
                    </div>
              
            </div>
        );
    }
}

TableTSBacThang.defaultProps = {

    strings: {
  

    },


};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language,

});


const decorators = flow([
    connect(stateToProps),
    translate('TableTSBacThang')
]);

module.exports = decorators(TableTSBacThang);
