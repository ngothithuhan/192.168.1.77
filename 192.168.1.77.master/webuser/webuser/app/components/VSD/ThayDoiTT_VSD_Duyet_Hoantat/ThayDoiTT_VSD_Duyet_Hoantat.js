import React from 'react';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableTDTTHoanTat from './components/TableTDTTHoanTat'
import ModalDetail from './components/ModalDetail'

class ThayDoiTT_VSD_Duyet_Hoantat extends React.Component {
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
            loadgrid: false
        };
    }
    createSuccess(access) {
        this.setState({ access: access })
    }
    closeModalDetail() {

        this.setState({ showModalDetail: false, isClear: true, loadgrid: false })
    }
    showModalDetail(access, DATAUPDATE) {

        let titleModal = ""
        let DATA = ""
        //console.log('dataupdate', DATAUPDATE)
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
    change() {

        this.setState({ isClear: false })
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
                    <TableTDTTHoanTat OBJNAME={datapage.OBJNAME} datapage={datapage}
                        showModalDetail={this.showModalDetail.bind(this)}
                    />
                    <ModalDetail createSuccess={this.createSuccess.bind(this)}
                        load={this.load.bind(this)}
                        isClear={this.state.isClear}
                        change={this.change.bind(this)}
                        access={this.state.access}
                        DATA={this.state.DATA}
                        title={this.state.titleModal}
                        showModalDetail={this.state.showModalDetail}
                        closeModalDetail={this.closeModalDetail.bind(this)}
                        OBJNAME={datapage.OBJNAME}
                    />
                </div>

            </div>
        )
    }
}

const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification
});


const decorators = flow([
    connect(stateToProps),
    translate('ThayDoiTT_VSD_Duyet_Hoantat')
]);

module.exports = decorators(ThayDoiTT_VSD_Duyet_Hoantat);
