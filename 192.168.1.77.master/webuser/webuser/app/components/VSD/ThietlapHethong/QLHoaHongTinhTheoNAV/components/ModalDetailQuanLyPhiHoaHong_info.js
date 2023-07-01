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

class ModalDetailQuanLyPhiHoaHong_info extends Component {
    constructor(props) {
        super(props);
        this.state = {

            access: 'add',
            CUSTID: '',
            disabled: false,
            new_create: false,

            datachange: {},

            datagroup: {
                p_id: '',
                p_applyobj: '',
                p_feetype: '',
                p_status: '',
                p_notes: '',
            },
            loadgrid: false,
            showModalDetail: false,
            titleModal2: '',
            isClear: true,
            checkFields: [
                { name: "p_applyobj", id: "drdApplyobj" },
                { name: "p_feetype", id: "drdFeetype" }
            ],
            listMembers: [],
            listFeetypes: [],
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
        this.getOptionsInfoGroups();
        this.getOptionsFeetypes();
        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()
                this.setState({

                    access: nextProps.access,
                    datagroup: {
                        p_id: nextProps.DATA.ID,
                        p_applyobj: nextProps.DATA.APPLYOBJ,
                        p_feetype: nextProps.DATA.FEETYPE,
                        p_deductionrate: nextProps.DATA.DEDCUTIONRATE,
                        p_expectacc: nextProps.DATA.EXPECTACC,
                        p_notes: nextProps.DATA.NOTES,
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
                        p_id: '',
                        p_applyobj: '',
                        p_feetype: '',
                        p_deductionrate: '',
                        p_expectacc: '',
                        p_notes: '',
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

    checkValid(name, id) {
        console.log
        let value = this.state.datagroup[name];
        let mssgerr = '';
        switch (name) {

            case "p_applyobj":
                if (value == '') {
                    mssgerr = this.props.strings.requireapplyobj;
                }
                break;
            case "p_feetype":
                if (value == '') {
                    mssgerr = this.props.strings.requiredfeetype;
                }
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
        console.log('this.state.datagroup:',this.state.datagroup);
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            var api = '/fund/addfee4groups';
            if (this.state.access == "update") {
                api = '/fund/updatefee4groups';
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
    onChangeDate(type, event) {

        this.state.datagroup[type] = event.value;
        this.setState({ datagroup: this.state.datagroup })

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
    async getOptionsInfoGroups() {
        let result = [];
        let result1 = [];
        
        let data = {
            p_language: this.props.lang,
            objname:'MEMBERS'
        }
        await RestfulUtils.post('/fund/getlistmember', { data }).then((res) => {
            if (res.EC == 0) {
                result = res.DT.data
                result.length > 0 && result.forEach(item => {
                    let option = new Object;
                    option.value = item.MBCODE;
                    option.label = item.SHORTNAME + '-' + item.MBNAME;
                    result1.push(option);
                });
                this.setState({
                    listMembers: result1
                });
            }
        });
    }

    async getOptionsFeetypes() {
        let result = [];
        let result1 = [];
        
        let data = {
            p_fee: '002',
        }
        await RestfulUtils.post('/fund/getlistfeetypes', { data }).then((res) => {
            if (res.EC == 0) {
                result = res.DT.data
                result.length > 0 && result.forEach(item => {
                    let option = new Object;
                    option.value = item.ID;
                    option.label = item.ID + ' - ' + item.FEENAME;
                    result1.push(option);
                });
                this.setState({
                    listFeetypes: result1
                });
            }
        });
    }

    render() {
        let displaydisablednew = this.state.access == 'view' || this.state.access == 'update' ? true : false
        let displaydisabled = this.state.access == 'view' ? true : false
        
        return (
            <Modal dialogClassName="your-dialog-classname" show={this.props.showModalDetail} backdropClassName="firstModal" size="lg" width="80%">
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">

                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>
                                
                                <div className="col-md-12 row">
                                    <div className="col-md-6">
                                        <div className="col-md-4">
                                            <h5 className="highlight"><b>{this.props.strings.applyobj}</b></h5>
                                        </div>
                                        <div className="col-md-8 ">
                                            <Select
                                                name="form-field-name"
                                                disabled={displaydisablednew}
                                                options={this.state.listMembers}
                                                value={this.state.datagroup.p_applyobj}
                                                onChange={this.onChange.bind(this, "p_applyobj")}
                                                id="drdApplyobj"
                                                clearable={false}
                                                backspaceRemoves={false}
                                            />
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-12 row ">
                                    <div className="col-md-6  ">
                                        <div className="col-md-4 ">
                                            <h5 className=""><b>{this.props.strings.deductionrate}</b></h5>
                                        </div>
                                        <div className="col-md-8">
                                            <NumberFormat maxLength={7} disabled={displaydisabled} decimalScale={4} className="form-control" id="txtDeductionrate" onValueChange={this.onValueChange.bind(this, 'p_deductionrate')} prefix={''} placeholder={this.props.strings.deductionrate} value={this.state.datagroup["p_deductionrate"]} allowNegative={false} />
                                        </div>
                                    </div>
                                    <div className="col-md-6  ">
                                        <div className="col-md-4 ">
                                            <h5 className=""><b>{this.props.strings.expectacc}</b></h5>
                                        </div>
                                        <div className="col-md-8">
                                            <input className="form-control" type="text" placeholder={this.props.strings.expectacc} id="txtExpectacc" value={this.state.datagroup["p_expectacc"]} onChange={this.onChange.bind(this, "p_expectacc")} maxLength={200} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-6">
                                        <div className="col-md-4">
                                            <h5 className="highlight"><b>{this.props.strings.feetype}</b></h5>
                                        </div>
                                        <div className="col-md-8 " >
                                            <Select
                                                name="form-field-name"
                                                disabled={displaydisablednew}
                                                options={this.state.listFeetypes}
                                                value={this.state.datagroup.p_feetype}
                                                onChange={this.onChange.bind(this, "p_feetype")}
                                                id="drdFeetype"
                                                clearable={false}
                                                backspaceRemoves={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6  ">
                                        <div className="col-md-4 ">
                                            <h5 className=""><b>{this.props.strings.notes}</b></h5>
                                        </div>
                                        <div className="col-md-8">
                                            <input disabled={displaydisablednew} className="form-control" type="text" placeholder={this.props.strings.notes} id="txtNotes" value={this.state.datagroup["p_notes"]} onChange={this.onChange.bind(this, "p_notes")} maxLength={100} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-md-12 row">
                                <div className="col-md-12">
                                    <div className="pull-right">

                                        <input disabled={displaydisabled} type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 10 }} value={this.props.strings.submit} id="btnSubmit" />
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
    translate('ModalDetailQuanLyPhiHoaHong_info')
]);
module.exports = decorators(ModalDetailQuanLyPhiHoaHong_info);
