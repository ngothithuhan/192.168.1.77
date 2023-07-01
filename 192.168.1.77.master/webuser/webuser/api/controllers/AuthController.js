
/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
//var request = require('request');
const util = require('util');
var path = require('path')
var LogHelper = require(path.resolve(__dirname, '../common/LogHelper.js'));
var Ouput = require('../common/OutputInterface');
module.exports = {
  'allow': async function (req, res) {
    sails.log.debug('allow.START', req.param('code'));
    try {
      await req.session.regenerate(function (err) {
        sails.log.debug('allow.session.regenerate', req.param('code'), 'err', err);
      })
      if (req.param('code')) {
        Oauth2.getToken(req.param('code'), async function (err, user, obj_tocken) {
          try {
            if (err) {
              sails.log.error('allow:. Oauth2.getToken', LogHelper.logReq(req), err);
              req.session.message_auth = 'Lỗi hệ thống auth'
              return res.redirect('/login');
            } else {
              sails.log.info('allow:. Oauth2.getToken.:user=', user, obj_tocken, LogHelper.logReq(req));
            }
            var obj = JSON.parse(user);
            var token = JSON.parse(obj_tocken);
            var sessionid = token.access_token;
            // req.session.sessionid = sessionid;
            var userflex = {
              username: obj.username, password: obj.hashedPassword,
              sessionid: sessionid //getCookie.getCookie(req.headers['cookie'], 'sessionid')
            };
            req.session.user = userflex;
            req.session.language = token.language;
            var token = await Token.create({
              sessionid: req.session.sessionid,//getCookie.getCookie(req.headers['cookie'], 'sessionid'),
              access_token: token.access_token, refresh_token: token.refresh_token, expires_in: token.expires_in, token_type: token.token_type
            });


            var userinfo = await Userinfo.find({ USERNAME: obj.username });

            sails.log.info('allow:. Userinfo.find userinfo', user, userinfo, LogHelper.logReq(req));
            if (!userinfo || userinfo.length == 0) {
              req.session.message_auth = 'Không tồn tại user trên bộ nhớ web'
              return res.redirect('/login');
            }

            let hasCheckISCFINFO = false;
            let arrCustodycd = [];
            userinfo.map(item => {
              arrCustodycd.push(item.UID)
            })

            // giang.ngo: do lỗi của sails 0.12.x nên khi USERNAME là dạng số sẽ không phân biệt được giá trị 0 ở đầu. Vd: 01234 và 123
            for (const useritem of userinfo) {
              if (useritem.USERNAME.toUpperCase() == obj.username.toUpperCase()) {
                // useritem.TLFULLNAME = obj.fullname
                //check thêm điều kiện chọn tài khoản của nhà đầu tư
                if (useritem.ISCFINFO === 'Y') {
                  hasCheckISCFINFO = true
                  useritem.arrCustodycd = arrCustodycd;
                  req.session.userinfo = useritem;
                  break;
                }
              }
            }

            // trong trường chưa có ISCFINFO === 'Y', sẽ lấy phần tử đầu tiên
            if (hasCheckISCFINFO === false) {
              for (const useritem of userinfo) {
                if (useritem.USERNAME.toUpperCase() == obj.username.toUpperCase()) {
                  useritem.arrCustodycd = arrCustodycd;
                  req.session.userinfo = useritem;
                  break;
                }
              }
            }

            var item = await Userfunc.find({ TLID: req.session.userinfo.TLID });
            if (item) req.session.Userfunc = item.map(obj => obj.OBJNAME);
            return res.redirect('/login');
          } catch (error) {
            sails.log.error('allow', LogHelper.logReq(req), error);
            req.session.message_auth = 'Hệ thống bị gián đoạn'
            return res.redirect('/login');
          }

        });
      }
      else {
        req.session.message_auth = 'Cấp quyền không thành công';
        return res.status(401).redirect('/login');
      }
    } catch (error) {
      sails.log.error('allow', LogHelper.logReq(req), error);
      req.session.message_auth = 'Hệ thống bị gián đoạn'
      return res.redirect('/login');
    }


  },

  changeDefaultCustodyCd: async function (req, res) {
    sails.log.info('changeDefaultCustodyCd.START', LogHelper.logReq(req));
    if (req.session.userinfo.ISCUSTOMER == 'Y') {
      var userinfo = await Userinfo.find({ USERNAME: req.session.user.username, USERID: req.body.P_CUSTODYCD.toUpperCase() });
      sails.log.info('changeDefaultCustodyCd:. Userinfo.find userinfo', req.session.user.username, userinfo, LogHelper.logReq(req));
      if (!userinfo || userinfo.length == 0) {
        res.send(Ouput.jsonAPIOutput(-1000, 'Tài khoản không tồn tại hoặc không có quyền truy cập'));
      }
      req.session.userinfo = userinfo[0];
    }

    return res.send(Ouput.success({ P_CUSTODYCD: req.session.userinfo.USERID }));
  },
  logout: async function (req, res) {
    // return res.redirect(sails.config.URL_LOGOUT);
    var logoutUrl = sails.config.SSO_URL;
    logoutUrl = logoutUrl.substring(0, logoutUrl.indexOf('/oauth/')) + '/oauth/logout';
    var sid = req.session.sessionid;//getCookie.getCookie(req.headers['cookie'], 'sessionid');
    sails.log.info('logout sessionid', sid, ' ==>redirect', logoutUrl);
    try {
      if (req.session.user)
        delete req.session.user
      await Token.destroy({ sessionid: sid });
      req.session.destroy()
      res.clearCookie(sails.config.session.key, { path: '/' });

    } catch (e) {
      sails.log.error('auth/logout: ', e);
    }
    return res.redirect(logoutUrl);
  },
  'flex': function (req, res) {
    return res.redirect(util.format(sails.config.SSO_URL, sails.config.SSO_CLIENTID, sails.config.URL_APP));
  },

  loginFlex: function (req, res) {
    if (!req.session) return res.json({ err: 'session: chưa đăng nhập' });
    let user = req.session.user;
    if (!user || !req.session.userinfo)
      return res.json({ err: 'bạn chưa đăng nhập' });
    sails.log.debug('loginFlex::::::::::::Loggedin', user.username, user.id);
    return res.json({
      user: req.session.userinfo,
      isconfirmlogin: 'N'
    });
  },

  index: function (req, res) {
    var email = req.param('email');
    var password = req.param('password');

    if (!email || !password) {
      return res.json(401, { err: 'email and password required' });
    }

    Users.findOne({ email: email }, function (err, user) {
      if (!user) {
        return res.json(401, { err: 'invalid email or password' });
      }

      Users.comparePassword(password, user, function (err, valid) {
        if (err) {
          return res.json(403, { err: 'forbidden' });
        }

        if (!valid) {
          return res.json(401, { err: 'invalid email or password' });
        } else {

          res.json({
            user: user,
            token: jwToken.issue({ id: user.id, username: user.email })
          });
        }
      });
    })
  }
};
