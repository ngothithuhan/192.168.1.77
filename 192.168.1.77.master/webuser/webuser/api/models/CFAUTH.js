/**
 * CFAUTH.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    ACTION: {
  		type:'string'
    },
    AUTOID:{
  		type:'string'
    },
    ACCTNO:{
  		type:'string'
    },
    CUSTID:{
  		type:'string'
    },
    CUSTNAME:{
  		type:'string'
    },
    IDCODE:{
  		type:'string'
    },
    IDDATE:{
  		type:'string'
    },
    IDPLACE:{
  		type:'string'
    },
    EFDATE:{
  		type:'string'
    },
    EXDATE:{
  		type:'string'
    },
    ADDRESS:{
  		type:'string'
    },
    LINKAUTH:{
  		type:'string'
    },
    TLID:{
  		type:'string'
    },
    ROLE:{
  		type:'string'
    },
    VIA:{
  		type:'string'
    },
    CASIGNATURE:{
      type:'string'
    }
  },
  newInstance: function(obj) {
    let that = {}
    for(var property in this.attributes) { 
        
      that[property] = (obj[property] == undefined) ? '' : obj[property];
    }
    that.MODELNAME = 'CFAUTH'
    return that;
	},
};

