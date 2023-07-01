import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import {connect} from 'react-redux'
class ButtonEdit extends React.Component{
    onClick(){
        this.props.onClick()
    }
    render(){
        let ISEDIT = 'N'
        if(this.props.data)
          ISEDIT  = this.props.data.ISEDIT;
        if(ISEDIT=="Y"){
          return <button style={this.props.style} className="btn btn-primary" onClick={this.onClick.bind(this)} id={this.props.id}><span className="glyphicon glyphicon-pencil"></span> {this.props.strings.edit}</button>
        }
        else{
          return   null         
        }
    }
}
ButtonEdit.defaultProps = {
    
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
      
module.exports = decorators(ButtonEdit);