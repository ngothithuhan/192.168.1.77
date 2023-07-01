import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import moment from 'moment';
import flow from 'lodash.flow';
import DropdownFactory from 'app/utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';
import NumberFormat from 'react-number-format';
import Select from 'react-select';
const options = [
    { value: '001', label: '001-Care by chung' },
    { value: '002', label: '002-CSKH' },
 
  ];
class ModalDetailChuyenNhomCareByKH extends Component {
    constructor(props) {
        super(props);
        this.state = {

            access: 'add',
            NEWCAREBY:{value:'',label:''},
            datagroup: {},
            checkFields: [
                { name: "p_newcare", id: "txtNEWCAREBY" },
      

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
        let self = this;


        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()

                this.setState({
                    datagroup: {
                        p_custodycd:nextProps.DATA.CUSTODYCD,
                        p_fullname:nextProps.DATA.FULLNAME,
                        p_oldcare:nextProps.DATA.CAREBY,
                        p_newcare:'',
                        p_desc:'',
                        pv_objname: this.props.OBJNAME,
                        p_language: this.props.lang,
         

                    },
                    access: nextProps.access,
                    NEWCAREBY:{value:'',label:''},
                    p_oldcaredesc:nextProps.DATA.CAREBY+'-'+nextProps.DATA.GRPNAME,
                })
            }
        }
        else
            this.setState({

            })
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

 
    checkValid(name, id) {
        let value = this.state.datagroup[name];
        let mssgerr = '';
        switch (name) {

            case "p_newcare":
                if (value == '') {
                    mssgerr = this.props.strings.requirednewcare;
                }else{
                    if(this.state.datagroup['p_oldcare']==value)  mssgerr = this.props.strings.requiredoldsamenewcare;
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
            var api = '/vcbf/cf_changegroupcareby';


            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            // console.log(this.state.datagroup)
            RestfulUtils.posttrans(api, this.state.datagroup)
                .then((res) => {
                    // console.log('chek ma loi ---- ', res)
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
    handleChange (e) {
            var that = this
            if (e && e.value) {
           
                this.state.datagroup['p_newcare'] = e.value;
            }
            this.setState({
                NEWCAREBY: e,
                
            })
        
      }
      loadOptions() {

        var api = '/vcbf/getcareby'
        var data = {
            p_language: this.props.lang,
            p_grptype: '2',
            p_objname:this.props.OBJNAME
        }
    
        return RestfulUtils.post(api,  data )
            .then((res) => {
                return { options: res }
            })
    }
    render() {
        let displayy = this.state.access == 'view' ? true : false
        const { selectedOption } = this.state;
        return (
            <Modal show={this.props.showModalDetail} bsSize="lg">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "400px" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12"} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className=""><b>{this.props.strings.CUSTODYCD}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblCustodycd">{this.state.datagroup["p_custodycd"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className=""><b>{this.props.strings.FULLNAME}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblfullname">{this.state.datagroup["p_fullname"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.CAREBY}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <label className="form-control" id="lboldcare">{this.state["p_oldcaredesc"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 className="highlight"><b>{this.props.strings.NEWCAREBY}</b></h5>
                                    </div>
                                    <div className="col-md-9 customSelect ">
                                    <Select.Async
                                                name="form-field-name"
                                                loadOptions={this.loadOptions.bind(this)}
                                                value={this.state.NEWCAREBY}
                                                onChange={this.handleChange.bind(this)}
                                                id="txtNEWCAREBY"
                                                placeholder=" "
                                                clearable={false}
                                                backspaceRemoves={false}
                                               // disabled={displayy}
                                            />                                  </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.DESC}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <input maxLength={1000} disabled={displayy} className="form-control" placeholder={this.props.strings.desc} id="txtDesc" value={this.state.datagroup["p_desc"]} onChange={this.onChange.bind(this, "p_desc")} />
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
    lang: state.language.language,
    tradingdate: state.systemdate.tradingdate,
    

});


const decorators = flow([
    connect(stateToProps),
    translate('ModalDetailChuyenNhomCareByKH')
]);

module.exports = decorators(ModalDetailChuyenNhomCareByKH);
