import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils'
import { showNotifi } from 'app/action/actionNotification.js';
import Select from 'react-select';

class CapLaiMK extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datagroup: {

            },
            datagroup1: {
                p_tlname: ''
            },
            checkFields: [
                { name: "p_tlname", id: "txtusername" },
            ],
            tlnamesearch: '',
            nextStep: true,
            tlname: {value:'',label:'',tlid:''},
            options:[]
        };
    }
    submitGroup = () => {
        var api = '/fund/resetpassuser';
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }
       
        // console.log(this.state.datagroup)

        RestfulUtils.posttrans(api, { pv_objname: this.props.datapage.OBJNAME, p_resettlid: this.state.datagroup["TLID"], p_tlname: this.state.datagroup1["p_tlname"], p_language: this.props.lang })
            .then(async (res) => {

                if (res.EC == 0) {
                    datanotify.type = "success";
                    datanotify.content = this.props.strings.success;
                    dispatch(showNotifi(datanotify))
                 
                } else {
                    datanotify.type = "error";
                    datanotify.content = res.EM;
                    dispatch(showNotifi(datanotify));
                  
                }

            })

    }
    checkValid(name, id) {
        let value = this.state.datagroup1[name];

        let mssgerr = '';
        switch (name) {

            case "p_tlname":
                if (value == '') {
                    mssgerr = this.props.strings.requireduser;
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
    /*
    onChange(type, event) {
        let data = {};
        if (event.target) {

            this.state.datagroup1[type] = event.target.value;
        }
        else {
            this.state.datagroup1[type] = event.value;
        }
        if (event.target.value == this.state.tlnamesearch && event.target.value != '') {
            this.setState({ datagroup1: this.state.datagroup1, nextStep: false })
        }
        else this.setState({ datagroup1: this.state.datagroup1, nextStep: true })
    }
    */
    /*
    search() {
        let that = this
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }
        if (mssgerr == '') {
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            if (this.state["tlnamesearch"] != this.state.datagroup1["p_tlname"]) {
                window.$('#btnsearch').prop('disabled', true);
                RestfulUtils.post('/fund/get_tlprofiles_bytlname', { p_tlname: this.state.datagroup1["p_tlname"], p_language: this.props.lang })
                    .then(async (res) => {
                        if (res.EC == 0) {
                            if (res.DT.data.length == 0) {
                                datanotify.type = "error";
                                datanotify.content = this.props.strings.error;
                                dispatch(showNotifi(datanotify));
                                window.$('#btnsearch').prop('disabled', false);

                            } else {
                                this.setState({ nextStep: false, datagroup: res.DT.data[0], tlnamesearch: this.state.datagroup1["p_tlname"] })
                                window.$('#btnsearch').prop('disabled', false);
                            }

                        } else {
                            datanotify.type = "error";
                            datanotify.content = res.EM;
                            dispatch(showNotifi(datanotify));
                            window.$('#btnsearch').prop('disabled', false);
                        }
                    })
            }
        }
    }
    */

    componentDidMount(){
         RestfulUtils.post('/fund/get_tlprofiles_bytlname', {  p_language: this.props.lang })
        .then((res) => {
            this.setState({
                 options: res.DT.data 
            })
            
        })
    }
    onChangecb(e) {
        var that = this
        if (e && e.value) {
            this.state.datagroup1["p_tlid"]=e.fulldetails.tlid
            this.state.datagroup1["p_tlname"]=e.value
            this.setState({
                tlname: e,
                datagroup1:that.state.datagroup1,
                datagroup: e.fulldetails,
                nextStep: false
            })
        }
        // this.getSessionInfo(e.value);

        else {
            this.state.datagroup1["p_tlid"]=''
            this.state.datagroup1["p_tlname"]=''
            this.setState({
                tlname: {value:'',label:'',fulldetails:{}},
                datagroup1:that.state.datagroup1,
                datagroup: {},
                nextStep: true
            })

        }



    }
    render() {
        let display = this.state.nextStep
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

                <div className="add-info-account">

                    <div className="title-content">{this.props.strings.title}</div>

                    <div className="col-md-12" style={{ paddingTop: "11px" }}>

                        <div className="col-md-12 row">
                            <div className="col-md-3">
                                <h5 className="highlight"><b>{this.props.strings.username}</b></h5>
                            </div>
                            {/*
                            <div className="col-md-4">
                                <input maxLength={100} className="form-control" id="txtusername" type="text" placeholder={this.props.strings.username} value={this.state.datagroup1["p_tlname"]} onChange={this.onChange.bind(this, "p_tlname")} />
                            </div>
                            <div className="col-md-3">
                                <Button bsStyle="success" className="pull-left" id="btnsearch" onClick={this.search.bind(this)}>{this.props.strings.search}</Button>
                            </div>
                                */}
                            <div className="col-md-4 customSelect">
                                <Select
                                    name="form-field-name"
                                    options={this.state.options}
                                    value={this.state.tlname}
                                    onChange={this.onChangecb.bind(this)}
                                    id="txtTlname"
                                    //disabled={displayy}
                                //  searchable={false}
                                />                                    </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-3">
                                <h5 className=""><b>{this.props.strings.fullname}</b></h5>
                            </div>
                            <div className="col-md-9 ">
                                <label className="form-control" id="txtfullname" >{this.state.datagroup["TLFULLNAME"]}</label>
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-3">
                                <h5><b>{this.props.strings.idcode}</b></h5>
                            </div>
                            <div className="col-md-9">
                                <label className="form-control" id="lblidcode">{this.state.datagroup["IDCODE"]}</label>
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-3">
                                <h5 className=""><b>{this.props.strings.phone}</b></h5>
                            </div>
                            <div className="col-md-3 ">
                                <label className="form-control" id="txtphone" >{this.state.datagroup["MOBILE"]}</label>
                            </div>
                        </div>

                        <div className="col-md-12 row">
                            <div className="col-md-3">
                                <h5><b>{this.props.strings.email}</b></h5>
                            </div>
                            <div className="col-md-9 ">
                                <label className="form-control" id="txtemail" >{this.state.datagroup["EMAIL"]}</label>
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-3">
                                <h5 className=""><b>{this.props.strings.branch}</b></h5>
                            </div>
                            <div className="col-md-9">
                                <label className="form-control" id="txtbranch" >{this.state.datagroup["BRNAME"]}</label>
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-3">
                                <h5 className=""><b>{this.props.strings.area}</b></h5>
                            </div>
                            <div className="col-md-9">
                                <label className="form-control" id="txtarea" >{this.state.datagroup["AREANAME"]}</label>
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-3">
                                <h5 className=""><b>{this.props.strings.member}</b></h5>
                            </div>
                            <div className="col-md-9">
                                <label className="form-control" id="txtmember" >{this.state.datagroup["MBNAME"]}</label>
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="pull-right">
                                <input type="button" disabled={display} className="btn btn-primary" onClick={this.submitGroup.bind(this)} style={{ marginLeft: 0, marginRight: 15 }} value={this.props.strings.submit} id="btnSubmit" />
                            </div>
                        </div>
                    </div>




                </div>
            </div>


        )
    }
}
CapLaiMK.defaultProps = {

    strings: {
        title: 'Phong tỏa tài khoản'

    },


};
const stateToProps = state => ({
    lang: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('CapLaiMK')
]);

module.exports = decorators(CapLaiMK);
