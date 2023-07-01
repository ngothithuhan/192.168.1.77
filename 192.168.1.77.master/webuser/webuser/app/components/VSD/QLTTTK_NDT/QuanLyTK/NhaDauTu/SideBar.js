import React from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';

class SideBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: ''
        };
    }

    componentDidMount() {
        let { allTabs } = this.props;
        if (allTabs && allTabs.length > 0) {
            this.setState({
                activeTab: allTabs[0].name
            })
            this.props.setActiveComponent(allTabs[0])
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.allTabs !== this.props.allTabs) {
            let { allTabs } = this.props;
            if (allTabs && allTabs.length > 0) {
                this.setState({
                    activeTab: allTabs[0].name
                })
                this.props.setActiveComponent(allTabs[0])
            }
        }
    }

    setActiveTab = (tab) => {
        this.setState({
            activeTab: tab.name
        })
        this.props.setActiveComponent(tab)
    }

    render() {
        let { activeTab } = this.state;
        let { allTabs } = this.props;
        return (
            <div className="sidebar-containter">
                <div className="sidebar-content">
                    {allTabs && allTabs.length > 0 &&
                        allTabs.map((tab, index) => {
                            return (
                                <div className={activeTab === tab.name ? 'parent active' : 'parent'}
                                    onClick={() => this.setActiveTab(tab)}
                                    key={index}
                                >
                                    <i className={tab.classIcon ? tab.classIcon : 'fa fa-user'} aria-hidden="true"></i>
                                    <span>{this.props.strings[tab.name]}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div >
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
module.exports = decorators(SideBar);