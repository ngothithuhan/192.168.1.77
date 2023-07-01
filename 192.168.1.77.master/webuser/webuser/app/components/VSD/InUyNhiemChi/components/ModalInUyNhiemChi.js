import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'
class ModalInUyNhiemChi extends Component {
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

            CUSTID: '',
            disabled: false,
            new_create: false,
            selectedOption: '',
            dataMG: [],
            dataLH: [],
            dataMGrow: {},
            dataLHrow: {},
            CODEIDVT: '',
            optionsMaLoaiHinh: [],
            optionsDataMG: [],
            //mang data cac du lieu:

            p_language: this.props.language,
            pv_objname: '',

            p_saleacctno: '',

            checkFields: [
                { name: "CODEID", id: "saleid" },
                { name: "p_effdate", id: "effdate" },
                { name: "p_expdate", id: "expdate" },
                { name: "LOAIHINH", id: "retype" },
            ],
        };

    }
    close() {

        this.props.closeModalDetail();
    }
    /**
     * Tru?ng h?p update thì hi?n th? t?t c? thông tin lên cho s?a
     * Tru?ng hop view thì ?n các nút s?a không cho duy?t
     * Tru?ng h?p add thì ?n thông tin ch? hi?n thông tin chung cho ngu?i dùng -> Th?c hi?n -> M? các thông tin ti?p theo cho ngu?i dùng khai
     * @param {*access} nextProps
     */

    formatNumber(nStr, decSeperate, groupSeperate) {
        nStr += '';
        let x = nStr.split(decSeperate);
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + groupSeperate + '$2');
        }
        return x1 + x2;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.access == "add" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()

                this.setState({

                    FULLNAME: nextProps.DATA.FULLNAME,
                    BANKACNAME: nextProps.DATA.BANKACNAME, //ng nhan tien
                    BANKACC: nextProps.DATA.BANKACC,
                    BRANCH: nextProps.DATA.BRANCH,
                    BRNAME: nextProps.DATA.BRNAME,
                    BANKNAME: nextProps.DATA.BANKNAME,
                    DESC: nextProps.DATA.DESC,  // ma quy
                    AMTINW: nextProps.DATA.AMTINW, //so tien chu
                    ORDERAMT: nextProps.DATA.ORDERAMT, // so tien = so
                    BANKACC_BENEFI: nextProps.DATA.BANKACC_BENEFI,
                    CITYBANK: nextProps.DATA.CITYBANK,
                    DESC: nextProps.DATA.DESC,
                    access: nextProps.access,
                    PROVINCE: nextProps.DATA.PROVINCE_DESC,
                    SRTYPE: nextProps.DATA.SRTYPE,
                    CUSTODYCD: nextProps.DATA.CUSTODYCD
                    // autoid: nextProps.DATA.AUTOID + "",
                    // access: nextProps.access,
                    // LOAIHINH: { value: nextProps.DATA.RETYPE, label: nextProps.DATA.RETYPEDES },
                })

            }
        }

    }

    closeModalDetail() {
        this.setState({ showModalDetai: false })
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

    async componentWillMount() {

    }

    async submitGroup() {
        //xuat  file pdf
        // console.log('this.state.access',this.state.access)
        const input = document.getElementById('divToPrint');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/jpg');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'JPEG', 0, 0);
                // pdf.output('dataurlnewwindow');
                pdf.save("download.pdf");
            })
            ;
    }
    xoa_dau(str) {
        str=str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace("Đ","D")
        return str.toUpperCase();
    }

    render() {
        let disableWhenView = (this.state.access == 'view')
        let isSIP = (this.state.SRTYPE == 'SP')
        let isNORMAL = (this.state.SRTYPE == 'NN')
        let ORDERAMT = (this.state.ORDERAMT)
        return (

            <Modal show={this.props.showModalDetail} bsSize="lg" >
                <Modal.Header  >
                    <Modal.Title >
                        <div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div id="divToPrint" className="bieumau row">
                        <div style={{ marginTop: '20px', paddingRight: '8px' }} className="col-md-10">
                            <div style={{ fontSize: '16px', marginBottom: '20px' }} className="row text-center">
                                <b>ỦY NHIỆM CHI</b>

                                <br />
                                <b>PAYMENT ORDER</b>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="col-md-4">
                                        <img style={{ height: '45px' }} src='../images/logo_vpbank.png' />
                                    </div>
                                    <div className="col-md-3">

                                    </div>
                                    <div className="col-md-5">
                                        <p>Số bút toán (Trans. No): ...............................</p>
                                        <p>Mã KH (CIF No): .......................................</p>


                                    </div>
                                </div>
                                <div className='col-md-12'>
                                    <hr style={{
                                        width: '100%',
                                        color: '#5a5252',
                                        backgroundColor: '#5a5252',
                                        borderColor: '#5a5252',
                                        marginTop: '-10px'
                                    }} />
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-4">

                                    </div>
                                    <div className="col-md-3">

                                    </div>
                                    <div className="col-md-5">

                                        <p style={{ marginTop: '-22px' }}>Ngày (date): ..........................................
                                    </p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <p style={{ marginLeft: '16px' }} >Ðơn vị/Người trả tiền (Customer's name): <b>{this.state.FULLNAME}</b></p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="col-md-7">Số tài khoản (A/C No): <b>{this.state.BANKACC}</b></div>
                                    <div className="col-md-5"> <p>Tại VPBank (With branch): <b>{this.state.BRNAME}</b></p></div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">

                                    <p style={{ marginLeft: '16px' }}>Ðơn vị/Người nhận tiền (Beneficiary): <b>{this.state.BANKACNAME}</b></p>
                                    <p style={{ marginLeft: '16px', marginTop: '15px' }} >Số tài khoản (A/C No): <b>{this.state.BANKACC_BENEFI}</b></p>
                                    <p style={{ marginLeft: '16px', marginTop: '15px' }} >Tên ngân hàng (With bank): <b>{this.state.BANKNAME}</b></p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="col-md-7">
                                        <p>Chi nhánh (branch): <b>{this.state.BRANCH}</b></p>
                                        <p style={{ marginTop: '16px' }}>Số tiền bằng chữ (Amount in words): <b>{this.state.AMTINW}</b></p>
                                        <p></p>

                                    </div>
                                    <div className="col-md-5">
                                        <p>Tỉnh (Province): <b>{this.state.PROVINCE}</b></p>
                                        {isNORMAL &&
                                            <div>
                                                <p style={{ border: '1px solid', paddingLeft: '10px' }} >Số tiền bằng số (Amount in figures):
                                        <p><b> {this.formatNumber(ORDERAMT, '.', ',')}</b></p></p>
                                            </div>
                                        }
                                        {isSIP &&
                                            <div>
                                                <p style={{ border: '1px solid', paddingLeft: '10px', position: 'absolute' }} >Số tiền bằng số (Amount in figures):
                                            <p>................................................................</p></p>
                                            </div>
                                        }
                                    </div>

                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-12">
                                    <p style={{ marginLeft: '16px' }}>Nội dung (Payment Details): <b>{this.state.CUSTODYCD} - {this.state.DESC} - {this.state.FULLNAME ? this.xoa_dau(this.state.FULLNAME) : ''} </b></p>
                                    <p style={{ marginLeft: '16px' }} >...........................................................................................................................................</p>
                                    <p style={{ marginLeft: '16px' }} >...........................................................................................................................................</p>
                                    <hr style={{
                                        width: '100%',
                                        color: '#5a5252',
                                        backgroundColor: '#5a5252',
                                        borderColor: '#5a5252'
                                    }} />
                                </div>
                            </div>
                            <div className="row">
                                <div style={{ marginTop: '-20px' }} className="col-md-12">
                                    <div className="col-md-7">
                                        <p>ĐƠN VỊ NGƯỜI YÊU CẦU (CUSTOMER)</p>
                                    </div>
                                    <div className="col-md-5">
                                        <p>VPBANK</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '-15px' }}>
                                <pre style={{
                                    display: 'block',
                                    fontFamily: 'Arial',
                                    whiteSace: 'pre',
                                    margin: '1em 0',
                                    border: 'none',
                                    backgroundColor: 'white'
                                }}><p style={{ marginTop: '-10px' }}>  Kế toán trưởng               Chủ tài khoản                               Ghi sổ ngày: .......................</p></pre>

                            </div>
                            <div style={{ marginTop: '-32px' }}>
                                <pre style={{
                                    display: 'block',
                                    fontFamily: 'Arial',
                                    whiteSace: 'pre',
                                    margin: '1em 0',
                                    border: 'none',
                                    backgroundColor: 'white'
                                }}><p> (chief Accountant)              (A/C holder)                 Giao dịch viên                Kiểm soát                 Giám đốc/Trưởng PGD</p></pre>
                            </div>

                        </div>
                    </div>
                    <div className="col-md-12 row">
                        <div className="pull-right">
                            <input disabled={disableWhenView} type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.exportspdf} id="btnSubmit" />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
const stateToProps = state => ({
    language: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalInUyNhiemChi')
]);
module.exports = decorators(ModalInUyNhiemChi);

