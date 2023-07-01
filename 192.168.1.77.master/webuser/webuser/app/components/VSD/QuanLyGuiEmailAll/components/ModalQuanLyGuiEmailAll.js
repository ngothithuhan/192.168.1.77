import React, { Component } from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { showNotifi } from 'app/action/actionNotification.js';
import { Modal } from 'react-bootstrap'
import RestfulUtils from 'app/utils/RestfulUtils';

class ModalQuanLyGuiEmailAll extends Component {
    constructor(props) {
        super(props);
        this.state = {

            p_language: this.props.lang,
            pv_objname: this.props.OBJNAME,

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


        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()

                // if (nextProps.DATA.ALERTTYPE == 'L') {
                //     this.state.enable = "block"
                // } else this.state.enable = "none"
                this.setState({
                    display: {
                        fatca: true,
                        authorize: true,
                        upload: true,
                        quydangki: true
                    },
                    p_type: nextProps.DATA.TYPE,
                    p_fullname: nextProps.DATA.FULLNAME,
                    p_sendtime: nextProps.DATA.SENTTIME,
                    p_note: nextProps.DATA.NOTE,
                    p_autoid: nextProps.DATA.AUTOID,
                    p_custodycd: nextProps.DATA.CUSTODYCD,
                    p_email: nextProps.DATA.EMAIL,
                    p_subject: nextProps.DATA.SUBJECT,
                    p_createtime: nextProps.DATA.CREATETIME,
                    p_status: (this.props.lang == 'vie') ? nextProps.DATA.STATUS_DESC :nextProps.DATA.STATUS_DESC_EN ,
                    p_templateid: nextProps.DATA.TEMPLATEID,
                    pv_language: this.props.lang,
                    pv_objname: this.props.OBJNAME,
                    access: nextProps.access,

                })
            }
        }
        else
            if (nextProps.isClear) {
                this.props.change()
                this.setState({
                    display: {
                        fatca: false,
                        authorize: false,
                        upload: false,
                        quydangki: false,

                    },
                    p_note: '',
                    stringresultlist: '',
                    p_emailtype: '',
                    p_shortcontent: '',
                    p_maincontent: '',
                    p_frdate: '',
                    p_todate: '',
                    p_retradingdate: '',
                    p_list: '',
                    p_language: this.state.lang,
                    pv_objname: this.props.OBJNAME,
                    access: nextProps.access,
                    fileName: ''
                })
            }
    }


    async submitSend() {


        var api = '/account/managementemail';


        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }
        RestfulUtils.posttrans(api, {
            autoid: this.state.p_autoid,
            templateid: this.state.p_templateid,
            language: this.props.lang,
            objname: this.props.OBJNAME,
        })
            .then((res) => {
                //console.log('res ', res)
                if (res.EC == 0) {
                    datanotify.type = "success"
                    datanotify.content = this.props.strings.success;
                    dispatch(showNotifi(datanotify));
                    this.props.closeModalDetail()

                } else {
                    datanotify.type = "error";
                    datanotify.content = res.EM;
                    dispatch(showNotifi(datanotify));
                }

            })
    }
    onChange(type, event) {

        if (event.target) {

            this.state[type] = event.target.value;
        }
        else {
            this.state[type] = event.value;
        }
        this.setState({ p_note: this.state.p_note })
    }
    render() {

        return (
            <Modal show={this.props.showModalDetail} bsSize="md">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="panel-body ">
                        <div className="add-info-account">

                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                    <h5 ><b>{this.props.strings.type}</b></h5>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-control"> {this.state.p_type} </label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                    <h5 ><b>{this.props.strings.templateid}</b></h5>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-control"> {this.state.p_templateid} </label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                    <h5 ><b>{this.props.strings.subject}</b></h5>
                                </div>
                                <div className="col-md-9">
                                    <label style={{height: '100%'}} className="form-control"> {this.state.p_subject} </label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                    <h5 ><b>{this.props.strings.custodycd}</b></h5>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-control"> {this.state.p_custodycd} </label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                    <h5 ><b>{this.props.strings.fullname}</b></h5>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-control">{this.state.p_fullname}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                    <h5 ><b>{this.props.strings.email}</b></h5>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-control">{this.state.p_email}</label>
                                </div>
                            </div>

                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                    <h5 ><b>{this.props.strings.createtime}</b></h5>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-control">{this.state.p_createtime}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                    <h5 ><b>{this.props.strings.sendtime}</b></h5>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-control">{this.state.p_sendtime}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                    <h5><b>{this.props.strings.status}</b></h5>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-control">{this.state.p_status}</label>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                    <h5><b>{this.props.strings.note}</b></h5>
                                </div>
                                <div className="col-md-6">
                                    <input className="form-control" type="text" placeholder={this.props.strings.note} id="txtDesc" value={this.state.p_note} onChange={this.onChange.bind(this, "p_note")} />
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="pull-right" style={{ paddingTop: 20 }}>
                                    <input type="button" onClick={this.submitSend.bind(this)} className="btn btn-primary" s style={{ marginRight: 15 }} value={this.props.strings.btnsendagain} id="btnSubmit" />
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
    lang: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalQuanLyGuiEmailAll')
]);
module.exports = decorators(ModalQuanLyGuiEmailAll);
// export default ModalDetail;
