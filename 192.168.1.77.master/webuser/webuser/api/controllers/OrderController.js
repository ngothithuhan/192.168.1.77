



/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var path = require('path')
var processingserver = require('../commonwebuser/ProcessingServer')
var commonUtil = require('../common/CommonUtil');
var RestfulHandler = require('../common/RestfulHandler')
var Ioutput = require('../common/OutputInterface.js');
const macaddress = require('macaddress');

// var lodash = require('lodash')
var LogHelper = require(path.resolve(__dirname, '../common/LogHelper'));
const LOG_TAG = "OrderController.:";
// var AllcodeController = require('../controllers/AllcodeController')
AllOrders = [];

async function convert_to_groupRow(ret) {
    return new Promise((resolve) => {
        var arr = [];
        let CUSTODYCD = '';
        let rowParent = {};
        let count = 1;
        for (var data of ret.rows) {
            var col = ret.col; var obj = {};

            for (var index in col) {

                rowParent[col[index]] = data[index]

                if (col[index] == "CUSTODYCD") {

                    if (CUSTODYCD != data[index]) {
                        count = 1
                        CUSTODYCD = data[index]
                    }
                    // else{

                    // }
                }

                obj[col[index]] = data[index];
            }
            if (count == 1) {
                //console.log('add rowparent')
                rowParent["isParent"] = true;
                arr.push(rowParent)
            }
            arr.push(obj);
            count++
        }
        resolve(arr);


    })
}

module.exports = {
    getAllOrders: async function (TLID, filterVal) {
        let orders = [];
        if (TLID == sails.config.USERONL) {
            orders = await Paging.find(AllOrders, [
                { id: "CFUSERNAME", value: filterVal }
            ]);
        }
        else if (sails.config.TLIDADMIN.indexOf(TLID) > -1) {
            if (filterVal === 'ALL' || filterVal === '')
                return AllOrders;
            else
                orders = await Paging.find(AllOrders, [
                    { id: "CUSTODYCD", value: filterVal }
                ]);
        }
        else {
            let list = await Paging.find(AllAccountsManage, [{ id: "TELLERID", value: TLID }])
            if (list)
                if (list.length > 0)
                    orders = await Paging.findArrVal(AllOrders, "CUSTODYCD", list[0].ARRAY_CUSTODYCD)
            if (filterVal !== 'ALL' && filterVal !== '')
                orders = await Paging.find(orders, [{ id: "CUSTODYCD", value: filterVal }])
        }
        return orders;
    },
    //lay CMND
    getidcodeimg: async function (req, res) {
        let data = req.body;
        let { TLID, USERID } = req.session.userinfo;
        let rest = {
            p_custid: data.CUSTODYCD,
            p_tlid: TLID,
            p_userid: USERID
        }

        let obj =
        {
            "funckey": "prc_get_idcodeimg_by_custid",
            bindvar: rest
        }
        processingserver.callAPI(obj, function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {

                    return res.send(rs);
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
    /*dat lenh sip*/
    placesip: function (req, res) {
        try {
            let datainput = req.body;
            let { TLID, ROLECODE } = req.session.userinfo;
            let { ACTION } = datainput
            switch (ACTION) {
                case 'C':
                    ACTION = 'C'
                    break;
                case 'U':
                    ACTION = 'U'
                    break;
                case 'D':
                    ACTION = 'R'
                    break;
                default:
                    ACTION = 'C'
                    break;
            }
            let data = {
                p_action: ACTION,
                p_orderid: datainput.ORDERID,
                p_orgorderid: datainput.ORGORDERID,
                p_custodycd: datainput.CUSTODYCD,
                p_codeid: datainput.CODEID,
                p_fosrtype: datainput.SRTYPE,
                p_amount: datainput.AMOUNT,
                p_swcodeid: datainput.SWCODEID ? datainput.SWCODEID : '',
                p_swid: '',
                p_tlid: TLID,
                p_role: ROLECODE,
                pv_objname: datainput.OBJNAME,
                p_reflogid: '',
                p_ischkotp: datainput.OBJNAME == 'PLACEORDERSIPEX' ? 'N' : 'Y',
                p_otpval: datainput.OTP,
                p_spcode: datainput.SPCODE,
                p_tradingcycleid: datainput.TRADINGCYCLE,

            }
            let obj =
            {
                "funckey": "prc_placesip",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {

                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, datainput.language);
                return res.send(rs);

            });

        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }

    },
    preplacesip: async function (req, res) {
        try {
            let datainput = req.body
            let { TLID, ROLECODE, USERID } = req.session.userinfo;
            let macAddress = await macaddress.one();
            //lay action
            let { ACTION } = datainput
            switch (ACTION) {
                case 'C':
                    ACTION = 'C'
                    break;
                case 'U':
                    ACTION = 'U'
                    break;
                case 'D':
                    ACTION = 'R'
                    break;
                default:
                    ACTION = 'C'
                    break;
            }
            let data = {
                p_action: ACTION,
                p_orderid: { dir: 3003, type: 2001 },
                p_orgorderid: datainput.ORGORDERID,
                p_custodycd: datainput.CUSTODYCD,
                p_codeid: datainput.CODEID,
                p_spcode: datainput.SPCODE,
                p_tradingcycleid: datainput.TRADINGCYCLE,
                p_fosrtype: datainput.SRTYPE,
                p_amount: datainput.AMOUNT,
                p_swcodeid: datainput.SWCODEID ? datainput.SWCODEID : '',
                p_swid: '',
                p_saletype: datainput.SALETYPE,
                p_saleid: datainput.SALEID,
                p_tlid: TLID,
                p_role: ROLECODE,
                p_userid: USERID,
                pv_objname: datainput.OBJNAME,
                p_reflogid: '',
                p_img: datainput.SIGN_IMG ? datainput.SIGN_IMG : '',
                p_imgdesc: datainput.SIGN_IMG_DESC ? datainput.SIGN_IMG_DESC : '',
                pv_ipaddress: datainput.ipv4 ? datainput.ipv4 : '',
                pv_macaddress: macAddress ? macAddress : ''
            }

            let obj =
            {
                "funckey": "prc_preplacesip",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {

                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, datainput.language);
                return res.send(rs);

            });

        } catch (error) {

        }

    },
    confirmorder: function (req, res) {
        try {
            let datainput = req.body
            let { TLID, ROLECODE } = req.session.userinfo;
            let { language } = datainput;
            let data = {
                p_CUSTODYCD: datainput.CUSTODYCD,
                p_FULLNAME: datainput.FULLNAME,
                p_ORDERID: datainput.ORDERID,
                p_CODEID: datainput.CODEID,
                p_OTP: datainput.OTP,
                pv_action: datainput.ACTION,
                p_tlid: TLID,
                p_role: ROLECODE,
                p_language: language,
                pv_objname: datainput.OBJNAME,
            }
            let obj =
            {
                "funckey": "prc_confirmorder",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);


            });

        } catch (error) {

        }

    },
    preadd: async function (req, res) {
        try {
            let datainput = req.body;
            let macAddress = await macaddress.one();

            //lay action
            // sails.log('thanh.ngo: datainput:', datainput)
            let { ACTION, ORGORDERID, CUSTODYCD, CODEID, SRTYPE, FEEID, SEDTLID, QTTY, AMOUNT,
                SWCODEID, OBJNAME, SALETYPE, SALEID, SIGN_IMG, SIGN_IMG_DESC } = datainput;

            let { ISCUSTOMER, TLID, ROLECODE, USERID } = req.session.userinfo;
            let pv_iscustomer = 'Y'
            pv_iscustomer = ISCUSTOMER

            switch (ACTION) {
                case 'C':
                    ACTION = 'PLACE'
                    break;
                case 'U':
                    ACTION = 'AMEND'
                    break;
                case 'D':
                    ACTION = 'CANCEL'
                    break;
                default:
                    ACTION = 'PLACE'
                    break;
            }
            let data = {
                p_action: ACTION,
                p_orderid: { dir: 3003, type: 2001 },
                p_orgorderid: ORGORDERID,
                p_custodycd: CUSTODYCD,
                p_codeid: CODEID,
                p_fosrtype: SRTYPE,
                p_feeid: FEEID,
                p_sedtlid: SEDTLID,
                p_qtty: QTTY,
                p_amount: AMOUNT,
                p_swcodeid: SWCODEID ? SWCODEID : '',
                p_swid: '',
                p_saletype: SALETYPE ? SALETYPE : '',
                p_saleid: SALEID ? SALEID : '',
                p_tlid: TLID,
                p_role: ROLECODE,
                p_userid: USERID,
                pv_objname: OBJNAME,
                p_reflogid: '',
                p_ischkotp: 'Y',
                p_otpval: '',
                p_spcode: datainput.SPCODE ? datainput.SPCODE : '',
                p_img: SIGN_IMG ? SIGN_IMG : '',
                p_imgdesc: SIGN_IMG_DESC ? SIGN_IMG_DESC : '',
                pv_ipaddress: datainput.ipv4 ? datainput.ipv4 : '',
                pv_macaddress: macAddress ? macAddress : ''
            }

            let obj =
            {
                "funckey": "prc_preplaceorder",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {

                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, datainput.language);
                return res.send(rs);

            });

        } catch (error) {

        }

    },
    add: function (req, res) {
        try {
            // let data = Orders.newInstance(req.body);
            // data.ACTION = 'PLACE';
            // data = RestfulHandler.addSessionInfo(data, req);
            let datainput = req.body;
            let { TLID, ROLECODE } = req.session.userinfo;
            let data = {
                p_tradingid: datainput.TRADINGID,
                p_action: 'PLACE',
                p_orderid: datainput.ORDERID,
                p_orgorderid: datainput.ORGORDERID,
                p_custodycd: datainput.CUSTODYCD,
                p_codeid: datainput.CODEID,
                p_fosrtype: datainput.SRTYPE,
                p_feeid: datainput.FEEID,
                p_sedtlid: datainput.SEDTLID,
                p_qtty: datainput.QTTY,
                p_amount: datainput.AMOUNT,
                p_swcodeid: datainput.SWCODEID ? datainput.SWCODEID : '',
                p_swid: '',
                p_tlid: TLID,
                p_role: ROLECODE,
                pv_objname: datainput.OBJNAME,
                p_reflogid: '',
                p_ischkotp: datainput.OBJNAME == 'PLACEORDEREX' ? 'N' : 'Y',
                p_otpval: datainput.OTP,
                p_warning_code: { dir: 3003, type: 2001 },
                p_warning_msg: { dir: 3003, type: 2001 },
                p_spcode: datainput.SPCODE ? datainput.SPCODE : '',
            }
            let obj =
            {
                "funckey": "prc_placeorder",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {

                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, datainput.language);
                return res.send(rs);

            });

        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }

    },
    update: function (req, res) {
        // let body = req.body;
        // console.log('body', body)
        // let data = Orders.newInstance(body);
        // data.ACTION = 'AMEND';


        try {
            let datainput = req.body;
            let { TLID, ROLECODE } = req.session.userinfo;
            let data = {
                p_tradingid: datainput.TRADINGID,
                p_action: 'AMEND',
                p_orderid: datainput.ORDERID,
                p_orgorderid: datainput.ORGORDERID,
                p_custodycd: datainput.CUSTODYCD,
                p_codeid: datainput.CODEID,
                p_fosrtype: datainput.SRTYPE,
                p_feeid: datainput.FEEID,
                p_sedtlid: datainput.SEDTLID,
                p_qtty: datainput.QTTY,
                p_amount: datainput.AMOUNT,
                p_swcodeid: datainput.SWCODEID ? datainput.SWCODEID : '',
                p_swid: '',
                p_tlid: TLID,
                p_role: ROLECODE,
                pv_objname: datainput.OBJNAME,
                p_reflogid: '',
                p_ischkotp: datainput.OBJNAME == 'PLACEORDEREX' ? 'N' : 'Y',
                p_otpval: datainput.OTP,
                p_warning_code: { dir: 3003, type: 2001 },
                p_warning_msg: { dir: 3003, type: 2001 },
                p_spcode: datainput.SPCODE ? datainput.SPCODE : '',
            }

            let obj =
            {
                "funckey": "prc_placeorder",
                bindvar: data
            }

            processingserver.callAPI(obj, function (err, rs) {

                if (rs.EC == 0) {
                    ErrDefs.find({ ERRNUM: rs.EC }).exec((err, errdefs) => {
                        if (err) {
                            rs.EM = "Lỗi thực hiện trên redis"
                            return res.send(rs)
                        }


                        if (errdefs)
                            rs.EM += errdefs.ERRDESC

                        return res.send(rs);
                    });
                }
                else {
                    return res.send(rs);
                }

            });
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }

    },
    convert_to_groupRow: function (ret) {
        return new Promise((resolve) => {
            var arr = [];
            let CUSTODYCD = '';
            let rowParent = {};
            let count_row = 1;
            for (var data of ret.rows) {
                var col = ret.col; var obj = {};

                for (var index in col) {

                    rowParent[index] = data[col[index]]
                    if (index == "CUSTODYCD") {

                        if (CUSTODYCD != data[col[index]]) {
                            count = 1
                            CUSTODYCD = data[col[index]]
                        }
                        // else{

                        // }
                    }

                    obj[col[index]] = data[index];
                }
                if (count == 1)
                    arr.push(rowParent)
                arr.push(obj);
                count += 1;
            }
            resolve(arr);


        })
    },

    //từ chối lệnh
    cancel: function (req, res) {
        try {
            let datainput = req.body;
            let { TLID, ROLECODE } = req.session.userinfo;
            let data = {
                p_tradingid: datainput.TRADINGID,
                p_action: 'CANCEL',
                p_orderid: datainput.ORDERID,
                p_orgorderid: datainput.ORGORDERID,
                p_custodycd: datainput.CUSTODYCD,
                p_codeid: datainput.CODEID,
                p_fosrtype: datainput.SRTYPE,
                p_feeid: datainput.FEEID,
                p_sedtlid: datainput.SEDTLID,
                p_qtty: datainput.QTTY,
                p_amount: datainput.AMOUNT,
                p_swcodeid: datainput.SWCODEID ? datainput.SWCODEID : '',
                p_swid: '',
                p_tlid: TLID,
                p_role: ROLECODE,
                pv_objname: datainput.OBJNAME,
                p_reflogid: '',
                p_ischkotp: datainput.OBJNAME == 'PLACEORDEREX' ? 'N' : 'Y',
                p_otpval: datainput.OTP,
                p_warning_code: { dir: 3003, type: 2001 },
                p_warning_msg: { dir: 3003, type: 2001 },
                p_spcode: datainput.SPCODE ? datainput.SPCODE : '',
            }
            let obj =
            {
                "funckey": "prc_placeorder",
                bindvar: data
            }
            processingserver.callAPI(obj, function (err, rs) {
                if (rs.EC == 0) {
                    ErrDefs.find({ ERRNUM: rs.EC }).exec((err, errdefs) => {
                        if (err) {
                            rs.EM = "Lỗi thực hiện trên redis"
                            return res.send(rs)
                        }
                        if (errdefs)
                            rs.EM += errdefs.ERRDESC

                        return res.send(rs);
                    });
                }
                else {
                    return res.send(rs);
                }
            });
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },

    //xóa lệnh
    delete: function (req, res) {
        let body = req.body;
        // console.log('body', body)
        let data = Orders.newInstance(body);
        data.ACTION = 'CANCEL';
        data = RestfulHandler.addSessionInfo(data, req);


        // data.err_code = { dir: 3003, type: 2001 }
        // data.err_msg = { dir: 3003, type: 2001 }
        // // data = commonUtil.convertPropsNullToEmpty(data);
        // data.REFlOGID = ''
        let obj =
        {
            "funckey": "FOPKS_SR.PRC_PLACEORDER",

            bindvar: data


        }

        processingserver.callAPI(obj, function (err, rs) {
            //console.log('res', rs)
            //get text của mã lỗi 
            ErrDefs.findOne({ ERRNUM: res.EC }).exec((err, errdefs) => {
                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }

                if (errdefs)
                    rs.EM = errdefs.ERRDESC

                return res.send(rs);
            });

        });

    },
    //lay traddingdate theo code id
    gettradingdate_bycodeid: function (req, res) {
        try {
            let data = req.body;
            let { TLID, ROLECODE } = req.session.userinfo;
            let rest = {
                p_codeid: data.CODEID,
                p_tlid: TLID,
            }
            let obj =
            {
                "funckey": "gettradingdate_bycodeid",
                bindvar: rest
            }

            processingserver.callAPI(obj, async function (err, rs) {
                if (err) {
                    sails.log.error(err);
                    return res.send(Ioutput.errServer(err));
                }

                return res.send(rs);

            })

        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },
    //linh.trinh lay thong tin phien giao dich 
    getSessionInfo: async function (req, res) {
        try {
            let data = req.body;
            data = RestfulHandler.addSessionInfo(data, req);
            let rest = {
                p_refcursor: { dir: 3003, type: 2004 },
                p_codeid: data.CODEID,
                p_Type: data.TYPE,
                p_reflogid: data.TLID
            }
            //console.log('getSessionInfo')
            //console.log(rest)

            //Need to remove


            let obj =
            {
                "funckey": "prc_get_sessioninfo",
                bindvar: rest
            }

            processingserver.callAPI(obj, async function (err, rs) {
                if (err) {
                    sails.log.error(err);
                    return res.send(Ioutput.errServer(err));
                }

                if (rs.EC == 0) {
                    let DT = await ConvertData.convert_to_Object(rs.DT.p_refcursor);
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

    getlistorderbook: async function (req, res) {


        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_custodycd: data.custodycd.value,
            p_tlid: TLID,
            p_language: data.language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_orderdbook",
            bindvar: rest
        }
        processingserver.callAPI(obj, function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    //console.log('prc_get_orderdbook', result)
                    delete rs.DT["p_refcursor"];
                    rs.DT.data = result;
                    return res.send(rs);
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
    getorderdbookbysip: async function (req, res) {

        let data = req.body;
        let { TLID, ROLECODE, USERID } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_custodycd: data.CUSTODYCD,
            p_role: ROLECODE,
            p_language: data.LANGUAGE,
            p_refcursor: { dir: 3003, type: 2004 }
        }
        let obj =
        {
            "funckey": "prc_get_orderdbook_bysip",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);

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
                    var DT = { data: result, numOfPages: numOfPages }


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
    getotpconfirmorder: async function (req, res) {

        let data = req.body;
        let { TLID, ROLECODE, USERID } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_custodycd: USERID,
            p_role: ROLECODE,
            p_language: data.language,
            p_refcursor: { dir: 3003, type: 2004 }
        }
        let obj =
        {
            "funckey": "prc_get_otpconfirmorder",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {

                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    let pv_sumRecord = result.length;
                    let dataAll = result
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
                    var DT = { data: result, numOfPages: numOfPages, sumRecord: pv_sumRecord, dataAll: dataAll }


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
    getlistCloseOrderManual: function (req, res) {


        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;

        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_symbol: '',
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,

        }

        let obj =
        {
            "funckey": "prc_tradingsession_close",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {


                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    let pv_sumRecord = result.length;
                    let dataAll = result
                    //phan trang
                    let { pagesize, page, keySearch } = req.body;

                    // var objfilter= ConvertData.convert_filter_to_Object(keySearch)
                    if (keySearch)
                        if (keySearch.length > 0)
                            result = await Paging.find(result, keySearch)

                    let numOfPages = Math.ceil(result.length / pagesize);
                    result = await Paging.paginate(result, pagesize, page ? page : 1)


                    delete rs.DT["p_refcursor"];
                    var DT = { data: result, numOfPages: numOfPages, sumRecord: pv_sumRecord, dataAll: dataAll }


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


    getlistmanagerfee: function (req, res) {


        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;

        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,

        }

        let obj =
        {
            "funckey": "prc_get_managerfee",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {


                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    let pv_sumRecord = result.length;
                    let dataAll = result
                    //phan trang

                    let { pagesize, page, keySearch } = req.body;

                    // var objfilter= ConvertData.convert_filter_to_Object(keySearch)
                    if (keySearch)
                        if (keySearch.length > 0) {
                            result = await Paging.find(result, keySearch)
                        }
                    let numOfPages = Math.ceil(result.length / pagesize);
                    result = await Paging.paginate(result, pagesize, page ? page : 1)


                    delete rs.DT["p_refcursor"];
                    var DT = { data: result, numOfPages: numOfPages, sumRecord: pv_sumRecord, dataAll: dataAll }


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

    getlistcloseorder: function (req, res) {


        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;

        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_symbol: '',
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,

        }

        let obj =
        {
            "funckey": "prc_tradingsession_by_symbol",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {


                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    let pv_sumRecord = result.length;
                    let dataAll = result
                    //phan trang

                    let { pagesize, page, keySearch } = req.body;

                    // var objfilter= ConvertData.convert_filter_to_Object(keySearch)
                    if (keySearch)
                        if (keySearch.length > 0) {
                            result = await Paging.find(result, keySearch)
                        }
                    let numOfPages = Math.ceil(result.length / pagesize);
                    result = await Paging.paginate(result, pagesize, page ? page : 1)


                    delete rs.DT["p_refcursor"];
                    var DT = { data: result, numOfPages: numOfPages, sumRecord: pv_sumRecord, dataAll: dataAll }


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
    getlisttradingsession_feecaculate: function (req, res) {


        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;

        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_symbol: '',
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,

        }

        let obj =
        {
            "funckey": "prc_tradingsession_by_feecaculate",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {


                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    let pv_sumRecord = result.length;
                    let dataAll = result
                    //phan trang

                    let { pagesize, page, keySearch } = req.body;

                    // var objfilter= ConvertData.convert_filter_to_Object(keySearch)
                    if (keySearch)
                        if (keySearch.length > 0) {
                            result = await Paging.find(result, keySearch)
                        }
                    let numOfPages = Math.ceil(result.length / pagesize);
                    result = await Paging.paginate(result, pagesize, page ? page : 1)


                    delete rs.DT["p_refcursor"];
                    var DT = { data: result, numOfPages: numOfPages, sumRecord: pv_sumRecord, dataAll: dataAll }


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
    processcloseorder: function (req, res) {
        try {
            let datainput = req.body
            let { TLID, ROLECODE } = req.session.userinfo;
            let data = {
                p_symbol: datainput.symbol,
                p_sessionno: datainput.sessionno,
                p_desc: datainput.desc,
                pv_action: 'ADD',
                p_tlid: TLID,
                p_role: ROLECODE,
                p_language: datainput.language,
                pv_objname: datainput.objname

            }
            let obj =
            {
                "funckey": "prc_process_tx5011",
                bindvar: data
            }

            processingserver.callAPI(obj, async function (err, rs) {

                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, datainput.language);
                return res.send(rs);

            });

        } catch (error) {

        }

    },
    //Dự kiến khớp
    caculate_fee: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let datasubmit = {
            p_codeid: data.p_codeid,
            p_tradingid: data.p_tradingid,
            p_srtype: data.p_srtype,
            p_desc: data.p_desc,
            p_tlid: TLID,
            p_role: ROLECODE,
            pv_objname: req.body.pv_objname,
            p_language: req.body.p_language,
            MODELNAME: "caculate_fee"
        };
        datasubmit = commonUtil.convertPropsNullToEmpty(datasubmit);

        let obj = { model: datasubmit }
        let language = datasubmit.p_language
        processingserver.createmodel(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        })
    },
    // Đổi phiên giao dịch cho lệnh đặt
    changeOrderTradingSession: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let datasubmit = {
            p_orderid: data.p_orderid,
            p_custodycd: data.p_custodycd,
            p_codeid: data.p_codeid,
            p_dealtype: data.p_dealtype,
            p_amount: data.p_amount,
            p_oldtradingdate: data.p_oldtradingdate,
            p_tradingdate: data.p_tradingdate,
            // pv_action: 'ADD',
            p_tlid: TLID,
            p_role: ROLECODE,
            pv_objname: data.pv_objname,
            p_language: data.p_language,
            MODELNAME: "txprocess5047"
        };
        datasubmit = commonUtil.convertPropsNullToEmpty(datasubmit);

        let obj = { model: datasubmit }
        let language = datasubmit.p_language
        processingserver.createmodel(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        })
    },
    update_managerfee: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let datasubmit = {
            p_codeid: data.p_codeid,
            p_tradingid: data.p_tradingid,
            p_managerfee: data.p_managerfee,
            p_desc: data.p_desc,
            p_tlid: TLID,
            p_role: ROLECODE,
            pv_objname: req.body.pv_objname,
            p_language: req.body.p_language,
            MODELNAME: "update_managerfee"
        };
        datasubmit = commonUtil.convertPropsNullToEmpty(datasubmit);

        let obj = { model: datasubmit }
        let language = datasubmit.p_language
        processingserver.createmodel(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        })
    },
    processcloseorderManual: function (req, res) {
        try {
            let datainput = req.body
            let { TLID, ROLECODE } = req.session.userinfo;
            let data = {
                p_symbol: datainput.symbol,
                p_sessionno: datainput.sessionno,
                p_desc: datainput.desc,
                p_issip: datainput.issip,
                pv_action: 'ADD',
                p_tlid: TLID,
                p_role: ROLECODE,
                p_language: datainput.language,
                pv_objname: datainput.objname

            }
            let obj =
            {
                "funckey": "prc_process_tx5043",
                bindvar: data
            }

            processingserver.callAPI(obj, async function (err, rs) {

                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, datainput.language);
                return res.send(rs);

            });

        } catch (error) {

        }

    },
    getOrderList: function (req, res) {
        try {
            var data = req.body
            data = RestfulHandler.addSessionInfo(data, req);
            let { TLID, USERID, ISCUSTOMER } = req.session.userinfo;
            sails.log.info('getOrderList', data)

            processingserver.callAPIWithUrl('front/syncOrderByTLID', data, async function (err, rs) {
                if (err) {
                    sails.log.info('getOrderList.:Error', err, data)
                    return res.send(Ioutput.errServer(err));
                }
                if (rs.EC == 0) {
                    if (data.isSync)
                        return res.send(Ioutput.success({ data: [], numOfPages: 0 }));
                    var length = ISCUSTOMER == 'Y' ? await Orders.count({ TLID: TLID, CUSTODYCD: USERID }) : await Orders.count({ TLID: TLID });
                    var pagesize = parseInt(data.pagesize);
                    var numOfPages = Math.ceil(length / pagesize);

                    // var exectype = await Allcode.find({ CDTYPE: 'SR', CDNAME: 'EXECTYPE' });
                    // var srtype = await Allcode.find({ CDTYPE: 'SR', CDNAME: 'SRTYPE' });
                    if (ISCUSTOMER == 'Y')
                        Orders.find({ TLID: TLID, CUSTODYCD: USERID })
                            .paginate({ limit: pagesize, page: data.page })
                            .exec(async function (err, response) {
                                var DT = { data: response, numOfPages: numOfPages }
                                return res.send(Ioutput.success(DT));


                            });
                    else
                        Orders.find({ TLID: TLID })
                            .paginate({ limit: pagesize, page: data.page })
                            .exec(async function (err, response) {
                                var DT = { data: response, numOfPages: numOfPages }
                                return res.send(Ioutput.success(DT));


                            });
                }
                else {
                    return res.send(rs);
                }
            });
        } catch (error) {
            res.send(Ioutput.errServer(error));
        }

    },
    //lấy danh sách sổ lệnh tu redis
    getlist: async function (req, res) {
        // if (req.isSocket) {
        //     // If this code is running, it's made it past the `isAdmin` policy, so we can safely
        //     // watch for `.publishCreate()` calls about this model and inform this socket, since we're
        //     // confident it belongs to a logged-in administrator.
        //     sails.log.debug('is socket');
        //     //để  đăng kí sự kiện lăng nghe model Command thay đổi kích hoạt sự kiện on('command') bên phía client
        //     Orders.watch(req);
        // }

        // var start = process.hrtime();
        // let begincount = LogHelper.getDuration(process.hrtime(start));
        // sails.log.info(LOG_TAG, "getlist.:Begin:Duration:", begincount, "body", req.body);
        // if (req.session.userinfo) {
        //     let { TLID, USERID, ISCUSTOMER } = req.session.userinfo;

        //     let self = this;
        //     var keySearch = Paging.generate_keySearch(req.body);
        //     let dataCount = { ...keySearch }
        //     // chèn thêm điều kiện find dữ liệu theo trường orderid
        //     let keyid = ''


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


        // }
        try {
            let result = [];
            //phan trang
            let { pagesize, page, keySearch, sortSearch } = req.body;
            let { TLID, USERNAME, ISCUSTOMER } = req.session.userinfo;
            let numAcc = 0
            result = await this.getAllOrders(TLID, ISCUSTOMER == 'Y' ? USERNAME : 'ALL')
            if (keySearch)
                if (keySearch.length > 0)
                    result = await Paging.find(result, keySearch)


            let numOfPages = Math.ceil(result.length / pagesize);
            numAcc = result.length
            if (sortSearch) {
                if (sortSearch.length > 0)
                    result = await Paging.orderby(result, sortSearch)
                else
                    result = await Paging.orderby(result, [{ id: 'TXDATE', desc: true }, { id: 'CREATEDT', desc: true }])
            }
            else
                result = await Paging.orderby(result, [{ id: 'TXDATE', desc: true }, { id: 'CREATEDT', desc: true }])
            result = await Paging.paginate(result, pagesize, page ? page : 1)
            var DT = { data: result, numOfPages: numOfPages, sumRecord: numAcc }
            return res.send(Ioutput.success(DT));
        } catch (error) {
            let rs = {}
            rs.EM = 'Lỗi client gọi api';
            rs.EC = -1000;
            return res.send(rs)
        }
    },

    getlistsip: async function (req, res) {
        try {
            let result = [];
            let result1 = [];
            let result2 = [];
            //phan trang
            let { pagesize, page, keySearch1, keySearch2, sortSearch } = req.body;
            let { TLID, USERNAME, ISCUSTOMER } = req.session.userinfo;
            let numAcc = 0
            result = await this.getAllOrders(TLID, ISCUSTOMER == 'Y' ? USERNAME : 'ALL');
            if (keySearch1)
                if (keySearch1.length > 0)
                    result1 = await Paging.find(result, keySearch1)

            if (keySearch2)
                if (keySearch2.length > 0)
                    result2 = await Paging.find(result, keySearch2)

            result = result1.concat(result2);

            let numOfPages = Math.ceil(result.length / pagesize);
            numAcc = result.length
            if (sortSearch) {
                if (sortSearch.length > 0)
                    result = await Paging.orderby(result, sortSearch)
                else
                    result = await Paging.orderby(result, [{ id: 'TXDATE', desc: true }, { id: 'CREATEDT', desc: true }])
            }
            else
                result = await Paging.orderby(result, [{ id: 'TXDATE', desc: true }, { id: 'CREATEDT', desc: true }])
            result = await Paging.paginate(result, pagesize, page ? page : 1)
            var DT = { data: result, numOfPages: numOfPages, sumRecord: numAcc }
            return res.send(Ioutput.success(DT));
        } catch (error) {
            let rs = {}
            rs.EM = 'Lỗi client gọi api';
            rs.EC = -1000;
            return res.send(rs)
        }
    },


    getfacctnobysymbol: async function (req, res) {
        try {
            let data = req.body;
            let { TLID, ROLECODE } = req.session.userinfo;
            let rest = {
                p_refcursor: { dir: 3003, type: 2004 },
                p_symbol: data.symbol,
                p_custodycd: data.custodycd,
                p_srtype: data.srtype,
                p_tlid: TLID,
                p_role: ROLECODE,
                p_language: data.language,

            }
            let obj =
            {
                "funckey": "prc_get_fmacctno_bysymbol",
                bindvar: rest
            }
            processingserver.callAPI(obj, async function (err, rs) {


                if (err) {
                    sails.log.error(err);
                    return res.send(Ioutput.errServer(err));
                }

                if (rs.EC == 0) {
                    let DT = await ConvertData.convert_to_Object(rs.DT.p_refcursor);
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

    //tuan.nguyenquang: Quan ly upload image Original Order
    prc_sy_mt_originalorder: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let datasubmit = {
            p_action: data.ACTION,
            p_autoid: data.AUTOID ? data.AUTOID : "",
            p_custodycd: data.CUSTODYCD,
            p_type: data.TYPE,
            p_imgsign: data.IMGSIGN,
            p_note: data.NOTE,
            pv_orderid: data.ORDERID,
            p_tlid: TLID,
            p_role: ROLECODE,
            pv_objname: data.OBJNAME,
            p_language: data.language,
            // MODELNAME: "sy_mt_originalorder"
        };
        // sails.log("prc_sy_mt_originalorder.:Begin.:", datasubmit)
        datasubmit = commonUtil.convertPropsNullToEmpty(datasubmit);
        let language = datasubmit.p_language
        let obj =
        {
            "funckey": "prc_sy_mt_originalorder",
            bindvar: datasubmit
        }
        //sails.log.info("prc_sy_mt_originalorder.Start:", datasubmit)
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                sails.log.info("prc_sy_mt_originalorder.RS:", rs.EM)
                return res.send(rs);
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                sails.log.error("prc_sy_mt_originalorder.Error:", rs.EM)
                return res.send(rs)
            }
        })
    },

    //tuan.nguyenquang: Lay danh sach upload theo custodycd, status
    get_list_originalorder: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let datasubmit = {
            p_custodycd: data.CUSTODYCD,
            p_status: data.STATUS,
            p_tlid: TLID,
            p_role: ROLECODE,
            pv_objname: data.OBJNAME,
            p_language: data.language,
            p_refcursor: { dir: 3003, type: 2004 },
            // MODELNAME: "sy_mt_originalorder"
        };
        // sails.log("prc_sy_mt_originalorder.:Begin.:", datasubmit)
        datasubmit = commonUtil.convertPropsNullToEmpty(datasubmit);
        let obj =
        {
            "funckey": "prc_get_sy_mt_originalorder",
            bindvar: datasubmit
        }
        //sails.log.info("get_list_originalorder.Start:", datasubmit)
        let language = datasubmit.p_language
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor)
                    delete rs.DT["p_refcursor"]
                    let { pagesize, page, keySearch, sortSearch } = req.body;
                    if (keySearch)
                        if (keySearch.length > 0)
                            result = await Paging.find(result, keySearch);

                    let numOfPages = Math.ceil(result.length / pagesize);
                    rs.numOfPages = numOfPages
                    // search theo tung cot
                    if (sortSearch)
                        if (sortSearch.length > 0)
                            result = await Paging.orderby(result, sortSearch);
                    result = await Paging.paginate(result, pagesize, page ? page : 1);
                    rs.DT.data = result;
                    rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language)
                    return res.send(rs);
                } else {
                    rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                    sails.log.error("get_list_originalorder.Error:", rs.EM)
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                sails.log.error("get_list_originalorder.Error:", rs.EM)
                return res.send(rs)
            }
        })
    },

    get_list_manager_originalorder: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let datasubmit = {
            p_custodycd: data.CUSTODYCD,
            p_status: data.STATUS,
            p_statusdownload: data.STATUSDOWNLOAD,
            p_tlid: TLID,
            p_role: ROLECODE,
            pv_objname: data.OBJNAME,
            p_language: data.language,
            p_refcursor: { dir: 3003, type: 2004 },
            // MODELNAME: "sy_mt_originalorder"
        };
        // sails.log("get_list_manager_originalorder.:Begin.:", datasubmit)
        datasubmit = commonUtil.convertPropsNullToEmpty(datasubmit);
        let obj =
        {
            "funckey": "prc_get_list_manager_originalorder",
            bindvar: datasubmit
        }
        //sails.log.info("get_list_manager_originalorder.Start:", datasubmit)
        let language = datasubmit.p_language
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor)
                    delete rs.DT["p_refcursor"]
                    let { pagesize, page, keySearch, sortSearch } = req.body;
                    if (keySearch)
                        if (keySearch.length > 0)
                            result = await Paging.find(result, keySearch);

                    let numOfPages = Math.ceil(result.length / pagesize);
                    rs.numOfPages = numOfPages
                    // search theo tung cot
                    if (sortSearch)
                        if (sortSearch.length > 0)
                            result = await Paging.orderby(result, sortSearch);
                    result = await Paging.paginate(result, pagesize, page ? page : 1);
                    rs.DT.data = result;
                    rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language)
                    return res.send(rs);
                } else {
                    rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                    sails.log.error("get_list_manager_originalorder.Error:", rs.EM)
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                sails.log.error("get_list_manager_originalorder.Error:", rs.EM)
                return res.send(rs)
            }
        })
    },
    prc_mt_download_originalorder: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let datasubmit = {
            p_action: data.ACTION,
            p_autoid: data.AUTOID ? data.AUTOID : "",
            p_custodycd: data.CUSTODYCD,
            p_type: data.TYPE,
            p_imgsign: data.IMGSIGN,
            p_note: data.NOTE,
            p_tlid: TLID,
            p_role: ROLECODE,
            pv_objname: data.OBJNAME,
            p_language: data.language,
            // MODELNAME: "sy_mt_originalorder"
        };
        // sails.log("prc_mt_download_originalorder.:Begin.:", datasubmit)
        datasubmit = commonUtil.convertPropsNullToEmpty(datasubmit);
        let language = datasubmit.p_language
        let obj =
        {
            "funckey": "prc_mt_download_originalorder",
            bindvar: datasubmit
        }
        //sails.log.info("prc_mt_download_originalorder.Start:", datasubmit)
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                sails.log.info("prc_mt_download_originalorder.RS:", rs.EM)
                return res.send(rs);
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                sails.log.error("prc_mt_download_originalorder.Error:", rs.EM)
                return res.send(rs)
            }
        })
    },
    getOrderSellInfo: function (req, res) {
        try {
            let data = req.body;
            let { TLID, ROLECODE } = req.session.userinfo;
            let rest = {
                p_refcursor: { dir: 3003, type: 2004 },
                p_custodycd: data.p_custodycd,
                p_codeid: data.p_codeid,
                p_qtty: data.p_qtty,
                p_issip: data.p_issip,
                p_srtype: data.p_srtype,
                p_tlid: TLID,
                p_role: ROLECODE,
                p_language: data.language,
            }
            let obj =
            {
                "funckey": "prc_get_ordersell_info",
                bindvar: rest
            }
            processingserver.callAPI(obj, async function (err, rs) {


                if (err) {
                    sails.log.error(err);
                    return res.send(Ioutput.errServer(err));
                }

                if (rs.EC == 0) {
                    let DT = await ConvertData.convert_to_Object(rs.DT.p_refcursor);
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

