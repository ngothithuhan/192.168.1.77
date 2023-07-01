import React, { Component } from 'react';
import ReactTable from "react-table";
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import {
    DefaultPagesize, getExtensionByLang, getRowTextTable, getPageTextTable,
    ACTIONS_ACC, EVENT, DISABLE_CUSTODYCD_STARTWITH, DISABLE_EDIT_ACCOUNT
} from 'app/Helpers'
import EditAccount from 'app/components/OpenAccount/EditAccount/EditAccount';
import { emitter } from 'app/utils/emitter';
import _ from 'lodash';

class ManageAccountNDT extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataTableNDT: [],
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
            page: 1,
            p_custodycd: 'ALL', // ALL is default / Customer is just ONE 
            p_exectype: 'ALL',
            p_srtype: 'ALL',


            isShowEditInfor: false,
            dataFromParent: [], //data của user khi nhấn nút sửa
            actionCurrentRow: '',
        }
        this.listenToTheEmitterReturnTableAcc()
    }

    componentDidMount() {
        this.loadData();
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
        if (this.state.loading) {
            new Promise((resolve, reject) => {
                let { pageSize, page, filtered, sorted } = state;
                setTimeout(() => resolve(this.loadData(pageSize, page + 1, filtered, sorted, instance.props.columns)), 500);
            })
        }
        this.setState({ loading: true })
    }

    async loadData(pagesize, page, keySearch, sortSearch) {
        let obj = {
            OBJNAME: "ACCOUNT",
            sortSearch: sortSearch,
            keySearch: keySearch,
            pagesize: pagesize,
            page: page
        }
        let that = this;
        await RestfulUtils.post('account/getlist', obj)
            .then(resData => {
                if (resData.EC === 0) {
                    that.setState({
                        dataTableNDT: resData.DT.data,
                        pages: resData.DT.numOfPages,
                        keySearch,
                        page,
                        pagesize,
                        sortSearch,
                        sumRecord: resData.DT.sumRecord
                    });
                }
            })


    }

    onClickShowHideEditInfor = (status, row) => {
        let action = this.getActionType(row);
        this.setState({
            ...this.state,
            isShowEditInfor: status,
            dataFromParent: row ? row : [],
            actionCurrentRow: action.type
        })
    }

    listenToTheEmitterReturnTableAcc = () => {
        emitter.on(EVENT.RETURN_TABLE_ACC, data => {
            this.setState({
                isShowEditInfor: false,
            })
        });
    }


    getActionType = (row) => {
        let action = {
            type: ACTIONS_ACC.EDIT,
            text: this.props.strings.edit
        };
        if (row && row.CUSTODYCD) {
            if (DISABLE_EDIT_ACCOUNT === true) {
                for (let i = 0; i < DISABLE_CUSTODYCD_STARTWITH.length; i++) {
                    if (row.CUSTODYCD.startsWith(DISABLE_CUSTODYCD_STARTWITH[i])) {
                        action = {
                            type: ACTIONS_ACC.VIEW,
                            text: this.props.strings.view
                        };
                        break;
                    }
                }
            }
        }
        return action;
    }
    render() {
        const { pages, loading, dataTableNDT, isShowEditInfor } = this.state;
        const { user } = this.props.auth;

        let { datapage } = this.props;


        const cols =
            [
                {
                    Header: props => <div className=""></div>,
                    id: "action",
                    accessor: "action",
                    width: 60,
                    headerClassName: "text-custom-center",
                    filterable: false,
                    Cell: (props) => {
                        const cell = props.original;
                        return (
                            <button className="btn-edit" onClick={() => this.onClickShowHideEditInfor(true, cell)}>
                                {this.getActionType(cell).text}
                            </button>
                        );
                    },
                },

                {
                    Header: props => <div className="">{this.props.strings.soHieuTKDG}</div>,
                    id: "CUSTODYCD",
                    accessor: "CUSTODYCD",
                    minWidth: 155,
                    headerClassName: "text-custom-center",
                    className: "text-custom-left"
                },
                {
                    Header: props => <div className="">{this.props.strings.fullname}</div>,
                    accessor: "FULLNAME",
                    minWidth: 125,
                    headerClassName: "text-custom-center",
                    className: "text-custom-left",
                },
                {
                    Header: props => <div className="">{this.props.strings.DLPPId}</div>,
                    accessor: "DBCODE",
                    minWidth: 125,
                    headerClassName: "text-custom-center",
                    className: "text-custom-left",
                },

                {
                    Header: props => <div className="">{this.props.strings.phonenumber}</div>,
                    id: "MOBILE",
                    accessor: "MOBILE",
                    minWidth: 125,
                    headerClassName: "text-custom-center",
                    className: "text-custom-left",
                },
                {
                    Header: props => <div className="">{this.props.strings.email}</div>,
                    id: "EMAIL",
                    accessor: "EMAIL",
                    minWidth: 155,
                    headerClassName: "text-custom-center",
                    className: "text-custom-left",
                },

                {
                    Header: props => <div className="">{this.props.strings.createdAt}</div>,
                    id: "OPNDATE",
                    accessor: "OPNDATE",
                    minWidth: 125,
                    headerClassName: "text-custom-center",
                    className: "text-custom-left",
                },

                {
                    Header: props => <div className="">{this.props.strings.status}</div>,
                    id: getExtensionByLang("CFSTATUS_DESC", this.props.language),
                    accessor: getExtensionByLang("CFSTATUS_DESC", this.props.language),
                    Cell: (row) => (
                        <span className="col-left">

                            <span style={{

                                color:
                                    row.original.STATUS == "A" ? 'rgb(0, 255, 247)' : row.original.STATUS == "P" ? 'rgb(230, 207, 17)' : row.original.STATUS == "R" ? 'rgb(230, 207, 17)'
                                        : 'rgb(162, 42, 79)',
                                transition: 'all .3s ease'
                            }}>
                                &#x25cf;
                            </span> {
                                row.value
                            }
                        </span>
                    ),
                    width: 120
                },
            ]

        return (
            <div className={!isShowEditInfor ? 'manage-account-ndt  customize-react-table ' : 'manage-account-ndt  customize-react-table without-background'}>
                {!isShowEditInfor ?
                    <React.Fragment>
                        <div className="manage-acount-ndt-header ">{this.props.strings.headerManageAccountNDT}</div>
                        <ReactTable
                            className="table-quy-mo-content -striped -highlight without-margin "
                            columns={cols}
                            getTheadTrProps={() => {
                                return {
                                    className: 'head'
                                }
                            }}
                            style={{
                                maxHeight: "500px" // This will force the table body to overflow and scroll, since there is not enough room
                            }}
                            manual
                            filterable
                            pages={pages} // Display the total number of pages
                            // loading={loading} // Display the loading overlay when we need it
                            onFetchData={this.fetchData.bind(this)}
                            data={dataTableNDT}
                            noDataText={this.props.strings.textNodata}
                            pageText={getPageTextTable(this.props.language)}
                            rowsText={getRowTextTable(this.props.language)}
                            previousText={<i className="fas fa-backward"></i>}
                            nextText={<i className="fas fa-forward"></i>}
                            loadingText="Loading..."
                            ofText="/"
                            getTrProps={this.onRowClick.bind(this)}
                            defaultPageSize={this.state.pagesize}
                        />
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <div className="back" >
                            <span onClick={() => this.onClickShowHideEditInfor(false)}><i className="fa fa-arrow-left" aria-hidden="true"></i> {this.props.strings.back}</span>
                        </div>
                        <div className="ndt-acc-title">
                            {this.props.strings.TTTK}
                        </div>

                        <EditAccount
                            dataFromParent={this.state.dataFromParent}
                            onClickShowHideEditInfor={this.onClickShowHideEditInfor}
                            action={this.state.actionCurrentRow}
                            GRINVESTOR={this.state.dataFromParent.GRINVESTOR}
                            CUSTTYPE={this.state.dataFromParent.CUSTTYPE}
                        />
                    </React.Fragment>
                }

            </div>
        );
    }
}

const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    language: state.language.language,
    auth: state.auth

});


const decorators = flow([
    connect(stateToProps),
    translate('NhaDauTu')
]);

module.exports = decorators(ManageAccountNDT);
