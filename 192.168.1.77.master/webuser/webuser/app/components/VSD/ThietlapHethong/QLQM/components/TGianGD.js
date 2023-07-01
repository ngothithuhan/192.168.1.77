import React from 'react';
import {connect} from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import DateInput from 'app/utils/input/DateInput';
import DropdownFactory from 'app/utils/DropdownFactory'
class TGianGD extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      AMOUNT: { value: 0, validate: null, tooltip: "Không được để trống !!" },
      AccHold: { value: 0, validate: null, tooltip: "Không được để trống !!" },
          selectedOption: '',
    datachange: {},
      CUSTODYCD: { value: '', label: '' },
      datagroup:{
        datecloseorderbook:'',
        timecloseorderbook:'',
        datereceivemoney:'',
        timedatereceivemoney:'',
        dateordermatch:'',
        timeordermatch:'',
        dateattribution:'',
        timeattribution:'',
        datepayment:'',
        timepayment:''

      }
   
    }
  }
  componentWillMount(){
    if(this.props.data!=""){
    this.state.datagroup["datecloseorderbook"]=this.props.data.CLSORDDAY
    this.state.datagroup["timecloseorderbook"]=this.props.data.CLSORDTIME
    this.state.datagroup["datereceivemoney"]=this.props.data.RBANKDAY
    this.state.datagroup["timedatereceivemoney"]=this.props.data.RBANKTIME
    this.state.datagroup["dateordermatch"]=this.props.data.MATCHDAY
    this.state.datagroup["timeordermatch"]=this.props.data.MATCHTIME
    this.state.datagroup["dateattribution"]=this.props.data.EXECDAY
    this.state.datagroup["timeattribution"]=this.props.data.EXECTIME
    this.state.datagroup["datepayment"]=this.props.data.EXECMONNEYD
    this.state.datagroup["timepayment"]=this.props.data.EXECMONNEYT
    this.setState({
      datagroup:this.state.datagroup
  })
}
else{
    this.state.datagroup["datecloseorderbook"]=this.props.datatest.datecloseorderbook
    this.state.datagroup["timecloseorderbook"]=this.props.datatest.timecloseorderbook
    this.state.datagroup["datereceivemoney"]=this.props.datatest.datereceivemoney
    this.state.datagroup["timedatereceivemoney"]=this.props.datatest.timedatereceivemoney
    this.state.datagroup["dateordermatch"]=this.props.datatest.dateordermatch
    this.state.datagroup["timeordermatch"]=this.props.datatest.timeordermatch
    this.state.datagroup["dateattribution"]=this.props.datatest.dateattribution
    this.state.datagroup["timeattribution"]=this.props.datatest.timeattribution
    this.state.datagroup["datepayment"]=this.props.datatest.datepayment
    this.state.datagroup["timepayment"]=this.props.datatest.timepayment
    this.setState({
      datagroup:this.state.datagroup
  })
}
}
  onValueChange(type, data) {
  
    this.state[type].value = data.value
    this.setState(this.state)
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
    this.props.onChange(this.state.datagroup)
}
    handleChange = (selectedOption) => {
      this.setState({ selectedOption });
      
    }
    onSetDefaultValue = (type, value) => {
        if(!this.state.datagroup[type]){
            if(type=='datepayment') this.state.datagroup[type] = '3'
            else if(type=='dateordermatch') this.state.datagroup[type] = '0'
            else if(type=='dateattribution') this.state.datagroup[type] = '1'
            else   this.state.datagroup[type] = value
        }
          
            this.props.onSetDefaultValue(type, value)
    }
  

    onChangeTime(type, event) {
  
        this.state.datagroup[type] = event.value;
        this.setState({datagroup: this.state.datagroup})
        this.props.onChange(this.state.datagroup)
      }
    render(){
      const { selectedOption } = this.state;
     const value = selectedOption && selectedOption.value;
     let displayy=this.props.accessTGianGD=='view'?true:false
        return(
            <div className="col-md-12" style={{ paddingTop: "11px" }}>

                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="highlight" id="lblcloseorderbook"><b>{this.props.strings.closeorderbook}</b></h5>
                    </div>
                    <div className="col-md-3">
                    <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup.datecloseorderbook} onSetDefaultValue={this.onSetDefaultValue} value="datecloseorderbook" CDTYPE="SA" CDNAME="CLEARDATE" onChange={this.onChange.bind(this)} ID="drdCloseorderbook" />
                    </div>
                    <div className="col-md-3">
                        <h5 className="highlight" id="lbldatecloseorderbook"><b>{this.props.strings.datecloseorderbook}</b></h5>
                    </div>
                    <div className="col-md-3 fixWidthDatePickerForOthers">
                    <DateInput disabled={displayy} isTime={true} id="txttimecloseorderbook" value={this.state.datagroup["timecloseorderbook"]} handleChange={this.onChangeTime.bind(this)} type="timecloseorderbook"/>
                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="" id="lbldatereceivemoney"><b>{this.props.strings.datereceivemoney}</b></h5>
                    </div>
                    <div className="col-md-3">
                    <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup.datereceivemoney} onSetDefaultValue={this.onSetDefaultValue} value="datereceivemoney" CDTYPE="SA" CDNAME="CLEARDATE" onChange={this.onChange.bind(this)} ID="drdDatereceivemoney" />
                    </div>
                    <div className="col-md-3">
                        <h5 id="lbltimedatereceivemoney"><b>{this.props.strings.timedatereceivemoney}</b></h5>
                    </div>
                    <div className="col-md-3 fixWidthDatePickerForOthers">
                    <DateInput disabled={displayy} isTime={true} id="txtTimedatereceivemoney" value={this.state.datagroup["timedatereceivemoney"]} handleChange={this.onChangeTime.bind(this)} type="timedatereceivemoney"/>

                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="highlight" id="lbldateordermatch"><b>{this.props.strings.dateordermatch}</b></h5>
                    </div>
                    <div className="col-md-3">
                    <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup.dateordermatch} onSetDefaultValue={this.onSetDefaultValue} value="dateordermatch" CDTYPE="SA" CDNAME="CLEARDATE" onChange={this.onChange.bind(this)} ID="drdDateordermatch" />
                    </div>
                    <div className="col-md-3">
                        <h5 id="lbltimeordermatch"><b>{this.props.strings.timeordermatch}</b></h5>
                    </div>
                    <div className="col-md-3 fixWidthDatePickerForOthers">
                    <DateInput disabled={displayy} isTime={true} id="txtTimeordermatch" value={this.state.datagroup["timeordermatch"]} handleChange={this.onChangeTime.bind(this)} type="timeordermatch"/>

                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="highlight" id="lbldateattribution"><b>{this.props.strings.dateattribution}</b></h5>
                    </div>
                    <div className="col-md-3">
                    <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup.dateattribution} onSetDefaultValue={this.onSetDefaultValue} value="dateattribution" CDTYPE="SA" CDNAME="CLEARDATE" onChange={this.onChange.bind(this)} ID="drdDateattribution" />
                    </div>
                    <div className="col-md-3">
                        <h5 className="" id="lbltimeattribution"><b>{this.props.strings.timeattribution}</b></h5>
                    </div>
                    <div className="col-md-3 customSelect fixWidthDatePickerForOthers">
                    <DateInput disabled={displayy} isTime={true} id="txtTimeattribution" value={this.state.datagroup["timeattribution"]} handleChange={this.onChangeTime.bind(this)} type="timeattribution"/>

                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 id="lbldatepayment"><b>{this.props.strings.datepayment}</b></h5>
                    </div>
                    <div className="col-md-3">
                    <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup.datepayment} onSetDefaultValue={this.onSetDefaultValue} value="datepayment" CDTYPE="SA" CDNAME="CLEARDATE" onChange={this.onChange.bind(this)} ID="drdDatepayment" />
                    </div>
                    <div className="col-md-3">
                        <h5 id="lbltimepayment"><b>{this.props.strings.timepayment}</b></h5>
                    </div>
                    <div className="col-md-3 fixWidthDatePickerForOthers">
                    <DateInput disabled={displayy} isTime={true} id="txtTimepayment" value={this.state.datagroup["timepayment"]} handleChange={this.onChangeTime.bind(this)} type="timepayment"/>

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
    translate('TGianGD')
  ]);

  module.exports = decorators(TGianGD);
