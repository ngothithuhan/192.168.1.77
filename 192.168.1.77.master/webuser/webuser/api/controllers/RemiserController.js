/**
 * RemiserController
 *
 * @description :: Server-side logic for managing Remisers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var path = require('path')
var processingserver = require('../commonwebuser/ProcessingServer');
var commonUtil = require('../common/CommonUtil');
var Ioutput = require(path.resolve(__dirname, '../common/OutputInterface.js'));


module.exports = {
    addRemiser: function (req, res) {
        let data = req.body;
        data = Remisers.newInstance(data);
        data.ROLE = req.session.userinfo.ROLECODE;
        data.TLID = req.session.userinfo.TLID;
        data.DBCODE = req.session.userinfo.DBCODE;
        data.REFLOGID = '';
        processingserver.createmodel({ model: data }, async function (err, rs) {
            sails.log.debug(rs);
            if (rs.EC === 0) {
                //add Redis
                // await Remisers.syncCreate(data);
            }
            return res.send(rs);
        });
    },
    approveRemiser: function (req, res) {
        let data = req.body;
        data = Remisers.newInstance(data);
        data.ROLE = req.session.userinfo.ROLECODE;
        data.TLID = req.session.userinfo.TLID;
        data.DBCODE = req.session.userinfo.DBCODE;
        data.REFLOGID = '';
        processingserver.approvemodel({ model: data }, async function (err, rs) {
            sails.log.debug(rs);
            if (rs.EC === 0) {
                //add Redis
                // await Remisers.syncCreate(data);
            }
            return res.send(rs);
        });
    },
    rejectRemiser: function (req, res) {
        let data = req.body;
        data = Remisers.newInstance(data);
        data.ROLE = req.session.userinfo.ROLECODE;
        data.TLID = req.session.userinfo.TLID;
        data.DBCODE = req.session.userinfo.DBCODE;
        data.REFLOGID = '';
        processingserver.rejectmodel({ model: data }, async function (err, rs) {
            sails.log.debug(rs);
            if (rs.EC === 0) {
                //add Redis
                // await Remisers.syncCreate(data);
            }
            return res.send(rs);
        });
    },
    deleteRemiser: function (req, res) {
        let data = req.body;
        data = Remisers.newInstance(data);
        data.ROLE = req.session.userinfo.ROLECODE;
        data.TLID = req.session.userinfo.TLID;
        data.DBCODE = req.session.userinfo.DBCODE;
        data.REFLOGID = '';
        processingserver.deletemodel({ model: data }, async function (err, rs) {
            sails.log.debug(rs);
            if (rs.EC === 0) {
                //add Redis
                // await Remisers.syncCreate(data);
            }
            return res.send(rs);
        });
    },
    updateRemiser: function (req, res) {
        let data = req.body;
        data = Remisers.newInstance(data);
        data.ROLE = req.session.userinfo.ROLECODE;
        data.TLID = req.session.userinfo.TLID;
        data.DBCODE = req.session.userinfo.DBCODE;
        data.REFLOGID = '';
        processingserver.updatemodel({ model: data }, async function (err, rs) {
            sails.log.debug(rs);
            if (rs.EC === 0) {
                //add Redis
                // await Remisers.syncCreate(data);
            }
            return res.send(rs);
        });
    },
    /**
     * Lấy danh sách môi giới 
     */
    getRemisers: function (req, res) {
        // let data = req.body;
        var criteria = {
            DBCODE: req.session.userinfo.DBCODE,
        }
        // console.log("create...", criteria);
        Remisers.find(criteria).exec((err, list) => {
            // console.log("list...", list);
            result = list.map((item) => {
                return { value: item.AUTOID, label: item.FULLNAME }
            })
            return res.send(result)
        })
    },

    /**
   * Lấy danh sách môi giới full thong tin
   */
    getRemisersFull: function (req, res) {
        let data = req.body;
        let { TLID, DBCODE, ROLECODE } = req.session.userinfo;
        let REFLOGID = "";
        data.ret = { dir: 3003, type: 2004 };
        data.DBCODE = DBCODE;
        data.ROLE = ROLECODE;
        data.REFLOGID = REFLOGID;
        data.TLID = TLID;
        var obj = {
            'funckey': 'FOPKS_RE.PRC_GET_REMISERS',
            'bindvar': data
        }
        processingserver.callAPI(obj, async function (err, rs) {
            if (err) {
                sails.log.error(err);
            } else {
                var err = await Remisers.syncDestroy();
                if (typeof (err) === 'Error') {
                    sails.log.error(err);
                } else {
                    if (rs.EC == 0) {
                        rs.DT = ConvertData.convert_to_Object(rs.DT.ret)
                        for (let i in rs.DT) {
                            // console.log(rs.DT[i]);
                            let record = await Remisers.updateOrCreate({ AUTOID: rs.DT[i].AUTOID }, rs.DT[i])
                            // console.log("get full...",record);
                        }
                    }
                }
            }
            var keySearch = Paging.generate_keySearch(req.body);
            keySearch.DBCODE = req.session.userinfo.DBCODE;
            Remisers.count(keySearch).exec(function (err, length) {
                if (err) return next(err);
                var pagesize = parseInt(req.body.pagesize);
                var numOfPages = Math.ceil(length / pagesize);

                Remisers.find(keySearch)
                    .paginate({ limit: pagesize, page: req.body.page })
                    .exec(function (err, response) {
                        var list = { data: response, numOfPages: numOfPages };
                        console.log("get list...", list);
                        return res.send(Ioutput.jsonAPIOutput(0, 'Success', list));

                    });
            });
        })


    },
    // /**
    //      * Tạo danh sách môi giới trên redis
    //      */
    //     createRemisersRedis: (req, res) => {
    //         // let FULLNAME = req.body.FULLNAME;
    //         let data = req.body;
    //         let {TLID, DBCODE, ROLECODE} = req.session.userinfo;
    //         let REFLOGID = ""
    //         data.ret = { dir: 3003, type: 2004 };
    //         data.DBCODE = DBCODE;
    //         data.ROLE = ROLECODE;
    //         data.REFLOGID = REFLOGID;
    //         data.TLID = TLID;
    //         var obj = {
    //             'funckey': 'FOPKS_RE.PRC_GET_REMISERS',
    //             'bindvar': data
    //         }
    //         processingserver.getmodel(obj, async function (err, rs) {

    //             rs.EM = await ErrDefs.findErr(rs.EC);
    //             for (let i in rs.DT) {
    //                 let record = await Remisers.updateOrCreate({AUTOID:rs.DT[i].AUTOID},rs.DT[i])
    //             }
    //             return res.send(rs);
    //         })
    //     },



};

