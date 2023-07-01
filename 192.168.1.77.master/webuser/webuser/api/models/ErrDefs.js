/**
 * ErrDefs.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    ERRNUM: {
  		type:'string',primaryKey:true
  	},
    ERRDESC: {
  		type:'string'
  	},
    EN_ERRDESC: {
  		type:'string'
  	},
    MODCODE: {
  		type:'string'
		},
		},
		findErr: function (errnum) {
			return this.findOne({ ERRNUM: errnum }).then((err, errdefs) => {
				if (err) {
					return 'Lỗi thực hiện trên redis - ErrDefs';
				}
	
				if (errdefs)
					return errnum + ' - ' + errdefs.ERRDESC;
	
				return errnum + ' - Lỗi chưa định nghĩa';
			});
  }
};

