

/**
 * OutputInterface
 *
 * @description :: Server-side logic for managing Fronts.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers

 giang.ngo: khai bao cac template response tra ve cho client, 
        jsonAPIOutput: tra ve dinh dang chung EC, EM,DT
        errServer: tra ve response khi bat exception tren webserver
        success: tra ve response thanh cong
	
 */

module.exports = {
    jsonAPIOutput: function (errCode, errMsg, data) {
        return { "EC": errCode, "EM": errMsg, "DT": data };
    },
    expireSession:function(data){
        return  this.jsonAPIOutput(-1001,'Het phien lam viec',data);

    },
    errServer: function (err) {
        return this.jsonAPIOutput(-1000, 'Webserver gian doan', err);
    },
    success: function (data) {
        return this.jsonAPIOutput(0, 'Success', data);
    },
    getMsgErrDefs: function (errnum, msgerr, lang) {
        return new Promise((resolve) => {
        // if (errnum)
            ErrDefs.findOne({ ERRNUM: errnum }).exec(function(err, errdefs) {
                if (err) {
                    msgerr = "Lỗi thực hiện trên redis"
                    return msgerr;
                }
                try {
                    if (errdefs) {
                        switch (lang) {
                            case sails.config.lang_vie:
                                if(errdefs.ERRDESC)
                                    msgerr = errdefs.ERRDESC;
                                break;
                            case sails.config.lang_en:
                            if(errdefs.EN_ERRDESC)
                                msgerr = errdefs.EN_ERRDESC;
                                break;
                            case sails.config.lang_cn:
                            if(errdefs.CN_ERRDESC)
                                msgerr = errdefs.CN_ERRDESC;
                                break;
                            default:
                                break;
                        }
                    }
                } catch (error) {
                    console.log("getMsgErrDefs.error", error);
                }
                console.log("getMsgErrDefs", errnum, msgerr);
                if (!sails.config.ShowCodeError)
                {
                    //Always remove error code
                    if (msgerr.indexOf("]:") > 0)
                    {
                        msgerr = msgerr.substring(msgerr.indexOf("]:") + 2);//Skip 2 characters
                    }
                    else if (msgerr.indexOf(":") > 0)
                    {
                        msgerr = msgerr.substring(msgerr.indexOf(":") + 1);//Skip 1 character
                    }
                    else if (msgerr.indexOf("]") > 0)
                    {
                        msgerr = msgerr.substring(msgerr.indexOf("]") + 1);
                    }               
                }
                resolve(msgerr);
            })
        });
    }
}