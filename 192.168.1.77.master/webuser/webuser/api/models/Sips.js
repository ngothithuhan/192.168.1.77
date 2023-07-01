/**
 * Sips.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    PRIKEY: { type: "string", primaryKey: true },
    TELLERID:{type:"string"},
    SPID: {
      type: 'string'
    },
    DESC_EXECTYPE: {
      type: 'string'
    },
    CUSTODYCD: {
      type: 'string'
    },
    SYMBOL: {
      type: 'string'
    },
    AMT: {
      type: 'string'
    },
    STATUS_DESC: {
      type: 'string'
    },
    BEGINDATE: {
      type: 'string'
    },
    USERNAME: {
      type: 'string'
    },
    TXTIME: {
      type: 'string'
    }
  },
   
  newInstance: function(obj) {
    let that = {}
    // for(var property in obj) { 
    // console.log("...obj", obj[property])  
    // } 
    for(var property in this.attributes) { 
        
      that[property] = (obj[property] == undefined) ? '' : obj[property];
    }
    that.MODELNAME = 'SIPS'
    return that;
  },
   syncCreate: function (values) {
    var self = this; // reference for use by callbacks
    return self.create(values).then((record)=>{
      return record;
    });
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
  
};

