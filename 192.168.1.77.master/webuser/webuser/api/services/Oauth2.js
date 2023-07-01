var request = require('request');
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
      try {
        sails.log.info('getToken.:Response', 'body', res ? res.body : 'NULL res')
        // sails.log.debug('getToken.:Result', res ? res.body : null);
        var json = JSON.parse(res.body);
        if (resCode) {
          done('resCode', null);
        }
        // done(null,res.body,res.body)
        Oauth2.getInfo(json.access_token, function (err, user) {
          sails.log.info('getToken.:user', user)
          done(null, user, res.body);
        });
      } catch (error) {
        sails.log.error('getToken.:', error)
        done(error, null, null);
      }

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
  requsetPost: function (access_token, body, urlApi, done) {
    request({
      url: sails.config.URL_RESOURCE + urlApi,
      method: 'POST',

      form: body,
      'auth': {
        'bearer': access_token
      }
    }, function (err, res) {
      if (err) {
        sails.log('err', err);
      }
      console.log(res.body);
      done(null, res.body);
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
      if (res && res.body)
        done(null, res.body);
      else {
        sails.log.error('getInfo.:Error', err, 'res', res);
        done('Error', res);
      }
    });
  }
}
