/**
 * SipController
 *
 * @description :: Server-side logic for managing Sips
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var processingserver = require('../commonwebuser/ProcessingServer')
var RestfulHandler = require('../common/RestfulHandler')
var Ioutput = require('../common/OutputInterface.js');

module.exports = {
    add: function (req, res) {
        let data = req.body;

        data = Sips.newInstance(data);
        data.ROLE = req.session.userinfo.ROLECODE

        data.TLID = req.session.userinfo.TLID;
        data.REFlOGID = ''

        // data.CUSTID = { dir: 3002, type: 2001, val: data.CUSTID }
        let obj = { model: data }
        processingserver.createmodel(obj, function (err, rs) {
            ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {
                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM += errdefs.ERRDESC
                return res.send(rs);
            })

        });

    },
    update: function (req, res) {
        let data = req.body;
        //console.log('body', data)

        data = Sips.newInstance(data);
        data.ROLE = req.session.userinfo.ROLECODE

        data.TLID = req.session.userinfo.TLID;
        data.REFlOGID = ''

        // data.CUSTID = { dir: 3002, type: 2001, val: data.CUSTID }
        let obj = { model: data }
        //console.log(data)
        processingserver.updatemodel(obj, function (err, rs) {
            ErrDefs.find({ ERRNUM: rs.EC }).exec((err, errdefs) => {
                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM += errdefs.ERRDESC
                return res.send(rs);
            })
        });

    },
    delete: function (req, res) {
        let data = req.body;
        console.log('body', data)

        data = Sips.newInstance(data);
        data.ROLE = req.session.userinfo.ROLECODE

        data.TLID = req.session.userinfo.TLID;
        data.REFlOGID = ''

        // data.CUSTID = { dir: 3002, type: 2001, val: data.CUSTID }
        let obj = { model: data }
        console.log(data)
        processingserver.deletemodel(obj, function (err, rs) {
            ErrDefs.find({ ERRNUM: rs.EC }).exec((err, errdefs) => {
                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM += errdefs.ERRDESC
                return res.send(rs);
            })
        });

    },
    active: function (req, res) {
        let data = req.body;
        console.log('body', data)

        data = Sips.newInstance(data);
        data.ROLE = req.session.userinfo.ROLECODE

        data.TLID = req.session.userinfo.TLID;
        data.REFlOGID = ''

        // data.CUSTID = { dir: 3002, type: 2001, val: data.CUSTID }
        let obj = { model: data }
        console.log(data)
        processingserver.approvemodel(obj, function (err, rs) {
            ErrDefs.find({ ERRNUM: rs.EC }).exec((err, errdefs) => {
                if (err) {
                    rs.EM = "Lỗi thực hiện trên redis"
                    return res.send(rs)
                }
                if (errdefs)
                    rs.EM += errdefs.ERRDESC
                return res.send(rs);
            })
        });

    },
    getall_tradingcycle: function (req, res) {
        let { key, SYMBOL, SPCODE } = req.body;
        let result = [];
        var criteria = { CONTENT: { 'like': "%" + key + '%' } };
        if (SYMBOL.length > 0) {
            criteria.SYMBOL = SYMBOL;
        }
        if (SPCODE.length > 0) {
            criteria.SPCODE = SPCODE;
        }
        TradingCycles.find(criteria).exec(function (err, list) {
            if (err) {
                res.send('error');
            }


            result = list.map((item) => {
                return {
                    value: item.AUTOID,
                    label: item.CONTENT
                }
            });
            sails.log.debug('============================', list)
            return res.send(result);
        });
    },
    get_trandingcycle: function (req, res) {
        let CYCLE = req.body.CYCLE.toString()
        // console.log('Cycle',CYCLE)
        TradingCycles.findOne({ AUTOID: CYCLE }).exec((err, trandingcycle) => {
            if (err) {

            }
            return res.send(trandingcycle);
        })
    },
    fetchData: async function (req, res) {
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
            Account.watch(req);
        }
        let TLID = req.session.userinfo.TLID;
        let self = this;
        let ROLE = req.session.userinfo.ROLECODE
        let listSipManage = await SipManage.find({ TLID: TLID, ROLE: ROLE, select: ['SPID'] })

        let result = await Promise.all(listSipManage.map((item) => {
            return new Promise((resolve, reject) => {
                resolve(item.SPID)
            })
        }))
        var keySearch = Paging.generate_keySearch(req.body)
        let dataCount = { ...keySearch }
        // chèn thêm điều kiện find dữ liệu theo trường SPID
        dataCount.where.SPID = result
        // tính số  bản ghi để  phân trang
        let length = await Sips.count(dataCount)
        let { pagesize, page } = req.body;
        pagesize = parseInt(pagesize);
        let numOfPages = Math.ceil(length / pagesize);
        let response = await Sips.find(keySearch).where({ SPID: result }).paginate({ limit: pagesize, page: req.body.page })
        if (response.length > 0) {
            Promise.all(response.map((item) => {
                return new Promise(async (resolve, reject) => {
                    resolve({ ...item })
                })
            }))
                .then((data_response) => {
                    var DT = { data: data_response, numOfPages: numOfPages }
                    return res.send(Ioutput.success(DT));
                    resolve(data_response)
                })
        }


    },

    getListSip: function (req, res) {
        try {
            var data = {};
            data.ret = { dir: 3003, type: 2004 };
            data = RestfulHandler.addSessionInfo(data, req);
            var tlid = req.session.userinfo.TLID;
            var role = req.session.userinfo.ROLECODE;
            let obj =
            {
                "funckey": "FOPKS_SIP.PRC_GET_SIPS",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {
                sails.log.debug('getListSip: rs', rs);
                if (rs.EC === 0) {
                    var result = await ConvertData.convert_to_Object(rs.DT.ret);
                    SipManage.find({ TLID: tlid, ROLE: role }).exec(async (err, listSipMng) => {
                        if (!err) {
                            for (var item of listSipMng) {
                                await Sips.destroy({ SPID: item.SPID });
                            }
                            await SipManage.destroy({ TLID: tlid, ROLE: role });
                            for (var item of result) {
                                Sips.updateOrCreate({ SPID: item.SPID }, item).then((record) => {
                                    sails.log.debug(record);
                                });
                                SipManage.create({ TLID: tlid, ROLE: role, SPID: item.SPID }).then((record) => {
                                    sails.log.debug(record);
                                });
                            }
                        }
                    });
                    rs.DT = result;
                }
                return res.send(rs);
            });
        } catch (error) {
            sails.log.error(error);
            var rs = { 'EC': -1, 'EM': 'Lỗi  khi gọi api', 'DT': error }
            return res.send(rs);
        }

    },
    // get_producSip:function(req,res){
    //     let SPCODE = req.body
    // },

    getlist_productSip: function (req, res) {
        let SYMBOL = req.body.SYMBOL

        SipDefs.find({ SYMBOL: SYMBOL }).exec((err, list) => {
            if (err)
                return res.send([])
            return res.send(list)
        })
    },

};

