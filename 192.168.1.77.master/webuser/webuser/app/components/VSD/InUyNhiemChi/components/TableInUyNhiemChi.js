import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import RestfulUtils from 'app/utils/RestfulUtils';
import { DefaultPagesize } from 'app/Helpers'

class TableInUyNhiemChi extends Component {
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
            showModalAccess: false,
            showModalReview: false,
            CUSTID_DETAIL: '',
            pagesize: DefaultPagesize,
            keySearch: {},
            sortSearch: {},
            page: 1
        }
        // this.fetchData = this.fetchData.bind(this);
    }
    formatNumber(nStr, decSeperate, groupSeperate) {
        nStr += '';
        let x = nStr.split(decSeperate);
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + groupSeperate + '$2');
        }
        return x1 + x2;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isrefresh) {
            //this.refresh()
            this.loadData(this.state.pagesize, this.state.page, this.state.keySearch, this.state.sortSearch);
        }
    }

    componentDidMount() {
        this.refresh()
    }
    handleAdd(evt) {
        var that = this;
        that.props.showModalDetail("add");
    }
    handlEdit(data) {
        var that = this;
        that.props.showModalDetail("add", data);
    }
    handleChangeALL(evt) {
        var that = this;
        this.setState({ checkedAll: evt.target.checked });
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
            that.state.unSelectedRows.map(function (item) {
                that.state.selectedRows.delete(item);
            })
            that.setState({ selectedRows: that.state.selectedRows, unSelectedRows: [] })
        }

    }
    onClick(type) {
        let self = this;
        switch (type) {
            case "create": {

                self.handleAdd();
            }
            case "edit": {
            }
        }
    }
    handleChange(row) {

        if (!this.state.selectedRows.has(row.original.AUTOID))
            this.state.selectedRows.add(row.original.AUTOID);
        else {
            this.state.selectedRows.delete(row.original.AUTOID);
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
                background: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.AUTOID) ? '#dbe1ec' : '',
                color: rowInfo == undefined ? '' : that.state.selectedRows.has(rowInfo.original.AUTOID) ? 'black' : '',
            }

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
    refresh = () => {
        let self = this
        RestfulUtils.post('/srreconcile/getlistprintso', { pagesize: this.state.pagesize, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                //console.log('sync success refresh---', resData.DT.data)
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord })

            } else {
                toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
            }
        });

    }
    reloadTable = () => {
        let self = this
        RestfulUtils.posttrans('/srreconcile/getlistprintso', { pagesize: this.state.pagesize, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
            if (resData.EC == 0) {
                self.setState({ data: resData.DT.data, pages: resData.DT.numOfPages, sumRecord: resData.DT.sumRecord })

            } else {
                toast.error(resData.EM, { position: toast.POSITION.BOTTOM_RIGHT });
            }
        });

    }
    async loadData(pagesize, page, keySearch, sortSearch) {

        let that = this;
        await RestfulUtils.post('/srreconcile/getlistprintso', { pagesize, page, keySearch, sortSearch, language: this.props.language, OBJNAME: this.props.OBJNAME }).then(resData => {
            console.log('res data', resData)
            if (resData.EC == 0)

                that.setState({
                    data: resData.DT.data,
                    pages: resData.DT.numOfPages,
                    keySearch,
                    page,
                    pagesize,
                    sortSearch,
                    sumRecord: resData.DT.sumRecord
                });
            else {
            }
        })
    }
    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }
    render() {
        const { data, pages, loading, dataTest } = this.state;
        var that = this;
        return (
            <div>
                <div className="row">
                    <div style={{ marginLeft: "-12px", marginBottom: "10px" }} className="col-md-10 ">


                    </div>
                    <div style={{ textAlign: "right" }} className="col-md-2 RightInfo">
                        <h5 className="highlight" style={{ fontWeight: "bold" }}> <span style={{ textAlign: "left" }} className="glyphicon glyphicon-edit" aria-hidden="true"></span> {this.props.strings.sumtitle} {this.state.sumRecord}
                            <span className="ReloadButton" onClick={this.reloadTable}><i className="fas fa-sync-alt"></i></span>
                        </h5>
                    </div>
                </div>
                <div className="col-md-12" >
                    <ReactTable
                        columns={[
                            {
                                Header: props => <div className="wordwrap">  </div>,
                                maxWidth: 70,
                                sortable: false,
                                style: { textAlign: 'center' },
                                Cell: (row) => (
                                    <div>
                                        {/* ho tro lay dc dung hang danh click */}
                                        <button type="button" className="btn btn-primary" onClick={this.handlEdit.bind(this, row.original)}>  <a style={{ color: "#ffffff", textDecoration: "none" }}><span className="glyphicon glyphicon-print"></span> {this.props.strings.print}</a></button>

                                    </div>
                                ),
                                Filter: ({ filter, onChange }) =>
                                    null
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.orderid}</div>,
                                id: "ORDERID",
                                accessor: "ORDERID",
                                width: 114,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.symbol}</div>,
                                id: "SYMBOL",
                                accessor: "SYMBOL",
                                width: 73,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.custodycd}</div>,
                                id: "CUSTODYCD",
                                accessor: "CUSTODYCD",
                                width: 115,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.fullname}</div>,
                                id: "FULLNAME",
                                accessor: "FULLNAME",
                                width: 115,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.srtypedesc}</div>,
                                id: "SRTYPEDESC",
                                accessor: "SRTYPEDESC",
                                width: 135,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },

                            {
                                Header: props => <div className="wordwrap">{this.props.strings.amt}</div>,
                                id: "ORDERAMT",
                                accessor: "ORDERAMT",
                                width: 130,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{this.formatNumber(value, '.', ',')}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.statusdes}</div>,
                                id: "STATUSDESC",
                                accessor: "STATUSDESC",
                                width: 135,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.username}</div>,
                                id: "USERNAME",
                                accessor: "USERNAME",
                                width: 165,
                                Cell: ({ value }) => (
                                    <div className="col-left" style={{ float: "left" }}>{value}</div>
                                )
                            },
                            {
                                Header: props => <div className="wordwrap">{this.props.strings.txtime}</div>,
                                id: "TXTIME",
                                accessor: "TXTIME",
                                width: 86,
                                Cell: ({ value }) => (
                                    <div className="col-left">{value}</div>
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
                        pageText={this.props.strings.pageText}
                        rowsText={this.props.strings.rowsText}
                        previousText={<i className="fas fa-backward"></i>}
                        nextText={<i className="fas fa-forward"></i>}
                        loadingText="Ðang t?i..."
                        ofText="/"
                        getTrProps={this.onRowClick.bind(this)}
                        defaultPageSize={this.state.pagesize}
                        className="-striped -highlight"
                    />
                </div>
            </div>
        );
    }
}

TableInUyNhiemChi.defaultProps = {

    strings: {

    },


};
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    language: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('TableInUyNhiemChi')
]);

module.exports = decorators(TableInUyNhiemChi);
