import React from 'react';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableRutMG from './components/TableRutMG';
import ModalRutMG from './components/ModalRutMG';
import RestfulUtils from 'app/utils/RestfulUtils';
import Select from 'react-select';
class RutMG extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            GROUP: { value: '', label: '' },
            manager:'',
            loadgrid :false,
        }
    }
    getOptions(input) {

        let data = {
            p_language: this.props.lang,
            p_autoid: 'ALL',
            
        }
        return RestfulUtils.post('/fund/getlistsale_groups',  data )
            .then((res) => {

               
                return { options: res };
            })
    }

    onChange(e) {
        if(e && e.value){
        this.setState({ GROUP: e,manager:e.manager });
        }else{
            this.setState({ GROUP:{ value: '', label: '' },manager:'' });
        }
    }
    showModalDetail(access, ID) {
        let titleModal = ""
        let CUSTID = -1;

        switch (access) {
            case "add": titleModal = "Tạo ĐLPP"; break
            case "update": titleModal = "Duyệt rút MG"; break;
            case "view": titleModal = "Xem chi tiết"; break
        }
        if (CUSTID) {
            CUSTID = ID
        }
        console.log('ID :',ID)
        this.setState({ showModalDetail: true, titleModal: titleModal, CUSTID_VIEW: CUSTID, access: access, DATA :ID })
    }
    
    clearGroup(){
        this.setState({
            GROUP: { value: '', label: '' },
            manager:''
        })
    }
    createSuccess(access) {
        this.setState({ access: access })
    }
    closeModalDetail() {

        this.setState({ showModalDetail: false, isClear: true, loadgrid: true })
    }
    render() {
       
        let {datapage} =  this.props 
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

                <div className="title-content">{this.props.strings.title}</div>
                <div className="panel-body" >
                    <div className="col-md-12">
                        
                       


                        <div className="col-md-12">
                            <TableRutMG datapage={datapage}
                                showModalDetail={this.showModalDetail.bind(this)}
                                OBJNAME={datapage.OBJNAME}
                                grpid={this.state.GROUP.value}
                                clearGroup={this.clearGroup.bind(this)}
                                loadgrid={this.state.loadgrid}
                                />
                        </div>
                        <ModalRutMG createSuccess={this.createSuccess.bind(this)}
                                //load={this.load.bind(this)}
                                isClear={this.state.isClear}
                                //change={this.change.bind(this)}
                                access={this.state.access}
                                DATA={this.state.DATA}
                                title={this.state.titleModal}
                                showModalDetail={this.state.showModalDetail}
                                closeModalDetail={this.closeModalDetail.bind(this)}
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
    translate('RutMG')
]);

module.exports = decorators(RutMG);
