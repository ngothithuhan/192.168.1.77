import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import Select from 'react-select';
import { showNotifi } from 'app/action/actionNotification.js';
import NumberFormat from 'react-number-format';
import { getExtensionByLang } from 'app/Helpers'


class ModalDetailQLKV extends Component {
    constructor(props) {
        super(props);
        this.state = {

            CODEID: { value: '', label: '' },
            access: 'add',

            datagroup: {

                p_brid: '',
                p_mbid: '',
                p_brname: '',
                p_areaid: '',
                p_dcname: '',
                p_brdeputy: '',
                p_broffice: '',
                p_brtele: '',
                p_bremail: '',
                p_status: '',
                p_description: '',
                pv_language: this.props.lang,
                p_braddress: '',


            },

            checkFields: [


                { name: "p_areaname", id: "txtareaname" },
                { name: "p_areaname_en", id: "txtareaname_en" },
                { name: "p_mbid", id: "txtMbid" },

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

        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()
                this.setState({

                    datagroup: {
                        p_areaid: nextProps.DATA.AREAID,
                        p_areaname: nextProps.DATA.AREANAME,
                        p_areaname_en: nextProps.DATA.AREANAME_EN,
                        p_mbid: nextProps.DATA.MBID,
                        p_legalperson: nextProps.DATA.LEGALPERSON,
                        p_phone: nextProps.DATA.PHONE,
                        p_email: nextProps.DATA.EMAIL,
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME
                    },

                    access: nextProps.access,
                    CODEID: { value: nextProps.DATA.MBID, label: nextProps.DATA[getExtensionByLang("MBNAME",this.props.lang)]},


                })
            }
        }
        else
            if (nextProps.isClear) {
                this.props.change()
                this.setState({

                    datagroup: {

                        p_areaid: '',
                        p_areaname: '',
                        p_areaname_en: '',
                        p_mbid: '',
                        p_legalperson: '',
                        p_phone: '',
                        p_email: '',
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME

                    },

                    access: nextProps.access,

                    CODEID: { value: '', label: '' },
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
        }
        this.setState({ datagroup: this.state.datagroup })
    }
    onSetDefaultValue = (type, value) => {
        if (!this.state.datagroup[type])
            this.state.datagroup[type] = value
    }
    checkValid(name, id) {
        let value = this.state.datagroup[name];
        let mssgerr = '';
        switch (name) {

            case "p_areaname":
                if (value == '') {
                    mssgerr = this.props.strings.requiredbrname;
                }
                break;
            case "p_areaname_en":
                if (value == '') {
                    mssgerr = this.props.strings.requiredareaname_en;
                }
                break;
            case "p_mbid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredmbid;
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
            var api = '/fund/addarea';
            if (this.state.access == "update") {
                api = '/fund/updatearea';
            }

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            // console.log('aa', this.state.datagroup)
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
    onChangeDRD(type, event) {

        let data = {};
        if (event.target) {

            this.state.datagroup[type] = event.target.value;
        }
        else {
            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup })
    }
    getOptionsSYMBOL(input) {
        return RestfulUtils.post('/allcode/search_all_mb', { data:{CDNAME: "MEMBERS", CDTYPE: "SA"},language:this.props.lang })
            .then((res) => {

                return { options: res }
            })
    }
    onChangeSYMBOL(e) {

        var that = this
        if (e && e.value)
            // this.getSessionInfo(e.value);
            this.state.datagroup["p_mbid"] = e.value
        else this.state.datagroup["p_mbid"] = ''
        this.setState({
            CODEID: e,
            datagroup: this.state.datagroup
        })


    }
    onValueChange(type, data) {

        this.state.datagroup[type] = data.value
        this.setState(this.state)
    }
    render() {
        let displayy = this.state.access == 'view' ? true : false
        let isDisableWhenView = (this.state.access != 'add')
        return (
            <Modal show={this.props.showModalDetail} bsSize="lg">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body " >
                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>
                                {isDisableWhenView &&
                                    <div className="col-md-12 row">
                                        <div className="col-md-3">
                                            <h5 className="highlight"><b>{this.props.strings.branhchid}</b></h5>
                                        </div>
                                        <div className="col-md-5">
                                            <input className="form-control" disabled={this.state.access == 'update' ? true : displayy} type="text" placeholder={this.props.strings.branhchid} id="txtareaid" value={this.state.datagroup["p_areaid"]} onChange={this.onChange.bind(this, "p_areaid")} />
                                        </div>
                                    </div>
                                }

                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.branhchname}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input className="form-control" disabled={displayy} type="text" placeholder={this.props.strings.branhchname} id="txtareaname" value={this.state.datagroup["p_areaname"]} onChange={this.onChange.bind(this, "p_areaname")} maxLength={250} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.branhchnameen}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input className="form-control" disabled={displayy} type="text" placeholder={this.props.strings.branhchnameen} id="txtareaname_en" value={this.state.datagroup["p_areaname_en"]} onChange={this.onChange.bind(this, "p_areaname_en")} maxLength={250} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.institutionname}</b></h5>
                                    </div>
                                    <div className="col-md-9 customSelect">
                                        <Select.Async
                                            name="form-field-name"
                                            loadOptions={this.getOptionsSYMBOL.bind(this)}
                                            value={this.state.CODEID}
                                            onChange={this.onChangeSYMBOL.bind(this)}
                                            id="txtMbid"
                                            disabled={displayy}
                                        //  searchable={false}
                                        />                                    </div>
                                </div>



                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.fullname}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input className="form-control" disabled={displayy} type="text" placeholder={this.props.strings.fullname} id="txtFullname" value={this.state.datagroup["p_legalperson"]} onChange={this.onChange.bind(this, "p_legalperson")} maxLength={350} />


                                    </div>
                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.phone}</b></h5>
                                    </div>
                                    <div className="col-md-5">
                                        <NumberFormat format="##################################################" disabled={displayy} className="form-control" id="txtPhone" placeholder={this.props.strings.phone} value={this.state.datagroup["p_phone"]} onChange={this.onChange.bind(this, "p_phone")} />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.email}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input className="form-control" type="text" disabled={displayy} placeholder={this.props.strings.email} id="txtEmail" value={this.state.datagroup["p_email"]} onChange={this.onChange.bind(this, "p_email")} maxLength={350} />


                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="pull-right">

                                        <input type="button" disabled={displayy} onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />

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
    translate('ModalDetailQLKV')
]);
module.exports = decorators(ModalDetailQLKV);
// export default ModalDetail;
