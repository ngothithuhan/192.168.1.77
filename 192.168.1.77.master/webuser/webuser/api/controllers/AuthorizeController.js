
var processingserver = require('../commonwebuser/ProcessingServer');
// var com
/**
 * @author LongND 
 * @description API cho uỷ quyền
 * 
 */
module.exports = {
    /**
     * @description Thêm mới uỷ quyền
     * @argument res.body
     */
    insert: function (req, res) {
        let data = req.body;
        data = CFAUTH.newInstance(data);
        // data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }

        processingserver.createmodel(obj, function (err, rs) {
            ErrDefs.findOne({ ERRNUM: res.EC }).exec((err, errdefs) => {
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
    /**
     * @desc Sửa uỷ quyền 
     */
    edit: function (req, res) {
        let data = req.body;
        data = CFAUTH.newInstance(data);
        // data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }

        processingserver.updatemodel(obj, function (err, rs) {
            ErrDefs.findOne({ ERRNUM: res.EC }).exec((err, errdefs) => {
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
    /**
     * @desc Xoá uỷ quyền
     */
    delete: function (req, res) {
        let data = req.body;
        data = CFAUTH.newInstance(data);
        // data = commonUtil.convertPropsNullToEmpty(data);
        let obj = { model: data }

        processingserver.deletemodel(obj, function (err, rs) {
            ErrDefs.findOne({ ERRNUM: res.EC }).exec((err, errdefs) => {
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
    /**
     * @desc get data fill to table
     */
    getlist: function (req, res) {
        let CUSTID = req.body.CUSTID
        let { TLID, ROLECODE } = req.session.userinfo
        serviceTest.requsetPost({ TLID: TLID, CUSTID: CUSTID, ROLECODE: ROLECODE, LANG: "VN" }, 'front/syncCFAuthByCUSTID', function (err, rs) {
            if (err) {
                return res.send(err)
            }
            if (rs.EC == 0) {
                CFAuthManager.find({ TLID: TLID, CUSTID: CUSTID }).exec((err, listCFAuthManager) => {
                    let result = listCFAuthManager.map((item) => {
                        return item.AUTOID
                    });
                    CFAUTH.count({ AUTOID: result }).exec((err, length) => {
                        if (err) return next(err)
                        let pagesize = parseInt(req.body.pagesize);
                        let numOfPages = Math.ceil(length / pagesize);
                        let keySearch = Paging.generate_keySearch(req.body);
                        CFAUTH.find(keySearch)
                            .where({ AUTOID: result })
                            .paginate({ limit: pagesize, page: req.body.page })
                            .exec((err, response) => {
                                rs.DT = { data: response, numOfPages: numOfPages }
                                return res.send(rs)
                            })
                    })
                })
            }
            else {
                res.DT = [];
                return res.send(rs)
            }
        })
    },
    get_table: (req, res) => {
        let CUSTID = req.body.CUSTID
        let { TLID, ROLECODE } = req.session.userinfo
        serviceTest.requsetPost({ TLID: TLID, CUSTID: CUSTID, ROLECODE: ROLECODE, LANG: "VN" }, 'front/syncCFAuthByCUSTID', function (err, rs) {
            if (err) {
                return res.send(err)
            }
            if (rs.EC == 0) {
                // console.log("rs backend", rs)
                CFAuthManager.find({ TLID: TLID, CUSTID: CUSTID }).exec((err, listCFAuthManager) => {
                    let result = listCFAuthManager.map((item) => {
                        return item.AUTOID
                    });
                    CFAUTH.find()
                        .where({ AUTOID: result })
                        .exec(function (err, response) {
                            return res.send(response)
                        });
                })
            }
            else {
                res.DT = [];
                return res.send(rs)
            }
        })

    },
    'update': function (req, data) {
        sails.log.info('vào update authorize');
        var sid = req.session.sessionid;//getCookie.getCookie(req.headers['cookie'], 'sessionid');
        Token.findOne({ sessionid: sid }).exec(function (err, token) {
            if (err) {

                // return res.send(401,'có lỗi');

            }

            Oauth2.requsetResrc(token.access_token, 'authorize/update', data, 'POST', function (err, rs) {

                // res.send(rs);
            });

        });
    },
    'add': function (req, data) {
        // var {ten,socmtnd,ngaycap,noicap,ngaHieuLuc,ngayHetHieuLuc,phamviUyQuyen} = req.body;
        // console.log('vào add authorize');
        //  var sid = getCookie.getCookie( req.headers['cookie'],'sessionid');
        //   Token.findOne({sessionid:sid}).exec(function(err,token){
        //        if(err){
        //            console.log('có lỗi');
        //            //return res.send(401,'có lỗi');
        //        }
        //       AuthorizeCaching.add('authorize',data.cmtnd,data,function(err,rsredis){
        //          console.log(rsredis);
        //       });
        //       Oauth2.requsetResrc(token.access_token,'authorize/add',data,'POST',function(err,rs){
        //         console.log(rs);
        //         // res.send(rs);
        //       });
        //
        //   });
        sails.log.info('vào add authorize');

        Authorize.create(data, function (err, au) {
            if (err) {

                //     res.send(401,"lỗi thêm authorize");

                //return  res.send(err)
            }

            Authorize.publishCreate(au);
            // vi redis k dinh nghia kieu object nen can chuyen qua dang string
            //   MSQueue.pubtest('add ' + au.id);
        });
    },

    'accessAddUpdate': function (req, res, next) {
        var { textBtn, data } = req.body;

        try {
            if (textBtn === "Thêm") {
                sails.log.info('vào add authorize');

                Authorize.create(data, function (err, au) {
                    if (err) {

                        //     res.send(401,"lỗi thêm authorize");
                        sails.log.error(err);
                        //return  res.send(err)
                    }
                    Authorize.publishCreate(au);
                    // vi redis k dinh nghia kieu object nen can chuyen qua dang string
                    //       Redis.publish('add_Authorize',JSON.stringify(au));

                    //dùng trong fonout
                    //    MSQueue.pubtest('ex_Authorize','queue_Authorize',data);

                    //dùng trong topic
                    //   MSQueue.pubtest_Topic('ex_Authorize', 'queue_Authorize', data);
                });



            } else {
                this.update(req, data);
            }
            return res.send("ok");
        } catch (e) {

            return res.send("fail");
        }

    },
    'get': function (req, res, next) {


        sails.log.info('vào get authorize');
        var sid = req.session.sessionid;//getCookie.getCookie(req.headers['cookie'], 'sessionid');
        Token.findOne({ sessionid: sid }).exec(function (err, token) {
            if (err) {
                sails.log.error('có lỗi');
                return res.send(401, 'có lỗi');
            }

            Oauth2.requsetResrc(token.access_token, 'authorize/get', req.body, 'POST', function (err, rs) {
                //  console.log(rs);
                res.send(rs);
            });

        });
    },
    destroy: function (req, res, next) {
        sails.log.info('vào xóa authorize');
        var sid = req.session.sessionid;//getCookie.getCookie(req.headers['cookie'], 'sessionid');
        Token.findOne({ sessionid: sid }).exec(function (err, token) {
            if (err) {
                sails.log.error('có lỗi');
                return res.send(401, 'có lỗi');
            }

            Oauth2.requsetResrc(token.access_token, 'authorize/destroy', req.body, 'POST', function (err, rs) {

                res.send(rs);
            });

        });


    },
    search: function (req, res) {
        var sortSearch = req.body.sortSearch;

        var dataSort = '';
        //generate chuoi sort
        if (sortSearch != undefined && sortSearch.length > 0) {

            if (sortSearch[0].desc === 'false') {
                dataSort = sortSearch[0].id + " DESC";
            }
            else {
                dataSort = sortSearch[0].id + " ASC";
            }

        }


        var dataSearch = req.body.keySearch;

        var likeSearch = {};
        //generate ra chuoi like search
        if (dataSearch != undefined && dataSearch.length > 0) {
            dataSearch.forEach(function (item) {

                likeSearch[item.id] = '%' + item.value + '%';
            })
        }


        Authorize.count({ like: likeSearch }).exec(function found(err, length) {
            if (err) return next(err);



            var pagesize = parseInt(req.body.pagesize);
            var numOfPages = Math.ceil(length / pagesize);
            var start = parseInt((req.body.page - 1) * pagesize);
            var keySearch = {};
            if (dataSort === '') {
                keySearch = { where: { like: likeSearch } };
                console.log(keySearch);
            }
            else {
                keySearch = { where: { like: likeSearch, sort: dataSort } };
                console.log(keySearch);
            }
            Authorize.find(keySearch).paginate({ limit: pagesize, page: req.body.page }).exec(function foundAuthorize(err, rs) {
                //    console.log(rs);
                return res.send({ data: rs, numPerPage: numOfPages });
            })

        });
    },
    'getAll': function (req, res, next) {
        // sails.log.info('getAll:function(req,res,next){ Authorize');
        //  var sid = getCookie.getCookie( req.headers['cookie'],'sessionid');
        //   Token.findOne({sessionid:sid}).exec(function(err,token){
        //        if(err){
        //            return res.send(401,'error');
        //        }
        //     if(!token){
        //
        //         Token.destroy(function(){
        //             console.log('delete all token');
        //         });
        //         return res.send(401,'no token ');
        //     }
        //
        //        console.log(token);
        //       Oauth2.requsetResrc(token.access_token,'authorize/getAll',req.body,'POST',function(err,rs){
        //         console.log('lay data roi nhe');
        //         console.log(rs);
        //         if(err){
        //           console.log(err);
        //           res.send({});
        //         }
        //         res.send(JSON.parse(rs));
        //       });



        //  });
        if (!req.isSocket) {
            sails.log.debug('no socket');
            return res.badRequest();
        }

        if (req.isSocket) {
            // If this code is running, it's made it past the `isAdmin` policy, so we can safely
            // watch for `.publishCreate()` calls about this model and inform this socket, since we're
            // confident it belongs to a logged-in administrator.
            // sails.log.debug('is socket');
            Authorize.watch(req);
        }

        Authorize.count(function foundAuthorize(err, length) {
            if (err) return next(err);

            //   console.log(  ' Authorize.count(function foundAuthorize(err,length){ ở bên App');
            var pagesize = req.body.pagesize;
            //   console.log(req.body.pagesize);
            var numOfPages = Math.ceil(length / pagesize);
            //        console.log(numOfPages);
            var start = (req.body.page - 1) * pagesize;

            Authorize.find().paginate({ limit: pagesize, page: req.body.page }).exec(function (err, rs) {
                //    console.log(rs);
                res.send({ data: rs, numOfPages: numOfPages });
            })

        });

    }
}
