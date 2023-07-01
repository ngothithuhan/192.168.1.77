import React, { Component } from 'react';
import DropdownFactory from 'app/utils/DropdownFactory'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import CreateListPhanQuyen from './CreateListPhanQuyen';
import CreateListNguoiDung1 from './CreateListNguoiDung1';
import { Modal } from 'react-bootstrap'
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';


class ModalDetailGroupinfo extends Component {
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
            showModalDetail: false,
            showModalDetail2: false,
            titleModal: '',
            CUSTID_VIEW: -1,
            phone: { value: 0, validate: null, tooltip: "Không được để trống !!" },
            datagroup: {
                p_grpid: '',
                p_grpname: '',
                p_grptype: '',
                p_active: '',
                p_description: '',
                p_grpright: 'aa',
                p_rolecode: '',
                pv_language: 'VN',
            },
            checkFields: [
                { name: "p_grpname", id: "txtGroupname" },
            ],
            dataphanquyen: '',
            datanguoidung: '',
            dataPQ:'',
            dataNDNOIN:[],
            dataNDIN:[]
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
                    display: {
                        fatca: true,
                        authorize: true,
                        upload: true,
                        quydangki: true
                    },
                    datagroup: {
                        p_grpid: nextProps.DATA.GRPID,
                        p_grpname: nextProps.DATA.GRPNAME,
                        p_grptype: nextProps.DATA.GRPTYPE,
                        p_active: nextProps.DATA.ACTIVE,
                        p_description: nextProps.DATA.DESCRIPTION,
                        p_grpright: '',
                        p_rolecode: nextProps.DATA.ROLECODE,
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME

                    },
                    access: nextProps.access,
                    dataphanquyen: '',
                    datanguoidung: '',
                    dataPQ:'',
              
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
                    datagroup: {
                        p_grpid: '',
                        p_grpname: '',
                        p_grptype: '',
                        p_active: '',
                        p_description: '',
                        p_grpright: 'aa',
                        p_rolecode: '',
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME

                    },
                    new_create: true,
                    access: nextProps.access,
                    dataphanquyen: '',
                    datanguoidung: '',
                    dataPQ:'',
                    dataNDNOIN:[],
                    dataNDIN:[]
                })
            }
    }




    showModal() {
        this.setState({
            showModalDetail: true,
            
        });
    }
    showModal2() {
        this.setState({
            showModalDetail2: true
        });
    }
    closeModal() {
        this.setState({
            showModalDetail: false
        });
    }
    closeModal2() {
        this.setState({
            showModalDetail2: false
        });
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
    onSetDefaultValue = (type, value) => {
        if (!this.state.datagroup[type])
            this.state.datagroup[type] = value
    }
    /*
    async submitGroup() {
        var mssgerr = '';
        var api1 = ''
        var data = ''
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            var api = '/group/add';
            if (this.state.access == "update") {
                api = '/group/update';
            }

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }

            await axios.post(api, this.state.datagroup)
                .then((res) => {
                    if (res.data.EC == 0) {
                        if (this.state.dataphanquyen != '' || this.state.datanguoidung != '') {
                            api1 = this.state.dataphanquyen != '' ? '/fund/assign_rights_group' : '/fund/addtlgrpusers_list'
                            data = this.state.dataphanquyen != '' ? this.state.dataphanquyen : this.state.datanguoidung
                            console.log('1')
                            console.log(api1)
                            console.log(data)
                            axios.post(api1, data)
                                .then((res1) => {
                                    if (res1.data.EC == 0) {
                                        if (this.state.datanguoidung != '' && this.state.dataphanquyen != '') {
                                            console.log(api1)
                                            if (api1 == '/fund/addtlgrpusers_list') api1 = '/fund/assign_rights_group'
                                            else api1 = '/fund/addtlgrpusers_list'
                                            if (api1 == '/fund/addtlgrpusers_list') data = this.state.datanguoidung
                                            else data = this.state.dataphanquyen
                                            console.log('2')
                                            console.log(api1)
                                            console.log(data)
                                            axios.post(api1, data)
                                                .then((res2) => {
                                                    if (res2.data.EC == 0) {
                                                        datanotify.type = "success";
                                                        datanotify.content = "Thành công";
                                                        dispatch(showNotifi(datanotify));
                                                        this.props.load()
                                                        this.props.closeModalDetail()
                                                    } else {
                                                        datanotify.type = "error";
                                                        datanotify.content = '2 ' + res2.data.EM;
                                                        dispatch(showNotifi(datanotify));
                                                    }
                                                })
                                        } else {
                                            datanotify.type = "success";
                                            datanotify.content = "Thành công";
                                            dispatch(showNotifi(datanotify));
                                            this.props.load()
                                            this.props.closeModalDetail()
                                        }
                                    } else {
                                        datanotify.type = "error";
                                        datanotify.content = '1 ' + res1.data.EM;
                                        dispatch(showNotifi(datanotify));
                                    }
                                })
                        } else {
                            datanotify.type = "success";
                            datanotify.content = "Thành công";
                            dispatch(showNotifi(datanotify));
                            this.props.load()
                            this.props.closeModalDetail()
                        }
                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.data.EM;
                        dispatch(showNotifi(datanotify));
                    }

                })
        }

    }
    */
   async submitGroup() {
    var mssgerr = '';

    for (let index = 0; index < this.state.checkFields.length; index++) {
        const element = this.state.checkFields[index];
        mssgerr = this.checkValid(element.name, element.id);
        if (mssgerr !== '')
            break;
    }

    if (mssgerr == '') {
        var api = '/group/add';
        if (this.state.access == "update") {
            api = '/group/update';
        }

        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }

        await RestfulUtils.posttrans(api, this.state.datagroup)
            .then((res) => {
                if (res.EC == 0) {
                        datanotify.content = this.props.strings.success;
                        datanotify.type = "success";
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

            case "p_grpname":
                if (value == '') {
                    mssgerr = this.props.strings.requiredgrpname;
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
    getPhanQuyen(data,dataPQ) {
      
        this.setState({
            dataphanquyen: data,
            dataPQ:dataPQ
        })
    }
    getNguoiDung(data,dataIN,dataNOIN,tochuc,chinhanh) {
    
        this.setState({
            datanguoidung: data,
          //  dataNDNOIN:dataNOIN,
          //  dataNDIN:dataIN,
           // tochuc:tochuc,
           // chinhanh:chinhanh

        })
    }
    render() {

        const pageSize = 5;
        let displayy=this.state.access=='view'?true:false
        return (
            <Modal show={this.props.showModalDetail} bsSize="lg" backdropClassName="firstModal">
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">

                        <div className="add-info-account">
                            <div className="col-md-12 " style={{ paddingTop: "11px" }}>
                                <div className={this.state.access == "view" ? "panel panel-default disable" : "panel panel-default"}>
                                    <div className="panel-heading">{this.props.strings.title}</div>
                                    <div className="panel-body">

                                        <div className="col-md-12 row">
                                            {/* <div className="col-md-3">
                                                <h5 className="highlight"><b>{this.props.strings.groupid}</b></h5>
                                            </div>
                                            <div className="col-md-3">
                                                <input className="form-control" type="text" placeholder={this.props.strings.groupid} id="txtgroupid" value={this.state.datagroup["p_grpid"]} onChange={this.onChange.bind(this, "p_grpid")} />
                                            </div> */}
                                            <div className="col-md-3">
                                                <h5 className="highlight"><b>{this.props.strings.groupname}</b></h5>
                                            </div>
                                            <div className="col-md-3">
                                                <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.groupname} id="txtGroupname" value={this.state.datagroup["p_grpname"]} onChange={this.onChange.bind(this, "p_grpname")} maxLength={100}/>
                                            </div>
                                            <div className="col-md-3">
                                                <h5 className="highlight"><b>{this.props.strings.status}</b></h5>
                                            </div>
                                            <div className="col-md-3">

                                                <DropdownFactory disabled={displayy} onSetDefaultValue={this.onSetDefaultValue} CDVAL={this.state.datagroup.p_active} value="p_active" CDTYPE="SA" CDNAME="ACTIVE" onChange={this.onChange.bind(this)} ID="drdStatus" />
                                            </div>
                                        </div>
                                        <div className="col-md-12 row">
                                            <div className="col-md-3">
                                                <h5 className="highlight" ><b>{this.props.strings.roletype}</b></h5>
                                            </div>
                                            <div className="col-md-3">
                                                <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup.p_rolecode} onSetDefaultValue={this.onSetDefaultValue} value="p_rolecode" CDTYPE="SA" CDNAME="ROLECODE" onChange={this.onChange.bind(this)} ID="drdRoletype" />
                                            </div>
                                            <div className="col-md-3">
                                                <h5 className="highlight" ><b>{this.props.strings.grouptype}</b></h5>
                                            </div>
                                            <div className="col-md-3">
                                                <DropdownFactory disabled={displayy} onSetDefaultValue={this.onSetDefaultValue} CDVAL={this.state.datagroup.p_grptype} value="p_grptype" CDTYPE="SA" CDNAME="GRPTYPE" onChange={this.onChange.bind(this)} ID="drdGrouptype" />
                                            </div>
                                        </div>

                                        <div className="col-md-12 row">

                                            <div className="col-md-3">
                                                <h5 ><b>{this.props.strings.desc}</b></h5>
                                            </div>
                                            <div className="col-md-9">
                                                <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.desc} id="txtDesc" value={this.state.datagroup["p_description"]} onChange={this.onChange.bind(this, "p_description")} maxLength={500}/>
                                            </div>
                                        </div>


                                    </div>
                                </div>

                                <div className="panel panel-default" style={{ display: this.state.access == "add" ? "none" : "block" }}>
                                    <div className="panel-heading">{this.props.strings.function}</div>
                                    <div className="panel-body">
                                        <input type="button" onClick={this.showModal.bind(this)} className="btn btn-dark" style={{ marginBottom: 10, marginLeft: 10, marginRight: 5 }} value={this.props.strings.permission} id="btnPermission" disabled={this.props.user=='000001'?false:true} />
                                        <input type="button" onClick={this.showModal2.bind(this)} className="btn btn-dark" style={{ marginBottom: 10, marginRight: 5 }} value={this.props.strings.user} id="btnUser" />
                                    </div>
                                </div>
                                <div className={this.state.access == "view" ? "col-md-12 row disable" : "col-md-12 row "}>
                                    <div className="pull-right">
                                        <input disabled={displayy} type="button" className="btn btn-primary" style={{ marginRight: -17, marginTop: 10 }} value={this.props.strings.submit} id="btnSubmit" onClick={this.submitGroup.bind(this)} />

                                    </div>
                                </div>
                            </div>


                            <Modal show={this.state.showModalDetail} bsSize="lg" dialogClassName="custom-modal" backdropClassName="secondModal">
                                <Modal.Header  >
                                    <Modal.Title ><div className="title-content col-md-6">{this.props.strings.permission}<button type="button" onClick={this.closeModal.bind(this)} className="close" ><span aria-hidden="true" id="closePQ">×</span><span className="sr-only" >Close</span></button></div></Modal.Title>
                                </Modal.Header>
                                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                                    <CreateListPhanQuyen OBJNAME={this.props.OBJNAME} groupid={this.state.datagroup.p_grpid}
                                        access={this.state.access} getPhanQuyen={this.getPhanQuyen.bind(this)} 
                                        //dataphanquyen={this.state.dataPQ}
                                        // dataphanquyenSTR={this.state.dataphanquyen}
                                        />
                                </Modal.Body>
                            </Modal>


                            <Modal show={this.state.showModalDetail2} bsSize="lg" backdropClassName="secondModal">
                                <Modal.Header  >
                                    <Modal.Title ><div className="title-content col-md-6">{this.props.strings.user}<button type="button" onClick={this.closeModal2.bind(this)} className="close" ><span aria-hidden="true" id="closeUser">×</span><span className="sr-only" >Close</span></button></div></Modal.Title>
                                </Modal.Header>
                                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                                    <CreateListNguoiDung1 OBJNAME={this.props.OBJNAME}
                                        access={this.state.access}
                                        groupid={this.state.datagroup.p_grpid}
                                        getNguoiDung={this.getNguoiDung.bind(this)}
                                       // dataNDNOIN={this.state.dataNDNOIN}
                                       // dataNDIN={this.state.dataNDIN}
                                       // tochuc={this.state.tochuc}
                                       // chinhanh={this.state.chinhanh}
                                    />
                                </Modal.Body>
                            </Modal>

                        </div>



                    </div>




                </Modal.Body>

            </Modal>
        );
    }
}
ModalDetailGroupinfo.defaultProps = {

    strings: {
        title: 'Tạo mới nhóm User'

    },


};
const stateToProps = state => ({
    lang: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('ModalDetailGroupinfo')
]);

module.exports = decorators(ModalDetailGroupinfo);
