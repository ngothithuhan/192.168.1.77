import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import {connect} from 'react-redux'
class ButtonCancel extends React.Component{
    onClick(){
        this.props.onClick()
    }
    render(){
       let ISAPPROVE='N'
        if(this.props.data)
           ISAPPROVE = this.props.data.ISAPPROVE;
        if(ISAPPROVE=="Y"){
          return <button style={this.props.style} className="btn btn-default" onClick={this.onClick.bind(this)} id={this.props.id}><span className="glyphicon glyphicon-minus"></span> {this.props.strings.delay}</button>
        }
        else{
           return null
        }
    }
}
ButtonCancel.defaultProps = {
    
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
      
module.exports = decorators(ButtonCancel);