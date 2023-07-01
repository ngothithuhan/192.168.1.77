import React from 'react';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableDSXacNhanOTP from './components/TableDSXacNhanOTP'
import ModalDetail from './components/ModalDetail'


class DSXacNhanOTP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        showModalDetail:false,
        dataOTP:{

        },
        access:'add'
    };
  }
  showModalDetail(data){
    this.setState({...this.state,
        showModalDetail:true,
        access:data.OTPTYPE=="OPENCF"?'add':'edit',
        dataOTP:{...this.state.dataOTP,p_custodycd:data.CUSTODYCD,fullname:data.FULLNAME,idcode:data.IDCODE}
    })
  }
  confirmSuccess=()=>{
    this.setState({...this.state,showModalDetail:false})
  }
  closeModalDetail(){
    this.setState({...this.state,showModalDetail:false})
  }
  
  render() {

    let { datapage } = this.props
    return (
      <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

        <div className="title-content">{this.props.strings.title}</div>
        <div className="panel-body" >
          <TableDSXacNhanOTP datapage={datapage}
            showModalDetail={this.showModalDetail.bind(this)} 
            OBJNAME={datapage?datapage.OBJNAME:''}
            />
        </div>
        <ModalDetail confirmSuccess={this.confirmSuccess} OBJNAME={datapage?datapage.OBJNAME:''} title={this.props.strings.confirmtitle} dataOTP={this.state.dataOTP} access={this.state.access} showModalDetail={this.state.showModalDetail} closeModalDetail={this.closeModalDetail.bind(this)} />
        
      </div>
    )
  }
}
const stateToProps = state => ({
  veryfiCaptcha: state.veryfiCaptcha,
  notification: state.notification,
  language: state.language.language
});


const decorators = flow([
  connect(stateToProps),
  translate('DSXacNhanOTP')
]);

module.exports = decorators(DSXacNhanOTP);
