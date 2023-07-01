import React from 'react';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableQLCN from './components/TableQLCN'
import ModalDetailQLCN from './components/ModalDetailQLCN'

class QuanLyChiNhanh extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            showModalDetail: false,
            titleModal: '',

            access: "add",
            isClear: true,
            loadgrid: false
        };
    }

    closeModalDetail() {

        this.setState({ showModalDetail: false, isClear: true, loadgrid: false })
    }
    showModalDetail(access, DATAUPDATE) {

        let titleModal = ""
        let DATA = ""

        switch (access) {
            case "add": titleModal = this.props.strings.modaladd; break
            case "update": titleModal = this.props.strings.modaledit; break;
            case "view": titleModal =this.props.strings.modalview; break
        }
        if (DATAUPDATE != undefined) {
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
                    <TableQLCN OBJNAME={datapage.OBJNAME} datapage={datapage}
                        showModalDetail={this.showModalDetail.bind(this)}
                        loadgrid={this.state.loadgrid} />
                </div>
                <ModalDetailQLCN
                    load={this.load.bind(this)}
                    isClear={this.state.isClear}
                    access={this.state.access}
                    DATA={this.state.DATA}
                    title={this.state.titleModal}
                    change={this.change.bind(this)}
                    OBJNAME={datapage.OBJNAME}
                    showModalDetail={this.state.showModalDetail}
                    closeModalDetail={this.closeModalDetail.bind(this)} />
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
    translate('QuanLyChiNhanh')
]);

module.exports = decorators(QuanLyChiNhanh);
