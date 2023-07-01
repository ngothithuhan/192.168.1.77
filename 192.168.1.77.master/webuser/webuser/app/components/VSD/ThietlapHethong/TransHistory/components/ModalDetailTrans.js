import React, { Component } from 'react';
import ReactTable from "react-table";
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { LabelEx } from 'app/utils/LabelEx';
import NumberInput from 'app/utils/input/NumberInput';
import { ArrSpecial,getRowTextTable,getPageTextTable } from 'app//Helpers';
function toNormalize(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace("Đ","D")
}
class ModalDetailTrans extends Component {
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
            ],
            receiveData: [],

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

    componentWillMount() {
        let that = this;
        //  p_txnum:this.props.DATA.OBJTYPE,
        let data = {
            p_txnum: this.props.DATA.TXNUM,
            p_txdate: this.props.DATA.TXDATE,
            p_language: this.props.lang

        }
        RestfulUtils.post('/fund/getlisttxhistory', { data }).then((resData) => {

            // console.log('datatable', resData)
            // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
            if (resData.EC == 0)
                that.setState({
                    receiveData: resData.DT.data
                });
        });
    }
    renderContent(receiveData) {

        var TYPE = ''
        if (receiveData.length > 0) {
            TYPE = receiveData[0].TYPE ? receiveData[0].TYPE : '';
        }

        if (TYPE != 'TABLE') {
            return (
                <div className="panel panel-success modal-chitiet1" style={{ height: 400 }}>


                    <table >
                        <thead></thead>
                        <tbody>
                            {receiveData.map((e, index) => {

                                return <tr key={index}>
                                    <td style={{ paddingLeft: "30px" }} colSpan="1"><LabelEx text={e.CAPTION != undefined ? e.CAPTION : ' '} /></td>
                                    {e.VALUE == e.NVALUE ?
                                        <td colSpan="2"><NumberInput className="form-control" disabled={true} value={e.VALUE} displayType={'text'} thousandSeparator={true} /></td> :
                                        <td colSpan="2"><input className="form-control" value={e.VALUE != undefined ? e.VALUE : ''} disabled /></td>
                                    }
                                </tr>

                            }
                            )}
                        </tbody>
                    </table>
                </div>
            )
        } else if (TYPE == 'TABLE') {
            var data = []
            {
                Object.keys(receiveData[0]).map((key, indexkey) => {
                  
                    if (key != 'TYPE') {
                        data.push(
                            {
                                Header: props => <div className="wordwrap" id={"lbl"+key}>{this.props.strings[key]?this.props.strings[key]:key}</div>,
                                id: key,
                                width:100,
                                accessor: key,
                                Cell: ({ value }) => (
                                    <div className={isNaN(value) == false ? "col-right" : "col-left"}>
                                        {value != null ? (isNaN(value)==false && ArrSpecial.includes(key) == false && value != '')  ? <NumberInput value={value} displayType={'text'} thousandSeparator={true} /> : value : value}
                                    </div>),
                                filterMethod: (filter, row) =>
                                    row[filter.id] != null ? toNormalize(row[filter.id].toUpperCase()).includes(filter.value.toUpperCase()) : ''


                            },
                        )
                    }
                })
            }

            return (
                <div className="panel " style={{ padding: 15 }} >
                    <div className="col-md-12" id="basic-table">
                        <ReactTable
                            columns={data}
                            data={receiveData}
                            className="-striped -highlight"
                            sortable={false}
                            filterable
                            previousText={<i className="fas fa-backward" id="previous"></i>}
                            nextText={<i className="fas fa-forward" id="next"></i>}
                            loadingText="Đang tải..."
                            pageText={getPageTextTable(this.props.lang)}
                            rowsText={getRowTextTable(this.props.lang)}
                            ofText="/"
                            defaultPageSize={5}
                            getTheadTrProps={() => {
                                return {
                                    className: 'head'
                                }

                            }}


                        />
                    </div>
                </div>
            )
            /*
             return <table className='table table-hover'>
                     <thead>
                         <tr className="head">
                             {Object.keys(receiveData[0]).map((key, indexkey) => {
                               
                                 if (key != 'TYPE') {
                                     return <th><LabelEx text={key} /></th>
                                 }
                             })}
 
                         </tr>
                     </thead>
                     <tbody>
                         {receiveData.map((e, index) => {
                             return <tr key={index}>
                                 {Object.keys(e).map((key, indexkey) => {
                                     if (key != 'TYPE') {
                                         return <td ><span style={{ float: 'left', paddingLeft: '5px' ,width:'max-content',maxWidth:'300px'}}>{e[key]}</span></td>
                                     }
                                 })}
                             </tr>
                         })}
                     </tbody>
                 </table>
            */
        }

    }
    render() {
        var that = this;
        let displayexport = 'none'
        let datapage = { ISADD: "Y", ISAPPROVE: "Y", ISDELETE: "Y", ISEDIT: "Y", ISINQUIRY: "Y" }

        if (this.state.receiveData.length > 0) {
            let TYPE = this.state.receiveData[0].TYPE ? this.state.receiveData[0].TYPE : '';
            if (TYPE == 'TABLE') displayexport = 'inline-block'
        }
        return (
            <div>
                <ButtonExport style={{ fontSize: 10, display: displayexport }} dataRows={that.state.receiveData} isApproveImport={true} data={datapage} />
                {that.renderContent(that.state.receiveData)}
            </div>
        );
    }
}

ModalDetailTrans.defaultProps = {

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
    translate('ModalDetailTrans')
]);

module.exports = decorators(ModalDetailTrans);
