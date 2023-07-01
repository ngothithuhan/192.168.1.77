/**
 * Remisers.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    AUTOID: {
      type: "string"
    },
    FULLNAME: {
      type: "string"
    },
    NOTE: {
      type: "string"
    },
    EMAIL: {
      type: "string"
    },
    PHONE: {
      type: "string"
    },
    ADDRESS: {
      type: "string"
    },
    DBCODE:{
        type: "string"
      },
    TXDATE: {
      type: "string"
    },
    TLID: {
      type: "string"
    },
    ROLE: {
      type: "string"
    },
    STATUS: {
      type: "string"
    }
    
  },
  newInstance: function(obj) {
    let that = {}
    for(var property in this.attributes) { 
        
      that[property] = (obj[property] == undefined) ? '' : obj[property];
    }
    that.MODELNAME = 'REMISER'
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
  syncDestroy: function (values) {
    var self = this; // reference for use by callbacks
    return self.destroy(values).then((err)=>{
      return err;
    });
  },
};

