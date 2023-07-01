import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import { ButtonAdd, ButtonDelete, ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import NumberInput from 'app/utils/input/NumberInput';
import { DefaultPagesize, getExtensionByLang,getRowTextTable,getPageTextTable } from 'app/Helpers'
import { requestData } from 'app/utils/ReactTableUlti';


class TableGanBieuPhi extends Component {
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
            CUSTID_DETAIL: '',
            pagesize: DefaultPagesize,
            keySearch: {},
            sortSearch: {},
            page: 1,
            data1: [],
            loaded: false,
            sorted1: [],
            filtered1: [],
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
    handlEdit(data) {

        var that = this;
        that.props.showModalDetail("update", data);
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
                if (!that.state.selectedRows.has(item.ID)) {
                    that.state.unSelectedRows.push(item.ID);
                    that.state.selectedRows.add(item.ID);
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
        if (!this.state.selectedRows.has(row.original.ID))
            this.state.selectedRows.add(row.original.ID);
        else {
            this.state.selectedRows.delete(row.original.ID);
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
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.ID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.ID) ? 'black' : '',
            }
        }
    }
    
    fetchData(state, instance) {

        let that = this
        if (this.state.firstRender) {
            let data = {
                objname:this.props.OBJNAME,
                p_language: this.props.lang,
            }
            RestfulUtils.posttrans('/fund/getlistfeeassign', { data }).then((resData) => {
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
                    this.state.colum = instance.props.columns
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

                    let data = this.state.data.filter(e => e.ID === value);
                    let success = null;
                    let datadelete = {
                        data: data[0],
                        p_language: this.props.lang,
                        pv_objname: this.props.OBJNAME
                    }
                    resolve(RestfulUtils.posttrans('/fund/deletefeeassign', datadelete)
                        .then(res => {
                            i += 1

                            success = (res.EC == 0);
                            success ? toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                                : toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
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
        const { data, pages,pagesize } = this.state;
        var that = this;
        return (

            <div>

                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                        <ButtonAdd style={{ marginLeft: "5px" }} data={this.props.datapage} onClick={this.handleAdd.bind(this)} />
                        {/* <ButtonApprove style={{marginLeft:"5px"}} onClick={this.approve} data={this.props.datapage} />*/}
                        {/*  <ButtonReject onClick={this.reject} style={{marginLeft:"5px"}} data={this.props.datapage} />*/}
                        <ButtonDelete style={{ marginLeft: "5px" }} onClick={this.delete} data={this.props.datapage} />
                        <ButtonExport style={{ marginLeft: "5px" }} dataRows={this.state.dataALL} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} HaveChk={true}/>

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
                                    Header: props => <div className=" header-react-table"> <Checkbox checked={that.state.checkedAll} style={{ marginBottom: "14px" }} onChange={that.handleChangeALL.bind(that)} inline />  </div>,
                                    maxWidth: 55,
                                    sortable: false,
                                    style: { textAlign: 'center' },
                                    Cell: (row) => (
                                        <div>
                                            <Checkbox style={{ textAlign: "center", marginLeft: "11px", marginTop: "-14px" }}
                                                checked={that.state.selectedRows.has(row.original.ID)}
                                                onChange={that.handleChange.bind(that, row)} inline
                                            />
                                            <span onClick={that.handlEdit.bind(that, row.original)} className="glyphicon glyphicon-pencil" id={"pencil" + row.index}></span>
                                        </div>
                                    ),
                                    Filter: ({ filter, onChange }) =>
                                        null
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblFEEID">{this.props.strings.FEEID}</div>,
                                    id: "FEEID",
                                    accessor: "FEEID",
                                    width: 64,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                    )

                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblFEENAME">{this.props.strings.FEENAME}</div>,
                                    id: "FEENAME",
                                    accessor: "FEENAME",
                                    width: 140,

                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblVSDFEEID">{this.props.strings.VSDFEEID}</div>,
                                    id: "VSDFEEID",
                                    accessor: "VSDFEEID",
                                    width: 145,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                    )
                                },

                                {
                                    Header: props => <div className="wordwrap" id="lblFEETYPE">{this.props.strings[getExtensionByLang("FEETYPEDES",this.props.lang)]}</div>,
                                  //  id: "FEETYPEDES",
                                  //  accessor: "FEETYPEDES",
                                    id: getExtensionByLang("FEETYPEDES",this.props.lang),
                                    accessor: getExtensionByLang("FEETYPEDES",this.props.lang),
                                    width: 140,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                },

                                {
                                    Header: props => <div className="wordwrap" id="lblRULETYPE">{this.props.strings[getExtensionByLang("RULETYPEDES",this.props.lang)]}</div>,
                                 //   id: "RULETYPEDES",
                                   // accessor: "RULETYPEDES",
                                    id: getExtensionByLang("RULETYPEDES",this.props.lang),
                                    accessor: getExtensionByLang("RULETYPEDES",this.props.lang),
                                    width: 77,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblFEECAL">{this.props.strings[getExtensionByLang("FEECALCDES",this.props.lang)]}</div>,
                                   // id: "FEECALCDES",
                                    //accessor: "FEECALCDES",
                                    id: getExtensionByLang("FEECALCDES",this.props.lang),
                                    accessor: getExtensionByLang("FEECALCDES",this.props.lang),
                                    width: 75,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblFEERATE">{this.props.strings.AMT_RATE}</div>,
                                    id: "AMT_RATE",
                                    accessor: "AMT_RATE",
                                    width: 90,
                                    Cell: ({ value }) => (
                                        <div className="col-right">
                                            <NumberInput value={value} displayType={'text'} thousandSeparator={true} />
                                        </div>
                                    )
                                },

                                {
                                    Header: props => <div className="wordwrap" id="lblOBJFEETYPE">{this.props.strings[getExtensionByLang("OBJFEETYPEDES",this.props.lang)]}</div>,
                                 //   id: "OBJFEETYPEDES",
                                 //   accessor: "OBJFEETYPEDES",
                                    id: getExtensionByLang("OBJFEETYPEDES",this.props.lang),
                                    accessor: getExtensionByLang("OBJFEETYPEDES",this.props.lang),
                                    width: 114,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                },

                                /*
                                    Header: props => <div className="" id="lblDesc">{this.props.strings.object}</div>,
                                    id: "OBJFEEVALUE",
                                    accessor: "OBJFEEVALUE",
                                    width: 150,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                */
                                {
                                    Header: props => <div className="wordwrap" id="lblOBJFEEVALUE">{this.props.strings[getExtensionByLang("OBJFEEVALUEDES",this.props.lang)]}</div>,
                                    
                                    id: getExtensionByLang("OBJFEEVALUEDES",this.props.lang),
                                    accessor: getExtensionByLang("OBJFEEVALUEDES",this.props.lang),
                                    width: 200,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value != null ? value.indexOf("ALL") < 0 ? value : this.props.strings.all : value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblFEEAPPLY">{this.props.strings[getExtensionByLang("FEEAPPLYDES",this.props.lang)]}</div>,
                                  //  id: "FEEAPPLYDES",
                                 //   accessor: "FEEAPPLYDES",
                                    id: getExtensionByLang("FEEAPPLYDES",this.props.lang),
                                    accessor: getExtensionByLang("FEEAPPLYDES",this.props.lang),
                                    width: 85,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblSTATUS">{this.props.strings[getExtensionByLang("STATUSDES",this.props.lang)]}</div>,
                                  //  id: "STATUSDES",
                                   // accessor: "STATUSDES",
                                    id: getExtensionByLang("STATUSDES",this.props.lang),
                                    accessor: getExtensionByLang("STATUSDES",this.props.lang),
                                    width: 95,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblFRDATE">{this.props.strings.FRDATE}</div>,
                                    id: "FRDATE",
                                    accessor: "FRDATE",
                                    width: 80,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblTODATE">{this.props.strings.TODATE}</div>,
                                    id: "TODATE",
                                    accessor: "TODATE",
                                    width: 80,
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
                          //  loading={loading} // Display the loading overlay when we need it
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

TableGanBieuPhi.defaultProps = {
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
    translate('TableGanBieuPhi')
]);

module.exports = decorators(TableGanBieuPhi);
