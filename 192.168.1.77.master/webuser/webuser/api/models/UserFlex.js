/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
        username:{
           type:'string'

        },
        password:{
           type:'string'
        },
        sessionid:{
          type:'string',
          primaryKey:true
        },
        toJSON: function() {
          var obj = this.toObject();

          return obj;
       }



  }
};
