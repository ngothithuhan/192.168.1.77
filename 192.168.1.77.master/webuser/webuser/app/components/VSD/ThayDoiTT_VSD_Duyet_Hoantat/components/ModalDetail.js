import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'

import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'

import { showNotifi } from 'app/action/actionNotification.js';

import RestfulUtils from 'app/utils/RestfulUtils';

class ModalDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DESC: ''
        };
    }
    closeModalDetail() {

        this.props.closeModalDetail()
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

    close() {
        this.props.closeModalDetail();
    }

    closeModalDetail() {
        this.props.closeModalDetail()
    }
    onChange(type, event) {
        if (event.target) {
            if (event.target.type == "checkbox")
                this.state[type] = event.target.checked;
            else {

                this.state[type] = event.target.value;
            }
        }
        else {


            this.state[type] = event.value;
        }
        this.setState({ ...this.state })
    }

    async action() {
        //let that = this
        await RestfulUtils.post('/account/getchangeacctvsd', { language: this.props.lang, OBJNAME: this.props.OBJNAME }).then((res) => {
            let datares = res
            if (datares.length > 0) {
                let result = datares.filter(item => item.CUSTODYCD == this.props.DATA.CUSTODYCD)
                if (result)
                    if (result.length > 0) {
                        this.setState({
                            txdate: result[0].REFTXDATE,
                            txnum: result[0].REFTXNUM
                        })
                    }
            }

        })
        let self = this
        let { CUSTODYCD, OLD_IDCODE, NEW_IDCODE, OLD_IDDATE, NEW_IDDATE, OLD_IDPLACE,
            NEW_IDPLACE, OLD_BANKCODE, NEW_BANKCODE, OLD_CITYBANK, NEW_BANKACC, OLD_BANKACC, NEW_CITYBANK,  OLD_FULLNAME, NEW_FULLNAME,
            OLD_SEX, NEW_SEX, OLD_BIRTHDATE, NEW_BIRTHDATE, OLD_IDTYPE, NEW_IDTYPE, 
            OLD_MOBILE, NEW_MOBILE, OLD_EMAIL, NEW_EMAIL,
            OLD_ADDRESS, NEW_ADDRESS, OLD_SONHA, NEW_SONHA, 
            OLD_PHOTHONXOM, NEW_PHOTHONXOM, OLD_PHUONGXA, NEW_PHUONGXA,  OLD_THANHPHO, NEW_THANHPHO
        
        } = this.props.DATA
        //console.log('DATA',this.props.DATA)
        RestfulUtils.post('/account/processchangeinfocus', {
            txdate: this.state.txdate, txnum: this.state.txnum,
            custodycd: CUSTODYCD, old_idcode: OLD_IDCODE,
            new_idcode: NEW_IDCODE, old_iddate: OLD_IDDATE,
            new_iddate: NEW_IDDATE, old_idplace: OLD_IDPLACE,
            new_idplace: NEW_IDPLACE, old_bankcode: OLD_BANKCODE,
            new_bankcode: NEW_BANKCODE, old_citybank: OLD_CITYBANK,
            new_bankacct: NEW_BANKACC, old_bankacct: OLD_BANKACC,
            new_citybank: NEW_CITYBANK, old_citybank: OLD_CITYBANK,
            new_fullname: NEW_FULLNAME, old_fullname: OLD_FULLNAME,
            new_sex: NEW_SEX, old_sex: OLD_SEX,
            new_birthdate: NEW_BIRTHDATE, old_birthdate: OLD_BIRTHDATE,
            new_idtype: NEW_IDTYPE, old_idtype: OLD_IDTYPE,
            new_mobile: NEW_MOBILE, old_mobile: OLD_MOBILE,
            new_email: NEW_EMAIL, old_email: OLD_EMAIL,
            new_address: NEW_ADDRESS, old_address: OLD_ADDRESS,
            new_sonha: NEW_SONHA, old_sonha: OLD_SONHA,
            new_phothonxom: NEW_PHOTHONXOM, old_phothonxom: OLD_PHOTHONXOM,
            new_phuongxa: NEW_PHUONGXA, old_phuongxa: OLD_PHUONGXA,
            new_thanhpho: NEW_THANHPHO, old_thanhpho: OLD_THANHPHO,
            desc: this.state.DESC,
            language: this.props.lang, objname: this.props.OBJNAME
        }).then((resData) => {

            var { dispatch } = self.props;
            var datanotify = {
                type: "",
                header: "", //khong quan tam header
                content: ""

            }
            if (resData.EC == 0) {
                datanotify.type = "success"
                datanotify.content = self.props.strings.thongbaothanhcong;
                dispatch(showNotifi(datanotify));
                //console.log("xem data:", resData)
                this.props.closeModalDetail()
            }
            else {
                datanotify.type = "error"
                datanotify.content = resData.EM;
                dispatch(showNotifi(datanotify));
            }

        });

    }
    componentWillReceiveProps(nextProps) {
        let self = this;
        //lay du lieu loai hinh theo rerole dau tien

        if (nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()


                let { dataMG } = this.state;
                this.setState({
                    access: nextProps.access,
                })
            }
        }
        else {

            if (nextProps.isClear) {
                this.props.change()

                this.setState({

                    access: nextProps.access,
                })


            }
        }

    }

    render() {
        return (
            <Modal show={this.props.showModalDetail} onHide={this.close.bind(this)} dialogClassName="custom-modal" bsSize="lg" backdropClassName="firstModal">
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="panel-body">
                        <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "} style={{ paddingTop: "11px" }}>
                            <div className="col-md-6">
                                <h5 className="col-md-12 text-center"><b>{this.props.strings.oldtitle}</b></h5>
                                <hr />
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.custodycd}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5 >{this.props.DATA.CUSTODYCD}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.old_fullname}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5 >{this.props.DATA.OLD_FULLNAME}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.old_sex}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5 >{this.props.DATA.OLD_SEX_DESC}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.old_birthdate}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5 >{this.props.DATA.OLD_BIRTHDATE}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.old_idtype}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5 >{this.props.DATA.OLD_IDTYPE_DESC}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.old_idcode}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.OLD_IDCODE}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.old_iddate}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.OLD_IDDATE}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.old_idplace}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.OLD_IDPLACE}</h5>
                                    </div>
                                </div>

                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.old_bankacc}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.OLD_BANKACC}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.old_bankname}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.language == 'vie' ? this.props.DATA.OLD_BANKNAME : this.props.DATA.OLD_BANKNAME_EN}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.old_citybank}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.OLD_CITYBANK}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.old_address}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.OLD_ADDRESS}</h5>
                                    </div>
                                </div>
                                {/* <div style={{ marginLeft: "15px" }} className="row ">
                                    <div className="col-md-12">
                                        <h5><b>{this.props.strings.old_address}</b></h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.old_sonha}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.OLD_SONHA}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_phothonxom}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.OLD_PHOTHONXOM}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.old_phuongxa}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.OLD_PHUONGXA}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.old_thanhpho}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.OLD_THANHPHO}</h5>
                                    </div>
                                </div> */}
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.old_email}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.OLD_EMAIL}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.old_mobile}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.OLD_MOBILE}</h5>
                                    </div>
                                </div>
                            </div>
                            {/* ----------------------------------------------------------------------------- */}
                            <div className="col-md-6">
                                <h5 className="col-md-12 text-center" ><b>{this.props.strings.newtitle}</b></h5>
                                <hr />
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.custodycd}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5 >{this.props.DATA.CUSTODYCD}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_fullname}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5 >{this.props.DATA.NEW_FULLNAME}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_sex}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5 >{this.props.DATA.NEW_SEX_DESC}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_birthdate}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5 >{this.props.DATA.NEW_BIRTHDATE}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_idtype}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5 >{this.props.DATA.NEW_IDTYPE_DESC}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_idcode}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.NEW_IDCODE}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_iddate}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.NEW_IDDATE}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_idplace}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.NEW_IDPLACE}</h5>
                                    </div>
                                </div>

                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_bankacc}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.NEW_BANKACC}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_bankname}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.language == 'vie' ? this.props.DATA.NEW_BANKNAME : this.props.DATA.NEW_BANKNAME_EN}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row ">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_citybank}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.NEW_CITYBANK}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_address}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.NEW_ADDRESS}</h5>
                                    </div>
                                </div>
                                {/* <div style={{ marginLeft: "15px" }} className="row ">
                                    <div className="col-md-12">
                                        <h5><b>{this.props.strings.new_address}</b></h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_sonha}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.NEW_SONHA}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_phothonxom}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.NEW_PHOTHONXOM}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_phuongxa}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.NEW_PHUONGXA}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_thanhpho}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.NEW_THANHPHO}</h5>
                                    </div>
                                </div> */}
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_email}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.NEW_EMAIL}</h5>
                                    </div>
                                </div>
                                <div style={{ marginLeft: "15px" }} className="row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.new_mobile}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <h5>{this.props.DATA.NEW_MOBILE}</h5>
                                    </div>
                                </div>

                                <div style={{ marginTop: "15px", marginLeft: "15px", marginRight: "20px" }} className="row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.labelinput}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <input maxLength='1000' onChange={this.onChange.bind(this, "DESC")} ref="txtDesc" className="form-control" id="txtDesc" type="text" placeholder={this.props.strings.labelinput} />
                                    </div>
                                </div>
                                <div style={{ marginRight: "25px", marginTop: "15px" }} className="text-right row">
                                    <button onClick={this.action.bind(this)} type="button" className="btn btn-primary">  <a style={{ color: "#ffffff", textDecoration: "none" }}>{this.props.strings.submit}</a></button>
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
    translate('ModalDetail')
]);

module.exports = decorators(ModalDetail);
