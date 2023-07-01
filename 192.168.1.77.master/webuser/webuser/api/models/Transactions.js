/**
 * Transactions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    PRIKEY: { type: 'string', primaryKey: true },
    CFFULLNAME: { type: 'string' },
    IDAFACCTNO: { type: 'string' },
    CODEID: { type: 'string' },
    NAMENV: { type: 'string' },
    CAREBYGRP: { type: 'string' },
    AUTOID: { type: 'string' },
    DELTD: { type: 'string' },
    TXNUM: { type: 'string' },
    TXDATE: { type: 'string' },
    BUSDATE: { type: 'string' },
    BRID: { type: 'string' },
    TLTXCD: { type: 'string' },
    TXSTATUS: { type: 'string' },
    TXSTATUSCD: { type: 'string' },
    TXDESC: { type: 'string' },
    ACCTNO: { type: 'string' },
    AMT: { type: 'string' },
    TLID: { type: 'string' },
    CHID: { type: 'string' },
    CHKID: { type: 'string' },
    OFFID: { type: 'string' },
    TLNAME: { type: 'string' },
    CHNAME: { type: 'string' },
    CHKNAME: { type: 'string' },
    OFFNAME: { type: 'string' },
    TXTIME: { type: 'string' },
    OFFTIME: { type: 'string' },
    LVEL: { type: 'string' },
    DSTATUS: { type: 'string' },
    ACTION: { type: 'string' }
  },
  newInstance: function (obj) {
    let that = {}
    for (var property in this.attributes) {
      that[property] = (obj[property] == undefined) ? '' : obj[property];
    }
    that.MODELNAME = 'TRANSACTIONS'
    return that;
  },
};

