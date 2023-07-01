import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import Select from 'react-select';
import NumberFormat from 'react-number-format';
import DropdownFactory from '../../../../../utils/DropdownFactory';

class ProductInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            access: 'add',
            datachange: {},
            datagroup: {
                p_spcode: '',
                p_codeid: '',
                p_sptype: '',
                p_methods: '',
                p_vsdspcode: '',
                p_minamt: 0,
                p_maxamt: 0,
                p_minqtty: 0,
                p_maxqtty: 0,
            },
            FUNDCODE: { label: '', value: '' },
        }
    }
    componentWillMount() {
        if (this.props.data && this.props.data != "") {
            this.state.datagroup["p_spcode"] = this.props.data.SPCODE
            this.state.datagroup["p_codeid"] = this.props.data.CODEID
            this.state.datagroup["p_sptype"] = this.props.data.SPTYPE
            this.state.datagroup["p_methods"] = this.props.data.METHODS
            this.state.datagroup["p_vsdspcode"] = this.props.data.VSDSPCODE
            this.state.datagroup["p_minamt"] = this.props.data.MINAMT
            this.state.datagroup["p_maxamt"] = this.props.data.MAXAMT
            this.state.datagroup["p_minqtty"] = this.props.data.MINQTTY
            this.state.datagroup["p_maxqtty"] = this.props.data.MAXQTTY

            let currFundcode = this.props.arrFundcode.filter(item => item.value == this.props.data.CODEID);

            this.setState({
                datagroup: this.state.datagroup,
                FUNDCODE: currFundcode && currFundcode.length > 0 ? currFundcode[0] : { label: '', value: '' },
                access: 'update'
            })
        }
        else {
            this.state.datagroup["p_spcode"] = this.props.datatest.p_spcode
            this.state.datagroup["p_codeid"] = this.props.datatest.p_codeid
            this.state.datagroup["p_sptype"] = this.props.datatest.p_sptype
            this.state.datagroup["p_methods"] = this.props.datatest.p_methods
            this.state.datagroup["p_vsdspcode"] = this.props.datatest.p_vsdspcode
            this.state.datagroup["p_minamt"] = this.props.datatest.p_minamt
            this.state.datagroup["p_maxamt"] = this.props.datatest.p_maxamt
            this.state.datagroup["p_minqtty"] = this.props.datatest.p_minqtty
            this.state.datagroup["p_maxqtty"] = this.props.datatest.p_maxqtty
            this.setState({
                datagroup: this.state.datagroup,
                access: 'add'
            })
        }

    }
    componentDidMount() {
        // window.$("#drdfundCode").focus();
    }
    componentWillReceiveProps(nextProps) {
        let self = this;
        if (nextProps.access == "update" || nextProps.access == "view") {
        }
        else
            this.setState({
                new_create: true
            })
    }
    onValueChange(type, data) {
        this.state[type].value = data.value
        this.setState(this.state)
    }
    onChange(type, event) {
        let that = this
        let data = {};
        if (event.target) {
            this.state.datagroup[type] = event.target.value;
        } else {
            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup })
        this.props.onChange(this.state.datagroup)
    }
    onSetDefaultValue = (type, value) => {
        if (!this.state.datagroup[type]) {
            this.state.datagroup[type] = value
            this.setState({ datagroup: this.state.datagroup });
            this.props.onChange(this.state.datagroup)
        }
    }
    onChangeDRDFactory = (type, e) => {
        this.state.datagroup[type] = e.value;
        this.setState({ datagroup: this.state.datagroup });
        this.props.onChange(this.state.datagroup);
        this.props.clearDataTradingCycleSIP();
    }
    onChangeFundCode(e) {
        if (e && this.state.datagroup["p_codeid"] != e.value) {
            this.state.datagroup["p_codeid"] = e.value;
            this.state.FUNDCODE = e;
            this.setState(this.state);
            this.props.onChange(this.state.datagroup)
        }
    }
    render() {
        let displayy = this.props.accessProductInfo == 'view' ? true : false
        let isSipProduct = this.state.datagroup['p_sptype'] === 'S';

        return (
            <div className="col-md-12" style={{ paddingTop: "11px" }}>
                {/* fundCode: "Mã quỹ" */}
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="highlight" id="lblfundCode"><b>{this.props.strings.fundCode}</b></h5>
                    </div>
                    <div className="col-md-9">
                        <Select
                            className="customSelect"
                            name="form-field-name"
                            options={this.props.arrFundcode}
                            value={this.state.FUNDCODE}
                            onChange={this.onChangeFundCode.bind(this)}
                            id="drdfundCode"
                            clearable={false}
                            placeholder={this.props.strings.fundCode}
                            disabled={displayy}
                        />
                    </div>
                </div>
                {/* productType: "Loại sản phẩm" */}
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="highlight" id="lblproductType"><b>{this.props.strings.productType}</b></h5>
                    </div>
                    <div className="col-md-9">
                        <DropdownFactory
                            CDVAL={this.state.datagroup['p_sptype']}
                            onSetDefaultValue={this.onSetDefaultValue}
                            value="p_sptype"
                            CDTYPE="SE"
                            CDNAME="NORS"
                            onChange={this.onChangeDRDFactory.bind(this)}
                            ID="drdPRODUCTTYPE"
                            disabled={displayy}
                        />
                    </div>
                </div>
                {/* SIPProductType: "Loại sản phẩm SIP" */}
                {isSipProduct && (
                    <Fragment>
                    <div className="col-md-12 row">
                        <div className="col-md-3">
                            <h5 className="highlight" id="lblsipproductType"><b>{this.props.strings.SIPProductType}</b></h5>
                        </div>
                        <div className="col-md-9">
                            <DropdownFactory
                                CDVAL={this.state.datagroup['p_methods']}
                                onSetDefaultValue={this.onSetDefaultValue}
                                value="p_methods"
                                CDTYPE="SA"
                                CDNAME="METHODS"
                                onChange={this.onChangeDRDFactory.bind(this)}
                                ID="drdSIPPRODUCTTYPE"
                                disabled={displayy}
                            />
                        </div>
                    </div>
                    </Fragment>
                )}
                {/* productID: "Mã sản phẩm", */}
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="highlight" id="lblproductID"><b>{this.props.strings.productID}</b></h5>
                    </div>
                    <div className="col-md-9">
                        <input disabled={displayy} id="txtproductID" className="form-control" type="text" placeholder={this.props.strings.productID} value={this.state.datagroup["p_vsdspcode"]} onChange={this.onChange.bind(this, "p_vsdspcode")} maxLength={500} />
                    </div>
                </div>
                {!isSipProduct && (
                    <Fragment>
                        {/* minBuyValue: "Giá trị đặt mua tối thiểu" */}
                        <div className="col-md-12 row">
                            <div className="col-md-3">
                                <h5 className="highlight" id="lblminBuyValue"><b>{this.props.strings.minBuyValue}</b></h5>
                            </div>
                            <div className="col-md-9">
                                <NumberFormat maxLength={21} disabled={displayy} allowNegative={false} className="form-control" id="txtminBuyValue" value={this.state.datagroup["p_minamt"]} onValueChange={this.onChange.bind(this, 'p_minamt')} prefix={''} decimalScale={2} thousandSeparator={true} placeholder={this.props.strings.minBuyValue} />
                            </div>
                        </div>
                        {/* maxBuyValue: "Giá trị đặt mua tối đa", */}
                        <div className="col-md-12 row">
                            <div className="col-md-3">
                                <h5 className="highlight" id="lblmaxBuyValue"><b>{this.props.strings.maxBuyValue}</b></h5>
                            </div>
                            <div className="col-md-9">
                                <NumberFormat maxLength={21} disabled={displayy} allowNegative={false} className="form-control" id="txtmaxBuyValue" value={this.state.datagroup["p_maxamt"]} onValueChange={this.onChange.bind(this, 'p_maxamt')} prefix={''} decimalScale={2} thousandSeparator={true} placeholder={this.props.strings.maxBuyValue} />
                            </div>
                        </div>
                    </Fragment>
                )}
                {/* minSellAmt: "Số lượng bán tối thiểu", */}
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="highlight" id="lblminSellAmt"><b>{this.props.strings.minSellAmt}</b></h5>
                    </div>
                    <div className="col-md-9">
                        <NumberFormat maxLength={21} disabled={displayy} allowNegative={false} className="form-control" id="txtminSellAmt" value={this.state.datagroup["p_minqtty"]} onValueChange={this.onChange.bind(this, 'p_minqtty')} prefix={''} decimalScale={2} thousandSeparator={true} placeholder={this.props.strings.minSellAmt} />
                    </div>
                </div>
                {/* maxSellAmt: "Số lượng bán tối đa", */}
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="highlight" id="lblmaxSellAmt"><b>{this.props.strings.maxSellAmt}</b></h5>
                    </div>
                    <div className="col-md-9">
                        <NumberFormat maxLength={21} disabled={displayy} allowNegative={false} className="form-control" id="txtmaxSellAmt" value={this.state.datagroup["p_maxqtty"]} onValueChange={this.onChange.bind(this, 'p_maxqtty')} prefix={''} decimalScale={2} thousandSeparator={true} placeholder={this.props.strings.maxSellAmt} />
                    </div>
                </div>
            </div>
        )
    }

}

const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language
});

const decorators = flow([
    connect(stateToProps),
    translate('ProductInfo')
]);

module.exports = decorators(ProductInfo);
