import React, { Component } from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import ReactTable from 'react-table'
import { Route, Link } from 'react-router-dom'
import { Collapse, Well } from 'react-bootstrap'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import axios from 'axios'
import { showNotifi } from 'app/action/actionNotification.js';
import { ToastContainer, toast } from 'react-toastify'
import RestfulUtils from "app/utils/RestfulUtils";

class ModalDetailCapNhatTTLenhManual extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: {
                general: true,
                authorize: false,
                fatca: false,
                upload: false,
                quydangki: false,
            },
            display: {
                fatca: false,
                authorize: false
            },
            access: 'add',
            CUSTID: '',
            disabled: false,
            new_create:false,
            data:{},
            datagroup:{
                p_desc:''
            }
        };
    }
    collapse(tab) {
        // console.log(tab)
        this.state.collapse[tab] = !this.state.collapse[tab];
        // console.log(this.state.collapse)
        this.setState({ collapse: this.state.collapse })
    }
    //   handleChange(type){
    //     this.props.handleChange(type);

    //  }
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
        console.log('nextProps')
console.log(nextProps)
        if (nextProps.access == "update"||nextProps.access == "view") {
            this.setState({
                display: {
                    fatca: true,
                    authorize: true,
                    upload: true,
                    quydangki: true
                }
            })
        }
        else
            this.setState({
                display: {
                    fatca: false,
                    authorize: false,
                    upload: false,
                    quydangki: false,

                },
                new_create:true,
                data:nextProps.DATA
            })
    }
    componentDidMount() {

        // io.socket.post('/account/get_detail',{CUSTID:this.props.CUSTID_VIEW,TLID:"0009"}, function (resData, jwRes) {
        //     console.log('detail',resData)
        //     // self.setState({generalInformation:resData});

        // });

    }
    createSuccess(CUSTID,access,new_create) {
        this.setState(
            {
                display: {
                    fatca: true,
                    authorize: true,
                    upload: true,
                    quydangki: true
                },
                access: 'update',
                CUSTID: CUSTID,
                new_create
            }
        )
        this.props.createSuccess(access);

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
        p_language:this.props.lang
     }
     console.log('this.state.datagroup')
        console.log(data)
        RestfulUtils.post('/fund/unblockafmast', data)
            .then((res) => {
                console.log(res)
                if (res.data.EC == 0) {
                    datanotify.type = "success";
                    datanotify.content = "Thành công";
                    dispatch(showNotifi(datanotify));
                    this.props.closeModalDetail()
                } else {
                    datanotify.type = "error";
                    datanotify.content = res.data.EM;
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
        let displayy=this.state.access=='view'?true:false
        return (
            <Modal show={this.props.showModalDetail}   bsSize="lg">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                        <div className="panel-body ">
                        <div className="add-info-account">
                        <div className="col-md-12" style={{ paddingTop: "11px" }}>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5 ><b>{this.props.strings.orderid}</b></h5>
                                </div>
                                <div className="col-md-3">
                                  <label className="form-control" id="lblCustodycd">{this.state.data.CUSTODYCD}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5 ><b>{this.props.strings.vfmcode}</b></h5>
                                </div>
                                <div className="col-md-9">
                                  <label className="form-control" id="lblFullname">{this.state.data.FULLNAME}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5 ><b>{this.props.strings.custodycd}</b></h5>
                                </div>
                                <div className="col-md-3">
                                  <label className="form-control" id="lblIdcode">{this.state.data.IDCODE}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5 ><b>{this.props.strings.ordertype}</b></h5>
                                </div>
                                <div className="col-md-3">
                            <label className="form-control" id="lblIddate">{this.state.data.IDDATE}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5><b>{this.props.strings.amount}</b></h5>
                                </div>
                                <div className="col-md-3">
                                <label className="form-control" id="lblIdplace">{this.state.data.IDPLACE}</label>

                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5 ><b>{this.props.strings.status}</b></h5>
                                </div>
                                <div className="col-md-3">
                                  <label className="form-control" id="lblIdcode">{this.state.data.IDCODE}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5 ><b>{this.props.strings.user}</b></h5>
                                </div>
                                <div className="col-md-3">
                            <label className="form-control" id="lblIddate">{this.state.data.IDDATE}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5><b>{this.props.strings.time}</b></h5>
                                </div>
                                <div className="col-md-3">
                                <label className="form-control" id="lblIdplace">{this.state.data.IDPLACE}</label>

                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                <h5><b>{this.props.strings.orderidvsd}</b></h5>
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
                                <input className="form-control" type="text" placeholder={this.props.strings.groupname} id="txtDesc" value={this.state.datagroup["p_desc"]} onChange={this.onChange.bind(this, "p_desc")} />
                                </div>
                            </div>
                            <div className="col-md-12 row">
                              <div className="pull-right">
                                <input disabled={displayy} type="button"  className="btn btndangeralt" style={{marginRight:15}} value={this.props.strings.submit} id="btnSubmit"  onClick={this.submitGroup.bind(this)}/>

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
    translate('ModalDetailCapNhatTTLenhManual')
]);

module.exports = decorators(ModalDetailCapNhatTTLenhManual);
