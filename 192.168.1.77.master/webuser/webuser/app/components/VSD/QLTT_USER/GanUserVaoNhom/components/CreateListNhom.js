import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import Select from 'react-select';
import { showNotifi } from 'app/action/actionNotification.js';
import TableINNhom from './TableINNhom';
import TableNoINNhom from './TableNoINNhom';
import DropdownFactory from 'app/utils/DropdownFactory';

class CreateListNhom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isClearCheck1: false,
      tochuc: { value: '', label: '' },
      chinhanh: { value: '', label: '' },
      dataIN: [],
      dataTESTNOIN: [],
      dataTESTIN: [],
      dataNOIN: [{
      },],
      datagroup: {},
      p_groupid: '',
      selectedShips: [],
      isClearCheck: false,
      dataSTR: [],
      p_strtlid: '',
      GRPTYPE :'2'
    };
  }

  componentWillMount() {
    var p_strtlid = '';
    console.log('this.props:::', this.props)
    p_strtlid = this.props.data.TLID;
    this.getlistNOIN(this.props.data.TLID, this.state.GRPTYPE)
    this.getlistIN(this.props.data.TLID,this.state.GRPTYPE)
    this.setState({
      p_strtlid: this.props.data.TLID,
      p_groupid: this.props.groupid,
      access: this.props.access,
    })

  }
  Accept() {
    let data = []
    this.state.dataIN.filter(nodes => data.push(nodes.GRPID))

    let data1 = ''
    let datagroup = {}

    //id
    for (let i = 0; i <= data.length - 1; i++) {
      if (i == data.length - 1)
        data1 += data[i]
      else data1 += data[i] + '~#~'
    }

    var { dispatch } = this.props;
    var datanotify = {
      type: "",
      header: "",
      content: ""

    }
    datagroup.p_strtlid = this.state.p_strtlid;
    datagroup.p_list_grpid = data1;
    datagroup.pv_language = this.props.lang
    datagroup.pv_objname = this.props.objname;
    datagroup.p_role = this.state.GRPTYPE;
    // console.log(datagroup)
    // this.props.getNguoiDung(datagroup,this.state.dataIN,this.state.dataNOIN,this.state.tochuc,this.state.chinhanh)

    RestfulUtils.posttrans('/fund/addtlgrpusers_list_foruser', datagroup)
      .then((res) => {

        if (res.EC == 0) {
          datanotify.type = "success";
          datanotify.content = this.props.strings.success;

          dispatch(showNotifi(datanotify));



        } else {
          datanotify.type = "error";
          datanotify.content = res.EM;
          dispatch(showNotifi(datanotify));
        }

      })

  }


  loadOptionsTC(input) {

    let data = {

      p_language: this.props.lang,
    }

    return RestfulUtils.post('/fund/getlistmember_bytlid', { data })
      .then((res) => {
        this.loadOptionsChinhanh(res[0].value)
        this.setState({
          tochuc: res[0],
          p_mbid: res[0].value,
          dataNOIN: []
        })
        return { options: res }


      })
  }
  async loadOptionsChinhanh(input) {

    let data = {
      p_mbid: input,
      p_language: this.props.lang,
    }

    await RestfulUtils.post('/fund/getlistbrgrp_bymbid', { data })
      .then((res) => {
        this.getlistNOIN(res[0].value)
        this.getlistIN(res[0].value)
        this.setState({
          dataCN: res,
          chinhanh: { value: res[0].value, label: res[0].label }
        })
      })
  }
  onChangeTC(e) {

    var that = this
    if (e && e.value) {
      if (this.state.p_mbid != e.value) {
        this.loadOptionsChinhanh(e.value)
        this.setState({
          chinhanh: { value: '', label: '' },
          dataIN: [],
          dataNOIN: [],
          tochuc: e,
          p_mbid: e.value,
          isClearCheck1: true,
          isClearCheck: true,
          dataIN: [],
          dataTESTIN: [],
          dataTESTNOIN: [],
        })
      }
    }
  }
  onChangeCN(e) {

    var that = this
    if (e && e.value) {
      if (this.state.chinhanh.value != e.value) {
        this.getlistNOIN(e.value)
        this.getlistIN(e.value)
        this.setState({
          chinhanh: e,
          isClearCheck1: true,
          isClearCheck: true,
          dataNoIN: [],
          dataTESTNOIN: [],
          dataTESTIN: [],
        })
      }
    }
  }
  onChange(type, event) {
    console.log(type, event)
    if (type == "GRPTYPE") {
      this.getlistNOIN(this.props.data.TLID, event.value)
      this.getlistIN(this.props.data.TLID, event.value)
      //this.getInforAccount(event.target.value)
      this.state[type] = event.value;
    }
    this.setState({ state: this.state })

  }
  onSetDefaultValue = (type, value) => {
    if (!this.state[type])
      this.state[type] = value
  }
  getlistNOIN(p_strtlid, type) {

    let data = {
      p_strtlid: p_strtlid,
      p_type: type
    }

    RestfulUtils.post('/fund/get_listgrp_notin', { data })
      .then((res) => {

        this.setState({
          dataNOIN: res.DT.data,

        })
      })
  }
  getlistIN(p_strtlid, type) {

    let data = {
      p_strtlid: p_strtlid,
      p_type: type
    }

    RestfulUtils.post('/fund/get_listgrp_in', { data })
      .then((res) => {

        this.setState({
          dataIN: res.DT.data
        })
      })
  }
  Add() {
    var nodes = this.state.dataTESTNOIN
    console.log('nodes::::', nodes)
    if (nodes.length > 0) {
      var arrayNOIN = this.state.dataNOIN
      console.log('arrayNOIN::::', arrayNOIN)
      for (let index = 0; index < nodes.length; index++) {
        arrayNOIN = arrayNOIN.filter(nodess => nodess.GRPID != nodes[index].GRPID)
        //this.state.dataIN= [...this.state.dataIN,{ TLID: nodes[index].TLID, TLNAME: nodes[index].TLNAME, FULLNAME: nodes[index].FULLNAME }]
        this.state.dataIN.push({ GRPID: nodes[index].GRPID, GRPNAME: nodes[index].GRPNAME })
        console.log('this.state.dataIN::::', this.state.dataIN)
      }
      /*
      if(nodes.length>0){
      let data = []
      this.state.dataIN.filter(nodes => data.push(nodes.TLID))
      let data1 = ''
      let datagroup = {}
  
      //id
      for (let i = 0; i <= data.length - 1; i++) {
        if (i == data.length - 1)
          data1 += data[i]
        else data1 += data[i] + '~#~'
      }
      this.state.dataSTR.push({
        p_grpid : this.state.p_groupid,p_list_tlid : data1,pv_language : this.props.lang,pv_objname : this.props.OBJNAME
  
      })
     
   
    }
    */
      this.setState({
        dataIN: this.state.dataIN,
        dataNOIN: arrayNOIN,
        dataTESTNOIN: [],
        isClearCheck: true,
        //  dataSTR:this.state.dataSTR
      })
    }
  }
  Delete() {
    var nodes = this.state.dataTESTIN
    if (nodes.length > 0) {
      var arrayIN = this.state.dataIN
      for (let index = 0; index < nodes.length; index++) {
        arrayIN = arrayIN.filter(nodess => nodess.GRPID != nodes[index].GRPID)
        // this.state.dataNOIN = [...this.state.dataNOIN, { TLID: nodes[index].TLID, TLNAME: nodes[index].TLNAME, FULLNAME: nodes[index].FULLNAME }]
        this.state.dataNOIN.push({ GRPID: nodes[index].GRPID, GRPNAME: nodes[index].GRPNAME })
      }
      /*
          if(nodes.length>0){
            let data = []
            arrayIN.filter(nodes => data.push(nodes.TLID))
            let data1 = ''
            let datagroup = {}
        
            //id
            for (let i = 0; i <= data.length - 1; i++) {
              if (i == data.length - 1)
                data1 += data[i]
              else data1 += data[i] + '~#~'
            }
            this.state.dataSTR.push({
              p_grpid : this.state.p_groupid,p_list_tlid : data1,pv_language : this.props.lang,pv_objname : this.props.OBJNAME
        
            })
           
            console.log(this.state.dataSTR)
          }
      */
      this.setState({
        dataNOIN: this.state.dataNOIN,
        dataIN: arrayIN,
        dataTESTIN: [],
        isClearCheck1: true,
        // dataSTR:this.state.dataSTR
      })
    }
  }
  datachecked(data, isChecked) {

    if (isChecked == 'checked')
      this.state.dataTESTNOIN.push({ GRPID: data.GRPID, GRPNAME: data.GRPNAME })
    else this.state.dataTESTNOIN = this.state.dataTESTNOIN.filter(nodes => nodes.GRPID != data.GRPID)

    this.setState({
      dataTESTNOIN: this.state.dataTESTNOIN,
      isClearCheck: false
    })
  }

  datacheckedin(data, isChecked) {
    if (isChecked == 'checked')
      this.state.dataTESTIN.push({ GRPID: data.GRPID, GRPNAME: data.GRPNAME })
    else this.state.dataTESTIN = this.state.dataTESTIN.filter(nodes => nodes.GRPID != data.GRPID)
    this.setState({
      dataTESTIN: this.state.dataTESTIN,
      isClearCheck1: false
    })
  }
  render() {
    let displayy = this.state.access == 'view' ? true : false
    return (

      <div className="add-info-account">
        <div className="col-md-12" style={{ paddingTop: "11px" }}>
          <div className="panel panel-default">
            <div className="panel-heading">{this.props.strings.title}</div>
            <div className="panel-body">
              <div className="col-md-12 row">
                <div className="col-md-2">
                  <h5 className="highlight"><b>{this.props.strings.institution}</b></h5>
                </div>
                <div className="col-md-4" style={{ right: 15 }}>
                  <DropdownFactory
                    onSetDefaultValue={this.onSetDefaultValue}
                    onChange={this.onChange.bind(this)}
                    ID="drdGRPTYPE"
                    value="GRPTYPE"
                    CDTYPE="SA"
                    CDNAME="GRPTYPEALT"
                    CDVAL={this.state.GRPTYPE} />

                </div>
                {/* <div className="col-md-2" style={{ left: 10 }}>
                  <h5 className="highlight"><b>{this.props.strings.branch}</b></h5>
                </div>
                <div className="col-md-4">
                  <Select
                    name="form-field-name"
                    //loadOptions={this.loadOptionsTC.bind(this)}
                    options={this.state.dataCN}
                    value={this.state.chinhanh}
                    //onChange={this.onChangeobjecttype.bind(this)}
                    onChange={this.onChangeCN.bind(this)}
                    id="txtbranch"
                    //searchable={false}
                    clearable={false}
                  />
                </div> */}
              </div>
              <div className={this.state.chinhanh.value == '' ? "col-md-12 row" : "col-md-12 row"}>

                <div className={this.state.access == 'view' ? "parts-selector selected-selected" : "parts-selector selected-selected"} id="parts-selector-1">
                  <div className="parts list" >
                    <h3 className="list-heading">{this.props.strings.listuser}</h3>
                    <TableNoINNhom dataNoIN={this.state.dataNOIN} datachecked={this.datachecked.bind(this)} isClearCheck={this.state.isClearCheck} />
                  </div>
                  <div className="controls">
                    <a className="movetoALL selected" data-toggle="tooltip" title={this.props.strings.arrownext}><span className="icon" id="arrowToIn" onClick={this.Add.bind(this)}></span><span className="text">Add</span></a>
                    <a className="movetoALL parts" data-toggle="tooltip" title={this.props.strings.arrowpre}><span className="icon" id="arrowToNotIn" onClick={this.Delete.bind(this)}></span><span className="text">Remove</span></a>
                  </div>
                  <div className="selected list">
                    <h3 className="list-heading">{this.props.strings.listuserofgroup}</h3>
                    <TableINNhom dataIN={this.state.dataIN} datacheckedin={this.datacheckedin.bind(this)} isClearCheck1={this.state.isClearCheck1} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>


        <div className={this.state.access == 'view' ? "col-md-12 row" : "col-md-12 row"}>
          <div className="pull-right">
            <input id="btnSubmitUser" type="button" onClick={this.Accept.bind(this)} className="btn btn-primary" style={{ marginRight: -17, marginTop: 10 }} value={this.props.strings.submit} />

          </div>
        </div>
      </div>




    )
  }
}
CreateListNhom.defaultProps = {

  strings: {
    title: 'Tạo mới nhóm User'

  },


};
const stateToProps = state => ({
  lang: state.language.language
});


const decorators = flow([
  connect(stateToProps),
  translate('CreateListNhom')
]);

module.exports = decorators(CreateListNhom);
