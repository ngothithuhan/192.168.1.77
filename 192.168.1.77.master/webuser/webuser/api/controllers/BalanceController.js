/**
 * BalanceController
 * xu ly cac api lien quan den so du
 * @description :: Server-side logic for managing Balances
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var processingserver = require('../commonwebuser/ProcessingServer');
//var commonUtil = require('../common/CommonUtil');
var path = require('path')
var Ioutput = require(path.resolve(__dirname, '../common/OutputInterface.js'));
var RestfulHandler = require('../common/RestfulHandler');
var LogHelper = require('../common/LogHelper');
module.exports = {
    searchFundBalance: async function (req, res) {
        if (!req.isSocket) {
            sails.log.debug('no socket');
            return res.badRequest();
        }
        if (req.isSocket) {
            // If this code is running, it's made it past the `isAdmin` policy, so we can safely
            // watch for `.publishCreate()` calls about this model and inform this socket, since we're
            // confident it belongs to a logged-in administrator.
            sails.log.debug('is socket');
            //để  đăng kí sự kiện lăng nghe model Command thay đổi kích hoạt sự kiện on('command') bên phía client
            FundBalances.watch(req);
        }
        delete req.body["OBJNAME"];
        var data = req.body
        var keySearch = Paging.generate_keySearch(data);
        let dataCount = { ...keySearch }
        // chèn thêm điều kiện find dữ liệu theo trường Custid
        if (data.CUSTODYCD && data.CUSTODYCD !== '')
            dataCount.where.CUSTODYCD = data.CUSTODYCD
        if (data.CODEID && data.CODEID !== '')
            dataCount.where.CODEID = data.CODEID
        FundBalances
            .count(dataCount)
            .exec(function (err, length) {
                if (err) return res.send(Ioutput.errServer(err));
                // console.log("lenght:...", length); 
                var pagesize = parseInt(req.body.pagesize);
                var numOfPages = Math.ceil(length / pagesize);


                FundBalances.find(keySearch)
                    .paginate({ limit: pagesize, page: req.body.page })
                    .exec(function (err, response) {
                        return res.send(Ioutput.success({ data: response, numOfPages: numOfPages }));
                    });
            });
    },
    getfundbalance: async function (req, res) {
        try {
            sails.log.info(LogHelper.Add('BalanceController.getFundBalanceByTLID start', req.body));
            var data = req.body;
            let { ISCUSTOMER } = req.session.userinfo;
            pv_iscustomer = ISCUSTOMER
            data = RestfulHandler.addSessionInfo(data, req);
            //data.ret = {dir:3003,type:2004};          
            var rest = {
                p_refcursor: { dir: 3003, type: 2004 },
                p_custodycd: data.CUSTODYCD,
                p_codeid: data.CODEID,
                p_reflogid: '',
                p_tlid: data.TLID,
                p_role: data.ROLE,
                p_language: data.language,
            }
            var body = {
                funckey: 'prc_get_semast',
                bindvar: rest
            }

            processingserver.callAPI(body, async function (err, rs) {
                if (err) {
                    sails.log.error(err);
                    return res.send(Ioutput.errServer(err));
                }
                if (rs.EC == 0) {
                    rs.DT = await ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    await FundBalances.destroy({ CUSTODYCD: data.CUSTODYCD });
                    for (var item of rs.DT) {
                        FundBalances.updateOrCreate({ SEDTLID: item.SEDTLID }, item).then((record) => {
                            //sails.log.debug(record);
                        });
                    }
                    var pagesize = parseInt(req.body.pagesize);
                    var numOfPages = Math.ceil(rs.DT.length / pagesize);
                    return res.send(Ioutput.success({ data: rs.DT, numOfPages: numOfPages }));
                } else {
                    return res.send(rs);
                }
            });
        } catch (err) {
            sails.log.error(err);
            return res.send(Ioutput.errServer(err));
        }
    },
    getfundbalancedetails: async function (req, res) {
        try {
            sails.log.info(LogHelper.Add('BalanceController.getFundBalanceDetails start', req.body));
            var data = req.body;
            data = RestfulHandler.addSessionInfo(data, req);
            data.ret = { dir: 3003, type: 2004 };
            var body = {
                funckey: 'FOPKS_SE.PRC_GET_SEMAST_DETAIL',
                bindvar: data
            }
            processingserver.callAPI(body, async function (err, rs) {
                if (err) {
                    sails.log.error(err);
                    return res.send(Ioutput.errServer(err));
                }
                if (rs.EC == 0) {
                    rs.DT = await ConvertData.convert_to_Object(rs.DT.ret);
                    return res.send(Ioutput.success(rs.DT));
                } else {
                    return res.send(rs);
                }
            });
        } catch (err) {
            sails.log.error(err);
            return res.send(Ioutput.errServer(err));
        }
    },
    // Rut Tien Kha Dung
    withdraw: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        rest = {
            p_custodycd: data.custodycd,
            p_fullname: data.fullname,
            p_idcode: data.idcode,
            p_codeid: data.codeid,
            p_ivsrtype: data.ivsrtype,
            p_spcode: data.spcode,
            p_avlamt: data.avlamt,
            p_amount: data.amount,
            p_desc: data.desc,
            pv_action: "ADD",
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language,
            pv_objname: data.objname,
            MODELNAME: "iv_cashwithdraw"
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
    // tra ve so du kha dung
    getBalanceAvail: async function (req, res) {
        let data = req.body;
        let rest = {
            p_custodycd: data.custodycd,
            p_codeid: data.codeid,
            p_custtype: data.custtype,
        };
        let obj = {
            funckey: "fn_get_avl_balance",
            bindvar: rest
        };
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC === 0) {
                    let resultdata = rs.DT
                    return res.send({ resultdata });
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
    sqlgetsipcode: async function (req, res) { // truyen custodycd, symbol va srtype
        let data = req.body;
        let rest = {
            p_custodycd: data.custodycd,
            p_symbol: data.symbol,
            p_srtype: data.srtype,
        }
        //console.log('sqlgetsipcode ????', rest);
        
        let obj = {
            funckey: "fn_get_sipcode",
            bindvar: rest
        };
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC === 0) {
                    let resultdata = rs.DT
                    return res.send({ resultdata });
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
    getlistsemastblock: async function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_custodycd: data.custodycd,
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language
        }
        //console.log("getOrderdBookAll", rest)
        let obj =
        {
            "funckey": "prc_get_semast_block",
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
                    if (keySearch)
                        if (keySearch.length > 0)
                            result = await Paging.find(result, keySearch)

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
    
    actionblockccq: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        rest = {
            p_trfaccount : data.trfaccount,
            p_fullname : data.fullname,
            p_afacctno : data.afacctno,
            p_codeid : data.codeid,
            p_seacctno : data.seacctno,
            p_avlqtty : data.avlqtty,
            p_nqtty : data.nqtty,
            p_avlsqtty : data.avlsqtty,
            p_sqtty : data.sqtty,
            p_qtty : data.qtty,
            p_desc : data.desc,
            pv_action : "ADD",
            p_tlid : TLID,
            p_role: ROLECODE,
            p_language : data.language,
            pv_objname : data.objname,
            MODELNAME: "se_block"
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
     
      getlistsemastunblock: async function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_custodycd: data.custodycd,
            p_tlid: TLID,
            p_role: ROLECODE,
            p_language: data.language
        }
        //console.log("getOrderdBookAll", rest)
        let obj =
        {
            "funckey": "prc_get_semast_unblock",
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
                    if (keySearch)
                        if (keySearch.length > 0)
                            result = await Paging.find(result, keySearch)

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
    
    actionunblockccq: function (req, res) {
        let data = req.body;
        let { TLID, ROLECODE } = req.session.userinfo;
        rest = {
            p_trfaccount : data.trfaccount,
            p_fullname : data.fullname,
            p_afacctno : data.afacctno,
            p_codeid : data.codeid,
            p_seacctno : data.seacctno,
            p_avlqtty : data.avlqtty,
            p_nqtty : data.nqtty,
            p_avlsqtty : data.avlsqtty,
            p_sqtty : data.sqtty,
            p_qtty : data.qtty,
            p_desc : data.desc,
            pv_action : "ADD",
            p_tlid : TLID,
            p_role: ROLECODE,
            p_language : data.language,
            pv_objname : data.objname,
            MODELNAME: "se_unblock"
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
};

