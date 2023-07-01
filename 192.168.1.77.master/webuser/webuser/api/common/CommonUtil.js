/**
 * CommonUtil.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 * 
 * 
 */


 module.exports = {
    convertPropsNullToEmpty:function (obj) {
        for(var property in obj) {
            if (!obj[property]) {
                obj[property] ='';
            }
        }
        return obj;
    },

    isPDFBase64: function(base64) {
        if (base64) {
            if (base64.includes('data:application/pdf;base64')) return true;
        }
        return false;
    },
    
    ACTION: {
        UPDATE: 'U',
        APPROVE: 'A',
        REJECT: 'R',
        DELETE: 'D'
    }
  };