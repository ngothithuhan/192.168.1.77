import React from 'react';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableDKSIPs from './components/TableDKSIPs'

class DKSIPs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }
   
    showModalDetail(access, ID) {
        let titleModal = ""
        let CUSTID = -1;

        switch (access) {
            case "add": titleModal = "Tạo ĐLPP"; break
            case "update": titleModal = "Sửa ĐLPP"; break;
            case "view": titleModal = "Xem chi tiết"; break
        }
        if (CUSTID) {
            CUSTID = ID
        }
        this.setState({ showModalDetail: true, titleModal: titleModal, CUSTID_VIEW: CUSTID, access: access })
    }
    render() {
        let {datapage} =  this.props 
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

                <div className="title-content">{this.props.strings.title}</div>
                <div className="panel-body" >
                
                        <div className="col-md-12">
                            <TableDKSIPs datapage={datapage}
                                showModalDetail={this.showModalDetail.bind(this)}
                                OBJNAME={datapage.OBJNAME}
                                
                                />
                        </div>
                    
                    </div>
             
            </div>
        );
    }
}

const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang:state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('DKSIPs')
]);

module.exports = decorators(DKSIPs);
