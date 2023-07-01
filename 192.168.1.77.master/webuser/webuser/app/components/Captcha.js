import Recaptcha from 'react-captcha';
import React from 'react';
import {connect} from 'react-redux';
// create a variable to store the component instance
// var Gcaptcha = require('react-gcaptcha');
// var Recaptcha = require('react-recaptcha');
class Captcha extends React.Component{

  getCaptchaResponse(value){
    console.log(value);
    var {dispatch} = this.props;
    dispatch({type: 'Success'});
  }
  onScriptError(){
    console.log('sss');
  }
 render(){

   return(
      <div >

      <Recaptcha
          sitekey = '6Leqq0sUAAAAAAAs4RZIvnZQIm4uBRMvSaNnKMOE'
          lang = 'en'
          theme = 'white'
          type = 'image'
          onScriptError ={this.onScriptError}
          callback = {this.getCaptchaResponse.bind(this)}/>


      </div>
    )
  }

}


module.exports =connect()(Captcha);
