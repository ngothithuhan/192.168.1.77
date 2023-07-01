import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import DateInput from 'app/utils/input/DateInput';
import TableTSBacThang from './TableTSBacThang'
import ModaldetailBacThang from './ModaldetailBacThang'
import moment from 'moment';

class ModalDetailTTChung_info extends Component {
  constructor(props) {
    super(props);
    this.state = {

      accessBACTHANG: '',
      access: 'add',
      displayy: "none",
      datagroup: {
        p_autoid: '',
        p_termname: '',
        p_frdate: '',
        p_todate: '',
        p_status: '',
        p_pstatus: '',
        p_lastchange: '',
        pv_language: this.props.lang,
      },

      checkFields: [
        { name: "p_termname", id: "txtperiodname" },
        { name: "p_frdate", id: "txtfromdate" },
        { name: "p_todate", id: "txttodate" },

      ],
      databacthang: [],
      isClearbacthang: true,
      loadgridbacthang: false
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

          displayy: 'block',
          datagroup: {
            p_autoid: nextProps.DATA.AUTOID,
            p_termname: nextProps.DATA.TERMNAME,
            p_frdate: nextProps.DATA.FRDATE,
            p_todate: nextProps.DATA.TODATE,
            p_status: '',
            pv_language: this.props.lang,
            pv_objname: this.props.OBJNAME

          },
          dataUpdate: {
            p_termname: nextProps.DATA.TERMNAME,
            p_frdate: nextProps.DATA.FRDATE,
            p_todate: nextProps.DATA.TODATE,
          },
          access: nextProps.access

        })
      }
    }
    else
      if (nextProps.isClear) {
        this.props.change()
        this.setState({

          datagroup: {
            p_autoid: '',
            p_termname: '',
            p_frdate: '',
            p_todate: '',
            p_status: '',
            pv_language: this.props.lang,
            pv_objname: this.props.OBJNAME

          },

          displayy: 'none',
          access: nextProps.access
        })
      }
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

      case "p_termname":
        if (value == '') {
          mssgerr = this.props.strings.requiredtermname;
        }
        break;
      case "p_frdate":
        if (value == '') {
          mssgerr = this.props.strings.requiredfrdate;
        } 
        /*
        else {
          var now = moment(moment(), 'DD/MM/YYYY')
          var date = moment(value, 'DD/MM/YYYY')


          if (value !== now.format('L')) {
            if (!(now).isBefore(date))
              mssgerr = this.props.strings.requiredcondition;
          }
        }
*/
        break;
      case "p_todate":
        if (value == '') {
          mssgerr = this.props.strings.requiredtodate;
        } else {
          var now = moment(this.state.datagroup['p_frdate'], 'DD/MM/YYYY')
          if (value === now.format('L'))
            mssgerr = this.props.strings.requiredcondition1;
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
    var { dispatch } = this.props;
    var datanotify = {
      type: "",
      header: "",
      content: ""
    }
    if (mssgerr == '') {
      var api = '/fund/addreviewterm';
      if (this.state.access == "update") {
        api = '/fund/updatereviewterm';
      }
      if (this.state.access == "update") {
        if (this.state.dataUpdate["p_termname"] == this.state.datagroup["p_termname"] && this.state.dataUpdate["p_frdate"] == this.state.datagroup["p_frdate"] && this.state.dataUpdate["p_todate"] == this.state.datagroup["p_todate"]) {
          datanotify.type = "error";
          datanotify.content = this.props.strings.errmess;
          dispatch(showNotifi(datanotify));
        } else {
          RestfulUtils.posttrans(api, this.state.datagroup)
            .then((res) => {
              if (res.EC == 0) {
                datanotify.type = "success";
                datanotify.content =this.props.strings.success;
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
      }else {
        RestfulUtils.post(api, this.state.datagroup)
            .then((res) => {
              if (res.EC == 0) {
                datanotify.type = "success";
                datanotify.content = this.props.strings.success
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
  }
  onChangeDate(type, event) {
    this.state.datagroup[type] = event.value;
    this.setState({ datagroup: this.state.datagroup })
  }
  closeModalDetail1() {
    this.setState({ showModalDetail1: false })
  }
  showModalDetail1(access, bacthang) {

    let titleModal = ""
    let DATA = ""

    switch (access) {
      case "add": titleModal = this.props.strings.modaladd; break
      case "update": titleModal = this.props.strings.modaledit; break;
      case "view": titleModal = "Xem chi tiết"; break
    }

    if (bacthang != undefined) {
      DATA = bacthang
    }

    this.setState({ showModalDetail1: true, titleModal: titleModal, databacthang: DATA, accessBACTHANG: access, isClearbacthang: true, loadgrid: false })
  }

  change() {

    this.setState({ isClearbacthang: false })
  }
  loadgridbacthang() {
    this.setState({ loadgridbacthang: true })
  }
  render() {
    let displayy=this.state.access=='view'?true:false

    return (
      <Modal show={this.props.showModalDetail}  backdropClassName="firstModal">
        <Modal.Header >
          <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflow: "auto", height: "100%" }}>
          <div className="panel-body ">

            <ul className="nav nav-tabs">
              <li className="active"><a data-toggle="tab" href="#tab3" id='tab3' id='TabTTChung'><b>{this.props.strings.titlemodal1}</b></a></li>
              <li style={{ display: this.state.displayy }}><a data-toggle="tab" href="#tab4"  id='TabTSBT'> <b>{this.props.strings.titlemodal2}</b></a></li>
            </ul>
            <div className="tab-content">
              <div id="tab3" className={this.state.access == "view" ? "tab-pane fade in active disable" : "tab-pane fade in active"}>
                <div className="add-info-account">
                  <div className={this.state.access == "view" ?"col-md-12 disable":'col-md-12'} style={{ paddingTop: "11px" }}>
                    {/*
          <div className="col-md-12 row">
            <div className="col-md-3">
              <h5 className="highlight"><b>{this.props.strings.periodid}</b></h5>
            </div>
            <div className="col-md-9">
              <input className="form-control" type="text" placeholder={this.props.strings.periodid} id="txtperiodid" />
            </div>
   
          </div>
      */}
                    <div className="col-md-12 row">
                      <div className="col-md-3">
                        <h5 className="highlight"><b>{this.props.strings.periodname}</b></h5>
                      </div>
                      <div className="col-md-9">
                        <input maxLength={200} disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.periodname} id="txtperiodname" value={this.state.datagroup["p_termname"]} onChange={this.onChange.bind(this, "p_termname")} />
                      </div>

                    </div>
                    <div className="col-md-12 row">
                      <div className="col-md-3">
                        <h5 className="highlight"><b>{this.props.strings.fromdate}</b></h5>
                      </div>
                      <div className="col-md-9 fixWidthDatePickerForOthers">
                        <DateInput disabled={displayy} onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["p_frdate"]} type="p_frdate" id="txtfromdate" />
                      </div>

                    </div>
                    <div className="col-md-12 row">
                      <div className="col-md-3">
                        <h5 className="highlight"><b>{this.props.strings.todate}</b></h5>
                      </div>
                      <div className="col-md-9 fixWidthDatePickerForOthers">
                        <DateInput disabled={displayy} onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["p_todate"]} type="p_todate" id="txttodate" />
                      </div>
                    </div>
                    <div className="col-md-12 row">
                      <div className="pull-right">
                        <input disabled={displayy} type="button" onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="tab4" className={this.state.access == "view" ? "tab-pane fade disable" : "tab-pane fade"}>
                <TableTSBacThang OBJNAME={this.props.OBJNAME} showModalDetail1={this.showModalDetail1.bind(this)}
                  refID={this.state.datagroup.p_autoid}
                  loadgridbacthang={this.state.loadgridbacthang}
                  accesss={this.state.access} />
              </div>
            </div>

            <ModaldetailBacThang
              accessBACTHANG={this.state.accessBACTHANG}
              refID={this.state.datagroup.p_autoid}
              title={this.state.titleModal}
              showModalDetail1={this.state.showModalDetail1}
              closeModalDetail1={this.closeModalDetail1.bind(this)}
              databacthang={this.state.databacthang}
              loadgridbacthang={this.loadgridbacthang.bind(this)}
              isClearbacthang={this.state.isClearbacthang}
              OBJNAME={this.props.OBJNAME}
              change={this.change.bind(this)}
            />


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
  translate('ModalDetailTTChung_info')
]);
module.exports = decorators(ModalDetailTTChung_info);
