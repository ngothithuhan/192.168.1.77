import React from 'react';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';

import TableAddCreateThemMG_Nhom from './components/TableAddCreateThemMG_Nhom'
import ModalThemMG_Nhom from './components/ModalThemMG_Nhom'

class ThemMG_Nhom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: {
            general: true,
            authorize: true,
            fatca: false
        },
        showModalDetail: false,
        DATA: "",
        access: "add",
        isClear: true,
        loadgrid: true,
        titleModal:''

        }
    }

    createSuccess(access) {
        this.setState({ access: access })
    }
    closeModalDetail() {

        this.setState({ showModalDetail: false, isClear: true, loadgrid: false })
    }
    

    showModalDetail(access, ID) {
        console.log('ID',ID)
        let titleModal = ""
        let CUSTID = -1;
        let DATA = ""

        switch (access) {
            case "add": titleModal = "Tạo ĐLPP"; break
            case "update": titleModal = this.props.strings.approve; break;
            case "view": titleModal = "Xem chi tiết"; break
        }
        if (CUSTID) {
            CUSTID = ID
        }
        if (ID != undefined) {
            DATA = ID
        }
        

        this.setState({ showModalDetail: true, titleModal: titleModal, DATA :DATA, CUSTID_VIEW: CUSTID, access: access })
    }
    load() {
        this.setState({ loadgrid: true })
    }
    render() {
        let { datapage } = this.props
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

                <div className="title-content">{this.props.strings.title}</div>
                <div className="panel-body" >
                    <div className="col-md-12">

                        <div className="col-md-12">
                            <TableAddCreateThemMG_Nhom datapage={datapage}
                                showModalDetail={this.showModalDetail.bind(this)}
                                OBJNAME={datapage.OBJNAME}
                            />
                            <ModalThemMG_Nhom createSuccess={this.createSuccess.bind(this)}
                                //load={this.load.bind(this)}
                                isClear={this.state.isClear}
                                //change={this.change.bind(this)}
                                access={this.state.access}
                                DATA={this.state.DATA}
                                title={this.state.titleModal}
                                showModalDetail={this.state.showModalDetail}
                                closeModalDetail={this.closeModalDetail.bind(this)}
                                OBJNAME={datapage.OBJNAME}
                            />
                        </div>

                    </div>

                </div>
            </div>
        );
    }
}

const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    lang: state.language.language
});


const decorators = flow([
    connect(stateToProps),
    translate('ThemMG_Nhom')
]);

module.exports = decorators(ThemMG_Nhom);