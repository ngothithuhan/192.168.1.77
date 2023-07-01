
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'


import Select from 'react-select';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils'
import { showNotifi } from 'app/action/actionNotification.js';
import DropdownFactory from 'app/utils/DropdownFactory';
import NumberInput from 'app/utils/input/NumberInput';
import NumberFormat from 'react-number-format';
import DateInputMonth from 'app/utils/input/DateInputMonth';
import moment from "moment";
class ModalNhapNAVCuoiThang extends React.Component {
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
            
            datagroup: {},


            datagroup1: {
                p_tlname: ''
            },
            listOptionSelect: {
                CUSTODYCD: []
            },
            isFirstLoad: true,
            CUSTODYCD: '',
            tlnamesearch: '',
            nextStep: true,
            tlname: { value: '', label: '', tlid: '' },
            options: [],
            // khoi tao
            p_codeid: '',

            p_custodycd: '',
            p_ivsrtype: '',
            p_amount: 0,
            p_avlamt: 0,
            p_desc: '',
            p_spcode: '',
            isDisableSPCODE: false,
            CODEID: '',
            ENDOFMONTH: '',
            ENDMONTH_NAV: '',
            ENDMONTH_NAVAMOUNT: '',
            checkFields: [
                { name: "CODEID", id: "drdCODEID" },
                { name: "ENDOFMONTH", id: "txtENDOFMONTH" },
                { name: "ENDMONTH_NAV", id: "ENDMONTH_NAV" },
                { name: "ENDMONTH_NAVAMOUNT", id: "ENDMONTH_NAVAMOUNT" },
            ],
        };
    }

    submitGroup = () => {
        console.log('this.state.CODEID:', this.state.CODEID);
        console.log('this.state.ENDOFMONTH:', this.state.ENDOFMONTH);
        console.log('this.state.ENDMONTH_NAV:', this.state.ENDMONTH_NAV);
        console.log('this.state.ENDMONTH_NAVAMOUNT:', this.state.ENDMONTH_NAVAMOUNT);
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }
        if (mssgerr == '') {
            var api = this.props.access == "update" ? '/fund/update_endmonth_nav':'/fund/insert_endmonth_nav';
            
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            RestfulUtils.posttrans(api, {
                p_codeid: this.state.CODEID.value ? this.state.CODEID.value:this.state.CODEID,
                p_endofmonth: this.state.ENDOFMONTH,
                p_endmonth_nav: this.state.ENDMONTH_NAV,
                p_endmonth_navamount: this.state.ENDMONTH_NAVAMOUNT,
                language: this.props.lang,
                objname: this.props.OBJNAME
            })
                .then((res) => {
                    //onsole.log('res ', res)
                    if (res.EC == 0) {
                        datanotify.type = "success"
                        datanotify.content = this.props.strings.success;
                        dispatch(showNotifi(datanotify));
                        this.setState(this.state)
                        this.props.closeModalDetail()
                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                    }

                })

        }

    }

    onSetDefaultValue = (type, value) => {
        if (!this.state[type])
            this.state[type] = value
    }

    // getOptions(input) {
    //     let self = this;
    //     let tmp = [];
    //         RestfulUtils.post('/account/getcarebygroupbytlid', { OBJNAME: this.props.datapage.OBJNAME, language: this.props.currentLanguage })
    //             .then((resDT) => {
    //                 if (resDT.EC == 0) {

    //                     var i;
    //                     if (resDT.DT.length > 0) {
    //                         for (i = 0; i < resDT.DT.length; i++) {
    //                             tmp.push(resDT.DT[i].GRPID)
    //                         }
    //                         RestfulUtils.post('/account/search_all_fullname2', { key: input, listCareBy: tmp })
    //                             .then((res) => {
    //                                 if (res.length > 0) {
    //                                      self.state.listOptionSelect['CUSTODYCD'] = res
    //                                      self.setState({ listOptionSelect: self.state.listOptionSelect })
    //                                     //return { options: res }
    //                                 }
    //                             })

    //                     }

    //                 }
    //             })
    // }
    // getOptions(input) {
    //     let self = this;
    //     RestfulUtils.post('/account/search_all', { key: input, detail: "DETAIL" })
    //         .then((res) => {
    //             const { user } = self.props.auth
    //             let isCustom = user && user.ISCUSTOMER == 'Y';
    //             var data = [];
    //             if (isCustom) {
    //                 var defaultCustodyCd = self.props.auth.user.USERID;
    //                 data = [{ label: defaultCustodyCd, value: defaultCustodyCd }];
    //             } else {
    //                 data = res;
    //             }
    //             if (data && data.length > 0) {
    //                 self.state.listOptionSelect['CUSTODYCD'] = res
    //                 self.setState({ listOptionSelect: self.state.listOptionSelect })
    //             }
    //             // return { options: data };
    //         })
    // }
    getOptions2(input) {
        return RestfulUtils.post('/account/search_all', { key: input, detail: "DETAIL" })
            .then((res) => {
                const { user } = this.props.auth
                let isCustom = user && user.ISCUSTOMER == 'Y';
                var data = [];
                if (isCustom) {
                    var defaultCustodyCd = this.props.auth.user.USERID;
                    data = [{ label: defaultCustodyCd, value: defaultCustodyCd }];
                } else {
                    data = res;
                }
                if (data && data.length > 0) {
                    this.setState({ ...this.state, CUSTODYCD: data[0] })
                }
                return { options: data };
            })
    }
    test(input) {
        RestfulUtils.post('/account/search_all', { key: input, detail: "DETAIL" })
            .then((res) => {
                return { options: res }
            })
    }
    async getOptionsSelect(type, input) {
        return { options: this.state.listOptionSelect[type] }
    }
    onChangecb(e) {
        var that = this
        if (e && e.value) {
            this.getInfoBalanceSIPCode(e.value, this.state.CODEID, this.state.p_ivsrtype)
            this.getSipCode(e.value, this.state.SYMBOL, this.state.p_ivsrtype)
            this.state.datagroup1["p_custid"] = e.detail.CUSTID
            this.state.datagroup1["p_custodycd"] = e.value
            this.setState({
                tlname: e,
                datagroup1: that.state.datagroup1,
                datagroup: e.detail,
                nextStep: false
            })
        }
        // this.getSessionInfo(e.value);

        else {
            this.state.datagroup1["p_custid"] = ''
            this.state.datagroup1["p_custid"] = ''
            this.setState({
                tlname: { value: '', label: '', detail: {} },
                datagroup1: that.state.datagroup1,
                datagroup: {},
                nextStep: true
            })

        }
    }
    onChange(type, event) {
        console.log(type, event)
        this.state[type] = event.value;
        this.setState({ ...this.state })
    }
    onChangeDropdown(type, event) {
        this.state[type] = event.value;
        if (type == "p_ivsrtype") {
            if (event.value == 'SP') {
                this.state.isDisableSPCODE = true;
            } else {
                this.state.isDisableSPCODE = false;
            }
            this.getInfoBalanceSIPCode(this.state.tlname.value, this.state.CODEID, event.value)
            this.getSipCode(this.state.tlname.value, this.state.SYMBOL, event.value)
        }
        this.setState(this.state);
    }
    getOptionsSYMBOL(input) {
        return RestfulUtils.post('/allcode/search_all_funds', { key: input })
            .then((res) => {

                return { options: res }
            })
    }
    onChangeSYMBOL(e) {
        if (e && e.value) {
            this.getInfoBalanceSIPCode(this.state.tlname.value, e.value, this.state.p_ivsrtype)
            this.getSipCode(this.state.tlname.value, e.label, this.state.p_ivsrtype)

            this.setState({
                CODEID: e.value,
                SYMBOL: e.label
            })
        }
        else
            this.setState({
                CODEID: '',
                SYMBOL: ''
            })
    }
    getInfoBalanceSIPCode(custodycd, codeid, custtype) {
        RestfulUtils.post('/balance/getbalanceavail', { custodycd: custodycd, codeid: codeid, custtype: custtype, objname: this.props.datapage.OBJNAME }).then(res => {
            //console.log('res >>>>>>>', res)
            if (res.resultdata) {
                this.setState({
                    ...this.state, p_avlamt: res.resultdata.p_avlamt,
                })
            }
        })
    }
    getSipCode(custodycd, symbol, srtype) {
        RestfulUtils.post('/balance/sqlgetsipcode', { custodycd: custodycd, symbol: symbol, srtype: srtype, objname: this.props.datapage.OBJNAME }).then(res => {
            //console.log('res >>>>>>>', res)
            if (res.resultdata) {
                this.setState({
                    ...this.state, p_spcode: res.resultdata.p_sipcode,
                })
            } else {
                this.setState({
                    ...this.state, p_spcode: '',
                })
            }
        })
    }
    checkValid(name, id) {
        console.log('checkvalid :::',name,id)
        let value = this.state[name];
        let mssgerr = '';

        switch (name) {

            case "CODEID":
                if (this.state.CODEID == '') {
                    mssgerr = this.props.strings.requiredcodeid;
                }
                break;
            case "ENDOFMONTH":
                if (this.state.ENDOFMONTH == '') {
                    mssgerr = this.props.strings.requiredendofmonth;
                }
                break;
            case "ENDMONTH_NAV":
                if (this.state.ENDMONTH_NAV == '') {
                    mssgerr = this.props.strings.requiredendmonthnav;
                }
                break;
            case "ENDMONTH_NAVAMOUNT":
                if (this.state.ENDMONTH_NAVAMOUNT == '') {
                    mssgerr = this.props.strings.requiredendmonthnavamount;
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
    onValueChange(type, data) {
        this.state[type] = data.value
        this.setState(this.state)

    }
    componentDidMount() {
        // this.getOptions();
    }
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
                        pv_objname: this.props.OBJNAME
                    },
                    CODEID: nextProps.DATA.CODEID,
                    ENDOFMONTH: '01/'+ nextProps.DATA.ENDMONTH,
                    ENDMONTH_NAV: nextProps.DATA.ENDMONTH_NAV,
                    ENDMONTH_NAVAMOUNT: nextProps.DATA.ENDMONTH_NAVAMOUNT,
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
                        pv_objname: this.props.OBJNAME
                    },
                    CODEID: '',
                    ENDOFMONTH: '',
                    ENDMONTH_NAV: '',
                    ENDMONTH_NAVAMOUNT: '',
                    access: nextProps.access,
                    session: null,
                    datasession: []
                })
            }
    }
    validBirthdate(current) {
        const currentDate = moment().subtract(1, "day");
        return current < currentDate;
    }
    onChangeCODEID(e) {
        if (e && e.value) {

            this.state.CODEID = e.value;
            this.setState(this.state);
        } else {
            this.state.CODEID = "";
            this.setState(this.state);
        }
    }
    onValueChange(type, data) {

        this.state[type] = data.value

        this.setState(this.state)
    }
    close() {

        this.props.closeModalDetail();
    }
    render() {
        let money = this.state.p_avlamt
        return (
            <Modal show={this.props.showModalDetail} >
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>

                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.maquy}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                            <Select.Async
                                                disabled = {this.state.access == "view" || this.state.access == "update" ?true:false}
                                                name="form-field-name"
                                                placeholder={this.props.strings.maquy}
                                                loadOptions={this.getOptionsSYMBOL.bind(this)}
                                                value={this.state.CODEID}
                                                onChange={this.onChangeCODEID.bind(this)}
                                                id="drdCODEID"
                                            />
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.ENDMONTH}</b></h5>
                                    </div>
                                    <div className="col-md-8 customSelect">
                                        {/* <DateInputMonth placeholder={i.FLDFORMAT} disabled={false} id={i.DEFNAME} onChange={self.onChangeDate.bind(self)} type={i.DEFNAME} value={self.state.outParams[i.DEFNAME] != undefined ? self.state.outParams[i.DEFNAME] : ''} /> */}
                                        <DateInputMonth
                                            disabled = {this.state.access == "view" || this.state.access == "update" ?true:false}
                                                valid={this.validBirthdate}
                                                id="txtENDOFMONTH"
                                                onChange={this.onChange.bind(this)}
                                                value={this.state.ENDOFMONTH}
                                                type="ENDOFMONTH"
                                            />
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.ENDMONTH_NAV}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <NumberFormat maxLength={20}
                                            className="form-control" id="txtENDMONTH_NAV"
                                            onValueChange={this.onValueChange.bind(this, 'ENDMONTH_NAV')}
                                            thousandSeparator={true} prefix={''}
                                            placeholder={this.props.strings.ENDMONTH_NAV} value={this.state.ENDMONTH_NAV}
                                            decimalScale={2} allowNegative={false} />
                                        {/* <input
                                    value={this.state.ENDMONTH_NAV}
                                    onChange={this.onChange.bind(this, "ENDMONTH_NAV")}
                                    id="txtENDMONTH_NAV"
                                    className="form-control"
                                    type="text"
                                    placeholder={this.props.strings.ENDMONTH_NAV}

                                /> */}
                                        {/* <label className="form-control" id="txtfullname" >{this.state.ENDMONTH_NAV}</label> */}
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.ENDMONTH_NAVAMOUNT}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <NumberFormat maxLength={20}
                                            className="form-control" id="ENDMONTH_NAVAMOUNT"
                                            onValueChange={this.onValueChange.bind(this, 'ENDMONTH_NAVAMOUNT')}
                                            thousandSeparator={true} prefix={''}
                                            placeholder={this.props.strings.ENDMONTH_NAVAMOUNT} value={this.state.ENDMONTH_NAVAMOUNT}
                                            decimalScale={2} allowNegative={false} />
                                        {/* <label className="form-control" id="txtfullname" >{this.state.ENDMONTH_NAV}</label> */}
                                    </div>
                                </div>



                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        <input type="button" className="btn btn-primary" onClick={this.submitGroup.bind(this)} style={{ marginLeft: 0, marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

            </Modal>

        )
    }
}
ModalNhapNAVCuoiThang.defaultProps = {

    strings: {
        title: 'Phong tỏa tài khoản'

    },


};
const stateToProps = state => ({
    lang: state.language.language,
    auth: state.auth
});


const decorators = flow([
    connect(stateToProps),
    translate('ModalNhapNAVCuoiThang')
]);

module.exports = decorators(ModalNhapNAVCuoiThang);
