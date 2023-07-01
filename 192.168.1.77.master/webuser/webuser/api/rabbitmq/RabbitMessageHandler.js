var path = require('path');
const SignalEnum = require(path.resolve(__dirname, './SignalEnum.js'));
var request = require('request');
var LogHelper = require(path.resolve(__dirname, '../common/LogHelper.js'));

const TAG_CLASS = 'RabbitMessageHandler';

module.exports = {
    handler: function (message) {
        sails.log.info(message);
        try {
            var jsonMsg = JSON.parse(message);
            if (jsonMsg) {
                this.processEvent(jsonMsg);
                // jsonMsg.forEach(element => {
                //     this.processEvent(element);
                // });
            }
        } catch (e) {
            sails.log.error("handlerError", message, e);
        }
    },
    processEvent: function (e) {
        switch (e.msgtype) {
            case "R":
                this.processSignal(e);
                break;
            case "C":
                this.processCreate(e);
                break;
            case "U":
                this.processUpdate(e);
                break;
            case "D":
                this.processDelete(e);
                break;
            default:
                sails.log.info("processEvent", "Unkown msgtype", e.msgtype, e)
                break;
        }
    },
    processSignal: function (e) {
        var TAG_FUNC = 'processSignal';
        if (e.datatype) {
            if (!SignalEnum[e.datatype]) {
                sails.log.error(LogHelper.Add(TAG_CLASS, TAG_FUNC, LogHelper.FINISH, 'Chưa khai báo datatype: ', e.datatype, 'trong SignalEnum.js'));
                return;
            }
            var func = SignalEnum[e.datatype]();

            if (func) {
                try {
                    func(e.refid)
                } catch (error) {
                    sails.log.error(LogHelper.Add(TAG_CLASS, TAG_FUNC, LogHelper.FINISH, 'Error of ', e.datatype), error);
                }
            } else {
                sails.log.info(LogHelper.Add(TAG_CLASS, TAG_FUNC, LogHelper.FINISH, 'Empty func of ', e.datatype));
            }
        }
    },
    processCreate: function (e) {

    },
    processUpdate: function (e) {

    },
    processDelete: function (e) {

    }
}