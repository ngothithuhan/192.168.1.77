import React from 'react';
import DropdownFactory from 'app/utils/DropdownFactory';
import DateInput from 'app/utils/input/DateInput';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux';
import Select from 'react-select';
import RestfulUtils from 'app/utils/RestfulUtils';
import { Modal } from 'react-bootstrap'
import { showNotifi } from 'app/action/actionNotification.js';
import moment from 'moment';

class ModalDetailCancelSKQ extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            CODEID: { value: '', label: '' },
            datagroup: {

            },
            checkFields: [

                { name: "p_catype", id: "drdRighttype" },
                { name: "p_codeid", id: "cbCODEID" },
                { name: "p_reportdate", id: "txtLastdayregister" },
                { name: "p_duedate", id: "txtDayperform" },
                { name: "p_rate", id: "txtPercentperform" },

            ],
        }
    }
    componentWillReceiveProps(nextProps) {
        let self = this;


        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change()
                this.setState({

                    datagroup: {
                        p_autoid: nextProps.DATA.AUTOID,
                        p_camastid: nextProps.DATA.CAMASTID,
                        p_catype: nextProps.DATA.CATYPE,
                        p_codeid: nextProps.DATA.CODEID,
                        p_isincode: nextProps.DATA.ISINCODE,
                        p_reportdate: nextProps.DATA.REPORTDATE,
                        p_duedate: nextProps.DATA.DUEDATE,
                        p_rate: nextProps.DATA.RATE,
                        p_description: nextProps.DATA.DESCRIPTION,
                        p_language: this.props.lang,
                        pv_objname: this.props.OBJNAME,
                    },
                    CODEID: { value: nextProps.DATA.CODEID, label: nextProps.DATA.SYMBOL },
                    access: nextProps.access,
                    isDone: true
                })
            }
        }
        else
            if (nextProps.isClear) {
                this.props.change()
                this.setState({

                    datagroup: {
                        p_autoid: '',
                        p_camastid: '',
                        p_catype: '',
                        p_codeid: '',
                        p_isincode: '',
                        p_reportdate: '',
                        p_duedate: '',
                        p_rate: '',
                        p_description: '',
                        p_language: this.props.lang,
                        pv_objname: this.props.OBJNAME,

                    },
                    access: nextProps.access,
                    isDone: false,
                    CODEID: { value: '', label: '' },
                })
            }

    }
    getOptionsSYMBOL(input) {
        return RestfulUtils.post('/allcode/search_all_funds', { key: input })
            .then((res) => {

                return { options: res }
            })
    }
    onChangeSYMBOL(e) {

        var that = this
        if (e && e.value)
            this.state.datagroup["p_codeid"] = e.value
        else this.state.datagroup["p_codeid"] = ''
        this.setState({
            CODEID: e,
            datagroup: this.state.datagroup
        })


    }
    close() {

        this.props.closeModalDetail();
    }
    async submitGroup() {
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            
            var api = '/fund/cancel_camast';
          

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
           
            RestfulUtils.posttrans(api, this.state.datagroup)
                .then((res) => {

                    if (res.EC == 0) {
                        datanotify.type = "success";
                        datanotify.content = this.props.strings.success;
                        
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
    checkValid(name, id) {
        let value = this.state.datagroup[name];
        // let value1=this.state.CODEID
        let mssgerr = '';

        switch (name) {
            case "p_catype":
                if (value == '') {
                    mssgerr = this.props.strings.requiredcatype;
                }
                break;
            case "p_codeid":
                if (value == '') {
                    mssgerr = this.props.strings.requiredcodeid;
                }
                break;

            case "p_reportdate":
                if (value == '') {
                    mssgerr = this.props.strings.requiredreportdate;
                }
                break;
            case "p_duedate":
                if (value == '') {
                    mssgerr = this.props.strings.requiredduedate;
                } else {
                  
                    //if (value != this.props.tradingdate) {
                    var tradingdate = moment(this.props.tradingdate, 'DD/MM/YYYY')
                    var duedate = moment(value, 'DD/MM/YYYY')
                    if (!(tradingdate).isBefore(duedate))
                        mssgerr = this.props.strings.requiredconditiontradingdate;
                    // }
                    else if (value != this.state.datagroup["p_reportdate"]) {
                        var reportdate = moment(this.state.datagroup["p_reportdate"], 'DD/MM/YYYY')
                        // var duedate = moment(value, 'DD/MM/YYYY')
                        if (!(reportdate).isBefore(duedate))
                            mssgerr = this.props.strings.requiredcondition;
                    }
                }
                break;
            case "p_rate":
                if (value == '') {
                    mssgerr = this.props.strings.requiredrate;
                }else{
                    if(isNaN(value)==false ){
                        if(parseFloat(value)<0) mssgerr = this.props.strings.requiredratecondition;
                    }
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
    onChangeDate(type, event) {

        this.state.datagroup[type] = event.value;
        this.setState({ datagroup: this.state.datagroup })

    }
    onSetDefaultValue = (type, value) => {
        if (!this.state.datagroup[type])
            this.state.datagroup[type] = value
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
    onValueChange(type, data) {

        this.state.datagroup[type] = data.value

        this.setState(this.state)
    }
    cardExpiry(val) {
        let month = limit(val.substring(0, 2), '12');
        let year = val.substring(2, 4);
      
        return month + (year.length ? '/' + year : '');
      }
    render() {
        let displayy=this.state.access!='add'?true:false
        return (
            <Modal show={this.props.showModalDetail} >
                <Modal.Header  >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="panel-body" >
                        <div className="add-info-account">
                            <div className={this.state.access == 'view' ? "col-md-12 disable" : "col-md-12"} style={{ paddingTop: "11px" }}>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.righttype}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup["p_catype"]} onSetDefaultValue={this.onSetDefaultValue} onChange={this.onChange.bind(this)} value="p_catype" CDTYPE="CA" CDNAME="CATYPE" ID="drdRighttype" />
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.vfmcode}</b></h5>
                                    </div>
                                    <div className="col-md-8 customSelect">
                                        <Select.Async
                                            name="form-field-name"
                                            placeholder={this.props.strings.vfmcodetype}
                                            loadOptions={this.getOptionsSYMBOL.bind(this)}
                                            value={this.state.CODEID}
                                            onChange={this.onChangeSYMBOL.bind(this)}
                                            id="cbCODEID"
                                            disabled={displayy}
                                        />
                                    </div>

                                </div>

                                {/*
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.rightcode}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <input className="form-control" type="text" placeholder={this.props.strings.rightcode} id="txtRightcode" value={this.state.datagroup["p_camastid"]} onChange={this.onChange.bind(this, "p_camastid")} />
                                    </div>
                               
                                </div>
                                */}
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5><b>{this.props.strings.isincode}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.isincode} id="txtIsincode" value={this.state.datagroup["p_isincode"]} onChange={this.onChange.bind(this, "p_isincode")} />
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.lastdayregister}</b></h5>
                                    </div>
                                    <div className="col-md-8 fixWidthDatePickerForOthers">
                                        <DateInput disabled={displayy} onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["p_reportdate"]} type="p_reportdate" id="txtLastdayregister" />

                                    </div>
                                    <div className="col-md-7"></div>
                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.dayperform}</b></h5>
                                    </div>
                                    <div className="col-md-8 fixWidthDatePickerForOthers">
                                        <DateInput disabled={displayy} onChange={this.onChangeDate.bind(this)} value={this.state.datagroup["p_duedate"]} type="p_duedate" id="txtDayperform" />
                                    </div>

                                </div>

                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 className="highlight"><b>{this.props.strings.percentperform}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.percentperform} id="txtPercentperform" value={this.state.datagroup["p_rate"]} onChange={this.onChange.bind(this, "p_rate")} />

                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="col-md-4">
                                        <h5 ><b>{this.props.strings.desc}</b></h5>
                                    </div>
                                    <div className="col-md-8">
                                        <input disabled={displayy} className="form-control" type="text" placeholder={this.props.strings.desc} id="txtDesc" value={this.state.datagroup["p_description"]} onChange={this.onChange.bind(this, "p_description")} />
                                    </div>

                                </div>
                                <div className="col-md-12 row">
                                    <div className="pull-right">

                                        <input disabled={this.state.access=='update'?false:true} type="button" className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" onClick={this.submitGroup.bind(this)} />

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
    lang: state.language.language,
    tradingdate: state.systemdate.tradingdate

});
const decorators = flow([
    connect(stateToProps),
    translate('ModalDetailCancelSKQ')
]);
module.exports = decorators(ModalDetailCancelSKQ);
