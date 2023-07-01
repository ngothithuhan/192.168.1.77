import React from 'react';
import { connect } from 'react-redux';
//import ModalThongTinMonTienNop from './Components/ModalThongTinMonTienNop.js';
import TableSoldNAV from './Components/TableSoldNAV'
import TableHaveSymbolNAV from './Components/TableHaveSymbolNAV'
import TableMixNAV from './Components/TableMixNAV'
import { LabelEx } from 'app/utils/LabelEx';
import RestfulUtils from 'app/utils/RestfulUtils';
import { Collapse } from 'react-bootstrap'
import Select from 'react-select';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import "react-table/react-table.css";
import ModalTimKiemFullname from 'app/utils/Dialog/ModalTimKiemFullname.js'
import 'app/utils/customize/CustomizeReactTable.scss';
import './DanhMucDauTuNAV.scss'

class DanhMucDauTuNAV extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pagesize: "5",
            activePage: "1",
            showPopupThongTinMonNop: false,
            dataThongTinMonNop: [],
            CODEID: { value: '', label: '' },
            SESSION: { value: '', label: '' },
            optionsTradingsession: [],
            showModalSearch: false,
            dataSearch: [],
            keySearch: {},
            search: false,
            ShowTable: false,
            collapse: {
                general: true,
                authorize: false,
                fatca: false,
                upload: false,
                quydangki: false,
                general1: true,
                general2: false,
                general3: false,

            },
            CUSTODYCD: { value: '', label: '' },
            isExpectedSellTabActive: false,
        };
    }
    showPopupThongTinMonNop(data) {
        this.setState({ showPopupThongTinMonNop: true, dataThongTinMonNop: data });

    }
    closePopupThongTinMonNop() {
        this.setState({ showPopupThongTinMonNop: false });
    }
    save() {
        this.setState({ showModal: false });
    }


    getOptionsSYMBOLbyTLID(input) {
        return RestfulUtils.post('/allcode/search_all_funds', { key: input })
            .then((res) => {
                res.unshift({ value: 'ALL', label: 'ALL' })
                return { options: res }
            })
    }
    async getOptionsSession(input) {

        return { options: this.state.optionsTradingsession }

    }
    onChangeSYMBOL(e) {
        /*
      let CODEID_Pre = {...this.state.CODEID}
      var that = this;
      // this.state.keySearch.SYMBOL = e ? e.label : '';
  
        this.state.CODEID= e,
        this.state.SESSION={ value: '', label: '' },
        this.state.optionsTradingsession=[]
  
      if (e) {
        console.log('callapi',CODEID_Pre,e)
        let callApi = CODEID_Pre&&CODEID_Pre.value==e.value?false:true //check bị 2 lần gọi api khi thay đổi mã quỹ
        if(callApi)
          this.getListTradingSession(e.value);
      }
      this.setState(this.state)
      */

        if (e === null) {
            this.state.CODEID = ''
            e = { value: '', label: '' }
        }

        this.state.CODEID = e.value
        this.setState(this.state)
    }
    // getListTradingSession(CODEID) {
    //     let self = this
    //     RestfulUtils.post('/allcode/search_all_session', { key: '', CODEID: CODEID, filter: ['A', 'B'] })
    //         .then((res) => {
    //            // console.log('/allcode/search_all_session', res)

    //             self.setState({ optionsTradingsession: res })
    //         });
    // }
    onChange(type, e) {
        if (e === null) {
            this.state[type] = ''
            e = { value: '', label: '' }

        }
        // this.state.keySearch.TRADINGID = e ? e.label : '';

        this.state[type] = e
        this.state.ShowTable = false
        this.setState(this.state)
        let self = this

    }
    onClickSearch() {
        let { CODEID, SESSION, CUSTODYCD } = this.state

        let SYMBOL = CODEID ? CODEID : 'ALL';
        let type = SESSION ? SESSION.value : '';
        this.state.keySearch.p_codeid = SYMBOL;
        this.state.keySearch.p_custodycd = CUSTODYCD.value
        //this.state.keySearch.p_type = type
        this.state.keySearch.p_language = this.props.lang
        this.setState({ keySearch: this.state.keySearch, ShowTable: true })


    }

    refreshSearch() {
        this.setState({ search: false })
    }
    collapse(tab) {
        //  console.log(tab)
        this.state.collapse[tab] = !this.state.collapse[tab];
        // console.log(this.state.collapse)
        this.setState({ collapse: this.state.collapse })
    }
    getOptions(input) {
        var self = this;

        return RestfulUtils.post('/account/search_all', { key: input })
            .then((res) => {
                const { user } = this.props.auth
                let isCustom = user && user.ISCUSTOMER == 'Y';
                var data = [];
                let j = 0;
                for (j = 0; j < res.length; j++) {
                    res[j] = { label: res[j].label + ' - ' + res[j].detail.FULLNAME, value: res[j].value }
                }
                if (isCustom) {
                    var defaultName1 = self.props.auth.user;
                    console.log('defaultName1:', defaultName1)
                    var defaultCustodyCd = self.props.auth.user.USERID;
                    var listOptionSelect = [{ label: defaultCustodyCd, value: defaultCustodyCd }];
                    self.state.CUSTODYCD = { label: defaultCustodyCd, value: defaultCustodyCd };
                    self.state.keySearch.p_custodycd = defaultCustodyCd;
                    self.setState(self.state);
                    return { options: listOptionSelect }

                } else {
                    return { options: res }
                }


            })

    }
    async onChangeCUSTODYCD(e) {

        var self = this;
        if (e) {
            this.state.keySearch.p_custodycd = e.value;
            this.state.keySearch.p_codeid = 'ALL';

        } else {
            e = { label: '', value: '' }
            this.state.keySearch.p_custodycd = '';
            this.state.keySearch.p_codeid = 'EMPTY';
        }
        this.state.keySearch.p_language = this.props.lang;
        this.setState({ CUSTODYCD: e, keySearch: this.state.keySearch });
    }
    componentDidMount() {
        const { user } = this.props.auth

        this.state.keySearch.p_custodycd = user && user.USERNAME;
        //console.log('thanh.ngo user======',user)

        let element = document.getElementById('main_body');
        let isCustom = user && user.ISCUSTOMER === 'Y' ? true : false;
        if (element && isCustom === true) {
            element.classList.add('danh-muc-dau-tu-nav-customize-body');
        }

        if (isCustom) {
            this.state.keySearch.p_codeid = 'ALL';
            this.state.keySearch.p_language = this.props.lang
            this.setState({
                keySearch: this.state.keySearch, ShowTable: true
            })
        } else {
            this.state.keySearch.p_codeid = 'EMPTY';
            this.state.keySearch.p_language = this.props.lang
            this.setState({
                keySearch: this.state.keySearch, ShowTable: true
            })
        }

    }
    closeModalSearch() {
        this.setState({ showModalSearch: false })
    }
    handleClickSearch() {
        console.log('haki=================== :')
        this.setState({ showModalSearch: true })
    }
    selectCustodycd(data) {
        console.log('data selected :::', data)
        this.onChangeCUSTODYCD({ label: data.CUSTODYCD + ' - ' + data.FULLNAME, value: data.CUSTODYCD })
        //this.setState({ ...this.state, CUSTODYCD: { label: data.CUSTODYCD, value: data.CUSTODYCD } });

    }

    componentWillUnmount() {
        let element = document.getElementById('main_body');
        if (element) {
            element.classList.remove('danh-muc-dau-tu-nav-customize-body');
        }
    }

    setExpectedSellTab(isExpectedSellTabActive) {
        this.setState({
            isExpectedSellTabActive: isExpectedSellTabActive
        })
    }

    render() {
        //let { TRADINGID, SESSION, ShowTable } = this.state
        let { datapage } = this.props
        const { user } = this.props.auth
        let isCustom = user ? user.ISCUSTOMER ? user.ISCUSTOMER == 'Y' : true : true;
        let isGroupUser = user ? (user.ISGROUPUSER ? true : false) : false;
        let disableCustodycdBox = this.state.ISEDIT || isCustom;
        return (
            <div className="danh-muc-dau-tu-nav-container">
                <ModalTimKiemFullname
                    onSelectRow={this.selectCustodycd.bind(this)}
                    showModal={this.state.showModalSearch}
                    closeModalTimKiem={this.closeModalSearch.bind(this)}
                />
                <div className="danh-muc-dau-tu-body">
                    {!isCustom && !this.state.isExpectedSellTabActive &&
                        <div className="col-md-12 danh-muc-dau-tu-search">
                            <div className='col-md-6'>
                                <LabelEx className="danh-muc-dau-tu-title" text={this.props.strings.titlepage} />
                            </div>

                            <h5 className="" style={{ fontSize: "12px", fontWeight: "600", float: "left" }}><LabelEx text={this.props.strings.custodycd} /></h5>
                            <div className="col-md-4 customSelect" style={{ zIndex: 100 }}>
                                <Select.Async
                                    name="form-field-name"
                                    disabled={disableCustodycdBox}
                                    loadOptions={this.getOptions.bind(this)}
                                    value={this.state.CUSTODYCD}
                                    onChange={this.onChangeCUSTODYCD.bind(this)}
                                    id="cbCUSTODYCD"
                                    cache={false}
                                />

                            </div>

                            <div className="col-xs-1" style={{ paddingLeft: "0px" }}>
                                <input style={{ margin: "0 0 0 0", maxHeight: "28px" }} type="button" onClick={this.handleClickSearch.bind(this)}
                                    className="pull-left btn btndangeralt" defaultValue={this.props.strings.searchfullname} id="btupdate22" />
                            </div>
                        </div>
                    }

                    <div className="danh-muc-dau-tu-content">
                        <ul className="nav nav-tabs sub-nav-dmdt">
                            <li className="active" onClick={this.setExpectedSellTab.bind(this, false)}>

                                <a data-toggle="tab" href="#tab1" id="#tab1">
                                    <span>{this.props.strings.title2} </span>
                                </a>


                            </li>
                            <li onClick={this.setExpectedSellTab.bind(this, false)}><a data-toggle="tab" href="#tab2" id="#tab2">{this.props.strings.title1}</a></li>
                            <li onClick={this.setExpectedSellTab.bind(this, false)}><a data-toggle="tab" href="#tab3" id="#tab3">{this.props.strings.title3}</a></li>
                            {/* <li onClick={this.setExpectedSellTab.bind(this, true)}><a data-toggle="tab" href="#tab4" id="#tab4">{this.props.strings.title4}</a></li> */}
                        </ul>
                        <div
                            className="tab-content">
                            <div id="tab1" className="tab-pane fade in active">
                                {/* CCQ còn nắm giữ */}
                                <TableHaveSymbolNAV
                                    OBJNAME={datapage.OBJNAME}
                                    keySearch={this.state.keySearch}
                                    showPopupThongTinMonNop={this.showPopupThongTinMonNop.bind(this)} />
                            </div>
                            <div id="tab2" className="tab-pane fade">
                                {/* CCQ đã bán */}
                                <TableSoldNAV OBJNAME={datapage.OBJNAME} keySearch={this.state.keySearch} showPopupThongTinMonNop={this.showPopupThongTinMonNop.bind(this)} />
                            </div>
                            <div id="tab3" className="tab-pane fade">
                                {/* Tổng hợp */}
                                <TableMixNAV OBJNAME={datapage.OBJNAME} keySearch={this.state.keySearch} showPopupThongTinMonNop={this.showPopupThongTinMonNop.bind(this)} />
                            </div>
                            {/* <div id="tab4" className="tab-pane fade"> */}
                                {/* Dự kiến bán */}
                                {/* <TableExpectedSell OBJNAME={datapage.OBJNAME} showPopupThongTinMonNop={this.showPopupThongTinMonNop.bind(this)} />
                            </div> */}
                        </div>
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
    translate('DanhMucDauTuNAV')
]);
module.exports = decorators(DanhMucDauTuNAV);