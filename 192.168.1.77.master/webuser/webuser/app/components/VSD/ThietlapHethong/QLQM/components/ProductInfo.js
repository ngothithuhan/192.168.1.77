import React from 'react';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import DateInput from 'app/utils/input/DateInput';
import DropdownFactory from 'app/utils/DropdownFactory'

class ProductInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            AMOUNT: { value: 0, validate: null, tooltip: "Không được để trống !!" },
            AccHold: { value: 0, validate: null, tooltip: "Không được để trống !!" },
            access: 'add',
            datachange: {},
            datagroup: {
                p_BANKACCTNO: '',
                p_BANKACCTNOSIP: '',
                p_VSDSPCODE: '',
                p_VSDSPCODESIP: ''
            },

        }
    }
    componentWillMount() {

        if (this.props.data != "") {
            this.state.datagroup["p_BANKACCTNO"] = this.props.data.BANKACCTNO
            this.state.datagroup["p_BANKACCTNOSIP"] = this.props.data.BANKACCTNOSIP
            this.state.datagroup["p_VSDSPCODE"] = this.props.data.VSDSPCODE
            this.state.datagroup["p_VSDSPCODESIP"] = this.props.data.VSDSPCODESIP

            this.setState({
                datagroup: this.state.datagroup,
                access: 'update'
            })
        }

        else {
            this.state.datagroup["p_BANKACCTNO"] = this.props.datatest.p_BANKACCTNO
            this.state.datagroup["p_BANKACCTNOSIP"] = this.props.datatest.p_BANKACCTNOSIP
            this.state.datagroup["p_VSDSPCODE"] = this.props.datatest.p_VSDSPCODE
            this.state.datagroup["p_VSDSPCODESIP"] = this.props.datatest.p_VSDSPCODESIP

            this.setState({
                datagroup: this.state.datagroup,
                access: 'add'
            })
        }

    }
    componentDidMount() {
        window.$("#txtVfmcode").focus();
    }
    componentWillReceiveProps(nextProps) {

        let self = this;

        if (nextProps.access == "update" || nextProps.access == "view") {
            this.setState({
                display: {
                    fatca: true,
                    authorize: true,
                    upload: true,
                    quydangki: true
                }
            })
        }
        else
            this.setState({
                display: {
                    fatca: false,
                    authorize: false,
                    upload: false,
                    quydangki: false,

                },
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
        }
        else {

            this.state.datagroup[type] = event.value;
        }

        this.setState({ datagroup: this.state.datagroup })
        this.props.onChange(this.state.datagroup)
    }
    onChangeDate(type, event) {

        this.state.datagroup[type] = event.value;
        this.setState({ datagroup: this.state.datagroup })
        this.props.onChange(this.state.datagroup)
    }
    onSetDefaultValue = (type, value) => {
        if (!this.state.datagroup[type]) {
            this.state.datagroup[type] = value
        }

        // this.props.onChange(this.state.datagroup)
    }

    render() {
        let displayy = this.props.accessProductInfo == 'view' ? true : false
        return (

            <div className="col-md-12" style={{ paddingTop: "11px" }}>
                {/* <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="" id="lblbankacctno"><b>{this.props.strings.bankacctno}</b></h5>
                    </div>
                    <div className="col-md-9">
                        <input disabled={displayy} id="txtbankacctno" className="form-control" type="text" placeholder={this.props.strings.bankacctno} value={this.state.datagroup["p_BANKACCTNO"]} onChange={this.onChange.bind(this, "p_BANKACCTNO")} maxLength={500} />
                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="" id="lblbankacctnosip"><b>{this.props.strings.bankacctnosip}</b></h5>
                    </div>
                    <div className="col-md-9">
                        <input disabled={displayy} id="txtbankacctnosip" className="form-control" type="text" placeholder={this.props.strings.bankacctnosip} value={this.state.datagroup["p_BANKACCTNOSIP"]} onChange={this.onChange.bind(this, "p_BANKACCTNOSIP")} maxLength={500} />
                    </div>
                </div> */}
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="" id="lblvsdspcode"><b>{this.props.strings.vsdspcode}</b></h5>
                    </div>
                    <div className="col-md-9">
                        <input disabled={displayy} id="txtvsdspcode" className="form-control" type="text" placeholder={this.props.strings.vsdspcode} value={this.state.datagroup["p_VSDSPCODE"]} onChange={this.onChange.bind(this, "p_VSDSPCODE")} maxLength={500} />
                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="" id="lblvsdspcodesip"><b>{this.props.strings.vsdspcodesip}</b></h5>
                    </div>
                    <div className="col-md-9">
                        <input disabled={displayy} id="txtvsdspcodesip" className="form-control" type="text" placeholder={this.props.strings.vsdspcodesip} value={this.state.datagroup["p_VSDSPCODESIP"]} onChange={this.onChange.bind(this, "p_VSDSPCODESIP")} maxLength={500} />
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
