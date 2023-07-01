/**
 * Userinfo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
      FOUSERID:{ type: 'string', primaryKey: true},
      TLID: { type: 'string' },
      USERID: { type: 'string' },
      USERNAME: { type: 'string' },
      TLFULLNAME: { type: 'string' },
      MBCODE: { type: 'string' },
      ACTIVE: { type: 'string' },
      TLTYPE: { type: 'string' },
      STATUS: { type: 'string' },
      DEPARTMENT: { type: 'string' },
      TLTITLE: { type: 'string' },
      IDCODE: { type: 'string' },
      MOBILE: { type: 'string' },
      EMAIL: { type: 'string' },
      DESCRIPTION: { type: 'string' },
      DBCODE: { type: 'string' },
      ROLECODE: { type: 'string' },
      ISCUSTOMER: { type: 'string' },
      ISGROUPUSER: { type: 'boolean',defaultsTo: false },
      CUSTID: { type: 'string' },
      ISRESET: { type: 'string' },
      LANGUAGE:{type:'string'}
  }
};

