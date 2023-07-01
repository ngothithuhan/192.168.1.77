import React from 'react';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableAddCreateMG_Nhom from './components/TableAddCreateMG_Nhom'
import RestfulUtils from 'app/utils/RestfulUtils';
import Select from 'react-select';
class GanMG_Nhom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            GROUP: { value: '', label: '' },
            manager:''
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
            case "update": titleModal = "Sửa ĐLPP"; break;
            case "view": titleModal = "Xem chi tiết"; break
        }
        if (CUSTID) {
            CUSTID = ID
        }
        this.setState({ showModalDetail: true, titleModal: titleModal, CUSTID_VIEW: CUSTID, access: access })
    }
    clearGroup(){
        this.setState({
            GROUP: { value: '', label: '' },
            manager:''
        })
    }
    render() {
       
        let {datapage} =  this.props 
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

                <div className="title-content">{this.props.strings.title}</div>
                <div className="panel-body" >
                    <div className="col-md-12">
                        <div className="col-md-6">
                            <div className="col-md-12">
                                <div className="col-md-3" style={{paddingLeft:0}}><h5 className="highlight"><b>{this.props.strings.group}</b></h5></div>
                                <div className="col-md-9 customSelect">
                                    <Select.Async
                                        name="form-field-name"

                                        placeholder={this.props.strings.title}
                                        loadOptions={this.getOptions.bind(this)}
                                        value={this.state.GROUP}
                                        onChange={this.onChange.bind(this)}
                                        id="cbGrpid"
                                    />
                                </div>
                            </div>


                        </div>
                        <div className="col-md-6">
                            <div className="col-md-12">
                                <div className="col-md-3" style={{paddingLeft:0}}><h5 className=""><b>{this.props.strings.manager}</b></h5></div>
                                <div className="col-md-9 customSelect ">
                                <label className="form-control" id="lblmanager">{this.state.manager}</label>

                                </div>
                            </div>


                        </div>


                        <div className="col-md-12">
                            <TableAddCreateMG_Nhom datapage={datapage}
                                showModalDetail={this.showModalDetail.bind(this)}
                                OBJNAME={datapage.OBJNAME}
                                grpid={this.state.GROUP.value}
                                clearGroup={this.clearGroup.bind(this)}
                                />
                        </div>
                    
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
    translate('GanMG_Nhom')
]);

module.exports = decorators(GanMG_Nhom);
