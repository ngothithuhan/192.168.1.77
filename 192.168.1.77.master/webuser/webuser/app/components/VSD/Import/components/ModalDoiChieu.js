import React, { Component } from 'react';
import ReactTable from "react-table";
import { ButtonExport } from 'app/utils/buttonSystem/ButtonSystem'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils'
import { LabelEx } from 'app/utils/LabelEx';
import { showNotifi } from 'app/action/actionNotification.js';
import NumberInput from 'app/utils/input/NumberInput';
import DateInput from 'app/utils/input/DateInput';
import Select from 'react-select';
import { Button } from 'react-bootstrap';
import { DefaultPagesize,getRowTextTable,getPageTextTable,ArrSpecial } from 'app/Helpers'


class ModalDoiChieu extends Component {
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
            page: 1,
            dataTest: [

            ],
            receiveData: [],
            CODEID: { value: '', label: '' },
            datagroup: {
                p_symbol:'',
                p_tradingdate:''
            },
            isSearch: false,
            checkFields: [

                { name: "p_symbol", id: "cbCODEID" },
                { name: "p_tradingdate", id: "txtDate" },



            ],

        }
        // this.fetchData = this.fetchData.bind(this);
    }

    submit(acion) {
        window.$('#btnsubmit').prop('disabled', true);
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }
        let that = this
        let data = {
            p_filecode: this.props.filecode,
            p_fileid: this.props.fileid,
            p_symbol: this.state.datagroup.p_symbol,
            p_tradingdate: this.state.datagroup.p_tradingdate,
            p_objname: this.props.objname,
            p_action: acion,
            // p_language:this.props.lang
        }

        RestfulUtils.posttrans("/fund/file_compare_confirm", data)
            .then(async (res) => {
                if (res.EC == 0) {
                    datanotify.type = "success";
                    datanotify.content = this.props.strings.success;
                    dispatch(showNotifi(datanotify));
                  
                 
                    dispatch(showNotifi(datanotify))
                    var handle = setInterval(function(){  window.location.href = '/' + that.props.objname},1000)
                  
                   // clearInterval(handle)   
                    // this.props.closeModalDetail()
                    //this.setState({ err_msg: "Thêm mới user thành công" })

                } else {
                 
                    datanotify.type = "error";
                    datanotify.content = res.EM;
                    dispatch(showNotifi(datanotify));
                }

            })
    }


    closeModal = (stateModal) => {
        this.setState({ showModalReview: stateModal })
    }

    async  componentWillMount() {

        /*
        let that = this;
        //  p_txnum:this.props.DATA.OBJTYPE,
        let data = {
            p_filecode: this.props.filecode,
            p_fileid: this.props.fileid,
            p_language: this.props.lang

        }
        await axios.post('/fund/getlist_import_compare_orders', { data }).then((resData) => {

            if (resData.status == "200") {
                // console.log('datatable', resData)
                // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
                if (resData.data.EC == 0)
                    that.setState({
                        receiveData: resData.data.DT.data,
                        dataALL: resData.data.DT.data,
                    });
                else {

                }
            }
        });
*/

    }
    renderContent(receiveData) {
        let that = this
        var data = []
        let datapage = { ISADD: "Y", ISAPPROVE: "Y", ISDELETE: "Y", ISEDIT: "Y", ISINQUIRY: "Y" }

        {
            Object.keys(receiveData[0]).map((key, indexkey) => {

                if (key != 'TYPE') {
                    data.push(
                        {
                            Header: props => <div className="wordwrap" >{key}</div>,
                            id: key,
                            accessor: key,
                            width:120,
                            Cell: ({ value }) => (
                                <div className={(isNaN(value)==false && ArrSpecial.includes(key) == false && value != '') ? "col-right" : "col-left"}>
                                    {value != null ? (isNaN(value)==false && ArrSpecial.includes(key) == false && value != '') ? <NumberInput value={value} displayType={'text'} thousandSeparator={true} decimalScale={2}  /> : value : value}
                                </div>),
                            filterMethod: (filter, row) =>
                                row[filter.id] != null ? row[filter.id].toUpperCase().includes(filter.value.toUpperCase()) : ''


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
                        data={that.state.isSearch ? receiveData : []}
                        className="-striped -highlight"
                        sortable={false}
                        filterable
                        previousText={<i className="fas fa-backward" id="previous"></i>}
                        nextText={<i className="fas fa-forward" id="next"></i>}
                        //     loadingText="Đang tải..."
                        ofText="/"
                        defaultPageSize={this.state.pagesize}
                        pageText={getPageTextTable(this.props.lang)}
                        rowsText={getRowTextTable(this.props.lang)}
                        getTheadTrProps={() => {
                            return {
                                className: 'head'
                            }
                        }}
                    />
                </div>
                <div className="col-md-12 ">
                    <div className="col-right" style={{ marginBottom: "10px", marginLeft: -13 }}>
                        <button style={{ marginRight: "5px", fontSize: 10 }} className="btn btn-primary" onClick={this.submit.bind(that, 'C')}><span className="glyphicon glyphicon-ok"></span> {this.props.strings.submitbtn}</button>
                        <button style={{ marginRight: "5px", fontSize: 10 }} className="btn btn-default" onClick={this.submit.bind(that, 'R')} ><span className="glyphicon glyphicon-minus" ></span> {this.props.strings.cancelbtn}</button>
                        <ButtonExport style={{ fontSize: 10 }} dataRows={that.state.receiveData} isApproveImport={true} data={datapage} />
                    </div>
                </div>
            </div>
        )



    }
    onChangeDate(type, event) {

        this.state.datagroup[type] = event.value;
        this.setState({ datagroup: this.state.datagroup })

    }
    getOptionsSYMBOL(input) {
        return RestfulUtils.post('/allcode/search_all_funds', { key: input })
            .then((res) => {
                res.unshift({ value: 'ALL', label: 'ALL' })
                return { options: res }
            })
    }
    onChangeSYMBOL(e) {

        var that = this
        if (e && e.value)
            this.state.datagroup["p_symbol"] = e.label
        else this.state.datagroup["p_symbol"] = ''
        this.setState({
            CODEID: e,
            datagroup: this.state.datagroup
        })


    }
    search() {
        let that = this
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }
        if (mssgerr == '') {
            var api = '/fund/file_compare';

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            let data = {
                p_symbol: this.state.datagroup.p_symbol,
                p_tradingdate: this.state.datagroup.p_tradingdate,
                p_filecode: this.props.filecode,
                p_fileid: this.props.fileid,
                p_objname: this.props.objname
            }

            RestfulUtils.posttrans(api, data)
                .then(async (res) => {

                    if (res.EC == 0) {
                        let datacompare = {
                            p_filecode: this.props.filecode,
                            p_fileid: this.props.fileid,
                            p_symbol: this.state.datagroup.p_symbol,
                            p_tradingdate: this.state.datagroup.p_tradingdate,
                            p_language: this.props.lang,
                            p_objname: this.props.objname
                        }
                        await RestfulUtils.posttrans('/fund/getlistfile_getdatacompare', datacompare).then((res1) => {
                            if (res.EC == 0) {
                                that.setState({
                                    receiveData: res1.DT.data,
                                    isSearch: true
                                })
                            }
                            else {

                            }
                        })
                        // datanotify.type = "success";
                        //  datanotify.content = "Thành công";

                        //  dispatch(showNotifi(datanotify));
                        // this.props.load()
                        //  this.props.closeModalDetail()

                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                    }

                })

        }
    }
    checkValid(name, id) {
        let value = this.state.datagroup[name];

        let mssgerr = '';
        switch (name) {

            case "p_symbol":
                if (value == '') {
                    mssgerr = this.props.strings.requiredcodeid;
                }
                break;
            case "p_tradingdate":
                if (value == '') {
                    mssgerr = this.props.strings.requiredtxtime;
                }
                break;


            default:
                break;
        }
        if (mssgerr !== '') {
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            datanotify.type = "error";
            datanotify.content = mssgerr;
            dispatch(showNotifi(datanotify));
            window.$(`#${id}`).focus();
        }
        return mssgerr;
    }
    render() {
        console.log('render ModalDoiChieu')

        var self = this;

        return (
            <div>
                <div className="col-md-12">
                    <div className="add-info-account">
                        <div className="col-md-12 " style={{ marginBottom: "10px", marginLeft: -13, paddingBottom: 20 }}>
                        <div className="col-md-4 ">
                            <h5 className="highlight col-md-5" style={{ fontSize: "12px", float: "left" }}><LabelEx text={this.props.strings.fundcode} /></h5>
                            <div className="col-md-3 customSelect" style={{ zIndex: 1000, position: "fixed",marginLeft:80 }}>
                                <Select.Async
                                    name="form-field-name"
                                    // placeholder={this.props.strings.vfmcodetype}
                                    loadOptions={this.getOptionsSYMBOL.bind(this)}
                                    value={this.state.CODEID}
                                    onChange={this.onChangeSYMBOL.bind(this)}
                                    id="cbCODEID"

                                />
                                 </div>
                            </div>
                            <div className="col-md-4">
                            <h5 className="highlight col-md-5" style={{ fontSize: "12px", float: "left"}}><LabelEx text={this.props.strings.txdate} /></h5>
                            <div className="col-md-3 fixWidthDatePickerForOthers" style={{ position: "fixed",zIndex:1,marginLeft:100 }}>
                                <DateInput disabled={false} id='txtDate' onChange={self.onChangeDate.bind(self)} type="p_tradingdate" value={self.state.datagroup.p_tradingdate} />
                            </div>
                            </div>
                            <div className="col-md-2">
                            <Button bsStyle="success" className="pull-right" id="btnsubmit" onClick={this.search.bind(this)}>{this.props.strings.compare}</Button>
                         
                            </div>
                        </div>
                    </div>
                </div>

                {self.state.receiveData.length == 0 ? null : self.renderContent(self.state.receiveData)}

            </div>
        );
    }
}

ModalDoiChieu.defaultProps = {

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
    translate('ModalDoiChieu')
]);

module.exports = decorators(ModalDoiChieu);
