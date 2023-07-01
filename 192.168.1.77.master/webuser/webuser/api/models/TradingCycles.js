/**
 * TradingCycles.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    AUTOID: {
      type: 'string'
    },
    SYMBOL: {
      type: 'string'
    },
    CONTENT: {
      type: 'string'
    },
    TRADINGCYCLEDTL: {
      type: 'string'
    },
    SPCODE: {
      type: 'string'
    },
  },
  syncCreate: function (values) {
    var self = this; // reference for use by callbacks
    return self.create(values).then((record)=>{
      return record;
    });
  },
};