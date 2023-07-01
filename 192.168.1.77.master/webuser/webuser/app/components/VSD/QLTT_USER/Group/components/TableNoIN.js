import React, { Component } from 'react';
import ReactTable from "react-table";
import { Checkbox } from 'react-bootstrap';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
function toNormalize(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace("Đ","D")
}
class TableNoIN extends Component {
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

            pagesize: 10,
            keySearch: {},
            sortSearch: {},
            page: 1,
            //data1: [],
            loaded: false,

            sorted1: [],
            filtered1: []
        }
        // this.fetchData = this.fetchData.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        if (!nextProps.isClearCheck)
            this.setState({
              //  data1: nextProps.dataNoIN,
                data: nextProps.dataNoIN,
              //  loaded: true,
            })

        else {
            this.setState({
              //  data1: nextProps.dataNoIN,
                data: nextProps.dataNoIN,
              //  loaded: true,
                selectedRows: new Set(),
                checkedAll: false,
            })

        }
        if (nextProps.loadgrid) {
            //  this.refReactTable.fireFetchData()
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
                if (!that.state.selectedRows.has(item.TLID)) {
                    that.state.unSelectedRows.push(item.TLID);
                    that.state.selectedRows.add(item.TLID);
                    that.props.datachecked(item, 'checked')
                }
            })
            that.setState({ selectedRows: that.state.selectedRows, unSelectedRows: that.state.unSelectedRows })
        }
        else {
            //that.state.unSelectedRows.map(function (item) {
            //  that.state.selectedRows.delete(item);
            // })
            that.state.data.map(function (item) {

                that.props.datachecked(item, 'unchecked')

            })

            that.setState({ selectedRows: new Set(), unSelectedRows: [] })
        }

    }

    handleChange(row) {

        if (!this.state.selectedRows.has(row.original.TLID)) {
            this.state.selectedRows.add(row.original.TLID);
            this.props.datachecked(row.original, 'checked')
        }
        else {
            this.state.selectedRows.delete(row.original.TLID);
            this.props.datachecked(row.original, 'unchecked')
        }
        this.setState({ selectedRows: this.state.selectedRows, checkedAll: false });
    }
    loadData(data) {
        this.setState({
           // data1: data,
            data: data,
           // loaded: true,

            //pages: resData.DT.numOfPages,

        })
    }
    render() {
        const { data, pages } = this.state;
        var that = this;

        return (
            <div>

                <div className="col-md-12 tablecustom" style={{ overflow: "hidden" }} >
                    <ReactTable
                        columns={
                            [
                                {
                                    maxWidth: 40,
                                    sortable: false,
                                    filterable:false,
                                    style: { textAlign: 'center' },
                                    Cell: (row) => (
                                        <div>
                                            <Checkbox style={{ textAlign: "center", marginLeft: "10px", marginTop: "-14px" }}
                                                checked={that.state.selectedRows.has(row.original.TLID)}
                                                onChange={that.handleChange.bind(that, row)} inline
                                                id={"ck" + row.index}
                                            />
                                        </div>
                                    ),

                                },
                                {
                                    id: "FULLNAME",
                                    accessor: "FULLNAME",
                                    width: 350,
                                    Cell: ({ value }) => (
                                        <div className="col-left" style={{ float: "left" }} id={"lbl" + value}>{value}</div>
                                    ),
                                    filterMethod: (filter, row) =>
                                    row[filter.id] != null ? toNormalize(row[filter.id].toUpperCase()).includes(filter.value.toUpperCase()) : ''
                                },
                            ]}
                        getTheadTrProps={() => {
                            return {
                                className: 'head'
                            }
                        }}

                       // manual
                        filterable
                        pages={pages} // Display the total number of pages
                        //   loading={loading} // Display the loading overlay when we need it
                        // onFetchData={this.fetchData.bind(this)}
                        data={data}
                        style={{
                            maxHeight: "300px" // This will force the table body to overflow and scroll, since there is not enough room
                        }}
                        noDataText={this.props.strings.textNodata}
                        showPageSizeOptions={false}
                        showPagination={false}
                        sortable={false}

                        //  loadingText="Đang tải..."
                        ofText="/"
                        defaultPageSize={500}
                        className="-striped -highlight"
                        ref={(refReactTable) => { this.refReactTable = refReactTable; }}

                    />
                </div>

                <Checkbox id="ckAllNoiN" checked={that.state.checkedAll} style={{ paddingLeft: "20px", paddingTop: "10px" }} onChange={that.handleChangeALL.bind(that)} inline >{this.props.strings.checkall}</Checkbox>

            </div>
        );
    }
}

TableNoIN.defaultProps = {

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
    translate('TableNoIN')
]);

module.exports = decorators(TableNoIN);
