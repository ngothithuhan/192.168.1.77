/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */




var moment = require('moment');
var path = require('path');
var sails = require('sails');
const RabbitListener = require(path.resolve(__dirname, '../api/services/RabbitListener'));
module.exports.bootstrap = async function (cb) {
  await sails.controllers.notify.loadTrans_Login('ALL', moment().format('DD/MM/YYYY'), 'ALL')
  await sails.controllers.notify.loadAccounts_Login('ALL', 'ALL', 'ALL')
  await sails.controllers.notify.loadSips_Login('ALL', 'ALL', 'ALL')
  await sails.controllers.notify.loadNormalOrders_Login('ALL', 'ALL', 'ALL', 'ALL', 'ALL')
  rbListener = new RabbitListener(function () {
    sails.log.info("RabbitListener started!!!!!!");
  });
  cb();
};

process.on('uncaughtException', function (err) {
  // console.log('Uncaught exception ', err);
  sails.log.error('Uncaught exception ', err);
});

process.on('SIGTERM', function () {
  // console.log('Received SIGTERM');
  sails.log.error('Received SIGTERM');
});

process.on('SIGINT', function () {
  // console.log('Received SIGINT');
  sails.log.error('Received SIGINT');
});
