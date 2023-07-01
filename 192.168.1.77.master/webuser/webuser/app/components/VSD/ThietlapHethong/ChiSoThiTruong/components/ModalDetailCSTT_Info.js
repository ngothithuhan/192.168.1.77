import React, { Component } from 'react';
import { Modal} from 'react-bootstrap'
import { connect } from 'react-redux'
import DateInput from 'app/utils/input/DateInput';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import NumberFormat from 'react-number-format';


class ModalDetailCSTT_Info extends Component {
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
            checkFields: [

                { name: "p_txdate", id: "txtDate" },
                { name: "p_vnindex", id: "txtvnindex" },
                { name: "p_hnxindex", id: "txthnxindex" },
                { name: "p_vn30index", id: "txtvn30" },
                { name: "p_hnx30index", id: "txthnx30" },

            ],
            datagroup: {}
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
                this.setState({
                    display: {
                        fatca: true,
                        authorize: true,
                        upload: true,
                        quydangki: true
                    },
                    datagroup: {
                        p_autoid: nextProps.DATA.AUTOID,
                        p_txdate: nextProps.DATA.TXDATE,
                        p_vnindex:parseFloat(nextProps.DATA.VNINDEX),
                        p_hnxindex: parseFloat(nextProps.DATA.HNXINDEX),
                        p_vn30index: parseFloat(nextProps.DATA.VN30INDEX),
                        p_hnx30index: parseFloat(nextProps.DATA.HNX30INDEX),
                        p_status: '',
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME
                    },
                    datagroup1: {
                        p_autoid: nextProps.DATA.AUTOID,
                        p_txdate: nextProps.DATA.TXDATE,
                        p_vnindex: parseFloat(nextProps.DATA.VNINDEX),
                        p_hnxindex: parseFloat(nextProps.DATA.HNXINDEX),
                        p_vn30index: parseFloat(nextProps.DATA.VN30INDEX),
                        p_hnx30index:parseFloat( nextProps.DATA.HNX30INDEX),
                        p_status: '',
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME
                    },
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
                    new_create: true,
                    datagroup: {
                        p_autoid: '',
                        p_txdate: nextProps.tradingdate,
                        p_vnindex: '',
                        p_hnxindex: '',
                        p_vn30index: '',
                        p_hnx30index: '',
                        p_status: '',
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME
                    },
                    access: nextProps.access,
                    tradingdate: nextProps.tradingdate
                })
            }
    }


    handleChange(type) {
        this.state.collapse[type] = !this.state.collapse[type];
        this.setState({ collapse: this.state.collapse })
    }
    checkValid(name, id) {


        let value = this.state.datagroup[name];
        let mssgerr = '';
        switch (name) {

            case "p_txdate":
                if (value == '') {
                    mssgerr = this.props.strings.requiredtxdate;
                }
                break;
            case "p_vnindex":
                if (value == '') {
                    mssgerr = this.props.strings.requiredvnindex;
                } else {
                    if (value <= 0) mssgerr = this.props.strings.required0;
                }
                break;
            case "p_hnxindex":
                if (value == '') {
                    mssgerr = this.props.strings.requiredhnxindex;
                } else {
                    if (value <= 0) mssgerr = this.props.strings.required0;
                }
                break;
            case "p_vn30index":
                if (value == '') {
                    mssgerr = this.props.strings.requiredvn30index;
                } else {
                    if (value <= 0) mssgerr = this.props.strings.required0;
                }
                break;
            case "p_hnx30index":
                if (value == '') {
                    mssgerr = this.props.strings.requiredhnx30index;
                } else {
                    if (value <= 0) mssgerr = this.props.strings.required0;
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
            var api = '/fund/addmarketinfo';
            if (this.state.access == "update") {
                api = '/fund/updatemarketinfo';
            }

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            if (this.state.access == 'update') {
             //   console.log(this.state.datagroup["p_vnindex"])
                if ( this.state.datagroup["p_vnindex"] == this.state.datagroup1["p_vnindex"] && this.state.datagroup["p_hnxindex"] == this.state.datagroup1["p_hnxindex"] && this.state.datagroup["p_vn30index"] == this.state.datagroup1["p_vn30index"] && this.state.datagroup["p_hnx30index"] == this.state.datagroup1["p_hnx30index"]) {
                    datanotify.type = "error";
                    datanotify.content = this.props.strings.errmess;
                    dispatch(showNotifi(datanotify));
                } else {
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
            } else {
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


    }

    onChangeDate(type, event) {

        this.state.datagroup[type] = event.value;
        this.setState({ datagroup: this.state.datagroup })

    }
    onValueChange(type, data) {

        this.state.datagroup[type] = data.value
        this.setState(this.state)
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
        const pageSize = 5;
        var displayy=this.state.access=="view"?true:false
        return (
            <Modal show={this.props.showModalDetail}>
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row " >
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.date}</b></h5>
                                    </div>
                                    <div className="col-md-9 fixWidthDatePickerForOthers">
                                        <DateInput disabled={this.state.access!='add'?true:false} onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["p_txdate"]} type="p_txdate" id="txtDate" />
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.vnindex}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <NumberFormat maxLength={21} disabled={displayy} className="form-control" id="txtvnindex" onValueChange={this.onValueChange.bind(this, 'p_vnindex')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.vnindex} value={this.state.datagroup["p_vnindex"]} decimalScale={2} />
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.hnxindex}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <NumberFormat maxLength={21} disabled={displayy} className="form-control" id="txthnxindex" onValueChange={this.onValueChange.bind(this, 'p_hnxindex')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.hnxindex} value={this.state.datagroup["p_hnxindex"]} decimalScale={2} />
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.vn30}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <NumberFormat maxLength={21} disabled={displayy} className="form-control" id="txtvn30" onValueChange={this.onValueChange.bind(this, 'p_vn30index')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.vn30} value={this.state.datagroup["p_vn30index"]} decimalScale={2} />
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.hnx30}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <NumberFormat maxLength={21} disabled={displayy} className="form-control" id="txthnx30" onValueChange={this.onValueChange.bind(this, 'p_hnx30index')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.hnx30} value={this.state.datagroup["p_hnx30index"]} decimalScale={2} />
                                    </div>

                                </div>
                                {/*
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.note}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input className="form-control" type="text" placeholder={this.props.strings.note} id="txtNote" value={this.state.datagroup["p_bremail"]} onChange={this.onChange.bind(this, "p_bremail")} />
                                    </div>

                                </div>
                                */}


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
    lang: state.language.language,
    tradingdate: state.systemdate.tradingdate
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalDetailCSTT_Info')
]);
module.exports = decorators(ModalDetailCSTT_Info);
// export default ModalDetail;
