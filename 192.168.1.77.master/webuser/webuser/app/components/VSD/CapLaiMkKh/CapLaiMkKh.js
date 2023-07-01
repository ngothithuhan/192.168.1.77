import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
import RestfulUtils from 'app/utils/RestfulUtils'
import { showNotifi } from 'app/action/actionNotification.js';
import Select from 'react-select';

class CapLaiMkKh extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datagroup: {
                p_username: '',
                p_fullname: '',
                p_MOBILE: '',
                p_EMAIL: '',
                p_IDCODE: '',
                p_desc: '',
                p_language: this.props.lang,
                pv_objname: this.props.datapage.OBJNAME,
            },
        };
    }
    resetForm() {
        this.state.datagroup = {
            p_username: '',
            p_fullname: '',
            p_MOBILE: '',
            p_EMAIL: '',
            p_IDCODE: '',
            p_desc: '',
            p_language: this.props.lang,
            pv_objname: this.props.datapage.OBJNAME,
        };
        this.setState(this.state);
    }
    submitGroup = () => {
        var mssgerr = this.checkValid();
        if (mssgerr == '') {
            var api = '/accountinfo/resetpasscustomer';
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }
            RestfulUtils.posttrans(api, this.state.datagroup)
                .then(async (res) => {

                    if (res.EC == 0) {
                        datanotify.type = "success";
                        datanotify.content = this.props.strings.success;
                        this.resetForm();
                        dispatch(showNotifi(datanotify))

                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;                        
                        dispatch(showNotifi(datanotify));

                    }

                })
        }


    }
    checkValid() {
        let mssgerr = '';
        var { dispatch } = this.props;
        var datanotify = {
            type: "",
            header: "",
            content: ""

        }
        datanotify.type = "error";

        let p_username = this.state.datagroup.p_username;
        if (p_username == '') {
            mssgerr = this.props.strings.requireduser;
            datanotify.content = mssgerr;
            dispatch(showNotifi(datanotify));
            window.$(`#${'p_username'}`).focus();
            return mssgerr;
        }
        return mssgerr;
    }
    onBlurInput(type, e) {
        if (type == 'p_username') {
            var api = '/accountinfo/getaccountinfo_by_username';
            RestfulUtils.post(api, { p_username: this.state.datagroup.p_username, p_language: this.state.datagroup.p_language })
                .then((res) => {
                    if (res.EC == 0 && res.DT && res.DT.length > 0) {
                        var info = res.DT[0];
                        this.state.datagroup.p_MOBILE = info.MOBILE;
                        this.state.datagroup.p_EMAIL = info.EMAIL;
                        this.state.datagroup.p_IDCODE = info.IDCODE;
                        this.state.datagroup.p_fullname = info.FULLNAME;
                        this.setState(this.state);
                    }
                    else {
                        this.state.datagroup.p_MOBILE = '';
                        this.state.datagroup.p_EMAIL = '';
                        this.state.datagroup.p_IDCODE = '';
                        this.state.datagroup.p_fullname = '';
                        this.setState(this.state);
                    }
                })
        }
    }
    onChange(type, event) {
        if (event.target) {
            this.state.datagroup[type] = event.target.value;
        }
        else {
            this.state.datagroup[type] = event.value;
        }
        this.setState({ datagroup: this.state.datagroup })

    }
    render() {
        let display = this.state.nextStep
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

                <div className="add-info-account">

                    <div className="title-content">{this.props.strings.title}</div>

                    <div className="row col-md-8 col-md-push-2" style={{ paddingTop: "20px" }}>

                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5 className="highlight"><b>{this.props.strings.username}</b></h5>
                            </div>
                            <div className="col-md-8">
                                <input className="form-control" type="text" id="p_username" placeholder={this.props.strings.username} value={this.state.datagroup.p_username} onChange={this.onChange.bind(this, "p_username")} onBlur={this.onBlurInput.bind(this, 'p_username')} />
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5 className=""><b>{this.props.strings.fullname}</b></h5>
                            </div>
                            <div className="col-md-8 ">
                                <label className="form-control" id="txtfullname" >{this.state.datagroup.p_fullname}</label>
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5><b>{this.props.strings.idcode}</b></h5>
                            </div>
                            <div className="col-md-8">
                                <label className="form-control" id="lblidcode">{this.state.datagroup.p_IDCODE}</label>
                            </div>
                        </div>
                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5 className=""><b>{this.props.strings.phone}</b></h5>
                            </div>
                            <div className="col-md-8">
                                <label className="form-control" id="txtphone" >{this.state.datagroup.p_MOBILE}</label>
                            </div>
                        </div>

                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h5><b>{this.props.strings.email}</b></h5>
                            </div>
                            <div className="col-md-8">
                                <label className="form-control" id="txtemail" >{this.state.datagroup.p_EMAIL}</label>
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
CapLaiMkKh.defaultProps = {

    strings: {
        title: 'Phong tỏa tài khoản'

    },


};
const stateToProps = state => ({
    lang: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('CapLaiMkKh')
]);

module.exports = decorators(CapLaiMkKh);
