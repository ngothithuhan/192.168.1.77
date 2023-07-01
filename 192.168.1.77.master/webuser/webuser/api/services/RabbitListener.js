const RabbitReceiver = require('../rabbitmq/RabbitReceiver');
const messageHandler = require('../rabbitmq/RabbitMessageHandler');


var rabbitReceiver = null;
module.exports = function (cb) {

    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    var rabbitmqHost = sails.config.rabbitmqHost;
    var exchangeName = sails.config.exchangeName;
    var exchangeType = sails.config.exchangeType;
    var exchangeProperties = sails.config.exchangeProperties;
    var queueName= sails.config.queueName;

    rabbitReceiver = new RabbitReceiver(rabbitmqHost, exchangeName, exchangeType, exchangeProperties, messageHandler,queueName);
    rabbitReceiver.start();
    if (cb)
        cb();
};