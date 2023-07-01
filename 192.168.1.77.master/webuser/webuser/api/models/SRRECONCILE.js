/**
 * SRRECONCILE.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    AUTOID	:{type:'integer'},
    ORDERID	:{type:'string'},
    CUSTODYCD	:{type:'string'},
    ACCOUNT	:{type:'string'},
    SYMBOL	:{type:'string'},
    SRTYPE	:{type:'string'},
    SRTYPE_DESC	:{type:'string'},
    ORDAMT	:{type:'integer'},
    AMOUNT	:{type:'integer'},
    CONTENT	:{type:'string'},
    REFTXNUM	:{type:'string'},
    ADJAMT	:{type:'integer'},
    STATUS	:{type:'string'},
    STATUS_DESC	:{type:'string'},
    MISSAMT	:{type:'integer'},
    EXAMT	:{type:'integer'},
    LASTCHANGE	:{type:'string'},

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

