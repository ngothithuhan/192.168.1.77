

/**
 * FatcaController
 *
 * @description :: Server-side logic for managing fatcas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var processingserver = require('../commonwebuser/ProcessingServer');

module.exports = {
    add: function (req, res) {
        try {
            let data = req.body;


            data = Fatcas.newInstance(data);
            data.REFLOGID = ''
            data.TLID = req.session.userinfo.TLID
            data.ROLE = req.session.userinfo.ROLECODE
            // data = commonUtil.convertPropsNullToEmpty(data);
            let obj = { model: data }


            processingserver.createmodel(obj, function (err, rs) {
                if (err) {

                }

                try {
                    if (rs.EC == 0) {

                        ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {
                            if (err) {
                                rs.EM = "Lỗi thực hiện trên redis"
                                return res.send(rs)
                            }
                            if (errdefs)
                                rs.EM = errdefs.ERRDESC
                            // console.log("rs...", rs)
                            return res.send(rs);
                        })

                    }
                    else {
                        res.DT = [];
                        return res.send(rs)

                    }

                } catch (error) {
                    rs.EM = 'Lỗi client gọi api';
                    rs.EC = -1000;
                    return res.send(rs)
                }

            })
        } catch (error) {
            rs.EM = 'Lỗi trc khi gọi processing';
            rs.EC = -1000;
            return res.send(rs)
        }

    },
    update: function (req, res) {
        try {
            let data = req.body;
            data = Fatcas.newInstance(data);
            data.REFLOGID = ''
            data.ROLE = req.session.userinfo.ROLECODE
            // data = commonUtil.convertPropsNullToEmpty(data);
            data.CUSTID = { dir: 3002, type: 2001, val: data.CUSTID }
            let obj = { model: data }
            processingserver.updatemodel(obj, function (err, rs) {
                if (err) {

                }
                try {
                    if (rs.EC == 0) {

                        ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {
                            if (err) {
                                rs.EM = "Lỗi thực hiện trên redis"
                                return res.send(rs)
                            }
                            if (errdefs)
                                rs.EM = errdefs.ERRDESC
                            // console.log("rs...", rs)
                            return res.send(rs);
                        })

                    }
                    else {
                        res.DT = [];
                        return res.send(rs)

                    }

                } catch (error) {
                    rs.EM = 'Lỗi client gọi api';
                    rs.EC = -1000;
                    return res.send(rs)
                }

            });
        } catch (error) {
            console.log(error)
            let rs = {};
            rs.EM = 'Lỗi trc khi gọi processing';
            rs.EC = -1000;
            return res.send(rs)
        }


    },
    delete: function (req, res) {
        try {
            let data = req.body;
            data = Fatcas.newInstance(data);
            data.REFLOGID = ''
            // data = commonUtil.convertPropsNullToEmpty(data);
            data.CUSTID = { dir: 3002, type: 2001, val: data.CUSTID }
            let obj = { model: data }
            // console.log('update',data)
            processingserver.deletemodel(obj, function (err, rs) {
                if (err) {

                }
                try {
                    if (rs.EC == 0) {

                        ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {
                            if (err) {
                                rs.EM = "Lỗi thực hiện trên redis"
                                return res.send(rs)
                            }
                            if (errdefs)
                                rs.EM = errdefs.ERRDESC
                            // console.log("rs...", rs)
                            return res.send(rs);
                        })

                    }
                    else {
                        res.DT = [];
                        return res.send(rs)

                    }

                } catch (error) {
                    rs.EM = 'Lỗi client gọi api';
                    rs.EC = -1000;
                    return res.send(rs)
                }

            });
        } catch (error) {
            console.log(error)
            let rs = {};
            rs.EM = 'Lỗi trc khi gọi processing';
            rs.EC = -1000;
            return res.send(rs)
        }


    },
    getFatca: function (req, res) {
        let data = {}
        data.CUSTID = req.body.CUSTID;
        // let data = Orders.newInstance(body);
        data.TLID = req.session.userinfo.TLID
        data.REFlOGID = ''
        data.ACTION = req.body.ACTION;
        data.ret = { dir: 3003, type: 2004 };
        //  data = commonUtil.convertPropsNullToEmpty(data);

        let obj =
        {
            "funckey": "FOPKS_CF.PRC_GET_FATCA_BY_CUSTID",

            bindvar: data


        }

        processingserver.callAPI(obj, function (err, rs) {
            console.log('res', rs)
            // get text của mã lỗi 
            if (err) { }
            try {
                if (rs.EC == 0) {

                    ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {
                        if (err) {
                            rs.EM = "Lỗi thực hiện trên redis"
                            return res.send(rs)
                        }
                        if (errdefs)
                            rs.EM = errdefs.ERRDESC
                        // let result = await convert_to_Object(r.DT.ret);
                        //  rs.DT.data = result
                        // console.log("rs...", rs)
                        return res.send(rs);
                    })

                }
                else {
                    res.DT = [];
                    return res.send(rs)

                }

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });

    },
    getlist: function (req, res) {
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
        let TLID = req.body.TLID;
        // console.log(TLID)
        let self = this;

        serviceTest.requsetPost({ TLID: TLID }, 'front/syncAccountByTLID', function (err, rs) {
            if (err) {
                return res.send(err)
            }
            try {


                if (rs.EC == 0) {
                    Accountmanage.find({ TLID: TLID }).exec((err, listAccountmanage) => {
                        let result = listAccountmanage.map((accountmanage) => {
                            return accountmanage.CUSTID
                        })
                        // tính số  bản ghi để  phân trang
                        Account
                            .count({ CUSTID: result })
                            .exec
                            (function (err, length) {

                                if (err) return next(err);
                                // console.log(length); 
                                var pagesize = parseInt(req.body.pagesize);
                                var numOfPages = Math.ceil(length / pagesize);

                                var keySearch = Paging.generate_keySearch(req.body);
                                Account.find(keySearch)
                                    .where({ CUSTID: result })
                                    .paginate({ limit: pagesize, page: req.body.page })
                                    .exec(function (err, response) {
                                        rs.DT = { data: response, numOfPages: numOfPages };

                                        return res.send(rs);

                                    });
                            });


                    })
                }
                else {
                    res.DT = [];
                    return res.send(rs)

                }

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }


        })


    },
};

