import React, { Component } from 'react';
import PopupImport from './components/PopupImport';
import ModalDoiChieu from './components/ModalDoiChieu';
import TableThongTinImport from './components/TableThongTinImport';
import Select from 'react-select';
import RestfulUtils from 'app/utils/RestfulUtils'
import * as XLSX from 'xlsx';
import moment from 'moment'
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { toast } from 'react-toastify'
import { Modal } from 'react-bootstrap';
import { AllKeyLang, maximumSize, ArraySpecialImport } from 'app//Helpers';

var getKeys = function (obj,dataTable) {
    var keys = [];
    for (var key in obj) {
        if (dataTable.includes(key) ) {
          keys.push(key);
        }

    }
    var allKey=keys.concat(ArraySpecialImport)
    return allKey;
}
class ImportMoiGioi extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            fileName: '',
            file: null,
            dataTable: null,
            fileMasterArr: [],
            columnsName: [],
            columnNames: [],
            filemap: { value: '', label: '' },
            typeColumn: {},
            err_msg: {},
            disable: true,
            showModalDoiChieu: false,
            filecodecompare: '',
            displayCOMPARE: 'none',
            fileid: ''

        }
    }
    _handleChange(e) {
        e.preventDefault();
        let file = e.target.files[0];
        if (file.size > maximumSize) {
            this.setState({ err_msg: this.get_Message('error', this.props.strings.errorSize + maximumSize / 1000000 + 'MB') })

        } else {
            var fileName = file.name;
            this.setState({ file: e.target.files[0], fileName, err_msg: this.get_Message('error', '') })
        }



    }
    componentDidMount() {
        let self = this
        if (this.props.datapage) {

            RestfulUtils.post('/file/getfilemaster', { CMDID: this.props.datapage.CMDID, OBJNAME: this.props.datapage.OBJNAME, LANGUAGE: this.props.lang, AllKeyLang }).then((resdata) => {
                for (let i = 0; i < AllKeyLang.length; i++) {
                    this.state.fileMasterArr[AllKeyLang[i]] = resdata['result' + AllKeyLang[i]]
                }
                self.setState({ fileMasterArr: self.state.fileMasterArr })
            })
        }
    }

    convetToListOject(dataTable) {
      
        var dataRow = [];
        var col = dataTable[0];
     
        for (var i = 1; i < dataTable.length; i++) {
        
            var obj = {};
   
             for (let index = 0; index < col.length; index++) {
                 var name=col[index].trim()
                //  let result = moment(dataTable[i][index].toString()).isValid();
                // var result = moment(dataTable[i][index], 'DD/MM/YYYY', true).isValid();
                var result1 = moment(dataTable[i][index], 'DD-MM-YYYY', true).isValid();

                if (result1) obj[name] = moment(dataTable[i][index], "DD/MM/YYYY").add('days', 1).format('DD/MM/YYYY')
                else obj[name] = dataTable[i][index];
                if (!obj[name] && obj[name] != 0) {
                    //console.log('obj[col[index]]',obj[col[index]])
                    obj[name] = '';
                }
            }
            dataRow.push(obj);
        }
        // console.log('datarow',dataRow)/++
    
        return dataRow;
    }
    readDataImportFile() {
        let file = this.state.file;
        let self = this
        let filemap = this.state['filemap' + self.props.lang];
        if (filemap ? filemap.value : '' != '') {
            if (file) {
                let reader = new FileReader();
                reader.onload = (evt) => {
                    const bstr = evt.target.result;
                    const wb = XLSX.read(bstr, { type: 'binary', cellDates: true, cellNF: false, cellText: false, raw: true });
                    /* Get first worksheet */

                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];

                    var data = XLSX.utils.sheet_to_json(ws, { header: 1, dateNF: "DD/MM/YYYY", raw: true });
                    /* Convert array of arrays */

                    /* Update state */
         
                    let data1 = data.filter(nodes => nodes.length != 0)

             
                    //bo dong thua trong file excel
                    for (let i = 1; i < data1.length; i++) {
                        let x = 0
                        for (let j = 0; j < data1[0].length; j++) {
                            if (data1[i][j] === undefined || data1[i][j].toString().trim().length == 0) {
                                x += 1
                                data1[i][j] = ''
                            }
                        }
                        if (x >= data1[0].length) {
                            data1.splice(i, data1[0].length);
                        }
                    }


                    let resultValidateExel = this.validateFileExel(data1);


                    if (resultValidateExel == '') {
                        let validateNameColumn = this.isExitColumnName(data1[0])
                        if (validateNameColumn == "OK") {

                            let validateTypeColumn = this.validateTypeColumn(data1);
                            if (validateTypeColumn == "OK") {
                                let dataTable = this.convetToListOject(data1)
                                this.setState({ dataTable: dataTable, columnNames: data1[0], err_msg: this.get_Message('error', ''), disable: false })
                                // this.setState({dataTable:data})
                            }
                            else {
                                this.setState({ err_msg: this.get_Message('error', validateTypeColumn), disable: true })

                                // this.setState({ err_msg: validateTypeColumn })
                            }
                        }
                        else {
                            this.setState({ err_msg: this.get_Message('error', validateNameColumn), disable: true })

                            // this.setState({ err_msg: validateNameColumn })
                        }
                        //    this.setState({err_msg:'file đúng dạng chuẩn'})
                    }
                    else {
                        this.setState({ err_msg: this.get_Message('error', resultValidateExel), disable: true })
                        //console.log(resultValidateExel)

                    }

                }

                reader.readAsBinaryString(file);
            }
            else {
                this.setState({ err_msg: this.get_Message('error', this.props.strings.nofile) })
            }
        } else this.setState({ err_msg: this.get_Message('error', this.props.strings.notype) })
    }
    validateFileExel(data) {
        let msg = ''

        let countRowData = 0;
        if (data.length == 0)
            return this.props.strings.filenorecord

        let columns = data[0]; //danh sach cot
        let numberColumns = data[0].length // so cot ;
        for (var i = 0; i < data[0].length; i++)
            if (data[0][i] == '' || !data[0][i])
                return this.props.strings.emptycolumn
        /*
           for (var j = 1; j < data.length; j++) {
             //  console.log('data'+j,data[j])
               if (data[j].length != numberColumns)
                   return this.props.strings.notsamecolum
           }
   */
        // for (var i = 1; i < data.length; i++) {
        //     if (data[i].length > 0) { //chi kiem tra nhung row du lieu dung, ko kiem tra row du lieu dang [] 
        //         for (var j = 0; j < numberColumns; j++)

        //             if (data[i][j] == '' || !data[i][j]) {
        //                 return "Dữ liệu không được để trống"
        //             }
        //     }
        //     else {
        //         delete data[i]
        //     }
        // }
        this.setState({ data })

        return ''



    }
    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    isDate(data) {
        /*
        let result = moment(data, "DD/MM/YYYY", true).isValid();
        if (result) {
            if (data.toString().length != 10) return false
            else return true
        } else return false
        */
        try {
            data = data.replace(/'/g, "");
        } catch (error) {
            data = data
        }

        return moment(data, "DD/MM/YYYY", true).isValid();
    }
    validate() {
        let data = this.refs.date.value;

    }

    //validate column
    validateNameColumn(data) {

        let result = 0;
        if (data.length != this.state.columnsName.length)
            return this.props.strings.notsamecolum

        for (let i = 0; i < data.length; i++) {

            if (data[i] != this.state.columnsName[i]['FILEROWNAME']) {
                return this.props.strings.wrongcolumname
            }

        }
        return "OK"
    }

    //check cột trong db có trong file excel import
    isExitColumnName(data) {
        let self = this
        let { filemap } = this.state['filemap' + self.props.lang];
        let FILECODE = filemap ? filemap.value : ''
        let columnNames = this.state.columnsName;

        let numberColumnExit = 0;
        let msg_err = '';
        let typeColumn = {};



        if (columnNames.length != data.length) {

            return this.props.strings.validcolums
        } else {
            for (let i = 0; i < columnNames.length; i++) {
                let result = 0;
                for (let j = 0; j < data.length; j++) {

                    //  console.log('columndataexel',data[j])

                    if (data[j].trim() == columnNames[i]['FILEROWNAME'].trim()) { //check cot trong db co trong file exel
                        result += 1;

                    }

                }
                if (result == 1) { //kiem tra chi 1 cot co trong file excel
                    numberColumnExit += 1
                    typeColumn[columnNames[i]['FILEROWNAME']] = columnNames[i]['TBLROWTYPE']
                }
                if (result == 0) {
                    msg_err = this.props.strings.column + columnNames[i]['FILEROWNAME'] + this.props.strings.notinfile
                    return msg_err
                }
                if (result > 1) {
                    msg_err = this.props.strings.column + columnNames[i]['FILEROWNAME'] + this.props.strings.redundancy
                    return msg_err
                }
            }

            if (numberColumnExit == columnNames.length) {

                this.setState({ typeColumn: typeColumn })
                return "OK"
            }

            return "Không đủ số cột"
        }
    }
    //validate kieu du lieu
    validateData(typeColumn, data) {

        if (typeColumn == "D" && !this.isDate(data))
            return typeColumn;
        if (typeColumn == "N") {

            try {

                if (data) {
                    let dataNumber = data
                    // let dataNumber = data.toString().split(",").join("") //thay the day phay trong number
                    if (!this.isNumeric(dataNumber))
                        return typeColumn
                }
            } catch (error) {
                return typeColumn
            }


        }
        return "OK"
    }
    //check kieu du lieu 
    validateTypeColumn(data) {

        let numberColumns = data[0].length // so cot ;
        for (var i = 1; i < data.length; i++) {

            // if (data[i].length != numberColumns)
            //     return "Dữ liệu không được để trống"

            for (var j = 0; j < numberColumns; j++) {

                let resultValidate = this.validateData(this.state.typeColumn[data[0][j]], data[i][j])
                if (resultValidate != "OK")
                    return this.props.strings.column + data[0][j] + this.props.strings.row + (i + 1) + this.props.strings.wrongtype
                if (data[i] == "FILEID" && (!data[i][j] || data[i][j] == ''))
                    return this.props.strings.fileidnotempty
            }

        }
        return "OK"
    }
    showModal() {
        this.setState({ showModal: true })
    }
    closeModal(hide) {
        this.setState({ showModal: hide })
    }
    getOptions() {

    }

    onChange(e) {
        let self = this
        if (e) {

            if (this.state.fileid != e.value) {
                RestfulUtils.post('/file/check_fileimport', { FILECODE: e.value, OBJNAME: this.props.datapage.OBJNAME, language: this.props.lang }).then((resdata) => {
                    if (resdata.EC == 0) {
                        // this.validateNameColumn.
                        // console.log('re',resdata.DT.data)
                        for (let i = 0; i < AllKeyLang.length; i++) {
                            this.state[AllKeyLang[i]] = e
                        }
                        self.setState({ columnsName: resdata.DT.data, fileid: e.value })
                    }
                    else {
                        self.setState({ err_msg: self.get_Message('error', resdata.EM) })
                    }
                })
            }
        }
        for (let i = 0; i < AllKeyLang.length; i++) {
            this.state['filemap' + AllKeyLang[i]] = this.state.fileMasterArr[AllKeyLang[i]].filter(nodes => nodes.value == e.value)[0];
        }
        this.setState(self.state)
    }
    get_Message(type, contentText) {
        let color = type == "error" ? "red" : "green"
        return { color, contentText }
    }
    async onFormSubmit(e) {

        let self = this;
        let FILECODE = this.state['filemap' + self.props.lang] ? this.state['filemap' + self.props.lang].value : ''
        e.preventDefault() // Stop form submit
        window.$('#btnSubmit').prop('disabled', true);
        await RestfulUtils.post('/file/pre_check_upload', { FILECODE: FILECODE, OBJNAME: this.props.datapage.OBJNAME }).then((resdata) => {

            if (resdata.EC == 0) {
                self.fileUpload(resdata.DT.p_tablename, resdata.DT.p_fileid).then((response) => {

                    if (response.EC == 0) {
                        RestfulUtils.post('/file/after_check_upload', { FILECODE: FILECODE, OBJNAME: this.props.datapage.OBJNAME, p_fileid: resdata.DT.p_fileid }).then((resData1) => {
                           
                            if (resData1.EC == 0) {
                                // sails.console.log("check mo tk ok");
                                self.getImportData('writeFile', resdata.DT.p_fileid);

                                //   toast.success('Thành công', { position: toast.POSITION.BOTTOM_RIGHT });

                                //   self.setState({file:null,fileName:'',dataTable:null})
                            }
                            else {

                                self.setState({ err_msg: self.get_Message('error', resData1.DT.p_err_param) })
                                window.$('#btnSubmit').prop('disabled', false);
                                // self.setState({err_msg:resData.DT.EM})                           
                            }
                        })
                    }
                    else {

                        self.setState({ err_msg: self.get_Message('error', response.EM) })
                        window.$('#btnSubmit').prop('disabled', false);
                    }
                })
            }
            else {

                self.setState({ err_msg: self.get_Message('error', resdata.EM) })
                window.$('#btnSubmit').prop('disabled', false);
            }
        })

    }
    countRowImportSuccess(data) {
        let rowSuccess = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i]['STATUS'] != 'E')
                rowSuccess += 1
        }
        return rowSuccess;
    }

    //lấy thông tin import , type để xác đinh lấy thông tin lúc import, hay đọc dữ liệu sau khi import
    getImportData(type, p_fileid) {
        let self = this
        let filemap = this.state['filemap' + self.props.lang];
        let FILECODE = filemap ? filemap.value : ''
        let countRowSuccess
        if (filemap)
            RestfulUtils.post('/file/getimportdata', { FILECODE: FILECODE, p_fileid: p_fileid, OBJNAME: this.props.datapage.OBJNAME }).then((resdata) => {

                if (resdata.EC == 0) {
                    var columnNames = getKeys(resdata.DT.data[0], this.state.columnNames); //lay danh sach ten cot
                    if (type == "writeFile") {
                        countRowSuccess = self.countRowImportSuccess(resdata.DT.data);
                        let messsgeSuccess = this.props.strings.importsucess + countRowSuccess + '/' + resdata.DT.data.length + this.props.strings.record
                        toast.success(messsgeSuccess, { position: toast.POSITION.BOTTOM_RIGHT });
                        window.$('#btnSubmit').prop('disabled', false);
                        self.setState({
                            dataTable: resdata.DT.data,
                            columnNames: columnNames
                        })

                    }
                    if (self.state['filemap' + self.props.lang].type == 'C')
                        self.setState({ err_msg: self.get_Message('error', ''), disable: true, filecodecompare: p_fileid, showModalDoiChieu: true })


                }
                else {

                    self.setState({ err_msg: self.get_Message('error', resdata.EM) })
                    window.$('#btnSubmit').prop('disabled', false);
                }
            })
        else {
            this.setState({ err_msg: self.get_Message('error', this.props.strings.notype) })
            window.$('#btnSubmit').prop('disabled', false);
        }
    }
    CheckgetImportData() {

        let FILECODE = filemap ? filemap.value : ''
        let self = this
        RestfulUtils.post('/file/check_fileimport', { FILECODE: FILECODE, OBJNAME: this.props.datapage.OBJNAME, language: this.props.lang }).then((resdata) => {
            if (resdata.EC == 0) {

                //var columnNames = getKeys(resdata.DT.data[0]); //lay danh sach ten cot
                //let validateNameColumn = this.isExitColumnName(columnNames)
            }
            else {
                self.setState({ err_msg: self.get_Message('error', resdata.EM) })
            }
        })

    }
    /*
    fileUpload(file, tablename, FILEID) {
        let self = this
        const url = '/file/uploadtest';
        const formData = new FormData();
        let FILECODE = this.state['filemap' + self.props.lang] ? this.state['filemap' + self.props.lang].value : '';
        let CMDID = this.props.datapage ? this.props.datapage.CMDID : ''
        let TABLENAME = tablename
        formData.append('file', file);
        formData.append('CMDID', CMDID);
        formData.append('FILECODE', FILECODE)
        formData.append('TABLENAME', TABLENAME)
        formData.append('OBJNAME', this.props.datapage.OBJNAME)


        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'CMDID': CMDID,
                'FILECODE': FILECODE,
                'TABLENAME': TABLENAME,
                'OBJNAME': this.props.datapage.OBJNAME,
                'FILEID': FILEID

            }
        }
        return axios.post(url, formData, config)
    }
    */
    fileUpload(tablename, FILEID) {
        let self = this
        let FILECODE = this.state['filemap' + self.props.lang] ? this.state['filemap' + self.props.lang].value : '';
        let CMDID = this.props.datapage ? this.props.datapage.CMDID : ''
        let TABLENAME = tablename
        let data = {
            CMDID: CMDID,
            FILECODE: FILECODE,
            TABLENAME: TABLENAME,
            OBJNAME: this.props.datapage.OBJNAME,
            DATAFILE: this.state.dataTable,
            FILEID: FILEID
        }
        return RestfulUtils.posttrans('/file/uploadtest', data).then((resData) => {
            return resData
        })
    }
    accessFileImport(ACTION) {
        let { filemap } = this.state['filemap' + self.props.lang];
        let FILECODE = filemap ? filemap.value : ''
        let self = this


        if (filemap)
            RestfulUtils.post('/file/approveFile', { FILECODE, ACTION }).then((resdata) => {

                if (resdata.EC == 0) {
                    toast.success('Xóa' + ' thành công', { position: toast.POSITION.BOTTOM_RIGHT });
                    self.getImportData();
                    self.setState({ err_msg: self.get_Message('success', 'Xóa' + " Thành công"), dataTable: null, columnNames: [], columnsName: [] })
                }
                else {
                    self.setState({ err_msg: self.get_Message('error', resdata.EM + resdata.DT.err_msg.color) })
                    toast.error(resdata.EM + resdata.DT.err_msg, { position: toast.POSITION.BOTTOM_RIGHT });

                }
            })
        else {
            this.setState({ err_msg: this.get_Message('error', this.props.strings.notype) })
        }

    }
    deleteImport() {
        let ACTION = "D"
        this.accessFileImport(ACTION)
    }
    Compare() {

        this.setState({
            showModalDoiChieu: !this.state.showModalDoiChieu
        })
    }
    close = () => {
        this.setState({
            showModalDoiChieu: !this.state.showModalDoiChieu
        })
    }
    render() {
        var displayy = 'inline'
        let self = this
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">
                <div className="col-md-6 col-xs-12 title-content import-motk" >{this.props.lang == 'vie' ? this.props.datapage.CMDNAME : this.props.datapage.EN_CMDNAME}</div>
                <div style={{ border: "1px solid #ddd", marginTop: "10px" }} className="panel-body col-md-12">
                    {/* <div style={{marginBottom: "10px" }}>
                        <button className="btn btn-primary" onClick={this.showModal.bind(this)} style={{padding: "5px 8px", fontSize: "12px"}}>Import</button>
                    </div> */}
                    {/* <div className="tab-import-motk nav-import-motk">
                        <ul className="nav nav-tabs">
                            <li className="active"><a data-toggle="tab" href="#tab1"><b>Thông tin đợt import</b></a></li>
                            <li><a data-toggle="tab" href="#tab2"> <b>Chi tiết import</b></a></li>
                        </ul>
                        <div className="tab-content">
                            <div id="tab1" className="tab-pane fade in active">
                                <div className="table-thongtin-import">
                                    <ThongTinImport />
                                </div>
                            </div>
                            <div id="tab2" className="tab-pane fade">
                                <div className="table-tracuulenh">
                                    <ChiTietImport />
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="col-xs-12 search">
                        <div className="col-md-2">
                            <h5>{this.props.strings.type}</h5>
                        </div>
                        <div className="col-xs-3">
                            <Select
                                name="form-field-name"
                                placeholder="Loại import"
                                value={this.state['filemap' + self.props.lang] ? this.state['filemap' + self.props.lang] : { value: '', label: '' }}
                                clearable={false}
                                onChange={this.onChange.bind(this)}
                                options={this.state.fileMasterArr[self.props.lang]}
                            />
                        </div>
                        <div className="col-md-2">
                            <h5>{this.props.strings.path}</h5>
                        </div>

                        <div className="col-md-3 input-file">
                            <input type="text" className="form-control" style={{ position: "relative" }} placeholder={this.props.strings.pathrequire} value={this.state.fileName} disabled />
                            <label className="btn btn-default glyphicon glyphicon-cloud-upload" style={{ padding: "5px 10px", fontSize: "14px", position: "absolute", right: "-22px" }}>
                                <input type="file" accept=".xls,.xlsx,.csv" className="inputfile" onChange={this._handleChange.bind(this)} />
                            </label>
                        </div>

                    </div>
                    <div id="error" className="col-md-12" style={{
                        color: this.state.err_msg.color,
                        paddingLeft: "28px",
                        paddingBottom: "7px",
                        paddingTop: "12px",
                        fontWeight: "bold"
                    }}>{this.state.err_msg.contentText}</div>
                    <div className="col-xs-12 table-content table-import-file">
                        <div className="result">
                            <h5 className="high-light">{this.props.strings.result}</h5>
                        </div>
                        <div className="content-table">
                            <TableThongTinImport typeColumn={this.state.typeColumn} dataTable={this.state.dataTable} columnNames={this.state.columnNames} />
                        </div>
                        <div className="pull-right table-import-btn" style={{ marginTop: 15 }}>
                            {/* <button className="btn btn-default">Kiết xuất</button> */}
                            <button onClick={this.readDataImportFile.bind(this)} className="btn btn-default" style={{ marginRight: 5 }}><span className="glyphicon glyphicon-list-alt"></span> {this.props.strings.readfile}</button>
                            <button onClick={this.onFormSubmit.bind(this)} className="btn btn-primary" style={{ marginRight: 5 }} disabled={this.state.disable} id="btnSubmit"><span className="glyphicon glyphicon-floppy-disk"></span> {this.props.strings.save}</button>
                            {/*this.props.datapage.OBJNAME=='IMPANDCOMPARE'?
                            <button style={{ display: this.state.displayCOMPARE }} onClick={this.Compare.bind(this)} className="btn btn-primary" id="btnSubmit"><span className="glyphicon glyphicon-duplicate"></span> Đối chiếu</button>
                :null*/}
                            {/* <button onClick={this.deleteImport.bind(this)} className="btn btn-danger"><span className="glyphicon glyphicon-remove"></span> Xóa dữ liệu</button> */}

                            {/* <button  className="btn btn-danger" onClick={this.onFormSubmit.bind(this)}>Ghi dữ liệu</button> */}
                        </div>
                        {/*
                        <div style={{ paddingTop: "10px" }} className="pull-left">
                            <button onClick={this.getImportData.bind(this)} className="btn btn-primary" ><span className="glyphicon glyphicon-list-alt"></span> Đọc dữ liệu</button>
                            <button onClick={this.deleteImport.bind(this)} className="btn btn-danger"><span className="glyphicon glyphicon-remove"></span> Xóa dữ liệu</button>

                        </div>
                        */}
                    </div>
                </div>
                <PopupImport showModal={this.state.showModal} closeModal={this.closeModal.bind(this)} />
                <Modal show={this.state.showModalDoiChieu} bsSize="lg" dialogClassName="custom-modal">
                    <Modal.Header >
                        <Modal.Title><div className="title-content">{this.props.strings.compareorder}<button type="button" onClick={this.close.bind(this)} className="close" ><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ overflow: "auto" }}>
                        <div className="panel ">
                            <ModalDoiChieu showModal={true} closeModal={this.closeModal.bind(this)} filecode={this.state['filemap' + self.props.lang] ? this.state['filemap' + self.props.lang].value : ''} fileid={this.state.filecodecompare} objname={this.props.datapage.OBJNAME} />


                        </div>
                    </Modal.Body>
                </Modal>


            </div>
        );
    }
}

const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    auth: state.auth,
    lang: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('ImportMoiGioi')
]);

module.exports = decorators(ImportMoiGioi);
