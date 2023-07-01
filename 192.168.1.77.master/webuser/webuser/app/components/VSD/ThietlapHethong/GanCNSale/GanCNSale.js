import React from 'react';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableCNSale from './components/TableCNSale'
import ModalDetailGanCNSale_info from './components/ModalDetailGanCNSale_info'

class GanCNSale extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            showModalDetail: false,
            titleModal: '',

            access: "add"
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
            case "view": titleModal = this.props.strings.modalview; break
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
                    <TableCNSale datapage={datapage}
                        showModalDetail={this.showModalDetail.bind(this)}
                        loadgrid={this.state.loadgrid}
                        load={this.load.bind(this)}
                    />
                </div>
                <ModalDetailGanCNSale_info
                    load={this.load.bind(this)}
                    isClear={this.state.isClear}
                    OBJNAME={datapage.OBJNAME}
                    change={this.change.bind(this)}
                    access={this.state.access}
                    DATA={this.state.DATA}
                    title={this.state.titleModal}
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
    translate('GanCNSale')
]);

module.exports = decorators(GanCNSale);
