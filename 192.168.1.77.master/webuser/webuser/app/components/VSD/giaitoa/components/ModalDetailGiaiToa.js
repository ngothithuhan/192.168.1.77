import React, { Component } from 'react';
import { Modal} from 'react-bootstrap'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
class ModalDetailGiaiToa extends Component {
    constructor(props) {
        super(props);
        this.state = {
        
            access: 'add',
    
            data:{},
            datagroup:{
                p_desc:''
            }
        };
    }
  
    close() {

        this.props.closeModalDetail();
    }
    /**
     * Trường hợp update thì hiển thị tất cả thông tin lên cho sửa
     * Trường hơp view thì ẩn các nút sửa không cho duyệt
     * Trường hợp add thì ẩn thông tin chỉ hiện thông tin chung cho người dùng -> Thực hiện -> Mở các thông tin tiếp theo cho người dùng khai
     * @param {*access} nextProps
     */
    componentWillReceiveProps(nextProps) {
        let self = this;
  
        if (nextProps.access == "update"||nextProps.access == "view") {
            if ( nextProps.isClear)
            {
            this.props.change()
           
            this.setState({
                data:nextProps.DATA,
                access:nextProps.access
            })
        }
        }
        else
            if ( nextProps.isClear)
            {
            this.props.change()
            this.setState({
              
            })
            }
    }
 
   
    handleChange(type) {
        this.state.collapse[type] = !this.state.collapse[type];
        this.setState({ collapse: this.state.collapse })
    }
    async submitGroup() {
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""
        }
     let data={
        p_custodycd:this.state.data.CUSTODYCD,
        p_acctno:this.state.data.ACCTNO,
        p_desc:this.state.datagroup.p_desc,
        p_language:this.props.lang,
        pv_objname:this.props.OBJNAME
     }
 
     RestfulUtils.posttrans('/fund/unblockafmast', data)
            .then((res) => {
              
                if (res.EC == 0) {
                    datanotify.type = "success";
                    datanotify.content = this.props.strings.success;
                    dispatch(showNotifi(datanotify));
                    this.props.load()
                    this.props.closeModalDetail()
                } else {
                    datanotify.type = "error";
                    datanotify.content = res.EM;
                    dispatch(showNotifi(datanotify));
                }
    
            })
        
    
    }
    onChange(type, event) {
        let data = {};
        if (event.target) {
           
            this.state.datagroup[type] = event.target.value;
        }
        else {
            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup })
    }
    render() {
        const pageSize = 5;
        return (
            <Modal show={this.props.showModalDetail}  bsSize="lg">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                        <div className="panel-body ">
                        <div className="add-info-account">
                        <div className={this.state.access=="view"?"col-md-12 disable":"col-md-12"} style={{ paddingTop: "11px" }}>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5 ><b>{this.props.strings.custodycd}</b></h5>
                                </div>
                                <div className="col-md-3">
                                  <label className="form-control" id="lblCustodycd">{this.state.data.CUSTODYCD}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5 ><b>{this.props.strings.fullname}</b></h5>
                                </div>
                                <div className="col-md-9">
                                  <label className="form-control" id="lblFullname">{this.state.data.FULLNAME}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5 ><b>{this.props.strings.idcode}</b></h5>
                                </div>
                                <div className="col-md-3">
                                  <label className="form-control" id="lblIdcode">{this.state.data.IDCODE}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5 ><b>{this.props.strings.iddate}</b></h5>
                                </div>
                                <div className="col-md-3">
                            <label className="form-control" id="lblIddate">{this.state.data.IDDATE}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5><b>{this.props.strings.idplace}</b></h5>
                                </div>
                                <div className="col-md-3">
                                <label className="form-control" id="lblIdplace">{this.state.data.IDPLACE}</label>

                                </div>
                            </div>

                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5><b>{this.props.strings.desc}</b></h5>
                                </div>
                                <div className="col-md-9">
                                <input maxLength={1000} className="form-control" type="text" placeholder={this.props.strings.desc} id="txtDesc" value={this.state.datagroup["p_desc"]} onChange={this.onChange.bind(this, "p_desc")} />
                                </div>
                            </div>
                            <div className="col-md-12 row">
                              <div className="pull-right">
                                <input type="button"  className="btn btn-primary" style={{marginRight:15}} value={this.props.strings.submit} id="btnSubmit"  onClick={this.submitGroup.bind(this)}/>

                              </div>
                            </div>
                        </div>


                            </div>

 </div>


                </Modal.Body>

            </Modal>
        );
    }
}
const stateToProps = state => ({
    lang:state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('ModalDetailGiaiToa')
]);

module.exports = decorators(ModalDetailGiaiToa);
