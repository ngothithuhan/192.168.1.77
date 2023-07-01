import React from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { closeModalWarningInfoOpenAcc } from 'actionDatLenh';
import RestfulUtils from 'app/utils/RestfulUtils';
import { toast } from "react-toastify";

class PopupWarningOpenAcc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  close = (e) => {
    var { dispatch } = this.props;
    dispatch(closeModalWarningInfoOpenAcc());
    if (this.props.closeModalOTPConfirm) {
      this.props.closeModalOTPConfirm();
    }
  }
  export(action) {
    console.log('this.props.dataFinish:', this.props.dataFinish)
    let that = this;
    var body = {};
    var param = "";
    let obj = {};
    let rptid = "RP0015";
    if (action == "openExport") {
      obj.custodycd = this.props.dataFinish.CUSTODYCD
    } else {
      rptid = "RP0025";
      obj.custodycd = this.props.dataFinish.CUSTODYCD
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
    console.log('render PopupWarning OpenACC:', this.props.dataFinish)

    return (
      <div className="popup-form">
        <Modal show={this.props.showModal} >
          <Modal.Header>
            <Modal.Title><div className="title-content col-md-6">{this.props.strings.title} <button type="button" className="close" onClick={this.close}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '10px 20px 0px', height: "450px" }}>
            <div style={{ fontSize: '14px', display: 'inline', fontWeight: 'bold' }} className='container'>
              <i class="fas fa-exclamation-circle"></i> {this.props.strings.contentwarning}

            </div>
            <div className="col-md-12 row">
              <div className="col-md-12 row" style={{ fontSize: 14 }}>{this.props.strings.notePrintHeader}</div>
              <div className="col-md-12">{this.props.strings.notePrint1} <button className="btn btn-outline-secondary" onClick={this.export.bind(this, "openExport")} ><span className="fas fa-cloud-download-alt" ></span> {this.props.strings.download}</button></div>
              <div className="col-md-12">{this.props.strings.notePrint2} <button className="btn btn-outline-secondary" onClick={this.export.bind(this, "onlineExport")} ><span className="fas fa-cloud-download-alt" ></span> {this.props.strings.download}</button></div>

            </div>
            <div className="col-md-12 row">

              <div className="col-md-12">{this.props.strings.noteBody1}</div>
              {/* <div className="col-md-12">{this.props.strings.noteBody2}</div> */}
              <div className="col-md-12">{this.props.strings.noteBody3}</div>
              {/* <div className="col-md-12">{this.props.strings.noteBody4}</div>
                        <div className="col-md-12">{this.props.strings.noteBody5}</div>
                        <div className="col-md-12">{this.props.strings.noteBody6}</div> */}
            </div>
          </Modal.Body>

        </Modal>
      </div>
    )
  }
}

const stateToProps = state => ({
  showModal: state.datLenh.showModalWarningInfoOpenAcc,
  tradingdate: state.systemdate.tradingdate
});
const decorators = flow([
  connect(stateToProps),
  translate('PopupWarningOpenAcc')
]);
module.exports = decorators(PopupWarningOpenAcc);

