import React from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import NewCaptcha from 'app/components/NewCaptcha';
import { showNotifi } from 'app/action/actionNotification.js';
import RestfulUtils from 'app/utils/RestfulUtils';
class GeneralInfo_Finish extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkFields: [
                { name: "CAPTCHA", id: "txtFinishCaptcha" },
            ],
            generalInformation: {
                CAPTCHA: ''
            },
            imgCaptcha: ''
        }
    }
    submit = () => {
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '')
            if (this.props.onSubmit)
                this.props.onSubmit(true, this.state.generalInformation.CAPTCHA)

    }
    finish = () => {
        if (this.props.onSubmit)
            this.props.onSubmit(false)

    }
    onChange(type, event) {
        if (event.target) {
            if (event.target.type == "checkbox")
                this.state.generalInformation[type] = event.target.checked;
            else
                this.state.generalInformation[type] = event.target.value;
        }
        else {
            this.state.generalInformation[type] = event.value;
        }

        this.setState({ generalInformation: this.state.generalInformation })

    }
    checkValid(name, id) {
        let value = this.state.generalInformation[name];
        let mssgerr = '';
        switch (name) {
            case "CAPTCHA":
                if (value == '')
                    mssgerr = this.props.strings.requireCaptcha;
                // else if (value !== this.props.newcaptcha)
                //     mssgerr = this.props.strings.invalidCaptcha;
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
    previousPage = () => {
        this.props.previousPage();
        // console.log("previousPage.finish. Haki:====", this.state.generalInformation)
    }

    componentDidMount() {
        this.props.getCaptcha();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.imgCaptcha !== this.props.imgCaptcha)
            this.setState({ ...this.state, imgCaptcha: nextProps.imgCaptcha })
    }

    render() {
        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        console.log('user', user)
        let isAdmin = user ? user.TLID ? user.TLID != '686868' : true : true; // La admin thi an buoc finish
        let createAcc = this.props.OBJNAME == 'CREATEACCOUNT'
        console.log('isAdmin', isAdmin)

        return (
            <div className="ndt-step-final">
                <div className={this.props.access !== "view" ? "col-md-12 row  background-white padding-20" : "col-md-12 row disable  background-white padding-20"}>
                    <div className="col-md-12 row text-finish">Hoàn tất</div>
                    {isCustom && <div className="col-md-12 row">{this.props.strings.confirmNote}</div>}
                    {isCustom && <div className="col-md-12 row">{this.props.strings.lableSentPhone} {this.props.GeneralInfoMain && this.props.GeneralInfoMain["MOBILE"]} {this.props.strings.andEmail} {this.props.GeneralInfoMain && this.props.GeneralInfoMain["EMAIL"]}</div>}
                    {(!isAdmin || createAcc) &&
                        <div className="col-md-12 row text-center">
                            <div className="col-md-12 row">
                                <div onClick={this.props.getCaptcha}
                                    style={{ cursor: "pointer" }} dangerouslySetInnerHTML={{ __html: this.state.imgCaptcha }} />
                            </div>
                        </div>}
                    {(!isAdmin || createAcc) &&
                        <div className="col-md-12">
                            <div className="col-md-8">
                                <input id="txtFinishCaptcha" className="form-control" type="text" onChange={this.onChange.bind(this, "CAPTCHA")} />
                            </div>
                            <div className="col-md-4 " >
                                <input id="btnFinishSentOTP" type="button" onClick={this.submit} className="btn btn-warning" style={{ marginLeft: 0, marginRight: 5 }} value={this.props.strings.sentOTP} />
                            </div>
                        </div>}
                    {/*
                    <div className="col-md-12 row">
                        <div className="col-md-12 row" style={{ fontSize: 18 }}>{this.props.strings.noteHeader}</div>
                        <div className="col-md-12">{this.props.strings.noteBody1}</div>
                        <div className="col-md-12">{this.props.strings.noteBody2}</div>
                        <div className="col-md-12">{this.props.strings.noteBody3}</div>
                        <div className="col-md-12">{this.props.strings.noteBody4}</div>
                        <div className="col-md-12">{this.props.strings.noteBody5}</div>
                        <div className="col-md-12">{this.props.strings.noteBody6}</div>
                    </div>
                        */}
                </div>
                <div className="col-md-12 row text-center mt-10">
                    <div >
                        <input id="btnFinishPrev" type="button" onClick={this.previousPage} className="btn btn-back-acc" style={{ marginLeft: 0, marginRight: 5 }} value={this.props.strings.back2} />
                        {(isAdmin && !createAcc) && <input id="btnFinishFinish" type="button" onClick={this.finish} className="btn btn-primary" style={{ marginLeft: 0, marginRight: 5 }} value={this.props.strings.finish} />}
                    </div>
                </div>
            </div>
        )
    }
}

const stateToProps = state => ({
    newcaptcha: state.newcaptcha,
    auth: state.auth
});


const decorators = flow([
    connect(stateToProps),
    translate('GeneralInfo_Finish')
]);

module.exports = decorators(GeneralInfo_Finish);