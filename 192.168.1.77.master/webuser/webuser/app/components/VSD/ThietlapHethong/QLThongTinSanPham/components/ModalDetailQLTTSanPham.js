import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import ModalTradingCycleInfoSIP from './ModalTradingCycleInfoSIP'
import ProductInfo from './ProductInfo'
import TableTradingCycleInfoSIP from './TableTradingCycleInfoSIP'
import TableAddDBCode from './TableAddDBCode'
import ModalAddDBCode from './ModalAddDBCode'
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import RestfulUtils from 'app/utils/RestfulUtils';
import { showNotifi } from 'app/action/actionNotification.js';

class ModalDetailQLTTSanPham extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDone: true,
            access: 'add',
            CUSTID: '',
            dataUPDATE: {},
            disabled: false,
            new_create: false,
            ProductInfo: {
                p_spcode: '',
                p_codeid: '',
                p_sptype: '',
                p_methods: '',
                p_vsdspcode: '',
                p_minamt: 0,
                p_maxamt: 0,
                p_minqtty: 0,
                p_maxqtty: 0,
            },
            dataTradingCycleSIP: [],
            checkFields: [
                { name: "p_codeid", id: "drdfundCode", obj: "Info", type: 'str' },
                { name: "p_vsdspcode", id: "txtproductID", obj: "Info", type: 'str' },
                { name: "p_minamt", id: "txtminBuyValue", obj: "Info", type: 'num' },
                { name: "p_maxamt", id: "txtmaxBuyValue", obj: "Info", type: 'num' },
                { name: "p_minqtty", id: "txtminSellAmt", obj: "Info", type: 'num' },
                { name: "p_maxqtty", id: "txtmaxSellAmt", obj: "Info", type: 'num' },
                { name: "periodcode", id: "txtperiodcode", obj: "TradingCycleInfoSIP", type: 'str' },
                { name: "p_mbcode ", id: "tableMbcode", obj: "DBCODE", type: 'str' },
            ],
            showModalTradingCycleInfoSIP: false,
            arrFundcode: [],
            showModalAddDBCode: false,
            dataDBCode: [],
            listDBCode: [],
        };
    }
    close() {
        this.props.closeModalDetail();
    }
    /**
     * Trường hợp update thì hiển thị tất cả thông tin lên cho sửa
     * Trường hơp view thì ẩn các nút sửa không cho duyệt
     * Trường hợp add thì ẩn thông tin chỉ hiện thông tin chung cho người dùng -> Thực hiện -> Mở các thông tin tiếp theo cho người dùng khai
     * @param {*access} nextProps
     */
    componentWillReceiveProps(nextProps) {
        let self = this;
        if (nextProps.access == "update" || nextProps.access == "view") {
            if (nextProps.isClear) {
                this.props.change();
                //ProductInfo
                this.state.ProductInfo["p_spcode"] = nextProps.DATA.SPCODE
                this.state.ProductInfo["p_codeid"] = nextProps.DATA.CODEID
                this.state.ProductInfo["p_sptype"] = nextProps.DATA.SPTYPE
                this.state.ProductInfo["p_methods"] = nextProps.DATA.METHODS
                this.state.ProductInfo["p_vsdspcode"] = nextProps.DATA.VSDSPCODE
                this.state.ProductInfo["p_minamt"] = nextProps.DATA.MINAMT
                this.state.ProductInfo["p_maxamt"] = nextProps.DATA.MAXAMT
                this.state.ProductInfo["p_minqtty"] = nextProps.DATA.MINQTTY
                this.state.ProductInfo["p_maxqtty"] = nextProps.DATA.MAXQTTY
                if (nextProps.DATA.SPTYPE === 'S' && nextProps.DATA.TRADINGCYCLE) {
                    var dataTradingCycleSIP = this.convertDataTradingCycle(nextProps.DATA.TRADINGCYCLE);
                } else {
                    dataTradingCycleSIP = [];
                }
                if (nextProps.DATA.SPTYPE === 'S' && nextProps.DATA.MBCODE) {
                    var dataDBCode = this.convertDataDBCode(nextProps.DATA.MBCODE);
                } else {
                    dataDBCode = [];
                }
                this.setState({
                    ProductInfo: this.state.ProductInfo,
                    access: nextProps.access,
                    isDone: true,
                    dataTradingCycleSIP,
                    dataDBCode
                })
            }
        }
        else
            if (nextProps.isClear) {
                this.props.change();
                this.setState({
                    new_create: true,
                    access: nextProps.access,
                    ProductInfo: {
                        p_spcode: '',
                        p_codeid: '',
                        p_sptype: '',
                        p_methods: '',
                        p_vsdspcode: '',
                        p_minamt: 0,
                        p_maxamt: 0,
                        p_minqtty: 0,
                        p_maxqtty: 0,
                    },
                    dataTradingCycleSIP: [],
                    dataDBCode: [],
                    isDone: false
                })
            }
    }
    convertDataDBCode = (mbcode) => {
        let dataDBCode = [];
        let arrDataDBCode = mbcode.includes('|') ? mbcode.split('|') : [];
        let { listDBCode } = this.state;
        if (arrDataDBCode && arrDataDBCode.length > 0) {
            arrDataDBCode.forEach((item, index) => {
                listDBCode.forEach(obj => {
                    if (item === obj.value) {
                        let newItem = obj;
                        newItem.id = index;
                        dataDBCode.push(newItem);
                    }
                })
            })
        }
        return dataDBCode;
    }
    convertDataTradingCycle = (tradingcycle) => {
        let dataTradingCycleSIP = [];
        let arrTradingCycle = tradingcycle.includes('~$~') ? tradingcycle.split('~$~') : [];
        
        if (arrTradingCycle && arrTradingCycle.length > 0) {
            arrTradingCycle.forEach((item, index) => {
                if (item.length > 0) {
                    let itemDetail = item.split('~#~');
                    if (itemDetail && itemDetail.length > 0) {
                        switch (itemDetail[4]) {
                            case 'D':
                                var id = index;
                                var minamt = itemDetail[0];
                                var maxamt = itemDetail[1];
                                var minterm = itemDetail[2];
                                var maxtermbreak = itemDetail[3];
                                var transactionperiod = itemDetail[4];
                                var periodcode = itemDetail[5];
                                var day = '';
                                var date = '';
                                var month = '';
                                break;
                            case 'W':
                                id = index;
                                minamt = itemDetail[0];
                                maxamt = itemDetail[1];
                                minterm = itemDetail[2];
                                maxtermbreak = itemDetail[3];
                                transactionperiod = itemDetail[4];
                                periodcode = itemDetail[5];
                                day = itemDetail[6];
                                date = '';
                                month = '';
                                break;
                            case 'M':
                                id = index;
                                minamt = itemDetail[0];
                                maxamt = itemDetail[1];
                                minterm = itemDetail[2];
                                maxtermbreak = itemDetail[3];
                                transactionperiod = itemDetail[4];
                                periodcode = itemDetail[5];
                                day = '';
                                date = itemDetail[6];
                                month = '';
                                break;
                            case 'Q':
                                let quaterDetail = itemDetail[6].split('~&~');
                                id = index;
                                minamt = itemDetail[0];
                                maxamt = itemDetail[1];
                                minterm = itemDetail[2];
                                maxtermbreak = itemDetail[3];
                                transactionperiod = itemDetail[4];
                                periodcode = itemDetail[5];
                                day = '';
                                date = quaterDetail[1];
                                month = quaterDetail[0];
                                break;
                            default:
                                break;
                        }
                        dataTradingCycleSIP.push({
                            id, transactionperiod, periodcode, day, date, month, minamt, maxamt, minterm, maxtermbreak
                        })
                    }
                }
            });
        }
        return dataTradingCycleSIP;
    }

    componentDidMount() {
        this.getOptionsFundCode();
        this.getAgentOptions();
    }

    getAgentOptions(input) {
        return RestfulUtils.post('/vcbf/getAgentsList', { key: input, OBJNAME: this.props.OBJNAME })
            .then((res) => {
                this.setState({ listDBCode: res })
            })
    }
    
    getOptionsFundCode(input) {
        return RestfulUtils.post('/fund/getlist', { OBJNAME: this.props.OBJNAME, p_language: this.props.currentLanguage })
            .then((res) => {
                let arrData = res.DT.data;
                let options = [];
                arrData && arrData.length > 0 && arrData.forEach(item => {
                    options.push({
                        value: item.CODEID,
                        label: item.CODEID + '-' + item.SYMBOL
                    })
                })
                this.setState({ arrFundcode: options });
            })
    }
    getvalProductInfo(data) {
        if (data) this.state.ProductInfo = data
        this.setState({
            ProductInfo: this.state.ProductInfo
        })
    }
    getDBCodeString = (dataDBCode) => {
        let dbcodestring = '';
        dataDBCode.forEach(item => {
            dbcodestring = dbcodestring + item.value + '|';
        })
        return dbcodestring;
    }
    convertArrToString = (dataTradingCycleSIP) => {
        // Giá trị đặt mua tối thiểu "~#~" Giá trị đặt mua tối đa "~#~" Số kỳ tối thiểu tham gia SIP "~#~" 
        // Số kỳ miss SIP bị dừng "~#~" loại chu kỳ "~#~" mã chu kỳ "~#~" checked value "~$~"
        let convertedStr = '';
        dataTradingCycleSIP.forEach(item => {
            let itemString = '';
            let defaultItemString = item.minamt + "~#~" + item.maxamt + "~#~" + item.minterm + "~#~"
            + item.maxtermbreak + "~#~" + item.transactionperiod + "~#~" + item.periodcode;
            switch (item.transactionperiod) {
                case 'D':
                    itemString = defaultItemString + "~$~";
                    break;
                case 'W':
                    itemString = defaultItemString + "~#~" + item.day + "~$~";
                    break;
                case 'M':
                    itemString = defaultItemString + "~#~" + item.date + "~$~";
                    break;
                case 'Q':
                    itemString = defaultItemString + "~#~" + (item.month + "~&~" + item.date) + "~$~";
                    break;
                default:
                    break;
            }
            convertedStr = convertedStr + itemString;
        });
        return convertedStr;
    }
    getDataToSubmit = () => {
        const { ProductInfo, dataTradingCycleSIP, dataDBCode } = this.state;
        let data = {};
        data.p_spcode = ProductInfo.p_spcode;
        data.p_codeid = ProductInfo.p_codeid;
        data.p_sptype = ProductInfo.p_sptype;
        data.p_vsdspcode = ProductInfo.p_vsdspcode;

       
        data.p_minqtty = ProductInfo.p_minqtty ? ProductInfo.p_minqtty : '0';
        data.p_maxqtty = ProductInfo.p_maxqtty ? ProductInfo.p_maxqtty : '0';

        data.pv_objname = this.props.OBJNAME;
        data.pv_language = this.props.lang;

        if (ProductInfo.p_sptype === 'S') {
            data.p_methods = ProductInfo.p_methods;
            data.p_tradingcycle = this.convertArrToString(dataTradingCycleSIP);
            data.p_mbcode = this.getDBCodeString(dataDBCode)
            data.p_minamt = '0';
            data.p_maxamt = '0';
        } else {
            data.p_minamt = ProductInfo.p_minamt ? ProductInfo.p_minamt : '0';
            data.p_maxamt = ProductInfo.p_maxamt ? ProductInfo.p_maxamt : '0';
            data.p_methods = '';
            data.p_tradingcycle = '';
            data.p_mbcode = '';
        }
        return data;
    }
    handleSubmit = () => {
        var mssgerr = '';
        for (let index = 0; index < this.state.checkFields.length; index++) {
            const element = this.state.checkFields[index];
            mssgerr = this.checkValid(element.name, element.id, element.obj, element.type);
            if (mssgerr !== '')
                break;
        }
        let data = this.getDataToSubmit();
        if (mssgerr == '') {
            var api = '/fund/addproduct';
            if (this.state.access == "update") {
                api = '/fund/updateproduct';
            }
            RestfulUtils.posttrans(api, data)
                .then((res) => {
                    if (res.EC == 0) {
                        this.props.dispatch(showNotifi({
                            type: "success",
                            header: "",
                            content: this.props.strings.success
                        }));
                        this.props.load()
                        this.props.closeModalDetail()
                    } else {
                        this.props.dispatch(showNotifi({
                            type: "error",
                            header: "",
                            content: res.EM
                        }));
                    }
                })
        }
    }
    checkValid(name, id, obj, type) {
        let value = ""
        let mssgerr = '';
        let isSipProduct = this.state.ProductInfo['p_sptype'] === 'S';

        if (obj == 'Info') {
            value = this.state.ProductInfo[name];
            switch (name) {
                case "p_codeid":
                    if (value == '' || value == undefined) mssgerr = this.props.strings.requiredp_codeid;
                    break;
                case "p_vsdspcode":
                    if (value == '' || value == undefined) mssgerr = this.props.strings.requiredp_vsdspcode;
                    break;
                case "p_minamt":
                    if (!isSipProduct && value === '') mssgerr = this.props.strings.requiredp_minamt;
                    break;
                case "p_maxamt":
                    if (!isSipProduct && value === '') mssgerr = this.props.strings.requiredp_maxamt;
                    break;
                case "p_minqtty":
                    if (value === '') mssgerr = this.props.strings.requiredp_minqtty;
                    break;
                case "p_maxqtty":
                    if (value === '') mssgerr = this.props.strings.requiredp_maxqtty;
                    break;
                default:
                    break;
            }
        }
        else if (obj == 'DBCODE') {
            if (isSipProduct && this.state.dataDBCode.length === 0) {
                mssgerr = this.props.strings.requireDBcode;
            }
        }
        else if (obj == 'TradingCycleInfoSIP') {
            if (isSipProduct && this.state.dataTradingCycleSIP.length === 0) {
                mssgerr = this.props.strings.requireTradingCycleInfoSIP;
            }
        }
        if (mssgerr !== '') {
            this.props.dispatch(showNotifi({
                type: "error",
                header: "",
                content: mssgerr
            }));
            window.$(`#${id}`).focus();
        }
        return mssgerr;
    }
    showModalTradingCycleInfoSIP = (action, dataUPDATE) => {
        let titleModal = ""
        switch (action) {
            case "add": titleModal = this.props.strings.modal2add; break
            case "update": titleModal = this.props.strings.modal2edit; break;
            case "view": titleModal = this.props.strings.modal2view; break
        }
        this.setState({
            showModalTradingCycleInfoSIP: true, titleModal2: titleModal, dataUPDATE: dataUPDATE, accessTradingCycleSIP: action
        })
    }
    closeModalTradingCycleInfoSIP = () => {
        this.setState({ showModalTradingCycleInfoSIP: false })
    }
    addTradingCycleSIP = (data, access) => {
        if (access == 'add') {
            if (this.state.dataTradingCycleSIP.length == 0) var id = 0;
            else id = parseInt(this.state.dataTradingCycleSIP.length)
            let newData = JSON.parse(JSON.stringify(this.state.dataTradingCycleSIP));
            newData.push({
                id: id,
                transactionperiod: data.transactionperiod,
                periodcode: data.periodcode,
                day: data.day,
                date: data.date,
                month: data.month,
                minamt: data.minamt,
                maxamt: data.maxamt,
                minterm: data.minterm,
                maxtermbreak: data.maxtermbreak,
            })
            this.setState({
                dataTradingCycleSIP: newData.sort((a, b) => parseFloat(a.id) - parseFloat(b.id)),
            })
            this.closeModalTradingCycleInfoSIP()
        } else {
            let result = this.state.dataTradingCycleSIP.filter(node => node.id != data.id);
            this.state.dataTradingCycleSIP = result;
            this.state.dataTradingCycleSIP.push({
                id: data.id,
                transactionperiod: data.transactionperiod,
                periodcode: data.periodcode,
                day: data.day,
                date: data.date,
                month: data.month,
                minamt: data.minamt,
                maxamt: data.maxamt,
                minterm: data.minterm,
                maxtermbreak: data.maxtermbreak,
            })
            this.setState({
                dataTradingCycleSIP: this.state.dataTradingCycleSIP.sort((a, b) => parseFloat(a.id) - parseFloat(b.id))
            })
            this.closeModalTradingCycleInfoSIP()
        }
    }
    loadagain = (data) => {
        this.setState({
            dataTradingCycleSIP: data
        })
    }
    clearDataTradingCycleSIP = () => {
        this.setState({
            dataTradingCycleSIP: []
        })
    }

    loadDBCodeagain = (data) => {
        this.setState({
            dataDBCode: data
        })
    }
    showModalAddDBCode = (action, dataUPDATE) => {
        let titleModal = ""
        switch (action) {
            case "add": titleModal = this.props.strings.modal2adddbcode; break
            case "update": titleModal = this.props.strings.modal2editdbcode; break;
            case "view": titleModal = this.props.strings.modal2viewdbcode; break
        }
        this.setState({
            showModalAddDBCode: true, titleModalAddDBCode: titleModal, dataUPDATEDBCode: dataUPDATE, accessDBCode: action
        })
    }
    closeModalAddDBCode = () => {
        this.setState({ showModalAddDBCode: false })
    }
    addDBCode = (data, access) => {
        if (access == 'add') {
            if (this.state.dataDBCode.length == 0) var id = 0;
            else id = parseInt(this.state.dataDBCode.length)
            let newData = JSON.parse(JSON.stringify(this.state.dataDBCode));
            newData.push({
                id: id,
                value: data.value,
                label: data.label,
            })
            this.setState({
                dataDBCode: newData.sort((a, b) => parseFloat(a.id) - parseFloat(b.id)),
            })
            this.closeModalAddDBCode()
        } else {
            let result = this.state.dataDBCode.filter(node => node.id != data.id);
            this.state.dataDBCode = result;
            this.state.dataDBCode.push({
                id: data.id,
                value: data.value,
                label: data.label,
            })
            this.setState({
                dataDBCode: this.state.dataDBCode.sort((a, b) => parseFloat(a.id) - parseFloat(b.id))
            })
            this.closeModalAddDBCode();
        }
    }

    render() {
        let displayy = this.state.access == 'view' ? true : false
        let isSipProduct = this.state.ProductInfo['p_sptype'] === 'S';

        return (
            <Modal show={this.props.showModalDetail} dialogClassName="custom-modal">
                <Modal.Header >
                    <Modal.Title ><div className="title-content col-md-6">{this.props.title} <button type="button" className="close" onClick={this.close.bind(this)}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button></div></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: "auto", height: "100%" }}>
                    <form >
                        <div className="col-md-12 "></div>
                        <div className={this.state.access == "view" ? "panel-body disable" : "panel-body"}>
                            <div className="col-md-12 row-data">
                                <ProductInfo
                                    onChange={this.getvalProductInfo.bind(this)}
                                    data={this.props.DATA}
                                    datatest={this.state.ProductInfo}
                                    accessProductInfo={this.state.access}
                                    OBJNAME={this.props.OBJNAME}
                                    arrFundcode={this.state.arrFundcode}
                                    clearDataTradingCycleSIP={this.clearDataTradingCycleSIP}
                                />
                            </div>
                            <div className="col-md-12 row-data">
                                {isSipProduct && (
                                    <TableAddDBCode
                                        showModalDetail={this.showModalAddDBCode}
                                        data={this.state.dataDBCode}
                                        access={this.state.accessDBCode}
                                        loadagain={this.loadDBCodeagain}
                                    />
                                )}
                                <ModalAddDBCode
                                    showModalDetail={this.state.showModalAddDBCode}
                                    title={this.state.titleModalAddDBCode}
                                    closeModalDetail={this.closeModalAddDBCode}
                                    dataUPDATE={this.state.dataUPDATEDBCode}
                                    data={this.state.dataDBCode}
                                    OBJNAME={this.props.OBJNAME}
                                    addDBCode={this.addDBCode}
                                    access={this.state.accessDBCode}
                                    listDBCode={this.state.listDBCode}
                                />
                            </div>
                            <div className="col-md-12 row-data">
                                {isSipProduct && (
                                    <TableTradingCycleInfoSIP
                                        showModalDetail={this.showModalTradingCycleInfoSIP}
                                        data={this.state.dataTradingCycleSIP}
                                        ProductInfo={this.state.ProductInfo}
                                        loadagain={this.loadagain}
                                        access={this.state.accessTradingCycleSIP}
                                    />
                                )}
                                <ModalTradingCycleInfoSIP
                                    showModalDetail={this.state.showModalTradingCycleInfoSIP}
                                    title={this.state.titleModal2}
                                    closeModalDetail={this.closeModalTradingCycleInfoSIP}
                                    addTradingCycleSIP={this.addTradingCycleSIP}
                                    dataUPDATE={this.state.dataUPDATE}
                                    access={this.state.accessTradingCycleSIP}
                                    data={this.state.dataTradingCycleSIP}
                                    ProductInfo={this.state.ProductInfo}
                                />
                            </div>
                            <div className="col-md-12 row">
                                <div className="pull-right">
                                    <input disabled={displayy} type="button" className="btn btn-primary" style={{ marginLeft: 0 }} value={this.props.strings.submit} onClick={this.handleSubmit} id="btnSubmit" />
                                </div>
                            </div>
                        </div>
                    </form >

                </Modal.Body>

            </Modal>
        );
    }
}
const stateToProps = state => ({
    lang: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('ModalDetailQLTTSanPham')
]);
module.exports = decorators(ModalDetailQLTTSanPham);
