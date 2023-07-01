/**
 * FundBalances.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    SEDTLID: {
      type: 'integer'
    },
    AFACCTNO: {
      type: 'string'
    },
    CUSTODYCD: {
      type: 'string'
    },
    SID: {
      type: 'string'
    },
    CODEID: {
      type: 'string'
    },
    SEACCTNO: {
      type: 'string'
    },
    SYMBOL: {
      type: 'string'
    },
    ORDERID: {
      type: 'string'
    },
    TOTALQTTY: {
      type: 'integer'
    },
    AVLQTTY: {
      type: 'integer'
    },
    TXDATE: {
      type: 'string'
    },
    NORS: {
      type: 'string'
    },
    SPNAME: {
      type: 'string'
    },
    BUYAMT:{
      type:'string'
    },
    PNL:{
      type:'string'
    },
    PNLPERCENT:{
      type:'string'
    },
    TOTALNAV:{
      type:'string'
    },
    BALQTTY:{
      type:'string'
    }
  },
  newInstance: function(obj) {
    let that = {}
    for(var property in this.attributes) { 
        
      that[property] = (obj[property] == undefined) ? '' : obj[property];
    }
    that.MODELNAME = 'FundBalances'
    return that;
  },
  updateOrCreate: function (criteria, values) {
    var self = this; // reference for use by callbacks

    // If no values were specified, use criteria
    if (!values) values = criteria.where ? criteria.where : criteria;

    return this.findOne(criteria).then(function (result) {
      if (result) {
        return self.update(criteria, values);
      } else {
        return self.create(values);
      }
    });
  },
  syncCreate: function (values) {
		var self = this; // reference for use by callbacks
		return self.create(values).then((record)=>{
			return record;
		});
  },
};

