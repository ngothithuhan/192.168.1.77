import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import {connect} from 'react-redux'
class ButtonDelete extends React.Component{
    onClick(){
        this.props.onClick()
    }
    componentWillReceiveProps(nextProps){
      if(nextProps.data){

        
      }
    }
    render(){
       let ISDELETE = 'N'
        //  console.log('delete ',this.props.data.ISDELETE)
        if(this.props.data)
          ISDELETE = this.props.data.ISDELETE;
        if(ISDELETE=="Y"){
          return <button style={this.props.style} disabled={this.props.disabled} className="btn btn-danger" onClick={this.onClick.bind(this)} id={this.props.id}><span className="glyphicon glyphicon-remove"></span> {this.props.strings.delete}</button>
        }
        else{
          return  null
        }
    }
}
ButtonDelete.defaultProps = {
    
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
      
module.exports = decorators(ButtonDelete);