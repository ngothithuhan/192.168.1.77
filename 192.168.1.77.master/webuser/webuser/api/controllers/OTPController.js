



/**
 * DefErrorOnlineController
 *
 * @description :: Server-side logic for DefErrorOnlineController
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var processingserver = require('../commonwebuser/ProcessingServer')
var commonUtil = require('../common/CommonUtil');
var RestfulHandler = require('../common/RestfulHandler')
// var SessionManager = require('../commonwebuser/SessionManager.js')
var Ioutput = require('../common/OutputInterface.js');
var moment = require('moment');

module.exports = {
    CheckOTP: function (req, res) {
        try {
            let { body } = req;
            let { p_objname } = body;

            let data = commonUtil.convertPropsNullToEmpty(body);
            if (req.session.userinfo)
                data = RestfulHandler.addSessionInfo(data, req);
            else {
                data.TLID = null
                data.ROLE = null
            }
            //new appmode la CB va config ischeckotp la false thi lun tra ve true, 
            //truong hop FA thi van di tiep co config ko check duoi db
            //da co config check OTP duoi sysvar varname='OTPCHECK' 

            // if (!sails.config.isCheckOTP && APPMODE == sails.config.BPS_CB && p_objname == 'LOGIN') {
            //     if (AuthType) {

            //         req.session.authtype = AuthType
            //         req.session.isconfirmlogin = 'Y'
            //         SessionManager.add(req.session.user.username)
            //     }
            //     req.session.timeoutGenOTP = null;
            //     return res.send({ EC: 0 });
            // }
            // if (APPMODE == sails.config.BPS_CB && p_objname == 'IMP') {
            //  data.TLID = sails.config.TLIDOnlineCB;
            data.TLID = data.TLID
            //}
            let obj =
            {
                "funckey": "pr_verify_totp",
                bindvar: data
            }
            sails.log.info('CheckOTP.:[BEGIN].:data=', data);
            processingserver.callAPI(obj, function (err, rs) {
                if (err) {
                    return res.send(err);
                }
                if (rs && rs.EC == 0) {
                    req.session.timeoutGenOTP = null;
                    if (AuthType) {
                        req.session.authtype = AuthType
                        req.session.isconfirmlogin = 'Y'
                        req.session.countfail = 0
                        // SessionManager.add(req.session.user.username)
                    }
                }
                else {
                    if (req.session.countfail)
                        req.session.countfail += 1
                    else
                        req.session.countfail = 1
                }
                return res.send({ ...rs, count: req.session.countfail });
            });
        } catch (error) {
            sails.log.error('CheckOTP.:[CATCH].:Error=', err);
        }
    },
    genOTP: function (req, res) {
        try {
            let { body } = req;
            let data = commonUtil.convertPropsNullToEmpty(body);
            //begin check spam OTP
            if (req.session.userinfo) {
                data = RestfulHandler.addSessionInfo(data, req);
            }
            var now = moment().format("DD/MM/YYYY HH:mm:ss");
            var currentTimeout = req.session.timeoutGenOTP ? req.session.timeoutGenOTP : moment(now, "DD/MM/YYYY HH:mm:ss").subtract(60, 'seconds').format("DD/MM/YYYY HH:mm:ss")
            var resultMinutes = moment.utc(moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(currentTimeout, "DD/MM/YYYY HH:mm:ss"))).format("mm")
            var resultSecond = moment.utc(moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(currentTimeout, "DD/MM/YYYY HH:mm:ss"))).format("ss")
            result = parseInt(resultMinutes) * 60 + parseInt(resultSecond)
            if (result < 60) {
                return res.send(Ioutput.errSpamGenOTP());
            }

            //end check spam OTP
            data.p_isauto = 'N'
            let obj =
            {
                "funckey": "pr_generate_otp",
                bindvar: data
            }
            sails.log.info('genOTP.:[BEGIN].:data=', data);
            processingserver.callAPI(obj, function (err, rs) {
                if (err) {
                    return res.send(err);
                }
                req.session.timeoutGenOTP = now;
                return res.send(rs);


            });
        } catch (error) {
            sails.log.error('genOTP.:[CATCH].:Error=', error);
        }
    },

    //     gọi hàm fn_get_sysvar(p_grname,p_varname), truyền p_grname = 'SYSTEM' p_varname = 'OPTTIME'
    // để lấy ra thời gian hết hạn OTP
    getTimeOTP: function (req, res) {
        try {
            let { body } = req;
            // if (req.session.userinfo) {
            //     data = RestfulHandler.addSessionInfo(data, req);
            // }

            let data = {
                p_grname: 'SYSTEM',
                p_varname: 'OPTTIME'
            }

            let obj =
            {
                "funckey": "fn_get_sysvar",
                bindvar: data
            }

            processingserver.callAPI(obj, function (err, rs) {
                if (err) {
                    return res.send(err);
                }
                return res.send(rs);
            });
        } catch (error) {
            sails.log.error('getTimeOTP.:[CATCH].:Error=', error);
        }
    },

    //generate OTP khi mở/sửa tài khoản nhà đầu tư
    getUpsertAccOTP: function (req, res) {
        try {
            let { body } = req;
            //     p_object là 'OPENCF' nếu là mở or 'EDITCF' nếu là sửa
            //     p_keyval truyền CMND
            //     p_custodycd truyền custodycd vào nếu là sửa . nếu là Mở thì truyền số điện thoại
            //     p_symbol truyền ''
            //     p_strdata truyền ''
            //     p_values truyền 0
            //     pv_language truyền 'vie'
            //     sau khi gọi hàm lấy được p_keyotp

            let data = {
                p_object: body.OBJECT,
                p_keyval: body.IDCODE ? body.IDCODE : '',
                p_custodycd: body.CUSTODYCD ? body.CUSTODYCD : '',
                p_symbol: '',
                p_strdata: '',
                p_values: 0,
                pv_language: 'vie',
                p_keyotp: { dir: 3003, type: 2001 },
            }

            let obj =
            {
                "funckey": "pr_sendotp",
                bindvar: data
            }

            processingserver.callAPI(obj, function (err, rs) {
                if (err) {
                    return res.send(err);
                }
                return res.send(rs);
            });
        } catch (error) {
            sails.log.error('getUpsertAccOTP.:[CATCH].:Error=', error);
        }
    },

    //check OTP khi mở/sửa tài khoản nhà đầu tư
    checkUpsertAccOTP: function (req, res) {
        try {
            let { body } = req;
            //     p_keyotp,
            //     p_otpval,
            //     inout p_code_check,
            //     inout p_err_code,
            //     INOUT p_err_param
            //     )
            //     trong đó p_keyotp truyền p_keyotp lấy được ở bước 1.
            //     p_otpval truyền mã OTP người dùng nhập

            //     xử lý: khi p_code_check và p_err_code đều = 0 thì mới thành công bước check otp
            //     nếu 1 trong 2 trường trên khác 0 thì thông báo lỗi
            let data = {
                p_keyotp: body.KEYOTP ? body.KEYOTP : '',
                p_otpval: body.OTPVAL ? body.OTPVAL : '',
                p_code_check: { dir: 3003, type: 2001 },
            }

            let obj =
            {
                "funckey": "pr_system_otpcheck",
                bindvar: data
            }

            processingserver.callAPI(obj, function (err, rs) {
                if (err) {
                    return res.send(err);
                }
                return res.send(rs);
            });
        } catch (error) {
            sails.log.error('getUpsertAccOTP.:[CATCH].:Error=', error);
        }
    },
};

