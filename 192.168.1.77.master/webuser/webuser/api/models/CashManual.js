/**
 * CashManual.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        AMT: {
            type: "string"
        },
        BANKACCOUNT:
            {
                type: "string"
            },
        CODEID:
            {
                type: "string"
            },
        DESCBANK:
            {
                type: "string"
            },
        DESC:
            {
                type: "string"
            },
        ERRMSG:
            {
                type: "string"
            },
        FILEID:
            {
                type: "string"
            },
        ID:
            {
                type: "string"
            },
        IMPORTDATE:
            {
                type: "string"
            },
        INPUTTYPE:
            {
                type: "string"
            },
        ISPROCESS:
            {
                type: "string"
            },
        LASTCHANGE:
            {
                type: "string"
            },
        LOGTIME:
            {
                type: "string"
            },
        PCONTENT:
            {
                type: "string"
            },
        PROCESSTIME:
            {
                type: "string"
            },
        SIPID:
            {
                type: "string"
            },
        STATUS:
            {
                type: "string"
            },
        STATUS_DESC:
            {
                type: "string"
            },
        STATUS_DESC_EN:
            {
                type: "string"
            },
        SYMBOL:
            {
                type: "string"
            },
        TRANSDATE:
            {
                type: "string"
            },
        TRANSID:
            {
                type: "string"
            },
        TXDATE:
            {
                type: "string"
            },
        TXNUM:
            {
                type: "string"
            },
    },
    newInstance: function (obj) {
        let that = {}
        for (var property in this.attributes) {
            that[property] = (obj[property] == undefined) ? '' : obj[property];
        }
        that.MODELNAME = 'CASHMUANUAL'
        return that;
    },
};

