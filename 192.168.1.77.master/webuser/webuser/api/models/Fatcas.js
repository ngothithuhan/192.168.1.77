/**
 * Fatcas.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    ACTION: {type: 'string'},
    CUSTID: {type: 'string'},
    ISUSCITIZEN: {type: 'string'},
    ISUSPLACEOFBIRTH: {type: 'string'},
    ISUSMAIL: {type: 'string'},
    ISUSPHONE: {type: 'string'},
    ISUSTRANFER: {type: 'string'},
    ISAUTHRIGH: {type: 'string'},
    ISSOLEADDRESS: {type: 'string'},
    OPNDATE: {type: 'string'},
    ISDISAGREE: {type: 'string'},
    ISOPPOSITION: {type: 'string'},
    ISUSSIGN: {type: 'string'},
    REOPNDATE: {type: 'string'},
    W9ORW8BEN: {type: 'string'},
    FULLNAME: {type: 'string'},
    ROOMNUMBER: {type: 'string'},
    CITY: {type: 'string'},
    STATE: {type: 'string'},
    NATIONAL: {type: 'string'},
    ZIPCODE: {type: 'string'},
    ISSSN: {type: 'string'},
    ISIRS: {type: 'string'},
    OTHER: {type: 'string'},
    W8MAILROOMNUMBER: {type: 'string'},
    W8MAILCITY: {type: 'string'},
    W8MAILSTATE: {type: 'string'},
    W8MAILNATIONAL: {type: 'string'},
    W8MAILZIPCODE: {type: 'string'},
    IDENUMTAX: {type: 'string'},
    FOREIGNTAX: {type: 'string'},
    REF: {type: 'string'},
    FIRSTCALL: {type: 'string'},
    FIRSTNOTE: {type: 'string'},
    SECONDCALL: {type: 'string'},
    SECONDNOTE: {type: 'string'},
    THIRTHCALL: {type: 'string'},
    THIRTHNOTE: {type: 'string'},
    ISUS: {type: 'string'},
    SIGNDATE: {type: 'string'},
    NOTE: {type: 'string'},
    TLID: {type: 'string'},
    ROLE: {type: 'string'},
    VIA: {type: 'string'},
    CASIGNATURE: {type: 'string'},
  },
  newInstance: function(obj) {
    let that = {}
    for(var property in this.attributes) { 
        
      that[property] = (obj[property] == undefined) ? '' : obj[property];
    }
    that.MODELNAME = 'FATCA'
    return that;
	},
};

