import React from 'react';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import NumberFormat from 'react-number-format'
import DropdownFactory from 'app/utils/DropdownFactory'

class TSLenhGD extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            AMOUNT: { value: 0, validate: null, tooltip: "Không được để trống !!" },
            AccHold: { value: 0, validate: null, tooltip: "Không được để trống !!" },
            selectedOption: '',
            datachange: {},
            phone: { value: '', validate: null, tooltip: "Không được để trống !!" },
            data: {
                vfmcodehold: 0,
                vfmamountmax: 0,
                vfmamountmin: 0,
                soldoutifodd: '',
                vfmswamountmin: 0,
                vfmswamountmax: 0,
                minswamt: 0,
            }

        }
    }
    componentWillMount() {
        if (this.props.data != "") {
            this.state.data["vfmcodehold"] = this.props.data.MQTTY
            this.state.data["vfmamountmax"] = this.props.data.MAXQTTY
            this.state.data["vfmamountmin"] = this.props.data.MINQTTY
            this.state.data["soldoutifodd"] = this.props.data.SELLFULLODD
            this.state.data["vfmswamountmin"] = this.props.data.SWMINQTTY
            this.state.data["vfmswamountmax"] = this.props.data.SWMAXQTTY
            this.state.data["minswamt"] = this.props.data.MINSWAMT
            
            this.setState({
                data: this.state.data
            })
        }
        else {
            this.state.data["vfmcodehold"] = this.props.datatest.vfmcodehold
            this.state.data["vfmamountmax"] = this.props.datatest.vfmamountmax
            this.state.data["vfmamountmin"] = this.props.datatest.vfmamountmin
            this.state.data["soldoutifodd"] = this.props.datatest.soldoutifodd
            this.state.data["vfmswamountmin"] = this.props.datatest.vfmswamountmin
            this.state.data["vfmswamountmax"] = this.props.datatest.vfmswamountmax
            this.state.data["minswamt"] = this.props.datatest.minswamt
            
            this.setState({
                data: this.state.data
            })
        }
    }
    onValueChange(type, data) {

        if (data.value == '' || data.value < 0)
            this.state.data[type] = 0
        else this.state.data[type] = data.value

        // this.state.data[type] = data.value.replace(/^0+/, '')
        this.setState({ data: this.state.data })
        this.props.onChange(this.state.data)
    }
    onChange(type, event) {
        let data = {};
        if (event.target) {

            this.state.data[type] = event.target.value;
        }
        else {
            this.state.data[type] = event.value;
        }
        this.setState({ data: this.state.data })
        this.props.onChange(this.state.data)
    }
    handleChange = (selectedOption) => {
        this.setState({ selectedOption });

    }
    onSetDefaultValue = (type, value) => {
        let that = this
        if (!this.state.data[type])
            this.state.data[type] = value

    }
    render() {
        let displayy = this.props.accessTSLenhGD == 'view' ? true : false
        const { selectedOption } = this.state;
        const value = selectedOption && selectedOption.value;
        return (
            <div className="col-md-12" style={{ paddingTop: "11px" }}>

                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="highlight" id="lblvfmcodehold"><b>{this.props.strings.vfmcodehold}</b></h5>
                    </div>
                    <div className="col-md-3">
                        <NumberFormat maxLength={21} disabled={displayy} allowNegative={false} className="form-control" id="txtVfmcodehold" value={this.state.data.vfmcodehold} onValueChange={this.onValueChange.bind(this, 'vfmcodehold')} prefix={''} placeholder={this.props.strings.phone} decimalScale={2} thousandSeparator={true} />
                    </div>
                    <div className="col-md-3">
                        <h5 className="highlight" id="lblsoldoutifodd"><b>{this.props.strings.soldoutifodd}</b></h5>
                    </div>
                    <div className="col-md-3 customSelect">
                        <DropdownFactory disabled={displayy} CDVAL={this.state.data.soldoutifodd} onSetDefaultValue={this.onSetDefaultValue} value="soldoutifodd" CDTYPE="SY" CDNAME="YESNO" onChange={this.onChange.bind(this)} ID="drdSoldoutifodd" />
                    </div>
                </div>

                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="" id="lblvfmamountmin"><b>{this.props.strings.vfmamountmin}</b></h5>
                    </div>
                    <div className="col-md-3">
                        <NumberFormat maxLength={21} disabled={displayy} allowNegative={false} className="form-control" id="txtVfmamountmin" value={this.state.data.vfmamountmin} onValueChange={this.onValueChange.bind(this, 'vfmamountmin')} prefix={''} placeholder={this.props.strings.phone} decimalScale={2} thousandSeparator={true} />
                    </div>
                    <div className="col-md-3">
                        <h5 className="" id="lblvfmamountmax"><b>{this.props.strings.vfmamountmax}</b></h5>
                    </div>
                    <div className="col-md-3">
                        <NumberFormat maxLength={21} disabled={displayy} allowNegative={false} className="form-control" id="txtVfmamountmax" value={this.state.data.vfmamountmax} onValueChange={this.onValueChange.bind(this, 'vfmamountmax')} prefix={''} placeholder={this.props.strings.phone} decimalScale={2} thousandSeparator={true} />
                    </div>
                </div>
                
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="highlight" id="lblvfmswamountmin"><b>{this.props.strings.vfmswamountmin}</b></h5>
                    </div>
                    <div className="col-md-3">
                        <NumberFormat maxLength={21} disabled={displayy} allowNegative={false} className="form-control" id="txtVfmswamountmin" value={this.state.data.vfmswamountmin} onValueChange={this.onValueChange.bind(this, 'vfmswamountmin')} prefix={''} placeholder={this.props.strings.phone} decimalScale={2} thousandSeparator={true} />                    
                    </div>
                    <div className="col-md-3">
                        <h5 className="highlight" id="lblvfmswamountmax"><b>{this.props.strings.vfmswamountmax}</b></h5>
                    </div>
                    <div className="col-md-3">
                        <NumberFormat maxLength={21} disabled={displayy} allowNegative={false} className="form-control" id="txtVfmswamountmax" value={this.state.data.vfmswamountmax} onValueChange={this.onValueChange.bind(this, 'vfmswamountmax')} prefix={''} placeholder={this.props.strings.phone} decimalScale={2} thousandSeparator={true} />
                    </div>
                </div>

                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="highlight" id="lblminswamt"><b>{this.props.strings.minswamt}</b></h5>
                    </div>
                    <div className="col-md-3">
                        <NumberFormat maxLength={21} disabled={displayy} allowNegative={false} className="form-control" id="txtMinswamt" value={this.state.data.minswamt} onValueChange={this.onValueChange.bind(this, 'minswamt')} prefix={''} placeholder={this.props.strings.phone} decimalScale={2} thousandSeparator={true} />                    
                    </div>
                </div>

            </div>
        )
    }

}

const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification
});


const decorators = flow([
    connect(stateToProps),
    translate('TSLenhGD')
]);

module.exports = decorators(TSLenhGD);
