var Ioutput = require('../common/OutputInterface.js')
var arryCustodycd = ["custodycd", "p_custodycd", "CUSTODYCD", "pv_custodycd", "P_CUSTODYCD", "PV_CUSTODYCD"]
var arryTlid = ["tlid", "p_tlid", "TLID", "pv_tlid", , "P_TLID", "PV_TLID"]
function getCustodycd(Obj) {
    let v_return = undefined;
    for (let i = 0; i < arryCustodycd.length; i++) {
        if (Obj.hasOwnProperty(arryCustodycd[i])) {
            v_return = Obj[arryCustodycd[i]]
            break
        }
    }
    return v_return;
}
function getTLID(Obj) {
    let v_return = undefined;
    for (let i = 0; i < arryTlid.length; i++) {
        if (Obj.hasOwnProperty(arryTlid[i])) {
            v_return = Obj[arryTlid[i]]
            break
        }
    }
    return v_return;
}
module.exports = async function (req, res, ok) {
    try {
        // User is allowed, proceed to controller
        if (req.session && req.session.user && req.session.userinfo) {
            let pv_CUSTODYCD = undefined
            let pv_TLID = undefined
            if (req.body) {
                pv_CUSTODYCD = getCustodycd(req.body)
                pv_TLID = getTLID(req.body)
            }
            else {
                pv_CUSTODYCD = req.session.userinfo.USERID
                pv_TLID = req.session.userinfo.TLID
            }
            //let { USERID, TLID } = req.body ? req.body : req.session.userinfo;
            let { ISCUSTOMER, ROLECODE } = req.session.userinfo;
            let account = ISCUSTOMER == "Y" ? pv_CUSTODYCD : pv_TLID;
            let isvalidateAuth = await AuthService.validateAuth(req, account, req.url)
            if (!isvalidateAuth) {
                sails.log.warn("sessionAuth custauth::::", req.session.user.username, "account:", account, "ROLECODE:", ROLECODE, "OBJNAME:", req.url, "isvalidateAuth:", isvalidateAuth, "\n\rbody", req.body);
                let rs = { EC: '-788898', EM: 'Not login or do not have permission to execute this function' }
                return res.send(rs);
            }
            return ok();
        }
        // User is not allowed
        else {
            sails.log.info('custAuth::::Annonymous user......', req.url, req.body)
            // Overwrite something here
            if (req.url == "/account/finishgeneralinfo") {
                let { access } = req.body;
                if (access !== "add") {
                    let rs = { EC: '-788898', EM: 'Not login or do not have permission to execute this function' }
                    return res.send(rs);
                }
                await AuthService.checkAccountCreateAccount(req)
            }
            else if(req.url == "/account/activeopt"){
                let { OBJNAME } = req.body;
                if (OBJNAME == "MANAGERACCT" || OBJNAME == "MANAGERACCTEX") {
                    let rs = { EC: '-788898', EM: 'Not login or do not have permission to execute this function' }
                    return res.send(rs);
                }
            }
            return ok();
        }
    } catch (error) {
        sails.log.error('Loi trong khi check session', error)
        return res.send(Ioutput.expireSession({
            displayMsg: false,
            msg: 'Session cua ban khong hop le'
        }));
    }
};
