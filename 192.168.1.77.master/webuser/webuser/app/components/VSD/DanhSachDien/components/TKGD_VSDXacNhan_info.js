import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import {connect} from 'react-redux'
import axios from 'axios';
import { showNotifi } from 'app/action/actionNotification.js';

 class TKGD_VSDXacNhan_info1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: {
        general: true,
        authorize: true,
        fatca: false
      },
      showModalDetail: false,
      titleModal: 'Taọ tài khoản',
      CUSTID_VIEW:-1,
      access:"add",
      phone: { value: '', validate: null, tooltip: "Không được để trống !!" },
      datauser:{
       // p_tlid:'',
        p_tlname:'',
        p_tlfullname:'',
        p_mbid:'',
        p_brid:'ALL',
        p_department:'',
        p_tltitle:'',
        p_idcode:'',
        p_mobile:'',
        p_email:'',
        p_active:'',
        p_description:'',
       // pv_action:'C',
        pv_language:'VN',
      }
    };
  }
  onSetDefaultValue = (type,value) => {
    if(!this.state.datauser[type])
    this.state.datauser[type]= value
  }
  onChange(type,event) {
    let data = { };
      if(event.target){
          this.state.datauser[type]=event.target.value;
      }
      else{
            this.state.datauser[type]=event.value;
          }
          this.setState({ datauser: this.state.datauser })
 
     

 }

 onValueChange(type, data) {
  
  this.state[type].value = data.value
  this.state.datauser['p_mobile']=data.value
  this.setState(this.state)
}
  getData(){
    
    this.state.datauser.p_mobile = this.state.phone.value
    this.setState({datauser:this.state.datauser})
  }
  async Add(){
    var { dispatch } = this.props;
    var datanotify = {
      type: "",
      header: "",
      content: ""

    }

     let data =  await this.getData()
      axios.post('/user/add',this.state.datauser)
      .then((res)=>{
        if(res.data.EC==0) {
          datanotify.type = "success";
          datanotify.content = "Thành công";
          dispatch(showNotifi(datanotify));
          //this.setState({ err_msg: "Thêm mới user thành công" })
        }else{
          datanotify.type = "error";
          datanotify.content = "Thất bại";
          dispatch(showNotifi(datanotify));
        }

      })
   

  }

  async submitUser  () {
    var api = '/user/add';
    if (this.props.DATA.TLID) {
        api = '/user/update';
    }
    var { dispatch } = this.props;
    var datanotify = {
      type: "",
      header: "",
      content: ""

    }
      axios.post(api,this.state.datauser)
      .then((res)=>{
        if(res.data.EC==0) {
          datanotify.type = "success";
          datanotify.content = "Thành công";
          dispatch(showNotifi(datanotify));
          //this.setState({ err_msg: "Thêm mới user thành công" })
          
        }else{
          datanotify.type = "error";
          datanotify.content = res.data.EM;
          dispatch(showNotifi(datanotify));
        }

      })

}

  componentDidMount(){
    if(this.props.DATA)
    {
     
      
    this.setState({ 
      datauser:{
        p_tlid:this.props.DATA.TLID,
        p_tlname:this.props.DATA.TLNAME,
        p_tlfullname:this.props.DATA.TLFULLNAME,
        p_mbid:this.props.DATA.P_MBID,
        p_brid:this.props.DATA.P_BRID,
        p_department:this.props.DATA.DEPARTMENT,
        p_tltitle:this.props.DATA.TLTITLE,
        p_idcode:this.props.DATA.IDCODE,
        p_mobile:this.props.DATA.MOBILE,
        p_email:this.props.DATA.EMAIL,
        p_active:this.props.DATA.ACTIVE,
        p_description:this.props.DATA.DESCRIPTION,
        pv_tlid:'0003',
        pv_language:'VN',

    }
  })
  if(this.props.DATA.MOBILE!=undefined)
  this.setState({ phone: { value: this.props.DATA.mobile, validate: null, tooltip: "Không được để trống !!" },})
}

  }
  onChange(type, event) {
    this.state.datachange[type] = event.value;
    this.setState({datachange: this.state.datachange})
  }
  render() {
     
    return (


      <div  className="add-info-account">



          <div className="col-md-12" style={{ paddingTop: "11px" }}>

                                <div className="col-md-12 row">
                                {/*
                                  <div className="col-md-3">
                                  <h5 className="highlight"><b>{this.props.strings.custid}</b></h5>
                                  </div>
                                  <div className="col-md-3">
                                    <input className="form-control" type="text" placeholder={this.props.strings.custid}  value={this.state.datauser["p_tlid"]} onChange={this.onChange.bind(this,"p_tlid")}/>
                                  </div>
                                */}
                                    <div className="col-md-3">
                                    <h5 className="highlight"><b>{this.props.strings.custodycd}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                    <label className="form-control" id="lblCustodycd"></label>

                                    </div>
                                    <div className="col-md-3">
                                    <h5 className="highlight"><b>{this.props.strings.opendate}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                    <label className="form-control" id="lblOpendate"></label>
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                    <h5 className="highlight"><b>{this.props.strings.fullname}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                    <label className="form-control" id="lblFullname"></label>
                                    </div>
                                    <div className="col-md-3">
                                    <h5 className="highlight"><b>{this.props.strings.idcode}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                    <label className="form-control" id="lblIdcode"></label>
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                    <h5 className="highlight"><b>{this.props.strings.iddate}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                    <label className="form-control" id="lblIddate"></label>
                                    </div>
                                    <div className="col-md-3">
                                    <h5 className="highlight"><b>{this.props.strings.idplace}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                    <label className="form-control" id="lblIdplace"></label>
                                    </div>
                                </div>

                           
                           
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                    <h5><b>{this.props.strings.address}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                    <label className="form-control" id="lblAddress"></label>
                                    </div>
                                

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                    <h5><b>{this.props.strings.note}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                    <input className="form-control" id="txtNote" type="text" placeholder={this.props.strings.note}  value={this.state.datauser["p_description"]} onChange={this.onChange.bind(this,"p_description")}/>
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                  <div className="pull-right">
                                  <input type="button"  className="btn btn-primary" style={{marginLeft:0,marginRight:5}} value="Chấp nhận" onClick={this.submitUser.bind(this)} id="btnSubmit"/>
                                
                                  </div>
                                </div>
                            </div>


  </div>
    )
  }
}
TKGD_VSDXacNhan_info1.defaultProps = {

  strings: {
    title:'Tạo mới User'

  },


};
const stateToProps = state => ({

});


const decorators = flow([
  connect(stateToProps),
  translate('TKGD_VSDXacNhan_info1')
]);

module.exports = decorators(TKGD_VSDXacNhan_info1);
