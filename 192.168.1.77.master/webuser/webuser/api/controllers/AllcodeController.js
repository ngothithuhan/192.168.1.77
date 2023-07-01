

/**
 * AllcodeController
 *
 * @description :: Server-side logic for managing allcodes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var responeData = {
    errCode: 0,
    errMessage: "OK",
    data: []
};
var lodash = require('lodash')
function toNormalize(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace("Đ", "D")
}
module.exports = {
    get_swsymbol: function (req, res) {

        let { CODEID, SYMBOL } = req.body;
        let listCodeid = [];
        listCodeid[0] = CODEID
        let result = [];
        try {
            if (CODEID && SYMBOL) {
                // console.log("COdeID", CODEID, "...", SYMBOL);
                Funds.find({ CODEID: { '!': listCodeid } }).exec(function (err, list) {
                    if (err) {
                        res.send('error');
                    }
                    let result = [];
                    result = list.map((item) => {
                        return {
                            value: item.CODEID,
                            label: item.SYMBOL
                        }
                    })
                    return res.send(result);

                })
            }

        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    },
    getall_status_orders: async function (req, res) {
        var list = await Allcode.find({ CDNAME: "ORSTATUS", CDTYPE: "OD" });
        res.send(list);
    },
    get_status_account: function (req, res) {

    },
    getlist: async function (req, res) {
        let data = req.body;
        // delete req.body._csrf;
        if (data.CDTYPE && data.CDNAME) {
            var list = await Allcode.find({ CDTYPE: data.CDTYPE, CDNAME: data.CDNAME });
            responeData.data = list;
            return res.send(responeData);
        } else {
            return res.send(null);
        }
    },
    get_methods: async function (req, res) {
        var list = await Allcode.find({ CDTYPE: "SA", CDNAME: 'METHODS', CDVAL: { '!': ['ALL'] } });
        responeData.data = list;
        return res.send(responeData);
    },
    get_positions: async function (req, res) {
        var list = await Allcode.find({ CDTYPE: "CF", CDNAME: 'POSITIONS' });
        return res.send(list);
    },
    get_funds: function (req, res) {
        let CODEID = req.body.CODEID
        Funds.findOne({ CODEID: CODEID }).exec((err, funds) => {
            if (err) {

            }
            if (funds)
                return res.send({ value: funds.CODEID, label: funds.SYMBOL + '-' + funds.NAME })
            else
                return res.send({ value: '', label: '' })
        })
    },
    get_symbol: function (req, res) {
        let CODEID = req.body.CODEID
        Funds.findOne({ CODEID: CODEID }).exec((err, funds) => {
            if (err) {

            }
            if (funds) {
                responeData.DT = funds
            }
            else {
                responeData.EC = -1;
                responeData.EM = "no data"
            }
            return res.send(responeData)

        })
    },

    //ham này lâý danh sách Mã CCQ 
    search_all_funds: function (req, res) {
        let data = req.body.data;
        let searchList = '%' + (data ? data.key : '') + '%';
        let result = [];
        Funds.find({ SYMBOL: { 'like': searchList } }).where({ FTYPE: 'O' }).exec(function (err, list) {
            if (err) {
                res.send('error');

            }

            result = list.map((item) => {
                return {
                    value: item.CODEID,
                    label: item.SYMBOL
                }
            })
            return res.send(result);
        })
    },
    search_all_funds_with_all: function (req, res) {
        let { key } = req.body;
        let result = [];
        Funds.find({ SYMBOL: { 'like': "%" + key + '%' } }).where({ FTYPE: 'O' }).exec(function (err, list) {
            if (err) {
                res.send('error');

            }

            result = list.map((item) => {
                return {
                    value: item.CODEID,
                    label: item.SYMBOL
                }
            })
            result.unshift({ value: 'ALL', label: 'ALL' })

            return res.send(result);
        })
    },
    get_options_funds: function (req, res) {
        let dataFilter = req.body;
        Funds.find(dataFilter).exec(function (err, list) {
            if (err) {
                res.send('error');

            }

            result = list.map((item) => {
                return {
                    ...item,
                    value: item.CODEID,
                    label: item.SYMBOL,

                }
            })
            return res.send(result);
        })

    },
    getlist_feetypes: function (req, res) {
        let CODEID = req.body.CODEID
        FeeTypes.find({ CODEID: CODEID, FEETYPE: ['SRW', 'SIP'] }).exec((err, list) => {
            if (err) {

            }
            result = list.map((item) => {
                return {
                    value: item.ID,
                    label: item.FEENAME

                }
            })
            return res.send(result)
        })
    },
    get_feetype: function (CODEID, ID) {
        return new Promise((resolve, reject) => {
            FeeTypes.findOne({ CODEID: CODEID, FEETYPE: 'SRW', ID: ID }).exec((err, feetype) => {
                if (err) {
                    reject('')
                }
                if (feetype)
                    resolve(feetype.FEENAME)
                resolve('')
            })
        })

    },
    add: function (req, res) {
        let data = req.body;

        Allcode.create(data).exec((err, code) => {
            if (err) {
                responeData.errCode = -1;
                responeData.errMessage = 'error trong câu lệnh'
                return res.send(responeData);
            }
            responeData.data = code;
            return res.send(responeData);
        })
    },
    search_all: async function (req, res) {
        let { CDTYPE, CDNAME, key } = req.body;
        let result = [];
        var list = await Allcode.find({ CDTYPE: CDTYPE, CDNAME: CDNAME }, { CDVAL: { 'like': "%" + key + '%' } });
        result = list.map((item) => {
            // console.log("item..", item);
            return {
                value: item.CDVAL,
                label: item.CDCONTENT
            }
        })
        res.send(result);
    },
    update: function (req, res) {
        let CDVAL = req.body.CDVAL;
        let data = req.body.data;

        Allcode.update({ CDVAL: CDVAL }, data).exec((err, code) => {
            if (err) {
                responeData.errCode = -1;
                responeData.errMessage = 'error trong câu lệnh'
                return res.send(responeData);
            }
            responeData.data = code;
            return res.send(responeData);
        })
    },
    getall: async function (req, res) {
        var list = await Allcode.find();
        return res.send(list);
    },
    reset: function (req, res) {

        Allcode.destroy().exec((err, list) => {
            if (err) {
                responeData.errCode = -1;
                responeData.errMessage = 'error trong câu lệnh'
                return res.send(responeData);
            }
            responeData.data = list;
            return res.send(responeData);
        })
    },
    search_all_mb: async function (req, res) {
        let data = req.body.data;
        let result = [];
        var list = await Allcode.find(data);
        if (req.body.language != 'vie') {
            result = list.map((item) => {
                return {
                    value: item.CDVAL,
                    label: item.EN_CDCONTENT
                }
            })
        } else {
            result = list.map((item) => {
                return {
                    value: item.CDVAL,
                    label: item.CDCONTENT
                }
            })
        }

        return res.send(result);
    },
    search_all_salemember: async function (req, res) {
        let key = req.body.key;
        let result = [];
        var list = await SaleMember.find({ where: { TLFULLNAME_KHONGDAU: { 'like': '%' + key.toUpperCase() + '%' } }, limit: 10 });
        sails.log('thanh.ngo=========list:', list);
        result = list.map((item) => {
            return {
                value: item.SALEACCTNO,
                label: item.TLFULLNAME
            }
        })
        return res.send(result);
    },
};

