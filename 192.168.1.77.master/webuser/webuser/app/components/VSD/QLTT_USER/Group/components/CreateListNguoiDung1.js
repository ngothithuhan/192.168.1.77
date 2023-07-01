import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils';
import Select from 'react-select';
import { showNotifi } from 'app/action/actionNotification.js';
import TableIN from './TableIN';
import TableNoIN from './TableNoIN';

class CreateListNguoiDung1 extends React.Component {
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
      dataSTR: []
    };
  }

  componentWillMount() {

    this.setState({
      p_groupid: this.props.groupid,
      access: this.props.access,
    })

  }
  Accept() {
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

    var { dispatch } = this.props;
    var datanotify = {
      type: "",
      header: "",
      content: ""

    }
    datagroup.p_grpid = this.state.p_groupid
    datagroup.p_list_tlid = data1
    datagroup.pv_language = this.props.lang
    datagroup.pv_objname = this.props.OBJNAME;
    // console.log(datagroup)
    // this.props.getNguoiDung(datagroup,this.state.dataIN,this.state.dataNOIN,this.state.tochuc,this.state.chinhanh)

    RestfulUtils.posttrans('/fund/addtlgrpusers_list', datagroup)
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
  getlistNOIN(input) {

    let data = {
      p_mbid: this.state.p_mbid,
      p_brid: input,
      p_language: this.props.lang,
      p_groupid: this.state.p_groupid
    }

    RestfulUtils.post('/fund/getlisttlprofiles_notin_grp', { data })
      .then((res) => {

        this.setState({
          dataNOIN: res.DT.data,

        })
      })
  }
  getlistIN(input) {

    let data = {
      p_mbid: this.state.p_mbid,
      p_brid: input,
      p_language: this.props.lang,
      p_groupid: this.state.p_groupid
    }

    RestfulUtils.post('/fund/getlisttlprofiles_in_grp', { data })
      .then((res) => {

        this.setState({
          dataIN: res.DT.data
        })
      })
  }
  Add() {
    var nodes = this.state.dataTESTNOIN
    if (nodes.length > 0) {
      var arrayNOIN = this.state.dataNOIN
      for (let index = 0; index < nodes.length; index++) {
        arrayNOIN = arrayNOIN.filter(nodess => nodess.TLID != nodes[index].TLID)
        //this.state.dataIN= [...this.state.dataIN,{ TLID: nodes[index].TLID, TLNAME: nodes[index].TLNAME, FULLNAME: nodes[index].FULLNAME }]
        this.state.dataIN.push({ TLID: nodes[index].TLID, TLNAME: nodes[index].TLNAME, FULLNAME: nodes[index].FULLNAME })
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
        arrayIN = arrayIN.filter(nodess => nodess.TLID != nodes[index].TLID)
        // this.state.dataNOIN = [...this.state.dataNOIN, { TLID: nodes[index].TLID, TLNAME: nodes[index].TLNAME, FULLNAME: nodes[index].FULLNAME }]
        this.state.dataNOIN.push({ TLID: nodes[index].TLID, TLNAME: nodes[index].TLNAME, FULLNAME: nodes[index].FULLNAME })
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
      this.state.dataTESTNOIN.push({ TLID: data.TLID, TLNAME: data.TLNAME, FULLNAME: data.FULLNAME })
    else this.state.dataTESTNOIN = this.state.dataTESTNOIN.filter(nodes => nodes.TLID != data.TLID)

    this.setState({
      dataTESTNOIN: this.state.dataTESTNOIN,
      isClearCheck: false
    })
  }

  datacheckedin(data, isChecked) {
    if (isChecked == 'checked')
      this.state.dataTESTIN.push({ TLID: data.TLID, TLNAME: data.TLNAME, FULLNAME: data.FULLNAME })
    else this.state.dataTESTIN = this.state.dataTESTIN.filter(nodes => nodes.TLID != data.TLID)
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
                  <Select.Async
                    name="form-field-name"
                    loadOptions={this.loadOptionsTC.bind(this)}
                    options={this.state.dataTC}
                    value={this.state.tochuc}
                    //onChange={this.onChangeobjecttype.bind(this)}
                    onChange={this.onChangeTC.bind(this)}
                    id="txtinstitution"
                    //searchable={false}
                    clearable={false}
                  />
                </div>
                <div className="col-md-2" style={{ left: 10 }}>
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
                </div>
              </div>
              <div className={this.state.chinhanh.value == '' ? "col-md-12 row disable" : "col-md-12 row"}>

                <div className={this.state.access == 'view' ? "parts-selector selected-selected disable" : "parts-selector selected-selected"} id="parts-selector-1">
                  <div className="parts list" >
                    <h3 className="list-heading">{this.props.strings.listuser}</h3>
                    <TableNoIN dataNoIN={this.state.dataNOIN} datachecked={this.datachecked.bind(this)} isClearCheck={this.state.isClearCheck} />
                  </div>
                  <div className="controls">
                    <a className="movetoALL selected" data-toggle="tooltip" title={this.props.strings.arrownext}><span className="icon" id="arrowToIn" onClick={this.Add.bind(this)}></span><span className="text">Add</span></a>
                    <a className="movetoALL parts" data-toggle="tooltip" title={this.props.strings.arrowpre}><span className="icon" id="arrowToNotIn" onClick={this.Delete.bind(this)}></span><span className="text">Remove</span></a>
                  </div>
                  <div className="selected list">
                    <h3 className="list-heading">{this.props.strings.listuserofgroup}</h3>
                    <TableIN dataIN={this.state.dataIN} datacheckedin={this.datacheckedin.bind(this)} isClearCheck1={this.state.isClearCheck1} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>


        <div className={this.state.access == 'view' ? "col-md-12 row disable" : "col-md-12 row"}>
          <div className="pull-right">
            <input disabled={displayy} id="btnSubmitUser" type="button" onClick={this.Accept.bind(this)} className="btn btn-primary" style={{ marginRight: -17, marginTop: 10 }} value={this.props.strings.submit} />

          </div>
        </div>
      </div>




    )
  }
}
CreateListNguoiDung1.defaultProps = {

  strings: {
    title: 'Tạo mới nhóm User'

  },


};
const stateToProps = state => ({
  lang: state.language.language
});


const decorators = flow([
  connect(stateToProps),
  translate('CreateListNguoiDung1')
]);

module.exports = decorators(CreateListNguoiDung1);
