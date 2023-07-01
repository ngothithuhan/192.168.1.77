import React from 'react';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableDongSoLenhUser from './components/TableDongSoLenhUser.js'
import ModalDongSoLenhUser from './components/ModalDongSoLenhUser.js'

class DongSoLenhUser extends React.Component {
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


        let DATA = ""
        if (DATAUPDATE != undefined) {
            DATA = DATAUPDATE
        }

        this.setState({ showModalDetail: true, DATA: DATA, access: access })
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
                    <TableDongSoLenhUser OBJNAME={datapage.OBJNAME} datapage={datapage}
                        showModalDetail={this.showModalDetail.bind(this)}
                    />
                    <ModalDongSoLenhUser createSuccess={this.createSuccess.bind(this)}
                        load={this.load.bind(this)}
                        isClear={this.state.isClear}
                        change={this.change.bind(this)}
                        access={this.state.access}
                        DATA={this.state.DATA}
                        title={this.props.strings.title}
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
    translate('DongSoLenhUser')
]);

module.exports = decorators(DongSoLenhUser);
