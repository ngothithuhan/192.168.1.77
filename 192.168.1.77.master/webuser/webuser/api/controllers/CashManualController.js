/**
 * CashManualController
 *
 * @description :: Server-side logic for managing Cashmanuals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var processingserver = require('../commonwebuser/ProcessingServer');
var path = require('path');
var Ioutput = require(path.resolve(__dirname, '../common/OutputInterface.js'));
module.exports = {
    get: (req, res) => {
        let data = {};
        let { TRANSID } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let REFLOGID = "";
        data.ret = { dir: 3003, type: 2004 };
        data.ROLE = ROLECODE;
        data.REFLOGID = REFLOGID;
        data.TLID = TLID;
        data.TRANSID = TRANSID;
        var obj = {
            'funckey': 'FOPKS_IV.PRC_GET_CASHS',
            'bindvar': data
        }
        // console.log(JSON.stringify(obj))
        processingserver.callAPI(obj, async function (err, rs) {
            if (err)
                res.send('error')
            return res.send(rs);
        })
    },
    fetchListCashTransHis: async function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_custodycd: data.custodycd,
            p_codeid: data.codeid,
            p_srtype: data.srtype,
            p_frdate: data.txdate_from,
            p_tdate: data.txdate_to,
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language
        }
        let obj =
        {
            "funckey": "prc_get_cashtrans_hist",
            bindvar: rest
        }
        let obj2 =
        {
            "funckey": "prc_get_begin_amt",
            bindvar: rest
        }
        let beginamt = '';
        processingserver.callAPI(obj2, async function (err1, rs1) {
            if (err1) {
                sails.log('err1:::', err1)
                return res.send(err1);
            }
            try {
                if (rs1.EC == 0) {

                    let result1 = ConvertData.convert_to_Object(rs1.DT.p_refcursor);
                    if (result1.length > 0) {
                        beginamt = result1[0].AMT.toString();
                        //beginamt = 'khong cos';
                        sails.log('beginamt:', beginamt)
                        processingserver.callAPI(obj, async function (err, rs) {
                            if (err) {
                                sails.log('err:::', err)
                                return res.send(Utils.removeException(err));
                            }
                            try {
                                if (rs.EC == 0) {
                                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                                    var i;
                                    var DT = {};
                                    let tmpamt = beginamt;
                                    let dataAll = result;
                                    if (result.length > 0) {
                                        for (i = 0; i < result.length; i++) {
                                            if (result[i].TXTYPE == 'D') {
                                                result[i].AMOUNT = parseFloat(tmpamt) - parseFloat(result[i].INC)
                                            }
                                            else {
                                                result[i].AMOUNT = parseFloat(tmpamt) + parseFloat(result[i].INC)
                                            }
                                            tmpamt = result[i].AMOUNT;

                                        }
                                        let resback = [];

                                        let dataDauKy = {
                                            "DESCRIPTION": "",
                                            "INCREASE": "",
                                            "DECREASE": "",
                                            "INC": "",
                                            "DES": "",
                                            "TXCD": "",
                                            "TLTXCD": "",
                                            "TXTYPE": "",
                                            "FIELD": "",
                                            "TXDESC": "",
                                            "TRDESC": "",
                                            "BKDATE": "",
                                            "AUTOID": "",
                                            "TXNUM": "",
                                            "TXDATE": "Đầu kỳ",
                                            "ACCTNO": "",
                                            "CODEID": "",
                                            "SYMBOL": "",
                                            "SRTYPE": "",
                                            "REF": "",
                                            "DELTD": "",
                                            "ACCTREF": "",
                                            "LVEL": "",
                                            "AMOUNT": parseFloat(beginamt)
                                        };
                                        let dataCuoiKy = {
                                            "DESCRIPTION": "",
                                            "INCREASE": "",
                                            "DECREASE": "",
                                            "INC": "",
                                            "DES": "",
                                            "TXCD": "",
                                            "TLTXCD": "",
                                            "TXTYPE": "",
                                            "FIELD": "",
                                            "TXDESC": "",
                                            "TRDESC": "",
                                            "BKDATE": "",
                                            "AUTOID": "",
                                            "TXNUM": "",
                                            "TXDATE": "Cuối kỳ",
                                            "ACCTNO": "",
                                            "CODEID": "",
                                            "SYMBOL": "",
                                            "SRTYPE": "",
                                            "REF": "",
                                            "DELTD": "",
                                            "ACCTREF": "",
                                            "LVEL": "",
                                            "AMOUNT": result[result.length - 1].AMOUNT
                                        };
                                        resback.push(dataDauKy)
                                        for (i = 0; i < result.length; i++) {
                                            resback.push(result[i]);

                                        }
                                        resback.push(dataCuoiKy)
                                        dataAll = resback;

                                        let pv_sumRecord = resback.length;
                                        //phan trang
                                        let { pagesize, page, keySearch, sortSearch } = req.body;
                                        //let { pagesize, page, sortSearch } = req.body;
                                        if (keySearch)
                                            if (keySearch.length > 0)
                                                resback = await Paging.find(resback, keySearch)
                                        let numOfPages = Math.ceil(resback.length / pagesize);

                                        if (sortSearch)
                                            if (sortSearch.length > 0)
                                                resback = await Paging.orderby(resback, sortSearch)
                                        resback = await Paging.paginate(resback, pagesize, page ? page : 1)

                                        delete rs.DT["p_refcursor"];
                                        DT = { data: resback, dataAll: dataAll, numOfPages: numOfPages, sumRecord: pv_sumRecord }
                                    }
                                    else {
                                        DT = { data: result, dataAll: dataAll, numOfPages: 0, sumRecord: 0, dataAll: dataAll }
                                    }
                                    return res.send(Ioutput.success(DT));

                                } else {
                                    sails.log('rs:::', rs)
                                    return res.send(rs);
                                }
                            } catch (error) {
                                sails.log('error trong :::', error)
                                rs.EM = 'Lỗi client gọi api';
                                rs.EC = -1000;
                                return res.send(rs)
                            }
                        })
                    }
                    else {
                        sails.log('result1.length <= 0');
                        let rs = {}
                        rs.EM = 'No data found';
                        rs.EC = 0;
                        rs.DT = []
                        return res.send(rs);
                    }
                }
            }
            catch (error) {
                sails.log('error ngoài :::', error)
                rs1.EM = 'Lỗi client gọi api';
                rs1.EC = -1000;
                return res.send(rs1)
            }
        });


    },
    fetchListFundTransHis: async function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_custodycd: data.custodycd,
            p_codeid: data.codeid,
            p_frdate: data.txdate_from,
            p_tdate: data.txdate_to,
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language
        }
        //console.log("-----get prcListPrintso -------", rest)
        let obj =
        {
            "funckey": "prc_get_fundtrans_hist",
            bindvar: rest
        }
        let obj2 =
        {
            "funckey": "prc_get_begin_amt_fund",
            bindvar: rest
        }
        let beginamt = '';
        processingserver.callAPI(obj2, async function (err1, rs1) {
            if (err1) {
                return res.send(err1);
            }
            try {
                if (rs1.EC == 0) {

                    let result1 = ConvertData.convert_to_Object(rs1.DT.p_refcursor);
                    sails.log('result 1 :', result1)
                    if (result1.length > 0) {
                        beginamt = result1[0].AMT;
                        processingserver.callAPI(obj, async function (err, rs) {
                            if (err) {
                                return res.send(Utils.removeException(err));
                            }
                            try {
                                if (rs.EC == 0) {
                                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                                    var i;
                                    var DT = {};
                                    let tmpamt = beginamt;
                                    let dataAll = result;
                                    if (result.length > 0) {
                                        for (i = 0; i < result.length; i++) {
                                            // sails.log('kết quả đang xét :::',result[i])
                                            // sails.log('số dư hiện tại  :::', parseFloat(tmpamt))
                                            // sails.log('tăng  :::', parseFloat(result[i].INCREASE))
                                            // sails.log('giảm  :::', parseFloat(result[i].DECREASE))
                                            // sails.log('thay đổi  :::', parseFloat(result[i].INC))
                                            //result[i].AMOUNT = parseFloat(tmpamt) + parseFloat(result[i].INCREASE) - parseFloat(result[i].DECREASE)
                                            result[i].AMOUNT = parseFloat(parseFloat(tmpamt) + parseFloat(result[i].INC)).toFixed(2);
                                            tmpamt = parseFloat(result[i].AMOUNT).toFixed(2);
                                            // sails.log('tmpamt  :::', tmpamt)

                                        }
                                        //let resback = result;
                                        let resback = [];

                                        let dataDauKy = {
                                            "DESCRIPTION": "",
                                            "INCREASE": "",
                                            "DECREASE": "",
                                            "INC": "",
                                            "TXNUM": "",
                                            "TXDATE": "Đầu kỳ",
                                            "AMOUNT": beginamt.toString()
                                        };
                                        let dataCuoiKy = {
                                            "DESCRIPTION": "",
                                            "INCREASE": "",
                                            "DECREASE": "",
                                            "INC": "",
                                            "TXNUM": "",
                                            "TXDATE": "Cuối kỳ",
                                            "AMOUNT": result[result.length - 1].AMOUNT.toString()
                                        };
                                        resback.push(dataDauKy)
                                        for (i = 0; i < result.length; i++) {
                                            resback.push(result[i]);

                                        }
                                        resback.push(dataCuoiKy)
                                        dataAll = resback

                                        let pv_sumRecord = resback.length;
                                        //phan trang
                                        let { pagesize, page, keySearch, sortSearch } = req.body;
                                        if (keySearch)
                                            if (keySearch.length > 0)
                                                resback = await Paging.find(resback, keySearch)
                                        let numOfPages = Math.ceil(resback.length / pagesize);

                                        if (sortSearch)
                                            if (sortSearch.length > 0)
                                                resback = await Paging.orderby(resback, sortSearch)
                                        resback = await Paging.paginate(resback, pagesize, page ? page : 1)

                                        delete rs.DT["p_refcursor"];
                                        DT = { data: resback, dataAll: dataAll, numOfPages: numOfPages, sumRecord: pv_sumRecord }
                                    }
                                    else {
                                        DT = { data: result, numOfPages: 0, sumRecord: 0, dataAll: dataAll }
                                    }



                                    return res.send(Ioutput.success(DT));

                                } else {
                                    return res.send(rs);
                                }
                            } catch (error) {
                                rs.EM = 'Lỗi client gọi api';
                                rs.EC = -1000;
                                return res.send(rs)
                            }
                        })
                    }
                    else {
                        rs1.EM = 'No data found';
                        rs1.EC = 0;
                        rs1.DT = []
                        return res.send(rs1);
                    }
                }
            }
            catch (error) {
                sails.log('error:======', error)
                rs1.EM = 'Lỗi client gọi api';
                rs1.EC = -1000;
                return res.send(rs1)
            }
        });


    },
    getPaginate: (req, res) => {
        let data = {};
        let { TRANSID } = req.body;
        // console.log("Session:....", req.session.userinfo)
        let { TLID, ROLECODE } = req.session.userinfo;
        let REFLOGID = "";
        data.ret = { dir: 3003, type: 2004 };
        data.ROLE = ROLECODE;
        data.REFLOGID = REFLOGID;
        data.TLID = TLID;
        data.TRANSID = TRANSID;
        var obj = {
            'funckey': 'FOPKS_IV.PRC_GET_CASHS',
            'bindvar': data
        }
        // console.log(JSON.stringify(obj))
        processingserver.callAPI(obj, async function (err, rs) {
            if (err)
                res.send('error')
            // console.log("rs=======", rs);
            if (rs.RC == 0) {
                CashManual.find().exe((err, length) => {
                    if (err) return next(err);
                    let pagesize = parseInt(req.body.pagesize);
                    // console.log("pagasize:", pagesize)
                    let numOfPages = Math.ceil(length / pagesize);
                    let keySearch = Paging.generate_keySearch(req.body);
                    // console.log("numOfPages: ", numOfPages)
                    CashManual.find(keySearch)
                        .where({ ID: result })
                        .paginate({ limit: pagesize, page: req.body.page })
                        .exec((err, response) => {
                            rs.DT = { data: response, numOfPages: numOfPages }
                            return res.send(rs)
                        })
                })
            }
            else {
                res.DT = [];
                return res.send(rs)
            }
        })
    },
    add: (req, res) => {
        let rest = req.body;
        let data = {};
        let REFLOGID = "";
        data = CashManual.newInstance(data);
        let { TLID, ROLECODE } = req.session.userinfo;
        // rest.TLID = "0004";
        // rest.ROLE = "AMC";
        rest.REFLOGID = REFLOGID;
        rest.TLID = TLID;
        rest.ROLE = ROLECODE;
        data = { ...data, ...rest };
        let obj = { model: data }
        processingserver.createmodel(obj, async function (err, rs) {
            if (err)
                res.send('error')
            return res.send(rs);
        })
    },
    edit: (req, res) => {
        let rest = req.body;
        let data = {};
        let REFLOGID = "";
        data = CashManual.newInstance(data);
        let { TLID, ROLECODE } = req.session.userinfo;
        rest.REFLOGID = REFLOGID;
        rest.ROLE = ROLECODE;
        rest.TLID = TLID;
        data = { ...data, ...rest };
        let obj = { model: data }
        processingserver.updatemodel(obj, async function (err, rs) {
            if (err)
                res.send('error')
            return res.send(rs);
        })
    },

    delete: (req, res) => {
        let rest = req.body;
        let data = {};
        data = CashManual.newInstance(data);
        let { TLID, ROLECODE } = req.session.userinfo;
        rest.TLID = TLID;
        rest.ROLE = ROLECODE;
        rest.REFLOGID = "";
        rest["DESC"] = rest["DESC"] ? rest["DESC"] : '';
        data = { ...data, ...rest };
        let obj = { model: data };
        processingserver.deletemodel(obj, async function (err, rs) {
            if (err)
                res.send('error')
            return res.send(rs);
        })
    },
    find: (req, res) => {

    }
};

