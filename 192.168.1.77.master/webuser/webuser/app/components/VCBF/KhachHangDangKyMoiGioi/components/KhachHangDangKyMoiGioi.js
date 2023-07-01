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

class KhachHangDangKyMoiGioi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datagroup: {

            },
            datagroup1: {
                p_tlname: ''
            },
            tlnamesearch: '',
            nextStep: true,
            tlname: { value: '', label: '', tlid: '' },
            options: [],
            p_codeid: '',
            CODEID: '',
            p_custodycd: '',
            p_ivsrtype: '',
            p_amount: 0,
            p_avlamt: 0,
            p_desc: '',
            p_spcode: '',
            isDisableSPCODE: false,
            ISEDIT: false,
            access: 'add',
            DATA: '',
            AccountInfo: {},
            optionsDataMG: [],
            optionsTKGD: [],
            optionMaLoaiHinh: [],
            dataMGrow: {}, //obj kq loc dc
            dataLHrow: {},
            dataMG: [],
            dataLH: [],
            p_refacctno: '', //so hieu tk giao dich
            CUSTODYCD: '',
            SALEID: '',
            defaultValueCustomer: '',
            p_retype: '',
            p_saleid: '',
            p_saleacctno: '',
            p_rerole: '',
            p_reproduct: '',
            isFirstLoad: true,
            pv_objname: this.props.datapage.OBJNAME,
            pv_language: this.props.language,
            p_fullname: '',
            p_tlname: '',
            listOptionSelect: {
                CUSTODYCD: [],
                SALEID: []
            },
            currentSale: '',
            checkFields: [
                { name: "p_refacctno", id: "drdrefacctno" },
                { name: "p_saleid", id: "drdsaleid" },
                { name: "p_retype", id: "drdretype" },
            ],
        };
    }
    componentWillReceiveProps(nextProps) {
        this.state.ISCUSTOMER = nextProps.ISCUSTOMER;
        this.state.username = nextProps.username;
        this.onLoadComponentTKGD();
        //this.onLoadComponentMoiGioi();
    }
    async getOptionsSelect(type, input) {
        return { options: this.state.listOptionSelect[type] }
    }
    async onLoadComponentMoiGioi(custodycd) {
        let that = this
        await RestfulUtils.post('/fund/get_all_sale_rm', { OBJNAME: this.props.datapage.OBJNAME, custodycd: custodycd, language: this.props.currentLanguage })
            .then((res) => {
                that.state.listOptionSelect.SALEID = res.result
                that.setState({
                    dataMG: res.resultdata,
                    listOptionSelect: that.state.listOptionSelect
                })
            })
        this.getCurrentSale(custodycd)
        //console.log('dataMG from above :====', this.state.dataMG)
    }
    async onLoadComponentTKGD() {
        let that = this
        let i = 0;
        let tmp = [];
        let username = this.props.auth.user.USERNAME
        let fullname = ''
        let firstLoadUser = ''
        await RestfulUtils.post('/fund/fetchAccountList', { OBJNAME: this.props.datapage.OBJNAME, username: username, language: this.props.currentLanguage })
            .then((res) => {
                that.state.listOptionSelect.CUSTODYCD = res.DT.data
                that.state.defaultValueCustomer = this.props.auth.user.USERID
                if (this.state.isFirstLoad) {
                    that.state.CUSTODYCD = this.props.auth.user.USERID;
                    this.onLoadComponentMoiGioi(this.props.auth.user.USERID);

                }
                firstLoadUser = this.props.auth.user.USERID
                fullname = this.props.auth.user.TLFULLNAME
                that.setState({
                    defaultValueCustomer: this.props.auth.user.USERID,
                    p_fullname: fullname,
                    listOptionSelect: that.state.listOptionSelect
                })
            })
    }
    getCurrentSale(refacctno) {
        let { dataMG } = this.state
        console.log('dataMG:====', dataMG)
        let tmp = '';
        let result = {};
        let p_tlname = ''
        RestfulUtils.post('/fund/get_current_sale', { OBJNAME: this.props.datapage.OBJNAME, refacctno: refacctno, language: this.props.currentLanguage })
            .then((res) => {

                this.state.SALEID = res.resultdata[0].SALEID;
                this.state.currentSale = res.resultdata[0].SALEID;
                tmp = res.resultdata[0].SALEID;
                if (dataMG && dataMG.length > 0) {
                    result = dataMG.filter(item => item.SALEID == tmp)
                    //console.log('dataMG:====', dataMG)
                    console.log('result:====', result)
                    if (result && result.length > 0) {
                        p_tlname = result[0]["TLFULLNAME"]
                        this.setState({ p_tlname: result[0]["TLFULLNAME"] });
                    }
                }
                this.setState({
                    state: this.state
                })
            })
    }
    submitGroup() {
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }
        var { dispatch } = this.props;
        if (this.state.currentSale.localeCompare(this.state.SALEID) != 0) {
            RestfulUtils.post('/fund/insert_customerreg', { OBJNAME: this.props.datapage.OBJNAME, refacctno: this.state.CUSTODYCD, saleid_old: this.state.currentSale, saleid_new: this.state.SALEID, language: this.props.currentLanguage })
                .then((res) => {
                    if (res.EC == 0) {
                        datanotify.type = "success"
                        datanotify.content = this.props.strings.success;
                        dispatch(showNotifi(datanotify));
                        this.clearData();
                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                    }
                })
        }
        else {
            datanotify.type = "error";
            datanotify.content = this.props.strings.errorBroker;
            dispatch(showNotifi(datanotify));
        }
    }
    componentWillMount() {
        this.refresh();

    }

    refresh() {
        //this.onLoadComponentMoiGioi();
        this.onLoadComponentTKGD();
        //this.getCurrentSale (this.state.defaultValueCustomer);
    }

    onChangeSelectTKGD(type, e) {
        this.state.isFirstLoad = false;
        if (e) {
            this.state[type] = e.value;
            this.onLoadComponentMoiGioi(e.value)
            this.getCurrentSale(e.value);
            this.setState({ p_fullname: e.FULLNAME, CUSTODYCD: this.state.CUSTODYCD, state: this.state, p_refacctno: e.value, listOptionSelect: this.state.listOptionSelect });
        }
        else {
            this.state.isFirstLoad = true;
            this.state[type] = '';

            this.setState({
                state: this.state,
                listOptionSelect: this.state.listOptionSelect,
                CUSTODYCD: '',
                p_refacctno: '',
                p_fullname: ''
            });
        }
    }
    onChangeSelectMoiGioi(type, e) {
        let tmp = this.state.defaultValueCustomer
        if (this.state.isFirstLoad) {
            this.setState({ CUSTODYCD: tmp })
        }
        this.state.isFirstLoad = false;
        let { dataMG } = this.state
        let result = {};
        let dataMGrow = {};
        let p_tlname = '';
        if (e && dataMG && dataMG.length > 0) {
            result = dataMG.filter(item => item.SALEID == e.value)
            if (result && result.length > 0) {
                dataMGrow = result[0]
                p_tlname = result[0]["TLFULLNAME"]
                this.state[type] = e.value;
                this.setState({ dataMGrow: result[0], p_tlname: result[0]["TLFULLNAME"] });
            }
        }
        else {
            this.state[type] = '';
            this.refresh();
            this.setState({ state: this.state, listOptionSelect: this.state.listOptionSelect, dataMGrow: '', p_tlname: '' });
        }
    }
    clearData() {
        this.setState({
            state: this.state,
            listOptionSelect: this.state.listOptionSelect,
            CUSTODYCD: '',
            SALEID: '',
            p_refacctno: '',
            p_fullname: '',
            dataMGrow: '',
            p_tlname: ''
        });
    }

    render() {
        let money = this.state.p_avlamt
        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        let disableCustodycdBox = this.state.ISEDIT || isCustom;
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">
                <div className="add-info-account">
                    <div className="title-content">{this.props.strings.title}</div>
                    <div className="row col-md-8 col-md-push-2" style={{ paddingTop: "20px" }}>
                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5 className="highlight"><b>{this.props.strings.refacctno}</b></h5>
                            </div>
                            <div className="col-md-8 customSelect">
                                <Select.Async
                                    name="form-field-name"
                                    disabled={disableCustodycdBox}
                                    placeholder={this.props.strings.refacctno}
                                    loadOptions={this.getOptionsSelect.bind(this, 'CUSTODYCD')}
                                    options={this.state.listOptionSelect.CUSTODYCD}
                                    value={this.state.isFirstLoad ? this.state.defaultValueCustomer : this.state['CUSTODYCD']}
                                    defaultValue={this.state.defaultValueCustomer}
                                    backspaceRemoves={true}
                                    cache={false}
                                    clearable={true}
                                    onChange={this.onChangeSelectTKGD.bind(this, 'CUSTODYCD')}
                                    id="drdrefacctno"
                                    ref="txtrefacctno"
                                />
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5 ><b>{this.props.strings.fullname}</b></h5>
                            </div>
                            <div className="col-md-8">
                                <label className="form-control" id="lblFullname">{this.state.p_fullname}</label>
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5 className="highlight"><b>{this.props.strings.saleid}</b></h5>
                            </div>
                            <div className="col-md-8 customSelect">
                                <Select.Async className="form-field-name"
                                    name="form-field-name"
                                    placeholder={this.props.strings.placeholder}
                                    loadOptions={this.getOptionsSelect.bind(this, 'SALEID')}
                                    options={this.state.listOptionSelect.SALEID}
                                    cache={false}
                                    value={this.state.SALEID}
                                    backspaceRemoves={true}
                                    cache={false}
                                    clearable={true}
                                    onChange={this.onChangeSelectMoiGioi.bind(this, 'SALEID')}
                                    id="drdsaleid"
                                />
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5 ><b>{this.props.strings.tlname}</b></h5>
                            </div>
                            <div className="col-md-8">
                                <label className="form-control" id="lblTLNAME">{this.state.p_tlname}</label>
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="pull-right">
                                <input onClick={this.submitGroup.bind(this)} type="button" className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
KhachHangDangKyMoiGioi.defaultProps = {

};
const stateToProps = state => ({
    auth: state.auth,
    lang: state.language.language
});

const decorators = flow([
    connect(stateToProps),
    translate('KhachHangDangKyMoiGioi')
]);

module.exports = decorators(KhachHangDangKyMoiGioi);
