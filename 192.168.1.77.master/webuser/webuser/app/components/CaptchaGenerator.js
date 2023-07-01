import React, { Component } from 'react';

import RCG from 'react-captcha-generator';
import { connect } from 'react-redux';

class CaptchaGenerator extends Component {

  constructor(props) {
    super(props)
    
    this.result = this.result.bind(this)
    
  }
  render() {
    return (
      <div>
        <RCG width={200} height={80} result={this.result} />
        
      </div>
    );
  }

  

  result(text) {
    var {dispatch} = this.props;
    dispatch({type: 'SETCAPTCHA',captcha: text});
    
  }
  
  

}

module.exports =connect()(CaptchaGenerator);