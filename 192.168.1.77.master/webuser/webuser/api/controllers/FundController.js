


var path = require('path')
var fs = require('fs');
var XLSX = require('xlsx');
var XlsxTemplate = require('xlsx-template');

var processingserver = require('../commonwebuser/ProcessingServer');
var commonUtil = require('../common/CommonUtil');
var Ioutput = require(path.resolve(__dirname, '../common/OutputInterface.js'));
var ConvertData = require('../services/ConvertData');
const { functionsIn } = require('lodash');


function buildStrinput(obj) {
    delete obj["_csrf"]
    try {
        let v_return = "";
        for (var property in obj) {
            v_return += obj[property] + "~#~";

        }
        v_return.slice(0, v_return.length - 1);
        return v_return;
    } catch (error) {
        sails.log.error(error);
        return "";
    }
}

var arrjOB = []
/*
var CronJob = require('cron').CronJob;
var job = new CronJob({
    cronTime: '* * * * * *',
    onTick: function () {
        if (arrjOB.length == 0) {
            let obj =
            {
                "funckey": "prc_get_tbl_cronjobb",
                bindvar: {  p_refcursor : { dir: 3003, type: 2004 }}
            }
            processingserver.callAPI(obj, async function (err, rs) {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                //console.log(result)

                arrjOB = result.map((item) => {
                    return {
                        name: item.NAME,
                        start: item.STATUS,
                        action: item.ACTION,
                        feq: item.FEQ
                    }
                })
                for (let index = 0; index < arrjOB.length; index++) {
                    createCron(arrjOB[index].name, arrjOB[index].action, arrjOB[index].feq, arrjOB[index].start)

                }
            })
        }
    },
    start: false,
    timeZone: 'Asia/Ho_Chi_Minh'
});
job.start();

function createCron(job, action, feq, status) {
    
    job = new CronJob(feq, function () {
        let obj =
        {
            "funckey": action,
            bindvar: {}
        }
        processingserver.callAPI(obj, async function (err, rs) {

        })
    }, null, status, "Asia/Ho_Chi_Minh");
}
*/
module.exports = {
    add: function (req, res) {
        let data = req.body;
        data.p_refcursor = { dir: 3003, type: 2004 }
        data.pv_action = 'ADD';
        let v_strinput = buildStrinput(data.TSLenhGD);
        let v_strinput1 = buildStrinput(data.TGianGD);
        if (data.dataTradingCycleInfo.transactionperiod == 'W') delete data.dataTradingCycleInfo["date"];
        else if (data.dataTradingCycleInfo.transactionperiod == 'M') delete data.dataTradingCycleInfo["day"];
        else if (data.dataTradingCycleInfo.transactionperiod == 'D') delete data.dataTradingCycleInfo["date"];
        else {
            delete data.dataTradingCycleInfo["date"];
            delete data.dataTradingCycleInfo["day"];
        }

        let v_strinput2 = buildStrinput(data.dataTradingCycleInfo);
        let v_strinput3 = v_strinput + v_strinput1 + v_strinput2;
        sails.log('v_strinput:::', v_strinput)
        sails.log('v_strinput1:::', v_strinput1)
        sails.log('v_strinput2:::', v_strinput2)
        let v_strinputfinal = '';
        if (v_strinput3.indexOf('~#~') > -1) {
            v_strinputfinal = v_strinput3.slice(0, v_strinput3.length - 3)
        }
        delete data["TSLenhGD"];
        delete data["TGianGD"];
        delete data["dataTradingCycleInfo"];
        data["p_FUNDDTL"] = v_strinputfinal;
        data["pv_tlid"] = req.session.userinfo.TLID,
            data.MODELNAME = "mt_fund";
        data = commonUtil.convertPropsNullToEmpty(data);
        sails.log('data to back :::', data)

        let language = data.pv_language
        let rest = data
        let obj =
        {
            "funckey": "prc_mt_fund",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                sails.log('err1:', err)
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    return res.send(rs);
                } else {
                    sails.log('err2:', rs)
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });

    },
    update: function (req, res) {
        let data = req.body;
        data.p_refcursor = { dir: 3003, type: 2004 }
        data.pv_action = 'EDIT';
        let v_strinput = buildStrinput(data.TSLenhGD);
        let v_strinput1 = buildStrinput(data.TGianGD);
        if (data.dataTradingCycleInfo.transactionperiod == 'W') delete data.dataTradingCycleInfo["date"];
        else if (data.dataTradingCycleInfo.transactionperiod == 'M') delete data.dataTradingCycleInfo["day"];
        else if (data.dataTradingCycleInfo.transactionperiod == 'D') delete data.dataTradingCycleInfo["date"];
        else {
            delete data.dataTradingCycleInfo["date"];
            delete data.dataTradingCycleInfo["day"];
        }
        let v_strinput2 = buildStrinput(data.dataTradingCycleInfo);
        sails.log('v_strinput:1', v_strinput)
        sails.log('v_strinput1:2', v_strinput1)
        sails.log('v_strinput2:3', v_strinput2)
        let v_strinput3 = v_strinput + v_strinput1 + v_strinput2;
        sails.log('buildStrinput:3', v_strinput3)
        let v_strinputfinal = ''
        v_strinputfinal = v_strinput3.slice(0, v_strinput3.length - 3)
        sails.log('v_strinputfinal:', v_strinputfinal)
        delete data["TSLenhGD"];
        delete data["TGianGD"];
        delete data["dataTradingCycleInfo"];
        data["p_FUNDDTL"] = v_strinputfinal;
        data["pv_tlid"] = req.session.userinfo.TLID,
            data.MODELNAME = "mt_fund";
        data = commonUtil.convertPropsNullToEmpty(data);

        let language = data.pv_language
        let rest = data
        let obj =
        {
            "funckey": "prc_mt_fund",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                sails.log('err1:', err)
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    return res.send(rs);
                } else {
                    sails.log('err2:', rs)
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });

    },
    update2: function (req, res) {
        let data = req.body;
        data.p_refcursor = { dir: 3003, type: 2004 }
        let v_strinput = buildStrinput(data.TSLenhGD);
        let v_strinput1 = buildStrinput(data.TGianGD);
        if (data.dataTradingCycleInfo.transactionperiod == 'W') delete data.dataTradingCycleInfo["date"];
        else if (data.dataTradingCycleInfo.transactionperiod == 'M') delete data.dataTradingCycleInfo["day"];
        else {
            delete data.dataTradingCycleInfo["date"];
            delete data.dataTradingCycleInfo["day"];
        }
        let v_strinput2 = buildStrinput(data.dataTradingCycleInfo);
        let v_strinput3 = v_strinput + v_strinput1 + v_strinput2
        let v_strinputfinal = ''
        if (data.dataTradingCycleInfo.transactionperiod == 'D') {
            v_strinputfinal = v_strinput3
        } else {
            if (v_strinput3.indexOf('|~#~') < 0)
                v_strinputfinal = v_strinput3.slice(0, v_strinput3.length - 3)
            else v_strinputfinal = v_strinput3.slice(0, v_strinput3.length - 4)
        }

        delete data["TSLenhGD"];
        delete data["TGianGD"];
        delete data["dataTradingCycleInfo"];
        data["p_FUNDDTL"] = v_strinputfinal;
        data["pv_tlid"] = req.session.userinfo.TLID,
            data.MODELNAME = "mt_fund";
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
    delete: function (req, res) {
        let data = {
            p_CODEID: req.body.data.CODEID,
            p_SYMBOL: '',
            p_NAMEVN: '',
            p_NAME_EN: '',
            p_LICENSENO: '',
            p_LICENSEDATE: '',
            p_LICENSEPLACE: '',
            p_FTYPE: '',
            p_FUNDDTL: '',
            p_FUNDPRODUCT: '',
            pv_tlid: req.session.userinfo.TLID,
            pv_language: req.body.p_language,
            pv_objname: req.body.pv_objname,
        };


        data.MODELNAME = "mt_fund";
        data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }
        let language = data.pv_language
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
    getlist: function (req, res) {

        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_funds",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    delete rs.DT["p_refcursor"];
                    rs.DT.data = result;
                    rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
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
    getlistbrp: function (req, res) {

        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_brid: data.p_brid,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_brgrp",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.DT.sumRecord = result.length;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    addgrp: function (req, res) {

        let data = req.body;
        data.pv_tlid = req.session.userinfo.TLID
        data.pv_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "mt_brgrp";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    updategrp: function (req, res) {
        let data = req.body;
        data.pv_tlid = req.session.userinfo.TLID
        data.pv_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "mt_brgrp";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    deletegrp: function (req, res) {
        let data = {
            p_brid: req.body.data.BRID,
            p_vsdbrid: '',
            p_mbid: '',
            p_brname: '',
            p_areaid: '',
            p_braddress: '',
            p_brdeputy: '',
            p_broffice: '',
            p_brtele: '',
            p_bremail: '',
            p_description: '',
            p_brname_en: '',
            pv_tlid: req.session.userinfo.TLID,
            pv_role: req.session.userinfo.ROLECODE,
            pv_language: req.body.p_language,
            pv_objname: req.body.pv_objname,
        };


        data.MODELNAME = "mt_brgrp";
        data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }
        let language = data.pv_language
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
        // }


    },
    getlistfmacctno: function (req, res) {
        let { TLID, ROLECODE } = req.session.userinfo;
        let { data } = req.body;
        let rest = {
            p_id: data.p_id,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_fmacctno",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.DT.sumRecord = result.length;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    addfnaccno: function (req, res) {

        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID
        data.pv_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "mt_fmacctno";
        data.p_refcursor = { dir: 3003, type: 2004 }

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
    updatefnaccno: function (req, res) {
        let data = req.body;
        data.pv_tlid = req.session.userinfo.TLID
        data.pv_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "mt_fmacctno";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    deletefnaccno: function (req, res) {
        let data = {
            p_id: req.body.data.ID,
            p_codeid: '',
            p_bankactype: '',
            pv_mbcode: '',
            p_bankacc: '',
            p_bankacname: '',
            p_bankacname_en: '',
            p_bankname: '',
            p_bankname_en: '',
            p_branch: '',
            p_province: '',
            p_description: '',
            pv_tlid: req.session.userinfo.TLID,
            pv_role: req.session.userinfo.ROLECODE,
            pv_language: req.body.p_language,
            pv_objname: req.body.pv_objname,
        };


        data.MODELNAME = "mt_fmacctno";
        data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }
        let language = data.pv_language
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
    approvefnaccno: function (req, res) {

        let data = {
            p_id: req.body.ID,
            p_codeid: '',
            p_bankactype: '',
            p_bankacc: '',
            p_bankacname: '',
            p_bankname: '',
            p_branch: '',
            p_province: '',
            pv_language: 'VN',
            pv_objname: 'Bank4Fund',
            pv_tlid: req.session.userinfo.TLID,

        }

        data.MODELNAME = "mt_fmacctno";
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
    approvemain: function (req, res) {

        let data = {
            p_tlid: req.session.userinfo.TLID,
            p_role: req.session.userinfo.ROLECODE,
            p_txnum: req.body.TXNUM,
            p_txdate: req.body.TXDATE,
            p_reflogid: req.session.userinfo.TLID,
            MODELNAME: "TXPROCESS",
        };


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
    getlistmember: function (req, res) {
        let { TLID, ROLECODE } = req.session.userinfo;
        let { data } = req.body;
        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_members",
            bindvar: rest
        }
        let language = data.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getlistroles: function (req, res) {
        let { TLID, ROLECODE } = req.session.userinfo;
        let { data } = req.body;
        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }
        let obj = {
            "funckey": "prc_get_roles",
            bindvar: rest
        }
        let language = data.p_language
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getlistMT: function (req, res) {

        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: req.body.data.p_language,
            p_role: ROLECODE,
            p_txnum: req.body.data.p_txnum,
            p_txdate: req.body.data.p_txdate,
            p_brid: '',
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_objlogdtl",
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
                    rs.DT.sumRecord = result.length;
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
    getlistTX: function (req, res) {
        let { TLID, ROLECODE } = req.session.userinfo;

        let rest = {
            p_tlid: TLID,
            p_language: req.body.data.p_language,
            p_role: ROLECODE,
            p_txnum: req.body.data.p_txnum,
            p_txdate: req.body.data.p_txdate,
            p_brid: '',
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_tllogfld",
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

    get_sodu_datlenh: async function (req, res) {

        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        sails.log('body value :', req.body)

        let rest = {
            p_custodycd: req.body.CUSTODYCD,
            p_codeid: req.body.CODEID,
            p_srtype: req.body.SRTYPE,
            p_tlid: TLID,
            p_language: req.body.language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_sodu_datlenh",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                //sails.log(error)
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    get_tradingid: async function (req, res) {

        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        sails.log('body value :', req.body)

        let rest = {
            p_codeid: req.body.CODEID,
            p_tlid: TLID,
            p_language: req.body.language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_tradingid_by_codeid",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                let result1 = result.map((item) => {
                    return {

                        value: item.TRADINGID,
                        label: item.TRADINGID,

                    }
                })

                rs.DT = result1;
                sails.log(result)
                //rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                sails.log(error)
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    addmember: function (req, res) {

        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID
        data.pv_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "mt_members";

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
    updatemember: function (req, res) {

        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID
        data.pv_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "mt_members";

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
    deletemember: function (req, res) {

        let data = {
            p_autoid: req.body.data.AUTOID,
            p_shortname: '',
            p_mbcode: '',
            p_mbname: '',
            p_mbtype: '',
            p_address: '',
            p_legalperson: '',
            p_note: '',
            p_phone: '',
            p_email: '',
            p_mbname_en: '',
            p_grptype: '',
            p_isagency: '',
            p_dbcode: '',
            p_startaccnum: '',
            p_issaleagency: '',
            pv_tlid: req.session.userinfo.TLID,
            pv_role: req.session.userinfo.ROLECODE,
            pv_language: req.body.p_language,
            pv_objname: req.body.pv_objname
        };


        data.MODELNAME = "mt_members";
        data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }
        let language = data.pv_language
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
        // }


    },
    getlistNoti: function (req, res) {

        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;


        let rest = {
            p_tlid: TLID,
            p_autoid: '',
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_alertcontent",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    addNoti: function (req, res) {

        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID
        data.MODELNAME = "mt_alertcontent";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    updateNoti: function (req, res) {

        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID
        data.MODELNAME = "mt_alertcontent";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    deleteNoti: function (req, res) {

        let data = {
            p_autoid: req.body.data.AUTOID,
            p_shortcontent: '',
            p_maincontent: '',
            p_alerttype: '',
            p_list: '',
            p_senddate: '',
            pv_tlid: req.session.userinfo.TLID,
            pv_language: req.body.p_language,
            pv_objname: req.body.pv_objname,
        };


        data.MODELNAME = "mt_alertcontent";
        data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }
        let language = data.pv_language
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
        // }


    },
    //lay ds cac tai khoan dc gui thong bao
    getAlertDetail: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_refautoid: data.refautoid,
            p_alerttype: data.alerttype,
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language
        }


        let obj =
        {
            "funckey": "prc_get_alertdetail",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                if (rs.EC == 0) {
                    //result tach ra 2 gia tri, redata tra ve chuoi object
                    let result, resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);

                    result = resultdata.map((item) => {
                        return {
                            value: item.REFID,
                            label: item.REFID
                        }
                    })
                    return res.send({ result, resultdata });

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
    blockafmast: function (req, res) {

        let data = req.body;
        data.p_tlid = req.session.userinfo.TLID
        data.p_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "blockaccount";

        data.p_refcursor = { dir: 3003, type: 2004 }
        data = commonUtil.convertPropsNullToEmpty(data);


        let obj = { model: data }
        processingserver.createmodel(obj, function (err, rs) {

            ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {

                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM = errdefs.ERRDESC
                return res.send(rs);
            })

        });
    },
    getlistblockafmast: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;


        let rest = {
            p_tlid: TLID,
            p_language: data.language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
            p_custodycd: ''
        }

        let obj =
        {
            "funckey": "prc_get_releaseaccount",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    unblockafmast: function (req, res) {

        let data = req.body;

        let language = data.p_language
        data.p_tlid = req.session.userinfo.TLID
        data.p_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "releaseaccount";
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

    getlistoderfromBank: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;

        sails.log("start call api getlistoderfromMBB ---> data:", data);
        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
        }

        let obj =
        {
            "funckey": "prc_get_listoderfrommbb",
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

    getlistfee: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;


        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_feeid: data.p_feeid,
            p_feetype: data.p_feetype,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
            p_feetier: { dir: 3003, type: 2004 },
        }

        let obj =
        {
            "funckey": "prc_get_feemanagement",
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
                    let result1 = ConvertData.convert_to_Object(rs.DT.p_feetier);
                    delete rs.DT["p_feetier"];
                    rs.DT.data = result;
                    rs.DT.data1 = result1;
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

    addFeetype: function (req, res) {

        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID;
        data.pv_role = req.session.userinfo.ROLECODE;
        data.MODELNAME = "mt_feetype";
        data.p_refcursor = { dir: 3003, type: 2004 }
        data = commonUtil.convertPropsNullToEmpty(data);


        let obj = { model: data }

        sails.log('data:', data)
        processingserver.createmodel(obj, function (err, rs) {

            ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {

                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM = errdefs.ERRDESC
                return res.send(rs);
            })

        });
    },
    updateFeetype: function (req, res) {

        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID;
        data.pv_role = req.session.userinfo.ROLECODE;
        data.MODELNAME = "mt_feetype";
        data.p_refcursor = { dir: 3003, type: 2004 }
        data = commonUtil.convertPropsNullToEmpty(data);


        let obj = { model: data }


        processingserver.updatemodel(obj, function (err, rs) {

            ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {

                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM = errdefs.ERRDESC
                return res.send(rs);
            })

        });
    },
    deleteFeetype: function (req, res) {

        let data = {
            p_id: req.body.data.ID,
            p_feename: '',
            p_feetype: '',
            p_ruletype: '',
            p_calcfee: '',
            p_feecalc: '',
            p_feeamt: '',
            p_feerate: '',
            p_minamt: '',
            p_maxamt: '',
            p_frdate: '',
            p_todate: '',
            p_status: '',
            p_ver: '',
            p_feetier: '',
            p_feetierdata: '',
            p_note: '',
            p_vsdfeeid: '',
            p_exectype: '',
            p_srtype: '',
            p_buyfromdate: '',
            p_buytodate: '',
            p_object: '',
            p_fundcode: '',
            p_timetype: '',
            p_feeid: '',
            p_percenttrailerfee: '',
            pv_language: req.body.p_language,
            pv_tlid: req.session.userinfo.TLID,
            pv_objname: req.body.pv_objname,
        };
        data.MODELNAME = "mt_feetype";
        data = commonUtil.convertPropsNullToEmpty(data);

        let obj = { model: data }
        processingserver.deletemodel(obj, function (err, rs) {
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
        // }


    },
    getlistfeeassign: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;


        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
            p_feeid: ''
        }

        let obj =
        {
            "funckey": "prc_get_feeassignmanagement",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getlistfeeassignfeeid: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_feetype: data.p_feetype,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
            p_feeid: '',
            p_feetier: { dir: 3003, type: 2004 },
        }

        let obj =
        {
            "funckey": "prc_get_feemanagement",
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

                    result1 = rs.DT.data.map((item) => {
                        return {
                            id: item.FEETYPECD,
                            name: data.p_language != 'vie' ? item["FEETYPEDES_" + data.p_language.toUpperCase()] : item.FEETYPEDES,
                            value: item.ID,
                            label: item.FEEFULLNAME,

                        }
                    })
                    return res.send(result1);
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
    getlistobjecttype: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_feetype: data.feetype,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_objfeetype",
            bindvar: rest
        }
        processingserver.callAPI(obj, function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let tmp = [];
                    let i = 0;
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    delete rs.DT["p_refcursor"];
                    if (data.feetype == '003') {
                        for (i = 0; i < result.length; i++) {
                            if (result[i].OBJFEETYPECD == 'RETYPE') {
                                tmp.push(result[i])
                            }
                        }
                        rs.DT.data = tmp;
                    }
                    else {
                        rs.DT.data = result;
                    }

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.OBJFEETYPECD,
                            label: item.OBJFEETYPEDES,

                        }
                    })
                    return res.send(result1);
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
    getlistobject: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_objfeetype: data.p_objfeetype,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_objectfee",
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
                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.OBJFEECD,
                            label: item.OBJFEENAME,

                        }
                    })
                    return res.send(result1);
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
    addfeeassign: function (req, res) {
        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID
        data.pv_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "mt_feeapply";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    updatefeeassign: function (req, res) {
        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID
        data.pv_role = req.session.userinfo.ROLECODE
        data.pv_objname = "FEEASSIGN"
        data.MODELNAME = "mt_feeapply";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    deletefeeassign: function (req, res) {

        let data = {
            p_id: req.body.data.ID,
            p_feeid: '',
            p_feeapplyname: '',
            p_objfeetype: '',
            p_objfeevalue: '',
            p_feeapply: '',
            p_status: '',
            pv_tlid: req.session.userinfo.TLID,
            pv_language: req.body.p_language,
            pv_objname: req.body.pv_objname,
            p_frdate: '',
            p_todate: '',
            pv_role: req.session.userinfo.ROLECODE
        };


        data.MODELNAME = "mt_feeapply";
        data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }
        let language = data.pv_language
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
        // }


    },
    getlisttermreview: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
            p_autoid: data.p_autoid
        }

        let obj =
        {
            "funckey": "prc_get_reviewterm",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    addreviewterm: function (req, res) {
        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID

        data.MODELNAME = "mt_reviewterm";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    updatereviewterm: function (req, res) {
        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID

        data.MODELNAME = "mt_reviewterm";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    deletereviewterm: function (req, res) {

        let data = {
            p_autoid: req.body.data.AUTOID,
            p_termname: '',
            p_frdate: '',
            p_todate: '',
            p_status: '',
            pv_language: req.body.p_language,
            pv_tlid: req.session.userinfo.TLID,
            pv_objname: req.body.pv_objname
        };

        data.MODELNAME = "mt_reviewterm";
        data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }
        let language = data.pv_language
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
        // }


    },
    addreviewparam: function (req, res) {
        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID

        data.MODELNAME = "mt_reviewparam";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    getlistreviewparam: function (req, res) {
        let data = req.body.data;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refautoid: data.refid,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
        }
        let obj =
        {
            "funckey": "prc_get_reviewparam",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];

                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    updatereviewparam: function (req, res) {
        let data = req.body;
        data.pv_tlid = req.session.userinfo.TLID

        data.MODELNAME = "mt_reviewparam";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    deletereviewparam: function (req, res) {

        let data = {
            p_autoid: req.body.data.AUTOID,
            p_refautoid: '',
            p_framt: '',
            p_toamt: '',
            p_classcd: '',
            p_applycd: '',
            p_status: '',
            pv_language: req.body.p_language,
            pv_tlid: req.session.userinfo.TLID,
            pv_objname: req.body.pv_objname
        };


        data.MODELNAME = "mt_reviewparam";
        data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }
        let language = data.pv_language
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
        // }


    },
    getlistchangecustomertype: function (req, res) {
        let data = req.body.data;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
            p_custodycd: data.p_custodycd
        }
        let obj =
        {
            "funckey": "prc_get_changecustomertype",
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
    getlistclasscd: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_custodycd: data.p_custodycd,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_classcd",
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

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.CDVAL,
                            label: item.CDCONTENT,

                        }
                    })
                    return res.send(result1);
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
    changecfmastclass: function (req, res) {
        let data = req.body;

        data.p_tlid = req.session.userinfo.TLID
        data.pv_objname = "CLASSCUSTOMER"
        data.MODELNAME = "changecustomerclass";
        data.p_role = req.session.userinfo.ROLECODE
        data.p_refcursor = { dir: 3003, type: 2004 }
        // data = commonUtil.convertPropsNullToEmpty(data);


        let obj = { model: data }


        processingserver.createmodel(obj, function (err, rs) {

            ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {

                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM = errdefs.ERRDESC
                return res.send(rs);
            })

        });
    },
    getlistkpiparam: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;


        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
            p_autoid: 'ALL'
        }
        let obj =
        {
            "funckey": "prc_get_kpiparam",
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
    addkpiparam: function (req, res) {
        let data = req.body;
        data.pv_role = req.session.userinfo.ROLECODE
        data.pv_tlid = req.session.userinfo.TLID
        data.MODELNAME = "mt_kpiparam";
        // data.p_refcursor = { dir: 3003, type: 2004 }
        // data = commonUtil.convertPropsNullToEmpty(data);


        let obj = { model: data }


        processingserver.createmodel(obj, function (err, rs) {

            ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {

                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM = errdefs.ERRDESC
                return res.send(rs);
            })

        });
    },
    updatekpiparam: function (req, res) {
        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID
        data.pv_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "mt_kpiparam";
        data.p_refcursor = { dir: 3003, type: 2004 }
        //  data = commonUtil.convertPropsNullToEmpty(data);


        let obj = { model: data }


        processingserver.updatemodel(obj, function (err, rs) {

            ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {

                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM = errdefs.ERRDESC
                return res.send(rs);
            })

        });
    },
    deletekpiparam: function (req, res) {

        let data = {
            p_autoid: req.body.data.AUTOID,
            pv_objname: req.body.pv_objname,
            p_notes: '',
            p_yearcd: '',
            p_objtype: '',
            p_objvalue: '',
            p_scopetype: '',
            p_scopevalue: '',
            p_cyclecd: '',
            p_amtyy: '',
            p_amtq1: '',
            p_amtq2: '',
            p_amtq3: '',
            p_amtq4: '',
            p_status: '',
            pv_language: req.body.pv_language,
            pv_role: req.session.userinfo.ROLECODE,
            pv_tlid: req.session.userinfo.TLID,
        };

        data.MODELNAME = "mt_kpiparam";

        data = commonUtil.convertPropsNullToEmpty(data);

        let obj = { model: data }
        processingserver.deletemodel(obj, function (err, rs) {
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
        // }


    },
    getlistobjectkpi: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_objtype: data.p_objtype,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_objectkpi",
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

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.OBJCD,
                            label: item.OBJNAME,

                        }
                    })
                    return res.send(result1);
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
    getlistscopekpi: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_scopetype: data.p_scopetype,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_scopekpi",
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

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.OBJCD,
                            label: item.OBJNAME,

                        }
                    })
                    return res.send(result1);
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
    getlistmember_bytlid: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_member_bytlid",
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

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.MBID,
                            label: item.MBNAME,

                        }
                    })
                    return res.send(result1);
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
    getlistbrgrp_bymbid: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_mbid: data.p_mbid,
            p_language: data.p_language,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_brgrp_bymbid",
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

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.BRID,
                            label: item.BRNAME,

                        }
                    })
                    return res.send(result1);
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
    getlisttlprofiles_notin_grp: function (req, res) {
        let data = req.body.data;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {

            p_groupid: data.p_groupid,
            p_mbid: data.p_mbid,
            p_brid: data.p_brid,
            pv_tlid: TLID,
            pv_language: data.p_language,
            pv_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_tlprofiles_notin_grp",
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
    getlisttlprofiles_in_grp: function (req, res) {
        let data = req.body.data;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {

            p_groupid: data.p_groupid,
            p_mbid: data.p_mbid,
            p_brid: data.p_brid,
            pv_tlid: TLID,
            pv_language: data.p_language,
            pv_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_tlprofiles_in_grp",
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

    get_listgrp_notin: function (req, res) {
        let data = req.body.data;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_strtlid: data.p_strtlid,
            p_type: data.p_type,
            p_tlid: TLID,

            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_listgrp_notin",
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
    get_listgrp_in: function (req, res) {
        let data = req.body.data;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_strtlid: data.p_strtlid,
            p_type: data.p_type,
            p_tlid: TLID,

            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_listgrp_in",
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
    addtlgrpusers_list: function (req, res) {
        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID
        data.MODELNAME = "mt_tlgrpusers_list";
        data.p_refcursor = { dir: 3003, type: 2004 }
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

    addtlgrpusers_list_foruser: function (req, res) {
        let data = req.body;
        data.p_role = data.p_role;
        data.p_tlid = data.p_strtlid;
        data.pv_tlid = req.session.userinfo.TLID
        data.MODELNAME = "mt_tlgrpusers_list_foruser";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    getlistmarketinfo: function (req, res) {
        let data = req.body.data;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_autoid: data.p_autoid,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_marketinfo",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    addmarketinfo: function (req, res) {
        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID

        data.MODELNAME = "mt_marketinfo";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    updatemarketinfo: function (req, res) {
        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID
        data.MODELNAME = "mt_marketinfo";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    deletemarketinfo: function (req, res) {

        let data = {
            p_autoid: req.body.data.AUTOID,
            p_txdate: '',
            p_vnindex: '',
            p_hnxindex: '',
            p_vn30index: '',
            p_hnx30index: '',
            p_status: '',
            pv_language: req.body.p_language,
            pv_objname: req.body.pv_objname,
            pv_tlid: req.session.userinfo.TLID,
        };

        data.MODELNAME = "mt_marketinfo";

        data = commonUtil.convertPropsNullToEmpty(data);

        let obj = { model: data }
        let language = data.pv_language
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
        // }


    },
    getlistnav: function (req, res) {
        let data = req.body.data;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_txdate: data.p_txdate,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_navinfomanagement",
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
    getlistnavcuoithang: function (req, res) {
        let data = req.body.data;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_txdate: data.p_txdate,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_endmonthnav",
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
    getlistfeecuoithang: function (req, res) {
        let data = req.body.data;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_txdate: data.p_txdate,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_endmonthfee",
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
    getlistexpectnav: function (req, res) {
        let data = req.body.data;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_txdate: data.p_txdate,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_expectnavinfomanagement",
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
    addnav: function (req, res) {
        let data = req.body;

        data.p_tlid = req.session.userinfo.TLID
        data.p_role = req.session.userinfo.ROLECODE
        data.pv_objname = data.pv_objname
        data.p_actiontype = "ADD"
        data.MODELNAME = "navinfomation";
        data.p_refcursor = { dir: 3003, type: 2004 }
        data = commonUtil.convertPropsNullToEmpty(data);


        let obj = { model: data }


        processingserver.createmodel(obj, function (err, rs) {

            ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {

                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM = errdefs.ERRDESC
                return res.send(rs);
            })

        });
    },
    updatenav: function (req, res) {
        let data = req.body;
        sails.log(data)
        data.p_tlid = req.session.userinfo.TLID
        data.p_actiontype = "EDIT"
        data.p_role = req.session.userinfo.ROLECODE
        data.pv_objname = data.pv_objname
        data.MODELNAME = "navinfomation";
        data.p_refcursor = { dir: 3003, type: 2004 }
        data = commonUtil.convertPropsNullToEmpty(data);


        let obj = { model: data }


        processingserver.createmodel(obj, function (err, rs) {

            ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {

                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM = errdefs.ERRDESC
                return res.send(rs);
            })

        });
    },
    deletenav: function (req, res) {

        let data = {
            p_tradingid: req.body.TRADINGID,
            p_codeid: '',
            p_txdate: '',
            p_enav: '',
            p_totalenav: '',
            p_des: '',
            p_role: req.session.userinfo.ROLECODE,
            p_language: req.body.p_language,
            p_tlid: req.session.userinfo.TLID,
        };
        data.pv_objname = "NAV"
        data.MODELNAME = "navinfomation";

        data = commonUtil.convertPropsNullToEmpty(data);

        let obj = { model: data }
        processingserver.deletemodel(obj, function (err, rs) {
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
        // }


    },
    getlistfund_bytxdate: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_txdate: data.p_txdate,
            p_language: data.p_language,
            p_refcursor: { dir: 3003, type: 2004 },
            p_role: ROLECODE,
            p_tlid: TLID,
        }

        let obj =
        {
            "funckey": "prc_get_fund",
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

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.CODEID,
                            label: item.SYMBOL,

                        }
                    })
                    return res.send(result1);
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
    getlistsalestype: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;


        let rest = {
            p_autoid: data.p_autoid,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_rerole: data.p_rerole,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_sale_retype",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getsalescalculator: function (req, res) {
        let data = req.body;
        sails.log(req.body)
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_language: data.p_language,
            p_refcursor: { dir: 3003, type: 2004 },
            p_role: ROLECODE,
            p_tlid: TLID,
        }

        let obj =
        {
            "funckey": "prc_get_sale_calulator",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    delete rs.DT["p_refcursor"];
                    let dataAll = result;
                    let pv_sumRecord = result.length;
                    //phan trang
                    let { pagesize, page, keySearch, sortSearch } = data;
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
    getlistROLE_byRETYPE: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_retype: data.p_retype,
            p_language: data.p_language,
            p_refcursor: { dir: 3003, type: 2004 },
            p_role: ROLECODE,
            p_tlid: TLID,
        }

        let obj =
        {
            "funckey": "prc_get4role_sale_retype",
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

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.ROLEID,
                            label: item.ROLENAME,

                        }
                    })
                    return res.send(result1);
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
    getlistfeetypeid: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_language: data.p_language,
            p_refcursor: { dir: 3003, type: 2004 },
            p_role: ROLECODE,
            p_tlid: TLID,
        }

        let obj =
        {
            "funckey": "prc_get_drop_feetype",
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

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.VALUE,
                            label: item.LABEL,

                        }
                    })
                    return res.send(result1);
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
    addsale_retype: function (req, res) {
        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID


        data.MODELNAME = "mt_sale_retype";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    updatesale_retype: function (req, res) {
        let data = req.body;
        data.pv_tlid = req.session.userinfo.TLID


        data.MODELNAME = "mt_sale_retype";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    update_sale_calculator: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_autoid: data.p_autoid,
            p_saleid: data.p_saleid,
            p_saledate: data.p_s_saledate,
            p_feevaluereal: data.p_feevaluereal,
            p_feevaluebonus: data.p_feevaluebonus,
            p_diengiai: data.p_diengiai,
            p_tax: data.p_tax,
            p_language: req.body.p_language,
            p_role: req.session.userinfo.ROLECODE,
            pv_objname: req.body.pv_objname,
            pv_action: 'ADD'
        }

        let obj =
        {
            "funckey": "prc_sale_calculator_update",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                sails.log('err1:', err)
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    return res.send(rs);
                } else {
                    sails.log('err2:', rs)
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    deletesale_retype: function (req, res) {

        let data = {
            p_autoid: req.body.data.AUTOID,
            p_actype: '',
            p_typename: '',
            p_retype: '',
            p_reproduct: '',
            p_codeid: '',
            p_rerole: '',
            p_effdate: '',
            p_expdate: '',
            p_description: '',
            p_feetypeid: '',
            // p_ratedensity: '',
            p_role: req.session.userinfo.ROLECODE,
            pv_language: req.body.p_language,
            pv_tlid: req.session.userinfo.TLID,
            pv_objname: req.body.pv_objname
        };

        data.MODELNAME = "mt_sale_retype";

        data = commonUtil.convertPropsNullToEmpty(data);

        let obj = { model: data }
        let language = data.pv_language
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
        // }


    },
    getlistfocmdmenu_rights: function (req, res) {
        let data = req.body.data;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_grpid: data.p_grpid,
            pv_tlid: TLID,
            pv_role: ROLECODE,
            p_language: data.p_language,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_focmdmenu_rights",
            bindvar: rest
        }
        let language = data.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];

                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    assign_rights_group: function (req, res) {
        let data = req.body.data;


        let language = data.pv_language
        data.p_right_list = data.p_right_list.slice(0, data.p_right_list.length - 3)
        data.pv_tlid = req.session.userinfo.TLID
        data.pv_role = req.session.userinfo.ROLECODE
        data.pv_objname = req.body.pv_objname
        data.MODELNAME = "assign_rights_group";
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
    getlistvsdstatus: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;


        let rest = {
            p_custodycd: data.p_custodycd,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_vsdstatus",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    cf_account_opening_request: function (req, res) {
        let data = req.body;
        data.p_role = req.session.userinfo.ROLECODE
        data.p_tlid = req.session.userinfo.TLID
        data.MODELNAME = "cf_account_opening_request";
        data.p_refcursor = { dir: 3003, type: 2004 }
        data = commonUtil.convertPropsNullToEmpty(data);


        let obj = { model: data }

        let language = data.p_language
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

    getlistsemast_totransf: function (req, res) {
        let { data } = req.body;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.language,
            p_custodycd: data.p_custodycd,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_semast_totransf",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    setranfer_req: function (req, res) {

        let data = req.body;

        let language = data.p_language
        data.p_tlid = req.session.userinfo.TLID
        data.p_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "setranfer_req";
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
    getlistsetranfer_req: function (req, res) {
        let { TLID, ROLECODE } = req.session.userinfo;
        let { data } = req.body;
        let rest = {
            p_tlid: TLID,
            p_language: data.language,
            p_role: ROLECODE,
            p_custodycd: data.p_custodycd,
            p_refcursor: { dir: 3003, type: 2004 },
            p_autoid: data.p_autoid
        }

        let obj =
        {
            "funckey": "prc_get_setranfer_req",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    setranfer_reject: function (req, res) {

        let data = req.body;

        let language = data.p_language
        data.p_tlid = req.session.userinfo.TLID
        data.p_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "setranfer_reject";
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
    setranfer_confirm: function (req, res) {

        let data = req.body;

        let language = data.p_language
        data.p_tlid = req.session.userinfo.TLID
        data.p_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "setranfer_confirm";
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
    getlistbrgrp_bymbid_areaid: function (req, res) {
        let data = req.body.data;
        let rest = {
            p_mbid: data.p_mbid,
            p_areaid: data.p_areaid,
            p_language: data.p_language,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_brgrp_bymbid_areaid",
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

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.BRID,
                            label: item.BRNAME,

                        }
                    })
                    return res.send(result1);
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
    sereceive_req: function (req, res) {

        let data = req.body;
        let language = data.p_language
        let { TLID, ROLECODE } = req.session.userinfo;
        data.p_tlid = TLID
        data.p_role = ROLECODE

        data.MODELNAME = "sereceive_req";
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
    getlistorder4changerstatus: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
            p_orderid: data.p_orderid,
            p_custodycd: data.p_custodycd
        }

        let obj =
        {
            "funckey": "prc_get_order4changerstatus",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getoriginalorderimage: function (req, res) {
        let data = req.body.data;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_orderid: data.p_orderid,
            p_language: data.language,
        }
        let obj = {
            "funckey": "prc_sy_get_originalorder",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    fetchUnconfirmOrder: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            p_orderid: data.p_orderid,
            p_custodycd: data.p_custodycd
        }
        let obj =
        {
            "funckey": "prc_get_all_unconfirm_OTP_order",
            bindvar: rest
        }

        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                let dataAll = result;
                let pv_sumRecord = result.length;
                //phan trang
                let { pagesize, page, keySearch, sortSearch } = data;
                if (keySearch)
                    if (keySearch.length > 0)
                        result = await Paging.find(result, keySearch)

                let numOfPages = Math.ceil(result.length / pagesize);

                if (sortSearch)
                    if (sortSearch.length > 0)
                        result = await Paging.orderby(result, sortSearch)

                let filteredData = result;
                result = await Paging.paginate(result, pagesize, page ? page : 1)

                delete rs.DT["p_refcursor"];
                var DT = { data: result, numOfPages: numOfPages, sumRecord: pv_sumRecord, dataAll: dataAll, filteredData: filteredData }


                return res.send(Ioutput.success(DT));

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getChangeSessionOrders: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            p_custodycd: data.p_custodycd ? data.p_custodycd : '',
        }
        let obj =
        {
            "funckey": "prc_get_change_session_order",
            bindvar: rest
        }

        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                let dataAll = result;
                let pv_sumRecord = result.length;
                //phan trang
                let { pagesize, page, keySearch, sortSearch } = data;
                if (keySearch)
                    if (keySearch.length > 0)
                        result = await Paging.find(result, keySearch)

                let numOfPages = Math.ceil(result.length / pagesize);

                if (sortSearch)
                    if (sortSearch.length > 0)
                        result = await Paging.orderby(result, sortSearch)

                let filteredData = result;
                result = await Paging.paginate(result, pagesize, page ? page : 1)

                delete rs.DT["p_refcursor"];
                var DT = { data: result, numOfPages: numOfPages, sumRecord: pv_sumRecord, dataAll: dataAll, filteredData: filteredData }

                return res.send(Ioutput.success(DT));

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getlistorder2execute: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.language,
            p_custodycd: data.p_custodycd,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
            p_orderid: data.p_orderid
        }

        let obj =
        {
            "funckey": "prc_get_order2execute",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.DT.sumRecord = result.length;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    process_tx5017: function (req, res) {

        let data = req.body;
        let language = data.p_language
        let { TLID, ROLECODE } = req.session.userinfo;
        data.p_tlid = TLID
        data.p_role = ROLECODE

        data.MODELNAME = "process_tx5017";
        //  data.p_refcursor = { dir: 3003, type: 2004 }
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
    getlistrefundbyorder: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
            p_txdate: data.p_txdate
        }

        let obj =
        {
            "funckey": "prc_get_refundbyorder",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getlistrefundbyorderadd: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_orderid: data.p_orderid,
            p_custodycd: data.p_custodycd,
            p_language: data.p_language,
            p_refcursor: { dir: 3003, type: 2004 },
            p_role: ROLECODE,
            p_tlid: TLID,
        }

        let obj =
        {
            "funckey": "prc_get_refundbyorderadd",
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

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.ORDERID,
                            label: item.ORDERID,
                            fee: item.FEEAMT,
                            ordertype: item.SRTYPEDES

                        }
                    })
                    return res.send(result1);
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
    addrefundbyorder: function (req, res) {
        let data = req.body;

        data.p_tlid = req.session.userinfo.TLID
        data.p_role = req.session.userinfo.ROLECODE

        data.MODELNAME = "refundbyorder";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    updaterefundbyorder: function (req, res) {
        let data = req.body;
        data.pv_tlid = req.session.userinfo.TLID


        data.MODELNAME = "refundbyorder";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    deleterefundbyorder: function (req, res) {

        let data = {


            p_custodycd: req.body.data.AUTOID,
            p_orderid: '',
            p_namt: '',
            p_txdate: '',
            p_des: '',
            p_language: req.body.p_language,
            pv_objname: req.body.pv_objname
        };

        data.MODELNAME = "refundbyorder";

        data = commonUtil.convertPropsNullToEmpty(data);

        let obj = { model: data }
        let language = data.p_language
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
        // }


    },
    getlistrefundbyaccount: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
            p_custodycd: data.p_custodycd
        }

        let obj =
        {
            "funckey": "prc_get_refundbyaccount",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    addrefundbyaccount: function (req, res) {
        let data = req.body;

        data.p_tlid = req.session.userinfo.TLID
        data.p_role = req.session.userinfo.ROLECODE

        data.MODELNAME = "refundbyaccount";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    updaterefundbyaccount: function (req, res) {
        let data = req.body;
        data.pv_tlid = req.session.userinfo.TLID


        data.MODELNAME = "refundbyaccount";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    deleterefundbyaccount: function (req, res) {

        let data = {
            p_custodycd: req.body.data.AUTOID,
            p_namt: '',
            p_txdate: '',
            p_des: '',
            p_language: req.body.p_language,
            pv_objname: req.body.pv_objname
        };

        data.MODELNAME = "refundbyaccount";

        data = commonUtil.convertPropsNullToEmpty(data);

        let obj = { model: data }
        let language = data.p_language
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
        // }


    },
    process_tx5021: function (req, res) {

        let data = req.body;
        let language = data.p_language
        let { TLID, ROLECODE } = req.session.userinfo;
        data.p_tlid = TLID
        data.p_role = ROLECODE

        data.MODELNAME = "process_tx5021";
        //  data.p_refcursor = { dir: 3003, type: 2004 }
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
    getlistorder4cfchangerstatus: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
            p_orderid: data.p_orderid,
            p_custodycd: data.p_custodycd,
        }

        let obj =
        {
            "funckey": "prc_get_order4cfchangerstatus",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.DT.sumRecord = result.length;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    process_tx5026: function (req, res) {

        let data = req.body;
        let language = data.p_language
        let { TLID, ROLECODE } = req.session.userinfo;
        data.p_tlid = TLID
        data.p_role = ROLECODE

        data.MODELNAME = "process_tx5026";
        //  data.p_refcursor = { dir: 3003, type: 2004 }
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
    getnav: function (req, res) {
        let data = req.body.data;


        let rest = {
            p_codeid: data.p_codeid,
        }
        try {
            let obj =
            {
                "funckey": "prc_get_enav",
                bindvar: rest
            }
            processingserver.callAPI(obj, function (err, rs) {

                if (err) {
                    return res.send(Utils.removeException(err));
                }
                try {
                    return res.send(rs);
                } catch (error) {
                    rs.EM = 'Lỗi client gọi api';
                    rs.EC = -1000;
                    return res.send(rs)
                }
            });
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },
    getFRAMT: function (req, res) {
        let data = req.body.data;


        let rest = {
            p_reviewtermid: data.p_reviewtermid,
            p_applycd: data.p_applycd,
        }
        try {
            let obj =
            {
                "funckey": "prc_get_reviewparam_framt",
                bindvar: rest
            }
            processingserver.callAPI(obj, function (err, rs) {

                if (err) {
                    return res.send(Utils.removeException(err));
                }
                try {
                    return res.send(rs);
                } catch (error) {
                    rs.EM = 'Lỗi client gọi api';
                    rs.EC = -1000;
                    return res.send(rs)
                }
            });
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },
    getlistsale_ordersmap: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_saleid: data.p_saleid,
            p_language: data.language,
            p_role: ROLECODE,
            p_custodycd: data.p_custodycd,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_sale_ordersmap",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;

                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getlistsale_roles: function (req, res) {
        let data = req.body;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_saleid: data.p_saleid,
            p_language: data.p_language,
            p_refcursor: { dir: 3003, type: 2004 },
            p_role: ROLECODE,
            p_tlid: TLID,
        }

        let obj =
        {
            "funckey": "prc_get_sale_roles",
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

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.SALEID,
                            label: item.TLNAME,
                            saleacctno: item.SALEACCTNO,
                            text: item.TLFULLNAME,
                            typeid: item.RETYPE,
                            type: item.TYPENAME,
                            roleid: item.REROLE,
                            productid: item.REPRODUCT,
                            role_product: item.REROLEDES + '-' + item.REPRODUCTDES

                        }
                    })
                    return res.send(result1);
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
    getlistsale_roles_alt: function (req, res) {
        let data = req.body;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_saleid: data.p_saleid,
            p_language: data.p_language,
            p_refcursor: { dir: 3003, type: 2004 },
            p_role: ROLECODE,
            p_tlid: TLID,
        }

        let obj =
        {
            "funckey": "prc_get_sale_roles_alt",
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

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.SALEID,
                            label: item.TLNAME,
                            text: item.TLFULLNAME,
                            // saleacctno: item.SALEACCTNO,
                            // text: item.TLFULLNAME,
                            // typeid: item.RETYPE,
                            // type: item.TYPENAME,
                            // roleid: item.REROLE,
                            // productid: item.REPRODUCT,
                            // role_product: item.REROLEDES + '-' + item.REPRODUCTDES

                        }
                    })
                    return res.send(result1);
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
    getlistsalestype_cb: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_autoid: data.p_autoid,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_rerole: data.p_rerole,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_sale_retype",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    delete rs.DT["p_refcursor"];

                    rs.DT.data = result;

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.AUTOID,
                            label: item.TYPENAME,
                            role: item.REROLEDES,
                            product: item.REPRODUCTDES
                        }
                    })
                    return res.send(result1);
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
    getbankinfo: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_srtype: data.srtype,
            p_codeid: data.codeid,
            p_tlid: TLID,
            p_language: data.language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_getbankinfo",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    delete rs.DT["p_refcursor"];

                    rs.DT.data = result;

                    // result1 = rs.DT.data.map((item) => {
                    //     return {

                    //         value: item.AUTOID,
                    //         label: item.TYPENAME,
                    //         role: item.REROLEDES,
                    //         product: item.REPRODUCTDES
                    //     }
                    // })
                    return res.send(rs);
                } else {
                    return res.send(rs);
                }
            } catch (error) {
                sails.log(error)
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    prc_sale_ordersmap: function (req, res) {

        let data = req.body;
        let language = data.p_language
        let { TLID, ROLECODE } = req.session.userinfo;
        data.p_tlid = TLID
        data.p_role = ROLECODE

        data.MODELNAME = "sale_ordersmap";
        //  data.p_refcursor = { dir: 3003, type: 2004 }
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
    getlistbatcheod: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_txdate: data.p_txdate,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_batcheod",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getlistbatcheod_success: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_txdate: data.p_txdate,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_batcheod_success",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    batch_pr_batch: function (req, res) {
        let data = {
            p_apptype: req.body.data.APPTYPE,
            p_bchmdl: req.body.data.BCHMDL,
            p_txdate: req.body.p_txdate,
            pv_tlid: req.session.userinfo.TLID,
            pv_language: req.body.p_language,
            pv_objname: req.body.pv_objname,
        };



        data = commonUtil.convertPropsNullToEmpty(data);
        let obj =
        {
            "funckey": "txpks_batch_pr_batch",
            bindvar: data
        }
        let language = data.pv_language
        processingserver.callAPI(obj, async function (err, rs) {

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
        // }


    },
    getlistsale_groups: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_autoid: data.p_autoid,
            p_role: ROLECODE,
            p_tlid: TLID,
            p_language: data.p_language,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_sale_groups",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    delete rs.DT["p_refcursor"];

                    rs.DT.data = result;

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.AUTOID,
                            label: item.AUTOID + '-' + item.FULLNAME,
                            manager: item.MANAGERTLNAME,

                        }
                    })
                    return res.send(result1);
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
    getlistsale_managers: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_saleid: data.p_saleid,
            p_language: data.language,
            p_role: ROLECODE,
            p_tlid: TLID,
            p_refcursor: { dir: 3003, type: 2004 },


        }

        let obj =
        {
            "funckey": "prc_get_sale_managers",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    move_sale_managers: function (req, res) {
        let data = {
            p_newgrpid: req.body.p_newgrpid,
            p_oldgrpid: req.body.p_oldgrpid,
            p_saleid: req.body.data.SALEID,
            p_saleacctno: req.body.p_saleacctno,
            p_desc: '',
            pv_action: '',
            p_tlid: req.session.userinfo.TLID,
            p_role: req.session.userinfo.ROLECODE,
            p_language: req.body.p_language,
            pv_objname: req.body.pv_objname,
        };


        data.MODELNAME = "move_sale_managers";
        data = commonUtil.convertPropsNullToEmpty(data);

        let obj = { model: data }
        let language = data.p_language
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
        // }


    },
    getlistcamast: function (req, res) {
        let { ROLECODE, TLID } = req.session.userinfo;
        let { data } = req.body;
        let rest = {
            p_autoid: data.p_autoid,
            p_language: data.language,
            p_role: ROLECODE,
            p_status: 'A',
            p_tlid: TLID,
            p_refcursor: { dir: 3003, type: 2004 },


        }

        let obj =
        {
            "funckey": "prc_get_camast",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    addcamast: function (req, res) {
        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID
        data.pv_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "mt_camast";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    updatecamast: function (req, res) {
        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID
        data.pv_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "mt_camast";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    deletecamast: function (req, res) {

        let data = {
            p_autoid: req.body.data.AUTOID,
            p_camastid: '',
            p_catype: '',
            p_codeid: '',
            p_isincode: '',
            p_reportdate: '',
            p_duedate: '',
            p_rate: '',
            p_description: '',
            pv_tlid: req.session.userinfo.TLID,
            pv_language: req.body.p_language,
            pv_objname: req.body.pv_objname,
            pv_role: req.session.userinfo.ROLECODE
        };


        data.MODELNAME = "mt_camast";
        data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }
        let language = data.pv_language
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
        // }


    },
    getlistsale_customers: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_saleid: data.p_saleid,
            p_language: data.language,
            p_role: ROLECODE,
            p_tlid: TLID,
            p_refcursor: { dir: 3003, type: 2004 },


        }

        let obj =
        {
            "funckey": "prc_get_sale_customers",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.DT.sumRecord = result.length;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    get_current_sale: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            p_refacctno: data.refacctno
        }

        let obj =
        {
            "funckey": "prc_get_current_sale",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                result = resultdata.map(item => {
                    return {
                        value: item.SALEID,
                        label: item.REFACCTNO
                    };
                });
                // console.log('result loai hinh tach value', resultdata)
                return res.send({ resultdata, result });

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(error)
            }
        });
    },
    get_all_sale_rm: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_custodycd: data.custodycd,
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language
        }

        let obj =
        {
            "funckey": "prc_get_all_sale_rm",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                resultdata = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                result = resultdata.map(item => {
                    return {
                        value: item.SALEID,
                        label: item.SALEID + '-' + item.TLFULLNAME
                    };
                });
                // console.log('result loai hinh tach value', resultdata)
                return res.send({ resultdata, result });

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(error)
            }
        });
    },
    get_list_customer_reg_changesale: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            p_objname: data.OBJNAME,
        }

        let obj =
        {
            "funckey": "prc_get_list_customer_reg_changesale",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                result = ConvertData.convert_to_Object(rs.DT.p_refcursor);

                let pv_sumRecord = result.length;
                sails.log('pv_sumRecord:', pv_sumRecord)
                let dataAll = result;
                //phan trang
                let { pagesize, page, keySearch, sortSearch } = req.body;

                //console.log("sortSearch  >>", sortSearch)

                if (keySearch)
                    if (keySearch.length > 0)
                        result = await Paging.find(result, keySearch);

                let numOfPages = Math.ceil(result.length / pagesize);

                if (sortSearch)
                    if (sortSearch.length > 0)
                        //console.log('huhuh sortsearch')
                        result = await Paging.orderby(result, sortSearch);
                result = await Paging.paginate(result, pagesize, page ? page : 1);

                delete rs.DT["p_refcursor"];
                var DT = {
                    data: result,
                    numOfPages: numOfPages,
                    sumRecord: pv_sumRecord,
                    dataAll: dataAll
                };
                let result1 = DT.data.map((item) => {
                    return {
                        ...item,
                        tlidnameold: item.SALEID_OLD + '-' + item.OLDSALENAME,
                        tlidnamenew: item.SALEID_NEW + '-' + item.NEWSALENAME,
                        value: item.SALEID_NEW,
                        label: item.SALEID_NEW + '-' + item.NEWSALENAME,
                    }
                })

                DT.data = result1;

                return res.send(Ioutput.success(DT));
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(error)
            }
        });
    },




    move_sale_customers: function (req, res) {
        let data = req.body;

        data.p_tlid = req.session.userinfo.TLID
        data.p_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "move_sale_customers";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    getlistsaleintlprofiles: function (req, res) {
        let data = req.body;


        let rest = {
            p_retype: data.p_retype,
            p_rerole: data.p_rerole,
            p_language: data.p_language,
            p_reproduct: data.p_reproduct,
            p_refcursor: { dir: 3003, type: 2004 },
            p_role: req.session.userinfo.ROLECODE,
            p_tlid: req.session.userinfo.TLID,
        }

        let obj =
        {
            "funckey": "prc_get_sales",
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

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.SALEID,
                            label: item.TLNAME,
                            text: item.TLFULLNAME,


                        }
                    })

                    return res.send(result1);
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
    getlistretype_by_saleid: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_saleid: data.p_saleid,
            p_reproduct: data.p_reproduct,
            p_retype: data.p_retype,
            p_rerole: data.p_rerole,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_rerole: data.p_rerole,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_retype_by_saleid",
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

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.AUTOID,
                            label: item.TYPENAME,
                            role: item.REROLEDESC,
                            product: item.REPRODUCTDESC,
                            //saleacctno: item.SALEACCTNO,
                        }
                    })

                    return res.send(result1);
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
    getlistmove_sale_managers: function (req, res) {
        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_saleid: data.p_saleid,
            p_language: data.language,
            p_role: ROLECODE,
            p_tlid: TLID,
            p_refcursor: { dir: 3003, type: 2004 },


        }

        let obj =
        {
            "funckey": "prc_get_move_sale_managers",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.DT.sumRecord = result.length;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getlisttraddingsession: function (req, res) {
        let data = req.body.data;


        let rest = {

            p_codeid: data.p_codeid,
            p_tradingid: data.p_tradingid,
            p_language: data.p_language,
            p_refcursor: { dir: 3003, type: 2004 },
            p_role: req.session.userinfo.ROLECODE,
            p_tlid: req.session.userinfo.TLID,
        }

        let obj =
        {
            "funckey": "prc_get_traddingsession",
            bindvar: rest
        }
        processingserver.callAPI(obj, function (err, rs) {
            // console.log('re', rs)
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    delete rs.DT["p_refcursor"];

                    rs.DT.data = result;

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: rest.p_tradingid == '' ? item.TRADINGID : item.TRADINGDATE,
                            label: rest.p_tradingid == '' ? item.TRADINGID : item.TRADINGDATE,



                        }
                    })
                    return res.send(result1);
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
    getlistalert4account: function (req, res) {
        let pv_tlid = ''
        let pv_role = ''
        try {
            let { TLID, ROLECODE } = req.session.userinfo;
            pv_tlid = TLID;
            pv_role = ROLECODE;
        } catch (error) {
            let rs = {}
            rs.EM = 'Lỗi lấy dữ liệu userinfo';
            rs.EC = -1001;
            return res.send(rs)
        }
        let data = req.body;
        let rest = {
            p_refid: data.custodycd,
            p_language: data.language,
            p_role: pv_role,
            p_tlid: pv_tlid,
            p_refcursor: { dir: 3003, type: 2004 },


        }

        let obj =
        {
            "funckey": "prc_get_alert4account",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    deleteNotiBell: function (req, res) {
        let data = {};

        data.MODELNAME = "deletealert";
        data.p_autoid = req.body.p_autoid
        data.p_refid = req.body.p_refid
        data = commonUtil.convertPropsNullToEmpty(data);


        let obj = { model: data }

        let language = req.body.language
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

        });
    },
    SeenNoti: function (req, res) {
        let data = req.body;
        let rest = {
            p_refautoid: data.p_autoid,
            p_refid: data.p_refid,



        }

        let obj =
        {
            "funckey": "prc_markalert",
            bindvar: rest
        }
        //   let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {


            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                // let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                // delete rs.DT["p_refcursor"];
                //  rs.DT.data = result;
                // rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getlistcamastblock: function (req, res) {
        let { data } = req.body;
        let { ROLECODE, TLID } = req.session.userinfo;
        let rest = {
            p_autoid: data.p_autoid,
            p_language: data.language,
            p_role: ROLECODE,
            p_status: 'A',
            p_tlid: TLID,
            p_refcursor: { dir: 3003, type: 2004 },


        }

        let obj =
        {
            "funckey": "prc_get_camast",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getlistcamastcancel: function (req, res) {
        let { data } = req.body;
        let { ROLECODE, TLID } = req.session.userinfo;
        let rest = {
            p_autoid: data.p_autoid,
            p_language: data.language,
            p_role: ROLECODE,
            p_status: 'N',
            p_tlid: TLID,
            p_refcursor: { dir: 3003, type: 2004 },


        }

        let obj =
        {
            "funckey": "prc_get_camast",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },

    approve_camast: function (req, res) {
        let data = req.body;

        data.p_tlid = req.session.userinfo.TLID
        data.p_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "approve_camast";
        data = commonUtil.convertPropsNullToEmpty(data);


        let obj = { model: data }

        let language = data.p_language
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
    cancel_camast: function (req, res) {
        let data = req.body;

        data.p_tlid = req.session.userinfo.TLID
        data.p_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "cancel_camast";
        data = commonUtil.convertPropsNullToEmpty(data);


        let obj = { model: data }

        let language = data.p_language
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
    getExpectedSellOrder: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_custodycd: data.p_custodycd,
            p_codeid: data.p_codeid,
            p_srtype: data.p_srtype,
            p_qtty: data.p_qtty,
            p_tlid: TLID,
            p_tlname: '',
            p_role: ROLECODE,
            p_language: data.p_language,
        }
        let obj = {
            "funckey": "prc_get_estimate_sellorder",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    precheckCalcExpectedSellOrder: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_custodycd: data.p_custodycd,
            p_codeid: data.p_codeid,
            p_srtype: data.p_srtype,
            p_qtty: data.p_qtty,
            p_tlid: TLID,
            p_tlname: '',
            p_role: ROLECODE,
            p_language: data.p_language,
        }
        let obj = {
            "funckey": "prc_precheck_estimate_sellorder",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {
            rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
            return res.send(rs);
        });
    },
    getlisportfolio: function (req, res) {
        let pv_tlid = ''
        let pv_role = ''
        let pv_userid = ''
        try {
            let { TLID, ROLECODE, USERID } = req.session.userinfo;
            pv_tlid = TLID;
            pv_role = ROLECODE;
            pv_userid = USERID;
        } catch (error) {
            let rs = {}
            rs.EM = 'Lỗi lấy dữ liệu userinfo';
            rs.EC = -1001;
            return res.send(rs)
        }
        let data = req.body.keySearch;
        // console.log('ha check controller ndt: ', req.body)
        let rest = {
            p_type: req.body.type,
            p_custodycd: data.p_custodycd,
            p_codeid: data.p_codeid,
            p_role: pv_role,
            p_tlid: pv_tlid,
            p_tlname: pv_userid,
            //p_objname: req.body.OBJNAME,
            p_language: data.p_language,
            p_refcursor: { dir: 3003, type: 2004 },
        }

        let obj =
        {
            "funckey": "prc_get_portfolio",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let count = 0;
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                if (req.body.type = '2') {

                    //off logic check giá trị nhỏ hơn 0 đối với table CCQ còn nắm giữ
                    // for (count = 0; count <result.length; count++ ){
                    //     if (parseFloat(result[count].PER_PROFIT) < 0){
                    //         result[count].PER_PROFIT_NAM = ''
                    //     } 
                    // }
                }
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getlisportfolioexpectnav: function (req, res) {
        let pv_tlid = ''
        let pv_role = ''
        let pv_userid = ''
        try {
            let { TLID, ROLECODE, USERID } = req.session.userinfo;
            pv_tlid = TLID;
            pv_role = ROLECODE;
            pv_userid = USERID;
        } catch (error) {
            let rs = {}
            rs.EM = 'Lỗi lấy dữ liệu userinfo';
            rs.EC = -1001;
            return res.send(rs)
        }
        let data = req.body.keySearch;
        let rest = {
            p_type: req.body.type,
            p_custodycd: data.p_custodycd,
            p_codeid: data.p_codeid,
            p_language: data.p_language,
            p_role: pv_role,
            p_tlid: pv_tlid,
            p_tlname: pv_userid,
            p_refcursor: { dir: 3003, type: 2004 },
            p_objname: req.body.OBJNAME,

        }

        let obj =
        {
            "funckey": "prc_get_portfolio_expect_nav",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                if (req.body.type = '2') {
                    for (count = 0; count < result.length; count++) {
                        if (parseFloat(result[count].PER_PROFIT) < 0) {
                            result[count].PER_PROFIT_NAM = ''
                        }
                    }
                }
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getlistarea: function (req, res) {

        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_mbid: data.p_mbid,
            p_areaid: data.p_areaid,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_areas",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    addarea: function (req, res) {

        let data = req.body;
        data.pv_tlid = req.session.userinfo.TLID
        data.pv_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "mt_areas";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    updatearea: function (req, res) {
        let data = req.body;
        data.pv_tlid = req.session.userinfo.TLID
        data.pv_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "mt_areas";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    deletearea: function (req, res) {
        let data = {

            p_areaid: req.body.data.AREAID,
            p_areaname: '',
            p_areaname_en: '',
            p_mbid: '',
            p_legalperson: '',
            p_phone: '',
            p_email: '',
            pv_tlid: req.session.userinfo.TLID,
            pv_role: req.session.userinfo.ROLECODE,
            pv_language: req.body.p_language,
            pv_objname: req.body.pv_objname,
        };


        data.MODELNAME = "mt_areas";
        data = commonUtil.convertPropsNullToEmpty(data);

        let obj = { model: data }
        let language = data.pv_language
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
        // }


    },
    getlistareas_bymbid: function (req, res) {
        let data = req.body.data;
        //console.log(req.body)

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_mbid: data.p_mbid,
            p_type: data.p_type,
            p_language: data.p_language,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_areas_bymbid",
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

                    result1 = rs.DT.data.map((item) => {
                        return {

                            value: item.AREAID,
                            label: item.AREANAME,

                        }
                    })
                    return res.send(result1);
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
    ExportTemplates: function (req, res) {

        let rest = {
            p_custodycd: '999C000001',
            p_refcursor: { dir: 3003, type: 2004 },
            p_refcursor2: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_test",
            bindvar: rest
        }

        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                let result1 = ConvertData.convert_to_Object(rs.DT.p_refcursor2);
                delete rs.DT["p_refcursor2"];
                fs.readFile(path.join('//' + sails.config.WEBUSER_HOST + '/Reports', 'templates', 'template1.xlsx'), function (err, data) {

                    var template = new XlsxTemplate(data);
                    // Replacements take place on first sheet
                    var sheetNumber = 1;
                    // Set up some placeholder values matching the placeholders in the template
                    var values = result[0]
                    values.datagrid = result1

                    // Perform substitution
                    template.substitute(sheetNumber, values);
                    // Get binary data
                    var data = template.generate();

                    return res.send(data)
                })

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });

    },
    bb: function (req, res) {
        var oldtext = "OLD";
        var newtext = "NEW";
        var workbook = XLSX.readFile(path.join(__dirname, 'templates', 'template1.xlsx')); // parse the file
        var sheet = workbook.Sheets[workbook.SheetNames[0]]; // get the first worksheet

        /* loop through every cell manually */
        var range = XLSX.utils.decode_range(sheet['!ref']); // get the range
        for (var R = range.s.r; R <= range.e.r; ++R) {
            for (var C = range.s.c; C <= range.e.c; ++C) {
                /* find the cell object */
                var cellref = XLSX.utils.encode_cell({ c: C, r: R }); // construct A1 reference for cell
                if (!sheet[cellref]) continue; // if cell doesn't exist, move on
                var cell = sheet[cellref];

                /* if the cell is a text cell with the old string, change it */
                if (!(cell.t == 's' || cell.t == 'str')) continue; // skip if cell is not text
                if (cell.v === oldtext) cell.v = newtext; // change the cell value
            }
        }
        return res.send(workbook);
    },
    cc: function (req, res) {
        /*
        fs.readFile(path.join('//'+sails.config.REDIS_HOST+'/Reports', 'templates', 'template.html'), function(error, data) {
            if (error) {
                response.writeHead(404);
                response.write('File not found!');
            } else {
               // response.write(data);
               //console.log('data',data.toString('utf8'))
            }
            response.end();
        })
    


   var compiled = ejs.compile(fs.readFileSync(path.join('//'+sails.config.REDIS_HOST+'/Reports', 'templates', 'T2017E.html'), 'utf8'));
var html = compiled({ title : 'EJS', text : 'Hello, World!',data:[{id:'1',name:'vih'},{id:'2',name:'vih2'},{id:'3',name:'vih3'},{id:'4',name:'vih4'},] });
   //console.log('html',html)
   pdf.create(html).toFile('./busine1sscard.pdf', function(err, res) {
    if (err) return //console.log(err);
    //console.log(res); // { filename: '/app/businesscard.pdf' }
  });
   return res.send(html);
*/


        /*
                let rest = {
                    p_custodycd: '999C000001',
        
                    p_refcursor1: { dir: 3003, type: 2004 },
                    p_refcursor2: { dir: 3003, type: 2004 },
                    p_refcursor3: { dir: 3003, type: 2004 },
                    p_refcursor4: { dir: 3003, type: 2004 },
                    p_refcursor5: { dir: 3003, type: 2004 },
                    p_refcursor6: { dir: 3003, type: 2004 },
                    p_refcursor7: { dir: 3003, type: 2004 },
                    p_refcursor8: { dir: 3003, type: 2004 },
                    p_refcursor9: { dir: 3003, type: 2004 },
                    p_refcursor10: { dir: 3003, type: 2004 },
                }
        
                let obj =
                {
                    "funckey": "prc_send_weeklynavemail",
                    bindvar: rest
                }
        
                processingserver.callAPI(obj, async function (err, rs) {
        
                    if (err) {
                        return res.send(Utils.removeException(err));
                    }
                    try {
                        var len = Object.keys(rs.DT).length - 2
                        var objbuild = {}
                        for (let index = 1; index <= len; index++) {
                            var cursor = 'p_refcursor' + index
                            var data = 'data' + index
                            objbuild[data] = ConvertData.convert_to_Object(rs.DT[cursor]);
        
        
                        }
        
        
                        try {
        
        
                            var compiled = ejs.compile(fs.readFileSync(path.join('//' + sails.config.WEBUSER_HOST + '/Reports', 'templates', 'T316E.html'), 'utf8'));
                            var html = compiled(objbuild);
        
                            pdf.create(html).toFile('./busine1sscard.pdf', function (err, res) {
                                if (err) return
        
                            });
                            return res.send(html);
                        } catch (error) {
        
                        }
        
                    } catch (error) {
                        rs.EM = 'Lỗi client gọi api';
                        rs.EC = -1000;
                        return res.send(rs)
                    }
                });
                */
    },
    getlist_import_compare_orders: function (req, res) {

        let data = req.body.data;

        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_filecode: data.p_filecode,
            p_fileid: data.p_fileid,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_import_compare_orders",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];

                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    file_compare: function (req, res) {
        let data = req.body;

        data.p_tlid = req.session.userinfo.TLID
        data.MODELNAME = "file_compare";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    getlistfile_getdatacompare: function (req, res) {
        let data = req.body;
        //console.log('data', data)
        let { TLID } = req.session.userinfo;


        let rest = {
            p_filecode: data.p_filecode,
            p_fileid: data.p_fileid,
            p_symbol: data.p_symbol,
            p_tradingdate: data.p_tradingdate,
            p_language: data.p_language,
            p_objname: data.p_objname,
            p_tlid: TLID,
            p_refcursor: { dir: 3003, type: 2004 },


        }

        let obj =
        {
            "funckey": "prc_file_getdatacompare",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {


            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    file_compare_confirm: function (req, res) {
        let data = req.body;

        data.p_tlid = req.session.userinfo.TLID
        data.MODELNAME = "file_compare_confirm";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    get_rptfile_bycustodycd: function (req, res) {
        let data = req.body;
        //console.log('data', data)



        let rest = {
            p_custodycd: data.p_custodycd,
            p_rptid: data.p_rptid,
            p_refcursor: { dir: 3003, type: 2004 },
            p_autoid: data.p_autoid

        }

        let obj =
        {
            "funckey": "prc_get_rptfile_bycustodycd_manageracct",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getOrderdBookAll: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_custodycd: data.custodycd,
            p_codeid: data.codeid,
            p_tlid: TLID,
            p_role: ROLECODE,
            p_exectype: data.exectype,
            p_srtype: data.srtype,
            p_language: data.language,
            p_frdate: data.frdate,
            p_todate: data.todate,
            p_dbcode: data.dbcode ? data.dbcode : '',
        }
        //console.log("getOrderdBookAll", rest)
        let obj =
        {
            "funckey": "prc_get_orderdbookall",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                //console.log(".....", rs)

                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    let pv_sumRecord = result.length;
                    //phan trang
                    let { pagesize, page, keySearch, sortSearch } = req.body;
                    let i = 0;
                    if (keySearch)
                        if (keySearch.length > 0) {
                            for (i = 0; i < keySearch.length; i++) {
                                if (keySearch[i].id == 'EXECTYPE_DESC' || keySearch[i].id == 'SYMBOL' || keySearch[i].id == 'CUSTODYCD' || keySearch[i].id == 'SESSIONNO') {
                                    keySearch[i].value = (keySearch[i].value).toUpperCase();
                                }
                            }
                            result = await Paging.find(result, keySearch)
                        }



                    let numOfPages = Math.ceil(result.length / pagesize);
                    //search theo tung cot
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
    get_tlprofiles_bytlname: function (req, res) {
        let data = req.body;

        let { TLID, ROLECODE } = req.session.userinfo;

        let rest = {
            p_tlname: '',
            p_language: data.p_language,
            p_tlid: TLID,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
        }

        let obj =
        {
            "funckey": "prc_get_tlprofiles_bytlname",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {


            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];

                result1 = result.map((item) => {
                    return {
                        value: item.TLNAME,
                        label: item.TLNAME,
                        fulldetails: item

                    }
                })
                rs.DT.data = result1;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    resetpassuser: function (req, res) {
        let data = req.body;
        data.p_tlid = data.p_resettlid
        delete data["p_resettlid"]
        data.pv_tlid = req.session.userinfo.TLID
        data.p_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "resetpassword_2021";
        data.p_refcursor = { dir: 3003, type: 2004 }
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
    getlistMThistory: function (req, res) {

        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: req.body.data.p_language,
            p_role: ROLECODE,
            p_txnum: req.body.data.p_txnum,
            p_txdate: req.body.data.p_txdate,
            p_brid: '',
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_objlogdtlall",
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
                    rs.DT.sumRecord = result.length;
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
    getlistTXhistory: function (req, res) {
        let { TLID, ROLECODE } = req.session.userinfo;

        let rest = {
            p_tlid: TLID,
            p_language: req.body.data.p_language,
            p_role: ROLECODE,
            p_txnum: req.body.data.p_txnum,
            p_txdate: req.body.data.p_txdate,
            p_brid: '',
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_tllogfldall",
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
    getlisttranshistory: async function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_txdate: data.p_txdate,
            p_searchfilter: data.p_searchfilter,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }
        //console.log('check rest ????>>>>', rest)
        let obj =
        {
            "funckey": "prc_getussearchall",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {
            //console.log('check rs rs rs rs ????>>>>', rs)

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },

    fetchOrderAmtInfo: async function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_custodycd: data.custodycd,
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language
        }
        let obj =
        {
            "funckey": "prc_get_orderamt_info",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                var i, sumORDERAMT;
                if (rs.EC == 0) {
                    sumORDERAMT = 0;
                    let resBack1 = [];
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    for (i = 0; i < result.length; i++) {
                        if (result[i].ORDERAMOUNT != "0.000") {
                            resBack1.push(result[i])
                        }
                    }
                    result = resBack1;
                    for (i = 0; i < result.length; i++) {
                        sumORDERAMT = sumORDERAMT + parseFloat(result[i].ORDERAMOUNT);

                    }
                    rs.DT = result;
                    rs.sumORDERAMT = sumORDERAMT;
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
    fetchBalanceInfo: async function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_custodycd: data.custodycd,
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language
        }
        let obj =
        {
            "funckey": "prc_get_balance_info",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                var i, sumBALANCEAMT, sumBLOCKEDAMT, sumRECEIVINGAMT;
                if (rs.EC == 0) {
                    sumBALANCEAMT = 0;
                    sumBLOCKEDAMT = 0;
                    sumRECEIVINGAMT = 0;
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    for (i = 0; i < result.length; i++) {
                        sumBALANCEAMT = sumBALANCEAMT + parseFloat(result[i].BALANCEAMT);
                        sumBLOCKEDAMT = sumBLOCKEDAMT + parseFloat(result[i].BLOCKEDAMT);
                        sumRECEIVINGAMT = sumRECEIVINGAMT + parseFloat(result[i].RECEIVINGAMT);

                    }
                    rs.DT = result;
                    rs.sumBALANCEAMT = sumBALANCEAMT;
                    rs.sumBLOCKEDAMT = sumBLOCKEDAMT;
                    rs.sumRECEIVINGAMT = sumRECEIVINGAMT;
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
    fetchAccountList: async function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE, USERID } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_username: data.username,
            p_tlid: TLID,
            p_role: ROLECODE,
            p_userid: USERID,
            p_language: data.language
        }
        let obj =
        {
            "funckey": "prc_get_account_by_username",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    var i;
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    let resback = result.map((item) => {
                        return {
                            ...item,
                            value: item.CUSTODYCD,
                            label: item.CUSTODYCD + '-' + item.FULLNAME

                        }
                    })
                    let response = {}
                    response.data = resback;
                    response.firstValue = resback[0]
                    return res.send(Ioutput.success(response));
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
    prc_get_fixed_ordertype: async function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language
        }
        let obj =
        {
            "funckey": "prc_get_fixed_ordertype",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    var i;
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    let resback = result.map((item) => {
                        return {
                            ...item,
                            value: item.CDVAL,
                            label: item.CDCONTENT

                        }
                    })
                    let response = {}
                    response.data = resback;
                    response.firstValue = resback[0]
                    return res.send(Ioutput.success(response));

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
    getSoDuCCQ: async function (req, res) {

        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_custodycd: data.custodycd,
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language
        }

        let obj =
        {
            "funckey": "prc_get_soduccq",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let resBack1 = [];
                    var i;
                    rs.DT = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    let result = rs.DT;
                    // let result = rs.DT.map((item) => {
                    //     return {
                    //         ...item,
                    //         AMT: parseInt(item.NAV) * parseInt(item.AMOUNT)

                    //     }
                    // })
                    for (i = 0; i < result.length; i++) {
                        if (result[i].AMOUNT != "0.0000") {
                            resBack1.push(result[i])
                        }
                    }
                    let resBack = resBack1;
                    return res.send(Ioutput.success(resBack));
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
    getsoduccqexpectnav: async function (req, res) {

        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_custodycd: data.custodycd,
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language
        }

        let obj =
        {
            "funckey": "prc_get_soduccq_expect_nav",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let resBack1 = [];
                    var i;
                    rs.DT = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    let result = rs.DT;
                    // let result = rs.DT.map((item) => {
                    //     return {
                    //         ...item,
                    //         AMT: parseInt(item.NAV) * parseInt(item.AMOUNT)

                    //     }
                    // })
                    for (i = 0; i < result.length; i++) {
                        if (result[i].AMOUNT != "0.0000") {
                            resBack1.push(result[i])
                        }
                    }
                    let resBack = resBack1;
                    return res.send(Ioutput.success(resBack));
                } else {
                    return res.send(rs);
                }
            } catch (error) {
                sails.log(error)
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    insert_customerreg: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            p_refacctno: data.refacctno,
            p_saleid_old: data.saleid_old,
            p_saleid_new: data.saleid_new
        }

        let obj =
        {
            "funckey": "prc_insert_customerregistersale",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                sails.log('err1:', err)
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    return res.send(rs);
                } else {
                    sails.log('err2:', rs)
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    insert_endmonth_nav: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            p_codeid: data.p_codeid,
            p_endofmonth: data.p_endofmonth,
            p_endmonth_nav: data.p_endmonth_nav,
            p_endmonth_navamount: data.p_endmonth_navamount,
        }

        let obj =
        {
            "funckey": "prc_insert_endmonthnav",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                sails.log('err1:', err)
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    return res.send(rs);
                } else {
                    sails.log('err2:', rs)
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    update_endmonth_nav: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            p_codeid: data.p_codeid,
            p_endofmonth: data.p_endofmonth,
            p_endmonth_nav: data.p_endmonth_nav,
            p_endmonth_navamount: data.p_endmonth_navamount,
        }

        let obj =
        {
            "funckey": "prc_update_endmonthnav",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                sails.log('err1:', err)
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    return res.send(rs);
                } else {
                    sails.log('err2:', rs)
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    insert_endmonthfee: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            p_codeid: data.p_codeid,
            p_endofmonth: data.p_endofmonth,
            p_endmonthfee: data.p_endmonthfee
        }

        let obj =
        {
            "funckey": "prc_insert_endmonthfee",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                sails.log('err1:', err)
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    return res.send(rs);
                } else {
                    sails.log('err2:', rs)
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    update_endmonthfee: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            p_codeid: data.p_codeid,
            p_endofmonth: data.p_endofmonth,
            p_endmonthfee: data.p_endmonthfee
        }

        let obj =
        {
            "funckey": "prc_update_endmonthfee",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                sails.log('err1:', err)
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    return res.send(rs);
                } else {
                    sails.log('err2:', rs)
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    approveOrder: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            p_orderid: data.orderid,
            p_custodycd: data.custodycd
        }

        let obj =
        {
            "funckey": "prc_approve_order_cp",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                sails.log('err1:', err)
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    return res.send(rs);
                } else {
                    sails.log('err2:', rs)
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },

    getlistreceivemoney: function (req, res) {
        sails.log('getlistreceivemoney:::', req.body)
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;

        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_orderid: data.p_orderid,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
        }

        let obj =
        {
            "funckey": "prc_get_receivemoneymanagement",
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
                    return res.send(rs);
                } else {
                    return res.send(rs);
                }
            } catch (error) {
                sails.log('receivemoney::fundcontroller->', error)
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },

    get_all_stpstatus: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;


        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_all_stpstatus",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(err);
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                sails.log('get_all_stpstatus:::result', result);
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                sails.log('error:::', error)
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },

    get_account_stpstatus: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;


        let rest = {
            p_custodycd: data.p_custodycd,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_get_account_stpstatus",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(err);
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    send_account_message_vsd: function (req, res) {
        let datasend = req.body;
        sails.log('datasend:::', datasend)
        let { TLID, ROLECODE } = req.session.userinfo;
        datasend.p_role = ROLECODE
        datasend.p_tlid = TLID
        datasend.MODELNAME = "prc_sendmessage_createaccount";
        datasend.p_refcursor = { dir: 3003, type: 2004 }
        let rest = datasend;
        let obj =
        {
            "funckey": "prc_sendmessage_createaccount",
            bindvar: rest
        }

        let language = datasend.p_language

        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(err);
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
    getlistproduct: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
            p_sptype: data.p_sptype ? data.p_sptype : 'ALL',
            p_codeid: data.p_codeid ? data.p_codeid : 'ALL',
        }
        let obj = {
            "funckey": "prc_get_tasipdef",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    let result1 = [];
                    result.length > 0 && result.forEach(item => {
                        item.value = item.SPCODE;
                        item.label = item.VSDSPCODE;
                        result1.push(item);
                    })
                    delete rs.DT["p_refcursor"];
                    rs.DT.data = result1;
                    rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
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
    addproduct: function (req, res) {
        let data = req.body;
        data.p_refcursor = { dir: 3003, type: 2004 };
        data.pv_action = 'ADD';
        data["pv_tlid"] = req.session.userinfo.TLID,
            data.MODELNAME = "mt_tasipdef";
        data = commonUtil.convertPropsNullToEmpty(data);
        sails.log('data to back :::', data);

        let rest = data;
        let obj = {
            "funckey": "prc_mt_tasipdef",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                sails.log('err1:', err)
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    return res.send(rs);
                } else {
                    sails.log('err2:', rs)
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    updateproduct: function (req, res) {
        let data = req.body;
        data.p_refcursor = { dir: 3003, type: 2004 };
        data.pv_action = 'EDIT';
        data["pv_tlid"] = req.session.userinfo.TLID;
        data.MODELNAME = "mt_tasipdef";
        data = commonUtil.convertPropsNullToEmpty(data);
        let rest = data;
        let obj = {
            "funckey": "prc_mt_tasipdef",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                sails.log('err1:', err)
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    return res.send(rs);
                } else {
                    sails.log('err2:', rs)
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    deleteproduct: function (req, res) {
        let data = {
            p_spcode: req.body.data.SPCODE,
            p_vsdspcode: '',
            p_methods: '',
            p_codeid: '',
            p_minamt: '',
            p_maxamt: '',
            p_sptype: '',
            p_minqtty: '',
            p_maxqtty: '',
            p_tradingcycle: '',
            p_mbcode: '',
            pv_tlid: req.session.userinfo.TLID,
            pv_language: req.body.p_language,
            pv_objname: req.body.pv_objname,
        };
        data.MODELNAME = "mt_tasipdef";
        data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }
        let language = data.pv_language
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
    getListTradingCycle: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_custodycd: data.p_custodycd,
            p_codeid: data.p_codeid,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }
        let obj = {
            "funckey": "prc_get_tradingcycledtl",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    delete rs.DT["p_refcursor"];
                    rs.DT.data = result;
                    rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
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
    getlistsaleid: function (req, res) {
        let data = req.body;
        let { TLID } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_refcursor: { dir: 3003, type: 2004 },
            p_custodycd: data.p_custodycd ? data.p_custodycd : 'ALL',
        }
        let obj = {
            "funckey": "prc_get_saleid",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    let result1 = [];
                    result.length > 0 && result.forEach(item => {
                        item.value = item.SALEACCTNO;
                        item.label = item.SALENAME;
                        result1.push(item);
                    })
                    delete rs.DT["p_refcursor"];
                    rs.DT.data = result1;
                    rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
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
    getvsdspcodebycodeid: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_codeid: data.p_codeid,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }
        let obj = {
            "funckey": "prc_get_vsdspcode",
            bindvar: rest
        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    let result1 = [];
                    result.length > 0 && result.forEach(item => {
                        item.value = item.VSDSPCODE;
                        item.label = item.VSDSPCODE;
                        result1.push(item);
                    })
                    delete rs.DT["p_refcursor"];
                    rs.DT.data = result1;
                    rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
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
    addfee4groups: function (req, res) {
        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID;
        data.pv_role = req.session.userinfo.ROLECODE;
        data.pv_action = 'ADD';
        data.MODELNAME = "mt_fee4groups";
        data.p_refcursor = { dir: 3003, type: 2004 }
        data = commonUtil.convertPropsNullToEmpty(data);


        let obj = { model: data }

        processingserver.createmodel(obj, function (err, rs) {

            ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {

                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM = errdefs.ERRDESC
                return res.send(rs);
            })

        });
    },
    updatefee4groups: function (req, res) {
        let data = req.body;

        data.pv_tlid = req.session.userinfo.TLID;
        data.pv_role = req.session.userinfo.ROLECODE;
        data.pv_action = 'EDIT';
        data.MODELNAME = "mt_fee4groups";
        data.p_refcursor = { dir: 3003, type: 2004 }
        data = commonUtil.convertPropsNullToEmpty(data);

        let obj = { model: data }

        processingserver.updatemodel(obj, function (err, rs) {

            ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {

                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM = errdefs.ERRDESC
                return res.send(rs);
            })

        });
    },
    deletefee4groups: function (req, res) {

        let data = {
            p_id: req.body.data.ID,
            p_applyobj: '',
            p_feetype: '',
            p_deductionrate: '',
            p_expectacc: '',
            p_notes: '',
            pv_action: 'DELETE',
            pv_language: req.body.p_language,
            pv_tlid: req.session.userinfo.TLID,
            pv_role: req.session.userinfo.ROLECODE,
            pv_objname: req.body.pv_objname,
        };
        data.MODELNAME = "mt_fee4groups";
        data = commonUtil.convertPropsNullToEmpty(data);

        let obj = { model: data }
        processingserver.deletemodel(obj, function (err, rs) {
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
        // }


    },
    getlistfee4groups: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;


        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_applyobj: data.p_applyobj,
            p_feetype: data.p_feetype,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
        }

        let obj =
        {
            "funckey": "prc_get_fee4groups",
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
    getlistfeetypes: function (req, res) {
        let { data } = req.body;
        let rest = {
            p_feetype: data.p_fee,
            p_refcursor: { dir: 3003, type: 2004 }
        };

        let obj =
        {
            "funckey": "prc_feetype",
            bindvar: rest
        };
        let language = 'vie';
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getsalecalculatortrailerfee: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;


        let rest = {
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 },
        }

        let obj =
        {
            "funckey": "prc_get_sale_calculator_trailerfee",
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
}