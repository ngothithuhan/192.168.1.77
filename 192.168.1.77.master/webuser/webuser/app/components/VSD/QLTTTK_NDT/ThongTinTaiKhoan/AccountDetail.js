import React, { Component } from 'react'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux';
import EditAccount from '../../../OpenAccount/EditAccount/EditAccount'
import DanhMucDauTu from '../../../VSD/DanhMucDauTu/DanhMucDauTu'
import SaoKeLSGDTien from '../../../VCBF/SaoKeLSGDTien/SaoKeLSGDTien'
import SaoKeCCQ from '../../../VCBF/SaoKeCCQ/SaoKeCCQ.js'
import TruyVanLichSuGiaoDich from '../../../VSD/TruyVanLichSuGiaoDich/TruyVanLichSuGiaoDich'
import TruyVanThongTinSoDu from '../../../VSD/TruyVanThongTinSoDu/TruyVanThongTinSoDu'
import UploadManager from '../../../VSD/QLTTTK_NDT/QuanLyTK/UploadManager'
import './AccountDetail.scss'
class AccountDetail extends Component {

    TABS = [
        this.props.strings.tab1,
        this.props.strings.tab2,
        this.props.strings.tab3,
        this.props.strings.tab4,
        this.props.strings.tab5,
        this.props.strings.tab6,
        this.props.strings.tab7,
        this.props.strings.tab8,
    ]

    constructor(props) {
        super(props)
        this.state = {
            tabActive: this.TABS[0],
            datamenu: []
        }
    }
    async componentDidMount() {

    }

    handleActive = (tab) => {
        this.setState({
            tabActive: tab
        })
    }

    render() {

        let { dataFromRow } = this.props
        let { tabActive } = this.state

        let datapageDMDT = {
            OBJNAME: "PORTFOLIO"
        }
        let datapageLSGSTien = {
            OBJNAME: "CASHTRANSACTIONHIS"
        }
        let datapageSKCCQ = {
            OBJNAME: "FUNDTRANSACTIONHIST"
        }
        let datapageTVLSGD = {
            OBJNAME: "ODTRANSHIST"
        }
        let datapageTVTTSD = {
            OBJNAME: "BALANCE"
        }
        let datapageUL = {
            OBJNAME: "UPLOADMANAGER"
        }

        return (
            <div className="account-detail">
                <div className="header-nav">
                    <ul className="all-tab">
                        {
                            this.TABS.map((item, index) => {
                                return (
                                    <li key={index}
                                        onClick={() => this.handleActive(item)}
                                        className={this.state.tabActive === item ? "tab-item active" : "tab-item"}
                                    >
                                        {item}
                                    </li>)
                            })
                        }
                    </ul>
                </div>
                <div className="account-modal-detail-body">
                    {tabActive === this.TABS[0] &&
                        <EditAccount
                            dataFromParent={dataFromRow}
                            action={'view'}
                            access={'view'}
                            GRINVESTOR={dataFromRow.GRINVESTOR}
                            CUSTTYPE={dataFromRow.CUSTTYPE}
                        />
                    }
                    {tabActive === this.TABS[1] &&
                        < TruyVanLichSuGiaoDich
                            datapage={datapageTVLSGD}
                        />
                    }
                    {tabActive === this.TABS[2] &&
                        < TruyVanThongTinSoDu
                            datapage={datapageTVTTSD}
                        />
                    }
                    {tabActive === this.TABS[3] &&
                        <DanhMucDauTu
                            datapage={datapageDMDT}
                            isAccountOverview={true}
                            p_custodycd={dataFromRow.CUSTODYCD}
                        />
                    }
                    {tabActive === this.TABS[4] &&
                        <SaoKeLSGDTien
                            datapage={datapageLSGSTien}
                        />
                    }
                    {tabActive === this.TABS[5] &&
                        < SaoKeCCQ
                            datapage={datapageSKCCQ}
                        />
                    }
                    {tabActive === this.TABS[6] &&
                        < UploadManager
                            datapage={datapageUL}
                        />
                    }
                    {tabActive === this.TABS[7] &&
                        <div className="text-center">
                            pending api...
                        </div>
                    }
                </div>
            </div >
        )
    }
}


const stateToProps = state => ({
    auth: state.auth,
    language: state.language.language,
});


const decorators = flow([
    connect(stateToProps),
    translate('AccOverview')
]);

module.exports = decorators(AccountDetail);
