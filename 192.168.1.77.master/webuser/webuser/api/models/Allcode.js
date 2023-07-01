/**
 * Allcode.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var lodash = require('lodash')
module.exports = {

  attributes: {
     CDID:{
        type:"string", primaryKey: true
     },
     CDTYPE:{
       type:"string"
     },
     CDNAME:{
       type:"string"
     },
     CDVAL:{
       type:"string"
     },
     CDCONTENT:{
       type:"string"
     },
     LSTODR:{
       type:"integer"
     },
     CDPARENT:{
       type:"string"
     },
     EN_CDCONTENT:{
       type:"text"
     }

  },
  find: function (criteria) {
    var CDIDlike = 'waterline:{allcode}:CDID:';
    if (criteria.CDTYPE) {
      CDIDlike += criteria.CDTYPE;
    }
    if (criteria.CDNAME) {
      CDIDlike += '.' + criteria.CDNAME;
    }
    if (criteria.CDVAL) {
      CDIDlike += '.' + criteria.CDVAL;
    }
    CDIDlike += '*';
    return new Promise((resolve, reject) => {
      this.native(function (err, con) {
        if (err) {
          sails.log.info('AllCode.find', err)
          resolve([])
        }
        var keys = con.keys(CDIDlike, function (err, keys) {
          if (err) {
            sails.log.info('AllCode.find', err)
            resolve([])
          }
          if (keys && keys.length > 0) {
            con.mget(keys, (err, jsons) => {
              if (err) {
                sails.log.info('AllCode.find', err)
                resolve([])
              }
              var values = [];
              for (let json of jsons) {
                values.push(JSON.parse(json));
              }
              values = lodash.filter(values, criteria);
              values = values.sort(function (obj1, obj2) {
                // Ascending: first LSTODR less than the previous
                return obj1.LSTODR - obj2.LSTODR;
              });
              resolve(values)
            });
          } else {
            resolve([])
          }
        });
      }
      );
    })
  }
};

