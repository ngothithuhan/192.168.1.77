import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import KhachHangDangKyMoiGioi from './components/KhachHangDangKyMoiGioi';

import RestfulUtils from 'app/utils/RestfulUtils';
import { connect } from 'react-redux'
class KhachHangDangKy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: {
                general: true,
                authorize: true,
                fatca: false
            },
            listOptionSelect: {
                CUSTODYCD: []
            },
            showModalDetail: false,
            isrefresh: false,
            titleModal: 'Taọ ngân hàng',
            CUSTID_VIEW: -1,
            access: "add"
        };
    }
    componentDidMount() {
        this.setListOptionPention();
    }
    setListOptionPention() {
        let self = this;
        let username = this.props.auth.user.USERID
        RestfulUtils.post('/fund/fetchAccountList', { OBJNAME: this.props.datapage.OBJNAME, username: username, language: this.props.currentLanguage })
            .then((res) => {
                if (res.EC == 0) {
                    self.state.listOptionSelect['CUSTODYCD'] = res.DT
                    self.setState({ listOptionSelect: self.state.listOptionSelect })
                }
            })
    }
    collapse(tab) {
        this.state.collapse[tab] = !this.state.collapse[tab];
        this.setState({ collapse: this.state.collapse })
    }
    createSuccess(access) {
        this.setState({ isrefresh: true })
    }
    load() {
        this.setState({ loadgrid: true })
    }
    change() {
        this.setState({ isClear: false })
    }
    onChangeSelect(type, e) {
        if (e && type == "CUSTODYCD") {
            this.state[type] = e.value
        }
        if (!e) {
            if (type == "CUSTODYCD") {
                this.state[type] = ''
            }
        }
        this.setState({ state: this.state, listOptionSelect: this.state.listOptionSelect });
    }
    render() {
        let ISCUSTOMER = this.props.auth.user.ISCUSTOMER == 'Y' ? true : false;
        let { datapage } = this.props
        return (
            <KhachHangDangKyMoiGioi datapage={datapage}
                OBJNAME={datapage.OBJNAME}
                username={this.props.auth.user.USERID}
                userFullName={this.props.auth.user.TLFULLNAME}
                ISCUSTOMER={ISCUSTOMER}
                loadgrid={this.state.loadgrid}
                auth={this.props.auth}
                isrefresh={this.state.isrefresh} />
        )
    }
}
KhachHangDangKy.defaultProps = {
    strings: {
    },
};
const stateToProps = state => ({
    auth: state.auth,
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification
});
const decorators = flow([
    connect(stateToProps),
    translate('KhachHangDangKy')
]);
module.exports = decorators(KhachHangDangKy);
