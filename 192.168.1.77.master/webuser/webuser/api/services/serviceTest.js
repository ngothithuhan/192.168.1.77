var request = require('request');
var urlHost = sails.config.URL_PROCESSING;
var path = require('path');
var LogHelper = require(path.resolve(__dirname, '../common/LogHelper'));
module.exports = {



  getToken: function (code, done) {

    request({
      url: sails.config.URL_RESOURCE + 'oauth/token',
      method: 'POST',

      form: {
        client_id: sails.config.SSO_CLIENTID,
        client_secret: sails.config.SSO_CLIENTSECRET,
        grant_type: sails.config.SSO_CLIENTGRANTTYPE,
        redirect_uri: sails.config.URL_APP + 'auth/allow',
        code: code
      }
    }, function (resCode, res) {
      // sails.log.debug('getToken.:Result', res ? res.body : null);
      var json = JSON.parse(res.body);
      if (resCode) {
        done('resCode', null);
      }
      Oauth2.getInfo(json.access_token, function (err, user) {
        done(null, user, res.body);
      });
    });
  },
  requsetResrc: function (access_token, urlApi, body, method, done) {

    if (method == 'POST') {
      Oauth2.requsetPost(access_token, body, urlApi, function (err, rs) {
        try {
          JSON.parse(rs);
          done(null, rs);
        } catch (e) {
          //  sails.log.error("requsetResrc.:requsetPost.:not JSON.:"+rs, e);
          done('Error', null);
        }
      })
    }
    else {
      Oauth2.requsetPost(access_token, body, urlApi, function (err, rs) {
        done(null, rs);
      })
    }
  },
  pipeRequest: function (body, res) {
    body.url = urlHost + body.action;
    request(body).pipe(res);
  },
  requsetPost: function (body, urlApi, done) {
    var start = process.hrtime();
    request({
      url: urlHost + urlApi,
      method: 'POST',

      json: body

    }, function (err, res) {
      let end = LogHelper.getDuration(process.hrtime(start));
      sails.log.info(LogHelper.End("requsetPost.:", urlApi, "Duration:", end, "body", body,"res",res))
      if (err) {
        sails.log('err', err);
      }
      try {
        if (res.body.EC > 0)
          done(null, res.body);
        else {
          done(null, res.body);
        }
      } catch (error) {
        done(null, error)
      }

    });
  },
  requesetGet: function (access_token, urlApi) {
    request.get(sails.config.URL_RESOURCE + urlApi, {
      'auth': {
        'bearer': access_token
      }
    }, function (err, res) {
      if (res.body)
        done(null, res.body);
      else {
        sails.log.error('requesetGet.:Error', err);
        done('Error', res);
      }
    });
  },
  getInfo: function (access_token, done) {
    request.get(sails.config.URL_RESOURCE + 'api/info', {
      'auth': {
        'bearer': access_token
      }
    }, function (err, res) {
      if (res.body)
        done(null, res.body);
      else {
        sails.log.error('getInfo.:Error', err);
        done('Error', res);
      }
    });
  }
}

