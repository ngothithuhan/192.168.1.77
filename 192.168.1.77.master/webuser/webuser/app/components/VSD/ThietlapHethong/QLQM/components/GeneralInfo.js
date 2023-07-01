import React from 'react';
import {connect} from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import DateInput from 'app/utils/input/DateInput';
import DropdownFactory from 'app/utils/DropdownFactory'

class GeneralInfo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      AMOUNT: { value: 0, validate: null, tooltip: "Không được để trống !!" },
      AccHold: { value: 0, validate: null, tooltip: "Không được để trống !!" },
access:'add',
    datachange: {},
    datagroup:{
        p_CODEID:'', 
        p_SYMBOL:'',
        
        p_NAME:'', 
        p_NAMEVN:'', 
        p_NAME_EN:'', 
        p_LICENSENO:'', 
        p_LICENSEDATE:'', 
        p_LICENSEPLACE:'',
        p_PHONE:'', 
        p_FAX:'', 
        p_FUNDNAME:'', 
        p_SETTLEACCTNO:'',
        p_SETTLEBANK:'', 
        p_BLOCKACCTNO:'', 
        p_TAXCODE:'', 
        p_BLOCKBANK:'', 
        p_CCYCD:'', 
        p_LEGALPERSON:'', 
        p_LEGALPOSITION:'', 
        p_ADDRESS:'', 
        p_TAXADDR:'', 
        p_TAXNAME:'', 
        p_FTYPE:'', 
        pv_objname:'FundProduct',
        pv_language:this.props.lang,
        TSLenhGD:{
            vfmcodehold:'',
            vfmamountmax:'',
            vfmamountmin:'',
            vfxmin:'',
            vfxmax:'',
            vfmamountbuymin:'',
            vfmamountbuymax:'',
            soldoutifodd:'',
            vfmswamountmin:'',
            vfmswamountmax:'',
            chckodsip:'',
            firstodamt:'',
        },
        TGianGD:{
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
        },
     },
 
    }
  }
  componentWillMount(){
  
    if(this.props.data!=""){
        
      this.state.datagroup["p_SYMBOL"]=this.props.data.SYMBOL
      this.state.datagroup["p_FTYPE"]=this.props.data.FTYPE
      this.state.datagroup["p_NAME"]=this.props.data.NAME
      this.state.datagroup["p_NAMEVN"]=this.props.data.NAME_VN
      this.state.datagroup["p_NAME_EN"]=this.props.data.NAME_EN
      this.state.datagroup["p_LICENSENO"]=this.props.data.LICENSENO
      this.state.datagroup["p_LICENSEDATE"]=this.props.data.LICENSEDATE
      this.state.datagroup["p_LICENSEPLACE"]=this.props.data.LICENSEPLACE
      this.state.datagroup["p_SETTLEACCTNO"]=this.props.data.SETTLEACCTNO
      this.state.datagroup["p_SETTLEBANK"]=this.props.data.SETTLEBANK
      this.state.datagroup["p_BLOCKACCTNO"]=this.props.data.BLOCKACCTNO
      this.state.datagroup["p_BLOCKBANK"]=this.props.data.BLOCKBANK
      this.setState({
        datagroup:this.state.datagroup,
        access:'update'
    })
    }
   
    else{
        this.state.datagroup["p_FTYPE"]=this.props.datatest.p_FTYPE
        this.state.datagroup["p_SYMBOL"]=this.props.datatest.p_SYMBOL
        this.state.datagroup["p_NAME"]=this.props.datatest.p_NAME
        this.state.datagroup["p_NAMEVN"]=this.props.datatest.p_NAMEVN
        this.state.datagroup["p_NAME_EN"]=this.props.datatest.p_NAME_EN
        this.state.datagroup["p_LICENSENO"]=this.props.datatest.p_LICENSENO
        this.state.datagroup["p_LICENSEDATE"]=this.props.datatest.p_LICENSEDATE
        this.state.datagroup["p_LICENSEPLACE"]=this.props.datatest.p_LICENSEPLACE
        this.state.datagroup["p_SETTLEACCTNO"]=this.props.datatest.p_SETTLEACCTNO
        this.state.datagroup["p_SETTLEBANK"]=this.props.datatest.p_SETTLEBANK
        this.state.datagroup["p_BLOCKACCTNO"]=this.props.datatest.p_BLOCKACCTNO
        this.state.datagroup["p_BLOCKBANK"]=this.props.datatest.p_BLOCKBANK
        this.setState({
          datagroup:this.state.datagroup,
          access:'add'
      })
    }
   
  }
  componentDidMount(){
    window.$("#txtVfmcode").focus();
  }
  componentWillReceiveProps(nextProps) {

    let self = this;
 
    if (nextProps.access == "update"||nextProps.access == "view") {
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
            new_create:true
        })
}
  onValueChange(type, data) {
    
    this.state[type].value = data.value
    this.setState(this.state)
  }
  onChange(type, event) {
      let that=this
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
    this.setState({datagroup: this.state.datagroup})
    this.props.onChange(this.state.datagroup)
  }
  onSetDefaultValue = (type, value) => {
    if(!this.state.datagroup[type]){
      this.state.datagroup[type] = value
    }
      
       // this.props.onChange(this.state.datagroup)
}

    render(){
        let displayy=this.props.accessGeneralInfo=='view'?true:false
        return(
            
            <div className="col-md-12" style={{ paddingTop: "11px" }}>
            
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="highlight" id="lblvfmcode"><b>{this.props.strings.vfmcode}</b></h5>
                    </div>
                    <div className="col-md-9">
                        <input disabled={displayy} id="txtVfmcode" className="form-control" type="text" placeholder={this.props.strings.vfmcode}  value={this.state.datagroup["p_SYMBOL"]} onChange={this.onChange.bind(this, "p_SYMBOL")} maxLength={15}/>
                    </div>

                       {/* <div className="col-md-3">
                        <h5 className="highlight" id="lblvfmcodetype"><b>{this.props.strings.vfmcodetype}</b></h5>
                    </div>
                    <div className="col-md-3">
                    <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup.p_FTYPE} onSetDefaultValue={this.onSetDefaultValue} value="p_FTYPE" CDTYPE="SA" CDNAME="REFCODETYP" onChange={this.onChange.bind(this)} ID="drdvfmcodetype" />
                    </div> */}
                    {/*
                    <div className="col-md-3">
                        <h5 className="highlight"><b>{this.props.strings.vfmname}</b></h5>
                    </div>
                    <div className="col-md-3">
                        <input id="txtVfmname" className="form-control" type="text" placeholder={this.props.strings.vfmname}  value={this.state.datagroup["p_NAME"]} onChange={this.onChange.bind(this, "p_NAME")}/>
                    </div>
                    */}
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 className="highlight" id="lblvietnamesename"><b>{this.props.strings.vietnamesename}</b></h5>
                    </div>
                    <div className="col-md-9">
                        <input disabled={displayy} id="txtVietnamesename" className="form-control" type="text" placeholder={this.props.strings.vietnamesename}  value={this.state.datagroup["p_NAMEVN"]} onChange={this.onChange.bind(this, "p_NAMEVN")} maxLength={500}/>
                    </div>
                 
                </div>
                <div className="col-md-12 row">
                   
                    <div className="col-md-3">
                        <h5 className="highlight"  id="lblenglishname"><b>{this.props.strings.englishname}</b></h5>
                    </div>
                    <div className="col-md-9">
                        <input disabled={displayy} id="txtEnglishname" className="form-control" type="text" placeholder={this.props.strings.englishname}  value={this.state.datagroup["p_NAME_EN"]} onChange={this.onChange.bind(this, "p_NAME_EN")} maxLength={500}/>
                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 id="lblidcode" ><b>{this.props.strings.idcode}</b></h5>
                    </div>
                    <div className="col-md-3">
                        <input disabled={displayy} id="txtIdcode" className="form-control" type="text" placeholder={this.props.strings.idcode}  value={this.state.datagroup["p_LICENSENO"]} onChange={this.onChange.bind(this, "p_LICENSENO")} maxLength={50}/>
                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 id="lbliddate"><b>{this.props.strings.iddate}</b></h5>
                    </div>
                    <div className="col-md-3 fixWidthDatePickerForOthers">
                    <DateInput disabled={displayy} onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["p_LICENSEDATE"]} type="p_LICENSEDATE" id="txtIddate"/>
                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 id="lblidplace"><b>{this.props.strings.idplace}</b></h5>
                    </div>
                    <div className="col-md-3">
                    <input disabled={displayy} id="txtIdplace" className="form-control" type="text" placeholder={this.props.strings.idplace}  value={this.state.datagroup["p_LICENSEPLACE"]} onChange={this.onChange.bind(this, "p_LICENSEPLACE")} maxLength={200}/>
                    </div>
                    {/*
                    <div className="col-md-3">
                        <h5 ><b>{this.props.strings.bankaccno}</b></h5>
                    </div>
                    <div className="col-md-3">
                        <input className="form-control" type="text" placeholder={this.props.strings.bankaccno} id="txtBankaccno"  value={this.state.datagroup["p_SETTLEACCTNO"]} onChange={this.onChange.bind(this, "p_SETTLEACCTNO")}/>
                    </div>
                    */}
                </div>
                {/*
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 ><b>{this.props.strings.bankacc}</b></h5>
                    </div>
                    <div className="col-md-3">
                    <input className="form-control" type="text" placeholder={this.props.strings.bankacc} id="txtBankacc"  value={this.state.datagroup["p_SETTLEBANK"]} onChange={this.onChange.bind(this, "p_SETTLEBANK")}/>
                    </div>
                    <div className="col-md-3">
                        <h5><b>{this.props.strings.acchold}</b></h5>
                    </div>
                    <div className="col-md-3">
                    <input className="form-control" type="text" placeholder={this.props.strings.acchold} id="txtAcchold"  value={this.state.datagroup["p_BLOCKACCTNO"]} onChange={this.onChange.bind(this, "p_BLOCKACCTNO")}/>
                    </div>
                </div>
                <div className="col-md-12 row">
                    <div className="col-md-3">
                        <h5 ><b>{this.props.strings.bankacchold}</b></h5>
                    </div>
                    <div className="col-md-3">
                        <input className="form-control" type="text" placeholder={this.props.strings.bankacchold} id="txtBankacchold"  value={this.state.datagroup["p_BLOCKBANK"]} onChange={this.onChange.bind(this, "p_BLOCKBANK")}/>
                    </div>
               
                </div>
                */}


            </div>
        )
    }

}

const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang:state.language.language
  });


  const decorators = flow([
    connect(stateToProps),
    translate('GeneralInfo')
  ]);

  module.exports = decorators(GeneralInfo);
