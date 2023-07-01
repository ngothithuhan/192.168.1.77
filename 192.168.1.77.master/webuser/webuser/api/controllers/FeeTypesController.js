/**
 * FeeTypesController
 *
 * @description :: Server-side logic for managing Feetypes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    get_all: function (req, res) {
        FeeTypes.find().exec((err, list) => {
            res.send(list)
        })
    }
};

