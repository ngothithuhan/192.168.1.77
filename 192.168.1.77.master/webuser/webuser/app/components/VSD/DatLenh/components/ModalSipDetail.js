import React from 'react';
import { bindActionCreators } from 'redux'
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { closeModalSipDetail } from 'actionDatLenh';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { SRTYPE_SW, SRTYPE_NR, COLORSW, COLORNR, COLORNS, DefaultPagesize, getExtensionByLang } from '../../../../Helpers';
import RestfulUtils from '../../../../utils/RestfulUtils'
import NumberInput from 'app/utils/input/NumberInput';


class ModalSipDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: null,
            page: 1,
            pagesize: DefaultPagesize,
            loading: false,
            data: [],
            keySearch: [],
            sortSearch: []
        };
    }
    close = () => {
        this.props.closeModalSipDetail();
    }
    fetchData = (state, instance) => {

        if (this.state.loading) {
            let { pageSize, page, filtered, sorted } = state;
            this.loadData(pageSize, page + 1, filtered, sorted);
        }
        this.setState({ loading: true })
    }
    async loadData(pagesize, page, keySearch, sortSearch, SIPID) {
        let that = this;
        await RestfulUtils.post('/srreconcile/getlistorderdbookbysipid', { pagesize, page, keySearch: keySearch, sortSearch, sipid: SIPID, language: this.props.language, OBJNAME: this.props.OBJNAME }).then((resData) => {
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
    handleChangeALL(evt) {
        var that = this;
        this.setState({ checkedAll: evt.target.checked });
        if (evt.target.checked) {
            that.state.data.map(function (item) {
                if (!that.state.selectedRows.has(item.ORDERID)) {
                    that.state.unSelectedRows.push(item.ORDERID);
                    that.state.selectedRows.add(item.ORDERID);
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
    componentWillReceiveProps(nextProps) {
        if (nextProps.SIPID !== this.props.SIPID) {

            let { keySearch, page, pagesize, sortSearch } = this.state;
            //this.setState({ ...this.state, SIPID: nextProps.SIPID })
            this.loadData(pagesize, page, keySearch, sortSearch, nextProps.SIPID)

        }
    }


    render() {
        let { data, pagesize, pages } = this.state
        let that = this
        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        return (
            <div className="popup-form">
                <Modal show={this.props.showModal} dialogClassName="custom-modal" bsSize="lg" onHide={this.close} >
                    <Modal.Header>
                        <Modal.Title><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                        <div className="panel-body">
                            <div className="col-md-12 customize-react-table " >
                                <ReactTable
                                    columns={[

                                        {
                                            Header: props => <div className="">{this.props.strings.sessionno}</div>,
                                            id: "SESSIONNO",
                                            accessor: "SESSIONNO",
                                            width: 150
                                        },
                                        {
                                            Header: props => <div className="">{this.props.strings.orderid}</div>,
                                            id: "ORDERID",
                                            accessor: "ORDERID",
                                            width: 150
                                        },
                                        {
                                            Header: props => <div className="">{this.props.strings.ordertype}</div>,
                                            id: getExtensionByLang("EXECTYPE_DESC", this.props.language),
                                            accessor: getExtensionByLang("EXECTYPE_DESC", this.props.language),
                                            Cell: row => (
                                                <span style={{ fontWeight: 'bold', textTransform: 'uppercase', color: row.original.SRTYPE == SRTYPE_SW ? COLORSW : (row.original.EXECTYPE == SRTYPE_NR ? COLORNR : COLORNS) }}>
                                                    {

                                                        row.value

                                                    }
                                                </span>
                                            ),
                                            width: 150
                                        },
                                        {
                                            Header: props => <div className="">{this.props.strings.custodycd}</div>,
                                            id: "CUSTODYCD",
                                            accessor: "CUSTODYCD",
                                            show: !isCustom,
                                            width: 150
                                        },
                                        {
                                            Header: props => <div className="">{this.props.strings.vfmcode}</div>,
                                            id: "SYMBOL",
                                            accessor: "SYMBOL",
                                            width: 150
                                        },

                                        {
                                            Header: props => <div className="wordwrap">{this.props.strings.amount}</div>,
                                            accessor: "ORDERVALUE",
                                            Cell: ({ value }) => (
                                                <span className="col-right">
                                                    {

                                                        <NumberInput value={value} displayType={'text'} thousandSeparator={true} />

                                                    }
                                                </span>
                                            ),
                                            width: 150

                                        },
                                        {
                                            Header: props => <div className="">{this.props.strings.matchqtty}</div>,
                                            accessor: "MATCHQTTY",
                                            Cell: ({ value }) => (
                                                <span className="col-right">
                                                    {

                                                        <NumberInput value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} prefix={''} />

                                                    }
                                                </span>
                                            ),
                                            width: 150

                                        },
                                        {
                                            Header: props => <div className="">{this.props.strings.allocateqtty}</div>,
                                            accessor: "ALLOCATEQTTY",
                                            // Cell: ({ value }) => (
                                            //     <span className="col-right">
                                            //         {

                                            //             <NumberInput value={value} displayType={'text'} thousandSeparator={true} />

                                            //         }
                                            //     </span>
                                            // ),
                                            width: 150

                                        },
                                        {
                                            Header: props => <div className="">{this.props.strings.status}</div>,
                                            id: getExtensionByLang("STATUS_DES", this.props.language),
                                            accessor: getExtensionByLang("STATUS_DES", this.props.language),
                                            width: 150
                                        },
                                        {
                                            Header: props => <div className="">{this.props.strings.vfmcodesw}</div>,
                                            id: "SWSYMBOL",
                                            accessor: "SWSYMBOL",
                                            width: 75
                                        },
                                        {
                                            Header: props => <div className="">{this.props.strings.vsdorderid}</div>,
                                            id: "VSDORDERID",
                                            accessor: "VSDORDERID",
                                            width: 150
                                        },
                                        {
                                            Header: props => <div className="wordwrap">{this.props.strings.txdate}</div>,
                                            id: "TXDATE",
                                            accessor: "TXDATE",
                                            width: 80,

                                        },
                                        {
                                            Header: props => <div className="wordwrap">{this.props.strings.tradingdate}</div>,
                                            id: "TRADINGDATE",
                                            accessor: "TRADINGDATE",
                                            width: 80,

                                        },

                                        {
                                            Header: props => <div className="">{this.props.strings.user}</div>,
                                            id: "USERNAME",
                                            accessor: "USERNAME",
                                            width: 150,

                                        },
                                        {
                                            Header: props => <div className="">{this.props.strings.date}</div>,
                                            id: "TXTIME",
                                            accessor: "TXTIME",
                                            width: 100,

                                        }

                                    ]}
                                    data={data}
                                    //onFetchData={this.fetchData}
                                    defaultPageSize={pagesize}
                                    pages={pages}
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

                                    previousText={<i className="fas fa-backward"></i>}
                                    nextText={<i className="fas fa-forward"></i>}

                                />
                            </div>
                        </div>
                    </Modal.Body>

                </Modal>
            </div>
        )
    }
}

const stateToProps = state => ({
    showModal: state.datLenh.showModalSipDetail,
    tradingdate: state.systemdate.tradingdate,
    language: state.language.language,
    auth: state.auth
});
const dispatchToProps = dispatch => ({
    closeModalSipDetail: bindActionCreators(closeModalSipDetail, dispatch)
})

const decorators = flow([
    connect(stateToProps, dispatchToProps),
    translate('ModalSipDetail')
]);
module.exports = decorators(ModalSipDetail);

