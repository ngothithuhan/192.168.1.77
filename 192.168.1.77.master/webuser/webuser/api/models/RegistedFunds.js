/**
 * RegistedFunds.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    AUTOID: {
      type: "string"
    },
    CUSTID: {
      type: "string"
    },
    ACCTNO: {
      type: "string"
    },
    AFACCTNO: {
      type: "string"
    },
    CODEID: {
      type: "string"
    },
    SYMBOL: {
      type: "string"
    },
    REID: {
      type: "string"
    },
    TXDATE: {
      type: "string"
    },
    STATUS: {
      type: "string"
    },
    FULLNAME: {
      type: "string"
    },
  },
  newInstance: function(obj) {
    let that = {}
    for(var property in this.attributes) { 
        
      that[property] = (obj[property] == undefined) ? '' : obj[property];
    }
    that.MODELNAME = 'ACCOUNT'
    return that;
	},
};

