import React, { Component } from 'react';
import CaptchaGenerator from 'app/components/CaptchaGenerator';

class NewCaptcha extends Component {
    constructor(props) {
        super(props)
        this.state = {
          switch:true,
        }
        
      }
    refresh=()=>{
        this.setState({switch:!this.state.switch})
    }
    render(){
        return(
            <div>
                {this.state.switch &&<div onClick={this.refresh}  style={{display:"inline-block"}}> <CaptchaGenerator /> </div>}
                {!this.state.switch && <div onClick={this.refresh}  style={{display:"inline-block"}}> <CaptchaGenerator /></div>}
                {/* <div style={{display:"inline-block"}}>
                <i className="fas fa-sync-alt" style={{fontSize:"25px"}}></i>
                </div> */}
            </div>
        )
    }
}

export default NewCaptcha;