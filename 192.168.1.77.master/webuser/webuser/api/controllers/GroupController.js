
var path = require('path')

var data = require('../datafake/Account.json')
var processingserver = require('../commonwebuser/ProcessingServer');
var commonUtil = require('../common/CommonUtil');
var Ioutput = require(path.resolve(__dirname, '../common/OutputInterface.js'));
var RestfulHandler = require('../common/RestfulHandler');
var ConvertData = require('../services/ConvertData');
module.exports = {

    getlistgroup:  function (req, res) {

        let data = req.body;
        let { TLID, ROLECODE} = req.session.userinfo;
        
        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_grpid: data.p_grpid,
            p_objname:data.objname,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_tlgroups",
            bindvar: rest
        }
        processingserver.callAPI(obj, function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {

                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    delete rs.DT["p_refcursor"];
                    rs.DT.data = result;
                    rs.DT.sumRecord = result.length;
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
    getlistgroup2:  function (req, res) {

        let data = req.body;
        let { TLID, ROLECODE} = req.session.userinfo;
        
        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_grpid: data.p_grpid,
            p_objname:data.objname,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_tlgroups2",
            bindvar: rest
        }
        processingserver.callAPI(obj, function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {

                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    delete rs.DT["p_refcursor"];
                    rs.DT.data = result;
                    rs.DT.sumRecord = result.length;
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
    add: function (req, res) {
        let data = req.body;
        data.pv_tlid = req.session.userinfo.TLID
        data.pv_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "mt_tlgroups";

        data = commonUtil.convertPropsNullToEmpty(data);


        let obj = { model: data }

        let language = data.pv_language
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

    update: function (req, res) {
        let data = req.body;
        data.pv_tlid = req.session.userinfo.TLID
        data.pv_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "mt_tlgroups";

        data = commonUtil.convertPropsNullToEmpty(data);

        let obj = { model: data }
        let language = data.pv_language
        processingserver.updatemodel(obj, async function (err, rs) {
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
    approve: function (req, res) {
        let data = {
            p_grpid: req.body.GROUPID,
            p_grpname: '',
            p_grptype: '',
            p_active: '',
            p_description: '',
            p_grpright: '',
            p_rolecode: '',
            pv_language: 'VN',
            pv_tlid: req.session.userinfo.TLID,
            pv_role: req.session.userinfo.ROLECODE
        };
        data.MODELNAME = "mt_tlgroups";

        data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }
        processingserver.approvemodel(obj, function (err, rs) {
            ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {
                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM = errdefs.ERRDESC

                return res.send(rs);
            })
        })
    },
    delete: function (req, res) {

        let data = {
            p_grpid: req.body.data.GRPID,
            p_grpname: '',
            p_grptype: '',
            p_active: '',
            p_description: '',
            p_grpright: '',
            p_rolecode: '',
            pv_language: req.body.p_language,
            pv_tlid: req.session.userinfo.TLID,
            pv_role: req.session.userinfo.ROLECODE,
            pv_objname: req.body.p_language

        };
        data.MODELNAME = "mt_tlgroups";

        data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }
        let language = req.body.p_language
        processingserver.deletemodel(obj, async function (err, rs) {
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
    reject: function (req, res) {
        let data = {
            p_grpid: req.body.GRPID,
            p_grpname: '',
            p_grptype: '',
            p_active: '',
            p_description: '',
            p_grpright: '',
            p_rolecode: '',
            pv_language: 'VN',
            pv_tlid: req.session.userinfo.TLID,
            pv_role: req.session.userinfo.ROLECODE
        };
        data.MODELNAME = "mt_tlgroups";
        data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }
        processingserver.rejectmodel(obj, function (err, rs) {
            ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {
                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM = errdefs.ERRDESC

                return res.send(rs);
            })
        })
    },
}