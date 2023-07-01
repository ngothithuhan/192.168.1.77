import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import DropdownFactory from '../../../../../utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';
import * as XLSX from 'xlsx';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import moment from 'moment';


class ModalDetailQLThongBao_Info extends Component {
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
            isListView: false,
            resultview: '',
            access: 'add',
            CUSTID: '',
            disabled: false,
            new_create: false,
            datachange: {},
            datagroup: {
                p_alerttype: '',
                p_list: '',
                p_shortcontent: '',
                p_maincontent: '',
                p_alerttype: '',
                //p_createtime: '',
                pv_language: this.props.lang,
                p_autoid: ''
            },
            enable: "none",
            checkFields: [
                { name: "stringresultlist", id: "btnFileInput" },
                { name: "p_senddate", id: "txtCreatetime" },
                { name: "p_shortcontent", id: "txtShortcontent" },
                { name: "p_maincontent", id: "txtMaincontent" },
            ],
            isDone: true
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

                if (nextProps.DATA.ALERTTYPE == 'L') {
                    this.state.enable = "block"
                } else this.state.enable = "none"
                this.setState({
                    display: {
                        fatca: true,
                        authorize: true,
                        upload: true,
                        quydangki: true
                    },
                    datagroup: {
                        p_shortcontent: nextProps.DATA.SHORTCONTENT,
                        p_maincontent: nextProps.DATA.MAINCONTENT,
                        p_alerttype: nextProps.DATA.ALERTTYPE,
                        p_list: nextProps.DATA.LIST,
                        p_senddate : nextProps.DATA.SENDDATE ,
                        pv_language: this.props.lang,
                        p_autoid: nextProps.DATA.AUTOID,
                        pv_objname: this.props.OBJNAME
                    },
                    isListView: false,
                    isDone: true,
                    access: nextProps.access
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
                    isListView: false,
                    datagroup: {
                        p_shortcontent: '',
                        p_maincontent: '',
                        p_alerttype: '',
                        p_list: '',
                        p_senddate : '',
                        pv_language: this.props.lang,
                        p_autoid: '',
                        pv_objname: this.props.OBJNAME
                    },
                    enable: 'none',
                    isDone: false,
                    access: nextProps.access,
                    fileName: ''
                })
            }
    }
    componentDidMount() {
        window.$("#drdALERTTYPE").focus();
        // io.socket.post('/account/get_detail',{CUSTID:this.props.CUSTID_VIEW,TLID:"0009"}, function (resData, jwRes) {
        //     console.log('detail',resData)
        //     // self.setState({generalInformation:resData});

        // });

    }
    createSuccess(CUSTID, access, new_create) {
        this.setState(
            {
                display: {
                    fatca: true,
                    authorize: true,
                    upload: true,
                    quydangki: true
                },
                access: 'update',
                CUSTID: CUSTID,
                new_create
            }
        )
        this.props.createSuccess(access);

    }
    handleChange(type) {
        this.state.collapse[type] = !this.state.collapse[type];
        this.setState({ collapse: this.state.collapse })
    }
    onSetDefaultValue = (type, value) => {
        if (!this.state.datagroup[type])
            this.state.datagroup[type] = value
    }
    onChange(type, event) {
        let data = {};

        if (event.target) {

            this.state.datagroup[type] = event.target.value;
        }
        else {

            if (event.value == 'L') this.state.enable = "block"
            else {
                this.state.enable = "none"
                this.state.isListView = false
            }
            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup })
    }
    onChangeDate(type, event) {
        //console.log(event)
        this.state.datagroup[type] = event.value;
        this.setState({ datagroup: this.state.datagroup })

    }
    async submitGroup() {

        //console.log('check valid this.state.fileName ', this.state.fileName)
        var mssgerr = '';

        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }
        if (mssgerr == '') {
            var api = '/fund/addnoti';
            if (this.state.access == "update") {
                api = '/fund/updatenoti';
            }

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            //console.log(' this.state.datagroup', this.state.datagroup)
            //console.log("resultString>>>", this.state.datagroup.p_list);
            RestfulUtils.posttrans(api, this.state.datagroup)
                .then((res) => {
                    //console.log('res.data',res.data )
                    if (res.EC == 0) {
                        datanotify.type = "success";
                        datanotify.content = this.props.strings.success;
                        dispatch(showNotifi(datanotify));
                        this.props.load()
                        this.props.closeModalDetail()
                    } else {
                        datanotify.type = "error";
                        datanotify.content = this.props.strings.fail;
                        dispatch(showNotifi(datanotify));
                    }

                })
        }

    }
    checkValid(name, id) {
        let value = this.state.datagroup[name];

        let mssgerr = '';

        switch (name) {
            case "stringresultlist":
                if (this.state.enable == 'block' && this.state.datagroup.p_list == '') {
                    //console.log('check valid this.state.fileName ', this.state.fileName)
                    mssgerr = this.props.strings.requiredlinkfile;
                }
                break;
            case "p_senddate":
                if (value == '') {
                    mssgerr = this.props.strings.requiredcreatetime;
                }
                break;
            case "p_shortcontent":
                if (value == '') {
                    mssgerr = this.props.strings.requiredshortcontent;
                }
                break;
            case "p_maincontent":
                if (value == '') {
                    mssgerr = this.props.strings.requiredmaincontent;
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

    _handleFileChange = (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                SIGN_IMG: reader.result
            })
        }


        reader.readAsDataURL(file)
    }
    get_Message(type, contentText) {
        let color = type == "error" ? "red" : "green"
        return { color, contentText }
    }
    readDataImportFile() {
        let file = this.state.file;
        //console.log('readDataImportFile', file)
        if (file) {
            let reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                this.validateFileExel(data);
                /* Update state */
                //console.log("Data>>>", data);
                this.state.datagroup.p_list = ''
                for (var i = 0; i < data.length; i++) {
                    if (data[i][0] == data[0][0]) {
                        this.state.datagroup.p_list += data[i][0]
                    }
                    else {
                        this.state.datagroup.p_list += '~$~' + data[i][0]
                    }
                }

                this.setState({ datagroup: this.state.datagroup })


            }

            reader.readAsBinaryString(file);
        }
        else {
            this.setState({ err_msg: this.get_Message('error', 'Chưa chọn file') })
        }
    }
    validateFileExel(data) {
        let msg = ''
        let countRowData = 0;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }
        var { dispatch } = this.props;
        if (data.length == 0) {
            datanotify.type = "error";
            datanotify.content = this.state.requireemtyfile;
            dispatch(showNotifi(datanotify));
        }

        let columns = data[0]; //danh sach cot
        let numberColumns = data[0].length // so cot ;
        if (numberColumns > 1) {
            datanotify.type = "error";
            datanotify.content = this.state.requiretruefile;
            dispatch(showNotifi(datanotify));
        }

    }
    async _handleChange(e) {

        //console.log('co vao ko')
        e.preventDefault();
        let file = e.target.files[0];
        var fileName = file.name;
        await this.setState({ file: e.target.files[0], fileName })
        this.readDataImportFile()

    }
    async submitView() {
        this.setState({
            isListView: true
        })
        
        //console.log('this.state.datagroup.p_autoid', this.state.datagroup.p_autoid)

        await RestfulUtils.post('/fund/getalertdetail', { refautoid: this.state.datagroup.p_autoid, alerttype: this.state.datagroup.p_alerttype, language: this.props.lang, OBJNAME: this.props.OBJNAME })
            .then((res) => {
                let kq = ''

                for (let i = 0; i < res.result.length; i++) {
                    if (res.result[i].label == res.result[0].label) {
                        kq += res.result[i].label
                    }
                    else {
                        kq += '\n' + res.result[i].label
                    }
                }
                //console.log('kq   -----', kq)
                this.setState({
                    stringresultlist: kq
                })

            })
    }
    //ham copy all
    myFunction() {
        var copyText = document.getElementById("txtresultview");
        copyText.select();
        document.execCommand("copy");
    }
    render() {
        let disablebtnFile = ((this.state.enable == "block" && this.state.access == 'add') || (this.state.enable == "block" && this.state.access == 'update'))
        let isbtnviewFile = (this.state.access == 'view' && this.state.enable == "block")
        let disabledWhenView = (this.state.access == 'view')
        return (
            <Modal show={this.props.showModalDetail} >
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div style={{ paddingTop: "11px" }}>

                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.alerttype}</b></h5>
                                    </div>
                                    <div className="col-md-4" >
                                        <DropdownFactory disabled={disabledWhenView} CDVAL={this.state.datagroup["p_alerttype"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} value="p_alerttype" CDTYPE="SA" CDNAME="ALERTTYPE" ID="drdALERTTYPE" />
                                    </div>
                                    {disablebtnFile &&
                                        <div className="col-md-4 input-file" style={{ marginTop: "-2px" }}>
                                            <input type="text" className="form-control" style={{ position: "relative" }} placeholder={this.props.strings.chooselinkfile} value={this.state.fileName} disabled />
                                            <label className="btn btn-default glyphicon glyphicon-cloud-upload" style={{ fontSize: "13px", position: "absolute", right: "-27px", padding: "4px 9px !important" }}>
                                                <input disabled={disabledWhenView} type="file" accept=".xls,.xlsx,.csv" className="inputfile" onChange={this._handleChange.bind(this)} />
                                            </label>
                                        </div>
                                    }
                                    {isbtnviewFile &&
                                        <div className="col-md-4" >
                                            <input type="button" onClick={this.submitView.bind(this)} className="btn btn-primary" style={{ marginRight: 15}} value={this.props.strings.viewlist} id="btnSubmitView" />
                                        </div>
                                    }
                                    {
                                        this.state.isListView &&
                                        <div>
                                            <div className="col-md-12 row">
                                                <div className="col-md-3">
                                                    <h5 className="highlight"><b>{this.props.strings.list} </b></h5>
                                                </div>
                                                <div className="col-md-9">
                                                    <textarea width='375px' className="form-control" rows="3" id="txtresultview" value={this.state.stringresultlist} ></textarea>
                                                </div>


                                            </div>
                                            <div className="col-md-12 row">
                                                <div className="col-md-3">
                                                </div>
                                                <div className="col-md-9">
                                                        <button style={{ padding: '0px 10px !important' }} className="btn btn-default" onClick={this.myFunction.bind(this)} id="btnSubmit">
                                                        <h5 className="glyphicon glyphicon-duplicate" style={{ fontSize: "13px" }}> Copy</h5>
                                                        </button>
                                                </div>

                                            </div>
                                        </div>
                                    }

                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.createtime}</b></h5>
                                    </div>
                                    <div className="col-md-9 fixWidthDatePickerForOthers">
                                        <DateInput disabled={disabledWhenView} onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["p_senddate"]} type="p_senddate" id="txtCreatetime" minDate={moment()} />
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.shortcontent}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input disabled={disabledWhenView} className="form-control" type="text" placeholder={this.props.strings.shortcontent} id="txtShortcontent" value={this.state.datagroup["p_shortcontent"]} onChange={this.onChange.bind(this, "p_shortcontent")} maxLength={2147483647}/>
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.maincontent1}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <textarea disabled={disabledWhenView} className="form-control" rows="10" id="txtMaincontent" value={this.state.datagroup["p_maincontent"]} onChange={this.onChange.bind(this, "p_maincontent")} maxLength={2147483647}></textarea>
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        <input disabled={disabledWhenView} type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
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
    translate('ModalDetailQLThongBao_Info')
]);
module.exports = decorators(ModalDetailQLThongBao_Info);
// export default ModalDetail;
