import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import RestfulUtils from 'app/utils/RestfulUtils'
import { connect } from 'react-redux'
import DropdownFactory from 'app/utils/DropdownFactory';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { showNotifi } from 'app/action/actionNotification.js';
import { getExtensionByLang} from 'app/Helpers'
class ModalDetailTableGhiNhanLenhDaTT extends Component {
    constructor(props) {
        super(props);
        this.state = {

            access: 'add',
            AMOUNT: { value: 0, validate: null, tooltip: "Không được để trống !!" },
            AccHold: { value: 0, validate: null, tooltip: "Không được để trống !!" },
            selectedOption: '',
            datagroup: {}
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
                    p_orderid: nextProps.DATA.ORDERID,
                    p_codeid: nextProps.DATA.CODEID,
                    p_custodycd: nextProps.DATA.CUSTODYCD,
                    p_srtype: nextProps.DATA.SRTYPE,
                    p_orderamt: nextProps.DATA.ORDERAMT,
                    p_orderqtty: nextProps.DATA.ORDERQTTY,
                    p_status: nextProps.DATA.STATUS,
                    p_nstatus: '',

                    p_swcodeid: nextProps.DATA.SWCODEID,
                    p_username: nextProps.DATA.USERNAME,
                    p_txtime: nextProps.DATA.TXTIME,
                    p_desc: '',
                    p_language: this.props.lang,
                    pv_objname: this.props.OBJNAME,
                },
                symbol: nextProps.DATA.SYMBOL,
                exectype: nextProps.DATA[getExtensionByLang("EXECTYPE_DESC",this.props.lang)],
                status: nextProps.DATA[getExtensionByLang("STATUS_DES",this.props.lang)],
                amount:nextProps.DATA.ORDERVALUE,
                access:nextProps.access
            })
        }
        }
        else
            this.setState({

            })
    }
    componentDidMount() {

        // io.socket.post('/account/get_detail',{CUSTID:this.props.CUSTID_VIEW,TLID:"0009"}, function (resData, jwRes) {
        //     console.log('detail',resData)
        //     // self.setState({generalInformation:resData});

        // });

    }

    onValueChange(type, data) {
      //  console.log('valueChange', type, data)
        this.state[type].value = data.value
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
    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
      
    }
    onSetDefaultValue = (type, value) => {
        if(!this.state.datagroup[type]){
           if(type=='p_nstatus')  this.state.datagroup[type] = 'Y'
           else  this.state.datagroup[type] = value
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
    async submitGroup() {
     
      var api = '/fund/process_tx5026';

  
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }
     // console.log(this.state.datagroup)
     RestfulUtils.posttrans(api,this.state.datagroup)
            .then((res)=>{
                
              if(res.EC==0) {
                datanotify.type = "success";
                datanotify.content = this.props.strings.success;
                dispatch(showNotifi(datanotify));
                this.props.load()
                this.props.closeModalDetail()
              }else{
                datanotify.type = "error";
                datanotify.content = res.EM;
                dispatch(showNotifi(datanotify));
              }
      
            })
     

    }
    render() {
        let displayy=this.state.access=='view'?true:false
    
       
        return (
            <Modal show={this.props.showModalDetail} bsSize="lg">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access=='view'?"col-md-12 disable":"col-md-12"} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.orderid}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblOrderid">{this.state.datagroup["p_orderid"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.orderidvsd}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblOrderidvsd">{this.state["symbok"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.vfmcode}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblVfmcode">{this.state["symbol"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.custodycd}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblCustodycd">{this.state.datagroup["p_custodycd"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.ordertype}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblOrdertype">{this.state["exectype"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5 ><b>{this.props.strings.amount}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblAmount">{this.state["amount"]}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.status}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                        <label className="form-control" id="lblStatus">{this.state.status}</label>

                                    </div>
                                </div>

                            
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.moneystatus}</b></h5>
                                    </div>
                                    <div className="col-md-9 ">
                                    <DropdownFactory disabled={true} onSetDefaultValue={this.onSetDefaultValue} CDVAL={this.state.datagroup.p_nstatus} value="p_nstatus" CDTYPE="SY" CDNAME="YESNO"  onChange={this.onChangeDRD.bind(this)} ID="drdMoneystatus" />

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.user}</b></h5>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-control" id="lblUser">{this.state.datagroup["p_username"]}</label>

                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-3">
                                        <h5><b>{this.props.strings.desc}</b></h5>
                                    </div>
                                    <div className="col-md-9">
                                    <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.desc} id="txtDesc" value={this.state.datagroup["p_desc"]} onChange={this.onChange.bind(this, "p_desc")} />
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
    translate('ModalDetailTableGhiNhanLenhDaTT')
]);
module.exports = decorators(ModalDetailTableGhiNhanLenhDaTT);
