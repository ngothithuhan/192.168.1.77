import React from 'react';
import {connect} from 'react-redux';
import TKGD_VSDXacNhan_info1 from './TKGD_VSDXacNhan_info';

class TKGD_VSDXacNhan_main1 extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            page: 1

        }
    }

    onSubmit(){

    }
    render(){
        //const { page } = this.state;
        //const { access } = this.props;
      //  console.log('acces111s');
  //  console.log(access);
        return(
          /*
            <div className="add-info-account">
                    <div  className={this.props.new_create||this.state.generalInformation.STATUS=="N"?"":"disable"} >
                      {access=='update'  &&    <GiaiToa_information onSubmit={this.nextPage} />}

                    </div>
            </div>
            */
        
              <div className="add-info-account">

                     <TKGD_VSDXacNhan_info1 onSubmit={this.nextPage} />

        </div>

        )
    }
}
module.exports = connect(function(state){
    return{auth : state.auth}
  })(TKGD_VSDXacNhan_main1);
