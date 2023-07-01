var redux = require('redux');
var username = require('./username.js');
var dataMenu = require('./menu.js');

var language = require('./language.js');
var notification = require('./notification.js');
var authenticate = require('./authenticate.js');
var closeAccount = require('./closeAccount.js');
var addAccount = require('./addAccount.js');
var auth = require('./auth.js');
var datLenh = require('./datlenh.js');
var newcaptcha = require('./newcaptcha.js');
var systemdate= require('./systemdate.js')
 var reducer = redux.combineReducers ({dataMenu,language,notification,auth,closeAccount,addAccount,authenticate,datLenh,newcaptcha,systemdate});
 module.exports = reducer;
