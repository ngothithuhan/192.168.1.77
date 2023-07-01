import React from 'react';
import {connect} from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableCapNhatTTLenhManual from './components/TableCapNhatTTLenhManual'
import ModalDetailCapNhatTTLenhManual from './components/ModalDetailCapNhatTTLenhManual'

class CapNhatTTLenhManual extends React.Component {
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
          DATA:{}
        };
    }
    createSuccess(access){
        this.setState({access:access})
      }
    closeModalDetail() {
        this.setState({ showModalDetail: false })
    }
    showModalDetail(access,DATAUPDATE) {
        let titleModal = ""
        let DATA=""

        switch(access){
           case "add" : titleModal = this.props.strings.modaladd; break
           case "update": titleModal = this.props.strings.modaledit; break;
           case "view" : titleModal = "Xem chi tiết"; break
        }
        if(DATAUPDATE!=undefined){
            DATA = DATAUPDATE
         }
        this.setState({ showModalDetail: true, titleModal: titleModal,access:access,DATA:DATA })
      }
    render(){
        let datapage = {ISADD:"Y",ISDELETE:"Y",ISAPPROVE:"Y"}
        return(
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

                <div className="title-content">{this.props.strings.title}</div>
                <div className="panel-body" >
                    <TableCapNhatTTLenhManual  datapage={datapage}
                                        showModalDetail={this.showModalDetail.bind(this)} />
                </div>
                <ModalDetailCapNhatTTLenhManual  createSuccess={this.createSuccess.bind(this)}
                        access={this.state.access}
                        DATA={this.state.DATA}
                        title={this.state.titleModal}
                        showModalDetail={this.state.showModalDetail}
                        closeModalDetail={this.closeModalDetail.bind(this)} />
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
    translate('CapNhatTTLenhManual')
  ]);

  module.exports = decorators(CapNhatTTLenhManual);
