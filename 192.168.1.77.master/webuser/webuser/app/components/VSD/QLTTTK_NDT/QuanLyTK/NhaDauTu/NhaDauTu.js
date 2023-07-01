import React from 'react';
import { connect } from 'react-redux';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import SideBar from './SideBar';
import './NhaDauTu.scss';
import ManageAccountNDT from './ManageAccountNDT';
import TaiLieuThamKhao from './TaiLieuThamKhao';
import PhuongThucBaoMat from './PhuongThucBaoMat';
import DoiMatKhau from './DoiMatKhau';
import DoiMaPin from './DoiMaPin';

const ALL_TABS = {
    CUSTOMER: { //khách hàng
        tabs: [
            {
                name: 'TTTK', //THONG TIN TAI KHOAN
                component: 'ManageAccountNDT',
                classIcon: 'fa fa-user'
            },
            {
                name: 'TLTK', //TAI LIEU THAM KHAO
                component: 'TaiLieuThamKhao',
                classIcon: 'fa fa-book'
            },
            {
                name: 'PTBM', // PHUONG THUC BAO MAT
                component: 'PhuongThucBaoMat',
                classIcon: 'fa fa-shield'
            },
            // {
            //     name: 'DMK', //DOI MAT KHAU
            //     component: 'DoiMatKhau',
            //     classIcon: 'fa fa-lock'
            // },
            {
                name: 'DMP', //DOI MA PIN
                component: 'DoiMaPin',
                classIcon: 'fa fa-th'
            }
        ]
    }
}


class NhaDauTu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeComponent: '',
            currentMenu: '',
        };
    }

    componentDidMount() {
        let element = document.getElementById('main_body');
        if (element) {
            element.classList.add('acc-ndt-customize-body');
        }
        this.setState({
            currentMenu: ALL_TABS.CUSTOMER
        })
    }

    componentWillUnmount() {
        let element = document.getElementById('main_body');
        if (element) {
            element.classList.remove('acc-ndt-customize-body');
        }
    }

    setActiveComponent = (tab) => {
        this.setState({
            activeComponent: tab.component
        })
    }

    render() {
        let { currentMenu, activeComponent } = this.state;
        let { datapage } = this.props;
        return (
            <div className="account-ndt-container">
                <div className="account-ndt-left">
                    <SideBar
                        setActiveComponent={this.setActiveComponent}
                        allTabs={currentMenu.tabs}
                    />
                </div>
                <div className="account-ndt-right">
                    <div className="acc-main-content-container">
                        {currentMenu && currentMenu.tabs && currentMenu.tabs.length > 0 &&
                            <React.Fragment>
                                {activeComponent === 'ManageAccountNDT' &&
                                    <ManageAccountNDT
                                        {...this.props}
                                        datapage={datapage}
                                    />
                                }
                                {activeComponent === 'TaiLieuThamKhao' &&
                                    <TaiLieuThamKhao />
                                }
                                {activeComponent === 'PhuongThucBaoMat' &&
                                    <PhuongThucBaoMat />
                                }
                                {activeComponent === 'DoiMaPin' &&
                                    <DoiMaPin />
                                }
                                {activeComponent === 'DoiMatKhau' &&
                                    <DoiMatKhau />
                                }

                            </React.Fragment>
                        }
                    </div>
                </div>
            </div>
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
module.exports = decorators(NhaDauTu);