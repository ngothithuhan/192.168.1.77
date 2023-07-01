import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import DropdownFactory from "app/utils/DropdownFactory";
import { connect } from "react-redux";
import Select from "react-select";
import flow from "lodash.flow";
import translate from "app/utils/i18n/Translate.js";
import { showNotifi } from "app/action/actionNotification.js";
import RestfulUtils from "app/utils/RestfulUtils";
import DateInput from "app/utils/input/DateInput";
import NumberFormat from 'react-number-format';

class ModalDetailRE002_Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: {
        general: true,
        authorize: false,
        fatca: false,
        upload: false,
        quydangki: false
      },
      display: {
        fatca: false,
        authorize: false
      },

      CUSTID: "",
      disabled: false,
      new_create: false,
      selectedOption: "",
      dataMG: [],
      dataLH: [],
      dataMGrow: {},
      dataLHrow: {},
      CODEIDVT: "",
      optionsMaLoaiHinh: [],
      optionsDataMG: [],
      iscomm: 'N',
      //mang data cac du lieu:
      autoid: "",
      CODEID: "", //saleid
      p_tlname: "",
      p_tlfullname: "",
      p_brname: "",
      p_areades: "",
      p_mbname: "",
      p_effdate: "",
      p_expdate: "01/01/2050",
      p_contractdate: "01/01/2050",
      p_contractno: "",
      REROLE: "",
      LOAIHINH: { value: "", label: "" }, //retype
      p_reproductdes: "",
      ACTIVEDES: "",
      p_language: this.props.language,
      pv_objname: "",
      p_saleacctno: "",
      THRESHOLD:"",
      trangthai:"0",
      checkFields: [
        { name: "CODEID", id: "saleid" },
        { name: "p_effdate", id: "effdate" },
        { name: "p_expdate", id: "expdate" },
        { name: "LOAIHINH", id: "retype" }
      ]
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
  setDefaultMLH() {
    var that = this;
    RestfulUtils.post("/allcode/getlist", {
      CDTYPE: "RE",
      CDNAME: ["DREROLE", "IREROLE"]
    })
      .then(res => {
        if (res.errCode == 0) {
          if (res)
            if (res.length > 0) {
              that.setState({ REROLE: res[0].CDVAL });
              that.getdataREROLE();
            }
        }
      })
      .catch(e => { });
  }
  componentWillReceiveProps(nextProps) {
    let self = this;
    //lay du lieu loai hinh theo rerole dau tien
    console.log('data on load  :', nextProps.DATA)
    if (nextProps.access == "update" || nextProps.access == "view") {
      if (nextProps.isClear) {
        this.props.change();
        let { SALEID } = nextProps.DATA;

        let { dataMG } = this.state;
        if (dataMG)
          if (dataMG.length > 0) {
            let arry = dataMG.filter(item => item.TLID == SALEID);
            if (arry.length > 0) {
              let itemMG = arry[0];
              this.getdataREROLE();
              //console.log('xem data',nextProps.DATA)
              this.setState({
                p_reproductdes: nextProps.DATA.REPRODUCTDES,
                p_reproductdes_en: nextProps.DATA.REPRODUCTDES_EN,
                CODEID: nextProps.DATA.SALEID,
                dataMGrow: itemMG,
                p_effdate: nextProps.DATA.EFFDATE,
                p_expdate: nextProps.DATA.EXPDATE,
                THRESHOLD: nextProps.DATA.THRESHOLD,
                iscomm : nextProps.DATA.ISCOMM,
                REROLE: nextProps.DATA.REROLE,
                ACTIVEDES: nextProps.DATA.ACTIVEDES,
                pv_language: this.props.language,
                pv_objname: this.props.OBJNAME,
                autoid: nextProps.DATA.AUTOID + "",
                access: nextProps.access,
                p_contractdate: nextProps.DATA.CONTRACTDATE,
                p_contractno: nextProps.DATA.CONTRACTNO,
                trangthai :nextProps.DATA.TRANGTHAI,
                LOAIHINH: {
                  value: nextProps.DATA.RETYPE,
                  label: nextProps.DATA.RETYPEDES
                }
              });
            }
          }
      }
    } else {
      //this.setDefaultMLH()
      if (nextProps.isClear) {
        this.props.change();
        this.getdataREROLE();
        this.setState({
          CODEID: "",
          dataMGrow: {},
          p_effdate: "",
          p_expdate: "",
          REROLE: "",
          p_contractdate: "",
          p_contractno: "",
          LOAIHINH: { value: "", label: "" },
          p_reproductdes: "",
          p_reproductdes_en: "",
          ACTIVEDES: "",
          iscomm : "N",
          p_contractdate:"",
          THRESHOLD: "0",
          trangthai :"0",
          pv_language: this.props.language,
          pv_objname: this.props.OBJNAME,
          access: nextProps.access
        });
      }
    }
  }
  // onchange(event) {
  //   this.setState({ iscomm: event.target.value });
  // }
  closeModalDetail() {
    this.setState({ showModalDetai: false });
  }
  showModalDetail(access, bacthang) {
    let titleModal = "";
    let DATA = "";

    switch (access) {
      case "add":
        titleModal = this.props.strings.modaladd;
        break;
      case "update":
        titleModal = this.props.strings.modaledit;
        break;
      case "view":
        titleModal = this.props.strings.modalview;
        break;
    }
    if (bacthang != undefined) {
      DATA = bacthang;
    }

    this.setState({
      showModalDetail: true,
      titleModal: titleModal,
      databacthang: DATA,
      accessBACTHANG: access,
      isClearbacthang: true,
      loadgrid: false
    });
  }

  async componentWillMount() {
    let that = this;
    await RestfulUtils.post("/user/gettlprofiles", {
      language: this.props.language
    }).then(res => {
      that.setState({
        ...that.state,
        dataMG: res.resultdata,
        optionsDataMG: res.result
      });
      //console.log('data mg -- -- ', this.state.dataMG)
    });
  }
  async getOptionsMaMoGioi(input) {
    return { options: this.state.optionsDataMG };
  }
  async onChangeMaMoGioi(e) {
    let result = {};
    let { dataMG } = this.state;

    if (e && e.value) {
      if (dataMG)
        if (dataMG.length > 0) {
          result = await dataMG.filter(item => item.TLID == e.value);
          if (result)
            if (result.length > 0) {
              this.setState({
                dataMGrow: result[0]
              });
            }
          //console.log('dataMGrow', this.state.dataMGrow)
        }
      this.setState({
        CODEID: e.value
      });
    } else {
      this.setState({ CODEID: "" });
    }
  }

  async getOptionsMaLoaiHinh(input) {
    //console.log('get option mlh')
    return { options: this.state.optionsMaLoaiHinh };
  }
  async onChangeLOAIHINH(e) {
    let result = {};
    let { dataLH } = this.state;
    //console.log("onChangeLOAIHINH", e.value)
    if (e && e.value) {
      if (dataLH)
        if (dataLH.length > 0) {
          result = await dataLH.filter(item => item.AUTOID == e.value);
          if (result)
            if (result.length > 0) {
              this.setState({
                dataLHrow: result[0]
              });
              //console.log('dataLHrow  ', this.state.dataLHrow)
            }
        }
      this.setState({
        LOAIHINH: e,
        p_reproductdes: this.state.dataLHrow.REPRODUCTDES,
        p_reproductdes_en: this.state.dataLHrow.REPRODUCTDES
      });
    } else {
      this.setState({ LOAIHINH: { value: "", label: "" } });
    }
  }
  //get data rerole de lay ma loai hinh theo vai tro
  async getdataREROLE() {
    let that = this;
    await RestfulUtils.post("/user/getsaleretype", {
      rerole: 'ALL',
      language: that.props.language
    }).then(res => {
      //console.log('getdataREROLE', res)
      if (res.result)
        that.setState({
          ...that.state,
          optionsMaLoaiHinh: res.result.filter(nodes => nodes.status == "A"),
          dataLH: res.resultdata
        });
    });
  }
  onChangeDropdown(type, event) {
    console.log(type, event)
    this.state[type] = event.value; //type dai dien la REROLE
    //console.log('type', type, event.value)

    //if (type == "REROLE") this.getdataREROLE();

    this.setState(this.state);
  }

  onSetDefaultValue = (type, value) => {
    //console.log('this.state.REROLE.fdfd', this.state.REROLE)
    if (!this.state[type])
      // if ((type = "REROLE")) {
      //   this.getdataREROLE();
      //   this.state[type] = value;
      // } else {
      //   this.state[type] = value;
      // }
      this.state[type] = value;
  };
  checkValid(name, id) {
    let value = this.state[name];
    //console.log('value check:',name, value)
    let mssgerr = "";
    switch (name) {
      case "CODEID":
        if (value == "") {
          mssgerr = this.props.strings.require_saleid;
        }
        break;
      // case "p_effdate":
      //   if (value == "") {
      //     mssgerr = this.props.strings.require_effdate;
      //   }
      //   break;
      // case "p_expdate":
      //   if (value == "") {
      //     mssgerr = this.props.strings.require_expdate;
      //   }
      //   break;
      case "LOAIHINH":
        if (this.state.LOAIHINH.value == "") {
          mssgerr = this.props.strings.require_retype;
        }
        break;
      default:
        break;
    }
    if (mssgerr !== "") {
      var { dispatch } = this.props;
      var datanotify = {
        type: "",
        header: "",
        content: ""
      };
      datanotify.type = "error";
      datanotify.content = mssgerr;
      dispatch(showNotifi(datanotify));
      window.$(`#${id}`).focus();
    }
    return mssgerr;
  }
  onValueChange(type, data) {
    // console.log('valueChange', type, data)
    this.state[type] = data.value
    this.setState(this.state)
  }
  async submitGroup() {
    var mssgerr = "";
    for (let index = 0; index < this.state.checkFields.length; index++) {
      const element = this.state.checkFields[index];
      mssgerr = this.checkValid(element.name, element.id);
      if (mssgerr !== "") break;
    }
    if (mssgerr == "") {
      var api = "/user/addlistsaleroles";
      if (this.state.access == "update") {
        api = "/user/updatelistsaleroles";
      }
      var { dispatch } = this.props;
      var datanotify = {
        type: "",
        header: "",
        content: ""
      };
      //consoconsole.log('xxx ', this.state.LOAIHINH, this.state.CODEID)
      let self = this;
      RestfulUtils.post(api, {
        autoid: this.state.autoid,
        retype: this.state.LOAIHINH.value,
        saleid: this.state.CODEID,
        effdate: this.state.p_effdate,
        expdate: this.state.p_expdate,
        threshold: this.state.THRESHOLD,
        iscomm: this.state.iscomm,
        p_contractdate : this.state.p_contractdate,
        p_contractno : this.state.p_contractno,
        trangthai : this.state.trangthai,
        saleacctno:  this.state.CODEID + this.state.LOAIHINH.value,
        language: this.props.language,
        objname: this.props.OBJNAME
      }).then(res => {
        //onsole.log('res ', res)
        if (res.EC == 0) {
          datanotify.type = "success";
          datanotify.content = this.props.strings.success;
          dispatch(showNotifi(datanotify));
          this.clearLOAIHINH();
          this.props.closeModalDetail();
          this.props.createSuccess();
        } else {
          datanotify.type = "error";
          datanotify.content = res.EM;
          dispatch(showNotifi(datanotify));
        }
      });
    }
  }
  handleChange(type) {
    this.state.collapse[type] = !this.state.collapse[type];
    this.setState({ collapse: this.state.collapse });
  }
  onChange(type, event) {
    console.log(type, event)
    if (event.target) {
      this.state[type] = event.target.value;
    } else {
      this.state[type] = event.value;
    }
    this.setState(this.state)
    // this.setState({
    //   p_effdate: this.state.p_effdate,
    //   p_expdate: this.state.p_expdate
    // });
  }
  clearLOAIHINH() {
    this.setState({
      LOAIHINH: { value: "", label: "" }
    });
  }
  render() {
    const { dataMGrow } = this.state;
    console.log('this.state:',this.state)
    let disableWhenUpdate = this.state.access == "update";
    let disableWhenView = this.state.access == "view";

    return (
      <Modal show={this.props.showModalDetail} bsSize="lg">
        <Modal.Header>
          <Modal.Title>
            <div className="title-content col-md-6">
              {this.props.title}{" "}
              <button
                type="button"
                className="close"
                onClick={this.close.bind(this)}
              >
                <span aria-hidden="true">×</span>
                <span className="sr-only">Close</span>
              </button>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{  height: "100%" }}>
          <div className="panel-body ">
            <div className="tab-content">
              <div className="add-info-account">
                <div
                  id="tab3"
                  className={
                    this.state.access == "view"
                      ? "col-md-12 disable"
                      : "col-md-12 "
                  }
                >
                  <div className="col-md-12" style={{ paddingTop: "11px" }}>
                    <div className="col-md-12 row">
                      <div className="col-md-2">
                        <h5 className="highlight">
                          <b>{this.props.strings.saleid}</b>
                        </h5>
                      </div>
                      <div className="col-md-4">
                        <Select.Async
                          className="form-field-name"
                          disabled={disableWhenUpdate || disableWhenView}
                          name="form-field-name"
                          placeholder={this.props.strings.placeholder}
                          loadOptions={this.getOptionsMaMoGioi.bind(this)}
                          options={this.state.optionsDataMG}
                          cache={false}
                          value={this.state.CODEID}
                          onChange={this.onChangeMaMoGioi.bind(this)}
                          id="drdCODEID"
                        />
                      </div>
                      <div className="col-md-2">
                        <h5>
                          <b>{this.props.strings.tlname}</b>
                        </h5>
                      </div>
                      <div className="col-md-4">
                        <label className="form-control" id="tlname">
                          {dataMGrow ? dataMGrow["TLFULLNAME"] : ""}
                        </label>
                      </div>
                    </div>
                    <div className="col-md-12 row">
                      
                      <div className="col-md-2">
                        <h5>
                          <b>{this.props.strings.brname}</b>
                        </h5>
                      </div>
                      <div className="col-md-4">
                        <label className="form-control" id="brname">
                          {dataMGrow ? dataMGrow["BRNAME"] : ""}
                        </label>
                      </div>
                      <div className="col-md-2">
                        <h5>
                          <b>{this.props.strings.areades}</b>
                        </h5>
                      </div>
                      <div className="col-md-4">
                        <label className="form-control" id="areades">
                          {dataMGrow ? dataMGrow["AREADES"] : ""}
                        </label>
                      </div>
                    </div>

                    
                    <div className="col-md-12 row">
                      
                      <div className="col-md-2">
                        <h5>
                          <b>{this.props.strings.mbname}</b>
                        </h5>
                      </div>
                      <div className="col-md-10">
                      <label className="form-control" id="txtInstitution">
                          {dataMGrow ? dataMGrow["MBNAME"] : ""}
                        </label>
                        {/* <textarea disabled={true} className="form-control" rows="3" style = {{minWidth:"150px",minHeight:"50px" ,height:"50px"}}
                        id="txtInstitution" value={dataMGrow ? dataMGrow["MBNAME"] : ""} ></textarea>
                         */}
                      </div>
                    </div>
                   
                    <div className="col-md-12 row">
                      <div className="col-md-2">
                        <h5>
                          <b>{this.props.strings.contractno}</b>
                        </h5>
                      </div>
                      <div className="col-md-4">
                      <input
                        maxLength="500"
                        disabled={disableWhenView}
                        value={this.state.p_contractno}
                        onChange={this.onChange.bind(this, "p_contractno")}
                        id="txtcontractno"
                        className="form-control"
                        type="text"
                        placeholder={this.props.strings.contractno}
                      />
                        
                      </div>
                      <div className="col-md-2">
                        <h5>
                          <b>{this.props.strings.contractdate}</b>
                        </h5>
                      </div>
                      <div className="col-md-4">
                      <DateInput
                          disabled={disableWhenView}
                          onChange={this.onChange.bind(this)}
                          value={this.state.p_contractdate}
                          type="p_contractdate"
                          id="contractdate"
                        />
                      
                      </div>
                    </div>

                    {/* <div className="col-md-12 row">
                      <div className="col-md-2">
                        <h5 className="highlight">
                          <b>{this.props.strings.effdate}</b>
                        </h5>
                      </div>
                      <div className="col-md-4 fixWidthDatePickerForOthers">
                        <DateInput
                          disabled={disableWhenView}
                          onChange={this.onChange.bind(this)}
                          value={this.state.p_effdate}
                          type="p_effdate"
                          id="effdate"
                        />
                      </div>
                      <div className="col-md-2">
                        <h5 className="highlight">
                          <b>{this.props.strings.expdate}</b>
                        </h5>
                      </div>
                      <div className="col-md-4 fixWidthDatePickerForOthers">
                        <DateInput
                          disabled={disableWhenView}
                          onChange={this.onChange.bind(this)}
                          value={this.state.p_expdate}
                          type="p_expdate"
                          id="expdate"
                        />
                      </div>
                    </div> */}
                    
                    <div className="col-md-12 row">
                      {/* <div className="col-md-2">
                        <h5 className="highlight">
                          <b>{this.props.strings.reroledes}</b>
                        </h5>
                      </div>
                      <div className="col-md-4">
                        <DropdownFactory
                          disabled={disableWhenUpdate || disableWhenView}
                          onSetDefaultValue={this.onSetDefaultValue}
                          CDVAL={this.state.REROLE}
                          onChange={this.onChangeDropdown.bind(this)}
                          value="REROLE"
                          CDTYPE="RE"
                          CDNAME="REROLE"
                          ID="drdRole"
                          style = "customheight34px"
                        />
                      </div> */}
                      <div className="col-md-2">
                        <h5 className="highlight">
                          <b>{this.props.strings.retype}</b>
                        </h5>
                      </div>
                      <div className="col-md-10">
                        <Select.Async
                          disabled={disableWhenUpdate || disableWhenView}
                          className="form-field-name"
                          name="form-field-name"
                          placeholder={this.props.strings.placeholder}
                          loadOptions={this.getOptionsMaLoaiHinh.bind(this)}
                          options={this.state.optionsMaLoaiHinh}
                          value={this.state.LOAIHINH.value}
                          onChange={this.onChangeLOAIHINH.bind(this)}
                          cache={false}
                          id="drdLOAIHINH"
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-12 row">
                      <div className="col-md-2">
                        <h5>
                          <b>{this.props.strings.reproductdes}</b>
                        </h5>
                      </div>
                      <div className="col-md-4">
                        <label className="form-control" id="lblInstitution">
                          {this.props.language == "vie"
                            ? this.state.p_reproductdes
                            : this.state.p_reproductdes_en}
                        </label>
                      </div>
                      <div className="col-md-2">
                        <h5>
                          <b>{this.props.strings.trangthai}</b>
                        </h5>
                      </div>
                      <div className="col-md-4">
                      <DropdownFactory
                          //disabled={disableWhenUpdate || disableWhenView}
                          onSetDefaultValue={this.onSetDefaultValue}
                          CDVAL={this.state.trangthai}
                          onChange={this.onChangeDropdown.bind(this)}
                          value="trangthai"
                          CDTYPE="SY"
                          CDNAME="TLSTATUS"
                          ID="drdTLSTATUS"
                        />

                        {/* <DropdownFactory
                          //disabled={disableWhenUpdate || disableWhenView}
                          //onSetDefaultValue={this.onSetDefaultValue}
                          //CDVAL={this.state.trangthai}
                          onChange={this.onChangeDropdown.bind(this)}
                          value={this.state.trangthai}
                          CDTYPE="SY"
                          CDNAME="TLSTATUS"
                          ID="drdRole"
                        /> */}
                      </div>

                    </div>
                    <div className="col-md-12 row">
                      <div className="col-md-2">
                        <h5>
                          <b>{this.props.strings.dinhmucmg}</b>
                        </h5>
                      </div>
                      <div className="col-md-10">
                      <input
                        maxLength="500"
                        disabled={disableWhenView}
                        value={this.state.THRESHOLD}
                        onChange={this.onChange.bind(this, "THRESHOLD")}
                        id="txtcontractno"
                        className="form-control"
                        type="text"
                        placeholder={this.props.strings.dinhmucmg}
                      />
                        {/* <label className="form-control" id="areades">
                          {dataMGrow ? dataMGrow["AREADES"] : ""}
                        </label> */}
                      </div>
                      </div>
                    {/* <div className="col-md-12 row">
                      <div className="col-md-4">
                        <h5 className="highlight"><b>{this.props.strings.iscomm}</b></h5>
                      </div>
                      <div className="col-md-8 customSelect">
                        <select className="form-control"
                          onChange={this.onchange.bind(this)}
                          value={this.state.iscomm}
                          id="s_iscomm">
                          <option value="N">{this.props.strings.no}</option>
                          <option value="Y">{this.props.strings.yes}</option>
                        </select>
                      </div>
                    </div> */}
                    <div className="col-md-12 row">
                      <div className="pull-right">
                        <input
                          type="button"
                          onClick={this.submitGroup.bind(this)}
                          className="btn btn-primary"
                          style={{ marginRight: 15 }}
                          value={this.props.strings.submit}
                          id="btnSubmit"
                        />
                      </div>
                    </div>
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
  language: state.language.language
});
const decorators = flow([
  connect(stateToProps),
  translate("ModalDetailRE002_Info")
]);
module.exports = decorators(ModalDetailRE002_Info);
