module.exports = {
    SIPS: function () {
        return sails.controllers.notify.loadSips;
    },
    ORDERS: function () {
        return sails.controllers.notify.loadNormalOrders;
    },
    ACCOUNTS: function () {
        return sails.controllers.notify.loadAccounts;
    },
    // TLPROFILES: function () {
    //     return sails.controllers.notify.loadUser_Login;
    // },
    TRANS: function () {
        return sails.controllers.notify.loadTrans;
    }
}