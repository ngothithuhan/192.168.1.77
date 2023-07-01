import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import {connect} from 'react-redux'
class ButtonAdd extends React.Component{
    onClick(){
        this.props.onClick()
    }
  
  
    render(){
        let IsAdd = 'N'
        if(this.props.data){
          IsAdd = this.props.data.ISADD;
        }
        if(IsAdd=="Y"){
           return  <button style={this.props.style} className="btn btn-primary" disabled={this.props.disabled} onClick={this.onClick.bind(this)} id={this.props.id}><span className="glyphicon glyphicon-plus-sign" ></span> {this.props.strings.create}</button>
        }
        else{
           return  null
        }
    }
}
ButtonAdd.defaultProps = {
    
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
      
module.exports = decorators(ButtonAdd);