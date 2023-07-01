/**
 * MobileController
 *
 * @description :: Server-side logic for managing mobile
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var RestfulHandler = require('../common/RestfulHandler')
var processingserver = require('../commonwebuser/ProcessingServer')
var path = require('path')
var Ioutput = require(path.resolve(__dirname, '../common/OutputInterface.js'));
var LogHelper = require(path.resolve(__dirname, '../common/LogHelper'));
const LOG_TAG = "MobileController.:";

module.exports = {
    getAllOrdersByUsername: async function (username) {
        let orders = [];
        orders = await Paging.find(AllOrders, [
            { id: "CFUSERNAME", value: username }
        ]);
        return orders;
    },
    getNormalOrdersList: async function (req, res) {
        try {
            let result = [];
            //phan trang
            let { pagesize, page, keySearch, sortSearch, username, status } = req.query;
            let numAcc = 0
            result = await sails.controllers.mobile.getAllOrdersByUsername(username);
            if (keySearch)
                if (keySearch.length > 0)
                    result = await Paging.find(result, keySearch)
            
            if (status && status.length > 0) {
                let statusArr = status.split("|");
                let isNotIn = false;
                if (statusArr[0] == "~!~" ) {
                    statusArr.slice(1);
                    isNotIn = true;
                }
                result = await Paging.findArrVal(result, 'STATUS', statusArr, isNotIn);
            }

            let numOfPages = Math.ceil(result.length / pagesize);
            numAcc = result.length
            if (sortSearch) {
                if (sortSearch.length > 0)
                    result = await Paging.orderby(result, sortSearch)
                else
                    result = await Paging.orderby(result, [{ id: 'TXDATE', desc: true }, { id: 'CREATEDT', desc: true }])
            }
            else
                result = await Paging.orderby(result, [{ id: 'TXDATE', desc: true }, { id: 'CREATEDT', desc: true }])
            result = await Paging.paginate(result, pagesize, page ? page : 1)
            var DT = { data: result, numOfPages: numOfPages, sumRecord: numAcc }
            return res.send(Ioutput.success(DT));
        } catch (error) {
            let rs = {}
            rs.EM = 'Lỗi client gọi api';
            rs.EC = -1000;
            return res.send(rs)
        }
    },
    getAllSipsByUsername: async function (username) {
        let sips = [];
        sips = await Paging.find(AllSips, [
            { id: "CFUSERNAME", value: username }
        ]);
        return sips;
    },
    getSIPOrdersList: async function (req, res) {
        try {
            let result = [];
            let sum = 0
            //phan trang
            let { pagesize, page, keySearch, sortSearch, username } = req.query;
            result = await this.getAllSipsByUsername(username);

            if (keySearch)
                if (keySearch.length > 0)
                    result = await Paging.find(result, keySearch)
            let numOfPages = Math.ceil(result.length / pagesize);
            sum = result.length
            if (sortSearch) {
                if (sortSearch.length > 0)
                    result = await Paging.orderby(result, sortSearch)
                else
                    result = await Paging.orderby(result, [{ id: 'TXDATE', desc: true }, { id: 'CREATEDT', desc: true }])
            }
            else
                result = await Paging.orderby(result, [{ id: 'TXDATE', desc: true }, { id: 'CREATEDT', desc: true }])
            result = await Paging.paginate(result, pagesize, page ? page : 1)
            var DT = { data: result, numOfPages: numOfPages, sumRecord: sum }
            return res.send(Ioutput.success(DT));
        } catch (error) {
            let rs = {}
            rs.EM = 'Lỗi client gọi api';
            rs.EC = -1000;
            return res.send(rs)
        }
    },

    getAllFunds: (req, res) => {
        sails.log.info(LOG_TAG, 'getAllFunds.begin', req.query)
         req.body = {
           data: {key: req.query.key }
         }
        return sails.controllers.allcode.search_all_funds(req, res);
    },

    getSWSymbol: (req, res) => {
        sails.log.info(LOG_TAG, 'getSWSymbol.begin', req.query)
        req.body = {
             CODEID: req.query.codeid,
             SYMBOL: req.query.symbol,
          }
        return sails.controllers.allcode.get_swsymbol(req, res);
    },

    getSaleMember: (req, res) => {
        sails.log.info(LOG_TAG, 'getSaleMember.begin', req.query)
         req.body = {
            key: req.query.key 
         }
        return sails.controllers.allcode.search_all_salemember(req, res);
    },
}