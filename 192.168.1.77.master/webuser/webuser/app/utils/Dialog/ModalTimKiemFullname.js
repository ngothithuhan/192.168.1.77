import React, { Component } from 'react';
import ReactTable from "react-table";
import { Modal } from 'react-bootstrap'

import { connect } from 'react-redux'
import DropdownFactory from 'app/utils/DropdownFactory';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import NumberFormat from 'react-number-format';
import { DefaultPagesize, getExtensionByLang, getRowTextTable, getPageTextTable } from 'app/Helpers';

class ModalTimKiemFullname extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: null,
            page: '',
            pagesize: 10,
            loading: false,
            data: [],
            keySearch: [],
            sortSearch: [],
            trangthai: 0,
            FULLNAME: '',
            IDCODE: '',
            data: [


            ],
        }
    }
    clear(){
        this.setState ({data: [],FULLNAME: '',IDCODE: '',})
    }
    close = () => {
        this.props.closeModalTimKiem();
        this.clear()
    }
    fetchData = (state, instance) => {
        if (this.state.loading) {
            new Promise((resolve, reject) => {
                let { pageSize, page, filtered, sorted } = state;
                setTimeout(() => resolve(this.loadData(pageSize, page + 1, filtered, sorted, instance.props.columns)), 500);
            })
        }
        this.setState({ loading: true })
    }
    async loadData(pagesize, page, keySearch, sortSearch) {
        let that = this;
        await RestfulUtils.post('/user/getListUserByName', { p_fullname: that.state.FULLNAME, p_idcode: that.state.IDCODE, pagesize, page, keySearch: keySearch, sortSearch, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
            console.log('resData::::', resData)
            if (resData.EC == 0) {
                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch
                });
            }
            else {

            }

        });

    }
    componentWillReceiveProps(nextProps) {

        this.state.lang = nextProps.currentLanguage
        this.state.loading = true
        //this.refReactTable.fireFetchData()
    }
    async onChange(type, event) {
        console.log('type, event:::', type, event.target.value)
        let { FULLNAME, IDCODE } = this.state
        if (type == "FULLNAME"){
            FULLNAME = event.target.value
        }
        if (type == "IDCODE"){
            IDCODE = event.target.value
        }
        
        this.setState({ FULLNAME : FULLNAME,IDCODE : IDCODE })
    }
    async handleClickSearch() {
        let { keySearch, page, pagesize, sortSearch } = this.state;
        console.log('this.state :::', this.state)
        await RestfulUtils.post('/user/getListUserByName', { p_fullname: this.state.FULLNAME, p_idcode: this.state.IDCODE, pagesize, page: page, keySearch: keySearch, sortSearch, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
            console.log('resData::::', resData)
            if (resData.EC == 0) {
                this.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch
                });
            }
            else {

            }

        });
    }
    onRowClick(state, rowInfo, column, instance) {
        var that = this;
        return {
            onDoubleClick: e => {
                
                //that.props.showModalDetail("view", rowInfo.original)
                that.handlEdit(rowInfo.original)
            },
            // style: {
            //     background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTID) ? '#dbe1ec' : '',
            //     color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTID) ? 'black' : '',
            // }
            
        }
    }
    handlEdit(data) {
        console.log('data:::', data)
        var that = this;
        that.props.onSelectRow(data);
        that.close();
        
    }
    render() {
        let { data, pagesize, pages } = this.state;
        console.log('render modal tim kiem', this.props.showModal)
        return (
            <Modal show={this.props.showModal} dialogClassName="custom-modal" bsSize="lg" >
                <Modal.Header>
                    <Modal.Title ><div className="title-content col-md-6 "> {this.props.strings.title}
                        <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="panel-body">
                        <div className="col-md-12 row">
                            <div className="col-md-10 row">
                                <div className="col-md-12 row">
                                    <h5 className="col-md-3">
                                        <b>{this.props.strings.name}</b>
                                    </h5>
                                    <div className="col-md-9">
                                        <input

                                            value={this.state.FULLNAME}
                                            onChange={this.onChange.bind(this, "FULLNAME")}
                                            id="txtFULLNAME"
                                            className="form-control"
                                            type="text"
                                            placeholder={this.props.strings.name}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <h5 className="col-md-3">
                                        <b>{this.props.strings.idc}</b>
                                    </h5>
                                    <div className="col-md-9">
                                        <input

                                            value={this.state.IDCODE}
                                            onChange={this.onChange.bind(this, "IDCODE")}
                                            id="txtIDCODE"
                                            className="form-control"
                                            type="text"
                                            placeholder={this.props.strings.idc}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2 row">
                                <input style={{ textTransform: 'uppercase', width: '120px', fontWeight: 'bold', margin: "0 0 0 0" }} type="button"
                                    onClick={this.handleClickSearch.bind(this)}
                                    className="pull-left btn btndangeralt" defaultValue={this.props.strings.search} id="btupdate22" />
                            </div>
                        </div>

                        <div className="col-md-12 row">
                            <div className="col-md-3"></div>
                            <h5 className="col-md-6">
                                <b>{this.props.strings.result}</b>
                            </h5>
                        </div>
                        <div className="col-md-12 row" style = {{marginLeft:"10px"}}>
                            <ReactTable
                                columns={[
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
                                        Header: props => <div className="">{this.props.strings.CUSTODYCD}</div>,
                                        id: "CUSTODYCD",
                                        accessor: "CUSTODYCD",
                                        width: 150
                                    },
                                    {
                                        Header: props => <div className="">{this.props.strings.FULLNAME}</div>,
                                        id: "FULLNAME",
                                        accessor: "FULLNAME",
                                        width: 250
                                    },
                                    {
                                        Header: props => <div className="">{this.props.strings.IDCODE}</div>,
                                        id: "IDCODE",
                                        accessor: "IDCODE",
                                        width: 150
                                    },
                                    {
                                        Header: props => <div className="">{this.props.strings.IDDATE}</div>,
                                        id: "IDDATE",
                                        accessor: "IDDATE",

                                        width: 150
                                    },
                                    {
                                        Header: props => <div className="">{this.props.strings.MOBILE}</div>,
                                        id: "MOBILE",
                                        accessor: "MOBILE",
                                        width: 150
                                    },



                                ]}
                                manual
                                filterable
                                pages={pages} // Display the total number of pages
                                // loading={loading} // Display the loading overlay when we need it
                                onFetchData={this.fetchData.bind(this)}
                                data={data}
                                className="-striped -highlight"
                                // pivotBy={["CUSTODYCD"]}
                                filterable
                                style={{
                                    maxHeight: "300px"
                                }}
                                getTheadTrProps={() => {
                                    return {
                                        className: 'head'
                                    }
                                }}
                                getTheadGroupThProps={() => {
                                    return {
                                        className: 'head'
                                    }
                                }}
                                getTrProps={this.onRowClick.bind(this)}
                                previousText={<i className="fas fa-backward"></i>}
                                nextText={<i className="fas fa-forward"></i>}
                                ref={(refReactTable) => { this.refReactTable = refReactTable; }} 

                            />
                        </div>
                    </div>
                </Modal.Body>

            </Modal>
        )
    }
}
const stateToProps = state => ({
    language: state.language.language,
    tradingdate: state.systemdate.tradingdate
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalTimKiemFullname')
]);

module.exports = decorators(ModalTimKiemFullname)