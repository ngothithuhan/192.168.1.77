/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var path = require('path')
var processingserver = require('../commonwebuser/ProcessingServer');
var RestfulHandler = require('../common/RestfulHandler');
var Ioutput = require(path.resolve(__dirname, '../common/OutputInterface.js'));
var moment = require('moment');

function genArrayInsert(req, CMDID, FILECODE, rows, FILEID, TABLENAME, OBJNAME) {
    //sails.log.info('FileController.genArrayInsert.CMDID', CMDID, 'FILECODE', FILECODE, 'rows', rows);

    return new Promise((resolve, reject) => {

        try {

            var tableName = TABLENAME;
            //giang.ngo lay danh sach cac cot     
            let { TLID, ROLECODE, MBCODE } = req.session.userinfo;
            let fileMapBody = {
                p_filecode: FILECODE,
                p_tablename: TABLENAME,
                // p_language: data.language,
                p_objname: OBJNAME,
                p_role: ROLECODE,
                p_tlid: TLID,
                p_refcursor: { dir: 3003, type: 2004 },


            }

            let obj = {
                "funckey": "prc_filemap",
                bindvar: fileMapBody
            }
            processingserver.callAPI(obj, function (err, rs) {
                
                if (err) {
                    sails.log.error('FileController.genArrayInsert', err);
                    resolve([]);
                }
                if (rs.EC == 0) {

                    rs.DT = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    if (rs.DT && rs.DT.length > 0) {

                        var cols = [];
                        var fileCols = [];
                        var dataTypes = [];
                        rs.DT.map((item) => {
                            cols.push(item.TBLROWNAME);
                            fileCols.push(item.FILEROWNAME)
                            dataTypes.push(item.TBLROWTYPE);
                        });

                        var sttArr = {sqlCmd:[],sqlValues:[]};

                        rows.map((item) => {
                            item.FILEID = FILEID;
                            var colNames = '';
                            var colValues = '';
                            var sqlColValues = {};
                            for (var index in cols) {
                                var col = cols[index];
                                var fileCol = fileCols[index];
                                colNames += (col + ',');
                                if (dataTypes[index] == 'N') {
                                    var number = '';
                                    if (!item[fileCol]) {
                                        number = '0';
                                    } else {
                                        if (item[fileCol].toString().trim().length == 0) number = '0';
                                        else {
                                            //  number = item[fileCol].split(",").join("");
                                            number = item[fileCol]
                                            number = parseFloat(number)
                                        }
                                    }
                                    colValues += (':' + fileCol + ',');
                                    sqlColValues[fileCol] = number;
                                    sails.log('debug call processing server get data insert ==> fileCol 1 : ', fileCol)
                                    sails.log('debug call processing server get data insert ==> sqlColValues 1 : ', sqlColValues)
                                } else if (dataTypes[index] == 'D') {
                                    try {
                                        item[fileCol] = item[fileCol].replace(/'/g, "");
                                    } catch (error) {
                                        item[fileCol] = item[fileCol]
                                    }
                                    var result1 = moment(item[fileCol], 'DD-MM-YYYY', true).isValid();
                                    if (result1) {
                                        var value = moment(item[fileCol], "DD/MM/YYYY").format('DD/MM/YYYY')
                                        colValues += (':' + fileCol + ',');
                                        sqlColValues[fileCol] = value;
                                        sails.log('debug call processing server get data insert ==> sqlColValues 2 : ', sqlColValues)
                                    }
                                    else {
                                        var value = item[fileCol] ? item[fileCol] : ''
                                        colValues += (':' + fileCol + ',');
                                        sqlColValues[fileCol] = value;
                                        sails.log('debug call processing server get data insert ==> sqlColValues 3 : ', sqlColValues)
                                    }

                                }
                                else {
                                    //  if (arrSpec.includes(fileCol) == false) {

                                    var value = item[fileCol] ? item[fileCol] : null
                                    try {
                                        value = value.replace(/'/g, "");
                                    } catch (error) {
                                        value = value
                                    }



                                    //  } else var value = item[fileCol] ? parseFloat(item[fileCol]) : ''
                                    colValues += (':' + fileCol + ',');
                                    sqlColValues[fileCol] = value;
                                    sails.log('debug call processing server get data insert ==> sqlColValues 4 : ', sqlColValues)
                                }
                            }
                            
                            colNames = colNames.substring(0, colNames.length - 1);
                            
                            
                            // colValues = colValues.substring(0, colValues.length - 1);
                            colNames += ',MBID';
                            colNames += ',FILEID';
                            colValues += (':MBCODE,');
                            colValues += (':FILEID');
                            sqlColValues['MBCODE'] = MBCODE;
                            sqlColValues['FILEID'] = FILEID;
                            //'insert into ' +
                            var sttIns = tableName + ' (' + colNames + ')  values (' + colValues + ')';
                            // sttArr.push({ sqlCmd: sttIns, sqlValues: sqlColValues });
                            sttArr.sqlCmd.push(sttIns);
                            sttArr.sqlValues.push(sqlColValues);
                        });
                        sails.log.debug('FileController.genArrayInsert', sttArr);
                        if (sttArr.length<=0){
                            sails.log.error('FileController.genArrayInsert PRC_FILEMAP now row', rs);
                        }
                        resolve(sttArr);
                    } else {
                        //filemap chua dc khai
                        sails.log.error('FileController.genArrayInsert PRC_FILEMAP', rs);
                        resolve(null);
                    }
                } else {
                    sails.log.error('FileController.genArrayInsert.call PRC_FILEMAP.:Error EC', rs);
                    resolve(null);
                }
            });



        } catch (error) {
            // sails.log.error('FileController.genArrayInsert', error);
            resolve(null);
        }
    });
}
module.exports = {
    // upload: function (req, res) {
    //     req.file('file').upload({
    //         // don't allow the total upload size to exceed ~100MB
    //         maxBytes: 100000000,
    //         // set the directory
    //         dirname: '../../assets/images'
    //     }, function (err, uploadedFile) {
    //         // if error negotiate
    //         if (err) return res.negotiate(err);
    //         // logging the filename
    //         console.log(uploadedFile.filename);
    //         // send ok response
    //         return res.ok();
    //     });



    // },
    get_detail_upload: function (req, res) {
        let data = req.body;
        data = RestfulHandler.addSessionInfo(data, req);
        data.ret = { dir: 3003, type: 2004 };

        let obj =
        {
            "funckey": "FOPKS_CF.PRC_GET_CFSIGN_BY_AUTOID",

            bindvar: data


        }

        processingserver.callAPI(obj, function (err, rs) {

            // get text của mã lỗi 
            if (err) { }
            try {
                if (rs.EC == 0) {

                    ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {
                        if (err) {
                            rs.EM = "Lỗi thực hiện trên redis"
                            return res.send(rs)
                        }
                        if (errdefs)
                            rs.EM = rs.EM + '-- ' + errdefs.ERRDESC
                        // let result = await convert_to_Object(r.DT.ret);
                        //  rs.DT.data = result
                        // console.log("rs...", rs)
                        return res.send(rs);
                    })

                }
                else {
                    res.DT = [];
                    return res.send(rs)

                }

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    upload: function (req, res) {
        let data = req.body;
        data = RestfulHandler.addSessionInfo(data, req);

        let obj =
        {
            "funckey": "FOPKS_CF.PRC_CFSIGN",

            bindvar: data


        }

        processingserver.callAPI(obj, function (err, rs) {

            // get text của mã lỗi 
            if (err) { }
            try {
                if (rs.EC == 0) {

                    ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {
                        if (err) {
                            rs.EM = "Lỗi thực hiện trên redis"
                            return res.send(rs)
                        }
                        if (errdefs)
                            rs.EM = errdefs.ERRDESC
                        // let result = await convert_to_Object(r.DT.ret);
                        //  rs.DT.data = result
                        // console.log("rs...", rs)
                        return res.send(rs);
                    })

                }
                else {
                    res.DT = [];
                    return res.send(rs)

                }

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getlist_upload: function (req, res) {
        let data = {}
        data.CUSTID = req.body.CUSTID;
        // let data = Orders.newInstance(body);
        data.TLID = req.session.userinfo.TLID
        data.REFlOGID = ''
        data.ROLE = req.session.userinfo.ROLECODE
        data.ret = { dir: 3003, type: 2004 };
        //  data = commonUtil.convertPropsNullToEmpty(data);

        let obj =
        {
            "funckey": "FOPKS_CF.PRC_GET_CFSIGN_BY_CUSTID",

            bindvar: data


        }

        processingserver.callAPI(obj, function (err, rs) {

            // get text của mã lỗi 
            if (err) { }
            try {
                if (rs.EC == 0) {

                    ErrDefs.findOne({ ERRNUM: rs.EC }).exec((err, errdefs) => {
                        if (err) {
                            rs.EM = "Lỗi thực hiện trên redis"
                            return res.send(rs)
                        }
                        if (errdefs)
                            rs.EM = errdefs.ERRDESC
                        // let result = await convert_to_Object(r.DT.ret);
                        //  rs.DT.data = result
                        // console.log("rs...", rs)
                        return res.send(rs);
                    })

                }
                else {
                    res.DT = [];
                    return res.send(rs)

                }

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    check_fileImport: function (req, res) {
        let data = req.body;
        // data = RestfulHandler.addSessionInfo(data, req);
        // data.ret = { dir: 3003, type: 2004 };
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_filecode: data.FILECODE,
            p_tablename: '',
            p_language: data.language,
            p_objname: data.OBJNAME,
            p_role: ROLECODE,
            p_tlid: req.session.userinfo.TLID,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj = {
            "funckey": "prc_filemap",
            bindvar: rest


        }
        let language = rest.p_language
        processingserver.callAPI(obj, async function (err, rs) {
            if (rs.EC == 0) {
                let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                delete rs.DT["p_refcursor"];
                rs.DT.data = result;
                rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);
            } else {
                return res.send(rs)
            }

        });
    },
    after_check_upload: function (req, res) {
        let data = req.body;
        // data = RestfulHandler.addSessionInfo(data, req);
        // data.ret = { dir: 3003, type: 2004 };
        let { TLID, ROLECODE } = req.session.userinfo;
        sails.log('after check upload TLID parameter : ', TLID)
        let rest = {
            p_filecode: data.FILECODE,
            p_role: ROLECODE,
            p_tlid: TLID,
            p_objname: data.OBJNAME,
            p_fileid: data.p_fileid

        }

        let obj = {
            "funckey": "prc_file_after_check",

            bindvar: rest


        }

        processingserver.callAPI(obj, function (err, rs) {

            if (rs.EC == 0) {
                // rs.DT = ConvertData.convert_to_Object(rs.DT.ret);
                return res.send(rs);
            } else {
                return res.send(rs)
            }

        });
    },
    pre_check_upload: function (req, res) {
        let data = req.body;
        //data = RestfulHandler.addSessionInfo(data, req);
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_filecode: data.FILECODE,
            p_role: ROLECODE,
            p_tlid: TLID,
            p_objname: data.OBJNAME,
            // p_fileid: { dir: 3003, type: 2004 },

        }
        let obj = {
            "funckey": "prc_file_pre_check",
            bindvar: rest
        }
        let language = 'vie'
        processingserver.callAPI(obj, async function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {

                //  let result = ConvertData.convert_to_Object(rs.DT.p_fileid);
                //  delete rs.DT["p_fileid"];
                //   rs.DT.data = result;
                // rs.EM = await Ioutput.getMsgErrDefs(rs.EC, rs.EM, language);
                return res.send(rs);

            } catch (error) {
                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    getImportData: function (req, res) {
        let data = req.body;
        // data = RestfulHandler.addSessionInfo(data, req);
        // data.ret = { dir: 3003, type: 2004 };
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_filecode: data.FILECODE,
            p_role: ROLECODE,
            p_tlid: TLID,
            p_objname: data.OBJNAME,
            p_fileid: data.p_fileid,
            p_refcursor: { dir: 3003, type: 2004 }

        }
        let obj = {
            "funckey": "prc_file_getimportdata",
            bindvar: rest
        }

        processingserver.callAPI(obj, function (err, rs) {
            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    delete rs.DT["p_refcursor"];
                    rs.DT.data = result;
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
    },

    getFileMaster: function (req, res) {
        let data = req.body;
        let result1 = {}
        let { TLID, ROLECODE } = req.session.userinfo;
        let rest = {
            p_cmdid: data.CMDID,
            p_objname: data.OBJNAME,
            p_role: ROLECODE,
            p_tlid: TLID,
            p_language: data.LANGUAGE,
            p_refcursor: { dir: 3003, type: 2004 },

        }

        let obj =
        {
            "funckey": "prc_filemaster",
            bindvar: rest
        }

        processingserver.callAPI(obj, function (err, rs) {

            if (err) {
                return res.send(Utils.removeException(err));
            }
            try {
                console.log("binh:::::::::::::::::::",rs.EC)
                if (rs.EC == 0) {
                    let result = ConvertData.convert_to_Object(rs.DT.p_refcursor);
                    delete rs.DT["p_refcursor"];
                    rs.DT.data = result;
                    for (let i = 0; i < data.AllKeyLang.length; i++) {
                        result1["result" + data.AllKeyLang[i]] = result.map((item) => {
                            return {
                                value: item.FILECODE,
                                label: item['FILENAME_' + data.AllKeyLang[i].toUpperCase()],
                                type: item.EORI
                            }
                        })
                    }
                    return res.send(result1);
                } else {
                    return res.send(rs);
                }
            } catch (error) {

                rs.EM = 'Lỗi client gọi api';
                rs.EC = -1000;
                return res.send(rs)
            }
        });
    },
    /*
    uploadTest: function (req, res) {

        //sails.log.info('req.headers', req.headers);
        let file = req.file('file');

        var FILECODE = req.headers.filecode;
        var CMDID = req.headers.cmdid;
        var FILEID = req.headers.fileid;
        var TABLENAME = req.headers.tablename;
        var OBJNAME = req.headers.objname;


        //  const wb = XLSX.read(bstr, { type: 'binary' , cellDates:true, cellNF: false, cellText:false});
        // var data = XLSX.utils.sheet_to_json(ws, { header: 1,dateNF:"DD/MM/YYYY" });

        req.file('file').upload({

            maxBytes: 100000000,
            // set the directory
            dirname: '../../assets/images'
        }, async function (err, uploadedFile) {

            if (err) return res.negotiate(err);

            var workbook = XLSX.readFile(uploadedFile[0].fd, { type: 'binary', cellDates: true, cellNF: false, cellText: false, raw: true });
           
            var sheet_name_list = workbook.SheetNames;

            var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { dateNF: "DD/MM/YYYY", raw: true });
            console.log('xlData', xlData);
            fs.unlinkSync(uploadedFile[0].fd);
            var sttInses = await genArrayInsert(req, CMDID, FILECODE, xlData, FILEID, TABLENAME, OBJNAME);

            if (sttInses) {
                processingserver.callAPIWithUrl('front/execArrSttm', {
                    funckey: sttInses
                }, function (err, rs) {

                    if (err) {
                        sails.log.error('FileController.uploadTest', err);
                        res.send(Ioutput.errServer(error));
                    }

                    return res.send(rs);
                });
            } else {
                res.send(Ioutput.errServer({ detail: 'Khong gen duoc mang insert' }));
            }

        });
    },*/
        uploadTest: async function (req, res) {
        let data = req.body;
        var FILECODE = data.FILECODE;
        var CMDID = data.CMDID;
        var FILEID = data.FILEID;
        var TABLENAME = data.TABLENAME;
        var OBJNAME = data.OBJNAME;
        var DATAFILE = data.DATAFILE;
        var sttInses = await genArrayInsert(req, CMDID, FILECODE, DATAFILE, FILEID, TABLENAME, OBJNAME);
        sails.log.info('Minh_test connection webusser sttInses',sttInses)
        if (sttInses) {
            sails.log.info('Minh_test connection webusser sttInses',sttInses)
            processingserver.callAPIWithUrl('front/execArrSttm', {
                funckey: sttInses.sqlCmd,
                bindvar: sttInses.sqlValues
            }, function (err, rs) {
                if (err) {
                    sails.log.error('FileController.uploadTest', err);
                    res.send(Ioutput.errServer(error));
                }else{
                    sails.log.info('Minh_test connection webusser rll',rs);
                }
                
                return res.send(rs);
            });
        } else {
            res.send(Ioutput.errServer({ detail: 'Khong gen duoc mang insert' }));
        }
    },
};

