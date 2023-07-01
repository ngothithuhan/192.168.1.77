/**
 * FeeTypes.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    ID: {
      type: 'string',
      primaryKey: true,
    },
    FEENAME: {
      type: 'string'
    },
    FEETYPE: {
      type: 'string'
    },
    CODEID: {
      type: 'string'
    },
    SPCODE: {
      type: 'string'
    },
    IPOID: {
      type: 'string'
    },
    IOROFEE: {
      type: 'string'
    },
    FRDATE: {
      type: 'string'
    },
    TODATE: {
      type: 'string'
    },
    REFID: {
      type: 'string'
    },
    ISINCENTIVE: {
      type: 'string'
    },
    CLSDAY: {
      type: 'string'
    },
    COMCYCLE: {
      type: 'string'
    },
    COMCAL: {
      type: 'string'
    },
    PAYINCENTIVEFEE: {
      type: 'string'
    },
    STATUS: {
      type: 'string'
    },
    PSTATUS: {
      type: 'string'
    },
    VER: {
      type: 'string'
    },
    LASTCHANGE: {
      type: 'string'
    },
  },
  syncCreate: function (values) {
		var self = this; // reference for use by callbacks
		return self.create(values).then((record) => {
			return record;
		});
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
};

