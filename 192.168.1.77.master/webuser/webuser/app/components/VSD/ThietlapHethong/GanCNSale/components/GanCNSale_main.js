import React from 'react';
import {connect} from 'react-redux';
import GanCNSale_info from './GanCNSale_info';

class GanCNSale_main extends React.Component {
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

              <div className="add-info-account" style={{padding: '5px 12px'}}>

                     <GanCNSale_info onSubmit={this.nextPage} />

        </div>

        )
    }
}
module.exports = connect(function(state){
    return{auth : state.auth}
  })(GanCNSale_main);
