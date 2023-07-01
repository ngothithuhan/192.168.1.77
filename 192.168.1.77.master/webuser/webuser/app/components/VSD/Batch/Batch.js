import React from 'react';
import { connect } from 'react-redux'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import TableDone from './components/TableDone'
import TableUndone from './components/TableUndone'


class Batch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            showModalDetail: false,
            titleModal: '',

            access: "",
            isClear: true,
            loadgrid: false,
            DATA: {}
        };
    }


    change() {

        this.setState({ isClear: false })
    }
    load() {
        this.setState({ loadgrid: true })
    }
    clear() {
        this.setState({ loadgrid: false })
    }
    render() {
        let { datapage } = this.props
        return (
            <div style={{ borderColor: "rgba(123, 102, 102, 0.43)", padding: "10px" }} className="container panel panel-success margintopNewUI">

                <div className="title-content">{this.props.strings.title}</div>
                <div className="panel-body" >
                    <div className="col-md-6" style={{ paddingTop: 33 }}>

                        <TableUndone datapage={datapage}
                            load={this.load.bind(this)}
                            OBJNAME={datapage.OBJNAME} />
                    </div>

                    <div className="col-md-6">
                        <TableDone datapage={datapage}
                            loadgrid={this.state.loadgrid}
                            clear={this.clear.bind(this)}
                            OBJNAME={datapage.OBJNAME}
                        />
                    </div>
                </div>

            </div>
        )
    }
}
const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth,
    tradingdate: state.systemdate.tradingdate
});
const decorators = flow([
    connect(stateToProps),
    translate('Batch')
]);
module.exports = decorators(Batch);
