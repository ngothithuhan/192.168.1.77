import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import DropdownFactory from '../../../../../utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';
import NumberFormat from 'react-number-format';
import RestfulUtils from 'app/utils/RestfulUtils';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { showNotifi } from 'app/action/actionNotification.js';
import Select from 'react-select';

class ModalDetailQLThoiGianNamGiuCCQ_info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access: 'add',
            CUSTID: '',
            disabled: false,
            new_create: false,

            datachange: {},

            datagroup: {},
            loadgrid: false,
            showModalDetail: false,
            titleModal2: '',
            isClear: true,
        };
    }
    onChange(type, event) {
        if (event.target) {
            this.state.datagroup[type] = event.target.value;
        }
        else {
            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup })
    }
    onSetDefaultValue = (type, value) => {

        if (!this.state.datagroup[type]) {

            this.state.datagroup[type] = value
        }

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
        console.log('nextProps:::', nextProps)
        let self = this;
        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()
                this.setState({

                    access: nextProps.access,
                    datagroup: {
                        p_month_cal: nextProps.DATA.MONTH_CAL,
                        p_saleid: nextProps.DATA.SALEID,
                        p_tlfullname: nextProps.DATA.TLFULLNAME,
                        p_retype: nextProps.DATA.RETYPE,
                        p_feeamt: nextProps.DATA.FEEAMT,
                        p_trailerfeedeductamt: nextProps.DATA.TRAILERFEEDEDUCTAMT,
                        p_feeamt_net: nextProps.DATA.FEEAMT_NET,
                        pv_objname: this.props.OBJNAME,
                        pv_language: this.props.lang
                    }
                })
            }
        }
        else
            if (nextProps.isClear) {
                this.props.change()
                this.setState({

                    access: nextProps.access,
                    new_create: true,
                    datagroup: {
                        p_month_cal: '',
                        p_saleid: '',
                        p_tlfullname: '',
                        p_retype: '',
                        p_feeamt: '',
                        p_trailerfeedeductamt: '',
                        p_feeamt_net: '',
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME
                    }
                })
            }
    }


    onValueChange(type, data) {

        this.state.datagroup[type] = data.value
        this.setState(this.state)
    }

    async submitGroup() {
        console.log('this.state.datagroup:',this.state.datagroup);
        var mssgerr = '';

        if (mssgerr == '') {
            var api = '';
            if (this.state.access == "update") {
                api = '';
            }

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }

            this.setState({
                datagroup: this.state.datagroup
            })


            RestfulUtils.posttrans(api, this.state.datagroup)
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


    }
    load() {
        this.setState({ loadgrid: true })
    }
    
    showModalDetail(action, dataUPDATE) {

        let titleModal = ""
        switch (action) {
            case "add": titleModal = this.props.strings.modal2add; break
            case "update": titleModal = this.props.strings.modal2edit; break;
            case "view": titleModal = "Xem chi tiết"; break
        }
        this.setState({
            showModalDetail: true, titleModal2: titleModal, dataUPDATE: dataUPDATE
        })
    }
    closeModalDetail() {

        this.setState({ showModalDetail: false, isClear: true , loadGrid: false})
    }

    change() {

        this.setState({ isClear: false })
    }
    onChangeDRD(type, event) {
        if (event.target) {
            this.state.datagroup[type] = event.target.value;
        }
        else {
            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup})
    }
   
    render() {
        let displaydisablednew = this.state.access == 'view' || this.state.access == 'update' ? true : false
        let displaydisabled = this.state.access == 'view' ? true : false
        
        return (
            <Modal show={this.props.showModalDetail} >
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">

                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12  ">
                                    <div className="col-md-5 ">
                                        <h5 className=""><b>{this.props.strings.month_cal}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <input className="form-control" type="text" placeholder={this.props.strings.month_cal} id="txtMonth_cal" value={this.state.datagroup["p_month_cal"]} onChange={this.onChange.bind(this, "p_month_cal")} maxLength={200} />
                                    </div>
                                </div>
                                <div className="col-md-12  ">
                                    <div className="col-md-5 ">
                                        <h5 className=""><b>{this.props.strings.saleid}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <input className="form-control" type="text" placeholder={this.props.strings.saleid} id="txtSaleid" value={this.state.datagroup["p_saleid"]} onChange={this.onChange.bind(this, "p_saleid")} maxLength={200} />
                                    </div>
                                </div>
                                <div className="col-md-12  ">
                                    <div className="col-md-5 ">
                                        <h5 className=""><b>{this.props.strings.tlfullname}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <input className="form-control" type="text" placeholder={this.props.strings.tlfullname} id="txtTlfullname" value={this.state.datagroup["p_tlfullname"]} onChange={this.onChange.bind(this, "p_tlfullname")} maxLength={200} />
                                    </div>
                                </div>
                                <div className="col-md-12  ">
                                    <div className="col-md-5 ">
                                        <h5 className=""><b>{this.props.strings.retype}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <input className="form-control" type="text" placeholder={this.props.strings.p_retype} id="txtRetype" value={this.state.datagroup["p_retype"]} onChange={this.onChange.bind(this, "p_retype")} maxLength={200} />
                                    </div>
                                </div>
                                <div className="col-md-12  ">
                                    <div className="col-md-5 ">
                                        <h5 className=""><b>{this.props.strings.feeamt}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <NumberFormat disabled={displaydisabled} decimalScale={4} className="form-control" id="txtFeeamt" onValueChange={this.onValueChange.bind(this, 'p_feeamt')} prefix={''} placeholder={this.props.strings.feeamt} value={this.state.datagroup["p_feeamt"]} thousandSeparator={true} />
                                    </div>
                                </div>
                                <div className="col-md-12  ">
                                    <div className="col-md-5 ">
                                        <h5 className=""><b>{this.props.strings.trailerfeedeductamt}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <NumberFormat disabled={displaydisabled} decimalScale={4} className="form-control" id="txtTrailerfeedeductamt" onValueChange={this.onValueChange.bind(this, 'p_trailerfeedeductamt')} prefix={''} placeholder={this.props.strings.trailerfeedeductamt} value={this.state.datagroup["p_trailerfeedeductamt"]} thousandSeparator={true} />
                                    </div>
                                </div>
                                <div className="col-md-12  ">
                                    <div className="col-md-5 ">
                                        <h5 className=""><b>{this.props.strings.feeamt_net}</b></h5>
                                    </div>
                                    <div className="col-md-7">
                                        <NumberFormat disabled={displaydisabled} decimalScale={4} className="form-control" id="txtFeeamt_net" onValueChange={this.onValueChange.bind(this, 'p_feeamt_net')} prefix={''} placeholder={this.props.strings.feeamt_net} value={this.state.datagroup["p_feeamt_net"]} thousandSeparator={true} />
                                    </div>
                                </div>
                                
                            </div>
                            
                        </div>

                    </div>
                </Modal.Body>

            </Modal >
        );
    }
}
const stateToProps = state => ({
    lang: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalDetailQLThoiGianNamGiuCCQ_info')
]);
module.exports = decorators(ModalDetailQLThoiGianNamGiuCCQ_info);
