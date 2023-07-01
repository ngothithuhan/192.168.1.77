/**
 * CashStatementController
 *
 * @description :: Server-side logic for managing Cashstatements
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 * goi cac api lien quan den bang ke tien
 */

var processingserver = require('../commonwebuser/ProcessingServer');
var RestfulHandler = require('../common/RestfulHandler');
var Ioutput = require('../common/OutputInterface.js');
var commonUtil = require('../common/CommonUtil');
var LogHelper = require('../common/LogHelper');


module.exports = {
    getState4Bank: function (req, res) {
        try {
            sails.log.info(LogHelper.Add('CashStatement.getState4Bank start', req.body));
            var data = {};
            let body = req.body;
            data = RestfulHandler.addSessionInfo(data, req);
            data.ret = { dir: 3003, type: 2004 };
            data.TYPES = '';
            data.STATUS = ''
            data.SESSIONNO = '';
            data.CODEID = '';
            data = { ...data, ...body };
            let obj =
            {
                "funckey": "FOPKS_IV.PRC_GET_STATE4BANK",
                bindvar: data
            }
            sails.log.info("getState4Bank...", obj);
            processingserver.callAPI(obj, async function (err, rs) {
                if (err) {
                    sails.log.error(err);
                    return res.send(Ioutput.errServer(err));
                }
                if (rs.EC == 0) {
                    rs.DT = ConvertData.convert_to_Object(rs.DT.ret);
                    await CashStt.destroy({ DBCODE: data.DBCODE });
                    var CashSttArr = [];
                    for (var item of rs.DT) {
                        item.DBCODE = data.DBCODE;
                        CashSttArr.push(item);
                    }
                    await CashStt.create(CashSttArr);
                    var length = await CashStt.count()
                        .where(data.STATUS ? { STATUS: data.STATUS } : {})
                        .where(data.SESSIONNO ? { SESSIONNO: data.SESSIONNO } : {})
                        .where(data.CODEID ? { CODEID: data.CODEID } : {})
                        .where(data.TYPES ? { TYPES: data.TYPES } : {})
                        .where(data.DBCODE ? { DBCODE: data.DBCODE } : {})
                    // .where(data.MBCODE ? { MBCODE: data.MBCODE } : {});
                    var pagesize = parseInt(req.body.pagesize);
                    var numOfPages = Math.ceil(length / pagesize);
                    CashStt.find()
                        .where(data.STATUS ? { STATUS: data.STATUS } : {})
                        .where(data.SESSIONNO ? { SESSIONNO: data.SESSIONNO } : {})
                        .where(data.CODEID ? { CODEID: data.CODEID } : {})
                        .where(data.TYPES ? { TYPES: data.TYPES } : {})
                        .where(data.DBCODE ? { DBCODE: data.DBCODE } : {})
                        // .where(data.MBCODE ? { MBCODE: data.MBCODE } : {})
                        .paginate({ limit: pagesize, page: 1 })
                        .exec(async function (err, response) {
                            var DT = { data: response, numOfPages: numOfPages }
                            return res.send(Ioutput.success(DT));
                        });
                } else {
                    return res.send(rs);
                }
            });

        } catch (error) {
            sails.log.error(error);
            return res.send(error);
        }
    },
    fetchState4Bank: function (req, res) {
        var LOG_STR = LogHelper.Add('CashStatement.fetchState4Bank start', req.body.CODEID, req.body.TYPES, req.body.SESSIONNO, req.body.STATUS, req.body.filtered);
        try {
            sails.log.info(LOG_STR);
            let DBCODE = req.session.userinfo.DBCODE;
            let self = this;
            var keySearch = Paging.generate_keySearch(req.body);
            // let dataCount = { ...keySearch }
            // chèn thêm điều kiện find dữ liệu theo trường orderid
            // dataCount.where.DBCODE = DBCODE          
            let data = req.body;
            CashStt
                // .where(data.STATUS ? { STATUS: data.STATUS } : {})
                // .where(data.SESSIONNO ? { SESSIONNO: data.SESSIONNO } : {})
                // .where(data.CODEID ? { CODEID: data.CODEID } : {})
                // .where(data.TYPES ? { TYPES: data.TYPES } : {})
                .count(keySearch)
                .where(DBCODE ? { DBCODE: DBCODE } : {})
                .exec(function (err, length) {
                    if (err) return next(err);
                    sails.log.info(LOG_STR, "Found", length);
                    var pagesize = parseInt(req.body.pagesize);
                    var numOfPages = Math.ceil(length / pagesize);
                    CashStt.find(keySearch)
                        .where({ DBCODE: DBCODE })
                        .paginate({ limit: pagesize, page: req.body.page })
                        .exec(async function (err, response) {
                            var DT = { data: response, numOfPages: numOfPages }
                            return res.send(Ioutput.success(DT));
                        });
                });

        } catch (error) {
            sails.log.error(LOG_STR, error);
            return res.send(error);
        }
    },

    getState4BankDtl: function (req, res) {
        try {
            sails.log.info(LogHelper.Add('CashStatement.getState4BankDtl start', req.body));
            var data = {};
            let body = req.body;
            data = RestfulHandler.addSessionInfo(data, req);
            data.ret = { dir: 3003, type: 2004 };
            data = { ...data, ...body };
            let obj =
            {
                "funckey": "FOPKS_IV.PRC_GET_STATE4BANKDTL",
                bindvar: data
            }
            sails.log.info("getState4BankDtl...", obj);
            processingserver.callAPI(obj, async function (err, rs) {
                if (err) {
                    sails.log.error(err);
                    return res.send(Ioutput.errServer(err));
                }
                if (rs.EC == 0) {
                    rs.DT = ConvertData.convert_to_Object(rs.DT.ret);
                    var statusdescs = await Allcode.find({ CDTYPE: 'IV', CDNAME: 'STATUSBANK' });
                    var arr = [];
                    for (var item of rs.DT) {
                        let STATUS_DESC = ''
                        let stt = statusdescs.filter(statusdesc => statusdesc.CDVAL == item.STATUS)
                        if (stt.length > 0) {
                            STATUS_DESC = stt[0].CDCONTENT;
                        }
                        var newitem = { ...item, STATUS_DESC }
                        arr.push(newitem);
                    }
                    rs.DT = arr;
                    return res.send(rs);

                    // await CashSttDtl.destroy({ REFID: data.REFID });
                    // var statusdescs = await Allcode.find({ CDTYPE: 'IV', CDNAME: 'STATUSBANK' });
                    // var arr = [];
                    // for(var item of rs.DT) {
                    //     let STATUS_DESC = ''
                    //         let stt = statusdescs.filter(statusdesc => statusdesc.CDVAL == item.STATUS)
                    //         if (stt.length > 0) {
                    //             STATUS_DESC = stt[0].CDCONTENT;
                    //         }
                    //         var newitem = { ...item, STATUS_DESC }
                    //         arr.push(newitem);
                    // }                
                    // await CashSttDtl.create(arr);

                    // var length = await CashStt.count({ REFID: data.REFID });
                    // var pagesize = parseInt(req.body.pagesize);
                    // var numOfPages = Math.ceil(length / pagesize);
                    // CashSttDtl.find({ REFID: data.REFID })
                    //     .paginate({ limit: pagesize, page: 1 })
                    //     .exec(async function (err, response) {
                    //         var DT = { data: response, numOfPages: numOfPages }
                    //         return res.send(Ioutput.success(DT));
                    //     });
                } else {
                    return res.send(rs);
                }
            });

        } catch (error) {
            sails.log.error(error);
        }
    },
    fetchState4BankDtl: function (req, res) {
        try {
            sails.log.info(LogHelper.Add('CashStatement.fetchState4BankDtl start', req.body));
            let self = this;
            var keySearch = Paging.generate_keySearch(req.body);
            let dataCount = { ...keySearch }
            // chèn thêm điều kiện find dữ liệu theo trường orderid
            dataCount.where.REFID = req.body.REFID
            CashSttDtl
                .count(dataCount)
                .exec
                (function (err, length) {
                    if (err) return next(err);
                    var pagesize = parseInt(req.body.pagesize);
                    var numOfPages = Math.ceil(length / pagesize);
                    CashSttDtl.find(keySearch)
                        .where({ REFID: req.body.REFID })
                        .paginate({ limit: pagesize, page: req.body.page })
                        .exec(async function (err, response) {
                            var DT = { data: response, numOfPages: numOfPages }
                            return res.send(Ioutput.success(DT));
                        });
                });

        } catch (error) {
            sails.log.error(error);
            return res.send(error);
        }
    },
    confirmStateBank: function (req, res) {
        try {
            sails.log.info(LogHelper.Add('CashStatement.confirmStateBank start', req.body));
            var data = {};
            let body = req.body;
            data = RestfulHandler.addSessionInfo(data, req);
            data.SESSIONNO = '';
            data.DESC = '';
            data.STRID = '';
            data = { ...data, ...body };
            let obj =
            {
                "funckey": "FOPKS_IV.PRC_CONFIRM_STATE",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {
                if (err) {
                    sails.log.error(err);
                    return res.send(Ioutput.errServer(err));
                }
                if (rs.EC == 0) {
                    return res.send(rs);
                } else {
                    return res.send(rs);
                }
            });

        } catch (error) {
            sails.log.error(error);
            return res.send(error);
        }
    },
    getFundBankAccount: function (req, res) {
        try {
            let data = {};
            data = RestfulHandler.addSessionInfo(data, req);
            data.GROUPID = req.session.userinfo.GROUPID;
            data.ret = { dir: 3003, type: 2004 };
            console.log("...", JSON.stringify(data));
            let obj = {
                "funckey": "FOPKS_SA.PRC_FUND_MEMBERS",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {
                if (err) {
                    sails.log.error(err);
                    return res.send([]);
                }
                if (rs.EC == 0) {
                    var response = ConvertData.convert_to_Object(rs.DT.ret);
                    var result = response.map((item) => {
                        return {
                            ...item,
                            value: item.CODEID,
                            label: item.SYMBOL,
                            name: item.NAME,
                        }
                    })
                    res.send(result);
                }
                res.send([]);
            });
        } catch (error) {
            sails.log.error(error);
            return res.send([]);
        }
    }
};

