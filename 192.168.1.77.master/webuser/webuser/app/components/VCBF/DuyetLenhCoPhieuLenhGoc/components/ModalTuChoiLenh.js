import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import flow from 'lodash.flow';
import NumberInput from 'app/utils/input/NumberInput';

class ModalTuChoiLenh extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access: 'add',
            datagroup: {},
            checkFields: [
            ],
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
            if (nextProps.isClear) {
                this.props.change()

                this.setState({
                    datagroup: {
                        p_orderid:nextProps.DATA.ORDERID,
                        p_custodycd: nextProps.DATA.CUSTODYCD,
                        p_desc: '',
                        pv_objname: this.props.OBJNAME,
                        p_language: this.props.lang
                    },
                    access: nextProps.access,
                })
            }
        }
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
   
    async submitRejectOrder() {
        
            var api = '/vcbf/Order_Reject';


            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            // console.log(this.state.datagroup)
            RestfulUtils.posttrans(api,{
                orderid: this.state.datagroup.p_orderid,
                custodycd: this.state.datagroup.p_custodycd,
                desc: this.state.datagroup.p_desc,
                p_language: this.props.language, pv_objname: this.props.OBJNAME
            })
                .then((res) => {
                    // console.log('chek ma loi ---- ', res)
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

    render() {
        return (
            <Modal show={this.props.showModalDetail} bsSize="md" >
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "80%"}}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12"} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row" style={{display:'block'}}>
                                    <div className="col-md-3">
                                        <h5 className=""><b>{this.props.strings.DESC}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                    <input  className="form-control" id="txtDESC" type="text" placeholder={this.props.strings.DESC} value={this.state.datagroup["p_desc"]} onChange={this.onChange.bind(this, "p_desc")} maxLength={200} />
                                    </div>
                                </div>
                                <div className="col-md-12 row" style={{display:'block'}}>
                                    <div className="pull-right">
                                        <input  type="button" onClick={this.submitRejectOrder.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />

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
    lang: state.language.language,
    tradingdate: state.systemdate.tradingdate

});

const decorators = flow([
    connect(stateToProps),
    translate('ModalTuChoiLenh')
]);

module.exports = decorators(ModalTuChoiLenh);
