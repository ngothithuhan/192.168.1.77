import React from 'react';
import { connect } from 'react-redux';
import RestfulUtils from 'app/utils/RestfulUtils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
// import ComfirmCA from './ComfirmCA';
import { Collapse } from 'react-bootstrap';

import Select from 'react-select'
import path from 'path'
import { DefaultPagesize, getExtensionByLang, getRowTextTable, getPageTextTable, AllKeyLang, ArrSpecial } from 'app/Helpers'
import moment from 'moment'
function toNormalize(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
}
const requestData = (pageSize, page, sorted, filtered, rawData) => {
    return new Promise((resolve, reject) => {
  
        // You can retrieve your data however you want, in this case, we will just use some local data.
        let filteredData = rawData;

        // You can use the filters in your request, but you are responsible for applying them.
        if (filtered.length) {
            filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
                return filteredSoFar.filter(row => {
                    if (nextFilter.value == 'all') 
                        return (row[nextFilter.id].toUpperCase() + "")
                    else 
                        return (toNormalize(row[nextFilter.id].toUpperCase()) + "").includes(toNormalize(nextFilter.value.toUpperCase()));
                });
            }, filteredData);
        }
    
        // You can also use the sorting in your request, but again, you are responsible for applying it.
    
        if (sorted.length) {
            let filteredDatanull = filteredData.filter(nodes => nodes[sorted[0].id] != null)
            if (filteredDatanull.length != 0) {
                let filteredDatanotnull = filteredDatanull[0][sorted[0].id]
                if (moment(filteredDatanotnull, "DD/MM/YYYY", true).isValid() == true) {
                    filteredData = _.sortBy(filteredData, function (dateObj) {
                        return new moment(dateObj[sorted[0].id], "DD/MM/YYYY") || '';
                    });
                    filteredData = sorted[0].desc == false ? filteredData : filteredData.reverse()
                } else if (isNaN(filteredDatanotnull) == false) {
                    filteredData = _.sortBy(filteredData, function (num) {
                        return parseFloat(num[sorted[0].id]) || '';

                    })
                    filteredData = sorted[0].desc == false ? filteredData : filteredData.reverse()

                } else {
                    filteredData = _.sortBy(filteredData, function (str) {
                        return str[sorted[0].id] || '';
                    })
                    filteredData = sorted[0].desc == false ? filteredData : filteredData.reverse()
                }
            }
        }
    
        const sortedData = filteredData
        // You must return an object containing the rows of the current page, and optionally the total pages number.
        const res = {
            rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
            pages: Math.ceil(filteredData.length / pageSize)
        };
    
        // Here we'll simulate a server response with 500ms of delay.
        setTimeout(() => resolve(res), 500);
    });
};
class TraCuuBaoCaoVSD extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reportRequestData: [],
            activePage: '1',
            numPerPage: '5',
            pages: null,
            pageSize: DefaultPagesize,
            dataCA: {
                showModal: false
            },
            collapse: {
                FormInfo1: true,
                FormInfo2: true,
                FormInfo3: true,
            },
            RPTID: {},
            showReportParamsModal: false,
            CODEID: "",
            TRADINGDATE: "",
            TYPEREPORT: '',
            data1: [],
            loaded: false,
            page: 1,
            sorted1: [],
            filtered1: [],
            loading: true,
            loadgrid: false,
            isClear: true,
            firstRender: true,
            datareport: []
        };
    }
    
    // componentDidMount() {
    //     let self = this
    //     RestfulUtils.post('/report/getlistreport', { language: this.props.lang, p_objname: this.props.OBJNAME, p_tlname: this.props.auth.user.USERID ? this.props.auth.user.USERID : '', p_reflogid: '', AllKeyLang })
    //         .then((res) => {
    //             for (let i = 0; i < AllKeyLang.length; i++) {
    //                 this.state.datareport[AllKeyLang[i]] = res['result' + AllKeyLang[i]]
    //             }
    //             self.setState({ datareport: self.state.datareport })
    //         });
    // }

    changeActiveTab(type, e) {
        this.setState({ activeTab: type });
    }
    getReportRequest() {
        this.state.firstRender = true
        this.refReactTable.fireFetchData()
    }
    fetchData(state, instance) {
        let that = this
        if (this.state.firstRender) {
            var obj = {};
            obj.p_autoid = ''
            obj.p_type = "M";
            obj.p_codeid = this.state.CODEID
            obj.p_tradingdate = this.state.TRADINGDATE
            obj.p_rptid = ''
            obj.objname = this.props.OBJNAME
            RestfulUtils.posttrans('/report/getreportrequestvsd', obj).then((resData) => {
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
                            reportRequestData: res.rows,
                            pages: res.pages,
                            // loading: false,
                            firstRender: false,
                            data1: resData.DT.data,
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
                this.state.data1,
            ).then(res => {
                this.state.reportRequestData = res.rows,
                    this.state.pages = res.pages,
                    // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                    this.setState(that.state);
            });
        }
    }
    handlDownload(data){
        let datasend = {
            downloadpath : data.DOWNLOADPATH,
            language: this.props.lang,
            objname: this.props.objname
        }
        let success = null;
        //console.log('datasend ', datasend)
        RestfulUtils.post('/report/downloadreportvsd', datasend)
            .then((res) => {
                // if(res.EC==0) {
                //     toast.success(this.props.strings.success, { position: toast.POSITION.BOTTOM_RIGHT })
                //     this.props.closeModalDetail()
                //     this.props.loadWhenSuccess()
                // }
                // else {
                //     toast.error(this.props.strings.fail + res.EM, { position: toast.POSITION.BOTTOM_RIGHT })
                // }
            })
    }
    render() {

        let that = this;
        let { data, pages, loading } = this.state;
        let { reportRequestData, pageSize, RPTID } = this.state;
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">
                <div className="title-content"><div>{this.props.strings.title}</div></div>
                <div className="panel-body ">
                    <div className="row" style={{ marginBottom: "10px", marginLeft: -13 }}>

                        <div className="col-md-12 btn-customer-crud" style={{ paddingBottom: "10px" }}>
                            <button style={{ marginLeft: "5px" }} onClick={this.getReportRequest.bind(this)} className="btn btn-default"><span style={{ marginRight: "3px" }} className="glyphicon glyphicon-refresh"></span>{this.props.strings.refesh}</button>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <ReactTable
                            columns={[
                                // {
                                //     Header: props => <div className="wordwrap">{this.props.strings.CODEID}</div>,
                                //     id: "MSGID",
                                //     accessor: "MSGID",

                                //     width: 100,
                                //     Cell: ({ value }) => {
                                //         return (
                                //             <span style={{ float: 'left', paddingLeft: '5px' }}>
                                //                 {value}
                                //             </span>)
                                //     },
                                // },
                                
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.rptid}</div>,
                                    id: "TLTXCD",
                                    accessor: "TLTXCD",
                                    // filterable: false,
                                    width: 120,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'center', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    },
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.SESSIONNO}</div>,
                                    id: "SESSIONNO",
                                    accessor: "SESSIONNO",
                                    // filterable: false,
                                    width: 150,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'center', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    },
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.REPORTNAME}</div>,
                                    id: "REPORTNAME",
                                    accessor: "REPORTNAME",
                                    // filterable: false,
                                    width: 150,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'center', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    }, 
                                },
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.DESCRIPTION}</div>,
                                    id: "DESCRIPTION",
                                    accessor: "DESCRIPTION",
                                    // filterable: false,
                                    width: 580,
                                    Cell: ({ value }) => {
                                        return (
                                            <span style={{ float: 'left', paddingLeft: '5px' }}>
                                                {value}
                                            </span>)
                                    }, 
                                },
                                
                                {
                                    Header: props => <div className="wordwrap">{this.props.strings.reportformat}</div>,
                                    id: "FILETYPE",
                                    filterable: false,
                                    width: 150,
                                    Cell: (row) => (
                                       
                                        <span style={{ float: 'left', paddingLeft: '5px' }}>
                                            {'A' == 'A' ? row.original.REFRPTFILE.split('$#').map((item, index) => {
                                                return <a key={index} href={'/report/downloadreportvsd?AUTOID=' + row.original.MSGID + '&extension=' + 'CSV' + '&TYPE=M' + '&RPTID=' + row.original.MSGID + '&REFRPTFILE=' + row.original.REFRPTFILE} target="_blank">{path.extname(item).toUpperCase()}</a>
                                            }): null}
                                        </span>
                                    )
                                },
                                // {
                                //   Header: props => <div>Xác nhận ký số</div>,
                                //   width: 100,
                                //   id: "ISCA",
                                //   Cell: (row) => (
                                //     row.original.ISCA === "Y" && row.original.ISSIGNOFF === "N" ? <span className="text-center"><button className="btn btn-primary" onClick={that.onClickShowCA.bind(this, row)}> Xác nhận </button></span>
                                //       : row.original.ISCA === "Y" && row.original.ISSIGNOFF === "Y" ? <span className="text-center"> Đã xác nhận </span> : null
                                //   )
                                // },

                            ]}
                            getTheadTrProps={() => {
                                return {
                                    className: 'head'
                                }
                            }}
                            manual
                            filterable
                            pages={pages}
                            data={reportRequestData}
                            onFetchData={this.fetchData.bind(this)}
                            pageText={getPageTextTable(this.props.lang)}
                            rowsText={getRowTextTable(this.props.lang)}
                            previousText={<i className="fas fa-backward" id="previous"></i>}
                            nextText={<i className="fas fa-forward" id="next"></i>}
                            // loadingText="Đang tải..."
                            ofText="/"
                            noDataText=''
                            defaultPageSize={pageSize}
                            //  showPagination={false}
                            className="-striped -highlight"
                            //   loading={loading}
                            ref={(refReactTable) => { this.refReactTable = refReactTable; }}

                        />
                    </div>

                </div>


            </div>
        );
    }
}

const stateToProps = state => ({
    notification: state.notification,
    styleWeb: state.styleWeb,
    lang: state.language.language,
    auth: state.auth,
  });
  
  
  const decorators = flow([
    connect(stateToProps),
    translate('TraCuuBaoCaoVSD')
]);

module.exports = decorators(TraCuuBaoCaoVSD);