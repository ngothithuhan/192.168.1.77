import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import {connect} from 'react-redux'
class ButtonApprove extends React.Component{
    onClick(){
        this.props.onClick()
    }
    render(){
       let ISAPPROVE = 'N'
        if(this.props.data)
           ISAPPROVE = this.props.data.ISAPPROVE;
        if(ISAPPROVE=="Y"){
         return  <button style={this.props.style} className="btn btn-primary" onClick={this.onClick.bind(this)} id={this.props.id}><span className="glyphicon glyphicon-ok" ></span> {this.props.strings.approve}</button>
        }
        else{
          return  null
        }
    }
}
ButtonApprove.defaultProps = {
    
        strings: {
          create:'Thêm',
          edit:'Sửa',
          delete:'Hủy',
          approve:'Duyệt',
          delay:'Từ chối'
         
        },
    }
    const stateToProps = state => ({
       
      });
      
      
      const decorators = flow([
        connect(stateToProps),
        translate('ButtonSystem')
      ]);
      
module.exports = decorators(ButtonApprove);