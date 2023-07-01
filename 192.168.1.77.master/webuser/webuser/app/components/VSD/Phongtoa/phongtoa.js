import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils'
import Select from 'react-select'
import { showNotifi } from 'app/action/actionNotification.js';
class phongtoa extends React.Component {
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
      CUSTID_VIEW: -1,
      access: "add",
      AccountInfo:{},
      CUSTODYCD: { value: '', label: '' },
      datagroup:{
        p_desc:''
      },
      checkFields: [

        { name: "CUSTODYCD", id: "cbCUSTODYCD" },
     

    ],
      
    };
  }


  getOptions(input) {
    return RestfulUtils.post('/account/search_all', { key: input })
      .then((res) => {
      
        return { options: res }
      })
  }
  async onChange(e) {

    var self = this;
    if (e) {
      this.getInforAccount(e.label);
     
      // RestfulUtils.post('/balance/getFundBalance', { CUSTODYCD: e.value, CODEID: '' });
    }
    else {
      this.setState({ AccountInfo: {} });
    }
    this.setState({ CUSTODYCD: e });
  }
  getInforAccount(CUSTODYCD) {
    let self = this
    RestfulUtils.post('/account/get_generalinfor', { CUSTODYCD: CUSTODYCD , OBJNAME: this.props.datapage.OBJNAME }).then((resData) => {
     
      if (resData.EC == 0) {
        self.setState({ AccountInfo: resData.DT });
      } else {
        self.setState({ AccountInfo: {} });
      }
    });
  }
  checkValid(name, id) {
    let value = this.state.AccountInfo[name];
    //console.log(value)
    let mssgerr = '';
    switch (name) {

        case "CUSTODYCD":
            if (value == '' || value==undefined) {
                mssgerr = this.props.strings.requiredcustodycd;
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


    var { dispatch } = this.props;
    var datanotify = {
        type: "",
        header: "",
        content: ""

    }
    
 let data={
  p_custodycd:this.state.AccountInfo.CUSTODYCD,
  p_acctno:this.state.AccountInfo.CUSTID,
  p_desc:this.state.datagroup.p_desc,
  p_language:this.props.lang,
  pv_objname:this.props.datapage.OBJNAME
 }

 RestfulUtils.posttrans('/fund/blockafmast', data)
        .then(async(res) => {
            
            if (res.EC == 0) {
                datanotify.type = "success";
                datanotify.content = this.props.strings.success;
               
                await   setTimeout(dispatch(showNotifi(datanotify)),2000);
                window.location.href='/TRANSACTIONS'
             
               
            } else {
                datanotify.type = "error";
                datanotify.content = res.EM;
                dispatch(showNotifi(datanotify));
            }

        })
      }

}

 
onChangevalue(type, event) {

  if (event.target) {

      this.state.datagroup[type] = event.target.value;
  }
  else {
      this.state.datagroup[type] = event.value;
  }
  this.setState({ datagroup: this.state.datagroup })
}
  render() {

    return (
      <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">
        <div className="add-info-account">

          <div className="title-content">{this.props.strings.title}</div>

          <div className="col-md-12" style={{ paddingTop: "11px" }}>

            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5 className="highlight"><b>{this.props.strings.custodycd}</b></h5>
              </div>
              <div className="col-md-3 customSelect">
              <Select.Async
                    name="form-field-name"
                    disabled={this.state.ISEDIT}
                    placeholder={this.props.strings.custodycd}
                    loadOptions={this.getOptions.bind(this)}
                    value={this.state.CUSTODYCD}
                    onChange={this.onChange.bind(this)}
                    id="cbCUSTODYCD"
                  />                                </div>
            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5><b>{this.props.strings.fullname}</b></h5>
              </div>
              <div className="col-md-9">
                <label className="form-control" id="lblFullname" >{this.state.AccountInfo.FULLNAME}</label>
              </div>
            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5><b>{this.props.strings.idcode}</b></h5>
              </div>
              <div className="col-md-3">
                <label className="form-control" id="lblIdcode">{this.state.AccountInfo.IDCODE}</label>
              </div>
            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5><b>{this.props.strings.iddate}</b></h5>
              </div>
              <div className="col-md-3">
                <label className="form-control" id="lblIddate">{this.state.AccountInfo.IDDATE}</label>
              </div>
            </div>

            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5><b>{this.props.strings.idplace}</b></h5>
              </div>
              <div className="col-md-3">
                <label className="form-control" id="lblIdplace">{this.state.AccountInfo.IDPLACE}</label>
              </div>
            </div>
            <div className="col-md-12 row">
              <div className="col-md-3">
                <h5><b>{this.props.strings.desc}</b></h5>
              </div>
              <div className="col-md-9">
                <input maxLength={1000} className="form-control" type="text" placeholder={this.props.strings.desc} id="txtDesc" value={this.state.datagroup["p_desc"]} onChange={this.onChangevalue.bind(this, "p_desc")} />
              </div>
            </div>
            <div className="col-md-12 row">
              <div className="pull-right">
                <input type="button" className="btn btn-primary" style={{ marginLeft: 0, marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" onClick={this.submitGroup.bind(this)}/>
              </div>
            </div>
          </div>




        </div>
      </div>


    )
  }
}
phongtoa.defaultProps = {

  strings: {
    title: 'Phong tỏa tài khoản'

  },


};
const stateToProps = state => ({
  lang:state.language.language
});


const decorators = flow([
  connect(stateToProps),
  translate('phongtoa')
]);

module.exports = decorators(phongtoa);
