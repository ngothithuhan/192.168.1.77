/**
 * UserinfoController
 *
 * @description :: Server-side logic for managing userinfoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var responeSucces = {
    errCode: 0,
    message: 'OK'
}
var responeFail = {
    errCode: -1,
    message: 'Error'
}
module.exports = {

    add: function (req, res) {
        let data = req.body;

        Userinfo.create(data).exec((err, user) => {
            if (err) {

                return res.json(401, responeFail);
            }
            return res.send(user);
        })
    },
    get: function (req, res) {
        let shtk = req.body.shtk || 0;
        Userinfo.findOne({ shtk: shtk }).exec((err, userinfo) => {
            if (err) {
                return res.json(401, responeFail);
            }
            return res.send(userinfo);
        })

    },
    update: function (req, res) {
        let id = req.body.id;
        let shtk = req.body.shtk;
        Userinfo.update({ id: id }, { shtk: shtk }).exec(function afterwards(err, updated) {
            if (err) {

            }

            return res.send(updated);
        })
    },
    search_all: function (req, res) {
        let key = req.body.key;
        let result = [];
        Userinfo.find({ shtk: { 'like': "%" + key + '%' } }).exec(function (err, users) {
            if (err) {
                res.send('error');

            }

            result = users.map((user) => {
                return {
                    value: user.hoten,
                    label: user.shtk

                }
            })
            console.log(result);
            res.send(result);
        })
    },
};

