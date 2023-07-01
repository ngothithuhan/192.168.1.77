/**
 * Accountmanage.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    TLID:{
      type:'string'
   },
    CUSTID:{
      type:"string"
    }
      // accounts:{
      //   collection: 'account',
      //   via:'owners',
      //   dominant: true
      // }
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

