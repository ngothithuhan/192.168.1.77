import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import DropdownFactory from 'app/utils/DropdownFactory'
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import { connect } from 'react-redux'
class ThemEmailGuiKH extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: {
                general: true,
                authorize: true,
                fatca: false
            },
            p_emailtype: '',
           
            checkFields: [

                { name: "p_emailtype", id: "drdemailtype" }

            ],
        };
    }
    onSetDefaultValue = (type, value) => {
        //console.log('this.state.REROLE.fdfd', this.state.REROLE)
        if (!this.state[type])
            this.state[type] = value
    }
    async submitSend() {
        var mssgerr = '';
        let { datapage } = this.props
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }
        if (mssgerr == '') {
            var api = '/account/sendotheremail';
            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""

            }

            RestfulUtils.post(api, {
                emailtype: this.state.p_emailtype,
                language: this.props.lang,
                objname: datapage.OBJNAME,
            })
                .then((res) => {
                    //console.log('res ', res)
                    if (res.EC == 0) {
                        datanotify.type = "success"
                        datanotify.content = this.props.strings.success;
                        dispatch(showNotifi(datanotify));


                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                    }

                })

        }
    }
    checkValid(name, id) {
        let value = this.state[name];
        //console.log('value check:',name, value)
        let mssgerr = '';
        switch (name) {
            
            case "p_emailtype":
                if (value == '') {
                    mssgerr = this.props.strings.require_emailtype;
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
    onChangeDropdown(type, event) {

        this.state[type] = event.value //type dai dien la REROLE
        this.setState(this.state)
    }
    render() {
        let { datapage } = this.props
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px", height: '450px' }} className="container panel panel-success margintopNewUI">
            <div className="title-content col-md-6">{this.props.strings.title} </div>
                <div className="panel-body" >
                    <div style={{marginTop:'80px'}} className="add-info-account">
                    
                        <div className="col-md-12 row">
                            <div className="col-md-3">
                            </div>
                            <div className="col-md-2">
                                <h5 className="highlight"><b>{this.props.strings.emailtype}</b></h5>
                            </div>
                            <div className="col-md-3">
                                <DropdownFactory placeholder={this.props.strings.emailtype} onSetDefaultValue={this.onSetDefaultValue} CDVAL={this.state.p_emailtype} onChange={this.onChangeDropdown.bind(this)} value="p_emailtype" CDTYPE="SA" CDNAME="OTHEREMAILTYPE" ID="drdemailtype" />
                            </div>
                            <div className="col-md-3 pull-left">
                                <input type="button" onClick={this.submitSend.bind(this)} className="btn btn-primary" style={{ marginRight: 15 }} value={this.props.strings.btnWrite} id="btnSubmit" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('ThemEmailGuiKH')
]);

module.exports = decorators(ThemEmailGuiKH);
