import React from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';
import Select from 'react-select';
import DropdownFactory from '../../../../../utils/DropdownFactory';

class PhuongThucBaoMat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            CUSTODYCD: '',
            AUTHTYPE: '',
            oldAuthtype: '',
            mobile: '',
            email: '',
            checkFields: [
                { name: "CUSTODYCD", id: "drdCUSTODYCD" },
                { name: "AUTHTYPE", id: "drdAUTHTYPE" },
            ],
        };
    }

    refresh() {
        this.setState({
            CUSTODYCD: '',
            AUTHTYPE: '',
            oldAuthtype: '',
            mobile: '',
            email: '',
        })
    }

    checkValid(name, id) {
        let value = this.state[name];

        let mssgerr = '';
        switch (name) {
            case "CUSTODYCD":
                if (value == '' || value.value == '') {
                    mssgerr = this.props.strings.requiredAccountId;
                }
                break;
            case "AUTHTYPE":
                if (value == '') {
                    mssgerr = this.props.strings.requiredAuthMethod;
                }
                if (value == this.state.oldAuthtype) {
                    mssgerr = this.props.strings.sameWithOldAuthtype;
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

    submitGroup() {
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id);
            if (mssgerr !== '')
                break;
        }

        if (mssgerr == '') {
            var api = '/accountinfo/changeAuthenticationMethod';

            var { dispatch } = this.props;
            var datanotify = {
                type: "",
                header: "",
                content: ""
            }

            let data = {
                p_language: this.props.lang,
                p_custodycd: this.state.CUSTODYCD.value || '',
                p_oldauthtype: '',
                p_newauthtype: this.state.AUTHTYPE,
            }

            RestfulUtils.post(api, data)
                .then((res) => {
                    if (res.EC == 0) {
                        datanotify.type = "success";
                        datanotify.content = this.props.strings.success;
                        dispatch(showNotifi(datanotify));
                        this.refresh();
                    } else {
                        datanotify.type = "error";
                        datanotify.content = res.EM;
                        dispatch(showNotifi(datanotify));
                    }
                })

        }
    }

    onSetDefaultValue = (type, value) => {
        if (!this.state[type]) {
            this.state[type] = value;
            this.setState(this.state);
        }
    }

    onChangeDropdown(type, event) {
        this.state[type] = event.value;
        this.setState(this.state)
    }

    async onChangeCUSTODYCD(e) {
        const { auth } = this.props;
        const arrAccount = auth && auth.accounts;
        let oldAuthtype = '',
            mobile = '',
            email = '';
        if (arrAccount.length > 0) {
            arrAccount.forEach(element => {
                if (element.CUSTODYCD == e.value) {
                    oldAuthtype = element.AUTHTYPE || '';
                    mobile = element.MOBILE || '';
                    email = element.EMAIL || '';
                }
            });
        }
        this.setState({ CUSTODYCD: e, oldAuthtype, mobile, email });
    }

    getOptions(input) {
        var self = this;
        return RestfulUtils.post('/account/search_all', { key: input })
            .then((res) => {
                return { options: res }
            })
    }

    render() {
        return (
            <div className="ptbm-containter">
                <div className="ptbm-header">
                    {this.props.strings.PTBM}
                </div>
                <div className="ptbm-content">
                    <div className="form-group">
                        <label>{this.props.strings.soTKGD} <span style={{ color: 'red' }}>*</span></label>
                        <Select.Async
                            name="form-field-name"
                            placeholder={this.props.strings.soTKGD}
                            loadOptions={this.getOptions.bind(this)}
                            value={this.state.CUSTODYCD}
                            onChange={this.onChangeCUSTODYCD.bind(this)}
                            id="drdCUSTODYCD"
                            ref="refCUSTODYCD"
                        />
                    </div>
                    <div className="form-group">
                        <label>{this.props.strings.phonenumber}</label>
                        <input type='text'
                            id="textAccName"
                            className="form-control"
                            value={this.state.mobile}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>{this.props.strings.email}</label>
                        <input type='text'
                            id="textAccName"
                            className="form-control"
                            value={this.state.email}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>{this.props.strings.oldAuthtype}</label>
                        <input type='text'
                            id="textAccName"
                            className="form-control"
                            value={this.state.oldAuthtype}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>{this.props.strings.authenMethod} <span style={{ color: 'red' }}>*</span></label>
                        <DropdownFactory
                            CDVAL={this.state.AUTHTYPE}
                            value="AUTHTYPE"
                            CDTYPE="CF"
                            CDNAME="AUTHTYPE"
                            onChange={this.onChangeDropdown.bind(this)}
                            onSetDefaultValue={this.onSetDefaultValue.bind(this)}
                            ID="drdAUTHTYPE"
                        />
                    </div>

                    <button type="button" onClick={this.submitGroup.bind(this)}>{this.props.strings.save}</button>

                </div>
            </div>
        );
    }
}

const stateToProps = state => ({
    lang: state.language.language,
    auth: state.auth
});
const decorators = flow([
    connect(stateToProps),
    translate('NhaDauTu')
]);
module.exports = decorators(PhuongThucBaoMat);