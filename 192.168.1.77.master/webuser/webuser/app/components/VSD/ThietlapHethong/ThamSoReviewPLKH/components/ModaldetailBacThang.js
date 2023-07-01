import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import DropdownFactory from '../../../../../utils/DropdownFactory';
import NumberFormat from 'react-number-format';


class ModaldetailBacThang extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access: 'add',
            fee1: { value: 0, validate: null, tooltip: "Không được để trống !!" },
            fee2: { value: 0, validate: null, tooltip: "Không được để trống !!" },
            datachange: {},
            datagroup: {
                p_autoid: '',
                p_refautoid: '',
                p_framt: '',
                p_toamt: '',
                p_classcd: '',
                p_applycd: '',
                p_status: '',
                p_pstatus: '',
                p_lastchange: '',
                pv_language: '',
            },
            checkFields: [
                { name: "p_framt", id: "txtFromfee" },
                { name: "p_toamt", id: "txtTofee" },
            ],
        };
    }

    close() {

        this.props.closeModalDetail1();
    }
    /**
     * Trường hợp update thì hiển thị tất cả thông tin lên cho sửa
     * Trường hơp view thì ẩn các nút sửa không cho duyệt
     * Trường hợp add thì ẩn thông tin chỉ hiện thông tin chung cho người dùng -> Thực hiện -> Mở các thông tin tiếp theo cho người dùng khai
     * @param {*access} nextProps
     */
    componentWillReceiveProps(nextProps) {
        let self = this;


        if (nextProps.accessBACTHANG == "update" || nextProps.accessBACTHANG == "view") {
            if (nextProps.isClearbacthang) {
                this.props.change()
                this.setState({
                    datagroup: {
                        p_autoid: nextProps.databacthang.AUTOID,
                        p_refautoid: nextProps.databacthang.REFAUTOID,
                        p_framt: nextProps.databacthang.FRAMT,
                        p_toamt: nextProps.databacthang.TOAMT,
                        p_classcd: nextProps.databacthang.CLASSCD,
                        p_applycd: nextProps.databacthang.APPLYCD,
                        p_status: '',
                        pv_objname: this.props.OBJNAME,
                        pv_language: this.props.lang,
                    },
                    access: 'update',
                    p_framt: nextProps.databacthang.FRAMT,
                    p_toamt: nextProps.databacthang.TOAMT,
                    p_classcd: nextProps.databacthang.CLASSCD,
                    p_applycd: nextProps.databacthang.APPLYCD,
                    arrayclass: []
                })
            }
        }
        else
            if (nextProps.isClearbacthang) {
                /*
                console.log(nextProps.databacthang)
                let from = "0"
                let CLASSCD = '001'
                let countDATA = 0

                if (nextProps.databacthang.length > 0) {
                    CLASSCD = nextProps.databacthang[nextProps.databacthang.length - 1].CLASSCD
                    countDATA = nextProps.databacthang.length
                    from = nextProps.databacthang[nextProps.databacthang.length - 1].TOAMT

                }
*/
                this.props.change()
                this.setState({
                    datagroup: {
                        p_autoid: '',
                        p_refautoid: nextProps.refID,
                        p_framt: '',
                        p_toamt: '',
                        p_classcd: '',
                        p_applycd: '',
                        p_status: '',
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME
                    },
                    access: 'add',
                    arrayclass: []
                    // CLASSCD: CLASSCD,
                    // countDATA: countDATA
                })
            }
    }

    onChange(type, event) {
        this.state.datachange[type] = event.value;
        this.setState({ datachange: this.state.datachange })
    }
    onValueChange(type, data) {

        this.state.datagroup[type] = data.value
        this.setState(this.state)
    }
    handleChange = (selectedOption) => {
        this.setState({ selectedOption });

    }
    onChangeDRD(type, event) {
        let data = {};
        if (event.target) {

            this.state.datagroup[type] = event.target.value;
        }
        else {
            if(type=='p_applycd'){
                if(this.state.access=='add')
                this.loadADD(this.props.refID, event.value)
            }
           
            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup })
    }
   async loadADD(p_reviewtermid, p_applycd) {
        let that = this;
        let array = []
        let data = {
            p_reviewtermid: p_reviewtermid,
            p_applycd: p_applycd,
            OBJNAME: this.props.OBJNAME
        }
      await RestfulUtils.post('/fund/getframt', { data }).then((resData) => {
           // console.log('rew',resData)
    
             
            // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
            if (resData.EC == 0) {
                    that.state.datagroup["p_framt"] = resData.DT.p_framt
                    that.state.datagroup["p_classcd"] = resData.DT.p_classcd
                  
                    that.setState({
                        datagroup: that.state.datagroup,
               
                    })
                }
            
        });
    }
    createArrClass(value) {
       
    }
    onSetDefaultValue = (type, value) => {

        if (!this.state.datagroup[type]) {
            if (type == 'p_applycd') this.loadADD(this.props.refID, value)
            this.state.datagroup[type] = value
        }

    }
    checkValid(name, id) {
        let value = this.state.datagroup[name];
        let mssgerr = '';
        switch (name) {


            case "p_toamt":
                if (value == '') {
                    mssgerr = this.props.strings.requiredtoamt;
                } else {
                    if (parseInt(value) <=parseInt( this.state.datagroup["p_framt"]))
                        mssgerr = this.props.strings.requiredcondtion2;
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
            var api = '/fund/addreviewparam';
            if (this.state.access == "update") {
                api = '/fund/updatereviewparam';
            }

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }

            if (this.state.p_framt == this.state.datagroup["p_framt"] && this.state.p_toamt == this.state.datagroup["p_toamt"] && this.state.p_classcd == this.state.datagroup["p_classcd"] && this.state.p_applycd == this.state.datagroup["p_applycd"]) {
                datanotify.type = "error";
                datanotify.content = this.props.strings.error;
                dispatch(showNotifi(datanotify));
            } else {
              
                RestfulUtils.posttrans(api, this.state.datagroup)
                    .then((res) => {

                        if (res.EC == 0) {
                            datanotify.type = "success";
                            datanotify.content = this.props.strings.success;

                            dispatch(showNotifi(datanotify));
                            this.props.loadgridbacthang()
                            this.props.closeModalDetail1()

                        } else {
                            datanotify.type = "error";
                            datanotify.content = res.EM;
                            dispatch(showNotifi(datanotify));
                        }
                    })
            }
        }
    }
    render() {
       

       //// let index1 = this.state.access == 'add' ? this.state.datagroup["p_classcd"] : '00' + (parseInt(this.state.datagroup["p_classcd"]) - 1)
/*
        for (let index = parseInt(index1); index < 4; index++) {
            asynchronousProcess(function() {
                const element = '00' + (index + 1);
                arrayclass.push(element)
            });
           
        }
        */

        return (
            <Modal show={this.props.showModalDetail1}  backdropClassName="secondModal">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className="col-md-12" style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.fromfee}</b></h5>
                                    </div>
                                    <div className="col-md-8">

                                        <NumberFormat className="form-control" id="txtFromfee" onValueChange={this.onValueChange.bind(this, 'p_framt')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.fromfee} value={this.state.datagroup["p_framt"]} disabled={true} decimalScale={0} />
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.tofee}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <NumberFormat maxLength={21} className="form-control" id="txtTofee" onValueChange={this.onValueChange.bind(this, 'p_toamt')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.tofee} value={this.state.datagroup["p_toamt"]} decimalScale={0} />
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.custtype}</b></h5>
                                    </div>
                                    <div className="col-md-8 disable">
                                        <DropdownFactory CDVAL={this.state.datagroup.p_classcd} onSetDefaultValue={this.onSetDefaultValue} value="p_classcd" CDTYPE="CF" CDNAME="CLASS" onChange={this.onChangeDRD.bind(this)} ID="drdClasscd"  />
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.apply}</b></h5>
                                    </div>
                                    <div className={this.state.access=='add'?"col-md-8 customSelect ":"col-md-8 customSelect disable"}>
                                        <DropdownFactory CDVAL={this.state.datagroup.p_applycd} onSetDefaultValue={this.onSetDefaultValue} value="p_applycd" CDTYPE="SE" CDNAME="NORS" onChange={this.onChangeDRD.bind(this)} ID="drdApplycd" />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        <input type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmitTSBT" />
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
    lang: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('ModaldetailBacThang')
]);
module.exports = decorators(ModaldetailBacThang);
// export default ModalDetail;
