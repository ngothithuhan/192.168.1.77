import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import NumberFormat from 'react-number-format';
import RestfulUtils from 'app/utils/RestfulUtils';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { showNotifi } from 'app/action/actionNotification.js';
class ModalBacThang extends Component {
    constructor(props) {
        super(props);
        this.state = {

            access: 'add',


            datachange: {},
            selectedOption: '',
            selectedOption1: '',
            datagroup: {
                fromvalue: '',
                tovalue: '',
                fee: ''
            },
            checkFields: [

                { name: "fromvalue", id: "txtFromvalue" },
                { name: "tovalue", id: "txtTovalue" },
                { name: "fee", id: "txtFee" },
            ],
            isPercent: 0
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
        if (!this.state.datagroup[type])
            this.state.datagroup[type] = value
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
        
        if (this.state.access == 'update') {
            this.state.datagroup.fromvalue = this.state.hehe.fromvalue
            this.state.datagroup.tovalue = this.state.hehe.tovalue
            this.state.datagroup.fee = this.state.hehe.fee
            this.props.closeModalDetail();
        } else this.props.closeModalDetail();

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
           
            this.setState({
                hehe: {
                    id: nextProps.dataUPDATE.id,
                    fromvalue: nextProps.dataUPDATE.fromvalue,
                    tovalue: nextProps.dataUPDATE.tovalue,
                    fee: nextProps.dataUPDATE.fee
                },
                access: nextProps.access,
                isPercent: nextProps.isPercent,
                isTrailerfee:nextProps.isTrailerfee,
                datagroup: nextProps.dataUPDATE == undefined ? {
                    fromvalue: '',
                    tovalue: '',
                    fee: ''
                } : {
                    id: nextProps.dataUPDATE.id,
                    fromvalue:parseFloat(nextProps.dataUPDATE.fromvalue),
                    tovalue: parseFloat(nextProps.dataUPDATE.tovalue),
                    fee: parseFloat(nextProps.dataUPDATE.fee)
                },
            })

        }
        else
            if (nextProps.isClear) {
                this.props.change()
                this.setState({
                    access: nextProps.access,
                    datagroup: {
                        fromvalue: '',
                        tovalue: '',
                        fee: ''
                    },
                    isPercent: nextProps.isPercent,
                    isTrailerfee:nextProps.isTrailerfee,
                })
            }
    }


    onValueChange(type, data) {

        this.state.datagroup[type] = data.value
        this.setState(this.state)
    }

    checkValid(name, id) {


        let value = this.state.datagroup[name];
        console.log('value :',name ,value)
        value = value.toString();
        let mssgerr = '';
        switch (name) {

            case "fromvalue":
                if (value == '') {
                    mssgerr = this.props.strings.requiredfromvalue;
                } else {
                    if (value < 0) mssgerr = this.props.strings.requiredfromvalue0;
                }
                break;
            case "tovalue":
                if (value == '') {
                    mssgerr = this.props.strings.requiredtovalue;
                } else {
                    if (value <= 0) mssgerr = this.props.strings.requiredtovalue0;
                    else if (parseFloat(value) < parseFloat(this.state.datagroup["fromvalue"])) mssgerr = this.props.strings.requiredcondtion;
                }
                break;
            case "fee":

                if (value == '') {
                    mssgerr = this.props.strings.requiredfee;
                } else {

                    if (this.props.isPercent == 1) {
                        if (value < 0 || value > 100) mssgerr = this.props.strings.requiredpercent;
                    } else if (this.props.isPercent == 0) {
                        if (value < 0) mssgerr = this.props.strings.requiredfixedfee;
                    }
                }
                break;
            default:
                break;
        }
        if (mssgerr !== '') {
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            datanotify.type = "error";
            datanotify.content = mssgerr;
            dispatch(showNotifi(datanotify));
            window.$(`#${id}`).focus();
        }
        return mssgerr;
    }
    async submitGroup() {

        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            var api = '/fund/addgrp';
            if (this.state.access == "update") {
                api = '/fund/updategrp';
            }
            RestfulUtils.post(api, this.state.datagroup)
                .then((res) => {
                    if (res.EC == 0) {
                        this.props.load()
                        this.props.closeModalDetail()
                    }
                })
        }
    }
    onChangeDate(type, event) {

        this.state.datagroup[type] = event.value;
        this.setState({ datagroup: this.state.datagroup })

    }
    addBacThang() {
        console.log('this.state.datagroup:',this.state.datagroup);
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            console.log('element:',element);
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }
        if (mssgerr == '')
   
            this.props.addBacThang(this.state.datagroup, this.props.access)

    }
    render() {
        const pageSize = 5; 
        var show =  (this.props.isTrailerfee == '1' || this.props.isTrailerfee == '2') && this.props.feetype == '002' ? true : false;
        return (
            <Modal show={this.props.showModalDetail}  backdropClassName="secondModal">
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == 'view' ? "col-md-12 disable" : "col-md-12"} style={{ paddingTop: "11px" }}>
                                    
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{show == true ? this.props.strings.frommonth : this.props.strings.fromvalue}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <NumberFormat maxLength={21} className="form-control" id="txtFromvalue" onValueChange={this.onValueChange.bind(this, 'fromvalue')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.fromvalue} value={this.state.datagroup["fromvalue"]} decimalScale={0} />

                                    </div>
                                </div>
                                
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{show == true ? this.props.strings.tomonth : this.props.strings.tovalue}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <NumberFormat maxLength={21} className="form-control" id="txtTovalue" onValueChange={this.onValueChange.bind(this, 'tovalue')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.tovalue} value={this.state.datagroup["tovalue"]} decimalScale={0} />

                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.fee}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <NumberFormat maxLength={21} className="form-control" id="txtFee" onValueChange={this.onValueChange.bind(this, 'fee')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.fee} value={this.state.datagroup["fee"]} decimalScale={this.props.isPercent == 1 ? 2 : 0} />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-12">
                                        <div className="pull-right">

                                            <input type="button" onClick={this.addBacThang.bind(this)} className="btn btn-primary" style={{ marginRight: 10 }} value={this.props.strings.submit} id="btnSubmitBT" />
                                        </div>
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

});
const decorators = flow([
    connect(stateToProps),
    translate('ModalBacThang')
]);
module.exports = decorators(ModalBacThang);
