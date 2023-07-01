/**
 * TransferFundController
 *
 * @description :: Server-side logic for managing Transferfunds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var RestfulHandler = require('../common/RestfulHandler')
var processingserver = require('../commonwebuser/ProcessingServer')
var path = require('path')

var data = require('../datafake/Account.json')
var commonUtil = require('../common/CommonUtil');
var Ioutput = require(path.resolve(__dirname, '../common/OutputInterface.js'));
module.exports = {


    /*linh.trinh lay chi tiet chuyen khoan */
    get_sedtl: function (req, res) {
        try {
            let data = {};
            data.ret = { dir: 3003, type: 2004 }
            data = RestfulHandler.addSessionInfo(data, req);
            data.CUSTODYCD = req.body.CUSTODYCD
            data.CODEID = req.body.CODEID
            data.REFLOGID = '';
            let obj =
            {
                "funckey": "FOPKS_SR.PRC_SEDTL",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {
                if (err) {
                    sails.log.error(err);
                    return res.send(Ioutput.errServer(err));
                }
                if (rs.EC == 0) {
                    let DT = await ConvertData.convert_to_Object(rs.DT.ret);
                    return res.send(Ioutput.success(DT));
                }
                else {
                    return res.send(rs);
                }

            })
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },

    /*giang.ngo chuyển khoản chứng khoán */
    transferSec: function (req, res) {
        try {
            let data = req.body;
            data = RestfulHandler.addSessionInfo(data, req);
            data.REFLOGID = '';
            let obj =
            {
                "funckey": "FOPKS_SE.PRC_TRANSFER_SEC",
                bindvar: data
            }
            processingserver.callAPI(obj, async function (err, rs) {
                if (err) {
                    sails.log.error(err);
                    return res.send(Ioutput.errServer(err));
                }
                return res.send(rs);
            })
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },

};

