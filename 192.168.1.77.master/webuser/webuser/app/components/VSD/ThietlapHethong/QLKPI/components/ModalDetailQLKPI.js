import React, { Component } from 'react';
import { Modal  } from 'react-bootstrap'
import DropdownFactory from '../../../../../utils/DropdownFactory';
import NumberFormat from 'react-number-format';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils'
import Select from 'react-select';
import { showNotifi } from 'app/action/actionNotification.js';
import { connect } from 'react-redux'

class ModalDetailQLKPI extends Component {
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
            access: 'add',
            CUSTID: '',
            disabled: false,
            new_create: false,
            phone: { value: 0, validate: null, tooltip: "Không được để trống !!" },
            object: { value: '', label: '' },
            datachange: {},
            datagroup: {

                p_autoid: '',
                p_notes: '',
                p_yearcd: '',
                p_objtype: '',
                p_objvalue: '',
                p_cyclecd: '',
                p_amtyy: 0,
                p_amtq1: 0,
                p_amtq2: 0,
                p_amtq3: 0,
                p_amtq4: 0,
                p_status: '',
            },
            checkFields: [

                { name: "p_yearcd", id: "txtYear" },
                { name: "p_scopevalue", id: "txtvalue" },
                { name: "p_objvalue", id: "txtObjectname" },


            ],
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
    collapse(tab) {
        // console.log(tab)
        this.state.collapse[tab] = !this.state.collapse[tab];
        // console.log(this.state.collapse)
        this.setState({ collapse: this.state.collapse })
    }
    //   handleChange(type){
    //     this.props.handleChange(type);

    //  }
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

        if (nextProps.access == "update" || nextProps.access == "view") {

            if (nextProps.isClear) {
                this.getOptionsobject(nextProps.DATA.OBJTYPE)
                this.getOptionsscopekpi(nextProps.DATA.SCOPETYPE)
                this.props.change()
                this.setState({
                    display: {
                        fatca: true,
                        authorize: true,
                        upload: true,
                        quydangki: true
                    },
                    datagroup: {
                        p_autoid: nextProps.DATA.AUTOID,
                        p_notes: nextProps.DATA.NOTES,
                        p_scopetype: nextProps.DATA.SCOPETYPE,
                        p_scopevalue: nextProps.DATA.SCOPEVALUE,
                        p_yearcd: nextProps.DATA.YEARCD,
                        p_objtype: nextProps.DATA.OBJTYPE,
                        p_objvalue: nextProps.DATA.OBJVALUE,
                        p_cyclecd: nextProps.DATA.CYCLECD,
                        p_amtyy: nextProps.DATA.AMTYY,
                        p_amtq1: nextProps.DATA.AMTQ1,
                        p_amtq2: nextProps.DATA.AMTQ2,
                        p_amtq3: nextProps.DATA.AMTQ3,
                        p_amtq4: nextProps.DATA.AMTQ4,
                        //p_status: '',
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME

                    },

                    access: nextProps.access,
                    object: { value: nextProps.DATA.OBJVALUE, label: nextProps.DATA.OBJVALUEDES },
                    value: { value: nextProps.DATA.SCOPEVALUE, label: nextProps.DATA.SCOPEVALUEDES },
                    isDone: true,

                })
            }
        }
        else
            if (nextProps.isClear) {
                this.props.change()
                this.setState({
                    display: {
                        fatca: false,
                        authorize: false,
                        upload: false,
                        quydangki: false,

                    },
                    datagroup: {

                        p_autoid: '',
                        p_notes: '',
                        p_yearcd: '',
                        p_objtype: '',
                        p_objvalue: '',
                        p_cyclecd: '',
                        p_scopetype: '',
                        p_scopevalue: '',
                        p_amtyy: 0,
                        p_amtq1: 0,
                        p_amtq2: 0,
                        p_amtq3: 0,
                        p_amtq4: 0,
                        // p_status: '',
                        pv_language: this.props.lang,
                        pv_objname: this.props.OBJNAME

                    },
                    new_create: true,
                    access: 'add',
                    isDone: false,
                    object: { value: '', label: '' },
                    value: { value: '', label: '' },
                })

            }

    }


    handleChange(type, data) {

        if (data.value != '' && data.value != 0)
            this.state.datagroup[type] = parseInt(data.value)
        else this.state.datagroup[type] = ''
        this.setState(this.state)
    }
    onValueChange(type, data) {
        if (data.value == '' || data.value < 0) data.value = 0
        if (this.state.datagroup.p_cyclecd == 'Q') {


            let kpi1 = parseInt(this.state.datagroup['p_amtq1'])
            let kpi2 = parseInt(this.state.datagroup['p_amtq2'])
            let kpi3 = parseInt(this.state.datagroup['p_amtq3'])
            let kpi4 = parseInt(this.state.datagroup['p_amtq4'])
            let kpitype = parseInt(this.state.datagroup[type])
            this.state.datagroup['p_amtyy'] = kpi1 + kpi2 + kpi3 + kpi4 + parseInt(data.value) - kpitype
            this.state.datagroup[type] = parseInt(data.value)
            this.setState(this.state)
        } else {
            this.state.datagroup[type] = parseInt(data.value)
            this.setState(this.state)
        }

    }
    async getOptionsobject(input) {

        let data = {
            p_language: this.props.lang,
            p_objtype: input
        }
        await RestfulUtils.post('/fund/getlistobjectkpi', { data })
            .then((res) => {
                if (res.EC < 0) {
                    this.setState({

                        dataOBJ: []
                    })
                } else {
                    this.setState({
                        dataOBJ: res
                    })
                }

            })
    }
    async getOptionsscopekpi(input) {

        let data = {
            p_language: this.props.lang,
            p_scopetype: input
        }
        await RestfulUtils.post('/fund/getlistscopekpi', { data })
            .then((res) => {
                //console.log(res.data)
                if (res.EC < 0) {
                    this.setState({

                        dataValue: []
                    })
                } else {
                    this.setState({
                        dataValue: res
                    })
                }

            })
    }
    onChangeDRD(type, event) {
        //console.log(type)
        let data = {};
        if (!event.target) {
            if (type == 'p_objtype') {
                this.state.datagroup[type] = event.value;
                this.getOptionsobject(event.value
                )
                this.setState({
                    datagroup: this.state.datagroup,
                    object: { value: '', label: '' },
                })
            }
            else if (type == 'p_scopetype') {
                this.state.datagroup[type] = event.value;
                this.getOptionsscopekpi(event.value)
                this.setState({
                    datagroup: this.state.datagroup,
                    value: { value: '', label: '' },
                })
            }
            else if (type == 'p_cyclecd') {
                this.state.datagroup[type] = event.value;
                this.state.datagroup['p_amtyy'] = 0;
                this.state.datagroup['p_amtq1'] = 0;
                this.state.datagroup['p_amtq2'] = 0;
                this.state.datagroup['p_amtq3'] = 0;
                this.state.datagroup['p_amtq4'] = 0;
                this.setState({
                    datagroup: this.state.datagroup,

                })
            } else {
                this.state.datagroup[type] = event.value;
                this.setState({
                    datagroup: this.state.datagroup,

                })
            }

        }
        else {
            this.state.datagroup[type] = event.target.value;
            this.setState({
                datagroup: this.state.datagroup,

            })
        }

    }
    onSetDefaultValue = (type, value) => {


        if (!this.state.datagroup[type]) {
            if (type == 'p_objtype') {
                this.getOptionsobject(value)
                this.state.datagroup[type] = value
            } else if (type == 'p_scopetype') {
                this.getOptionsscopekpi(value)
                this.state.datagroup[type] = value
            }


            else this.state.datagroup[type] = value
        }

    }
    checkValid(name, id) {
        let value = this.state.datagroup[name];
        let mssgerr = '';
        switch (name) {

            case "p_yearcd":
                if (value == '') {
                    mssgerr = this.props.strings.requiredyearcd;
                } else {

                    if (value.toString().length != 4) mssgerr = this.props.strings.requiredyearcd4;
                }
                break;
            case "p_scopevalue":
                if (value == '') {
                    mssgerr = this.props.strings.requiredscopevalue;
                }
                break;
            case "p_objvalue":
                if (value == '') {
                    mssgerr = this.props.strings.requiredobjvalue;
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

        if (mssgerr == '') {
            
            var api = '/fund/addkpiparam';
            if (this.state.access == "update") {
                api = '/fund/updatekpiparam';
            }

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
           // console.log(this.state.datagroup)
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
    onChangeObjectname(e) {

        var that = this
        if (e && e.value) {
            // this.getSessionInfo(e.value);

            this.state.datagroup["p_objvalue"] = e.value
            this.setState({
                object: e,
                datagroup: this.state.datagroup
            })
        } else {
            this.state.datagroup["p_objvalue"] = ''
            this.setState({
                object: { value: '', label: '' },
                datagroup: this.state.datagroup
            })
        }



    }
    onChangeValue(e) {

        var that = this
        if (e && e.value) {
            // this.getSessionInfo(e.value);

            this.state.datagroup["p_scopevalue"] = e.value
            this.setState({
                value: e,
                datagroup: this.state.datagroup
            })
        } else {
            this.state.datagroup["p_scopevalue"] = ''
            this.setState({
                value: { value: '', label: '' },
                datagroup: this.state.datagroup
            })
        }



    }
    render() {
        const pageSize = 5;
        let displayy = this.state.access == 'view' ? true : false
        return (
            <Modal show={this.props.showModalDetail} >
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <div className="col-md-12">
                    </div>
                    <div className="panel-body ">
                        <div className="add-info-account">
                            <div className={this.state.access == "view" ? "col-md-12 disable" : "col-md-12 "}>
                                <div className="col-md-12">
                                    <div className="col-md-3">
                                    </div>
                                    <div className="col-md-9">
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-3 highlight">
                                        <b>{this.props.strings.year}</b>
                                    </div>
                                    <div className="col-md-9">
                                        <NumberFormat disabled={displayy} format="####" placeholder="YYYY" className="form-control" id="txtYear" onValueChange={this.handleChange.bind(this, 'p_yearcd')} thousandSeparator={true} prefix={''} value={this.state.datagroup["p_yearcd"]} decimalScale={0} allowNegative={false} />

                                    </div>
                                </div>

                                
                                <div className="col-md-12">
                                    <div className="col-md-3 highlight">
                                        <b>{this.props.strings.kpitype}</b>
                                    </div>
                                    <div className="col-md-9">
                                        <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup.p_objtype} value="p_objtype" CDTYPE="SA" CDNAME="OBJTYPE" ID="drdKpitype" onChange={this.onChangeDRD.bind(this)} onSetDefaultValue={this.onSetDefaultValue} />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-3 highlight">
                                        <b>{this.props.strings.kpiname}</b>
                                    </div>
                                    <div className="col-md-9 customSelect">
                                        <Select
                                            name="form-field-name"
                                            //loadOptions={this.loadOptions.bind(this,'OBJECTTYPE')}
                                            options={this.state.dataOBJ}
                                            value={this.state.object}
                                            //onChange={this.onChangeobjecttype.bind(this)}
                                            onChange={this.onChangeObjectname.bind(this)}
                                            id="txtObjectname"
                                            //searchable={false}
                                            clearable={true}
                                            disabled={displayy}
                                        />                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-3 highlight">
                                        <b>{this.props.strings.range}</b>
                                    </div>
                                    <div className="col-md-9">
                                        <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup.p_scopetype} value="p_scopetype" CDTYPE="SA" CDNAME="SCOPETYPE" ID="drdrange" onChange={this.onChangeDRD.bind(this)} onSetDefaultValue={this.onSetDefaultValue} />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-3 highlight">
                                        <b>{this.props.strings.value}</b>
                                    </div>
                                    <div className="col-md-9 customSelect">
                                        <Select
                                            name="form-field-name"
                                            //loadOptions={this.loadOptions.bind(this,'OBJECTTYPE')}
                                            options={this.state.dataValue}
                                            value={this.state.value}
                                            //onChange={this.onChangeobjecttype.bind(this)}
                                            onChange={this.onChangeValue.bind(this)}
                                            id="txtvalue"
                                            //searchable={false}
                                            clearable={true}
                                            disabled={displayy}
                                        />                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-3 highlight">
                                        <b>{this.props.strings.timetype}</b>
                                    </div>
                                    <div className="col-md-9">
                                        <DropdownFactory disabled={displayy} CDVAL={this.state.datagroup.p_cyclecd} value="p_cyclecd" CDTYPE="SA" CDNAME="CYCLECD" ID="drdKpiname" onChange={this.onChangeDRD.bind(this)} onSetDefaultValue={this.onSetDefaultValue} />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-3 highlight">
                                        <b>{this.props.strings.kpinam}</b>
                                    </div>
                                    <div className="col-md-9">
                                        <NumberFormat maxLength={21} className="form-control" disabled={this.state.access == 'view' ? true : this.state.datagroup.p_cyclecd != 'Q' ? false : true} id="txtKpinam" onValueChange={this.onValueChange.bind(this, 'p_amtyy')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.kpinam} value={this.state.datagroup["p_amtyy"]} decimalScale={0} allowNegative={false} />

                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-3 highlight">
                                        <b>{this.props.strings.kpiquy1}</b>
                                    </div>
                                    <div className="col-md-9">
                                        <NumberFormat maxLength={21} className="form-control" disabled={this.state.access == 'view' ? true : this.state.datagroup.p_cyclecd == 'Q' ? false : true} id="txtKpiquy1" onValueChange={this.onValueChange.bind(this, 'p_amtq1')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.kpiquy1} value={this.state.datagroup["p_amtq1"]} decimalScale={0} allowNegative={false} />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-3 highlight">
                                        <b>{this.props.strings.kpiquy2}</b>
                                    </div>
                                    <div className="col-md-9">
                                        <NumberFormat maxLength={21} className="form-control" disabled={this.state.access == 'view' ? true : this.state.datagroup.p_cyclecd == 'Q' ? false : true} id="txtKpiquy2" onValueChange={this.onValueChange.bind(this, 'p_amtq2')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.kpiquy2} value={this.state.datagroup["p_amtq2"]} decimalScale={0} allowNegative={false} />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-3 highlight">
                                        <b>{this.props.strings.kpiquy3}</b>
                                    </div>
                                    <div className="col-md-9">
                                        <NumberFormat maxLength={21} className="form-control" disabled={this.state.access == 'view' ? true : this.state.datagroup.p_cyclecd == 'Q' ? false : true} id="txtKpiquy3" onValueChange={this.onValueChange.bind(this, 'p_amtq3')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.kpiquy3} value={this.state.datagroup["p_amtq3"]} decimalScale={0} allowNegative={false} />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-3 highlight">
                                        <b>{this.props.strings.kpiquy4}</b>
                                    </div>
                                    <div className="col-md-9 ">
                                        <NumberFormat maxLength={21} className="form-control" disabled={this.state.access == 'view' ? true : this.state.datagroup.p_cyclecd == 'Q' ? false : true} id="txtKpiquy4" onValueChange={this.onValueChange.bind(this, 'p_amtq4')} thousandSeparator={true} prefix={''} placeholder={this.props.strings.kpiquy4} value={this.state.datagroup["p_amtq4"]} decimalScale={0} allowNegative={false} />

                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-3">
                                        <b>{this.props.strings.note}</b>
                                    </div>
                                    <div className="col-md-9">
                                        <input className="form-control" disabled={displayy} type="text" placeholder={this.props.strings.note} id="txtNote" value={this.state.datagroup["p_notes"]} onChange={this.onChange.bind(this, "p_notes")} />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <input type="button" disabled={displayy} onClick={this.submitGroup.bind(this)} className="btn btn-primary" style={{ marginRight: 15, float: 'right' }} value={this.props.strings.submit} id="btnSubmit" />
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
    translate('ModalDetailQLKPI')
]);
module.exports = decorators(ModalDetailQLKPI);
