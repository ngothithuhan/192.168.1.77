/**
 * NAVController
 *
 * @description :: Server-side logic for managing NAVS
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var processingserver = require('../commonwebuser/ProcessingServer');
var ConvertData = require('../services/ConvertData');
module.exports = {
    add: function (req, res) {
        let data = req.body

        // let data = Orders.newInstance(body);
        data.TLID = req.session.userinfo.TLID
        data.REFlOGID = ''
        data.ROLE = req.session.userinfo.ROLECODE
        data.ACTION = req.body.ACTION;
        data.ret = { dir: 3003, type: 2004 };
        //  data = commonUtil.convertPropsNullToEmpty(data);

        let obj =
        {
            "funckey": "FOPKS_NAV.PRC_NAV",

            bindvar: data


        }

        processingserver.callAPI(obj, function (err, rs) {
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
                //console.log(error)
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });

    },
    get_NAV: function (req, res) {
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            TLID,
            ROLE: ROLECODE,
            REFlOGID: "",
            ret: { dir: 3003, type: 2004 }
        }
        let obj =
        {
            "funckey": "FOPKS_NAV.PRC_GET_NAVS",
            bindvar: rest
        }
        processingserver.callAPI(obj, function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
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
                        let result = ConvertData.convert_to_Object(rs.DT.ret);
                        delete rs.DT["ret"];
                        rs.DT.data = result;
                        //console.log("rs...", rs)
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
    get_TRADINGSESSION_BY_SYMBOL: function (req, res) {
        let data = {}

        // let data = Orders.newInstance(body);
        data.TLID = req.session.userinfo.TLID
        data.REFlOGID = ''
        data.SYMBOL = req.body.SYMBOL;
        data.ret = { dir: 3003, type: 2004 };
        data.ROLE = req.session.userinfo.ROLECODE
        //  data = commonUtil.convertPropsNullToEmpty(data);
        let obj =
        {
            "funckey": "FOPKS_SA.PRC_TRADINGSESSION_BY_SYMBOL",

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
    //lay gia tang giam
    getListNavPrice: async function (req, res) {
        let pv_tlid = ''
        let pv_role = ''
        try {
            let { TLID, ROLECODE } = req.session.userinfo;
            pv_tlid = TLID;
            pv_role = ROLECODE;
        } catch (error) {
            let rs = {}
            rs.EM = 'Lỗi lấy thông tin userinfo';
            rs.EC = -1001;
            return res.send(rs)
        }
        let data = req.body;

        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_tlid: pv_tlid,
            p_role: pv_role,
            p_language: data.language
        }
        //console.log("-----get getListNavPrice-------", rest)
        let obj =
        {
            "funckey": "prc_get_navprice",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                // console.log(".......rs.", rs)

                if (rs.EC == 0) {

                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    //phan trang

                    var DT = { data: result, EC: '0' }


                    return res.send(DT);

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
    getCompanyContact: async function (req, res) {
        let data = req.body;
        let rest = {
            p_refcursor: { dir: 3003, type: 2004 },
            p_language: data.language
        }
        //console.log("-----get getListNavPrice-------", rest)
        let obj =
        {
            "funckey": "prc_get_companycontact",
            bindvar: rest
        }
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                // console.log(".......rs.", rs)

                if (rs.EC == 0) {

                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    //phan trang

                    var DT = { data: result, EC: '0' }


                    return res.send(DT);

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
};

