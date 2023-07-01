/**
 * TransactionsController
 *
 * @description :: Server-side logic for managing Transactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 * @author LongND 
 */
var processingserver = require('../commonwebuser/ProcessingServer');
var commonUtil = require('../common/CommonUtil');
var path = require('path')
var Ioutput = require(path.resolve(__dirname, '../common/OutputInterface.js'));
var RestfulHandler = require('../common/RestfulHandler');
var LogHelper = require(path.resolve(__dirname, '../common/LogHelper'));
const LOG_TAG = "TransactionsController.:";
AllTrans = [];
AllTransManage = [];

module.exports = {
    /**
     * @author LongND
     * @description Lấy dữ liệu giao dịch đổ vào Table 
     * @argument TLID 
     */
    get: function (req, res) {
        let { TLID, ROLECODE } = req.session.userinfo;

        let obj = {
            TLID,
            ROLE: ROLECODE,
            p_language: req.body.p_language
        }

        serviceTest.requsetPost(obj, 'Front/syncTransByTLID', function (err, rs) {
            if (err) {

                return res.send(Ioutput.errServer(err));
            }
            if (rs.EC == 0) {
                if (req.body.isSync)
                    return res.send(Ioutput.success({ data: [], numOfPages: 0 }));

                let length = rs.DT.length;

                var pagesize = parseInt(req.body.pagesize);
                var numOfPages = Math.ceil(length / pagesize);



                let datapage = length > pagesize ? rs.DT.slice(0, pagesize) : rs.DT
                rs.DT = {};
                rs.DT.data = datapage
                rs.DT.numOfPages = numOfPages

                return res.send(rs);
            }
            else {
                return res.send(rs);

            }
        })
    },
    approvesysprocess: function (req, res) {
        let { TLID, ROLECODE } = req.session.userinfo;
        let data = {
            p_tlid: TLID,
            p_role: ROLECODE,
            p_txnum: req.body.TXNUM,
            p_txdate: req.body.TXDATE,
            p_reflogid: TLID,
            MODELNAME: "sysprocess",
            p_language: req.body.language
        }
        data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }
        processingserver.approvemodel(obj, async function (err, rs) {
            // ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {
            //     if (err) {
            //         rs.EM = "Lỗi thực hiện trên redis"
            //         return res.send(rs)
            //     }
            //     if (errdefs)
            //         rs.EM = errdefs.ERRDESC

            //     return res.send(rs);
            // })
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, req.body.language);
                return res.send(rs);
            } catch (error) {
                rs.EM = "Lỗi client gọi api";
                rs.EC = -1000;
                return res.send(rs);
            }
        })
    },
    rejrectsysprocess: function (req, res) {
        let { TLID, ROLECODE } = req.session.userinfo;
        let data = {
            p_tlid: TLID,
            p_role: ROLECODE,
            p_txnum: req.body.TXNUM,
            p_txdate: req.body.TXDATE,
            p_reflogid: TLID,
            MODELNAME: "sysprocess",
            p_language: req.body.language
        }

        data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }
        processingserver.rejectmodel(obj, async function (err, rs) {
            // ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {
            //     if (err) {
            //         rs.EM = "Lỗi thực hiện trên redis"
            //         return res.send(rs)
            //     }
            //     if (errdefs)
            //         rs.EM = errdefs.ERRDESC

            //     return res.send(rs);
            // })
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, req.body.language);
                return res.send(rs);
            } catch (error) {
                rs.EM = "Lỗi client gọi api";
                rs.EC = -1000;
                return res.send(rs);
            }
        })
    },
    getAllTransactions: async function (TLID, key) {
        let trans = []
        //sails.log('==========AllTransManage:',AllTransManage)
        //sails.log('==========TELLERID:',TLID)
        if (sails.config.TLIDADMIN.indexOf(TLID) > -1) {
            if (key === 'ALL' || key === '')
                return AllTrans;
            else
                trans = await Paging.find(AllTrans, [
                    { id: "TRANS_KEYVALUE", value: key }
                ]);
        }
        else {
            let list = await Paging.find(AllTransManage, [{ id: "TELLERID", value: TLID }])
            if (list)
                if (list.length > 0)
                    trans = await Paging.findArrVal(AllTrans, "TRANS_KEYVALUE", list[0].TRANS_KEYVALUE)
            if (key !== 'ALL' && key !== '')
                trans = await Paging.find(trans, [{ id: "TRANS_KEYVALUE", value: key }])
        }
        return trans;
    },
    search: async (req, res) => {
        // var start = process.hrtime();
        // let begincount = LogHelper.getDuration(process.hrtime(start));
        // sails.log.info(LOG_TAG, "search.:Begin:Duration:", begincount, "body", req.body)
        // var userinfo = req.session.userinfo;
        // if (userinfo) {
        //     let { TLID, ROLECODE } = userinfo;


        //     var keySearch = Paging.generate_keySearch(req.body);
        //     let dataCount = { ...keySearch }
        //     Transactions.find({ PRIKEY: { 'like': "%:" + TLID + '.%' } })
        //         .where(dataCount)
        //         .sort('createdAt DESC')
        //         .exec(async function (err, tranlist) {
        //             let endcount = LogHelper.getDuration(process.hrtime(start));
        //             sails.log.info(LOG_TAG, "getlist.:Count:Duration:", endcount, "length", tranlist ? tranlist.length : 0, "body", req.body)
        //             if (err) return next(err);
        //             let pagesize = parseInt(req.body.pagesize);
        //             let numOfPages = Math.ceil((tranlist ? tranlist.length : 0) / pagesize);
        //             let page_number = req.body.page - 1;//base 0

        //             let response = tranlist.slice(page_number * pagesize, (page_number + 1) * pagesize);
        //             var DT = { data: response, numOfPages: numOfPages }
        //             let end = LogHelper.getDuration(process.hrtime(start));
        //             sails.log.info(LOG_TAG, "getlist.:User:Page:Duration:", end, "length", response ? response.length : 0, "body", req.body)
        //             return res.send(Ioutput.success(DT));
        //         });



        // }
        try {
            let result = [];
            //phan trang
            let { pagesize, page, keySearch, sortSearch } = req.body;
            let { TLID } = req.session.userinfo;

            //    keySearch.push({ id: 'TELLERID', value: TLID })
            result = await sails.controllers.transactions.getAllTransactions(TLID, 'ALL')
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
    /**
     * @author LongND
     * @description Duyệt giao dịch 
     * @argument res.body
     */
    approve: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            TLID,
            ROLE: ROLECODE,
            REFLOGID: ""
        }
        data = Transactions.newInstance(data);
        data = commonUtil.convertPropsNullToEmpty(data);
        data = { ...data, ...rest }
        let obj = { model: data }
        // console.log("obj transaction ====", JSON.stringify(obj))
        processingserver.approvemodel(obj, function (err, rs) {
            ErrDefs.findOne({ ERRNUM: res.EC }).exec((err, errdefs) => {
                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM = errdefs.ERRDESC
                // console.log("rs..", rs);
                return res.send(rs);
            })
        })
    },
    /**
     * @author: LongND
     * @description Từ chối giao dịch 
     * @argument res.body
     */
    reject: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            TLID,
            ROLE: ROLECODE,
            REFLOGID: ""
        }
        data = Transactions.newInstance(data);
        data = commonUtil.convertPropsNullToEmpty(data);
        data = { ...data, ...rest }
        let obj = { model: data }
        // console.log("obj transaction ====", JSON.stringify(obj))
        processingserver.rejectmodel(obj, function (err, rs) {
            ErrDefs.findOne({ ERRNUM: res.EC }).exec((err, errdefs) => {
                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM = errdefs.ERRDESC
                // console.log("rs..", rs);
                return res.send(rs);
            })
        })
    },
    /**
     * @description Huỷ giao dịch
     * @argument res.body
     */
    cancel: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            TLID,
            ROLE: ROLECODE,
            REFLOGID: ""
        }
        data = Transactions.newInstance(data);
        data = commonUtil.convertPropsNullToEmpty(data);
        data = { ...data, ...rest }
        let obj = { model: data }
        // console.log("obj transaction ====", JSON.stringify(obj))
        processingserver.deletemodel(obj, function (err, rs) {
            ErrDefs.findOne({ ERRNUM: res.EC }).exec((err, errdefs) => {
                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM = errdefs.ERRDESC
                // console.log("rs..", rs);
                return res.send(rs);
            })
        })
    },
    /**
     * @description Lay thong tin chi tiet cua giao dich
     * @argument res.body
     */
    getTransactionDetail: function (req, res) {
        try {
            let data = req.body;
            data = RestfulHandler.addSessionInfo(data, req);
            data.REFLOGID = '';
            //Need to remove
            data.TXDATE = "23/01/2018";
            data.ret = { dir: 3003, type: 2004 };
            let obj =
            {
                "funckey": "FOPKS_TX.PRC_GET_TRANSACT",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {
                if (err) {
                    sails.log.error(err);
                    return res.send(Ioutput.errServer(err));
                }
                if (rs.EC == 0) {
                    let DT = await ConvertData.convert_to_Object(rs.DT.ret);
                    return res.send(Ioutput.success(DT));
                } else {
                    return res.send(rs);
                }
            })
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },
};

