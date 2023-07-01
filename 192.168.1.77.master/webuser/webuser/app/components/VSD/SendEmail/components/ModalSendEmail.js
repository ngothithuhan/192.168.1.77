import React, { Component } from 'react';
import DateInput from 'app/utils/input/DateInput';
import * as XLSX from 'xlsx';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import { showNotifi } from 'app/action/actionNotification.js';
import DropdownFactory from 'app/utils/DropdownFactory'
import { Modal } from 'react-bootstrap'
import RestfulUtils from 'app/utils/RestfulUtils';


class ModalSendEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ISALL: '',
            isDisabledContent: true,
            isDisableLinkFile: true,
            isListView: false, //dong/bat listview
            stringresultlist: '',
            p_note: '', //loai ds
            p_emailtype: '',
            p_shortcontent: '',
            p_maincontent: '',
            p_frdate: '',
            p_todate: '',
            p_retradingdate: '',
            p_list: '',
            p_txnum: '',
            p_language: this.props.lang,
            pv_objname: this.props.OBJNAME,
            checkFields: [

                { name: "p_emailtype", id: "drdemailtype" },
                { name: "p_list", id: "fileinput" },
                { name: "p_frdate", id: "txtfrdate" },
                { name: "p_todate", id: "txttodate" },
                { name: "p_retradingdate", id: "txtbgdate" },
                { name: "p_shortcontent", id: "txttitle" },
                { name: "p_maincontent", id: "txtacontent" },

            ],
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

                // if (nextProps.DATA.ALERTTYPE == 'L') {
                //     this.state.enable = "block"
                // } else this.state.enable = "none"
                this.setState({
                    display: {
                        fatca: true,
                        authorize: true,
                        upload: true,
                        quydangki: true
                    },
                    p_emailtype: nextProps.DATA.EMAILTYPE,
                    p_shortcontent: nextProps.DATA.SHORTCONTENT,
                    p_maincontent: nextProps.DATA.MAINCONTENT,
                    p_frdate: nextProps.DATA.FRDATE,
                    p_todate: nextProps.DATA.TODATE,
                    p_retradingdate: nextProps.DATA.RETRADINGDATE,
                    pv_language: this.props.lang,
                    pv_objname: this.props.OBJNAME,
                    p_senddate: nextProps.DATA.SENDDATE,
                    p_txnum: nextProps.DATA.TXNUM,
                    p_note: nextProps.DATA.NOTE,
                    access: nextProps.access,
                    isListView: false
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
                    p_note: '',
                    stringresultlist: '',
                    p_emailtype: '',
                    p_shortcontent: '',
                    p_maincontent: '',
                    p_frdate: '',
                    p_todate: '',
                    p_retradingdate: '',
                    p_list: '',
                    p_txnum: '',
                    p_language: this.state.lang,
                    pv_objname: this.props.OBJNAME,
                    access: nextProps.access,
                    fileName: ''
                })
            }
    }
    componentDidMount() {
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
        //console.log('this.state.REROLE.fdfd', this.state.REROLE)
        if (!this.state[type])
            this.state[type] = value
    }
    onChangeDropdown(type, event) {

        this.state[type] = event.value //type dai dien la REROLE
        if (type == 'p_emailtype') {
            //console.log('check xem: ', event.value)
            if (this.state.p_emailtype == '320E') {
                this.state.isDisabledContent = false
                this.state.p_maincontent = ''
                this.state.p_shortcontent = ''
            }
            else {
                this.state.isDisabledContent = true
            }

        }
        this.setState(this.state)

    }
    onChange(type, event) {

        if (event.target) {
            if (event.target.type == "checkbox") {
                this.state[type] = event.target.checked;
                if (event.target.checked) {
                    this.state.p_list = 'ALL'
                    this.state.isDisableLinkFile = false
                } else {
                    this.state.isDisableLinkFile = true
                }
            }

            else {

                this.state[type] = event.target.value;
            }

        } else {
            this.state[type] = event.value;

        }

        this.setState({ p_frdate: this.state.p_frdate, p_todate: this.state.p_todate, p_retradingdate: this.state.p_retradingdate, ISALL: this.state.ISALL })
    }

    async submitSend() {
        var mssgerr = '';
        //console.log('check valid this.state.fileName ', this.state.p_list)

        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }
        if (mssgerr == '') {
            var api = '/account/sendemail';
            // if (this.state.access == "update") {
            //     api = '/account/sendEmail';
            // }
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }

            RestfulUtils.posttrans(api, {
                emailtype: this.state.p_emailtype,
                shortcontent: this.state.p_shortcontent,
                maincontent: this.state.p_maincontent,
                frdate: this.state.p_frdate,
                todate: this.state.p_todate,
                retradingdate: this.state.p_retradingdate,
                list: this.state.p_list,
                language: this.props.lang,
                objname: this.props.OBJNAME,
            })
                .then((res) => {
                    if (res.EC == 0) {
                        datanotify.type = "success"
                        datanotify.content = this.props.strings.success;
                        dispatch(showNotifi(datanotify));


                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                    }

                })

        }
    }
    checkValid(name, id) {
        let value = this.state[name];
        //console.log('value check:',name, value)
        let mssgerr = '';
        switch (name) {
            case "p_list":
                if (this.state.p_list == '') {
                    //console.log('check valid this.state.fileName ', this.state.p_list)
                    mssgerr = this.props.strings.requiredlinkfile;
                }
                break;
            case "p_emailtype":
                if (value == '') {
                    mssgerr = this.props.strings.require_emailtype;
                }
                break;
            case "p_frdate":
                if (value == '') {
                    mssgerr = this.props.strings.require_frdate;
                }
                break;
            case "p_todate":
                if (value == '') {
                    mssgerr = this.props.strings.require_todate;
                }
                break;
            case "p_retradingdate":
                if (value == '') {
                    mssgerr = this.props.strings.require_bgdate;
                }
                break;
            case "p_shortcontent":
                if (this.state.p_emailtype == '320E' && value == '') {
                    mssgerr = this.props.strings.require_title;
                }
                break;
            case "p_maincontent":
                if (this.state.p_emailtype == '320E' && value == '') {
                    mssgerr = this.props.strings.require_content;
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
                this.state.p_list = ''
                for (var i = 0; i < data.length; i++) {
                    if (data[i][0] == data[0][0]) {
                        this.state.p_list += data[i][0]
                    }
                    else {
                        this.state.p_list += '~$~' + data[i][0]
                    }
                }
                //console.log("p_list>>>", this.state.p_list);
                this.setState({ p_list: this.state.p_list })


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

        //let columns = data[0]; //danh sach cot
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

        await RestfulUtils.post('/account/getsendemaillist', { templateid: this.state.p_emailtype, senddate: this.state.p_senddate,txnum: this.state.p_txnum, language: this.props.lang,OBJNAME: this.props.OBJNAME })
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
        let disablebtnFile = (this.state.access == 'add')
        let isbtnviewFile = (this.state.access == 'view' && this.state.p_note == 'L')
        let isDisableCheckbox = (this.state.access == 'add')
        let isDisabledWhenView = this.state.access == 'view'
        return (
            <Modal show={this.props.showModalDetail} bsSize="lg">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                    <h5 className="highlight"><b>{this.props.strings.emailtype}</b></h5>
                                </div>
                                <div className="col-md-3">
                                    <DropdownFactory disabled={isDisabledWhenView} placeholder={this.props.strings.emailtype} onSetDefaultValue={this.onSetDefaultValue} CDVAL={this.state.p_emailtype} onChange={this.onChangeDropdown.bind(this)} value="p_emailtype" CDTYPE="SA" CDNAME="EMAILTYPE" ID="drdemailtype" />
                                </div>
                                {(this.state.isDisableLinkFile && disablebtnFile) &&
                                    <div className="col-md-6" style={{ float: "right" }}>
                                        <div className="col-md-5">
                                            <input type="text" className="form-control" placeholder={this.props.strings.chooselinkfile} value={this.state.fileName} disabled />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="btn btn-default glyphicon glyphicon-cloud-upload" style={{ fontSize: "13px" }}>
                                                <input id='fileinput' type="file" accept=".xls,.xlsx,.csv" className="inputfile" onChange={this._handleChange.bind(this)} />
                                            </label>
                                        </div>
                                    </div>
                                }
                                {isbtnviewFile &&
                                    <div className="col-md-6" >
                                        <input type="button" onClick={this.submitView.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.viewlist} id="btnViewList" />
                                    </div>
                                }
                            </div>
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
                                            <button style={{ padding: '0px 10px !important' }} className="btn btn-default" onClick={this.myFunction.bind(this)} id="btnCopy">
                                                <h5 className="glyphicon glyphicon-duplicate" style={{ fontSize: "13px" }}> Copy</h5>
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            }
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                    <h5 className="highlight"><b>{this.props.strings.frdate}</b></h5>

                                </div>
                                <div className="col-md-3 fixWidthDatePickerForOthers">
                                    <DateInput disabled={isDisabledWhenView} onChange={this.onChange.bind(this)} value={this.state.p_frdate} type="p_frdate" id="txtfrdate" />

                                </div>
                                {isDisableCheckbox &&
                                    <div>
                                        <div style={{ marginTop: '10px' }} className="col-md-1">
                                            <input style={{}} id="cbIsemail" onChange={this.onChange.bind(this, "ISALL")} type="checkbox" />
                                        </div>
                                        <div className="col-md-4">
                                            <h5 style={{ marginLeft: '-40px' }}>{this.props.strings.allemail}</h5>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                    <h5 className="highlight"><b>{this.props.strings.todate}</b></h5>
                                </div>
                                <div className="col-md-3 fixWidthDatePickerForOthers">
                                    <DateInput disabled={isDisabledWhenView} onChange={this.onChange.bind(this)} value={this.state.p_todate} type="p_todate" id="txttodate" />
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                    <h5 className="highlight"><b>{this.props.strings.bgdate}</b></h5>
                                </div>
                                <div className="col-md-3 fixWidthDatePickerForOthers">
                                    <DateInput disabled={isDisabledWhenView} onChange={this.onChange.bind(this)} value={this.state.p_retradingdate} type="p_retradingdate" id="txtbgdate" />
                                </div>
                            </div>


                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                    <h5 className="highlight"><b>{this.props.strings.p_title} </b></h5>
                                </div>
                                <div className="col-md-9">
                                    <input maxLength='500' disabled={isDisabledWhenView || this.state.isDisabledContent} onChange={this.onChange.bind(this, "p_shortcontent")} value={this.state.p_shortcontent} className="form-control" type="text" placeholder={this.props.strings.p_title} id="txttitle" />
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="col-md-3">
                                    <h5 className="highlight"><b>{this.props.strings.content}</b></h5>
                                </div>
                                <div className="col-md-9">
                                    <textarea maxLength='5000' disabled={isDisabledWhenView || this.state.isDisabledContent} onChange={this.onChange.bind(this, "p_maincontent")} value={this.state.p_maincontent} className="form-control" rows="10" id="txtacontent" style={{ maxWidth: 885 }}></textarea>
                                </div>
                            </div>
                            <div className="col-md-12 row">
                                <div className="pull-right" style={{ paddingTop: 20 }}>
                                    <input disabled={isDisabledWhenView} type="button" onClick={this.submitSend.bind(this)} className="btn btn-primary" s style={{ marginRight: 15 }} value={this.props.strings.btnWrite} id="btnSubmit" />
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
    translate('ModalSendEmail')
]);
module.exports = decorators(ModalSendEmail);
