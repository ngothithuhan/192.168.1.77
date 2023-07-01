/**
 * UserFunc.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var lodash = require('lodash')
module.exports = {

  attributes: {
		USERFUNCID: {
			type: 'string', primaryKey: true
		},
		USERID: {
			type: 'string'
		},
		TLID: {
			type: 'string'
		},
		ROLES: {
			type: 'string'
		},
		ROLECODE: {
			type: 'string'
		},
    OBJNAME: {
      type: 'string'
    },
    CMDNAME: {
      type: 'string'
    },
    EN_CMDNAME: {
      type: 'string'
    },
    ISINQUIRY: {
      type: 'string'
    },
    ISADD: {
      type: 'string'
    },
    ISEDIT: {
      type: 'string'
    },
    ISDELETE: {
      type: 'string'
    },
    ISAPPROVE: {
      type: 'string'
    },
    ODRID: {
      type: 'string'
    },
    CMDCODE: {
      type: 'string'
    },
    CMDID: {
      type: 'string'
    },
    PRID: {
      type: 'string'
    },
    LEV: {
      type: 'string'
    },
    LAST: {
      type: 'string'
    },
    IMGINDEX: {
      type: 'string'
    },
    MODCODE: {
      type: 'string'
    },
    MENUTYPE: {
      type: 'string'
    },
    CMDALLOW: {
      type: 'string'
    },
    AUTHCODE: {
      type: 'string'
    },
    RIGHTSCOPE: {
      type: 'string'
    },
    SHORTCUT: {
      type: 'string'
    }
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
  // beforeCreate: function (values, next) {
	// 	values.USERFUNCID = values.TLID + ":" + values.USERID + ":" + values.CMDID;
  //   next();
  // },
  find: function (criteria) {
    var USERFUNDIDlike = 'waterline:{userfunc}:USERFUNCID:';
    const searchProps = ["TLID","USERID","CMDID"];
    searchProps.forEach(element => {
      USERFUNDIDlike += criteria[element]?criteria[element]:"*";
    });
    return new Promise((resolve, reject) => {
      this.native(function (err, con) {
        if (err) {
          sails.log.info('userfunc.find', err)
          resolve([])
        }
        var keys = con.keys(USERFUNDIDlike, function (err, keys) {
          if (err) {
            sails.log.info('userfunc.find', err)
            resolve([])
          }
          if (keys && keys.length > 0) {
            con.mget(keys, (err, jsons) => {
              if (err) {
                sails.log.info('userfunc.find', err)
                resolve([])
              }
              var values = [];
              for (let json of jsons) {
                values.push(JSON.parse(json));
              }
              values = lodash.filter(values, criteria);
              values = values.sort(function (obj1, obj2) {
                // Ascending: first ODRNUM less than the previous
                return obj1.ODRNUM - obj2.ODRNUM;
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

