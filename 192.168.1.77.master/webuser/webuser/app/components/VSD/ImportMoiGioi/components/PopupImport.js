import React, { Component } from 'react';
import { Modal, ModalHeader } from 'react-bootstrap'
import * as XLSX from 'xlsx';
import moment from 'moment'
const columnsName=["NAME","FULLNAME","EMAIL","SDT","BIRTHDATE"]
const typeColumns = ['VARCHAR','NVARCHAR','VARCHAR','NUMBER','DATE']
class PopupImport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            fileName:'',
            file:null
        }
    }
    showModal() {
        showModal: true
    }
    closeModal = () => {
        this.props.closeModal()
    }
    check(){
     let file = this.state.file ;
      if(file){
        let reader = new FileReader();

         reader.onload  = (evt) => {
            console.log('onload')
         
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, {type:'binary'});
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, {header:1});
            /* Update state */
            console.log("Data>>>",data);
            let resultValidateExel = this.validateFileExel(data);
            let validateNameColumn = this.validateNameColumn(data[0])
            
            if(resultValidateExel==''){
                console.log('file đúng dạng chuẩn')
            }
            else{
                console.log(resultValidateExel)

            }
            if(validateNameColumn == "OK"){
                let validateTypeColumn = this.validateTypeColumn(data);
                console.log('result validateDate',validateTypeColumn)
            }
            else{
                console.log('result validateDate',validateNameColumn)
            }
        }
        
        reader.readAsBinaryString(file);
     }
     else{
         console.log('not file')
     }
    }
    validateFileExel(data){
        let msg = ''
        if(data.length==0)
            return "File không có dữ liệu"
        let columns = data[0]; //danh sach cot
        let numberColumns = data[0].length // so cot ;
        for(var i=0;i<data[0].length;i++)
            if(data[0][i]==''||!data[0][i])
                return 'Tên cột không được để trống'
        for(var j=1;j<data.length;j++){
            if(data[j].length !=numberColumns)
                return "Số cột không bằng nhau"
        }
        for(var i=1;i<data.length;i++){
            for(var j=0;j<numberColumns;j++)
                if(data[i][j]==''||!data[i][j]){
                    console.log(i,j,data[i][j])
                    return "Dữ liệu không được để trống"
                }
        }
        return ''
        


    }
    _handleChange(e) {
        e.preventDefault();
        let file = e.target.files[0];
        var fileName = file.name;
        this.setState({file:e.target.files[0],fileName})

       
       
   
             // XHR/Ajax file upload     uploadImage(imageFile) {
            //    return new Promise((resolve, reject) => {
            //      let imageFormData = new FormData();
        
            //      imageFormData.append('imageFile', imageFile);
        
            //      var xhr = new XMLHttpRequest();
        
            //      xhr.open('post', '/account/upload', true);
        
            //      xhr.onload = function () {
            //        if (this.status == 200) {
            //          resolve(this.response);
            //        } else {
            //          reject(this.statusText);
            //        }
            //      };
        
            //       xhr.send(imageFormData);
        
            //     });    
        }
        isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
          }
        isDate(data){
            return moment(data, "DD/MM/YYYY", true).isValid();
        }
        validate(){
            let data = this.refs.date.value;
            console.log('date',this.isDate(data));
            console.log('number',this.isNumeric(data))
        }

        //validate column
        validateNameColumn(data){
            let result = 0 ;
            if(data.length !=columnsName.length)
                return 'Số cột không bằng nhau'
      
            for(let i=0 ;i < data.length;i++){
                if(data[i]!=columnsName[i])
                    return "Tên cột không đúng chuẩn"
            }
            return "OK"
        }
        //validate kieu du lieu
        validateData(typeColumn,data){
           
            if(typeColumn=="DATE"&&!this.isDate(data))
                return typeColumn;
            if(typeColumn=="NUMBER"&&!this.isNumeric(data))
                return typeColumn
            return "OK"
        }
        //check kieu du lieu
        validateTypeColumn(data){
            let numberColumns = data[0].length // so cot ;
            for(var i=1;i<data.length;i++){
                for(var j=0;j<numberColumns;j++){
                    let resultValidate = this.validateData(typeColumns[j],data[i][j])
                    if(resultValidate !="OK")
                        return 'Không đúng kiểu dữ liệu '+ resultValidate
                }
                 
            }
            return "OK"
        }
    render() {
        return (
            <Modal show={this.props.showModal} onHide={this.closeModal}>
                <ModalHeader closeButton>
                    <Modal.Title><div className="title-content">Thông tin tài khoản nhà đầu tư</div></Modal.Title>
                </ModalHeader>
                <Modal.Body style={{ overflow: "auto", height: "100%", paddingBottom: "0px" }}>
                    <div className="col-md-12 panel panel-success popup-import" style={{ padding: "20px" }}>
                        <div style={{marginBottom:"10px"}} className="col-md-12">
                            <div className="col-md-4"><label className="btn btn-default" style={{ padding: "3px 6px", fontSize: "12px" }}>Chọn đường dẫn<input type="file" accept=".xls,.xlsx,.csv" className="inputfile" onChange={this._handleChange.bind(this)} /></label></div>
                            <input type="text" disabled value={this.state.fileName} className="form-control" />
                            {/* <div className="col-md-8"><h5>{this.state.fileName}</h5></div> */}
                        </div>
                        <div className="col-md-12">
                            <div className="col-md-4"> <h5>Ngày thực hiện</h5></div>
                            <input type="text" ref="date" className="form-control" />
                        </div>
                        <div className="col-md-12">
                            <div className="col-md-4"><h5>Diễn giải</h5></div>
                            <input type="text" className="form-control" />
                        </div>
                        <div className="col-md-12">
                            <div className="col-md-4"> <h5>Kết quả</h5></div>
                            <textarea rows={5} cols={37} className="form-control" style={{height:"auto"}}/>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={this.check.bind(this)} className="btn btn-primary" style={{ padding: "5px 8px", fontSize: "12px" }}>Đọc dữ liệu</button>
                    <button onClick={this.validate.bind(this)} className="btn btn-primary" style={{ padding: "5px 8px", fontSize: "12px" }}>Ghi dữ liệu</button>
                    <button className="btn btn-default" style={{ padding: "5px 8px", fontSize: "12px" }} onClick={this.closeModal}>Thoát</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default PopupImport;