/**
 * AccountInfoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


var path = require('path')
var fs = require('fs');
var XLSX = require('xlsx');
var XlsxTemplate = require('xlsx-template');

var processingserver = require('../commonwebuser/ProcessingServer');
var commonUtil = require('../common/CommonUtil');
var Ioutput = require(path.resolve(__dirname, '../common/OutputInterface.js'));
var ConvertData = require('../services/ConvertData');
var LogHelper = require('../common/LogHelper');



module.exports = {
 
    changecustomerpassword: function (req, res) {

        let data = req.body;
        sails.log('req body:', req.body)
        data.pv_objname = sails.config.OBJNAMEDEFAULT
        let language = data.p_language
        data.p_tlid = req.session.userinfo.TLID
        data.p_role = req.session.userinfo.ROLECODE
        data.p_username = req.session.userinfo.USERID
        data.MODELNAME = "changecustomerpassword";
        data.p_refcursor = { dir: 3003, type: 2004 }
        data = commonUtil.convertPropsNullToEmpty(data);
        sails.log('data :', data)
        let obj = { model: data }
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
        });
    },

    changeAuthenticationMethod: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let datasubmit = {
            p_custodycd: data.p_custodycd,
            p_oldauthtype: data.p_oldauthtype,
            p_newauthtype: data.p_newauthtype,
            // pv_action: 'ADD',
            p_tlid: TLID,
            p_role: ROLECODE,
            pv_objname: sails.config.OBJNAMEDEFAULT,
            p_language: data.p_language,
            MODELNAME: "txprocess2031"
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

    getaccountinfo_by_username: function (req, res) {
        let params = {
            p_username: '',
            p_tlid: req.session.userinfo.TLID,
            p_role: req.session.userinfo.ROLECODE,
            p_language: '',
            p_refcursor: { dir: 3003, type: 2004 }

        };
        params = { ...params, ...req.body };
        //sails.log.info('getaccountinfo_by_username:.START', LogHelper.logReq(req));
        let obj = {
            funckey: "prc_getaccountinfo_by_username",
            bindvar: params
        };
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                sails.log.error('getaccountinfo_by_username:.Error', LogHelper.logReq(req), err);
                return res.send(Utils.removeException(err));
            }
            try {
                //sails.log.info('getaccountinfo_by_username:.response', rs.EC, rs.EM, LogHelper.logReq(req));
                rs.DT = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, params.p_language);
                return res.send(rs);

            } catch (error) {
                sails.log.error('getaccountinfo_by_username:.Error', LogHelper.logReq(req), error);
                return res.send(Ioutput.errServer(err));
            }
        });
    },
    resetpasscustomer: function (req, res) {
        sails.log.info('resetpasscustomer:.START', LogHelper.logReq(req));

        let params = {};
        params.p_username = '';
        params.p_fullname = '';
        params.p_IDCODE = '';
        params.p_MOBILE = '';
        params.p_EMAIL = '';
        params.p_language = '';
        params.pv_objname = '';
        params.p_DESC = '';
        params.pv_action = '';
        params.p_tlid = req.session.userinfo.TLID;
        params.p_role = req.session.userinfo.ROLECODE;
        params.p_refcursor = { dir: 3003, type: 2004 };

        params = {...params,...req.body};
        let obj = {
            funckey: "prc_resetpasswordcustomer_2022",
            bindvar: params
        }

        let language = params.p_language
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                sails.log.error('resetpasscustomer:.Error', LogHelper.logReq(req), err);
                return res.send(Utils.removeException(err));
            }
            try {
                sails.log.info('resetpasscustomer:.response', rs.EC, rs.EM, LogHelper.logReq(req));
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);
            } catch (error) {
                sails.log.error('resetpasscustomer:.Error', LogHelper.logReq(req), error);
                return res.send(Ioutput.errServer(err));
            }

        });
    },
    changecustomerusername: function (req, res) {
        let params = {
            p_oldusername: '',
            p_newusername: '',
            p_cfmnewusername: '',
            p_desc: '',
            p_tlid: req.session.userinfo.TLID,
            pv_action: '',
            p_role: req.session.userinfo.ROLECODE,
            p_language: '',
            pv_objname: '',
            p_mobile: '',
            p_email: ''
        };
        params = { ...params, ...req.body };
        sails.log.info('changecustomerusername:.START', LogHelper.logReq(req));
        let obj = {
            funckey: "prc_changeusername",
            bindvar: params
        };
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                sails.log.error('changecustomerusername:.Error', LogHelper.logReq(req), err);
                return res.send(Utils.removeException(err));
            }
            try {
                sails.log.info('changecustomerusername:.response', rs.EC, rs.EM, LogHelper.logReq(req));
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, params.p_language);
                return res.send(rs);

            } catch (error) {
                sails.log.error('changecustomerusername:.Error', LogHelper.logReq(req), error);
                return res.send(Ioutput.errServer(err));
            }
        });
    },

    forgot_usernamepassword: function (req, res) {

        let data = req.body;
        data.pv_objname = sails.config.OBJNAMEDEFAULT
        let language = data.p_language
        data.p_tlid = sails.config.USERONL
        data.p_role = ''

        data.MODELNAME = "forgot_usernamepassword";
        data.p_refcursor = { dir: 3003, type: 2004 }
        data = commonUtil.convertPropsNullToEmpty(data);


        let obj = { model: data }
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
        });
    },
};

