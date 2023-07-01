import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils'
import { showNotifi } from 'app/action/actionNotification.js';
import Select from 'react-select';
import DropdownFactory from 'app/utils/DropdownFactory';
import NumberInput from 'app/utils/input/NumberInput';
import NumberFormat from 'react-number-format';

class RutTienKhaDung extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datagroup: {

            },
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
            CODEID: '',
            p_custodycd: '',
            p_ivsrtype: '',
            p_amount: 0,
            p_avlamt: 0,
            p_desc: '',
            p_spcode: '',
            isDisableSPCODE: false,
            checkFields: [
                { name: "tlname", id: "drdTlname" },
                { name: "p_ivsrtype", id: "drdIVSRTYPE" },
                { name: "CODEID", id: "drdCODEID" },
                { name: "p_amount", id: "txtAmount" },
            ],
        };
    }

    submitGroup = () => {
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }
        if (mssgerr == '') {
            var api = '/balance/withdraw';
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            RestfulUtils.posttrans(api, {
                custodycd: this.state.tlname.value,
                fullname: this.state.datagroup["FULLNAME"],
                idcode: this.state.datagroup["IDCODE"],
                codeid: this.state.CODEID,
                ivsrtype: this.state.p_ivsrtype,
                spcode: this.state.p_spcode,
                avlamt: this.state.p_avlamt,
                amount: this.state.p_amount,
                desc: this.state.p_desc,
                language: this.props.lang, objname: this.props.datapage.OBJNAME
            })
                .then((res) => {
                    //onsole.log('res ', res)
                    if (res.EC == 0) {
                        datanotify.type = "success"
                        datanotify.content = this.props.strings.success;
                        dispatch(showNotifi(datanotify));
                        this.setState({
                            tlname: { value: '' },
                            p_ivsrtype: 'NN',
                            CODEID: '',
                            p_amount: 0,
                            datagroup: '',
                            p_avlamt: 0,
                            p_spcode: '',
                            p_desc: '',
                        })
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
        if (event.target) {
            if (event.target.type == "checkbox")
                this.state[type] = event.target.checked;
            else {
                this.state[type] = event.target.value;
            }
        }
        else {
            this.state[type] = event.value;
        }
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
        let value = this.state[name];
        let mssgerr = '';

        switch (name) {

            case "tlname":
                if (value == '') {
                    mssgerr = this.props.strings.requiredcustodycd;
                }
                break;
            case "p_ivsrtype":
                if (value == '') {
                    mssgerr = this.props.strings.requiredivsrtype;
                }
                break;
            case "CODEID":
                if (value == '') {
                    mssgerr = this.props.strings.requiredcodeid;
                }
                break;
            case "p_amount":
                if (value == '') {
                    mssgerr = this.props.strings.requiredamount;
                }
                else if (parseFloat(value) > parseFloat(this.state.p_avlamt)) {
                    mssgerr = this.props.strings.requiredValidAmount;
                }
                else if (parseFloat(value) <= 0) {
                    mssgerr = this.props.strings.requiredValidAmount2;
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
    render() {
        let money = this.state.p_avlamt
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

                <div className="add-info-account">

                    <div className="title-content">{this.props.strings.title}</div>

                    <div className="row col-md-8 col-md-push-2" style={{ paddingTop: "20px" }}>

                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5 className="highlight"><b>{this.props.strings.custodycd}</b></h5>
                            </div>
                            <div className="col-md-8 customSelect">
                                {/* <Select.Async
                                    name="form-field-name"

                                    loadOptions={this.getOptionsSelect.bind(this, 'CUSTODYCD')}
                                    value={this.state.tlname} // custodycd
                                    onChange={this.onChangecb.bind(this)}
                                    //onChange={this.onChangeSelect.bind(this, 'CUSTODYCD')}
                                    clearable={true}
                                    options={this.state.listOptionSelect['CUSTODYCD']}
                                    backspaceRemoves={true}
                                    cache={false}
                                    id="drdTlname"
                                /> */}
                                <Select.Async
                                    name="form-field-name"
                                    placeholder={this.props.strings.custodycd}
                                    loadOptions={this.getOptions2.bind(this)}
                                    value={this.state.CUSTODYCD}
                                    onChange={this.onChangecb.bind(this)}
                                    id="drdCUSTODYCD"
                                    ref="refCUSTODYCD"
                                />
                                {/* <Select.Async
                                    name="form-field-name"
                                    loadOptions={this.test.bind(this)}
                                    value={this.state.tlname} // custodycd
                                    onChange={this.onChangecb.bind(this)}
                                    id="drdTlname1"
                                /> */}
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5 className=""><b>{this.props.strings.DBCODE}</b></h5>
                            </div>
                            <div className="col-md-8 ">
                                <label disabled className="form-control" id="txtfullname" >{this.state.datagroup["DBCODE"]}</label>
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5 className=""><b>{this.props.strings.fullname}</b></h5>
                            </div>
                            <div className="col-md-8 ">
                                <label className="form-control" id="txtfullname" >{this.state.datagroup["FULLNAME"]}</label>
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5><b>{this.props.strings.idcode}</b></h5>
                            </div>
                            <div className="col-md-8">
                                <label className="form-control" id="lblidcode">{this.state.datagroup["IDCODE"]}</label>
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5 className="highlight"><b>{this.props.strings.maquy}</b></h5>
                            </div>
                            <div className="col-md-8">
                                <Select.Async
                                    name="form-field-name"
                                    placeholder={this.props.strings.maquy}
                                    loadOptions={this.getOptionsSYMBOL.bind(this)}
                                    value={this.state.CODEID}
                                    onChange={this.onChangeSYMBOL.bind(this)}
                                    id="drdCODEID"
                                />
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5 className="highlight"><b>{this.props.strings.ivsrtype}</b></h5>
                            </div>
                            <div className="col-md-8">
                                <DropdownFactory onSetDefaultValue={this.onSetDefaultValue.bind(this)} CDVAL={this.state.p_ivsrtype} onChange={this.onChangeDropdown.bind(this)} value="p_ivsrtype" CDTYPE="IV" CDNAME="IVSRTYPE" ID="drdIVSRTYPE" />
                            </div>
                        </div>
                        {this.state.isDisableSPCODE && <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5 className=""><b>{this.props.strings.spcode}</b></h5>
                            </div>
                            <div className="col-md-8">
                                <label className="form-control" id="lblspcode">{this.state.p_spcode}</label>
                            </div>
                        </div>}

                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5><b>{this.props.strings.avlamt}</b></h5>
                            </div>
                            <div className="col-md-8">
                                <NumberInput className="form-control" value={money} displayType={'text'} thousandSeparator={true} />
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5 className="highlight"><b>{this.props.strings.amount}</b></h5>
                            </div>
                            <div className="col-md-8">
                                <NumberFormat className="form-control" id="txtAmount" value={this.state.p_amount} onValueChange={this.onValueChange.bind(this, 'p_amount')} thousandSeparator={true} prefix={''} placeholder={this.state.p_amount} />
                            </div>
                        </div>

                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5><b>{this.props.strings.desc}</b></h5>
                            </div>
                            <div className="col-md-8">
                                <input maxLength='1000' value={this.state.p_desc} onChange={this.onChange.bind(this, "p_desc")} ref="txtDesc" className="form-control" id="txtDesc" type="text" placeholder={this.props.strings.desc} />
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


        )
    }
}
RutTienKhaDung.defaultProps = {

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
    translate('RutTienKhaDung')
]);

module.exports = decorators(RutTienKhaDung);
