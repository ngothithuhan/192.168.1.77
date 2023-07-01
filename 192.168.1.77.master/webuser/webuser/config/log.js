// var winston = require('winston');
// var customLogger = new winston.Logger();
//
// // A console transport logging debug and above.
// customLogger.add(winston.transports.Console, {
//   level: 'debug',
//   colorize: true
// });
//
// // A file based transport logging only errors formatted as json.
// customLogger.add(winston.transports.File, {
//   level: 'error',
//   filename: 'filename.log',
//   json: true
// });
//
// module.exports.log = {
//   // Pass in our custom logger, and pass all log levels through.
//   custom: customLogger,
//   // level: 'verbose',
//
//   // Disable captain's log so it doesn't prefix or stringify our meta data.
//   // inspect: false


var local = require('./local');
/** Cach 1 ***************************/
var config = {
    file_options: {
        name: 'app-log',
        filename: './app.log',
        level: 'info',
        timestamp: true,
        colorize: true,
        handleExceptions: true,
        humanReadableUnhandledException: true,
        prettyPrint: true,
        json: true,
        maxsize: 512 * 1024
    },
    mail_options: {
        level: 'error',
        to: 'linhxuancb9596@gmail.com',
        from: local.username,
        subject: 'a',
        host: 'smtp.gmail.com',
        username: local.username,
        password: local.password
        // ssl: true,
        // prettyPrint: true,
    }
};




var winston = require('winston');
winston.transports.DailyRotateFile = require('winston-daily-rotate-file');
var Mail = require('winston-mail').Mail;
// require('winston-email');

//**************----add log to mongodb---- ***************************************************************/
// require('winston-mongodb').MongoDB
//

require('winston-logstash');

// winston.add(winston.transports.Logstash, {
//   port: 28777,
//   node_name: 'my node name',
//   host: '127.0.0.1'
// });
var logDir = 'log'; // directory path you want to set
var fs = require('fs');
if (!fs.existsSync(logDir)) {
    // Create the directory if it does not exist
    fs.mkdirSync(logDir);
}
const moment = require('moment');
const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS';
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.DailyRotateFile)({
            filename: './common.log',
            dirname: logDir,
            datePattern: 'yyyyMMdd.',
            prepend: true,
            level: process.env.ENV === 'development' ? 'debug' : 'debug',
            timestamp: () => {
                return moment().format(TIMESTAMP_FORMAT);
            },
            json: false
        }),
        new (winston.transports.DailyRotateFile)({
            filename: './errors.log',
            dirname: logDir,
            name: 'error-file',// đặt tên cho loại log vì có 2 log ra file , 
            datePattern: 'yyyyMMdd.',
            prepend: true,
            level: 'error', // loại log dc log ra file
            timestamp: () => {
                return moment().format(TIMESTAMP_FORMAT);
            },
            json: false
        })
    ]
});
// logger.add(winston.transports.Logstash, {
//     port: 28777,
//     node_name: 'FUNDSERV',
//     host: '127.0.0.1',
//     level: 'error',
//     json: false
// });
logger.add(winston.transports.Console, {
    level: 'silly',
    timestamp: () => {
        return moment().format(TIMESTAMP_FORMAT);
    },
    colorize: true
});

module.exports.log = {
    custom: logger,
    level: 'verbose',
    // Disable captain's log so it doesn't prefix or stringify our meta data.
    inspect: false // khong hien thi thoi gian xu ly dang ms giay trong log
};
