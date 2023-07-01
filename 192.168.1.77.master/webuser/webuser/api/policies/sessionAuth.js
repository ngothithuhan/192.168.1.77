/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
var Ioutput = require('../common/OutputInterface.js')
 
module.exports = function (req, res, ok) {
  try {
    //sails.log("req.session test::::",req.session)
    //1. check session cua user
    if (!req.session || !req.session.user || !req.session.userinfo) {
      //if (!req.session || !req.session.sessionid) {
      sails.log.debug("sessionAuth::expireSession::url:", req.url);
      return res.send(Ioutput.expireSession({}));

    }
    // User is allowed, proceed to controller
    let { ROLECODE } = req.session.userinfo;
    let isvalidateAuth = AuthService.validateAuth(req)    

    if (!isvalidateAuth) {
      sails.log.warn("sessionAuth sessionAuth::::", req.session.user.username, "ROLECODE:", ROLECODE, "OBJNAME:", req.url, "isvalidateAuth:", isvalidateAuth, "\n\rbody", req.body);
      let rs = { EC: '-788898', EM: 'Not login or do not have permission to execute this function' }
      return res.send(rs);
    }
    return ok();
  } catch (error) {
    sails.log.error('Loi trong khi check session', error)
    return res.send(Ioutput.expireSession({
      displayMsg: false,
      msg: 'Session cua ban khong hop le'
    }));
  }
};
