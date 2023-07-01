/**
 * SipDefs.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    SPCODE: {
    type:'string'
   },
SPNAME: {
    type:'string'
   },
CODEID: {
    type:'string'
   },
SYMBOL: {
    type:'string'
   },
FRDATE: {
    type:'string'
   },
TODATE: {
    type:'string'
   },
METHODS: {
    type:'string'
   },
METHODS_DESC: {
    type:'string'
   },
MINAMT: {
    type:'string'
   },
MAXAMT: {
    type:'string'
   },
MINTERM: {
    type:'string'
   },
MAXTERM: {
    type:'string'
   },
STATUS: {
    type:'string'
   },
DESCRIPTION: {
    type:'string'
   }
  },
  syncCreate: function (values) {
    var self = this; // reference for use by callbacks
    return self.create(values).then((record)=>{
      return record;
    });
  },
};

