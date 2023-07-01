/**
 * SrreconcileController
 *
 * @description :: Server-side logic for managing Srreconciles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var RestfulHandler = require('../common/RestfulHandler')
var processingserver = require('../commonwebuser/ProcessingServer')
var path = require('path')


var Ioutput = require(path.resolve(__dirname, '../common/OutputInterface.js'));
var LogHelper = require(path.resolve(__dirname, '../common/LogHelper'));
const LOG_TAG = "SrreconcileController.:";
AllSips = [];

module.exports = {
    getAllSips: async function (TLID, filterVal) {
        let sips = [];
        if (TLID == sails.config.USERONL)
            sips = await Paging.find(AllSips, [
                { id: "CFUSERNAME", value: filterVal }
            ]);
        else if (sails.config.TLIDADMIN.indexOf(TLID) > -1) {
            if (filterVal === 'ALL' || filterVal === '')
                return AllSips;
            else
                sips = await Paging.find(AllSips, [
                    { id: "CUSTODYCD", value: filterVal }
                ]);
        }
        else {
            let list = await Paging.find(AllAccountsManage, [{ id: "TELLERID", value: TLID }])
            if (list)
                if (list.length > 0)
                    sips = await Paging.findArrVal(AllSips, "CUSTODYCD", list[0].ARRAY_CUSTODYCD)
            if (filterVal !== 'ALL' && filterVal !== '')
                sips = await Paging.find(sips, [{ id: "CUSTODYCD", value: filterVal }])
        }
        return sips;
    },
    getListSrreconcileDetail: async function (req, res) {
        // try {
        //     var start = process.hrtime();
        //     let begincount = LogHelper.getDuration(process.hrtime(start));
        //     sails.log.info(LOG_TAG, "getlist.:Begin:Duration:", begincount, "body", req.body);
        //     let { TLID, USERID, ISCUSTOMER } = req.session.userinfo;
        //     var keySearch = Paging.generate_keySearch(req.body);
        //     let dataCount = { ...keySearch }
        //     if (ISCUSTOMER == 'Y') {
        //         dataCount.where.TELLERID = TLID;

        //         Orders.find({ PRIKEY: { 'like': "%:" + USERID + '.%' } })
        //             .where(dataCount)
        //             .sort('createdAt DESC')
        //             .exec(async function (err, orderlist) {
        //                 let endcount = LogHelper.getDuration(process.hrtime(start));
        //                 sails.log.info(LOG_TAG, "getlist.:Count:Duration:", endcount, "length", orderlist ? orderlist.length : 0, "body", req.body)
        //                 if (err) return next(err);
        //                 let pagesize = parseInt(req.body.pagesize);
        //                 let numOfPages = Math.ceil((orderlist ? orderlist.length : 0) / pagesize);
        //                 let page_number = req.body.page - 1;//base 0

        //                 let response = orderlist.slice(page_number * pagesize, (page_number + 1) * pagesize);
        //                 var DT = { data: response, numOfPages: numOfPages }
        //                 let end = LogHelper.getDuration(process.hrtime(start));
        //                 sails.log.info(LOG_TAG, "getlist.:User:Page:Duration:", end, "length", response ? response.length : 0, "body", req.body)
        //                 return res.send(Ioutput.success(DT));
        //             });
        //     }
        //     else {
        //         Orders.find({ PRIKEY: { 'like': "%:" + TLID + '.%' } })
        //             .where(dataCount)
        //             .sort('createdAt DESC')
        //             .exec(async function (err, orderlist) {
        //                 let endcount = LogHelper.getDuration(process.hrtime(start));
        //                 sails.log.info(LOG_TAG, "getlist.:Count:Duration:", endcount, "length", orderlist ? orderlist.length : 0, "body", req.body)
        //                 if (err) return next(err);
        //                 let pagesize = parseInt(req.body.pagesize);
        //                 let numOfPages = Math.ceil((orderlist ? orderlist.length : 0) / pagesize);
        //                 let page_number = req.body.page - 1;//base 0

        //                 let response = orderlist.slice(page_number * pagesize, (page_number + 1) * pagesize);
        //                 var DT = { data: response, numOfPages: numOfPages }
        //                 let end = LogHelper.getDuration(process.hrtime(start));
        //                 sails.log.info(LOG_TAG, "getlist.:User:Page:Duration:", end, "length", response ? response.length : 0, "body", req.body)
        //                 return res.send(Ioutput.success(DT));
        //             });
        //     }
 
        // } catch (error) {
        //     sails.log.error(error);
        //     return res.send(Ioutput.errServer(error));
        // }
        try {
            let result = [];

            //phan trang
            let { pagesize, page, keySearch, sortSearch } = req.body;
            let { TLID, USERID, ISCUSTOMER } = req.session.userinfo;
            // keySearch.push({ id: 'TELLERID', value: TLID })
            // if (ISCUSTOMER == 'Y')
            //     keySearch.push({ id: 'CUSTODYCD', value: USERID })
            result = await sails.controllers.account.getAllOrders(TLID, ISCUSTOMER == 'Y' ? USERID : 'ALL')
            if (keySearch)
                if (keySearch.length > 0)
                    result = await Paging.find(result, keySearch)
            let numOfPages = Math.ceil(result.length / pagesize);

            if (sortSearch) {
                if (sortSearch.length > 0)
                    result = await Paging.orderby(result, sortSearch)
                else
                    result = await Paging.orderby(result, [{ id: 'TXDATE', desc: true }, { id: 'CREATEDT', desc: true }])
            }
            else
                result = await Paging.orderby(result, [{ id: 'TXDATE', desc: true }, { id: 'CREATEDT', desc: true }])
            result = await Paging.paginate(result, pagesize, page ? page : 1)
            var DT = { data: result, numOfPages: numOfPages }


            return res.send(Ioutput.success(DT));
        } catch (error) {
            let rs = {}
            rs.EM = 'Lỗi client gọi api';
            rs.EC = -1000;
            return res.send(rs)
        }
    },
    getListSrreconcile: async function (req, res) {
        // var start = process.hrtime();
        // let begincount = LogHelper.getDuration(process.hrtime(start));
        // sails.log.info(LOG_TAG, "getListSrreconcile.:Begin:Duration:", begincount, "body", req.body);
        // if (req.session.userinfo) {
        //     let { TLID, USERID, ISCUSTOMER } = req.session.userinfo;

        //     let self = this;
        //     var keySearch = Paging.generate_keySearch(req.body);
        //     let dataCount = { ...keySearch }
        //     if (ISCUSTOMER == 'Y') {
        //         dataCount.where.TELLERID=TLID;
        //         Sips.find({ PRIKEY: { 'like': "%:" + USERID + '.%' } })
        //             .where(dataCount)
        //             .sort('createdAt DESC')
        //             .exec(async function (err, orderlist) {
        //                 let endcount = LogHelper.getDuration(process.hrtime(start));
        //                 sails.log.info(LOG_TAG, "getListSrreconcile.:Count:Duration:", endcount, "length", orderlist ? orderlist.length : 0, "body", req.body)
        //                 if (err) return next(err);
        //                 let pagesize = parseInt(req.body.pagesize);
        //                 let numOfPages = Math.ceil((orderlist ? orderlist.length : 0) / pagesize);
        //                 let page_number = req.body.page - 1;//base 0

        //                 let response = orderlist.slice(page_number * pagesize, (page_number + 1) * pagesize);
        //                 var DT = { data: response, numOfPages: numOfPages }
        //                 let end = LogHelper.getDuration(process.hrtime(start));
        //                 sails.log.info(LOG_TAG, "getListSrreconcile.:User:Page:Duration:", end, "length", response ? response.length : 0, "body", req.body)
        //                 return res.send(Ioutput.success(DT));
        //             });
        //     }
        //     else {
        //         Sips.find({ PRIKEY: { 'like': "%:" + TLID + '.%' } })
        //             .where(dataCount)
        //             .sort('createdAt DESC')
        //             .exec(async function (err, orderlist) {
        //                 let endcount = LogHelper.getDuration(process.hrtime(start));
        //                 sails.log.info(LOG_TAG, "getListSrreconcile.:Count:Duration:", endcount, "length", orderlist ? orderlist.length : 0, "body", req.body)
        //                 if (err) return next(err);
        //                 let pagesize = parseInt(req.body.pagesize);
        //                 let numOfPages = Math.ceil((orderlist ? orderlist.length : 0) / pagesize);
        //                 let page_number = req.body.page - 1;//base 0

        //                 let response = orderlist.slice(page_number * pagesize, (page_number + 1) * pagesize);
        //                 var DT = { data: response, numOfPages: numOfPages }
        //                 let end = LogHelper.getDuration(process.hrtime(start));
        //                 sails.log.info(LOG_TAG, "getListSrreconcile.:User:Page:Duration:", end, "length", response ? response.length : 0, "body", req.body)
        //                 return res.send(Ioutput.success(DT));
        //             });
        //     }
        // }
        try {
            let result = [];
            let sum = 0
            //phan trang
            let { pagesize, page, keySearch, sortSearch } = req.body;
            let { TLID, USERNAME, ISCUSTOMER } = req.session.userinfo;
            result = await this.getAllSips(TLID, ISCUSTOMER == 'Y' ? USERNAME : 'ALL')

            if (keySearch)
                if (keySearch.length > 0)
                    result = await Paging.find(result, keySearch)
            let numOfPages = Math.ceil(result.length / pagesize);
            sum = result.length
            //sails.log('result :',result)
            sails.log('sum result :',sum)
            if (sortSearch) {
                if (sortSearch.length > 0)
                    result = await Paging.orderby(result, sortSearch)
                else
                    result = await Paging.orderby(result, [{ id: 'TXDATE', desc: true }, { id: 'CREATEDT', desc: true }])
            }
            else
                result = await Paging.orderby(result, [{ id: 'TXDATE', desc: true }, { id: 'CREATEDT', desc: true }])
            result = await Paging.paginate(result, pagesize, page ? page : 1)
            var DT = { data: result, numOfPages: numOfPages, sumRecord: sum }


            return res.send(Ioutput.success(DT));
        } catch (error) {
            let rs = {}
            rs.EM = 'Lỗi client gọi api';
            rs.EC = -1000;
            return res.send(rs)
        }
    },
    control_adjustment: function (req, res) {
        try {
            let rest = req.body;
            let data = {}
            data = CashManual.newInstance(data);
            data = RestfulHandler.addSessionInfo(data, req);
            data = { ...data, ...rest };
            let obj = { model: data }

            processingserver.updatemodel(obj, async function (err, rs) {
                if (rs.EC == 0) {

                    return res.send(Ioutput.success(rs));
                }

            })
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },
    get_detail_transid: function (req, res) {
        try {
            let data = {};
            data.ret = { dir: 3003, type: 2004 }
            data = RestfulHandler.addSessionInfo(data, req);
            data.TRANSID = req.body.TRANSID
            data.REFLOGID = '';
            let obj =
            {
                "funckey": "FOPKS_IV.PRC_GET_IVMAP",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {
                if (rs.EC == 0) {
                    let DT = await ConvertData.convert_to_Object(rs.DT.ret);
                    return res.send(Ioutput.success(DT[0]));
                }

            })
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },
    fetchRedisData: function (req, res) {

    },
    getWaitOrders: function (req, res) {
        try {
            let data = req.body;
            data.ret = { dir: 3003, type: 2004 }
            data = RestfulHandler.addSessionInfo(data, req);
            // data.CUSTODYCD = '009C333333';
            // data.TLID = '0002';
            // data.ROLE = 'DXX';
            // data.REFLOGID = '';
            let obj =
            {
                "funckey": "FOPKS_SR.PRC_GET_ORDER2MAP",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {
                if (rs.EC == 0) {
                    rs.DT = await ConvertData.convert_to_Object(rs.DT.ret);
                    return res.send(rs);
                } else {
                    return res.send(rs);
                }
            });
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },
    mapCashOrder: function (req, res) {
        try {
            let data = req.body;
            data.ret = { dir: 3003, type: 2004 }
            data = RestfulHandler.addSessionInfo(data, req);
            let obj =
            {
                "funckey": "FOPKS_IV.PRC_MAP_CASH_ORDER",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {
                if (rs.EC == 0) {
                    rs.DT = await ConvertData.convert_to_Object(rs.DT.ret);
                    return res.send(rs);
                } else {
                    return res.send(rs);
                }
            });
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },

    // giang.ngo: api xac nhan doi chieu, truyen vao tradingid(lay trong api getTradingSession) va desc

    confirmSrreconcile: function (req, res) {
        try {
            let data = req.body;
            data.ret = { dir: 3003, type: 2004 }
            data = RestfulHandler.addSessionInfo(data, req);
            let obj =
            {
                "funckey": "FOPKS_SR.PRC_CONFIRM_RECONCILE",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {
                return res.send(rs);
            });
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },

    //giang.ngo: lay danh sach tat ca cac phien
    getTradingSession: function (req, res) {
        try {
            let data = req.body;
            data.ret = { dir: 3003, type: 2004 }
            data = RestfulHandler.addSessionInfo(data, req);
            let obj =
            {
                "funckey": "FOPKS_SR.PRC_GET_TRADINGSESSION",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {
                if (rs.EC == 0) {
                    rs.DT = await ConvertData.convert_to_Object(rs.DT.ret);
                    return res.send(rs);
                } else {
                    return res.send(rs);
                }
            });
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },
    //uy nhiem chi
    getListPrintso: async function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_orderid: "ALL",
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language
        }
        //console.log("-----get prcListPrintso -------", rest)
        let obj =
        {
            "funckey": "prc_get_printso",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                // console.log(".....", rs)

                if (rs.EC == 0) {

                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    let pv_sumRecord = result.length;
                    //phan trang
                    let { pagesize, page, keySearch, sortSearch } = req.body;



                    if (keySearch)
                        if (keySearch.length > 0)
                            result = await Paging.find(result, keySearch)

                    let numOfPages = Math.ceil(result.length / pagesize);

                    if (sortSearch)
                        if (sortSearch.length > 0)
                            result = await Paging.orderby(result, sortSearch)
                    result = await Paging.paginate(result, pagesize, page ? page : 1)
                    delete rs.DT["p_refcursor"];
                    var DT = { data: result, numOfPages: numOfPages, sumRecord: pv_sumRecord }


                    return res.send(Ioutput.success(DT));

                } else {
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getlistorderdbookbysipid: async function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_sipid: data.sipid,
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language
        }
        let obj =
        {
            "funckey": "prc_get_orderdbook_bysipid",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                // console.log(".....", rs)
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    let pv_sumRecord = result.length;
                    //phan trang
                    let { pagesize, page, keySearch, sortSearch } = req.body
                    if (keySearch)
                        if (keySearch.length > 0)
                            result = await Paging.find(result, keySearch)

                    let numOfPages = Math.ceil(result.length / pagesize);
                    // search theo tung cot
                    if (sortSearch)
                        if (sortSearch.length > 0)
                            result = await Paging.orderby(result, sortSearch)
                    result = await Paging.paginate(result, pagesize, page ? page : 1)
                    delete rs.DT["p_refcursor"];
                    var DT = { data: result, numOfPages: numOfPages, sumRecord: pv_sumRecord }
                    return res.send(Ioutput.success(DT));
                } else {
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    fetchListReconcile: async function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            p_srtype: data.srtype,
            p_tradingdate: data.tradingdate,
            p_dbcode: data.dbcode,
            p_codeid: data.codeid,
        }
        //console.log("-----get prcListPrintso -------", rest)
        let obj =
        {
            "funckey": "prc_get_srreconcile",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                // console.log(".....", rs)

                if (rs.EC == 0) {

                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    var i;
                    var tmp = [];
                    var dataAll = [];
                    for (i = 0; i < result.length; i++) {
                        if ((parseInt(result[i].ORDAMT) != "0" && parseInt(result[i].AMOUNT) != "0") || (parseInt(result[i].ORDAMT) != "0" && parseInt(result[i].AMOUNT) == "0") || (parseInt(result[i].ORDAMT) == "0" && parseInt(result[i].AMOUNT) != "0")) {
                            tmp.push(result[i])
                        }
                    }
                    result = tmp;
                    dataAll = result;
                    let pv_sumRecord = result.length;
                    //phan trang
                    let { pagesize, page, keySearch, sortSearch } = req.body;



                    if (keySearch)
                        if (keySearch.length > 0)
                            result = await Paging.find(result, keySearch)

                    let numOfPages = Math.ceil(result.length / pagesize);

                    if (sortSearch)
                        if (sortSearch.length > 0)
                            result = await Paging.orderby(result, sortSearch)
                    result = await Paging.paginate(result, pagesize, page ? page : 1)

                    delete rs.DT["p_refcursor"];
                    var DT = { data: result, numOfPages: numOfPages, sumRecord: pv_sumRecord, dataAll : dataAll }


                    return res.send(Ioutput.success(DT));

                } else {
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
};

