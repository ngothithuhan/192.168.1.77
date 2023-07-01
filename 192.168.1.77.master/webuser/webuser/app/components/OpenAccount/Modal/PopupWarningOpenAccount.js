import React from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { toast } from "react-toastify";
import './PopupWarningOpenAccount.scss'

class PopupWarningOpenAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    export(action) {
        console.log('this.props.dataFinish:', this.props.dataFinish)
        let that = this;
        var body = {};
        var param = "";
        let obj = {};
        let rptid = "RP0015";
        if (action == "openExport") {
            obj.custodycd = this.props.dataFinish.p_custodycd
        } else {
            rptid = "RP0025";
            obj.custodycd = this.props.dataFinish.p_custodycd
        }
        console.log('obj:', obj)
        for (var key in obj) {
            param += "'" + obj[key] + "',";
        }
        console.log('param:', param)
        if (param.length > 0) {
            param = param.substring(0, param.length - 1);
        }

        var win = window.open("", "printwindow");
        win.document.write(
            '<html><head><title>Loading</title><link rel="stylesheet" type="text/css" href="/styles/demo.css"></head><body>'
        );
        win.document.write("<div >" + this.props.strings.loading + "</div>");
        win.document.write("</body></html>");
        //  body.p_rptparam ='('+ this.genRPTPARAM(outParams)+')';
        body.p_rptparam = param;
        body.p_rptid = rptid;
        body.p_exptype = "PDF";
        body.p_reflogid = obj.custodycd;
        this.state["titlebutton" + action] = that.props.strings.waitexport;
        this.state["disablebutton" + action] = true;
        this.setState(that.state);
        RestfulUtils.post("/account/createreportrequest_manageracct", body).then(
            res => {
                if (res.EC == 0) {
                    let data = {
                        p_brid: "ALL",
                        p_language: this.props.lang,
                        p_autoid: res.DT.p_refrptlogs,
                        p_custodycd: obj.custodycd,
                        p_rptid: rptid
                    };
                    var time = 0;
                    var handle = setInterval(function () {
                        RestfulUtils.post("/account/get_rptfile_bycustodycd", data).then(
                            resData => {
                                time += 5000;
                                if (resData.DT.data.length > 0) {
                                    that.state["titlebutton" + action] =
                                        that.props.strings["createxport" + action];
                                    that.state["disablebutton" + action] = false;
                                    that.setState(that.state);
                                    clearInterval(handle);
                                    let autoid = res.DT.p_refrptlogs;
                                    let link = resData.DT.data[0].REFRPTFILE;
                                    let linkdown =
                                        "/account/downloadreport?AUTOID=" +
                                        autoid +
                                        "&extension=.PDF&TYPE=M" +
                                        "&custodycd=" + data.p_custodycd +
                                        "&RPTID=" +
                                        rptid +
                                        "&REFRPTFILE=" +
                                        link;
                                    win.location.href = linkdown;
                                    var handle1 = setInterval(function () {
                                        win.close();
                                        clearInterval(handle1);
                                    }, 1000);
                                }
                                if (time == 30000) {
                                    clearInterval(handle);
                                    win.close();
                                    toast.error(that.props.strings.failexport, {
                                        position: toast.POSITION.BOTTOM_RIGHT
                                    });
                                    that.state["titlebutton" + action] =
                                        that.props.strings["createxport" + action];
                                    that.state["disablebutton" + action] = false;
                                    that.setState(that.state);
                                }
                            }
                        );
                    }, 5000);
                } else {
                    toast.error(res.EM, { position: toast.POSITION.BOTTOM_RIGHT });
                    this.state["titlebutton" + action] =
                        that.props.strings["createxport" + action];
                    this.state["disablebutton" + action] = false;
                    this.setState(that.state);
                }
            }
        );
    }
    render() {
        return (
            <Modal
                className="popup-waring-open-account-ekyc"
                bsSize="md"
                show={this.props.showModal}
                onHide={() => this.props.isHide()}
            >
                <div className="title-content-popup-waring-open-account-ekyc">
                    <div>
                        <i className="fas fa-bell fa-x2"></i> {this.props.strings.title}
                    </div>
                    <div>
                        <i className="fas fa-times closeModal" onClick={() => this.props.isHide()} ></i>
                    </div>
                </div>
                <div className="body-popup-waring-open-account-ekyc">
                    <div className="notePrinHeader">
                        <span>
                            {this.props.strings.notePrintHeader}
                        </span>
                    </div>
                    <div className="block-content">

                        <div className="block-register">
                            <div className="block-register-left">
                                <i className="fas fa-file-word fa-2x"></i>
                                <div className="block-register-content">
                                    <span>
                                        {this.props.strings.notePrint1}
                                    </span><br></br>
                                    <span className="fileSize">
                                        {this.props.strings.fileSize}
                                    </span>
                                </div>
                            </div>

                            <div className="block-register-right">
                                <i className="fas fa-download" onClick={this.export.bind(this, "openExport")}>
                                </i>
                            </div>
                        </div>

                        <div className="block-faq">
                            <div className="block-faq-left">
                                <i className="fas fa-file-word fa-2x"></i>
                                <div className="block-faq-content">
                                    <span>
                                        {this.props.strings.notePrint2}
                                    </span><br></br>
                                    <span className="fileSize">
                                        {this.props.strings.fileSize}
                                    </span>
                                </div>
                            </div>

                            <div className="block-faq-right">
                                <i className="fas fa-download" onClick={this.export.bind(this, "onlineExport")}></i>
                            </div>
                        </div>

                    </div>

                    <div className="address">{this.props.strings.noteBody1}</div>
                    <div className="hotline">{this.props.strings.noteBody3}
                        <span className="phoneNumber">{this.props.strings.phoneNumber1}</span> /
                        <span className="phoneNumber">&nbsp;{this.props.strings.phoneNumber2}</span>
                    </div>
                    {/* <div className="address-popup-waring-open-account-ekyc"> */}
                    {/* </div> */}
                </div>
            </Modal>
        )
    }
}

const stateToProps = state => ({
});
const decorators = flow([
    connect(stateToProps),
    translate('PopupWarningOpenAccount')
]);
module.exports = decorators(PopupWarningOpenAccount);

