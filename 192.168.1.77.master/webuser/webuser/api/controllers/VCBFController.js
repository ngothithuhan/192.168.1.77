var path = require('path')
var processingserver = require('../commonwebuser/ProcessingServer');
var commonUtil = require('../common/CommonUtil');
var Ioutput = require(path.resolve(__dirname, '../common/OutputInterface.js'));
var ConvertData = require('../services/ConvertData');
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

module.exports = {
    //Sua dien giai nop tien
    Order_Reject: function (req, res) {
        let  data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let datasubmit = {
            p_orderid: data.orderid,
            p_custodycd: data.custodycd,
            p_desc: data.desc,
            p_tlid: TLID,
            p_role: ROLECODE,
            pv_objname: req.body.pv_objname,
            p_language: req.body.p_language,
            MODELNAME: "reject_order"
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
    //Tham so he thong
    get_sysvar_4edit: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_sysvar_4edit",
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
    //sua tham so he thong
    prc_sy_update_sysvar: function (req, res) {
        let  data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let datasubmit = {
            p_GRNAME: data.GRNAME,
            p_VARNAME: data.VARNAME,
            p_VARVALUE: data.VARVALUE,
            p_VARDESC: data.VARDESC,
            p_DESC: data.DESC,
            p_tlid: TLID,
            p_role: ROLECODE,
            pv_objname: req.body.pv_objname,
            p_language: req.body.p_language,
            MODELNAME: "sy_update_sysvar"
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

    //Sua dien giai nop tien
    prc_iv_mod_cash_3012: function (req, res) {
        let  data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let datasubmit = {
            p_IDDATE: data.txdate,
            p_TXNUM: data.txnum,
            p_CODEID: data.codeid,
            p_DESCBANK: data.descbank,
            p_ACCOUNT: data.custodycd,
            p_AMT: data.amt,
            p_AUTOID: data.autoid,
            p_DESC: data.desc,
            p_tlid: TLID,
            p_role: ROLECODE,
            pv_objname: req.body.pv_objname,
            p_language: req.body.p_language,
            MODELNAME: "iv_mod_cash_3012"
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
    //Xoa giao dich nop tien
    prc_iv_delete_cash_3013: function (req, res) {
        let  data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let datasubmit = {
            p_IDDATE: data.TXDATE,
            p_TXNUM: data.TXNUM,
            p_CODEID: data.CODEID,
            p_DESCBANK: data.DESCBANK,
            p_ACCOUNT: data.CUSTODYCD,
            p_AMT: data.AMT,
            p_AUTOID: data.AUTOID,
            p_DESC: 'Xóa giao dịch nộp tiền',
            p_tlid: TLID,
            p_role: ROLECODE,
            pv_objname: req.body.pv_objname,
            p_language: req.body.p_language,
            MODELNAME: "iv_delete_cash_3013"
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
    //danh sách các giao dịch import tiền
    get_cashimp_4edit: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_cashimp_4edit",
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
                    rs.DT.dataAll = result;
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
    
    getlistcfmast4careby: function (req, res) {

        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_custodycd: data.p_custodycd,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_cfmast4careby",
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
    getcareby: function (req, res) {
        let data = req.body;
        let result1 = {}
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_grptype: data.p_grptype,
            p_objname: data.p_objname,
            p_role: ROLECODE,
            p_tlid: TLID,
            p_language: data.p_language,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_getcareby",
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
                            value: item.GRPID,
                            label: item.GRPID + '-' + item.GRPNAME,

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
    cf_changegroupcareby: function (req, res) {

        let data = req.body;
        data.p_tlid = req.session.userinfo.TLID
        data.p_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "cf_changegroupcareby";
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
    getlistcashback: function (req, res) {

        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_codeid: data.p_codeid,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_cashback",
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
    cashback: function (req, res) {

        let data = req.body;
        data.p_tlid = req.session.userinfo.TLID
        data.p_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "iv_cashback";
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
    getlistcashback_confirm: function (req, res) {

        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_codeid: data.p_codeid,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_cashback_confirm",
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
    cashback_confirm: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let datasubmit = {
            p_autoid: data.AUTOID,
            p_custodycd: data.CUSTODYCD,
            p_fullname: data.FULLNAME,
            p_idcode: data.CODEID,
            p_bankacc: data.BANKACC,
            p_bankcode: data.BANKCODE,
            p_citybank: data.BANKNAME,
            p_codeid: data.CODEID,
            p_ivsrtype: data.SRTYPE,
            p_amount: data.AMOUNT,
            p_desc: '',
            p_tlid: TLID,
            p_role: ROLECODE,
            pv_objname: req.body.pv_objname,
            p_language: req.body.p_language,
            MODELNAME: "iv_cashback_confirm"
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
    getlisteciving_sell_money_confirm: function (req, res) {

        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_codeid: data.p_codeid,
            p_tlid: TLID,
            p_language: data.p_language,
            p_role: ROLECODE,
            p_refcursor: { dir: 3003, type: 2004 }
        }

        let obj =
        {
            "funckey": "prc_get_reciving_sell_money_confirm",
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
    sr_reciving_sell_money: function (req, res) {
        let { data } = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let tmp = '';
        sails.log ('data::',data)
        sails.log ('data.SRTYPE1::',data.SRTYPE)
        if (data.SRTYPE == 'SW') {
            tmp = data.CODEIDSW;
        }
        else{
            tmp = data.CODEID;
        }
        sails.log ('tmp::',tmp)
        sails.log ('data.SRTYPE2::',data.SRTYPE)
        let datasubmit = {
            p_autoid: data.AUTOID,
            p_custodycd: data.CUSTODYCD,
            p_fullname: data.FULLNAME,
            p_idcode: data.CODEID,
            p_bankacc: data.BANKACC,
            p_bankcode: data.BANKCODE,
            p_citybank: data.CITYBANK,
            p_codeid: tmp,
            p_ivsrtype: data.SRTYPE,
            p_amount: data.AMOUNT,
            p_desc: '',
            p_tlid: TLID,
            p_role: ROLECODE,
            pv_objname: req.body.pv_objname,
            p_language: req.body.p_language,
            MODELNAME: "sr_reciving_sell_money"
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

    pre_check_3007: function (req, res) {

        let data = req.body;

        data.p_srtype = data.p_ivsrtype
        data.p_tlid = req.session.userinfo.TLID
        data.p_role = req.session.userinfo.ROLECODE
        data.MODELNAME = "pre_check_3007";
        // datasend.p_refcursor = { dir: 3003, type: 2004 }
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

    getListOrdersConfirm: async function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_autoid: "",
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language
        };
        let obj = {
            funckey: "prc_get_orders_confirm",
            bindvar: rest
        };
        let i = 0;
        let tmpres = [];
        
       
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    sails.log(data)
                    if (data.CUSTODYCD != ''){
                        //lâm : nếu là NDT thì lọc result theo custodycd từ phía trên truyền xuống 
                        //--> đỡ phải thay đổi view trong sql
                        for (i = 0; i < result.length; i ++){
                            if (result[i].CUSTODYCD == data.CUSTODYCD){
                                tmpres.push(result[i])
                            }
                        }
                        result = tmpres;
                    }
                    let pv_sumRecord = result.length;
                    let dataAll = result;
                    //phan trang
                    let { pagesize, page, keySearch, sortSearch } = req.body;
                    if (keySearch)
                        if (keySearch.length > 0)
                            result = await Paging.find(result, keySearch);

                    let numOfPages = Math.ceil(result.length / pagesize);
                    // search theo tung cot
                    if (sortSearch)
                        if (sortSearch.length > 0)
                            result = await Paging.orderby(result, sortSearch);
                    result = await Paging.paginate(result, pagesize, page ? page : 1);
                    delete rs.DT["p_refcursor"];
                    var DT = {
                        data: result,
                        numOfPages: numOfPages,
                        sumRecord: pv_sumRecord,
                        dataAll
                    };

                    return res.send(Ioutput.success(DT));
                } else {
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = "Lỗi client gọi api";
                rs.EC = -1000;
                return res.send(rs);
            }
        });
    },
    submitConfirmOrder: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        rest = {
            p_orderid: data.p_orderid,
            p_custodycd: data.p_custodycd,
            p_codeid: data.p_codeid,
            p_fullname: data.p_fullname,
            p_qtty: data.p_qtty,
            p_amount: data.p_amount,
            p_dealtype: data.p_dealtype,
            pv_action: "ADD",
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            pv_objname: data.objname,
            MODELNAME: "txprocess5044"
        };

        //console.log('data ne: ',rest)
        let obj = { model: rest };
        processingserver.createmodel(obj, async function (err, rs) {
            //console.log('rs checkkkkkkkk: ',rs)
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
                return res.send(rs);
            } catch (error) {
                rs.EM = "Lỗi client gọi api";
                rs.EC = -1000;
                return res.send(rs);
            }
        });
    },

    submitConfirmAmendSip: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        rest = {
            p_orderid: data.p_orderid,
            p_custodycd: data.p_custodycd,
            p_codeid: data.p_codeid,
            p_fullname: data.p_fullname,
            p_oldordervalue: data.p_oldordervalue,
            p_amount: data.p_amount,
            p_dealtype: data.p_dealtype,
            pv_action: "ADD",
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            pv_objname: data.objname,
            MODELNAME: "txprocess6007"
        };

        //console.log('data ne: ',rest)
        let obj = { model: rest };
        processingserver.createmodel(obj, async function (err, rs) {
            //console.log('rs checkkkkkkkk: ',rs)
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, data.language);
                return res.send(rs);
            } catch (error) {
                rs.EM = "Lỗi client gọi api";
                rs.EC = -1000;
                return res.send(rs);
            }
        });
    },
    getAmendSipConfirm: async function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_autoid: "",
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            p_custodycd: data.p_custodycd,
            p_dbcode: data.p_dbcode,
        };
        let obj = {
            funckey: "prc_get_amend_sip_confirm",
            bindvar: rest
        };
        let i = 0;
        let tmpres = [];
        
       
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    sails.log(data)
                    if (data.CUSTODYCD != ''){
                        //lâm : nếu là NDT thì lọc result theo custodycd từ phía trên truyền xuống 
                        //--> đỡ phải thay đổi view trong sql
                        for (i = 0; i < result.length; i ++){
                            if (result[i].CUSTODYCD == data.CUSTODYCD){
                                tmpres.push(result[i])
                            }
                        }
                        result = tmpres;
                    }
                    let pv_sumRecord = result.length;
                    let dataAll = result;
                    //phan trang
                    let { pagesize, page, keySearch, sortSearch } = req.body;
                    if (keySearch)
                        if (keySearch.length > 0)
                            result = await Paging.find(result, keySearch);

                    let numOfPages = Math.ceil(result.length / pagesize);
                    // search theo tung cot
                    if (sortSearch)
                        if (sortSearch.length > 0)
                            result = await Paging.orderby(result, sortSearch);
                    result = await Paging.paginate(result, pagesize, page ? page : 1);
                    delete rs.DT["p_refcursor"];
                    var DT = {
                        data: result,
                        numOfPages: numOfPages,
                        sumRecord: pv_sumRecord,
                        dataAll
                    };

                    return res.send(Ioutput.success(DT));
                } else {
                    return res.send(rs);
                }
            } catch (error) {
                rs.EM = "Lỗi client gọi api";
                rs.EC = -1000;
                return res.send(rs);
            }
        });
    },
    getAgentsList: function (req, res) {
        let { TLID } = req.session.userinfo;
        let data = req.body;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_tlid: TLID,
            pv_objname: data.OBJNAME
        }
        let obj = {
            "funckey": "prc_get_agency",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, 'vie');
                let result1 = rs.DT.data.map((item) => {
                    return {
                        value: item.DBCODE,
                        label: item.MBNAME,
                    }
                })
                return res.send(result1);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
}