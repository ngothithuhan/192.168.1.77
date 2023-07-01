
var path = require('path')

var data = require('../datafake/Account.json')
var processingserver = require('../commonwebuser/ProcessingServer');
var commonUtil = require('../common/CommonUtil');
var Ioutput = require(path.resolve(__dirname, '../common/OutputInterface.js'));
var RestfulHandler = require('../common/RestfulHandler');
var ConvertData = require('../services/ConvertData');
module.exports = {

    getlistcelendar: async function (req, res) {
        let data = req.body;
        let rest = {
            p_year: data.year,
            p_month: data.month,
            p_refcursor: { dir: 3003, type: 2004 }
        }
        let obj =
        {
            "funckey": "prc_get_daysofmonth",
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
    //lấy lịch SIP theo CCQ
    getlist_sip_calendar: async function (req, res) {
        let data = req.body;
        let rest = {
            p_year: data.year,
            p_month: data.month,
            p_codeid: data.codeid,
            p_refcursor: { dir: 3003, type: 2004 }
        }
        let obj =
        {
            "funckey": "prc_get_daysofmonth_forsip",
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
    setlistcelendar: async function (req, res) {
        let data = req.body;
        let rest = {

            p_day: req.body.p_day,
            p_isholiday: data.p_isholiday,
            p_cldrtype: '000'
        }

        let obj =
        {
            "funckey": "prc_set_holiday",
            bindvar: rest
        }
        processingserver.callAPI(obj, function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {

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
    //cập nhật lịch sip
    setlist_sip_calendar: async function (req, res) {
        let data = req.body;
        let rest = {
            p_day: req.body.p_day,
            p_issip: data.p_issip,
            p_cldrtype: data.p_codeid,
        }

        let obj =
        {
            "funckey": "prc_set_holiday_forsip",
            bindvar: rest
        }
        processingserver.callAPI(obj, function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {

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