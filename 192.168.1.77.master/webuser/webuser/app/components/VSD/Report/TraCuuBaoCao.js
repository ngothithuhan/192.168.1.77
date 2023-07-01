import React from 'react';
import { connect } from 'react-redux';
import { LabelEx } from 'app/utils/LabelEx';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import ReportRequestResult from './components/ReportRequestResult'
//import ReportRequestResultIsAuto from './components/ReportRequestResultIsAuto'

class TraCuuBaoCao extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'tab1',
            // maxHeightTable: 100,
        };
    }
    componentDidMount() {
        // let maxHeightTable = this.props.styleWeb.height_window - (48 + 20 + 2 + 36 + 15 * 2 + 34)
        // this.setState({ maxHeightTable })

    }
    
    
    
    changeActiveTab(type, e) {
        this.setState({ activeTab: type });
    }

    render() {
        let { datapage } = this.props
        var self = this;
        return (
            <div className="panel panel-default compare-command container" style={{ height: 'auto', padding: "10px" }}>
                <div className="title-content " style={{}}>{self.props.strings.title}</div>
                <div className="tab-inquiry-money">
                    <ul className="nav nav-tabs">
                        <li className={this.state.activeTab == 'tab1' ? 'active' : ''} onClick={this.changeActiveTab.bind(this, 'tab1')}><a data-toggle="tab"><b><LabelEx text={self.props.strings.title} /></b></a></li>
                        {/*
                        <li className={this.state.activeTab == 'tab2' ? 'active' : ''} onClick={this.changeActiveTab.bind(this, 'tab2')}><a data-toggle="tab"><b><LabelEx text="Báo cáo tự động" /></b></a></li>
                        */}
                        </ul>
                    <div className="tab-content">
                        <div className={this.state.activeTab == 'tab1' ? 'tab-pane fade in active' : 'tab-pane fade'}>
                            <ReportRequestResult refresh={true}    OBJNAME={datapage.OBJNAME} AUTH={this.props.auth.user}/>
                        </div>
                        {/*
                        <div className={this.state.activeTab == 'tab2' ? 'tab-pane fade in active' : 'tab-pane fade'}>
                            <ReportRequestResultIsAuto refresh={true}  />
                        </div>
                        */}
                    </div>
                </div>
            </div>
        );
    }
}

const stateToProps = state => ({
    veryfiCaptcha: state.veryfiCaptcha,
    notification: state.notification,
    styleWeb: state.styleWeb,
    auth: state.auth,
});
const decorators = flow([
    connect(stateToProps),
    translate('TraCuuBaoCao')
]);

module.exports = decorators(TraCuuBaoCao);