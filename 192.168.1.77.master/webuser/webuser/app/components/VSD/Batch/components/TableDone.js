import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { getExtensionByLang } from '../../../../Helpers';
class TableDone extends Component {
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
            txdate: '',
            pagesize: 10,
            keySearch: {},
            sortSearch: {},
            page: 1,
            data1: [],
            loaded: false,

            sorted1: [],
            filtered1: [],
            txdate: '',
            firstRender: true

        }
        // this.fetchData = this.fetchData.bind(this);
    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.loadgrid) {
            this.state.firstRender = true
            this.refReactTable.fireFetchData()
            this.props.clear()
        }
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
                if (!that.state.selectedRows.has(item.CUSTID)) {
                    that.state.unSelectedRows.push(item.CUSTID);
                    that.state.selectedRows.add(item.CUSTID);
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

        if (!this.state.selectedRows.has(row.original.CUSTID))
            this.state.selectedRows.add(row.original.CUSTID);
        else {
            this.state.selectedRows.delete(row.original.CUSTID);
        }
        this.setState({ selectedRows: this.state.selectedRows, checkedAll: false });
    }
    async fetchData(state, instance) {
        let date = this.state.txdate
        let that = this
        if (this.state.firstRender) {
            await RestfulUtils.post('/account/gettradingdate')
                .then((res) => {
                    let that = this;
                    date == '' ? date = res.DT.p_tradingdate : date = this.state.txdate
                    let data = {
                        p_txdate: date,
                        p_language: this.props.lang,
                        objname:this.props.OBJNAME
                    }
                    RestfulUtils.post('/fund/getlistbatcheod_success', { data }).then((resData) => {
                        // console.log('rs',resData.data.DT.data)
                        // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                        if (resData.EC == 0) {
                            // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                            this.setState({
                                // pages: res.pages,
                                // loading: false,
                                firstRender: false,
                                selectedRows: new Set(),
                                checkedAll: false,
                                data1: resData.DT.data,
                                data: resData.DT.data,
                                txdate: date
                            });

                        }
                    })
                })
        }
    }
    render() {
        const { data, pages } = this.state;
        return (
            <div>
                <div className="col-md-12 tablecustom" >
                    <div className="col-md-10" ></div>
                    <div className="col-md-2" >
                        <h5 style={{ color: "#fd9bac" }}><b>{this.state.txdate}</b></h5>
                    </div>
                    <ReactTable
                        columns={
                            [
                                {
                                    id: getExtensionByLang("BCHTITLE", this.props.lang),
                                    accessor: getExtensionByLang("BCHTITLE", this.props.lang),
                                    width: 551,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                    )
                                },

                            ]}
                        getTheadTrProps={() => {
                            return {
                                className: 'head'
                            }
                        }}


                        manual
                        filterable={false}
                        pages={pages} // Display the total number of pages
                        //loading={loading} // Display the loading overlay when we need it
                        onFetchData={this.fetchData.bind(this)}
                        data={data}
                        style={{
                            maxHeight: "293px" // This will force the table body to overflow and scroll, since there is not enough room
                        }}
                        noDataText={this.props.strings.textNodata}
                        showPageSizeOptions={false}
                        showPagination={false}
                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}
                        //loadingText="Đang tải..."
                        ofText="/"
                        defaultPageSize={20}
                        className="-striped -highlight"

                    />
                </div>
            </div>
        );
    }
}

TableDone.defaultProps = {

    strings: {


    },


};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language,
    tradingdate: state.systemdate.tradingdate
});


const decorators = flow([
    connect(stateToProps),
    translate('TableDone')
]);

module.exports = decorators(TableDone);
