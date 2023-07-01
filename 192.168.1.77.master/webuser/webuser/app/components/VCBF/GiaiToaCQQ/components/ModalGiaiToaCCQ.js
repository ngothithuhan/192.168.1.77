import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import NumberFormat from 'react-number-format';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
class ModalGiaiToaCCQ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access: 'add',
            // du lieu nhap
            p_nqtty: '',
            p_sqtty: '',
            p_desc: '',
            //du lieu can truyen
            pv_objname: this.props.OBJNAME,
            pv_language: this.props.language,
            //du lieu tra ve
           
            checkFields: [
                { name: "p_nqtty", id: "txtnqtty" },
                { name: "p_sqtty", id: "txtsqtty" },
            ],
        };
    }
    close() {
        this.state.p_sqtty= '';
        this.state.p_nqtty= '';
        this.props.closeModalDetail();
    }
    async componentWillReceiveProps(nextProps) {
        let self = this;
        //console.log('nextProps.DATA', nextProps.DATA)
        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.setState({
                    p_txnum: nextProps.DATA.TXNUM,
                    p_fullname: nextProps.DATA.FULLNAME,
                    p_trfaccount: nextProps.DATA.CUSTODYCD,
                    p_seacctno: nextProps.DATA.SEACCTNO,
                    p_afacctno: nextProps.DATA.AFACCTNO,
                    symbol: nextProps.DATA.SYMBOL,
                    p_codeid: nextProps.DATA.CODEID,
                    p_avlqtty: nextProps.DATA.BLOCKED,
                    p_avlsqtty: nextProps.DATA.BLOCKEDSIP,
                    p_nqtty: this.state.p_nqtty ,
                    p_sqtty:  this.state.p_sqtty,
                    p_qtty: nextProps.DATA.QTTY,
                    pv_objname: this.props.OBJNAME,
                    pv_language: this.props.language,
                    access: nextProps.access,
                    p_desc: nextProps.DATA.DESC ? nextProps.DATA.DESC : this.state.p_desc

                })
            }
        }
        else {
            //this.setDefaultNCT()
            if (nextProps.isClear) {

                this.props.change()

                this.setState({

                    fatca: false,
                    authorize: false,
                    upload: false,
                    p_fullname: '',
                    p_trfaccount:'' ,
                    p_seacctno:'' ,
                    p_afacctno:'' ,
                    symbol: '',
                    p_codeid: '',
                    p_avlqtty: '',
                    p_avlsqtty: '',
                    p_nqtty:'',
                    p_sqtty: '',
                    p_qtty:'',
                    pv_language: this.props.language,
                    pv_objname: this.props.OBJNAME,
                    access: nextProps.access,

                })
            }
        }

    }
    onChangeDate(type, event) {

        if (event.target) {

            this.state[type] = event.target.value;
        }
        else {
            this.state[type] = event.value;
        }
        this.setState({
            p_frdate: this.state.p_frdate, p_todate: this.state.p_todate
        })
    }
    onChange(type, event) {
        let data = {};
        if (event.target) {

            this.state[type] = event.target.value;
        }
        else {
            this.state[type] = event.value;
        }
        this.setState({ ...this.state })
    }
    handleChange(type) {
        this.state.collapse[type] = !this.state.collapse[type];
        this.setState({ collapse: this.state.collapse })
    }
    closeModalDetail() {
        this.props.closeModalDetail()
    }
   
    checkValid(name, id) {
        let value = this.state[name];
        let mssgerr = '';
        switch (name) {
            case "p_nqtty":
                if (value == '') {
                    mssgerr = this.props.strings.requirednqtty;
                }
                if ( parseFloat(value) > parseFloat(this.state.p_avlqtty)) {
                    mssgerr = this.props.strings.requiredvalidnqtty;
                }
                else if (parseFloat(value) < 0 ){
                    mssgerr = this.props.strings.requiredvalidnqtty1;
                }
                else if(parseFloat(value)===0 && parseFloat(this.state.p_sqtty) === 0){
                    mssgerr = this.props.strings.requiredvalid0;
                }
                break;
            case "p_sqtty":
                if (value == '') {
                    mssgerr = this.props.strings.requiredsqtty;
                }
                if ( parseFloat(value) > parseFloat(this.state.p_avlsqtty)) {
                    mssgerr = this.props.strings.requiredvalidsqtty;
                }
                else if (parseFloat(value) < 0 ) {
                    mssgerr = this.props.strings.requiredvalidsqtty1;
                }
                else if(parseFloat(value)===0 && parseFloat(this.state.p_nqtty) === 0){
                    mssgerr = this.props.strings.requiredvalid0;
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
        //console.log('this.state.p_prgrpid', this.state.p_prgrpid)

        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }
        if (mssgerr == '') {
            var api = '/balance/actionunblockccq';
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            //consoconsole.log('xxx ', this.state.LOAIHINH, this.state.CODEID)
            let self = this

            RestfulUtils.posttrans(api, {
                trfaccount : this.state.p_trfaccount,
                fullname : this.state.p_fullname,
                afacctno : this.state.p_afacctno,
                codeid : this.state.p_codeid,
                seacctno : this.state.p_seacctno,
                avlqtty : this.state.p_avlqtty,
                nqtty : this.state.p_nqtty,
                avlsqtty : this.state.p_avlsqtty,
                sqtty : this.state.p_sqtty,
                qtty : parseFloat(this.state.p_nqtty )+ parseFloat(this.state.p_sqtty),
                desc : this.state.p_desc,
                language: this.props.language, objname: this.props.OBJNAME
            })
                .then((res) => {
                    //onsole.log('res ', res)
                    if (res.EC == 0) {
                        datanotify.type = "success"

                        datanotify.content = this.props.strings.success;
                        dispatch(showNotifi(datanotify));
                        this.props.closeModalDetail()
                        this.props.createSuccess()


                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                    }

                })

        }
    }

    async componentWillMount() {

        let that = this
        await RestfulUtils.post('/user/getleader', { language: this.props.language })
            .then((res) => {
                //console.log('check ', res.data.resultdata)
                that.setState({
                    ...that.state, dataTN: res.resultdata, optionsTruongNhom: res.result
                })

            })
    }
    
    showModalDetail(access, bacthang) {
        let titleModal = ""
        let DATA = ""

        switch (access) {
            case "add": titleModal = this.props.strings.modaladd; break
            case "update": titleModal = this.props.strings.modaledit; break;
            case "view": titleModal = this.props.strings.modalview; break
        }
        if (bacthang != undefined) {
            DATA = bacthang
        }

        this.setState({ showModalDetail: true, titleModal: titleModal, databacthang: DATA, accessBACTHANG: access, isClearbacthang: true, loadgrid: false })
    }
    onValueChange(type, data) {
        this.state[type] = data.value
        this.setState(this.state)
    }
   
    render() {
        let disableWhenView = (this.state.access == 'view')
 
        return (
            <Modal show={this.props.showModalDetail} bsSize="md" >
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>

                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>
                                {disableWhenView && <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.ngaychungtu}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-control">{this.state.p_txnum}</label>
                                    </div>
                                </div>}

                               <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.sotkgiaodich}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <label className="form-control">{this.state.p_trfaccount}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.hoten}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <label className="form-control">{this.state.p_fullname}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.maccq}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <label className="form-control">{this.state.symbol}</label>
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.soduthuongkhadung}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <NumberFormat className="form-control" value={this.state.p_avlqtty} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.sodusipkhadung}</b></h5>
                                    </div>
                                    <div className="col-md-8 ">
                                        <NumberFormat className="form-control" value={this.state.p_avlsqtty} displayType={'text'} thousandSeparator={true} decimalScale={2} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.thuongphongtoa}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <NumberFormat thousandSeparator={true} disabled={disableWhenView} className="form-control" value={this.state.p_nqtty} id="txtnqtty" onValueChange={this.onValueChange.bind(this, 'p_nqtty')} prefix={''} placeholder={this.props.strings.thuongphongtoa} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.sipphongtoa}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <NumberFormat thousandSeparator={true} disabled={disableWhenView} className="form-control" value={this.state.p_sqtty} id="txtsqtty" onValueChange={this.onValueChange.bind(this, 'p_sqtty')} prefix={''} placeholder={this.props.strings.sipphongtoa} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.diengiai}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <input disabled={disableWhenView} className="form-control"  id="txtdesc" onChange={this.onChange.bind(this, 'p_desc')} placeholder={this.props.strings.diengiai} />
                                    </div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="pull-right">
                                        <input disabled={disableWhenView} type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
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
    language: state.language.language,
    tradingdate: state.systemdate.tradingdate
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalGiaiToaCCQ')
]);
module.exports = decorators(ModalGiaiToaCCQ);
