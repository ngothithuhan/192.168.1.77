import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import Select from 'react-select';
import { showNotifi } from 'app/action/actionNotification.js';
import NumberFormat from 'react-number-format';
class ModalDetailNhapNAV extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: {
                general: true,
                authorize: false,
                fatca: false,
                upload: false,
                quydangki: false,
            },
            display: {
                fatca: false,
                authorize: false
            },
            access: 'add',
            CUSTID: '',
            disabled: false,
            new_create: false,
            checkFields: [


                { name: "p_codeid", id: "cbvfmcode" },
                { name: "p_tradingid", id: "cbsession" },
                { name: "p_enav", id: "txtnavprice" },
                { name: "p_totalenav", id: "txtnavvalue" },
            ],
            datagroup: {},
            CODEID: { value: '', label: '' },
        };
    }
    collapse(tab) {
        // console.log(tab)
        this.state.collapse[tab] = !this.state.collapse[tab];
        // console.log(this.state.collapse)
        this.setState({ collapse: this.state.collapse })
    }
    //   handleChange(type){
    //     this.props.handleChange(type);

    //  }
    close() {

        this.props.closeModalDetail();
    }
    /**
     * Trường hợp update thì hiển thị tất cả thông tin lên cho sửa
     * Trường hơp view thì ẩn các nút sửa không cho duyệt
     * Trường hợp add thì ẩn thông tin chỉ hiện thông tin chung cho người dùng -> Thực hiện -> Mở các thông tin tiếp theo cho người dùng khai
     * @param {*access} nextProps
     */
    componentWillReceiveProps(nextProps) {
        let self = this;

        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()
                this.setState({

                    datagroup: {
                        p_tradingid: nextProps.DATA.TRADINGID,
                        p_codeid: nextProps.DATA.CODEID,
                        p_txdate: nextProps.DATA.TXDATE,
                        p_enav: parseFloat(nextProps.DATA.NAV),
                        p_totalenav: nextProps.DATA.TOTALNAV == null ? '' : parseFloat(nextProps.DATA.TOTALNAV),
                        p_des: nextProps.DATA.TXDESC,
                        p_language: this.props.lang,
                        pv_objname:this.props.OBJNAME
                    },
                    access: nextProps.access,
                    CODEID: { value: nextProps.DATA.CODEID, label: nextProps.DATA.SYMBOL },
                    session: { value: nextProps.DATA.TRADINGID, label: nextProps.DATA.TRADINGID, },
                })
            }
        }
        else
            if (nextProps.isClear) {

                this.props.change()
                this.setState({

                    new_create: true,
                    datagroup: {

                        p_codeid: '',
                        p_tradingid: '',
                        p_txdate: '',
                        p_enav: '',
                        p_totalenav: '',
                        p_des: '',
                        p_language: this.props.lang,
                        pv_objname:this.props.OBJNAME
                    },
                    access: nextProps.access,
                    CODEID: null,
                    session: null,
                    datasession: []
                })
            }
    }

    onChange(type, event) {
        let data = {};
        if (event.target) {

            this.state.datagroup[type] = event.target.value;
        }
        else {
            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup })
    }
    onValueChange(type, data) {

        this.state.datagroup[type] = data.value

        this.setState(this.state)
    }
    onChangeDate(type, event) {

        this.state.datagroup[type] = event.value;
        this.getOptions(event.value)
        this.setState({ datagroup: this.state.datagroup })

    }
    checkValid(name, id) {
        let value = this.state.datagroup[name];
        let mssgerr = '';
        switch (name) {


            //   case "p_txdate":
            //     if (value == '') {
            //          mssgerr = this.props.strings.requiredtxdate;
            //     }
            //    break;
            case "p_codeid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredcodeid;
                }
                break;
            case "p_tradingid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredtradingid;
                }
                break;
            case "p_enav":
                if (value == '') {
                    mssgerr = this.props.strings.requiredenav;
                }
                break;
            case "p_totalenav":
                if (value == '') {
                    mssgerr = this.props.strings.requiredtotalenav;
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
    async submitGroup() {
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            var api = '/fund/addnav';
            if (this.state.access == "update") {
                api = '/fund/updatenav';
            }

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            //   console.log(this.state.datagroup)
            RestfulUtils.posttrans(api, this.state.datagroup)
                .then((res) => {

                    if (res.EC == 0) {
                        datanotify.type = "success";
                        datanotify.content = this.props.strings.success;

                        dispatch(showNotifi(datanotify));
                        this.props.load()
                        this.props.closeModalDetail()

                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                    }

                })

        }



    }
    async getOptions(p_codeid, p_tradingid) {

        let data = {
            p_language: this.props.lang,
            p_codeid: p_codeid == '' ? this.state.datagroup["p_codeid"] : p_codeid,
            p_tradingid: p_tradingid
        }
        await RestfulUtils.post('/fund/getlisttraddingsession', { data })
            .then((res) => {

                if (p_codeid == '') {

                    this.state.datagroup["p_txdate"] = res[0].value
                    this.setState({
                        datagroup: this.state.datagroup
                    })
                }


                else
                    this.setState({
                        datasession: res
                    })
            })
    }
    onChangeSelect(e) {

        var that = this
        if (e && e.value) {
            // this.getSessionInfo(e.value);
            //this.set_data_feettypes(e.value)
            if (this.state.datagroup["p_codeid"] != e.value) {
                this.state.datagroup["p_codeid"] = e.value
                this.getOptions(e.value, '')
                this.setState({
                    CODEID: e,
                    session: null,
                    datagroup: this.state.datagroup
                })
            }
        } else {
            this.state.datagroup["p_codeid"] = ''
            this.state.datagroup["p_tradingid"] = ''
            this.state.datagroup["p_txdate"] = ''
            this.setState({
                CODEID: null,
                session: null,
                datagroup: this.state.datagroup,
                datasession: []
            })
        }

    }
    onChangesession(e) {

        var that = this
        if (e && e.value) {
            if (this.state.datagroup["p_tradingid"] != e.value) {
                this.state.datagroup["p_tradingid"] = e.value
                this.getOptions('', e.value)
                this.setState({
                    session: e,
                    datagroup: this.state.datagroup
                })
            }
        } else {
            this.state.datagroup["p_tradingid"] = ''
            this.state.datagroup["p_txdate"] = ''
            this.setState({
                session: null,
                datagroup: this.state.datagroup,
                // datasession:[]
            })
        }


    }
    getOptionsSYMBOL(input) {
        return RestfulUtils.post('/allcode/search_all_funds', { key: input })
            .then((res) => {

                return { options: res }
            })
    }
    render() {
        const pageSize = 5;
        let displayy = this.state.access != 'add' ? true : false
        return (
            <Modal show={this.props.showModalDetail} >
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">



                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>

                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight" ><b >{this.props.strings.vfmcode}</b></h5>
                                    </div>
                                    <div className="col-md-8 customSelect">
                                        <Select.Async
                                            name="form-field-name"
                                            placeholder={this.props.strings.vfmcode}
                                            loadOptions={this.getOptionsSYMBOL.bind(this)}
                                            value={this.state.CODEID}
                                            //  options={this.state.fund}
                                            onChange={this.onChangeSelect.bind(this)}
                                            id="cbvfmcode"
                                            disabled={displayy}
                                            backspaceRemoves={false}

                                        />                                      </div>
                                    <div className="col-md-2"></div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.session}</b></h5>
                                    </div>
                                    <div className="col-md-8 customSelect">
                                        <Select
                                            name="form-field-name"
                                            placeholder={this.props.strings.session}

                                            value={this.state.session}
                                            options={this.state.datasession}
                                            onChange={this.onChangesession.bind(this)}
                                            id="cbsession"
                                            disabled={displayy}
                                            backspaceRemoves={false}

                                        />                                      </div>
                                    <div className="col-md-2"></div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 ><b>{this.props.strings.date}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <label id="txtDate" className="form-control" >{this.state.datagroup.p_txdate}</label>
                                    </div>
                                    <div className="col-md-2"></div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.navprice}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <NumberFormat maxLength={21} disabled={this.state.access == 'update' ? false : displayy} className="form-control" id="txtnavprice" onValueChange={this.onValueChange.bind(this, 'p_enav')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.navprice} value={this.state.datagroup["p_enav"]} decimalScale={2} allowNegative={false} />
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.navvalue}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <NumberFormat maxLength={21} disabled={this.state.access == 'update' ? false : displayy} className="form-control" id="txtnavvalue" onValueChange={this.onValueChange.bind(this, 'p_totalenav')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.navvalue} value={this.state.datagroup["p_totalenav"]} decimalScale={2} allowNegative={false} />
                                    </div>

                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.note}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <input className="form-control" disabled={this.state.access == 'update' ? false : displayy} type="text" placeholder={this.props.strings.note} id="txtNote" value={this.state.datagroup["p_des"] == null ? '' : this.state.datagroup["p_des"]} onChange={this.onChange.bind(this, "p_des")} />
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">

                                    </div>
                                    <div className="col-md-8">
                                        <input type="button" disabled={this.state.access == 'update' ? false : displayy} onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginLeft: 0, float: 'right' }} value={this.props.strings.submit} id="btnSubmit" />
                                    </div>

                                </div>

                            </div>
                        </div>


                    </div>

                </Modal.Body>

            </Modal>
        );
    }
}
const stateToProps = state => ({
    lang: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalDetailNhapNAV')
]);
module.exports = decorators(ModalDetailNhapNAV);
