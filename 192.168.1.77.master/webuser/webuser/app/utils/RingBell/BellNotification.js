import React, { Component, Fragment } from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux';
import './BellNotification.scss';
import PopupNotification from 'app/utils/RingBell/PopupNotification.js';

class BellNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberNoti: 1,
            isShowPopupNoti: false,
            dataNotifi: []
        }
    }


    componentDidMount() {
        let mockData = [
            { 'STT': '1', 'DES': 'Xác nhận sổ lệnh SR0034 của quỹ VFMIPO phiên ngày 27-AUG-21 HARDCODE' },
            { 'STT': '2', 'DES': 'Xác nhận sổ lệnh SR0034 của quỹ VFMIPO phiên ngày 27-AUG-21 HARDCODE' },
            { 'STT': '3', 'DES': 'Xác nhận sổ lệnh SR0034 của quỹ VFMIPO phiên ngày 27-AUG-21 HARDCODE' },
            { 'STT': '4', 'DES': 'Xác nhận sổ lệnh SR0034 của quỹ VFMIPO phiên ngày 27-AUG-21 HARDCODE' },
            { 'STT': '5', 'DES': 'Xác nhận sổ lệnh SR0034 của quỹ VFMIPO phiên ngày 27-AUG-21 HARDCODE' },
        ];
        this.setState({
            dataNotifi: mockData,
            numberNoti: mockData.length
        })
    }


    componentDidUpdate(prevState, prevProps) {

    }


    onClickBellNoti = (status) => {
        this.setState({
            isShowPopupNoti: status
        })
    }

    refreshDataNoti = () => {

    }

    render() {
        let { numberNoti, isShowPopupNoti, dataNotifi } = this.state;
        return (
            <React.Fragment>
                <li className="bell-notification-container">
                    <i className="colorbell glyphicon glyphicon-bell" onClick={() => this.onClickBellNoti(true)}></i>
                    <span className="badge badge-notify">{numberNoti}</span>
                </li>
                <PopupNotification
                    showPopupNotifi={isShowPopupNoti}
                    closePopupNotifi={this.onClickBellNoti}
                    dataNotifi={dataNotifi}
                />

            </React.Fragment>
        )
    }

}

const stateToProps = state => ({
    language: state.language.language,
    auth: state.auth
});

const decorators = flow([
    connect(stateToProps),
    translate('CreateAccount')
]);

module.exports = decorators(BellNotification);
