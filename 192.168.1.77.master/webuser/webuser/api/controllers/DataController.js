module.exports = {
    createAccount:function (req, res) {
        let {strinputGeneralInfoMain,SIGN_IMG,OWNLICENSE_IMG,OWNLICENSE2_IMG,OWNLICENSE3_IMG,OWNLICENSE4_IMG,strinputGeneralInfoAuth,IDSCAN,IDSCAN2,AUTHSCAN,strinputGeneralInfoContact,strinputGeneralInfoFatca,language}=req.body
        try {
            let rest = {
                p_custid: { dir: 3003, type: 2001 },
                p_custodycd: { dir: 3003, type: 2001 },
                p_cfmast: strinputGeneralInfoMain,
                p_sign_img: SIGN_IMG,
                p_ownlicense_img: OWNLICENSE_IMG,
                p_ownlicense2_img: OWNLICENSE2_IMG,
                p_ownlicense3_img: OWNLICENSE3_IMG,
                p_ownlicense4_img: OWNLICENSE4_IMG,
                p_cfauth: strinputGeneralInfoAuth,
                p_idscan: IDSCAN,
                p_idscan2: IDSCAN2,
                p_authscan: AUTHSCAN,
                p_cfcontact: strinputGeneralInfoContact,
                p_fatca: strinputGeneralInfoFatca,
                p_isotp: 'Y',
                pv_tlid: sails.config.OBJNAMEDEFAULT,
                pv_role: "AMC",
                pv_action: "ADD",
                pv_language: language,
                pv_objname: "MANAGERACCT",
                p_err_field: { dir: 3003, type: 2001 }
            }
            
            let obj =
            {
                "funckey": "prc_mt_cfmast",
                bindvar: rest
            }
            processingserver.callAPI(obj, function (err, rs) {

                if (err) {
                    return res.send(Utils.removeException(err));
                }
                try {
                    if (rs.EC == 0) {

                        return res.send(rs);
                    } else {
                        return res.send(rs);
                    }
                } catch (error) {
                    rs.EM = 'Lỗi client gọi api';
                    rs.EC = -1000;
                    return res.send(rs)
                }
            });
        } catch (error) {
            sails.log.error(error);
            return res.send(Ioutput.errServer(error));
        }
    }
}