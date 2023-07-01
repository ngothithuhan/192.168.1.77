var amqp = require('amqplib/callback_api');
var amqpConn = null;
const LOCATION_START = "startExchangeListener";
const LOCATION_CLOSE = "closeOnErr";
const LOCATION_STARTCHANNEL = "startChannel";
const RECONNECT_TIMEOUT = 3000;
var rabbitRetry = null;
class RabbitReceiver {
    constructor(rabbitmqHost, exchangeName, exchangeType, exchangeProps, messageHandler,queueName) {
        this.rabbitmqHost = rabbitmqHost;
        this.exchangeName = exchangeName;
        this.exchangeType = exchangeType;
        this.exchangeProps = exchangeProps;
        this.messageHandler = messageHandler;
        this.queueName= queueName;
        rabbitRetry = this.start.bind(this);
    }
    start() {
        var that = this;
        try {
            sails.log.info(LOCATION_START, 'Start exchange listener', this.rabbitmqHost);
            amqp.connect(this.rabbitmqHost, (err, conn) => {
                if (err) {
                    sails.log.error(LOCATION_START, "[AMQP] connect", this.rabbitmqHost, err);
                    return setTimeout(rabbitRetry, RECONNECT_TIMEOUT);
                }

                conn.on("error", function (err) {
                    if (err.message !== "Connection closing") {
                        sails.log.error(LOCATION_START, "[AMQP] conn error", err.message);
                    }
                });
                conn.on("close", function () {
                    sails.log.error(LOCATION_START, "[AMQP] reconnecting");
                    return setTimeout(rabbitRetry, RECONNECT_TIMEOUT);
                });

                sails.log.info(LOCATION_START, "[AMQP] connected");
                amqpConn = conn;

                that.whenConnected();

            });
        } catch (error) {
            this.closeOnErr(error);
            return setTimeout(rabbitRetry, RECONNECT_TIMEOUT);
        }
    }
    whenConnected() {
        this.startWorker();
    }
    startWorker() {
        var that = this;
        amqpConn.createChannel((err, channel) => {
            if (this.closeOnErr(err)) return;
            var queueName = that.queueName;
            let thatChannel = channel;
            channel.on("error", function (err) {
                sails.log.error(LOCATION_STARTCHANNEL, "[AMQP] channel error", err);
                if (err) {
                    that.closeOnErr(err);
                    thatChannel.close();
                    if (err.message && err.message.indexOf(queueName) >= 0) {
                        return setTimeout(rabbitRetry, RECONNECT_TIMEOUT);
                    }
                }
            });
            channel.on("close", function () {
                sails.log.error(LOCATION_STARTCHANNEL, "[AMQP] channel closed");
            });
            channel.prefetch(10);
            channel.assertExchange(that.exchangeName, that.exchangeType, that.exchangeProps);
            channel.assertQueue(queueName, { autoDelete: true, exclusive: true });
            //for fanout type exchange, routing key is useless
            channel.bindQueue(queueName, that.exchangeName, "");
            channel.consume(queueName, function (message) {
                //callback funtion on receiving messages
                // sails.log.debug(LOCATION_STARTCHANNEL, message.content.toString());
                that.messageHandler.handler(message.content.toString());
            }, { noAck: true });
            sails.log.info(LOCATION_STARTCHANNEL, "Worker is started");
        });
    }
    closeOnErr(err) {
        try {
            if (!err) return false;
            sails.log.error(LOCATION_CLOSE, "[AMQP] error", err);
            if (amqpConn) {
                amqpConn.close();
                sails.log.info(LOCATION_CLOSE, "[AMQP] error closed########################");
            }
            return true;
        } catch (e) {
            sails.log.error(LOCATION_CLOSE, "[AMQP] error Exception", e);
            return false;
        }
    }
}
module.exports = RabbitReceiver;
