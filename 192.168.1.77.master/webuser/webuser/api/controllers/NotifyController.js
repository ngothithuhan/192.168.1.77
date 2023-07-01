var Ioutput = require('../common/OutputInterface.js');
var processingserver = require('../commonwebuser/ProcessingServer');
var ConvertData = require('../services/ConvertData');
var Queue = require('sync-queue')
var queueManage = {}
//var heapdump = require('heapdump');
function toNormalize(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace("Đ", "D")
}
async function syncTransManageByTXNUM(TXNUM, TXDATE, TLID) {
    return new Promise((resolve, reject) => {
        try {
            let obj =
            {
                "funckey": "prc_get_transbyuser",
                bindvar: {
                    'p_refcursor': { 'dir': 3003, 'type': 2004 },
                    'p_txdate': TXDATE,
                    'p_txnum': TXNUM,
                    'p_tlid': TLID
                }
            }
            processingserver.callAPI(obj, async function (err, result) {
                if (err) {
                    sails.log.error(err);
                    resolve(false);
                }
                if (result.EC === 0) {
                    result.DT = ConvertData.convert_to_Object(result.DT.p_refcursor);
                    if (TXNUM == 'ALL') {
                        if (TLID == 'ALL')
                            AllTransManage = result.DT
                        else {
                            AllTransManage = _.reject(AllTransManage, item => item.TELLERID == TLID)
                            result.DT.map(item => { AllTransManage.push(item) })
                        }

                    }
                    else {
                        let autoids = [];
                        autoids = result.DT.map(item => item.TELLERID)
                        AllTransManage = _.reject(AllTransManage, item => autoids.indexOf(item.TELLERID) > -1)
                        result.DT.map(item => { AllTransManage.push(item) })
                    }

                    resolve(true);
                }
                resolve(false);
            })
        } catch (error) {
            sails.log.error(error);
            resolve(false);
        }

    });
}
async function syncTransByTXNUM(TXNUM, TXDATE, TLID) {
    return new Promise((resolve, reject) => {
        try {
            let obj =
            {
                "funckey": "prc_getussearchbytxnum",
                bindvar: {
                    'p_refcursor': { 'dir': 3003, 'type': 2004 },
                    'p_txdate': TXDATE,
                    'p_txnum': TXNUM,
                    'p_tlid': TLID
                }
            }
            processingserver.callAPI(obj, async function (err, result) {
                if (err) {
                    sails.log.error(err);
                    resolve(false);
                }
                if (result.EC === 0) {
                    result.DT = ConvertData.convert_to_Object(result.DT.p_refcursor);
                    result.DT = result.DT.map(item => {
                        return {
                            ...item,
                            TXSTATUS_NL: toNormalize(item.TXSTATUS ? item.TXSTATUS.toString().toUpperCase() : ''),
                            TLTXCD_NL: toNormalize(item.TLTXCD ? item.TLTXCD.toString().toUpperCase() : ''),
                            CFFULLNAME_NL: toNormalize(item.CFFULLNAME ? item.CFFULLNAME.toString().toUpperCase() : ''),
                        }
                    })
                    if (TXNUM == 'ALL') {
                        AllTrans = result.DT
                    }
                    else {
                        let autoids = [];
                        autoids = result.DT.map(item => item.AUTOID)
                        AllTrans = _.reject(AllTrans, item => autoids.indexOf(item.AUTOID) > -1)
                        result.DT.map(item => { AllTrans.push(item) })
                    }

                    resolve(true);
                }
                resolve(false);
            })
        } catch (error) {
            sails.log.error(error);
            resolve(false);
        }

    });
}
async function syncAccountManageByCustodycd(CUSTODYCD, TLID) {
    sails.log('syncAccountManageByCustodycd')
    return new Promise((resolve, reject) => {
        try {
            let obj =
            {
                "funckey": "prc_get_accountbyuser",
                bindvar: {
                    'p_refcursor': { 'dir': 3003, 'type': 2004 },
                    'p_custodycd': CUSTODYCD,
                    'p_tlid': TLID,
                    'p_err_code': { 'dir': 3003, 'type': 2001 },
                    'p_err_param': { 'dir': 3003, 'type': 2001 }
                }
            }
            processingserver.callAPI(obj, async function (err, result) {
                if (err) {
                    sails.log.error(err);
                    resolve(false);
                }
                if (result.EC === 0) {
                    result.DT = ConvertData.convert_to_Object(result.DT.p_refcursor);
                    if (TLID == 'ALL') {
                        AllAccountsManage = result.DT
                        var userlogin = await Userinfo.find({ ISCUSTOMER: 'Y' });
                        var customerMap = {};
                        for (var item of userlogin) {
                            customerMap[item.USERID] = item;
                        }
                        for (var item of AllAccountsManage) {
                            if (customerMap[item.USERNAME] && item.ARRAY_CUSTODYCD.length > 1) {
                                customerMap[item.USERNAME].ISGROUPUSER = true;
                                await Userinfo.update({ USERNAME: item.USERNAME }, { ISGROUPUSER: true });
                            }
                        }
                    } else {
                        AllAccountsManage = _.reject(AllAccountsManage, item => item.TELLERID == TLID)
                        result.DT.map(item => { AllAccountsManage.push(item) })
                    }
                    resolve(true);
                }
                resolve(false);
            })
        } catch (error) {
            sails.log.error(error);
            resolve(false);
        }
    });
}
async function syncAccountByCustodycd(CUSTODYCD, CAREBY, TLID) {
    return new Promise((resolve, reject) => {
        try {
            let obj =
            {
                "funckey": "prc_get_accounts_by_custodycd",
                bindvar: {
                    'p_refcursor': { 'dir': 3003, 'type': 2004 },
                    'p_custodycd': CUSTODYCD,
                    'p_careby': CAREBY,
                    'p_tlid': TLID,
                    'p_err_code': { 'dir': 3003, 'type': 2001 },
                    'p_err_param': { 'dir': 3003, 'type': 2001 }
                }
            }
            processingserver.callAPI(obj, async function (err, result) {
                if (err) {
                    sails.log.error(err);
                    resolve(false);
                }
                if (result.EC === 0) {
                    result.DT = ConvertData.convert_to_Object(result.DT.p_refcursor);
                    result.DT = result.DT.map(item => {
                        return {
                            ...item,
                            FULLNAME_NL: toNormalize(item.FULLNAME ? item.FULLNAME.toString().toUpperCase() : ''),
                            IDPLACE_NL: toNormalize(item.IDPLACE ? item.IDPLACE.toString().toUpperCase() : ''),
                            ADDRESS_NL: toNormalize(item.ADDRESS ? item.ADDRESS.toString().toUpperCase() : ''),
                            CLASSCD_DESC_NL: toNormalize(item.CLASSCD_DESC ? item.CLASSCD_DESC.toString().toUpperCase() : ''),
                            CLASSSIPCD_DESC_NL: toNormalize(item.CLASSSIPCD_DESC ? item.CLASSSIPCD_DESC.toString().toUpperCase() : ''),
                            ACCTGRP_DESC_NL: toNormalize(item.ACCTGRP_DESC ? item.ACCTGRP_DESC.toString().toUpperCase() : ''),
                            CAREBY_DESC_NL: toNormalize(item.CAREBY_DESC ? item.CAREBY_DESC.toString().toUpperCase() : ''),
                            CFSTATUS_DESC_NL: toNormalize(item.CFSTATUS_DESC ? item.CFSTATUS_DESC.toString().toUpperCase() : ''),
                            VSDSTATUS_DESC_NL: toNormalize(item.VSDSTATUS_DESC ? item.VSDSTATUS_DESC.toString().toUpperCase() : ''),
                            ISCFLEAD_DESC_NL: toNormalize(item.ISCFLEAD_DESC ? item.ISCFLEAD_DESC.toString().toUpperCase() : ''),
                            CUST_FULLNAME: toNormalize(item.CUSTODYCD + '-' + item.FULLNAME ? (item.CUSTODYCD + '-' + item.FULLNAME).toString().toUpperCase() : ''),
                        }
                    })
                    if (CUSTODYCD == 'ALL') {
                        AllAccounts = result.DT
                        // if (TLID == 'ALL')
                        //     AllAccounts = result.DT
                        // else {
                        //     AllAccounts = _.reject(AllAccounts, item => item.TELLERID == TLID)
                        //     result.DT.map(item => { AllAccounts.push(item) })
                        // }

                    }
                    else {
                        AllAccounts = _.reject(AllAccounts, item => item.CUSTODYCD == CUSTODYCD)
                        result.DT.map(item => { AllAccounts.push(item) })
                    }

                    resolve(true);
                }
                resolve(false);
            })
        } catch (error) {
            sails.log.error(error);
            resolve(false);
        }
    });
}
async function syncOrderByOrderID(CUSTODYCD, TLID, ORDERID, EXECTYPE, SRTYPE) {
    return new Promise((resolve, reject) => {
        try {
            let obj =
            {
                'funckey': 'prc_get_orderdbookbyorderid',
                'bindvar': {
                    p_custodycd: CUSTODYCD,
                    p_tlid: TLID,
                    p_orderid: ORDERID,
                    p_exectype: EXECTYPE,
                    p_srtype: SRTYPE,
                    p_language: 'vie',
                    p_refcursor: { dir: 3003, type: 2004 },
                    p_err_code: { dir: 3003, type: 2001 },
                    p_err_param: { dir: 3003, type: 2001 }
                }
            }
            processingserver.callAPI(obj, async function (err, result) {
                if (err) {
                    sails.log.error(err);
                    resolve(false);
                }
                if (result.EC === 0) {
                    result.DT = ConvertData.convert_to_Object(result.DT.p_refcursor);
                    result.DT = result.DT.map(item => {
                        return {
                            ...item,
                            STATUS_DES_NL: toNormalize(item.STATUS_DES ? item.STATUS_DES.toString().toUpperCase() : ''),
                            EXECTYPE_DESC_NL: toNormalize(item.EXECTYPE_DESC ? item.EXECTYPE_DESC.toString().toUpperCase() : '')
                        }
                    })
                    if (ORDERID == 'ALL') {
                        if (TLID == sails.config.USERONL) {
                            AllOrders = _.reject(AllOrders, item => item.CUSTODYCD == CUSTODYCD)
                            result.DT.map(item => { AllOrders.push(item) })
                        }
                        else if (TLID == 'ALL') {
                            AllOrders = result.DT
                        }

                        else {
                            AllOrders = _.reject(AllOrders, item => item.TELLERID == TLID)
                            result.DT.map(item => { AllOrders.push(item) })
                        }

                    }
                    else {
                        AllOrders = _.reject(AllOrders, item => item.ORDERID == ORDERID)
                        result.DT.map(item => { AllOrders.push(item) })
                    }

                }
                resolve(false);
            })
        } catch (error) {
            sails.log.error(error);
            resolve(false);
        }
    });
}
async function syncSipsBySipID(SPID, TLID, CUSTODYCD) {
    return new Promise((resolve, reject) => {
        try {
            let obj =
            {
                'funckey': 'prc_get_sipsbysipid',
                'bindvar': {
                    p_sipid: SPID,
                    p_tlid: TLID,
                    p_refcursor: { dir: 3003, type: 2004 },
                    p_err_code: { dir: 3003, type: 2001 },
                    p_err_param: { dir: 3003, type: 2001 }
                }
            }
            processingserver.callAPI(obj, async function (err, result) {
                if (err) {
                    sails.log.error(err);
                    resolve(false);
                }
                if (result.EC === 0) {
                    result.DT = ConvertData.convert_to_Object(result.DT.p_refcursor);
                    result.DT = result.DT.map(item => {
                        return {
                            ...item,
                            STATUS_DESC_NL: toNormalize(item.STATUS_DESC ? item.STATUS_DESC.toString().toUpperCase() : ''),
                            DESC_EXECTYPE_NL: toNormalize(item.DESC_EXECTYPE ? item.DESC_EXECTYPE.toString().toUpperCase() : '')
                        }
                    })
                    if (SPID == 'ALL') {
                        if (TLID == sails.config.USERONL) {
                            AllSips = _.reject(AllSips, item => item.CUSTODYCD == CUSTODYCD)
                            result.DT.map(item => { AllSips.push(item) })
                        }
                        else if (TLID == 'ALL')
                            AllSips = result.DT
                        else {
                            AllSips = _.reject(AllSips, item => item.TELLERID == TLID)
                            result.DT.map(item => { AllSips.push(item) })
                        }
                    }
                    else {
                        AllSips = _.reject(AllSips, item => item.SPID == SPID)
                        result.DT.map(item => { AllSips.push(item) })
                    }

                }
                resolve(false);
            })
        } catch (error) {
            sails.log.error(error);
            resolve(false);
        }
    });
}
module.exports = {
    loadNormalOrders_Login: async function (CUSTODYCD, TLID, ORDERID, EXECTYPE, SRTYPE, ISBLAST) {
        try {
            await syncOrderByOrderID(CUSTODYCD, TLID, ORDERID, EXECTYPE, SRTYPE)
            if (ISBLAST)
                sails.sockets.blast('loadNormalOrders', CUSTODYCD);
        } catch (error) {
            sails.log.error(error);
        }
    },
    loadNormalOrders: async function (refid) {

        try {

            if (!refid) {
                sails.log.warn('syncOrderByOrderID refid null')
                return;
            }
            var queue = queueManage.AllOrdersQueue;
            if (!queue) {
                queue = new Queue();
                queueManage.AllOrdersQueue = queue;
            }
            queue.place(async function () {
                let arrData = refid.split('~#~');
                if (arrData.length > 0) {
                    let CUSTODYCD = arrData[0];
                    let TLID = arrData[1];
                    let ORDERID = arrData[2];
                    let EXECTYPE = arrData[3];
                    let SRTYPE = arrData[4];
                    await syncOrderByOrderID(CUSTODYCD, TLID, ORDERID, EXECTYPE, SRTYPE)
                    sails.sockets.blast('loadNormalOrders', CUSTODYCD);
                    sails.log.info('loadNormalOrders success', refid)
                    //return res.json(Ioutput.jsonAPIOutput(0, "loadNormalOrders success", null))
                }
                else
                    sails.log.war('loadNormalOrders unsuccess', refid)
                queue.next();
            });
        } catch (error) {
            sails.log.error(error);
        }
    },
    loadSips_Login: async function (CUSTODYCD, TLID, SPID, ISBLAST) {
        try {
            await syncSipsBySipID(SPID, TLID, CUSTODYCD)
            if (ISBLAST)
                sails.sockets.blast('loadSips', CUSTODYCD);
        } catch (error) {
            sails.log.error(error);
        }
    },
    loadSips: async function (refid) {
        try {
            if (!refid) {
                sails.log.warn('syncSipsBySipID refid null')
                return;
            }
            var queue = queueManage.AllSipsQueue;
            if (!queue) {
                queue = new Queue();
                queueManage.AllSipsQueue = queue;
            }
            queue.place(async function () {
                let arrData = refid.split('~#~');
                if (arrData.length > 0) {
                    let CUSTODYCD = arrData[0];
                    let TLID = arrData[1];
                    let SPID = arrData[2];
                    await syncSipsBySipID(SPID, TLID, CUSTODYCD)
                    sails.sockets.blast('loadSips', CUSTODYCD);
                    sails.log.info('loadSips success', refid)
                }
                else
                    sails.log.warn('loadSips unsuccess', refid)
                queue.next();
            });
        } catch (error) {
            sails.log.error(error);
        }
    },
    loadAccounts_Login: async function (CUSTODYCD, CAREBY, TLID, ISBLAST) {
        sails.log('loadAccounts_Login')
        try {
            await syncAccountByCustodycd(CUSTODYCD, CAREBY, TLID)
            await syncAccountManageByCustodycd(CUSTODYCD, TLID)
            if (ISBLAST)
                sails.sockets.blast('loadAccounts', CUSTODYCD);
        } catch (error) {
            sails.log.error(error);
        }
    },
    loadUser_Login:  async function (refid) {
        sails.log('loadUser_Login')
        try {            
            await syncAccountByCustodycd('ALL', 'ALL','ALL')
            await syncAccountManageByCustodycd('ALL', 'ALL')
        } catch (error) {
            sails.log.error(error);
        }
    },
    loadAccounts: async function (refid) {
        try {

            if (!refid) {
                sails.log.warn('syncAccountByCustodycd refid null')
                return;
            }
            var queue = queueManage.AllAccountsQueue;
            if (!queue) {
                queue = new Queue();
                queueManage.AllAccountsQueue = queue;
            }
            queue.place(async function () {
                let arrData = refid.split('~#~');
                if (arrData.length > 0) {
                    let CUSTODYCD = arrData[0];
                    let CAREBY = arrData[1];
                    let TLID = arrData[2];
                    await syncAccountByCustodycd(CUSTODYCD, CAREBY, TLID)
                    await syncAccountManageByCustodycd(CUSTODYCD, TLID)
                    sails.sockets.blast('loadAccounts', CUSTODYCD);
                    sails.log.info('loadAccounts success', refid)

                }
                else
                    sails.log.warn('loadAccounts unsuccess', refid)
                queue.next();
            });
        } catch (error) {
            sails.log.error(error);
        }
    },
    loadTrans_Login: async function (TXNUM, TXDATE, TLID, ISBLAST) {
        try {
            await syncTransByTXNUM(TXNUM, TXDATE, TLID)
            await syncTransManageByTXNUM(TXNUM, TXDATE, TLID)
            if (ISBLAST)
                sails.sockets.blast('loadTrans', TLID);
        } catch (error) {
            sails.log.error(error);
        }
    },
    loadTrans: async function (refid) {
        try {
            if (!refid) {
                sails.log.warn('syncTransByTXNUM refid null')
                return;
            }
            var queue = queueManage.AllTransQueue;
            if (!queue) {
                queue = new Queue();
                queueManage.AllTransQueue = queue;
            }
            queue.place(async function () {
                let arrData = refid.split('~#~');
                if (arrData.length > 0) {
                    let TLID = arrData[0];
                    let TXNUM = arrData[1];
                    let TXDATE = arrData[2];
                    await syncTransByTXNUM(TXNUM, TXDATE, TLID)
                    await syncTransManageByTXNUM(TXNUM, TXDATE, TLID)
                    sails.sockets.blast('loadTrans', TLID);
                    sails.log.info('loadTrans successfully', refid)
                }
                else
                    sails.log.warn('loadTrans unsuccessfully', refid)
                queue.next();
            });
        } catch (error) {
            sails.log.error(error);
        }
    },

    checkData: function (req, res) {
        let accManage = _.filter(AllAccountsManage, {USERNAME:req.session.userinfo.USERNAME});
        sails.log('accManage:',accManage.length)
        if (req.session.userinfo.TLID = '000001') {
            var name = req.body.name;
            if (name == 'AllTrans') return res.send(AllTrans);
            if (name == 'AllTransManage') return res.send(AllTransManage);
            if (name == 'AllAccountsManage') return res.send(AllAccountsManage);
            if (name == 'AllOrders') return res.send(AllOrders);
            if (name == 'AllSips') return res.send(AllSips);
        }
        return res.send('Not found');

    }

}