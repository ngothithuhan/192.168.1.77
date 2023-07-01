/**
 * SaleMember.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {


    attributes: {
        id: {
            type: 'number', primaryKey: true, autoIncrement: true
        },
        TLFULLNAME: {
            type: 'string'
        },
        TLFULLNAME_KHONGDAU: {
            type: 'string'
        },
        SALEACCTNO: {
            type: 'string'
        },
        TLNAME: {
            type: 'string'
        },
        TLID: {
            type: 'string',
        },
    },

};

