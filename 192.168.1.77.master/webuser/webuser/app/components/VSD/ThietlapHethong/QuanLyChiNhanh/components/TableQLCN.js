import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import { ButtonAdd, ButtonDelete, ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import { DefaultPagesize, getExtensionByLang, getRowTextTable, getPageTextTable } from 'app/Helpers'
import { requestData } from 'app/utils/ReactTableUlti';
import RestfulUtils from 'app/utils/RestfulUtils';

const download = (url, name) => {
    let a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()

    window.URL.revokeObjectURL(url)
}


function s2ab(s) {
    const buf = new ArrayBuffer(s.length)

    const view = new Uint8Array(buf)

    for (let i = 0; i !== s.length; ++i)
        view[i] = s.charCodeAt(i) & 0xFF

    return buf
}





class TableQLCN extends Component {
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
            dataTest: [

            ],
            data1: [],
            loaded: false,

            sorted1: [],
            filtered1: [],
            dataexport: [],
            colum: [],
            dataALL: [],
            firstRender: true,
            titlebutton: 'Tạo',
            disablebutton: false,
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

            //console.log('componentWillReceiveProps')

            this.state.firstRender = true
            this.refReactTable.fireFetchData()
            //this.setState({ firstRender: true })
            // this.fetchData()
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
        this.setState({ checkedAll: evt.target.checked });
        if (evt.target.checked) {
            that.state.data.map(function (item) {
                if (!that.state.selectedRows.has(item.BRID)) {
                    that.state.unSelectedRows.push(item.BRID);
                    that.state.selectedRows.add(item.BRID);
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

        if (!this.state.selectedRows.has(row.original.BRID))
            this.state.selectedRows.add(row.original.BRID);
        else {
            this.state.selectedRows.delete(row.original.BRID);
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
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.CUSTID) ? 'black' : '',
            }

        }
    }
    fetchData(state, instance) {

        let that = this
        if (this.state.firstRender) {
            let data = {
                p_brid: 'ALL',
                p_language: this.props.lang,
                objname: this.props.OBJNAME
            }
            RestfulUtils.posttrans('/fund/getlistbrp', { data }).then((resData) => {

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

                    let data = this.state.data.filter(e => e.BRID === value);
                    let success = null;
                    let datadelete = {
                        data: data[0],
                        p_language: this.props.lang,
                        pv_objname: this.props.OBJNAME
                    }
                    resolve(RestfulUtils.posttrans('/fund/deletegrp', datadelete)
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
    handleAdd1() {
        /*
        io.socket.post('/fund/ExportTemplates', function (resData, jwRes) {
            let url = window.URL.createObjectURL(new Blob([s2ab(resData)], { type: 'application/octet-stream' }))
            download(url, 'export.xlsx')
        });
        /* read the file */
        /*
                io.socket.post('/fund/bb', function(resData, jwRes) {
                    XLSX.writeFile(resData, 'newfile.xlsx');
                })
                */
    }
    test() {
        /*
        let that = this
        io.socket.post('/fund/cc', function (resData, jwRes) {
            //console.log(resData)
            that.setState({
                description: resData
            })

        });
        */
    }

    reloadTable() {
        this.state.firstRender = true
        this.refReactTable.fireFetchData()
    }
    render() {

        const { data, pages, pagesize } = this.state;
        var that = this;
        return (

            <div id="danger">
                <div dangerouslySetInnerHTML={{ __html: this.state.description }} />

                <div>
                    <div className="row">
                        <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">
                            <ButtonAdd style={{ marginLeft: "5px" }} data={this.props.datapage} onClick={this.handleAdd.bind(this)} />
                            <ButtonDelete style={{ marginLeft: "5px" }} onClick={this.delete} data={this.props.datapage} />
                            <ButtonExport style={{ marginLeft: "5px" }} dataRows={this.state.dataALL} colum={this.state.colum} data={this.props.datapage} dataHeader={this.props.strings} HaveChk={true} />

                        </div>
                        <div style={{ textAlign: "right" }} className="col-md-2 RightInfo">
                            <h5 className="highlight" style={{ fontWeight: "bold" }}>
                                <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                                <span className="ReloadButton" onClick={this.reloadTable.bind(this)}><i className="fas fa-sync-alt"></i></span>
                            </h5>
                        </div>
                    </div>

                    <div className="col-md-12" id="basic-table">
                        <ReactTable
                            columns={[
                                {
                                    Header: props => <div className=" header-react-table"> <Checkbox checked={that.state.checkedAll} style={{ marginBottom: "14px" }} onChange={that.handleChangeALL.bind(that)} inline />  </div>,
                                    maxWidth: 55,
                                    sortable: false,
                                    style: { textAlign: 'center' },
                                    Cell: (row) => (
                                        <div>
                                            <Checkbox style={{ textAlign: "center", marginLeft: "10px", marginTop: "-14px" }}
                                                checked={that.state.selectedRows.has(row.original.BRID)}
                                                onChange={that.handleChange.bind(that, row)} inline
                                            />
                                            <span onClick={that.handlEdit.bind(that, row.original)} className="glyphicon glyphicon-pencil" id={"pencil" + row.index}></span>
                                        </div>
                                    ),
                                    Filter: ({ filter, onChange }) =>
                                        null
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblBRID">{this.props.strings.BRID}</div>,
                                    id: "BRID",
                                    accessor: "BRID",
                                    width: 66,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                    )

                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblVSDBRID">{this.props.strings.VSDBRID}</div>,
                                    id: "VSDBRID",
                                    accessor: "VSDBRID",
                                    width: 92,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                    )

                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblFullname">{this.props.strings.BRNAME}</div>,
                                    id: "BRNAME",
                                    accessor: "BRNAME",
                                    width: 200,

                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblBRNAMEEN">{this.props.strings.BRNAME_EN}</div>,
                                    id: "BRNAME_EN",
                                    accessor: "BRNAME_EN",
                                    width: 200,

                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblIdtype">{this.props.strings[getExtensionByLang("MBNAME", this.props.lang)]}</div>,
                                    id: getExtensionByLang("MBNAME", this.props.lang),
                                    accessor: getExtensionByLang("MBNAME", this.props.lang),
                                    width: 380,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblArea">{this.props.strings[getExtensionByLang("DESC_AREA", this.props.lang)]}</div>,
                                    // id: "DESC_AREA",
                                    // accessor: "DESC_AREA",
                                    id: getExtensionByLang("DESC_AREA", this.props.lang),
                                    accessor: getExtensionByLang("DESC_AREA", this.props.lang),
                                    width: 130,

                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblIdcode">{this.props.strings.BRADDRESS}</div>,
                                    id: "BRADDRESS",
                                    accessor: "BRADDRESS",
                                    width: 222,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                },

                                {
                                    Header: props => <div className="wordwrap" id="lblMaker">{this.props.strings.BRDEPUTY}</div>,
                                    id: "BRDEPUTY",
                                    accessor: "BRDEPUTY",
                                    width: 138,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblChecker">{this.props.strings.BROFFICE}</div>,
                                    id: "BROFFICE",
                                    accessor: "BROFFICE",
                                    width: 85,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblDesc">{this.props.strings.BRTELE}</div>,
                                    id: "BRTELE",
                                    accessor: "BRTELE",
                                    width: 100,
                                    Cell: ({ value }) => (
                                        <div className="col-left" id={"lbl" + value}>{value}</div>
                                    )
                                },
                                {
                                    Header: props => <div className="wordwrap" id="lblDesc">{this.props.strings.BREMAIL}</div>,
                                    id: "BREMAIL",
                                    accessor: "BREMAIL",
                                    width: 165,
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
                            //     //console.log('rowInfo',rowInfo)
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
                            //   loading={loading} // Display the loading overlay when we need it
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
                            loadingText="Đang tải..."
                            ofText="/"
                            getTrGroupProps={(row) => {
                                return {
                                    id: "haha"
                                }
                            }}

                            ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                            getTrProps={this.onRowClick.bind(this)}
                            defaultPageSize={pagesize}
                            className="-striped -highlight"
                        // onPageChange={(pageIndex) => {
                        //     this.state.selectedRows = new Set(),
                        //         this.state.checkedAll = false
                        // }
                        // }
                        // getProps= {(index) => (//console.log('aaaa',index.columns))}
                        />

                    </div>

                </div>

            </div>



        );
    }
}

TableQLCN.defaultProps = {

    strings: {
        tkgd: 'Số TKGD',
        fullname: 'Họ tên',
        ĐKSH: 'Số ĐKSH',
        ccq: 'CCQ giao dịch',
        TTBT: 'Chờ TTBT',
        quyen: 'Quyền chờ về',
        desc: 'Diễn giải',
        pageText: 'Trang',


        rowsText: 'bản ghi',
        textNodata: 'Không có kết quả',
        vsdstatus: 'Trạng thái VSD',

    },


};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('TableQLCN')
]);

module.exports = decorators(TableQLCN);
