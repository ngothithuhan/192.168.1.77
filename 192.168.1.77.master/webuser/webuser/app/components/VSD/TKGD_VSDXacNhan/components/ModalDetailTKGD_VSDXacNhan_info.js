import React, { Component } from 'react';
import { Modal  } from 'react-bootstrap'
import { connect } from 'react-redux'
import { showNotifi } from 'app/action/actionNotification.js';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';

import RestfulUtils from 'app/utils/RestfulUtils';
class ModalDetailTKGD_VSDXacNhan_info extends Component {
    constructor(props) {
        super(props);
        this.state = {

            access: 'add',
            datagroup:{
                p_custodycd:'',
                p_fullname:'',
                p_idcode:'',
                p_iddate:'',
                p_idplace:'',
                p_address:'',
                p_opndate:'',
                p_des:'',
                p_language:this.props.lang,
                pv_objname:this.props.OBJNAME
            },

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


        if (nextProps.access == "update" || nextProps.access == "view") {
            if ( nextProps.isClear)
            {
                this.props.change()
            this.setState({
                datagroup:{
                    p_custodycd:nextProps.DATA.CUSTODYCD,
                    p_fullname:nextProps.DATA.FULLNAME,
                    p_idcode:nextProps.DATA.IDCODE,
                    p_iddate:nextProps.DATA.IDDATE,
                    p_idplace:nextProps.DATA.IDPLACE,
                    p_address:nextProps.DATA.ADDRESS,
                    p_opndate:nextProps.DATA.OPNDATE,
                    p_des:'',
                    p_language:this.props.lang,
                    pv_objname:this.props.OBJNAME
                },
                access:nextProps.access
            })
        }
        }
        else
            this.setState({
                
            })
    }

    async submitGroup() {
       
            var api = '/fund/cf_account_opening_request';
           

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
      // console.log(this.state.datagroup)
      RestfulUtils.post(api, this.state.datagroup)
                .then((res) => {
                
                    if (res.EC == 0) {
                        datanotify.type = "success";
                        datanotify.content =this.props.strings.success
                       
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
        let displayy=this.state.access=='view'?true:false
        return (
            <Modal show={this.props.showModalDetail}  bsSize="lg">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access=='view'?"col-md-12 disable":"col-md-12"} style={{ paddingTop: "11px" }}>

                                <div className="col-md-12 row">
                                    {/*
  <div className="col-md-3">
  <h5 className="highlight"><b>{this.props.strings.custid}</b></h5>
  </div>
  <div className="col-md-3">
    <input className="form-control" type="text" placeholder={this.props.strings.custid}  value={this.state.datauser["p_tlid"]} onChange={this.onChange.bind(this,"p_tlid")}/>
  </div>
*/}
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.custodycd}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblCustodycd">{this.state.datagroup["p_custodycd"]}</label>

                                    </div>
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.opendate}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblOpendate">{this.state.datagroup["p_opndate"]}</label>
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.fullname}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblFullname">{this.state.datagroup["p_fullname"]}</label>
                                    </div>
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.idcode}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblIdcode">{this.state.datagroup["p_idcode"]}</label>
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.iddate}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblIddate">{this.state.datagroup["p_iddate"]}</label>
                                    </div>
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.idplace}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblIdplace">{this.state.datagroup["p_idplace"]}</label>
                                    </div>
                                </div>



                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.address}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <label className="form-control" id="lblAddress">{this.state.datagroup["p_address"]}</label>
                                    </div>


                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.note}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input maxLength={1000} disabled={displayy} className="form-control" id="txtNote" type="text" placeholder={this.props.strings.note} value={this.state.datagroup["p_des"]} onChange={this.onChange.bind(this, "p_des")} />
                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        <input disabled={displayy} onClick={this.submitGroup.bind(this)} type="button" className="btn btn-primary" style={{ marginLeft: 0, marginRight: 5 }} value={this.props.strings.submit} id="btnSubmit" />

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
    translate('ModalDetailTKGD_VSDXacNhan_info')
]);

module.exports = decorators(ModalDetailTKGD_VSDXacNhan_info);
