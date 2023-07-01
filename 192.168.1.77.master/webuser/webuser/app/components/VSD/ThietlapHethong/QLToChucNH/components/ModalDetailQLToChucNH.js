import React, { Component, Fragment } from 'react';
import { Modal } from 'react-bootstrap'
import DropdownFactory from '../../../../../utils/DropdownFactory';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';


class ModalDetailQLToChucNH extends Component {
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
            new_create: false,
            datagroup: {

                p_autoid: '',
                p_shortname: '',
                p_mbcode: '',
                p_mbname: '',
                p_mbtype: '',
                p_address: '',
                p_legalperson: '',
                p_note: '',
                p_phone: '',
                p_email: '',
                pv_language: 'vie',
                p_dbcode: '',
                p_startaccnum: '',
                p_isagency: 'Y',
                p_issaleagency: 'Y',
            },
            checkFields: [
                { name:"p_dbcode",id: "txtDbcode" },
                { name: "p_shortname", id: "txtInstitutionid" },
                { name: "p_mbname", id: "txtInstitutionname" },
                { name: "p_mbname_en", id: "txtInstitutionnamevn" },
                { name: "p_mbtype", id: "drdIsbank" },
                // { name: "p_startaccnum", id: "txtStartAccNum" },
            ],
            isDone: true,
            dataRoles: [],
            loadgrid: false,
        };
    }

    requiredStartAccNum = 'C';

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
        console.log('nextProps:::puns',nextProps);

        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()
                this.setState({

                    datagroup: {

                        p_autoid: nextProps.DATA.AUTOID,
                        p_address: nextProps.DATA.ADDRESS,
                        p_mbcode: nextProps.DATA.MBCODE,
                        p_email: nextProps.DATA.EMAIL,
                        p_mbname_en: nextProps.DATA.MBNAME_EN?nextProps.DATA.MBNAME_EN:'',
                        p_legalperson: nextProps.DATA.LEGALPERSON,
                        p_phone: nextProps.DATA.PHONE,
                        p_shortname: nextProps.DATA.SHORTNAME,
                        p_mbname: nextProps.DATA.MBNAME,
                        p_note: nextProps.DATA.NOTE,
                        p_mbtype: nextProps.DATA.MBTYPE,
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME,
                        p_grptype: nextProps.DATA.GRPTYPE,
                        p_dbcode: nextProps.DATA.DBCODE,
                        p_startaccnum: nextProps.DATA.STARTACCNUM ? nextProps.DATA.STARTACCNUM.substring(1) : '', // bỏ ký tự C ở đầu
                        p_isagency: nextProps.DATA.ISAGENCY,
                        p_issaleagency: nextProps.DATA.ISSALEAGENCY
                    },
                    access: nextProps.access,
                    isDone: true

                })
            }
        }
        else
            if (nextProps.isClear) {
                this.props.change()
                this.setState({

                    datagroup: {

                        p_autoid: '',
                        p_mbcode: '',
                        p_shortname: '',
                        p_mbname: '',
                        p_mbtype: '',
                        p_address: '',
                        p_legalperson: '',
                        p_note: '',
                        p_phone: '',
                        p_email: '',
                        p_mbname_en: '',
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME,
                        p_grptype: 'TC',
                        p_dbcode: '',
                        p_startaccnum: '',
                        p_isagency: 'Y',
                        p_issaleagency: 'N'
                    },
                    new_create: true,
                    access: nextProps.access,

                })
            }
    }


    handleChange(type) {
        this.state.collapse[type] = !this.state.collapse[type];
        this.setState({ collapse: this.state.collapse })
    }
    onChange(type, event) {
        let data = {};
        if (event.target) {
            if (type == 'p_phone')
                this.state.datagroup[type] = event.target.value.trim();
            else this.state.datagroup[type] = event.target.value
        }
        else {
            this.state.datagroup[type] = event.value;
            //sửa trường là đại lý phân phối SSIAM từ không -> có
            // if (type == 'p_isagency' && !this.state.datagroup['p_dbcode']) {
            //     this.state.datagroup['p_dbcode'] = this.state.dataRoles.length > 0 ? this.state.dataRoles[0].VALUE : '';
            // }
        }
        this.setState({ datagroup: this.state.datagroup })
    }
    onSetDefaultValue = (type, value) => {
        if (!this.state.datagroup[type])
            this.state.datagroup[type] = value
    }
    getDataPost = () => {
        let data = JSON.parse(JSON.stringify(this.state.datagroup));
        if (data['p_isagency'] == 'Y') {
            data['p_issaleagency'] = 'N'
            data['p_dbcode'] = data['p_dbcode'];
            data['p_startaccnum'] = '';
        } else {
            data['p_dbcode'] = '';
            if (data['p_issaleagency'] == 'Y') {
                data['p_startaccnum'] = this.requiredStartAccNum + data['p_startaccnum'];
            } else {
                data['p_startaccnum'] = '';
            }
            
            
        }
        return data;
    }
    load() {
        this.setState({ loadgrid: true })
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
            var api = '/fund/addmember';
            if (this.state.access == "update") {
                api = '/fund/updatemember';
            }

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""
            }

            let data = this.getDataPost();

            RestfulUtils.posttrans(api, data)
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
    checkValid(name, id) {
        let value = this.state.datagroup[name];

        let mssgerr = '';
        switch (name) {

            case "p_shortname":
                if (value == '') {
                    mssgerr = this.props.strings.requiredmbcode;
                }
                break;
            case "p_mbname":
                if (value == '') {
                    mssgerr = this.props.strings.requiredmbname;
                }
                break;
            case "p_mbname_en":
                if (value == '') {
                    mssgerr = this.props.strings.requiredmbname_en;
                }
                break;
            case "p_mbtype":
                if (value == '') {
                    mssgerr = this.props.strings.requiredmbtype;
                }
                break;
            case "p_dbcode":
                if (this.state.datagroup["p_isagency"] == 'Y') {
                    if (value.length != 3) {
                        mssgerr = this.props.strings.requiredbcodelength;
                    }
                }
            // case "p_startaccnum":
            //     if (this.state.datagroup["p_grptype"] == 'TC') {
            //         if (value == '' || value.length != 2) mssgerr = this.props.strings.requiredstartaccnum;
            //     }
            //     break;

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
    async componentWillMount() {
        //console.log('componentWillMount:',JSON.parse(JSON.stringify(this.state)) );
        let that = this
        let data = {
            p_language: this.props.lang, 
            objname: this.props.OBJNAME,
        };
        await RestfulUtils.post('/fund/getlistroles', { data } )
            .then((res) => {
                if (res.DT.data && res.DT.data.length > 0) {
                    //that.state.datagroup['p_dbcode'] = res.DT.data[0].VALUE
                }
                that.setState({
                    ...that.state,
                    dataRoles: res.DT.data,
                    datagroup: that.state.datagroup
                })
            })
    }
    render() {
        //console.log('this.state:',JSON.parse(JSON.stringify(this.state)) );
        let displayy = this.state.access == 'view' ? true : false;
        let { dataRoles } = this.state;
        
        return (
            <Modal show={this.props.showModalDetail} bsSize="lg">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row ">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.institutionid}</b></h5>
                                    </div>
                                    <div className="col-md-5">
                                        <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.institutionid} id="txtInstitutionid" value={this.state.datagroup["p_shortname"]} onChange={this.onChange.bind(this, "p_shortname")} maxLength={20} />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.institutionname}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.institutionname} id="txtInstitutionname" value={this.state.datagroup["p_mbname"]} onChange={this.onChange.bind(this, "p_mbname")} maxLength={350} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.institutionname_vn}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.institutionname_vn} id="txtInstitutionnamevn" value={this.state.datagroup["p_mbname_en"]} onChange={this.onChange.bind(this, "p_mbname_en")} maxLength={350} />
                                    </div>
                                </div>
                                {/* <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.grptype}</b></h5>
                                    </div>
                                    <div className="col-md-5">
                                        <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup["p_grptype"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} value="p_grptype" CDTYPE="CF" CDNAME="CUSTTYPE" ID="drdgrptype" />
                                    </div>
                                </div> */}
                                <div className="col-md-12 row ">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.isbank}</b></h5>
                                    </div>
                                    <div className="col-md-5">
                                        <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup["p_mbtype"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} value="p_mbtype" CDTYPE="SY" CDNAME="YESNO" ID="drdIsbank" />
                                    </div>
                                </div>
                                
                                <div className="col-md-12 row ">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.isDistribution}</b></h5>
                                    </div>
                                    <div className="col-md-5">
                                        <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup["p_isagency"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} value="p_isagency" CDTYPE="SY" CDNAME="YESNO" ID="drdIsDistribution" />
                                    </div>
                                </div>

                                {this.state.datagroup["p_isagency"] == 'Y' && (
                                    <Fragment>
                                        <div className="col-md-12 row ">
                                            <div className="col-md-4">
                                                <h5 className="highlight"><b>{this.props.strings.dbcode}</b></h5>
                                            </div>
                                            <div className="col-md-5">
                                                <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.dbcode} id="txtDbcode" value={this.state.datagroup["p_dbcode"]} onChange={this.onChange.bind(this, "p_dbcode")} maxLength={3} />
                                            </div>
                                        </div>
                                    </Fragment>
                                )}

                                {this.state.datagroup["p_isagency"] == 'N' && (
                                    <Fragment>
                                        <div className="col-md-12 row ">
                                            <div className="col-md-4">
                                                <h5 className="highlight"><b>{this.props.strings.isSaleSSI}</b></h5>
                                            </div>
                                            <div className="col-md-5">
                                                <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup["p_issaleagency"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} value="p_issaleagency" CDTYPE="SY" CDNAME="YESNO" ID="drdIsSaleAgency" />
                                            </div>
                                        </div>
                                        {this.state.datagroup["p_issaleagency"] == 'Y' && (
                                            <Fragment>
                                                <div className="col-md-12 row">
                                                    <div className="col-md-4">
                                                        <h5 className="highlight"><b>{this.props.strings.startingOfAccountNumber}</b></h5>
                                                    </div>
                                                    <div className="col-md-5 custom-input-halfstatic">
                                                        <div className="static-text">988{this.requiredStartAccNum}</div>
                                                        <input disabled={displayy} className="form-control static-input" type="text" placeholder={this.props.strings.startingOfAccountNumber} id="txtStartAccNum" value={this.state.datagroup["p_startaccnum"]} onChange={this.onChange.bind(this, "p_startaccnum")} maxLength={6} />
                                                    </div> 
                                                </div>
                                            </Fragment>
                                        )}
                                    </Fragment>
                                )}
                                
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 ><b>{this.props.strings.address}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.address} id="txtAddress" value={this.state.datagroup["p_address"]} onChange={this.onChange.bind(this, "p_address")} maxLength={350} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.fullname}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.fullname} id="txtFullname" value={this.state.datagroup["p_legalperson"]} onChange={this.onChange.bind(this, "p_legalperson")} maxLength={350} />


                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.position}</b></h5>
                                    </div>
                                    <div className="col-md-5">
                                        <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.position} id="txtPosition" value={this.state.datagroup["p_note"]} onChange={this.onChange.bind(this, "p_note")} maxLength={350} />


                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.phone}</b></h5>
                                    </div>
                                    <div className="col-md-5">
                                        <input maxLength={50} disabled={displayy} className="form-control" id="txtPhone" placeholder={this.props.strings.phone} value={this.state.datagroup["p_phone"]} onChange={this.onChange.bind(this, "p_phone")} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.email}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.email} id="txtEmail" value={this.state.datagroup["p_email"]} onChange={this.onChange.bind(this, "p_email")} maxLength={350} />


                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="pull-right">

                                        <input disabled={displayy} type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />

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
    translate('ModalDetailQLToChucNH')
]);
module.exports = decorators(ModalDetailQLToChucNH);
// export default ModalDetail;
