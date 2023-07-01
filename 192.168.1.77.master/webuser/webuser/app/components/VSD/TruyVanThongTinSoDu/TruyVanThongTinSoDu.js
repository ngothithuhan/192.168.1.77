import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableTruyVanThongTinSoDu from './components/TableTruyVanThongTinSoDu';

import RestfulUtils from 'app/utils/RestfulUtils';
import { connect } from 'react-redux';
import 'app/utils/customize/CustomizeReactTable.scss';


class TruyVanThongTinSoDu extends React.Component {
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
        //this.setListOptionPention();
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
    showModalDetail(access, DATAUPDATE) {
        let titleModal = ""
        let DATA = ""
        switch (access) {
            case "add": titleModal = this.props.strings.modaladd; break
            case "update": titleModal = this.props.strings.modaledit; break;
            case "view": titleModal = this.props.strings.modalview; break
        }
        if (DATAUPDATE) {
            DATA = DATAUPDATE
        }
        this.setState({ showModalDetail: true, titleModal: titleModal, DATA: DATA, access: access, isClear: true, loadgrid: false })
    }
    closeModalDetail() {
        this.setState({ showModalDetail: false })
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
        let ISCUSTOMER = this.props.auth.user.ISCUSTOMER == 'Y';
        let { datapage } = this.props
        console.log('this.props.string:::', this.props.strings)
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">
                <div className="title-content">{this.props.strings.title}</div>
                <div className="panel-body" >
                    <TableTruyVanThongTinSoDu datapage={datapage}
                        showModalDetail={this.showModalDetail.bind(this)}
                        OBJNAME={datapage.OBJNAME}
                        username={this.props.auth.user.USERID}
                        auth={this.props.auth}
                        ISCUSTOMER={ISCUSTOMER}
                        loadgrid={this.state.loadgrid}
                        isrefresh={this.state.isrefresh} />
                </div>
            </div>
        )
    }
}
TruyVanThongTinSoDu.defaultProps = {
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
    translate('TruyVanThongTinSoDu')
]);
module.exports = decorators(TruyVanThongTinSoDu);
