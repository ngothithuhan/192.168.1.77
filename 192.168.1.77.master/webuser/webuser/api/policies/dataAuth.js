module.exports = async function (req, res, ok) {
    try {
        sails.log.info('dataAuth::::begin......', req.url, req.header, req.body)
        let { username, password } = req.headers;
        if (username == sails.config.VFMuser && password == sails.config.VFMpass) {
            return ok();
        }
        sails.log.warn("dataAuth:::: sai thong tin", req.url, req.header, req.body);
        let rs = { EC: '-788899', EM: 'Authenticate Fail' }
        return res.send(rs);
    } catch (error) {
        sails.log.error('Loi trong khi check session', error)
        return res.send(Ioutput.expireSession({
            displayMsg: false,
            msg: 'Loi trong khi check'
        }));
    }
};