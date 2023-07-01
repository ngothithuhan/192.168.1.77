import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';

class TableDuyetGiaoDich extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                // {
                //     id: "1", CUSTODYCD: "1353041132003CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // },
                // {
                //     id: "2", CUSTODYCD: "1353041132004CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // },
                // {
                //     id: "3", CUSTODYCD: "1353041132005CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // },
                // {
                //     id: "4", CUSTODYCD: "1353041132005CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // },
                // {
                //     id: "5", CUSTODYCD: "1353041132005CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // },
                // {
                //     id: "6", CUSTODYCD: "1353041132005CN", CUSTID: "091C123456", FULLNAME: "Nguyễn Văn A", IDCODE: "123456789", IDPLACE: "Hà Nội", IDDATE: "18/12/2013", ADDRESS: "Hà Nội", CUSTTYPE: "Cá nhân", IDDATE: "18/12/2017", STATUS: "Chờ duyệt"
                // }

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
            pagesize: 20,
            keySearch: {},
            sortSearch: {},
            page: 1,
            dataTest: [
                {
                    branhchid: "9999999", branhchname: "Lee Jong Suk", institutionid: "123", address: "tp hcm", fullname: "GDragon", position: "nhân viên", phone: "123456780", email: "email@gmail.com"
                },
                {
                    branhchid: "9999999", branhchname: "Lee Jong Suk", institutionid: "123", address: "tp hcm", fullname: "GDragon", position: "nhân viên", phone: "123456780", email: "email@gmail.com"
                },
                {
                    branhchid: "9999999", branhchname: "Lee Jong Suk", institutionid: "123", address: "tp hcm", fullname: "GDragon", position: "nhân viên", phone: "123456780", email: "email@gmail.com"
                },
            ]

        }
        // this.fetchData = this.fetchData.bind(this);
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
        // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
        // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
        var that = this;
        // this.setState({ loading: true });

        // console.log('filer',state.filtered);
        // console.log('sort',state.sorted);
        // Request the data however you want.  Here, we'll use our mocked service we created earlier
        if (this.state.loading) {
            let { pageSize, page, filtered, sorted } = state;
            this.loadData(pageSize, page + 1, filtered, sorted);
        }
        this.setState({ loading: true })
    }
  
    async loadData(pagesize, page, keySearch, sortSearch) {
        //  console.log('loadadta')
        // console.log(this.props.DATA)
        let that = this;
        //  p_txnum:this.props.DATA.OBJTYPE,
        let data = {
            p_txnum: this.props.DATA.TXNUM,
            p_txdate: this.props.DATA.TXDATE,
            p_language:this.props.lang
        }
        await  RestfulUtils.post('/fund/getlistmthistory', { pagesize, page, keySearch, sortSearch, data }).then((resData) => {
           // console.log(resData.DT)
         
                // console.log('datatable',resData)
                // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                    that.setState({
                        data: resData.DT.data,
                        pages: resData.DT.numOfPages,
                        keySearch,
                        page,
                        pagesize,
                        sortSearch
                    });
         
        });

    }
   

    render() {
        const { data, pages, loading, dataTest } = this.state;
        return (
            <div>
                <div className="col-md-12" style={{ paddingLeft: 30, paddingRight: 30 }}>
                    <ReactTable
                        columns={[

                            {
                                Header: props => <div className="wordwrap" id="lblCustodycd">{this.props.strings.caption}</div>,
                                id: "CAPTION",
                                accessor: "CAPTION",
                                width: 200,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblactionType">{this.props.strings.lblactionType}</div>,
                                id: "ACTIONDESC",
                                accessor: "ACTIONDESC",
                                width: 80,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblFullname">{this.props.strings.fromvalue}</div>,
                                id: "FROM_VALUE",
                                accessor: "FROM_VALUE",
                                width: 250,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblIdtype">{this.props.strings.tovalue}</div>,
                                id: "TO_VALUE",
                                accessor: "TO_VALUE",
                                width: 250,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblMaker">{this.props.strings.tlname}</div>,
                                id: "TLNAME",
                                accessor: "TLNAME",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblChecker">{this.props.strings.offname}</div>,
                                id: "OFFNAME",
                                accessor: "OFFNAME",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblMakerTime">{this.props.strings.maker_time}</div>,
                                id: "MAKER_TIME",
                                accessor: "MAKER_TIME",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblAPPROVE_TIME">{this.props.strings.approve_time}</div>,
                                id: "APPROVE_TIME",
                                accessor: "APPROVE_TIME",
                                width: 100,
                                Cell: ({ value }) => (
                                    <div className="col-left" id={"lbl" + value}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap" id="lblIdcode">{this.props.strings.obj}</div>,
                                ID: "OBJTITLE",
                                accessor: "OBJTITLE",
                                width: 215,
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
                        //filterable
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
                        loadingText="Đang tải..."
                        ofText="/"
                        getTrGroupProps={(row) => {
                            return {
                                id: "haha"
                            }
                        }}
                        showPagination={false}

                        getTrProps={this.onRowClick.bind(this)}
                        defaultPageSize={5}
                        className="-striped -highlight"
                    />
                </div>
            </div>
        );
    }
}

TableDuyetGiaoDich.defaultProps = {

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
    translate('TableDuyetGiaoDich')
]);

module.exports = decorators(TableDuyetGiaoDich);
