import React from 'react';
import {connect} from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
class Notification extends React.Component{
  constructor(props){
    super(props);
    this.state={
      notification:{}
    }
  }
  showNotify(){
    console.log('show notify')
    
    var text =  "["+this.state.notification.header+"]"+ " " +this.state.notification.content;
    switch(this.state.notification.type){
      case "info":
      
          toast.info(text, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          break;
      case "success":
            toast.success(text, {
              position: toast.POSITION.BOTTOM_RIGHT
            });
          break;
      case "error":
            toast.error(text, {
              position: toast.POSITION.BOTTOM_RIGHT
            });
            break;
   
     case "warn": toast.warn(text, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        break;
    }
  }
  render(){
    // this.showNotify();
    return (

      <div>
           {/* <ToastContainer
          position="top-center"
          type="default"
          autoClose={50000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
        /> */}
      </div>
    )
  }
  // hàm này được gọi liên tục mỗi khi props thay đổi 
  componentWillReceiveProps(nextProps){
    var {notification} = nextProps;
    // this.setState(notification);
   // console.log(notification);
    // notification.type.toUpperCase() + " " +
    var text =  notification.header+ " " +notification.content;
    switch(notification.type){
      case "info":
      
          toast.info(text, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          break;
      case "success":
            toast.success(text, {
              position: toast.POSITION.BOTTOM_RIGHT
            });
          break;
      case "error":
            toast.error(text, {
              position: toast.POSITION.BOTTOM_RIGHT
            });
            break;
   
     case "warn": toast.warn(text, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        break;
    }
     
  }
  componentDidMount(){
   
  }
}

module.exports = connect(function(state){
  return{
    notification:state.notification
  }
})(Notification);
