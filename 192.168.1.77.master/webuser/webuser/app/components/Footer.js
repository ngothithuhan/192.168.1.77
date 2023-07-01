import React from 'react';
import { connect } from 'react-redux'
class Footer extends React.Component {
    4
    constructor(props) {
        super(props);
        this.state = {
            time: ''
        }
    }
    componentWillReceiveProps(props) {

    }
    componentDidMount() {
        var that = this;
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        //  m = this.checkTime(m);
        //  s = this.checkTime(s);
        //  this.state.time =
        //  h + ":" + m + ":" + s;
        //  this.setState(this.state)
        setTimeout(function () {
            today = new Date();
            let time = '';
            h = today.getHours();
            m = today.getMinutes();
            s = today.getSeconds();
            //   m = that.checkTime(m);
            if (m < 10) { m = "0" + m }
            //   s = that.checkTime(s);
            if (s < 10) { s = "0" + s }
            time =
                h + ":" + m + ":" + s;
            that.setState({ time: h + ":" + m + ":" + s })
        }
            , 500);
    }
    startTime() {

    }
    checkTime(i) {
        if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
        return i;
    }
    render() {
        return (
            <div></div>
        )
        // var company= this.props.authenticate.username=="ctyqlq@gmail.com" ? "CÔNG TY LIÊN DOANH QUẢN LÝ QUỸ ĐẦU TƯ CHỨNG KHOÁN VIETCOMBANK (VCBF)" : this.props.authenticate.username=="nhgs@gmail.com"? "Ngân hàng giám sát" : 'Đại lý phân phối'

        // if(this.props.authenticate.isAuthenticated){
        //         return(

        //             <div className="col-md-12 ">
        //             <div className="row footer" >
        //             <div className="col-md-3 col-xs-4 company " >
        //                 Đang làm việc: {company}
        //             </div>
        //             <div className="col-md-3 col-md-push-2 col-xs-3 col-xs-push-1 name">
        //                     ANTT(Nguyễn Thanh An)

        //             </div>
        //             <div className="col-md-2 col-md-push-4 col-xs-3 col-xs-push-2 time-system">
        //             <i style={{color:"#7f6363"}} className="glyphicon glyphicon-time" aria-hidden="true"></i> {this.state.time}

        //             </div>
        //             </div>
        //         </div>
        //         )
        //     }
        // else{
        //     return (
        //         <div></div>
        //     )
        // }
    }
}

module.exports = connect(function (state) {
    return {
        authenticate: state.authenticate
    }
})
    (Footer);